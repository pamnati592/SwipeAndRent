alter table public.transactions
  add column if not exists approved_at timestamptz;
