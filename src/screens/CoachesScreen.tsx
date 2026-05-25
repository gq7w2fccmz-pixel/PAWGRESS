import { useState } from "react";
import { ACTIVE_COACHES, LOCKED_COACHES } from "../data/plans";
import { useCoachStore } from "../stores/coachStore";
import { useStatsStore }  from "../stores/statsStore";
import { saveCoaches }    from "../lib/syncService";

const F        = "'Barlow Condensed', sans-serif";
const ORANGE   = "#f97316";
const COPPER   = "#cd7f32";
const COPPER_L = "#e8a050";
const COPPER_G = "rgba(180,100,20,0.22)";
const SURF     = "#131008";
const SURF2    = "#1a1610";
const BORDER   = "rgba(205,127,50,0.18)";

function getFocusIcon(focus: string) {
  const map: Record<string, string> = {
    Arme: "💪", Rücken: "🏋️", Allround: "🐾",
    Cardio: "❤️", Ausdauer: "📈", Motivation: "⚡",
  };
  return map[focus] ?? "⭐";
}

export function CoachesScreen() {
  const selectedCoach  = useCoachStore(s => s.selectedCoach);
  const coachProgress  = useCoachStore(s => s.coachProgress);
  const isCoachUnlocked = useCoachStore(s => s.isCoachUnlocked);
  const getCoachProgressBase = useCoachStore(s => s.getCoachProgress);
  const setCoachBase   = useCoachStore(s => s.setCoach);
  const totalWorkouts  = useStatsStore(s => s.stats.totalWorkouts);
  const [selected, setSelected] = useState<string>(selectedCoach ?? "Bertl");

  // Override-Logik für totalWorkouts-basierte Coaches (Pam, Otto, Wolfi)
  function getCoachProgress(name: string) {
    const overrides: Record<string, { current: number; max: number }> = {
      Pam:  { current: Math.min(totalWorkouts, 1),  max: 1  },
      Otto: { current: Math.min(totalWorkouts, 20), max: 20 },
      Wolfi:{ current: Math.min(totalWorkouts, 40), max: 40 },
    };
    return overrides[name] ?? getCoachProgressBase(name);
  }

  async function handleSelect(name: string) {
    setSelected(name);
    setCoachBase(name);
    await saveCoaches(name, coachProgress);
  }

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

      {/* Active Coaches – 2-column grid */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-6">
        {[...ACTIVE_COACHES, ...unlockedLocked].map(coach => {
          const isSelected = selected === coach.name;
          const isDefault = coach.name === "Bertl" || coach.name === "Lilly";
          const isNew = unlockedLocked.some(c => c.name === coach.name);
          return (
            <div
              key={coach.name}
              onClick={() => handleSelect(coach.name)}
              className="rounded-2xl overflow-hidden cursor-pointer relative"
              style={{
                border: `2px solid ${isSelected ? coach.color : "#2a2a2a"}`,
                background: isSelected ? `${coach.color}18` : "#161616",
                boxShadow: isSelected ? `0 0 20px ${coach.color}55` : "none",
                transition: "all 0.2s",
              }}
            >
              {/* Portrait */}
              <div className="relative overflow-hidden" style={{ height: 180 }}>
                {coach.heroImage && (
                  <img src={coach.heroImage} alt={coach.name}
                    className="w-full h-full object-cover object-top"
                    style={{ filter: isSelected ? "brightness(1)" : "brightness(0.85)" }} />
                )}
                <div className="absolute inset-0" style={{
                  background: "linear-gradient(to top, #161616 0%, rgba(0,0,0,0) 50%)",
                }} />
                {/* Badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black"
                  style={{
                    background: isSelected ? coach.color : isNew ? "#16a34a" : "#1a1a1a",
                    color: "#fff",
                    fontFamily: F,
                    border: isSelected ? "none" : isNew ? "none" : "1px solid #f97316",
                    ...((!isSelected && !isNew) ? { color: "#f97316" } : {}),
                  }}>
                  {isSelected ? "AKTIV" : isNew ? "NEU" : "STANDARD"}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="font-black text-lg leading-none" style={{ fontFamily: F, color: coach.color }}>
                  {coach.name.toUpperCase()}
                </p>
                <p className="text-[10px] font-bold text-white/60 tracking-wider uppercase mt-0.5">
                  {coach.title}
                </p>
                {coach.desc && (
                  <p className="text-[10px] text-gray-400 leading-relaxed mt-1 mb-1.5 line-clamp-2">
                    {coach.desc}
                  </p>
                )}
                {coach.focus && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{getFocusIcon(coach.focus ?? "")}</span>
                    <span className="text-[10px] font-semibold" style={{ color: coach.color }}>
                      {coach.focus}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Locked Coaches */}
      <div className="px-4">
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
                style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: "1px solid #333" }}>
                {/* Portrait – clearly darkened */}
                <div className="relative overflow-hidden" style={{ height: 140 }}>
                  {coach.heroImage && (
                    <img src={coach.heroImage} alt={coach.name}
                      className="w-full h-full object-cover object-top"
                      style={{ filter: "brightness(0.28) grayscale(0.6) contrast(0.8)" }} />
                  )}
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(to top, #111 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.3) 100%)",
                  }} />
                  {/* Lock icon centered */}
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: `rgba(13,10,8,0.92)`, border: "1px solid #555" }}>
                    <span style={{ fontSize: 13 }}>🔒</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="font-black text-base leading-none" style={{ fontFamily: F, color: coach.color }}>
                    {coach.name.toUpperCase()}
                  </p>
                  <p className="text-[9px] font-bold text-white/40 tracking-wider uppercase mt-0.5">
                    {coach.title}
                  </p>
                  <div className="mt-2 mb-1.5">
                    <span className="font-black text-xs" style={{ color: coach.color, fontFamily: F }}>
                      {coach.req}
                    </span>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{coach.sub}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 rounded-full" style={{ height: 4, background: "#2a2a2a" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: coach.color }} />
                    </div>
                    <span className="text-[9px] text-gray-500 flex-shrink-0">
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
