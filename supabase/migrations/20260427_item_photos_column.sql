-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- Adds a photos array to items for the public-facing gallery.
-- The verification_image_url column (already exists) is kept separate.

alter table public.items
  add column if not exists photos text[] default '{}';
