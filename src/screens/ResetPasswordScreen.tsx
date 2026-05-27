/**
 * ResetPasswordScreen – neues Passwort setzen nach Reset-Link
 * Funktioniert auf Mobile und Vercel (nicht nur localhost)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { F, ORANGE, COPPER, COPPER_L, COPPER_G, SURF, SURF2, BORDER, CARD, CARD2, BORDER2, GREEN, RED, BG } from "../styles/tokens";


export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState(false);
  const [validLink, setValidLink] = useState(false);

  useEffect(() => {
    // Supabase setzt beim Klick auf Reset-Link eine Session
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidLink(true);
      }
    });

    // Prüfen ob bereits eine Recovery-Session aktiv ist
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setValidLink(true);
    });
  }, []);

  async function handleReset() {
    setError("");
    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen haben.");
      return;
    }
    if (password !== confirm) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/"), 2500);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "#0a0a0a" }}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "#22c55e18", border: "2px solid #22c55e44" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M6 18L14 26L30 10" stroke="#22c55e" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-black italic text-3xl text-white" style={{ fontFamily: F }}>
            PASSWORT GESETZT!
          </p>
          <p className="text-gray-400 text-sm">Du wirst automatisch weitergeleitet …</p>
        </div>
      </div>
    );
  }

  if (!validLink) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "#0a0a0a" }}>
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <p className="font-black italic text-2xl text-white" style={{ fontFamily: F }}>
            LINK PRÜFEN …
          </p>
          <p className="text-gray-500 text-sm">
            Falls du über einen Reset-Link hier gelandet bist, warte kurz.
          </p>
          <button onClick={() => navigate("/")}
            className="text-sm mt-4" style={{ color: ORANGE, background: "none", border: "none" }}>
            ← Zurück zum Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#0a0a0a", color: "#fff" }}>

      <div className="flex flex-col items-center mb-10">
        <img src="/images/icon.webp" alt="Pawgress"
          className="w-24 h-24 rounded-3xl object-cover mb-4"
          style={{ boxShadow: `0 0 24px rgba(180,100,20,0.4)` }} />
        <p className="font-black italic text-4xl" style={{ fontFamily: F, color: ORANGE }}>
          PAWGRESS
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <p className="font-black italic text-2xl text-white text-center mb-2"
          style={{ fontFamily: F }}>NEUES PASSWORT</p>

        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Neues Passwort (min. 6 Zeichen)"
          className="w-full px-4 py-3.5 rounded-2xl text-white outline-none text-base"
          style={{ background: "#111", border: `1px solid ${password.length >= 6 ? ORANGE : "#2a2a2a"}` }} />

        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
          placeholder="Passwort bestätigen"
          onKeyDown={e => e.key === "Enter" && handleReset()}
          className="w-full px-4 py-3.5 rounded-2xl text-white outline-none text-base"
          style={{ background: "#111", border: `1px solid ${confirm && confirm === password ? ORANGE : "#2a2a2a"}` }} />

        {error && <p className="text-red-400 text-xs px-1">{error}</p>}

        <button onClick={handleReset} disabled={loading || !password || !confirm}
          className="w-full py-4 rounded-2xl font-black text-xl text-white mt-1"
          style={{
            background: loading || !password || !confirm ? "#333" : ORANGE,
            border: "none", fontFamily: F,
            boxShadow: !loading && password && confirm ? `0 0 20px ${ORANGE}44` : "none",
          }}>
          {loading ? "SPEICHERN …" : "PASSWORT SETZEN 🐾"}
        </button>

        <button onClick={() => navigate("/")}
          className="text-sm text-center text-gray-600 mt-1"
          style={{ background: "none", border: "none" }}>
          ← Zurück zum Login
        </button>
      </div>
    </div>
  );
}
