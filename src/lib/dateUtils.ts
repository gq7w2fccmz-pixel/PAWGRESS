/**
 * Zentrale Datums-Utilities für Pawgress
 * Fix #1 + #8: Alle Datumsberechnungen verwenden lokale Zeit, nicht UTC
 */

/**
 * Heutiges Datum im Format YYYY-MM-DD (lokale Zeitzone).
 * Ersetzt überall: new Date().toISOString().split("T")[0]
 */
export function getTodayLocal(): string {
  return new Date().toLocaleDateString("en-CA");
}

/**
 * Gestiges Datum im Format YYYY-MM-DD (lokale Zeitzone).
 */
export function getYesterdayLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}

/**
 * ISO-Timestamp mit lokaler Zeitzone für updated_at Felder.
 */
export function getNowISO(): string {
  return new Date().toISOString();
}

/**
 * Prüft ob ein Datum-String (YYYY-MM-DD) heute ist.
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayLocal();
}

/**
 * Prüft ob ein Datum-String gestern war.
 */
export function isYesterday(dateStr: string): boolean {
  return dateStr === getYesterdayLocal();
}
