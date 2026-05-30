/**
 * ExerciseDetailScreen – 3 Tabs: Fortschritt · Verlauf · Anweisungen
 */
import { useState, useEffect } from "react";
import { useHistoryStore } from "../stores/historyStore";
import type { AreaExercise } from "../types";
import { F, ORANGE, COPPER, COPPER_L, SURF, SURF2, BORDER } from "../styles/tokens";

// ── Exercise data loader ───────────────────────────────────────────────────────
const tipCache = new Map<string, AreaExercise | undefined>();
async function loadExercise(name: string): Promise<AreaExercise | undefined> {
  if (tipCache.has(name)) return tipCache.get(name);
  const lower = name.toLowerCase();
  const mods = [
    () => import("../data/exercises_brust").then(m => m.BRUST_EXERCISES),
    () => import("../data/exercises_ruecken").then(m => m.RUECKEN_EXERCISES),
    () => import("../data/exercises_schultern").then(m => m.SCHULTERN_EXERCISES),
    () => import("../data/exercises_arme").then(m => m.ARME_EXERCISES),
    () => import("../data/exercises_beine").then(m => m.BEINE_EXERCISES),
    () => import("../data/exercises_core").then(m => m.CORE_EXERCISES),
  ];
  for (const load of mods) {
    const exs = await load();
    const found = exs.find((e: AreaExercise) => e.name.toLowerCase() === lower);
    if (found) { tipCache.set(name, found); return found; }
  }
  tipCache.set(name, undefined);
  return undefined;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
}

function fmtMonth(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", { month: "short", day: "numeric" });
}

// ── SVG Bar Chart ──────────────────────────────────────────────────────────────
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const w = 100 / data.length;
  return (
    <svg viewBox={`0 0 100 60`} preserveAspectRatio="none" className="w-full" style={{ height: 140 }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(p => (
        <line key={p} x1="0" y1={50 - p * 50} x2="100" y2={50 - p * 50}
          stroke="#1e1e1e" strokeWidth="0.3" />
      ))}
      {/* Bars */}
      {data.map((d, i) => {
        const h = (d.value / max) * 48;
        const x = i * w + w * 0.15;
        const barW = w * 0.7;
        return (
          <g key={i}>
            <rect x={x} y={50 - h} width={barW} height={h} rx="0.8"
              fill={COPPER_L} opacity={d.value > 0 ? 0.9 : 0.15} />
          </g>
        );
      })}
      {/* X-Labels */}
      {data.map((d, i) => (
        <text key={i} x={i * w + w / 2} y={57} textAnchor="middle"
          fontSize="3.5" fill="#555">{d.label}</text>
      ))}
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function ExerciseDetailScreen({
  exerciseName,
  onBack,
}: {
  exerciseName: string;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<"fortschritt" | "verlauf" | "anweisungen">("fortschritt");
  const [exData, setExData] = useState<AreaExercise | undefined>();
  const [period, setPeriod] = useState<"M" | "6M">("M");

  // History
  const workouts = useHistoryStore(s => s.workouts);
  const personalRecords = useHistoryStore(s => s.personalRecords);

  // Load exercise data
  useEffect(() => { loadExercise(exerciseName).then(setExData); }, [exerciseName]);

  // All sessions with this exercise
  const sessions = workouts
    .filter(w => w.exercises.some(e => e.name === exerciseName))
    .map(w => {
      const ex = w.exercises.find(e => e.name === exerciseName)!;
      return {
        date:    w.date,
        volume:  ex.volume,
        bestSet: ex.bestSet,
        sets:    ex.sets,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // Chart data
  const chartData = (() => {
    const now = new Date();
    const weeks = period === "M" ? 4 : 24;
    const result: { label: string; value: number }[] = [];
    for (let i = weeks - 1; i >= 0; i--) {
      const from = new Date(now); from.setDate(from.getDate() - i * 7 - 6);
      const to   = new Date(now); to.setDate(to.getDate() - i * 7);
      const vol = sessions
        .filter(s => new Date(s.date) >= from && new Date(s.date) <= to)
        .reduce((sum, s) => sum + s.volume, 0);
      const label = period === "M"
        ? from.toLocaleDateString("de-DE", { month: "short", day: "numeric" })
        : `${from.getDate()}.${from.getMonth() + 1}`;
      result.push({ label: period === "M" ? label.split(" ")[1] ?? label : label, value: vol });
    }
    return result;
  })();

  const avgVolume = chartData.length > 0
    ? Math.round(chartData.reduce((s, d) => s + d.value, 0) / chartData.filter(d => d.value > 0).length || 0)
    : 0;

  // Personal top 3 (by weight desc, then reps desc)
  const top3 = sessions
    .flatMap(s => s.sets.map(set => ({ ...set, date: s.date })))
    .sort((a, b) => b.weight - a.weight || b.reps - a.reps)
    .filter((s, i, arr) => arr.findIndex(x => x.weight === s.weight && x.reps === s.reps) === i)
    .slice(0, 3);

  // Period label
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - (period === "M" ? 29 : 180));
  const periodLabel = `${from.toLocaleDateString("de-DE", { day:"numeric", month:"short" })} – ${now.toLocaleDateString("de-DE", { day:"numeric", month:"short", year:"2-digit" })}`;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#080808", color: "#fff" }}>

      {/* Hero Image */}
      <div className="relative flex-shrink-0" style={{ height: 220 }}>
        <div className="absolute inset-0" style={{ background: "#111" }} />
        <img src="/images/coach_bertl.webp" alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ filter: "brightness(0.4) grayscale(0.3)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0) 30%, rgba(8,8,8,1) 100%)" }} />

        {/* Back + Info */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 pt-4">
          <button onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)", border: "none" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="font-black text-xs tracking-widest text-white/60" style={{ fontFamily: F }}>ÜBUNGSDETAILS</p>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.6)", border: `1px solid ${COPPER_L}44`, color: COPPER_L, fontSize: 16 }}>ⓘ</div>
        </div>

        {/* Name */}
        <div className="absolute bottom-0 inset-x-0 px-4 pb-3">
          <p className="font-black text-xl text-white leading-tight" style={{ fontFamily: F }}>
            {exerciseName}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-shrink-0 border-b" style={{ borderColor: "#1e1e1e" }}>
        {(["fortschritt", "verlauf", "anweisungen"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-3 font-black text-xs tracking-widest"
            style={{
              fontFamily: F, background: "none", border: "none",
              color: tab === t ? COPPER_L : "#444",
              borderBottom: `2px solid ${tab === t ? COPPER_L : "transparent"}`,
            }}>
            {t === "fortschritt" ? "FORTSCHRITT" : t === "verlauf" ? "VERLAUF" : "ANWEISUNGEN"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ══ FORTSCHRITT ══ */}
        {tab === "fortschritt" && (
          <div className="px-4 pt-4 pb-10">
            {sessions.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-16">Noch keine Aufzeichnungen vorhanden.</p>
            ) : (
              <>
                {/* Volumenlast */}
                <div className="flex items-start justify-between mb-1">
                  <p className="text-[10px] font-bold text-gray-500 tracking-widest">Ø VOLUMENLAST</p>
                  <div className="flex gap-1">
                    {(["M", "6M"] as const).map(p => (
                      <button key={p} onClick={() => setPeriod(p)}
                        className="px-3 py-1 rounded-lg font-black text-xs"
                        style={{ background: period === p ? "transparent" : "transparent",
                          color: period === p ? COPPER_L : "#444",
                          border: `1px solid ${period === p ? COPPER_L : "#2a2a2a"}`,
                          fontFamily: F }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="font-black mb-0.5" style={{ fontFamily: F, fontSize: 40, color: COPPER_L }}>
                  {avgVolume > 0 ? `${avgVolume.toLocaleString("de-DE")} kg` : "— kg"}
                </p>

                {/* Period navigator */}
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs text-gray-500">{periodLabel}</p>
                </div>

                {/* Chart */}
                <div className="rounded-2xl p-3 mb-6" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
                  <BarChart data={chartData} />
                </div>

                {/* Persönliche Aufzeichnungen */}
                <p className="text-[10px] font-bold text-gray-500 tracking-widest mb-3">PERSÖNLICHE AUFZEICHNUNGEN</p>
                {top3.length === 0 ? (
                  <p className="text-gray-600 text-sm">Keine Bestleistungen vorhanden.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {top3.map((s, i) => (
                      <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-2xl"
                        style={{ background: "#111", border: "1px solid #1e1e1e" }}>
                        <div>
                          <span className="font-black text-xl" style={{ color: COPPER_L }}>{s.weight} kg</span>
                          <span className="text-sm text-gray-400 ml-2">{s.reps} Wdh.</span>
                        </div>
                        <span className="text-2xl">{medals[i]}</span>
                        <span className="flex-1 text-right text-xs text-gray-500">{fmtDate(s.date)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ══ VERLAUF ══ */}
        {tab === "verlauf" && (
          <div className="pt-2 pb-10">
            {sessions.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-16">Noch keine Aufzeichnungen vorhanden.</p>
            ) : (
              <>
                {/* Filter bar */}
                <div className="px-4 py-3 border-b" style={{ borderColor: "#1e1e1e" }}>
                  <div className="flex gap-2 mb-2">
                    <button className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl text-sm text-white"
                      style={{ background: "#111", border: "1px solid #1e1e1e" }}>
                      Gewicht (kg)
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl text-sm text-white"
                      style={{ background: "#111", border: "1px solid #1e1e1e" }}>
                      Alle Zeit
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <button className="w-full py-2 rounded-xl font-black text-xs flex items-center justify-center gap-2"
                    style={{ background: "transparent", color: COPPER_L, border: `1px solid ${COPPER_L}44`, fontFamily: F }}>
                    + FILTER ANZEIGEN
                  </button>
                </div>

                {/* Einträge */}
                <div>
                  {sessions.map((s, i) => {
                    const bestSet = s.sets.reduce((b, x) =>
                      x.weight > b.weight || (x.weight === b.weight && x.reps > b.reps) ? x : b,
                      s.sets[0] ?? { weight: 0, reps: 0 }
                    );
                    return (
                      <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b"
                        style={{ borderColor: "#1e1e1e" }}>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-black text-lg" style={{ color: COPPER_L }}>
                              {bestSet.weight} kg
                            </span>
                            <span className="text-sm text-gray-400">{bestSet.reps} Wdh.</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{fmtDate(s.date)}</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M5 3l4 4-4 4" stroke="#444" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ ANWEISUNGEN ══ */}
        {tab === "anweisungen" && (
          <div className="px-4 pt-4 pb-10">
            {!exData ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: `${COPPER_L}44`, borderTopColor: COPPER_L }} />
              </div>
            ) : (
              <>
                {/* Video Placeholder */}
                <div className="relative rounded-2xl overflow-hidden mb-5"
                  style={{ background: "#111", aspectRatio: "16/9" }}>
                  <img src="/images/coach_bertl.webp" alt=""
                    className="w-full h-full object-cover" style={{ filter: "brightness(0.4)" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.7)", border: `2px solid ${COPPER_L}` }}>
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M8 5l10 6-10 6V5z" fill={COPPER_L}/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-3 text-xs text-white/60">00:32</div>
                </div>

                {/* Beschreibung */}
                {exData.desc && (
                  <p className="text-sm text-gray-300 leading-relaxed mb-5">{exData.desc}</p>
                )}

                {/* Anweisungen Steps — aus execution oder cues */}
                {exData.execution && (
                  <div className="mb-5">
                    <p className="text-[10px] font-black text-gray-500 tracking-widest mb-3">AUSFÜHRUNG</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{exData.execution}</p>
                  </div>
                )}

                {exData.cues && exData.cues.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[10px] font-black text-gray-500 tracking-widest mb-3">CUES</p>
                    {exData.cues.map((cue: string, i: number) => (
                      <div key={i} className="flex gap-3 mb-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                          style={{ background: COPPER, color: "#fff", fontFamily: F }}>{i + 1}</div>
                        <p className="text-sm text-gray-300 leading-relaxed flex-1">{cue}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ausrüstung */}
                {exData.equipment && exData.equipment.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-gray-500 tracking-widest mb-2">AUSRÜSTUNG</p>
                    <p className="text-sm text-gray-300">{exData.equipment.join(", ")}</p>
                  </div>
                )}

                {/* Muskelgruppen */}
                {(exData.primary || exData.secondary) && (
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-gray-500 tracking-widest mb-2">MUSKELGRUPPEN</p>
                    {exData.primary && <p className="text-sm text-gray-300">Primär: {exData.primary}</p>}
                    {exData.secondary && <p className="text-sm text-gray-500 mt-0.5">Sekundär: {exData.secondary}</p>}
                  </div>
                )}

                {/* Technische Fehler */}
                {exData.errors_technique && exData.errors_technique.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-gray-500 tracking-widest mb-2">HÄUFIGE FEHLER</p>
                    {exData.errors_technique.map((m: string, i: number) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <span style={{ color: "#ef4444" }}>✕</span>
                        <p className="text-sm text-gray-300 leading-relaxed">{m}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sicherheitshinweise */}
                {exData.errors_safety && exData.errors_safety.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-gray-500 tracking-widest mb-2">SICHERHEIT</p>
                    {exData.errors_safety.map((e: string, i: number) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <span style={{ color: "#f59e0b" }}>⚠</span>
                        <p className="text-sm text-gray-300 leading-relaxed">{e}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
