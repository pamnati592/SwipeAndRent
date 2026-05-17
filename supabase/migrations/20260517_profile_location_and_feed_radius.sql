-- Adds geographic location to profiles and extends get_feed with a radius filter.
--
-- Three changes:
--   1. profiles.location (PostGIS geography point) — set when the user picks
--      a city from Google Places. Used as fallback origin for the feed when
--      the device has no live GPS fix (permission denied / not yet resolved).
--   2. Spatial GiST index on profiles.location — keeps ST_DWithin cheap once
--      the table grows.
--   3. get_feed gains p_radius_km. When set, only items within that radius
--      from the resolved origin are returned. Items without coordinates are
--      excluded when a radius is active (they cannot prove proximity), but
--      kept when no radius is set so legacy uploads remain discoverable.

-- ── 1. profiles.location ────────────────────────────────────────────
alter table public.profiles
  add column if not exists location geography(Point, 4326);

create index if not exists profiles_location_gix
  on public.profiles using gist (location);

-- ── 2. New get_feed signature ──────────────────────────────────────
-- Must drop first: PostgreSQL treats added optional params as a new overload,
-- which would clash with the existing 2-arg version.
drop function if exists public.get_feed(double precision, double precision);

create or replace function public.get_feed(
  p_lat       double precision default null,
  p_lng       double precision default null,
  p_radius_km double precision default null
)
returns table (
  id              uuid,
  owner_id        uuid,
  title           text,
  description     text,
  daily_price     numeric,
  sale_price      numeric,
  category        text,
  city            text,
  photos          text[],
  distance_meters double precision
)
language plpgsql
stable
as $$
declare
  v_origin geography;
begin
  -- Origin precedence: explicit device coords > caller's profile.location > none.
  if p_lat is not null and p_lng is not null then
    v_origin := st_makepoint(p_lng, p_lat)::geography;
  elsif auth.uid() is not null then
    select location into v_origin
    from public.profiles
    where id = auth.uid();
  end if;

  return query
  select
    i.id, i.owner_id, i.title, i.description, i.daily_price,
    i.sale_price, i.category, i.city, i.photos,
    case
      when v_origin is null or i.location is null then null
      else st_distance(i.location, v_origin)
    end as distance_meters
  from public.items i
  where i.verification_status = 'live'
    and i.is_hidden = false
    and (auth.uid() is null or i.owner_id <> auth.uid())
    and (
      p_radius_km is null              -- no radius filter requested
      or v_origin is null              -- no origin to measure against
      or (i.location is not null
          and st_dwithin(i.location, v_origin, p_radius_km * 1000))
    )
  order by distance_meters asc nulls last, i.created_at desc;
end;
$$;

grant execute on function public.get_feed(double precision, double precision, double precision)
  to authenticated, anon;
