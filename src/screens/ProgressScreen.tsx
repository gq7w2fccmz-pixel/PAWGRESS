import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useHistoryStore } from "../stores/historyStore";
import { useStatsStore } from "../stores/statsStore";
import type { BodyweightEntry } from "../stores/statsStore";
import { F, ORANGE, COPPER, COPPER_L, COPPER_G, SURF, SURF2, BORDER, GREEN, RED } from "../styles/tokens";
import { fmtVolume, fmtDuration } from "../lib/format";

// ── Mini SVG Line Chart ───────────────────────────────────────────────────────
function SparkLine({ data, color = COPPER_L, height = 60 }: {
  data: number[]; color?: string; height?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 280; const h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const areaPath = `M${pts[0]} L${pts.join(" L")} L${w},${h} L0,${h} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#spark-grad)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle cx={w} cy={parseFloat(pts[pts.length-1].split(",")[1])} r="3" fill={color} />
    </svg>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────
function BarChart({ data, labels, color = COPPER_L, unit = "" }: {
  data: number[]; labels: string[]; color?: string; unit?: string;
}) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1.5 w-full" style={{ height: 80 }}>
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full rounded-t-sm transition-all"
            style={{
              height: Math.max(4, (v / max) * 68),
              background: i === data.length - 1
                ? `linear-gradient(180deg, ${color} 0%, ${COPPER} 100%)`
                : `${color}44`,
              minWidth: 8,
            }} />
          <p className="text-[8px] text-gray-600">{labels[i]}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
type Tab = "uebersicht" | "kraft" | "volumen";

export function ProgressScreen() {
  const navigate = useNavigate();
  const workouts = useHistoryStore(s => s.workouts);
  const getExerciseHistory = useHistoryStore(s => s.getExerciseHistory);
  const [tab, setTab] = useState<Tab>("uebersicht");
  const [bwInput, setBwInput] = useState("");
  const addBodyweight = useStatsStore(s => s.addBodyweight);
  const bodyweightLog = useStatsStore(s => s.stats.bodyweightLog ?? []);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [exerciseSearch, setExerciseSearch] = useState("");

  // ── Übersicht Stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const sorted = [...workouts].sort((a, b) => a.date.localeCompare(b.date));
    const last8 = sorted.slice(-8);

    // Wöchentliches Volumen (letzte 8 Wochen)
    const weeklyVol: Record<string, number> = {};
    workouts.forEach((w: import("../stores/historyStore").WorkoutRecord) => {
      const d = new Date(w.date);
      // ISO week
      const jan1 = new Date(d.getFullYear(), 0, 1);
      const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
      const key = `KW${week}`;
      weeklyVol[key] = (weeklyVol[key] ?? 0) + w.totalVolume;
    });
    const weekKeys = Object.keys(weeklyVol).sort().slice(-6);
    const weekVols = weekKeys.map(k => weeklyVol[k]);

    // PRs gesamt
    const totalPRs = workouts.reduce((s, w) => s + w.exercises.filter(e => e.isPR).length, 0);

    // Gesamtvolumen
    const totalVol = workouts.reduce((s, w) => s + w.totalVolume, 0);
    const totalTime = workouts.reduce((s, w) => s + w.durationSeconds, 0);

    // Streak
    const today = new Date().toISOString().slice(0, 10);
    let streak = 0;
    const dateDone = new Set(workouts.map(w => w.date));
    let check = new Date();
    while (dateDone.has(check.toISOString().slice(0, 10)) || check.toISOString().slice(0, 10) === today) {
      if (dateDone.has(check.toISOString().slice(0, 10))) streak++;
      check.setDate(check.getDate() - 1);
      if (streak > 365) break;
    }

    return { last8, weekKeys, weekVols, totalPRs, totalVol, totalTime, streak };
  }, [workouts]);

  // ── Kraft-Progression ────────────────────────────────────────────────────
  const exerciseNames = useMemo(() => {
    const names = new Set<string>();
    workouts.forEach(w => w.exercises.forEach(e => names.add(e.name)));
    return Array.from(names).sort();
  }, [workouts]);

  const filteredExercises = exerciseNames.filter(n =>
    n.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const exerciseHistory = useMemo(() => {
    if (!selectedExercise) return [];
    return getExerciseHistory(selectedExercise);
  }, [selectedExercise, getExerciseHistory]);

  const kraftData = exerciseHistory.map(h => h.bestSet.weight);
  const kraftLabels = exerciseHistory.map(h => h.date.slice(5)); // MM-DD
  const volData = exerciseHistory.map(h => h.volume);

  const maxWeight = kraftData.length ? Math.max(...kraftData) : 0;
  const lastWeight = kraftData[kraftData.length - 1] ?? 0;
  const firstWeight = kraftData[0] ?? 0;
  const improvement = firstWeight > 0 ? Math.round(((lastWeight - firstWeight) / firstWeight) * 100) : 0;

  const TABS: { id: Tab; label: string }[] = [
    { id: "uebersicht", label: "ÜBERSICHT" },
    { id: "kraft",      label: "KRAFT" },
    { id: "volumen",    label: "VOLUMEN" },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4">
        <button onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <p className="font-black italic text-3xl text-white leading-none" style={{ fontFamily: F }}>
          FORTSCHRITT
        </p>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-2 mb-5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-xl font-black text-xs flex-1"
            style={{
              background: tab === t.id ? `linear-gradient(135deg, #b8660a 0%, #e8a050 40%, #cd7f32 100%)` : SURF2,
              color: tab === t.id ? "#fff" : "#666",
              border: `1px solid ${tab === t.id ? COPPER_L : "#1e1e1e"}`,
              fontFamily: F,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Übersicht ── */}
      {tab === "uebersicht" && (
        <div className="px-4 flex flex-col gap-4">
          {/* Körpergewicht Tracker */}
          <div className="rounded-2xl p-4"
            style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
            <p className="font-black italic text-base text-white mb-3" style={{ fontFamily: F }}>KÖRPERGEWICHT</p>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={bwInput}
                onChange={e => setBwInput(e.target.value)}
                placeholder="kg eingeben..."
                className="flex-1 px-3 py-2 rounded-xl text-sm text-white"
                style={{ background: "#0f0f0f", border: `1px solid ${BORDER}`, outline: "none" }}
                inputMode="decimal"
              />
              <button
                onClick={() => {
                  const kg = parseFloat(bwInput.replace(",", "."));
                  if (!isNaN(kg) && kg > 0) { addBodyweight(kg); setBwInput(""); }
                }}
                className="px-4 py-2 rounded-xl font-black text-sm"
                style={{ background: `linear-gradient(135deg, #b8660a 0%, #e8a050 40%, #cd7f32 100%)`, color: "#fff", fontFamily: F, border: "none" }}>
                +
              </button>
            </div>
            {bodyweightLog.length >= 2 && (
              <SparkLine data={bodyweightLog.slice(-30).map((e: BodyweightEntry) => e.kg)} height={50} color="#3b82f6" />
            )}
            {bodyweightLog.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Aktuell: {bodyweightLog[bodyweightLog.length - 1]!.kg} kg
                {bodyweightLog.length > 1 && ` · Δ ${(bodyweightLog[bodyweightLog.length - 1]!.kg - bodyweightLog[0].kg).toFixed(1)} kg`}
              </p>
            )}
          </div>

          {/* Summary Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "WORKOUTS", value: String(workouts.length), icon: "🏋️" },
              { label: "PERSONAL RECORDS", value: String(stats.totalPRs), icon: "🏆" },
              { label: "GESAMTVOLUMEN", value: fmtVolume(stats.totalVol), icon: "📈" },
              { label: "TRAININGSZEIT", value: fmtDuration(stats.totalTime), icon: "⏱️" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4"
                style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="font-black text-2xl text-white" style={{ fontFamily: F }}>{s.value}</p>
                <p className="text-[9px] text-gray-500 tracking-widest font-bold mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Wöchentliches Volumen */}
          {stats.weekVols.length > 1 && (
            <div className="rounded-2xl p-4"
              style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
              <p className="font-black italic text-base text-white mb-4" style={{ fontFamily: F }}>
                VOLUMEN PRO WOCHE
              </p>
              <BarChart data={stats.weekVols} labels={stats.weekKeys} />
              <p className="text-xs text-gray-500 mt-2 text-right">
                Diese Woche: {fmtVolume(stats.weekVols[stats.weekVols.length - 1] ?? 0)}
              </p>
            </div>
          )}

          {/* Letzte Workouts Timeline */}
          <div className="rounded-2xl p-4"
            style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
            <p className="font-black italic text-base text-white mb-3" style={{ fontFamily: F }}>
              LETZTE TRAININGS
            </p>
            {stats.last8.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-4">Noch keine Trainings gespeichert.</p>
            )}
            {[...stats.last8].reverse().map((w, i) => (
              <div key={w.id} className="flex items-center gap-3 py-2.5 border-b"
                style={{ borderColor: i === stats.last8.length - 1 ? "transparent" : "#1e1e1e" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${COPPER}18`, border: `1px solid ${COPPER}33` }}>
                  <span className="text-sm">{w.dayTag === "PUSH" ? "🔥" : "💪"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-white" style={{ fontFamily: F }}>{w.dayLabel}</p>
                  <p className="text-xs text-gray-500">{w.date} · {fmtVolume(w.totalVolume)} · {w.totalSets} Sätze</p>
                </div>
                {w.exercises.some(e => e.isPR) && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded"
                    style={{ background: `linear-gradient(135deg, ${COPPER} 0%, ${COPPER_L} 100%)`, color: "#fff", fontFamily: F }}>
                    PR
                  </span>
                )}
              </div>
            ))}
          </div>

          {workouts.length === 0 && (
            <div className="flex flex-col items-center py-16 gap-3">
              <p className="text-5xl">📊</p>
              <p className="font-black italic text-xl text-gray-600" style={{ fontFamily: F }}>
                NOCH KEINE DATEN
              </p>
              <p className="text-sm text-gray-600 text-center">
                Absolviere dein erstes Workout um deinen Fortschritt zu sehen.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Kraft-Progression ── */}
      {tab === "kraft" && (
        <div className="px-4 flex flex-col gap-4">
          {/* Exercise Search */}
          <div className="relative">
            <input
              value={exerciseSearch}
              onChange={e => setExerciseSearch(e.target.value)}
              placeholder="Übung suchen..."
              className="w-full px-4 py-3 rounded-2xl text-sm text-white"
              style={{ background: SURF2, border: `1px solid ${BORDER}`, outline: "none", fontFamily: F }}
            />
          </div>

          {/* Exercise List */}
          {!selectedExercise && (
            <div className="flex flex-col gap-2">
              {filteredExercises.length === 0 && (
                <p className="text-gray-600 text-sm text-center py-8">Keine Übungen gefunden.</p>
              )}
              {filteredExercises.map(name => {
                const hist = getExerciseHistory(name);
                const pr = hist.length ? Math.max(...hist.map(h => h.bestSet.weight)) : 0;
                const sessions = hist.length;
                return (
                  <button key={name} onClick={() => setSelectedExercise(name)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left w-full"
                    style={{ background: SURF2, border: `1px solid #1e1e1e` }}>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-white truncate" style={{ fontFamily: F }}>{name}</p>
                      <p className="text-xs text-gray-500">{sessions} Sessions · Max {pr > 0 ? `${pr} kg` : "BW"}</p>
                    </div>
                    {hist.some(h => h.bestSet.weight > 0) && (
                      <div style={{ width: 60, height: 28, overflow: "hidden" }}>
                        <SparkLine data={hist.map(h => h.bestSet.weight)} height={28} />
                      </div>
                    )}
                    <span className="text-gray-600">›</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Exercise Detail */}
          {selectedExercise && (
            <div className="flex flex-col gap-4">
              <button onClick={() => setSelectedExercise(null)}
                className="flex items-center gap-2 text-sm"
                style={{ background: "none", border: "none", color: COPPER_L }}>
                ← Alle Übungen
              </button>

              <div className="rounded-2xl p-4"
                style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
                <p className="font-black italic text-lg text-white mb-1" style={{ fontFamily: F }}>
                  {selectedExercise}
                </p>
                <div className="flex gap-4 mb-4">
                  <div>
                    <p className="font-black text-2xl text-white" style={{ fontFamily: F }}>
                      {maxWeight > 0 ? `${maxWeight} kg` : "BW"}
                    </p>
                    <p className="text-[9px] text-gray-500 tracking-widest">BESTLEISTUNG</p>
                  </div>
                  <div>
                    <p className="font-black text-2xl" style={{ fontFamily: F, color: improvement >= 0 ? GREEN : RED }}>
                      {improvement >= 0 ? "+" : ""}{improvement}%
                    </p>
                    <p className="text-[9px] text-gray-500 tracking-widest">STEIGERUNG</p>
                  </div>
                  <div>
                    <p className="font-black text-2xl text-white" style={{ fontFamily: F }}>
                      {exerciseHistory.length}
                    </p>
                    <p className="text-[9px] text-gray-500 tracking-widest">SESSIONS</p>
                  </div>
                </div>

                {kraftData.length >= 2 && (
                  <>
                    <p className="text-xs text-gray-500 mb-2">MAXIMALGEWICHT PRO SESSION</p>
                    <SparkLine data={kraftData} height={80} />
                    <div className="flex justify-between mt-1">
                      <p className="text-[9px] text-gray-600">{kraftLabels[0]}</p>
                      <p className="text-[9px] text-gray-600">{kraftLabels[kraftLabels.length - 1]}</p>
                    </div>
                  </>
                )}

                {kraftData.length < 2 && (
                  <p className="text-gray-600 text-xs text-center py-4">
                    Mindestens 2 Sessions nötig für einen Chart.
                  </p>
                )}
              </div>

              {/* Session History */}
              <div className="rounded-2xl p-4"
                style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
                <p className="font-black italic text-sm text-white mb-3" style={{ fontFamily: F }}>VERLAUF</p>
                {[...exerciseHistory].reverse().map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b"
                    style={{ borderColor: i === exerciseHistory.length - 1 ? "transparent" : "#1e1e1e" }}>
                    <p className="text-xs text-gray-500">{h.date}</p>
                    <p className="text-sm font-black text-white" style={{ fontFamily: F }}>
                      {h.bestSet.weight > 0 ? `${h.bestSet.weight} kg × ${h.bestSet.reps}` : `BW × ${h.bestSet.reps}`}
                    </p>
                    <p className="text-xs text-gray-500">{fmtVolume(h.volume)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Volumen ── */}
      {tab === "volumen" && (
        <div className="px-4 flex flex-col gap-4">
          {/* Volume per workout */}
          {workouts.length >= 2 && (
            <div className="rounded-2xl p-4"
              style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
              <p className="font-black italic text-base text-white mb-4" style={{ fontFamily: F }}>
                VOLUMEN PRO TRAINING
              </p>
              <SparkLine
                data={[...workouts].sort((a,b) => a.date.localeCompare(b.date)).slice(-16).map(w => w.totalVolume)}
                height={100}
              />
              <p className="text-xs text-gray-500 mt-2">Letzte 16 Trainings</p>
            </div>
          )}

          {/* Top exercises by volume */}
          <div className="rounded-2xl p-4"
            style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
            <p className="font-black italic text-base text-white mb-3" style={{ fontFamily: F }}>
              TOP ÜBUNGEN NACH VOLUMEN
            </p>
            {(() => {
              const exVol: Record<string, number> = {};
              workouts.forEach(w => w.exercises.forEach(e => {
                exVol[e.name] = (exVol[e.name] ?? 0) + e.volume;
              }));
              const top = Object.entries(exVol).sort((a,b) => b[1]-a[1]).slice(0, 8);
              const maxVol = top[0]?.[1] ?? 1;
              return top.map(([name, vol], i) => (
                <div key={name} className="flex items-center gap-3 py-2.5 border-b"
                  style={{ borderColor: i === top.length - 1 ? "transparent" : "#1e1e1e" }}>
                  <p className="text-xs font-black text-gray-500 w-5" style={{ fontFamily: F }}>{i+1}</p>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate" style={{ fontFamily: F }}>{name}</p>
                    <div className="h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: "#1e1e1e" }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: `${(vol / maxVol) * 100}%`,
                          background: `linear-gradient(90deg, ${COPPER} 0%, ${COPPER_L} 100%)`
                        }} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">{fmtVolume(vol)}</p>
                </div>
              ));
            })()}
            {workouts.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-4">Noch keine Daten.</p>
            )}
          </div>

          {/* Muskelgruppen-Verteilung */}
          <div className="rounded-2xl p-4"
            style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
            <p className="font-black italic text-base text-white mb-3" style={{ fontFamily: F }}>
              SETS PRO MUSKELGRUPPE
            </p>
            {(() => {
              const PUSH_TAGS = new Set(["PUSH"]);
              const pushSets = workouts.filter((w: import("../stores/historyStore").WorkoutRecord) => PUSH_TAGS.has(w.dayTag)).reduce((s,w) => s + w.totalSets, 0);
              const pullSets = workouts.filter(w => !PUSH_TAGS.has(w.dayTag)).reduce((s,w) => s + w.totalSets, 0);
              const total = pushSets + pullSets || 1;
              return (
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Push (Brust · Schultern · Trizeps)", sets: pushSets, color: COPPER_L },
                    { label: "Pull (Rücken · Bizeps · Core)", sets: pullSets, color: "#3b82f6" },
                  ].map(g => (
                    <div key={g.label}>
                      <div className="flex justify-between mb-1">
                        <p className="text-xs text-gray-400">{g.label}</p>
                        <p className="text-xs font-bold text-white">{g.sets} Sätze</p>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "#1e1e1e" }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${(g.sets/total)*100}%`, background: g.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
