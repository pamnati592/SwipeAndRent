# SwipeAndRent – Demo Script
**Audience:** Evaluators / Investors / Class presentation  
**Duration:** ~8–10 minutes  
**Devices:** 2 phones (or simulator + phone) — Phone A = Renter, Phone B = Lender

---

## Setup Before the Demo

- [ ] Run `supabase/demo_seed.sql` in the Supabase SQL Editor
- [ ] Phone A: logged in as **Ori** (renter role)
- [ ] Phone B: logged in as **Nati** (lender role)
- [ ] Both phones have GPS enabled and location set to **Tel Aviv Center**
- [ ] App is on Home screen, feed loaded

---

## Scene 1 – The Problem & First Impression (30 sec)

> "Imagine you need a drone for the weekend. Buying one costs ₪4,000. Renting one nearby — ₪120 for the day."

- Show the **Home Feed** on Phone A
- Cards visible: Camera, Drill, Hammock, Surfboard — all from real users nearby
- Point out: **price**, **city**, and **photo** on every card

---

## Scene 2 – Location-Based Feed & Distance Filter (1 min)

> "Every item is pinned to a real location. The feed is sorted by distance from your GPS."

- On Phone A's Home screen, tap the **distance/radius selector**
- Show feed at **5 km radius** → items in Tel Aviv Center, Florentin, Neve Tzedek visible
- Change to **3 km** → Herzliya drone and Yaffo GoPro disappear from feed
- Change back to **10 km** → all 12 items visible, sorted closest-first
- Scroll through cards, showing different cities: Tel Aviv Center, Yaffo, Ramat Aviv, Herzliya

**Key message:** *Real GPS coordinates, real proximity — not just a city label.*

---

## Scene 3 – Swiping & Item Detail (1 min)

> "The interaction model is intuitive — swipe or tap."

- **Swipe Left** on the Hammock card → "not for me, feed updates"
- **Swipe Right** on the DJI Drone → action panel slides up: **View / Rent / Wishlist / Chat**
- Tap **"View"** → Item Detail Screen opens
  - Paginated photo gallery
  - Full description, price, city, tags
  - Distance from your current location shown

---

## Scene 4 – Wishlist (20 sec)

> "Users can save items they're interested in for later."

- From the Item Detail of the Surfboard, tap **"Wishlist"** (heart icon)
- Navigate to **Profile → Wishlist tab**
- Show the saved item card
- Navigate back

---

## Scene 5 – Rental Request Flow (1.5 min)

> "The rental request flow is the core of the platform."

**On Phone A (Ori – Renter):**
- Open the **DJI Drone** item detail
- Tap **"Rent"**
- Calendar opens — tap to select a **2-day range** (e.g. tomorrow + day after)
- Tap **"Send Request"**
- Toast: "Request sent!" — app navigates to chat with Nati

**On Phone B (Nati – Lender):**
- Badge appears on Chats tab — tap it → **Badge Jump** navigates directly to the chat
- System message: "Ori requested to rent your DJI Drone — Jun 3–4"
- Tap **"Approve"** button in chat
- Toast: "Rental approved!"

**Back on Phone A:**
- Chat updates in real-time — "Your rental was approved"
- Status shows "Pending payment"

**Key message:** *Real-time chat, one canonical action screen (ChatRoomScreen), no logic duplication.*

---

## Scene 6 – AI Assistant (1.5 min)

> "What if you need multiple items for a camping trip? The AI agent handles it."

**On Phone A:**
- Tap the **AI button** (sparkle icon) on the Home screen → AI Planner opens
- Type: `"I'm going on a 3-day camping trip this weekend. I need a tent, sleeping gear, and something to document the trip"`
- Select date range for the weekend
- Tap **"Find Items"**

**Wait ~3 seconds → results appear:**
- Agent returns a curated checklist: *4-Person Tent, Camping Hammock, GoPro Hero 12*
- Each item shows distance and price
- Tap one item → opens its detail screen
- Tap **"Send All Requests"** → rental requests go to all relevant lenders at once

**Key message:** *Free-text search → Gemini-powered → multiple rental requests in one tap.*

---

## Scene 7 – Item Listing (Upload) (1 min)

> "Being a lender is just as easy."

**On Phone B (Nati):**
- Tap the **(+)** button
- Fill in: Title = "Vintage Skateboard", Category = Sports, Price = ₪25/day
- Tap camera icon → take a **verification photo** (camera only — for admin review)
- Tap gallery icon → add **item photos** (up to 6)
- Tap **"Submit"** → item saved as Pending
- Toast: "Item submitted for review"

**Key message:** *Two photo types — public gallery vs. private verification image. Admin reviews before item goes live.*

---

## Scene 8 – Manage My Items (45 sec)

> "Lenders have full control over their listings."

**On Phone B:**
- Go to **Profile → My Items**
- Tap the **Camera Kit** listing
- Opens **ManageItemScreen**: edit title/price, view availability calendar, see blocked dates
- Show the calendar with the new booking from Ori blocked
- Tap **"Edit"** → change daily price → Save → Toast: "Item updated"

---

## Scene 9 – My Rentals & Transaction History (30 sec)

> "Both sides can track all their transactions."

**On Phone A (Ori):**
- Go to **Profile → My Rentals**
- Shows upcoming rental: DJI Drone, Jun 3–4, Status: "Approved / Awaiting Payment"
- Tap → navigates to chat to complete payment

**On Phone B (Nati):**
- Go to **Profile → History**
- Shows all past and upcoming rentals for items they own

---

## Scene 10 – Public Profiles & Reputation (30 sec)

> "Trust is built through reputation scores."

- On either phone, tap a user's avatar in a chat or item card
- **PublicProfileScreen** opens: name, avatar, city, Lender Score, Renter Score
- Scores are calculated from completed rentals
- "Before you rent a ₪120 drone from a stranger — you can see their track record."

---

## Wrap-Up (30 sec)

> "SwipeAndRent is a full P2P rental marketplace — location-aware, real-time, AI-powered, and secure."

**Stack recap (show on screen if possible):**
- React Native + Expo (iOS + Android, one codebase)
- Supabase (Auth, Realtime DB, PostGIS for GPS, Storage)
- Gemini API (AI agent)
- Stripe (payments, escrow)
- Firebase FCM (push notifications)

**What's next:**
- Stripe escrow payment integration (test mode ready)
- QR code transfer & return verification
- Biometric auth (FaceID/TouchID)

---

## Quick Reference – Demo Item Map

| Item | Owner | Location | Distance from Center |
|---|---|---|---|
| Professional Camera Kit | Nati | Tel Aviv Center | 0 km |
| Fender Guitar | Nati | Tel Aviv | ~0.9 km |
| Nintendo Switch | Ori | Tel Aviv | ~0.6 km |
| Camping Tent | Nati | Tel Aviv Port | ~2.5 km |
| Power Drill | Nati | Florentin | ~2.7 km |
| Hammock Kit | Ori | Florentin | ~2.9 km |
| Polaroid Camera | Ori | Neve Tzedek | ~3.0 km |
| PS5 | Ori | Neve Tzedek | ~3.1 km |
| Surfboard | Ori | Jaffa Port | ~4.5 km |
| GoPro Hero 12 | Nati | Yaffo | ~4.7 km |
| Mountain Bike | Nati | Ramat Aviv | ~5.0 km |
| DJI Mini 3 Drone | Nati | Herzliya Pituah | ~14 km |

**Distance filter demo:**
- Set to **5 km** → shows everything except the Herzliya drone
- Set to **3 km** → shows Tel Aviv Center / Port / Florentin / Neve Tzedek items only
- Set to **10 km** → everything visible, sorted closest first
