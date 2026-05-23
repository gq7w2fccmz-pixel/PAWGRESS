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
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 sticky top-0 z-10"
        style={{ background: "#080808", borderBottom: "1px solid #1a1a1a" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black"
              style={{ background: day.color, color: "#fff", fontFamily: F }}>{day.tag}</span>
            <h2 className="font-black italic text-2xl text-white" style={{ fontFamily: F }}>{day.label.toUpperCase()}</h2>
          </div>
          <p className="text-xs text-gray-500">{day.exercises.length} Übungen · {day.exercises.reduce((a,e)=>a+e.sets.length,0)} Sätze</p>
        </div>
      </div>
      <div className="px-4 pt-4 flex flex-col gap-2">
        {day.exercises.map((ex, i) => {
          const grouped: {reps:number;count:number}[] = [];
          ex.sets.forEach(s => {
            const last = grouped[grouped.length-1];
            if (last && last.reps === s.reps) last.count++;
            else grouped.push({reps:s.reps,count:1});
          });
          return (
            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl"
              style={{ background: "#111", border: "1px solid #1a1a1a" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ background: `${day.color}22`, color: day.color, fontFamily: F }}>{i+1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-white truncate" style={{ fontFamily: F }}>{ex.name}</p>
                <p className="text-xs mt-0.5" style={{ color: day.color }}>{grouped.map(g=>`${g.count}×${g.reps}`).join(" · ")}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-4 mt-6">
        <button className="w-full py-4 rounded-2xl font-black text-lg text-white"
          style={{ background: day.color, fontFamily: F, border: "none", boxShadow: `0 0 20px ${day.color}44` }}
          onClick={() => navigate("/training")}>
          {day.label.toUpperCase()} STARTEN ›
        </button>
      </div>
    </div>
  );
}

// ── Create Workout Screen ─────────────────────────────────────────────────────
function CreateWorkoutScreen({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#1a1a1a" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <h2 className="font-black italic text-xl text-white flex-1" style={{ fontFamily: F }}>TRAINING ERSTELLEN</h2>
      </div>
      <div className="px-4 pt-5 flex flex-col gap-5">
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">NAME DES TRAININGS</p>
          <input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="z.B. Mein Push Day"
            className="w-full px-4 py-3 rounded-xl text-white font-semibold outline-none"
            style={{ background: "#111", border: `1px solid ${name ? ORANGE : "#2a2a2a"}`, fontSize: 15 }} />
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-3 font-bold">ALS BASIS VERWENDEN</p>
          {PLAN_2ER_SPLIT.map((day, i) => (
            <div key={i} className="flex items-center gap-3 py-3.5 border-b" style={{ borderColor: "#1a1a1a" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
                style={{ background: `${day.color}22`, color: day.color, fontFamily: F }}>{i+1}</div>
              <div className="flex-1">
                <p className="font-bold text-sm text-white">{day.label}</p>
                <p className="text-xs text-gray-500">{day.exercises.length} Übungen · {day.exercises.reduce((a,e)=>a+e.sets.length,0)} Sätze</p>
              </div>
              <button className="text-xs font-black px-3 py-1.5 rounded-xl"
                style={{ background: `${day.color}22`, color: day.color, border: `1px solid ${day.color}44` }}
                onClick={() => navigate("/training")}>Verwenden</button>
            </div>
          ))}
        </div>
        <button className="w-full py-4 rounded-2xl font-black text-xl text-white"
          style={{ background: name ? ORANGE : "#222", fontFamily: F, border: "none",
            boxShadow: name ? `0 0 20px ${ORANGE}44` : "none" }}
          disabled={!name} onClick={() => navigate("/training")}>
          TRAINING STARTEN ›
        </button>
      </div>
    </div>
  );
}

// ── Main Plan Screen ──────────────────────────────────────────────────────────
export function PlanScreen() {
  const navigate = useNavigate();
  const { stats, coachProgress } = usePawgressStore();
  const [activeDay, setActiveDay] = useState<PlanDay | null>(null);
  const [activeTab, setActiveTab] = useState<"pläne" | "workouts">("pläne");
  const [showCreate, setShowCreate] = useState(false);

  if (activeDay) return <DayScreen day={activeDay} onBack={() => setActiveDay(null)} />;
  if (showCreate) return <CreateWorkoutScreen onBack={() => setShowCreate(false)} />;

  const todayDay = PLAN_2ER_SPLIT[stats.totalWorkouts % 4];
  const nextDay  = PLAN_2ER_SPLIT[(stats.totalWorkouts + 1) % 4];
  const now = new Date();
  const dayNames   = ["So","Mo","Di","Mi","Do","Fr","Sa"];
  const monthNames = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
  const dateStr = `${dayNames[now.getDay()]}, ${now.getDate()}. ${monthNames[now.getMonth()]}`;
  const progress = Math.min(stats.totalWorkouts * 8, 100);
  const streak   = coachProgress.currentStreak;

  // Next 3 workouts
  const nextWorkouts = [1,2,3].map(offset => {
    const idx = (stats.totalWorkouts + offset) % 4;
    const d = new Date(); d.setDate(d.getDate() + offset);
    const label = offset === 1 ? "Morgen" : `${dayNames[d.getDay()]}, ${d.getDate()}. ${monthNames[d.getMonth()]}`;
    return { day: PLAN_2ER_SPLIT[idx], label };
  });

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 300 }}>
        {/* Background image */}
        <img src="/images/plan_hero.webp" alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "left center" }} />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(8,8,8,0.45) 0%, rgba(8,8,8,0.75) 60%, rgba(8,8,8,1) 100%)",
        }} />

        <div className="relative z-10 px-4 pt-5 pb-5">
          {/* Title */}
          <p className="font-black italic text-6xl text-white leading-none mb-0.5 drop-shadow-lg"
            style={{ fontFamily: F }}>PLAN</p>
          <p className="text-sm text-gray-300 mb-0.5">Dein Training. Dein Ziel.</p>
          <p className="text-sm font-black mb-4" style={{ color: ORANGE }}>In Sekunden startbereit.</p>

          {/* Quick stats row */}
          <div className="flex gap-2 mb-4">
            {[
              { icon: "🔥", val: String(streak), label: "TAGE STREAK" },
              { icon: "🎯", val: `${progress}%`, label: "WOCHENZIEL" },
              { icon: "📅", val: String(PLAN_2ER_SPLIT.length), label: "AKTIVE PLÄNE" },
            ].map(s => (
              <div key={s.label} className="flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-xl"
                style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(249,115,22,0.25)" }}>
                <span className="text-base">{s.icon}</span>
                <div>
                  <p className="font-black text-sm text-white leading-none" style={{ fontFamily: F }}>{s.val}</p>
                  <p className="text-[8px] text-gray-500 tracking-wide">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Create button */}
          <button onClick={() => setShowCreate(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-base mb-3"
            style={{ background: "transparent", border: `1.5px solid ${ORANGE}`, color: ORANGE, fontFamily: F }}>
            <span className="text-lg">⊕</span> TRAINING ERSTELLEN <span>›</span>
          </button>

          {/* Next workout hint */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: `${ORANGE}22` }}>
                <img src="/images/paw.webp" alt="" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Nächstes Training morgen um 18:00</p>
                <p className="text-xs font-bold">
                  <span style={{ color: ORANGE }}>{nextDay.label}</span>
                  <span className="text-gray-400"> · {nextDay.tag === "PUSH" ? "Brust · Schulter · Trizeps" : "Rücken · Bizeps · Core"}</span>
                </p>
              </div>
            </div>
            <button className="text-xs text-gray-500 flex-shrink-0" style={{ background:"none",border:"none" }}>
              Plan ansehen ›
            </button>
          </div>
        </div>
      </div>

      {/* ── HEUTE ── */}
      <div className="mx-4 mb-4 rounded-2xl p-4" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-sm tracking-widest" style={{ color: ORANGE, fontFamily: F }}>HEUTE</p>
          <p className="text-xs text-gray-500">📅 {dateStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${todayDay.color}18`, border: `1.5px solid ${todayDay.color}55` }}>
            <span style={{ color: todayDay.color, fontSize: 26 }}>{todayDay.tag === "PUSH" ? "🏋️" : "💪"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-xl text-white leading-tight mb-0.5" style={{ fontFamily: F }}>{todayDay.label}</p>
            <p className="text-xs text-gray-400 mb-1">{todayDay.tag === "PUSH" ? "Brust · Schulter · Trizeps" : "Rücken · Bizeps · Core"}</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600">⏱ ~60 Min</span>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-600">🏋️ {todayDay.exercises.length} Übungen</span>
            </div>
          </div>
          <button onClick={() => navigate("/training")}
            className="flex-shrink-0 px-4 py-3 rounded-xl font-black text-sm text-white"
            style={{ background: ORANGE, fontFamily: F, border: "none", boxShadow: `0 4px 16px ${ORANGE}44`, lineHeight: 1.3 }}>
            Training<br />starten ›
          </button>
        </div>
      </div>

      {/* ── MEINE PLÄNE & WORKOUTS ── */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-black italic text-lg text-white" style={{ fontFamily: F }}>MEINE PLÄNE & WORKOUTS</p>
          <button className="text-xs font-bold" style={{ color: ORANGE, background:"none", border:"none" }}>Alle anzeigen ›</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: "#111" }}>
          {(["pläne","workouts"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg font-black text-sm"
              style={{ fontFamily: F,
                background: activeTab === tab ? "#1a0a00" : "transparent",
                color: activeTab === tab ? ORANGE : "#666",
                border: activeTab === tab ? `1px solid ${ORANGE}55` : "1px solid transparent",
              }}>
              {tab === "pläne" ? "Pläne" : "Workouts"}
            </button>
          ))}
        </div>

        {/* Plan cards horizontal scroll */}
        {activeTab === "pläne" && (
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
            {/* Active plan */}
            <div className="flex-shrink-0 rounded-2xl p-4 relative"
              style={{ width: 200, scrollSnapAlign: "start", background: "#111", border: `1px solid #2a2a2a` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[9px] font-black"
                  style={{ background: "#22c55e", color: "#fff", fontFamily: F }}>AKTIV</span>
                <button style={{ background:"none",border:"none",color:"#555",fontSize:18 }}>⋯</button>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${ORANGE}22` }}>
                <span style={{ color: ORANGE, fontSize: 22 }}>🏋️</span>
              </div>
              <p className="font-black text-base text-white mb-0.5" style={{ fontFamily: F }}>2er Split</p>
              <p className="text-xs text-gray-500 mb-3">4 Tage / Woche</p>
              <p className="text-[10px] text-gray-600 mb-0.5">Nächstes Workout</p>
              <p className="font-bold text-sm mb-0.5" style={{ color: ORANGE }}>{nextDay.label}</p>
              <p className="text-[10px] text-gray-600 mb-3">📅 Morgen · 18:00</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, background: "#2a2a2a" }}>
                  <div className="h-full rounded-full" style={{ width: `${progress}%`, background: ORANGE }} />
                </div>
                <span className="text-[10px] text-gray-500">{progress}%</span>
              </div>
            </div>
            {/* Add plan */}
            <button onClick={() => setShowCreate(true)}
              className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center gap-2"
              style={{ width: 140, scrollSnapAlign: "start", background: "#0d0d0d", border: "1px dashed #2a2a2a" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ background: "#1a1a1a", color: "#555" }}>+</div>
              <p className="font-black text-xs text-gray-600" style={{ fontFamily: F }}>Neuer Plan</p>
            </button>
          </div>
        )}

        {activeTab === "workouts" && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button onClick={() => setShowCreate(true)}
              className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center gap-2"
              style={{ width: 140, height: 170, background: "#0d0d0d", border: "1px dashed #2a2a2a" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ background: "#1a1a1a", color: "#555" }}>+</div>
              <p className="font-black text-xs text-gray-600" style={{ fontFamily: F }}>Neues Workout</p>
            </button>
          </div>
        )}
      </div>

      {/* ── NÄCHSTE WORKOUTS ── */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-black italic text-lg text-white" style={{ fontFamily: F }}>NÄCHSTE WORKOUTS</p>
          <button className="text-xs font-bold" style={{ color: ORANGE, background:"none", border:"none" }}>Alle anzeigen ›</button>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
          {nextWorkouts.map(({ day, label }, i) => (
            <button key={i} onClick={() => setActiveDay(day)}
              className="flex items-center gap-3 px-4 py-4 w-full text-left"
              style={{ background: "none", border: "none",
                borderBottom: i < 2 ? "1px solid #1a1a1a" : "none" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${day.color}18`, border: `1px solid ${day.color}33` }}>
                <span style={{ color: day.color, fontSize: 18 }}>{day.tag === "PUSH" ? "🏋️" : "💪"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-white" style={{ fontFamily: F }}>{day.label}</p>
                <p className="text-xs text-gray-500">2er Split · Push/Pull</p>
              </div>
              <div className="text-right flex-shrink-0 flex items-center gap-2">
                <div>
                  <p className="text-xs text-gray-500 text-right">📅 {label}</p>
                  <p className="text-xs font-bold text-right" style={{ color: ORANGE }}>18:00</p>
                </div>
                <span className="text-gray-600">›</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── TRAININGSTAGE ── */}
      <div className="px-4">
        <p className="font-black italic text-lg text-white mb-3" style={{ fontFamily: F }}>TRAININGSTAGE</p>
        <div className="flex flex-col gap-2">
          {PLAN_2ER_SPLIT.map((day, i) => {
            const setCount = day.exercises.reduce((a,e)=>a+e.sets.length,0);
            const isToday = i === (stats.totalWorkouts % 4);
            return (
              <button key={day.id} onClick={() => setActiveDay(day)}
                className="w-full text-left rounded-2xl overflow-hidden"
                style={{ background: "#111", border: `1px solid ${isToday ? day.color+"55" : "#1a1a1a"}`, padding: 0,
                  boxShadow: isToday ? `0 0 12px ${day.color}22` : "none" }}>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl flex-shrink-0"
                    style={{ background: `${day.color}18`, color: day.color, fontFamily: F, border: `1px solid ${day.color}33` }}>{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black"
                        style={{ background: day.color, color: "#fff", fontFamily: F }}>{day.tag}</span>
                      <p className="font-black text-base text-white" style={{ fontFamily: F }}>{day.label.toUpperCase()}</p>
                      {isToday && <span className="px-2 py-0.5 rounded text-[9px] font-black"
                        style={{ background: "#22c55e", color: "#fff", fontFamily: F }}>HEUTE</span>}
                    </div>
                    <p className="text-xs text-gray-600">{day.exercises.length} Übungen · {setCount} Sätze</p>
                    <p className="text-[10px] text-gray-700 mt-0.5 truncate">
                      {day.exercises.slice(0,3).map(e=>e.name).join(" · ")}{day.exercises.length>3?` · +${day.exercises.length-3}`:""}
                    </p>
                  </div>
                  <span className="text-gray-600 text-lg flex-shrink-0">›</span>
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
