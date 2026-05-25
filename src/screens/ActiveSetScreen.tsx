import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useWorkoutStore }  from "../stores/workoutStore";
import { useStatsStore }    from "../stores/statsStore";
import { PLAN_2ER_SPLIT } from "../data/plan_2er_split";
import { BRUST_EXERCISES }    from "../data/exercises_brust";
import { RUECKEN_EXERCISES }  from "../data/exercises_ruecken";
import { SCHULTERN_EXERCISES } from "../data/exercises_schultern";
import { ARME_EXERCISES }     from "../data/exercises_arme";
import { BEINE_EXERCISES }    from "../data/exercises_beine";
import { CORE_EXERCISES }     from "../data/exercises_core";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";
const COPPER   = "#cd7f32";
const COPPER_L = "#e8a050";
const COPPER_G = "rgba(180,100,20,0.22)";
const SURF     = "#131008";
const SURF2    = "#1a1610";
const BORDER   = "rgba(205,127,50,0.18)";

const ALL_EXERCISES = [
  ...BRUST_EXERCISES, ...RUECKEN_EXERCISES, ...SCHULTERN_EXERCISES,
  ...ARME_EXERCISES, ...BEINE_EXERCISES, ...CORE_EXERCISES,
];
function getExerciseData(name: string) {
  return ALL_EXERCISES.find(e => e.name.toLowerCase() === name.toLowerCase());
}

// ── Timer Ring ────────────────────────────────────────────────────────────────
function TimerRing({ seconds, total, onAdjust, onSet }: {
  seconds: number; total: number;
  onAdjust: (d: number) => void;
  onSet?: (v: number) => void;
}) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, seconds / total);
  const dash = circ * pct;
  // Fix 3: added 0 as preset
  const PRESETS = [0, 30, 60, 90, 120];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {PRESETS.map(v => (
          <button key={v} onClick={() => onSet?.(v)}
            className="px-2.5 py-1 rounded-full text-xs font-black"
            style={{
              fontFamily: F,
              background: total === v ? ORANGE : "#1e1e1e",
              color: total === v ? "#fff" : "#888",
              border: `1px solid ${total === v ? ORANGE : "#333"}`,
            }}>{v === 0 ? "0" : `${v}s`}</button>
        ))}
      </div>
      <div className="flex items-center gap-6">
        <button onClick={() => onAdjust(-15)}
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: "transparent", border: `2px solid ${ORANGE}`, color: ORANGE }}>−</button>
        <div className="relative" style={{ width: 160, height: 160 }}>
          <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="80" cy="80" r={r} fill="none" stroke="#2a1f10" strokeWidth="8" />
            <circle cx="80" cy="80" r={r} fill="none" stroke={ORANGE} strokeWidth="8"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-black text-5xl text-white leading-none" style={{ fontFamily: F }}>{seconds}</p>
            <p className="text-xs text-gray-500 tracking-widest mt-1">SEK.</p>
          </div>
        </div>
        <button onClick={() => onAdjust(15)}
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: "transparent", border: `2px solid ${ORANGE}`, color: ORANGE }}>+</button>
      </div>
    </div>
  );
}

// ── Number Input ──────────────────────────────────────────────────────────────
function NumberInput({ value, onChange, step = 1, unit, label, subLabel }: {
  value: number; onChange: (v: number) => void;
  step?: number; unit?: string; label?: string; subLabel?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(String(value));
    setEditing(true);
    setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 10);
  }
  function commitEdit() {
    const v = parseFloat(draft.replace(",", "."));
    if (!isNaN(v) && v >= 0) onChange(Math.round(v * 4) / 4);
    setEditing(false);
  }

  return (
    <div className="flex flex-col items-center">
      {label && <p className="text-xs text-gray-500 tracking-widest mb-3 font-bold">{label}</p>}
      <div className="flex items-center gap-6">
        <button onClick={() => onChange(Math.max(0, value - step))}
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: "transparent", border: `2px solid ${ORANGE}`, color: ORANGE }}>−</button>
        <div className="text-center min-w-[120px]">
          {editing ? (
            <input ref={inputRef} value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e => e.key === "Enter" && commitEdit()}
              className="font-black text-center text-white bg-transparent outline-none w-full"
              style={{ fontFamily: F, fontSize: 52, borderBottom: `2px solid ${ORANGE}` }}
              inputMode="decimal" autoFocus />
          ) : (
            <p className="font-black text-white leading-none cursor-pointer"
              style={{ fontFamily: F, fontSize: 52 }} onClick={startEdit}>
              {step < 1 ? value.toFixed(1).replace(".", ",") : value}
            </p>
          )}
          {unit && <p className="text-sm text-gray-400 mt-1">{unit}</p>}
          {subLabel && <p className="text-xs text-gray-600 mt-0.5">{subLabel}</p>}
        </div>
        <button onClick={() => onChange(value + step)}
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: "transparent", border: `2px solid ${ORANGE}`, color: ORANGE }}>+</button>
      </div>
    </div>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export function ActiveSetScreen() {
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();
  // State direkt aus den jeweiligen Stores
  const stats   = useStatsStore(s => s.stats);
  const session = useWorkoutStore(s => s.session);
  // Actions weiterhin über Bridge (finishWorkout hat Supabase-Sync eingebaut)
  const { completeSet, completeExercise, finishWorkout } = usePawgressStore();
  const recordSet          = useWorkoutStore(s => s.recordSet);
  const resetWorkout       = useWorkoutStore(s => s.resetWorkout);
  const getActiveExercises = useWorkoutStore(s => s.getActiveExercises);
  const getSetProgress     = useWorkoutStore(s => s.getSetProgress);
  const updateSetProgress  = useWorkoutStore(s => s.updateSetProgress);
  const advanceSet         = useWorkoutStore(s => s.advanceSet);

  const dayIndex       = stats.totalWorkouts % 4;
  const activeExercises = getActiveExercises(dayIndex);
  const exIndex        = Number(index) ?? 0;
  const planEx         = activeExercises[exIndex];
  const defaultReps    = planEx?.sets[0]?.reps ?? 8;

  // Fix 1: Load persisted progress from store
  const savedProgress  = getSetProgress(exIndex, defaultReps);
  const totalSets      = planEx?.sets.length ?? 3;

  const [weight, setWeightState]  = useState(savedProgress.weight);
  const [reps, setRepsState]      = useState(savedProgress.reps);
  const [currentSet, setCurrentSetState] = useState(savedProgress.currentSet);
  const [setDone, setSetDone]     = useState(false);
  const [timerTotal, setTimerTotal] = useState(120);
  const [timerSec, setTimerSec]   = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showTip, setShowTip]     = useState(false);
  const [showAbort, setShowAbort] = useState(false);
  // Fix 2: local extra sets (on top of plan)
  const [extraSets, setExtraSets] = useState(0);
  const effectiveTotalSets = totalSets + extraSets;

  const exData = planEx ? getExerciseData(planEx.name) : null;

  // Persist weight+reps on change
  function setWeight(v: number) { setWeightState(v); updateSetProgress(exIndex, { weight: v }); }
  function setReps(v: number)   { setRepsState(v);   updateSetProgress(exIndex, { reps: v });   }
  function setCurrentSet(v: number) {
    setCurrentSetState(v);
    updateSetProgress(exIndex, { currentSet: v });
  }

  useEffect(() => {
    if (!timerRunning) return;
    if (timerSec <= 0) { setTimerRunning(false); return; }
    const id = setInterval(() => setTimerSec(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSec]);

  function adjustTimer(delta: number) {
    const next = Math.max(0, timerTotal + delta);
    setTimerTotal(next); setTimerSec(next);
  }

  function handleSetDone() {
    completeSet(exIndex, weight, reps);
    recordSet(planEx.name, weight, reps);
    // Auto-start timer only if > 0
    if (timerTotal > 0) {
      setTimerSec(timerTotal);
      setTimerRunning(true);
    }
    setSetDone(true);
  }

  function handleContinue() {
    if (currentSet >= effectiveTotalSets) {
      completeExercise(exIndex);
      updateSetProgress(exIndex, { done: true });
      const nextIndex = exIndex + 1;
      if (nextIndex < activeExercises.length) {
        navigate(`/active-set/${nextIndex}`);
      } else {
        const cats = activeExercises.map(e => e.name);
        finishWorkout(cats, weight, session?.startTime);
        navigate("/workout-done");
      }
    } else {
      const next = currentSet + 1;
      setCurrentSet(next);
      setReps(planEx?.sets[next - 1]?.reps ?? defaultReps);
      setSetDone(false);
    }
  }

  function handleAbort() {
    resetWorkout();
    navigate("/training");
  }

  if (!planEx) return null;

  const AbortModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.9)" }}>
      <div className="rounded-2xl p-6 w-full" style={{ background: "#1a1a1a", border: "1px solid #ef4444" }}>
        <p className="font-black text-xl text-white mb-2" style={{ fontFamily: F }}>TRAINING ABBRECHEN?</p>
        <p className="text-sm text-gray-400 mb-5">Dein Fortschritt geht verloren.</p>
        <button onClick={handleAbort} className="w-full py-3 rounded-xl font-black text-white mb-2"
          style={{ background: "#ef4444", fontFamily: F, border: "none" }}>JA, ABBRECHEN</button>
        <button onClick={() => setShowAbort(false)} className="w-full py-3 rounded-xl font-black"
          style={{ background: "#2a2a2a", color: "#fff", fontFamily: F, border: "none" }}>WEITERMACHEN</button>
      </div>
    </div>
  );

  // ── Set-Done Rest Screen ──────────────────────────────────────────────────
  if (setDone && currentSet < effectiveTotalSets) return (
    <div className="min-h-screen flex flex-col pb-10" style={{ background: "#080808", color: "#fff" }}>
      {showAbort && <AbortModal />}
      <div className="flex items-center justify-between px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #1e1e1e" }}>
        <button onClick={() => navigate("/training")}
          style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="text-center">
          <p className="font-black text-lg text-white" style={{ fontFamily: F }}>{planEx.name}</p>
          <p className="text-xs text-gray-500">Satz {currentSet} von {effectiveTotalSets} abgeschlossen</p>
        </div>
        <button onClick={() => setShowAbort(true)} className="text-xs font-bold px-2 py-1 rounded"
          style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444" }}>STOP</button>
      </div>

      <div className="flex flex-col items-center px-6 pt-8 flex-1">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
          style={{ background: "#22c55e22", border: "2px solid #22c55e" }}>✓</div>
        <p className="font-black text-3xl text-white mb-1" style={{ fontFamily: F }}>STARK GEMACHT!</p>
        <p className="text-sm text-gray-400 mb-6">
          {weight > 0 ? `${weight} kg × ${reps} Wdh` : `BW × ${reps} Wdh`}
        </p>
        <p className="text-xs text-gray-500 tracking-widest font-bold mb-4">REST TIMER</p>
        <TimerRing seconds={timerSec} total={timerTotal} onAdjust={adjustTimer}
          onSet={v => { setTimerTotal(v); setTimerSec(v); if (v === 0) setTimerRunning(false); }} />
        {timerTotal > 0 && (
          <button onClick={() => setTimerRunning(r => !r)} className="mt-3 text-sm"
            style={{ background: "none", border: "none", color: ORANGE }}>
            {timerRunning ? "⏸ Pause" : "▶ Fortsetzen"}
          </button>
        )}
        <div className="flex-1" />
        <button onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-black text-xl text-white mt-6"
          style={{ background: ORANGE, border: "none", fontFamily: F }}>
          NÄCHSTER SATZ →
        </button>
      </div>
    </div>
  );

  // ── Active Set Screen ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-8" style={{ background: "#080808", color: "#fff" }}>
      {showAbort && <AbortModal />}

      {/* Header – back does NOT abort, progress is saved */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #1e1e1e" }}>
        <button onClick={() => navigate("/training")}
          style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="text-center">
          <p className="font-black text-xl text-white" style={{ fontFamily: F }}>{planEx.name}</p>
          <p className="text-xs text-gray-500">
            {PLAN_2ER_SPLIT[dayIndex]?.tag === "PUSH" ? "Brust · Schultern · Trizeps" : "Rücken · Bizeps · Core"}
          </p>
        </div>
        <button onClick={() => setShowAbort(true)} className="text-xs font-bold px-2 py-1 rounded"
          style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444" }}>STOP</button>
      </div>

      {/* Set indicator + Fix 2: +/- set count */}
      <div className="text-center pt-5 pb-4">
        <p className="text-sm font-bold text-white mb-2">Satz {currentSet} von {effectiveTotalSets}</p>
        {/* Dots */}
        <div className="flex justify-center gap-2.5 mb-3">
          {Array.from({ length: effectiveTotalSets }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full transition-all"
              style={{ background: i < currentSet - 1 ? "#22c55e" : i === currentSet - 1 ? ORANGE : "#2a2a2a" }} />
          ))}
        </div>
        {/* Fix 2: set count editor */}
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => { if (effectiveTotalSets > 1) setExtraSets(e => e - 1); }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-base font-bold"
            style={{ background: "#1e1e1e", color: ORANGE, border: "none" }}>−</button>
          <p className="text-xs text-gray-600">{effectiveTotalSets} Sätze</p>
          <button onClick={() => setExtraSets(e => e + 1)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-base font-bold"
            style={{ background: "#1e1e1e", color: ORANGE, border: "none" }}>+</button>
        </div>
      </div>

      <div style={{ height: 1, background: "#1e1e1e", margin: "0 24px 24px" }} />

      {/* Weight */}
      <div className="px-6 mb-6">
        <NumberInput value={weight} onChange={setWeight} step={2.5} unit="kg" label="GEWICHT" />
      </div>
      <div style={{ height: 1, background: "#1e1e1e", margin: "0 24px 24px" }} />

      {/* Reps */}
      <div className="px-6 mb-6">
        <NumberInput value={reps} onChange={setReps} step={1} label="WIEDERHOLUNGEN"
          subLabel={`ZIEL: ${planEx.sets[currentSet - 1]?.reps ?? defaultReps} Wdh`} />
      </div>
      <div style={{ height: 1, background: "#1e1e1e", margin: "0 24px 24px" }} />

      {/* Timer */}
      <div className="px-6 mb-6">
        <p className="text-xs text-gray-500 tracking-widest font-bold text-center mb-4">REST TIMER</p>
        <div className="flex justify-center">
          <TimerRing seconds={timerSec} total={timerTotal} onAdjust={adjustTimer}
            onSet={v => { setTimerTotal(v); setTimerSec(v); if (v === 0) setTimerRunning(false); }} />
        </div>
        {timerTotal > 0 && (
          <div className="flex justify-center mt-2">
            <button onClick={() => setTimerRunning(r => !r)} className="text-sm"
              style={{ background: "none", border: "none", color: ORANGE }}>
              {timerRunning ? "⏸ Pause" : "▶ Start"}
            </button>
          </div>
        )}
      </div>

      {/* Tipp */}
      <div className="px-6 mb-6">
        <button onClick={() => setShowTip(t => !t)}
          className="w-full flex items-start gap-3 p-4 rounded-2xl text-left"
          style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${ORANGE}33` }}>
          <span style={{ color: ORANGE, fontSize: 22, flexShrink: 0 }}>💡</span>
          <div className="flex-1">
            <p className="font-black text-sm" style={{ color: ORANGE, fontFamily: F }}>TIPP</p>
            {!showTip
              ? <p className="text-xs text-gray-400 mt-0.5">Tippe für Coaching-Cues & Tipps</p>
              : <div className="text-xs text-gray-300 mt-1.5">
                  {exData?.cues && exData.cues.length > 0
                    ? <>
                        <p className="font-bold text-white mb-1.5">{planEx.name}</p>
                        {exData.cues.map((cue, ci) => (
                          <div key={ci} className="flex gap-2 mb-1.5">
                            <span style={{ color: ORANGE }}>›</span><span>{cue}</span>
                          </div>
                        ))}
                        {exData.breathing && (
                          <div className="mt-2 pt-2 border-t" style={{ borderColor: `${BORDER}` }}>
                            <span className="text-blue-400 font-bold">Atmung: </span>
                            <span className="text-gray-300">{exData.breathing}</span>
                          </div>
                        )}
                      </>
                    : <p className="text-gray-400 mt-0.5">Keine Cues verfügbar.</p>
                  }
                </div>
            }
          </div>
          <span className="text-gray-600 text-lg">{showTip ? "↑" : "›"}</span>
        </button>
      </div>

      {/* CTA */}
      <div className="px-6">
        <button onClick={currentSet >= effectiveTotalSets ? handleContinue : handleSetDone}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: ORANGE, border: "none", fontFamily: F, boxShadow: `0 0 20px ${ORANGE}55` }}>
          {currentSet >= effectiveTotalSets ? "ÜBUNG ABSCHLIESSEN ✓" : "SATZ ABSCHLIESSEN ✓"}
        </button>
      </div>
    </div>
  );
}
