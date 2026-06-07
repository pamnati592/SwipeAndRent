-- ============================================================
-- QR handoff flow (spec 4.9)
-- Adds the 'paid' intermediate state and the physical transfer / return
-- handshake: condition checklist (both parties) -> QR scan -> status change.
--
-- Status lifecycle after this migration:
--   pending -> approved -> paid -> active -> completed
--                                   \-> disputed (Report Issue, any time)
--   'paid'   = renter paid, item NOT yet handed over (escrow authorised)
--   'active' = lender scanned the pickup QR -> item physically handed over
--   'completed' = lender scanned the return QR -> item returned
-- ============================================================

-- 1. New status value. NOTE: Postgres cannot use a freshly-added enum value in
--    the same transaction it is added, so this runs as its own statement.
alter type transaction_status add value if not exists 'paid';

-- 2. Handoff columns
alter table public.transactions
  add column if not exists return_qr_token   text unique,            -- second one-time token for the return scan
  add column if not exists picked_up_at       timestamptz,           -- set when pickup QR is scanned
  add column if not exists returned_at        timestamptz,           -- set when return QR is scanned
  add column if not exists pickup_renter_ok   boolean not null default false,
  add column if not exists pickup_lender_ok   boolean not null default false,
  add column if not exists return_renter_ok   boolean not null default false,
  add column if not exists return_lender_ok   boolean not null default false;
