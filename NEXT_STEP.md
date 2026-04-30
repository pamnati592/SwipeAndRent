# Next Recommended Step — Rental Request Flow

## Goal
Implement the full rental request loop: renter picks dates → request sent to lender → lender approves or rejects.

## What to build

### 1. Database migration
- Create `transactions` table:
  - `id`, `item_id`, `renter_id`, `lender_id`, `start_date`, `end_date`
  - `status` enum: `pending | approved | rejected | active | completed | disputed`
  - `created_at`, `updated_at`
- RLS: renter and lender can read their own transactions; only renter can insert; only lender can update status

### 2. Rent button → Date picker modal (ItemDetailScreen)
- Tap "Rent" → open a modal with a calendar date-range picker
- Blocked dates (from existing transactions) shown as unavailable
- User selects start + end date → taps "Send Request"

### 3. Transaction creation
- Insert row into `transactions` with `status = pending`
- Block selected dates on the item's availability calendar

### 4. Lender notification in chat
- Auto-send a system-style message in the conversation:
  `"📅 Rental request: [start] → [end]. Tap to approve or reject."`
- If no conversation exists yet, create one first

### 5. Lender approval UI (ChatRoomScreen or separate screen)
- Lender sees the request message with Approve / Reject buttons
- Approve → `status = approved`, renter notified
- Reject → `status = rejected`, dates freed up

## Files to create / modify
- `supabase/migrations/YYYYMMDD_transactions.sql`
- `src/screens/ItemDetailScreen.tsx` — wire Rent button to date picker
- `src/screens/ChatRoomScreen.tsx` — render rental request card with action buttons
- `src/types/transaction.ts` — Transaction type definition
