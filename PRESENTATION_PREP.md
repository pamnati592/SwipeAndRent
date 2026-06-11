# Presentation Prep — SwipeAndRent Mid-Term

---

## PART 1 — SLIDE CHANGES

### Slide 1 — Title
- Make team names bigger and bolder
- Add a role under each name (e.g. "Ori Perlman – Product & Dev")

---

### Slide 5 — Core Features
Add a 7th card:
> **🤖 AI Planner**
> Groq-powered smart search
> Free-text query + date range → ranked item recommendations filtered by availability

---

### Slide 6 — Tech Stack
- Change "Gemini API (AI Planner)" → **"Groq API (AI Planner)"**
- Fix text overflow in all boxes

---

### NEW Slide — Code Architecture *(insert between Tech Stack and Database Schema)*
> **Section label:** CODE ARCHITECTURE
> **Title:** Screens, services, clean separation.

Four layers:

**Navigation** — RootNavigator → MainTabNavigator → HomeStack / ChatsStack / ProfileStack

**Screens** — 18 screens: Login, Onboarding, Home, ItemDetail, AIPlanner, AddItem, EditItem, ManageItem, MyItems, ChatRoom, Chats, MyRentals, Wishlist, History, Profile, PublicProfile, PhoneVerification

**Services** — `supabase.ts` · `auth.service.ts` · `chatBus.ts` · `places.ts`

**Hooks & Types** — `useUnreadCount` · `useUserLocation` · item types · format utils

---

### Slide 9 — MVP Status
Move to ✅ SHIPPED:
- GPS / location-based feed ranking
- Wishlist screen
- Profile redesign

Update ⚙ IN PROGRESS:
- QR-code transfer & return
- Push notifications (Firebase FCM)
- Twilio SMS verification
- Buy option
- Feed ranking algorithm
- Rating system
- History screen
- Split chats by role (Renting / Lending)

---

### Slide 10 — Roadmap → replace with Conclusion
> **Title:** What's next.

- App Store & Google Play submission
- Terms & Conditions — liability if item breaks or isn't returned (legal consultation needed)
- Business model: platform service fee per transaction (% TBD)
- Real user feedback after first public release

Keep the "Questions?" section at the bottom.

---

### NEW Slide — Onboarding *(add after Q&A, last slide)*
> **Section label:** ONBOARDING
> **Title:** First-time user experience.
> **Subtitle:** Demo accounts skip this — here's what a new user sees.

> **Sign Up** → Google OAuth, one tap
> **Phone Verification** → 6-digit OTP via SMS, 10 min expiry, required to continue
> **Role Selection** → Renter / Lender / Both
> **Profile Setup** → Display name · City (Google Places) · 3+ interest categories

> *"Every step is required before reaching the feed."*

---

### General
- Increase body font size across all slides
- Fix all cut-off text (slides 3, 5, 6, 8)

---

## PART 2 — KNOWLEDGE GAPS

**Stripe**
- Test mode = no real money, use card `4242 4242 4242 4242`
- Renters just enter a card — no Stripe account needed
- For production: lenders would need Stripe Connect to receive payouts (not decided yet)
- Escrow flow: Edge Function creates PaymentIntent → SDK confirms on phone → funds held → released on QR return confirmation

**Code Architecture**
- Know the 4 layers: Navigation / Screens / Services / Hooks
- SAS principle: every action has one canonical screen (e.g. approve/pay always in ChatRoomScreen)
- Badge Jump: status change → system message → unread badge → tap navigates to exact message with blue glow

**Edge Functions appearing twice on Tech Stack slide**
- "Edge Functions (Stripe)" = where the code runs (Supabase serverless)
- "Stripe" in External Services = the API it calls
- Not a duplicate — one is infrastructure, one is the service

**Groq vs Gemini**
- Verify in code which one is actually used before presenting — don't say Groq if code still calls Gemini

**Onboarding**
- Google OAuth → OTP (Twilio) → role → city + interests → feed
- No OTP = can't continue
- Biometric (FaceID/TouchID) = full access; without it = read-only (verify if implemented)

**Business/Legal**
- No liability policy yet for damaged/unreturned items — be upfront, mention legal consultation is needed
- App not on stores yet — running as native iOS dev build via Xcode + Expo
