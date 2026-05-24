import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NavBar }             from "./components/NavBar";
import { SplashScreen }       from "./screens/SplashScreen";
import { LoginScreen }        from "./screens/LoginScreen";
import { OnboardingScreen }   from "./screens/OnboardingScreen";
import { HomeScreen }         from "./screens/HomeScreen";
import { PlanScreen }         from "./screens/PlanScreen";
import { CoachesScreen }      from "./screens/CoachesScreen";
import { TrainingScreen }     from "./screens/TrainingScreen";
import { ActiveSetScreen }    from "./screens/ActiveSetScreen";
import { WorkoutDone }        from "./screens/WorkoutDone";
import { ProfilScreen }       from "./screens/ProfilScreen";
import { GymAreaScreen }      from "./screens/GymAreaScreen";
import { useAuthStore }       from "./stores/authStore";

const NO_NAV = ["/active-set", "/workout-done"];
const F      = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

function AppInner({ hideSplash }: { hideSplash: boolean }) {
  const location = useLocation();
  const showNav  = hideSplash && !NO_NAV.some(p => location.pathname.startsWith(p));
  return (
    <div className="max-w-[430px] mx-auto min-h-screen relative overflow-x-hidden bg-[#0a0a0a] text-white">
      <Routes>
        <Route path="/"                  element={<HomeScreen />} />
        <Route path="/plan"              element={<PlanScreen />} />
        <Route path="/coaches"           element={<CoachesScreen />} />
        <Route path="/training"          element={<TrainingScreen />} />
        <Route path="/active-set/:index" element={<ActiveSetScreen />} />
        <Route path="/workout-done"      element={<WorkoutDone />} />
        <Route path="/profil"            element={<ProfilScreen />} />
        <Route path="/gym/:area"         element={<GymAreaScreen />} />
      </Routes>
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
        <div className="max-w-[430px] mx-auto min-h-screen bg-[#0a0a0a]">
          <LoginScreen />
        </div>
      </BrowserRouter>
    );
  }

  // Neu registriert → Onboarding
  if (needsOnboarding) {
    return (
      <BrowserRouter>
        <div className="max-w-[430px] mx-auto min-h-screen bg-[#0a0a0a]">
          <OnboardingScreen />
        </div>
      </BrowserRouter>
    );
  }

  // Daten werden geladen
  if (syncing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0a]">
        <img src="/images/bertl_splash.webp" alt="Bertl"
          className="w-20 h-20 rounded-full object-cover"
          style={{ border: `2px solid ${ORANGE}` }} />
        <p className="font-black text-gray-500 text-base" style={{ fontFamily: F }}>
          DATEN WERDEN GELADEN …
        </p>
      </div>
    );
  }

  // Eingeloggt → App
  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <AppInner hideSplash={!showSplash} />
    </BrowserRouter>
  );
}
