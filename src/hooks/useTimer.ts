import { useState, useEffect, useCallback } from "react";

export function useTimer(initialSeconds = 90) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, seconds]);

  const start  = useCallback(() => setRunning(true), []);
  const pause  = useCallback(() => setRunning(false), []);
  const reset  = useCallback((s = initialSeconds) => { setSeconds(s); setRunning(false); }, [initialSeconds]);
  const toggle = useCallback(() => { setSeconds(initialSeconds); setRunning((r) => !r); }, [initialSeconds]);

  const progress = 1 - seconds / initialSeconds; // 0 → 1

  return { seconds, running, progress, start, pause, reset, toggle };
}
