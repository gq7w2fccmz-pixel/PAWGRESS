import type { AreaData, AreaName } from "../types";
import { BRUST_EXERCISES } from "./exercises_brust";
import { RUECKEN_EXERCISES } from "./exercises_ruecken";
import { SCHULTERN_EXERCISES } from "./exercises_schultern";
import { CORE_EXERCISES } from "./exercises_core";
import { ARME_EXERCISES } from "./exercises_arme";
import { BEINE_EXERCISES } from "./exercises_beine";
import { CARDIO_EXERCISES } from "./exercises_cardio";

export const AREA_DATA: Record<AreaName, AreaData> = {
  BRUST: {
    color: "#ef4444",
    desc: "Rocko zeigt dir die besten Übungen für eine starke, definierte Brust. Wähle eine Übung und lerne alles über Ausführung, Wirkung und Tipps.",
    coach: { emoji: "🦍", name: "Rocko", role: "Lehrmeister der Brust", tip: "Die Brust liebt volle Dehnung und explosive Kraft! Kontrolliert senken, explosiv drücken!" },
    exercises: BRUST_EXERCISES,
    tips: [
      "Trainiere deine Brust 1–2x pro Woche intensiv.",
      "Starte mit Compound-Übungen, beende mit Isolation.",
      "Kontrollierte Exzentrik bringt mehr Wachstum als Tempo.",
      "Progressive Überlastung ist der Schlüssel zum Wachstum.",
      "Regeneration ist genauso wichtig wie das Training!",
    ],
  },
  RUECKEN: {
    color: "#3b82f6",
    desc: "Toro zeigt dir die besten Übungen für einen starken, breiten Rücken. Wähle eine Übung und lerne alles über Ausführung, Wirkung und Tipps.",
    coach: { emoji: "🐂", name: "Toro", role: "Lehrmeister des Rückens", tip: "Ein starker Rücken ist die Basis für jede Bewegung! Zieh mit Kontrolle, spür die Spannung und bleib konstant!" },
    exercises: RUECKEN_EXERCISES,
    tips: [
      "Starte mit vertikalen Zugübungen, dann horizontale.",
      "Schulterblätter aktiv bewegen – nicht nur mit den Armen ziehen.",
      "Rumpfspannung schützt deine Lendenwirbelsäule.",
      "Progressive Überlastung ist der Schlüssel zum Wachstum.",
      "Regeneration ist genauso wichtig wie das Training!",
    ],
  },
  BEINE: {
    color: "#22c55e",
    desc: "Olli zeigt dir die besten Bein-Übungen für mehr Kraft, Stabilität und Ausdauer. Wähle eine Übung und lerne alles über Ausführung, Wirkung und Tipps.",
    coach: { emoji: "🐘", name: "Olli", role: "Lehrmeister der Beine", tip: "Starke Beine tragen dich durchs Leben! Trainiere hart, bleib fokussiert und gib immer dein Bestes." },
    exercises: BEINE_EXERCISES,
    tips: [
      "Beginne mit Compound-Übungen wie Kniebeugen und Kreuzheben.",
      "Knieachse immer über die Zehen – nie nach innen kollabieren lassen.",
      "Waden am Ende des Trainings, nicht am Anfang.",
      "Beine brauchen mehr Regeneration als die meisten anderen Muskelgruppen.",
      "Progressive Überlastung ist der Schlüssel zum Wachstum!",
    ],
  },
  SCHULTERN: {
    color: "#eab308",
    desc: "Rino zeigt dir die besten Schulter-Übungen für mehr Breite, Definition und Stabilität. Wähle eine Übung und lerne alles über Ausführung, Wirkung und Tipps.",
    coach: { emoji: "🦏", name: "Rino", role: "Lehrmeister der Schultern", tip: "Starke Schultern machen den Unterschied! Trainiere intelligent, kontrolliert und mit voller Konzentration." },
    exercises: SCHULTERN_EXERCISES,
    tips: [
      "Starte mit Drückübungen, dann Isolation.",
      "Schultern tief halten – kein Hochzug beim Seitheben.",
      "Face Pulls und Y-Raises für langfristige Schultergesundheit.",
      "Hintere Schulter wird oft vernachlässigt – gezielt trainieren!",
      "Regeneration ist genauso wichtig wie das Training!",
    ],
  },
  ARME: {
    color: "#f97316",
    desc: "Tim zeigt dir die besten Arm-Übungen für mehr Kraft, Definition und Ausdauer. Wähle eine Übung und lerne alles über Ausführung, Wirkung und Tipps.",
    coach: { emoji: "🐯", name: "Tim", role: "Lehrmeister der Arme", tip: "Starke Arme beginnen im Kopf! Konzentriere dich auf die Technik, spüre die Spannung und gehe an dein Limit." },
    exercises: ARME_EXERCISES,
    tips: [
      "Bizeps: Ellenbogen stabil, kein Schwung aus der Hüfte.",
      "Trizeps macht 2/3 des Armumfangs aus – nicht vernachlässigen!",
      "Stretch-Übungen (Schrägbank, Overhead) für maximales Wachstum.",
      "Unterarme 2x pro Woche direkt trainieren für Griffkraft.",
      "Regeneration ist genauso wichtig wie das Training!",
    ],
  },
  CORE: {
    color: "#a855f7",
    desc: "Leon zeigt dir die besten Core-Übungen für mehr Stabilität, eine starke Mitte und eine bessere Körperhaltung. Wähle eine Übung und lerne alles über Ausführung, Wirkung und Tipps.",
    coach: { emoji: "🦁", name: "Leon", role: "Lehrmeister des Cores", tip: "Ein starker Core ist die Basis für jede Bewegung! Stabilität, Kontrolle und Ausdauer machen dich stärker und verletzungsresistent." },
    exercises: CORE_EXERCISES,
    tips: [
      "Qualität vor Quantität – saubere Ausführung ist entscheidend.",
      "Starte mit isometrischen Übungen, dann dynamisch.",
      "Atme kontrolliert und halte die Körperspannung.",
      "Ein starker Core verbessert Leistung und schützt vor Verletzungen.",
      "Regeneration ist genauso wichtig wie das Training!",
    ],
  },
  CARDIO: {
    color: "#06b6d4",
    desc: "Lyra zeigt dir die besten Cardio-Übungen für mehr Ausdauer, Fettverbrennung und Herz-Kreislauf-Gesundheit. Wähle eine Übung und lerne alles über Ausführung, Wirkung und Tipps.",
    coach: { emoji: "🐆", name: "Lyra", role: "Lehrmeisterin in Cardio", tip: "Cardio macht dich stärker, schneller und ausdauernder! Bleib in Bewegung, bleib fokussiert und erreiche deine Ziele!" },
    exercises: CARDIO_EXERCISES,
    tips: [
      "Starte mit 2–3 Einheiten pro Woche und steigere langsam.",
      "Wechsle zwischen Ausdauertraining und Intervallen.",
      "Rudern ist das effizienteste Ganzkörper-Cardiogerät.",
      "Bleib hydriert – mindestens 500ml vor dem Training.",
      "Regeneration ist genauso wichtig wie das Training!",
    ],
  },
  STRETCH: {
    color: "#d97706",
    desc: "Sen zeigt dir die besten Stretch-Übungen für mehr Beweglichkeit, weniger Verspannungen und ein besseres Körpergefühl. Wähle eine Übung und lerne alles über Ausführung, Wirkung und Tipps.",
    coach: { emoji: "🦢", name: "Sen", role: "Lehrmeister des Stretch", tip: "Regelmäßiges Stretching hält deinen Körper geschmeidig, verbessert deine Haltung und fördert deine Regeneration. Nimm dir Zeit für dich und deinen Körper." },
    exercises: ([
      { num:1, name:"Hüftbeuger Dehnung", sub:"Für Hüftflexibilität", desc:"Knie auf dem Boden, einen Fuß nach vorne. Schiebe die Hüfte nach vorne. Halte 30 Sekunden.", primary:"Hüftbeuger (Iliopsoas)", secondary:"Quadrizeps" },
      { num:2, name:"Vorwärtsbeuge", sub:"Für Rücken & Beine", desc:"Stehe aufrecht, beuge dich langsam nach vorne und greife so weit nach unten wie möglich.", primary:"Hamstrings, Rückenstrecker", secondary:"Wade" },
      { num:3, name:"Schulterkreisen", sub:"Für Schultergesundheit", desc:"Kreise die Schultern langsam nach hinten und vorne. Je 10 Wiederholungen.", primary:"Schultergelenk, Rotatorenmanschette", secondary:"Trapez, Nacken" },
    ] as any[]),
    tips: ["Stretching am besten nach dem Training oder an Ruhetagen.", "Halte jede Dehnung 20–30 Sekunden.", "Atme tief und gleichmäßig – nie den Atem anhalten.", "Höre auf deinen Körper und dehne dich sanft, nie schmerzhaft.", "Regelmäßigkeit ist der Schlüssel zu mehr Beweglichkeit!"],
  },
};
