// ── CoachPlanWizard – vollständiger 5-Step Onboarding-Wizard ────────────────
import { useState, useEffect } from "react";
import { generatePlan } from "../engine/planner";
import { usePlanStore } from "../stores/planStore";
import type { CustomPlan, CustomWorkoutDay } from "../stores/planStore";
import type { PlanExercise } from "../data/plan_2er_split";
import { scoreSplits } from "../engine/scorer";
import type { UserInput, GeneratedPlan, SplitType, Goal, FocusArea, TrainingFocus, Intensity, TrainingStyle, Equipment, TimeSlot, TrainingDay } from "../engine/types";

const F = "'Barlow Condensed', sans-serif";
const ORANGE  = "#f97316";
const COPPER  = "#cd7f32";
const COPPER_L = "#e8a050";
const BG      = "#0a0a0a";
const CARD    = "#141414";
const CARD2   = "#1a1a1a";
const BORDER  = "#2a2a2a";

// ── Hilfsfunktionen ───────────────────────────────────────────────────────────
function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="px-4 py-2 rounded-full text-sm font-bold transition-all"
      style={{
        background: active ? ORANGE : CARD2,
        color: active ? "#fff" : "#888",
        border: `1.5px solid ${active ? ORANGE : BORDER}`,
        fontFamily: F,
      }}>
      {label}
    </button>
  );
}

function OptionCard({
  icon, label, sub, active, recommended, onClick
}: { icon: string; label: string; sub?: string; active: boolean; recommended?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
      style={{
        background: active ? `${ORANGE}18` : CARD2,
        border: `1.5px solid ${active ? ORANGE : BORDER}`,
      }}>
      <span className="text-2xl w-8 flex-shrink-0 text-center">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm text-white" style={{ fontFamily: F }}>{label}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
      {recommended && (
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: `${ORANGE}22`, color: ORANGE, border: `1px solid ${ORANGE}44` }}>
          Empfohlen
        </span>
      )}
      {active && (
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: ORANGE }}>
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </button>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ current, total, onBack, onClose }: { current: number; total: number; onBack: () => void; onClose: () => void }) {
  const pct = ((current - 1) / (total - 1)) * 100;
  return (
    <div className="flex items-center gap-3 px-4 pt-4 pb-3">
      <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors text-lg">←</button>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{current} von {total}</span>
        </div>
        <div className="w-full rounded-full" style={{ height: 3, background: BORDER }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${COPPER} 0%, ${ORANGE} 100%)` }} />
        </div>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-sm">✕</button>
    </div>
  );
}

// ── Step 1: Ziel & Fokus ──────────────────────────────────────────────────────
function Step1({ input, update }: { input: Partial<UserInput>; update: (v: Partial<UserInput>) => void }) {
  const goals: { id: Goal; icon: string; label: string; sub: string }[] = [
    { id: "hypertrophy", icon: "💪", label: "Muskelaufbau", sub: "Hypertrophie & mehr Muskelmasse" },
    { id: "strength",    icon: "🏋️", label: "Kraftaufbau",  sub: "Mehr Maximalkraft" },
    { id: "fat_loss",    icon: "🔥", label: "Fettabbau",    sub: "Körperfett reduzieren" },
    { id: "fitness",     icon: "⚡", label: "Allgemeine Fitness", sub: "Gesundheit & Wohlbefinden" },
  ];
  const focuses: FocusArea[] = ["Brust", "Rücken", "Beine", "Schultern", "Arme", "Bauch"];

  function toggleFocus(f: FocusArea) {
    const current = input.focusAreas ?? [];
    if (current.includes(f)) {
      update({ focusAreas: current.filter(x => x !== f) });
    } else if (current.length < 2) {
      update({ focusAreas: [...current, f] });
    }
  }

  return (
    <div className="px-4 pb-4 flex flex-col gap-4">
      <div>
        <h2 className="font-black italic text-2xl text-white mb-1" style={{ fontFamily: F }}>Ziel & Fokus</h2>
        <p className="text-sm text-gray-400">Was ist dein Hauptziel?</p>
      </div>
      <div className="flex flex-col gap-2">
        {goals.map(g => (
          <OptionCard key={g.id} icon={g.icon} label={g.label} sub={g.sub}
            active={input.goal === g.id}
            onClick={() => update({ goal: g.id })} />
        ))}
      </div>
      <div>
        <p className="text-sm font-bold text-white mb-1">Fokus <span className="text-gray-500 font-normal">(optional)</span></p>
        <p className="text-xs text-gray-500 mb-3">Wähle bis zu 2 Bereiche aus</p>
        <div className="flex flex-wrap gap-2">
          {focuses.map(f => (
            <Pill key={f} label={f} active={(input.focusAreas ?? []).includes(f)} onClick={() => toggleFocus(f)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Trainingsstruktur ─────────────────────────────────────────────────
function Step2({ input, update, recommendedSplit }: { input: Partial<UserInput>; update: (v: Partial<UserInput>) => void; recommendedSplit: SplitType }) {
  const days = [2, 3, 4, 5, 6] as const;
  const splits: { id: SplitType; icon: string; label: string; sub: string }[] = [
    { id: "upper_lower",    icon: "🏃", label: "Upper / Lower",    sub: "Oberkörper / Unterkörper" },
    { id: "push_pull_legs", icon: "🔄", label: "Push / Pull / Legs", sub: "Drücken / Ziehen / Beine" },
    { id: "fullbody",       icon: "💥", label: "Ganzkörper",        sub: "Jeden Muskel jedes Training" },
    { id: "bro_split",      icon: "📋", label: "Bro Split",         sub: "Ein Muskel pro Training" },
  ];

  return (
    <div className="px-4 pb-4 flex flex-col gap-4">
      <div>
        <h2 className="font-black italic text-2xl text-white mb-1" style={{ fontFamily: F }}>Trainingsstruktur</h2>
        <p className="text-sm text-gray-400">Wie oft pro Woche möchtest du trainieren?</p>
      </div>
      <div className="flex gap-2">
        {days.map(d => (
          <button key={d} onClick={() => update({ daysPerWeek: d })}
            className="flex-1 py-3 rounded-xl font-black text-sm transition-all flex flex-col items-center gap-0.5"
            style={{
              background: input.daysPerWeek === d ? `${ORANGE}18` : CARD2,
              border: `1.5px solid ${input.daysPerWeek === d ? ORANGE : BORDER}`,
              color: input.daysPerWeek === d ? ORANGE : "#888",
              fontFamily: F,
            }}>
            <span className="text-lg">{d}</span>
            {input.daysPerWeek === d && <span className="text-[9px] text-orange-400">Tage/Woche</span>}
          </button>
        ))}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-2">Empfohlene Strukturen für {input.daysPerWeek} Tage</p>
        <div className="flex flex-col gap-2">
          {splits.map(s => (
            <OptionCard key={s.id} icon={s.icon} label={s.label} sub={s.sub}
              active={input.split === s.id}
              recommended={s.id === recommendedSplit}
              onClick={() => update({ split: s.id })} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 3A: Trainingsfokus ───────────────────────────────────────────────────
function Step3A({ input, update }: { input: Partial<UserInput>; update: (v: Partial<UserInput>) => void }) {
  const options: { id: TrainingFocus; icon: string; label: string; sub: string }[] = [
    { id: "balanced",  icon: "⚖️",  label: "Ausgewogen",      sub: "Balance aus Volumen und Intensität" },
    { id: "volume",    icon: "📊",  label: "Volumenfokus",     sub: "Mehr Sätze für max. Wachstum" },
    { id: "intensity", icon: "🎯",  label: "Intensitätsfokus", sub: "Höhere Intensität & schwere Sätze" },
  ];

  return (
    <div className="px-4 pb-4 flex flex-col gap-4">
      <div>
        <h2 className="font-black italic text-2xl text-white mb-1" style={{ fontFamily: F }}>Trainingsfokus</h2>
        <p className="text-sm text-gray-400">Worauf möchtest du den Fokus legen?</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {options.map(o => (
          <button key={o.id} onClick={() => update({ trainingFocus: o.id })}
            className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
            style={{
              background: input.trainingFocus === o.id ? `${ORANGE}18` : CARD2,
              border: `1.5px solid ${input.trainingFocus === o.id ? ORANGE : BORDER}`,
            }}>
            <span className="text-2xl">{o.icon}</span>
            <p className="font-black text-xs text-white text-center leading-tight" style={{ fontFamily: F }}>{o.label}</p>
            <p className="text-[9px] text-gray-500 text-center leading-tight">{o.sub}</p>
          </button>
        ))}
      </div>
      <div className="flex items-start gap-3 px-3 py-3 rounded-xl" style={{ background: `${ORANGE}10`, border: `1px solid ${ORANGE}30` }}>
        <span className="text-orange-400 text-lg flex-shrink-0">📍</span>
        <div>
          <p className="text-xs font-bold text-orange-300 mb-0.5">Unser Tipp</p>
          <p className="text-xs text-gray-400 leading-relaxed">Für nachhaltigen Fortschritt empfehlen wir eine ausgewogene Balance.</p>
        </div>
      </div>
    </div>
  );
}

// ── Step 3B: Trainingsintensität ──────────────────────────────────────────────
function Step3B({ input, update }: { input: Partial<UserInput>; update: (v: Partial<UserInput>) => void }) {
  const intensities: { id: Intensity; icon: string; label: string; sub: string }[] = [
    { id: "moderate",    icon: "📉", label: "Moderat (RPE 6–7)",     sub: "2–4 Wiederholungen im Tank" },
    { id: "demanding",   icon: "📊", label: "Fordernd (RPE 7–8)",    sub: "1–3 Wiederholungen im Tank" },
    { id: "very_intense", icon: "📈", label: "Sehr intensiv (RPE 8–9)", sub: "0–1 Wiederholung im Tank" },
  ];
  const styles: { id: TrainingStyle; label: string; sub: string }[] = [
    { id: "classic",       label: "Klassisch",    sub: "(Sätze & Wdh.)" },
    { id: "powerbuilding", label: "Powerbuilding", sub: "(Kraft + Volumen)" },
    { id: "bodybuilding",  label: "Bodybuilding",  sub: "(Hohe Volumen)" },
  ];

  return (
    <div className="px-4 pb-4 flex flex-col gap-4">
      <div>
        <h2 className="font-black italic text-2xl text-white mb-1" style={{ fontFamily: F }}>Trainingsintensität</h2>
        <p className="text-sm text-gray-400">Wie intensiv sollen deine Sätze sein?</p>
      </div>
      <div className="flex flex-col gap-2">
        {intensities.map(o => (
          <OptionCard key={o.id} icon={o.icon} label={o.label} sub={o.sub}
            active={input.intensity === o.id}
            onClick={() => update({ intensity: o.id })} />
        ))}
      </div>
      <div>
        <p className="text-sm font-bold text-white mb-2">Trainingsstil <span className="text-gray-500 font-normal">(optional)</span></p>
        <div className="flex gap-2">
          {styles.map(s => (
            <button key={s.id} onClick={() => update({ trainingStyle: s.id })}
              className="flex-1 py-2 px-2 rounded-xl text-center transition-all"
              style={{
                background: input.trainingStyle === s.id ? `${ORANGE}18` : CARD2,
                border: `1.5px solid ${input.trainingStyle === s.id ? ORANGE : BORDER}`,
              }}>
              <p className="font-black text-xs text-white" style={{ fontFamily: F }}>{s.label}</p>
              <p className="text-[9px] text-gray-500">{s.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Equipment & Zeit ──────────────────────────────────────────────────
function Step4({ input, update }: { input: Partial<UserInput>; update: (v: Partial<UserInput>) => void }) {
  const equipments: { id: Equipment; icon: string; label: string; sub: string }[] = [
    { id: "gym",      icon: "🏋️", label: "Fitnessstudio", sub: "Vollständige Ausstattung" },
    { id: "home_gym", icon: "🏠", label: "Home Gym",      sub: "Eigene Geräte zu Hause" },
    { id: "minimal",  icon: "🪨", label: "Zuhause / Minimal", sub: "Körpergewicht, Kurzhanteln, Bänder" },
  ];
  const times: TimeSlot[] = [45, 60, 75, 90];
  const timeLabels: Record<TimeSlot, string> = { 45: "≤ 45 Min.", 60: "45–60 Min.", 75: "60–75 Min.", 90: "75+ Min." };

  return (
    <div className="px-4 pb-4 flex flex-col gap-4">
      <div>
        <h2 className="font-black italic text-2xl text-white mb-1" style={{ fontFamily: F }}>Equipment & Zeit</h2>
        <p className="text-sm text-gray-400">Welche Ausstattung steht dir zur Verfügung?</p>
      </div>
      <div className="flex flex-col gap-2">
        {equipments.map(e => (
          <OptionCard key={e.id} icon={e.icon} label={e.label} sub={e.sub}
            active={input.equipment === e.id}
            onClick={() => update({ equipment: e.id })} />
        ))}
      </div>
      <div>
        <p className="text-sm font-bold text-white mb-2">Wie viel Zeit hast du pro Einheit?</p>
        <div className="flex gap-2">
          {times.map(t => (
            <button key={t} onClick={() => update({ minutesPerSession: t })}
              className="flex-1 py-2 rounded-xl text-center transition-all"
              style={{
                background: input.minutesPerSession === t ? `${ORANGE}18` : CARD2,
                border: `1.5px solid ${input.minutesPerSession === t ? ORANGE : BORDER}`,
              }}>
              <p className="font-black text-[10px] text-white" style={{ fontFamily: F }}>{timeLabels[t]}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 5: Check & Anpassen ──────────────────────────────────────────────────
function Step5({ input, onEdit }: { input: Partial<UserInput>; onEdit: (step: number) => void }) {
  const goalLabels: Record<Goal, string> = {
    hypertrophy: "Muskelaufbau", strength: "Kraftaufbau", fat_loss: "Fettabbau", fitness: "Allgemeine Fitness"
  };
  const splitLabels: Record<SplitType, string> = {
    upper_lower: "Upper / Lower", push_pull_legs: "Push / Pull / Legs",
    fullbody: "Ganzkörper", bro_split: "Bro Split"
  };
  const focusLabels: Record<string, string> = {
    balanced: "Ausgewogen", volume: "Volumenfokus", intensity: "Intensitätsfokus"
  };
  const intensityLabels: Record<Intensity, string> = {
    moderate: "Moderat (RPE 6–7)", demanding: "Fordernd (RPE 7–8)", very_intense: "Sehr intensiv (RPE 8–9)"
  };
  const equipLabels: Record<Equipment, string> = {
    gym: "Fitnessstudio", home_gym: "Home Gym", minimal: "Zuhause / Minimal"
  };
  const timeLabels: Record<TimeSlot, string> = { 45: "≤ 45 Min.", 60: "45–60 Min.", 75: "60–75 Min.", 90: "75+ Min." };

  const rows = [
    { icon: "🎯", label: "Ziel",               value: input.goal ? goalLabels[input.goal] : "–", step: 1 },
    { icon: "💪", label: "Fokus",              value: (input.focusAreas ?? []).join(", ") || "Kein Fokus", step: 1 },
    { icon: "🏃", label: "Trainingsstruktur", value: `${input.split ? splitLabels[input.split] : "–"}, ${input.daysPerWeek} Tage`, step: 2 },
    { icon: "⚖️", label: "Trainingsfokus",    value: input.trainingFocus ? focusLabels[input.trainingFocus] : "–", step: 3 },
    { icon: "📊", label: "Intensität",         value: input.intensity ? intensityLabels[input.intensity] : "–", step: 3 },
    { icon: "🏋️", label: "Equipment",         value: input.equipment ? equipLabels[input.equipment] : "–", step: 4 },
    { icon: "⏱️", label: "Zeit pro Einheit",  value: input.minutesPerSession ? timeLabels[input.minutesPerSession] : "–", step: 4 },
  ];

  return (
    <div className="px-4 pb-4 flex flex-col gap-4">
      <div>
        <h2 className="font-black italic text-2xl text-white mb-1" style={{ fontFamily: F }}>Check & Anpassen</h2>
        <p className="text-sm text-gray-400">Überprüfe deine Auswahl und passe an.</p>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ background: CARD2, borderBottom: `1px solid ${BORDER}` }}>
          <p className="font-black text-sm text-orange-400" style={{ fontFamily: F }}>Deine Auswahl</p>
          <button onClick={() => onEdit(1)} className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: `${ORANGE}18`, color: ORANGE, border: `1px solid ${ORANGE}44` }}>
            Ändern
          </button>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5"
            style={{ background: CARD, borderBottom: i < rows.length - 1 ? `1px solid ${BORDER}` : "none" }}>
            <span className="text-base w-6 text-center flex-shrink-0">{r.icon}</span>
            <span className="text-xs text-gray-500 w-28 flex-shrink-0">{r.label}</span>
            <span className="text-xs text-white font-bold flex-1">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Loading Screen ─────────────────────────────────────────────────────────────
function LoadingScreen({ onDone }: { onDone: (plan: GeneratedPlan) => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Datenanalyse",    sub: "Deine Angaben werden analysiert" },
    { label: "Volumenplanung",  sub: "Optimale Sätze & Frequenz werden berechnet" },
    { label: "Übungsauswahl",   sub: "Die besten Übungen für dich werden gewählt" },
    { label: "Feinschliff",     sub: "Dein Plan wird final optimiert" },
  ];

  useEffect(() => {
    let s = 0;
    const interval = setInterval(() => {
      s++;
      setStep(s);
      if (s >= steps.length) {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 px-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: `radial-gradient(circle, ${COPPER}33 0%, transparent 70%)`, border: `2px solid ${COPPER}44` }}>
          <img src="/images/nav_paw.webp" alt="" className="w-14 h-14 object-contain" style={{ mixBlendMode: "screen" }} />
        </div>
        <div className="absolute inset-0 rounded-full animate-spin"
          style={{ border: `2px solid transparent`, borderTopColor: ORANGE, animationDuration: "1s" }} />
      </div>
      <div>
        <p className="font-black italic text-xl text-white text-center mb-1" style={{ fontFamily: F }}>Plan wird erstellt…</p>
        <p className="text-xs text-gray-500 text-center">Dies kann einen kurzen Moment dauern.</p>
      </div>
      <div className="w-full flex flex-col gap-3">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: i < step ? "#22c55e22" : i === step ? `${ORANGE}22` : CARD2,
                border: `1.5px solid ${i < step ? "#22c55e" : i === step ? ORANGE : BORDER}`,
              }}>
              {i < step
                ? <span className="text-[10px] text-green-400">✓</span>
                : i === step
                ? <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: ORANGE }} />
                : <div className="w-1.5 h-1.5 rounded-full" style={{ background: BORDER }} />
              }
            </div>
            <div>
              <p className={`text-sm font-bold ${i <= step ? "text-white" : "text-gray-600"}`}
                style={{ fontFamily: F }}>{s.label}</p>
              <p className="text-[10px] text-gray-600">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({ plan, isSaved, onView, onAdjust }: { plan: GeneratedPlan; isSaved?: boolean; onView: () => void; onAdjust: () => void }) {
  return (
    <div className="px-4 pb-4 flex flex-col gap-4">
      <div className="text-center pt-2">
        <p className="font-black italic text-2xl text-white" style={{ fontFamily: F }}>Dein Plan ist bereit! 🎉</p>
        <p className="text-xs text-gray-500 mt-1">Hier ist dein individueller Trainingsplan.</p>
        {isSaved && (
          <div className="flex items-center justify-center gap-1.5 mt-2 px-3 py-1.5 rounded-full mx-auto w-fit"
            style={{ background: "#22c55e18", border: "1px solid #22c55e44" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5.5" stroke="#22c55e" strokeWidth="1"/>
              <path d="M3 6l2 2 4-4" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-[10px] font-bold" style={{ color: "#22c55e" }}>Plan gespeichert & aktiviert</p>
          </div>
        )}
      </div>

      {/* Split-Info */}
      <div className="rounded-xl p-4" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
        <p className="text-xs font-bold text-orange-400 mb-1" style={{ fontFamily: F }}>DEIN TRAININGS-SPLIT</p>
        <p className="font-black italic text-lg text-white" style={{ fontFamily: F }}>
          {plan.splitLabel} ({plan.days.length} Tage)
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {plan.days.map((d, i) => (
            <div key={i} className="text-center px-3 py-2 rounded-lg" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <p className="text-xs font-bold text-orange-400" style={{ fontFamily: F }}>{d.dayOfWeek}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{d.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Split-Begründung */}
      <div className="rounded-xl p-3" style={{ background: `${ORANGE}08`, border: `1px solid ${ORANGE}20` }}>
        <p className="text-xs font-bold text-orange-400 mb-2" style={{ fontFamily: F }}>WARUM DIESER SPLIT?</p>
        {plan.splitReasons.slice(0, 3).map((r, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ORANGE }} />
            <p className="text-xs text-gray-300">{r}</p>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Volumen", value: `${Math.min(plan.volumeBreakdown.find(v => v.muscleGroup === "Brust")?.setsPerWeek ?? 12, 18)}–${Math.max(plan.volumeBreakdown.find(v => v.muscleGroup === "Brust")?.setsPerWeek ?? 12, 18)} Sätze`, sub: "pro Muskel/Woche" },
          { label: "Trainingszeit", value: `${plan.userInput.minutesPerSession === 45 ? "≤45" : plan.userInput.minutesPerSession}–${plan.userInput.minutesPerSession} Min.`, sub: "pro Einheit" },
          { label: "Fokus", value: plan.userInput.focusAreas.join(", ") || "Ausgewogen", sub: plan.userInput.trainingFocus === "balanced" ? "Ausgewogen" : "Priorisiert" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-3 text-center" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
            <p className="text-[9px] font-bold text-orange-400 mb-1" style={{ fontFamily: F }}>{s.label.toUpperCase()}</p>
            <p className="font-black text-xs text-white leading-tight" style={{ fontFamily: F }}>{s.value}</p>
            <p className="text-[9px] text-gray-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Progression */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
        <span className="text-xl">📈</span>
        <div>
          <p className="text-xs font-bold text-white" style={{ fontFamily: F }}>Progression</p>
          <p className="text-xs text-gray-400">{plan.progression} · RIR {plan.rir}</p>
        </div>
      </div>

      <button onClick={onView} className="w-full py-4 rounded-2xl font-black text-base text-white"
        style={{ background: `linear-gradient(135deg, ${COPPER} 0%, ${ORANGE} 60%)`, fontFamily: F }}>
        PLAN ANSEHEN
      </button>
      <button onClick={onAdjust} className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
        style={{ background: CARD2, color: "#888", border: `1px solid ${BORDER}`, fontFamily: F }}>
        Plan anpassen ✏️
      </button>
    </div>
  );
}

// ── Plan Overview Screen ──────────────────────────────────────────────────────
function PlanOverviewScreen({ plan, onStart, onDayClick }: { plan: GeneratedPlan; onStart: () => void; onDayClick: (idx: number) => void }) {
  return (
    <div className="px-4 pb-4 flex flex-col gap-4">
      <div>
        <p className="font-black italic text-2xl text-white" style={{ fontFamily: F }}>Dein Plan – Übersicht</p>
      </div>
      <div className="flex flex-col gap-2">
        {plan.days.map((d, i) => (
          <button key={i} onClick={() => onDayClick(i)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left w-full transition-all hover:opacity-80"
            style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${ORANGE}18`, border: `1px solid ${ORANGE}44` }}>
              <span className="text-xs font-black text-orange-400" style={{ fontFamily: F }}>{d.dayOfWeek}</span>
            </div>
            <div className="flex-1">
              <p className="font-black text-sm text-white" style={{ fontFamily: F }}>{d.label}</p>
              <p className="text-xs text-gray-500">{d.muscleGroups.join(", ")}</p>
            </div>
            <span className="text-gray-600">›</span>
          </button>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        {[
          { icon: "🔄", label: "Trainingsfrequenz",  value: `${Math.ceil(plan.days.length / 2)}x pro Muskel/Woche` },
          { icon: "📊", label: "Gesamtvolumen",      value: `${plan.volumeBreakdown[0]?.setsPerWeek ?? 12}–${(plan.volumeBreakdown[0]?.setsPerWeek ?? 12) + 6} Sätze pro Muskel/Woche` },
          { icon: "💚", label: "Regeneration",       value: "Ausgewogen eingeplant" },
        ].map((r, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3"
            style={{ background: CARD, borderBottom: i < 2 ? `1px solid ${BORDER}` : "none" }}>
            <span className="text-base">{r.icon}</span>
            <p className="text-xs text-gray-400 flex-1">{r.label}</p>
            <p className="text-xs font-bold text-white">{r.value}</p>
          </div>
        ))}
      </div>
      <button onClick={onStart} className="w-full py-4 rounded-2xl font-black text-base text-white"
        style={{ background: `linear-gradient(135deg, ${COPPER} 0%, ${ORANGE} 60%)`, fontFamily: F }}>
        LOS GEHT'S!
      </button>
    </div>
  );
}

// ── Day Detail Screen ─────────────────────────────────────────────────────────
function DayDetailScreen({ day }: { day: TrainingDay }) {
  const byMuscle: Record<string, typeof day.exercises> = {};
  day.exercises.forEach(ex => {
    if (!byMuscle[ex.muscleGroup]) byMuscle[ex.muscleGroup] = [];
    byMuscle[ex.muscleGroup].push(ex);
  });

  return (
    <div className="px-4 pb-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-black italic text-2xl text-white" style={{ fontFamily: F }}>{day.label}</p>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
          <span className="text-xs">⏱️</span>
          <span className="text-xs text-gray-400">{day.estimatedMinutes} Min.</span>
        </div>
      </div>
      {Object.entries(byMuscle).map(([mg, exs]) => (
        <div key={mg} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          <div className="px-4 py-2" style={{ background: CARD2, borderBottom: `1px solid ${BORDER}` }}>
            <p className="font-black text-sm text-orange-400" style={{ fontFamily: F }}>{mg}</p>
          </div>
          {exs.map((ex, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5"
              style={{ background: CARD, borderBottom: i < exs.length - 1 ? `1px solid ${BORDER}` : "none" }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 rounded-full flex-shrink-0"
                  style={{ background: ex.isCompound ? ORANGE : COPPER }} />
                <div>
                  <p className="text-xs font-bold text-white">{ex.name}</p>
                  <p className="text-[10px] text-gray-500">{ex.equipment.join(", ")}</p>
                </div>
              </div>
              <p className="text-xs font-black text-orange-400 flex-shrink-0" style={{ fontFamily: F }}>
                {ex.sets} x {ex.repsMin}–{ex.repsMax}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Haupt-Wizard ──────────────────────────────────────────────────────────────
type WizardScreen = "wizard" | "loading" | "result" | "overview" | "day";

const DEFAULT_INPUT: Partial<UserInput> = {
  goal: "hypertrophy",
  focusAreas: [],
  daysPerWeek: 4,
  split: "upper_lower",
  trainingFocus: "balanced",
  intensity: "demanding",
  trainingStyle: "classic",
  equipment: "gym",
  minutesPerSession: 60,
  injuries: ["none"],
  experienceLevel: "intermediate",
};

export function CoachPlanWizard({ onClose }: { onClose: () => void }) {
  const [screen, setScreen] = useState<WizardScreen>("wizard");
  const [wizardStep, setWizardStep] = useState(1);
  const [subStep, setSubStep] = useState<"A" | "B">("A");
  const [input, setInput] = useState<Partial<UserInput>>(DEFAULT_INPUT);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);

  const createPlan = usePlanStore(s => s.createPlan);
  const setActivePlan = usePlanStore(s => s.setActivePlan);

  function saveGeneratedPlan(generatedPlan: GeneratedPlan): string {
    // GeneratedPlan → CustomPlan konvertieren
    const days: CustomWorkoutDay[] = generatedPlan.days.map((d, i) => ({
      id: `gen-day-${i}`,
      label: d.label,
      exercises: d.exercises.map(ex => ({
        name: ex.name,
        sets: Array.from({ length: ex.sets }, (_, si) => ({
          reps: Math.round((ex.repsMin + ex.repsMax) / 2),
          weight: 0,
        })),
        movement_pattern: ex.movementPattern,
      } as PlanExercise)),
    }));

    const goalLabels: Record<string, string> = {
      hypertrophy: "Muskelaufbau", strength: "Kraftaufbau",
      fat_loss: "Fettabbau", fitness: "Allgemeine Fitness",
    };

    const planId = createPlan({
      name: `${generatedPlan.splitLabel} – Coach Plan`,
      desc: `${goalLabels[generatedPlan.userInput.goal] ?? ""} · ${generatedPlan.userInput.daysPerWeek} Tage`,
      icon: "🤖",
      color: "#e8a050",
      daysPerWeek: generatedPlan.userInput.daysPerWeek,
      focus: generatedPlan.userInput.focusAreas.join(" · ") || "Ausgewogen",
      days,
      isActive: false,
    });

    setActivePlan(planId);
    setSavedPlanId(planId);
    return planId;
  }

  function update(v: Partial<UserInput>) { setInput(prev => ({ ...prev, ...v })); }

  // Empfohlenen Split live berechnen
  const recommendedSplit: SplitType = (() => {
    try {
      return scoreSplits(input as UserInput)[0]?.split ?? "upper_lower";
    } catch { return "upper_lower"; }
  })();

  function handleNext() {
    if (wizardStep === 3 && subStep === "A") { setSubStep("B"); return; }
    if (wizardStep === 3 && subStep === "B") { setWizardStep(4); return; }
    if (wizardStep < 5) { setWizardStep(w => w + 1); return; }
    // Step 5 → Plan erstellen
    setScreen("loading");
    setTimeout(() => {
      const generated = generatePlan(input as UserInput);
      setPlan(generated);
      saveGeneratedPlan(generated);  // Sofort speichern & aktivieren
      setScreen("result");
    }, 3800);
  }

  function handleBack() {
    if (screen === "overview") { setScreen("result"); return; }
    if (screen === "day") { setScreen("overview"); return; }
    if (wizardStep === 1) { onClose(); return; }
    if (wizardStep === 3 && subStep === "B") { setSubStep("A"); return; }
    if (wizardStep === 4) { setWizardStep(3); setSubStep("B"); return; }
    setWizardStep(w => w - 1);
  }

  // Loading
  if (screen === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.85)", paddingBottom: 80 }}>
        <div className="w-full max-w-[430px] rounded-t-3xl overflow-hidden" style={{ background: BG }}>
          <LoadingScreen onDone={(p) => { setPlan(p); setScreen("result"); }} />
        </div>
      </div>
    );
  }

  // Result
  if (screen === "result" && plan) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.85)", paddingBottom: 80 }}>
        <div className="w-full max-w-[430px] rounded-t-3xl overflow-y-auto" style={{ background: BG, maxHeight: "calc(100vh - 80px)" }}>
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <div />
            <button onClick={onClose} className="text-gray-500 hover:text-white text-sm">✕</button>
          </div>
          <ResultScreen plan={plan} isSaved={!!savedPlanId} onView={() => setScreen("overview")} onAdjust={() => { setScreen("wizard"); setWizardStep(1); }} />
        </div>
      </div>
    );
  }

  // Overview
  if (screen === "overview" && plan) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.85)", paddingBottom: 80 }}>
        <div className="w-full max-w-[430px] rounded-t-3xl overflow-y-auto" style={{ background: BG, maxHeight: "calc(100vh - 80px)" }}>
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <button onClick={() => setScreen("result")} className="text-gray-400 hover:text-white">←</button>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-sm">✕</button>
          </div>
          <PlanOverviewScreen plan={plan} onStart={onClose} onDayClick={(i) => { setSelectedDay(i); setScreen("day"); }} />
        </div>
      </div>
    );
  }

  // Day Detail
  if (screen === "day" && plan) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.85)", paddingBottom: 80 }}>
        <div className="w-full max-w-[430px] rounded-t-3xl overflow-y-auto" style={{ background: BG, maxHeight: "calc(100vh - 80px)" }}>
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <button onClick={() => setScreen("overview")} className="text-gray-400 hover:text-white">←</button>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-sm">✕</button>
          </div>
          <DayDetailScreen day={plan.days[selectedDay]} />
        </div>
      </div>
    );
  }

  // Wizard Steps
  const canProceed = () => {
    if (wizardStep === 1) return !!input.goal;
    if (wizardStep === 2) return !!input.split && !!input.daysPerWeek;
    if (wizardStep === 3 && subStep === "A") return !!input.trainingFocus;
    if (wizardStep === 3 && subStep === "B") return !!input.intensity;
    if (wizardStep === 4) return !!input.equipment && !!input.minutesPerSession;
    return true;
  };

  const stepLabel = wizardStep === 3 ? `3${subStep} von 5` : `${wizardStep} von 5`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.85)", paddingBottom: 80 }}>
      <div className="w-full max-w-[430px] rounded-t-3xl overflow-hidden flex flex-col" style={{ background: BG, maxHeight: "calc(100vh - 80px)" }}>
        {/* Progress */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 flex-shrink-0">
          <button onClick={handleBack} className="text-gray-400 hover:text-white transition-colors text-lg">←</button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">{stepLabel}</span>
            </div>
            <div className="w-full rounded-full" style={{ height: 3, background: BORDER }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((wizardStep - 1 + (wizardStep === 3 && subStep === "B" ? 0.5 : 0)) / 4) * 100}%`,
                  background: `linear-gradient(90deg, ${COPPER} 0%, ${ORANGE} 100%)`
                }} />
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-sm">✕</button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {wizardStep === 1 && <Step1 input={input} update={update} />}
          {wizardStep === 2 && <Step2 input={input} update={update} recommendedSplit={recommendedSplit} />}
          {wizardStep === 3 && subStep === "A" && <Step3A input={input} update={update} />}
          {wizardStep === 3 && subStep === "B" && <Step3B input={input} update={update} />}
          {wizardStep === 4 && <Step4 input={input} update={update} />}
          {wizardStep === 5 && <Step5 input={input} onEdit={(s) => setWizardStep(s)} />}
        </div>

        {/* Buttons */}
        <div className="px-4 pb-6 pt-3 flex gap-3 flex-shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
          {wizardStep > 1 && (
            <button onClick={handleBack}
              className="px-6 py-4 rounded-2xl font-black text-sm"
              style={{ background: CARD2, color: "#888", border: `1px solid ${BORDER}`, fontFamily: F }}>
              Zurück
            </button>
          )}
          <button onClick={handleNext} disabled={!canProceed()}
            className="flex-1 py-4 rounded-2xl font-black text-base text-white transition-all"
            style={{
              background: canProceed() ? `linear-gradient(135deg, ${COPPER} 0%, ${ORANGE} 60%)` : "#2a2a2a",
              color: canProceed() ? "#fff" : "#555",
              fontFamily: F,
            }}>
            {wizardStep === 5 ? "PLAN ERSTELLEN" : "Weiter"}
          </button>
        </div>
      </div>
    </div>
  );
}
