/**
 * OnboardingScreen – einmaliges Profil-Setup nach Registrierung
 */

import { useState } from "react";
import { useProfileStore } from "../stores/profileStore";
import { useAuthStore }    from "../stores/authStore";
import { saveProfile }     from "../lib/syncService";
import { ALL_AVATARS }     from "./profil/ProfilSubScreens";

const F      = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

const GENDERS = [
  { key: "male",   label: "Männlich", emoji: "♂️" },
  { key: "female", label: "Weiblich", emoji: "♀️" },
  { key: "other",  label: "Divers",   emoji: "⚧️" },
];

export function OnboardingScreen() {
  const { profile, updateProfile } = useProfileStore();
  const { completeOnboarding }     = useAuthStore();

  const [step,    setStep]    = useState(1);
  const [name,    setName]    = useState("");
  const [dob,     setDob]     = useState("");
  const [gender,  setGender]  = useState("");
  const [avatar,  setAvatar]  = useState("/images/coach_bertl.webp");
  const [loading, setLoading] = useState(false);

  async function finish() {
    setLoading(true);

    // Lokal sofort speichern
    const updates = {
      name:        name.trim() || "Champion",
      avatarImg:   avatar,
      memberSince: new Date().toISOString().split("T")[0],
    };
    updateProfile(updates);

    // Onboarding SOFORT als abgeschlossen markieren – kein Warten auf Supabase
    useAuthStore.setState({ needsOnboarding: false });

    // Supabase im Hintergrund – Fehler werden ignoriert
    setTimeout(async () => {
      try {
        await saveProfile({ ...profile, ...updates });
      } catch (e) {
        console.warn("[onboarding] saveProfile:", e);
      }
      try {
        await completeOnboarding({ name: updates.name, dob, gender, avatarImg: avatar });
      } catch (e) {
        console.warn("[onboarding] completeOnboarding:", e);
      }
    }, 100);
  }

  function ProgressBar() {
    return (
      <div className="flex gap-2 mb-8">
        {[1,2,3].map(s => (
          <div key={s} className="flex-1 h-1 rounded-full"
            style={{ background: s <= step ? ORANGE : "#2a2a2a" }} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-12 pb-10"
      style={{ background: "#0a0a0a", color: "#fff" }}>

      <div className="flex flex-col items-center mb-6">
        <p className="font-black italic text-3xl" style={{ fontFamily: F, color: ORANGE }}>
          PAWGRESS
        </p>
        <p className="text-gray-500 text-sm mt-1">Lass uns dein Profil einrichten 🐾</p>
      </div>

      <ProgressBar />

      {/* Schritt 1 */}
      {step === 1 && (
        <div className="flex flex-col gap-5 flex-1">
          <div>
            <p className="font-black italic text-2xl text-white mb-1" style={{ fontFamily: F }}>
              WIE HEISST DU?
            </p>
            <p className="text-gray-500 text-sm mb-5">Dein Name erscheint in deinem Profil.</p>
            <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">DEIN NAME</p>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="z.B. Johannes" autoFocus
              className="w-full px-4 py-3.5 rounded-2xl text-white outline-none text-base font-bold"
              style={{ background: "#111", border: `1px solid ${name ? ORANGE : "#2a2a2a"}`, fontSize: 16 }} />
          </div>
          <div>
            <p className="text-xs text-gray-500 tracking-widest mb-2 font-bold">GEBURTSDATUM</p>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3.5 rounded-2xl text-white outline-none text-base"
              style={{ background: "#111", border: `1px solid ${dob ? ORANGE : "#2a2a2a"}`, colorScheme: "dark" }} />
          </div>
          <div className="mt-auto">
            <button onClick={() => setStep(2)} disabled={!name.trim()}
              className="w-full py-4 rounded-2xl font-black text-xl text-white"
              style={{ background: name.trim() ? ORANGE : "#333", border: "none", fontFamily: F }}>
              WEITER →
            </button>
          </div>
        </div>
      )}

      {/* Schritt 2 */}
      {step === 2 && (
        <div className="flex flex-col gap-5 flex-1">
          <div>
            <p className="font-black italic text-2xl text-white mb-1" style={{ fontFamily: F }}>WER BIST DU?</p>
            <p className="text-gray-500 text-sm mb-5">Hilft uns dein Training zu personalisieren.</p>
            <div className="flex flex-col gap-3">
              {GENDERS.map(g => (
                <button key={g.key} onClick={() => setGender(g.key)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
                  style={{
                    background: gender === g.key ? `${ORANGE}18` : "#111",
                    border: `2px solid ${gender === g.key ? ORANGE : "#2a2a2a"}`,
                  }}>
                  <span style={{ fontSize: 28 }}>{g.emoji}</span>
                  <p className="font-black text-lg text-white" style={{ fontFamily: F }}>{g.label}</p>
                  {gender === g.key && (
                    <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: ORANGE }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto flex gap-3">
            <button onClick={() => setStep(1)}
              className="flex-1 py-4 rounded-2xl font-black text-base"
              style={{ background: "#1e1e1e", border: "none", color: "#888", fontFamily: F }}>
              ← ZURÜCK
            </button>
            <button onClick={() => setStep(3)} disabled={!gender}
              className="flex-1 py-4 rounded-2xl font-black text-xl text-white"
              style={{ background: gender ? ORANGE : "#333", border: "none", fontFamily: F }}>
              WEITER →
            </button>
          </div>
        </div>
      )}

      {/* Schritt 3 */}
      {step === 3 && (
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <p className="font-black italic text-2xl text-white mb-1" style={{ fontFamily: F }}>
              WÄHLE DEINEN COACH
            </p>
            <p className="text-gray-500 text-sm mb-4">Weitere Coaches schaltest du durch Training frei.</p>

            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden"
                style={{ border: `3px solid ${ORANGE}`, boxShadow: `0 0 20px ${ORANGE}55` }}>
                <img src={avatar} alt="" className="w-full h-full object-cover object-top" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {ALL_AVATARS.slice(0, 2).map(ch => (
                <button key={ch.name} onClick={() => setAvatar(ch.img)}
                  className="relative rounded-2xl overflow-hidden aspect-square col-span-2"
                  style={{
                    border: avatar === ch.img ? `2.5px solid ${ORANGE}` : "2.5px solid #2a2a2a",
                    boxShadow: avatar === ch.img ? `0 0 14px ${ORANGE}66` : "none",
                    padding: 0, background: "#111",
                  }}>
                  <img src={ch.img} alt={ch.name} className="w-full h-full object-cover object-top" />
                  <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-4"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}>
                    <p className="text-center font-black text-sm text-white" style={{ fontFamily: F }}>
                      {ch.name.toUpperCase()}
                    </p>
                  </div>
                  {avatar === ch.img && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: ORANGE }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
              {ALL_AVATARS.slice(2, 6).map(ch => (
                <button key={ch.name} className="relative rounded-2xl overflow-hidden aspect-square"
                  style={{ border: "2.5px solid #1e1e1e", padding: 0, background: "#111" }}>
                  <img src={ch.img} alt={ch.name} className="w-full h-full object-cover object-top"
                    style={{ filter: "brightness(0.2) grayscale(0.8)" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ fontSize: 18 }}>🔒</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600 text-center mt-2">
              + {ALL_AVATARS.length - 6} weitere durch Training freischalten
            </p>
          </div>

          <div className="mt-auto flex gap-3">
            <button onClick={() => setStep(2)}
              className="flex-1 py-4 rounded-2xl font-black text-base"
              style={{ background: "#1e1e1e", border: "none", color: "#888", fontFamily: F }}>
              ← ZURÜCK
            </button>
            <button onClick={finish} disabled={loading}
              className="flex-1 py-4 rounded-2xl font-black text-xl text-white"
              style={{ background: loading ? "#333" : ORANGE, border: "none", fontFamily: F }}>
              {loading ? "SPEICHERN …" : "LOS GEHT'S 🐾"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
