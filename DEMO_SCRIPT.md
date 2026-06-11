# Demo Script — Exact Scene Breakdown

**Devices:** iPhone 17 Pro = Ori (Lender) | iPhone 17 = Nati (Renter)
**Last updated:** 2026-06-11

---

## ✅ Status: fully implemented

Total run: **~3:24 after the countdown**. Key mechanics:

1. **Synchronized start** — both countdowns target the same wall-clock tick (next 10s boundary) and fire a precise timer; the phones start within milliseconds of each other.
2. **Attention choreography** — only one phone "acts" at a time; captions never compete (the other phone is black).
3. **Lock-screen pushes** — every cross-phone event (request, approval, meeting spot) wakes the other phone with an iOS-style lock screen + notification card.
4. **Visible taps** — every simulated press shows a `TapFlash` finger dot (Rent, checklist, Pay, notifications, profile Approve, Confirm Meeting Point, rating submit).
5. **QR flow** — holder shows QR (passive), receiver scans first → checklist → photo; Impact Score on return only; "Report Damage" lives only on the scanner's checklist.
6. **Alt ending** — translucent VHS rewind with the screens visibly flipping backwards → Ori's unchecked checklist → dispute ("The lens is cracked") → "Case Under Review" / "Issue Reported".
7. **4-part closing message** alternating between the phones, ending on Nati's "Thank you."
8. **Ghost-proofing** — both tab stacks pop to their roots at start AND right before the two visible Chats-tab pushes; Ori's chat shows only the fresh request via `onlyTransactionId`.

---

## Full Scene-by-Scene Script

> **Attention rule:** at any moment exactly ONE phone holds the viewer's eye.
> When one phone shows a story caption, the other is plain black.
> Exceptions (intentionally simultaneous): the title cards, the split time
> transitions ("A few days… / Later…"), the chapter cards ("The meet up.",
> "Meeting up again."), and the rewind effect.

### Scene 0 — Countdown + Title Cards

Tap 🎬 → Run Script → countdown to a shared clock tick → scripts start together.

| T | Ori (LEFT) | Nati (RIGHT) |
|---|---|---|
| 0–2 | black (both phones "off") | black |
| 2–5 | **"Find what you need."** | **"Locally."** |
| 5 | Phone goes black ("off") | iPhone lock screen (clock) |
| 8 | — | Unlocks into the app |

### Scene 1 — Nati Browses & Requests (Nati ACTIVE, Ori's phone off)

1. HomeScreen feed → taps **"Cameras"** chip → two cameras in the deck
2. **Swipe LEFT** on **Sony A7 III** (skip)
3. **Swipe RIGHT** on **Canon EOS R5** → Item Detail opens
4. Scrolls to the bottom → visibly **taps "Rent"** → calendar opens → dates get picked
5. **Request fires only now** (T=28) → "Request sent. Now we wait." → black

### Scene 2 — Ori Wakes, Checks the Profile & Approves (Ori ACTIVE, Nati black)

1. Ori's phone "lights up": lock screen + **push notification** (USEIT · New Rental Request)
2. Tap → ChatRoom opens on Rentals tab; the request card has a **"View Nati's profile"** button
3. Ori opens **Nati's profile** (scores, listings) — the profile shows the pending request with **Approve / Decline** buttons
4. Approves from the profile (real DB write) → "Approving…" → "Approved." → black

### Scene 2b — Nati Pays (Nati ACTIVE, Ori black; payment AFTER approval, spec 4.8)

1. Nati's phone lights up: lock screen + **push notification** — "✅ Request Approved · Ori approved your Canon EOS R5 rental"
2. Tap → **Payment confirmation** slide → "Paying…" → "Payment secured. Held in escrow until return."

### Scene 2c — Meeting Spot (Ori sets, Nati confirms)

1. Ori: *"Now it's time to set up the meeting spot."* → MeetingPoint map (Dizengoff Square)
2. Nati's phone lights up: lock screen + **push** — "📍 Meeting Spot Set · Ori suggested Dizengoff Square"
3. Tap → MeetingPoint **confirm screen** → visible tap on **Confirm Meeting Point** → ✓ confirmed

### Scene 3 — Time Transition (Both phones)

| Ori | Nati |
|---|---|
| **"A few days…"** | **"Later…"** |
| **"The meet up."** | **"The meet up."** |

### Scene 4 — QR Pickup (Ori holds → shows QR; Nati receives → scans)

**Ori (QRDisplay):** QR shown → *"QR Scanned! Nati is checking the item condition…"* → *"Handoff Complete!"*
**Nati (QRScan):** camera → **"QR Scanned!"** flash → checklist auto-fills → photo (photo-pickup.jpeg) → *"Item Handed Over!"*

### Scene 5 — Second Transition: the outcome exchange (alternating)

| T | Ori | Nati |
|---|---|---|
| 101.5 | **"A few days…"** | **"Later…"** |
| 104.5 | black | **"Nati made some beautiful pictures."** |
| 107 | **"Ori made some money."** | black |
| 109.5 | black | **"Time's up."** |
| 112 | **"Meeting up again."** | **"Meeting up again."** |

### Scene 6 — QR Return (Nati holds → shows QR; Ori receives → scans)

**Nati (QRDisplay):** QR → waiting banner *"Ori is checking…"* → **Impact Score card** (3.7→4.0) → **Rate the Experience**
**Ori (QRScan):** scan → checklist → photo (photo-return-ok.jpg) → **Impact Score card** (4.1→4.4) → rates **8s after Nati**

Rating screen: stars fill 1→5, review text types itself, auto-submits.

### Scene 7 — Third Transition (Both phones)

| Ori | Nati |
|---|---|
| **"but sometimes…"** | **"not everything goes as planned."** |

### Scene 8 — Alt Ending: Rewind + Dispute

- Rating screens flash back briefly → **rewind slide** (flickering scan lines + ◀◀ REW)
- **Ori:** lands on unchecked return checklist → **Report Damage Instead** → photo (photo-return-damaged.jpg) → types *"The lens is cracked"* → submits → **"Case Under Review"**
- **Nati:** waiting banner → **"Issue Reported — funds held in escrow"**

### Scene 9 — Final Black Screen (4 parts, alternating phones)

Both phones go black, then the message plays in four parts — Ori's phone sits
on the **LEFT**, Nati's on the **RIGHT**:

1. **Ori (left):** *"Your camera might be cracked."* → back to black
2. **Nati (right):** *"But it got out of the closet, saw new places, and made someone's day."* → back to black
3. **Ori (left):** *"That's more than most cameras ever get."* → back to black
4. **Nati (right):** *"Thank you."* → black → end

---

## Master Timeline (absolute seconds after countdown)

| T | Ori — LEFT (Lender) | Nati — RIGHT (Renter) |
|---|---|---|
| 0–2 | black | black |
| 2–5 | **"Find what you need."** | **"Locally."** |
| 5 | black (phone off) | Lock screen (clock) |
| 8 | black | Unlocks → HomeScreen |
| 9 | black | Taps Cameras (single tap ripple) |
| 11.8 | black | Swipe LEFT (Sony A7 III) |
| 14.5 | black | Swipe RIGHT → ItemDetail (Canon) |
| 19.5 | black | Scrolls down → taps **Rent** → calendar, dates picked |
| 28 | black (real push lands here) | **Request fires** → "Request sent. Now we wait." |
| 31.5 | black | black |
| 32 | **Lock screen + push notification** | black |
| 35.5 | ChatRoom (Rentals tab) | black |
| 39 | **Nati's profile** (Approve/Decline card) | black |
| 43.5 | "Approving…" (DB write) | black |
| 45 | "Approved." | black |
| 47 | black | black |
| 47.5 | black | Lock screen + approval push |
| 50.5 | black | Payment slide (tap on Pay ~52.9) |
| 53.4 | black | "Paying…" |
| 55.4 | black | "Payment secured. Held in escrow until return." |
| 58.5 | **"Now it's time to set up the meeting spot."** | black |
| 61.5 | MeetingPoint (loads, picks the spot) | black |
| 65 | (on map) | **Lock screen + push: "📍 Meeting Spot Set"** |
| 68.5 | (on map) | MeetingPoint confirm screen |
| ~71.6 | (on map) | Taps **Confirm Meeting Point** ✓ |
| 73 | **"A few days…"** | **"Later…"** (simultaneous) |
| 76 | **"The meet up."** | **"The meet up."** |
| **78.5** | **QRDisplay pickup (passive)** | **QRScan pickup (acts)** |
| 81.5 | — | "QR Scanned!" flash |
| 83 | → waiting banner | Checklist → photo |
| ~93.5–96.5 | "Handoff Complete!" | "Item Handed Over!" |
| 101.5 | **"A few days…"** | **"Later…"** (simultaneous) |
| 104.5 | black | **"Nati made some beautiful pictures."** |
| 107 | **"Ori made some money."** | black |
| 109.5 | black | **"Time's up."** |
| 112 | **"Meeting up again."** | **"Meeting up again."** |
| **114.5** | **QRScan return (acts)** | **QRDisplay return (passive)** |
| 117.5 | "QR Scanned!" flash | — |
| 119–128.5 | Checklist → photo → Impact Score | Waiting banner |
| ~130.8 | (idle on Impact card) | Impact Score card |
| **132.5** | (idle) | **Rates (first)** |
| **140.5** | **Rates (second)** | (thanks screen) |
| 155 | **"But sometimes…"** | black |
| 158 | black | **"Not everything goes as planned."** |
| 161 | Rating flashes back | Rating flashes back |
| 162.2 | ◀◀ REWIND (translucent — screens visible behind) | ◀◀ REWIND |
| 162.9 | flips back to ChatRoom | flips back to Home feed |
| 163.8 | settles on alt checklist | settles on alt QRDisplay |
| 165 | QRScan alt: unchecked checklist (acts) | QRDisplay alt: waiting (passive) |
| ~174.5 | Dispute submitted → "Case Under Review" | — |
| ~177.5 | — | "Issue Reported" banner |
| 182 | black | black |
| 183 | **Part 1** | black |
| 187 | black | black |
| 187.5 | black | **Part 2** |
| 192 | black | black |
| 192.5 | **Part 3** | black |
| 197 | black | black |
| 197.5 | black | **Part 4 — "Thank you."** |
| 202–204 | black → end | black → end |

---

## Demo Infrastructure

| File | Role |
|---|---|
| `src/contexts/DemoContext.tsx` | Master script, both roles, absolute timing via `sleepUntil()` |
| `src/components/DemoOverlay.tsx` | 🎬 FAB, countdown, theater slides (transition / notification / payment / rewind) |
| `src/screens/QRScanScreen.tsx` | Theater: scan-first → checklist → photo; alt-ending dispute |
| `src/screens/QRDisplayScreen.tsx` | Theater: QR-first → waiting banner → done; renter Impact Score |
| `src/screens/RatingScreen.tsx` | Star rating + review; theater auto-fill |
| `src/screens/ItemDetailScreen.tsx` | Responds to `demoRentSignal` — opens calendar, picks dates |
| `src/screens/HomeScreen.tsx` | Responds to `categoryOverride` + `demoSwipeSignal` |

## How to run the demo

```bash
# Start Metro
npx expo start

# In separate terminal — install on iPhone 17 if needed
npx expo run:ios --device "iPhone 17" --no-bundler

# Boot both simulators
xcrun simctl boot "iPhone 17 Pro" && xcrun simctl boot "iPhone 17"
```

Tap 🎬 on each phone → Run Lender Script (Ori) / Run Renter Script (Nati) within a few seconds of each other. Both countdowns target the **same wall-clock tick** (next 10s boundary), so the scripts start in perfect sync. If the two countdowns show different numbers (~10 apart), tap one to cancel and press Run again — it joins the other phone's tick.

**Phone placement for the final scene: Ori (iPhone 17 Pro) on the LEFT, Nati (iPhone 17) on the RIGHT.**

## Assets

| File | Used in |
|---|---|
| `assets/demo/photo-pickup.jpeg` | Nati's photo at pickup |
| `assets/demo/photo-return-ok.jpg` | Ori's photo at return (normal ending) |
| `assets/demo/photo-return-damaged.jpg` | Ori's dispute photo (alt ending) |

## Accounts

- Ori (Lender): orimash20@gmail.com / oppy72di
- Nati (Renter): pamnati592@gmail.com / natihagever8
