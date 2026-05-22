import { useState } from "react";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useHistoryStore } from "../stores/historyStore";

const F = "'Barlow Condensed', sans-serif";

// ── Sub-screens ──────────────────────────────────────────────────────────────

function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#2a2a2a" }}>
      <button onClick={onBack} className="text-white text-xl" style={{ background: "none", border: "none" }}>←</button>
      <h2 className="font-black italic text-xl text-white flex-1 text-center" style={{ fontFamily: F }}>PROFIL</h2>
      <div style={{ width: 24 }} />
    </div>
  );
}

function Row({ icon, color, title, desc, onPress }: { icon: string; color: string; title: string; desc: string; onPress: () => void }) {
  return (
    <button onClick={onPress} className="w-full flex items-center gap-4 px-4 py-4 border-b text-left" style={{ background: "none", border: "none", borderBottom: "1px solid #2a2a2a" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}22` }}>
        <span style={{ color, fontSize: 20 }}>{icon}</span>
      </div>
      <div className="flex-1">
        <p className="font-black text-sm text-white" style={{ fontFamily: F }}>{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <span className="text-gray-600 text-lg">›</span>
    </button>
  );
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="px-4 pt-5 pb-3">
      <div className="flex items-center gap-2">
        <p className="font-black italic text-xl text-white" style={{ fontFamily: F }}>{title}</p>
      </div>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
  );
}

// ── Einstellungen Screen ─────────────────────────────────────────────────────
function EinstellungenScreen({ onBack }: { onBack: () => void }) {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [dist, setDist] = useState<"km" | "mi">("km");
  const [lang, setLang] = useState<"de" | "en">("de");

  function Toggle({ value, options, onChange }: { value: string; options: string[]; onChange: (v: any) => void }) {
    return (
      <div className="flex rounded-xl overflow-hidden" style={{ background: "#1e1e1e", border: "1px solid #2a2a2a" }}>
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            className="flex-1 py-2 text-sm font-black"
            style={{
              fontFamily: F,
              background: value === opt ? "#f97316" : "transparent",
              color: value === opt ? "#fff" : "#6b7280",
              border: "none", borderRadius: value === opt ? 10 : 0,
            }}>
            {opt.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a" }}>
      <BackHeader title="Einstellungen" onBack={onBack} />

      <SectionHeader title="EINSTELLUNGEN" desc="Verwalte deine Daten & App Präferenzen." />

      {/* Persönliche Daten */}
      <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, margin: "0 16px 12px" }}>
        <Row icon="👤" color="#f97316" title="Persönliche Daten" desc="Deine Angaben verwalten" onPress={() => {}} />
        
        {/* Einheiten & Gewicht */}
        <div className="px-4 py-4 border-b" style={{ borderColor: "#2a2a2a" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#06b6d422" }}>
              <span style={{ color: "#06b6d4", fontSize: 20 }}>⚖️</span>
            </div>
            <div>
              <p className="font-black text-sm text-white" style={{ fontFamily: F }}>Einheiten & Gewicht</p>
              <p className="text-xs text-gray-500">Einheiten, Gewicht & Maße</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-13 pl-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Gewicht</span>
              <div style={{ width: 120 }}>
                <Toggle value={unit} options={["kg", "lbs"]} onChange={setUnit} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Distanz</span>
              <div style={{ width: 120 }}>
                <Toggle value={dist} options={["km", "mi"]} onChange={setDist} />
              </div>
            </div>
          </div>
        </div>

        {/* Impressum */}
        <Row icon="📄" color="#9ca3af" title="Impressum" desc="Rechtliche Informationen" onPress={() => {}} />

        {/* App Einstellungen */}
        <div className="px-4 py-4" style={{ borderRadius: "0 0 16px 16px" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#f9731622" }}>
              <span style={{ color: "#f97316", fontSize: 20 }}>⚙️</span>
            </div>
            <div>
              <p className="font-black text-sm text-white" style={{ fontFamily: F }}>App Einstellungen</p>
              <p className="text-xs text-gray-500">Anpassen der App</p>
            </div>
          </div>
          <div className="flex items-center justify-between ml-1 pl-1">
            <span className="text-xs text-gray-400">Sprache</span>
            <div style={{ width: 160 }}>
              <Toggle value={lang} options={["de", "en"]} onChange={setLang} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Körperanalysen Screen ────────────────────────────────────────────────────
function KoerperanalysenScreen({ onBack }: { onBack: () => void }) {
  const workouts       = useHistoryStore(s => s.workouts);
  const personalRecords = useHistoryStore(s => s.personalRecords);
  const { stats, coachProgress } = usePawgressStore();

  // Derived stats
  const totalVolume  = workouts.reduce((a, w) => a + w.totalVolume, 0);
  const totalSets    = workouts.reduce((a, w) => a + w.totalSets, 0);
  const totalReps    = workouts.reduce((a, w) => a + w.totalReps, 0);
  const avgDuration  = workouts.length
    ? Math.round(workouts.reduce((a, w) => a + w.durationSeconds, 0) / workouts.length / 60)
    : 0;

  // Weeks active
  const weeksActive = workouts.length
    ? Math.max(1, Math.ceil(workouts.length / 2))
    : 0;
  const avgPerWeek = weeksActive ? (workouts.length / weeksActive).toFixed(1) : "–";

  // Top PRs (highest weight)
  const topPRs = Object.entries(personalRecords)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Recent workouts
  const recent = workouts.slice(0, 5);

  // Volume split Push vs Pull
  const pushVol = workouts.filter(w => w.dayTag === "PUSH").reduce((a, w) => a + w.totalVolume, 0);
  const pullVol = workouts.filter(w => w.dayTag === "PULL").reduce((a, w) => a + w.totalVolume, 0);
  const totalTagVol = pushVol + pullVol || 1;

  function fmt(n: number) {
    return n >= 1000 ? `${(n / 1000).toFixed(1).replace(".", ",")}k` : String(Math.round(n));
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a" }}>
      <BackHeader title="Körperanalysen" onBack={onBack} />
      <SectionHeader title="KÖRPERANALYSEN" desc="Analysiere deine Entwicklung & Performance." />

      {/* ── Overview Stats ── */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Gesamtvolumen",    value: totalVolume > 0 ? fmt(totalVolume) : "–", unit: "kg gesamt",    color: "#f97316" },
          { label: "Workouts total",   value: String(stats.totalWorkouts),               unit: "Einheiten",    color: "#22c55e" },
          { label: "Ø Workouts/Woche", value: workouts.length ? avgPerWeek : "–",        unit: "pro Woche",    color: "#a855f7" },
          { label: "Längster Streak",  value: String(coachProgress.maxStreak || "–"),    unit: "Tage",         color: "#eab308" },
          { label: "Gesamtsätze",      value: totalSets > 0 ? String(totalSets) : "–",  unit: "Sätze",        color: "#3b82f6" },
          { label: "Ø Trainingsdauer", value: avgDuration > 0 ? String(avgDuration) : "–", unit: "Minuten",   color: "#ec4899" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="font-black text-2xl leading-none" style={{ fontFamily: F, color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">{s.unit}</p>
          </div>
        ))}
      </div>

      {/* ── Push / Pull Split ── */}
      {workouts.length > 0 && (
        <div className="px-4 mb-4">
          <div className="rounded-2xl p-4" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
            <p className="font-black text-sm text-white mb-3" style={{ fontFamily: F }}>PUSH / PULL VOLUMEN</p>
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Push</span>
                  <span style={{ color: "#f97316" }}>{fmt(pushVol)} kg</span>
                </div>
                <div className="rounded-full" style={{ height: 6, background: "#2a2a2a" }}>
                  <div className="h-full rounded-full" style={{ width: `${(pushVol / totalTagVol) * 100}%`, background: "#f97316" }} />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Pull</span>
                  <span style={{ color: "#3b82f6" }}>{fmt(pullVol)} kg</span>
                </div>
                <div className="rounded-full" style={{ height: 6, background: "#2a2a2a" }}>
                  <div className="h-full rounded-full" style={{ width: `${(pullVol / totalTagVol) * 100}%`, background: "#3b82f6" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Personal Records ── */}
      {topPRs.length > 0 && (
        <div className="px-4 mb-4">
          <div className="rounded-2xl p-4" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: "#f97316" }}>🏆</span>
              <p className="font-black text-sm text-white" style={{ fontFamily: F }}>PERSÖNLICHE REKORDE</p>
            </div>
            {topPRs.map(([name, weight], i) => (
              <div key={name} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: "#2a2a2a" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: "#f9731622", color: "#f97316", fontFamily: F }}>{i + 1}</div>
                <p className="flex-1 text-sm text-white truncate" style={{ fontFamily: F }}>{name}</p>
                <p className="font-black text-sm flex-shrink-0" style={{ color: "#f97316", fontFamily: F }}>{weight} kg</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent Workouts ── */}
      {recent.length > 0 && (
        <div className="px-4 mb-4">
          <div className="rounded-2xl p-4" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
            <p className="font-black text-sm text-white mb-3" style={{ fontFamily: F }}>LETZTE TRAININGS</p>
            {recent.map((w, i) => (
              <div key={w.id} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: "#2a2a2a" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: w.dayTag === "PUSH" ? "#f97316" : "#3b82f6" }} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-white" style={{ fontFamily: F }}>{w.dayLabel}</p>
                  <p className="text-[10px] text-gray-500">{w.date} · {Math.floor(w.durationSeconds / 60)} Min</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color: w.dayTag === "PUSH" ? "#f97316" : "#3b82f6" }}>
                    {fmt(w.totalVolume)} kg
                  </p>
                  <p className="text-[10px] text-gray-600">{w.totalSets} Sätze</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {workouts.length === 0 && (
        <p className="text-center text-xs text-gray-600 px-8">
          Schließe dein erstes Training ab – dann füllst du diese Seite mit echten Daten.
        </p>
      )}
    </div>
  );
}

// ── Main Profil Screen ───────────────────────────────────────────────────────
export function ProfilScreen() {
  const { stats, selectedCoach, coachProgress } = usePawgressStore();
  const [subScreen, setSubScreen] = useState<null | "einstellungen" | "koerper">(null);

  if (subScreen === "einstellungen") return <EinstellungenScreen onBack={() => setSubScreen(null)} />;
  if (subScreen === "koerper")       return <KoerperanalysenScreen onBack={() => setSubScreen(null)} />;

  const weeklyGoalPct = Math.min(Math.round((stats.weeklyWorkouts / 6) * 100), 100);

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 220 }}>
        <img src="/images/profil_hero.webp" alt="Profil Hero"
          className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.85) 80%, rgba(10,10,10,1) 100%)",
        }} />
        <div className="relative z-10 px-5 pt-6 pb-8">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-black italic text-5xl text-white leading-none" style={{ fontFamily: F }}>PROFIL</h1>
            <img src="/images/paw.webp" alt="🐾" className="w-8 h-8 object-contain" />
          </div>
          <p className="text-sm text-gray-300">Deine Reise. Deine Entwicklung. Dein Erfolg.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2 px-4 mb-4">
        {[
          { icon: "📅", color: "#22c55e", val: String(stats.weeklyWorkouts), label: "Workouts\ndiese Woche" },
          { icon: "🔥", color: "#f97316", val: String(coachProgress.currentStreak), label: "Tage\nam Stück" },
          { icon: "🎯", color: "#a855f7", val: `${weeklyGoalPct}%`, label: "Wochenziel\nerreicht" },
          { icon: "⭐", color: "#eab308", val: selectedCoach, label: "Dein\nCoach" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
            <div className="text-xl mb-1">{s.icon}</div>
            <p className="font-black text-sm leading-tight" style={{ fontFamily: F, color: s.color }}>{s.val}</p>
            <p className="text-[8px] text-gray-600 leading-tight mt-0.5 whitespace-pre-line">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main Menu */}
      <div className="px-4 flex flex-col gap-3">

        {/* Einstellungen */}
        <button onClick={() => setSubScreen("einstellungen")} className="w-full text-left"
          style={{ background: "none", border: "none", padding: 0 }}>
          <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#f9731622" }}>
              <span style={{ color: "#f97316", fontSize: 24 }}>⚙️</span>
            </div>
            <div className="flex-1">
              <p className="font-black text-base text-white" style={{ fontFamily: F }}>EINSTELLUNGEN</p>
              <p className="text-xs text-gray-500 mt-0.5">Verwalte deine Daten & App Präferenzen.</p>
            </div>
            <span className="text-gray-600 text-xl">›</span>
          </div>
        </button>

        {/* Körperanalysen */}
        <button onClick={() => setSubScreen("koerper")} className="w-full text-left"
          style={{ background: "none", border: "none", padding: 0 }}>
          <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#06b6d422" }}>
              <span style={{ color: "#06b6d4", fontSize: 24 }}>🧍</span>
            </div>
            <div className="flex-1">
              <p className="font-black text-base text-white" style={{ fontFamily: F }}>KÖRPERANALYSEN</p>
              <p className="text-xs text-gray-500 mt-0.5">Analysiere deine Entwicklung & Performance.</p>
            </div>
            <span className="text-gray-600 text-xl">›</span>
          </div>
        </button>

        {/* Letzter Trainingsplan */}
        <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
          <div>
            <p className="text-xs text-gray-500 mb-1">Letzter Trainingsplan</p>
            <p className="font-black text-sm" style={{ fontFamily: F }}>
              <span style={{ color: "#f97316" }}>Push Day</span>
              <span className="text-gray-400"> · Oberkörper</span>
            </p>
          </div>
          <p className="text-xs text-gray-500">📅 Heute ›</p>
        </div>

      </div>
    </div>
  );
}
