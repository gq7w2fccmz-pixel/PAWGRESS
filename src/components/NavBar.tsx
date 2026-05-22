import { useNavigate, useLocation } from "react-router-dom";

const F = "'Barlow Condensed', sans-serif";

const NAV_ITEMS = [
  { id: "home",     path: "/",         label: "HOME",     d: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z M9 21V12h6v9" },
  { id: "plan",     path: "/plan",     label: "PLAN",     d: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { id: "coaches",  path: "/coaches",  label: "",         isPaw: true },
  { id: "training", path: "/training", label: "TRAINING", d: "M6 4h4v7H6zM14 4h4v7h-4zM4 15h16M8 15v5M16 15v5" },
  { id: "profil",   path: "/profil",   label: "PROFIL",   d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" },
];

export function NavBar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const current   = location.pathname;

  const isActive = (path: string) =>
    path === "/" ? current === "/" : current.startsWith(path);

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{ background: "rgba(8,8,8,0.96)", borderTop: "1px solid rgba(249,115,22,0.15)", backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center justify-around px-2 pt-2.5 pb-6">
        {NAV_ITEMS.map((item) =>
          item.isPaw ? (
            <button
              key="paw"
              onClick={() => navigate("/coaches")}
              className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer -mt-6 flex-shrink-0"
              style={{
                background: "#000",
                border: `2px solid ${isActive("/coaches") ? "#f97316" : "#f97316"}`,
                boxShadow: isActive("/coaches")
                  ? "0 0 24px #f97316, 0 0 48px rgba(249,115,22,0.4)"
                  : "0 0 16px #f97316, 0 0 32px rgba(249,115,22,0.25)",
              }}
            >
              <img src="/images/paw.webp" alt="paw" className="w-8 h-8 object-contain" />
            </button>
          ) : (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 px-2.5 py-1 text-[9px] font-bold tracking-widest transition-colors"
              style={{
                fontFamily: F,
                color: isActive(item.path) ? "#f97316" : "rgba(255,255,255,0.35)",
                background: "none",
                border: "none",
              }}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
                stroke={isActive(item.path) ? "#f97316" : "rgba(255,255,255,0.35)"}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.d} />
              </svg>
              {item.label}
            </button>
          )
        )}
      </div>
    </nav>
  );
}
