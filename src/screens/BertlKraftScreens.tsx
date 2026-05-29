import { useState } from "react";
import type { ReactNode } from "react";
import { F, ORANGE, GREEN, BLUE } from "../styles/tokens";
import { lazy, Suspense } from "react";
// Cross-chunk lazy imports — vermeidet React #300 beim Lazy-Loading
const HypertrophieSplitScreen  = lazy(() => import("./BertlHypertrophieScreens").then(m => ({ default: m.HypertrophieSplitScreen })));
const KraftausdauerSplitScreen = lazy(() => import("./BertlKraftausdauerScreens").then(m => ({ default: m.KraftausdauerSplitScreen })));

export function KraftDetailScreen({ onBack }: { onBack: () => void }) {
  const COLOR = "#e8a050";
  const [showWeiter, setShowWeiter] = useState(false);

  if (showWeiter) return <KraftPeriodisierungScreen onBack={() => setShowWeiter(false)} />;

  function Section({ title }: { title: string }) {
    return (
      <p className="font-black text-sm mt-5 mb-2" style={{ fontFamily: F, color: COLOR }}>
        {title.toUpperCase()}
      </p>
    );
  }

  function Bullet({ text }: { text: string }) {
    return (
      <div className="flex items-start gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: COLOR }} />
        <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
      </div>
    );
  }

  const variables = [
    { label: "Wiederholungen", value: "1–6" },
    { label: "Intensität", value: "Sehr hoch" },
    { label: "Gewicht", value: "1RM–6RM" },
    { label: "Sätze", value: "3–5" },
    { label: "Pause", value: "2–5 min" },
    { label: "Volumen", value: "Mittel bis hoch" },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className="font-black italic text-2xl leading-none" style={{ fontFamily: F, color: COLOR }}>
            🏋️ KRAFT
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Maximale Kraftentwicklung</p>
        </div>
      </div>

      <div className="px-4">

        {/* Ziele */}
        <Section title="Ziel" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {[
            "Maximale Kraftentwicklung",
            "Verbesserung der neuronalen Ansteuerung",
            "Höhere Rekrutierung motorischer Einheiten",
            "Grundlage für hohe Leistungsfähigkeit",
          ].map((t, i) => <div key={i}><Bullet text={t} /></div>)}
        </div>

        {/* Trainingsvariablen */}
        <Section title="Typische Trainingsvariablen" />
        <div className="rounded-2xl overflow-hidden" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {variables.map((v, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: i < variables.length - 1 ? "1px solid #1e1e1e" : "none" }}>
              <p className="text-sm text-gray-400">{v.label}</p>
              <p className="text-sm font-bold text-white">{v.value}</p>
            </div>
          ))}
        </div>

        {/* Übungen */}
        <Section title="Typische Übungen" />
        <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-xs font-bold text-white mb-1.5">Grundübungen</p>
          {["Kniebeugen", "Kreuzheben", "Bankdrücken", "Schulterdrücken", "Klimmzüge", "Langhantelrudern", "Beinpresse"]
            .map((t, i) => <div key={i}><Bullet text={t} /></div>)}
          <p className="text-xs font-bold text-white mt-3 mb-1.5">Ergänzende Übungen</p>
          {["Trizepsdrücken", "Bizepscurls", "Beinbeuger", "Wadenheben"]
            .map((t, i) => <div key={i}><Bullet text={t} /></div>)}
        </div>

        {/* Charakteristik */}
        <Section title="Charakteristik" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {[
            "Schweres Gewicht",
            "Lange Satzpausen",
            "Niedrige Wiederholungszahl",
            "Fokus auf Leistung statt Muskelbrennen",
            "Hohe Belastung des Nervensystems",
          ].map((t, i) => <div key={i}><Bullet text={t} /></div>)}
        </div>

        {/* Periodisierung */}
        <Section title="Periodisierung" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-xs font-bold text-white mb-2">Typische Reihenfolge</p>
          {["Hypertrophie", "Maximalkraft", "Schnellkraft / Wettkampf"].map((t, i) => (
            <div key={i} className="flex items-center gap-3 mb-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black"
                style={{ background: COLOR, color: "#000" }}>{i + 1}</div>
              <p className="text-sm text-gray-300">{t}</p>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <p className="text-xs font-bold text-white mb-1.5">Maximalkraftphase</p>
            {[
              "2–6 Wiederholungen",
              "Hohe Intensität",
              "Geringeres Volumen als Hypertrophie",
              "Fokus auf schwere Lasten",
            ].map((t, i) => <div key={i}><Bullet text={t} /></div>)}
          </div>
        </div>

        {/* Aufwärmen */}
        <Section title="Aufwärmen" />
        <div className="rounded-2xl px-4 py-3 mb-6" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-sm text-gray-300 mb-2">Bei schweren Gewichten:</p>
          {[
            "Mehrere Aufwärmsätze",
            "Progressiv steigendes Gewicht",
            "Sinkende Wiederholungen",
          ].map((t, i) => <div key={i}><Bullet text={t} /></div>)}
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <p className="text-xs font-bold text-white mb-2">Beispiel</p>
            {[
              "Leichtes Gewicht × 5–6",
              "Mittleres Gewicht × 3–4",
              "Schweres Gewicht × 1",
              "Arbeitssatz",
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#444" }} />
                <p className="text-sm text-gray-400">{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weiter-Button */}
        <button
          onClick={() => setShowWeiter(true)}
          className="w-full mt-6 mb-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: COLOR, color: "#000", fontFamily: F, border: "none" }}>
          WEITER → PERIODISIERUNG
        </button>

      </div>
    </div>
  );
}

// ── HypertrophieDetailScreen ───────────────────────────────────────────────────
export function HypertrophieDetailScreen({ onBack }: { onBack: () => void }) {
  const COLOR = GREEN;
  const [showWeiter, setShowWeiter] = useState(false);

  if (showWeiter) return <HypertrophiePeriodisierungScreen onBack={() => setShowWeiter(false)} />;

  function Section({ title }: { title: string }) {
    return (
      <p className="font-black text-sm mt-5 mb-2" style={{ fontFamily: F, color: COLOR }}>
        {title.toUpperCase()}
      </p>
    );
  }

  function Bullet({ text }: { text: string }) {
    return (
      <div className="flex items-start gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: COLOR }} />
        <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
      </div>
    );
  }

  const variables = [
    { label: "Wiederholungen", value: "7–20" },
    { label: "Optimal", value: "8–12" },
    { label: "Intensität", value: "Mittel" },
    { label: "Gewicht", value: "7RM–20RM" },
    { label: "Sätze", value: "3–6" },
    { label: "Pause", value: "1–2 min" },
    { label: "Volumen", value: "Hoch bis sehr hoch" },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className="font-black italic text-2xl leading-none" style={{ fontFamily: F, color: COLOR }}>
            💪 HYPERTROPHIE
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Muskelaufbau & Volumen</p>
        </div>
      </div>

      <div className="px-4">

        {/* Ziel */}
        <Section title="Ziel" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {["Muskelaufbau", "Vergrößerung des Muskelquerschnitts", "Höheres Trainingsvolumen"]
            .map((t, i) => <div key={i}><Bullet text={t} /></div>)}
        </div>

        {/* Trainingsvariablen */}
        <Section title="Typische Trainingsvariablen" />
        <div className="rounded-2xl overflow-hidden" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {variables.map((v, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: i < variables.length - 1 ? "1px solid #1e1e1e" : "none" }}>
              <p className="text-sm text-gray-400">{v.label}</p>
              <p className="text-sm font-bold text-white">{v.value}</p>
            </div>
          ))}
        </div>

        {/* Übungen */}
        <Section title="Typische Übungen" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-xs font-bold text-white mb-1.5">Grundübungen</p>
          {["Kniebeugen", "Bankdrücken", "Kreuzheben", "Schulterdrücken"]
            .map((t, i) => <div key={i}><Bullet text={t} /></div>)}
          <p className="text-xs font-bold text-white mt-3 mb-1.5">Isolationsübungen</p>
          {["Flys", "Seitheben", "Bizepscurls", "Trizepsstrecken", "Beinstrecken", "Crunches"]
            .map((t, i) => <div key={i}><Bullet text={t} /></div>)}
        </div>

        {/* Charakteristik */}
        <Section title="Charakteristik" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {[
            "Mittelschwere Gewichte",
            "Höheres Gesamtvolumen",
            "Starker metabolischer Stress",
            "Muskelversagen häufiger genutzt",
            "Kombination aus Grund- und Isolationsübungen",
          ].map((t, i) => <div key={i}><Bullet text={t} /></div>)}
        </div>

        {/* Periodisierung */}
        <Section title="Periodisierung" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-xs font-bold text-white mb-1.5">Hypertrophiephase</p>
          {["Hohe Satzanzahl", "8–12 Wiederholungen", "Geringere Intensität", "Sehr hohes Volumen"]
            .map((t, i) => <div key={i}><Bullet text={t} /></div>)}
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <p className="text-xs font-bold text-white mb-1.5">Ziel</p>
            {["Aufbau von Muskelmasse", "Vorbereitung auf spätere Kraftphasen"]
              .map((t, i) => <div key={i}><Bullet text={t} /></div>)}
          </div>
        </div>

        {/* Umgekehrte lineare Periodisierung */}
        <Section title="Umgekehrte lineare Periodisierung" />
        <div className="rounded-2xl px-4 py-3 mb-6" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-sm text-gray-300 mb-2">Bei Hypertrophiefokus:</p>
          {["Intensität sinkt im Verlauf", "Volumen steigt im Verlauf"]
            .map((t, i) => <div key={i}><Bullet text={t} /></div>)}
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <p className="text-xs font-bold text-white mb-2">Phasen</p>
            {["Schnellkraft", "Maximalkraft", "Hypertrophie"].map((t, i) => (
              <div key={i} className="flex items-center gap-3 mb-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black"
                  style={{ background: COLOR, color: "#000" }}>{i + 1}</div>
                <p className="text-sm text-gray-300">{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weiter-Button */}
        <button
          onClick={() => setShowWeiter(true)}
          className="w-full mt-6 mb-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: COLOR, color: "#000", fontFamily: F, border: "none" }}>
          WEITER → PERIODISIERUNG
        </button>

      </div>
    </div>
  );
}


// ── KraftausdauerDetailScreen ──────────────────────────────────────────────────
export function KraftausdauerDetailScreen({ onBack }: { onBack: () => void }) {
  const COLOR = BLUE;
  const [showWeiter, setShowWeiter] = useState(false);

  if (showWeiter) return <KraftausdauerPeriodisierungScreen onBack={() => setShowWeiter(false)} />;

  function Section({ title }: { title: string }) {
    return (
      <p className="font-black text-sm mt-5 mb-2" style={{ fontFamily: F, color: COLOR }}>
        {title.toUpperCase()}
      </p>
    );
  }

  function Bullet({ text }: { text: string }) {
    return (
      <div className="flex items-start gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: COLOR }} />
        <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
      </div>
    );
  }

  const variables = [
    { label: "Wiederholungen", value: "20+" },
    { label: "Intensität", value: "Sehr gering" },
    { label: "Gewicht", value: "20RM+" },
    { label: "Sätze", value: "3–6" },
    { label: "Pause", value: "30–60 sek" },
    { label: "Volumen", value: "Sehr hoch" },
  ];

  const phaseVars = [
    { label: "Wiederholungen", value: "15–30" },
    { label: "Intensität", value: "Sehr gering" },
    { label: "Volumen", value: "Sehr hoch" },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className="font-black italic text-2xl leading-none" style={{ fontFamily: F, color: COLOR }}>
            ⚡ KRAFTAUSDAUER
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Ermüdungsresistenz & lokale Ausdauer</p>
        </div>
      </div>

      <div className="px-4">

        <Section title="Ziel" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {[
            "Fähigkeit, Kraft über längere Zeit aufrechtzuerhalten",
            "Ermüdungsresistenz",
            "Verbesserung lokaler muskulärer Ausdauer",
          ].map((t, i) => <div key={i}><Bullet text={t} /></div>)}
        </div>

        <Section title="Typische Trainingsvariablen" />
        <div className="rounded-2xl overflow-hidden" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {variables.map((v, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: i < variables.length - 1 ? "1px solid #1e1e1e" : "none" }}>
              <p className="text-sm text-gray-400">{v.label}</p>
              <p className="text-sm font-bold text-white">{v.value}</p>
            </div>
          ))}
        </div>

        <Section title="Typische Übungen" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-xs font-bold text-white mb-1.5">Häufig</p>
          {["Zirkeltraining", "Maschinenübungen", "Mehrgelenkige Übungen mit geringem Gewicht", "Körpergewichtsübungen"]
            .map((t, i) => <div key={i}><Bullet text={t} /></div>)}
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <p className="text-xs font-bold text-white mb-1.5">Beispiele</p>
            {["Kniebeugen", "Ausfallschritte", "Liegestütze", "Rudern", "Crunches"]
              .map((t, i) => <div key={i}><Bullet text={t} /></div>)}
          </div>
        </div>

        <Section title="Charakteristik" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {["Leichte Gewichte", "Sehr viele Wiederholungen", "Kurze Pausen", "Hohe metabolische Belastung", "Starke Ermüdung"]
            .map((t, i) => <div key={i}><Bullet text={t} /></div>)}
        </div>

        <Section title="Periodisierung" />
        <div className="rounded-2xl px-4 py-3 mb-6" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-xs font-bold text-white mb-2">Reihenfolge im Modell</p>
          {["Maximalkraft", "Hypertrophie", "Kraftausdauer"].map((t, i) => (
            <div key={i} className="flex items-center gap-3 mb-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black"
                style={{ background: COLOR, color: "#000" }}>{i + 1}</div>
              <p className="text-sm text-gray-300">{t}</p>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <p className="text-xs font-bold text-white mb-2">Kraftausdauerphase</p>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #1e1e1e" }}>
              {phaseVars.map((v, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2"
                  style={{ borderBottom: i < phaseVars.length - 1 ? "1px solid #1e1e1e" : "none" }}>
                  <p className="text-sm text-gray-400">{v.label}</p>
                  <p className="text-sm font-bold text-white">{v.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weiter-Button */}
        <button
          onClick={() => setShowWeiter(true)}
          className="w-full mt-6 mb-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: COLOR, color: "#000", fontFamily: F, border: "none" }}>
          WEITER → PERIODISIERUNG
        </button>

      </div>
    </div>
  );
}

// ── KraftPeriodisierungScreen ──────────────────────────────────────────────────
export function KraftPeriodisierungScreen({ onBack }: { onBack: () => void }) {
  const COLOR = "#e8a050";
  const [showWeiter, setShowWeiter] = useState(false);

  if (showWeiter) return <KraftSplitScreen onBack={() => setShowWeiter(false)} />;

  function Section({ num, title }: { num: number; title: string }) {
    return (
      <div className="flex items-center gap-3 mt-6 mb-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black"
          style={{ background: COLOR, color: "#000", fontFamily: F }}>{num}</div>
        <p className="font-black text-sm" style={{ fontFamily: F, color: COLOR }}>{title.toUpperCase()}</p>
      </div>
    );
  }

  function Bullet({ text }: { text: string }) {
    return (
      <div className="flex items-start gap-2 mb-1.5">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: COLOR }} />
        <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
      </div>
    );
  }

  function Table({ rows }: { rows: { label: string; value: string }[] }) {
    return (
      <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
            <p className="text-sm text-gray-400">{r.label}</p>
            <p className="text-sm font-bold text-white">{r.value}</p>
          </div>
        ))}
      </div>
    );
  }

  function Card({ children }: { children: React.ReactNode }) {
    return (
      <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
        {children}
      </div>
    );
  }

  function SubTitle({ text }: { text: string }) {
    return <p className="text-xs font-bold text-white mb-2 mt-2">{text}</p>;
  }

  function Steps({ items }: { items: string[] }) {
    return (
      <div className="flex flex-col gap-1.5 mb-2">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black"
              style={{ background: "#1e1e1e", color: COLOR }}>{i + 1}</div>
            <p className="text-sm text-gray-300">{t}</p>
          </div>
        ))}
      </div>
    );
  }

  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  function toggle(key: string) { setOpenAccordion(o => o === key ? null : key); }

  function Accordion({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
    const open = openAccordion === id;
    return (
      <div className="mb-2 rounded-xl overflow-hidden" style={{ border: `1px solid ${COLOR}33` }}>
        <button onClick={() => toggle(id)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          style={{ background: open ? `${COLOR}18` : "#161616", border: "none" }}>
          <p className="text-sm font-bold text-white">{label}</p>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <path d="M2 5L7 10L12 5" stroke={COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div className="px-4 pb-4 pt-2" style={{ background: "#111" }}>
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className="font-black italic text-2xl leading-none" style={{ fontFamily: F, color: COLOR }}>
            🏋️ KRAFT – PERIODISIERUNG
          </p>
          <p className="text-xs text-gray-500 mt-0.5">7 Modelle im Überblick</p>
        </div>
      </div>

      <div className="px-4">

        {/* 1. Klassische lineare Periodisierung */}
        <Section num={1} title="Klassische lineare Periodisierung" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Das Gewicht steigt schrittweise, die Wiederholungen sinken — von Muskelmasse über Kraft zur maximalen Leistung.
          </p>
          <Steps items={["Hypertrophie", "Maximalkraft", "Schnellkraft / Wettkampf"]} />

          {/* Accordion: Prinzip */}
          <div className="mt-3">
            <Accordion id="kl-prinzip" label="Prinzip">
              <Bullet text="Erst Muskelmasse aufbauen (hohe Wiederholungen, moderates Gewicht)" />
              <Bullet text="Dann Kraft steigern (weniger Wdh., schwerer)" />
              <Bullet text="Anschließend Leistung maximieren (sehr schwer, wenige Wdh.)" />
            </Accordion>

            {/* Accordion: Phase 1 */}
            <Accordion id="kl-p1" label="Phase 1 – Hypertrophie (Woche 1–4)">
              <Table rows={[
                { label: "Intensität", value: "65–75 % 1RM" },
                { label: "Wiederholungen", value: "8–12" },
                { label: "Sätze", value: "4–5" },
                { label: "Pause", value: "1–2 min" },
              ]} />
              <SubTitle text="Beispieltraining Kniebeuge" />
              <Bullet text="Kniebeuge: 5×10" />
              <Bullet text="Beinpresse: 4×12" />
              <Bullet text="Rumänisches Kreuzheben: 4×10" />
            </Accordion>

            {/* Accordion: Phase 2 */}
            <Accordion id="kl-p2" label="Phase 2 – Maximalkraft (Woche 5–8)">
              <Table rows={[
                { label: "Intensität", value: "80–90 % 1RM" },
                { label: "Wiederholungen", value: "3–6" },
                { label: "Sätze", value: "4–5" },
                { label: "Pause", value: "3–5 min" },
              ]} />
              <SubTitle text="Beispieltraining" />
              <Bullet text="Kniebeuge: 5×5" />
              <Bullet text="Frontkniebeuge: 4×4" />
              <Bullet text="Kreuzheben: 4×5" />
            </Accordion>

            {/* Accordion: Phase 3 */}
            <Accordion id="kl-p3" label="Phase 3 – Peak / Schnellkraft (Woche 9–12)">
              <Table rows={[
                { label: "Intensität", value: "90–97 % 1RM" },
                { label: "Wiederholungen", value: "1–3" },
                { label: "Sätze", value: "3–5" },
                { label: "Pause", value: "4–5 min" },
              ]} />
              <SubTitle text="Beispieltraining" />
              <Bullet text="Kniebeuge: 5×2" />
              <Bullet text="Box Squats explosiv: 6×2" />
              <Bullet text="Sprungkniebeugen: 4×3" />
            </Accordion>

            {/* Accordion: Anwendung */}
            <Accordion id="kl-anw" label="Typische Anwendung">
              <Bullet text="Powerlifting & Kraftsport" />
              <Bullet text="Anfänger bis Fortgeschrittene" />
            </Accordion>
          </div>
        </Card>

        {/* 2. Umgekehrte lineare Periodisierung für Hypertrophie */}
        <Section num={2} title="Umgekehrte lineare Periodisierung – Hypertrophie" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Start mit sehr hoher Intensität — Volumen steigt, Intensität sinkt schrittweise. Ideal für Athleten mit vorhandener Kraftbasis.
          </p>
          <Steps items={["Schnellkraft", "Maximalkraft", "Hypertrophie"]} />

          <div className="mt-3">
            <Accordion id="ul-prinzip" label="Prinzip">
              <Bullet text="Start mit sehr hoher Intensität (85–95 %)" />
              <Bullet text="Danach mehr Volumen, Intensität sinkt schrittweise" />
              <Bullet text="Endet mit Hypertrophiephase für Muskelaufbau" />
            </Accordion>

            <Accordion id="ul-p1" label="Phase 1 – Schnellkraft">
              <Table rows={[
                { label: "Intensität", value: "85–95 %" },
                { label: "Wiederholungen", value: "2–3" },
                { label: "Sätze", value: "3" },
              ]} />
              <SubTitle text="Beispiel Bankdrücken" />
              <Bullet text="Bankdrücken explosiv: 3×3" />
              <Bullet text="Medizinballwürfe" />
              <Bullet text="Plyometrische Liegestütze" />
            </Accordion>

            <Accordion id="ul-p2" label="Phase 2 – Maximalkraft">
              <Table rows={[
                { label: "Intensität", value: "80–90 %" },
                { label: "Wiederholungen", value: "3–5" },
                { label: "Sätze", value: "4" },
              ]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Bankdrücken: 5×5" />
              <Bullet text="Enges Bankdrücken: 4×5" />
              <Bullet text="Schulterdrücken: 4×4" />
            </Accordion>

            <Accordion id="ul-p3" label="Phase 3 – Hypertrophie">
              <Table rows={[
                { label: "Intensität", value: "65–75 %" },
                { label: "Wiederholungen", value: "8–12" },
                { label: "Sätze", value: "5–6" },
              ]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Bankdrücken: 4×10" />
              <Bullet text="Schrägbankdrücken: 4×12" />
              <Bullet text="Flys: 3×15" />
            </Accordion>

            <Accordion id="ul-anw" label="Typische Anwendung">
              <Bullet text="Bodybuilding mit Kraftfokus" />
              <Bullet text="Athleten mit vorhandener Kraftbasis" />
            </Accordion>
          </div>
        </Card>

        {/* 3. Mikrozyklusschema */}
        <Section num={3} title="Mikrozyklusschema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Jede Woche hat einen anderen Schwerpunkt — Kraftausdauer, Hypertrophie, Maximalkraft und Schnellkraft wechseln sich ab.
          </p>
          <div className="mt-1">
            <Accordion id="mk-prinzip" label="Prinzip">
              <Bullet text="Jede Woche ein anderer Reiz — verhindert Stagnation" />
              <Bullet text="Unterschiedliche Anpassungsreize für alle Systeme" />
            </Accordion>
            <Accordion id="mk-w1" label="Woche 1 – Kraftausdauer">
              <Table rows={[{ label: "Gewicht", value: "Leicht" }, { label: "Wiederholungen", value: "12–15" }]} />
              <SubTitle text="Beispiel Kreuzheben" />
              <Bullet text="Kreuzheben: 3×15" />
              <Bullet text="Hyperextensions: 3×20" />
            </Accordion>
            <Accordion id="mk-w2" label="Woche 2 – Hypertrophie">
              <Table rows={[{ label: "Gewicht", value: "Mittel" }, { label: "Wiederholungen", value: "8–12" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Kreuzheben: 4×10" />
              <Bullet text="Rudern: 4×10" />
            </Accordion>
            <Accordion id="mk-w3" label="Woche 3 – Maximalkraft">
              <Table rows={[{ label: "Gewicht", value: "Mittel / Schwer" }, { label: "Wiederholungen", value: "4–6" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Kreuzheben: 5×5" />
              <Bullet text="Rack Pulls: 4×4" />
            </Accordion>
            <Accordion id="mk-w4" label="Woche 4 – Schnellkraft">
              <Table rows={[{ label: "Gewicht", value: "Schwer" }, { label: "Wiederholungen", value: "2–3" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Speed Deadlifts: 6×2" />
              <Bullet text="Kettlebell Swings explosiv" />
            </Accordion>
          </div>
        </Card>

        {/* 4. Wellenförmige Periodisierung */}
        <Section num={4} title="Wellenförmige Periodisierung" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Unterschiedliche Trainingsziele innerhalb derselben Woche — ideal für Fortgeschrittene mit hoher Trainingsfrequenz.
          </p>
          <div className="mt-1">
            <Accordion id="wf-prinzip" label="Prinzip">
              <Bullet text="Mehrere Anpassungen gleichzeitig (Kraft, Hypertrophie, Schnellkraft)" />
              <Bullet text="Hohe Trainingsvariation innerhalb einer Woche" />
              <Bullet text="Gut für Fortgeschrittene mit 3+ Einheiten/Woche" />
            </Accordion>
            <Accordion id="wf-mo" label="Montag – Maximalkraft">
              <Table rows={[{ label: "Sätze", value: "5" }, { label: "Wiederholungen", value: "3" }, { label: "Intensität", value: "90 %" }]} />
              <SubTitle text="Beispiel Kniebeuge" />
              <Bullet text="Kniebeuge: 5×3" />
              <Bullet text="Frontkniebeuge: 4×3" />
            </Accordion>
            <Accordion id="wf-mi" label="Mittwoch – Hypertrophie">
              <Table rows={[{ label: "Sätze", value: "4" }, { label: "Wiederholungen", value: "10" }, { label: "Intensität", value: "70 %" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Kniebeuge: 4×10" />
              <Bullet text="Ausfallschritte: 4×12" />
            </Accordion>
            <Accordion id="wf-fr" label="Freitag – Schnellkraft">
              <Table rows={[{ label: "Sätze", value: "6" }, { label: "Wiederholungen", value: "2" }, { label: "Intensität", value: "60 % explosiv" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Speed Squats" />
              <Bullet text="Box Jumps" />
            </Accordion>
          </div>
        </Card>

        {/* 5. Pendelschema */}
        <Section num={5} title="Pendelschema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Das Training „pendelt" regelmäßig zwischen Hypertrophie, Kraft und Schnellkraft — verhindert Übertraining und Plateaus.
          </p>
          <div className="mt-1">
            <Accordion id="ps-prinzip" label="Prinzip">
              <Bullet text="Hohe Variation durch regelmäßigen Belastungswechsel" />
              <Bullet text="Geringeres Übertraining durch Systemrotation" />
              <Bullet text="Gute langfristige Progression" />
            </Accordion>
            <Accordion id="ps-plan" label="5-Wochen-Plan Schulterdrücken">
              <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
                <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                  <p className="text-[11px] font-bold text-gray-400 w-10">Woche</p>
                  <p className="text-[11px] font-bold text-gray-400 flex-1">Ziel</p>
                  <p className="text-[11px] font-bold text-gray-400 w-14">Wdh.</p>
                  <p className="text-[11px] font-bold text-gray-400 w-20 text-right">Intensität</p>
                </div>
                {[
                  ["1", "Hypertrophie", "8–12", "mittel"],
                  ["2", "Kraft", "6–8", "mittel/schwer"],
                  ["3", "Schnellkraft", "3–5", "schwer"],
                  ["4", "Kraft", "6–8", "mittel/schwer"],
                  ["5", "Hypertrophie", "8–12", "mittel"],
                ].map(([w, z, wdh, int], i, arr) => (
                  <div key={i} className="flex px-3 py-2.5 items-center"
                    style={{ borderBottom: i < arr.length - 1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                    <p className="text-xs text-gray-400 w-10">{w}</p>
                    <p className="text-xs text-white flex-1">{z}</p>
                    <p className="text-xs font-bold text-white w-14">{wdh}</p>
                    <p className="text-xs text-gray-400 w-20 text-right">{int}</p>
                  </div>
                ))}
              </div>
            </Accordion>
            <Accordion id="ps-bsp" label="Konkrete Umsetzung">
              <SubTitle text="Woche 1" />
              <Bullet text="Schulterdrücken: 4×10" />
              <Bullet text="Seitheben: 4×12" />
              <SubTitle text="Woche 2" />
              <Bullet text="Schulterdrücken: 5×6" />
              <Bullet text="Push Press: 4×5" />
              <SubTitle text="Woche 3" />
              <Bullet text="Push Press explosiv: 6×3" />
              <Bullet text="Medizinballwürfe" />
            </Accordion>
          </div>
        </Card>

        {/* 6. Powerliftingzyklus */}
        <Section num={6} title="Powerliftingzyklus" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Langsame, systematische Steigerung von Intensität und Gewicht bei sinkenden Wiederholungen — auf den Wettkampf-Peak ausgerichtet.
          </p>
          <div className="mt-1">
            <Accordion id="pl-prinzip" label="Prinzip">
              <Bullet text="Intensität steigt Woche für Woche" />
              <Bullet text="Wiederholungen sinken gleichzeitig" />
              <Bullet text="Woche 10 = 100 % → maximale Leistung" />
              <Bullet text="Woche 11 = aktive Pause / Testphase" />
            </Accordion>
            <Accordion id="pl-verlauf" label="10-Wochen-Verlauf Bankdrücken">
              <div className="rounded-xl overflow-hidden mb-2" style={{ border: "1px solid #1e1e1e" }}>
                <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                  <p className="text-[11px] font-bold text-gray-400 w-14">Woche</p>
                  <p className="text-[11px] font-bold text-gray-400 flex-1">%1RM</p>
                  <p className="text-[11px] font-bold text-gray-400">Sätze × Wdh.</p>
                </div>
                {[
                  ["1","55 %","5×5"],["2","60 %","5×5"],["3","65 %","5×5"],["4","70 %","5×5"],["5","75 %","5×5"],
                  ["6","85 %","3×3"],["7","90 %","3×3"],["8","95 %","3×3"],["9","95 %","2×2"],["10","100 %","2×2"],
                ].map(([w, pct, sv], i, arr) => (
                  <div key={i} className="flex px-3 py-2.5 items-center"
                    style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: pct === "100 %" ? `${COLOR}18` : "#111" }}>
                    <p className="text-xs text-gray-300 w-14">{w}</p>
                    <p className="text-xs font-bold flex-1" style={{ color: parseFloat(pct) >= 90 ? COLOR : "#fff" }}>{pct}</p>
                    <p className="text-xs text-gray-300">{sv}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: `${COLOR}15`, border: `1px solid ${COLOR}33` }}>
                <p className="text-xs font-bold mb-0.5" style={{ color: COLOR }}>Woche 11</p>
                <p className="text-sm text-gray-300">Aktive Pause / Testphase</p>
              </div>
            </Accordion>
            <Accordion id="pl-bsp" label="Beispiel mit 1RM = 120 kg">
              <Table rows={[
                { label: "Woche 1", value: "66 kg" },
                { label: "Woche 5", value: "90 kg" },
                { label: "Woche 8", value: "114 kg" },
                { label: "Woche 10", value: "120 kg" },
              ]} />
            </Accordion>
            <Accordion id="pl-ziel" label="Ziel">
              <Bullet text="Maximalkraft-Peak zum richtigen Zeitpunkt" />
              <Bullet text="Wettkampfvorbereitung" />
              <Bullet text="Neuronale Anpassung durch progressive Intensität" />
            </Accordion>
          </div>
        </Card>

        {/* 7. Kombiniertes lineares + umgekehrt lineares System */}
        <Section num={7} title="Kombiniertes lineares + umgekehrt lineares System" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Grundübungen werden schwerer (linear), Isolationsübungen leichter mit mehr Wiederholungen (umgekehrt linear) — beides gleichzeitig.
          </p>
          <div className="mt-1">
            <Accordion id="kl2-prinzip" label="Prinzip">
              <Bullet text="Grundübungen → linear schwerer, weniger Wdh." />
              <Bullet text="Isolationsübungen → leichter, mehr Wdh." />
              <Bullet text="Gleichzeitiger Kraft- & Muskelaufbau" />
              <Bullet text="Kombination aus mechanischer Spannung + metabolischem Stress" />
            </Accordion>
            <Accordion id="kl2-grund" label="Grundübungen (linear) – Bankdrücken">
              <Table rows={[
                { label: "Woche 1", value: "4×10" },
                { label: "Woche 2", value: "5×6" },
                { label: "Woche 3", value: "5×3" },
              ]} />
            </Accordion>
            <Accordion id="kl2-iso" label="Isolationsübungen (umgekehrt linear) – Flys">
              <Table rows={[
                { label: "Woche 1", value: "3×12" },
                { label: "Woche 2", value: "3×16" },
                { label: "Woche 3", value: "3×20" },
              ]} />
            </Accordion>
          </div>
        </Card>

        <button onClick={() => setShowWeiter(true)}
          className="w-full mt-4 mb-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: COLOR, color: "#000", fontFamily: F, border: "none" }}>
          WEITER → SPLITSYSTEME
        </button>

      </div>
    </div>
  );
}

// ── HypertrophiePeriodisierungScreen ──────────────────────────────────────────
export function HypertrophiePeriodisierungScreen({ onBack }: { onBack: () => void }) {
  const COLOR = GREEN;
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [showWeiter, setShowWeiter] = useState(false);

  if (showWeiter) return <Suspense fallback={null}><HypertrophieSplitScreen onBack={() => setShowWeiter(false)} /></Suspense>;

  function toggle(key: string) { setOpenAccordion(o => o === key ? null : key); }

  function Accordion({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
    const open = openAccordion === id;
    return (
      <div className="mb-2 rounded-xl overflow-hidden" style={{ border: `1px solid ${COLOR}33` }}>
        <button onClick={() => toggle(id)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          style={{ background: open ? `${COLOR}18` : "#161616", border: "none" }}>
          <p className="text-sm font-bold text-white">{label}</p>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <path d="M2 5L7 10L12 5" stroke={COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div className="px-4 pb-4 pt-2" style={{ background: "#111" }}>
            {children}
          </div>
        )}
      </div>
    );
  }

  function Section({ num, title }: { num: number; title: string }) {
    return (
      <div className="flex items-center gap-3 mt-6 mb-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black"
          style={{ background: COLOR, color: "#000", fontFamily: F }}>{num}</div>
        <p className="font-black text-sm" style={{ fontFamily: F, color: COLOR }}>{title.toUpperCase()}</p>
      </div>
    );
  }

  function Bullet({ text }: { text: string }) {
    return (
      <div className="flex items-start gap-2 mb-1.5">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: COLOR }} />
        <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
      </div>
    );
  }

  function Table({ rows }: { rows: { label: string; value: string }[] }) {
    return (
      <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
            <p className="text-sm text-gray-400">{r.label}</p>
            <p className="text-sm font-bold text-white">{r.value}</p>
          </div>
        ))}
      </div>
    );
  }

  function Card({ children }: { children: React.ReactNode }) {
    return (
      <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
        {children}
      </div>
    );
  }

  function SubTitle({ text }: { text: string }) {
    return <p className="text-xs font-bold text-white mb-2 mt-2">{text}</p>;
  }

  function Steps({ items }: { items: string[] }) {
    return (
      <div className="flex flex-col gap-1.5 mb-2">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black"
              style={{ background: "#1e1e1e", color: COLOR }}>{i + 1}</div>
            <p className="text-sm text-gray-300">{t}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className="font-black italic text-2xl leading-none" style={{ fontFamily: F, color: COLOR }}>
            💪 HYPERTROPHIE – PERIODISIERUNG
          </p>
          <p className="text-xs text-gray-500 mt-0.5">8 Modelle im Überblick</p>
        </div>
      </div>

      <div className="px-4">

        {/* 1 */}
        <Section num={1} title="Klassische lineare Periodisierung" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Start mit höherem Volumen — Intensität steigt, Wiederholungen sinken im Verlauf. Ideal für stabilen Muskel- und Kraftaufbau.
          </p>
          <Steps items={["Hypertrophiebasis", "Kraft / Hypertrophie", "Kraftbetonte Hypertrophie"]} />
          <div className="mt-3">
            <Accordion id="h-kl-prinzip" label="Prinzip">
              <Bullet text="Beginn mit höherem Volumen und moderater Intensität" />
              <Bullet text="Wiederholungen sinken, Gewicht steigt von Phase zu Phase" />
              <Bullet text="Ziel: erst Muskelmasse aufbauen, dann Kraft steigern" />
            </Accordion>
            <Accordion id="h-kl-p1" label="Phase 1 – Hypertrophiebasis (Woche 1–4)">
              <Table rows={[
                { label: "Intensität", value: "65–70 % 1RM" },
                { label: "Wiederholungen", value: "10–12" },
                { label: "Sätze", value: "4–5" },
                { label: "Pause", value: "60–90 sek" },
              ]} />
              <SubTitle text="Beispieltraining Brust" />
              <Bullet text="Bankdrücken: 5×12" />
              <Bullet text="Schrägbankdrücken KH: 4×12" />
              <Bullet text="Kabel-Flys: 4×15" />
            </Accordion>
            <Accordion id="h-kl-p2" label="Phase 2 – Übergang Kraft/Hypertrophie (Woche 5–8)">
              <Table rows={[
                { label: "Intensität", value: "75–80 %" },
                { label: "Wiederholungen", value: "6–8" },
                { label: "Sätze", value: "4–5" },
                { label: "Pause", value: "2–3 min" },
              ]} />
              <SubTitle text="Beispieltraining" />
              <Bullet text="Bankdrücken: 5×8" />
              <Bullet text="Dips: 4×8" />
              <Bullet text="Schulterdrücken: 4×6" />
            </Accordion>
            <Accordion id="h-kl-p3" label="Phase 3 – Kraftbetonte Hypertrophie (Woche 9–12)">
              <Table rows={[
                { label: "Intensität", value: "80–85 %" },
                { label: "Wiederholungen", value: "4–6" },
                { label: "Sätze", value: "4–5" },
                { label: "Pause", value: "3 min" },
              ]} />
              <SubTitle text="Beispieltraining" />
              <Bullet text="Bankdrücken: 5×5" />
              <Bullet text="Enges Bankdrücken: 4×6" />
              <Bullet text="Weighted Dips: 4×5" />
            </Accordion>
            <Accordion id="h-kl-vorteil" label="Vorteil">
              <Bullet text="Stabile Muskel- und Kraftentwicklung" />
              <Bullet text="Leicht planbar" />
              <Bullet text="Gut für Anfänger und Fortgeschrittene" />
            </Accordion>
          </div>
        </Card>

        {/* 2 */}
        <Section num={2} title="Umgekehrte lineare Periodisierung – Hypertrophie" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Start mit hoher Intensität — danach mehr Volumen, Intensität sinkt schrittweise. Starke Wachstumsreize durch maximale Muskelspannung zu Beginn.
          </p>
          <Steps items={["Schnellkraft", "Maximalkraft", "Hypertrophie"]} />
          <div className="mt-3">
            <Accordion id="h-ul-prinzip" label="Prinzip">
              <Bullet text="Hohe Muskelspannung zu Beginn (schwere Gewichte)" />
              <Bullet text="Später maximales Trainingsvolumen" />
              <Bullet text="Starke Wachstumsreize durch Phasenwechsel" />
            </Accordion>
            <Accordion id="h-ul-p1" label="Phase 1 – Schnellkraft">
              <Table rows={[
                { label: "Intensität", value: "Hoch" },
                { label: "Wiederholungen", value: "2–3" },
                { label: "Sätze", value: "3" },
              ]} />
              <SubTitle text="Beispieltraining Rücken" />
              <Bullet text="Explosive Klimmzüge: 6×3" />
              <Bullet text="Power Rows: 5×3" />
              <Bullet text="Medizinballwürfe" />
            </Accordion>
            <Accordion id="h-ul-p2" label="Phase 2 – Maximalkraft">
              <Table rows={[
                { label: "Intensität", value: "80–90 %" },
                { label: "Wiederholungen", value: "3–5" },
                { label: "Sätze", value: "4" },
              ]} />
              <SubTitle text="Beispieltraining" />
              <Bullet text="Langhantelrudern: 5×5" />
              <Bullet text="Weighted Pull-Ups: 4×5" />
              <Bullet text="Kreuzheben: 4×4" />
            </Accordion>
            <Accordion id="h-ul-p3" label="Phase 3 – Hypertrophie">
              <Table rows={[
                { label: "Intensität", value: "Moderat" },
                { label: "Wiederholungen", value: "8–12" },
                { label: "Sätze", value: "5–6" },
              ]} />
              <SubTitle text="Beispieltraining" />
              <Bullet text="Rudern: 4×10" />
              <Bullet text="Latziehen: 4×12" />
              <Bullet text="Kabelrudern: 4×15" />
            </Accordion>
          </div>
        </Card>

        {/* 3 */}
        <Section num={3} title="Mikrozyklusschema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Jede Woche verändert Intensität, Gewicht und Wiederholungsbereich — verhindert Stagnation durch verschiedene Wachstumsreize.
          </p>
          <div className="mt-1">
            <Accordion id="h-mk-prinzip" label="Prinzip">
              <Bullet text="Wöchentlicher Wechsel von Intensität & Volumen" />
              <Bullet text="Verhindert Anpassungsstagnation" />
              <Bullet text="Verschiedene Wachstumsreize für alle Muskelfasern" />
            </Accordion>
            <Accordion id="h-mk-w1" label="Woche 1 – Kraftausdauer">
              <Table rows={[{ label: "Gewicht", value: "Leicht" }, { label: "Wiederholungen", value: "12–15" }]} />
              <SubTitle text="Beispiel Beintraining" />
              <Bullet text="Kniebeugen: 3×15" />
              <Bullet text="Beinpresse: 3×20" />
              <Bullet text="Ausfallschritte: 3×15" />
            </Accordion>
            <Accordion id="h-mk-w2" label="Woche 2 – Hypertrophie">
              <Table rows={[{ label: "Gewicht", value: "Mittel" }, { label: "Wiederholungen", value: "8–12" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Kniebeugen: 5×10" />
              <Bullet text="Rumänisches Kreuzheben: 4×10" />
              <Bullet text="Beinstrecken: 4×12" />
            </Accordion>
            <Accordion id="h-mk-w3" label="Woche 3 – Maximalkraft">
              <Table rows={[{ label: "Gewicht", value: "Mittel / Schwer" }, { label: "Wiederholungen", value: "4–6" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Kniebeugen: 5×5" />
              <Bullet text="Frontkniebeugen: 4×5" />
            </Accordion>
            <Accordion id="h-mk-w4" label="Woche 4 – Schnellkraft">
              <Table rows={[{ label: "Gewicht", value: "Schwer / Explosiv" }, { label: "Wiederholungen", value: "2–3" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Speed Squats: 6×2" />
              <Bullet text="Box Jumps" />
            </Accordion>
          </div>
        </Card>

        {/* 4 */}
        <Section num={4} title="Wellenförmige Periodisierung" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Innerhalb derselben Woche wechseln Intensität und Wiederholungsbereiche — mehrere Wachstumsmechanismen gleichzeitig.
          </p>
          <div className="mt-1">
            <Accordion id="h-wf-prinzip" label="Prinzip">
              <Bullet text="Mehrere Wachstumsmechanismen gleichzeitig (Kraft, Hypertrophie, Pump)" />
              <Bullet text="Hohe Variation & gute Regeneration" />
            </Accordion>
            <Accordion id="h-wf-mo" label="Montag – Kraft">
              <Table rows={[{ label: "Sätze", value: "5" }, { label: "Wiederholungen", value: "5" }, { label: "Intensität", value: "Schwer" }]} />
              <SubTitle text="Beispiel Brust" />
              <Bullet text="Bankdrücken: 5×5" />
              <Bullet text="Dips schwer: 4×6" />
            </Accordion>
            <Accordion id="h-wf-mi" label="Mittwoch – Hypertrophie">
              <Table rows={[{ label: "Sätze", value: "4" }, { label: "Wiederholungen", value: "10" }, { label: "Intensität", value: "Mittel" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Schrägbankdrücken: 4×10" />
              <Bullet text="Flys: 4×12" />
            </Accordion>
            <Accordion id="h-wf-fr" label="Freitag – Kraftausdauer / Pump">
              <Table rows={[{ label: "Sätze", value: "3" }, { label: "Wiederholungen", value: "15–20" }, { label: "Intensität", value: "Leicht" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Kabelzüge: 3×20" />
              <Bullet text="Push-Ups: 3×max" />
            </Accordion>
          </div>
        </Card>

        {/* 5 */}
        <Section num={5} title="Pendelschema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Regelmäßiger Wechsel zwischen Hypertrophie, Kraft und Schnellkraft — konstante neue Reize, geringeres Plateau-Risiko.
          </p>
          <div className="mt-1">
            <Accordion id="h-ps-prinzip" label="Prinzip">
              <Bullet text="Konstante neue Reize durch Belastungswechsel" />
              <Bullet text="Geringeres Plateau-Risiko" />
              <Bullet text="Kombiniert Muskelaufbau und Kraftentwicklung" />
            </Accordion>
            <Accordion id="h-ps-plan" label="5-Wochen-Plan Schultertraining">
              <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
                <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                  <p className="text-[11px] font-bold text-gray-400 w-10">Woche</p>
                  <p className="text-[11px] font-bold text-gray-400 flex-1">Ziel</p>
                  <p className="text-[11px] font-bold text-gray-400 w-14">Wdh.</p>
                  <p className="text-[11px] font-bold text-gray-400 w-20 text-right">Intensität</p>
                </div>
                {[
                  ["1","Hypertrophie","8–12","mittel"],
                  ["2","Kraft","6–8","mittel/schwer"],
                  ["3","Schnellkraft","3–5","schwer"],
                  ["4","Kraft","6–8","mittel/schwer"],
                  ["5","Hypertrophie","8–12","mittel"],
                ].map(([w, z, wdh, int], i, arr) => (
                  <div key={i} className="flex px-3 py-2.5 items-center"
                    style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                    <p className="text-xs text-gray-400 w-10">{w}</p>
                    <p className="text-xs text-white flex-1">{z}</p>
                    <p className="text-xs font-bold text-white w-14">{wdh}</p>
                    <p className="text-xs text-gray-400 w-20 text-right">{int}</p>
                  </div>
                ))}
              </div>
            </Accordion>
            <Accordion id="h-ps-bsp" label="Konkrete Umsetzung">
              <SubTitle text="Woche 1" />
              <Bullet text="Schulterdrücken: 4×10" />
              <Bullet text="Seitheben: 4×12" />
              <SubTitle text="Woche 2" />
              <Bullet text="Schulterdrücken: 5×6" />
              <Bullet text="Push Press: 4×5" />
              <SubTitle text="Woche 3" />
              <Bullet text="Push Press explosiv: 6×3" />
              <Bullet text="Medizinballwürfe" />
            </Accordion>
          </div>
        </Card>

        {/* 6 */}
        <Section num={6} title="Kombiniertes lineares + umgekehrt lineares System" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Grundübungen werden schwerer (linear), Isolationsübungen volumenorientierter (umgekehrt linear) — mechanische Spannung + metabolischer Stress.
          </p>
          <div className="mt-1">
            <Accordion id="h-kl2-prinzip" label="Prinzip">
              <Bullet text="Grundübungen → linear schwerer, Wiederholungen sinken" />
              <Bullet text="Isolationsübungen → leichter, Volumen steigt" />
              <Bullet text="Optimal für Muskelwachstum durch doppelten Reiz" />
            </Accordion>
            <Accordion id="h-kl2-grund" label="Grundübungen (linear) – Rückenbeispiel">
              <SubTitle text="Woche 1" />
              <Bullet text="Klimmzüge: 4×10" />
              <Bullet text="Langhantelrudern: 4×10" />
              <SubTitle text="Woche 2" />
              <Bullet text="Klimmzüge mit Gewicht: 5×6" />
              <Bullet text="Rudern schwer: 5×6" />
              <SubTitle text="Woche 3" />
              <Bullet text="Weighted Pull-Ups: 5×3" />
              <Bullet text="Pendlay Rows: 5×4" />
            </Accordion>
            <Accordion id="h-kl2-iso" label="Isolationsübungen (umgekehrt linear) – Face Pulls">
              <Table rows={[
                { label: "Woche 1", value: "3×12" },
                { label: "Woche 2", value: "3×16" },
                { label: "Woche 3", value: "3×20–25" },
              ]} />
            </Accordion>
          </div>
        </Card>

        {/* 7 */}
        <Section num={7} title="Linearer Massezyklus" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Wechsel aus schweren und leichten Tagen mit variablen Pausen und Wiederholungsbereichen — hohe Frequenz, maximaler Muskelreiz.
          </p>
          <div className="mt-1">
            <Accordion id="h-lm-prinzip" label="Prinzip">
              <Bullet text="Schwere Tage & leichte Tage wechseln sich ab" />
              <Bullet text="Kurze und längere Pausen je nach Tagesziel" />
              <Bullet text="Verschiedene Wiederholungsbereiche für alle Fasertypen" />
            </Accordion>
            <Accordion id="h-lm-schwer" label="Schwerer Push-Tag">
              <div className="rounded-xl overflow-hidden mb-2" style={{ border: "1px solid #1e1e1e" }}>
                <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                  <p className="text-[11px] font-bold text-gray-400 flex-1">Übung</p>
                  <p className="text-[11px] font-bold text-gray-400 w-14 text-center">Wdh.</p>
                  <p className="text-[11px] font-bold text-gray-400 w-16 text-right">Pause</p>
                </div>
                {[["Bankdrücken","8–10","2–3 min"],["Schulterdrücken","8–10","2–3 min"],["Dips","10–12","90 sek"]]
                  .map(([ü, w, p], i, arr) => (
                  <div key={i} className="flex px-3 py-2.5 items-center"
                    style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                    <p className="text-xs text-gray-300 flex-1">{ü}</p>
                    <p className="text-xs font-bold text-white w-14 text-center">{w}</p>
                    <p className="text-xs text-gray-400 w-16 text-right">{p}</p>
                  </div>
                ))}
              </div>
            </Accordion>
            <Accordion id="h-lm-pump" label="Pump-Push-Tag">
              <div className="rounded-xl overflow-hidden mb-2" style={{ border: "1px solid #1e1e1e" }}>
                <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                  <p className="text-[11px] font-bold text-gray-400 flex-1">Übung</p>
                  <p className="text-[11px] font-bold text-gray-400 w-14 text-center">Wdh.</p>
                  <p className="text-[11px] font-bold text-gray-400 w-16 text-right">Pause</p>
                </div>
                {[["Flys","15–20","<1 min"],["Seitheben","15–20","<1 min"],["Kabeldrücken","15–20","<1 min"]]
                  .map(([ü, w, p], i, arr) => (
                  <div key={i} className="flex px-3 py-2.5 items-center"
                    style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                    <p className="text-xs text-gray-300 flex-1">{ü}</p>
                    <p className="text-xs font-bold text-white w-14 text-center">{w}</p>
                    <p className="text-xs text-gray-400 w-16 text-right">{p}</p>
                  </div>
                ))}
              </div>
              <Bullet text="Sehr hoher Muskelreiz durch Kombination aus Spannung und Pump" />
            </Accordion>
          </div>
        </Card>

        {/* 8 */}
        <Section num={8} title="Wellenförmige Hypertrophie mit Spezialisierung" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Ein Muskel wird mehrfach pro Woche mit unterschiedlichen Reizen trainiert — maximaler Wachstumsreiz durch hohe Frequenz.
          </p>
          <div className="mt-1">
            <Accordion id="h-ws-prinzip" label="Prinzip">
              <Bullet text="Hohe Frequenz: ein Muskel 3× pro Woche" />
              <Bullet text="Vollständige Belastung aller Muskelfasertypen" />
              <Bullet text="Maximaler Wachstumsreiz durch Reizvariation" />
            </Accordion>
            <Accordion id="h-ws-mo" label="Montag – Schwer">
              <Bullet text="Langhantelcurls: 5×5" />
              <Bullet text="Enges Bankdrücken: 5×5" />
            </Accordion>
            <Accordion id="h-ws-mi" label="Mittwoch – Mittel">
              <Bullet text="Hammercurls: 4×10" />
              <Bullet text="Trizepsdrücken: 4×10" />
            </Accordion>
            <Accordion id="h-ws-fr" label="Freitag – Pump">
              <Bullet text="Kabelcurls: 3×20" />
              <Bullet text="Rope Pushdowns: 3×20" />
            </Accordion>
          </div>
        </Card>

        <button onClick={() => setShowWeiter(true)}
          className="w-full mt-4 mb-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: COLOR, color: "#000", fontFamily: F, border: "none" }}>
          WEITER → SPLITSYSTEME
        </button>

      </div>
    </div>
  );
}

// ── KraftausdauerPeriodisierungScreen ─────────────────────────────────────────
export function KraftausdauerPeriodisierungScreen({ onBack }: { onBack: () => void }) {
  const COLOR = BLUE;
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [showWeiter, setShowWeiter] = useState(false);

  if (showWeiter) return <Suspense fallback={null}><KraftausdauerSplitScreen onBack={() => setShowWeiter(false)} /></Suspense>;


  function Section({ num, title }: { num: number; title: string }) {
    return (
      <div className="flex items-center gap-3 mt-6 mb-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black"
          style={{ background: COLOR, color: "#000", fontFamily: F }}>{num}</div>
        <p className="font-black text-sm" style={{ fontFamily: F, color: COLOR }}>{title.toUpperCase()}</p>
      </div>
    );
  }

  function Table({ rows }: { rows: { label: string; value: string }[] }) {
    return (
      <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
            <p className="text-sm text-gray-400">{r.label}</p>
            <p className="text-sm font-bold text-white">{r.value}</p>
          </div>
        ))}
      </div>
    );
  }

  function Card({ children }: { children: React.ReactNode }) {
    return (
      <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
        {children}
      </div>
    );
  }

  function SubTitle({ text }: { text: string }) {
    return <p className="text-xs font-bold text-white mb-2 mt-2">{text}</p>;
  }

  function Steps({ items }: { items: string[] }) {
    return (
      <div className="flex flex-col gap-1.5 mb-2">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black"
              style={{ background: "#1e1e1e", color: COLOR }}>{i + 1}</div>
            <p className="text-sm text-gray-300">{t}</p>
          </div>
        ))}
      </div>
    );
  }

  function toggle(key: string) { setOpenAccordion(o => o === key ? null : key); }

  function Bullet({ text }: { text: string }) {
    return (
      <div className="flex items-start gap-2 mb-1.5">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: COLOR }} />
        <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
      </div>
    );
  }


  function Accordion({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
    const open = openAccordion === id;
    return (
      <div className="mb-2 rounded-xl overflow-hidden" style={{ border: `1px solid ${COLOR}33` }}>
        <button onClick={() => toggle(id)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          style={{ background: open ? `${COLOR}18` : "#161616", border: "none" }}>
          <p className="text-sm font-bold text-white">{label}</p>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <path d="M2 5L7 10L12 5" stroke={COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div className="px-4 pb-4 pt-2" style={{ background: "#111" }}>
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className="font-black italic text-2xl leading-none" style={{ fontFamily: F, color: COLOR }}>
            ⚡ KRAFTAUSDAUER – PERIODISIERUNG
          </p>
          <p className="text-xs text-gray-500 mt-0.5">6 Modelle im Überblick</p>
        </div>
      </div>

      <div className="px-4">

        {/* 1 */}
        <Section num={1} title="Klassische lineare Periodisierung" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Zuerst Kraftbasis aufbauen, dann hohe Wiederholungszahlen — stabiler Weg zur Ermüdungsresistenz.
          </p>
          <Steps items={["Kraftbasis", "Hypertrophie", "Kraftausdauer"]} />
          <div className="mt-3">
            <Accordion id="ka-kl-prinzip" label="Prinzip">
              <Bullet text="Beginn mit schwereren Gewichten und wenigen Wdh." />
              <Bullet text="Später mehr Wiederholungen, Volumen steigt" />
              <Bullet text="Kraftbasis wird zuerst aufgebaut, dann Ausdauerreize" />
            </Accordion>
            <Accordion id="ka-kl-p1" label="Phase 1 – Kraftbasis (Woche 1–4)">
              <Table rows={[
                { label: "Intensität", value: "75–85 %" },
                { label: "Wiederholungen", value: "5–8" },
                { label: "Sätze", value: "4–5" },
                { label: "Pause", value: "2–3 min" },
              ]} />
              <SubTitle text="Beispieltraining" />
              <Bullet text="Kniebeugen: 5×6" />
              <Bullet text="Bankdrücken: 5×6" />
              <Bullet text="Rudern: 5×6" />
            </Accordion>
            <Accordion id="ka-kl-p2" label="Phase 2 – Hypertrophie (Woche 5–8)">
              <Table rows={[
                { label: "Intensität", value: "65–75 %" },
                { label: "Wiederholungen", value: "8–12" },
                { label: "Sätze", value: "4" },
                { label: "Pause", value: "1–2 min" },
              ]} />
              <SubTitle text="Beispieltraining" />
              <Bullet text="Kniebeugen: 4×10" />
              <Bullet text="Schulterdrücken: 4×10" />
              <Bullet text="Klimmzüge: 4×10" />
            </Accordion>
            <Accordion id="ka-kl-p3" label="Phase 3 – Kraftausdauer (Woche 9–12)">
              <Table rows={[
                { label: "Intensität", value: "Leicht" },
                { label: "Wiederholungen", value: "15–30" },
                { label: "Sätze", value: "3–4" },
                { label: "Pause", value: "30–60 sek" },
              ]} />
              <SubTitle text="Beispieltraining" />
              <Bullet text="Kniebeugen: 3×20" />
              <Bullet text="Liegestütze: 3×25" />
              <Bullet text="Rudern Kabel: 3×20" />
            </Accordion>
            <Accordion id="ka-kl-vorteil" label="Vorteil">
              <Bullet text="Stabile Kraftbasis als Fundament" />
              <Bullet text="Hohe Ermüdungsresistenz am Ende" />
              <Bullet text="Gute langfristige Leistungsentwicklung" />
            </Accordion>
          </div>
        </Card>

        {/* 2 */}
        <Section num={2} title="Umgekehrte lineare Periodisierung – Kraftausdauer" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Intensität sinkt, Volumen steigt — Kraftausdauer steht am Ende als Höhepunkt des Zyklus.
          </p>
          <Steps items={["Maximalkraft", "Hypertrophie", "Kraftausdauer"]} />
          <div className="mt-3">
            <Accordion id="ka-ul-prinzip" label="Prinzip">
              <Bullet text="Start mit hoher Intensität für neuronale Anpassung" />
              <Bullet text="Danach Muskelaufbau als Zwischenstufe" />
              <Bullet text="Endet mit maximaler Kraftausdauer & Stoffwechselanpassung" />
            </Accordion>
            <Accordion id="ka-ul-p1" label="Phase 1 – Maximalkraft">
              <Table rows={[
                { label: "Intensität", value: "Hoch" },
                { label: "Wiederholungen", value: "2–6" },
                { label: "Sätze", value: "4" },
              ]} />
              <SubTitle text="Beispiel Oberkörper" />
              <Bullet text="Bankdrücken: 5×5" />
              <Bullet text="Klimmzüge schwer: 5×5" />
              <Bullet text="Schulterdrücken: 4×5" />
            </Accordion>
            <Accordion id="ka-ul-p2" label="Phase 2 – Hypertrophie">
              <Table rows={[
                { label: "Intensität", value: "Mittel" },
                { label: "Wiederholungen", value: "8–12" },
                { label: "Sätze", value: "4–5" },
              ]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Bankdrücken: 4×10" />
              <Bullet text="Rudern: 4×10" />
              <Bullet text="Dips: 4×12" />
            </Accordion>
            <Accordion id="ka-ul-p3" label="Phase 3 – Kraftausdauer">
              <Table rows={[
                { label: "Intensität", value: "Gering" },
                { label: "Wiederholungen", value: "15–30" },
                { label: "Sätze", value: "3–6" },
              ]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Push-Ups: 4×30" />
              <Bullet text="Kabelrudern: 4×20" />
              <Bullet text="Schulterzirkel: 3×25" />
            </Accordion>
            <Accordion id="ka-ul-vorteil" label="Vorteil">
              <Bullet text="Hohe lokale Muskelausdauer" />
              <Bullet text="Bessere Ermüdungsresistenz" />
              <Bullet text="Starke Stoffwechselanpassung" />
            </Accordion>
          </div>
        </Card>

        {/* 3 */}
        <Section num={3} title="Mikrozyklusschema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Jede Woche hat einen anderen Belastungsschwerpunkt — geringe Monotonie, gute Regeneration, verschiedene Anpassungen.
          </p>
          <div className="mt-1">
            <Accordion id="ka-mk-prinzip" label="Prinzip">
              <Bullet text="Wöchentlicher Wechsel zwischen allen Trainingsbereichen" />
              <Bullet text="Geringe Monotonie durch hohe Variation" />
              <Bullet text="Gute Regeneration durch unterschiedliche Belastungen" />
            </Accordion>
            <Accordion id="ka-mk-w1" label="Woche 1 – Kraftausdauer">
              <Table rows={[{ label: "Gewicht", value: "Leicht" }, { label: "Wiederholungen", value: "12–15" }]} />
              <SubTitle text="Beispiel Beintraining" />
              <Bullet text="Kniebeugen: 3×15" />
              <Bullet text="Ausfallschritte: 3×20" />
              <Bullet text="Wadenheben: 3×25" />
            </Accordion>
            <Accordion id="ka-mk-w2" label="Woche 2 – Hypertrophie">
              <Table rows={[{ label: "Gewicht", value: "Mittel" }, { label: "Wiederholungen", value: "8–12" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Kniebeugen: 4×10" />
              <Bullet text="Beinpresse: 4×12" />
            </Accordion>
            <Accordion id="ka-mk-w3" label="Woche 3 – Maximalkraft">
              <Table rows={[{ label: "Gewicht", value: "Schwer" }, { label: "Wiederholungen", value: "4–6" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Kniebeugen: 5×5" />
              <Bullet text="Frontkniebeugen: 4×5" />
            </Accordion>
            <Accordion id="ka-mk-w4" label="Woche 4 – Schnellkraft">
              <Table rows={[{ label: "Gewicht", value: "Explosiv" }, { label: "Wiederholungen", value: "2–3" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Jump Squats" />
              <Bullet text="Box Jumps" />
            </Accordion>
          </div>
        </Card>

        {/* 4 */}
        <Section num={4} title="Wellenförmige Periodisierung" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Unterschiedliche Belastungsarten innerhalb derselben Woche — gleichzeitige Entwicklung mehrerer Fähigkeiten.
          </p>
          <div className="mt-1">
            <Accordion id="ka-wf-prinzip" label="Prinzip">
              <Bullet text="Gleichzeitige Entwicklung von Kraft, Hypertrophie und Ausdauer" />
              <Bullet text="Hohe Trainingsvielfalt & gute Stoffwechselanpassung" />
            </Accordion>
            <Accordion id="ka-wf-mo" label="Montag – Kraft">
              <Table rows={[{ label: "Sätze", value: "5" }, { label: "Wiederholungen", value: "5" }, { label: "Intensität", value: "Schwer" }]} />
              <SubTitle text="Beispiel Ganzkörper" />
              <Bullet text="Kniebeugen: 5×5" />
              <Bullet text="Bankdrücken: 5×5" />
            </Accordion>
            <Accordion id="ka-wf-mi" label="Mittwoch – Hypertrophie">
              <Table rows={[{ label: "Sätze", value: "4" }, { label: "Wiederholungen", value: "10" }, { label: "Intensität", value: "Mittel" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Kniebeugen: 4×10" />
              <Bullet text="Rudern: 4×10" />
            </Accordion>
            <Accordion id="ka-wf-fr" label="Freitag – Kraftausdauer">
              <Table rows={[{ label: "Sätze", value: "3–4" }, { label: "Wiederholungen", value: "20–30" }, { label: "Intensität", value: "Leicht" }]} />
              <SubTitle text="Beispiel" />
              <Bullet text="Burpees" />
              <Bullet text="Liegestütze" />
              <Bullet text="Kettlebell Swings" />
              <Bullet text="Air Squats" />
            </Accordion>
          </div>
        </Card>

        {/* 5 */}
        <Section num={5} title="Pendelschema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Das Training pendelt zwischen Hypertrophie, Kraft, Schnellkraft und Kraftausdauer — hohe Variation, sehr gute Ermüdungsresistenz.
          </p>
          <div className="mt-1">
            <Accordion id="ka-ps-prinzip" label="Prinzip">
              <Bullet text="Hohe Variation durch Wechsel aller Trainingsbereiche" />
              <Bullet text="Sehr gute Ermüdungsresistenz durch Kraftausdauer-Woche" />
              <Bullet text="Geringere Stagnation" />
            </Accordion>
            <Accordion id="ka-ps-plan" label="4-Wochen-Plan Schulter & Arme">
              <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
                <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                  <p className="text-[11px] font-bold text-gray-400 w-10">Woche</p>
                  <p className="text-[11px] font-bold text-gray-400 flex-1">Ziel</p>
                  <p className="text-[11px] font-bold text-gray-400 w-14">Wdh.</p>
                  <p className="text-[11px] font-bold text-gray-400 w-16 text-right">Intensität</p>
                </div>
                {[
                  ["1","Hypertrophie","8–12","mittel"],
                  ["2","Kraft","6–8","schwer"],
                  ["3","Schnellkraft","3–5","explosiv"],
                  ["4","Kraftausdauer","15–25","leicht"],
                ].map(([w, z, wdh, int], i, arr) => (
                  <div key={i} className="flex px-3 py-2.5 items-center"
                    style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                    <p className="text-xs text-gray-400 w-10">{w}</p>
                    <p className="text-xs text-white flex-1">{z}</p>
                    <p className="text-xs font-bold text-white w-14">{wdh}</p>
                    <p className="text-xs text-gray-400 w-16 text-right">{int}</p>
                  </div>
                ))}
              </div>
            </Accordion>
            <Accordion id="ka-ps-bsp" label="Konkrete Umsetzung">
              <SubTitle text="Woche 1" />
              <Bullet text="Schulterdrücken: 4×10" />
              <Bullet text="Bizepscurls: 4×12" />
              <SubTitle text="Woche 2" />
              <Bullet text="Schulterdrücken schwer: 5×6" />
              <Bullet text="Enges Bankdrücken: 5×6" />
              <SubTitle text="Woche 3" />
              <Bullet text="Push Press explosiv: 6×3" />
              <Bullet text="Medizinballwürfe" />
              <SubTitle text="Woche 4" />
              <Bullet text="Seitheben: 3×25" />
              <Bullet text="Kabelcurls: 3×25" />
              <Bullet text="Trizepsdrücken: 3×25" />
            </Accordion>
          </div>
        </Card>

        {/* 6 */}
        <Section num={6} title="Kombiniertes lineares + umgekehrt lineares System" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Grundübungen schwerer (linear), Isolationsübungen mit sehr hohen Wiederholungen und kurzen Pausen (umgekehrt linear) — Kombination aus Kraft und Ermüdungsresistenz.
          </p>
          <div className="mt-1">
            <Accordion id="ka-kl-prinzip" label="Prinzip">
              <Bullet text="Grundübungen → linear schwerer, Wdh. sinken" />
              <Bullet text="Isolationsübungen → sehr hohe Wdh., kurze Pausen" />
              <Bullet text="Hohe metabolische Belastung durch Isolationsanteil" />
            </Accordion>
            <Accordion id="ka-kl-grund" label="Grundübungen (linear) – Bankdrücken">
              <Table rows={[
                { label: "Woche 1", value: "4×10" },
                { label: "Woche 2", value: "5×6" },
                { label: "Woche 3", value: "5×3" },
              ]} />
            </Accordion>
            <Accordion id="ka-kl-iso" label="Isolationsübungen (umgekehrt linear) – Seitheben">
              <Table rows={[
                { label: "Woche 1", value: "3×15" },
                { label: "Woche 2", value: "3×20" },
                { label: "Woche 3", value: "3×30" },
              ]} />
            </Accordion>
          </div>
        </Card>

        {/* 7 */}
        <Section num={7} title="Wellenförmige Workouts für Kraftausdauer" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Innerhalb einer Woche wechseln schwere, mittlere und leichte Belastungen — starke Herz-Kreislauf-Belastung und lokale Muskelausdauer.
          </p>
          <div className="mt-1">
            <Accordion id="ka-ww-mo" label="Montag – Schwer">
              <div className="rounded-xl overflow-hidden mb-2" style={{ border: "1px solid #1e1e1e" }}>
                <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                  <p className="text-[11px] font-bold text-gray-400 flex-1">Übung</p>
                  <p className="text-[11px] font-bold text-gray-400 w-12 text-center">Sätze</p>
                  <p className="text-[11px] font-bold text-gray-400 w-10 text-right">Wdh.</p>
                </div>
                {[["Kniebeugen","5","5"],["Rudern","5","5"]].map(([ü,s,w],i,arr) => (
                  <div key={i} className="flex px-3 py-2.5 items-center"
                    style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                    <p className="text-xs text-gray-300 flex-1">{ü}</p>
                    <p className="text-xs font-bold text-white w-12 text-center">{s}</p>
                    <p className="text-xs text-gray-300 w-10 text-right">{w}</p>
                  </div>
                ))}
              </div>
            </Accordion>
            <Accordion id="ka-ww-mi" label="Mittwoch – Mittel">
              <div className="rounded-xl overflow-hidden mb-2" style={{ border: "1px solid #1e1e1e" }}>
                <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                  <p className="text-[11px] font-bold text-gray-400 flex-1">Übung</p>
                  <p className="text-[11px] font-bold text-gray-400 w-12 text-center">Sätze</p>
                  <p className="text-[11px] font-bold text-gray-400 w-10 text-right">Wdh.</p>
                </div>
                {[["Kniebeugen","4","10"],["Klimmzüge","4","10"]].map(([ü,s,w],i,arr) => (
                  <div key={i} className="flex px-3 py-2.5 items-center"
                    style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                    <p className="text-xs text-gray-300 flex-1">{ü}</p>
                    <p className="text-xs font-bold text-white w-12 text-center">{s}</p>
                    <p className="text-xs text-gray-300 w-10 text-right">{w}</p>
                  </div>
                ))}
              </div>
            </Accordion>
            <Accordion id="ka-ww-fr" label="Freitag – Kraftausdauerzirkel">
              <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
                <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                  <p className="text-[11px] font-bold text-gray-400 flex-1">Übung</p>
                  <p className="text-[11px] font-bold text-gray-400 w-20 text-right">Zeit / Wdh.</p>
                </div>
                {[["Burpees","30 sek"],["Push-Ups","25"],["Air Squats","30"],["Mountain Climbers","30 sek"]].map(([ü,t],i,arr) => (
                  <div key={i} className="flex px-3 py-2.5 items-center"
                    style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                    <p className="text-xs text-gray-300 flex-1">{ü}</p>
                    <p className="text-xs font-bold text-white w-20 text-right">{t}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: `${COLOR}15`, border: `1px solid ${COLOR}33` }}>
                <p className="text-xs font-bold mb-0.5" style={{ color: COLOR }}>3–5 Runden</p>
                <p className="text-sm text-gray-300">Pause: 30–60 sek zwischen Runden</p>
              </div>
            </Accordion>
            <Accordion id="ka-ww-vorteil" label="Vorteil">
              <Bullet text="Starke Herz-Kreislauf-Belastung" />
              <Bullet text="Lokale Muskelausdauer" />
              <Bullet text="Hohe Kalorienverbrennung" />
            </Accordion>
          </div>
        </Card>

        {/* 8 */}
        <Section num={8} title="Linearer Massezyklus mit Kraftausdauerfokus" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Schwere Tage wechseln mit Pump-Tagen und hohen Wiederholungszahlen — verbesserte Regenerationsfähigkeit und Muskelausdauer.
          </p>
          <div className="mt-1">
            <Accordion id="ka-lm-prinzip" label="Prinzip">
              <Bullet text="Schwere Tage & Pump-Tage im Wechsel" />
              <Bullet text="Hohe Wiederholungszahlen & kurze Pausen an Pump-Tagen" />
              <Bullet text="Verbesserte Regenerationsfähigkeit" />
            </Accordion>
            <Accordion id="ka-lm-schwer" label="Schwerer Push-Tag">
              <div className="rounded-xl overflow-hidden mb-2" style={{ border: "1px solid #1e1e1e" }}>
                <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                  <p className="text-[11px] font-bold text-gray-400 flex-1">Übung</p>
                  <p className="text-[11px] font-bold text-gray-400 w-14 text-center">Wdh.</p>
                  <p className="text-[11px] font-bold text-gray-400 w-16 text-right">Pause</p>
                </div>
                {[["Bankdrücken","8","2–3 min"],["Schulterdrücken","8","2–3 min"]].map(([ü,w,p],i,arr) => (
                  <div key={i} className="flex px-3 py-2.5 items-center"
                    style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                    <p className="text-xs text-gray-300 flex-1">{ü}</p>
                    <p className="text-xs font-bold text-white w-14 text-center">{w}</p>
                    <p className="text-xs text-gray-400 w-16 text-right">{p}</p>
                  </div>
                ))}
              </div>
            </Accordion>
            <Accordion id="ka-lm-pump" label="Kraftausdauer- / Pump-Tag">
              <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
                <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                  <p className="text-[11px] font-bold text-gray-400 flex-1">Übung</p>
                  <p className="text-[11px] font-bold text-gray-400 w-14 text-right">Wdh.</p>
                </div>
                {[["Kabelzüge","20"],["Seitheben","25"],["Pushdowns","25"]].map(([ü,w],i,arr) => (
                  <div key={i} className="flex px-3 py-2.5 items-center"
                    style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                    <p className="text-xs text-gray-300 flex-1">{ü}</p>
                    <p className="text-xs font-bold text-white w-14 text-right">{w}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl px-3 py-2.5" style={{ background: `${COLOR}15`, border: `1px solid ${COLOR}33` }}>
                <p className="text-xs font-bold mb-0.5" style={{ color: COLOR }}>Pause</p>
                <p className="text-sm text-gray-300">30–60 sek</p>
              </div>
            </Accordion>
            <Accordion id="ka-lm-vorteil" label="Vorteil">
              <Bullet text="Hohe metabolische Belastung" />
              <Bullet text="Verbesserte Regenerationsfähigkeit" />
              <Bullet text="Bessere Muskelausdauer" />
            </Accordion>
          </div>
        </Card>

        <button onClick={() => setShowWeiter(true)}
          className="w-full mt-4 mb-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: COLOR, color: "#000", fontFamily: F, border: "none" }}>
          WEITER → SPLITSYSTEME
        </button>

      </div>
    </div>
  );
}

// ── KraftSplitScreen ───────────────────────────────────────────────────────────
export function KraftSplitScreen({ onBack }: { onBack: () => void }) {
  const COLOR = "#e8a050";
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  function toggle(key: string) { setOpenAccordion(o => o === key ? null : key); }

  function Accordion({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
    const open = openAccordion === id;
    return (
      <div className="mb-2 rounded-xl overflow-hidden" style={{ border: `1px solid ${COLOR}33` }}>
        <button onClick={() => toggle(id)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          style={{ background: open ? `${COLOR}18` : "#161616", border: "none" }}>
          <p className="text-sm font-bold text-white">{label}</p>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <path d="M2 5L7 10L12 5" stroke={COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div className="px-4 pb-4 pt-2" style={{ background: "#111" }}>
            {children}
          </div>
        )}
      </div>
    );
  }

  function Bullet({ text }: { text: string }) {
    return (
      <div className="flex items-start gap-2 mb-1.5">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: COLOR }} />
        <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
      </div>
    );
  }

  function Table({ rows }: { rows: { label: string; value: string }[] }) {
    return (
      <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
        {rows.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
            <p className="text-sm text-gray-400">{r.label}</p>
            <p className="text-sm font-bold text-white">{r.value}</p>
          </div>
        ))}
      </div>
    );
  }

  function Card({ children }: { children: React.ReactNode }) {
    return (
      <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
        {children}
      </div>
    );
  }

  function SubTitle({ text }: { text: string }) {
    return <p className="text-xs font-bold text-white mb-2 mt-2">{text}</p>;
  }

  function Tag({ label, best }: { label: string; best?: boolean }) {
    return (
      <span className="text-[10px] font-black px-2 py-0.5 rounded-full mr-1"
        style={{ background: best ? COLOR : "#1e1e1e", color: best ? "#000" : "#888", fontFamily: F }}>
        {label}
      </span>
    );
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className="font-black italic text-2xl leading-none" style={{ fontFamily: F, color: COLOR }}>
            🏋️ KRAFT – SPLITSYSTEME
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Optimale Strukturen für maximale Kraft</p>
        </div>
      </div>

      <div className="px-4">

        {/* Hauptcharakteristik */}
        <p className="font-black text-sm mt-2 mb-3" style={{ fontFamily: F, color: COLOR }}>HAUPTCHARAKTERISTIK</p>
        <Table rows={[
          { label: "Intensität", value: "Sehr hoch" },
          { label: "Wiederholungen", value: "Niedrig (1–5)" },
          { label: "Frequenz", value: "Hoch" },
          { label: "Volumen", value: "Moderat" },
          { label: "Ermüdung", value: "Kritisch" },
          { label: "Technik", value: "Extrem wichtig" },
          { label: "Regeneration", value: "Zentral" },
        ]} />

        {/* Optimale Parameter */}
        <p className="font-black text-sm mt-4 mb-3" style={{ fontFamily: F, color: COLOR }}>OPTIMALE PARAMETER</p>
        <div className="flex gap-3 mb-4">
          <div className="flex-1 rounded-2xl px-4 py-3 text-center" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
            <p className="text-[10px] text-gray-500 mb-1">Wiederholungen</p>
            <p className="font-black text-lg" style={{ color: COLOR, fontFamily: F }}>1–5</p>
          </div>
          <div className="flex-1 rounded-2xl px-4 py-3 text-center" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
            <p className="text-[10px] text-gray-500 mb-1">Intensität</p>
            <p className="font-black text-lg" style={{ color: COLOR, fontFamily: F }}>80–95%</p>
            <p className="text-[10px] text-gray-500">1RM</p>
          </div>
          <div className="flex-1 rounded-2xl px-4 py-3 text-center" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
            <p className="text-[10px] text-gray-500 mb-1">Frequenz</p>
            <p className="font-black text-lg" style={{ color: COLOR, fontFamily: F }}>2–4×</p>
            <p className="text-[10px] text-gray-500">pro Woche</p>
          </div>
        </div>

        <div className="rounded-2xl px-4 py-3 mb-4" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-xs font-bold text-white mb-2">Warum hohe Frequenz?</p>
          <Bullet text="Kraft ist skillbasiert — Technikwiederholung ist entscheidend" />
          <Bullet text="Neuronale Effizienz verbessert sich durch regelmäßige Übung" />
          <Bullet text="Häufigere Reize fördern motorisches Lernen" />
        </div>

        {/* Splits */}
        <p className="font-black text-sm mt-4 mb-3" style={{ fontFamily: F, color: COLOR }}>OPTIMALE SPLITARTEN</p>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-black text-sm text-white" style={{ fontFamily: F }}>1. Ganzkörper</p>
            <Tag label="BESTE WAHL" best />
          </div>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Die effektivste Struktur für Kraftentwicklung — höchste Technikfrequenz, maximale neuronale Anpassung.
          </p>
          <Accordion id="ks-gk-detail" label="Details & Beispiel">
            <SubTitle text="Optimal für" />
            <Bullet text="Anfänger & Powerlifting" />
            <Bullet text="Lineare Kraftprogression" />
            <SubTitle text="Vorteile" />
            <Bullet text="Höchste Technikfrequenz" />
            <Bullet text="Schnelle neuronale Anpassung" />
            <Table rows={[{ label: "Frequenz", value: "3–4× / Woche" }]} />
            <SubTitle text="Beispielübungen (rotierend)" />
            <Bullet text="Squat · Bench · Deadlift · Press · Rows" />
          </Accordion>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>2. Upper / Lower</p>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Beste Allround-Kraftstruktur — hohe Frequenz bei besserer Regeneration pro Muskelgruppe.
          </p>
          <Accordion id="ks-ul-detail" label="Details">
            <Bullet text="Hohe Frequenz für alle Hauptbewegungen" />
            <Bullet text="Bessere Regeneration als Ganzkörper bei höherem Volumen" />
            <Bullet text="Geringere Einheitenermüdung" />
            <Table rows={[{ label: "Frequenz", value: "4× / Woche" }]} />
          </Accordion>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>3. Push / Pull / Legs (kraftorientiert)</p>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Nur sinnvoll für Fortgeschrittene mit hohem Arbeitsvolumen und Spezialisierungsbedarf.
          </p>
          <Accordion id="ks-ppl-detail" label="Details">
            <Bullet text="Erst ab Fortgeschrittenenniveau empfohlen" />
            <Bullet text="Hohes Arbeitsvolumen notwendig" />
            <Bullet text="Ermöglicht Spezialisierung einzelner Bewegungen" />
            <Table rows={[{ label: "Frequenz", value: "6× / Woche" }]} />
          </Accordion>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>4. DUP-Splits</p>
          <p className="text-xs text-gray-500 mb-2">Daily Undulating Periodization</p>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Sehr wichtig für fortgeschrittene Kraft — täglicher Wechsel zwischen Belastungsarten innerhalb einer Woche.
          </p>
          <Accordion id="ks-dup-detail" label="Beispielwoche">
            <Bullet text="Montag: Schwer (1–3 Wdh., 90–95 %)" />
            <Bullet text="Mittwoch: Moderat (4–6 Wdh., 80–85 %)" />
            <Bullet text="Freitag: Speed / Volumen (6–8 Wdh., 70–75 %)" />
          </Accordion>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>5. PHAT / PHUL</p>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Mischsysteme aus Kraft und Hypertrophie — sehr effizient für gleichzeitige Entwicklung beider Bereiche.
          </p>
          <Accordion id="ks-phat-detail" label="Eigenschaften">
            <Bullet text="Kombination aus Kraft- und Hypertrophietagen" />
            <Bullet text="Sehr effizient für simultane Entwicklung" />
            <Bullet text="Gut für Fortgeschrittene mit klarem Kraftfokus" />
          </Accordion>
        </Card>

        {/* Systemregeln */}
        <p className="font-black text-sm mt-4 mb-3" style={{ fontFamily: F, color: COLOR }}>KRAFT-SYSTEMREGELN</p>
        <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {[
            { r: "Regel 1", t: "Hohe Frequenz schlägt extrem hohes Volumen" },
            { r: "Regel 2", t: "Technikqualität ist limitierender Faktor" },
            { r: "Regel 3", t: "Axiale Ermüdung streng kontrollieren" },
            { r: "Regel 4", t: "RIR meist niedrig (0–2)" },
            { r: "Regel 5", t: "Lange Satzpausen: 3–8 Minuten" },
          ].map(({ r, t }, i, arr) => (
            <div key={i} className="flex items-start gap-3 py-2.5"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid #1e1e1e" : "none" }}>
              <p className="text-[10px] font-black flex-shrink-0 mt-0.5" style={{ color: COLOR, fontFamily: F }}>{r}</p>
              <p className="text-sm text-gray-300">{t}</p>
            </div>
          ))}
        </div>

        {/* Deload */}
        <div className="rounded-2xl px-4 py-3 mb-6" style={{ background: `${COLOR}15`, border: `1px solid ${COLOR}33` }}>
          <p className="text-xs font-black mb-2" style={{ color: COLOR, fontFamily: F }}>KRAFT-DELOAD</p>
          <Bullet text="Alle 3–6 Wochen" />
          <Bullet text="Oder bei Leistungsstagnation" />
        </div>

      </div>
    </div>
  );
}
