import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useWorkoutStore }  from "../stores/workoutStore";
import { useStatsStore }    from "../stores/statsStore";
import { PLAN_2ER_SPLIT } from "../data/plan_2er_split";
import type { AreaExercise } from "../types";
import { F, ORANGE, COPPER, COPPER_L, COPPER_G, SURF, SURF2, BORDER, CARD, CARD2, BORDER2, GREEN, RED, BG } from "../styles/tokens";


// Exercise tip data loaded lazily on demand
const exerciseTipCache = new Map<string, AreaExercise | undefined>();
async function loadExerciseTip(name: string): Promise<AreaExercise | undefined> {
  if (exerciseTipCache.has(name)) return exerciseTipCache.get(name);
  const lower = name.toLowerCase();
  // Try each module until found - only loaded if user opens tip
  const modules = [
    () => import("../data/exercises_brust").then(m => m.BRUST_EXERCISES),
    () => import("../data/exercises_ruecken").then(m => m.RUECKEN_EXERCISES),
    () => import("../data/exercises_schultern").then(m => m.SCHULTERN_EXERCISES),
    () => import("../data/exercises_arme").then(m => m.ARME_EXERCISES),
    () => import("../data/exercises_beine").then(m => m.BEINE_EXERCISES),
    () => import("../data/exercises_core").then(m => m.CORE_EXERCISES),
  ];
  for (const load of modules) {
    const exs = await load();
    const found = exs.find((e: AreaExercise) => e.name.toLowerCase() === lower);
    if (found) { exerciseTipCache.set(name, found); return found; }
  }
  exerciseTipCache.set(name, undefined);
  return undefined;
}

// ── Timer Ring ────────────────────────────────────────────────────────────────
function TimerRing({ seconds, total, onAdjust, onSet }: {
  seconds: number; total: number;
  onAdjust: (d: number) => void;
  onSet?: (v: number) => void;
}) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, seconds / Math.max(1, total));
  const dash = circ * pct;
  const PRESETS = [0, 30, 60, 90, 120];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {PRESETS.map(v => (
          <button key={v} onClick={() => onSet?.(v)}
            className="px-2.5 py-1 rounded-full text-xs font-black"
            style={{
              fontFamily: F,
              background: total === v ? `linear-gradient(135deg, ${COPPER} 0%, ${COPPER_L} 100%)` : SURF2,
              color: total === v ? "#fff" : "#888",
              border: `1px solid ${total === v ? COPPER_L : BORDER}`,
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
            <circle cx="80" cy="80" r={r} fill="none" stroke={COPPER_L} strokeWidth="8"
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
              style={{ fontFamily: F, fontSize: 52, borderBottom: `2px solid ${COPPER_L}` }}
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
// STATE MODEL (stored in workoutStore.setProgress[exIndex]):
//   completedSets : number  — how many sets are DONE (0-based counter)
//   totalSets     : number  — target total sets (plan value + user additions)
//   weight        : number  — last used weight
//   reps          : number  — last used reps
//   done          : boolean — exercise fully completed
//
// UI:
//   currentSetDisplay = completedSets + 1  (shown as "Satz X von Y")
//   isLastSet = completedSets + 1 >= totalSets

export function ActiveSetScreen() {
  const { index } = useParams<{ index: string }>();
  const navigate = useNavigate();
  const stats   = useStatsStore(s => s.stats);
  const session = useWorkoutStore(s => s.session);
  const { completeSet, completeExercise, finishWorkout } = usePawgressStore();
  const recordSet          = useWorkoutStore(s => s.recordSet);
  const resetWorkout       = useWorkoutStore(s => s.resetWorkout);
  const getActiveExercises = useWorkoutStore(s => s.getActiveExercises);
  const getSetProgress     = useWorkoutStore(s => s.getSetProgress);
  const updateSetProgress  = useWorkoutStore(s => s.updateSetProgress);
  const setProgress        = useWorkoutStore(s => s.setProgress);

  const dayIndex        = stats.totalWorkouts % 4;
  const activeExercises = getActiveExercises(dayIndex);
  const exIndex         = Number(index) ?? 0;
  const planEx          = activeExercises[exIndex];
  const defaultReps     = planEx?.sets[0]?.reps ?? 8;

  // Load persisted progress — completedSets is how many sets are DONE
  const savedProgress   = getSetProgress(exIndex, defaultReps);
  const planTotalSets   = planEx?.sets.length ?? 3;

  // totalSets is persisted so extra sets survive navigation
  const storedTotal     = savedProgress.totalSets;
  const totalSets       = storedTotal ?? planTotalSets;

  // completedSets: number of sets done so far (0 = none done yet)
  const completedSets   = Math.min(savedProgress.currentSet - 1, totalSets - 1);
  // currentSetDisplay: which set is about to be done (1-based)
  const currentSetDisplay = Math.min(completedSets + 1, totalSets);
  const isLastSet       = currentSetDisplay >= totalSets;

  const [weight, setWeightState]  = useState(savedProgress.weight);
  const [reps, setRepsState]      = useState(
    planEx?.sets[currentSetDisplay - 1]?.reps ?? savedProgress.reps
  );
  const [restVisible, setRestVisible] = useState(false);
  const [timerTotal, setTimerTotal]   = useState(120);
  const [timerSec, setTimerSec]       = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showTip, setShowTip]         = useState(false);
  const [showAbort, setShowAbort]     = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Workout-Gesamttimer: läuft ab session.startTime ununterbrochen
  const [elapsed, setElapsed] = useState(
    session ? Math.floor((Date.now() - session.startTime) / 1000) : 0
  );

  const [exData, setExData] = useState<AreaExercise | undefined>(undefined);
  useEffect(() => {
    if (planEx && showTip) {
      loadExerciseTip(planEx.name).then(setExData);
    }
  }, [planEx?.name, showTip]);

  // Persist weight/reps on change
  function setWeight(v: number) { setWeightState(v); updateSetProgress(exIndex, { weight: v }); }
  function setReps(v: number)   { setRepsState(v);   updateSetProgress(exIndex, { reps: v }); }

  function adjustTotalSets(delta: number) {
    const next = Math.max(completedSets + 1, totalSets + delta);
    updateSetProgress(exIndex, { totalSets: next });
  }

  // Workout-Gesamttimer (läuft immer)
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(session ? Math.floor((Date.now() - session.startTime) / 1000) : 0);
    }, 1000);
    return () => clearInterval(id);
  }, [session]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Rest timer notification when countdown hits 0
  useEffect(() => {
    if (timerSec === 0 && timerRunning === false && timerTotal > 0) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Pawgress – Pause vorbei! 🐾", {
          body: `${planEx?.name ?? "Übung"} – Nächster Satz bereit`,
          icon: "/images/icon.webp",
          silent: false,
        });
      }
      // Vibration on mobile
      if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
    }
  }, [timerSec, timerRunning]);

  // Timer countdown
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

  // Complete current set → show rest screen
  function handleSetDone() {
    completeSet(exIndex, weight, reps);
    recordSet(planEx!.name, weight, reps);
    // Advance completedSets by 1 (currentSet in store = completedSets + 1, so store gets +1)
    const newCompletedSets = completedSets + 1;
    updateSetProgress(exIndex, { currentSet: newCompletedSets + 1 });
    if (timerTotal > 0) {
      setTimerSec(timerTotal);
      setTimerRunning(true);
    }
    setRestVisible(true);
  }

  // After rest: either go to next set or finish exercise
  function handleContinue() {
    setRestVisible(false);
    const newCompleted = completedSets + 1; // sets done after handleSetDone
    if (newCompleted >= totalSets) {
      // Exercise done
      completeExercise(exIndex);
      updateSetProgress(exIndex, { done: true });
      const nextIndex = exIndex + 1;
      if (nextIndex < activeExercises.length) {
        navigate(`/active-set/${nextIndex}`);
      } else {
        // Letzte Übung fertig → direkt zur Übungsübersicht
        navigate("/training/active");
      }
    } else {
      // Next set: update reps target for next set
      const nextSetIdx = newCompleted; // 0-based index of next set
      const nextReps = planEx?.sets[nextSetIdx]?.reps ?? defaultReps;
      setRepsState(nextReps);
      updateSetProgress(exIndex, { reps: nextReps });
    }
  }

  function handleFinishWorkout() {
    const cats = activeExercises.map(e => e.name);
    finishWorkout(cats, weight, session?.startTime);
    navigate("/workout-done");
  }

  function handleAbort() {
    resetWorkout();
    navigate("/training/active");
  }

  if (!planEx) {
    setTimeout(() => navigate("/training/active"), 0);
    return null;
  }

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

  // ── Rest Screen (after completing a set) ─────────────────────────────────
  if (restVisible) return (
    <div className="min-h-screen flex flex-col pb-10" style={{ background: "#080808", color: "#fff" }}>
      {showAbort && <AbortModal />}
      <div className="flex items-center justify-between px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #1e1e1e" }}>
        <button onClick={() => navigate("/training/active")}
          style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="text-center">
          <p className="font-black text-lg text-white" style={{ fontFamily: F }}>{planEx.name}</p>
          <p className="text-xs text-gray-500">
            Satz {completedSets + 1} von {totalSets} abgeschlossen
          </p>
          <p className="text-xs font-black mt-0.5" style={{ color: COPPER_L, fontFamily: F }}>
            ⏱ {String(Math.floor(elapsed / 60)).padStart(2,"0")}:{String(elapsed % 60).padStart(2,"0")}
          </p>
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
          style={{ background: `linear-gradient(135deg, #b8660a 0%, #e8a050 40%, #cd7f32 100%)`, border: "none", fontFamily: F }}>
          {(completedSets + 1) >= totalSets ? "ÜBUNG ABSCHLIESSEN ✓" : "NÄCHSTER SATZ →"}
        </button>
      </div>
    </div>
  );

  // ── Active Set Screen ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-8" style={{ background: "#080808", color: "#fff" }}>
      {showAbort && <AbortModal />}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.92)" }}>
          <div className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-4"
            style={{ background: "#141414", border: "1px solid #2a2a2a" }}>
            <div className="text-center">
              <p className="text-4xl mb-2">🏆</p>
              <p className="font-black italic text-2xl text-white mb-1" style={{ fontFamily: F }}>
                LETZTE ÜBUNG FERTIG!
              </p>
              <p className="text-sm text-gray-400">Was möchtest du tun?</p>
            </div>
            <button onClick={handleFinishWorkout}
              className="w-full py-4 rounded-2xl font-black text-base text-white"
              style={{ background: "linear-gradient(135deg, #b8660a 0%, #e8a050 40%, #cd7f32 100%)", fontFamily: F }}>
              WORKOUT BEENDEN ✓
            </button>
            <button onClick={() => { setShowFinishModal(false); navigate("/training/active"); }}
              className="w-full py-3.5 rounded-2xl font-black text-base"
              style={{ background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a", fontFamily: F }}>
              ZURÜCK ZUR ÜBERSICHT
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4" style={{ borderBottom: "1px solid #1e1e1e" }}>
        <button onClick={() => navigate("/training/active")}
          style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="text-center">
          <p className="font-black text-xl text-white" style={{ fontFamily: F }}>{planEx.name}</p>
          <p className="text-xs text-gray-500">
            {PLAN_2ER_SPLIT[dayIndex]?.tag === "PUSH" ? "Brust · Schultern · Trizeps" : "Rücken · Bizeps · Core"}
          </p>
          {/* Workout elapsed timer */}
          <p className="text-xs font-black mt-0.5" style={{ color: COPPER_L, fontFamily: F }}>
            ⏱ {String(Math.floor(elapsed / 60)).padStart(2,"0")}:{String(elapsed % 60).padStart(2,"0")}
          </p>
        </div>
        <button onClick={() => setShowAbort(true)} className="text-xs font-bold px-2 py-1 rounded"
          style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444" }}>STOP</button>
      </div>

      {/* Set indicator */}
      <div className="text-center pt-5 pb-4">
        <p className="text-sm font-bold text-white mb-2">
          Satz {currentSetDisplay} von {totalSets}
        </p>
        {/* Dots: green = done, orange = current, dark = upcoming */}
        <div className="flex justify-center gap-2.5 mb-3">
          {Array.from({ length: totalSets }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full transition-all"
              style={{
                background: i < completedSets ? "#22c55e"
                  : i === completedSets ? COPPER_L
                  : "#2a1f10"
              }} />
          ))}
        </div>
        {/* Set count editor */}
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => adjustTotalSets(-1)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-base font-bold"
            style={{ background: "#1e1e1e", color: ORANGE, border: "none" }}>−</button>
          <p className="text-xs text-gray-600">{totalSets} Sätze</p>
          <button onClick={() => adjustTotalSets(1)}
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
          subLabel={`ZIEL: ${planEx.sets[currentSetDisplay - 1]?.reps ?? defaultReps} Wdh`} />
      </div>
      <div style={{ height: 1, background: "#1e1e1e", margin: "0 24px 24px" }} />

      {/* Tipp */}
      <div className="px-6 mb-6">
        <button onClick={() => setShowTip(t => !t)}
          className="w-full flex items-start gap-3 p-4 rounded-2xl text-left"
          style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
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
        <button onClick={handleSetDone}
          className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: `linear-gradient(135deg, #b8660a 0%, #e8a050 40%, #cd7f32 100%)`, border: "none", fontFamily: F, boxShadow: `0 0 24px rgba(180,100,20,0.55), inset 0 1px 0 rgba(255,255,255,0.15)` }}>
          {isLastSet ? "LETZTEN SATZ ABSCHLIESSEN ✓" : "SATZ ABSCHLIESSEN ✓"}
        </button>
      </div>
    </div>
  );
}
