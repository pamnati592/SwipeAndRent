-- Simplify the transaction SELECT policy to use lender_id directly.
-- Previously it used a subquery through items (owner_id check), which runs under
-- items RLS and can silently exclude rows when item status is not 'live'.
-- Since lender_id is now denormalised onto transactions, we can check it directly.
drop policy if exists "transactions: read own" on public.transactions;

create policy "transactions: read own"
  on public.transactions for select using (
    renter_id = auth.uid() or lender_id = auth.uid()
  );
