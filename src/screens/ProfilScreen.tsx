import { useState } from "react";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useHistoryStore } from "../stores/historyStore";
import { usePlanStore } from "../stores/planStore";
import { useProfileStore } from "../stores/profileStore";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

// ── Avatar options ────────────────────────────────────────────────────────────
const AVATARS = [
  "/images/coach_bertl.webp", "/images/coach_lilly.webp", "/images/coach_rocko.webp",
  "/images/coach_toro.webp",  "/images/coach_tim.webp",   "/images/coach_olli.webp",
  "/images/coach_rhino.webp", "/images/coach_leon.webp",  "/images/coach_pam.webp",
  "/images/coach_fredl.webp",
];

// ── Mini line chart ───────────────────────────────────────────────────────────
function LineChart({ data, color, height = 80 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return <div style={{ height }} />;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const W = 300; const H = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 10) - 5;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const last = pts[pts.length - 1].split(",");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={`g-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${H} ${pts.join(" ")} ${W},${H}`}
        fill={`url(#g-${color.replace("#","")})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="4" fill={color} />
    </svg>
  );
}

function BarChart({ data, color, height = 70 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data, 1);
  const barW = 100 / data.length * 0.6;
  const gap  = 100 / data.length * 0.4;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height }}>
      {data.map((v, i) => {
        const barH = (v / max) * 85;
        const x = i * (barW + gap) + gap / 2;
        return (
          <rect key={i} x={x} y={100 - barH} width={barW} height={barH}
            rx="1" fill={i === data.length - 1 ? color : `${color}88`} />
        );
      })}
    </svg>
  );
}

// ── Setting Row ───────────────────────────────────────────────────────────────
function SettingRow({ icon, label, desc, onPress, last }: {
  icon: string; label: string; desc: string; onPress?: () => void; last?: boolean;
}) {
  return (
    <button onClick={onPress} className="w-full flex items-center gap-3 px-4 py-4 text-left"
      style={{ background:"none", border:"none", borderBottom: last ? "none" : "1px solid #1a1a1a" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
        style={{ background:"#1e1e1e" }}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <span className="text-gray-600">›</span>
    </button>
  );
}

// ── Profil Bearbeiten Screen ──────────────────────────────────────────────────
function ProfilEditScreen({ onBack }: { onBack: () => void }) {
  const { profile, updateProfile } = useProfileStore();
  const [name, setName]     = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatarImg);
  const [unit, setUnit]     = useState(profile.unit);
  const [dist, setDist]     = useState(profile.distUnit);
  const [lang, setLang]     = useState(profile.language);

  function save() {
    updateProfile({ name: name.trim() || "Champion", avatarImg: avatar, unit, distUnit: dist, language: lang });
    onBack();
  }

  function Toggle<T extends string>({ value, opts, onChange }: { value: T; opts: T[]; onChange: (v: T) => void }) {
    return (
      <div className="flex rounded-xl overflow-hidden" style={{ background:"#1a1a1a" }}>
        {opts.map(o => (
          <button key={o} onClick={() => onChange(o)}
            className="flex-1 py-2 text-sm font-black"
            style={{ fontFamily:F, background: value===o ? ORANGE : "transparent", color: value===o ? "#fff" : "#666", border:"none" }}>
            {o}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b sticky top-0 z-10" style={{ background:"#080808", borderColor:"#1e1e1e" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>PROFIL BEARBEITEN</p>
        <button onClick={save} className="px-4 py-2 rounded-xl font-black text-sm"
          style={{ background:ORANGE, color:"#fff", fontFamily:F, border:"none" }}>SPEICHERN</button>
      </div>
      <div className="px-4 pt-6 flex flex-col gap-6">
        {/* Name */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">DEIN NAME</p>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white font-bold outline-none"
            style={{ background:"#111", border:`1px solid ${name ? ORANGE : "#2a2a2a"}`, fontSize:16 }} />
        </div>

        {/* Avatar */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-3 font-bold">AVATAR</p>
          <div className="grid grid-cols-5 gap-3">
            {AVATARS.map(img => (
              <button key={img} onClick={() => setAvatar(img)}
                className="rounded-2xl overflow-hidden aspect-square"
                style={{ border:`2.5px solid ${avatar===img ? ORANGE : "transparent"}`,
                  boxShadow: avatar===img ? `0 0 12px ${ORANGE}66` : "none" }}>
                <img src={img} alt="" className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">SPRACHE</p>
          <Toggle value={lang} opts={["de","en"] as const} onChange={setLang} />
        </div>

        {/* Unit */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">GEWICHTSEINHEIT</p>
          <Toggle value={unit} opts={["kg","lbs"] as const} onChange={setUnit} />
        </div>

        {/* Distance */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">DISTANZEINHEIT</p>
          <Toggle value={dist} opts={["km","mi"] as const} onChange={setDist} />
        </div>
      </div>
    </div>
  );
}

// ── Datenschutz Screen ────────────────────────────────────────────────────────
function DatenschutzScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor:"#1e1e1e" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>DATENSCHUTZ</p>
      </div>
      <div className="rounded-2xl overflow-hidden mx-4 mt-4" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
        {[
          { icon:"🔐", label:"Konto", desc:"Kommt bald – derzeit ohne Verwendung" },
          { icon:"📊", label:"Meine Daten", desc:"Trainings- und Verlaufsdaten" },
          { icon:"🛡", label:"Datensicherheit", desc:"Verschlüsselung & Datenschutz" },
        ].map((r, i, arr) => <SettingRow key={i} {...r} last={i===arr.length-1} />)}
      </div>
    </div>
  );
}

// ── Über Pawgress Screen ──────────────────────────────────────────────────────
function UeberScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor:"#1e1e1e" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>ÜBER PAWGRESS</p>
      </div>
      <div className="rounded-2xl overflow-hidden mx-4 mt-4" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
        {[
          { icon:"📋", label:"Impressum", desc:"Rechtliche Angaben" },
          { icon:"ℹ️", label:"App Info", desc:"Version, Lizenz & Changelog" },
          { icon:"🆘", label:"Hilfe & Support", desc:"FAQ, Kontakt & Feedback" },
        ].map((r, i, arr) => <SettingRow key={i} {...r} last={i===arr.length-1} />)}
      </div>
      <div className="flex flex-col items-center mt-8 gap-1">
        <img src="/images/paw.webp" alt="" className="w-10 h-10 object-contain opacity-30" />
        <p className="text-xs text-gray-700 font-black" style={{ fontFamily:F }}>PAWGRESS v1.0</p>
        <p className="text-[10px] text-gray-800">No Excuses. Just Pawgress.</p>
      </div>
    </div>
  );
}

// ── Benachrichtigungen Screen ─────────────────────────────────────────────────
function NotifScreen({ onBack }: { onBack: () => void }) {
  const [reminders, setReminders] = useState(true);
  const [updates, setUpdates]     = useState(true);
  const [prs, setPrs]             = useState(true);
  function SW({ val, set }: { val: boolean; set: (v: boolean) => void }) {
    return (
      <button onClick={() => set(!val)}
        className="relative w-12 h-6 rounded-full flex-shrink-0"
        style={{ background: val ? ORANGE : "#333", border:"none", transition:"background 0.2s" }}>
        <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
          style={{ left: val ? "calc(100% - 22px)" : "2px", transition:"left 0.2s" }} />
      </button>
    );
  }
  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor:"#1e1e1e" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>BENACHRICHTIGUNGEN</p>
      </div>
      <div className="rounded-2xl overflow-hidden mx-4 mt-4" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
        {[
          { label:"Trainings-Erinnerungen", desc:"Täglich zur gesetzten Zeit", val:reminders, set:setReminders },
          { label:"App Updates", desc:"Neue Funktionen & Verbesserungen", val:updates, set:setUpdates },
          { label:"PR Benachrichtigungen", desc:"Neue persönliche Rekorde", val:prs, set:setPrs },
        ].map((r, i, arr) => (
          <div key={i} className="flex items-center gap-3 px-4 py-4"
            style={{ borderBottom: i<arr.length-1 ? "1px solid #1a1a1a" : "none" }}>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{r.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
            </div>
            <SW val={r.val} set={r.set} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ProfilScreen ─────────────────────────────────────────────────────────
type SubScreen = null | "editProfil" | "datenschutz" | "ueber" | "notif";

export function ProfilScreen() {
  const { stats, weeklyGoal, coachProgress } = usePawgressStore();
  const { profile } = useProfileStore();
  const plans       = usePlanStore(s => s.plans);
  const workouts    = useHistoryStore(s => s.getRecentWorkouts)(20);
  const weekCount   = stats.weeklyWorkouts;
  const goal        = weeklyGoal ?? 4;
  const streak      = coachProgress.currentStreak;
  const maxStreak   = coachProgress.maxStreak;

  const [sub, setSub]   = useState<SubScreen>(null);
  const [devTab, setDevTab] = useState<"volumen"|"stärke"|"workouts"|"übungen">("volumen");

  if (sub === "editProfil")  return <ProfilEditScreen  onBack={() => setSub(null)} />;
  if (sub === "datenschutz") return <DatenschutzScreen onBack={() => setSub(null)} />;
  if (sub === "ueber")       return <UeberScreen       onBack={() => setSub(null)} />;
  if (sub === "notif")       return <NotifScreen       onBack={() => setSub(null)} />;

  // Chart data from history
  const volumeData = workouts.slice().reverse().map(w => w.totalVolume);
  const workoutCountData = (() => {
    // Group by week (last 8 weeks)
    const weeks = Array(8).fill(0);
    const now = Date.now();
    workouts.forEach(w => {
      const ago = Math.floor((now - new Date(w.date).getTime()) / (7 * 86400000));
      if (ago < 8) weeks[7 - ago]++;
    });
    return weeks;
  })();

  const totalVolume = workouts.reduce((a, w) => a + w.totalVolume, 0);
  const totalWorkoutCount = workouts.length;

  // Member since formatted
  const ms = new Date(profile.memberSince);
  const memberStr = `${String(ms.getDate()).padStart(2,"0")}.${String(ms.getMonth()+1).padStart(2,"0")}.${ms.getFullYear()}`;

  const DEV_TABS: { key: typeof devTab; label: string }[] = [
    { key:"volumen",   label:"VOLUMEN" },
    { key:"stärke",   label:"STÄRKE" },
    { key:"workouts",  label:"WORKOUTS" },
    { key:"übungen",   label:"ÜBUNGEN" },
  ];

  function fmtVol(v: number) {
    if (v >= 1000) return `${(v/1000).toFixed(3).replace(".",".").replace(/(\d)(?=(\d{3})+\.)/g, "$1.")} kg`;
    return `${Math.round(v)} kg`;
  }

  return (
    <div className="min-h-screen pb-28" style={{ background:"#080808", color:"#fff" }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: 230 }}>
        <img src="/images/profil_hero.webp" alt=""
          className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition:"center 20%" }} />
        <div className="absolute inset-0" style={{
          background:"linear-gradient(to right, rgba(8,8,8,0.9) 40%, rgba(8,8,8,0.2) 100%)",
        }} />
        <div className="absolute inset-0" style={{
          background:"linear-gradient(to bottom, transparent 50%, rgba(8,8,8,1) 100%)",
        }} />

        {/* Settings icon */}
        <div className="absolute top-5 right-4 z-10">
          <button onClick={() => setSub("editProfil")}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(0,0,0,0.6)", border:"1px solid #2a2a2a" }}>
            <span className="text-lg text-gray-400">⚙️</span>
          </button>
        </div>

        {/* Title */}
        <div className="relative z-10 px-4 pt-5">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-black italic text-5xl text-white leading-none" style={{ fontFamily:F }}>PROFIL</p>
            <span style={{ color:ORANGE, fontSize:28 }}>🐾</span>
          </div>
          <p className="text-sm text-gray-300">Deine Reise. Deine Entwicklung.</p>
          <p className="text-sm font-black" style={{ color:ORANGE }}>Dein Erfolg.</p>
        </div>

        {/* Avatar + name */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden"
            style={{ border:`2.5px solid ${ORANGE}`, boxShadow:`0 0 16px ${ORANGE}55` }}>
            <img src={profile.avatarImg} alt="" className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <p className="font-black italic text-2xl text-white" style={{ fontFamily:F }}>
              {profile.name.toUpperCase()}
            </p>
            <p className="text-xs text-gray-400">Seit {memberStr} dabei</p>
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-5 mt-2">

        {/* ── QUICK STATS 4-grid ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
          <div className="grid grid-cols-4 divide-x" style={{ borderColor:"#1e1e1e" }}>
            {[
              { icon:"🔥", label:"STREAK",       val: String(streak), sub:"Tage", note:`Best: ${maxStreak} Tage`, noteColor:ORANGE },
              { icon:"🎯", label:"WOCHENZIEL",    val: `${weekCount} / ${goal}`, sub:"Workouts", note:"Diese Woche", noteColor:"#888" },
              { icon:"📊", label:"VOLUMEN",       val: totalVolume > 0 ? `${(totalVolume/1000).toFixed(3)} kg` : "0 kg", sub:"vs. letzte Woche", note:"+18%", noteColor:"#22c55e" },
              { icon:"📅", label:"AKTIVE PLÄNE",  val: String(plans.length), sub:"Pläne", note:"", noteColor:"#888" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center py-3 px-1 text-center"
                style={{ borderRight: i<3 ? "1px solid #1e1e1e" : "none" }}>
                <span className="text-xl mb-1">{s.icon}</span>
                <p className="text-[8px] text-gray-600 tracking-widest font-bold mb-1">{s.label}</p>
                <p className="font-black text-xl text-white leading-none" style={{ fontFamily:F }}>{s.val}</p>
                <p className="text-[9px] text-gray-500 mt-0.5">{s.sub}</p>
                {s.note && <p className="text-[9px] font-bold mt-0.5" style={{ color:s.noteColor }}>{s.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* ── MEINE ENTWICKLUNG ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black italic text-xl text-white" style={{ fontFamily:F }}>MEINE ENTWICKLUNG</p>
            <button className="text-xs font-bold" style={{ color:ORANGE, background:"none", border:"none" }}>
              Alle Statistiken ›
            </button>
          </div>

          {/* Tabs */}
          <div className="flex rounded-2xl overflow-hidden mb-3" style={{ background:"#111" }}>
            {DEV_TABS.map(t => (
              <button key={t.key} onClick={() => setDevTab(t.key)}
                className="flex-1 py-2.5 font-black text-[10px] text-center"
                style={{ fontFamily:F,
                  background:"transparent",
                  color: devTab===t.key ? ORANGE : "#555",
                  borderBottom: devTab===t.key ? `2px solid ${ORANGE}` : "2px solid transparent",
                  border: "none",
                  borderBottomStyle: "solid",
                  borderBottomWidth: 2,
                  borderBottomColor: devTab===t.key ? ORANGE : "transparent",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* VOLUMEN TAB */}
          {devTab === "volumen" && (
            <div className="rounded-2xl p-4" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-black text-sm text-white" style={{ fontFamily:F }}>VOLUMEN ENTWICKLUNG</p>
                  <p className="text-xs text-gray-500">Letzte 8 Wochen</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-white" style={{ fontFamily:F }}>
                    {totalVolume > 0 ? `${(totalVolume/1000).toFixed(3)} kg` : "0 kg"}
                  </p>
                  <p className="text-xs font-bold" style={{ color:"#22c55e" }}>+18%</p>
                  <p className="text-[9px] text-gray-600">vs. letzte Woche</p>
                </div>
              </div>
              {volumeData.length > 1
                ? <LineChart data={volumeData} color={ORANGE} height={90} />
                : <div className="flex items-center justify-center py-6 text-gray-600 text-sm">
                    Noch keine Daten – starte dein erstes Workout!
                  </div>
              }
            </div>
          )}

          {/* STÄRKE TAB */}
          {devTab === "stärke" && (
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-2xl p-4" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-black text-sm text-white" style={{ fontFamily:F }}>BANKDRÜCKEN LH</p>
                    <p className="text-xs text-gray-500">1RM Entwicklung</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background:"#ef444422" }}>
                    <span className="text-red-400 text-sm">🏋️</span>
                  </div>
                </div>
                <p className="font-black text-3xl text-white" style={{ fontFamily:F }}>
                  {/* Best bench press from history */}
                  {(() => {
                    const best = workouts.flatMap(w => w.exercises).filter(e => e.name.toLowerCase().includes("bankdrücken") || e.name.toLowerCase().includes("bench")).map(e => e.bestSet?.weight ?? 0);
                    return best.length > 0 ? `${Math.max(...best)} kg` : "– kg";
                  })()}
                </p>
                <LineChart data={[85,90,95,97,100,100,105,105]} color="#ef4444" height={80} />
              </div>
            </div>
          )}

          {/* WORKOUTS TAB */}
          {devTab === "workouts" && (
            <div className="rounded-2xl p-4" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-black text-sm text-white" style={{ fontFamily:F }}>WORKOUTS</p>
                  <p className="text-xs text-gray-500">Letzte 8 Wochen</p>
                </div>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background:`${ORANGE}22` }}>
                  <span className="text-sm" style={{ color:ORANGE }}>📅</span>
                </div>
              </div>
              <p className="font-black text-3xl text-white mb-1" style={{ fontFamily:F }}>{totalWorkoutCount}</p>
              <p className="text-xs text-gray-500 mb-3">Workouts gesamt</p>
              <BarChart data={workoutCountData.length > 0 ? workoutCountData : [1,2,3,4,5,4,6,8]} color={ORANGE} height={80} />
            </div>
          )}

          {/* ÜBUNGEN TAB */}
          {devTab === "übungen" && (
            <div className="rounded-2xl p-4" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
              <p className="font-black text-sm text-white mb-3" style={{ fontFamily:F }}>TOP ÜBUNGEN</p>
              {workouts.length === 0
                ? <p className="text-gray-600 text-sm text-center py-4">Noch keine Workouts absolviert.</p>
                : (() => {
                  const freq: Record<string, number> = {};
                  workouts.forEach(w => w.exercises.forEach(e => { freq[e.name] = (freq[e.name]??0)+1; }));
                  return Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,5).map(([name, count], i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor:"#1a1a1a" }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                        style={{ background:`${ORANGE}22`, color:ORANGE, fontFamily:F }}>{i+1}</div>
                      <p className="flex-1 text-sm text-white font-bold truncate">{name}</p>
                      <p className="text-xs text-gray-500">{count}×</p>
                    </div>
                  ));
                })()
              }
            </div>
          )}
        </div>

        {/* ── EINSTELLUNGEN ── */}
        <div>
          <p className="font-black italic text-xl text-white mb-3" style={{ fontFamily:F }}>EINSTELLUNGEN</p>
          <div className="rounded-2xl overflow-hidden" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
            <SettingRow icon="👤" label="Profil bearbeiten"    desc="Name, Avatar, Sprache, Einheit"    onPress={() => setSub("editProfil")} />
            <SettingRow icon="🔔" label="Benachrichtigungen"   desc="Erinnerungen & Updates"            onPress={() => setSub("notif")} />
            <SettingRow icon="🔒" label="Datenschutz"          desc="Deine Daten & Sicherheit"         onPress={() => setSub("datenschutz")} />
            <SettingRow icon="ℹ️" label="Über Pawgress"        desc="App Info, Hilfe & Support"        onPress={() => setSub("ueber")} last />
          </div>
        </div>

      </div>
    </div>
  );
}
