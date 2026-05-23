import { useEffect, useState } from "react";

interface Props { onDone: () => void; }

export function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 600);
    const t2 = setTimeout(() => setPhase("out"), 2200);
    const t3 = setTimeout(() => onDone(), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: "#080808",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 0.5s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "auto",
      }}>
      {/* Logo glow */}
      <div className="relative flex items-center justify-center"
        style={{
          opacity: phase === "in" ? 0 : 1,
          transform: phase === "in" ? "scale(0.92)" : "scale(1)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
        <div className="absolute w-64 h-64 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)" }} />
        <img src="/images/bertl_splash.webp" alt="Bertl"
          className="relative z-10"
          style={{ width: "min(75vw, 320px)", objectFit: "contain" }} />
      </div>

      {/* Brand */}
      <div className="mt-4 text-center"
        style={{
          opacity: phase === "in" ? 0 : 1,
          transition: "opacity 0.6s ease 0.2s",
        }}>
        <p className="font-black italic text-4xl text-white tracking-tight"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          PAW<span style={{ color: "#f97316" }}>GRESS</span>
        </p>
        <p className="text-xs text-gray-600 tracking-widest mt-1">NO EXCUSES. JUST PAWGRESS.</p>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-12 flex flex-col items-center gap-3">
        <div className="w-32 h-0.5 rounded-full overflow-hidden" style={{ background: "#1a1a1a" }}>
          <div className="h-full rounded-full"
            style={{
              background: "#f97316",
              width: phase === "in" ? "0%" : phase === "hold" ? "70%" : "100%",
              transition: phase === "in" ? "none" : "width 1.6s ease",
            }} />
        </div>
        <p className="text-[10px] text-gray-700 tracking-widest">WIRD GELADEN ...</p>
      </div>
    </div>
  );
}
