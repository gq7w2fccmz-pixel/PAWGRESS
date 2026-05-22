import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PLAN_2ER_SPLIT, type PlanExercise } from "../data/plan_2er_split";
import { usePawgressStore } from "../hooks/usePawgressStore";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

function getActiveDay(totalWorkouts: number) {
  return PLAN_2ER_SPLIT[totalWorkouts % 4];
}

export function TrainingScreen() {
  const navigate = useNavigate();
  const { stats, startWorkout, selectedCoach } = usePawgressStore();

  const baseDay = getActiveDay(stats.totalWorkouts);
  const coachImg = `/images/coach_bertl.webp`;

  // Local editable exercise list (can be reordered + set count changed)
  const [exercises, setExercises] = useState<PlanExercise[]>(baseDay.exercises);
  const [editSets, setEditSets] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const dragOver = useRef<number | null>(null);

  const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0);

  function handleStart() {
    startWorkout();
    navigate("/active-set/0");
  }

  // Drag handlers
  function onDragStart(i: number) { setDragging(i); }
  function onDragEnter(i: number) { dragOver.current = i; }
  function onDragEnd() {
    if (dragging === null || dragOver.current === null || dragging === dragOver.current) {
      setDragging(null); dragOver.current = null; return;
    }
    const arr = [...exercises];
    const [item] = arr.splice(dragging, 1);
    arr.splice(dragOver.current, 0, item);
    setExercises(arr);
    setDragging(null);
    dragOver.current = null;
  }

  // Change set count for an exercise
  function changeSets(exIdx: number, delta: number) {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exIdx) return ex;
      const current = ex.sets.length;
      const next = Math.max(1, Math.min(10, current + delta));
      if (next > current) {
        return { ...ex, sets: [...ex.sets, { reps: ex.sets[ex.sets.length - 1]?.reps ?? 8 }] };
      } else {
        return { ...ex, sets: ex.sets.slice(0, next) };
      }
    }));
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* Header */}
      <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
        <img src="/images/training_hero.webp" alt="Training"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 30%" }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.7) 55%, rgba(10,10,10,1) 100%)",
        }} />

        <div className="relative z-10 flex items-center justify-between px-4 pt-4 mb-2">
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
          <p className="font-black text-sm tracking-widest text-white/60" style={{ fontFamily: F }}>TRAINING</p>
          <div style={{ width: 22 }} />
        </div>

        <div className="relative z-10 px-4 pb-4">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="font-black italic text-4xl text-white leading-none" style={{ fontFamily: F }}>
              {baseDay.label.toUpperCase()}
            </h1>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            {baseDay.tag === "PUSH" ? "Brust · Schultern · Trizeps" : "Rücken · Bizeps · Core"}
          </p>
          <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl"
            style={{ background: "#161616cc", border: "1px solid #2a2a2a" }}>
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
        <p className="text-sm font-bold text-white mb-1.5">0 / {exercises.length} Übungen</p>
        <div className="w-full rounded-full" style={{ height: 4, background: "#1e1e1e" }}>
          <div className="h-full rounded-full" style={{ width: "0%", background: ORANGE }} />
        </div>
      </div>

      {/* Exercise List */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black italic text-base text-white" style={{ fontFamily: F }}>ÜBUNGSÜBERSICHT</h2>
          <p className="text-[10px] text-gray-600">⠿ Halten & Ziehen zum Sortieren</p>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {exercises.map((ex, i) => {
            const grouped: { reps: number; count: number }[] = [];
            ex.sets.forEach(s => {
              const last = grouped[grouped.length - 1];
              if (last && last.reps === s.reps) last.count++;
              else grouped.push({ reps: s.reps, count: 1 });
            });
            const setsLabel = grouped.map(g => `${g.count}×${g.reps}`).join(" · ");
            const isEditingThis = editSets === i;

            return (
              <div
                key={`${ex.name}-${i}`}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragEnter={() => onDragEnter(i)}
                onDragEnd={onDragEnd}
                onDragOver={e => e.preventDefault()}
                className="rounded-2xl"
                style={{
                  background: dragging === i ? "#2a2a2a" : "#161616",
                  border: `1px solid ${dragging === i ? ORANGE + "88" : "#2a2a2a"}`,
                  opacity: dragging === i ? 0.5 : 1,
                  transition: "all 0.15s",
                  cursor: "grab",
                }}
              >
                <div
                  className="flex items-center gap-3 p-3"
                  onClick={() => navigate(`/active-set/${i}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Drag handle */}
                  <span className="text-gray-600 text-lg flex-shrink-0 select-none" style={{ cursor: "grab" }}>⠿</span>

                  {/* Number */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ fontFamily: F, background: `${ORANGE}22`, color: ORANGE, border: `1.5px solid ${ORANGE}` }}>
                    {i + 1}
                  </div>

                  {/* Coach thumb */}
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: "#2a2a2a" }}>
                    <img src={coachImg} alt="" className="w-full h-full object-cover object-top"
                      style={{ filter: "brightness(0.6)" }} />
                  </div>

                  {/* Name + sets */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-white leading-tight truncate" style={{ fontFamily: F }}>{ex.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{setsLabel}</p>
                  </div>

                  {/* Reps + set edit */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <p className="text-xs font-bold" style={{ color: ORANGE }}>{ex.sets[0].reps} Wdh</p>
                    <button
                      onClick={e => { e.stopPropagation(); setEditSets(isEditingThis ? null : i); }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                      style={{ background: isEditingThis ? ORANGE : "#2a2a2a", color: isEditingThis ? "#fff" : "#888", border: "none" }}>
                      ✎
                    </button>
                  </div>
                </div>

                {/* Set count editor */}
                {isEditingThis && (
                  <div className="px-4 pb-3 flex items-center gap-3 border-t" style={{ borderColor: "#2a2a2a" }}>
                    <p className="text-xs text-gray-400 flex-1">Sätze:</p>
                    <button onClick={() => changeSets(i, -1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{ background: "#2a2a2a", color: ORANGE, border: "none", fontSize: 18 }}>−</button>
                    <p className="font-black text-lg text-white w-6 text-center" style={{ fontFamily: F }}>{ex.sets.length}</p>
                    <button onClick={() => changeSets(i, 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{ background: "#2a2a2a", color: ORANGE, border: "none", fontSize: 18 }}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: ORANGE, border: "none", fontFamily: F, boxShadow: `0 0 20px ${ORANGE}66` }}>
          WORKOUT STARTEN
        </button>
      </div>
    </div>
  );
}
