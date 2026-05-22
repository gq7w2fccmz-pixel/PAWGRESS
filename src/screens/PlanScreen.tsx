import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PLAN_2ER_SPLIT, type PlanDay } from "../data/plan_2er_split";

const F = "'Barlow Condensed', sans-serif";

// ── Day Detail Screen ─────────────────────────────────────────────────────
function DayScreen({ day, onBack }: { day: PlanDay; onBack: () => void }) {
  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a", color: "#fff" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 sticky top-0 z-10"
        style={{ background: "#0a0a0a", borderBottom: "1px solid #2a2a2a" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black"
              style={{ background: day.color, color: "#fff", fontFamily: F }}>{day.tag}</span>
            <h2 className="font-black italic text-2xl text-white" style={{ fontFamily: F }}>{day.label.toUpperCase()}</h2>
          </div>
          <p className="text-xs text-gray-500">{day.exercises.length} Übungen · {day.exercises.reduce((a,e) => a + e.sets.length, 0)} Sätze gesamt</p>
        </div>
      </div>

      {/* Exercise List */}
      <div className="px-4 pt-4 flex flex-col gap-3">
        {day.exercises.map((ex, i) => {
          // Group sets by reps for display: e.g. "1×6 · 1×8" or "3×8"
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
              {/* Number */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm"
                style={{ background: `${day.color}22`, color: day.color, fontFamily: F }}>
                {i + 1}
              </div>
              {/* Info */}
              <div className="flex-1">
                <p className="font-black text-sm text-white leading-tight" style={{ fontFamily: F }}>{ex.name}</p>
                <p className="text-xs mt-0.5" style={{ color: day.color }}>{setsLabel}</p>
              </div>
              {/* Set dots */}
              <div className="flex gap-1 flex-shrink-0">
                {ex.sets.map((_, si) => (
                  <div key={si} className="w-2 h-2 rounded-full" style={{ background: "#2a2a2a" }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Start Button */}
      <div className="px-4 mt-6">
        <button className="w-full py-4 rounded-2xl font-black text-lg text-white"
          style={{ background: day.color, fontFamily: F }}>
          {day.label.toUpperCase()} STARTEN ›
        </button>
      </div>
    </div>
  );
}

// ── Main Plan Screen ──────────────────────────────────────────────────────
export function PlanScreen() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState<PlanDay | null>(null);

  if (activeDay) return <DayScreen day={activeDay} onBack={() => setActiveDay(null)} />;

  const totalSets = PLAN_2ER_SPLIT.reduce((a, d) => a + d.exercises.reduce((b, e) => b + e.sets.length, 0), 0);
  const totalEx   = PLAN_2ER_SPLIT.reduce((a, d) => a + d.exercises.length, 0);

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ minHeight: 160 }}>
        <img src="/images/plan_hero.webp" alt="Plan"
          className="absolute inset-0 w-full h-full object-cover object-right" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(10,10,10,0.97) 45%, rgba(10,10,10,0.3))" }} />
        <div className="relative z-10 p-5 pt-6">
          <p className="font-black italic text-sm text-white/70 tracking-widest mb-0.5" style={{ fontFamily: F }}>DEIN TRAININGSPLAN</p>
          <h1 className="font-black italic text-4xl text-white leading-none mb-1" style={{ fontFamily: F }}>2er SPLIT</h1>
          <p className="text-sm text-white/55 mb-4">Push · Pull · 4 Tage pro Woche</p>
          <div className="flex gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black" style={{ background: "#f9731622", color: "#f97316", border: "1px solid #f97316", fontFamily: F }}>
              {totalEx} ÜBUNGEN
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black" style={{ background: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f6", fontFamily: F }}>
              {totalSets} SÄTZE
            </span>
          </div>
        </div>
      </div>

      {/* Plan Info Card */}
      <div className="px-4 mt-4 mb-5">
        <div className="rounded-2xl p-4" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-black text-base text-white" style={{ fontFamily: F }}>2er Split · Push/Pull</p>
              <p className="text-xs text-gray-500 mt-0.5">Muskelaufbau · Alle Level</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black" style={{ background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e", fontFamily: F }}>AKTIV</span>
          </div>
          <div className="flex gap-4 mt-3">
            {[["📅","4 Tage/Woche"],["🔄","A/B Rotation"],["⏱","~60 Min"]].map(([icon,label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-base">{icon}</span>
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day Cards */}
      <div className="px-4">
        <h2 className="font-black italic text-base text-white mb-3" style={{ fontFamily: F }}>TRAININGSTAGE</h2>
        <div className="flex flex-col gap-3">
          {PLAN_2ER_SPLIT.map((day, i) => {
            const exCount = day.exercises.length;
            const setCount = day.exercises.reduce((a, e) => a + e.sets.length, 0);
            return (
              <button key={day.id} onClick={() => setActiveDay(day)}
                className="w-full text-left rounded-2xl overflow-hidden"
                style={{ background: "#161616", border: `1px solid ${day.color}44`, padding: 0 }}>
                <div className="flex items-center gap-4 p-4">
                  {/* Day number */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xl"
                    style={{ background: `${day.color}22`, color: day.color, fontFamily: F }}>
                    {i + 1}
                  </div>
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black"
                        style={{ background: day.color, color: "#fff", fontFamily: F }}>{day.tag}</span>
                      <p className="font-black text-lg text-white leading-none" style={{ fontFamily: F }}>{day.label.toUpperCase()}</p>
                    </div>
                    <p className="text-xs text-gray-500">{exCount} Übungen · {setCount} Sätze</p>
                    {/* Exercise preview */}
                    <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                      {day.exercises.slice(0, 3).map(e => e.name).join(" · ")}{exCount > 3 ? ` · +${exCount - 3}` : ""}
                    </p>
                  </div>
                  <span className="text-gray-600 text-xl flex-shrink-0">›</span>
                </div>
                {/* Color bar bottom */}
                <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${day.color}, transparent)` }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
