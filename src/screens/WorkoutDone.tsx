import { useNavigate } from "react-router-dom";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useHistoryStore } from "../stores/historyStore";
import { PLAN_2ER_SPLIT } from "../data/plan_2er_split";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

export function WorkoutDone() {
  const navigate = useNavigate();
  const { stats, session } = usePawgressStore();
  const recentWorkouts = useHistoryStore(s => s.getRecentWorkouts)(1);
  const lastWorkout = recentWorkouts[0]; // the one just saved

  const dayIndex = Math.max(0, (stats.totalWorkouts - 1)) % 4;
  const day = PLAN_2ER_SPLIT[dayIndex];

  // Use real data from history if available, fallback to plan
  const totalSets  = lastWorkout?.totalSets  ?? day.exercises.reduce((a, e) => a + e.sets.length, 0);
  const totalReps  = lastWorkout?.totalReps  ?? 0;
  const volume     = lastWorkout?.totalVolume ?? stats.weeklyVolume;
  const durationSec = lastWorkout?.durationSeconds ?? (session?.startTime ? Math.floor((Date.now() - session.startTime) / 1000) : 0);
  const durationMin = Math.floor(durationSec / 60);
  const durationRemSec = durationSec % 60;

  // Top exercises with real PR data
  const topExercises = lastWorkout?.exercises.slice(0, 3) ?? day.exercises.slice(0, 3).map(e => ({
    name: e.name, isPR: false, bestSet: { weight: 0, reps: e.sets[0].reps }, volume: 0, sets: [],
  }));

  function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub: string }) {
    return (
      <div className="flex-1 rounded-2xl p-4" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <span style={{ color: ORANGE }}>{icon}</span>
          <p className="text-[10px] font-black tracking-widest text-gray-400" style={{ fontFamily: F }}>{label}</p>
        </div>
        <p className="font-black text-3xl text-white leading-none" style={{ fontFamily: F }}>{value}</p>
        <p className="text-xs text-gray-500 mt-1">{sub}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 280 }}>
        <img src="/images/workout_done_hero.webp" alt="Training abgeschlossen"
          className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0) 50%, rgba(10,10,10,1) 100%)",
        }} />
      </div>

      {/* Stats Grid */}
      <div className="px-4 -mt-4 flex flex-col gap-3">

        <div className="flex gap-3">
          <StatCard icon="⏱" label="ZEIT"
            value={`${durationMin}:${String(durationRemSec).padStart(2, "0")}`}
            sub="Minuten" />
          <StatCard icon="🏋️" label="VOLUMEN"
            value={volume > 0 ? volume.toLocaleString("de") : "–"}
            sub="kg" />
        </div>

        <div className="flex gap-3">
          <StatCard icon="🐾" label="SÄTZE"
            value={String(totalSets)}
            sub="Erledigt" />
          <StatCard icon="✅" label="WIEDERHOLUNGEN"
            value={totalReps > 0 ? String(totalReps) : "–"}
            sub="Gesamt" />
        </div>

        {/* Top Leistungen */}
        <div className="rounded-2xl p-4" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: ORANGE }}>🏆</span>
            <p className="font-black text-sm tracking-widest text-white" style={{ fontFamily: F }}>TOP LEISTUNGEN</p>
          </div>
          <div className="flex flex-col gap-3">
            {topExercises.map((ex, i) => {
              const label = ex.bestSet?.weight > 0
                ? `${ex.bestSet.weight} kg × ${ex.bestSet.reps}`
                : `BW × ${ex.bestSet?.reps ?? "–"}`;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ background: ORANGE, color: "#fff", fontFamily: F }}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-white truncate" style={{ fontFamily: F }}>{ex.name}</p>
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">{label}</p>
                  {ex.isPR && (
                    <div className="px-2 py-0.5 rounded text-[9px] font-black flex-shrink-0"
                      style={{ background: ORANGE, color: "#fff", fontFamily: F }}>NEUER PR</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={() => navigate("/training")}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: ORANGE, border: "none", fontFamily: F,
            boxShadow: `0 0 20px ${ORANGE}55` }}>
          ZUSAMMENFASSUNG ANSEHEN
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: "transparent", border: "1px solid #2a2a2a", fontFamily: F }}>
          ZURÜCK ZUM PLAN
        </button>
      </div>
    </div>
  );
}
