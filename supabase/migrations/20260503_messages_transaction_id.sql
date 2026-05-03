alter table public.messages
  add column if not exists transaction_id uuid references public.transactions(id);
