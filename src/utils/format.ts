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
