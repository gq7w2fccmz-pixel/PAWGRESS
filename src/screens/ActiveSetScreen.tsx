import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useWorkoutStore } from "../stores/workoutStore";
import { PLAN_2ER_SPLIT } from "../data/plan_2er_split";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

// ── Timer Ring ───────────────────────────────────────────────────────────────
function TimerRing({ seconds, total, onAdjust }: { seconds: number; total: number; onAdjust: (d: number) => void }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, seconds / total);
  const dash = circ * pct;

  return (
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
  );
}

// ── NumberInput – tap +/- or tap number to type manually ────────────────────
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
    setTimeout(() => inputRef.current?.select(), 50);
  }

  function commitEdit() {
    const v = parseFloat(draft.replace(",", "."));
    if (!isNaN(v) && v >= 0) onChange(v);
    setEditing(false);
  }

  return (
    <div className="flex flex-col items-center">
      {label && <p className="text-xs text-gray-500 tracking-widest mb-3 font-bold">{label}</p>}
      <div className="flex items-center gap-6">
        <button onClick={() => onChange(Math.max(0, value - step))}
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: "transparent", border: `2px solid ${ORANGE}`, color: ORANGE }}>−</button>

        <div className="text-center min-w-[110px]">
          {editing ? (
            <input ref={inputRef} value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e => e.key === "Enter" && commitEdit()}
              className="font-black text-center text-white bg-transparent outline-none w-full"
              style={{ fontFamily: F, fontSize: 52, borderBottom: `2px solid ${ORANGE}` }}
              inputMode="decimal" />
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
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ background: "transparent", border: `2px solid ${ORANGE}`, color: ORANGE }}>+</button>
      </div>
    </div>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export function ActiveSetScreen() {
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();
  const { stats, session, completeSet, completeExercise, finishWorkout } = usePawgressStore();
  const recordSet              = useWorkoutStore(s => s.recordSet);

  const dayIndex = stats.totalWorkouts % 4;
  const day = PLAN_2ER_SPLIT[dayIndex];
  const exIndex = Number(index) ?? 0;
  const planEx = day.exercises[exIndex];
  const sessionEx = session?.exercises[exIndex];

  // Defaults
  const defaultReps = planEx?.sets[0]?.reps ?? 8;
  const defaultWeight = 0;
  const totalSets = planEx?.sets.length ?? 3;

  const [weight, setWeight] = useState(defaultWeight);
  const [reps, setReps] = useState(defaultReps);
  const [currentSet, setCurrentSet] = useState(1);
  const [setDone, setSetDone] = useState(false);
  const [timerTotal, setTimerTotal] = useState(120);
  const [timerSec, setTimerSec] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Timer tick
  useEffect(() => {
    if (!timerRunning) return;
    if (timerSec <= 0) { setTimerRunning(false); return; }
    const id = setInterval(() => setTimerSec(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSec]);

  function adjustTimer(delta: number) {
    const next = Math.max(15, timerTotal + delta);
    setTimerTotal(next);
    setTimerSec(next);
  }

  function handleSetDone() {
    completeSet(exIndex, weight, reps);
    recordSet(planEx.name, weight, reps);      // ← history tracking
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
        // Last exercise – finish workout with full history
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

  if (!planEx) return null;

  // ── Set-Done Screen ────────────────────────────────────────────────────────
  if (setDone && currentSet < totalSets) return (
    <div className="min-h-screen flex flex-col pb-10" style={{ background: "#0a0a0a", color: "#fff" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #2a2a2a" }}>
        <button onClick={() => navigate("/training")} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="text-center">
          <p className="font-black text-lg text-white" style={{ fontFamily: F }}>{planEx.name}</p>
          <p className="text-xs text-gray-500">Satz {currentSet} von {totalSets} abgeschlossen</p>
        </div>
        <div style={{ width: 22 }} />
      </div>

      <div className="flex flex-col items-center px-6 pt-8 flex-1">
        {/* Check */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
          style={{ background: "#22c55e22", border: "2px solid #22c55e" }}>✓</div>
        <p className="font-black text-3xl text-white mb-1" style={{ fontFamily: F }}>STARK GEMACHT!</p>
        <p className="text-sm text-gray-400 mb-6">
          {weight > 0 ? `${weight.toFixed(1).replace(".", ",")} kg × ${reps} Wdh` : `BW × ${reps} Wdh`}
        </p>

        {/* Timer */}
        <p className="text-xs text-gray-500 tracking-widest font-bold mb-4">REST TIMER</p>
        <TimerRing seconds={timerSec} total={timerTotal} onAdjust={adjustTimer} />
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

  // ── Active Set Screen ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-8" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #2a2a2a" }}>
        <button onClick={() => navigate("/training")}
          style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="text-center">
          <p className="font-black text-xl text-white" style={{ fontFamily: F }}>{planEx.name}</p>
          <p className="text-xs text-gray-500">
            {day.tag === "PUSH" ? "Brust · Schultern · Trizeps" : "Rücken · Bizeps · Core"}
          </p>
        </div>
        <div style={{ width: 22 }} />
      </div>

      {/* Set indicator */}
      <div className="text-center pt-5 pb-4">
        <p className="text-sm font-bold text-white mb-3">Satz {currentSet} von {totalSets}</p>
        <div className="flex justify-center gap-2.5">
          {Array.from({ length: totalSets }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full transition-all"
              style={{ background: i < currentSet - 1 ? "#22c55e" : i === currentSet - 1 ? ORANGE : "#2a2a2a" }} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#1e1e1e", margin: "0 24px 24px" }} />

      {/* Weight */}
      <div className="px-6 mb-6">
        <NumberInput
          value={weight} onChange={setWeight} step={2.5}
          unit="kg" label="GEWICHT"
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#1e1e1e", margin: "0 24px 24px" }} />

      {/* Reps */}
      <div className="px-6 mb-6">
        <NumberInput
          value={reps} onChange={setReps} step={1}
          label="WIEDERHOLUNGEN"
          subLabel={`ZIEL: ${planEx.sets[currentSet - 1]?.reps ?? defaultReps} Wdh`}
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#1e1e1e", margin: "0 24px 24px" }} />

      {/* Timer */}
      <div className="px-6 mb-6">
        <p className="text-xs text-gray-500 tracking-widest font-bold text-center mb-4">REST TIMER</p>
        <div className="flex justify-center">
          <TimerRing seconds={timerSec} total={timerTotal} onAdjust={adjustTimer} />
        </div>
        <div className="flex justify-center mt-2">
          <button onClick={() => setTimerRunning(r => !r)}
            className="text-sm" style={{ background: "none", border: "none", color: ORANGE }}>
            {timerRunning ? "⏸ Pause" : "▶ Start"}
          </button>
        </div>
      </div>

      {/* Tipp → führt zur Übungsanleitung */}
      <div className="px-6 mb-6">
        <button onClick={() => setShowTip(t => !t)}
          className="w-full flex items-start gap-3 p-4 rounded-2xl text-left"
          style={{ background: "#161616", border: `1px solid ${ORANGE}33`, padding: 16 }}>
          <span style={{ color: ORANGE, fontSize: 22, flexShrink: 0 }}>💡</span>
          <div className="flex-1">
            <p className="font-black text-sm" style={{ color: ORANGE, fontFamily: F }}>TIPP</p>
            {!showTip
              ? <p className="text-xs text-gray-400 mt-0.5">Tippe für Übungsanleitung & Coaching-Cues</p>
              : <div className="text-xs text-gray-300 mt-1.5 space-y-1">
                  <p className="font-semibold text-white">{planEx.name}</p>
                  <p className="text-gray-400 mt-1">Tippe auf "Details ansehen" in der Übungsbibliothek für vollständige Anleitung, Technik-Tipps und häufige Fehler.</p>
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
          style={{ background: ORANGE, border: "none", fontFamily: F,
            boxShadow: `0 0 20px ${ORANGE}55` }}>
          {currentSet >= totalSets ? "ÜBUNG ABSCHLIESSEN ✓" : "SATZ ABSCHLIESSEN ✓"}
        </button>
      </div>
    </div>
  );
}
