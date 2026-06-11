# Next Suggested Step — For Nati 👋

## What to build next: QR screens (H)

GPS / Location-based feed (G) is now complete — items are filtered by a user-selected radius from the device GPS (with profile-city fallback), and Google Places powers a real CityPicker in Onboarding / Add / Edit. See "Done" below for details.

### H. QR code transfer & return
- After payment succeeds (status → `active`), generate a `qr_token` (UUID) and store it on the transaction.
- **Transfer flow**: Renter opens a screen showing their QR code → Lender scans it → transaction status → `active` (item handed over).
- **Return flow**: New QR generated → Lender scans → status → `completed`.
- Both screens live inside the rental flow (accessible from `ChatRoomScreen` Rental tab and `MyRentalsScreen`).

---

## ⚠️ CRITICAL — Read this before writing any code: SAS Design Principle

This codebase follows the **Single Action Source (SAS)** pattern. It is mandatory for every feature.

**The rule:** Every action in the app has **one canonical screen** where it executes. All other entry points are navigation shortcuts that route to that screen — they never duplicate the action logic.

**Examples already in the codebase:**
- Approve / Decline / Cancel / Pay a rental → always happens inside `ChatRoomScreen` (Rental tab). `ManageItemScreen`, `MyRentalsScreen`, and `MyItemsScreen` show status but never have their own action buttons — they navigate to the chat instead.
- Edit / Delete an item → always happens in `EditItemScreen`. `MyItemsScreen` has an Edit button that navigates there — it doesn't inline any edit logic itself.
- City selection → always goes through the `CityPicker` component. Onboarding / AddItem / EditItem all use it; never roll a new picker.

**How to apply it to QR screens:**
- There should be ONE canonical screen for "show my QR to hand over the item" and ONE for "scan the lender's QR".
- `ChatRoomScreen`, `MyRentalsScreen`, and any other screen that references the transaction should navigate to these QR screens — they should not each implement their own QR logic.
- Ask yourself before adding any button: "Is there already a canonical screen for this action?" If yes, navigate there.

**Why it matters:** If the flow changes (e.g. you add a condition checklist before the QR scan), you update it in one place and it works everywhere automatically.

---

## Also good to know: Badge Jump

The codebase has a pattern called **Badge Jump**: when a status-changing action happens (approval, payment, cancellation), a system message is inserted into the chat. This triggers an unread badge on the Chats tab. When the other user taps the badge, the app auto-navigates to the correct chat, switches to the Rental tab, and flashes the relevant message with a blue glow.

When you build the QR flow, wire any status change (item handed over, item returned) through `insertSystemMessage()` in `ChatRoomScreen` so the other party gets a Badge Jump notification automatically.

---

# Backlog

### M. Post-rental rating prompt
- When a transaction moves to `completed`, both parties are prompted inline (inside `ChatRoomScreen` Rental tab) to rate the other person: 1–5 stars + optional short comment.
- Ratings stored in a new `ratings` table: `(id, reviewer_id, reviewee_id, transaction_id, score, comment, created_at)`.
- Scores aggregate into `lender_score` and `renter_score` on `profiles` (fields already exist, currently 0). Use a DB trigger or RPC to recompute the average on each new rating row.
- SAS rule: the rating UI lives only in `ChatRoomScreen`. `MyRentalsScreen` / `HistoryScreen` show the final score but never host the rating action itself.

### N. Retroactive rental scoring (reputation bootstrap)
- Both sides (lender and renter) have a history of past rentals. After each `completed` transaction, the system should look back at the full history for both parties and recompute their scores (weighted recency — more recent rentals count more).
- For lenders: factors are item condition accuracy, response time to requests, cancellation rate.
- For renters: factors are on-time return, item care (no disputes), cancellation rate.
- This should run as a Supabase DB function / RPC triggered on every rating insert, so scores stay live without a separate cron job.
- Display the score badge and total-review count on `PublicProfileScreen` (already shown, just needs real data).

### C. Buy option
- Toggle on item upload: "Also available for purchase" + sale price
- "Buy" button on swipe panel + Item Detail (currently a no-op placeholder)

### D. Rating system
- After a rental is marked Completed, both parties are prompted to rate each other (1–5 stars + optional comment)
- Ratings feed into `lender_score` and `renter_score` on `profiles` (fields exist, currently 0)
- Lender score factors: item condition accuracy, response speed, cancellation history
- Renter score factors: return time, item care
- `lender_cancellations` counter on `profiles` → deduct from lender score, show warning badge on public profile after threshold
- Ratings stored in a new `ratings` table: `(id, reviewer_id, reviewee_id, transaction_id, score, comment, created_at)`

### E. Feed ranking algorithm (beyond distance)
- Current `get_feed` ranks by distance only. Extend the weighted formula with: lender score, interest match (intersect `profiles.interests` with `items.category`/tags), recency.
- Likely a new `p_user_id` parameter or just use `auth.uid()` internally as it already does for the owner filter.

### H. QR code transfer & return ⬅ immediate next priority
- After payment → generate `qr_token` on transaction
- Renter shows QR → lender scans → status → active
- Return: new QR → lender scans → status → completed
- See the detailed spec at the top of this file

### I. Back navigation audit
- Every `navigation.goBack()` call needs a `canGoBack()` guard
- Cross-tab navigations should have a valid back destination

### J. Tab bar redesign
- AI Planner tab → move into Home feed as a button/banner (it's the same destination)
- "+" (Add Item) is low-frequency — consider de-emphasizing (plain tab or header button)
- Final layout decision: 4 tabs (Home / Add / Chats / Profile) or 3 tabs (Home / Chats / Profile with + in header)

### K. History screen
- `HistoryScreen` placeholder exists — needs full implementation
- Show all past completed/cancelled/disputed rentals for both sides (as renter and as lender)
- Group by role or chronological order TBD

### O. Split Chats tab by role (Renter / Lender)
- Currently all conversations are mixed in a single list — hard to tell which hat you're wearing in each thread
- Split `ChatsScreen` into two tabs: **Renting** (conversations where the current user is the renter) and **Lending** (conversations where the current user is the item owner)
- A conversation belongs to "Lending" if `items.owner_id = auth.uid()`, and to "Renting" if the renter is `auth.uid()`
- Unread badge on the Chats tab should still reflect total unread across both tabs
- Each sub-tab gets its own unread count shown on the tab pill
- SAS rule: `ChatRoomScreen` itself doesn't change — only the list that leads into it is split

### Q. Bulk photo scan — auto-fill multiple items from one photo
- In `AddItemScreen`, add a "Scan Items" button (camera icon) above the manual form.
- User takes one photo of a group of objects (e.g. a pile of camping gear, a table of tools).
- Photo is sent to a vision model (Gemini Vision or Groq-compatible endpoint) with a prompt that returns a structured JSON array: each element contains `name`, `category`, `description`, and a suggested `daily_price`.
- App renders a review sheet listing all detected items — user can edit any field, remove a row, or add a blank row before confirming.
- On confirm → each row is submitted as a separate `AddItem` call (reuse the existing item-creation logic; do not duplicate it).
- The original photo is attached as the first item photo for each detected item, or left empty if the user prefers individual photos per item.
- SAS rule: the actual item-save logic must go through the same path as the existing "Save" button in `AddItemScreen` — no parallel write path.
- Edge cases to handle: model returns no items (show error toast), model times out after 5s (fall back to manual form), user denies camera permission (standard permission flow already used by AddItemScreen).

### P. Refactor chatBus into a single Supabase realtime listener
- Currently: `useUnreadCount` and `ChatRoomScreen` each have their own independent Supabase listeners, and `chatBus` is only used to signal "marked as read"
- Goal: move the Supabase realtime connection into `chatBus` so it becomes the single listener for all incoming messages
- `useUnreadCount` and `ChatRoomScreen` both subscribe to `chatBus` instead of Supabase directly
- Clean flow: Supabase → chatBus → (useUnreadCount updates badge, ChatRoomScreen appends message)

### L. Google Cloud account hardening (operational, not code)
- Before Free Trial expiry: set Hard Quotas (1000/day) on Places API + Geocoding API in Google Cloud Console
- Add a Budget Alert of $1 with email notifications at 50% / 90% / 100%
- Activate full account only after the above is in place

---

## Done

- **A.** Date-based availability filtering in AI Planner — edge function filters by transactions + blocked dates
- **B.** Wishlist — `wishlist` table, WishlistScreen, ❤️ button wired in ItemDetail + HomeScreen swipe panel
- **F.** Profile redesign — unified layout (own + public), score badges, hamburger menu with My Items / My Rentals / Wishlist / History / Switch User / Log out
- **G.** GPS / location-based feed:
  - `profiles.location` (PostGIS geography) added via migration
  - `get_feed` RPC accepts `p_lat`, `p_lng`, `p_radius_km`; falls back to caller's `profiles.location` when device coords are null; excludes items without GPS from radius queries; orders by ST_Distance
  - `CityPicker` component (Google Places autocomplete + "Use my current location" reverse geocode) — single source for city selection across Onboarding / Add / Edit
  - HomeScreen radius selector chips (1 / 5 / 25 / 100 km / All) + wired search bar (title / description / category, client-side)
  - `useUserLocation` upgraded from one-shot to continuous `watchPositionAsync` (50m / 10s threshold)
  - Legacy data backfilled: 8 items + 3 profiles normalized to `Tel Aviv-Yafo` with GPS
  - Empty-state UX: radius bar stays visible so the user can switch to "All" instead of being stuck
- **Edit & Delete Item** — EditItemScreen (pre-filled form, photo handling), delete blocked if active/pending rental, ✏️ Edit button in MyItemsScreen
- **Badge Jump** — all 4 rental steps covered (request → approval → payment → cancellation); fixed null last_read bug for first-time conversations
- **Item tap in My Items** — tapping card header navigates to ItemDetailScreen within ProfileStack
- **Profile picture** — tap avatar in own profile to set/change photo; stored in `profiles.avatar_url`
