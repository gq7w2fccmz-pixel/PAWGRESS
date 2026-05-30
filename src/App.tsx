import { useState, useEffect, lazy, Suspense } from "react";
import { flushAllPending } from "./lib/syncService";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NavBar }         from "./components/NavBar";
import { ToastContainer } from "./components/ToastContainer";
import { toast }          from "./lib/toast";
import { onNetworkChange } from "./lib/retry";
import { useAuthStore }   from "./stores/authStore";
import { useStatsStore }   from "./stores/statsStore";

// ── Lazy Loading – alle Screens werden erst bei Bedarf geladen ────────────────
// Reduziert den initialen Bundle von ~786KB auf ~300KB
const SplashScreen        = lazy(() => import("./screens/SplashScreen").then(m => ({ default: m.SplashScreen })));
const LoginScreen         = lazy(() => import("./screens/LoginScreen").then(m => ({ default: m.LoginScreen })));
const OnboardingScreen    = lazy(() => import("./screens/OnboardingScreen").then(m => ({ default: m.OnboardingScreen })));
const ResetPasswordScreen = lazy(() => import("./screens/ResetPasswordScreen").then(m => ({ default: m.ResetPasswordScreen })));
const UebungenScreen      = lazy(() => import("./screens/UebungenScreen").then(m => ({ default: m.UebungenScreen })));
const HomeScreen          = lazy(() => import("./screens/HomeScreen").then(m => ({ default: m.HomeScreen })));
const PlanScreen          = lazy(() => import("./screens/PlanScreen").then(m => ({ default: m.PlanScreen })));
const CoachesScreen       = lazy(() => import("./screens/CoachesScreen").then(m => ({ default: m.CoachesScreen })));
const TrainingScreen      = lazy(() => import("./screens/TrainingScreen").then(m => ({ default: m.TrainingScreen })));
const ActiveTrainingScreen = lazy(() => import("./screens/TrainingScreen").then(m => ({ default: m.ActiveTrainingScreen })));
const ActiveSetScreen     = lazy(() => import("./screens/ActiveSetScreen").then(m => ({ default: m.ActiveSetScreen })));
const WorkoutDone         = lazy(() => import("./screens/WorkoutDone").then(m => ({ default: m.WorkoutDone })));
const ProfilScreen        = lazy(() => import("./screens/ProfilScreen").then(m => ({ default: m.ProfilScreen })));
const GymAreaScreen       = lazy(() => import("./screens/GymAreaScreen").then(m => ({ default: m.GymAreaScreen })));
const ProgressScreen      = lazy(() => import("./screens/ProgressScreen").then(m => ({ default: m.ProgressScreen })));

const NO_NAV = ["/active-set", "/workout-done", "/progress"];
const F      = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

// Minimaler Fallback während Screens laden
function ScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: `${ORANGE} transparent transparent transparent` }} />
    </div>
  );
}

function AppInner({ hideSplash }: { hideSplash: boolean }) {
  const location = useLocation();
  const showNav  = hideSplash && !NO_NAV.some(p => location.pathname.startsWith(p));

  return (
    <div className="max-w-[430px] mx-auto min-h-screen relative overflow-x-hidden bg-[#0a0a0a] text-white">
      <ToastContainer />
      <Suspense fallback={<ScreenLoader />}>
        <Routes>
          <Route path="/"                  element={<HomeScreen />} />
          <Route path="/plan"              element={<PlanScreen />} />
          <Route path="/coaches"           element={<CoachesScreen />} />
          <Route path="/training"          element={<TrainingScreen />} />
          <Route path="/training/active"   element={<ActiveTrainingScreen />} />
          <Route path="/active-set/:index" element={<ActiveSetScreen />} />
          <Route path="/workout-done"      element={<WorkoutDone />} />
          <Route path="/profil"            element={<ProfilScreen />} />
          <Route path="/gym/:area"         element={<GymAreaScreen />} />
          <Route path="/reset-password"      element={<ResetPasswordScreen />} />
          <Route path="/training/uebungen"   element={<UebungenScreen />} />
          <Route path="/progress"            element={<ProgressScreen />} />
        </Routes>
      </Suspense>
      {showNav && <NavBar />}
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  // initialLoading: nur beim ersten App-Start true
  // → verhindert BrowserRouter-Neustart bei onAuthStateChange (Display ein/aus)
  const [initialLoading, setInitialLoading] = useState(true);
  const { user, loading, syncing, needsOnboarding, initAuth } = useAuthStore();

  useEffect(() => {
    const unsub = initAuth();
    return unsub;
  }, []);

  // initialLoading erst nach dem ersten Auth-Check auf false setzen
  useEffect(() => {
    if (!loading) setInitialLoading(false);
  }, [loading]);

  // Flush beim App-Backgrounding (Tab verlassen / Gerät sperren)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushAllPending().catch((e) => console.warn("[sync] flush fehlgeschlagen:", e));
      } else if (document.visibilityState === "visible") {
        useStatsStore.getState().checkStreakDecay();
      }
    };
    const cleanupNetwork = onNetworkChange(online => {
      if (online) {
        toast.success("Verbindung wiederhergestellt 🌐");
        flushAllPending().catch((e) => console.warn("[sync] flush fehlgeschlagen:", e));
      } else {
        toast.warning("Offline – Daten werden lokal gespeichert");
      }
    });
    const handleBeforeUnload = () => { flushAllPending().catch((e) => console.warn("[sync] flush fehlgeschlagen:", e)); };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      cleanupNetwork();
    };
  }, []);

  useEffect(() => {
    try {
      const seen = typeof window !== "undefined" && sessionStorage.getItem("splashSeen");
      if (seen) setShowSplash(false);
    } catch { /* SSR / private mode */ }
  }, []);

  const handleSplashDone = () => {
    try { sessionStorage.setItem("splashSeen", "1"); } catch { /* ignore */ }
    setShowSplash(false);
  };

  // Nur beim allerersten Start Ladebildschirm zeigen (nicht bei Display ein/aus)
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="font-black text-gray-600 text-lg" style={{ fontFamily: F }}>PAWGRESS …</p>
      </div>
    );
  }

  // Einziger BrowserRouter – wird nie neu gemountet → Navigation bleibt erhalten
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<ScreenLoader />}>
          {/* Nicht eingeloggt */}
          {!user && (
            <div className="max-w-[430px] mx-auto min-h-screen bg-[#0a0a0a]">
              <Routes>
                <Route path="/reset-password" element={<ResetPasswordScreen />} />
                <Route path="*" element={<LoginScreen />} />
              </Routes>
            </div>
          )}

          {/* Onboarding */}
          {user && needsOnboarding && (
            <div className="max-w-[430px] mx-auto min-h-screen bg-[#0a0a0a]">
              <OnboardingScreen />
            </div>
          )}

          {/* Haupt-App — bleibt gemountet, Navigation wird nicht zurückgesetzt */}
          {user && !needsOnboarding && (
            <>
              {showSplash && (
                <div className="max-w-[430px] mx-auto min-h-screen bg-[#0a0a0a]">
                  <SplashScreen onDone={handleSplashDone} />
                </div>
              )}
              <AppInner hideSplash={!showSplash} />
            </>
          )}
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
