-- Renter must be able to update an *approved* transaction to *active* after paying.
-- The previous policy only allowed updates when status = 'pending' (cancel flow),
-- so the payment DB write silently failed and status stayed 'approved' after logout.
drop policy if exists "transactions: renter cancels own" on public.transactions;

create policy "transactions: renter updates own"
  on public.transactions for update
  using (renter_id = auth.uid() and status in ('pending', 'approved'))
  with check (renter_id = auth.uid());
