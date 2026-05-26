import { useState, useEffect, lazy, Suspense } from "react";
import { flushAllPending } from "./lib/syncService";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NavBar }         from "./components/NavBar";
import { useAuthStore }   from "./stores/authStore";

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

const NO_NAV = ["/active-set", "/workout-done"];
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
        </Routes>
      </Suspense>
      {showNav && <NavBar />}
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { user, loading, syncing, needsOnboarding, initAuth } = useAuthStore();

  useEffect(() => {
    const unsub = initAuth();
    return unsub;
  }, []);

  // Flush beim App-Backgrounding (Tab verlassen / Gerät sperren)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushAllPending();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const seen = sessionStorage.getItem("splashSeen");
    if (seen) setShowSplash(false);
  }, []);

  const handleSplashDone = () => {
    sessionStorage.setItem("splashSeen", "1");
    setShowSplash(false);
  };

  // Session wird geprüft
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="font-black text-gray-600 text-lg" style={{ fontFamily: F }}>PAWGRESS …</p>
      </div>
    );
  }

  // Nicht eingeloggt → Login
  if (!user) {
    return (
      <BrowserRouter>
        <ErrorBoundary>
          <div className="max-w-[430px] mx-auto min-h-screen bg-[#0a0a0a]">
            <Suspense fallback={<ScreenLoader />}>
              <LoginScreen />
            </Suspense>
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    );
  }

  // Neu registriert → Onboarding
  if (needsOnboarding) {
    return (
      <BrowserRouter>
        <ErrorBoundary>
          <div className="max-w-[430px] mx-auto min-h-screen bg-[#0a0a0a]">
            <Suspense fallback={<ScreenLoader />}>
              <OnboardingScreen />
            </Suspense>
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    );
  }

  // Daten werden geladen
  if (syncing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: "#0a0807" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Ambient Glow */}
          <div style={{
            position: "absolute",
            width: 140, height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(205,127,50,0.25) 0%, transparent 70%)",
            animation: "pulse 2s ease-in-out infinite",
          }} />
          {/* Icon mit Screen-Blend – entfernt schwarzen Hintergrund optisch */}
          <img src="/images/nav_paw.webp" alt="Pawgress"
            style={{
              width: 96, height: 96,
              objectFit: "contain",
              mixBlendMode: "screen" as const,
              filter: "drop-shadow(0 0 20px rgba(205,127,50,0.7))",
            }} />
        </div>
        <p className="font-black text-sm tracking-widest"
          style={{ fontFamily: F, color: "#cd7f32", letterSpacing: "0.15em" }}>
          DATEN WERDEN GELADEN …
        </p>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.9); }
            50%       { opacity: 1;   transform: scale(1.1); }
          }
        `}</style>
      </div>
    );
  }

  // Eingeloggt → App
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<ScreenLoader />}>
          {showSplash && <SplashScreen onDone={handleSplashDone} />}
        </Suspense>
        <AppInner hideSplash={!showSplash} />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
