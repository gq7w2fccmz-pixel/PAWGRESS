// ── CoachPlanWizard – vollständiger 5-Step Onboarding-Wizard ────────────────
import { useState, useEffect } from "react";
import { generatePlan } from "../engine/planner";
import { usePlanStore } from "../stores/planStore";
import type { CustomWorkoutDay } from "../stores/planStore";
import type { PlanExercise } from "../data/plan_2er_split";
import { scoreSplits } from "../engine/scorer";
import type { UserInput, GeneratedPlan, SplitType, Goal, FocusArea, TrainingFocus, Intensity, TrainingStyle, Equipment, TimeSlot, TrainingDay } from "../engine/types";
import { F, ORANGE, COPPER, COPPER_L, COPPER_G, SURF, SURF2, BORDER, CARD, CARD2, BORDER2, GREEN, RED, BG } from "../styles/tokens";


// ── Hilfsfunktionen ───────────────────────────────────────────────────────────
import { Step1, Step2, Step3A, Step3B, Step4, Step5, LoadingScreen, ResultScreen, PlanOverviewScreen, DayDetailScreen } from "../components/coach/WizardSteps";

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
    const days: CustomWorkoutDay[] = generatedPlan.days.map((d, i) => ({
      id: `gen-day-${i}`,
      label: d.label,
      exercises: d.exercises.map(ex => ({
        name: ex.name,
        sets: Array.from({ length: ex.sets }, () => ({
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
