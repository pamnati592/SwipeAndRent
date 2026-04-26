-- ============================================================
-- SwipeAndRent – Full Database Schema
-- Run this in Supabase SQL Editor (Project → SQL Editor → New query)
-- ============================================================

-- Enable PostGIS for geo-location queries
create extension if not exists postgis;

-- ============================================================
-- ENUMS
-- ============================================================

create type auth_method as enum ('google', 'apple', 'facebook', 'email');
create type user_role as enum ('renter', 'lender', 'both');
create type item_status as enum ('draft', 'pending', 'live', 'rented');
create type transaction_status as enum ('pending', 'active', 'completed', 'disputed', 'cancelled');

-- ============================================================
-- PROFILES
-- Extends Supabase auth.users – one row per registered user
-- ============================================================

create table public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  auth_method      auth_method,
  full_name        text,
  avatar_url       text,
  phone            text,
  phone_verified   boolean not null default false,
  bio_verified     boolean not null default false,
  role             user_role,
  city             text,
  interests        text[] default '{}',
  onboarding_complete boolean not null default false,
  lender_score     float not null default 0,
  renter_score     float not null default 0,
  created_at       timestamptz not null default now()
);

-- Auto-create a profile row whenever a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ITEMS
-- ============================================================

create table public.items (
  id                     uuid primary key default gen_random_uuid(),
  owner_id               uuid not null references public.profiles(id) on delete cascade,
  title                  text not null,
  category               text not null,
  description            text,
  daily_price            numeric(10, 2) not null,
  sale_price             numeric(10, 2),          -- null = not for sale
  verification_status    item_status not null default 'draft',
  verification_image_url text,
  location               geography(point, 4326),  -- PostGIS point (lng, lat)
  city                   text,
  tags                   text[] default '{}',
  created_at             timestamptz not null default now()
);

-- Spatial index for fast proximity queries
create index items_location_idx on public.items using gist(location);

-- ============================================================
-- TRANSACTIONS
-- ============================================================

create table public.transactions (
  id           uuid primary key default gen_random_uuid(),
  renter_id    uuid not null references public.profiles(id),
  item_id      uuid not null references public.items(id),
  start_date   timestamptz not null,
  end_date     timestamptz not null,
  total_price  numeric(10, 2) not null,
  status       transaction_status not null default 'pending',
  stripe_payment_intent_id text,
  qr_token     text unique,               -- one-time token for QR scan
  created_at   timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only read/write their own data
-- ============================================================

alter table public.profiles    enable row level security;
alter table public.items       enable row level security;
alter table public.transactions enable row level security;

-- Profiles: user can read any profile, but only update their own
create policy "profiles: read all"
  on public.profiles for select using (true);

create policy "profiles: update own"
  on public.profiles for update using (auth.uid() = id);

-- Items: anyone can read live items; owners can manage their own
create policy "items: read live"
  on public.items for select using (verification_status = 'live' or owner_id = auth.uid());

create policy "items: insert own"
  on public.items for insert with check (owner_id = auth.uid());

create policy "items: update own"
  on public.items for update using (owner_id = auth.uid());

create policy "items: delete own"
  on public.items for delete using (owner_id = auth.uid());

-- Transactions: renter or item owner can see their transactions
create policy "transactions: read own"
  on public.transactions for select using (
    renter_id = auth.uid() or
    item_id in (select id from public.items where owner_id = auth.uid())
  );

create policy "transactions: insert as renter"
  on public.transactions for insert with check (renter_id = auth.uid());

create policy "transactions: update own"
  on public.transactions for update using (
    renter_id = auth.uid() or
    item_id in (select id from public.items where owner_id = auth.uid())
  );
