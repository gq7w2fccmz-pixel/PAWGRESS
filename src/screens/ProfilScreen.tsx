import { useState } from "react";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useHistoryStore } from "../stores/historyStore";
import { usePlanStore } from "../stores/planStore";
import { useProfileStore } from "../stores/profileStore";
import { useCoachStore } from "../stores/coachStore";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

// All characters with their coach name for unlock checking
const ALL_AVATARS: { name: string; img: string; unlockHint: string }[] = [
  { name: "Bertl",  img: "/images/coach_bertl.webp",  unlockHint: "Startercharakter" },
  { name: "Lilly",  img: "/images/coach_lilly.webp",  unlockHint: "Startercharakter" },
  { name: "Pam",    img: "/images/coach_pam.webp",    unlockHint: "1 Workout absolvieren" },
  { name: "Bärli",  img: "/images/coach_baerli.webp", unlockHint: "2 Tage Streak" },
  { name: "Trude",  img: "/images/coach_trude.webp",  unlockHint: "10 Kraft-Workouts" },
  { name: "Fredl",  img: "/images/coach_fredl.webp",  unlockHint: "10 Cardio-Workouts" },
  { name: "Mia",    img: "/images/coach_mia.webp",    unlockHint: "10 Stretch-Workouts" },
  { name: "Willi",  img: "/images/coach_willi.webp",  unlockHint: "4× Bankdrücken PR" },
  { name: "Otto",   img: "/images/coach_otto.webp",   unlockHint: "20 Workouts gesamt" },
  { name: "Rocko",  img: "/images/coach_rocko.webp",  unlockHint: "50 Brust-Workouts" },
  { name: "Toro",   img: "/images/coach_toro.webp",   unlockHint: "50 Rücken-Workouts" },
  { name: "Rhino",  img: "/images/coach_rhino.webp",  unlockHint: "50 Schulter-Workouts" },
  { name: "Tim",    img: "/images/coach_tim.webp",    unlockHint: "50 Arm-Workouts" },
  { name: "Leon",   img: "/images/coach_leon.webp",   unlockHint: "50 Core-Workouts" },
  { name: "Olli",   img: "/images/coach_olli.webp",   unlockHint: "50 Bein-Workouts" },
  { name: "Wolfi",  img: "/images/coach_wolfi.webp",  unlockHint: "40 Workouts gesamt" },
  { name: "Leya",   img: "/images/coach_leya.webp",   unlockHint: "50 Cardio-Workouts" },
  { name: "Sen",    img: "/images/coach_sen.webp",    unlockHint: "50 Stretch-Workouts" },
];
// Always unlocked (starters)
const STARTER_NAMES = ["Bertl", "Lilly"];

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function IconPaw({ size = 28, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="17" rx="6.5" ry="6" fill={color}/>
      <ellipse cx="6.5" cy="12.5" rx="2.5" ry="3.5" fill={color}/>
      <ellipse cx="21.5" cy="12.5" rx="2.5" ry="3.5" fill={color}/>
      <ellipse cx="10" cy="7.5" rx="2" ry="2.8" fill={color}/>
      <ellipse cx="18" cy="7.5" rx="2" ry="2.8" fill={color}/>
    </svg>
  );
}
function IconFlame({ size = 24, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 7 7 7 12.5C7 15.5 9 18 12 18C15 18 17 15.5 17 12.5C17 10 15.5 8 14 7C14 8.5 13 10 12 10C10 10 9 8 9 7C9 4.5 12 2 12 2Z" fill={color}/>
      <path d="M12 18C10.3 18 9 16.7 9 15C9 13.5 10 12.5 12 12C14 12.5 15 13.5 15 15C15 16.7 13.7 18 12 18Z" fill="#fff" opacity="0.3"/>
    </svg>
  );
}
function IconTarget({ size = 22, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="5.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="2" fill={color}/>
      <line x1="16" y1="6" x2="19" y2="3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="17,3 19,3 19,5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconBars({ size = 22, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect x="2" y="13" width="4" height="7" rx="1" fill={color} opacity="0.4"/>
      <rect x="9" y="8" width="4" height="12" rx="1" fill={color} opacity="0.7"/>
      <rect x="16" y="3" width="4" height="17" rx="1" fill={color}/>
    </svg>
  );
}
function IconCalendar({ size = 22, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect x="2" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="1.5"/>
      <line x1="2" y1="9" x2="20" y2="9" stroke={color} strokeWidth="1.5"/>
      <line x1="7" y1="2" x2="7" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="2" x2="15" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <text x="11" y="17" textAnchor="middle" fontSize="7" fontWeight="bold" fill={color}>17</text>
    </svg>
  );
}
function IconUser({ size = 20, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke={color} strokeWidth="1.5"/>
      <path d="M3 18C3 14.5 6 12 10 12C14 12 17 14.5 17 18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconBell({ size = 20, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2C7 2 5 4.5 5 7V12L3 14H17L15 12V7C15 4.5 13 2 10 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8.5 16C8.5 16.8 9.2 17.5 10 17.5C10.8 17.5 11.5 16.8 11.5 16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function IconLock({ size = 20, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="4" y="9" width="12" height="9" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M7 9V6.5C7 4.6 8.3 3 10 3C11.7 3 13 4.6 13 6.5V9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="14" r="1.5" fill={color}/>
    </svg>
  );
}
function IconInfo({ size = 20, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.5"/>
      <line x1="10" y1="9" x2="10" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="6.5" r="1" fill={color}/>
    </svg>
  );
}

// ── Mini Charts ───────────────────────────────────────────────────────────────
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
  const last = pts[pts.length - 1].split(",");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={`g-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts.join(" ")} ${W},${H}`} fill={`url(#g-${color.replace("#","")})`} />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="5" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="3" fill="#080808" />
      <circle cx={last[0]} cy={last[1]} r="2" fill={color} />
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
function SettingRow({ iconEl, label, desc, onPress, last }: {
  iconEl: React.ReactNode; label: string; desc: string; onPress?: () => void; last?: boolean;
}) {
  return (
    <button onClick={onPress} className="w-full flex items-center gap-3 px-4 py-4 text-left"
      style={{ background:"none", border:"none", borderBottom: last ? "none" : "1px solid #1a1a1a" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background:"#1e1e1e" }}>{iconEl}</div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 4L10 8L6 12" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

// ── Profil Bearbeiten Screen ──────────────────────────────────────────────────
function ProfilEditScreen({ onBack }: { onBack: () => void }) {
  const { profile, updateProfile } = useProfileStore();
  const { coachProgress } = useCoachStore();
  const [name, setName]     = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatarImg);
  const [unit, setUnit]     = useState(profile.unit);
  const [dist, setDist]     = useState(profile.distUnit);
  const [lang, setLang]     = useState(profile.language);
  const [lockedTip, setLockedTip] = useState<string | null>(null);

  const unlockedNames = new Set([
    ...STARTER_NAMES,
    ...coachProgress.unlockedCoaches,
  ]);

  function isUnlocked(name: string) { return unlockedNames.has(name); }

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
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">DEIN NAME</p>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white font-bold outline-none"
            style={{ background:"#111", border:`1px solid ${name ? ORANGE : "#2a2a2a"}`, fontSize:16 }} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 tracking-widest font-bold">AVATAR</p>
            <p className="text-xs text-gray-600">
              {unlockedNames.size} / {ALL_AVATARS.length} freigeschaltet
            </p>
          </div>

          {/* Locked tip banner */}
          {lockedTip && (
            <div className="mb-3 px-3 py-2.5 rounded-xl flex items-center gap-2"
              style={{ background:"#1a1a1a", border:"1px solid #2a2a2a" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="#888" strokeWidth="1.2"/>
                <path d="M5.5 7V5C5.5 3.6 6.6 2.5 8 2.5C9.4 2.5 10.5 3.6 10.5 5V7" stroke="#888" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="1.2" fill="#888"/>
              </svg>
              <p className="text-xs text-gray-400 flex-1">{lockedTip}</p>
              <button onClick={() => setLockedTip(null)} style={{ background:"none", border:"none", color:"#555", fontSize:14, lineHeight:1 }}>✕</button>
            </div>
          )}

          <div className="grid grid-cols-4 gap-3">
            {ALL_AVATARS.map(ch => {
              const unlocked = isUnlocked(ch.name);
              const selected = avatar === ch.img;
              return (
                <button
                  key={ch.name}
                  onClick={() => {
                    if (unlocked) { setAvatar(ch.img); setLockedTip(null); }
                    else setLockedTip(`${ch.name}: ${ch.unlockHint}`);
                  }}
                  className="relative rounded-2xl overflow-hidden aspect-square"
                  style={{
                    border: selected ? `2.5px solid ${ORANGE}` : unlocked ? "2.5px solid #2a2a2a" : "2.5px solid transparent",
                    boxShadow: selected ? `0 0 14px ${ORANGE}66` : "none",
                    padding: 0,
                    background: "#111",
                  }}>
                  <img src={ch.img} alt={ch.name}
                    className="w-full h-full object-cover object-top"
                    style={{ filter: unlocked ? "none" : "brightness(0.25) grayscale(0.8)" }} />
                  {/* Lock overlay */}
                  {!unlocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="3" y="8" width="12" height="9" rx="2" fill="#333" stroke="#555" strokeWidth="1.2"/>
                        <path d="M6 8V6C6 4.3 7.3 3 9 3C10.7 3 12 4.3 12 6V8" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
                        <circle cx="9" cy="12.5" r="1.5" fill="#555"/>
                      </svg>
                    </div>
                  )}
                  {/* Selected badge */}
                  {selected && unlocked && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: ORANGE }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4.5 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  {/* Name label */}
                  <div className="absolute bottom-0 left-0 right-0 px-1 pb-1 pt-3"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}>
                    <p className="text-center font-black leading-none"
                      style={{ fontFamily: F, fontSize: 9, color: unlocked ? "#fff" : "#555" }}>
                      {ch.name.toUpperCase()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">SPRACHE</p>
          <Toggle value={lang} opts={["de","en"] as const} onChange={setLang} />
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">GEWICHTSEINHEIT</p>
          <Toggle value={unit} opts={["kg","lbs"] as const} onChange={setUnit} />
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">DISTANZEINHEIT</p>
          <Toggle value={dist} opts={["km","mi"] as const} onChange={setDist} />
        </div>
      </div>
    </div>
  );
}

function DatenschutzScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor:"#1e1e1e" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>DATENSCHUTZ</p>
      </div>
      <div className="rounded-2xl overflow-hidden mx-4 mt-4" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
        {[
          { iconEl:<IconLock color="#888"/>, label:"Konto", desc:"Kommt bald – derzeit ohne Verwendung" },
          { iconEl:<IconBars color="#888" size={18}/>, label:"Meine Daten", desc:"Trainings- und Verlaufsdaten" },
          { iconEl:<IconLock color="#888"/>, label:"Datensicherheit", desc:"Verschlüsselung & Datenschutz" },
        ].map((r, i, arr) => <SettingRow key={i} {...r} last={i===arr.length-1} />)}
      </div>
    </div>
  );
}

function UeberScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor:"#1e1e1e" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:"#fff",fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>ÜBER PAWGRESS</p>
      </div>
      <div className="rounded-2xl overflow-hidden mx-4 mt-4" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
        {[
          { iconEl:<IconInfo color="#888"/>, label:"Impressum", desc:"Rechtliche Angaben" },
          { iconEl:<IconInfo color="#888"/>, label:"App Info", desc:"Version, Lizenz & Changelog" },
          { iconEl:<IconInfo color="#888"/>, label:"Hilfe & Support", desc:"FAQ, Kontakt & Feedback" },
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

  const [sub, setSub]       = useState<SubScreen>(null);
  const [devTab, setDevTab] = useState<"volumen"|"stärke"|"workouts"|"übungen">("volumen");

  if (sub === "editProfil")  return <ProfilEditScreen  onBack={() => setSub(null)} />;
  if (sub === "datenschutz") return <DatenschutzScreen onBack={() => setSub(null)} />;
  if (sub === "ueber")       return <UeberScreen       onBack={() => setSub(null)} />;
  if (sub === "notif")       return <NotifScreen       onBack={() => setSub(null)} />;

  const volumeData = workouts.slice().reverse().map(w => w.totalVolume);
  const workoutCountData = (() => {
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

  const ms = new Date(profile.memberSince);
  const memberStr = `${String(ms.getDate()).padStart(2,"0")}.${String(ms.getMonth()+1).padStart(2,"0")}.${ms.getFullYear()}`;

  const DEV_TABS: { key: typeof devTab; label: string }[] = [
    { key:"volumen",  label:"VOLUMEN" },
    { key:"stärke",  label:"STÄRKE" },
    { key:"workouts", label:"WORKOUTS" },
    { key:"übungen",  label:"ÜBUNGEN" },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background:"#080808", color:"#fff" }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: 260 }}>
        <img src="/images/profil_hero.webp" alt=""
          className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition:"center 20%" }} />
        {/* Left dark gradient */}
        <div className="absolute inset-0" style={{
          background:"linear-gradient(to right, rgba(8,8,8,0.92) 45%, rgba(8,8,8,0.15) 100%)",
        }} />
        {/* Bottom fade */}
        <div className="absolute inset-0" style={{
          background:"linear-gradient(to bottom, transparent 45%, rgba(8,8,8,1) 100%)",
        }} />

        {/* Bertl mascot – right side, large */}
        <img src="/images/bertl.webp" alt=""
          className="absolute bottom-0 right-0 pointer-events-none select-none z-10"
          style={{ height: 250, width: "auto", objectFit: "contain", objectPosition: "bottom right" }} />

        {/* Title + avatar block */}
        <div className="relative z-20 px-4 pt-5">
          {/* PROFIL + paw */}
          <p className="font-black italic leading-none text-white" style={{ fontFamily:F, fontSize: 48 }}>PROFIL</p>
          <p className="text-sm text-gray-300">Deine Reise. Deine Entwicklung.</p>
          <p className="text-sm font-black" style={{ color:ORANGE }}>Dein Erfolg.</p>

          {/* Avatar + name */}
          <div className="flex items-center gap-3 mt-5">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
              style={{ border:`2.5px solid ${ORANGE}`, boxShadow:`0 0 16px ${ORANGE}55` }}>
              <img src={profile.avatarImg} alt="" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="font-black italic text-2xl text-white leading-tight" style={{ fontFamily:F }}>
                {profile.name.toUpperCase()}
              </p>
              <p className="text-xs text-gray-400">Seit {memberStr} dabei</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-5 mt-2">

        {/* ── QUICK STATS 4-grid ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
          <div className="grid grid-cols-4">
            {[
              {
                iconEl: <IconFlame size={22} color={ORANGE} />,
                label:"STREAK",
                val: String(streak),
                sub:"Tage",
                note:`Best: ${maxStreak} Tage`,
                noteColor:ORANGE,
              },
              {
                iconEl: <IconTarget size={20} color={ORANGE} />,
                label:"WOCHENZIEL",
                val: `${weekCount} / ${goal}`,
                sub:"Workouts",
                note:"Diese Woche",
                noteColor:"#888",
              },
              {
                iconEl: <IconBars size={20} color={ORANGE} />,
                label:"VOLUMEN",
                val: totalVolume > 0 ? `${(totalVolume/1000).toFixed(3)} kg` : "0 kg",
                sub:"vs. letzte Woche",
                note:"+18%",
                noteColor:"#22c55e",
              },
              {
                iconEl: <IconCalendar size={20} color={ORANGE} />,
                label:"AKTIVE PLÄNE",
                val: String(plans.length),
                sub:"Pläne",
                note:"",
                noteColor:"#888",
              },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center py-3 px-1 text-center"
                style={{ borderRight: i<3 ? "1px solid #1e1e1e" : "none" }}>
                <div className="mb-1 flex items-center justify-center" style={{ height: 26 }}>
                  {s.iconEl}
                </div>
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
            <button className="text-xs font-bold flex items-center gap-1" style={{ color:ORANGE, background:"none", border:"none" }}>
              Alle Statistiken
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 3L7.5 6L4.5 9" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex rounded-2xl overflow-hidden mb-3" style={{ background:"#111" }}>
            {DEV_TABS.map(t => (
              <button key={t.key} onClick={() => setDevTab(t.key)}
                className="flex-1 py-2.5 font-black text-[10px] text-center"
                style={{
                  fontFamily:F,
                  background:"transparent",
                  color: devTab===t.key ? ORANGE : "#555",
                  border: "none",
                  borderBottomStyle: "solid",
                  borderBottomWidth: 2,
                  borderBottomColor: devTab===t.key ? ORANGE : "transparent",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* VOLUMEN */}
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

          {/* STÄRKE */}
          {devTab === "stärke" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-3 col-span-2" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-black text-sm text-white" style={{ fontFamily:F }}>BANKDRÜCKEN LH</p>
                    <p className="text-xs text-gray-500">1RM Entwicklung</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:"#ef444422", border:"1px solid #ef444433" }}>
                    <IconBars size={18} color="#ef4444" />
                  </div>
                </div>
                <p className="font-black text-3xl text-white mb-0.5" style={{ fontFamily:F }}>
                  {(() => {
                    const best = workouts.flatMap(w => w.exercises).filter(e => e.name.toLowerCase().includes("bankdrücken") || e.name.toLowerCase().includes("bench")).map(e => e.bestSet?.weight ?? 0);
                    return best.length > 0 ? `${Math.max(...best)} kg` : "– kg";
                  })()}
                </p>
                <p className="text-xs font-bold mb-2" style={{ color:"#22c55e" }}>+5 kg vs. vor 30 Tagen</p>
                <LineChart data={[85,90,95,97,100,100,105,105]} color="#ef4444" height={80} />
              </div>
            </div>
          )}

          {/* WORKOUTS */}
          {devTab === "workouts" && (
            <div className="rounded-2xl p-4" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-black text-sm text-white" style={{ fontFamily:F }}>WORKOUTS</p>
                  <p className="text-xs text-gray-500">Letzte 8 Wochen</p>
                </div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:`${ORANGE}22`, border:`1px solid ${ORANGE}33` }}>
                  <IconCalendar size={18} color={ORANGE} />
                </div>
              </div>
              <p className="font-black text-3xl text-white mb-1" style={{ fontFamily:F }}>{totalWorkoutCount}</p>
              <p className="text-xs text-gray-500 mb-3">Workouts gesamt</p>
              <BarChart data={workoutCountData.length > 0 ? workoutCountData : [1,2,3,4,5,4,6,8]} color={ORANGE} height={80} />
            </div>
          )}

          {/* ÜBUNGEN */}
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
            <SettingRow iconEl={<IconUser color="#888"/>}  label="Profil bearbeiten"  desc="Name, Avatar, Ziele"          onPress={() => setSub("editProfil")} />
            <SettingRow iconEl={<IconBell color="#888"/>}  label="Benachrichtigungen" desc="Erinnerungen & Updates"        onPress={() => setSub("notif")} />
            <SettingRow iconEl={<IconLock color="#888"/>}  label="Datenschutz"        desc="Deine Daten & Sicherheit"      onPress={() => setSub("datenschutz")} />
            <SettingRow iconEl={<IconInfo color="#888"/>}  label="Über Pawgress"      desc="App Info, Hilfe & Support"     onPress={() => setSub("ueber")} last />
          </div>
        </div>

      </div>
    </div>
  );
}
