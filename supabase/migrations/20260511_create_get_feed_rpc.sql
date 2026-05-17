-- Distance-ranked feed RPC.
-- Returns live items the caller does not own, with a precomputed distance in
-- meters when both the caller's coordinates and the item's location are known.
-- Items without coordinates (either side) sort to the end so the feed never
-- starves new uploads that have not yet captured GPS.
create or replace function public.get_feed(
  p_lat double precision default null,
  p_lng double precision default null
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
language sql
stable
as $$
  select
    i.id,
    i.owner_id,
    i.title,
    i.description,
    i.daily_price,
    i.sale_price,
    i.category,
    i.city,
    i.photos,
    case
      when p_lat is null or p_lng is null or i.location is null then null
      else st_distance(i.location, st_makepoint(p_lng, p_lat)::geography)
    end as distance_meters
  from public.items i
  where i.verification_status = 'live'
    and i.is_hidden = false
    and (auth.uid() is null or i.owner_id <> auth.uid())
  order by distance_meters asc nulls last, i.created_at desc;
$$;

grant execute on function public.get_feed(double precision, double precision)
  to authenticated, anon;
