import { useState } from "react";
import type { ReactNode } from "react";
import { F, ORANGE, GREEN, BLUE } from "../styles/tokens";

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
export function HypertrophiePeriodisierungScreen({ onBack }: { onBack: () => void }) {
  const COLOR = GREEN;
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [showWeiter, setShowWeiter] = useState(false);

  if (showWeiter) return <HypertrophieSplitScreen onBack={() => setShowWeiter(false)} />;

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
export function HypertrophieSplitScreen({ onBack }: { onBack: () => void }) {
  const COLOR = GREEN;
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [showWeiter, setShowWeiter] = useState(false);

  if (showWeiter) return <HypertrophieUebungScreen onBack={() => setShowWeiter(false)} />;

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
            💪 HYPERTROPHIE – SPLITSYSTEME
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Optimale Strukturen für maximalen Muskelaufbau</p>
        </div>
      </div>

      <div className="px-4">

        {/* Primäre Anpassungen */}
        <p className="font-black text-sm mt-2 mb-3" style={{ fontFamily: F, color: COLOR }}>PRIMÄRE ANPASSUNGEN</p>
        <div className="rounded-2xl px-4 py-3 mb-4" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <Bullet text="Mechanische Spannung" />
          <Bullet text="Ausreichend Volumen" />
          <Bullet text="Lokale Ermüdung" />
          <Bullet text="Metabolischer Stress" />
          <Bullet text="Progressive Overload" />
        </div>

        {/* Hauptcharakteristik */}
        <p className="font-black text-sm mt-2 mb-3" style={{ fontFamily: F, color: COLOR }}>HAUPTCHARAKTERISTIK</p>
        <Table rows={[
          { label: "Volumen", value: "Hoch" },
          { label: "Frequenz", value: "Mittel–Hoch" },
          { label: "Intensität", value: "Moderat–Hoch" },
          { label: "Wiederholungen", value: "Breit (5–15)" },
          { label: "Ermüdung", value: "Lokal" },
          { label: "Regeneration", value: "Entscheidend" },
        ]} />

        {/* Optimale Parameter */}
        <p className="font-black text-sm mt-4 mb-3" style={{ fontFamily: F, color: COLOR }}>OPTIMALE PARAMETER</p>
        <div className="flex gap-3 mb-4">
          <div className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
            <p className="text-[10px] text-gray-500 mb-1">Wiederholungen</p>
            <p className="font-black text-base" style={{ color: COLOR, fontFamily: F }}>5–15</p>
            <p className="text-[10px] text-gray-500">Sweet Spot 6–12</p>
          </div>
          <div className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
            <p className="text-[10px] text-gray-500 mb-1">Frequenz</p>
            <p className="font-black text-base" style={{ color: COLOR, fontFamily: F }}>1.5–2.5×</p>
            <p className="text-[10px] text-gray-500">pro Muskel/Woche</p>
          </div>
          <div className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
            <p className="text-[10px] text-gray-500 mb-1">Volumen</p>
            <p className="font-black text-base" style={{ color: COLOR, fontFamily: F }}>10–25</p>
            <p className="text-[10px] text-gray-500">Sätze/Muskel/Woche</p>
          </div>
        </div>

        {/* Splits */}
        <p className="font-black text-sm mt-4 mb-3" style={{ fontFamily: F, color: COLOR }}>OPTIMALE SPLITARTEN</p>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-black text-sm text-white" style={{ fontFamily: F }}>1. Upper / Lower</p>
            <Tag label="BESTE UNIVERSALLÖSUNG" best />
          </div>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Perfekte Frequenz, moderate Ermüdung, gute Volumenverteilung — ideal für Naturals und langfristigen Aufbau.
          </p>
          <Accordion id="hs-ul-detail" label="Details">
            <SubTitle text="Optimal für" />
            <Bullet text="4 Trainingstage" />
            <Bullet text="Naturals & langfristigen Muskelaufbau" />
            <SubTitle text="Vorteile" />
            <Bullet text="Perfekte Frequenz (jede Gruppe 2×/Woche)" />
            <Bullet text="Moderate Ermüdung pro Einheit" />
            <Bullet text="Gute Volumenverteilung" />
            <Table rows={[{ label: "Frequenz", value: "4× / Woche → 2× pro Muskel" }]} />
          </Accordion>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-black text-sm text-white" style={{ fontFamily: F }}>2. 2,5er Split</p>
            <Tag label="OPTIMALE 5-TAGE-LÖSUNG" best />
          </div>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            5 Trainingstage ergeben 2,5× Frequenz pro Muskel — extrem stark für Volumen und Wachstum.
          </p>
          <Accordion id="hs-25-detail" label="Beispielstrukturen">
            <SubTitle text="Variante A" />
            <Bullet text="Push · Pull · Legs · Upper · Lower" />
            <SubTitle text="Variante B" />
            <Bullet text="Push · Pull · OFF · Legs · Upper" />
            <Table rows={[{ label: "Frequenz", value: "5 Tage → 2,5× pro Muskel" }]} />
          </Accordion>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>3. Push / Pull / Legs</p>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Sehr stark bei 5–6 Trainingstagen und hohem Volumen. Rotierend statt kalenderbasiert für optimale Regeneration.
          </p>
          <Accordion id="hs-ppl-detail" label="Details">
            <Bullet text="Ideal bei 5–6 Trainingstagen" />
            <Bullet text="Hohes Volumen & gute Regeneration" />
            <Bullet text="Rotierend, nicht kalenderbasiert" />
          </Accordion>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>4. Ganzkörper</p>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Sehr unterschätzt — extrem effektiv für Naturals mit moderatem Volumen und 3–4 Einheiten pro Woche.
          </p>
          <Accordion id="hs-gk-detail" label="Details">
            <Bullet text="Extrem effektiv für Naturals" />
            <Bullet text="Moderates Volumen pro Einheit" />
            <Table rows={[{ label: "Frequenz", value: "3–4 Einheiten / Woche" }]} />
          </Accordion>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>5. PHAT</p>
          <p className="text-sm text-gray-300 mb-3">
            Kombination aus Kraft und Hypertrophie — sehr effizient für simultane Entwicklung beider Bereiche.
          </p>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>6. PHH – Pumped Hard and Horny</p>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Hohe Frequenz, niedrige lokale Ermüdung, konstante Progression — nicht maximal zerstören, sondern maximal regenerierbares Volumen.
          </p>
          <Accordion id="hs-phh-detail" label="Systemlogik & Struktur">
            <SubTitle text="Ziel" />
            <Bullet text="Hohe Frequenz bei niedriger lokaler Ermüdung" />
            <Bullet text="Konstante Progression & hohe Bewegungsqualität" />
            <SubTitle text="Struktur (4 Tage)" />
            <Bullet text="Jede Muskelgruppe 2× pro Woche" />
            <Bullet text="Geringe Satzanzahl pro Einheit" />
            <Bullet text="Hohe Qualität statt maximale Erschöpfung" />
          </Accordion>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>7. Spezialisierungssplits</p>
          <p className="text-sm text-gray-300 mb-3">
            Für fortgeschrittene Athleten mit schwachen Muskelgruppen — eine Priorität bekommt deutlich mehr Volumen.
          </p>
          <Accordion id="hs-spez-detail" label="Beispiele">
            <Bullet text="Back Priority" />
            <Bullet text="Shoulder Priority" />
            <Bullet text="Arms Priority" />
          </Accordion>
        </Card>

        {/* Systemregeln */}
        <p className="font-black text-sm mt-4 mb-3" style={{ fontFamily: F, color: COLOR }}>HYPERTROPHIE-SYSTEMREGELN</p>
        <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {[
            { r: "Regel 1", t: "Volumen ist Haupttreiber des Muskelwachstums" },
            { r: "Regel 2", t: "Frequenz verbessert die Volumenverteilung" },
            { r: "Regel 3", t: "Zu viel Volumen senkt Qualität & Wachstum" },
            { r: "Regel 4", t: "Ermüdung MUSS kontrolliert werden" },
            { r: "Regel 5", t: "Axiale Ermüdung aktiv managen" },
            { r: "Regel 6", t: "Synergisten mitrechnen (z.B. Bankdrücken zählt für Brust, Trizeps, Schulter)" },
            { r: "Regel 7", t: "Übungsauswahl = Ermüdungsmanagement (z.B. Chest Supported Row regenerierbarer als Bent Over Row)" },
            { r: "Regel 8", t: "RIR meist 0–3" },
            { r: "Regel 9", t: "Satzpausen: 1–3 Minuten" },
            { r: "Regel 10", t: "Volumen zyklisieren (Deload · Volume Drop · Volume Ramp · Pausenphase)" },
          ].map(({ r, t }, i, arr) => (
            <div key={i} className="flex items-start gap-3 py-2.5"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid #1e1e1e" : "none" }}>
              <p className="text-[10px] font-black flex-shrink-0 mt-0.5" style={{ color: COLOR, fontFamily: F }}>{r}</p>
              <p className="text-sm text-gray-300">{t}</p>
            </div>
          ))}
        </div>

        <button onClick={() => setShowWeiter(true)}
          className="w-full mt-4 mb-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          style={{ background: COLOR, color: "#000", fontFamily: F, border: "none" }}>
          WEITER → ÜBUNGSAUSWAHL
        </button>

      </div>
    </div>
  );
}

// ── KraftausdauerSplitScreen ───────────────────────────────────────────────────
export function HypertrophieUebungScreen({ onBack }: { onBack: () => void }) {
  const COLOR = GREEN;
  const TABS = ["GK", "2er", "3er", "4er", "5er"] as const;
  type Tab = typeof TABS[number];
  const [activeTab, setActiveTab] = useState<Tab>("GK");

  function Bullet({ text }: { text: string }) {
    return (
      <div className="flex items-start gap-2 mb-1">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: COLOR }} />
        <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
      </div>
    );
  }

  function SubBullet({ text }: { text: string }) {
    return (
      <div className="flex items-start gap-2 mb-1 ml-4">
        <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: "#555" }} />
        <p className="text-xs text-gray-400 leading-relaxed">{text}</p>
      </div>
    );
  }

  function MuscleCard({ name, uebungen, saetze, struktur }: {
    name: string;
    uebungen: string;
    saetze: string;
    struktur: string[];
  }) {
    return (
      <div className="rounded-2xl mb-3 overflow-hidden" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: "1px solid #1e1e1e" }}>
          <p className="font-black text-sm text-white" style={{ fontFamily: F }}>{name}</p>
          <div className="flex gap-3">
            <div className="text-right">
              <p className="text-[10px] text-gray-500">Übungen</p>
              <p className="text-xs font-bold" style={{ color: COLOR }}>{uebungen}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">Sätze</p>
              <p className="text-xs font-bold" style={{ color: COLOR }}>{saetze}</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3">
          {struktur.map((s, i) => {
            if (s.startsWith("  ")) return <div key={i}><SubBullet text={s.trim()} /></div>;
            return <div key={i}><Bullet text={s} /></div>;
          })}
        </div>
      </div>
    );
  }

  const data: Record<Tab, { title: string; muscles: Parameters<typeof MuscleCard>[0][] }> = {
    "GK": {
      title: "Ganzkörper / Nicht-Schwerpunkt",
      muscles: [
        { name: "Brust", uebungen: "1", saetze: "3–6", struktur: ["Wechsel zwischen Druckübungen und Flys im Wechsel-Workout", "Wechsel zwischen Schrägbank- und Flachbankdrücken"] },
        { name: "Schulter", uebungen: "1", saetze: "3–6", struktur: ["Wechsel zwischen Druck- und Isolationsübungen", "Lang- und Kurzhanteldrücken variieren", "Aufrechtes Rudern und Seitheben abwechseln", "Hintere Schulter mind. 1× pro Monat isoliert"] },
        { name: "Rücken", uebungen: "1", saetze: "3–6", struktur: ["Wechsel zwischen Zug- und Ruderübungen", "Mind. 1× monatlich Überzüge oder gestreckter Latzug", "Unterer Rücken idealerweise 1× pro Woche"] },
        { name: "Trapez", uebungen: "1", saetze: "2–4", struktur: ["Abwechselnd obere, mittlere und untere Trapezmuskeln"] },
        { name: "Trizeps", uebungen: "1", saetze: "2–4", struktur: ["Wechsel zwischen Verbund- und Isolationsübungen", "Varianten wechseln um alle 3 Köpfe zu treffen"] },
        { name: "Bizeps", uebungen: "1", saetze: "2–4", struktur: ["Schwerpunkt auf klassischen Untergriff-Curls", "Curl-Varianten regelmäßig wechseln", "Verschiedene Winkel und Griffbreiten nutzen"] },
        { name: "Unterarme", uebungen: "1", saetze: "2–4", struktur: ["Wechsel zwischen Unterarmbeugen und Unterarmstrecken"] },
        { name: "Quadrizeps", uebungen: "1", saetze: "3–6", struktur: ["Wechsel zwischen: Kniebeugen, Beinpresse, Maschinenkniebeugen, Ausfallschritten, Beinstrecken"] },
        { name: "Hintere OS + Gesäß", uebungen: "1", saetze: "2–4", struktur: ["Wechsel zwischen Hüftstrecken und Beincurls"] },
        { name: "Waden", uebungen: "1", saetze: "3–6", struktur: ["Wechsel zwischen Gastrocnemius- und Soleus-Übungen"] },
        { name: "Bauch", uebungen: "1", saetze: "3–4", struktur: ["Wechsel: oberer, unterer, schräger Bauch, Core", "Variation in jedem zweiten Workout"] },
      ]
    },
    "2er": {
      title: "2er-Split (Oberkörper / Unterkörper)",
      muscles: [
        { name: "Brust", uebungen: "2", saetze: "6–8", struktur: ["1 Übung Schrägbank + 1 Übung Flachbank", "Kombination aus Druckübung und Flys", "Negativbank oder Kabel-Crossover mind. alle 2 Wochen"] },
        { name: "Schulter", uebungen: "2", saetze: "6–8", struktur: ["1. Druckübung", "2. Isolationsübung", "Wechsel Lang-/Kurzhantel", "Isolationen rotieren: Seitheben, Frontheben, hintere Schulter"] },
        { name: "Rücken", uebungen: "2", saetze: "6–8", struktur: ["1 Zugübung + 1 Ruderübung", "Reihenfolge wöchentlich wechseln", "Gestreckter Latzug / Überzüge ergänzen", "Unterer Rücken 1× pro Woche"] },
        { name: "Trapez", uebungen: "1", saetze: "2–4", struktur: ["Wechsel obere/mittlere/untere Trapezanteile"] },
        { name: "Trizeps", uebungen: "2", saetze: "4–8", struktur: ["1. Verbundübung (Drücken oder Dips)", "2. Isolation", "Alle drei Köpfe gezielt variieren"] },
        { name: "Bizeps", uebungen: "2", saetze: "4–8", struktur: ["1. Klassische Untergriff-Curls", "2. Fokus langer oder kurzer Kopf", "Regelmäßig Armbeugerübung ergänzen"] },
        { name: "Unterarme", uebungen: "1", saetze: "2–4", struktur: ["Unterarmbeugen + Unterarmstrecken rotieren"] },
        { name: "Quadrizeps", uebungen: "2", saetze: "6–8", struktur: ["1. Verbundübung", "2. Beinstrecken"] },
        { name: "Hintere OS + Gesäß", uebungen: "2", saetze: "4–8", struktur: ["1. Hüftstrecken", "2. Beincurls", "Übungen häufig variieren"] },
        { name: "Waden", uebungen: "2", saetze: "6–10", struktur: ["1. Gastrocnemius", "2. Soleus", "Reihenfolge variieren"] },
        { name: "Bauch", uebungen: "2", saetze: "6–8", struktur: ["2 Übungen für einen Bauchbereich", "Wechsel: oberer, unterer, schräger Bauch, Core", "Variation in jedem zweiten Workout"] },
      ]
    },
    "3er": {
      title: "3er-Split",
      muscles: [
        { name: "Brust", uebungen: "3", saetze: "6–12", struktur: ["1. Langhantelübung", "2. Kurzhanteldrücken", "3. Flys", "Schrägbank/Flys regelmäßig wechseln", "Negativbank/Kabelzüge ergänzen"] },
        { name: "Schulter", uebungen: "3", saetze: "6–12", struktur: ["1. Drückübung", "2. Seitheben oder aufrechtes Rudern", "3. Frontheben oder hintere Schulter"] },
        { name: "Rücken", uebungen: "3", saetze: "6–12", struktur: ["1. Zugübung", "2. Ruderübung", "3. Überzüge oder gestreckter Latzug", "Reihenfolge regelmäßig ändern"] },
        { name: "Trapez", uebungen: "2", saetze: "4–8", struktur: ["1. Obere Trapezmuskeln", "2. Mittlere oder untere Trapezmuskeln"] },
        { name: "Trizeps", uebungen: "3", saetze: "6–12", struktur: ["1. Verbundübung", "2. Überkopf-/liegende Extensions", "3. Pushdowns/Körperseiten-Extensions"] },
        { name: "Bizeps", uebungen: "3", saetze: "6–12", struktur: ["1. Klassische Curls", "2. Fokus langer/kurzer Kopf", "3. Armbeugerübung"] },
        { name: "Unterarme", uebungen: "2", saetze: "4–8", struktur: ["1 Beugeübung + 1 Streckübung"] },
        { name: "Quadrizeps", uebungen: "3", saetze: "9–12", struktur: ["1. Kniebeugen", "2. Zweite Verbundübung", "3. Beinstrecken"] },
        { name: "Hintere OS + Gesäß", uebungen: "2", saetze: "4–8", struktur: ["1. Hüftstrecken", "2. Beincurls"] },
        { name: "Waden", uebungen: "2", saetze: "6–10", struktur: ["Gastrocnemius + Soleus"] },
        { name: "Bauch", uebungen: "3", saetze: "6–10", struktur: ["1. Untere Bauchmuskulatur", "2. Obere Bauchmuskulatur", "3. Schräge Bauchmuskulatur", "Alle 2 Workouts: Core als 1. Übung, schräge Bauchübung entfällt"] },
      ]
    },
    "4er": {
      title: "4er-Split / Schwerpunktmuskelgruppen",
      muscles: [
        { name: "Brust", uebungen: "4", saetze: "8–16", struktur: ["1. Langhantel", "2. Kurzhantel", "3. KH-Flys", "4. Gerät/Kabel-Flys"] },
        { name: "Schulter", uebungen: "4", saetze: "8–16", struktur: ["1. Drückübung", "2. Seitheben/aufrechtes Rudern", "3. Frontheben", "4. Hintere Schulter"] },
        { name: "Rücken", uebungen: "4", saetze: "8–16", struktur: ["1. Zugübung", "2. Ruderübung", "3. Weitere Zug-/Ruderübung", "4. Überzüge/Latzug gestreckt"] },
        { name: "Trapez", uebungen: "2", saetze: "4–8", struktur: ["Obere + mittlere/untere Trapezmuskeln"] },
        { name: "Trizeps", uebungen: "3–4", saetze: "6–16", struktur: ["Verbundübung", "Überkopf-/liegende Extensions", "Pushdowns", "Zusätzliche Isolationsvariation"] },
        { name: "Bizeps", uebungen: "3–4", saetze: "6–16", struktur: ["Klassische Curls", "Langer Kopf", "Kurzer Kopf", "Armbeuger"] },
        { name: "Unterarme", uebungen: "2", saetze: "4–8", struktur: ["Beugeübung + Streckübung"] },
        { name: "Quadrizeps", uebungen: "4", saetze: "12–16", struktur: ["1. Kniebeugen", "2. Beinpresse", "3. Ausfallschritte/Aufsteigen", "4. Beinstrecken"] },
        { name: "Hintere OS + Gesäß", uebungen: "2–3", saetze: "4–12", struktur: ["1. Hüftstrecken", "2. Beincurls", "3. Weitere Curl-Variante"] },
        { name: "Waden", uebungen: "2–3", saetze: "6–12", struktur: ["Schwerpunkt Gastrocnemius + Soleus ergänzen"] },
        { name: "Bauch (3 Üb.)", uebungen: "3", saetze: "6–16", struktur: ["1. Untere Bauchmuskulatur", "2. Obere Bauchmuskulatur", "3. Schräge Bauchmuskulatur", "Alle 2 Workouts: Core als 1. Übung, schräge entfällt"] },
        { name: "Bauch (4 Üb.)", uebungen: "4", saetze: "6–16", struktur: ["1. Körpermitte/Core", "2. Untere Bauchmuskulatur", "3. Obere Bauchmuskulatur", "4. Schräge Bauchmuskulatur"] },
      ]
    },
    "5er": {
      title: "5er-Split / Full-Split Schwerpunkt",
      muscles: [
        { name: "Brust", uebungen: "4–5", saetze: "10–20", struktur: ["Kombination: Langhantel, Kurzhantel, Flys, Geräte/Kabel"] },
        { name: "Schulter", uebungen: "4", saetze: "8–16", struktur: ["Drückübung + 3 Isolationen (Seite, Front, hinten)"] },
        { name: "Rücken", uebungen: "4–5", saetze: "10–20", struktur: ["Mix aus Zug- und Ruderübungen, Überzüge ergänzen"] },
        { name: "Trapez", uebungen: "2–3", saetze: "8–12", struktur: ["Alle Trapezanteile abdecken"] },
        { name: "Trizeps", uebungen: "3–4", saetze: "6–16", struktur: ["Verbund + Extensions + Pushdowns + Variation"] },
        { name: "Bizeps", uebungen: "3–4", saetze: "6–16", struktur: ["Klassische Curls + langer/kurzer Kopf + Armbeuger"] },
        { name: "Unterarme", uebungen: "2", saetze: "4–8", struktur: ["Beugeübung + Streckübung"] },
        { name: "Quadrizeps", uebungen: "4–5", saetze: "12–20", struktur: ["Kniebeugen, Beinpresse, Ausfallschritte, Beinstrecken + Variation"] },
        { name: "Hintere OS + Gesäß", uebungen: "2–3", saetze: "4–12", struktur: ["Hüftstrecken + Beincurls + Variation"] },
        { name: "Waden", uebungen: "2–3", saetze: "6–12", struktur: ["Gastrocnemius + Soleus + Variation"] },
        { name: "Bauch", uebungen: "4", saetze: "8–16", struktur: ["1. Körpermitte/Core", "2. Untere Bauchmuskulatur", "3. Obere Bauchmuskulatur", "4. Schräge Bauchmuskulatur"] },
      ]
    },
  };

  const tabLabels: Record<Tab, string> = {
    "GK": "Ganzkörper",
    "2er": "2er-Split",
    "3er": "3er-Split",
    "4er": "4er-Split",
    "5er": "5er-Split",
  };

  const current = data[activeTab as Tab];

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-3 flex items-center gap-3">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className="font-black italic text-2xl leading-none" style={{ fontFamily: F, color: COLOR }}>
            💪 ÜBUNGSAUSWAHL
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Empfehlungen nach Splittyp</p>
        </div>
      </div>

      {/* Tab-Leiste */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-shrink-0 px-4 py-2 rounded-xl font-black text-xs"
              style={{
                fontFamily: F,
                background: activeTab === tab ? COLOR : "#111",
                color: activeTab === tab ? "#000" : "#666",
                border: `1px solid ${activeTab === tab ? COLOR : "#1e1e1e"}`,
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab-Titel */}
      <div className="px-4 mb-3">
        <p className="font-black text-sm" style={{ fontFamily: F, color: COLOR }}>
          {current.title.toUpperCase()}
        </p>
      </div>

      {/* Muskelkarten */}
      <div className="px-4">
        {current.muscles.map((m, i) => (
          <div key={i}><MuscleCard {...m} /></div>
        ))}
        <div className="mb-6" />
      </div>
    </div>
  );
}
