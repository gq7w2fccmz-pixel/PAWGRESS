/**
 * Plan Sub-Screens
 * Ausgelagert aus PlanScreen.tsx:
 *  - PlanCreatorScreen
 *  - WorkoutCreatorScreen
 *  - AllPlansScreen
 *  - DayDetailScreen
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PlanExercise } from "../../data/plan_2er_split";
import { usePlanStore, type CustomWorkoutDay } from "../../stores/planStore";
import { ExercisePickerModal } from "./ExercisePicker";
import { DayEditor }           from "./DayEditor";
import { F, ORANGE, COPPER, COPPER_L, COPPER_G, SURF, SURF2, BORDER, CARD, CARD2, BORDER2, GREEN, RED, BG } from "../../styles/tokens";

const PLAN_COLORS = ["#f97316","#3b82f6","#22c55e","#a855f7","#ef4444","#eab308","#06b6d4"];
const PLAN_ICONS  = ["🏋️","💪","🔥","🎯","⚡","🐾","🏆","📊"];

// ── Plan Creator ───────────────────────────────────────────────────────────────
export function PlanCreatorScreen({ onBack }: { onBack: () => void }) {
  const createPlan = usePlanStore(s => s.createPlan);
  const [name,       setName]  = useState("");
  const [desc,       setDesc]  = useState("");
  const [color,      setColor] = useState(COPPER_L);
  const [icon,       setIcon]  = useState("🏋️");
  const [daysPerWeek, setDPW]  = useState(4);
  const [days, setDays] = useState<CustomWorkoutDay[]>([
    { id: `d-${Date.now()}`, label: "Tag 1", exercises: [] },
  ]);

  function addDay() {
    setDays(d => [...d, { id: `d-${Date.now()}-${d.length}`, label: `Tag ${d.length + 1}`, exercises: [] }]);
  }

  function save() {
    if (!name.trim()) return;
    createPlan({
      name: name.trim(), desc, icon, color, daysPerWeek,
      focus: days.map(d => d.label).join(" · "),
      days,
    });
    onBack();
  }

  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b sticky top-0 z-10"
        style={{ background:"#080808", borderColor:`${BORDER}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#fff", fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>TRAININGSPLAN ERSTELLEN</p>
        <button onClick={save} className="px-4 py-2 rounded-xl font-black text-sm"
          style={{ background: name ? `linear-gradient(135deg, ${COPPER} 0%, ${COPPER_L} 100%)` : SURF2, color:"#fff", fontFamily:F, border:"none" }}>
          SPEICHERN
        </button>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-5">
        {/* Name */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">PLAN NAME</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Push Day Plan" autoFocus
            className="w-full px-4 py-3 rounded-xl text-white font-semibold outline-none"
            style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${name ? COPPER_L : BORDER}`, fontSize:15 }} />
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">BESCHREIBUNG</p>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="z.B. Oberkörper Fokus"
            className="w-full px-4 py-3 rounded-xl text-white font-semibold outline-none"
            style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${BORDER}`, fontSize:14 }} />
        </div>

        {/* Icon + Farbe */}
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">ICON</p>
            <div className="flex flex-wrap gap-2">
              {PLAN_ICONS.map(ic => (
                <button key={ic} onClick={() => setIcon(ic)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: icon===ic ? `${color}33` : "#111", border:`1.5px solid ${icon===ic ? color : "#2a2a2a"}` }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">FARBE</p>
            <div className="flex flex-wrap gap-2">
              {PLAN_COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full"
                  style={{ background:c, border:`2px solid ${color===c ? "#fff" : "transparent"}` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Tage/Woche */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">TAGE PRO WOCHE</p>
          <div className="flex gap-2">
            {[2,3,4,5,6,7].map(n => (
              <button key={n} onClick={() => setDPW(n)}
                className="w-10 h-10 rounded-xl font-black text-sm"
                style={{ background: daysPerWeek===n ? color : "#111",
                  color: daysPerWeek===n ? "#fff" : "#888",
                  border:`1px solid ${daysPerWeek===n ? color : "#2a2a2a"}`, fontFamily:F }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Trainingstage */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-3 font-bold">TRAININGSTAGE</p>
          {days.map((day, i) => (
            <DayEditor key={day.id} day={day}
              onChange={updated => setDays(d => d.map((x, j) => j===i ? updated : x))}
              onDelete={() => setDays(d => d.filter((_, j) => j!==i))} />
          ))}
          <button onClick={addDay}
            className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
            style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px dashed ${ORANGE}55`, color:ORANGE, fontFamily:F }}>
            + TAG HINZUFÜGEN
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Workout Creator ────────────────────────────────────────────────────────────
export function WorkoutCreatorScreen({
  onBack,
  onSaved,
  existingId,
}: {
  onBack:      () => void;
  onSaved?:    () => void;
  existingId?: string;
}) {
  const createWorkout = usePlanStore(s => s.createWorkout);
  const updateWorkout = usePlanStore(s => s.updateWorkout);
  const workouts      = usePlanStore(s => s.workouts);
  const existing      = existingId ? workouts.find(w => w.id === existingId) : undefined;

  const [name,       setName]  = useState(existing?.name ?? "");
  const [desc,       setDesc]  = useState(existing?.desc ?? "");
  const [exercises,  setEx]    = useState<PlanExercise[]>(existing?.exercises ?? []);
  const [showPicker, setShowPicker] = useState(false);

  function save() {
    if (!name.trim()) return;
    if (existing) {
      updateWorkout(existing.id, { name: name.trim(), desc, exercises });
    } else {
      createWorkout({ name: name.trim(), desc, exercises });
    }
    // After saving: if caller provides onSaved, use it; otherwise fall back to onBack
    (onSaved ?? onBack)();
  }

  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      {showPicker && (
        <ExercisePickerModal
          onClose={() => setShowPicker(false)}
          onAdd={ex => { setEx(e => [...e, ex]); setShowPicker(false); }}
        />
      )}

      <div className="flex items-center gap-3 px-4 py-4 border-b sticky top-0 z-10"
        style={{ background:"#080808", borderColor:`${BORDER}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#fff", fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>
          {existing ? "WORKOUT BEARBEITEN" : "WORKOUT ERSTELLEN"}
        </p>
        <button onClick={save} className="px-4 py-2 rounded-xl font-black text-sm"
          style={{ background: name ? `linear-gradient(135deg, ${COPPER} 0%, ${COPPER_L} 100%)` : SURF2, color:"#fff", fontFamily:F, border:"none" }}>
          SPEICHERN
        </button>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-4">
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">WORKOUT NAME</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Mein Push Day" autoFocus
            className="w-full px-4 py-3 rounded-xl text-white font-semibold outline-none"
            style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${name ? COPPER_L : BORDER}`, fontSize:15 }} />
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">BESCHREIBUNG</p>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="z.B. Oberkörper"
            className="w-full px-4 py-3 rounded-xl text-white font-semibold outline-none"
            style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${BORDER}`, fontSize:14 }} />
        </div>

        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-3 font-bold">ÜBUNGEN ({exercises.length})</p>
          <div className="flex flex-col gap-2 mb-3">
            {exercises.map((ex, i) => {
              const setsCount = ex.sets.length;
              const repsCount = ex.sets[0]?.reps ?? 8;
              function updateSets(delta: number) {
                const newCount = Math.max(1, setsCount + delta);
                setEx(e => e.map((x, j) => j !== i ? x : {
                  ...x, sets: Array(newCount).fill({ reps: x.sets[0]?.reps ?? 8 })
                }));
              }
              function updateReps(delta: number) {
                const newReps = Math.max(1, repsCount + delta);
                setEx(e => e.map((x, j) => j !== i ? x : {
                  ...x, sets: x.sets.map(() => ({ reps: newReps }))
                }));
              }
              return (
                <div key={i} className="flex flex-col p-3 rounded-xl gap-2"
                  style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                      style={{ background:`${ORANGE}22`, color:ORANGE, fontFamily:F }}>{i+1}</div>
                    <p className="font-bold text-sm text-white flex-1 truncate">{ex.name}</p>
                    <button onClick={() => setEx(e => e.filter((_, j) => j!==i))}
                      style={{ background:"none", border:"none", color:"#ef4444", fontSize:16 }}>✕</button>
                  </div>
                  {/* Sätze & Reps inline editor */}
                  <div className="flex items-center gap-4 pl-10">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-gray-500 w-10">SÄTZE</p>
                      <button onClick={() => updateSets(-1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background:"#1e1e1e", color:ORANGE, border:"none" }}>−</button>
                      <span className="font-black text-sm text-white w-5 text-center" style={{ fontFamily:F }}>{setsCount}</span>
                      <button onClick={() => updateSets(1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background:"#1e1e1e", color:ORANGE, border:"none" }}>+</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-gray-500 w-6">WDH</p>
                      <button onClick={() => updateReps(-1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background:"#1e1e1e", color:ORANGE, border:"none" }}>−</button>
                      <span className="font-black text-sm text-white w-5 text-center" style={{ fontFamily:F }}>{repsCount}</span>
                      <button onClick={() => updateReps(1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background:"#1e1e1e", color:ORANGE, border:"none" }}>+</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setShowPicker(true)}
            className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
            style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px dashed ${ORANGE}55`, color:ORANGE, fontFamily:F }}>
            + ÜBUNG HINZUFÜGEN
          </button>
        </div>
      </div>
    </div>
  );
}

// ── All Plans & Workouts ───────────────────────────────────────────────────────
export function AllPlansScreen({
  onBack,
  onEditWorkout,
  initialTab,
}: {
  onBack:        () => void;
  onEditWorkout: (id: string) => void;
  initialTab?:   "pläne" | "workouts";
}) {
  const plans      = usePlanStore(s => s.plans);
  const workouts   = usePlanStore(s => s.workouts);
  const setActive  = usePlanStore(s => s.setActivePlan);
  const deletePlan = usePlanStore(s => s.deletePlan);
  const deleteWO   = usePlanStore(s => s.deleteWorkout);
  const duplicate  = usePlanStore(s => s.duplicatePlan);
  const activePlanId = usePlanStore(s => s.activePlanId);
  const [tab, setTab] = useState<"pläne" | "workouts">(initialTab ?? "pläne");

  return (
    <div className="min-h-screen pb-28" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor:`${BORDER}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#fff", fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>ALLE PLÄNE & WORKOUTS</p>
      </div>

      {/* Tab-Switch */}
      <div className="flex gap-1 p-1 rounded-xl mx-4 mt-4 mb-4" style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)` }}>
        {(["pläne","workouts"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg font-black text-sm"
            style={{ fontFamily:F, background: tab===t ? `linear-gradient(135deg, ${COPPER} 0%, ${COPPER_L} 100%)` : "transparent",
              color: tab===t ? "#fff" : "#666", border:"none" }}>
            {t === "pläne" ? "Pläne" : "Workouts"}
          </button>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-3">
        {tab === "pläne" && plans.map(plan => (
          <div key={plan.id} className="rounded-2xl overflow-hidden"
            style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${plan.id===activePlanId ? plan.color+"55" : "#1e1e1e"}` }}>
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background:`${plan.color}22`, border:`1px solid ${plan.color}44` }}>{plan.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-black text-base text-white" style={{ fontFamily:F }}>{plan.name}</p>
                  {plan.id === activePlanId && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black"
                      style={{ background:"#22c55e", color:"#fff", fontFamily:F }}>AKTIV</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{plan.desc}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-gray-600">📅 {plan.daysPerWeek} Tage/Woche</span>
                  <span className="text-[10px] text-gray-600">🏋️ {plan.focus}</span>
                </div>
              </div>
            </div>
            <div className="flex border-t" style={{ borderColor:`${BORDER}` }}>
              {plan.id !== activePlanId && (
                <button onClick={() => setActive(plan.id)} className="flex-1 py-2.5 font-black text-xs"
                  style={{ background:"none", border:"none", color:"#22c55e", fontFamily:F }}>✓ Aktivieren</button>
              )}
              <button onClick={() => duplicate(plan.id)} className="flex-1 py-2.5 font-black text-xs border-l"
                style={{ background:"none", borderColor:`${BORDER}`, color:COPPER, fontFamily:F }}>Duplizieren</button>
              {plan.id !== "builtin-2er-split" && (
                <button onClick={() => deletePlan(plan.id)} className="flex-1 py-2.5 font-black text-xs border-l"
                  style={{ background:"none", borderColor:`${BORDER}`, color:"#ef4444", fontFamily:F }}>Löschen</button>
              )}
            </div>
          </div>
        ))}

        {tab === "workouts" && workouts.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8">Noch keine Workouts erstellt.</p>
        )}
        {tab === "workouts" && workouts.map(w => (
          <div key={w.id} className="rounded-2xl p-4" style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${BORDER}` }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background:`${COPPER}18` }}>💪</div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-white" style={{ fontFamily:F }}>{w.name}</p>
                <p className="text-xs text-gray-500">{w.desc} · {w.exercises.length} Übungen</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEditWorkout(w.id)}
                className="flex-1 py-2 rounded-xl font-black text-xs"
                style={{ background:`${SURF2}`, color:COPPER, fontFamily:F, border:"none" }}>✎ Bearbeiten</button>
              <button onClick={() => deleteWO(w.id)}
                className="flex-1 py-2 rounded-xl font-black text-xs"
                style={{ background:"rgba(60,0,0,0.4)", color:"#ef4444", fontFamily:F, border:"none" }}>🗑 Löschen</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Day Detail ─────────────────────────────────────────────────────────────────
export function DayDetailScreen({
  day,
  color,
  onBack,
}: {
  day:    { label: string; exercises: PlanExercise[] };
  color:  string;
  onBack: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen pb-28" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b sticky top-0 z-10"
        style={{ background:"#080808", borderColor:`${BORDER}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#fff", fontSize:22 }}>←</button>
        <div className="flex-1">
          <p className="font-black italic text-xl text-white" style={{ fontFamily:F }}>{day.label.toUpperCase()}</p>
          <p className="text-xs text-gray-500">{day.exercises.length} Übungen</p>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-2.5">
        {day.exercises.map((ex, i) => {
          const g: { reps:number; count:number }[] = [];
          ex.sets.forEach(s => {
            const l = g[g.length - 1];
            if (l && l.reps === s.reps) l.count++;
            else g.push({ reps: s.reps, count: 1 });
          });
          return (
            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${BORDER}` }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ background:`${color}22`, color, fontFamily:F }}>{i+1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-white truncate" style={{ fontFamily:F }}>{ex.name}</p>
                <p className="text-xs text-gray-500 mt-0.5" style={{ color }}>
                  {g.map(x => `${x.count}×${x.reps}`).join(" · ")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 mt-6">
        <button className="w-full py-4 rounded-2xl font-black text-lg text-white"
          style={{ background:color, fontFamily:F, border:"none", boxShadow:`0 0 16px ${color}44` }}
          onClick={() => navigate("/training")}>
          {day.label.toUpperCase()} STARTEN ›
        </button>
      </div>
    </div>
  );
}
