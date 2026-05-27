/**
 * LoginScreen – E-Mail + Passwort Auth
 * Zwei Modi: Anmelden / Registrieren
 */

import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { F, ORANGE, COPPER, COPPER_L, COPPER_G, SURF, SURF2, BORDER, CARD, CARD2, BORDER2, GREEN, RED, BG } from "../styles/tokens";


type Mode = "login" | "register" | "forgot";

export function LoginScreen() {
  const [mode,     setMode]     = useState<Mode>("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState("");

  const { signIn, signUp, resetPassword, authError, clearError } = useAuthStore();

  function switchMode(m: Mode) {
    setMode(m);
    setEmail("");
    setPassword("");
    setConfirm("");
    setSuccess("");
    clearError();
  }

  async function handleSubmit() {
    if (!email.trim()) return;
    setLoading(true);
    setSuccess("");

    if (mode === "login") {
      await signIn(email.trim(), password);
    } else if (mode === "register") {
      if (password !== confirm) {
        useAuthStore.setState({ authError: "Passwörter stimmen nicht überein." });
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        useAuthStore.setState({ authError: "Passwort muss mindestens 6 Zeichen haben." });
        setLoading(false);
        return;
      }
      await signUp(email.trim(), password);
    } else {
      await resetPassword(email.trim());
      if (!useAuthStore.getState().authError) {
        setSuccess("E-Mail gesendet! Prüfe dein Postfach.");
      }
    }
    setLoading(false);
  }

  const titles: Record<Mode, string> = {
    login:    "ANMELDEN",
    register: "REGISTRIEREN",
    forgot:   "PASSWORT ZURÜCKSETZEN",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#0a0a0a", color: "#fff" }}>

      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <img src="/images/icon.webp" alt="Pawgress"
          className="w-28 h-28 rounded-3xl object-cover mb-4"
          style={{ boxShadow: "0 0 30px rgba(180,100,20,0.4)" }} />
        <p className="font-black italic text-4xl tracking-tight"
          style={{ fontFamily: F, background: "linear-gradient(135deg, #cd7f32, #f4a460, #b8660a, #e8a050)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>PAWGRESS</p>
        <p className="text-gray-500 text-sm mt-1">No Excuses, Just Pawgress.</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <p className="font-black italic text-2xl text-white text-center mb-2"
          style={{ fontFamily: F }}>{titles[mode]}</p>

        {/* E-Mail */}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="deine@email.de" autoComplete="email"
          className="w-full px-4 py-3.5 rounded-2xl text-white outline-none text-base"
          style={{ background: "#111", border: "1px solid #2a2a2a" }} />

        {/* Passwort */}
        {mode !== "forgot" && (
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Passwort" autoComplete={mode === "register" ? "new-password" : "current-password"}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            className="w-full px-4 py-3.5 rounded-2xl text-white outline-none text-base"
            style={{ background: "#111", border: "1px solid #2a2a2a" }} />
        )}

        {/* Passwort bestätigen */}
        {mode === "register" && (
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="Passwort bestätigen" autoComplete="new-password"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            className="w-full px-4 py-3.5 rounded-2xl text-white outline-none text-base"
            style={{ background: "#111", border: "1px solid #2a2a2a" }} />
        )}

        {/* Fehler */}
        {authError && (
          <p className="text-red-400 text-xs px-1">{authError}</p>
        )}

        {/* Erfolg */}
        {success && (
          <p className="text-green-400 text-xs px-1">{success}</p>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading || !email.trim()}
          className="w-full py-4 rounded-2xl font-black text-xl text-white mt-1"
          style={{
            background: loading || !email.trim() ? "#1e1e1e" : `linear-gradient(135deg, #b8660a 0%, #e8a050 40%, #cd7f32 100%)`,
            border: "none", fontFamily: F,
            boxShadow: loading || !email.trim() ? "none" : `0 0 24px rgba(180,100,20,0.55), inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}>
          {loading ? "LADEN …" : titles[mode]}
        </button>

        {/* Links */}
        {mode === "login" && (
          <>
            <button onClick={() => switchMode("register")}
              className="text-sm text-center mt-1"
              style={{ background: "none", border: "none", color: ORANGE, fontFamily: F }}>
              NEU HIER? REGISTRIEREN →
            </button>
            <button onClick={() => switchMode("forgot")}
              className="text-xs text-center text-gray-600"
              style={{ background: "none", border: "none" }}>
              Passwort vergessen?
            </button>
          </>
        )}

        {mode === "register" && (
          <button onClick={() => switchMode("login")}
            className="text-sm text-center mt-1"
            style={{ background: "none", border: "none", color: "#888" }}>
            Bereits ein Konto? Anmelden
          </button>
        )}

        {mode === "forgot" && (
          <button onClick={() => switchMode("login")}
            className="text-sm text-center mt-1"
            style={{ background: "none", border: "none", color: "#888" }}>
            ← Zurück zum Login
          </button>
        )}
      </div>
    </div>
  );
}
