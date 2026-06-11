#!/bin/bash
# Opens two side-by-side Terminal windows — one for Lender, one for Renter.
# Run this script once before recording with Rotato.

DIR="$(cd "$(dirname "$0")" && pwd)"

osascript <<EOF
tell application "Terminal"
  activate

  -- Lender window
  do script "cd '${DIR}' && node demo-conductor.mjs --role lender"
  set w1 to front window
  set bounds of w1 to {0, 40, 960, 780}
  set background color of (selected tab of w1) to {14392, 21845, 65535}

  -- Renter window
  do script "cd '${DIR}' && node demo-conductor.mjs --role renter"
  set w2 to front window
  set bounds of w2 to {960, 40, 1920, 780}
  set background color of (selected tab of w2) to {14392, 52428, 14392}
end tell
EOF

echo "✅ Both conductor windows opened."
echo "   Position the two Simulator windows above the terminal windows."
echo "   Press ENTER in both terminal windows at the same time to start."
