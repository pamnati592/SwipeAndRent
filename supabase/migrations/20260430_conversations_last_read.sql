alter table public.conversations
  add column renter_last_read_at timestamptz,
  add column lender_last_read_at timestamptz;
