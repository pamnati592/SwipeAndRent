-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- Creates the item-images storage bucket and its RLS policies.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'item-images',
  'item-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
) on conflict (id) do nothing;

-- Authenticated users can upload to the bucket
create policy "item-images: authenticated upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'item-images');

-- Anyone (including anonymous) can view item images
create policy "item-images: public read"
  on storage.objects for select
  using (bucket_id = 'item-images');

-- Users can update their own uploads (folder named after their uid)
create policy "item-images: owner update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'item-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own uploads
create policy "item-images: owner delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'item-images' and auth.uid()::text = (storage.foldername(name))[1]);
