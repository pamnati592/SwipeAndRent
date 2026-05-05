-- Replace the single available_from/to approach with a proper blocked-dates table
-- that supports multiple date ranges per item, plus a hidden flag.

create table if not exists public.item_blocked_dates (
  id           uuid primary key default gen_random_uuid(),
  item_id      uuid not null references public.items(id) on delete cascade,
  blocked_from date not null,
  blocked_to   date not null,
  created_at   timestamptz not null default now(),
  constraint no_reversed_range check (blocked_from <= blocked_to)
);

alter table public.item_blocked_dates enable row level security;

-- Everyone can read blocked dates (so the renter's calendar shows them)
create policy "item_blocked_dates: read all"
  on public.item_blocked_dates for select using (true);

-- Only the item owner can insert/delete blocked ranges
create policy "item_blocked_dates: owner manages"
  on public.item_blocked_dates for all
  using (item_id in (select id from public.items where owner_id = auth.uid()))
  with check (item_id in (select id from public.items where owner_id = auth.uid()));

-- Hidden flag: item still exists but won't appear to other users
alter table public.items
  add column if not exists is_hidden boolean not null default false;

-- Update the read policy so hidden items are invisible to non-owners
drop policy if exists "items: read live" on public.items;
create policy "items: read live"
  on public.items for select using (
    (verification_status = 'live' and is_hidden = false) or owner_id = auth.uid()
  );
