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
  const lastWorkout = recentWorkouts[0];

  const dayIndex = Math.max(0, (stats.totalWorkouts - 1)) % 4;
  const day = PLAN_2ER_SPLIT[dayIndex];

  // Real data from history, fallback to estimates
  const totalSets     = lastWorkout?.totalSets ?? day.exercises.reduce((a,e) => a + e.sets.length, 0);
  const totalReps     = lastWorkout?.totalReps ?? 0;
  const totalVolume   = lastWorkout?.totalVolume ?? stats.weeklyVolume;
  const durationSec   = lastWorkout?.durationSeconds
    ?? (session?.startTime ? Math.floor((Date.now() - session.startTime) / 1000) : 0);
  const durationMin   = Math.floor(durationSec / 60);
  const durationSecs  = durationSec % 60;

  const topExercises = lastWorkout?.exercises.slice(0, 3)
    ?? day.exercises.slice(0, 3).map(e => ({
        name: e.name, isPR: false,
        bestSet: { weight: 0, reps: e.sets[0].reps },
        volume: 0, sets: [],
      }));

  const newPRs = topExercises.filter(e => e.isPR).length;

  function fmt(n: number) {
    return n >= 1000 ? `${(n/1000).toFixed(1).replace(".",",")}k` : String(Math.round(n));
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: "#080808", color: "#fff" }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 300 }}>
        <img src="/images/workout_done_hero.webp" alt="Training abgeschlossen"
          className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(8,8,8,0) 40%, rgba(8,8,8,1) 100%)",
        }} />
        {/* PR badge overlay */}
        {newPRs > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full font-black text-sm"
            style={{ background: ORANGE, color: "#fff", fontFamily: F,
              boxShadow: `0 0 20px ${ORANGE}88` }}>
            🏆 {newPRs} NEUER PR!
          </div>
        )}
      </div>

      <div className="px-4 -mt-4 flex flex-col gap-3">

        {/* Stats 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "⏱", label: "ZEIT",           value: `${durationMin}:${String(durationSecs).padStart(2,"0")}`, sub: "Minuten", color: "#f97316" },
            { icon: "🏋️", label: "VOLUMEN",        value: totalVolume > 0 ? fmt(totalVolume) : "–",                  sub: "kg gesamt", color: "#22c55e" },
            { icon: "🐾", label: "SÄTZE",          value: String(totalSets),                                         sub: "Erledigt",  color: "#3b82f6" },
            { icon: "✅", label: "WIEDERHOLUNGEN", value: totalReps > 0 ? String(totalReps) : "–",                   sub: "Gesamt",    color: "#a855f7" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4"
              style={{ background: "#111", border: `1px solid ${s.color}33` }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span>{s.icon}</span>
                <p className="text-[9px] font-black tracking-widest text-gray-500" style={{ fontFamily: F }}>{s.label}</p>
              </div>
              <p className="font-black text-3xl text-white leading-none mb-1" style={{ fontFamily: F, color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-600">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Top Leistungen */}
        <div className="rounded-2xl p-4" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span style={{ color: ORANGE }}>🏆</span>
              <p className="font-black text-sm tracking-widest text-white" style={{ fontFamily: F }}>TOP LEISTUNGEN</p>
            </div>
            {newPRs > 0 && (
              <span className="text-xs font-black px-2 py-0.5 rounded-full"
                style={{ background: `${ORANGE}22`, color: ORANGE }}>{newPRs}× PR</span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {topExercises.map((ex, i) => {
              const label = ex.bestSet?.weight > 0
                ? `${ex.bestSet.weight} kg × ${ex.bestSet.reps}`
                : `BW × ${ex.bestSet?.reps ?? "–"}`;
              return (
                <div key={i} className="flex items-center gap-3 py-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ background: `${ORANGE}22`, color: ORANGE, fontFamily: F }}>{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-white truncate" style={{ fontFamily: F }}>{ex.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  </div>
                  {ex.isPR && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black flex-shrink-0"
                      style={{ background: ORANGE, color: "#fff", fontFamily: F }}>NEUER PR</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Nächstes Training Hint */}
        {(() => {
          const nextDay = PLAN_2ER_SPLIT[stats.totalWorkouts % 4];
          return (
            <div className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: "#111", border: "1px solid #1e1e1e" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${nextDay.color}22` }}>
                <span style={{ color: nextDay.color, fontSize: 20 }}>{nextDay.tag === "PUSH" ? "🏋️" : "💪"}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Nächstes Training</p>
                <p className="font-black text-sm text-white" style={{ fontFamily: F }}>{nextDay.label}</p>
              </div>
              <span className="text-xs text-gray-600">Morgen ›</span>
            </div>
          );
        })()}

        {/* Buttons */}
        <button onClick={() => navigate("/")}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: ORANGE, border: "none", fontFamily: F, boxShadow: `0 0 20px ${ORANGE}44` }}>
          ZURÜCK ZUM PLAN
        </button>
        <button onClick={() => navigate("/profil")}
          className="w-full py-3.5 rounded-2xl font-black text-base text-white"
          style={{ background: "transparent", border: "1px solid #2a2a2a", fontFamily: F }}>
          ZUSAMMENFASSUNG ANSEHEN ›
        </button>
      </div>
    </div>
  );
}
