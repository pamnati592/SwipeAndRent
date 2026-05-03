-- Extend transaction_status enum with approval states needed for the rental request flow
alter type transaction_status add value if not exists 'approved';
alter type transaction_status add value if not exists 'rejected';

-- Add lender_id for efficient queries without joining items every time
alter table public.transactions
  add column if not exists lender_id uuid references public.profiles(id);

-- Back-fill lender_id from the owning item for any existing rows
update public.transactions t
set lender_id = i.owner_id
from public.items i
where t.item_id = i.id
  and t.lender_id is null;

-- Link a transaction to the conversation where the request was sent
alter table public.transactions
  add column if not exists conversation_id uuid references public.conversations(id);

-- Tighten the update policy so only the lender can change status (approve/reject)
-- and only the renter can cancel their own pending request
drop policy if exists "transactions: update own" on public.transactions;

create policy "transactions: lender updates status"
  on public.transactions for update
  using (lender_id = auth.uid())
  with check (lender_id = auth.uid());

create policy "transactions: renter cancels own"
  on public.transactions for update
  using (renter_id = auth.uid() and status = 'pending')
  with check (renter_id = auth.uid());
