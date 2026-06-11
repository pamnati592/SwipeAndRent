import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../navigation/navigationRef';
import { supabase } from '../services/supabase';

export type DemoRole = 'lender' | 'renter';

export type TheaterSlide =
  | { type: 'transition'; text: string }
  | { type: 'lockscreen'; notif?: { title: string; body: string } }
  | { type: 'notification'; title: string; body: string }
  | { type: 'payment'; itemTitle: string; amount: string; serviceFee: string; total: string }
  | { type: 'score'; before: number; after: number; delta: string; co2?: string }
  | { type: 'rewind' };

export interface DemoState {
  role: DemoRole | null;
  step: string;
  isActive: boolean;
  theaterSlide: TheaterSlide | null;
  categoryOverride: string | null;
  demoSwipeSignal: { dir: 'left' | 'right'; ts: number } | null;
  demoRentSignal: { start: string; end: string; ts: number } | null;
  // Names a button in a real screen that should flash a visible "tap" dot
  demoTapTarget: { target: string; ts: number } | null;
}

interface DemoContextValue {
  demoState: DemoState;
  startDemo: (role: DemoRole) => Promise<void>;
  stopDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const sleepUntil = (t0: number, target: number) => sleep(Math.max(0, target - (Date.now() - t0)));

export const DEMO_LAT = 32.0853;
export const DEMO_LNG = 34.7818;

const THEATER_TX_ID = '00000000-0000-0000-0000-000000000001';

const BLACK = ''; // empty transition slide = plain black screen

// Closing message — 4 parts alternating between the phones with black between:
// part 1 Ori (LEFT) → part 2 Nati (RIGHT) → part 3 Ori (LEFT) → part 4 Nati.
const FINAL_PART_1 = 'Your camera\nmight be cracked.';
const FINAL_PART_2 = 'But it got out of the closet,\nsaw new places,\nand made someone’s day.';
const FINAL_PART_3 = 'That’s more than\nmost cameras\never get.';
const FINAL_PART_4 = 'Thank you.';

const CHATS_SCREENS = new Set(['ChatRoom', 'QRDisplay', 'QRScan', 'MeetingPoint', 'Rating', 'ConversationsList']);
const HOME_SCREENS  = new Set(['HomeMain', 'ItemDetail', 'PublicProfile']);

function nav(name: string, params?: Record<string, unknown>) {
  if (!navigationRef.isReady()) return;
  if (CHATS_SCREENS.has(name)) {
    navigationRef.dispatch(CommonActions.navigate({ name: 'Chats', params: { screen: name, params } }));
  } else if (HOME_SCREENS.has(name)) {
    navigationRef.dispatch(CommonActions.navigate({ name: 'HomeStack', params: { screen: name, params } }));
  } else {
    navigationRef.dispatch(CommonActions.navigate({ name, params }));
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [demoState, setDemoState] = useState<DemoState>({
    role: null, step: '', isActive: false,
    theaterSlide: null, categoryOverride: null, demoSwipeSignal: null, demoRentSignal: null, demoTapTarget: null,
  });
  const stopRef = useRef(false);

  function patch(partial: Partial<DemoState>) {
    setDemoState(prev => ({ ...prev, ...partial }));
  }

  function showSlide(slide: TheaterSlide) { patch({ theaterSlide: slide }); }
  function tap(target: string) { patch({ demoTapTarget: { target, ts: Date.now() } }); }
  function black() { showSlide({ type: 'transition', text: BLACK }); }
  function clearSlide() { patch({ theaterSlide: null }); }

  function stopDemo() {
    stopRef.current = true;
    setDemoState({ role: null, step: '', isActive: false, theaterSlide: null, categoryOverride: null, demoSwipeSignal: null, demoRentSignal: null, demoTapTarget: null });
  }

  // ─── Master timeline (absolute ms from t0, both scripts) ──────────────────
  // ATTENTION RULE: at any moment exactly ONE phone holds the viewer's eye.
  // When one phone shows a caption, the other is plain black. Time transitions
  // play sequentially (Ori's line first, then Nati's), never simultaneously.
  //
  //   T=0–2      Both phones black ("off")
  //   T=2        Title cards: Ori "Find what you need." · Nati "Locally."
  //   T=5        Ori → black ("off") · Nati → iPhone lock screen
  //   T=8–28     Nati ACTIVE: browse → swipes → calendar → request sent
  //   T=32       Ori "wakes": lock screen + push notification
  //   T=35.5–47  Ori ACTIVE: chat → View Profile → approve from profile
  //   T=47.5–58.5 Nati ACTIVE: approval push → payment → "Paying…" → escrow
  //   T=58.5     Ori: "Now it's time to set up the meeting spot." → map at 61.5
  //   T=65       Nati push "Meeting Spot Set" → confirm screen 68.5 → confirms ~71.6
  //   T=78.5     QR pickup mount (Ori passively shows QR / Nati acts)
  //   T=101.5–112 "A few days… / Later…" → Nati's pictures → Ori's money → "Time's up."
  //   T=114.5    QR return mount (Nati passively shows QR / Ori acts)
  //   T=132.5    Nati rates · T=140.5 Ori rates
  //   T=162.9    Alt ending mount under rewind (only Ori acts)
  //   T=182–204  4-part alternating closing message (ends on Nati's "Thank you.")

  // ─── Renter script (Nati — RIGHT phone) ───────────────────────────────────
  async function runRenterScript(userId: string) {
    const t0 = Date.now();

    patch({ step: 'Opening…' });
    black(); // both phones start "off"

    // Under the black: pop BOTH tab stacks to their roots, so screens left
    // from a previous demo run can never flash during this run's transitions.
    await sleepUntil(t0, 300);
    nav('ConversationsList');
    await sleepUntil(t0, 900);
    nav('HomeMain');

    // Pre-fetch Canon EOS R5 in background so we can navigate reliably
    const itemFetch = supabase
      .from('items').select('*').eq('title', 'Canon EOS R5')
      .eq('verification_status', 'live').eq('is_hidden', false)
      .order('created_at', { ascending: false }).limit(1);

    // T=2000 — title card
    await sleepUntil(t0, 2000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Locally.' });
    patch({ step: 'Title card…' });

    // T=5000 — phone "turns on": lock screen
    await sleepUntil(t0, 5000);
    if (stopRef.current) return;
    showSlide({ type: 'lockscreen' });
    patch({ step: 'Unlocking…' });

    // T=8000 — unlock into the app
    await sleepUntil(t0, 8000);
    if (stopRef.current) return;
    clearSlide();
    patch({ step: 'Browsing feed…' });

    // T=9000 — tap Cameras category
    await sleepUntil(t0, 9000);
    if (stopRef.current) return;
    patch({ step: 'Browsing Cameras…', categoryOverride: 'photography' });

    await sleepUntil(t0, 11000);
    if (stopRef.current) return;
    patch({ categoryOverride: null });

    // T=11800 — swipe LEFT on the Sony A7 III (skip)
    await sleepUntil(t0, 11800);
    if (stopRef.current) return;
    patch({ step: 'Skipping the Sony…', demoSwipeSignal: { dir: 'left', ts: Date.now() } });

    await sleepUntil(t0, 13300);
    if (stopRef.current) return;
    patch({ demoSwipeSignal: null });

    // T=14500 — swipe RIGHT on the Canon EOS R5
    await sleepUntil(t0, 14500);
    if (stopRef.current) return;
    patch({ step: 'Opening Canon EOS R5…', demoSwipeSignal: { dir: 'right', ts: Date.now() } });

    await sleepUntil(t0, 15100);
    if (stopRef.current) return;
    patch({ demoSwipeSignal: null });
    const { data: itemRows } = await itemFetch;
    const demoItem = itemRows?.[0] ?? null;
    if (demoItem) nav('ItemDetail', { item: demoItem });

    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

    // T=19500 — ItemDetail scrolls to the bottom, visibly taps "Rent",
    // the calendar opens and the dates get picked (~7.5s total)
    await sleepUntil(t0, 19500);
    if (stopRef.current) return;
    patch({ step: 'Picking rental dates…', demoRentSignal: { start: tomorrow, end: dayAfter, ts: Date.now() } });

    // T=28000 — request goes out NOW (after the dates were picked!), so Ori's
    // real push notification arrives only once the viewer saw the calendar.
    await sleepUntil(t0, 28000);
    if (stopRef.current) return;
    if (demoItem) {
      supabase.rpc('create_rental_request', {
        p_item_id:     demoItem.id,
        p_lender_id:   demoItem.owner_id,
        p_start_date:  tomorrow,
        p_end_date:    dayAfter,
        p_total_price: 300,
        p_message:     '📅 Rental request: Canon EOS R5 — 2 days, ₪300',
      }).then(() => {}); // fire and forget — Ori reads it at T=35.5
    }
    showSlide({ type: 'transition', text: 'Request sent.\nNow we wait.' });
    patch({ step: 'Waiting for approval…', demoRentSignal: null });

    // T=31500 — go black: attention moves to Ori's phone
    await sleepUntil(t0, 31500);
    if (stopRef.current) return;
    black();

    // T=47500 — Nati's phone lights up: push notification — Ori approved
    await sleepUntil(t0, 47500);
    if (stopRef.current) return;
    showSlide({
      type: 'lockscreen',
      notif: {
        title: '✅ Request Approved',
        body: 'Ori approved your Canon EOS R5 rental.\nComplete the payment to lock it in.',
      },
    });
    patch({ step: 'Rental approved!' });

    // T=50500 — tap the notification → payment confirmation
    await sleepUntil(t0, 50500);
    if (stopRef.current) return;
    showSlide({ type: 'payment', itemTitle: 'Canon EOS R5', amount: '₪300', serviceFee: '₪24', total: '₪324' });
    patch({ step: 'Reviewing payment…' });

    // T=53400 — paying
    await sleepUntil(t0, 53400);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Paying…' });
    patch({ step: 'Paying…' });

    // T=55400 — escrow confirmation
    await sleepUntil(t0, 55400);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Payment secured.\nHeld in escrow until return.' });
    patch({ step: 'Paid — escrow holding funds.' });

    // T=58500 — go black: Ori announces and sets the meeting spot
    await sleepUntil(t0, 58500);
    if (stopRef.current) return;
    black();

    // T=65000 — push: Ori set the meeting spot
    await sleepUntil(t0, 65000);
    if (stopRef.current) return;
    showSlide({
      type: 'lockscreen',
      notif: {
        title: '📍 Meeting Spot Set',
        body: 'Ori suggested Dizengoff Square\nfor the pickup. Tap to review.',
      },
    });
    patch({ step: 'Meeting spot suggested…' });

    // T=68000 — still under the lock-screen slide: pop the Chats stack to its
    // root so the upcoming push can never reveal a screen from a previous run.
    await sleepUntil(t0, 68000);
    if (stopRef.current) return;
    nav('ConversationsList');

    // T=68500 — confirm screen: Nati reviews and confirms the spot (~T=71.6)
    await sleepUntil(t0, 68500);
    if (stopRef.current) return;
    clearSlide();
    nav('MeetingPoint', { renterName: 'Nati', lenderName: 'Ori', confirmMode: true, theaterMode: true });
    patch({ step: 'Confirming meeting spot…' });

    // T=73000 — time transition (simultaneous: Ori shows "a few days…")
    await sleepUntil(t0, 73000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Later…' });
    patch({ step: 'Time passing…' });

    // T=76000 — chapter card
    await sleepUntil(t0, 76000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'The meet up.' });

    // T=78500 — QRScan pickup under the slide  [Nati ACTS; Ori passively shows QR]
    await sleepUntil(t0, 78500);
    if (stopRef.current) return;
    nav('QRScan', {
      transactionId: THEATER_TX_ID, phase: 'pickup', itemTitle: 'Canon EOS R5',
      otherName: 'Ori', demoMode: true, theaterMode: true,
    });

    // T=79500 — clear slide, scanner visible (auto-runs ~15s)
    await sleepUntil(t0, 79500);
    if (stopRef.current) return;
    clearSlide();
    patch({ step: 'QR pickup: scanning Ori’s code…' });

    // T=101500 — time transition (simultaneous: Ori shows "after the rental…")
    await sleepUntil(t0, 101500);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Later…' });
    patch({ step: 'Rental over…' });

    // T=104500 — Nati's outcome
    await sleepUntil(t0, 104500);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Nati made some\nbeautiful pictures.' });

    // T=107000 — black while Ori's outcome shows
    await sleepUntil(t0, 107000);
    if (stopRef.current) return;
    black();

    // T=109500 — time's up
    await sleepUntil(t0, 109500);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Time’s up.' });

    // T=112000 — chapter card
    await sleepUntil(t0, 112000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Meeting up again.' });

    // T=114500 — QRDisplay return under the slide  [Nati PASSIVE; Ori acts]
    await sleepUntil(t0, 114500);
    if (stopRef.current) return;
    nav('QRDisplay', {
      transactionId: THEATER_TX_ID, phase: 'return', itemTitle: 'Canon EOS R5',
      otherName: 'Ori', demoMode: true, theaterMode: true, demoLat: DEMO_LAT, demoLng: DEMO_LNG,
    });

    // T=115500 — clear slide, QR visible (waiting → done + Impact Score ~T=113)
    await sleepUntil(t0, 115500);
    if (stopRef.current) return;
    clearSlide();
    patch({ step: 'QR return: showing code…' });

    // T=132500 — Nati rates FIRST (Ori idle on his Impact Score card)
    await sleepUntil(t0, 132500);
    if (stopRef.current) return;
    nav('Rating', {
      itemTitle: 'Canon EOS R5', otherName: 'Ori', theaterMode: true,
      prefillText: 'Amazing camera and a super smooth pickup. Would rent from Ori again! 📷',
    });
    patch({ step: 'Rating the experience…' });

    // T=155000 — scene 7, SEQUENTIAL: Ori "but sometimes…" first
    await sleepUntil(t0, 155000);
    if (stopRef.current) return;
    black();
    patch({ step: 'Alt ending…' });

    // T=158000 — Nati's turn: "not everything goes as planned."
    await sleepUntil(t0, 158000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Not everything\ngoes as planned.' });

    // T=161000 — clear: rating screen flashes back briefly
    await sleepUntil(t0, 161000);
    if (stopRef.current) return;
    clearSlide();

    // T=162200 — rewind effect
    await sleepUntil(t0, 162200);
    if (stopRef.current) return;
    showSlide({ type: 'rewind' });

    // T=162900 — rewind beat 1: flip back to the feed
    await sleepUntil(t0, 162900);
    if (stopRef.current) return;
    nav('HomeMain');

    // T=163800 — rewind beat 2: settle on the alt-ending screen
    await sleepUntil(t0, 163800);
    if (stopRef.current) return;
    nav('QRDisplay', {
      transactionId: 'theater-tx-alt', phase: 'return', itemTitle: 'Canon EOS R5',
      otherName: 'Ori', demoMode: true, theaterMode: true, altEnding: true,
      demoLat: DEMO_LAT, demoLng: DEMO_LNG,
    });

    // T=165000 — clear rewind: waiting banner while Ori files the dispute
    await sleepUntil(t0, 165000);
    if (stopRef.current) return;
    clearSlide();
    patch({ step: 'Waiting while Ori inspects…' });

    // QRDisplay altEnding flips to "Issue Reported" ~T=157
    await sleepUntil(t0, 180000);
    if (stopRef.current) return;
    patch({ step: '⚖️ Issue reported. Funds held in escrow.' });

    // ── Scene 9 — 3-part alternating ending (Nati = RIGHT phone: part 2) ──
    await sleepUntil(t0, 182000);
    if (stopRef.current) return;
    black();
    patch({ step: 'The end.' });

    // T=187500 — part 2 on Nati (part 1 played on Ori at 163.5–167.5)
    await sleepUntil(t0, 187500);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: FINAL_PART_2 });

    // T=192000 — back to black (part 3 plays on Ori)
    await sleepUntil(t0, 192000);
    if (stopRef.current) return;
    black();

    // T=197500 — part 4 on Nati: thank you
    await sleepUntil(t0, 197500);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: FINAL_PART_4 });

    // T=202000 — black, then finish
    await sleepUntil(t0, 202000);
    if (stopRef.current) return;
    black();
    await sleepUntil(t0, 204000);
    if (stopRef.current) return;
    clearSlide();
  }

  // ─── Lender script (Ori — LEFT phone) ─────────────────────────────────────
  async function runLenderScript(userId: string) {
    const t0 = Date.now();

    patch({ step: 'Opening…' });
    black(); // both phones start "off"

    // Under the black: pop BOTH tab stacks to their roots, so screens left
    // from a previous demo run can never flash during this run's transitions.
    await sleepUntil(t0, 300);
    nav('ConversationsList');
    await sleepUntil(t0, 900);
    nav('HomeMain');

    // T=2000 — title card
    await sleepUntil(t0, 2000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Find what you need.' });
    patch({ step: 'Title card…' });

    // T=5000 — phone goes "off" (black) while Nati browses
    await sleepUntil(t0, 5000);
    if (stopRef.current) return;
    black();
    patch({ step: 'Phone off — Nati is browsing…' });

    // T=32000 — phone "wakes" with the push notification on the lock screen
    await sleepUntil(t0, 32000);
    if (stopRef.current) return;
    showSlide({
      type: 'lockscreen',
      notif: {
        title: '📬 New Rental Request',
        body: 'Nati wants to rent your Canon EOS R5 · 2 days · ₪300',
      },
    });
    patch({ step: 'Request received!' });

    // T=35000 — still under the lock-screen slide: pop the Chats stack to its
    // root so the upcoming push can never reveal a screen from a previous run.
    await sleepUntil(t0, 35000);
    if (stopRef.current) return;
    nav('ConversationsList');

    // T=35500 — tap the notification → ChatRoom (fetch pending tx first)
    await sleepUntil(t0, 35500);
    if (stopRef.current) return;

    const { data: txRows } = await supabase
      .from('transactions')
      .select('id, conversation_id, renter_id')
      .eq('lender_id', userId).eq('status', 'pending')
      .order('created_at', { ascending: false }).limit(1);
    const tx = txRows?.[0];
    const convId: string = tx?.conversation_id ?? 'theater-conv';
    const txId:   string = tx?.id              ?? THEATER_TX_ID;
    const renterName = tx?.renter_id
      ? (await supabase.from('profiles').select('full_name').eq('id', tx.renter_id).single()).data?.full_name ?? 'Nati'
      : 'Nati';

    if (stopRef.current) return;
    clearSlide();
    nav('ChatRoom', { conversationId: convId, itemTitle: 'Canon EOS R5', otherUserName: renterName, initialTab: 'rental', onlyTransactionId: txId });
    patch({ step: 'Reading request in chat…' });

    // T=38400 — visible tap on "View Nati's profile"
    await sleepUntil(t0, 38400);
    if (stopRef.current) return;
    tap('chat-view-profile');

    // T=39000 — open the profile
    await sleepUntil(t0, 39000);
    if (stopRef.current) return;
    nav('PublicProfile', {
      userId: tx?.renter_id ?? '', userName: renterName,
      approveTransactionId: txId,
      requestSummary: '📅 Canon EOS R5 — 2 days, ₪300',
    });
    patch({ step: 'Reviewing Nati’s profile…' });

    // T=42900 — visible tap on Approve in the profile card
    await sleepUntil(t0, 42900);
    if (stopRef.current) return;
    tap('profile-approve');

    // T=43500 — approve from the profile (real write under the slide)
    await sleepUntil(t0, 43500);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Approving…' });
    if (tx?.id) {
      await supabase.from('transactions')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', tx.id);
    }

    // T=45000 — approved
    await sleepUntil(t0, 45000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Approved.' });
    patch({ step: 'Waiting for payment…' });

    // T=47000 — go black: attention moves to Nati's payment
    await sleepUntil(t0, 47000);
    if (stopRef.current) return;
    black();

    // T=58500 — announce the meeting-point step (Nati is black)
    await sleepUntil(t0, 58500);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Now it’s time to set up\nthe meeting spot.' });
    patch({ step: 'Setting meeting point…' });

    // T=61500 — MeetingPoint: Ori sets the spot (Nati gets the push at T=65)
    await sleepUntil(t0, 61500);
    if (stopRef.current) return;
    clearSlide();
    nav('MeetingPoint', { renterName, lenderName: 'Ori Perelman', confirmMode: false });
    patch({ step: 'At meeting point…' });

    // T=73000 — time transition (simultaneous: Nati shows "later…")
    await sleepUntil(t0, 73000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'A few days…' });
    patch({ step: 'Time passing…' });

    // T=76000 — chapter card
    await sleepUntil(t0, 76000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'The meet up.' });

    // T=78500 — QRDisplay pickup under the slide (Ori PASSIVELY shows the QR)
    await sleepUntil(t0, 78500);
    if (stopRef.current) return;
    nav('QRDisplay', {
      transactionId: txId, phase: 'pickup', itemTitle: 'Canon EOS R5',
      otherName: 'Nati', demoMode: true, theaterMode: true, demoLat: DEMO_LAT, demoLng: DEMO_LNG,
    });

    // T=79500 — clear, QR visible (Nati scans → waiting → done ~T=85)
    await sleepUntil(t0, 79500);
    if (stopRef.current) return;
    clearSlide();
    patch({ step: 'QR pickup: showing code…' });

    // T=101500 — time transition (simultaneous: Nati shows "finished.")
    await sleepUntil(t0, 101500);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'A few days…' });
    patch({ step: 'Time passing…' });

    // T=104500 — black while Nati's outcome shows
    await sleepUntil(t0, 104500);
    if (stopRef.current) return;
    black();

    // T=107000 — Ori's outcome
    await sleepUntil(t0, 107000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Ori made\nsome money.' });

    // T=109500 — black while Nati's "Time's up." shows
    await sleepUntil(t0, 109500);
    if (stopRef.current) return;
    black();

    // T=112000 — chapter card
    await sleepUntil(t0, 112000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'Meeting up again.' });

    // T=114500 — QRScan return under the slide (Ori ACTS; Nati passively shows QR)
    await sleepUntil(t0, 114500);
    if (stopRef.current) return;
    nav('QRScan', {
      transactionId: txId, phase: 'return', itemTitle: 'Canon EOS R5',
      otherName: 'Nati', demoMode: true, theaterMode: true,
    });

    // T=115500 — clear, scanner visible (auto-runs ~15s → Impact Score ~T=111)
    await sleepUntil(t0, 115500);
    if (stopRef.current) return;
    clearSlide();
    patch({ step: 'QR return: scanning Nati’s code…' });

    // T=140500 — Ori rates SECOND (8s after Nati)
    await sleepUntil(t0, 140500);
    if (stopRef.current) return;
    nav('Rating', {
      itemTitle: 'Canon EOS R5', otherName: 'Nati', theaterMode: true,
      prefillText: 'Great renter — returned the camera right on time and in perfect shape. 👌',
    });
    patch({ step: 'Rating the experience…' });

    // T=155000 — scene 7, SEQUENTIAL: Ori's line first
    await sleepUntil(t0, 155000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: 'But sometimes…' });
    patch({ step: 'Alt ending…' });

    // T=158000 — go black: Nati shows his line
    await sleepUntil(t0, 158000);
    if (stopRef.current) return;
    black();

    // T=161000 — clear: rating screen flashes back briefly
    await sleepUntil(t0, 161000);
    if (stopRef.current) return;
    clearSlide();

    // T=162200 — rewind effect
    await sleepUntil(t0, 162200);
    if (stopRef.current) return;
    showSlide({ type: 'rewind' });

    // T=162900 — rewind beat 1: flip back to the chat
    await sleepUntil(t0, 162900);
    if (stopRef.current) return;
    nav('ChatRoom', { conversationId: convId, itemTitle: 'Canon EOS R5', otherUserName: renterName, initialTab: 'rental', onlyTransactionId: txId });

    // T=163800 — rewind beat 2: settle on the alt-ending checklist
    await sleepUntil(t0, 163800);
    if (stopRef.current) return;
    nav('QRScan', {
      transactionId: 'theater-tx-alt', phase: 'return', itemTitle: 'Canon EOS R5',
      otherName: 'Nati', demoMode: true, theaterMode: true, altEnding: true,
    });

    // T=165000 — clear rewind: checklist stays unchecked → Report Damage
    await sleepUntil(t0, 165000);
    if (stopRef.current) return;
    clearSlide();
    patch({ step: 'Alt ending: reporting damage…' });

    // Dispute submitted ~T=155 → "Case Under Review" (modal closes ~T=162)
    await sleepUntil(t0, 180000);
    if (stopRef.current) return;
    patch({ step: '⚖️ Dispute submitted. Funds held in escrow.' });

    // ── Scene 9 — 3-part alternating ending (Ori = LEFT phone: parts 1 & 3) ──
    await sleepUntil(t0, 182000);
    if (stopRef.current) return;
    black();
    patch({ step: 'The end.' });

    // T=183000 — part 1 on Ori
    await sleepUntil(t0, 183000);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: FINAL_PART_1 });

    // T=187000 — back to black (part 2 plays on Nati at 168–172.5)
    await sleepUntil(t0, 187000);
    if (stopRef.current) return;
    black();

    // T=192500 — part 3 on Ori
    await sleepUntil(t0, 192500);
    if (stopRef.current) return;
    showSlide({ type: 'transition', text: FINAL_PART_3 });

    // T=197000 — black through Nati's "Thank you.", then finish
    await sleepUntil(t0, 197000);
    if (stopRef.current) return;
    black();
    await sleepUntil(t0, 204000);
    if (stopRef.current) return;
    clearSlide();
  }

  async function startDemo(role: DemoRole) {
    stopRef.current = false;
    setDemoState({ role, step: 'Starting…', isActive: true, theaterSlide: null, categoryOverride: null, demoSwipeSignal: null, demoRentSignal: null, demoTapTarget: null });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { patch({ step: '❌ Not logged in', isActive: false }); return; }

    try {
      if (role === 'renter') await runRenterScript(session.user.id);
      else                    await runLenderScript(session.user.id);
    } catch (e: any) {
      patch({ step: `❌ ${e.message ?? 'Unknown error'}` });
    } finally {
      setDemoState(prev => ({ ...prev, isActive: false }));
    }
  }

  return (
    <DemoContext.Provider value={{ demoState, startDemo, stopDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoContext() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemoContext must be used inside DemoProvider');
  return ctx;
}
