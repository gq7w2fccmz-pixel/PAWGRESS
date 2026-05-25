/**
 * NavBar – Gebürstetes Metall Design
 * Kupfer-Bronze Akzente, Ambient Glow, matte Oberfläche
 */
import { useNavigate, useLocation } from "react-router-dom";

const F = "'Barlow Condensed', sans-serif";

// Kupfer-Bronze Palette
const COPPER        = "#cd7f32";
const COPPER_LIGHT  = "#e8a050";
const COPPER_GLOW   = "rgba(180,100,20,0.35)";
const INACTIVE      = "rgba(160,130,100,0.45)";  // warm-grau Bronze

const NAV_ITEMS = [
  {
    id: "home", path: "/", label: "HOME",
    d: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z M9 21V12h6v9",
  },
  {
    id: "plan", path: "/plan", label: "PLAN",
    d: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  },
  { id: "coaches", path: "/coaches", label: "", isPaw: true },
  {
    id: "training", path: "/training", label: "TRAINING",
    d: "M6 4h4v7H6zM14 4h4v7h-4zM4 15h16M8 15v5M16 15v5",
  },
  {
    id: "profil", path: "/profil", label: "PROFIL",
    d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",
  },
];

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const current  = location.pathname;

  const isActive = (path: string) =>
    path === "/" ? current === "/" : current.startsWith(path);

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{
        // Matte gebürstete Metalloberfläche
        background: "linear-gradient(180deg, #1a1410 0%, #110e0a 60%, #0d0b08 100%)",
        borderTop: `1px solid ${COPPER}55`,
        // Subtile Kantenbeleuchtung oben
        boxShadow: `0 -1px 0 ${COPPER}33, 0 -8px 32px rgba(0,0,0,0.6)`,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Subtile Metallic-Linie oben */}
      <div style={{
        height: 1,
        background: `linear-gradient(to right, transparent, ${COPPER}66, ${COPPER_LIGHT}88, ${COPPER}66, transparent)`,
      }} />

      <div className="flex items-center justify-around px-2 pt-1.5 pb-5">
        {NAV_ITEMS.map((item) =>
          item.isPaw ? (
            // ── Mittleres Paw-Icon – Gebürstetes Kupfer ──────────────────────
            <button
              key="paw"
              onClick={() => navigate("/coaches")}
              className="-mt-5 flex-shrink-0 cursor-pointer"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <div style={{
                width: 54, height: 54,
                borderRadius: 13,
                // Gebürstetes Metall Hintergrund
                background: "linear-gradient(145deg, #2a1f14, #1a1208, #2e2010, #1a1208)",
                // Kupfer Rahmen mit Glow
                border: `1.5px solid ${COPPER}`,
                boxShadow: isActive("/coaches")
                  ? `0 0 20px ${COPPER_GLOW}, 0 0 40px ${COPPER_GLOW}, inset 0 1px 0 ${COPPER_LIGHT}44`
                  : `0 0 12px ${COPPER_GLOW}, inset 0 1px 0 ${COPPER}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Innerer Metallic-Schimmer */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(205,127,50,0.15) 0%, transparent 50%, rgba(205,127,50,0.08) 100%)",
                  borderRadius: 13,
                }} />
                <img src="/images/nav_paw.webp" alt="paw"
                  className="relative z-10"
                  style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 9 }} />
              </div>
            </button>
          ) : (
            // ── Normale Nav-Items ────────────────────────────────────────────
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-2 py-1 relative"
              style={{ background: "none", border: "none" }}
            >
              {/* Aktiver Indikator – feiner Kupfer-Punkt */}
              {isActive(item.path) && (
                <div style={{
                  position: "absolute",
                  top: -3, left: "50%", transform: "translateX(-50%)",
                  width: 3, height: 3, borderRadius: "50%",
                  background: COPPER_LIGHT,
                  boxShadow: `0 0 6px ${COPPER}`,
                }} />
              )}

              <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
                stroke={isActive(item.path) ? COPPER_LIGHT : INACTIVE}
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                style={{
                  filter: isActive(item.path) ? `drop-shadow(0 0 4px ${COPPER_GLOW})` : "none",
                  transition: "all 0.2s",
                }}>
                <path d={item.d} />
              </svg>

              <span style={{
                fontFamily: F,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: isActive(item.path) ? COPPER_LIGHT : INACTIVE,
                transition: "color 0.2s",
              }}>
                {item.label}
              </span>
            </button>
          )
        )}
      </div>
    </nav>
  );
}
