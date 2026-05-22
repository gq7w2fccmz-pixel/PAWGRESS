import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NavBar }          from "./components/NavBar";
import { SplashScreen }    from "./screens/SplashScreen";
import { HomeScreen }      from "./screens/HomeScreen";
import { PlanScreen }      from "./screens/PlanScreen";
import { CoachesScreen }   from "./screens/CoachesScreen";
import { TrainingScreen }  from "./screens/TrainingScreen";
import { ActiveSetScreen } from "./screens/ActiveSetScreen";
import { WorkoutDone }     from "./screens/WorkoutDone";
import { ProfilScreen }    from "./screens/ProfilScreen";
import { GymAreaScreen }   from "./screens/GymAreaScreen";

const NO_NAV = ["/active-set", "/workout-done"];

function AppInner() {
  const location = useLocation();
  const showNav = !NO_NAV.some((p) => location.pathname.startsWith(p));

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

  // Only show splash on first load, not on hot-reload in dev
  useEffect(() => {
    const seen = sessionStorage.getItem("splashSeen");
    if (seen) setShowSplash(false);
  }, []);

  const handleSplashDone = () => {
    sessionStorage.setItem("splashSeen", "1");
    setShowSplash(false);
  };

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <AppInner />
    </BrowserRouter>
  );
}
