// ── Pawgress Format Utils ─────────────────────────────────────────────────────

export function fmtVolume(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)} t`;
  return `${v} kg`;
}

export function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}min`;
  return `${m} Min`;
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
}
