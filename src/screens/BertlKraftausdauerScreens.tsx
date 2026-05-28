import { useState } from "react";
import type { ReactNode } from "react";
import { F, ORANGE, GREEN, BLUE } from "../styles/tokens";

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
export function KraftausdauerPeriodisierungScreen({ onBack }: { onBack: () => void }) {
  const COLOR = BLUE;
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [showWeiter, setShowWeiter] = useState(false);

  if (showWeiter) return <KraftausdauerSplitScreen onBack={() => setShowWeiter(false)} />;


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
export function KraftausdauerSplitScreen({ onBack }: { onBack: () => void }) {
  const COLOR = BLUE;
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
            ⚡ KRAFTAUSDAUER – SPLITSYSTEME
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Optimale Strukturen für Leistungserhalt unter Ermüdung</p>
        </div>
      </div>

      <div className="px-4">

        {/* Primäre Anpassungen */}
        <p className="font-black text-sm mt-2 mb-3" style={{ fontFamily: F, color: COLOR }}>PRIMÄRE ANPASSUNGEN</p>
        <div className="rounded-2xl px-4 py-3 mb-4" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <Bullet text="Metabolische Effizienz" />
          <Bullet text="Laktattoleranz" />
          <Bullet text="Lokale Ausdauer" />
          <Bullet text="Mitochondriale Anpassungen" />
          <Bullet text="Kapillarisierung" />
        </div>

        {/* Hauptcharakteristik */}
        <p className="font-black text-sm mt-2 mb-3" style={{ fontFamily: F, color: COLOR }}>HAUPTCHARAKTERISTIK</p>
        <Table rows={[
          { label: "Wiederholungen", value: "Hoch (15–30+)" },
          { label: "Intensität", value: "Niedrig–Moderat (30–60 %)" },
          { label: "Frequenz", value: "Hoch" },
          { label: "Volumen", value: "Hoch" },
          { label: "Pausen", value: "Kurz (30–90 sek)" },
          { label: "Ermüdung", value: "Metabolisch" },
        ]} />

        {/* Parameter-Boxen */}
        <p className="font-black text-sm mt-4 mb-3" style={{ fontFamily: F, color: COLOR }}>OPTIMALE PARAMETER</p>
        <div className="flex gap-3 mb-4">
          <div className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
            <p className="text-[10px] text-gray-500 mb-1">Wiederholungen</p>
            <p className="font-black text-base" style={{ color: COLOR, fontFamily: F }}>15–30+</p>
          </div>
          <div className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
            <p className="text-[10px] text-gray-500 mb-1">Intensität</p>
            <p className="font-black text-base" style={{ color: COLOR, fontFamily: F }}>30–60%</p>
            <p className="text-[10px] text-gray-500">1RM</p>
          </div>
          <div className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
            <p className="text-[10px] text-gray-500 mb-1">Satzpause</p>
            <p className="font-black text-base" style={{ color: COLOR, fontFamily: F }}>30–90</p>
            <p className="text-[10px] text-gray-500">Sekunden</p>
          </div>
        </div>

        {/* Splits */}
        <p className="font-black text-sm mt-4 mb-3" style={{ fontFamily: F, color: COLOR }}>OPTIMALE SPLITARTEN</p>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-black text-sm text-white" style={{ fontFamily: F }}>1. Ganzkörper</p>
            <Tag label="BESTE WAHL" best />
          </div>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Höchster Kalorienumsatz, hohe Herz-Kreislauf-Belastung und maximale Frequenz — ideal für Kraftausdauer.
          </p>
          <Accordion id="kas-gk-detail" label="Warum Ganzkörper?">
            <Bullet text="Hoher Kalorienumsatz durch viele Muskelgruppen" />
            <Bullet text="Hohe Herz-Kreislauf-Belastung" />
            <Bullet text="Hohe Trainingsfrequenz pro Muskelgruppe" />
          </Accordion>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>2. Zirkeltraining</p>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Sehr effizient — kurze Pausen, hoher Durchsatz, maximale metabolische Belastung in kurzer Zeit.
          </p>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>3. Push / Pull</p>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Ideal für Kampfsport, Athletik und funktionelle Ausdauer — klare Trennung der Zugrichtungen.
          </p>
          <Accordion id="kas-pp-detail" label="Einsatzgebiete">
            <Bullet text="Kampfsport & Athletik" />
            <Bullet text="Funktionelle Ausdauer" />
            <Bullet text="Gute Balance zwischen Agonist und Antagonist" />
          </Accordion>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>4. Oberkörper / Unterkörper</p>
          <p className="text-sm text-gray-300 mb-3">
            Gut bei hohen Trainingsfrequenzen — klare Aufteilung ermöglicht hohes Volumen pro Bereich.
          </p>
        </Card>

        <Card>
          <p className="font-black text-sm text-white mb-2" style={{ fontFamily: F }}>5. Hybrid-Cross-Training</p>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Kombination aus Kraft, Conditioning und Volumen — maximale Vielseitigkeit für athletische Leistung.
          </p>
          <Accordion id="kas-hct-detail" label="Eigenschaften">
            <Bullet text="Kombiniert Kraft, Conditioning & Volumen" />
            <Bullet text="Maximale Vielseitigkeit" />
            <Bullet text="Gut für CrossFit und funktionelles Training" />
          </Accordion>
        </Card>

        {/* Systemregeln */}
        <p className="font-black text-sm mt-4 mb-3" style={{ fontFamily: F, color: COLOR }}>KRAFTAUSDAUER-SYSTEMREGELN</p>
        <div className="rounded-2xl px-4 py-3 mb-6" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {[
            { r: "Regel 1", t: "Lokale Ermüdung ist erwünscht und gewollt" },
            { r: "Regel 2", t: "Kurze Pausen sind zentral für den Trainingsreiz" },
            { r: "Regel 3", t: "Bewegungsdichte wichtiger als Last" },
            { r: "Regel 4", t: "Systemische Ermüdung überwachen" },
            { r: "Regel 5", t: "Nicht bis absolutes Muskelversagen — Technik hat Vorrang" },
          ].map(({ r, t }, i, arr) => (
            <div key={i} className="flex items-start gap-3 py-2.5"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid #1e1e1e" : "none" }}>
              <p className="text-[10px] font-black flex-shrink-0 mt-0.5" style={{ color: COLOR, fontFamily: F }}>{r}</p>
              <p className="text-sm text-gray-300">{t}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── HypertrophieUebungScreen ───────────────────────────────────────────────────
