import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AREA_DATA } from "../data/areaData";
import type { AreaName, AreaExercise } from "../types";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

// ── Helper maps ───────────────────────────────────────────────────────────────
const GYM_IMG: Record<string, string> = {
  BRUST: "/images/gym_brust.webp", RÜCKEN: "/images/gym_ruecken.webp",
  BEINE: "/images/gym_beine.webp", SCHULTERN: "/images/gym_schultern.webp",
  ARME: "/images/gym_arme.webp",  CORE: "/images/gym_core.webp",
  CARDIO: "/images/gym_cardio.webp", STRETCH: "/images/gym_stretch.webp",
};
const HERO_IMG: Record<string, string> = {
  BRUST: "/images/hero_BRUST.webp", RÜCKEN: "/images/hero_RUECKEN.webp",
  BEINE: "/images/hero_BEINE.webp", SCHULTERN: "/images/hero_SCHULTERN.webp",
  ARME: "/images/hero_ARME.webp",  CORE: "/images/hero_CORE.webp",
  CARDIO: "/images/hero_CARDIO.webp", STRETCH: "/images/hero_STRETCH.webp",
};
const COACH_IMG: Record<string, string> = {
  Rocko: "/images/coach_rocko.webp", Toro: "/images/coach_toro.webp",
  Olli: "/images/coach_olli.webp",   Rino: "/images/coach_rhino.webp",
  Tim: "/images/coach_tim.webp",     Leon: "/images/coach_leon.webp",
  Leya: "/images/coach_leya.webp",   Sen: "/images/coach_sen.webp",
};

function skillLabel(n: number | undefined) {
  if (!n) return null;
  if (n <= 2) return { label: "Einfach", color: "#22c55e" };
  if (n <= 3) return { label: "Mittel",  color: ORANGE };
  return { label: "Fortgeschritten", color: "#ef4444" };
}

// ── Exercise Detail Screen ────────────────────────────────────────────────────
function ExerciseDetail({ ex, area, areaKey, onBack }: {
  ex: AreaExercise;
  area: typeof AREA_DATA[AreaName];
  areaKey: string;
  onBack: () => void;
}) {
  const heroImg  = HERO_IMG[areaKey] ?? GYM_IMG[areaKey];
  const gymImg   = GYM_IMG[areaKey];
  const skill    = skillLabel(ex.skill);
  const equip    = Array.isArray(ex.equipment) ? ex.equipment.join(", ") : (ex.equipment ?? "–");

  type Section = "technik" | "fehler" | "atmung" | "tipps" | "muskeln";
  const [open, setOpen] = useState<Section[]>(["technik"]);
  function toggle(s: Section) {
    setOpen(o => o.includes(s) ? o.filter(x => x !== s) : [...o, s]);
  }

  const sections: { key: Section; label: string; icon: string; color: string; content: React.ReactNode }[] = [
    {
      key: "technik", label: "TECHNIK", icon: "✅", color: "#22c55e",
      content: (
        <div className="flex flex-col gap-2">
          {ex.cues?.map((c, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-[#22c55e] flex-shrink-0 mt-0.5">✅</span>
              <p className="text-sm text-gray-200 leading-relaxed">{c}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "fehler", label: "HÄUFIGE FEHLER", icon: "❌", color: "#ef4444",
      content: (
        <div className="flex flex-col gap-2">
          {ex.errors_technique?.map((e, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>
              <p className="text-sm text-gray-200">{e}</p>
            </div>
          ))}
          {ex.errors_safety?.map((e, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-red-500 flex-shrink-0 mt-0.5">⚠</span>
              <p className="text-sm text-gray-200">{e}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "atmung", label: "ATMUNG", icon: "🫁", color: "#3b82f6",
      content: ex.breathing ? (
        <div className="flex flex-col gap-2">
          {ex.breathing.split(/\.\s+/).filter(Boolean).map((s, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-blue-400 flex-shrink-0 mt-1">●</span>
              <p className="text-sm text-gray-200">{s.trim()}</p>
            </div>
          ))}
        </div>
      ) : <p className="text-sm text-gray-500">Rhythmisch und kontrolliert atmen.</p>,
    },
    {
      key: "tipps", label: `${area.coach.name.toUpperCase()}'S TIPPS`, icon: "🐾", color: ORANGE,
      content: (
        <div className="flex flex-col gap-2">
          {[ex.desc, ...(ex.cues?.slice(0,2) ?? [])].filter(Boolean).map((t, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="flex-shrink-0 mt-0.5" style={{ color: ORANGE }}>★</span>
              <p className="text-sm text-gray-200">{t}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "muskeln", label: "ZIELMUSKELN", icon: "🎯", color: "#a855f7",
      content: (
        <div className="flex flex-col gap-2">
          {[ex.primary, ...(ex.secondary?.split(" · ") ?? [])].filter(Boolean).map((m, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                style={{ background: i === 0 ? "#ef4444" : i === 1 ? "#22c55e" : "#a855f7" }} />
              <p className="text-sm text-gray-200">{m}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen pb-10" style={{ background: "#080808", color: "#fff" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 280 }}>
        <img src={heroImg ?? gymImg} alt={ex.name}
          className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.65) 50%, rgba(8,8,8,1) 100%)",
        }} />
        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-5">
          <button onClick={onBack}
            style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
          <button style={{ background: "none", border: "none", color: ORANGE, fontSize: 20 }}>🔖</button>
        </div>
        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden"
              style={{ border: `2px solid ${area.color}` }}>
              <img src="/images/paw.webp" alt="" className="w-full h-full object-contain p-1" />
            </div>
            <div>
              <p className="font-black italic text-3xl text-white leading-tight drop-shadow-lg"
                style={{ fontFamily: F }}>
                {ex.name.toUpperCase().split(" ").slice(0, -1).join(" ")}
              </p>
              <p className="font-black italic text-3xl leading-tight drop-shadow-lg"
                style={{ fontFamily: F, color: area.color }}>
                {ex.name.toUpperCase().split(" ").slice(-1)[0]}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-300">{ex.primary?.split(" (")[0]} · {ex.secondary?.split(" · ")[0]}</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden"
        style={{ background: "#111", border: "1px solid #1e1e1e" }}>
        <div className="grid grid-cols-4 divide-x" style={{ borderColor: "#1e1e1e" }}>
          {[
            {
              icon: "🎯", label: "ZIELMUSKEL",
              val: ex.primary?.split(" (")[0] ?? "–",
              sub: ex.primary?.match(/\(([^)]+)\)/)?.[1] ?? "",
            },
            {
              icon: "📊", label: "SCHWIERIGKEIT",
              val: skill?.label ?? "–",
              sub: "",
              color: skill?.color,
            },
            {
              icon: "⚙️", label: "EQUIPMENT",
              val: equip,
              sub: "",
            },
            {
              icon: "🔧", label: "TYP",
              val: ex.compound_isolation === "compound" ? "Grundübung" : "Isolationsübung",
              sub: ex.compound_isolation === "compound" ? "Grundübung" : "Isolation",
            },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center justify-start p-3 text-center"
              style={{ borderRight: i < 3 ? "1px solid #1e1e1e" : "none" }}>
              <span className="text-lg mb-1 text-gray-600">{s.icon}</span>
              <p className="text-[8px] text-gray-600 tracking-widest font-bold mb-1">{s.label}</p>
              <p className="font-black text-[11px] leading-tight" style={{ fontFamily: F, color: s.color ?? "#fff" }}>
                {s.val}
              </p>
              {s.sub && <p className="text-[9px] text-gray-500 mt-0.5">{s.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Accordion sections */}
      <div className="px-4 mt-4 flex flex-col gap-3">
        {sections.map(sec => {
          const isOpen = open.includes(sec.key);
          const hasContent = sec.key === "technik" ? (ex.cues?.length ?? 0) > 0
            : sec.key === "fehler" ? ((ex.errors_technique?.length ?? 0) + (ex.errors_safety?.length ?? 0)) > 0
            : sec.key === "atmung" ? !!ex.breathing
            : true;
          if (!hasContent) return null;
          return (
            <div key={sec.key} className="rounded-2xl overflow-hidden"
              style={{ background: "#111", border: `1px solid ${isOpen ? sec.color + "44" : "#1e1e1e"}` }}>
              <button className="w-full flex items-center justify-between px-4 py-4"
                style={{ background: "none", border: "none" }}
                onClick={() => toggle(sec.key)}>
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{sec.icon}</span>
                  <p className="font-black text-sm" style={{ fontFamily: F, color: sec.color }}>{sec.label}</p>
                </div>
                <span className="text-gray-500 text-lg">{isOpen ? "∧" : "∨"}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: "#1e1e1e" }}>
                  <div className="pt-3">{sec.content}</div>
                </div>
              )}
            </div>
          );
        })}

        {/* Safety note */}
        {ex.safety_note && (
          <div className="p-4 rounded-2xl" style={{ background: "#1a0a00", border: "1px solid #f9731633" }}>
            <div className="flex items-start gap-2.5">
              <span className="text-orange-400 flex-shrink-0 text-lg">⚠</span>
              <p className="text-sm text-orange-300 leading-relaxed">{ex.safety_note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main GymAreaScreen ────────────────────────────────────────────────────────
export function GymAreaScreen() {
  const { area: areaParam } = useParams<{ area: string }>();
  const navigate = useNavigate();

  const areaKey  = (areaParam ?? "BRUST") as AreaName;
  const area     = AREA_DATA[areaKey] ?? AREA_DATA["BRUST"];
  const heroImg  = HERO_IMG[areaKey];
  const gymImg   = GYM_IMG[areaKey];
  const coachImg = COACH_IMG[area.coach.name];

  const [selectedEx, setSelectedEx] = useState<AreaExercise | null>(null);
  const [search, setSearch]         = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("Alle");

  // Build filter categories from equipment
  const filterTabs = useMemo(() => {
    const cats = new Set<string>();
    area.exercises.forEach(ex => {
      if (Array.isArray(ex.equipment)) {
        ex.equipment.forEach(e => {
          if (e.toLowerCase().includes("langhantel")) cats.add("Langhantel");
          else if (e.toLowerCase().includes("kurzhantel") || e.toLowerCase().includes("hantel")) cats.add("Kurzhantel");
          else if (e.toLowerCase().includes("kabel")) cats.add("Kabelzug");
          else if (e.toLowerCase().includes("maschine")) cats.add("Maschine");
          else if (e.toLowerCase().includes("körper")) cats.add("Körpergewicht");
        });
      }
    });
    return ["Alle", ...Array.from(cats)];
  }, [area]);

  const filtered = useMemo(() => {
    return area.exercises.filter(ex => {
      const matchSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = activeFilter === "Alle" || (() => {
        if (!Array.isArray(ex.equipment)) return false;
        const equipStr = ex.equipment.join(" ").toLowerCase();
        if (activeFilter === "Langhantel") return equipStr.includes("langhantel");
        if (activeFilter === "Kurzhantel") return equipStr.includes("kurzhantel") || (equipStr.includes("hantel") && !equipStr.includes("langhantel"));
        if (activeFilter === "Kabelzug") return equipStr.includes("kabel");
        if (activeFilter === "Maschine") return equipStr.includes("maschine");
        if (activeFilter === "Körpergewicht") return equipStr.includes("körper");
        return true;
      })();
      return matchSearch && matchFilter;
    });
  }, [area, search, activeFilter]);

  if (selectedEx) {
    return <ExerciseDetail ex={selectedEx} area={area} areaKey={areaKey} onBack={() => setSelectedEx(null)} />;
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 300 }}>
        {/* Background: hero image */}
        <img src={heroImg ?? gymImg} alt={areaKey}
          className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(8,8,8,0.45) 0%, rgba(8,8,8,0.7) 55%, rgba(8,8,8,1) 100%)",
        }} />

        {/* Coach portrait – right side */}
        {coachImg && (
          <div className="absolute right-0 bottom-0 z-10" style={{ height: 260, width: 140 }}>
            <img src={coachImg} alt={area.coach.name}
              className="h-full w-full object-cover object-top"
              style={{ filter: "drop-shadow(-4px 0 12px rgba(0,0,0,0.8))" }} />
          </div>
        )}

        <div className="relative z-10 px-4 pt-5 pb-4" style={{ maxWidth: "calc(100% - 130px)" }}>
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm font-bold text-white"
              style={{ background: "none", border: "none" }}>
              ← ZURÜCK
            </button>
            <button style={{ background: "none", border: "none", color: ORANGE, fontSize: 20 }}>🔖</button>
          </div>

          {/* Area title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${area.color}22`, border: `2px solid ${area.color}`,
                boxShadow: `0 0 14px ${area.color}66` }}>
              <span style={{ fontSize: 22 }}>🏋️</span>
            </div>
            <div>
              <h1 className="font-black italic text-4xl text-white leading-none" style={{ fontFamily: F }}>
                {areaKey}
              </h1>
              <p className="text-[10px] text-gray-400 tracking-widest font-bold" style={{ fontFamily: F }}>
                ÜBUNGSBIBLIOTHEK
              </p>
            </div>
          </div>

          {/* Desc */}
          <p className="text-xs text-gray-300 leading-relaxed mb-4">{area.desc}</p>

          {/* Coach tip box */}
          <div className="rounded-2xl p-3"
            style={{ background: "rgba(0,0,0,0.78)", border: `1.5px solid ${area.color}`,
              backdropFilter: "blur(8px)" }}>
            <p className="font-black italic text-xs mb-1.5"
              style={{ fontFamily: F, color: area.color }}>
              {area.coach.name.toUpperCase()}'S TIPP
            </p>
            <p className="text-xs text-gray-200 leading-relaxed">{area.coach.tip}</p>
            <div className="flex justify-end mt-1.5">
              <span style={{ color: area.color }}>🐾</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="px-4 mt-3 mb-4">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
          style={{ background: "#111", border: "1px solid #1e1e1e" }}>
          <span className="text-gray-600 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Übung suchen..."
            className="flex-1 bg-transparent outline-none text-white text-sm"
            style={{ fontFamily: F }} />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ background: "none", border: "none", color: "#888", fontSize: 16 }}>✕</button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {filterTabs.map(tab => (
            <button key={tab} onClick={() => setActiveFilter(tab)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full font-black text-xs"
              style={{
                fontFamily: F,
                background: activeFilter === tab ? area.color : "#111",
                color: activeFilter === tab ? "#fff" : "#888",
                border: `1px solid ${activeFilter === tab ? area.color : "#2a2a2a"}`,
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── EXERCISE LIST ── */}
      <div className="px-4">
        <p className="text-xs text-gray-600 mb-3">
          {filtered.length} Übung{filtered.length !== 1 ? "en" : ""}
          {activeFilter !== "Alle" ? ` · ${activeFilter}` : ""}
        </p>

        <div className="flex flex-col gap-3">
          {filtered.map((ex, i) => {
            const skill = skillLabel(ex.skill);
            const equip = Array.isArray(ex.equipment)
              ? ex.equipment[0] ?? "–"
              : (ex.equipment ?? "–");

            return (
              <button key={i} onClick={() => setSelectedEx(ex)}
                className="w-full text-left rounded-2xl overflow-hidden"
                style={{ background: "#111", border: "1px solid #1e1e1e", padding: 0 }}>
                <div className="flex items-center gap-0">
                  {/* Image / placeholder */}
                  <div className="relative flex-shrink-0" style={{ width: 110, height: 100 }}>
                    <img src={gymImg} alt={ex.name}
                      className="w-full h-full object-cover"
                      style={{ opacity: 0.65 }} />
                    <div className="absolute inset-0" style={{
                      background: "linear-gradient(to right, transparent 60%, #111 100%)",
                    }} />
                    {/* Number badge */}
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs"
                      style={{ background: area.color, color: "#fff", fontFamily: F }}>
                      {ex.num}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 px-3 py-3 min-w-0">
                    <p className="font-black text-base text-white leading-tight mb-0.5 truncate"
                      style={{ fontFamily: F }}>
                      {ex.name.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mb-2 truncate">{ex.sub}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {ex.goal && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black"
                          style={{ background: `${area.color}22`, color: area.color, fontFamily: F }}>
                          {ex.goal.split(" · ")[0]}
                        </span>
                      )}
                      {skill && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black"
                          style={{ background: `${skill.color}18`, color: skill.color }}>
                          📊 {skill.label}
                        </span>
                      )}
                      {equip && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black"
                          style={{ background: "#1e1e1e", color: "#888" }}>
                          ⚙️ {equip}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pr-3 flex-shrink-0">
                    <span style={{ color: area.color, fontSize: 18 }}>›</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-sm">Keine Übungen gefunden.</p>
            <button onClick={() => { setSearch(""); setActiveFilter("Alle"); }}
              className="text-xs font-bold mt-2"
              style={{ color: area.color, background: "none", border: "none" }}>
              Filter zurücksetzen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
