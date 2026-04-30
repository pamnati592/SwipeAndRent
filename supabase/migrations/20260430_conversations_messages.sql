-- conversations: one thread per (item, renter, lender) combination
create table public.conversations (
  id              uuid primary key default gen_random_uuid(),
  item_id         uuid not null references public.items(id) on delete cascade,
  renter_id       uuid not null references public.profiles(id) on delete cascade,
  lender_id       uuid not null references public.profiles(id) on delete cascade,
  last_message    text,
  last_message_at timestamptz,
  created_at      timestamptz not null default now(),
  unique(item_id, renter_id, lender_id)
);

-- messages: individual chat messages within a conversation
create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  content         text not null,
  created_at      timestamptz not null default now()
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- conversations: both participants can read; only the renter can create
create policy "conversations: read own"
  on public.conversations for select using (
    renter_id = auth.uid() or lender_id = auth.uid()
  );

create policy "conversations: insert as renter"
  on public.conversations for insert with check (renter_id = auth.uid());

create policy "conversations: update as participant"
  on public.conversations for update using (
    renter_id = auth.uid() or lender_id = auth.uid()
  );

-- messages: participants can read; sender must be the authenticated user
create policy "messages: read own"
  on public.messages for select using (
    conversation_id in (
      select id from public.conversations
      where renter_id = auth.uid() or lender_id = auth.uid()
    )
  );

create policy "messages: insert as participant"
  on public.messages for insert with check (
    sender_id = auth.uid() and
    conversation_id in (
      select id from public.conversations
      where renter_id = auth.uid() or lender_id = auth.uid()
    )
  );

-- enable realtime for messages so clients receive new messages instantly
alter publication supabase_realtime add table public.messages;
