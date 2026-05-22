import { useNavigate } from "react-router-dom";
import { PLAN_2ER_SPLIT, type PlanDay } from "../data/plan_2er_split";
import { usePawgressStore } from "../hooks/usePawgressStore";

const F = "'Barlow Condensed', sans-serif";

// Welcher Tag ist aktiv (rotierend: Push A → Pull A → Push B → Pull B → …)
function getActiveDay(totalWorkouts: number): PlanDay {
  return PLAN_2ER_SPLIT[totalWorkouts % 4];
}

export function TrainingScreen() {
  const navigate = useNavigate();
  const { stats, session, startWorkout, selectedCoach } = usePawgressStore();

  const day = getActiveDay(stats.totalWorkouts);
  const exercises = day.exercises;
  const done = session?.exercises.filter(e => e.done).length ?? 0;
  const total = exercises.length;
  const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0);

  // Coach image
  const coachImg = `/images/coach_bertl.webp`;

  function handleStart() {
    startWorkout();
    navigate("/active-set/0");
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* Header */}
      <div className="relative overflow-hidden" style={{ minHeight: 220 }}>
        {/* Full background hero */}
        <img src="/images/training_hero.webp" alt="Training"
          className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.75) 60%, rgba(10,10,10,1) 100%)",
        }} />

        {/* Back + Menu */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-4 mb-2">
          <button onClick={() => navigate(-1)}
            style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
          <p className="font-black text-sm tracking-widest text-white/60" style={{ fontFamily: F }}>TRAINING</p>
          <button style={{ background: "none", border: "none", color: "#fff", fontSize: 20 }}>⋯</button>
        </div>

        {/* Title */}
        <div className="relative z-10 px-4 pb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="font-black italic text-4xl text-white leading-none" style={{ fontFamily: F }}>
              {day.label.toUpperCase()}
            </h1>
            <img src="/images/paw.webp" alt="🐾" className="w-7 h-7 object-contain" />
          </div>
          <p className="text-sm text-gray-400 mb-3">
            {day.tag === "PUSH" ? "Brust · Schultern · Trizeps" : "Rücken · Bizeps · Core"}
          </p>

          {/* Ziel Heute */}
          <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl"
            style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
            <span className="text-base">🎯</span>
            <div>
              <p className="text-[9px] text-gray-600 tracking-widest font-bold">ZIEL HEUTE</p>
              <p className="text-xs text-white font-semibold">Volumen · {totalSets} Arbeitssätze</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-sm font-bold text-white">{done} / {total} Übungen</p>
        </div>
        <div className="w-full rounded-full" style={{ height: 5, background: "#1e1e1e" }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${(done / total) * 100}%`, background: day.color }} />
        </div>
      </div>

      {/* Exercise List */}
      <div className="px-4">
        <h2 className="font-black italic text-base text-white mb-3" style={{ fontFamily: F }}>
          ÜBUNGSÜBERSICHT
        </h2>

        <div className="flex flex-col gap-2 mb-6">
          {exercises.map((ex, i) => {
            const isDone = (session?.exercises[i]?.done) ?? false;
            // Group sets: e.g. "1×6 · 1×8" or "3×8"
            const grouped: { reps: number; count: number }[] = [];
            ex.sets.forEach(s => {
              const last = grouped[grouped.length - 1];
              if (last && last.reps === s.reps) last.count++;
              else grouped.push({ reps: s.reps, count: 1 });
            });
            const setsLabel = grouped.map(g => `${g.count}×${g.reps}`).join(" · ");

            return (
              <button
                key={i}
                onClick={() => navigate(`/active-set/${i}`)}
                className="w-full text-left flex items-center gap-3 p-4 rounded-2xl"
                style={{
                  background: "#161616",
                  border: `1px solid ${isDone ? "#22c55e44" : "#2a2a2a"}`,
                  padding: "14px 16px",
                }}
              >
                {/* Number / Check */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{
                    fontFamily: F,
                    background: isDone ? "#22c55e" : `${day.color}22`,
                    color: isDone ? "#fff" : day.color,
                    border: `1.5px solid ${isDone ? "#22c55e" : day.color}`,
                  }}>
                  {isDone ? "✓" : i + 1}
                </div>

                {/* Coach thumb icon placeholder */}
                <div className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{ background: "#2a2a2a" }}>
                  <img src={coachImg} alt="" className="w-full h-full object-cover object-top"
                    style={{ filter: "brightness(0.6)" }} />
                </div>

                {/* Name + sub */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-white leading-tight truncate" style={{ fontFamily: F }}>
                    {ex.name}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{setsLabel}</p>
                </div>

                {/* Weight / reps */}
                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <p className="text-xs font-bold" style={{ color: isDone ? "#22c55e" : day.color }}>
                    {ex.sets[0].reps} Wdh
                  </p>
                  {/* Checkbox */}
                  <div className="w-5 h-5 rounded-full border flex items-center justify-center"
                    style={{ borderColor: isDone ? "#22c55e" : "#444" }}>
                    {isDone && <span style={{ color: "#22c55e", fontSize: 12 }}>✓</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: day.color, border: "none", fontFamily: F,
            boxShadow: `0 0 20px ${day.color}66` }}>
          WORKOUT STARTEN
        </button>
      </div>
    </div>
  );
}
