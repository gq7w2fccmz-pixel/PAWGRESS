import { useEffect, useState } from "react";

interface Props { onDone: () => void; }

export function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 300);
    const t2 = setTimeout(() => setPhase("out"), 2400);
    const t3 = setTimeout(() => onDone(), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100]"
      style={{
        opacity:    phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 0.5s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "auto",
      }}>

      {/* Vollbild Splash-Bild */}
      <img
        src="/images/splash.webp"
        alt="Pawgress"
        className="w-full h-full object-cover"
        style={{ objectPosition: "center top" }}
      />

      {/* Dunkler Overlay unten für Ladebalken */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)" }} />

      {/* Ladebalken unten */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3">
        <div className="w-32 h-0.5 rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
          <div className="h-full rounded-full"
            style={{
              background: "#f97316",
              width:      phase === "in" ? "0%" : phase === "hold" ? "70%" : "100%",
              transition: phase === "in" ? "none" : "width 2s ease",
            }} />
        </div>
        <p className="text-[10px] text-gray-600 tracking-widest">NO EXCUSES. JUST PAWGRESS.</p>
      </div>
    </div>
  );
}
