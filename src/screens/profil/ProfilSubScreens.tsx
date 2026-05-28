/**
 * Profil Sub-Screens & shared components
 * Ausgelagert aus ProfilScreen.tsx:
 *  - SettingRow
 *  - ProfilEditScreen
 *  - DatenschutzScreen
 *  - UeberScreen
 *  - NotifScreen
 */

import { useState } from "react";
import { IconUser, IconBell, IconLock, IconInfo } from "../../components/icons";
import type { ReactNode } from "react";
import { useProfileStore } from "../../stores/profileStore";
import { useCoachStore }   from "../../stores/coachStore";
import { saveProfile }     from "../../lib/syncService";
import { F, ORANGE, COPPER, COPPER_L, COPPER_G, SURF, SURF2, BORDER, CARD, CARD2, BORDER2, GREEN, RED, BG } from "../../styles/tokens";
import { IconBars } from "../../components/icons";


// ── All coach avatars (needed for avatar picker) ───────────────────────────────
const STARTER_NAMES = ["Bertl", "Lilly"];
export const ALL_AVATARS: { name: string; img: string; unlockHint: string }[] = [
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

// ── SettingRow ─────────────────────────────────────────────────────────────────
export function SettingRow({
  iconEl, label, desc, onPress, last,
}: {
  iconEl:   ReactNode;
  label:    string;
  desc:     string;
  onPress?: () => void;
  last?:    boolean;
}) {
  return (
    <button onClick={onPress} className="w-full flex items-center gap-3 px-4 py-4 text-left"
      style={{ background:"none", border:"none", borderBottom: last ? "none" : "1px solid #1a1a1a" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background:`${SURF2}` }}>{iconEl}</div>
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

// ── ProfilEditScreen ───────────────────────────────────────────────────────────
export function ProfilEditScreen({ onBack }: { onBack: () => void }) {
  const { profile, updateProfile } = useProfileStore();
  const { coachProgress }          = useCoachStore();
  const [name,      setName]       = useState(profile.name);
  const [avatar,    setAvatar]     = useState(profile.avatarImg);
  const [unit,      setUnit]       = useState(profile.unit);
  const [dist,      setDist]       = useState(profile.distUnit);
  const [lang,      setLang]       = useState(profile.language);
  const [lockedTip, setLockedTip]  = useState<string | null>(null);

  const unlockedNames = new Set([...STARTER_NAMES, ...coachProgress.unlockedCoaches]);
  const isUnlocked = (n: string) => unlockedNames.has(n);

  async function save() {
    const updates = {
      name: name.trim() || "Champion",
      avatarImg: avatar, unit,
      distUnit: dist,
      language: lang,
    };
    updateProfile(updates);
    await saveProfile({ ...profile, ...updates });
    onBack();
  }

  function Toggle<T extends string>({
    value, opts, onChange,
  }: { value: T; opts: readonly T[]; onChange: (v: T) => void }) {
    return (
      <div className="flex rounded-xl overflow-hidden" style={{ background:`${SURF2}` }}>
        {opts.map(o => (
          <button key={o} onClick={() => onChange(o)}
            className="flex-1 py-2 text-sm font-black"
            style={{ fontFamily:F, background: value===o ? `linear-gradient(135deg, ${COPPER} 0%, ${COPPER_L} 100%)` : "transparent",
              color: value===o ? "#fff" : "#666", border:"none" }}>
            {o}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b sticky top-0 z-10"
        style={{ background:"#080808", borderColor:`${BORDER}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#fff", fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>PROFIL BEARBEITEN</p>
        <button onClick={save} className="px-4 py-2 rounded-xl font-black text-sm"
          style={{ background:`linear-gradient(135deg, #b8660a 0%, #e8a050 40%, #cd7f32 100%)`, color:"#fff", fontFamily:F, border:"none" }}>SPEICHERN</button>
      </div>

      <div className="px-4 pt-6 flex flex-col gap-6">
        {/* Name */}
        <div>
          <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">DEIN NAME</p>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white font-bold outline-none"
            style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${name ? COPPER_L : BORDER}`, fontSize:16 }} />
        </div>

        {/* Avatar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 tracking-widest font-bold">AVATAR</p>
            <p className="text-xs text-gray-600">{unlockedNames.size} / {ALL_AVATARS.length} freigeschaltet</p>
          </div>
          {lockedTip && (
            <div className="mb-3 px-3 py-2.5 rounded-xl flex items-center gap-2"
              style={{ background:`${SURF2}`, border:`1px solid ${BORDER}` }}>
              <IconLock size={16} color="#888" />
              <p className="text-xs text-gray-400 flex-1">{lockedTip}</p>
              <button onClick={() => setLockedTip(null)}
                style={{ background:"none", border:"none", color:COPPER, fontSize:14, lineHeight:1 }}>✕</button>
            </div>
          )}
          <div className="grid grid-cols-4 gap-3">
            {ALL_AVATARS.map(ch => {
              const unlocked = isUnlocked(ch.name);
              const selected = avatar === ch.img;
              return (
                <button key={ch.name}
                  onClick={() => {
                    if (unlocked) { setAvatar(ch.img); setLockedTip(null); }
                    else setLockedTip(`${ch.name}: ${ch.unlockHint}`);
                  }}
                  className="relative rounded-2xl overflow-hidden aspect-square"
                  style={{
                    border:     selected ? `2.5px solid ${COPPER_L}` : unlocked ? "2.5px solid #2a2a2a" : "2.5px solid transparent",
                    boxShadow:  selected ? `0 0 14px ${COPPER_G}` : "none",
                    padding: 0, background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`,
                  }}>
                  <img src={ch.img} alt={ch.name}
                    className="w-full h-full object-cover object-top"
                    style={{ filter: unlocked ? "none" : "brightness(0.25) grayscale(0.8)" }} />
                  {!unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconLock size={18} color="#555" />
                    </div>
                  )}
                  {selected && unlocked && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background:`linear-gradient(135deg, ${COPPER} 0%, ${COPPER_L} 100%)` }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4.5 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 px-1 pb-1 pt-3"
                    style={{ background:"linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}>
                    <p className="text-center font-black leading-none"
                      style={{ fontFamily:F, fontSize:9, color: unlocked ? "#fff" : "#555" }}>
                      {ch.name.toUpperCase()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Einstellungen */}
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

// ── DatenschutzScreen ──────────────────────────────────────────────────────────
export function DatenschutzScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor:`${BORDER}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#fff", fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>DATENSCHUTZ</p>
      </div>
      <div className="rounded-2xl overflow-hidden mx-4 mt-4" style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${BORDER}` }}>
        {[
          { iconEl:<IconLock color="#888"/>, label:"Konto",         desc:"Kommt bald – derzeit ohne Verwendung" },
          { iconEl:<IconBars color="#888" size={18}/>, label:"Meine Daten", desc:"Trainings- und Verlaufsdaten" },
          { iconEl:<IconLock color="#888"/>, label:"Datensicherheit", desc:"Verschlüsselung & Datenschutz" },
        ].map((r, i, arr) => <div key={i}><SettingRow {...r} last={i===arr.length-1} /></div>)}
      </div>
    </div>
  );
}

// ── UeberScreen ────────────────────────────────────────────────────────────────
export function UeberScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor:`${BORDER}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#fff", fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>ÜBER PAWGRESS</p>
      </div>
      <div className="rounded-2xl overflow-hidden mx-4 mt-4" style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${BORDER}` }}>
        {[
          { iconEl:<IconInfo color="#888"/>, label:"Impressum",      desc:"Rechtliche Angaben" },
          { iconEl:<IconInfo color="#888"/>, label:"App Info",       desc:"Version, Lizenz & Changelog" },
          { iconEl:<IconInfo color="#888"/>, label:"Hilfe & Support", desc:"FAQ, Kontakt & Feedback" },
        ].map((r, i, arr) => <div key={i}><SettingRow {...r} last={i===arr.length-1} /></div>)}
      </div>
      <div className="flex flex-col items-center mt-8 gap-1">
        <img src="/images/paw.webp" alt="" className="w-10 h-10 object-contain opacity-30" />
        <p className="text-xs text-gray-700 font-black" style={{ fontFamily:F }}>PAWGRESS v1.0</p>
        <p className="text-[10px] text-gray-800">No Excuses. Just Pawgress.</p>
      </div>
    </div>
  );
}

// ── NotifScreen ────────────────────────────────────────────────────────────────
export function NotifScreen({ onBack }: { onBack: () => void }) {
  const [reminders, setReminders] = useState(true);
  const [updates,   setUpdates]   = useState(true);
  const [prs,       setPrs]       = useState(true);

  function Switch({ val, set }: { val: boolean; set: (v: boolean) => void }) {
    return (
      <button onClick={() => set(!val)}
        className="relative w-12 h-6 rounded-full flex-shrink-0"
        style={{ background: val ? `linear-gradient(135deg, ${COPPER} 0%, ${COPPER_L} 100%)` : SURF2, border:"none", transition:"background 0.2s" }}>
        <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
          style={{ left: val ? "calc(100% - 22px)" : "2px", transition:"left 0.2s" }} />
      </button>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background:"#080808", color:"#fff" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor:`${BORDER}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#fff", fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>BENACHRICHTIGUNGEN</p>
      </div>
      <div className="rounded-2xl overflow-hidden mx-4 mt-4" style={{ background:`linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border:`1px solid ${BORDER}` }}>
        {[
          { label:"Trainings-Erinnerungen", desc:"Täglich zur gesetzten Zeit",      val:reminders, set:setReminders },
          { label:"App Updates",            desc:"Neue Funktionen & Verbesserungen", val:updates,   set:setUpdates },
          { label:"PR Benachrichtigungen",  desc:"Neue persönliche Rekorde",        val:prs,       set:setPrs },
        ].map((r, i, arr) => (
          <div key={i} className="flex items-center gap-3 px-4 py-4"
            style={{ borderBottom: i < arr.length-1 ? "1px solid #1a1a1a" : "none" }}>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{r.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
            </div>
            <Switch val={r.val} set={r.set} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SettingsScreen ─────────────────────────────────────────────────────────────
export function SettingsScreen({
  onBack,
  onNav,
}: {
  onBack: () => void;
  onNav:  (sub: string) => void;
}) {

  const items = [
    { key: "editProfil",  iconEl: <IconUser color={COPPER_L}/>, label: "Profil bearbeiten",  desc: "Name, Avatar, Ziele" },
    { key: "notif",       iconEl: <IconBell color={COPPER_L}/>, label: "Benachrichtigungen", desc: "Erinnerungen & Updates" },
    { key: "datenschutz", iconEl: <IconLock color={COPPER_L}/>, label: "Datenschutz",        desc: "Deine Daten & Sicherheit" },
    { key: "ueber",       iconEl: <IconInfo color={COPPER_L}/>, label: "Über Pawgress",      desc: "App Info, Hilfe & Support" },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0807", color: "#fff" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-5">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke={COPPER_L} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p className="font-black italic text-3xl text-white leading-none" style={{ fontFamily: F }}>
          EINSTELLUNGEN
        </p>
      </div>

      {/* Items */}
      <div className="px-4 flex flex-col gap-2">
        {items.map((item, i) => (
          <button key={item.key} onClick={() => onNav(item.key)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
            style={{
              background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`,
              border: `1px solid ${BORDER}`,
              boxShadow: `0 0 12px ${COPPER_G}, inset 0 1px 0 rgba(205,127,50,0.08)`,
            }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(205,127,50,0.12)", border: "1px solid rgba(205,127,50,0.25)" }}>
              {item.iconEl}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{item.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#cd7f32" }}>{item.desc}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke={COPPER_L} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
