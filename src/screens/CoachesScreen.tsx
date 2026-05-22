import { useState } from "react";
import { ACTIVE_COACHES, LOCKED_COACHES } from "../data/plans";
import { usePawgressStore } from "../hooks/usePawgressStore";

const F = "'Barlow Condensed', sans-serif";

function getFocusIcon(focus: string) {
  const map: Record<string, string> = {
    Arme: "💪", Rücken: "🏋️", Allround: "🐾",
    Cardio: "❤️", Ausdauer: "📈", Motivation: "⚡",
  };
  return map[focus] ?? "⭐";
}

export function CoachesScreen() {
  const { selectedCoach, setCoach, isCoachUnlocked, getCoachProgress } = usePawgressStore();
  const [selected, setSelected] = useState<string>(selectedCoach ?? "Bertl");

  function handleSelect(name: string) {
    setSelected(name);
    setCoach(name);
  }

  // All active coaches are always unlocked
  const activeCoaches = ACTIVE_COACHES;
  // Separate locked into unlocked (but not in active list) and still locked
  const unlockedLocked = LOCKED_COACHES.filter(c => isCoachUnlocked(c.name));
  const stillLocked    = LOCKED_COACHES.filter(c => !isCoachUnlocked(c.name));

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="font-black italic text-4xl text-white leading-none" style={{ fontFamily: F }}>
          WÄHLE DEINEN COACH
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Jeder Coach hat seinen eigenen Fokus. Finde den, der zu deinem Ziel passt.
        </p>
      </div>

      {/* Active + newly unlocked coaches – horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-2" style={{ scrollSnapType: "x mandatory" }}>
        {[...activeCoaches, ...unlockedLocked].map(coach => {
          const isSelected = selected === coach.name;
          const isDefault = coach.name === "Bertl" || coach.name === "Lilly";
          return (
            <div
              key={coach.name}
              onClick={() => handleSelect(coach.name)}
              className="rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer relative"
              style={{
                width: 200,
                scrollSnapAlign: "start",
                border: `2px solid ${isSelected ? coach.color : "#2a2a2a"}`,
                background: isSelected ? `${coach.color}18` : "#161616",
                boxShadow: isSelected ? `0 0 20px ${coach.color}44` : "none",
                transition: "all 0.2s",
              }}
            >
              <div className="relative h-44 overflow-hidden">
                {coach.heroImage && (
                  <img src={coach.heroImage} alt={coach.name}
                    className="w-full h-full object-cover object-center"
                    style={{ filter: isSelected ? "brightness(1)" : "brightness(0.7)" }}
                  />
                )}
                <div className="absolute inset-0" style={{
                  background: "linear-gradient(to top, #161616 0%, rgba(0,0,0,0.1) 60%)",
                }} />
                {isSelected && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black"
                    style={{ background: coach.color, color: "#fff", fontFamily: F }}>
                    AKTIV
                  </div>
                )}
                {!isSelected && isDefault && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black"
                    style={{ background: "#2a2a2a", color: "#f97316", fontFamily: F, border: "1px solid #f97316" }}>
                    STANDARD
                  </div>
                )}
                {!isSelected && !isDefault && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black"
                    style={{ background: "#16a34a22", color: "#4ade80", fontFamily: F, border: "1px solid #4ade80" }}>
                    NEU
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-black text-xl leading-none" style={{ fontFamily: F, color: coach.color }}>
                  {coach.name.toUpperCase()}
                </p>
                <p className="text-[10px] font-bold text-white/70 tracking-wider uppercase mt-0.5">
                  {coach.title}
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-1.5 mb-2">
                  {coach.desc ?? ""}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{getFocusIcon(coach.focus ?? "")}</span>
                  <span className="text-[11px] font-semibold" style={{ color: coach.color }}>
                    Fokus: {coach.focus ?? ""}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Locked Coaches */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">🔒</span>
          <h2 className="font-black italic text-xl text-white" style={{ fontFamily: F }}>
            COACHES FREISCHALTEN
          </h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Schließe Herausforderungen ab, um weitere Coaches freizuschalten.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {stillLocked.map(coach => {
            const prog = getCoachProgress(coach.name);
            const pct = Math.min((prog.current / prog.max) * 100, 100);
            return (
              <div key={coach.name} className="rounded-2xl overflow-hidden relative"
                style={{ background: "#161616", border: "1px solid #2a2a2a", opacity: 0.85 }}>
                <div className="relative h-28 overflow-hidden">
                  {coach.heroImage && (
                    <img src={coach.heroImage} alt={coach.name}
                      className="w-full h-full object-cover object-center"
                      style={{ filter: "brightness(0.35) grayscale(0.5)" }}
                    />
                  )}
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(to top, #161616 0%, rgba(0,0,0,0.2) 70%)",
                  }} />
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.7)", border: "1px solid #444" }}>
                    <span style={{ fontSize: 11 }}>🔒</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-black text-base leading-none" style={{ fontFamily: F, color: coach.color }}>
                    {coach.name.toUpperCase()}
                  </p>
                  <p className="text-[9px] font-bold text-white/50 tracking-wider uppercase mt-0.5">
                    {coach.title}
                  </p>
                  <div className="mt-2 mb-1">
                    <span className="font-black text-sm" style={{ color: coach.color, fontFamily: F }}>
                      {coach.req}
                    </span>
                    <p className="text-[10px] text-gray-500 leading-tight">{coach.sub}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 rounded-full" style={{ height: 3, background: "#2a2a2a" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: coach.color }} />
                    </div>
                    <span className="text-[9px] text-gray-600 flex-shrink-0">
                      {prog.current} / {prog.max}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
