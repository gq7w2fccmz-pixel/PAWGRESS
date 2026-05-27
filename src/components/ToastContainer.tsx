// ── Toast UI Component ────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { toast as toastStore, type Toast } from "../lib/toast";

const ICONS: Record<string, string> = {
  success: "✓", error: "✕", info: "ℹ", warning: "⚠",
};
const COLORS: Record<string, string> = {
  success: "#22c55e", error: "#ef4444", info: "#3b82f6", warning: "#f97316",
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => toastStore.subscribe(setToasts), []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-full max-w-[380px] px-4 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl pointer-events-auto"
          style={{
            background: "#1a1a1a",
            border: `1px solid ${COLORS[t.type]}44`,
            boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px ${COLORS[t.type]}22`,
            animation: "slideDown 0.2s ease-out",
          }}
          onClick={() => toastStore.dismiss(t.id)}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
            style={{ background: `${COLORS[t.type]}22`, color: COLORS[t.type] }}>
            {ICONS[t.type]}
          </div>
          <p className="text-sm text-white flex-1">{t.message}</p>
        </div>
      ))}
      <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
