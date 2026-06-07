-- ============================================================
-- QR handoff RPCs (run AFTER 20260606_qr_handoff_flow.sql so the 'paid'
-- enum value is already committed).
-- All functions are SECURITY DEFINER and assert the caller is the right party,
-- since the QR/checklist writes don't fit cleanly into row-level UPDATE policies.
-- ============================================================

-- Mark the calling party's condition-checklist confirmation for a phase.
-- p_phase is 'pickup' or 'return'. Renter and lender each call this for themselves.
create or replace function public.confirm_condition(p_tx uuid, p_phase text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  tx public.transactions;
  uid uuid := auth.uid();
begin
  select * into tx from public.transactions where id = p_tx;
  if not found then raise exception 'transaction not found'; end if;
  if uid <> tx.renter_id and uid <> tx.lender_id then
    raise exception 'not a party to this transaction';
  end if;
  if p_phase not in ('pickup', 'return') then
    raise exception 'invalid phase';
  end if;

  if p_phase = 'pickup' then
    if uid = tx.renter_id then
      update public.transactions set pickup_renter_ok = true where id = p_tx;
    else
      update public.transactions set pickup_lender_ok = true where id = p_tx;
    end if;
  else
    if uid = tx.renter_id then
      update public.transactions set return_renter_ok = true where id = p_tx;
    else
      update public.transactions set return_lender_ok = true where id = p_tx;
    end if;
  end if;
end;
$$;

-- Renter (the QR displayer) lazily generates/returns the one-time token for a phase.
create or replace function public.ensure_qr_token(p_tx uuid, p_phase text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  tx public.transactions;
  token text;
begin
  select * into tx from public.transactions where id = p_tx;
  if not found then raise exception 'transaction not found'; end if;
  if auth.uid() <> tx.renter_id then
    raise exception 'only the renter displays the QR';
  end if;

  if p_phase = 'pickup' then
    if tx.qr_token is null then
      token := gen_random_uuid()::text;
      update public.transactions set qr_token = token where id = p_tx;
    else
      token := tx.qr_token;
    end if;
  elsif p_phase = 'return' then
    if tx.return_qr_token is null then
      token := gen_random_uuid()::text;
      update public.transactions set return_qr_token = token where id = p_tx;
    else
      token := tx.return_qr_token;
    end if;
  else
    raise exception 'invalid phase';
  end if;

  return token;
end;
$$;

-- Lender scans the renter's QR. Validates the token, requires both checklist
-- confirmations for the phase, then advances the status. Returns the new status.
-- Proximity (50 m) is verified client-side before this is called.
create or replace function public.scan_qr_handoff(p_tx uuid, p_token text, p_phase text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  tx public.transactions;
  new_status transaction_status;
begin
  select * into tx from public.transactions where id = p_tx;
  if not found then raise exception 'transaction not found'; end if;
  if auth.uid() <> tx.lender_id then
    raise exception 'only the lender scans the QR';
  end if;

  if p_phase = 'pickup' then
    if tx.status <> 'paid' then raise exception 'rental is not awaiting pickup'; end if;
    if tx.qr_token is null or tx.qr_token <> p_token then raise exception 'invalid QR code'; end if;
    if not (tx.pickup_renter_ok and tx.pickup_lender_ok) then
      raise exception 'both parties must confirm item condition first';
    end if;
    update public.transactions
      set status = 'active', picked_up_at = now()
      where id = p_tx
      returning status into new_status;

  elsif p_phase = 'return' then
    if tx.status <> 'active' then raise exception 'rental is not awaiting return'; end if;
    if tx.return_qr_token is null or tx.return_qr_token <> p_token then raise exception 'invalid QR code'; end if;
    if not (tx.return_renter_ok and tx.return_lender_ok) then
      raise exception 'both parties must confirm item condition first';
    end if;
    update public.transactions
      set status = 'completed', returned_at = now()
      where id = p_tx
      returning status into new_status;

  else
    raise exception 'invalid phase';
  end if;

  return new_status::text;
end;
$$;

-- Either party flags a problem -> Disputed (escrow held until admin resolves).
create or replace function public.report_issue(p_tx uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  tx public.transactions;
  uid uuid := auth.uid();
begin
  select * into tx from public.transactions where id = p_tx;
  if not found then raise exception 'transaction not found'; end if;
  if uid <> tx.renter_id and uid <> tx.lender_id then
    raise exception 'not a party to this transaction';
  end if;
  update public.transactions set status = 'disputed' where id = p_tx;
end;
$$;

grant execute on function public.confirm_condition(uuid, text) to authenticated;
grant execute on function public.ensure_qr_token(uuid, text)   to authenticated;
grant execute on function public.scan_qr_handoff(uuid, text, text) to authenticated;
grant execute on function public.report_issue(uuid)            to authenticated;
