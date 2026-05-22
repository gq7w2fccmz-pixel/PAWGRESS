import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AREA_DATA } from "../data/areaData";
import { AREA_HERO } from "../data/gymAreas";
import { images } from "../assets/images";
import { ProgressBar, BackButton } from "../components/UI";
import type { AreaName } from "../types";

const F = "'Barlow Condensed', sans-serif";

export function GymAreaScreen() {
  const { area: areaParam } = useParams<{ area: string }>();
  const navigate = useNavigate();
  const [selectedEx, setSelectedEx] = useState<number | null>(null);
  const areaName = (areaParam ?? "BRUST") as AreaName;
  const area = AREA_DATA[areaName] ?? AREA_DATA["BRUST"];
  const heroImg = AREA_HERO[areaName];

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0a0a" }}>
      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ minHeight: 280, borderBottom: "1px solid #2a2a2a" }}>
        {heroImg && (
          <>
            <img src={heroImg} alt={areaName} className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.75) 60%, rgba(10,10,10,0.97) 100%)" }} />
          </>
        )}
        {!heroImg && <div className="absolute inset-0" style={{ background: "#111" }} />}
        <div className="relative z-10 p-4 pb-5">
          <BackButton onClick={() => navigate(-1)} />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${area.color}`, background: `${area.color}22`, boxShadow: `0 0 12px ${area.color}66` }}>
              <img src={images.paw} alt="paw" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h1 className="font-black italic text-4xl text-white leading-none" style={{ fontFamily: F }}>{areaName}</h1>
              <p className="text-[11px] text-gray-400 tracking-widest font-bold" style={{ fontFamily: F }}>ÜBUNGSBIBLIOTHEK</p>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed mb-4 max-w-[260px]">{area.desc ?? `${area.coach.name} zeigt dir die besten Übungen.`}</p>
          <div className="flex justify-start">
            <div className="rounded-xl p-3 max-w-[220px]" style={{ background: "rgba(0,0,0,0.82)", border: `1.5px solid ${area.color}`, backdropFilter: "blur(10px)" }}>
              <p className="font-black italic text-xs mb-1.5" style={{ fontFamily: F, color: area.color }}>{area.coach.name.toUpperCase()}'S TIPP</p>
              <p className="text-xs text-gray-200 leading-relaxed">{area.coach.tip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-black italic text-base text-white" style={{ fontFamily: F }}>ALLE {areaName}ÜBUNGEN</h2>
        </div>
        <div className="flex flex-col gap-3">
          {area.exercises.map((ex, i) => {
            const isOpen = selectedEx === i;
            return (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "#161616", border: `1px solid ${isOpen ? area.color + "88" : "#2a2a2a"}` }}>
                <div className="flex">
                  <div className="relative flex-shrink-0 flex items-end p-2.5" style={{ width: 120, minHeight: 110, background: `linear-gradient(135deg,${area.color}22,#0a0a0a)` }}>
                    <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full flex items-center justify-center font-black text-sm" style={{ fontFamily: F, background: area.color }}>{ex.num}</div>
                    <p className="font-black italic text-xs text-white leading-tight" style={{ fontFamily: F, textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>{ex.name}</p>
                  </div>
                  <div className="flex-1 p-3">
                    <p className="text-[11px] text-gray-200 leading-relaxed mb-1">{ex.desc}</p>
                    <p className="text-[11px] mb-0.5" style={{ color: area.color }}>↑ {ex.primary}</p>
                    <p className="text-[11px] text-gray-500 mb-2">+ {ex.secondary}</p>
                    <button
                      onClick={() => setSelectedEx(isOpen ? null : i)}
                      className="px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide"
                      style={{ fontFamily: F, background: isOpen ? area.color : "none", border: `1px solid ${area.color}`, color: isOpen ? "#fff" : area.color }}>
                      {isOpen ? "SCHLIESSEN ↑" : "DETAILS ANSEHEN ›"}
                    </button>
                  </div>
                </div>

                {/* Detail Panel */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: area.color + "44" }}>
                    {ex.cues && ex.cues.length > 0 && (
                      <div className="mb-3">
                        <p className="font-black text-[10px] tracking-widest mb-1.5" style={{ fontFamily: F, color: area.color }}>COACHING CUES</p>
                        {ex.cues.map((c, ci) => (
                          <div key={ci} className="flex gap-2 text-[11px] text-gray-300 mb-1">
                            <span style={{ color: area.color }}>›</span><span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {ex.errors_technique && ex.errors_technique.length > 0 && (
                      <div className="mb-3">
                        <p className="font-black text-[10px] tracking-widest mb-1.5" style={{ fontFamily: F, color: "#ef4444" }}>HÄUFIGE FEHLER</p>
                        {ex.errors_technique.map((e, ei) => (
                          <div key={ei} className="flex gap-2 text-[11px] text-gray-300 mb-1">
                            <span className="text-red-400">✗</span><span>{e}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {ex.breathing && (
                      <div className="mb-2">
                        <p className="font-black text-[10px] tracking-widest mb-1" style={{ fontFamily: F, color: "#3b82f6" }}>ATMUNG</p>
                        <p className="text-[11px] text-gray-300">{ex.breathing}</p>
                      </div>
                    )}
                    {ex.safety_note && (
                      <div className="mt-2 p-2 rounded-lg" style={{ background: "#2a1a0a", border: "1px solid #f9731644" }}>
                        <p className="text-[11px] text-orange-300">⚠ {ex.safety_note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips + Progress */}
      <div className="px-4 grid grid-cols-2 gap-3 mt-1">
        <div className="rounded-xl p-3.5" style={{ background: "#161616", border: `1px solid ${area.color}44` }}>
          <div className="flex items-center gap-2 mb-2.5">
            <img src={images.paw} alt="paw" className="w-4 h-4 object-contain" />
            <p className="font-black italic text-xs" style={{ fontFamily: F, color: area.color }}>TIPPS VON {area.coach.name.toUpperCase()}</p>
          </div>
          {area.tips.map((tip, i) => (
            <div key={i} className="flex gap-2 text-[11px] text-gray-200 mb-1.5 leading-relaxed">
              <span className="flex-shrink-0" style={{ color: area.color }}>✓</span><span>{tip}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3.5" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
          <p className="font-black italic text-xs text-white mb-2.5" style={{ fontFamily: F }}>DEIN FORTSCHRITT</p>
          <div className="mb-2">
            <div className="flex justify-between text-[11px] text-gray-400 mb-1"><span>Workouts</span><span>4 / 6</span></div>
            <ProgressBar value={4} max={6} color="#a855f7" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-[11px] text-gray-400 mb-1"><span>Volumen</span><span>12.850 kg</span></div>
            <ProgressBar value={12850} max={16000} color="#3b82f6" />
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full flex flex-col items-center justify-center" style={{ border: `3px solid ${area.color}` }}>
              <span className="text-base" style={{ color: area.color }}>↑</span>
              <span className="font-black text-sm" style={{ fontFamily: F, color: area.color }}>+18%</span>
            </div>
            <span className="text-[11px] text-gray-400">vs. letzte Woche</span>
          </div>
        </div>
      </div>
    </div>
  );
}
