# Session Summary — Availability, Blocked Dates, Rental UX

## What was built this session

### Database (run these in Supabase SQL Editor)
1. `20260505_transactions_lender_select.sql` — simplified transactions SELECT policy to use `lender_id` directly
2. `20260505_transactions_approved_at.sql` — adds `approved_at timestamptz` to track the 24h payment window
3. `20260505_fix_renter_payment_rls.sql` — allows renter to update `approved` transactions (was blocked, caused payment status to revert after logout)
4. `20260505_item_blocked_dates_and_hidden.sql` — `item_blocked_dates` table (multiple blocked ranges per item) + `is_hidden` column + updated items RLS

### Features shipped
- **Approve/Decline buttons** — root cause found: messages had `transaction_id = null` because RPC was applied before the column existed. Fixed via date-parsing fallback + RPC re-applied
- **Active rental label** — after payment, rental request card shows "🔑 Active Rental" instead of "Pay Now"
- **24h payment expiry** — approved transactions past 24h show "⏱ Time exceeded" instead of Pay Now
- **Date references in messages** — approve/decline/payment system messages include the date range, e.g. "✅ Request approved (5 May → 6 May)!"
- **My Rentals screen** — Profile → My Rentals shows all renter's requests with status, dates, price, lender name and tap-to-chat
- **Scroll to exact message** — tapping a rental in My Rentals (or a booking in My Items) opens the chat and scrolls to that specific rental request card
- **Blocked dates editor** — My Items → "🚫 Blocked dates" opens a modal to mark dates when the item is NOT available; supports multiple ranges, individual delete, clear all, and validates against approved bookings
- **Hide item toggle** — "🙈 Hide item" makes the item invisible to renters without deleting it; hidden items show at 50% opacity with a "Hidden" badge
- **Profile active label fix** — Switch User modal now derives the active label from session email, eliminating the AsyncStorage race condition

---

## Backlog — Improvements (added 2026-05-06)

### A. Owner profile on Item Detail screen
- Show owner name (+ rating placeholder) on the Item Detail screen
- Tapping the owner navigates to a public profile page showing all their listed items
- Ratings are deferred — show a static placeholder for now

### B. Wishlist page
- Add a dedicated Wishlist screen under the Profile tab
- Currently the heart/wishlist action exists on swipe but there's no page to view saved items
- Needs a `wishlist` table (user_id, item_id) and a screen that lists saved items as cards

### C. Buy option (item for sale)
- When a lender uploads an item, add a toggle: "Also available for purchase" + sale price field
- If not for sale: the "Buy" button is hidden everywhere (swipe action panel + Item Detail)
- If for sale: "Buy" appears alongside "Rent" with the fixed sale price

### D. Owners should not see their own items in the feed
- HomeScreen query must exclude items where `owner_id = auth.uid()`
- Simple `.neq('owner_id', user.id)` filter on the items fetch

### E. Feed algorithm based on interests + distance
- Currently feed is unfiltered; should rank/filter by:
  1. User's interest categories (from `profiles.interests_array`) — match against item `category` / `tags`
  2. Distance — use PostGIS `ST_Distance` on the existing `location` column (see GPS step in Next Steps §2)
- Implement as a Supabase RPC `get_feed(user_id, lat, lng)` that returns ranked item IDs
- Show distance badge on each card ("2.3 km away")

### G. Redesign the Profile section — Account Hub + Public Profile

Two distinct views, clearly separated:

**Profile Tab = "My Account" hub (private)**
```
[Avatar]  Name  [Edit Profile]
⭐ 4.8 Lender   ⭐ 4.9 Renter

ACTIVITY
  📦  My Items      →
  📅  My Rentals    →

SAVED
  ❤️   Wishlist      →

SETTINGS
  🎛️   Feed Preferences  →
  ⚙️   Account Settings  →
  🚪  Logout
```

**Public Profile = separate screen** (navigated to by tapping an owner's name on Item Detail or in chat)
```
[Avatar]  Name
City  ⭐ Lender rating
[Message button]

LISTINGS
  [item card grid]
```

Rules:
- Profile Tab always shows "my stuff" only — never another user's data
- Public Profile is read-only, no edit controls
- Settings split: Feed Preferences (categories, distance, price range) vs. Account Settings (name, phone, city, password, logout)
- Wishlist and future "saved for sale" items both live under a Saved section — consistent pattern

### F. Split settings: Feed Preferences vs. Profile Settings
- The gear icon on the Home Screen should open **Feed Preferences** (categories, distance radius, price range)
- A separate **Profile Settings** (edit name, phone, city, password, logout, delete account) should live on the Profile tab
- Currently both don't exist as real screens — need to be built from scratch

---

## Next Steps (priority order)

### 1. AI Planner — Gemini smart search (next up)
The tab exists but shows "Coming Soon". This is the highest-impact feature for a demo.

**How it works:**
- User types a free-text query (e.g. "I need a tent for a weekend camping trip in June") and picks a date range
- A Supabase Edge Function sends the query + all live item titles/categories to Gemini
- Gemini returns a ranked, filtered list of relevant item IDs with a short reason for each
- App displays the results as tappable cards → tap opens ItemDetailScreen

**Implementation plan:**
1. Edge Function `ai-search`: receives `{ query, start_date, end_date, user_id }`, fetches all live items from DB, builds a prompt for Gemini, returns ranked list
2. `AIPlannerScreen.tsx`: text input + date range picker + call edge function + render result cards
3. Gemini API key stored as Supabase secret (`supabase secrets set GEMINI_KEY=...`)

---

### 2. GPS / Location-based feed
Items table already has a PostGIS `location` column — it just needs to be populated.

**Implementation plan:**
1. `AddItemScreen`: request location permission + store `ST_Point(lng, lat)` when listing an item
2. `HomeScreen`: fetch user's current location → order items by `ST_Distance(location, user_point)` using a Supabase RPC
3. Show distance ("2.3 km away") on each swipe card

---

### 3. QR code transfer & return
Completes the full rental lifecycle.

**Implementation plan:**
1. After payment → generate a unique `qr_token` (UUID) on the transaction
2. Renter sees a QR code screen (using `react-native-qrcode-svg`)
3. Lender scans via camera (`expo-barcode-scanner`) → validates token → sets status to `active`
4. At return: new QR generated → lender scans → status becomes `completed`
5. Optional: geo-fence check (both within 50m using expo-location)

---

### 4. Push notifications
- Install `expo-notifications`
- Store Expo push token in `profiles` table on login
- Supabase Edge Function triggered on `messages` INSERT → sends push to the other participant
- Key events to notify: new rental request, approval, payment, new chat message
