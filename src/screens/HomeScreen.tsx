import { useNavigate } from "react-router-dom";
import { images } from "../assets/images";
import { GYM_AREAS } from "../data/gymAreas";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { ProgressBar, SectionHeader } from "../components/UI";

const F = "'Barlow Condensed', sans-serif";
const DAYS = ["MO","DI","MI","DO","FR","SA","SO"];

export function HomeScreen() {
  const navigate = useNavigate();
  const { stats, weekDays } = usePawgressStore();

  return (
    <div className="pb-20">
      {/* HERO */}
      <div className="relative overflow-hidden" style={{ height: 360, borderBottom: "1px solid #2a2a2a" }}>
        <img src={images.bertl} alt="Bertl" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right,rgba(10,10,10,0.92) 0%,rgba(10,10,10,0.7) 45%,rgba(10,10,10,0.05) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "linear-gradient(to bottom,transparent,#0a0a0a)" }} />
        <div className="relative z-10 flex flex-col justify-between h-full p-6">
          <div>
            <p className="text-xs tracking-widest font-bold text-white/50" style={{ fontFamily: F }}>GUTEN MORGEN,</p>
            <h1 className="text-5xl font-black italic text-white leading-none" style={{ fontFamily: F, textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>CHAMPION 👊</h1>
            <p className="text-orange-500 text-base italic mb-4" style={{ fontFamily: F }}>No Excuses, Just Pawgress</p>
            {/* Shield Button */}
            <div onClick={() => navigate("/training")} className="cursor-pointer relative" style={{ width: 155, marginBottom: 8 }}>
              <svg width="155" height="174" viewBox="0 0 155 174" className="absolute top-0 left-0" style={{ filter: "drop-shadow(0 0 12px rgba(249,115,22,0.95)) drop-shadow(0 0 28px rgba(249,115,22,0.45))" }}>
                <path d="M9,6 Q9,3 12,3 L143,3 Q146,3 146,6 L146,102 Q146,120 77.5,171 Q9,120 9,102 Z" fill="rgba(8,8,8,0.93)" stroke="#f97316" strokeWidth="2"/>
                <path d="M16,11 Q16,8 19,8 L136,8 Q139,8 139,11 L139,100 Q139,116 77.5,162 Q16,116 16,100 Z" fill="none" stroke="rgba(249,115,22,0.18)" strokeWidth="1"/>
              </svg>
              <div className="relative z-10 flex flex-col items-center" style={{ paddingTop: 16, paddingBottom: 42, gap: 4 }}>
                <img src={images.paw} alt="paw" className="w-7 h-7 object-contain" />
                <span className="font-black italic text-white leading-tight tracking-widest text-2xl" style={{ fontFamily: F }}>TRAINING</span>
                <span className="font-black italic text-orange-500 leading-tight tracking-widest text-2xl" style={{ fontFamily: F }}>STARTEN</span>
                <span className="text-orange-500 font-black text-lg">»</span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate("/plan")} className="flex items-center gap-2 text-white/50 text-sm font-semibold tracking-wide pb-2" style={{ fontFamily: F, background: "none", border: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Plan ansehen
          </button>
        </div>
      </div>

      {/* GYM AREAS */}
      <div className="p-4">
        <SectionHeader title="PAWGRESS GYM" subtitle="Dein Gym. Deine Bereiche. Dein Fortschritt." action={{ label: "ALLE BEREICHE ANSEHEN", onClick: () => {} }} />
        <div className="grid grid-cols-2 gap-2.5">
          {GYM_AREAS.map(area => (
            <div key={area.name} onClick={() => navigate(`/gym/${area.name}`)} className="relative rounded-xl overflow-hidden cursor-pointer" style={{ height: 72, border: "1px solid #2a2a2a" }}>
              <img src={area.img} alt={area.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right,rgba(0,0,0,0.78),rgba(0,0,0,0.3))" }} />
              <div className="relative z-10 flex items-center gap-3 px-3.5 h-full">
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${area.color}`, background: "rgba(0,0,0,0.3)", boxShadow: `0 0 12px ${area.color}88` }}>
                  <img src={images.paw} alt="paw" className="w-6 h-6 object-contain" />
                </div>
                <span className="font-extrabold text-base tracking-wide text-white" style={{ fontFamily: F, textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>{area.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {/* Tagesplan */}
        <div className="rounded-2xl p-3.5" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
          <p className="font-black italic text-sm text-white mb-1" style={{ fontFamily: F }}>DEIN TAGESPLAN</p>
          <p className="text-orange-500 text-[10px] mb-2">PUSH DAY · Brust · Schultern · Trizeps</p>
          {["Bankdrücken","Schrägbank KH","Schulterdrücken","Dips"].map((ex, i) => (
            <div key={i} className="flex justify-between text-[11px] text-gray-400 mb-1">
              <span>{ex}</span><span>{[4,3,3,3][i]} Sätze</span>
            </div>
          ))}
          <button onClick={() => navigate("/training")} className="w-full mt-2 py-2 text-[11px] font-bold tracking-wide text-white rounded-lg" style={{ fontFamily: F, background: "none", border: "1px solid #2a2a2a" }}>PLAN ANSEHEN ›</button>
        </div>

        {/* Fortschritt */}
        <div className="rounded-2xl p-3.5" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
          <p className="font-black italic text-sm text-white mb-0.5" style={{ fontFamily: F }}>DEIN FORTSCHRITT</p>
          <p className="text-[10px] text-gray-600 mb-2.5">DIESE WOCHE</p>
          <div className="mb-2.5">
            <div className="flex justify-between text-[11px] text-gray-400 mb-1"><span>Workouts</span><span>{stats.weeklyWorkouts} / 6</span></div>
            <ProgressBar value={stats.weeklyWorkouts} max={6} color="#a855f7" />
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-[11px] text-gray-400 mb-1"><span>Volumen</span><span>{stats.weeklyVolume.toLocaleString()} kg</span></div>
            <ProgressBar value={stats.weeklyVolume} max={16000} color="#3b82f6" />
          </div>
          <div className="flex justify-between">
            {DAYS.map((d, i) => (
              <div key={d} className="text-center">
                <p className="text-[9px] text-gray-600 mb-1">{d}</p>
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ background: weekDays[i] ? "#f97316" : "#2a2a2a" }}>{weekDays[i] ? "✓" : ""}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
