import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PLAN_2ER_SPLIT, type PlanExercise } from "../data/plan_2er_split";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useStatsStore } from "../stores/statsStore";
import { usePlanStore, type CustomPlan, type StandaloneWorkout, type CustomWorkoutDay } from "../stores/planStore";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

const PLAN_COLORS = ["#f97316","#3b82f6","#22c55e","#a855f7","#ef4444","#eab308","#06b6d4"];
const PLAN_ICONS  = ["🏋️","💪","🔥","🎯","⚡","🐾","🏆","📊"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function ExercisePickerModal({ onClose, onAdd }: { onClose: ()=>void; onAdd: (ex: PlanExercise)=>void }) {
  const [search, setSearch] = useState("");
  const all = PLAN_2ER_SPLIT.flatMap(d => d.exercises).filter(
    (ex, i, arr) => arr.findIndex(e => e.name === ex.name) === i
  );
  const filtered = all.filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: "rgba(0,0,0,0.97)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#1e1e1e" }}>
        <button onClick={onClose} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>ÜBUNG HINZUFÜGEN</p>
      </div>
      <div className="px-4 py-3 border-b" style={{ borderColor:"#1e1e1e" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Übung suchen..." autoFocus
          className="w-full px-4 py-2.5 rounded-xl text-white bg-transparent outline-none text-sm"
          style={{ background:"#111", border:"1px solid #2a2a2a" }} />
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-10">
        {filtered.map((ex, i) => {
          const g: {reps:number;count:number}[] = [];
          ex.sets.forEach(s => { const l=g[g.length-1]; if(l&&l.reps===s.reps) l.count++; else g.push({reps:s.reps,count:1}); });
          return (
            <div key={i} className="flex items-center gap-3 py-3 border-b" style={{ borderColor:"#1a1a1a" }}>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-white truncate">{ex.name}</p>
                <p className="text-xs text-gray-500">{g.map(x=>`${x.count}×${x.reps}`).join(" · ")}</p>
              </div>
              <button onClick={() => onAdd(ex)}
                className="px-3 py-1.5 rounded-xl font-black text-xs flex-shrink-0"
                style={{ background:ORANGE, color:"#fff", fontFamily:F, border:"none" }}>+ ADD</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Day Editor (used in Plan Creator) ─────────────────────────────────────────
function DayEditor({ day, onChange, onDelete }: {
  day: CustomWorkoutDay;
  onChange: (d: CustomWorkoutDay) => void;
  onDelete: () => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden mb-3" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
      {showPicker && <ExercisePickerModal onClose={() => setShowPicker(false)}
        onAdd={ex => { onChange({ ...day, exercises: [...day.exercises, ex] }); setShowPicker(false); }} />}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor:"#1e1e1e" }}>
        <input value={day.label} onChange={e => onChange({ ...day, label: e.target.value })}
          className="flex-1 bg-transparent outline-none font-black text-white text-sm"
          style={{ fontFamily:F, border:"none" }} placeholder="Tag-Name..." />
        <button onClick={onDelete} style={{ background:"none",border:"none",color:"#ef4444",fontSize:16 }}>🗑</button>
      </div>
      {day.exercises.map((ex, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b" style={{ borderColor:"#1a1a1a" }}>
          <span className="text-gray-600 text-sm w-5">{i+1}</span>
          <p className="flex-1 text-sm text-white truncate">{ex.name}</p>
          <button onClick={() => onChange({ ...day, exercises: day.exercises.filter((_,j) => j!==i) })}
            style={{ background:"none",border:"none",color:"#ef4444",fontSize:14 }}>✕</button>
        </div>
      ))}
      <button onClick={() => setShowPicker(true)}
        className="w-full py-2.5 text-center text-xs font-black"
        style={{ background:"none",border:"none",color:ORANGE,fontFamily:F }}>
        + ÜBUNG HINZUFÜGEN
      </button>
    </div>
  );
}

// ── Plan Creator Screen ────────────────────────────────────────────────────────
function PlanCreatorScreen({ onBack }: { onBack: ()=>void }) {
  const createPlan = usePlanStore(s => s.createPlan);
  const [name, setName]         = useState("");
  const [desc, setDesc]         = useState("");
  const [color, setColor]       = useState(ORANGE);
  const [icon, setIcon]         = useState("🏋️");
  const [daysPerWeek, setDPW]   = useState(4);
  const [days, setDays]         = useState<CustomWorkoutDay[]>([
    { id: `d-${Date.now()}`, label: "Tag 1", exercises: [] }
  ]);

  function addDay() {
    setDays(d => [...d, { id: `d-${Date.now()}-${d.length}`, label: `Tag ${d.length+1}`, exercises: [] }]);
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
      <div className="flex items-center gap-3 px-4 py-4 border-b sticky top-0 z-10" style={{ background:"#080808", borderColor:"#1e1e1e" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>TRAININGSPLAN ERSTELLEN</p>
        <button onClick={save} className="px-4 py-2 rounded-xl font-black text-sm"
          style={{ background: name ? ORANGE : "#2a2a2a", color:"#fff", fontFamily:F, border:"none" }}>
          SPEICHERN
        </button>
      </div>
      <div className="px-4 pt-5 flex flex-col gap-5">
        {/* Name */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">PLAN NAME</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Push Day Plan" autoFocus
            className="w-full px-4 py-3 rounded-xl text-white font-semibold outline-none"
            style={{ background:"#111", border:`1px solid ${name ? ORANGE : "#2a2a2a"}`, fontSize:15 }} />
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">BESCHREIBUNG</p>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="z.B. Oberkörper Fokus"
            className="w-full px-4 py-3 rounded-xl text-white font-semibold outline-none"
            style={{ background:"#111", border:"1px solid #2a2a2a", fontSize:14 }} />
        </div>
        {/* Icon + Color */}
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
        {/* Days per week */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">TAGE PRO WOCHE</p>
          <div className="flex gap-2">
            {[2,3,4,5,6,7].map(n => (
              <button key={n} onClick={() => setDPW(n)}
                className="w-10 h-10 rounded-xl font-black text-sm"
                style={{ background: daysPerWeek===n ? color : "#111", color: daysPerWeek===n ? "#fff" : "#888",
                  border:`1px solid ${daysPerWeek===n ? color : "#2a2a2a"}`, fontFamily:F }}>
                {n}
              </button>
            ))}
          </div>
        </div>
        {/* Days */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-3 font-bold">TRAININGSTAGE</p>
          {days.map((day, i) => (
            <DayEditor key={day.id} day={day}
              onChange={updated => setDays(d => d.map((x,j) => j===i ? updated : x))}
              onDelete={() => setDays(d => d.filter((_,j) => j!==i))} />
          ))}
          <button onClick={addDay} className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
            style={{ background:"#111", border:`1px dashed ${ORANGE}55`, color:ORANGE, fontFamily:F }}>
            + TAG HINZUFÜGEN
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Workout Creator Screen ─────────────────────────────────────────────────────
function WorkoutCreatorScreen({ onBack, existingId }: { onBack: ()=>void; existingId?: string }) {
  const createWorkout = usePlanStore(s => s.createWorkout);
  const updateWorkout = usePlanStore(s => s.updateWorkout);
  const workouts      = usePlanStore(s => s.workouts);
  const existing      = existingId ? workouts.find(w => w.id === existingId) : undefined;

  const [name, setName]         = useState(existing?.name ?? "");
  const [desc, setDesc]         = useState(existing?.desc ?? "");
  const [exercises, setEx]      = useState<PlanExercise[]>(existing?.exercises ?? []);
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();

  function save() {
    if (!name.trim()) return;
    if (existing) {
      updateWorkout(existing.id, { name: name.trim(), desc, exercises });
    } else {
      createWorkout({ name: name.trim(), desc, exercises });
    }
    onBack();
  }

  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      {showPicker && <ExercisePickerModal onClose={() => setShowPicker(false)}
        onAdd={ex => { setEx(e => [...e, ex]); setShowPicker(false); }} />}

      <div className="flex items-center gap-3 px-4 py-4 border-b sticky top-0 z-10" style={{ background:"#080808", borderColor:"#1e1e1e" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>
          {existing ? "WORKOUT BEARBEITEN" : "WORKOUT ERSTELLEN"}
        </p>
        <button onClick={save} className="px-4 py-2 rounded-xl font-black text-sm"
          style={{ background: name ? ORANGE : "#2a2a2a", color:"#fff", fontFamily:F, border:"none" }}>
          SPEICHERN
        </button>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-4">
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">WORKOUT NAME</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Mein Push Day" autoFocus
            className="w-full px-4 py-3 rounded-xl text-white font-semibold outline-none"
            style={{ background:"#111", border:`1px solid ${name ? ORANGE : "#2a2a2a"}`, fontSize:15 }} />
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">BESCHREIBUNG</p>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="z.B. Oberkörper"
            className="w-full px-4 py-3 rounded-xl text-white font-semibold outline-none"
            style={{ background:"#111", border:"1px solid #2a2a2a", fontSize:14 }} />
        </div>

        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-3 font-bold">ÜBUNGEN ({exercises.length})</p>
          <div className="flex flex-col gap-2 mb-3">
            {exercises.map((ex, i) => {
              const g: {reps:number;count:number}[] = [];
              ex.sets.forEach(s => { const l=g[g.length-1]; if(l&&l.reps===s.reps) l.count++; else g.push({reps:s.reps,count:1}); });
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background:"#111", border:"1px solid #1e1e1e" }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                    style={{ background:`${ORANGE}22`, color:ORANGE, fontFamily:F }}>{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate">{ex.name}</p>
                    <p className="text-xs text-gray-500">{g.map(x=>`${x.count}×${x.reps}`).join(" · ")}</p>
                  </div>
                  <button onClick={() => setEx(e => e.filter((_,j) => j!==i))}
                    style={{ background:"none",border:"none",color:"#ef4444",fontSize:16 }}>✕</button>
                </div>
              );
            })}
          </div>
          <button onClick={() => setShowPicker(true)}
            className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
            style={{ background:"#111", border:`1px dashed ${ORANGE}55`, color:ORANGE, fontFamily:F }}>
            + ÜBUNG HINZUFÜGEN
          </button>
        </div>
      </div>
    </div>
  );
}

// ── All Plans/Workouts Screen ──────────────────────────────────────────────────
function AllPlansScreen({ onBack, onEditWorkout }: { onBack: ()=>void; onEditWorkout: (id:string)=>void }) {
  const plans      = usePlanStore(s => s.plans);
  const workouts   = usePlanStore(s => s.workouts);
  const setActive  = usePlanStore(s => s.setActivePlan);
  const deletePlan = usePlanStore(s => s.deletePlan);
  const deleteWO   = usePlanStore(s => s.deleteWorkout);
  const duplicate  = usePlanStore(s => s.duplicatePlan);
  const activePlanId = usePlanStore(s => s.activePlanId);
  const [tab, setTab] = useState<"pläne"|"workouts">("pläne");

  return (
    <div className="min-h-screen pb-28" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor:"#1e1e1e" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>ALLE PLÄNE & WORKOUTS</p>
      </div>
      <div className="flex gap-1 p-1 rounded-xl mx-4 mt-4 mb-4" style={{ background:"#111" }}>
        {(["pläne","workouts"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg font-black text-sm"
            style={{ fontFamily:F, background: tab===t ? ORANGE : "transparent",
              color: tab===t ? "#fff" : "#666", border:"none" }}>
            {t === "pläne" ? "Pläne" : "Workouts"}
          </button>
        ))}
      </div>
      <div className="px-4 flex flex-col gap-3">
        {tab === "pläne" && plans.map(plan => (
          <div key={plan.id} className="rounded-2xl overflow-hidden"
            style={{ background:"#111", border:`1px solid ${plan.id===activePlanId ? plan.color+"55" : "#1e1e1e"}` }}>
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
            <div className="flex border-t" style={{ borderColor:"#1e1e1e" }}>
              {plan.id !== activePlanId && (
                <button onClick={() => setActive(plan.id)} className="flex-1 py-2.5 font-black text-xs"
                  style={{ background:"none",border:"none",color:"#22c55e",fontFamily:F }}>✓ Aktivieren</button>
              )}
              <button onClick={() => duplicate(plan.id)} className="flex-1 py-2.5 font-black text-xs border-l"
                style={{ background:"none",borderColor:"#1e1e1e",color:"#888",fontFamily:F }}>Duplizieren</button>
              {plan.id !== "builtin-2er-split" && (
                <button onClick={() => deletePlan(plan.id)}
                  className="flex-1 py-2.5 font-black text-xs border-l"
                  style={{ background:"none",borderColor:"#1e1e1e",color:"#ef4444",fontFamily:F }}>Löschen</button>
              )}
            </div>
          </div>
        ))}
        {tab === "workouts" && workouts.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8">Noch keine Workouts erstellt.</p>
        )}
        {tab === "workouts" && workouts.map(w => (
          <div key={w.id} className="rounded-2xl p-4"
            style={{ background:"#111", border:"1px solid #1e1e1e" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background:`${ORANGE}18` }}>💪</div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-white" style={{ fontFamily:F }}>{w.name}</p>
                <p className="text-xs text-gray-500">{w.desc} · {w.exercises.length} Übungen</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEditWorkout(w.id)}
                className="flex-1 py-2 rounded-xl font-black text-xs"
                style={{ background:"#1e1e1e",color:"#888",fontFamily:F,border:"none" }}>✎ Bearbeiten</button>
              <button onClick={() => deleteWO(w.id)}
                className="flex-1 py-2 rounded-xl font-black text-xs"
                style={{ background:"#1a0000",color:"#ef4444",fontFamily:F,border:"none" }}>🗑 Löschen</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Day Detail ────────────────────────────────────────────────────────────────
function DayDetailScreen({ day, color, onBack }: { day: { label:string; exercises:PlanExercise[] }; color:string; onBack:()=>void }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen pb-28" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b sticky top-0 z-10" style={{ background:"#080808",borderColor:"#1e1e1e" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
        <div className="flex-1">
          <p className="font-black italic text-xl text-white" style={{ fontFamily:F }}>{day.label.toUpperCase()}</p>
          <p className="text-xs text-gray-500">{day.exercises.length} Übungen</p>
        </div>
      </div>
      <div className="px-4 pt-4 flex flex-col gap-2.5">
        {day.exercises.map((ex, i) => {
          const g: {reps:number;count:number}[] = [];
          ex.sets.forEach(s => { const l=g[g.length-1]; if(l&&l.reps===s.reps) l.count++; else g.push({reps:s.reps,count:1}); });
          return (
            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background:"#111", border:"1px solid #1e1e1e" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ background:`${color}22`, color, fontFamily:F }}>{i+1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-white truncate" style={{ fontFamily:F }}>{ex.name}</p>
                <p className="text-xs text-gray-500 mt-0.5" style={{ color }}>{g.map(x=>`${x.count}×${x.reps}`).join(" · ")}</p>
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

// ── Main PlanScreen ───────────────────────────────────────────────────────────
export function PlanScreen() {
  const navigate = useNavigate();
  const { stats, weeklyGoal, weekDays } = usePawgressStore();
  const setWeeklyGoal = useStatsStore(s => s.setWeeklyGoal);
  const weeklyWorkouts = stats.weeklyWorkouts;

  const plans          = usePlanStore(s => s.plans);
  const workouts       = usePlanStore(s => s.workouts);
  const activePlanId   = usePlanStore(s => s.activePlanId);
  const deletePlan     = usePlanStore(s => s.deletePlan);
  const duplicatePlan  = usePlanStore(s => s.duplicatePlan);
  const setActivePlan  = usePlanStore(s => s.setActivePlan);
  const activePlan     = plans.find(p => p.id === activePlanId) ?? plans[0];

  type SubScreen = null | "createPlan" | "createWorkout" | "allPlans" | "editWorkout";
  const [sub, setSub]         = useState<SubScreen>(null);
  const [editWOId, setEditWOId] = useState<string|undefined>(undefined);
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [dayDetail, setDayDetail] = useState<{label:string;exercises:PlanExercise[];color:string}|null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (sub === "createPlan") return <PlanCreatorScreen onBack={() => setSub(null)} />;
  if (sub === "createWorkout") return <WorkoutCreatorScreen onBack={() => setSub(null)} />;
  if (sub === "editWorkout" && editWOId) return <WorkoutCreatorScreen onBack={() => setSub(null)} existingId={editWOId} />;
  if (sub === "allPlans") return <AllPlansScreen onBack={() => setSub(null)}
    onEditWorkout={(id) => { setEditWOId(id); setSub("editWorkout"); }} />;
  if (dayDetail) return <DayDetailScreen day={dayDetail} color={dayDetail.color} onBack={() => setDayDetail(null)} />;

  // Top 3 plans/workouts to show
  const shownItems = [
    ...plans.slice(0, 3),
    ...workouts.slice(0, Math.max(0, 3 - plans.length)),
  ];
  const goal = weeklyGoal ?? 4;
  const progress = Math.min(weeklyWorkouts / goal, 1);

  return (
    <div className="min-h-screen pb-28" style={{ background:"#080808", color:"#fff" }}>

      {/* Goal Edit Modal */}
      {showGoalEdit && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background:"rgba(0,0,0,0.88)" }}>
          <div className="w-full rounded-t-3xl p-6" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
            <p className="font-black italic text-xl text-white mb-1" style={{ fontFamily:F }}>WOCHENZIEL FESTLEGEN</p>
            <p className="text-xs text-gray-500 mb-4">Wie viele Workouts pro Woche?</p>
            <div className="grid grid-cols-7 gap-2 mb-5">
              {[1,2,3,4,5,6,7].map(n => (
                <button key={n} onClick={() => { setWeeklyGoal(n); }}
                  className="py-3 rounded-xl font-black text-lg"
                  style={{ fontFamily:F, background: goal===n ? ORANGE : "#1e1e1e",
                    color: goal===n ? "#fff" : "#888", border:`1px solid ${goal===n ? ORANGE : "#2a2a2a"}` }}>{n}</button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mb-3">Erinnerung</p>
            <div className="flex items-center justify-between p-3 rounded-xl mb-4"
              style={{ background:"#1e1e1e" }}>
              <span className="text-sm text-white">Mo, Mi, Fr · 18:00</span>
              <span style={{ color:ORANGE }}>›</span>
            </div>
            <button onClick={() => setShowGoalEdit(false)} className="w-full py-3 rounded-xl font-black"
              style={{ background:ORANGE, color:"#fff", fontFamily:F, border:"none" }}>FERTIG</button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background:"rgba(0,0,0,0.9)" }}>
          <div className="rounded-2xl p-6 w-full" style={{ background:"#111",border:"1px solid #ef4444" }}>
            <p className="font-black text-xl text-white mb-2" style={{ fontFamily:F }}>PLAN LÖSCHEN?</p>
            <p className="text-sm text-gray-400 mb-5">"{activePlan?.name}" wird dauerhaft gelöscht.</p>
            <button onClick={() => { if (activePlan) { deletePlan(activePlan.id); setShowDeleteConfirm(false); } }}
              className="w-full py-3 rounded-xl font-black text-white mb-2"
              style={{ background:"#ef4444",fontFamily:F,border:"none" }}>LÖSCHEN</button>
            <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-3 rounded-xl font-black"
              style={{ background:"#2a2a2a",color:"#fff",fontFamily:F,border:"none" }}>ABBRECHEN</button>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: 260 }}>
        <img src="/images/plan_hero.webp" alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(8,8,8,0.92) 40%, rgba(8,8,8,0.5) 70%, rgba(8,8,8,0.1) 100%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, transparent 50%, rgba(8,8,8,1) 100%)",
        }} />
        <div className="relative z-10 px-4 pt-6">
          <p className="font-black italic leading-none text-white" style={{ fontFamily: F, fontSize: 56 }}>PLAN</p>
          <p className="text-sm text-gray-300 mt-1">Dein Training. Dein Ziel.</p>
          <p className="text-sm font-black" style={{ color: ORANGE }}>In Sekunden startbereit.</p>
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-5">

        {/* ── CREATE BUTTONS ── */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setSub("createPlan")}
            className="flex items-center gap-3 p-4 rounded-2xl text-left"
            style={{ background: "#111", border: "1px solid #1e1e1e", position: "relative", overflow: "hidden" }}>
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: ORANGE }} />
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ml-2"
              style={{ background: `${ORANGE}18` }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="3" width="16" height="16" rx="3" stroke={ORANGE} strokeWidth="1.5"/>
                <line x1="11" y1="7" x2="11" y2="15" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="7" y1="11" x2="15" y2="11" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="font-black text-sm text-white leading-tight" style={{ fontFamily: F }}>TRAININGSPLAN{"\n"}ERSTELLEN</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Eigenen Plan anlegen</p>
            </div>
          </button>
          <button onClick={() => setSub("createWorkout")}
            className="flex items-center gap-3 p-4 rounded-2xl text-left"
            style={{ background: "#111", border: "1px solid #1e1e1e", position: "relative", overflow: "hidden" }}>
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: ORANGE }} />
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ml-2"
              style={{ background: `${ORANGE}18` }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="1" y="9" width="3" height="4" rx="1" fill={ORANGE}/>
                <rect x="4" y="7" width="2" height="8" rx="1" fill={ORANGE}/>
                <rect x="6" y="10" width="10" height="2" rx="1" fill={ORANGE}/>
                <rect x="16" y="7" width="2" height="8" rx="1" fill={ORANGE}/>
                <rect x="18" y="9" width="3" height="4" rx="1" fill={ORANGE}/>
              </svg>
            </div>
            <div>
              <p className="font-black text-sm text-white leading-tight" style={{ fontFamily: F }}>WORKOUT{"\n"}ERSTELLEN</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Individuelles Workout</p>
            </div>
          </button>
        </div>

        {/* ── MEINE PLÄNE ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black italic text-xl text-white" style={{ fontFamily:F }}>MEINE PLÄNE</p>
            <button onClick={() => setSub("allPlans")} className="text-xs font-bold"
              style={{ color:ORANGE, background:"none", border:"none" }}>Alle anzeigen ›</button>
          </div>
          <div className="flex flex-col gap-2.5">
            {shownItems.map((item: CustomPlan | StandaloneWorkout, idx) => {
              const isPlan = "days" in item;
              const plan = item as CustomPlan;
              const wo   = item as StandaloneWorkout;
              const isActive = isPlan && plan.id === activePlanId;
              const color = isPlan ? plan.color : ORANGE;
              const icon  = isPlan ? plan.icon : "💪";
              const name  = item.name;
              const desc  = isPlan ? plan.desc : wo.desc;
              const meta  = isPlan
                ? `${plan.daysPerWeek} Tage / Woche  ·  ${plan.focus}`
                : `${wo.exercises.length} Übungen`;
              return (
                <button key={item.id}
                  onClick={() => isPlan && plan.days[0] && setDayDetail({ label:plan.days[0].label, exercises:plan.days[0].exercises, color })}
                  className="w-full text-left rounded-2xl overflow-hidden"
                  style={{ background:"#111", border:`1px solid ${isActive ? color+"55" : "#1e1e1e"}`, padding:0,
                    boxShadow: isActive ? `0 0 12px ${color}18` : "none" }}>
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background:`${color}18`, border:`1px solid ${color}33` }}>{icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="font-black text-base text-white" style={{ fontFamily:F }}>{name}</p>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black"
                            style={{ background:"#22c55e", color:"#fff", fontFamily:F }}>AKTIV</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{desc}</p>
                      <div className="flex items-center gap-3">
                        {isPlan && (
                          <>
                            <div className="flex items-center gap-1">
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                <rect x="1" y="2" width="9" height="8" rx="1.5" stroke="#555" strokeWidth="1"/>
                                <line x1="1" y1="4.5" x2="10" y2="4.5" stroke="#555" strokeWidth="1"/>
                                <line x1="3.5" y1="1" x2="3.5" y2="3" stroke="#555" strokeWidth="1" strokeLinecap="round"/>
                                <line x1="7.5" y1="1" x2="7.5" y2="3" stroke="#555" strokeWidth="1" strokeLinecap="round"/>
                              </svg>
                              <span className="text-[10px] text-gray-600">{(item as CustomPlan).daysPerWeek} Tage/Woche</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                <rect x="0.5" y="4.5" width="1.5" height="2" rx="0.5" fill="#555"/>
                                <rect x="2" y="3.5" width="1" height="4" rx="0.5" fill="#555"/>
                                <rect x="3" y="5" width="5" height="1" rx="0.5" fill="#555"/>
                                <rect x="8" y="3.5" width="1" height="4" rx="0.5" fill="#555"/>
                                <rect x="9" y="4.5" width="1.5" height="2" rx="0.5" fill="#555"/>
                              </svg>
                              <span className="text-[10px] text-gray-600">{(item as CustomPlan).focus}</span>
                            </div>
                          </>
                        )}
                        {!isPlan && (
                          <span className="text-[10px] text-gray-600">{(item as StandaloneWorkout).exercises.length} Übungen</span>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-600 text-xl flex-shrink-0">›</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Import */}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mt-2.5"
            style={{ background:"#0d0d0d", border:"1px solid #1e1e1e" }}>
            <span style={{ color:ORANGE, fontSize:18 }}>↑</span>
            <p className="font-black text-sm flex-1 text-left" style={{ color:ORANGE, fontFamily:F }}>NEUEN PLAN IMPORTIEREN</p>
            <span className="text-gray-600">›</span>
          </button>
        </div>

        {/* ── WOCHENZIEL ── */}
        <div>
          <p className="font-black italic text-xl text-white mb-3" style={{ fontFamily:F }}>WOCHENZIEL</p>
          <div className="rounded-2xl overflow-hidden" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
            <div className="flex items-center gap-4 p-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ORANGE}18`, border: `1px solid ${ORANGE}33` }}>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="11" stroke={ORANGE} strokeWidth="1.5"/>
                  <circle cx="13" cy="13" r="6.5" stroke={ORANGE} strokeWidth="1.5"/>
                  <circle cx="13" cy="13" r="2.5" fill={ORANGE}/>
                  <line x1="19" y1="7" x2="23" y2="3" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                  <polyline points="21,3 23,3 23,5" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Aktuelles Ziel</p>
                <p className="font-black text-2xl text-white" style={{ fontFamily:F }}>
                  {weeklyWorkouts} <span className="text-gray-500 text-lg">/ {goal}</span>
                  <span className="text-base text-gray-400 font-normal ml-1">Workouts</span>
                </p>
                <p className="text-xs text-gray-600 mb-2">Diese Woche</p>
                <div className="rounded-full overflow-hidden" style={{ height:5, background:"#1e1e1e" }}>
                  <div className="h-full rounded-full" style={{ width:`${progress*100}%`, background:ORANGE }} />
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0 items-end">
                <button onClick={() => setShowGoalEdit(true)}
                  className="flex items-center gap-1 text-xs font-bold"
                  style={{ background:"none",border:"none",color:"#aaa", whiteSpace:"nowrap" }}>
                  Ziel bearbeiten <span>›</span>
                </button>
                <div className="flex flex-col items-end" style={{ lineHeight:1.3 }}>
                  <span className="text-[10px] text-gray-600">Erinnerung</span>
                  <button className="text-xs font-bold"
                    style={{ background:"none",border:"none",color:ORANGE, whiteSpace:"nowrap" }}>
                    Mo, Mi, Fr 18:00 ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCHNELLAKTIONEN ── */}
        <div>
          <p className="font-black italic text-xl text-white mb-3" style={{ fontFamily:F }}>Schnellaktionen</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon:"📝", label:"PLAN\nBEARBEITEN", action: () => setSub("createPlan"), color:"#3b82f6" },
              { icon:"📋", label:"PLAN\nDUPLIZIEREN", action: () => { if (activePlan) duplicatePlan(activePlan.id); }, color:ORANGE },
              { icon:"🗑", label:"PLAN\nLÖSCHEN",    action: () => setShowDeleteConfirm(true), color:"#ef4444" },
              { icon:"📊", label:"PLAN\nSTATISTIKEN",action: () => navigate("/profil"), color:"#22c55e" },
            ].map((a, i) => (
              <button key={i} onClick={a.action}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl"
                style={{ background:"#111", border:"1px solid #1e1e1e" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background:`${a.color}18` }}>{a.icon}</div>
                <p className="font-black text-[9px] text-center text-white whitespace-pre-line leading-tight"
                  style={{ fontFamily:F }}>{a.label}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
