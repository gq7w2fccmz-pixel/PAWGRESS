import { useState, type ReactNode, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AREA_DATA } from "../data/areaData";
import type { AreaName, AreaExercise } from "../types";
import { F, ORANGE, COPPER, COPPER_L, COPPER_G, SURF, SURF2, BORDER, CARD, CARD2, BORDER2, GREEN, RED, BG } from "../styles/tokens";


const GYM_IMG: Record<string, string> = {
  BRUST: "/images/gym_brust.webp", RUECKEN: "/images/gym_ruecken.webp",
  BEINE: "/images/gym_beine.webp", SCHULTERN: "/images/gym_schultern.webp",
  ARME: "/images/gym_arme.webp",  CORE: "/images/gym_core.webp",
  CARDIO: "/images/gym_cardio.webp", STRETCH: "/images/gym_stretch.webp",
};
const HERO_IMG: Record<string, string> = {
  BRUST: "/images/hero_BRUST.webp", RUECKEN: "/images/hero_RUECKEN.webp",
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

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function IconMuscle({ color = "#888" }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4 C10 4 7 7 7 11 C7 14 9 16 11 17 L11 22 C11 23 12 24 14 24 C16 24 17 23 17 22 L17 17 C19 16 21 14 21 11 C21 7 18 4 14 4Z"
        fill={color} opacity="0.9"/>
      <path d="M10 10 C10 8 12 7 14 7 C16 7 18 8 18 10" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
function IconBars({ color = "#888" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="14" width="4" height="7" rx="1" fill={color} opacity="0.4"/>
      <rect x="10" y="9" width="4" height="12" rx="1" fill={color} opacity="0.7"/>
      <rect x="17" y="4" width="4" height="17" rx="1" fill={color}/>
    </svg>
  );
}
function IconDumbbell({ color = "#888", size = 24 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="10" width="3" height="4" rx="1" fill={color}/>
      <rect x="4" y="8" width="2" height="8" rx="1" fill={color}/>
      <rect x="6" y="11" width="12" height="2" rx="1" fill={color}/>
      <rect x="18" y="8" width="2" height="8" rx="1" fill={color}/>
      <rect x="20" y="10" width="3" height="4" rx="1" fill={color}/>
    </svg>
  );
}
function IconWrench({ color = "#888" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconCheckCircle({ color = "#22c55e" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M6.5 10.5L9 13L13.5 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconXCircle({ color = "#ef4444" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="8" stroke={color} strokeWidth="1.5"/>
      <path d="M6 6L12 12M12 6L6 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconLungs({ color = "#3b82f6" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 3 L11 11" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 11 C8 11 4 13 4 17 C4 19 5.5 20 7 20 C8.5 20 9 18 9 17 L9 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M11 11 C14 11 18 13 18 17 C18 19 16.5 20 15 20 C13.5 20 13 18 13 17 L13 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="11" cy="3" r="1.5" fill={color}/>
    </svg>
  );
}
function IconPaw({ color = "#f97316" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <ellipse cx="11" cy="13" rx="5" ry="4.5" fill={color}/>
      <ellipse cx="5.5" cy="10" rx="2" ry="2.8" fill={color}/>
      <ellipse cx="16.5" cy="10" rx="2" ry="2.8" fill={color}/>
      <ellipse cx="8" cy="6.5" rx="1.6" ry="2.2" fill={color}/>
      <ellipse cx="14" cy="6.5" rx="1.6" ry="2.2" fill={color}/>
    </svg>
  );
}
function IconTarget({ color = "#a855f7" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="5.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="2" fill={color}/>
    </svg>
  );
}
function IconBookmark({ color = "#f97316" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5 3 H17 A1 1 0 0 1 18 4 V20 L11 16 L4 20 V4 A1 1 0 0 1 5 3 Z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
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

  // Parse breathing into sentences
  const breathingSentences = ex.breathing
    ? ex.breathing.split(/\.\s+/).map(s => s.trim()).filter(Boolean).map(s => s.endsWith(".") ? s : s + ".")
    : [];

  // Coach tips content
  const coachTips = [ex.desc, ...(ex.cues?.slice(0, 2) ?? [])].filter(Boolean);

  // Muscle list
  const muscles = [ex.primary, ...(ex.secondary?.split(" · ") ?? [])].filter(Boolean);
  const muscleColors = ["#ef4444", "#22c55e", "#a855f7", "#3b82f6", "#f97316"];

  const sections: { key: Section; label: string; icon: ReactNode; color: string; content: ReactNode; hasContent: boolean }[] = [
    {
      key: "technik", label: "TECHNIK", color: "#22c55e",
      icon: <IconCheckCircle color="#22c55e" />,
      hasContent: (ex.cues?.length ?? 0) > 0,
      content: (
        <div className="flex flex-col gap-3 pt-1">
          {ex.cues?.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <IconCheckCircle color="#22c55e" />
              <p className="text-sm text-gray-200 leading-relaxed">{c}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "fehler", label: "HÄUFIGE FEHLER", color: "#ef4444",
      icon: <IconXCircle color="#ef4444" />,
      hasContent: ((ex.errors_technique?.length ?? 0) + (ex.errors_safety?.length ?? 0)) > 0,
      content: (
        <div className="flex flex-col gap-3 pt-1">
          {ex.errors_technique?.map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <IconXCircle color="#ef4444" />
              <p className="text-sm text-gray-200">{e}</p>
            </div>
          ))}
          {ex.errors_safety?.map((e, i) => (
            <div key={`s${i}`} className="flex items-start gap-3">
              <IconXCircle color="#f97316" />
              <p className="text-sm text-gray-200">{e}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "atmung", label: "ATMUNG", color: "#3b82f6",
      icon: <IconLungs color="#3b82f6" />,
      hasContent: !!ex.breathing,
      content: (
        <div className="flex flex-col gap-3 pt-1">
          {breathingSentences.length > 0
            ? breathingSentences.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "#3b82f6" }} />
                <p className="text-sm text-gray-200">{s}</p>
              </div>
            ))
            : <p className="text-sm text-gray-500 pt-1">Rhythmisch und kontrolliert atmen.</p>
          }
        </div>
      ),
    },
    {
      key: "tipps", label: `${area.coach.name.toUpperCase()}'S TIPPS`, color: ORANGE,
      icon: <IconPaw color={COPPER_L} />,
      hasContent: coachTips.length > 0,
      content: (
        <div className="flex flex-col gap-3 pt-1">
          {coachTips.map((t, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-0.5" style={{ color: ORANGE, fontSize: 16 }}>★</span>
              <p className="text-sm text-gray-200">{t}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "muskeln", label: "ZIELMUSKELN", color: "#a855f7",
      icon: <IconTarget color="#a855f7" />,
      hasContent: muscles.length > 0,
      content: (
        <div className="flex flex-col gap-3 pt-1">
          {muscles.map((m, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                style={{ background: muscleColors[i] ?? "#888" }} />
              <p className="text-sm text-gray-200">{m}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  // Split exercise name for two-line hero title
  const nameParts = ex.name.trim().split(" ");
  const titleFirstLine = nameParts.slice(0, Math.max(1, Math.ceil(nameParts.length / 2))).join(" ");
  const titleSecondLine = nameParts.slice(Math.max(1, Math.ceil(nameParts.length / 2))).join(" ");

  return (
    <div className="min-h-screen pb-32" style={{ background: "#080808", color: "#fff" }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: 260 }}>
        <img src={heroImg ?? gymImg} alt={ex.name}
          className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(8,8,8,0.25) 0%, rgba(8,8,8,0.6) 50%, rgba(8,8,8,1) 100%)",
        }} />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-4 pt-12">
          <button onClick={onBack}
            style={{ background: "none", border: "none", color: "#fff", fontSize: 22, lineHeight: 1 }}>
            ←
          </button>
          <button style={{ background: "none", border: "none" }}>
            <IconBookmark color={COPPER_L} />
          </button>
        </div>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <p className="font-black italic leading-none text-white"
                style={{ fontFamily: F, fontSize: 30, lineHeight: 1.05 }}>
                {titleFirstLine.toUpperCase()}
              </p>
              {titleSecondLine && (
                <p className="font-black italic leading-none"
                  style={{ fontFamily: F, fontSize: 30, lineHeight: 1.05, color: area.color }}>
                  {titleSecondLine.toUpperCase()}
                </p>
              )}
            </div>
          </div>
          {/* Muscle subtitle */}
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
            {[ex.primary?.split(" (")[0], ex.secondary?.split(" · ")[0]].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
        <div className="grid grid-cols-4">
          {[
            {
              iconEl: <IconMuscle color={area.color} />,
              label: "ZIELMUSKEL",
              val: ex.primary?.split(" (")[0] ?? "–",
              sub: ex.primary?.match(/\(([^)]+)\)/)?.[1] ?? "",
              valColor: "#fff",
            },
            {
              iconEl: <IconBars color={skill?.color ?? "#888"} />,
              label: "SCHWIERIGKEIT",
              val: skill?.label ?? "–",
              sub: "",
              valColor: skill?.color ?? "#fff",
            },
            {
              iconEl: <IconDumbbell color="#888" />,
              label: "EQUIPMENT",
              val: equip,
              sub: "",
              valColor: "#fff",
            },
            {
              iconEl: <IconWrench color="#888" />,
              label: "TYP",
              val: ex.compound_isolation === "compound" ? "Kraftübung" : "Isolationsübung",
              sub: ex.compound_isolation === "compound" ? "Grundübung" : "Isolation",
              valColor: "#fff",
            },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center justify-start p-3 text-center"
              style={{ borderRight: i < 3 ? "1px solid #1e1e1e" : "none" }}>
              <div className="mb-1.5 flex items-center justify-center" style={{ height: 32 }}>
                {s.iconEl}
              </div>
              <p className="text-[8px] text-gray-600 tracking-widest font-bold mb-1 uppercase">{s.label}</p>
              <p className="font-black text-[11px] leading-tight" style={{ fontFamily: F, color: s.valColor }}>
                {s.val}
              </p>
              {s.sub && <p className="text-[9px] text-gray-500 mt-0.5">{s.sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* ── ACCORDION SECTIONS ── */}
      <div className="px-4 mt-4 flex flex-col gap-3">
        {sections.map(sec => {
          if (!sec.hasContent) return null;
          const isOpen = open.includes(sec.key);
          return (
            <div key={sec.key} className="rounded-2xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${isOpen ? sec.color + "44" : "#1e1e1e"}` }}>
              <button className="w-full flex items-center justify-between px-4 py-4"
                style={{ background: "none", border: "none" }}
                onClick={() => toggle(sec.key)}>
                <div className="flex items-center gap-3">
                  {sec.icon}
                  <p className="font-black text-sm" style={{ fontFamily: F, color: sec.color }}>{sec.label}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d={isOpen ? "M3 10L8 5L13 10" : "M3 6L8 11L13 6"}
                    stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: `${BORDER}` }}>
                  {sec.content}
                </div>
              )}
            </div>
          );
        })}

        {/* Safety note */}
        {ex.safety_note && (
          <div className="p-4 rounded-2xl" style={{ background: "#1a0a00", border: "1px solid #f9731633" }}>
            <div className="flex items-start gap-3">
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

  // Scroll to top whenever the view changes (list ↔ detail)
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [selectedEx]);

  function openExercise(ex: AreaExercise) { setSelectedEx(ex); }
  function closeExercise() { setSelectedEx(null); }
  const [search, setSearch]         = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("Alle");

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
    return <ExerciseDetail ex={selectedEx} area={area} areaKey={areaKey} onBack={closeExercise} />;
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 300 }}>
        <img src={heroImg ?? gymImg} alt={areaKey}
          className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(8,8,8,0.45) 0%, rgba(8,8,8,0.7) 55%, rgba(8,8,8,1) 100%)",
        }} />

        <div className="relative z-10 px-4 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm font-bold text-white"
              style={{ background: "none", border: "none" }}>
              ← ZURÜCK
            </button>
            <div style={{ width: 28 }} />
          </div>

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

          <p className="text-xs text-gray-300 leading-relaxed mb-4">{area.desc}</p>

          <div className="rounded-2xl p-3"
            style={{ background: "rgba(0,0,0,0.78)", border: `1.5px solid ${area.color}`,
              backdropFilter: "blur(8px)" }}>
            <p className="font-black italic text-xs mb-1.5"
              style={{ fontFamily: F, color: area.color }}>
              {area.coach.name.toUpperCase()}'S TIPP
            </p>
            <p className="text-xs text-gray-200 leading-relaxed">{area.coach.tip}</p>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="px-4 mt-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
          style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
          <span className="text-gray-600 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Übung suchen..."
            className="flex-1 bg-transparent outline-none text-white text-sm"
            style={{ fontFamily: F }} />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ background: "none", border: "none", color: COPPER, fontSize: 16 }}>✕</button>
          )}
        </div>

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
              <button key={i} onClick={() => openExercise(ex)}
                className="w-full text-left rounded-2xl overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}`, padding: 0 }}>
                <div className="flex items-center gap-0">
                  <div className="relative flex-shrink-0" style={{ width: 110, height: 100 }}>
                    <img src={gymImg} alt={ex.name}
                      className="w-full h-full object-cover"
                      style={{ opacity: 0.65 }} />
                    <div className="absolute inset-0" style={{
                      background: "linear-gradient(to right, transparent 60%, #111 100%)",
                    }} />
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs"
                      style={{ background: area.color, color: "#fff", fontFamily: F }}>
                      {ex.num}
                    </div>
                  </div>

                  <div className="flex-1 px-3 py-3 min-w-0">
                    <p className="font-black text-base text-white leading-tight mb-0.5 truncate"
                      style={{ fontFamily: F }}>
                      {ex.name.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mb-2 truncate">{ex.sub}</p>

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
                          <span style={{ fontSize: 10 }}>▐▐▐</span> {skill.label}
                        </span>
                      )}
                      {equip && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black"
                          style={{ background: "#1e1e1e", color: COPPER }}>
                          <span style={{ fontSize: 10 }}>⊣⊢</span> {equip}
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
