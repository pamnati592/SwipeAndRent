#!/usr/bin/env node
// Demo conductor — run in TWO terminal windows simultaneously:
//   node demo-conductor.mjs --role lender
//   node demo-conductor.mjs --role renter
//
// Both windows show synchronized cues. Press ENTER in each window to advance.
// The script announces each cue aloud via macOS "say".

import { execSync } from 'child_process';

const role = process.argv.includes('--role')
  ? process.argv[process.argv.indexOf('--role') + 1]
  : null;

if (!['lender', 'renter'].includes(role)) {
  console.error('Usage: node demo-conductor.mjs --role lender|renter');
  process.exit(1);
}

const isLender = role === 'lender';

// ─── ANSI colors ─────────────────────────────────────────────────────────────
const C = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  green:   '\x1b[32m',
  blue:    '\x1b[34m',
  yellow:  '\x1b[33m',
  cyan:    '\x1b[36m',
  magenta: '\x1b[35m',
  white:   '\x1b[37m',
  bgBlue:  '\x1b[44m',
  bgGreen: '\x1b[42m',
};
const accent  = isLender ? C.blue   : C.green;
const bgAccent = isLender ? C.bgBlue : C.bgGreen;

function say(text) {
  try { execSync(`say "${text.replace(/"/g, '')}"`); } catch {}
}

function clear() { process.stdout.write('\x1b[2J\x1b[H'); }

function header(stepNum, totalSteps) {
  const roleLabel = isLender ? '📱  LENDER — Ori' : '📱  RENTER — Nati';
  clear();
  console.log(`${bgAccent}${C.bold}  ${roleLabel}  ${C.reset}  ${C.dim}Step ${stepNum}/${totalSteps}${C.reset}\n`);
}

function printAction(icon, text, sub = '') {
  console.log(`${accent}${C.bold}${icon}  ${text}${C.reset}`);
  if (sub) console.log(`${C.dim}   ${sub}${C.reset}`);
}

function printOther(icon, text) {
  console.log(`${C.dim}${icon}  [Other phone] ${text}${C.reset}`);
}

function waitEnter() {
  return new Promise(resolve => {
    process.stdout.write(`\n${C.yellow}► Press ENTER when done…${C.reset}  `);
    process.stdin.setRawMode?.(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode?.(false);
      process.stdin.pause();
      resolve();
    });
  });
}

// ─── Demo steps ──────────────────────────────────────────────────────────────

const lenderSteps = [
  {
    icon: '🚀',
    action: 'Open the app',
    sub:    'You should be on the Home feed. Stay here — wait for the rental request.',
    other:  'Opening the app and browsing the feed',
    say:    'Lender: open the app and stay on the home screen',
  },
  {
    icon: '🔔',
    action: 'Watch for the push notification',
    sub:    '"Rental request for Canon EOS R5 from Nati" — tap it to open the chat.',
    other:  'Swiping right on the Canon R5 and sending a rental request',
    say:    'Watch for the push notification now',
  },
  {
    icon: '✅',
    action: 'In the chat — tap "Approve Rental"',
    sub:    'The green Approve button appears below the rental request message.',
    other:  'Waiting for your approval',
    say:    'Tap Approve Rental in the chat',
  },
  {
    icon: '📍',
    action: 'Tap "Set Meeting Point"',
    sub:    'Shows the map screen with Dizengoff Square. Confirm, then come back to chat.',
    other:  'Completing payment and getting the QR code',
    say:    'Tap Set Meeting Point to show the map',
  },
  {
    icon: '📷',
    action: 'Tap "Scan QR" in the chat',
    sub:    'Complete the condition checklist → take one condition photo → scan the renter\'s QR code.',
    other:  'Showing you the QR code — hold their phone steady',
    say:    'Tap Scan QR, complete the checklist, take a photo, then scan',
  },
  {
    icon: '🎉',
    action: 'Pickup confirmed!',
    sub:    'The status updates to Active. Item is officially handed over.',
    other:  'Sees "Handed over!" confirmation',
    say:    'Pickup is confirmed! The rental is now active.',
  },
  {
    icon: '↩️',
    action: 'Return: tap "Scan Return QR" in the chat',
    sub:    'Complete the return checklist → take condition photo → scan the renter\'s return QR.',
    other:  'Getting the return QR code',
    say:    'Tap Scan Return QR for the return flow',
  },
  {
    icon: '✅',
    action: 'Return confirmed — rental complete!',
    sub:    'Status updates to Completed. Payment is released from escrow.',
    other:  'Sees the "Rental Complete!" celebration screen with Impact Score',
    say:    'Return confirmed. The rental is complete!',
  },
];

const renterSteps = [
  {
    icon: '🚀',
    action: 'Open the app',
    sub:    'You\'re on the Home feed. Scroll to find the Canon EOS R5 card.',
    other:  'Opening the app on the Home tab',
    say:    'Renter: open the app and find the Canon R5 card',
  },
  {
    icon: '👆',
    action: 'Swipe RIGHT on "Canon EOS R5" → Tap "Rent"',
    sub:    'Select dates: tomorrow + 1 day (2 days total, ₪300). Then tap "Send Request".',
    other:  'Waiting — keeping the home screen visible',
    say:    'Swipe right on the Canon R5 and tap Rent, then send the request',
  },
  {
    icon: '⏳',
    action: 'Wait for Lender approval',
    sub:    'Watch the chat — the lender will approve shortly. You\'ll see the status change.',
    other:  'Reading your request and about to approve it',
    say:    'Wait for the lender to approve in the chat',
  },
  {
    icon: '💳',
    action: 'Tap "Pay & Get QR" in the chat',
    sub:    'Complete the condition checklist → take one condition photo → the QR code appears.',
    other:  'Tapping Set Meeting Point to show the map',
    say:    'Tap Pay and Get QR, complete the checklist and take a photo',
  },
  {
    icon: '📲',
    action: 'Hold up the QR code — let the Lender scan it',
    sub:    'Keep your phone screen bright and steady. The lender will point their camera at it.',
    other:  'Pointing their camera at your QR code',
    say:    'Hold up the QR code for the lender to scan',
  },
  {
    icon: '🎊',
    action: '"Handed over!" screen',
    sub:    'The rental is now Active. You have the camera — take great photos!',
    other:  'Sees "Pickup confirmed" on their screen',
    say:    'You see the Handed Over confirmation screen!',
  },
  {
    icon: '↩️',
    action: 'Return: tap "Get Return QR" in the chat',
    sub:    'Complete the return checklist → take condition photo → show the return QR code.',
    other:  'Opening the Scan Return QR screen',
    say:    'Tap Get Return QR for the return flow',
  },
  {
    icon: '🌿',
    action: '"Rental Complete!" — watch the Impact Score animate',
    sub:    'Your score rises from 4.1 → 4.4. ~3.5 kg CO₂ saved. Tap Done.',
    other:  'Confirming the return on their scanner screen',
    say:    'Watch your Impact Score animate up — rental complete!',
  },
];

const steps = isLender ? lenderSteps : renterSteps;
const totalSteps = steps.length;

// ─── Run ─────────────────────────────────────────────────────────────────────

async function run() {
  clear();
  const roleLabel = isLender ? 'LENDER — Ori' : 'RENTER — Nati';
  console.log(`${bgAccent}${C.bold}                                              ${C.reset}`);
  console.log(`${bgAccent}${C.bold}   🎬  UseIT Demo Conductor  ·  ${roleLabel}   ${C.reset}`);
  console.log(`${bgAccent}${C.bold}                                              ${C.reset}\n`);
  console.log(`${C.dim}Start BOTH terminal windows at the same time.`);
  console.log(`This window guides your role through each demo step.`);
  console.log(`Press ENTER after completing each action.${C.reset}\n`);
  console.log(`${C.yellow}► Press ENTER to begin…${C.reset}  `);

  await new Promise(resolve => {
    process.stdin.setRawMode?.(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode?.(false);
      process.stdin.pause();
      resolve();
    });
  });

  say(`Starting demo for ${isLender ? 'lender' : 'renter'}`);

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    header(i + 1, totalSteps);
    printAction(step.icon, step.action, step.sub);
    console.log();
    printOther('↔', step.other);
    say(step.say);
    await waitEnter();
  }

  clear();
  console.log(`${bgAccent}${C.bold}                              ${C.reset}`);
  console.log(`${bgAccent}${C.bold}   🎬  Demo Complete! Great job   ${C.reset}`);
  console.log(`${bgAccent}${C.bold}                              ${C.reset}\n`);
  say('Demo complete, great job!');
}

run().catch(err => { console.error(err.message); process.exit(1); });
