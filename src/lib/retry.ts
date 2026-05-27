// ── API Retry Logic ───────────────────────────────────────────────────────────
// Exponential backoff für Supabase-Calls

export interface RetryOptions {
  attempts?: number;    // Max Versuche (default: 3)
  baseDelay?: number;   // Basis-Delay ms (default: 1000)
  maxDelay?: number;    // Max Delay ms (default: 10000)
  onRetry?: (attempt: number, error: unknown) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions = {}
): Promise<T> {
  const { attempts = 3, baseDelay = 1000, maxDelay = 10_000, onRetry } = opts;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1) throw err;
      const delay = Math.min(baseDelay * 2 ** i, maxDelay);
      onRetry?.(i + 1, err);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error("unreachable");
}

// Network state detection
export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

export function onNetworkChange(cb: (online: boolean) => void): () => void {
  const onOnline  = () => cb(true);
  const onOffline = () => cb(false);
  window.addEventListener("online",  onOnline);
  window.addEventListener("offline", onOffline);
  return () => {
    window.removeEventListener("online",  onOnline);
    window.removeEventListener("offline", onOffline);
  };
}
