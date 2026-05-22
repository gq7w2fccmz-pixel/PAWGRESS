import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useWorkoutStore } from "../stores/workoutStore";
import { PLAN_2ER_SPLIT } from "../data/plan_2er_split";
import { BRUST_EXERCISES }    from "../data/exercises_brust";
import { RUECKEN_EXERCISES }  from "../data/exercises_ruecken";
import { SCHULTERN_EXERCISES } from "../data/exercises_schultern";
import { ARME_EXERCISES }     from "../data/exercises_arme";
import { BEINE_EXERCISES }    from "../data/exercises_beine";
import { CORE_EXERCISES }     from "../data/exercises_core";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

// Build lookup map for cues/tips from all exercise libraries
const ALL_EXERCISES = [
  ...BRUST_EXERCISES, ...RUECKEN_EXERCISES, ...SCHULTERN_EXERCISES,
  ...ARME_EXERCISES, ...BEINE_EXERCISES, ...CORE_EXERCISES,
];
function getExerciseData(name: string) {
  return ALL_EXERCISES.find(e => e.name.toLowerCase() === name.toLowerCase());
}

// ── Timer Ring ───────────────────────────────────────────────────────────────
function TimerRing({ seconds, total, onAdjust, onSet }: {
  seconds: number; total: number;
  onAdjust: (d: number) => void;
  onSet?: (v: number) => void;
}) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, seconds / total);
  const dash = circ * pct;
  const PRESETS = [30, 60, 90, 120];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {PRESETS.map(v => (
          <button key={v} onClick={() => onSet?.(v)}
            className="px-3 py-1 rounded-full text-xs font-black"
            style={{
              fontFamily: F,
              background: total === v ? ORANGE : "#2a2a2a",
              color: total === v ? "#fff" : "#aaa",
              border: `1px solid ${total === v ? ORANGE : "#3a3a3a"}`,
            }}>{v}s</button>
        ))}
      </div>
      <div className="flex items-center gap-6">
        <button onClick={() => onAdjust(-15)}
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: "transparent", border: `2px solid ${ORANGE}`, color: ORANGE }}>−</button>
        <div className="relative" style={{ width: 160, height: 160 }}>
          <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="80" cy="80" r={r} fill="none" stroke="#2a2a2a" strokeWidth="8" />
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

// ── Number Input – single tap opens keyboard ─────────────────────────────────
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
    // Focus immediately on single tap
    setTimeout(() => { inputRef.current?.focus(); inputRef.current?.select(); }, 10);
  }

  function commitEdit() {
    const v = parseFloat(draft.replace(",", "."));
    if (!isNaN(v) && v >= 0) onChange(Math.round(v * 4) / 4); // round to nearest 0.25
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
              style={{ fontFamily: F, fontSize: 52 }}
              onClick={startEdit}>
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
  const { stats, session, completeSet, completeExercise, finishWorkout } = usePawgressStore();
  const recordSet  = useWorkoutStore(s => s.recordSet);
  const resetWorkout = useWorkoutStore(s => s.resetWorkout);

  const dayIndex = stats.totalWorkouts % 4;
  const day = PLAN_2ER_SPLIT[dayIndex];
  const exIndex = Number(index) ?? 0;
  const planEx = day.exercises[exIndex];
  const totalSets = planEx?.sets.length ?? 3;
  const defaultReps = planEx?.sets[0]?.reps ?? 8;

  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(defaultReps);
  const [currentSet, setCurrentSet] = useState(1);
  const [setDone, setSetDone] = useState(false);
  const [timerTotal, setTimerTotal] = useState(120);
  const [timerSec, setTimerSec] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [showAbort, setShowAbort] = useState(false);

  const exData = planEx ? getExerciseData(planEx.name) : null;

  useEffect(() => {
    if (!timerRunning) return;
    if (timerSec <= 0) { setTimerRunning(false); return; }
    const id = setInterval(() => setTimerSec(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSec]);

  function adjustTimer(delta: number) {
    const next = Math.max(15, timerTotal + delta);
    setTimerTotal(next); setTimerSec(next);
  }

  function handleSetDone() {
    completeSet(exIndex, weight, reps);
    recordSet(planEx.name, weight, reps);
    setTimerSec(timerTotal);
    setTimerRunning(true);
    setSetDone(true);
  }

  function handleContinue() {
    if (currentSet >= totalSets) {
      completeExercise(exIndex);
      const nextIndex = exIndex + 1;
      if (nextIndex < day.exercises.length) {
        navigate(`/active-set/${nextIndex}`);
      } else {
        const cats = day.exercises.map(e => e.name);
        finishWorkout(cats, weight, session?.startTime);
        navigate("/workout-done");
      }
    } else {
      setCurrentSet(s => s + 1);
      setReps(planEx?.sets[currentSet]?.reps ?? defaultReps);
      setSetDone(false);
    }
  }

  function handleAbort() {
    resetWorkout();
    navigate("/training");
  }

  if (!planEx) return null;

  // ── Set-Done Screen ──────────────────────────────────────────────────────
  if (setDone && currentSet < totalSets) return (
    <div className="min-h-screen flex flex-col pb-10" style={{ background: "#0a0a0a", color: "#fff" }}>
      <div className="flex items-center justify-between px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #2a2a2a" }}>
        <button onClick={() => navigate("/training")} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="text-center">
          <p className="font-black text-lg text-white" style={{ fontFamily: F }}>{planEx.name}</p>
          <p className="text-xs text-gray-500">Satz {currentSet} von {totalSets} abgeschlossen</p>
        </div>
        <button onClick={() => setShowAbort(true)} className="text-xs font-bold px-2 py-1 rounded"
          style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444" }}>STOP</button>
      </div>

      {showAbort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.9)" }}>
          <div className="rounded-2xl p-6 w-full" style={{ background: "#1a1a1a", border: "1px solid #ef4444" }}>
            <p className="font-black text-xl text-white mb-2" style={{ fontFamily: F }}>TRAINING ABBRECHEN?</p>
            <p className="text-sm text-gray-400 mb-5">Dein Fortschritt geht verloren.</p>
            <button onClick={handleAbort} className="w-full py-3 rounded-xl font-black text-white mb-2"
              style={{ background: "#ef4444", fontFamily: F }}>JA, ABBRECHEN</button>
            <button onClick={() => setShowAbort(false)} className="w-full py-3 rounded-xl font-black text-white"
              style={{ background: "#2a2a2a", fontFamily: F }}>WEITERMACHEN</button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center px-6 pt-8 flex-1">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
          style={{ background: "#22c55e22", border: "2px solid #22c55e" }}>✓</div>
        <p className="font-black text-3xl text-white mb-1" style={{ fontFamily: F }}>STARK GEMACHT!</p>
        <p className="text-sm text-gray-400 mb-6">
          {weight > 0 ? `${weight} kg × ${reps} Wdh` : `BW × ${reps} Wdh`}
        </p>
        <p className="text-xs text-gray-500 tracking-widest font-bold mb-4">REST TIMER</p>
        <TimerRing seconds={timerSec} total={timerTotal} onAdjust={adjustTimer}
          onSet={v => { setTimerTotal(v); setTimerSec(v); }} />
        <button onClick={() => setTimerRunning(r => !r)} className="mt-3 text-sm"
          style={{ background: "none", border: "none", color: ORANGE }}>
          {timerRunning ? "⏸ Pause" : "▶ Fortsetzen"}
        </button>
        <div className="flex-1" />
        <button onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-black text-xl text-white mt-6"
          style={{ background: ORANGE, border: "none", fontFamily: F }}>
          NÄCHSTER SATZ →
        </button>
      </div>
    </div>
  );

  // ── Active Set Screen ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-8" style={{ background: "#0a0a0a", color: "#fff" }}>

      {showAbort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.9)" }}>
          <div className="rounded-2xl p-6 w-full" style={{ background: "#1a1a1a", border: "1px solid #ef4444" }}>
            <p className="font-black text-xl text-white mb-2" style={{ fontFamily: F }}>TRAINING ABBRECHEN?</p>
            <p className="text-sm text-gray-400 mb-5">Dein Fortschritt geht verloren.</p>
            <button onClick={handleAbort} className="w-full py-3 rounded-xl font-black text-white mb-2"
              style={{ background: "#ef4444", fontFamily: F }}>JA, ABBRECHEN</button>
            <button onClick={() => setShowAbort(false)} className="w-full py-3 rounded-xl font-black text-white"
              style={{ background: "#2a2a2a", fontFamily: F }}>WEITERMACHEN</button>
          </div>
        </div>
      )}

      {/* Header – back does NOT abort */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #2a2a2a" }}>
        <button onClick={() => navigate("/training")}
          style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="text-center">
          <p className="font-black text-xl text-white" style={{ fontFamily: F }}>{planEx.name}</p>
          <p className="text-xs text-gray-500">
            {day.tag === "PUSH" ? "Brust · Schultern · Trizeps" : "Rücken · Bizeps · Core"}
          </p>
        </div>
        <button onClick={() => setShowAbort(true)} className="text-xs font-bold px-2 py-1 rounded"
          style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444" }}>STOP</button>
      </div>

      {/* Set dots */}
      <div className="text-center pt-5 pb-4">
        <p className="text-sm font-bold text-white mb-3">Satz {currentSet} von {totalSets}</p>
        <div className="flex justify-center gap-2.5">
          {Array.from({ length: totalSets }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full transition-all"
              style={{ background: i < currentSet - 1 ? "#22c55e" : i === currentSet - 1 ? ORANGE : "#2a2a2a" }} />
          ))}
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
            onSet={v => { setTimerTotal(v); setTimerSec(v); }} />
        </div>
        <div className="flex justify-center mt-2">
          <button onClick={() => setTimerRunning(r => !r)} className="text-sm"
            style={{ background: "none", border: "none", color: ORANGE }}>
            {timerRunning ? "⏸ Pause" : "▶ Start"}
          </button>
        </div>
      </div>

      {/* Tipp – zeigt Cues aus Übungsbibliothek */}
      <div className="px-6 mb-6">
        <button onClick={() => setShowTip(t => !t)}
          className="w-full flex items-start gap-3 p-4 rounded-2xl text-left"
          style={{ background: "#161616", border: `1px solid ${ORANGE}33` }}>
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
                            <span style={{ color: ORANGE }}>›</span>
                            <span>{cue}</span>
                          </div>
                        ))}
                        {exData.breathing && (
                          <div className="mt-2 pt-2 border-t" style={{ borderColor: "#2a2a2a" }}>
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
        <button onClick={currentSet >= totalSets ? handleContinue : handleSetDone}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: ORANGE, border: "none", fontFamily: F, boxShadow: `0 0 20px ${ORANGE}55` }}>
          {currentSet >= totalSets ? "ÜBUNG ABSCHLIESSEN ✓" : "SATZ ABSCHLIESSEN ✓"}
        </button>
      </div>
    </div>
  );
}
