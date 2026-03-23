# CLAUDE.md – Swap&Rent Project

## ⚠️ MANDATORY – Read Before Every Response
**At the start of every conversation and before every answer, read the product spec file:**
`/Users/netanelmac/Desktop/פרוייקטים/SwapAndRent/אפיון מוצר swapAndRent.pdf`
This is the single source of truth for the project. Never rely on prior memory — always verify against this file.

---

## Role
You are a Senior Product Manager and Full-Stack Software Architect with expertise in P2P Marketplaces and mobile applications.

## Communication Rules
- **Language:** All responses, explanations, and documentation must be written in **Hebrew**
- **Structure:** Use headings, numbered lists, and bullet points
- **Style:** Always explain the "Why" behind technical decisions
- **Alignment:** End every response with a follow-up question to ensure we're aligned
- **Development:** Provide code with explanations, work step by step

---

## 1. Product Overview

**Swap&Rent** is a P2P Marketplace platform for sharing and renting equipment between peers, built as a Cross-Platform mobile application.

**Version:** 1.0 | **Date:** 18.03.2026
**Team:** אורי פרלמן | נתנאל פאם | מיכל פרבלוב | עדן בן ציון | ניצן זיתון

### Core Capabilities:
1. **Location-based matching** – GPS + Maps API to show results by proximity
2. **Swiping interface** – Interactive card swiping to manage item interactions
3. **Smart AI Agent** – Gemini LLM for personalized search and optimization
4. **Biometric security** – TouchID/FaceID + Escrow payments via Stripe

---

## 2. User Types

| User Type | Description | Permissions |
|---|---|---|
| User (Guest) | Basic registered user | View Feed + Search only |
| Verified User | Passed KYC + OTP + Biometric | Rentals, chat, full transactions |
| Admin | System manager | Content management, bans, verification approval, dispute resolution |

---

## 3. Functional Requirements

### 3.1 Platform (Section 4.1)
- iOS 16+, Android 12+
- React Native + Expo – single codebase for both platforms
- Supports: Camera, GPS + Location Services, Push Notifications
- Biometric Auth: FaceID / TouchID / Fingerprint
- SMS OTP via Supabase
- Minimum screen width 375px (iPhone SE)
- Clear Offline status indicator

### 3.2 User Authentication (Section 4.2)
- Login via: Google / Apple ID / Facebook / Email + password + Sizma
- Must accept Terms of Service and Privacy Policy before continuing
- Phone verification via OTP: 6 digits, sent within 30 seconds via SMS
- OTP valid for 10 minutes
- Without OTP → cannot continue registration
- Biometric (FaceID/TouchID) required for full access
- Without biometric → Read-only mode only

### 3.3 UX/UI (Section 4.3)
- Primary language: Hebrew, English fallback for technical terminology
- RTL layout on all app screens
- Dark Mode support on both platforms
- Max 3 taps to reach any core action
- Loading spinner on every action exceeding 1 second
- Toast / Confirmation on every completed action
- Screen transition time: max 300ms
- Minimum font size 14pt, buttons minimum 44×44px
- WCAG 2.1 Level AA accessibility compliance
- VoiceOver (iOS) + TalkBack (Android) support
- Unified Design System defined in Figma

### 3.4 Onboarding & Registration (Section 4.4)
- After phone verification → select primary role: Renter / Lender / Both
- Fill in personal details and basic location (city)
- Select 3+ interest categories (camping, DIY, photography, gaming, etc.)
- Opening screen shows previous login history as a carousel
- On completion → questionnaire creates user profile in DB

### 3.5 Home Screen & Swiping Feed (Section 4.5)
- Home screen shows algorithm-driven item cards
- Algorithm factors in user location and distance
- Card displays: main photo, item name, price, distance (km), rental rating, previous renter reviews
- **Swipe Left** → mark item as "not relevant", feed algorithm updated
- **Swipe Right** → open action panel: Rent / Buy / Wishlist / Open Chat
- Tap "Rent" → interactive panel with available calendar dates
- Tap "Buy" → only available if lender set a sale price
- Tap "Chat" → opens chat window with automatic opening message

### 3.6 Smart AI Search Agent (Section 4.6)
- Agent button displayed prominently on the home screen
- User enters free text + selects date range
- Agent generates a personal queue of relevant items filtered by availability
- Tap item in checklist → remove "not relevant" tag
- Tap item → opens personalized Swiping Feed matched to that item type
- After confirming selection → sends rental requests to all relevant lenders simultaneously

### 3.7 Item Upload & Verification (Section 4.7)
- Tap (+) → opens "Add New Item"
- Required fields: name, category, description, daily price, rental availability
- Optional field: for sale – set a sale price (if yes → Swipe Right includes "Buy" option)
- Photos taken via in-app camera only (not gallery) for verification purposes
- Item saved as Pending until verified (manual / AI)

### 3.8 Date Request & Business Approval (Section 4.8)
- Renter selects dates and sends request to lender
- Request logged in Transactions Table with Pending status
- Requested dates are "blocked" from the availability calendar
- Lender receives a notification in the chat window
- Lender can approve or reject (rejection → dates freed up again)
- After approval → renter has 24 hours to complete payment
- No payment within 24h → request and dates expire
- **Cancellation 24+ hours before** → full refund
- **Cancellation 4–24 hours before** → 75% refund
- **Cancellation less than 4 hours before** → no refund
- 75% of the transaction is automatically charged via Stripe Authorization at the start of the rental period, updated with actual time at end

### 3.9 Item Transfer & Return Verification (Section 4.9)
- App generates a unique QR code per transaction
- **Transfer:** Lender scans QR → transaction status updates to Active
- **Return:** New QR generated; lender scans → status updates to Completed
- Before QR scan → both parties confirm digital condition checklist
- Optional: both parties can photograph item condition during transfer/return
- System verifies both parties are within 50 meters of each other
- "Report Issue" button → transaction status set to Disputed

### 3.10 Payment Flow, Funds Management & Escrow (Section 4.10)
- Credit cards: Visa, MasterCard, Amex + Apple Pay / Google Pay
- All transactions processed via Stripe
- Payment held in Escrow until lender confirms item return
- In dispute → funds held until Admin decision
- Platform takes a service fee from each transaction
- Full price breakdown shown before final payment confirmation
- Cancellation up to 24 hours = full refund
- All cancellation/return flows managed through app with clear status updates

### 3.11 Profile & Management (Section 4.11)
- Notification center shows list of active chats sorted by time
- User can Block or Report another user
- Every user has two reputation scores:
  - **Lender Score** – based on item quality and response speed
  - **Renter Score** – based on return time and care for the item
- Rentals center shows all rentals: upcoming, active, past
- Item management screen: edit card content, availability, dates, ratings

---

## 4. Technical Requirements

### 4.1 Performance (Section 5.1)
| Metric | Target |
|---|---|
| Home screen load time | Max 2 seconds (Wi-Fi/4G) |
| AI agent response time | Max 5 seconds |
| Payment processing time | Max 3 seconds to Stripe confirmation |
| QR scan time | Max 3 seconds (reasonable lighting) |
| Uptime | 99.5%+ (monthly) |
| MVP capacity | 1,000+ concurrent users |

### 4.2 Security (Section 5.2)
- HTTPS/TLS 1.3 on all communication
- JWT on all API requests with 24-hour expiry
- Refresh Token with 30-day expiry
- Passwords hashed with bcrypt
- Payment details never stored in app → forwarded directly to Stripe
- RBAC: User / Verified User / Admin
- Biometric auth implemented via Supabase Storage with private access
- Rate limiting: lock after 5 failed login attempts
- GDPR: right to data deletion + right to data export

### 4.3 Database Schema (Section 5.3)

**Users Table:**
| Field | Type | Notes |
|---|---|---|
| UID | Primary Key | Unique identifier |
| Auth_Method | Enum | Google/Apple/Facebook/Email |
| Phone | String | Verified phone number |
| Bio_Verified | Boolean | True/False |
| Reputation_Score | Float | Calculated score |
| Interests_Array | JSON Array | User interest tags |

**Items Table:**
| Field | Type | Notes |
|---|---|---|
| Item_ID | Primary Key | Unique identifier |
| Owner_ID | FK → UID | Owner reference |
| Geo_Location | Coordinates (PostGIS) | Geographic location |
| Tags_Vector | Vector/Array | AI matching & search |
| Verification_Status | Enum | Draft / Pending / Live / Rented |
| Verification_Image_URL | Secure Bucket URL | Verification image |

**Transactions Table:**
| Field | Type | Notes |
|---|---|---|
| Transaction_ID | Primary Key | Unique identifier |
| Renter_ID | FK → UID | Renter reference |
| Item_ID | FK → Item_ID | Item reference |
| Start_Date, End_Date | DateTime | Agreed rental period |
| Status | Enum | Pending / Active / Completed / Disputed |

**Relations:**
- Users → Items: One-to-Many (user can list multiple items)
- Users → Transactions: One-to-Many (user can be renter in many transactions)
- Items → Transactions: One-to-Many (item can appear in transactions over time)

### 4.4 Tech Stack (Section 5.4)
| Layer | Technology | Reason |
|---|---|---|
| Mobile | React Native + Expo | Cross-platform iOS + Android, free, fast |
| Backend | Python + FastAPI | AI-ready, Async, ideal for integrations |
| Database | Supabase (PostgreSQL) | Auth + Storage + Realtime + GeoLocation in one place |
| GPS / Maps | Google Maps API | Free Tier, sufficient for project |
| Payments | Stripe (Test Mode) | Free for demos and testing |
| AI Agent | Gemini API (Google) | Free Tier, generous quota, smart search |
| Push Notifications | Firebase FCM | Free, easy integration |
| Hosting | Render.com | Free Tier, sufficient for final project |

---

## 5. Feature Prioritization (MoSCoW)

### Must-Have (required in MVP):
- User authentication (OTP + Biometric)
- Swiping feed (item card browsing)
- Stripe payment + checkout system
- GPS-based location search (Maps API)
- Escrow + QR transfer & return management
- Internal chat between users

### Should-Have (important but not blocking):
- AI Agent (smart search via Gemini)
- Social Impact Score

### Nice-To-Have (if time allows):
- Group rental support
- Community forum

---

## 6. Out of Scope – MVP Version

| Feature | Reason for Exclusion |
|---|---|
| Web (Desktop) | Mobile-only platform in first phase |
| Video Chat | High technical complexity; text chat is sufficient |
| Delivery services (lockers, Wolt) | Requires external integrations and business model change |
| Multiple language support | First version targets local market (Hebrew/English) |
| Impact Score | Deferred to future version after market feedback |
| Offline Mode | High infrastructure complexity; core features require network |

---

## 7. Glossary

| Term | Definition |
|---|---|
| P2P | Peer-to-Peer – transactions between individuals without intermediary |
| PRD | Product Requirements Document |
| MVP | Minimum Viable Product |
| OTP | One-Time Password – single-use authentication code |
| KYC | Know Your Customer – user identity verification process |
| Escrow | Funds held in trust until transaction is complete |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token – encrypted authentication token |
| GDPR | General Data Protection Regulation |
| RTL | Right-to-Left – text directionality |
| WCAG | Web Content Accessibility Guidelines |
| FCM | Firebase Cloud Messaging – Google Push notification service |
| QR Code | Quick Response Code – 2D barcode for fast scanning |
