/**
 * LoginScreen – Magic Link Auth
 *
 * Zwei Zustände:
 *  1. E-Mail eingeben → Magic Link senden
 *  2. Bestätigung: "Schau in dein Postfach"
 */

import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

export function LoginScreen() {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  const { sendMagicLink, authError } = useAuthStore();

  async function handleSubmit() {
    if (!email.trim()) return;
    setLoading(true);
    await sendMagicLink(email.trim().toLowerCase());
    setLoading(false);
    if (!useAuthStore.getState().authError) setSent(true);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#0a0a0a", color: "#fff" }}
    >
      {/* Logo / Splash */}
      <div className="flex flex-col items-center mb-10">
        <img
          src="/images/bertl_splash.webp"
          alt="Bertl"
          className="w-28 h-28 rounded-full object-cover mb-4"
          style={{ border: `3px solid ${ORANGE}` }}
        />
        <p
          className="font-black italic text-4xl tracking-tight"
          style={{ fontFamily: F, color: ORANGE }}
        >
          PAWGRESS
        </p>
        <p className="text-gray-500 text-sm mt-1">Fitness mit Tier-Coaches 🐾</p>
      </div>

      {sent ? (
        /* ── Bestätigung ── */
        <div className="w-full max-w-sm text-center flex flex-col gap-4">
          <div
            className="rounded-2xl p-6"
            style={{ background: "#111", border: "1px solid #1e1e1e" }}
          >
            <p className="text-4xl mb-3">📬</p>
            <p
              className="font-black text-xl text-white mb-2"
              style={{ fontFamily: F }}
            >
              MAGIC LINK GESENDET
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Schau in dein Postfach für{" "}
              <span style={{ color: ORANGE }}>{email}</span>.
              <br />
              Klicke den Link – du wirst automatisch eingeloggt.
            </p>
          </div>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-gray-600 underline"
          >
            Andere E-Mail verwenden
          </button>
        </div>
      ) : (
        /* ── Login-Form ── */
        <div className="w-full max-w-sm flex flex-col gap-3">
          <p
            className="font-black italic text-2xl text-white text-center mb-2"
            style={{ fontFamily: F }}
          >
            ANMELDEN
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="deine@email.de"
            autoComplete="email"
            className="w-full px-4 py-3.5 rounded-2xl text-white outline-none text-base"
            style={{
              background: "#111",
              border: `1px solid ${authError ? "#ef4444" : "#2a2a2a"}`,
              fontFamily: F,
              letterSpacing: "0.02em",
            }}
          />

          {authError && (
            <p className="text-red-400 text-xs px-1">{authError}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !email.trim()}
            className="w-full py-4 rounded-2xl font-black text-xl text-white mt-1"
            style={{
              background: loading || !email.trim() ? "#333" : ORANGE,
              border: "none",
              fontFamily: F,
              boxShadow: loading || !email.trim() ? "none" : `0 0 20px ${ORANGE}44`,
              transition: "all 0.2s",
            }}
          >
            {loading ? "SENDE LINK …" : "MAGIC LINK SENDEN 🐾"}
          </button>

          <p className="text-center text-xs text-gray-600 mt-2">
            Kein Passwort nötig – wir schicken dir einen Login-Link.
          </p>
        </div>
      )}
    </div>
  );
}
