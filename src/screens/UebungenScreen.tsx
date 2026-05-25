/**
 * UebungenScreen – Übungen Entdecken als eigene Seite
 */
import { useNavigate } from "react-router-dom";
import { AREA_DATA }   from "../data/areaData";

const F        = "'Barlow Condensed', sans-serif";
const COPPER   = "#cd7f32";
const COPPER_L = "#e8a050";
const SURF     = "#131008";
const SURF2    = "#1a1610";
const BORDER   = "rgba(205,127,50,0.18)";

const AREAS = [
  { key: "BRUST",     label: "Brust",     img: "/images/gym_brust.webp" },
  { key: "RUECKEN",   label: "Rücken",    img: "/images/gym_ruecken.webp" },
  { key: "BEINE",     label: "Beine",     img: "/images/gym_beine.webp" },
  { key: "SCHULTERN", label: "Schultern", img: "/images/gym_schultern.webp" },
  { key: "ARME",      label: "Arme",      img: "/images/gym_arme.webp" },
  { key: "CORE",      label: "Core",      img: "/images/gym_core.webp" },
  { key: "CARDIO",    label: "Cardio",    img: "/images/gym_cardio.webp" },
  { key: "STRETCH",   label: "Stretch",   img: "/images/gym_stretch.webp" },
];

export function UebungenScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-28" style={{ background: "#0a0807", color: "#fff" }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-5">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}`, boxShadow: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke={COPPER_L} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className="font-black italic text-3xl text-white leading-none" style={{ fontFamily: F }}>
            ÜBUNGEN ENTDECKEN
          </p>
          <p className="text-xs mt-0.5" style={{ color: COPPER }}>
            {AREAS.reduce((a, ar) => a + (AREA_DATA[ar.key]?.exercises?.length ?? 0), 0)} Übungen in {AREAS.length} Bereichen
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {AREAS.map(area => {
          const data  = AREA_DATA[area.key];
          const count = data?.exercises?.length ?? 0;
          return (
            <button key={area.key}
              onClick={() => navigate(`/gym/${area.key}`)}
              className="relative rounded-2xl overflow-hidden text-left"
              style={{
                height: 160,
                background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`,
                border: `1px solid ${BORDER}`,
                boxShadow: `0 0 12px rgba(180,100,20,0.12)`,
                padding: 0,
              }}>
              {/* Bild */}
              <img src={area.img} alt={area.label}
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0.85, objectFit: "contain", objectPosition: "center top" }} />
              {/* Gradient */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to top, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.4) 55%, rgba(8,8,8,0.05) 100%)",
              }} />
              {/* Subtile Kupfer-Kante oben */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(to right, transparent, ${COPPER}55, transparent)`,
              }} />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-black text-xl leading-none mb-1"
                  style={{ fontFamily: F, color: data?.color ?? COPPER_L }}>
                  {area.label.toUpperCase()}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px]" style={{ color: COPPER }}>{count} Übungen</p>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: `${data?.color ?? COPPER}22`, border: `1px solid ${data?.color ?? COPPER}44` }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M3 2L7 5L3 8" stroke={data?.color ?? COPPER_L} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
