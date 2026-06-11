// Demo seed script
// Usage:
//   node seed-demo.mjs            → fresh state  (items + photo, no transaction)
//   node seed-demo.mjs --stage qr → pre-seeded  (items + photo + paid transaction ready for QR handoff)
//
// Run once before recording. Re-run only if you need to reset.

import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://kfuiofokcvdrxkmdzrxp.supabase.co';
const ANON_KEY     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdWlvZm9rY3ZkcnhrbWR6cnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNjAxOTUsImV4cCI6MjA5MjczNjE5NX0.g8KoZvBwOE0MdRobiNW7Hw-kS2fHziXB8lMxBrqCzpI';
const PHOTO_PATH        = '/Users/perelmaister/Downloads/regular-camera-3.jpg';
const PHOTO_PATH_SONY   = '/Users/perelmaister/Downloads/regular-camera-2.jpeg';

const LENDER = { email: 'orimash20@gmail.com',  password: 'oppy72di'       };
const RENTER = { email: 'pamnati592@gmail.com', password: 'natihagever8'   };

const stage = process.argv.includes('--stage') ? process.argv[process.argv.indexOf('--stage') + 1] : 'fresh';

// ─── Auth helpers ────────────────────────────────────────────────────────────

async function signIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: ANON_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Login failed for ${email}: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function getMe(token) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function getProfile(token, userId) {
  const rows = await rest(token, 'GET', `profiles?id=eq.${userId}&select=id,full_name,city&limit=1`);
  return rows?.[0];
}

// ─── REST helper ─────────────────────────────────────────────────────────────

async function rest(token, method, path, body = null) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      apikey: ANON_KEY,
      Authorization: `Bearer ${token}`,
      Prefer: 'return=representation',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function rpc(token, fn, params) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── Storage upload ───────────────────────────────────────────────────────────

async function uploadPhoto(token, ownerId, filePath = PHOTO_PATH) {
  const imageBuffer = readFileSync(filePath);
  const path = `${ownerId}/item-${Date.now()}-0.jpg`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/item-images/${path}`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'image/jpeg',
    },
    body: imageBuffer,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Photo upload failed (${res.status}): ${text}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/item-images/${path}`;
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

async function cleanup(lenderToken, renterToken, lenderId, renterId) {
  // Delete transactions between these two users (must be done as each user due to RLS)
  const renterTxs = await rest(renterToken, 'GET', `transactions?renter_id=eq.${renterId}&select=id`);
  for (const tx of (renterTxs ?? [])) {
    await rest(renterToken, 'DELETE', `transactions?id=eq.${tx.id}`);
  }

  // Delete conversations (renter can delete their own due to policy)
  await rest(renterToken, 'DELETE', `conversations?renter_id=eq.${renterId}`);

  // Delete demo items owned by lender
  await rest(lenderToken, 'DELETE', `items?title=eq.Canon EOS R5&owner_id=eq.${lenderId}`);
  await rest(lenderToken, 'DELETE', `items?title=eq.Sony A7 III&owner_id=eq.${lenderId}`);
  await rest(lenderToken, 'DELETE', `items?title=eq.Coleman Camping Tent&owner_id=eq.${lenderId}`);
  await rest(lenderToken, 'DELETE', `items?title=eq.DeWalt Power Drill Set&owner_id=eq.${lenderId}`);
  await rest(lenderToken, 'DELETE', `items?title=eq.Sony PlayStation 5&owner_id=eq.${lenderId}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Sign in both users
  console.log('Signing in…');
  const [lenderToken, renterToken] = await Promise.all([
    signIn(LENDER.email, LENDER.password),
    signIn(RENTER.email, RENTER.password),
  ]);
  const [lenderUser, renterUser] = await Promise.all([getMe(lenderToken), getMe(renterToken)]);
  const [lenderProfile, renterProfile] = await Promise.all([
    getProfile(lenderToken, lenderUser.id),
    getProfile(renterToken, renterUser.id),
  ]);

  const lenderId = lenderUser.id;
  const renterId = renterUser.id;
  const city = lenderProfile?.city ?? 'Tel Aviv';

  console.log(`Lender: ${lenderProfile?.full_name} (${lenderId})`);
  console.log(`Renter: ${renterProfile?.full_name} (${renterId})`);

  // Clean previous demo data
  console.log('\nCleaning up previous demo data…');
  await cleanup(lenderToken, renterToken, lenderId, renterId);

  // Upload the camera photo
  console.log('\nUploading camera photo…');
  const photoUrl = await uploadPhoto(lenderToken, lenderId);
  console.log('✅ Photo uploaded');

  // Insert items
  console.log('\nInserting demo items…');

  const insertItem = async (item) => {
    const rows = await rest(lenderToken, 'POST', 'items', { owner_id: lenderId, ...item });
    if (!rows || rows.code) throw new Error(`Insert failed: ${JSON.stringify(rows)}`);
    return Array.isArray(rows) ? rows[0] : rows;
  };

  const camera = await insertItem({
    title:               'Canon EOS R5',
    category:            'photography',
    description:         'Professional full-frame mirrorless camera. 45MP sensor, 8K RAW video. Includes RF 24-105mm f/4L IS USM lens, 2 LP-E6NH batteries, dual charger, and a padded Lowepro case. Perfect for events, portraits, and travel.',
    daily_price:         150,
    city,
    verification_status: 'live',
    photos:              [photoUrl],
  });
  console.log('✅ Canon EOS R5 created:', camera?.id);

  // Second camera — inserted AFTER the Canon so it appears FIRST in the feed
  // (get_feed orders by distance, then created_at DESC). Nati swipes LEFT on
  // this one, then RIGHT on the Canon.
  console.log('\nUploading Sony photo…');
  const sonyPhotoUrl = await uploadPhoto(lenderToken, lenderId, PHOTO_PATH_SONY);
  const sony = await insertItem({
    title:               'Sony A7 III',
    category:            'photography',
    description:         'Full-frame mirrorless camera, 24MP. Includes FE 28-70mm kit lens, 2 batteries and charger. Great all-rounder for stills and video.',
    daily_price:         120,
    city,
    verification_status: 'live',
    photos:              [sonyPhotoUrl],
  });
  console.log('✅ Sony A7 III created:', sony?.id);

  await insertItem({
    title: 'Coleman Camping Tent', category: 'camping',
    description: '4-person weather-resistant tent. Includes rainfly, footprint, carry bag. Fits a queen air mattress.',
    daily_price: 45, city, verification_status: 'live', photos: [],
  });
  await insertItem({
    title: 'DeWalt Power Drill Set', category: 'diy',
    description: '20V MAX cordless drill/driver. 2 batteries, fast charger, 29-piece bit set and carry case.',
    daily_price: 30, city, verification_status: 'live', photos: [],
  });
  await insertItem({
    title: 'Sony PlayStation 5', category: 'gaming',
    description: 'PS5 + 2 DualSense controllers + 5 games (Spider-Man 2, God of War Ragnarök, Hogwarts Legacy, GT7, FC25).',
    daily_price: 60, city, verification_status: 'live', photos: [],
  });
  console.log('✅ 3 supporting items created (tent, drill, PS5)');

  // ── Pre-seeded QR stage ────────────────────────────────────────────────────
  if (stage === 'qr') {
    console.log('\nPre-seeding transaction at "paid" stage…');

    const tomorrow    = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dayAfter    = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];
    const totalPrice  = 300; // 2 days × 150₪

    // Step 1: Renter creates the rental request (pending)
    const requestResult = await rpc(renterToken, 'create_rental_request', {
      p_item_id:     camera.id,
      p_lender_id:   lenderId,
      p_start_date:  tomorrow,
      p_end_date:    dayAfter,
      p_total_price: totalPrice,
      p_message:     '📅 Rental request: Canon EOS R5 — Jun 10 → Jun 11 (2 days, ₪300)',
    });
    if (requestResult?.error) throw new Error(`create_rental_request failed: ${JSON.stringify(requestResult)}`);
    const convId = requestResult?.conversation_id;
    if (!convId) throw new Error(`No conversation_id returned: ${JSON.stringify(requestResult)}`);

    // Fetch the transaction ID that the RPC created in this conversation
    const txRows = await rest(renterToken, 'GET', `transactions?conversation_id=eq.${convId}&renter_id=eq.${renterId}&select=id&limit=1`);
    const txId = txRows?.[0]?.id;
    if (!txId) throw new Error(`Could not find transaction for conversation ${convId}`);
    console.log('  ✅ Rental request created (pending):', txId);

    // Step 2: Lender approves (pending → approved)
    const approveRows = await rest(lenderToken, 'PATCH', `transactions?id=eq.${txId}`, {
      status:      'approved',
      approved_at: new Date().toISOString(),
    });
    if (!approveRows || (Array.isArray(approveRows) && approveRows.length === 0)) {
      console.warn('  ⚠️  Approve may have failed (check RLS). Trying to continue…');
    } else {
      console.log('  ✅ Lender approved the request');
    }

    // Step 3: Renter marks as paid (approved → paid)
    await rest(renterToken, 'PATCH', `transactions?id=eq.${txId}&status=eq.approved`, {
      status: 'paid',
    });
    console.log('  ✅ Renter paid — transaction is now in "paid" state');

    // Add a lender message confirming approval
    if (convId) {
      await rest(lenderToken, 'POST', 'messages', {
        conversation_id: convId,
        sender_id:       lenderId,
        content:         '✅ Rental approved! See you at Dizengoff Square, Tel Aviv.',
        transaction_id:  txId,
      });
      await rest(renterToken, 'POST', 'messages', {
        conversation_id: convId,
        sender_id:       renterId,
        content:         '🎉 Payment done! Ready when you are.',
        transaction_id:  txId,
      });
      console.log('  ✅ Chat messages added');
    }

    console.log(`\n✅ Stage "qr" ready. Transaction ID: ${txId}`);
    console.log('   Both phones: open the app → Chats → Canon EOS R5 chat');
    console.log('   Lender: "Scan QR" button is visible in chat');
    console.log('   Renter: "Get QR" button is visible in chat');
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n✅ Seed complete.');
  console.log('\n📋 Demo accounts:');
  console.log(`  Lender → ${LENDER.email}  (${lenderProfile?.full_name})`);
  console.log(`  Renter → ${RENTER.email}  (${renterProfile?.full_name})`);
  console.log('\n📦 Items created: Canon EOS R5 · Sony A7 III (both with photos) · Coleman Tent · DeWalt Drill · PS5');
  if (stage !== 'qr') {
    console.log('\n💡 Tip: run with --stage qr to also pre-seed a paid transaction for the QR handoff stage');
  }
}

main().catch(err => { console.error('\n❌', err.message); process.exit(1); });
