import { useState } from "react";
import type { ReactNode } from "react";
import { F, ORANGE, GREEN, BLUE } from "../styles/tokens";

export function IntensivoScreen({ onBack }: { onBack: () => void }) {
  const COLOR = "#ef4444";
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (k: string) => setOpen(o => o === k ? null : k);

  function Acc({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
    const isOpen = open === id;
    return (
      <div className="mb-2 rounded-xl overflow-hidden" style={{ border: `1px solid ${COLOR}33` }}>
        <button onClick={() => toggle(id)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          style={{ background: isOpen ? `${COLOR}18` : "#161616", border: "none" }}>
          <p className="text-sm font-bold text-white">{label}</p>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <path d="M2 5L7 10L12 5" stroke={COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {isOpen && <div className="px-4 pb-4 pt-2" style={{ background: "#111" }}>{children}</div>}
      </div>
    );
  }

  function B({ text }: { text: string }) {
    return (
      <div className="flex items-start gap-2 mb-1.5">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: COLOR }} />
        <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
      </div>
    );
  }

  function Stars({ n, max = 5 }: { n: number; max?: number }) {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: max }, (_, i) => (
          <div key={i} className="w-3 h-3 rounded-full"
            style={{ background: i < n ? COLOR : "#2a2a2a" }} />
        ))}
      </div>
    );
  }

  function Rating({ rows }: { rows: [string, number][] }) {
    return (
      <div className="rounded-xl overflow-hidden mt-3 mb-2" style={{ border: "1px solid #1e1e1e" }}>
        {rows.map(([label, n], i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2"
            style={{ borderBottom: i < rows.length - 1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
            <p className="text-xs text-gray-400">{label}</p>
            <Stars n={n} />
          </div>
        ))}
      </div>
    );
  }

  const techniques = [
    {
      id: "hit", label: "1. High-Intensity Training (HIT)",
      kurzfazit: "Wenig trainieren, aber brutal hart.",
      rating: [["Zeit", 5], ["Länge", 5], ["Schwierigkeit", 5], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Sehr wenig Volumen, aber maximale Intensität. Meist 1 Satz pro Übung bis zum Muskelversagen — oft ergänzt durch erzwungene, negative oder Teilwiederholungen.
          </p>
          <p className="text-xs font-bold text-white mb-1">Typischer Aufbau</p>
          <B text="1 Satz · 8–10 Wdh. · schwere Gewichte" />
          <B text="Ganzkörper- oder 2er-Split möglich" />
          <B text="Jeder Satz bis zum Muskelversagen" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Vorteile</p>
          <B text="Sehr zeitsparend & extrem intensiv" />
          <B text="Gut für kurzfristige Kraft- und Muskelreize" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Sehr hohe Belastung fürs Nervensystem" />
          <B text="Muskelversagen erhöht Verletzungsrisiko" />
          <B text="Nicht ideal langfristig" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · wenig Zeit · Kurzzeit-Intensivphase (4–6 Wochen)" />
        </>
      ),
    },
    {
      id: "pump", label: "2. Finish-Pump-Methode",
      kurzfazit: "Von schwer zu leicht für maximalen Pump.",
      rating: [["Zeit", 3], ["Länge", 3], ["Schwierigkeit", 4], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Mit steigenden Wiederholungszahlen den Muskel aufpumpen: schwer → mittel → leicht.
          </p>
          <p className="text-xs font-bold text-white mb-1">Beispiel Beine</p>
          <B text="Kniebeugen 6–8 · Beinpresse 8–10 · Ausfallschritte 12–15 · Beinstrecken 15–20" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Vorteile</p>
          <B text="Maximaler Pump & starke Durchblutung" />
          <B text="Sehr gutes Muskelgefühl & gute Hypertrophie-Reize" />
          <B text="Ideal am Trainingsende" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Sehr anstrengend · lange Brennphase" />
          <B text="Weniger Fokus auf Maximalkraft" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Bodybuilding-orientiertes Training" />
        </>
      ),
    },
    {
      id: "100er", label: "3. 100er-Training",
      kurzfazit: "Leichtes Gewicht, aber endlose Wiederholungen.",
      rating: [["Zeit", 2], ["Länge", 2], ["Schwierigkeit", 5], ["Resultate", 3]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Eine Übung = 100 Wiederholungen. Gewicht nur ca. 20–30 % des normalen Trainingsgewichts. Kurze Pausen bis 100 Wdh. erreicht sind.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Riesiger Pump & brutale mentale Herausforderung" />
          <B text="Gute Fettverbrennung · sehr starke Durchblutung" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Extrem schmerzhaft · lange Belastung" />
          <B text="Kaum Kraftsteigerung · sehr hohe Ermüdung" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · kurze Schockphasen" />
        </>
      ),
    },
    {
      id: "gvt", label: "4. German Volume Training (GVT)",
      kurzfazit: "Das Volumen-Monster.",
      rating: [["Zeit", 1], ["Länge", 1], ["Schwierigkeit", 5], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Klassisches „10×10" — 10 Sätze · 10 Wiederholungen · gleiches Gewicht. Meist mit Grundübungen und kurzen Pausen (~2 min). Massiver Muskelaufbau durch extrem hohes Volumen.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Sehr effektiver Muskelaufbau · klare Struktur" />
          <B text="Hoher Trainingsreiz" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Sehr lang & sehr ermüdend" />
          <B text="Hohe Regenerationsanforderung · mental zäh" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Massephase" />
        </>
      ),
    },
    {
      id: "21er", label: "5. 21er Methode",
      kurzfazit: "Dauer-Spannung durch Teilbewegungen.",
      rating: [["Zeit", 4], ["Länge", 4], ["Schwierigkeit", 4], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            1 Satz = 21 Wdh. in 3 Bereichen: 7 halbe Wdh. unten + 7 halbe Wdh. oben + 7 volle Wdh. Sehr beliebt bei Bizepscurls und Isolationen.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Extrem intensiver Muskelreiz · sehr gutes Muskelgefühl" />
          <B text="Neue Wachstumsreize" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Schnell brennend · weniger Gewicht möglich" />
          <B text="Technik leidet schnell" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Isolationsübungen" />
        </>
      ),
    },
    {
      id: "slow", label: "6. Training mit langsamen Wiederholungen",
      kurzfazit: "Weniger Gewicht, mehr Kontrolle.",
      rating: [["Zeit", 3], ["Länge", 3], ["Schwierigkeit", 4], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Sehr langsames Tempo — positiv ~10 Sek., negativ ~10 Sek. Kaum Schwung erlaubt. Maximale Muskelspannung und bessere Kontrolle.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Sehr saubere Technik · hohe Muskelspannung" />
          <B text="Gelenkschonender · gute Mind-Muscle-Connection" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Weniger Gewicht möglich · mental anstrengend" />
          <B text="Sehr brennend" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Techniktraining · kontrollierter Muskelaufbau · Reha" />
        </>
      ),
    },
    {
      id: "speed", label: "7. Speedsatztraining",
      kurzfazit: "Alle Wiederholungsgeschwindigkeiten in einem Satz.",
      rating: [["Zeit", 3], ["Länge", 3], ["Schwierigkeit", 4], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Ein Satz kombiniert explosive, ultralangsame und normale Wdh. Beispiel: Wdh. 1–5 explosiv · 6–10 ultralangsam · 11–15 normal. Aktiviert mehr Muskelfasern.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Sehr abwechslungsreich · trainiert mehrere Fasertypen" />
          <B text="Kombination aus Kraft + Muskelaufbau" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Technisch anspruchsvoll · Konzentration nötig" />
          <B text="Nicht für Anfänger" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Plateau-Durchbrechung" />
        </>
      ),
    },
    {
      id: "pyramid", label: "8. Pyramidenmethode",
      kurzfazit: "Von leicht zu schwer für Kraft und Muskelaufbau.",
      rating: [["Zeit", 3], ["Länge", 3], ["Schwierigkeit", 3], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Mit jedem Satz: Gewicht hoch, Wdh. runter — dann oft zurück. Beispiel: 60×10 → 85×8 → 100×6 → 110×4. Kombination aus Aufwärmen, Kraft und Muskelaufbau.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Sehr vielseitig · gute Vorbereitung auf schwere Gewichte" />
          <B text="Sicherer Belastungsanstieg · für viele Ziele geeignet" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Dauert länger · viele Aufwärmsätze" />
          <B text="Ermüdung vor schweren Sätzen möglich" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fast alle Trainingslevel · sehr guter Allround-Ansatz" />
        </>
      ),
    },
    {
      id: "revpyramid", label: "9. Umgekehrte Pyramide",
      kurzfazit: "Zuerst maximal stark sein, dann Volumen sammeln.",
      rating: [["Zeit", 4], ["Länge", 4], ["Schwierigkeit", 4], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Zuerst der schwerste Satz — dann Gewicht reduzieren, Wdh. leicht anheben. Maximale Leistung während man noch frisch ist. Beispiel: 84×8 → 80×8 → 72×8 → 80×4 → 84×2.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Hohe Kraftentwicklung · sehr effizient" />
          <B text="Gute Kombination aus Kraft + Hypertrophie · mental stark fokussiert" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Sehr gutes Aufwärmen nötig" />
          <B text="Verletzungsrisiko höher bei schlechter Vorbereitung" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Kraft- und Muskelaufbau kombiniert" />
        </>
      ),
    },
    {
      id: "breakdown", label: "10. Breakdowns",
      kurzfazit: "Ein Satzsystem für alle Muskelfasern.",
      rating: [["Zeit", 3], ["Länge", 3], ["Schwierigkeit", 5], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            3 Gewichtsbereiche in derselben Übung: schwer (4–6 Wdh.) → Gewicht –15–20 % → mittel (10–15 Wdh.) → nochmals stark reduziert → leicht (25–30 Wdh.). Trainiert alle Muskelfasertypen.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Sehr kompletter Reiz · Kombination aus Kraft + Pump + Ausdauer" />
          <B text="Gute Muskelerschöpfung" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Sehr anstrengend · lange Einheit" />
          <B text="Hohe Regenerationsbelastung" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene Bodybuilder · Intensivphase" />
        </>
      ),
    },
    {
      id: "dropset", label: "11. Reduktionssätze (Dropsätze)",
      kurzfazit: "Wenn der Muskel fertig ist — einfach leichter weitermachen.",
      rating: [["Zeit", 4], ["Länge", 4], ["Schwierigkeit", 4], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Sobald Muskelversagen erreicht: Gewicht sofort reduzieren und direkt weitertrainieren — kaum Pause. Beispiel: 45 kg×10 → 35 kg×weitere Wdh. → 25 kg×weitere Wdh.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Riesiger Pump · sehr intensiv · spart Zeit" />
          <B text="Gute Hypertrophie-Reize" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Sehr schmerzhaft · hohe Ermüdung" />
          <B text="Technik leidet oft am Ende" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · ideal als letzter Satz" />
        </>
      ),
    },
    {
      id: "altpause", label: "12. Abwechselnde Pausen",
      kurzfazit: "Eine Seite pausiert, während die andere arbeitet.",
      rating: [["Zeit", 4], ["Länge", 4], ["Schwierigkeit", 3], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Abwechselnd links/rechts trainieren. Beispiel: rechter Arm 3 Wdh. → linker Arm 3 Wdh. → wieder rechts. Eine Seite erholt sich kurz, während die andere arbeitet — schwerere Gewichte mit mehr Gesamt-Wdh. möglich.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Gute Kraftsteigerung · hohe Trainingsdichte" />
          <B text="Gute Muskelkontrolle · effizient" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Konzentration & Koordination nötig" />
          <B text="Kann sehr ermüdend werden" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Mittelstufe bis fortgeschritten · besonders bei einarmigen Übungen" />
        </>
      ),
    },
    {
      id: "preex", label: "13. Vorermüdungstraining",
      kurzfazit: "Den Zielmuskel zuerst müde machen.",
      rating: [["Zeit", 3], ["Länge", 3], ["Schwierigkeit", 4], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Zuerst Isolationsübung, dann sofort schwere Verbundübung. Beispiel Schulter: Seitheben → direkt Schulterdrücken. Der Zielmuskel wird vorher ermüdet, sodass er bei der Verbundübung stärker arbeitet als die Hilfsmuskeln.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Sehr gutes Muskelgefühl · Zielmuskel arbeitet härter" />
          <B text="Gut bei schwachen Muskelgruppen · gelenkschonender möglich" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Weniger Gewicht bei Verbundübung · schnell erschöpfend" />
          <B text="Nicht optimal für Maximalkraft" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Bodybuilding · Schwächen gezielt verbessern" />
        </>
      ),
    },
    {
      id: "5x5_10x10", label: "14. 5×5 / 10×10 Kraftprogramme",
      kurzfazit: "Zwei Klassiker — einer für Kraft, einer für Masse.",
      rating: [["Zeit", 2], ["Länge", 2], ["Schwierigkeit", 5], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-xs font-bold text-white mb-1">5×5 — Kraft</p>
          <p className="text-sm text-gray-300 leading-relaxed mb-2">
            5 Sätze · 5 Wdh. · schweres Gewicht (~85 % 1RM). Extrem effektiv für Kraft, klare Progression, gute Grundübungsentwicklung.
          </p>
          <B text="Klassiker für rohe Kraft · hohe Gelenkbelastung" />
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <p className="text-xs font-bold text-white mb-1">10×10 (GVT) — Masse</p>
            <p className="text-sm text-gray-300 leading-relaxed mb-2">
              10 Sätze · 10 Wdh. · mittleres Gewicht (~65–70 %). Massiver Muskelaufbau durch extrem hohes Volumen. Brutale Ermüdung, sehr lange Einheit.
            </p>
            <B text="Riesiger Wachstumsreiz · Regeneration schwierig" />
          </div>
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="5×5: Kraftsportler · 10×10: Massephase Fortgeschrittene" />
        </>
      ),
    },
    {
      id: "532", label: "15. Methode 5-3-2",
      kurzfazit: "Von schwer zu extrem schwer.",
      rating: [["Zeit", 3], ["Länge", 3], ["Schwierigkeit", 5], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            10-Wochen-Kraftprogramm in 3 Phasen: 5×5 (~85 % 1RM) → 3×3 (~90 %) → 2×2 (~95 %). Gewicht steigt ständig. Maximalkraft durch hohe neuronale Anpassung.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Sehr systematische Kraftsteigerung · klare Progression" />
          <B text="Hohe neuronale Anpassung" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Sehr schwere Gewichte · hohe Gelenk-/Nervensystembelastung" />
          <B text="Kaum Fokus auf Pump/Hypertrophie" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Erfahrene Kraftsportler · Powerlifting-orientiert" />
        </>
      ),
    },
    {
      id: "strongrep", label: "16. Stark mit vielen Wiederholungen",
      kurzfazit: "Schwer trainieren — dann den Muskel komplett ausbrennen.",
      rating: [["Zeit", 3], ["Länge", 3], ["Schwierigkeit", 4], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Japanische Studie: Schweres Krafttraining (5×3–5) PLUS ein leichter Zusatzsatz mit 25–30 Wdh. Beispiel: 5×5 Kniebeugen mit 85 % 1RM, danach 1×25–30 mit 45–50 %.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Sehr gute Kombination aus Kraft und Hypertrophie" />
          <B text="Mehr Trainingsvolumen ohne viele Extraübungen" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Sehr anstrengend · Zusatzsatz brennt brutal" />
          <B text="Regeneration anspruchsvoller" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Kraftsportler mit Muskelaufbau-Fokus" />
        </>
      ),
    },
    {
      id: "fivepct", label: "17. 5-%-Methode",
      kurzfazit: "Jedes Workout etwas schwerer.",
      rating: [["Zeit", 3], ["Länge", 3], ["Schwierigkeit", 4], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            In jedem Workout: Gewicht +5 %, Wdh. −1. Beispiel: Workout 1 → 4×6 · Workout 2 → 4×5 (+5 %) · Workout 3 → 4×4 (+5 %) · Workout 4 → Gewicht leicht senken, wieder 4×6.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Sehr klar strukturiert · messbare Fortschritte" />
          <B text="Hohe Kraftsteigerung möglich (~10 %)" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Funktioniert nur begrenzte Zeit · hohe Belastung" />
          <B text="Gute Regeneration nötig" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Fokus auf Grundübungen" />
        </>
      ),
    },
    {
      id: "wave", label: "18. Wellentraining",
      kurzfazit: "Das Nervensystem auf maximale Leistung hochfahren.",
      rating: [["Zeit", 3], ["Länge", 3], ["Schwierigkeit", 5], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Innerhalb eines Workouts: Gewicht steigt, Wdh. sinken. Beispiel: 3×90 % → 2×95 % → 1×100 % — dann zweite Welle leicht schwerer. Das Nervensystem wird potenziert, um schwerere Gewichte explosiver zu bewegen.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Extrem effektiv für Maximalkraft · sehr gute neuronale Anpassung" />
          <B text="Explosivität steigt" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Sehr hohe Intensität · hohe CNS-Belastung" />
          <B text="Technisch anspruchsvoll" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Erfahrene Kraftsportler · Powerlifting" />
        </>
      ),
    },
    {
      id: "restpause", label: "19. Pausensätze (Rest-Pause)",
      kurzfazit: "Zwischen jeder Wiederholung kurz neu laden.",
      rating: [["Zeit", 4], ["Länge", 4], ["Schwierigkeit", 5], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Kurze Mini-Pausen innerhalb eines Satzes: 1 Wdh. → 5–15 Sek. Pause → nächste Wdh. → wieder Pause — bis insgesamt 3–5 Wdh. Mehr schwere Wdh. mit demselben Gewicht möglich.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Sehr kraftorientiert · hohe Muskelfaseraktivierung" />
          <B text="Sehr effizient" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Extrem intensiv · Nervensystem stark belastet" />
          <B text="Nicht für Anfänger" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Kraftfokus" />
        </>
      ),
    },
    {
      id: "density", label: "20. Verdichtungstraining",
      kurzfazit: "Mehr Arbeit in weniger Zeit.",
      rating: [["Zeit", 5], ["Länge", 5], ["Schwierigkeit", 4], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Gleiche Arbeit in immer kürzerer Zeit. Beispiel: 12×2 mit 50 Sek. Pause → später 45 Sek. → 40 Sek. Oder: mehr Wdh. in gleicher Zeit. Arbeitsdichte erhöhen — mehr Leistung pro Minute.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Extrem gute Konditionierung · Kraftausdauer steigt stark" />
          <B text="Sehr effizient" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Brutal anstrengend · Herz-Kreislauf stark belastet" />
          <B text="Schwer durchzuhalten" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Athleten · Kampfsport · Conditioning" />
        </>
      ),
    },
    {
      id: "antag", label: "21. Antagonistisches Training",
      kurzfazit: "Gegenspieler abwechselnd trainieren.",
      rating: [["Zeit", 5], ["Länge", 5], ["Schwierigkeit", 3], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Gegenspieler direkt kombinieren: Bankdrücken ↔ Langhantelrudern · Bizeps ↔ Trizeps · Quadrizeps ↔ Beinbeuger. Man wechselt direkt zwischen beiden Übungen — oft sogar stärker in Übung 2.
          </p>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Spart Zeit · sehr effizient · oft sogar stärker in Übung 2" />
          <B text="Gute Balance im Körper" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Anspruchsvoll · hohe Gesamtbelastung · Puls steigt stark" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fast alle Fortgeschrittenen · sehr gut für Push/Pull-Systeme" />
        </>
      ),
    },
    {
      id: "eco", label: "22. ECO-Training",
      kurzfazit: "Eine der athletischsten Methoden — stark für explosive Kraft und funktionelle Leistungsfähigkeit.",
      rating: [["Zeit", 4], ["Länge", 3], ["Schwierigkeit", 4], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Drei Belastungsarten in fester Reihenfolge: E = Explosive Exercise (Sprungkniebeugen, Powerliegestütze) → C = Closed-Chain (Kniebeugen, Klimmzüge) → O = Open-Chain / Isolation (Flys, Beinstrecken).
          </p>
          <p className="text-xs font-bold text-white mb-1">Beispiel Brust</p>
          <B text="Powerliegestütze → Bankdrücken → Kurzhantelflys" />
          <p className="text-xs font-bold text-white mt-2 mb-1">Beispiel Beine</p>
          <B text="Sprungkniebeugen → Kniebeugen → Beinstrecken" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Vorteile</p>
          <B text="Kombiniert mehrere Trainingsreize · sehr sportorientiert" />
          <B text="Hohe Muskelaktivierung · gute Mischung aus Kraft und Leistung" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Technisch anspruchsvoll · hohe Ermüdung" />
          <B text="Explosive Übungen erhöhen Verletzungsrisiko bei schlechter Technik" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Athleten · Sportler · funktioneller Muskelaufbau" />
        </>
      ),
    },
    {
      id: "hiit", label: "23. HIIT-Programm (Anfänger bis Fortgeschrittene)",
      kurzfazit: "Effizientes Cardiosystem mit klarer Progression und hoher Alltagstauglichkeit.",
      rating: [["Zeit", 5], ["Länge", 5], ["Schwierigkeit", 3], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Intervalltraining mit wechselnden Belastungs- und Pausenzeiten. Vier Phasen mit progressiven Verhältnissen: 1:4 → 1:2 → 1:1 → 2:1.
          </p>
          <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
            <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
              <p className="text-[11px] font-bold text-gray-400 w-14">Phase</p>
              <p className="text-[11px] font-bold text-gray-400 flex-1">Belastung</p>
              <p className="text-[11px] font-bold text-gray-400 w-16">Pause</p>
              <p className="text-[11px] font-bold text-gray-400 w-14 text-right">Gesamt</p>
            </div>
            {[["1","15 sek","1 min","14 min"],["2","30 sek","1 min","17 min"],["3","30 sek","30 sek","18,5 min"],["4","30 sek","15 sek","20 min"]]
              .map(([ph, bel, pause, ges], i, arr) => (
              <div key={i} className="flex px-3 py-2.5 items-center"
                style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                <p className="text-xs text-gray-300 w-14">{ph}</p>
                <p className="text-xs font-bold text-white flex-1">{bel}</p>
                <p className="text-xs text-gray-300 w-16">{pause}</p>
                <p className="text-xs text-gray-400 w-14 text-right">{ges}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-white mb-1">Vorteile</p>
          <B text="Sehr zeiteffizient · hoher Kalorienverbrauch · kurze Workouts" />
          <B text="Skalierbar für Anfänger bis Fortgeschrittene" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Anfänger bis Fortgeschrittene · Fettabbau · allgemeine Fitness" />
        </>
      ),
    },
    {
      id: "tabata", label: "24. Tabata-Intervalle",
      kurzfazit: "Kurzes, extrem hartes Intervallsystem mit enormer Stoffwechselbelastung.",
      rating: [["Zeit", 5], ["Länge", 5], ["Schwierigkeit", 5], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Klassisches Verhältnis: 20 sek Arbeit · 10 sek Pause · 8 Runden = 4 Minuten pro Übung. Maximale metabolische Belastung — anaerob + aerob.
          </p>
          <p className="text-xs font-bold text-white mb-1">Typische Übungen</p>
          <B text="Kettlebell Swings · Seilspringen · Hampelmänner · Medizinballübungen" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Vorteile</p>
          <B text="Extrem zeiteffizient · sehr hoher Kalorienverbrauch" />
          <B text="Starke Konditionsverbesserung" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Brutal intensiv · sehr hohe Ermüdung" />
          <B text="Schwer sauber durchzuhalten" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Athleten · Konditionssteigerung" />
        </>
      ),
    },
    {
      id: "powerhiit", label: "25. Power-HIIT",
      kurzfazit: "Eines der leistungsfähigsten Systeme für Athletik, Fettabbau und Explosivkraft.",
      rating: [["Zeit", 4], ["Länge", 4], ["Schwierigkeit", 5], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            HIIT kombiniert mit explosiven Kraftübungen: 20 sek Belastung · 20 sek Pause — mehrere explosive Übungen hintereinander. Kombiniert Kraft + Cardio für maximale Athletik.
          </p>
          <p className="text-xs font-bold text-white mb-1">Beispielübungen</p>
          <B text="Sprungkniebeugen · Powerliegestütze · Reißen mit Kettlebell" />
          <B text="Kettlebell Swings · Medizinballschmettern · Bandsprints" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Vorteile</p>
          <B text="Kombiniert Kraft + Cardio · sehr hoher Kalorienverbrauch" />
          <B text="Verbessert Schnellkraft · hohe Muskelaktivierung" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Technisch anspruchsvoll · sehr hohe Ermüdung" />
          <B text="Hohe Regenerationsanforderung" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Athleten · Kampfsportler · Functional Fitness" />
        </>
      ),
    },
    {
      id: "cardioboost", label: "26. Cardiobeschleunigung",
      kurzfazit: "Sehr effiziente Methode für Fettabbau und Kondition bei gleichzeitigem Krafttraining.",
      rating: [["Zeit", 5], ["Länge", 4], ["Schwierigkeit", 4], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Zwischen Kraftsätzen werden kurze Cardiointervalle eingebaut (30–90 sek). Das Buch beschreibt es als „aktive Erholung" — die Regeneration zwischen Kraftsätzen wird dadurch verbessert.
          </p>
          <p className="text-xs font-bold text-white mb-1">Typische Cardioeinheiten</p>
          <B text="Step-ups · Laufen auf der Stelle · Seilspringen · Schlingentrainer" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Vorteile</p>
          <B text="Extrem zeiteffizient · hoher Kalorienverbrauch" />
          <B text="Verbessert aktive Erholung · spart separate Cardioeinheiten" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Nachteile</p>
          <B text="Puls dauerhaft hoch · kann Maximalkraftleistung reduzieren" />
          <B text="Hohe Gesamtbelastung" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Für wen?</p>
          <B text="Fettabbau · wenig Trainingszeit · allgemeine Fitness" />
        </>
      ),
    },
    {
      id: "super", label: "27. Supersatztraining",
      kurzfazit: "Eine der effizientesten Methoden für Muskelaufbau und Fettabbau gleichzeitig.",
      rating: [["Zeit", 5], ["Länge", 4], ["Schwierigkeit", 4], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Zwei Übungen direkt hintereinander ohne Pause — typischerweise Agonist + Antagonist (Bizeps + Trizeps, Brust + Rücken). Pause erst nach beiden Übungen.
          </p>
          <p className="text-xs font-bold text-white mb-1">Typische Muskelpaare</p>
          <B text="Bankdrücken ↔ Rudern · Schulterdrücken ↔ Klimmzüge" />
          <B text="Langhantelcurls ↔ Trizepsdrücken · Beinstrecken ↔ Beinbeuger" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Beispiel: Bizeps & Trizeps</p>
          <div className="rounded-xl overflow-hidden mb-2" style={{ border: "1px solid #1e1e1e" }}>
            <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
              <p className="text-[11px] font-bold text-gray-400 flex-1">Übung</p>
              <p className="text-[11px] font-bold text-gray-400 w-10 text-center">Sätze</p>
              <p className="text-[11px] font-bold text-gray-400 w-12 text-right">Wdh.</p>
            </div>
            {[
              ["Langhantelcurls","3","8–10"],["↳ Trizepsdrücken","3","8–10"],
              ["Preacher Curls","3","8–12"],["↳ Trizepsstrecken liegend","3","8–10"],
              ["KH-Curls sitzend","3","8–12"],["↳ Bank-Dips","3","8–12"],
            ].map(([ü,s,w],i,arr) => (
              <div key={i} className="flex px-3 py-2 items-center"
                style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: i%2===1 ? "#161616" : "#111" }}>
                <p className="text-xs text-gray-300 flex-1">{ü}</p>
                <p className="text-xs font-bold text-white w-10 text-center">{s}</p>
                <p className="text-xs text-gray-300 w-12 text-right">{w}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-white mt-3 mb-1">Vorteile</p>
          <B text="Sehr zeiteffizient · hohe Trainingsdichte · starker Pump" />
          <p className="text-xs font-bold text-white mt-2 mb-1">Nachteile</p>
          <B text="Weniger Maximalkraft möglich · hohe Kreislaufbelastung" />
          <p className="text-xs font-bold text-white mt-2 mb-1">Für wen?</p>
          <B text="Muskelaufbau · Fettabbau · Fortgeschrittene · wenig Zeit" />
        </>
      ),
    },
    {
      id: "zweisatz", label: "28. Zweisatztraining",
      kurzfazit: "Sehr effektive Intensitätstechnik für gezielten Muskelaufbau und Schwachstellenarbeit.",
      rating: [["Zeit", 5], ["Länge", 4], ["Schwierigkeit", 4], ["Resultate", 4]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Zwei Übungen für dieselbe Muskelgruppe direkt hintereinander ohne Pause. Beispiel Schulter: Schulterdrücken → sofort Seitheben → erst dann Pause.
          </p>
          <p className="text-xs font-bold text-white mb-1">Strategien</p>
          <B text="Unterschiedliche Bereiche: Schulterdrücken + vorgebeugtes Seitheben" />
          <B text="Gleicher Bereich: Schulterdrücken KH + Schulterdrücken Maschine" />
          <p className="text-xs font-bold text-white mt-3 mb-1">Beispiel: Schultern</p>
          <div className="rounded-xl overflow-hidden mb-2" style={{ border: "1px solid #1e1e1e" }}>
            <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
              <p className="text-[11px] font-bold text-gray-400 flex-1">Übung</p>
              <p className="text-[11px] font-bold text-gray-400 w-10 text-center">Sätze</p>
              <p className="text-[11px] font-bold text-gray-400 w-12 text-right">Wdh.</p>
            </div>
            {[["Schulterdrücken KH","3","6–8"],["↳ Seitheben","3","10–12"],["Frontheben","3","10–12"],["↳ Aufrechtes Rudern","3","8–10"]]
              .map(([ü,s,w],i,arr) => (
              <div key={i} className="flex px-3 py-2 items-center"
                style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: i%2===1 ? "#161616" : "#111" }}>
                <p className="text-xs text-gray-300 flex-1">{ü}</p>
                <p className="text-xs font-bold text-white w-10 text-center">{s}</p>
                <p className="text-xs text-gray-300 w-12 text-right">{w}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-white mt-2 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Muskelaufbau · Fokus auf Schwachstellen" />
        </>
      ),
    },
    {
      id: "dreisatz", label: "29. Dreisatztraining",
      kurzfazit: "Sehr intensive Muskelaufbaumethode mit starkem Reiz und hoher lokaler Ermüdung.",
      rating: [["Zeit", 4], ["Länge", 4], ["Schwierigkeit", 5], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Drei Übungen für dieselbe Muskelgruppe ohne Satzpause hintereinander — erst danach Pause. Maximale Muskelerschöpfung durch Training aus verschiedenen Winkeln.
          </p>
          <p className="text-xs font-bold text-white mb-1">Beispiel: Trizeps</p>
          <div className="rounded-xl overflow-hidden mb-2" style={{ border: "1px solid #1e1e1e" }}>
            <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
              <p className="text-[11px] font-bold text-gray-400 flex-1">Übung</p>
              <p className="text-[11px] font-bold text-gray-400 w-10 text-center">Sätze</p>
              <p className="text-[11px] font-bold text-gray-400 w-12 text-right">Wdh.</p>
            </div>
            {[["Trizepsdrücken","3","8–10"],["Trizepsstrecken über Kopf","3","6–8"],["Dips an der Bank","3","8–12"]]
              .map(([ü,s,w],i,arr) => (
              <div key={i} className="flex px-3 py-2 items-center"
                style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                <p className="text-xs text-gray-300 flex-1">{ü}</p>
                <p className="text-xs font-bold text-white w-10 text-center">{s}</p>
                <p className="text-xs text-gray-300 w-12 text-right">{w}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-white mt-2 mb-1">Für wen?</p>
          <B text="Fortgeschrittene · Bodybuilding · Muskelaufbauphasen" />
        </>
      ),
    },
    {
      id: "monster", label: "30. Monstersatztraining",
      kurzfazit: "Brutale Intensitätstechnik für maximale Muskelerschöpfung — eher Werkzeug für kurze Spezialphasen.",
      rating: [["Zeit", 4], ["Länge", 3], ["Schwierigkeit", 5], ["Resultate", 5]] as [string, number][],
      content: (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Erweiterung des Dreisatztrainings: 4 oder mehr Übungen ohne Pause für dieselbe Muskelgruppe. Komplette Erschöpfung aus allen Winkeln.
          </p>
          <p className="text-xs font-bold text-white mb-1">Beispiel: Bauch</p>
          <div className="rounded-xl overflow-hidden mb-2" style={{ border: "1px solid #1e1e1e" }}>
            <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
              <p className="text-[11px] font-bold text-gray-400 flex-1">Übung</p>
              <p className="text-[11px] font-bold text-gray-400 w-10 text-center">Sätze</p>
              <p className="text-[11px] font-bold text-gray-400 w-12 text-right">Wdh.</p>
            </div>
            {[["Hängendes Knieheben","3","15"],["Diagonale Crunches","3","20"],["Reverse Crunches","3","15"],["Crunches am Kabelzug","3","12"]]
              .map(([ü,s,w],i,arr) => (
              <div key={i} className="flex px-3 py-2 items-center"
                style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                <p className="text-xs text-gray-300 flex-1">{ü}</p>
                <p className="text-xs font-bold text-white w-10 text-center">{s}</p>
                <p className="text-xs text-gray-300 w-12 text-right">{w}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mb-2">Alle Übungen ohne Pause</p>
          <p className="text-xs font-bold text-white mt-2 mb-1">Für wen?</p>
          <B text="Sehr Fortgeschrittene · Bodybuilding · Definitionsphasen · mentale Härte" />
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className="font-black italic text-2xl leading-none" style={{ fontFamily: F, color: COLOR }}>
            🔥 INTENSIVTECHNIKEN
          </p>
          <p className="text-xs text-gray-500 mt-0.5">30 fortgeschrittene Trainingsmethoden</p>
        </div>
      </div>

      <div className="px-4">
        <div className="rounded-2xl px-4 py-3 mb-4" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-sm text-gray-300 leading-relaxed">
            Fortgeschrittene Methoden für neue Reize. Sparsam einsetzen — max. 1–2 Techniken pro Training. Basis-Technik muss beherrscht sein.
          </p>
        </div>

        {techniques.map(t => (
          <div key={t.id}>
            <Acc id={t.id} label={t.label}>
              {t.content}
              <Rating rows={t.rating} />
              <div className="rounded-xl px-3 py-2 mt-1" style={{ background: `${COLOR}15`, border: `1px solid ${COLOR}33` }}>
                <p className="text-xs italic" style={{ color: COLOR }}>„{t.kurzfazit}"</p>
              </div>
            </Acc>
          </div>
        ))}

        <div className="mb-6" />
      </div>
    </div>
  );
}

export function OneRMScreen({ onBack }: { onBack: () => void }) {
  const COLOR = "#a855f7";
  const [tab, setTab] = useState<"test" | "formel" | "relativ">("test");

  // Epley-Rechner State
  const [epleyWeight, setEpleyWeight] = useState("");
  const [epleyReps, setEpleyReps] = useState("");
  const epley1RM = epleyWeight && epleyReps
    ? Math.round((1 + 0.0333 * Number(epleyReps)) * Number(epleyWeight))
    : null;

  // Relative Kraft State
  const [bodyweight, setBodyweight] = useState("");
  const [bench, setBench] = useState("");
  const [squat, setSquat] = useState("");
  const [deadlift, setDeadlift] = useState("");

  const bw = Number(bodyweight) || 0;
  const relBench = bw > 0 && bench ? (Number(bench) / bw).toFixed(2) : null;
  const relSquat = bw > 0 && squat ? (Number(squat) / bw).toFixed(2) : null;
  const relDead  = bw > 0 && deadlift ? (Number(deadlift) / bw).toFixed(2) : null;

  // Verhältnis
  const ratioB = Number(bench) || 0;
  const ratioS = Number(squat) || 0;
  const ratioD = Number(deadlift) || 0;
  const ratioBase = ratioB > 0 ? ratioB : 1;
  const verhS = ratioB > 0 ? (ratioS / ratioBase).toFixed(2) : null;
  const verhD = ratioB > 0 ? (ratioD / ratioBase).toFixed(2) : null;

  function levelBadge(value: number | null, good: number, veryGood: number, elite: number) {
    if (!value) return null;
    if (value >= elite) return { label: "Elite", color: "#fbbf24" };
    if (value >= veryGood) return { label: "Sehr gut", color: "#22c55e" };
    if (value >= good) return { label: "Gut", color: COLOR };
    return { label: "Aufbau", color: "#6b7280" };
  }

  function InputField({ label, value, onChange, unit = "kg" }: { label: string; value: string; onChange: (v: string) => void; unit?: string }) {
    return (
      <div className="flex items-center gap-3 mb-3">
        <p className="text-sm text-gray-400 flex-1">{label}</p>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="0"
            className="w-20 text-right text-white text-sm font-bold rounded-xl px-3 py-2 outline-none"
            style={{ background: "#1e1e1e", border: `1px solid ${COLOR}44` }}
          />
          <p className="text-xs text-gray-500 w-6">{unit}</p>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: "test" as const,    label: "Test" },
    { id: "formel" as const,  label: "Formel" },
    { id: "relativ" as const, label: "Relative Kraft" },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      <div className="px-5 pt-12 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <p className="font-black italic text-2xl leading-none" style={{ fontFamily: F, color: COLOR }}>
            🎯 ERMITTLUNG DES 1RM
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Test · Formel · Relative Kraft</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 py-2 rounded-xl font-black text-xs"
              style={{
                fontFamily: F,
                background: tab === t.id ? COLOR : "#111",
                color: tab === t.id ? "#fff" : "#666",
                border: `1px solid ${tab === t.id ? COLOR : "#1e1e1e"}`,
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">

        {/* Tab: Direkter Test */}
        {tab === "test" && (
          <>
            <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
              <p className="text-xs font-bold mb-2" style={{ color: COLOR, fontFamily: F }}>VORBEREITUNG</p>
              <p className="text-sm text-gray-300 mb-2">Nur im ausgeruhten Zustand. Tests auf verschiedene Tage verteilen. Idealerweise mit Spotter.</p>
              <p className="text-xs text-gray-500">Orientierung: 1RM ≈ 10RM × 1,33</p>
            </div>

            <p className="text-xs font-black mb-2 mt-4" style={{ color: COLOR, fontFamily: F }}>ABLAUF</p>
            {[
              { num: "1", title: "Aufwärmsätze (3×)", desc: "Start bei ~50 % → steigern bis ~75 % des geschätzten 1RM. Pausen 1–2 min." },
              { num: "2", title: "1RM-Versuche", desc: "Immer nur 1 Wiederholung. Pause 4–5 min. Oberkörper: +5–10 kg / Unterkörper: +10–20 kg." },
              { num: "3", title: "Abbruch", desc: "Max. 3 schwere Versuche. Das letzte erfolgreich gehobene Gewicht = echtes 1RM." },
            ].map(s => (
              <div key={s.num} className="rounded-2xl px-4 py-3 mb-2 flex gap-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black"
                  style={{ background: COLOR, color: "#fff", fontFamily: F }}>{s.num}</div>
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">{s.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}

            <p className="text-xs font-black mb-2 mt-4" style={{ color: COLOR, fontFamily: F }}>BEISPIEL – BANKDRÜCKEN</p>
            <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid #1e1e1e" }}>
              <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
                <p className="text-[11px] font-bold text-gray-400 flex-1">Satz</p>
                <p className="text-[11px] font-bold text-gray-400 w-16 text-center">Gewicht</p>
                <p className="text-[11px] font-bold text-gray-400 w-10 text-right">Wdh.</p>
              </div>
              {[
                ["Aufwärmen 1","75 kg","5",false],["Aufwärmen 2","93 kg","3",false],["Aufwärmen 3","113 kg","2",false],
                ["Versuch 1","150 kg","1",true],["Versuch 2","158 kg","1",true],["Versuch 3","163 kg ✓","1",true],
              ].map(([satz, gew, wdh, isVersuch], i, arr) => (
                <div key={i} className="flex px-3 py-2.5 items-center"
                  style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none", background: isVersuch ? `${COLOR}10` : "#111" }}>
                  <p className="text-xs text-gray-300 flex-1">{String(satz)}</p>
                  <p className="text-xs font-bold w-16 text-center" style={{ color: isVersuch ? COLOR : "#fff" }}>{String(gew)}</p>
                  <p className="text-xs text-gray-400 w-10 text-right">{String(wdh)}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tab: Formel */}
        {tab === "formel" && (
          <>
            <div className="rounded-2xl px-4 py-3 mb-4" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
              <p className="text-xs font-bold mb-1" style={{ color: COLOR, fontFamily: F }}>EPLEY-FORMEL</p>
              <p className="text-sm text-gray-300 mb-3">Geeignet bei Verletzungen, zur Schonung oder wenn kein Spotter vorhanden ist.</p>
              <div className="rounded-xl px-4 py-3 text-center" style={{ background: "#1a1a1a" }}>
                <p className="text-sm font-bold text-white">1RM = (1 + 0,0333 × Wdh.) × Gewicht</p>
              </div>
            </div>

            <p className="text-xs font-black mb-3 mt-2" style={{ color: COLOR, fontFamily: F }}>RECHNER</p>
            <div className="rounded-2xl px-4 py-4" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
              <InputField label="Gewicht" value={epleyWeight} onChange={setEpleyWeight} />
              <InputField label="Wiederholungen" value={epleyReps} onChange={setEpleyReps} unit="Wdh." />

              <div className="rounded-xl px-4 py-3 mt-3 text-center"
                style={{ background: epley1RM ? `${COLOR}20` : "#1a1a1a", border: `1px solid ${epley1RM ? COLOR : "#2a2a2a"}` }}>
                {epley1RM ? (
                  <>
                    <p className="text-xs text-gray-400 mb-1">Geschätztes 1RM</p>
                    <p className="text-3xl font-black" style={{ color: COLOR, fontFamily: F }}>{epley1RM} kg</p>
                  </>
                ) : (
                  <p className="text-xs text-gray-600">Gewicht und Wdh. eingeben</p>
                )}
              </div>

              {epley1RM && (
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid #1e1e1e" }}>
                  <p className="text-xs text-gray-500 text-center">
                    (1 + 0,0333 × {epleyReps}) × {epleyWeight} = <span style={{ color: COLOR }}>{epley1RM} kg</span>
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab: Relative Kraft */}
        {tab === "relativ" && (
          <>
            <div className="rounded-2xl px-4 py-3 mb-4" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
              <p className="text-xs font-bold mb-1" style={{ color: COLOR, fontFamily: F }}>RELATIVE KRAFT – MÄNNER</p>
              <div className="mt-2">
                {[
                  { label: "Bankdrücken", good: "1,25×", veryGood: "1,75×", elite: "2×" },
                  { label: "Kniebeugen", good: "2×", veryGood: "2,5×", elite: "3×" },
                  { label: "Kreuzheben", good: "2×", veryGood: "2,5×", elite: "3×" },
                ].map((r, i, arr) => (
                  <div key={i} className="flex items-center gap-2 py-2"
                    style={{ borderBottom: i < arr.length-1 ? "1px solid #1e1e1e" : "none" }}>
                    <p className="text-sm text-gray-300 flex-1">{r.label}</p>
                    <p className="text-xs text-gray-500">Gut {r.good}</p>
                    <p className="text-xs text-gray-400">Sehr gut {r.veryGood}</p>
                    <p className="text-xs font-bold" style={{ color: "#fbbf24" }}>Elite {r.elite}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs font-black mb-3" style={{ color: COLOR, fontFamily: F }}>RECHNER</p>
            <div className="rounded-2xl px-4 py-4 mb-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
              <InputField label="Körpergewicht" value={bodyweight} onChange={setBodyweight} />
              <div style={{ borderTop: "1px solid #1e1e1e" }} className="pt-3 mt-1">
                <InputField label="Bankdrücken 1RM" value={bench} onChange={setBench} />
                <InputField label="Kniebeugen 1RM" value={squat} onChange={setSquat} />
                <InputField label="Kreuzheben 1RM" value={deadlift} onChange={setDeadlift} />
              </div>

              {(relBench || relSquat || relDead) && (
                <div className="mt-3 pt-3" style={{ borderTop: "1px solid #1e1e1e" }}>
                  <p className="text-xs font-bold mb-2" style={{ color: COLOR, fontFamily: F }}>ERGEBNIS</p>
                  {[
                    { label: "Bankdrücken", rel: relBench, badge: levelBadge(Number(relBench), 1.25, 1.75, 2) },
                    { label: "Kniebeugen", rel: relSquat, badge: levelBadge(Number(relSquat), 2, 2.5, 3) },
                    { label: "Kreuzheben", rel: relDead, badge: levelBadge(Number(relDead), 2, 2.5, 3) },
                  ].filter(r => r.rel).map((r, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <p className="text-sm text-gray-300 flex-1">{r.label}</p>
                      <p className="text-sm font-bold text-white">{r.rel}× KG</p>
                      {r.badge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                          style={{ background: `${r.badge.color}22`, color: r.badge.color, fontFamily: F }}>
                          {r.badge.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verhältnis */}
            <p className="text-xs font-black mb-3" style={{ color: COLOR, fontFamily: F }}>KRAFTVERHÄLTNIS</p>
            <div className="rounded-2xl px-4 py-4 mb-6" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
              <p className="text-xs text-gray-400 mb-3">Empfohlen: Bankdrücken : Kniebeugen : Kreuzheben = 1 : 1,5 : 1,5</p>
              {ratioB > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm text-gray-300 flex-1">Kniebeugen / Bankdrücken</p>
                    <p className="text-sm font-bold" style={{ color: verhS && Number(verhS) >= 1.3 ? "#22c55e" : COLOR }}>
                      1 : {verhS}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-sm text-gray-300 flex-1">Kreuzheben / Bankdrücken</p>
                    <p className="text-sm font-bold" style={{ color: verhD && Number(verhD) >= 1.3 ? "#22c55e" : COLOR }}>
                      1 : {verhD}
                    </p>
                  </div>
                  <div className="rounded-xl px-3 py-2" style={{ background: "#1a1a1a" }}>
                    <p className="text-xs text-gray-400">
                      {bench} kg : {squat || "–"} kg : {deadlift || "–"} kg
                      {verhS && verhD ? ` ≈ 1 : ${verhS} : ${verhD}` : ""}
                    </p>
                  </div>
                </>
              )}
              {!ratioB && <p className="text-xs text-gray-600 text-center">Gewichte oben eingeben</p>}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
