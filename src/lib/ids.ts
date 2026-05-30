/**
 * ID-Generierung mit crypto.randomUUID()
 * Fix #6: Keine Timestamp-IDs mehr — verhindert Kollisionen bei gleichzeitiger Erstellung
 */

/** Generiert eine kollisionsfreie UUID für Pläne, Workouts etc. */
export function generateId(prefix?: string): string {
  const uuid = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return prefix ? `${prefix}-${uuid}` : uuid;
}
