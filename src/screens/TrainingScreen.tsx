import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PLAN_2ER_SPLIT, type PlanExercise } from "../data/plan_2er_split";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useWorkoutStore } from "../stores/workoutStore";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

export function TrainingScreen() {
  const navigate = useNavigate();
  const { stats, startWorkout } = usePawgressStore();
  const session = useWorkoutStore(s => s.session);
  const resetWorkout = useWorkoutStore(s => s.resetWorkout);
  const setCustomExercises = useWorkoutStore(s => s.setCustomExercises);
  const getActiveExercises = useWorkoutStore(s => s.getActiveExercises);

  const dayIndex = stats.totalWorkouts % 4;
  const baseDay = PLAN_2ER_SPLIT[dayIndex];

  // Get exercises from store (shared with ActiveSetScreen)
  const [exercises, setExercises] = useState<PlanExercise[]>(
    getActiveExercises(dayIndex)
  );
  const [editSets, setEditSets] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);

  // Drag state
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);
  const touchDragIdx = useRef<number | null>(null);

  const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0);
  const coachImg = "/images/coach_bertl.webp";

  function persist(list: PlanExercise[]) {
    setExercises(list);
    setCustomExercises(list, dayIndex);
  }

  // ── Drag (mouse) ────────────────────────────────────────
  function onDragStart(i: number) { setDraggingIdx(i); }
  function onDragEnter(i: number) { dragOverIdx.current = i; }
  function onDragEnd() {
    const from = draggingIdx;
    const to = dragOverIdx.current;
    setDraggingIdx(null);
    dragOverIdx.current = null;
    if (from === null || to === null || from === to) return;
    const arr = [...exercises];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    persist(arr);
  }

  // ── Touch drag ──────────────────────────────────────────
  function onTouchStart(e: React.TouchEvent, i: number) {
    touchDragIdx.current = i;
    e.currentTarget.setAttribute("data-dragging", "true");
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchDragIdx.current === null) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const idxStr = el?.closest("[data-idx]")?.getAttribute("data-idx");
    if (idxStr !== null && idxStr !== undefined) {
      dragOverIdx.current = Number(idxStr);
    }
  }
  function onTouchEnd(e: React.TouchEvent) {
    e.currentTarget.removeAttribute("data-dragging");
    const from = touchDragIdx.current;
    const to = dragOverIdx.current;
    touchDragIdx.current = null;
    dragOverIdx.current = null;
    if (from === null || to === null || from === to) return;
    const arr = [...exercises];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    persist(arr);
  }

  // ── Set count editor ────────────────────────────────────
  function changeSets(idx: number, delta: number) {
    const updated = exercises.map((ex, i) => {
      if (i !== idx) return ex;
      const next = Math.max(1, Math.min(10, ex.sets.length + delta));
      const baseReps = ex.sets[ex.sets.length - 1]?.reps ?? 8;
      const newSets = next > ex.sets.length
        ? [...ex.sets, ...Array(next - ex.sets.length).fill({ reps: baseReps })]
        : ex.sets.slice(0, next);
      return { ...ex, sets: newSets };
    });
    persist(updated);
  }

  function removeExercise(idx: number) {
    persist(exercises.filter((_, i) => i !== idx));
  }

  function addExercise(ex: PlanExercise) {
    persist([...exercises, ex]);
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

  // All exercises that can be added
  const allPlan = PLAN_2ER_SPLIT.flatMap(d => d.exercises);
  const uniqueAddable = allPlan.filter(
    (ex, i, arr) =>
      arr.findIndex(e => e.name === ex.name) === i &&
      !exercises.some(e => e.name === ex.name)
  );

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* Abort confirm */}
      {showAbortConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.88)" }}>
          <div className="rounded-2xl p-6 w-full" style={{ background: "#1a1a1a", border: "1px solid #ef4444" }}>
            <p className="font-black text-xl text-white mb-2" style={{ fontFamily: F }}>TRAINING ABBRECHEN?</p>
            <p className="text-sm text-gray-400 mb-5">Dein Fortschritt geht verloren.</p>
            <button onClick={handleAbort} className="w-full py-3 rounded-xl font-black text-white mb-2"
              style={{ background: "#ef4444", fontFamily: F }}>JA, ABBRECHEN</button>
            <button onClick={() => setShowAbortConfirm(false)} className="w-full py-3 rounded-xl font-black"
              style={{ background: "#2a2a2a", color: "#fff", fontFamily: F }}>WEITERMACHEN</button>
          </div>
        </div>
      )}

      {/* Add exercise modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.97)" }}>
          <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#2a2a2a" }}>
            <button onClick={() => setShowAddModal(false)}
              style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
            <p className="font-black text-lg text-white" style={{ fontFamily: F }}>ÜBUNG HINZUFÜGEN</p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-10 pt-2">
            {uniqueAddable.length === 0
              ? <p className="text-gray-500 text-sm mt-6 text-center">Alle Übungen bereits im Plan.</p>
              : uniqueAddable.map((ex, i) => {
                  const grouped: {reps:number;count:number}[] = [];
                  ex.sets.forEach(s => {
                    const last = grouped[grouped.length-1];
                    if (last && last.reps === s.reps) last.count++;
                    else grouped.push({reps:s.reps,count:1});
                  });
                  return (
                    <div key={i} className="flex items-center gap-3 py-3 border-b"
                      style={{ borderColor: "#1e1e1e" }}>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-white truncate">{ex.name}</p>
                        <p className="text-xs text-gray-500">{grouped.map(g=>`${g.count}×${g.reps}`).join(" · ")}</p>
                      </div>
                      <button onClick={() => addExercise(ex)}
                        className="px-4 py-1.5 rounded-xl font-black text-sm flex-shrink-0"
                        style={{ background: ORANGE, color: "#fff", fontFamily: F, border: "none" }}>
                        + ADD
                      </button>
                    </div>
                  );
                })
            }
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img src="/images/training_hero.webp" alt="Training"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.55) 50%, rgba(10,10,10,1) 100%)",
        }} />
        {/* Top row */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-4">
          <button onClick={() => navigate("/")}
            style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
          <p className="font-black text-sm tracking-widest text-white/60" style={{ fontFamily: F }}>TRAINING</p>
          {session
            ? <button onClick={() => setShowAbortConfirm(true)}
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "#ef444433", color: "#ef4444", border: "1px solid #ef4444" }}>
                ABBRECHEN
              </button>
            : <div style={{ width: 80 }} />
          }
        </div>
        {/* Title */}
        <div className="relative z-10 px-4 pt-3">
          <h1 className="font-black italic text-5xl text-white leading-none drop-shadow-lg" style={{ fontFamily: F }}>
            {baseDay.label.toUpperCase()}
          </h1>
          <p className="text-sm text-gray-300 mt-0.5 mb-3">
            {baseDay.tag === "PUSH" ? "Brust · Schultern · Trizeps" : "Rücken · Bizeps · Core"}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <span>🎯</span>
            <p className="text-xs text-white font-semibold">Volumen · {totalSets} Arbeitssätze</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 mt-4 mb-4">
        <div className="flex justify-between mb-1.5">
          <p className="text-sm font-bold text-white">0 / {exercises.length} Übungen</p>
        </div>
        <div className="w-full rounded-full" style={{ height: 4, background: "#1e1e1e" }}>
          <div className="h-full rounded-full" style={{ width: "0%", background: ORANGE }} />
        </div>
      </div>

      {/* Exercise list */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black italic text-base text-white" style={{ fontFamily: F }}>ÜBUNGSÜBERSICHT</h2>
          <p className="text-[9px] text-gray-600">⠿ Handle ziehen zum Sortieren</p>
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
            const isEdit = editSets === i;
            const isDragging = draggingIdx === i;

            return (
              <div key={i} data-idx={i}
                className="rounded-2xl"
                style={{
                  background: isDragging ? "#222" : "#161616",
                  border: `1px solid ${isDragging ? ORANGE+"88" : "#2a2a2a"}`,
                  opacity: isDragging ? 0.5 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                <div className="flex items-center gap-3 p-3">
                  {/* Drag handle – ONLY this triggers drag */}
                  <span
                    className="text-gray-500 text-xl select-none flex-shrink-0"
                    style={{ cursor: "grab", touchAction: "none" }}
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragEnter={() => onDragEnter(i)}
                    onDragEnd={onDragEnd}
                    onDragOver={(e: React.DragEvent) => e.preventDefault()}
                    onTouchStart={e => onTouchStart(e, i)}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >⠿</span>

                  {/* Number */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ fontFamily: F, background: `${ORANGE}22`, color: ORANGE, border: `1.5px solid ${ORANGE}` }}>
                    {i + 1}
                  </div>

                  {/* Thumb – tapping opens exercise */}
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden"
                    style={{ background: "#2a2a2a", cursor: "pointer" }}
                    onClick={() => navigate(`/active-set/${i}`)}>
                    <img src={coachImg} alt="" className="w-full h-full object-cover object-top"
                      style={{ filter: "brightness(0.6)" }} />
                  </div>

                  {/* Name + sets – tapping opens exercise */}
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/active-set/${i}`)}>
                    <p className="font-black text-sm text-white truncate" style={{ fontFamily: F }}>{ex.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{setsLabel}</p>
                  </div>

                  {/* Right controls – stop propagation */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <p className="text-xs font-bold" style={{ color: ORANGE }}>{ex.sets[0].reps} Wdh</p>
                    <button onClick={e => { e.stopPropagation(); setEditSets(isEdit ? null : i); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px]"
                      style={{ background: isEdit ? ORANGE : "#2a2a2a", color: isEdit ? "#fff" : "#888", border: "none" }}>
                      ✎
                    </button>
                    <button onClick={e => { e.stopPropagation(); removeExercise(i); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px]"
                      style={{ background: "#2a2a2a", color: "#ef4444", border: "none" }}>
                      ✕
                    </button>
                  </div>
                </div>

                {/* Set count editor */}
                {isEdit && (
                  <div className="px-4 pb-3 flex items-center gap-3 border-t" style={{ borderColor: "#2a2a2a" }}>
                    <p className="text-xs text-gray-400 flex-1">Sätze:</p>
                    <button onClick={() => changeSets(i, -1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ background: "#2a2a2a", color: ORANGE, border: "none" }}>−</button>
                    <p className="font-black text-lg text-white w-8 text-center" style={{ fontFamily: F }}>{ex.sets.length}</p>
                    <button onClick={() => changeSets(i, 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ background: "#2a2a2a", color: ORANGE, border: "none" }}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add exercise */}
        <button onClick={() => setShowAddModal(true)}
          className="w-full py-3 rounded-2xl font-black text-sm mb-3 flex items-center justify-center gap-2"
          style={{ background: "#1a1a1a", border: `1px dashed ${ORANGE}55`, color: ORANGE, fontFamily: F }}>
          + ÜBUNG HINZUFÜGEN
        </button>

        {/* Start */}
        <button onClick={handleStart}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: ORANGE, border: "none", fontFamily: F, boxShadow: `0 0 20px ${ORANGE}66` }}>
          WORKOUT STARTEN
        </button>
      </div>
    </div>
  );
}
