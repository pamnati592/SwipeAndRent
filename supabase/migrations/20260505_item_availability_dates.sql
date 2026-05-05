-- Lender-controlled availability window for each item.
-- When set, the rental calendar in ItemDetailScreen restricts
-- selectable dates to this range.
alter table public.items
  add column if not exists available_from date,
  add column if not exists available_to   date;
