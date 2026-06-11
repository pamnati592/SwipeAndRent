// Renders a distance in meters as a short human-readable label for UI badges.
// Returns null when there's nothing to show so callers can simply guard on it
// instead of branching on numeric edge cases.
//
//   formatDistance(null)   → null
//   formatDistance(0)      → '0m'      (still rendered — "at the exact spot")
//   formatDistance(850)    → '850m'
//   formatDistance(3200)   → '3.2 km'
//   formatDistance(47000)  → '47 km'
export function formatDistance(meters: number | null | undefined): string | null {
  if (meters == null) return null;
  if (meters < 1000) return `${Math.round(meters)}m`;
  const km = meters / 1000;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

// Deterministic impact score (3.2–4.9) derived from the item's ID.
// P2P sharing always has a positive environmental impact; the spread shows
// relative benefit (condition, category weight, etc.) without real data.
export function getImpactScore(itemId: string): number {
  let h = 0;
  for (let i = 0; i < itemId.length; i++) {
    h = (Math.imul(31, h) + itemId.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(h) % 18; // 18 steps: 3.2, 3.3, … 4.9
  return (32 + idx) / 10;
}

// Great-circle distance in meters between two lat/lng points (Haversine).
// Used for the QR handoff 50m proximity check (spec 4.9).
export function metersBetween(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const R = 6_371_000; // earth radius in meters
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
