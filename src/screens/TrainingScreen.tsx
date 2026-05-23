import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PLAN_2ER_SPLIT, type PlanExercise } from "../data/plan_2er_split";
import { AREA_DATA } from "../data/areaData";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useWorkoutStore } from "../stores/workoutStore";
import type { AreaName } from "../types";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

// ── Gym areas config ──────────────────────────────────────────────────────────
const AREAS: { key: AreaName; label: string; img: string }[] = [
  { key: "BRUST",    label: "Brust",    img: "/images/gym_brust.webp" },
  { key: "RUECKEN",  label: "Rücken",   img: "/images/gym_ruecken.webp" },
  { key: "BEINE",    label: "Beine",    img: "/images/gym_beine.webp" },
  { key: "SCHULTERN",label: "Schultern",img: "/images/gym_schultern.webp" },
  { key: "ARME",     label: "Arme",     img: "/images/gym_arme.webp" },
  { key: "CORE",     label: "Core",     img: "/images/gym_core.webp" },
  { key: "CARDIO",   label: "Cardio",   img: "/images/gym_cardio.webp" },
  { key: "STRETCH",  label: "Stretch",  img: "/images/gym_stretch.webp" },
];

// ── Workout-Select Modal ──────────────────────────────────────────────────────
function WorkoutSelectModal({ onClose, onSelect }: {
  onClose: () => void;
  onSelect: (dayIndex: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.96)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#1e1e1e" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <p className="font-black italic text-xl text-white" style={{ fontFamily: F }}>WORKOUT AUSWÄHLEN</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10 flex flex-col gap-3">
        {PLAN_2ER_SPLIT.map((day, i) => {
          const sets = day.exercises.reduce((a,e) => a + e.sets.length, 0);
          return (
            <button key={i} onClick={() => onSelect(i)}
              className="w-full text-left rounded-2xl p-4"
              style={{ background: "#111", border: `1px solid ${day.color}44` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0"
                  style={{ background: `${day.color}22`, color: day.color, fontFamily: F }}>{i+1}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black"
                      style={{ background: day.color, color: "#fff", fontFamily: F }}>{day.tag}</span>
                    <p className="font-black text-lg text-white" style={{ fontFamily: F }}>{day.label.toUpperCase()}</p>
                  </div>
                  <p className="text-xs text-gray-500">{day.exercises.length} Übungen · {sets} Sätze</p>
                </div>
                <span className="text-gray-600 text-xl">›</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Plan-Select Modal ─────────────────────────────────────────────────────────
function PlanSelectModal({ onClose, onSelect }: {
  onClose: () => void;
  onSelect: (dayIndex: number) => void;
}) {
  const plans = [
    { name: "2er Split", desc: "Push · Pull · 4 Tage/Woche", icon: "🏋️", color: ORANGE },
  ];
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.96)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#1e1e1e" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <p className="font-black italic text-xl text-white" style={{ fontFamily: F }}>PLAN AUSWÄHLEN</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10 flex flex-col gap-3">
        {plans.map((plan, i) => (
          <div key={i} className="rounded-2xl overflow-hidden"
            style={{ background: "#111", border: `1px solid ${plan.color}44` }}>
            <div className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${plan.color}22` }}>{plan.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-black text-lg text-white" style={{ fontFamily: F }}>{plan.name}</p>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black"
                    style={{ background: "#22c55e", color: "#fff", fontFamily: F }}>AKTIV</span>
                </div>
                <p className="text-xs text-gray-500">{plan.desc}</p>
              </div>
            </div>
            <div className="border-t" style={{ borderColor: "#1e1e1e" }}>
              {PLAN_2ER_SPLIT.map((day, di) => (
                <button key={di} onClick={() => onSelect(di)}
                  className="w-full flex items-center gap-3 px-4 py-3 border-b text-left"
                  style={{ background: "none", border: "none", borderBottom: di < PLAN_2ER_SPLIT.length-1 ? "1px solid #1e1e1e" : "none" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                    style={{ background: `${day.color}22`, color: day.color }}>{di+1}</span>
                  <p className="font-bold text-sm text-white flex-1" style={{ fontFamily: F }}>{day.label}</p>
                  <span className="text-xs text-gray-600">{day.exercises.length} Übungen ›</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Training Edit Screen (reused from old TrainingScreen logic) ────────────────
function TrainingEditScreen({
  dayIndex,
  onBack,
}: { dayIndex: number; onBack: () => void }) {
  const navigate = useNavigate();
  const { startWorkout } = usePawgressStore();
  const session = useWorkoutStore(s => s.session);
  const resetWorkout = useWorkoutStore(s => s.resetWorkout);
  const setCustomExercises = useWorkoutStore(s => s.setCustomExercises);
  const getActiveExercises = useWorkoutStore(s => s.getActiveExercises);

  const baseDay = PLAN_2ER_SPLIT[dayIndex];
  const [exercises, setExercises] = useState<PlanExercise[]>(getActiveExercises(dayIndex));
  const [editSets, setEditSets] = useState<number | null>(null);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);
  const touchDragIdx = useRef<number | null>(null);
  const coachImg = "/images/coach_bertl.webp";

  function persist(list: PlanExercise[]) {
    setExercises(list);
    setCustomExercises(list, dayIndex);
  }

  function onDragStart(i: number) { setDraggingIdx(i); }
  function onDragEnter(i: number) { dragOverIdx.current = i; }
  function onDragEnd() {
    const from = draggingIdx; const to = dragOverIdx.current;
    setDraggingIdx(null); dragOverIdx.current = null;
    if (from === null || to === null || from === to) return;
    const arr = [...exercises]; const [item] = arr.splice(from, 1); arr.splice(to, 0, item);
    persist(arr);
  }
  function onTouchStart(e: React.TouchEvent, i: number) { touchDragIdx.current = i; }
  function onTouchMove(e: React.TouchEvent) {
    if (touchDragIdx.current === null) return;
    const el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    const s = el?.closest("[data-idx]")?.getAttribute("data-idx");
    if (s != null) dragOverIdx.current = Number(s);
  }
  function onTouchEnd() {
    const from = touchDragIdx.current; const to = dragOverIdx.current;
    touchDragIdx.current = null; dragOverIdx.current = null;
    if (from === null || to === null || from === to) return;
    const arr = [...exercises]; const [item] = arr.splice(from, 1); arr.splice(to, 0, item);
    persist(arr);
  }
  function changeSets(idx: number, delta: number) {
    persist(exercises.map((ex, i) => {
      if (i !== idx) return ex;
      const next = Math.max(1, Math.min(10, ex.sets.length + delta));
      const baseReps = ex.sets[ex.sets.length-1]?.reps ?? 8;
      return { ...ex, sets: next > ex.sets.length
        ? [...ex.sets, ...Array(next - ex.sets.length).fill({ reps: baseReps })]
        : ex.sets.slice(0, next) };
    }));
  }
  function removeExercise(idx: number) { persist(exercises.filter((_, i) => i !== idx)); }

  const allAddable = PLAN_2ER_SPLIT.flatMap(d => d.exercises).filter(
    (ex, i, arr) => arr.findIndex(e => e.name === ex.name) === i && !exercises.some(e => e.name === ex.name)
  );

  const totalSets = exercises.reduce((a,e) => a + e.sets.length, 0);

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      {showAbortConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: "rgba(0,0,0,0.88)" }}>
          <div className="rounded-2xl p-6 w-full" style={{ background: "#1a1a1a", border: "1px solid #ef4444" }}>
            <p className="font-black text-xl text-white mb-2" style={{ fontFamily: F }}>TRAINING ABBRECHEN?</p>
            <p className="text-sm text-gray-400 mb-5">Dein Fortschritt geht verloren.</p>
            <button onClick={() => { resetWorkout(); setShowAbortConfirm(false); onBack(); }}
              className="w-full py-3 rounded-xl font-black text-white mb-2"
              style={{ background: "#ef4444", fontFamily: F, border: "none" }}>JA, ABBRECHEN</button>
            <button onClick={() => setShowAbortConfirm(false)} className="w-full py-3 rounded-xl font-black"
              style={{ background: "#2a2a2a", color: "#fff", fontFamily: F, border: "none" }}>WEITERMACHEN</button>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.97)" }}>
          <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#1e1e1e" }}>
            <button onClick={() => setShowAddModal(false)} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
            <p className="font-black text-lg text-white" style={{ fontFamily: F }}>ÜBUNG HINZUFÜGEN</p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-10 pt-2">
            {allAddable.map((ex, i) => {
              const g: {reps:number;count:number}[] = [];
              ex.sets.forEach(s => { const l = g[g.length-1]; if (l && l.reps===s.reps) l.count++; else g.push({reps:s.reps,count:1}); });
              return (
                <div key={i} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: "#1e1e1e" }}>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate">{ex.name}</p>
                    <p className="text-xs text-gray-500">{g.map(x=>`${x.count}×${x.reps}`).join(" · ")}</p>
                  </div>
                  <button onClick={() => { persist([...exercises, ex]); setShowAddModal(false); }}
                    className="px-4 py-1.5 rounded-xl font-black text-sm flex-shrink-0"
                    style={{ background: ORANGE, color: "#fff", fontFamily: F, border: "none" }}>+ ADD</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img src="/images/training_hero.webp" alt=""
          className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "center 20%" }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.65) 55%, rgba(8,8,8,1) 100%)",
        }} />
        <div className="relative z-10 flex items-center justify-between px-4 pt-4">
          <button onClick={onBack} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
          <p className="font-black text-sm tracking-widest text-white/60" style={{ fontFamily: F }}>TRAINING</p>
          {session
            ? <button onClick={() => setShowAbortConfirm(true)} className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "#ef444433", color: "#ef4444", border: "1px solid #ef4444" }}>ABBRECHEN</button>
            : <div style={{ width: 80 }} />
          }
        </div>
        <div className="relative z-10 px-4 pt-2">
          <h1 className="font-black italic text-5xl text-white leading-none drop-shadow-lg" style={{ fontFamily: F }}>
            {baseDay.label.toUpperCase()}
          </h1>
          <p className="text-sm text-gray-300 mb-3">{baseDay.tag === "PUSH" ? "Brust · Schultern · Trizeps" : "Rücken · Bizeps · Core"}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span>🎯</span><p className="text-xs text-white font-semibold">Volumen · {totalSets} Arbeitssätze</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 mb-4">
        <div className="flex justify-between mb-1.5">
          <p className="text-sm font-bold text-white">0 / {exercises.length} Übungen</p>
        </div>
        <div className="w-full rounded-full" style={{ height: 4, background: "#1e1e1e" }}>
          <div className="h-full rounded-full" style={{ width: "0%", background: ORANGE }} />
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black italic text-base text-white" style={{ fontFamily: F }}>ÜBUNGSÜBERSICHT</h2>
          <p className="text-[9px] text-gray-600">⠿ Handle ziehen</p>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          {exercises.map((ex, i) => {
            const g: {reps:number;count:number}[] = [];
            ex.sets.forEach(s => { const l = g[g.length-1]; if (l && l.reps===s.reps) l.count++; else g.push({reps:s.reps,count:1}); });
            const isEdit = editSets === i; const isDrag = draggingIdx === i;
            return (
              <div key={i} data-idx={i} className="rounded-2xl"
                style={{ background: isDrag ? "#222" : "#111", border: `1px solid ${isDrag ? ORANGE+"88":"#1e1e1e"}`, opacity: isDrag ? 0.5 : 1 }}>
                <div className="flex items-center gap-3 p-3">
                  <span className="text-gray-500 text-xl select-none flex-shrink-0" style={{ cursor:"grab",touchAction:"none" }}
                    draggable onDragStart={() => onDragStart(i)} onDragEnter={() => onDragEnter(i)}
                    onDragEnd={onDragEnd} onDragOver={e => e.preventDefault()}
                    onTouchStart={e => onTouchStart(e, i)} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>⠿</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ fontFamily:F, background:`${ORANGE}22`, color:ORANGE, border:`1.5px solid ${ORANGE}` }}>{i+1}</div>
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 overflow-hidden cursor-pointer" style={{ background:"#2a2a2a" }}
                    onClick={() => navigate(`/active-set/${i}`)}>
                    <img src={coachImg} alt="" className="w-full h-full object-cover object-top" style={{ filter:"brightness(0.6)" }} />
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/active-set/${i}`)}>
                    <p className="font-black text-sm text-white truncate" style={{ fontFamily:F }}>{ex.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{g.map(x=>`${x.count}×${x.reps}`).join(" · ")}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <p className="text-xs font-bold" style={{ color:ORANGE }}>{ex.sets[0].reps} Wdh</p>
                    <button onClick={e => { e.stopPropagation(); setEditSets(isEdit ? null : i); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px]"
                      style={{ background: isEdit ? ORANGE : "#2a2a2a", color: isEdit ? "#fff":"#888", border:"none" }}>✎</button>
                    <button onClick={e => { e.stopPropagation(); removeExercise(i); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px]"
                      style={{ background:"#2a2a2a", color:"#ef4444", border:"none" }}>✕</button>
                  </div>
                </div>
                {isEdit && (
                  <div className="px-4 pb-3 flex items-center gap-3 border-t" style={{ borderColor:"#1e1e1e" }}>
                    <p className="text-xs text-gray-400 flex-1">Sätze:</p>
                    <button onClick={() => changeSets(i,-1)} className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ background:"#2a2a2a", color:ORANGE, border:"none" }}>−</button>
                    <p className="font-black text-lg text-white w-8 text-center" style={{ fontFamily:F }}>{ex.sets.length}</p>
                    <button onClick={() => changeSets(i,1)} className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ background:"#2a2a2a", color:ORANGE, border:"none" }}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="w-full py-3 rounded-2xl font-black text-sm mb-3 flex items-center justify-center gap-2"
          style={{ background:"#111", border:`1px dashed ${ORANGE}55`, color:ORANGE, fontFamily:F }}>
          + ÜBUNG HINZUFÜGEN
        </button>
        <button onClick={() => { startWorkout(); navigate("/active-set/0"); }}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background:ORANGE, border:"none", fontFamily:F, boxShadow:`0 0 20px ${ORANGE}66` }}>
          WORKOUT STARTEN
        </button>
      </div>
    </div>
  );
}

// ── Main Training Screen ──────────────────────────────────────────────────────
export function TrainingScreen() {
  const navigate = useNavigate();
  const { stats, startWorkout } = usePawgressStore();
  const setCustomExercises = useWorkoutStore(s => s.setCustomExercises);

  const [modal, setModal] = useState<null | "workout" | "plan">(null);
  const [editDayIndex, setEditDayIndex] = useState<number | null>(null);

  const dayIndex = stats.totalWorkouts % 4;
  const nextDay  = PLAN_2ER_SPLIT[dayIndex];

  function startFreeWorkout() {
    // Empty exercise list
    setCustomExercises([], dayIndex);
    setEditDayIndex(dayIndex);
  }

  function handleWorkoutSelect(di: number) {
    setModal(null);
    setEditDayIndex(di);
  }

  function handlePlanSelect(di: number) {
    setModal(null);
    setEditDayIndex(di);
  }

  function handlePlanContinue() {
    setEditDayIndex(dayIndex);
  }

  // If editing a workout, show edit screen
  if (editDayIndex !== null) {
    return <TrainingEditScreen dayIndex={editDayIndex} onBack={() => setEditDayIndex(null)} />;
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>

      {modal === "workout" && (
        <WorkoutSelectModal onClose={() => setModal(null)} onSelect={handleWorkoutSelect} />
      )}
      {modal === "plan" && (
        <PlanSelectModal onClose={() => setModal(null)} onSelect={handlePlanSelect} />
      )}

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: 300 }}>
        {/* Background gym image */}
        <img src="/images/training_hero.webp" alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }} />
        {/* Dark overlay – heavier at bottom */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(8,8,8,0.35) 0%, rgba(8,8,8,0.55) 40%, rgba(8,8,8,1) 100%)",
        }} />
        {/* Text content – left side */}
        <div className="relative z-20 px-4 pt-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${ORANGE}28`, border: `1.5px solid ${ORANGE}77` }}>
              <img src="/images/paw.webp" alt="" className="w-6 h-6 object-contain" />
            </div>
            <p className="font-black italic leading-none drop-shadow-lg"
              style={{ fontFamily: F, fontSize: 44, color: "#fff" }}>
              TRAINING
            </p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)", maxWidth: "60%" }}>
            Dein Hub für{" "}
            <span style={{ color: ORANGE }}>Workouts</span>,{" "}
            <span style={{ color: ORANGE }}>Übungen</span>{" "}
            &amp; <span style={{ color: ORANGE }}>Wissen</span>.
          </p>
        </div>
      </div>

      {/* ── SCHNELL STARTEN ── */}
      <div className="px-4 mt-5 mb-5">
        <p className="font-black italic text-xl text-white mb-3" style={{ fontFamily: F }}>
          SCHNELL STARTEN
        </p>
        <div className="rounded-2xl p-4" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                    <circle cx="12" cy="12" r="11" stroke={ORANGE} strokeWidth="1.5"/>
                    <polygon points="10,8 18,12 10,16" fill={ORANGE}/>
                  </svg>
                ),
                label: "WORKOUT\nSTARTEN",
                sub: "Starte dein\nnächstes Workout",
                action: () => setModal("workout"),
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                    <rect x="3" y="10" width="4" height="4" rx="1" stroke={ORANGE} strokeWidth="1.5"/>
                    <line x1="7" y1="12" x2="17" y2="12" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                    <rect x="17" y="10" width="4" height="4" rx="1" stroke={ORANGE} strokeWidth="1.5"/>
                    <line x1="12" y1="5" x2="12" y2="8" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="12" y1="16" x2="12" y2="19" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                label: "FREIES\nTRAINING\nSTARTEN",
                sub: "Eigene Übungen\nund Pläne",
                action: startFreeWorkout,
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke={ORANGE} strokeWidth="1.5"/>
                    <line x1="3" y1="9" x2="21" y2="9" stroke={ORANGE} strokeWidth="1.5"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                    <polyline points="8,14 11,17 16,12" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                label: "PLAN\nFORTSETZEN",
                sub: "Weiter mit deinem\naktuellen Plan",
                action: handlePlanContinue,
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke={ORANGE} strokeWidth="1.5"/>
                    <line x1="7" y1="9" x2="17" y2="9" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="7" y1="13" x2="17" y2="13" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="7" y1="17" x2="13" y2="17" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                label: "PLAN\nAUSWÄHLEN",
                sub: "Wähle einen Plan\noder ein Workout",
                action: () => setModal("plan"),
              },
            ].map((item, i) => (
              <button key={i} onClick={item.action}
                className="flex flex-col items-center gap-2 text-center"
                style={{ background: "none", border: "none", padding: 0 }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `${ORANGE}18` }}>
                  {item.icon}
                </div>
                <p className="font-black text-[10px] text-white leading-tight whitespace-pre-line"
                  style={{ fontFamily: F }}>{item.label}</p>
                <p className="text-[8px] text-gray-500 leading-tight whitespace-pre-line">{item.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── NÄCHSTES WORKOUT ── */}
      <div className="mx-4 mb-5 rounded-2xl p-4" style={{
        background: "#111",
        border: `1px solid ${nextDay.color}55`,
        boxShadow: `0 0 20px ${nextDay.color}18`,
      }}>
        <p className="font-black text-xs tracking-widest mb-2" style={{ color: nextDay.color, fontFamily: F }}>
          NÄCHSTES WORKOUT
        </p>
        <div className="flex items-start justify-between gap-3">
          {/* Left: info */}
          <div className="flex-1 min-w-0">
            <p className="font-black italic leading-none mb-1" style={{ fontFamily: F, fontSize: 40, color: "#fff" }}>
              {nextDay.label.toUpperCase()}
            </p>
            <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
              {nextDay.tag === "PUSH" ? "Brust • Schultern • Trizeps" : "Rücken • Bizeps • Core"}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>⏱</span>
                <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>~60 Min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ color: nextDay.color, fontSize: 13 }}>🏆</span>
                <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>{nextDay.exercises.length} Übungen</span>
              </div>
            </div>
          </div>
          {/* Right: buttons stacked */}
          <div className="flex flex-col gap-2 flex-shrink-0" style={{ minWidth: 145 }}>
            <button onClick={() => setEditDayIndex(dayIndex)}
              className="flex items-center justify-center gap-2 rounded-2xl font-black text-sm text-white"
              style={{
                background: nextDay.color,
                border: "none",
                fontFamily: F,
                boxShadow: `0 0 16px ${nextDay.color}55`,
                padding: "14px 12px",
                lineHeight: 1.2,
              }}>
              <svg viewBox="0 0 20 20" fill="white" width="16" height="16" style={{ flexShrink: 0 }}>
                <polygon points="5,3 18,10 5,17"/>
              </svg>
              WORKOUT<br/>STARTEN
            </button>
            <button onClick={() => setEditDayIndex(dayIndex)}
              className="rounded-2xl font-black text-xs text-white text-center"
              style={{
                background: "transparent",
                border: "1px solid #2a2a2a",
                fontFamily: F,
                padding: "10px 12px",
              }}>
              Details ansehen &rsaquo;
            </button>
          </div>
        </div>
      </div>

      {/* ── ÜBUNGEN ENTDECKEN ── */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-black italic text-xl text-white" style={{ fontFamily: F }}>ÜBUNGEN ENTDECKEN</p>
          <button className="text-xs font-bold" style={{ color: ORANGE, background: "none", border: "none" }}>
            Alle anzeigen ›
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {AREAS.map(area => {
            const data = AREA_DATA[area.key];
            const count = data?.exercises?.length ?? 0;
            return (
              <button key={area.key}
                onClick={() => navigate(`/gym/${area.key}`)}
                className="relative rounded-2xl overflow-hidden text-left"
                style={{ height: 150, background: "#111", border: "none", padding: 0 }}>
                {/* Background image – shifted right so neon text stays visible */}
                <img src={area.img} alt={area.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.85, objectPosition: "60% center" }} />
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(to top, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.45) 50%, rgba(8,8,8,0.1) 100%)`,
                }} />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-black text-base leading-none" style={{ fontFamily: F, color: data?.color ?? "#fff" }}>
                    {area.label.toUpperCase()}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-gray-400">{count} Übungen</p>
                    <span className="text-sm" style={{ color: data?.color ?? ORANGE }}>›</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
