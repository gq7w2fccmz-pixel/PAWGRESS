import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PLAN_2ER_SPLIT, type PlanDay } from "../data/plan_2er_split";
import { usePawgressStore } from "../hooks/usePawgressStore";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

// ── Day Detail Screen ────────────────────────────────────────────────────────
function DayScreen({ day, onBack }: { day: PlanDay; onBack: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a", color: "#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 sticky top-0 z-10"
        style={{ background: "#0a0a0a", borderBottom: "1px solid #2a2a2a" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black"
              style={{ background: day.color, color: "#fff", fontFamily: F }}>{day.tag}</span>
            <h2 className="font-black italic text-2xl text-white" style={{ fontFamily: F }}>{day.label.toUpperCase()}</h2>
          </div>
          <p className="text-xs text-gray-500">{day.exercises.length} Übungen · {day.exercises.reduce((a,e) => a + e.sets.length, 0)} Sätze</p>
        </div>
      </div>
      <div className="px-4 pt-4 flex flex-col gap-3">
        {day.exercises.map((ex, i) => {
          const grouped: { reps: number; count: number }[] = [];
          ex.sets.forEach(s => {
            const last = grouped[grouped.length - 1];
            if (last && last.reps === s.reps) last.count++;
            else grouped.push({ reps: s.reps, count: 1 });
          });
          const setsLabel = grouped.map(g => `${g.count}×${g.reps}`).join(" · ");
          return (
            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ background: `${day.color}22`, color: day.color, fontFamily: F }}>{i + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-white truncate" style={{ fontFamily: F }}>{ex.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{setsLabel}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {ex.sets.map((_, si) => (
                  <div key={si} className="w-2 h-2 rounded-full" style={{ background: "#2a2a2a" }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-4 mt-6">
        <button className="w-full py-4 rounded-2xl font-black text-lg text-white"
          style={{ background: day.color, fontFamily: F }}
          onClick={() => navigate("/training")}>
          {day.label.toUpperCase()} STARTEN ›
        </button>
      </div>
    </div>
  );
}

// ── Custom Workout Creator ───────────────────────────────────────────────────
function CreateWorkoutScreen({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a", color: "#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#2a2a2a" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <h2 className="font-black italic text-xl text-white flex-1" style={{ fontFamily: F }}>WORKOUT ERSTELLEN</h2>
      </div>
      <div className="px-4 pt-5 flex flex-col gap-4">
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">NAME DES WORKOUTS</p>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="z.B. Mein Push Day"
            className="w-full px-4 py-3 rounded-xl text-white font-semibold outline-none"
            style={{ background: "#161616", border: `1px solid ${name ? ORANGE : "#2a2a2a"}`, fontSize: 15 }} />
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">NOTIZ (OPTIONAL)</p>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Ziel, Fokus, Hinweise..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-white font-semibold outline-none resize-none"
            style={{ background: "#161616", border: "1px solid #2a2a2a", fontSize: 14 }} />
        </div>

        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-3 font-bold">ÜBUNGEN HINZUFÜGEN</p>
          {/* Use 2er Split days as templates */}
          {PLAN_2ER_SPLIT.map((day, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: "#1e1e1e" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black"
                style={{ background: `${day.color}22`, color: day.color, fontFamily: F }}>
                {day.tag[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-white">{day.label}</p>
                <p className="text-xs text-gray-500">{day.exercises.length} Übungen · {day.exercises.reduce((a,e)=>a+e.sets.length,0)} Sätze</p>
              </div>
              <button className="text-xs font-black px-3 py-1.5 rounded-xl"
                style={{ background: `${day.color}22`, color: day.color, border: `1px solid ${day.color}66` }}
                onClick={() => navigate("/training")}>
                Als Basis
              </button>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <p className="text-xs text-gray-500 text-center mb-4">
            Übungen können direkt im Training bearbeitet, hinzugefügt und entfernt werden.
          </p>
          <button
            className="w-full py-4 rounded-2xl font-black text-xl text-white"
            style={{ background: name ? ORANGE : "#2a2a2a", fontFamily: F, border: "none" }}
            disabled={!name}
            onClick={() => navigate("/training")}>
            WORKOUT STARTEN ›
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Plan Screen ─────────────────────────────────────────────────────────
export function PlanScreen() {
  const navigate = useNavigate();
  const { stats } = usePawgressStore();
  const [activeDay, setActiveDay] = useState<PlanDay | null>(null);
  const [activeTab, setActiveTab] = useState<"pläne" | "workouts">("pläne");
  const [showCreate, setShowCreate] = useState(false);

  if (activeDay) return <DayScreen day={activeDay} onBack={() => setActiveDay(null)} />;
  if (showCreate) return <CreateWorkoutScreen onBack={() => setShowCreate(false)} />;

  // Today's workout
  const todayDay = PLAN_2ER_SPLIT[stats.totalWorkouts % 4];
  const todaySets = todayDay.exercises.reduce((a, e) => a + e.sets.length, 0);

  // Date formatting
  const now = new Date();
  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  const dateStr = `${dayNames[now.getDay()]}, ${now.getDate()}. ${monthNames[now.getMonth()]}`;

  const totalSets = PLAN_2ER_SPLIT.reduce((a, d) => a + d.exercises.reduce((b, e) => b + e.sets.length, 0), 0);
  const totalEx   = PLAN_2ER_SPLIT.reduce((a, d) => a + d.exercises.length, 0);

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* ── Create Banner ── */}
      <div className="mx-4 mt-4 mb-4 rounded-2xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #1a0a00 0%, #2a1200 60%, #0a0a0a 100%)", border: "1px solid #f9731633" }}>
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 opacity-80">
          <img src="/images/paw.webp" alt="" className="w-20 h-20 object-contain"
            style={{ filter: "drop-shadow(0 0 20px #f97316)" }} />
        </div>
        <div className="relative z-10 p-5">
          <p className="font-black italic text-xs text-orange-400 tracking-widest mb-0.5" style={{ fontFamily: F }}>PLAN ODER WORKOUT</p>
          <p className="font-black italic text-3xl text-white leading-tight mb-1" style={{ fontFamily: F }}>ERSTELLEN</p>
          <p className="text-xs text-gray-400 mb-4">Dein Training. Dein Ziel.<br />In Sekunden startbereit.</p>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm text-white"
            style={{ background: ORANGE, fontFamily: F, border: "none" }}>
            Jetzt starten <span>›</span>
          </button>
        </div>
      </div>

      {/* ── Heute ── */}
      <div className="mx-4 mb-4 rounded-2xl p-4" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-xs tracking-widest" style={{ color: ORANGE, fontFamily: F }}>HEUTE</p>
          <p className="text-xs text-gray-500">📅 {dateStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${todayDay.color}22`, border: `1px solid ${todayDay.color}66` }}>
            <span style={{ color: todayDay.color, fontSize: 22 }}>
              {todayDay.tag === "PUSH" ? "🏋️" : "💪"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-lg text-white leading-tight" style={{ fontFamily: F }}>
              {todayDay.label}
            </p>
            <p className="text-xs text-gray-400">
              {todayDay.tag === "PUSH" ? "Brust · Schulter · Trizeps" : "Rücken · Bizeps · Core"}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              ⏱ ~60 Min · 🏋️ {todayDay.exercises.length} Übungen
            </p>
          </div>
          <button onClick={() => navigate("/training")}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl font-black text-sm text-white"
            style={{ background: ORANGE, fontFamily: F, border: "none", boxShadow: `0 0 12px ${ORANGE}55` }}>
            Training<br />starten ›
          </button>
        </div>
      </div>

      {/* ── Meine Pläne & Workouts ── */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-black italic text-lg text-white" style={{ fontFamily: F }}>MEINE PLÄNE & WORKOUTS</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: "#161616" }}>
          {(["pläne", "workouts"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg font-black text-sm"
              style={{
                fontFamily: F,
                background: activeTab === tab ? ORANGE : "transparent",
                color: activeTab === tab ? "#fff" : "#888",
                border: "none", textTransform: "capitalize",
              }}>
              {tab === "pläne" ? "Pläne" : "Workouts"}
            </button>
          ))}
        </div>

        {/* Plan cards – horizontal scroll */}
        {activeTab === "pläne" && (
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
            {/* Active plan */}
            <div className="flex-shrink-0 rounded-2xl p-4 relative"
              style={{ width: 200, scrollSnapAlign: "start", background: "#161616", border: `1px solid ${ORANGE}55` }}>
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-black"
                style={{ background: "#22c55e", color: "#fff", fontFamily: F }}>AKTIV</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mt-6 mb-3"
                style={{ background: `${ORANGE}22` }}>
                <span style={{ color: ORANGE }}>🏋️</span>
              </div>
              <p className="font-black text-base text-white" style={{ fontFamily: F }}>2er Split</p>
              <p className="text-xs text-gray-500 mb-2">4 Tage / Woche</p>
              <p className="text-[10px] text-gray-600 mb-1">Nächstes Workout</p>
              <p className="font-bold text-sm text-white">{todayDay.label}</p>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Fortschritt</span>
                  <span>{Math.min(stats.totalWorkouts * 8, 100)}%</span>
                </div>
                <div className="rounded-full" style={{ height: 4, background: "#2a2a2a" }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${Math.min(stats.totalWorkouts * 8, 100)}%`, background: ORANGE }} />
                </div>
              </div>
            </div>

            {/* Create new plan */}
            <button onClick={() => setShowCreate(true)}
              className="flex-shrink-0 rounded-2xl p-4 flex flex-col items-center justify-center gap-2"
              style={{ width: 160, scrollSnapAlign: "start", background: "#0f0f0f", border: "1px dashed #3a3a3a" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ background: "#1a1a1a" }}>+</div>
              <p className="font-black text-sm text-gray-400 text-center" style={{ fontFamily: F }}>
                Neuer Plan
              </p>
            </button>
          </div>
        )}

        {activeTab === "workouts" && (
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
            {/* Create workout */}
            <button onClick={() => setShowCreate(true)}
              className="flex-shrink-0 rounded-2xl p-4 flex flex-col items-center justify-center gap-2"
              style={{ width: 160, scrollSnapAlign: "start", background: "#0f0f0f", border: "1px dashed #3a3a3a" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ background: "#1a1a1a" }}>+</div>
              <p className="font-black text-sm text-gray-400 text-center" style={{ fontFamily: F }}>
                Neues Workout
              </p>
            </button>
          </div>
        )}
      </div>

      {/* ── Trainingstage ── */}
      <div className="px-4">
        <p className="font-black italic text-lg text-white mb-3" style={{ fontFamily: F }}>TRAININGSTAGE</p>
        <div className="flex flex-col gap-3">
          {PLAN_2ER_SPLIT.map((day, i) => {
            const setCount = day.exercises.reduce((a, e) => a + e.sets.length, 0);
            const isToday = i === (stats.totalWorkouts % 4);
            return (
              <button key={day.id} onClick={() => setActiveDay(day)}
                className="w-full text-left rounded-2xl overflow-hidden"
                style={{ background: "#161616", border: `1px solid ${isToday ? day.color + "88" : "#2a2a2a"}`, padding: 0 }}>
                <div className="flex items-center gap-4 p-4">
                  {/* Day number */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0"
                    style={{ background: `${day.color}22`, color: day.color, fontFamily: F }}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black"
                        style={{ background: day.color, color: "#fff", fontFamily: F }}>{day.tag}</span>
                      <p className="font-black text-lg text-white" style={{ fontFamily: F }}>{day.label.toUpperCase()}</p>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black"
                          style={{ background: "#22c55e", color: "#fff", fontFamily: F }}>HEUTE</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{day.exercises.length} Übungen · {setCount} Sätze</p>
                    <p className="text-[10px] text-gray-600 mt-0.5 truncate">
                      {day.exercises.slice(0, 3).map(e => e.name).join(" · ")}{day.exercises.length > 3 ? ` · +${day.exercises.length - 3}` : ""}
                    </p>
                  </div>
                  <span className="text-gray-600 text-xl flex-shrink-0">›</span>
                </div>
                {isToday && (
                  <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${day.color}, transparent)` }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
