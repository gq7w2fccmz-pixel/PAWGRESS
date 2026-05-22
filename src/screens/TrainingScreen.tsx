import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PLAN_2ER_SPLIT, type PlanExercise } from "../data/plan_2er_split";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useWorkoutStore } from "../stores/workoutStore";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";
const BLUE = "#3b82f6";

// Store custom exercise list in module scope so it survives navigation
let customExercises: PlanExercise[] | null = null;
let customDayIndex: number | null = null;

function getBaseDay(totalWorkouts: number) {
  return PLAN_2ER_SPLIT[totalWorkouts % 4];
}

export function TrainingScreen() {
  const navigate = useNavigate();
  const { stats, startWorkout } = usePawgressStore();
  const session = useWorkoutStore(s => s.session);
  const resetWorkout = useWorkoutStore(s => s.resetWorkout);

  const dayIndex = stats.totalWorkouts % 4;
  const baseDay = getBaseDay(stats.totalWorkouts);

  // Use persisted custom exercises if same day, else reset
  if (customDayIndex !== dayIndex) {
    customExercises = null;
    customDayIndex = dayIndex;
  }

  const [exercises, setExercises] = useState<PlanExercise[]>(
    customExercises ?? baseDay.exercises
  );
  const [editSets, setEditSets] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const touchStartY = useRef<number>(0);
  const touchDragIdx = useRef<number | null>(null);

  function persistExercises(list: PlanExercise[]) {
    customExercises = list;
    setExercises(list);
  }

  const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0);
  const coachImg = "/images/coach_bertl.webp";

  // Drag & Drop (mouse)
  function onDragStart(i: number) { setDragging(i); }
  function onDragEnter(i: number) { dragOver.current = i; }
  function onDragEnd() {
    if (dragging === null || dragOver.current === null || dragging === dragOver.current) {
      setDragging(null); dragOver.current = null; return;
    }
    const arr = [...exercises];
    const [item] = arr.splice(dragging, 1);
    arr.splice(dragOver.current, 0, item);
    dragOver.current = null;
    setDragging(null);
    persistExercises(arr);
  }

  // Touch drag
  function onTouchStart(e: React.TouchEvent, i: number) {
    touchStartY.current = e.touches[0].clientY;
    touchDragIdx.current = i;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchDragIdx.current === null) return;
    const el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    const idxAttr = el?.closest("[data-idx]")?.getAttribute("data-idx");
    if (idxAttr !== null && idxAttr !== undefined) {
      dragOver.current = Number(idxAttr);
    }
  }
  function onTouchEnd() {
    const from = touchDragIdx.current;
    const to = dragOver.current;
    if (from !== null && to !== null && from !== to) {
      const arr = [...exercises];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      persistExercises(arr);
    }
    touchDragIdx.current = null;
    dragOver.current = null;
  }

  function changeSets(exIdx: number, delta: number) {
    const updated = exercises.map((ex, i) => {
      if (i !== exIdx) return ex;
      const next = Math.max(1, Math.min(10, ex.sets.length + delta));
      const baseReps = ex.sets[ex.sets.length - 1]?.reps ?? 8;
      const newSets = next > ex.sets.length
        ? [...ex.sets, ...Array(next - ex.sets.length).fill({ reps: baseReps })]
        : ex.sets.slice(0, next);
      return { ...ex, sets: newSets };
    });
    persistExercises(updated);
  }

  function removeExercise(idx: number) {
    persistExercises(exercises.filter((_, i) => i !== idx));
  }

  function addExercise(ex: PlanExercise) {
    persistExercises([...exercises, ex]);
    setShowAddModal(false);
  }

  function handleStart() {
    startWorkout();
    navigate("/active-set/0");
  }

  function handleAbort() {
    resetWorkout();
    setShowAbortConfirm(false);
  }

  // All available exercises from all plan days for adding
  const allPlanExercises = PLAN_2ER_SPLIT.flatMap(d => d.exercises);
  const uniqueExercises = allPlanExercises.filter(
    (ex, i, arr) => arr.findIndex(e => e.name === ex.name) === i &&
    !exercises.some(e => e.name === ex.name)
  );

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* Abort confirm modal */}
      {showAbortConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.85)" }}>
          <div className="rounded-2xl p-6 w-full" style={{ background: "#1a1a1a", border: "1px solid #f97316" }}>
            <p className="font-black text-xl text-white mb-2" style={{ fontFamily: F }}>TRAINING ABBRECHEN?</p>
            <p className="text-sm text-gray-400 mb-5">Dein Fortschritt geht verloren.</p>
            <button onClick={handleAbort} className="w-full py-3 rounded-xl font-black text-white mb-2"
              style={{ background: "#ef4444", fontFamily: F }}>JA, ABBRECHEN</button>
            <button onClick={() => setShowAbortConfirm(false)} className="w-full py-3 rounded-xl font-black text-white"
              style={{ background: "#2a2a2a", fontFamily: F }}>WEITERMACHEN</button>
          </div>
        </div>
      )}

      {/* Add exercise modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.95)" }}>
          <div className="flex items-center gap-3 px-4 py-4">
            <button onClick={() => setShowAddModal(false)}
              style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
            <p className="font-black text-lg text-white" style={{ fontFamily: F }}>ÜBUNG HINZUFÜGEN</p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-10">
            {uniqueExercises.length === 0
              ? <p className="text-gray-500 text-sm mt-4">Alle Übungen bereits im Plan.</p>
              : uniqueExercises.map((ex, i) => {
                  const grouped: {reps:number;count:number}[] = [];
                  ex.sets.forEach(s => {
                    const last = grouped[grouped.length-1];
                    if (last && last.reps === s.reps) last.count++;
                    else grouped.push({reps:s.reps,count:1});
                  });
                  return (
                    <div key={i} className="flex items-center gap-3 py-3 border-b"
                      style={{ borderColor: "#2a2a2a" }}>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-white">{ex.name}</p>
                        <p className="text-xs text-gray-500">{grouped.map(g=>`${g.count}×${g.reps}`).join(" · ")}</p>
                      </div>
                      <button onClick={() => addExercise(ex)}
                        className="px-4 py-1.5 rounded-xl font-black text-sm"
                        style={{ background: ORANGE, color: "#fff", fontFamily: F }}>+ ADD</button>
                    </div>
                  );
                })
            }
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 240 }}>
        <img src="/images/training_hero.webp" alt="Training"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 30%" }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.7) 55%, rgba(10,10,10,1) 100%)",
        }} />
        <div className="relative z-10 flex items-center justify-between px-4 pt-4 mb-2">
          <button onClick={() => navigate("/")}
            style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
          <p className="font-black text-sm tracking-widest text-white/60" style={{ fontFamily: F }}>TRAINING</p>
          {session
            ? <button onClick={() => setShowAbortConfirm(true)}
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "#ef444433", color: "#ef4444", border: "1px solid #ef4444" }}>
                ABBRECHEN
              </button>
            : <div style={{ width: 70 }} />
          }
        </div>
        <div className="relative z-10 px-4 pb-4">
          <h1 className="font-black italic text-4xl text-white leading-none mb-0.5" style={{ fontFamily: F }}>
            {baseDay.label.toUpperCase()}
          </h1>
          <p className="text-sm text-gray-400 mb-3">
            {baseDay.tag === "PUSH" ? "Brust · Schultern · Trizeps" : "Rücken · Bizeps · Core"}
          </p>
          <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl"
            style={{ background: "#161616cc", border: "1px solid #2a2a2a" }}>
            <span>🎯</span>
            <p className="text-xs text-white font-semibold">Volumen · {totalSets} Arbeitssätze</p>
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
          <p className="text-[9px] text-gray-600">⠿ Ziehen zum Sortieren</p>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {exercises.map((ex, i) => {
            const grouped: {reps:number;count:number}[] = [];
            ex.sets.forEach(s => {
              const last = grouped[grouped.length-1];
              if (last && last.reps === s.reps) last.count++;
              else grouped.push({reps:s.reps,count:1});
            });
            const setsLabel = grouped.map(g=>`${g.count}×${g.reps}`).join(" · ");
            const isEditingThis = editSets === i;

            return (
              <div key={`${ex.name}-${i}`}
                data-idx={i}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragEnter={() => onDragEnter(i)}
                onDragEnd={onDragEnd}
                onDragOver={e => e.preventDefault()}
                onTouchStart={e => onTouchStart(e, i)}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="rounded-2xl"
                style={{
                  background: dragging === i ? "#222" : "#161616",
                  border: `1px solid ${dragging === i ? ORANGE+"88" : "#2a2a2a"}`,
                  opacity: dragging === i ? 0.5 : 1,
                  touchAction: "none",
                }}
              >
                <div className="flex items-center gap-3 p-3"
                  onClick={() => navigate(`/active-set/${i}`)}>
                  {/* Drag handle */}
                  <span className="text-gray-500 text-xl select-none flex-shrink-0" style={{ cursor: "grab" }}>⠿</span>
                  {/* Number */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ fontFamily: F, background: `${ORANGE}22`, color: ORANGE, border: `1.5px solid ${ORANGE}` }}>
                    {i + 1}
                  </div>
                  {/* Thumb */}
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: "#2a2a2a" }}>
                    <img src={coachImg} alt="" className="w-full h-full object-cover object-top"
                      style={{ filter: "brightness(0.6)" }} />
                  </div>
                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-white truncate" style={{ fontFamily: F }}>{ex.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{setsLabel}</p>
                  </div>
                  {/* Controls */}
                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <p className="text-xs font-bold" style={{ color: ORANGE }}>{ex.sets[0].reps} Wdh</p>
                    <button onClick={() => setEditSets(isEditingThis ? null : i)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                      style={{ background: isEditingThis ? ORANGE : "#2a2a2a", color: isEditingThis ? "#fff" : "#888", border: "none" }}>
                      ✎
                    </button>
                    <button onClick={() => removeExercise(i)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
                      style={{ background: "#2a2a2a", color: "#ef4444", border: "none" }}>
                      ✕
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
                    <p className="font-black text-lg text-white w-8 text-center" style={{ fontFamily: F }}>{ex.sets.length}</p>
                    <button onClick={() => changeSets(i, 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{ background: "#2a2a2a", color: ORANGE, border: "none", fontSize: 18 }}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add exercise button */}
        <button onClick={() => setShowAddModal(true)}
          className="w-full py-3 rounded-2xl font-black text-sm mb-3 flex items-center justify-center gap-2"
          style={{ background: "#1a1a1a", border: `1px dashed ${ORANGE}66`, color: ORANGE, fontFamily: F }}>
          + ÜBUNG HINZUFÜGEN
        </button>

        <button onClick={handleStart}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: ORANGE, border: "none", fontFamily: F, boxShadow: `0 0 20px ${ORANGE}66` }}>
          WORKOUT STARTEN
        </button>
      </div>
    </div>
  );
}
