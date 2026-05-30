import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { useCoachStore } from "./stores/coachStore";
import { useStatsStore }  from "./stores/statsStore";
import { getTodayLocal, getYesterdayLocal } from "./lib/dateUtils";

// ── Streak-Verfall beim App-Start (Offline / localStorage-Pfad) ──────────────
// Läuft einmalig vor dem ersten Render. Stellt sicher dass ein abgelaufener
// Streak auch ohne Supabase-Sync korrekt auf 0 zurückgesetzt wird.
(function checkStreakOnBoot() {
  const lastWorkoutDate = useStatsStore.getState().stats.lastWorkoutDate;
  const progress        = useCoachStore.getState().coachProgress;

  if (!lastWorkoutDate || progress.currentStreak === 0) return;

  const today     = getTodayLocal();
  const yStr = getYesterdayLocal();

  const alive = lastWorkoutDate === today || lastWorkoutDate === yStr;
  if (!alive) {
    useCoachStore.setState(s => ({
      coachProgress: { ...s.coachProgress, currentStreak: 0 },
    }));
  }
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for PWA / Offline Support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(reg => {
      reg.addEventListener("updatefound", () => {
        const newSW = reg.installing;
        if (!newSW) return;
        newSW.addEventListener("statechange", () => {
          if (newSW.state === "installed" && navigator.serviceWorker.controller) {
            // Fix: auf controllerchange warten bevor reload — verhindert Reload-Loop
            newSW.postMessage("SKIP_WAITING");
            navigator.serviceWorker.addEventListener("controllerchange", () => {
              window.location.reload();
            }, { once: true });
          }
        });
      });
    }).catch((e) => console.warn("[sw] Service Worker Registrierung fehlgeschlagen:", e));
  });
}
