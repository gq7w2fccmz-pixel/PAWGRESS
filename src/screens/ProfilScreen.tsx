/**
 * ProfilScreen – schlanke Hauptkomponente
 * Sub-Screens und gemeinsame Komponenten ausgelagert:
 *   ./profil/ProfilSubScreens.tsx  → SettingRow, ProfilEditScreen, DatenschutzScreen, UeberScreen, NotifScreen
 *   ../components/icons/index.tsx  → alle SVG-Icons
 *   ../components/charts/index.tsx → LineChart, BarChart
 */

import { useState } from "react";
import { useStatsStore }   from "../stores/statsStore";
import { useCoachStore }   from "../stores/coachStore";
import { useHistoryStore } from "../stores/historyStore";
import { usePlanStore }    from "../stores/planStore";
import { useProfileStore } from "../stores/profileStore";
import { useAuthStore }    from "../stores/authStore";
import {
  IconFlame, IconTarget, IconBars, IconCalendar,
  IconUser, IconBell, IconLock, IconInfo,
} from "../components/icons";
import { LineChart, BarChart } from "../components/charts";
import { F, ORANGE, COPPER, COPPER_L, COPPER_G, SURF, SURF2, BORDER, CARD, CARD2, BORDER2, GREEN, RED, BG } from "../styles/tokens";
import {
  SettingRow,
  ProfilEditScreen,
  DatenschutzScreen,
  UeberScreen,
  NotifScreen,
  SettingsScreen,
} from "./profil/ProfilSubScreens";


type SubScreen = null | "editProfil" | "datenschutz" | "ueber" | "notif" | "settings";

export function ProfilScreen() {
  const stats         = useStatsStore(s => s.stats);
  const weeklyGoal    = useStatsStore(s => s.weeklyGoal);
  const coachProgress = useCoachStore(s => s.coachProgress);
  const { profile }   = useProfileStore();
  const { logout }    = useAuthStore();
  const plans         = usePlanStore(s => s.plans);
  const workouts      = useHistoryStore(s => s.getRecentWorkouts)(20);

  const weekCount = stats.weeklyWorkouts;
  const goal      = weeklyGoal ?? 4;
  const streak    = coachProgress.currentStreak;
  const maxStreak = coachProgress.maxStreak;

  const [sub,    setSub]         = useState<SubScreen>(null);
  const [devTab, setDevTab]      = useState<"volumen"|"stärke"|"workouts"|"übungen">("volumen");

  // Sub-Screen routing
  if (sub === "editProfil")  return <ProfilEditScreen  onBack={() => setSub(null)} />;
  if (sub === "settings")     return <SettingsScreen onBack={() => setSub(null)} onNav={(s) => setSub(s as SubScreen)} />;
  if (sub === "datenschutz") return <DatenschutzScreen onBack={() => setSub(null)} />;
  if (sub === "ueber")       return <UeberScreen       onBack={() => setSub(null)} />;
  if (sub === "notif")       return <NotifScreen       onBack={() => setSub(null)} />;

  // Computed data
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
  const totalVolume       = workouts.reduce((a, w) => a + w.totalVolume, 0);
  const totalWorkoutCount = workouts.length;

  const ms        = new Date(profile.memberSince);
  const memberStr = `${String(ms.getDate()).padStart(2,"0")}.${String(ms.getMonth()+1).padStart(2,"0")}.${ms.getFullYear()}`;

  const DEV_TABS: { key: typeof devTab; label: string }[] = [
    { key:"volumen",  label:"VOLUMEN"  },
    { key:"stärke",   label:"STÄRKE"   },
    { key:"workouts", label:"WORKOUTS" },
    { key:"übungen",  label:"ÜBUNGEN"  },
  ];

  const QUICK_STATS = [
    { iconEl:<IconFlame  size={22} color={COPPER_L}/>, label:"STREAK",       val:String(streak),          sub:"Tage",     note:`Best: ${maxStreak} Tage`, noteColor:COPPER_L },
    { iconEl:<IconTarget size={20} color={COPPER_L}/>, label:"WOCHENZIEL",   val:`${weekCount} / ${goal}`, sub:"Workouts", note:"Diese Woche",             noteColor:"#888" },
    { iconEl:<IconBars   size={20} color={COPPER_L}/>, label:"VOLUMEN",      val:totalVolume > 0 ? `${(totalVolume/1000).toFixed(1)} t` : "0 kg", sub:"gesamt", note:"", noteColor:"#888" },
    { iconEl:<IconCalendar size={20} color={COPPER_L}/>, label:"PLÄNE",      val:String(plans.length),    sub:"Aktiv",    note:"",                         noteColor:"#888" },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background:"#080808", color:"#fff" }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img src="/images/profil_hero.webp" alt=""
          className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition:"right center" }} />
        <div className="absolute inset-0" style={{
          background:"linear-gradient(to right, rgba(8,8,8,0.92) 45%, rgba(8,8,8,0.15) 100%)",
        }} />
        <div className="absolute inset-0" style={{
          background:"linear-gradient(to bottom, transparent 45%, rgba(8,8,8,1) 100%)",
        }} />
        <div className="relative z-20 px-4 pt-5">
          <p className="font-black italic leading-none text-white" style={{ fontFamily:F, fontSize:48 }}>PROFIL</p>
        </div>
        <div className="absolute bottom-4 left-0 right-0 z-20 px-4">
          <p className="text-sm text-gray-300">Deine Reise. Deine Entwicklung.</p>
          <p className="text-sm font-black mb-3" style={{ color:COPPER_L }}>Dein Erfolg.</p>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
              style={{ border:`2px solid ${COPPER_L}`, boxShadow:`0 0 16px ${COPPER_G}` }}>
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

        {/* Quick Stats */}
        {/* Quick Stats – Kupfer Metall */}
        <div className="rounded-2xl overflow-hidden" style={{
          background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`,
          border: `1px solid ${BORDER}`,
          boxShadow: `0 0 24px ${COPPER_G}, inset 0 1px 0 rgba(205,127,50,0.12)`,
        }}>
          <div className="grid grid-cols-4">
            {QUICK_STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center py-3 px-1 text-center"
                style={{ borderRight: i<3 ? `1px solid ${BORDER}` : "none" }}>
                <div className="mb-1 flex items-center justify-center" style={{ height:26 }}>{s.iconEl}</div>
                <p className="text-[8px] tracking-widest font-bold mb-1" style={{ color: COPPER }}>{s.label}</p>
                <p className="font-black text-xl text-white leading-none" style={{ fontFamily:F }}>{s.val}</p>
                <p className="text-[9px] mt-0.5" style={{ color: COPPER }}>{s.sub}</p>
                {s.note && <p className="text-[9px] font-bold mt-0.5" style={{ color:s.noteColor }}>{s.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Entwicklung */}
        <div>
          <p className="font-black italic text-xl text-white mb-3" style={{ fontFamily:F }}>MEINE ENTWICKLUNG</p>

          {/* Tabs */}
          <div className="flex rounded-2xl overflow-hidden mb-3" style={{
            background: SURF,
            border: `1px solid ${BORDER}`,
            boxShadow: `inset 0 1px 0 rgba(205,127,50,0.08)`,
          }}>
            {DEV_TABS.map(t => (
              <button key={t.key} onClick={() => setDevTab(t.key)}
                className="flex-1 py-2.5 font-black text-[10px] text-center"
                style={{
                  fontFamily:F, background:"transparent",
                  color: devTab===t.key ? COPPER_L : COPPER + "88", border:"none",
                  borderBottomStyle:"solid", borderBottomWidth:2,
                  borderBottomColor: devTab===t.key ? COPPER_L : "transparent",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Volumen */}
          {devTab === "volumen" && (
            <div className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}`, boxShadow: `0 0 16px ${COPPER_G}` }}>
              <p className="font-black text-sm text-white mb-1" style={{ fontFamily:F }}>VOLUMEN ENTWICKLUNG</p>
              <p className="text-xs text-gray-500 mb-3">Letzte Workouts</p>
              {volumeData.length > 1
                ? <LineChart data={volumeData} color={COPPER_L} height={90} />
                : <p className="text-gray-600 text-sm text-center py-6">Starte dein erstes Workout!</p>
              }
            </div>
          )}

          {/* Stärke */}
          {devTab === "stärke" && (
            <div className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}`, boxShadow: `0 0 16px ${COPPER_G}` }}>
              <p className="font-black text-sm text-white mb-1" style={{ fontFamily:F }}>BANKDRÜCKEN LH</p>
              <p className="text-xs text-gray-500 mb-2">Bestes Gewicht</p>
              <p className="font-black text-3xl text-white mb-3" style={{ fontFamily:F }}>
                {(() => {
                  const best = workouts.flatMap(w => w.exercises)
                    .filter(e => e.name.toLowerCase().includes("bankdrücken") || e.name.toLowerCase().includes("bench"))
                    .map(e => e.bestSet?.weight ?? 0);
                  return best.length > 0 ? `${Math.max(...best)} kg` : "– kg";
                })()}
              </p>
              <LineChart data={[85,90,95,97,100,100,105,105]} color="#ef4444" height={80} />
            </div>
          )}

          {/* Workouts */}
          {devTab === "workouts" && (
            <div className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}`, boxShadow: `0 0 16px ${COPPER_G}` }}>
              <p className="font-black text-sm text-white mb-1" style={{ fontFamily:F }}>WORKOUTS</p>
              <p className="text-xs text-gray-500 mb-2">Letzte 8 Wochen</p>
              <p className="font-black text-3xl text-white mb-3" style={{ fontFamily:F }}>{totalWorkoutCount}</p>
              <BarChart data={workoutCountData.length > 0 ? workoutCountData : [1,2,3,4,5,4,6,8]} color={COPPER_L} height={80} />
            </div>
          )}

          {/* Übungen */}
          {devTab === "übungen" && (
            <div className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}`, boxShadow: `0 0 16px ${COPPER_G}` }}>
              <p className="font-black text-sm text-white mb-3" style={{ fontFamily:F }}>TOP ÜBUNGEN</p>
              {workouts.length === 0
                ? <p className="text-gray-600 text-sm text-center py-4">Noch keine Workouts absolviert.</p>
                : (() => {
                  const freq: Record<string, number> = {};
                  workouts.forEach(w => w.exercises.forEach(e => { freq[e.name] = (freq[e.name] ?? 0) + 1; }));
                  return Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,5).map(([name, count], i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor:"#1a1a1a" }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                        style={{ background:`${COPPER}18`, color:COPPER_L, fontFamily:F }}>{i+1}</div>
                      <p className="flex-1 text-sm text-white font-bold truncate">{name}</p>
                      <p className="text-xs text-gray-500">{count}×</p>
                    </div>
                  ));
                })()
              }
            </div>
          )}
        </div>

        {/* Einstellungen – Button → eigene Seite */}
        <div>
          <p className="font-black italic text-xl text-white mb-3" style={{ fontFamily:F }}>EINSTELLUNGEN</p>
          <button onClick={() => setSub("settings")}
            className="w-full flex items-center gap-4 p-4 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`,
              border: `1px solid ${BORDER}`,
              boxShadow: `0 0 16px ${COPPER_G}, inset 0 1px 0 rgba(205,127,50,0.1)`,
            }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${COPPER}18`, border: `1px solid ${COPPER}33` }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="2" stroke={COPPER_L} strokeWidth="1.5"/>
                <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"
                  stroke={COPPER_L} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-black text-base text-white" style={{ fontFamily:F }}>EINSTELLUNGEN</p>
              <p className="text-xs" style={{ color: COPPER }}>Profil · Notifications · Datenschutz</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke={COPPER_L} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Logout */}
        <div className="pb-4">
          <button onClick={logout} className="w-full py-4 rounded-2xl font-black text-base"
            style={{
              background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`,
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#ef4444",
              fontFamily: F,
              boxShadow: "0 0 12px rgba(239,68,68,0.1)",
            }}>
            ABMELDEN
          </button>
        </div>

      </div>
    </div>
  );
}
