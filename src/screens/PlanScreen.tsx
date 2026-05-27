/**
 * PlanScreen – Neugestaltung mit 3 Karten
 * Karte 1: Coach erstellt Plan (coming soon)
 * Karte 2: Plan mit Coach gemeinsam (coming soon)
 * Karte 3: Selbst erstellen (funktioniert)
 */

import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { PlanExercise } from "../data/plan_2er_split";
import { useStatsStore } from "../stores/statsStore";
import { usePlanStore, type CustomPlan, type StandaloneWorkout } from "../stores/planStore";
import {
  PlanCreatorScreen,
  WorkoutCreatorScreen,
  AllPlansScreen,
  DayDetailScreen,
} from "./plan/PlanSubScreens";
import { CoachPlanWizard } from "./CoachPlanWizard";
import { F, ORANGE, COPPER, COPPER_L, COPPER_G, SURF, SURF2, BORDER, CARD, CARD2, BORDER2, GREEN, RED, BG, BLUE } from "../styles/tokens";


// ── SVG Icons ─────────────────────────────────────────────────────────────────
function IconTarget({ color = ORANGE }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="5" stroke={color} strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="2" fill={color}/>
    </svg>
  );
}

function IconClock({ color = ORANGE }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke={color} strokeWidth="1.5"/>
      <polyline points="11,6 11,11 14,13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconBars({ color = ORANGE }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="2" y="13" width="4" height="7" rx="1" fill={color} fillOpacity="0.4"/>
      <rect x="9" y="8" width="4" height="12" rx="1" fill={color} fillOpacity="0.7"/>
      <rect x="16" y="3" width="4" height="17" rx="1" fill={color}/>
    </svg>
  );
}

function IconBook({ color = BLUE }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 4C4 4 7 3 11 3C15 3 18 4 18 4V18C18 18 15 17 11 17C7 17 4 18 4 18V4Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="11" y1="3" x2="11" y2="17" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

function IconSliders({ color = BLUE }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <line x1="3" y1="7" x2="19" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="3" y1="15" x2="19" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="7" r="2.5" fill={color}/>
      <circle cx="14" cy="15" r="2.5" fill={color}/>
    </svg>
  );
}

function IconShield({ color = BLUE }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 3L19 6V11C19 15 15 18.5 11 20C7 18.5 3 15 3 11V6L11 3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <polyline points="8,11 10,13 14,9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconPencil({ color = GREEN }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M15 4L18 7L8 17L4 18L5 14L15 4Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="13" y1="6" x2="16" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconGrid({ color = GREEN }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <rect x="12" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <rect x="3" y="12" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <rect x="12" y="12" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

function IconStar({ color = GREEN }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <polygon points="11,3 13.5,8.5 19.5,9.5 15,14 16.5,20 11,17 5.5,20 7,14 2.5,9.5 8.5,8.5" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Plan Card ─────────────────────────────────────────────────────────────────
function PlanCard({
  num,
  numBg,
  image,
  titleLine1,
  titleLine2,
  titleColor,
  features,
  featureColor,
  btnLabel,
  btnBg,
  btnColor,
  onPress,
  disabled,
  footerIcon,
}: {
  num:         string;
  numBg:       string;
  image:       string;
  titleLine1:  string;
  titleLine2:  string;
  titleColor:  string;
  features:    { icon: ReactNode; label: string }[];
  featureColor:string;
  btnLabel:    string;
  btnBg:       string;
  btnColor:    string;
  onPress:     () => void;
  disabled?:   boolean;
  footerIcon?: ReactNode;
}) {
  return (
    <div className="rounded-3xl overflow-hidden relative"
      style={{ background: "#111", border: "1px solid #1e1e1e" }}>

      {/* Nummer */}
      <div className="absolute top-4 left-4 z-10 w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg"
        style={{ background: numBg, fontFamily: F }}>
        {num}
      </div>

      {/* Bild + Titel nebeneinander */}
      <div className="flex items-stretch" style={{ minHeight: 160 }}>
        {/* Bild */}
        <div className="relative flex-shrink-0" style={{ width: "42%" }}>
          <img src={image} alt="" className="w-full h-full object-cover object-top"
            style={{ display: "block" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, transparent 60%, #111 100%)" }} />
        </div>

        {/* Titel */}
        <div className="flex-1 flex flex-col justify-center px-4 pt-8 pb-3">
          <p className="font-black italic leading-none text-white"
            style={{ fontFamily: F, fontSize: 22 }}>
            <span style={{ color: titleColor }}>{titleLine1} </span>
            {titleLine2}
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="flex justify-around px-4 py-3 border-t border-b"
        style={{ borderColor: "#1e1e1e" }}>
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            {f.icon}
            <p className="text-[10px] text-center leading-tight"
              style={{ color: featureColor, maxWidth: 64 }}>{f.label}</p>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="px-4 py-4">
        <button onClick={onPress} disabled={disabled}
          className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2"
          style={{
            background: disabled ? `${SURF2}` : `linear-gradient(135deg, #b8660a 0%, #e8a050 40%, #cd7f32 100%)`,
            color: disabled ? "#555" : btnColor,
            border: "none", fontFamily: F,
            boxShadow: disabled ? "none" : `0 0 20px ${btnBg}55`,
          }}>
          {footerIcon}
          {btnLabel}
          {disabled && <span className="text-xs ml-1 font-normal">(Kommt bald)</span>}
        </button>
      </div>

      {/* Pfeil rechts */}
      {!disabled && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1L7 7L1 13" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Main PlanScreen ────────────────────────────────────────────────────────────
export function PlanScreen() {
  const navigate = useNavigate();

  const plans        = usePlanStore(s => s.plans);
  const workouts     = usePlanStore(s => s.workouts);
  const activePlanId = usePlanStore(s => s.activePlanId);

  type SubScreen = null | "createPlan" | "createWorkout" | "allPlans" | "editWorkout" | "selfCreate";
  const [sub,      setSub]      = useState<SubScreen>(null);
  const prevSub = useRef<SubScreen>(null);
  function goTo(s: SubScreen) { prevSub.current = sub; setSub(s); }
  const [editWOId, setEditWOId] = useState<string | undefined>(undefined);
  const [dayDetail, setDayDetail] = useState<{ label:string; exercises:PlanExercise[]; color:string } | null>(null);
  const [showCoachWizard, setShowCoachWizard] = useState(false);

  // Sub-Screen routing
  if (sub === "createPlan")    return <PlanCreatorScreen   onBack={() => goTo(null)} />;
  if (sub === "createWorkout") return <WorkoutCreatorScreen onBack={() => goTo(null)} onSaved={() => goTo("allPlans")} />;
  if (sub === "editWorkout" && editWOId)
    return <WorkoutCreatorScreen onBack={() => goTo(null)} existingId={editWOId} />;
  if (sub === "allPlans")
    return <AllPlansScreen onBack={() => goTo(null)}
      onEditWorkout={id => { setEditWOId(id); goTo("editWorkout"); }}
      initialTab={prevSub.current === "createWorkout" ? "workouts" : "pläne"} />;
  if (sub === "selfCreate")    return <SelfCreateScreen    onBack={() => goTo(null)}
    onCreatePlan={() => goTo("createPlan")}
    onCreateWorkout={() => goTo("createWorkout")}
    onAllPlans={() => goTo("allPlans")} />;
  if (dayDetail)
    return <DayDetailScreen day={dayDetail} color={dayDetail.color} onBack={() => setDayDetail(null)} />;

  return (
    <>
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p className="font-black italic text-4xl text-white leading-none" style={{ fontFamily: F }}>
          WÄHLE DEINEN WEG
        </p>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
          <span style={{ color: ORANGE }}>🐾</span> Zum perfekten Plan oder Workout.
        </p>
      </div>

      {/* Karten */}
      <div className="px-4 flex flex-col gap-4">

        {/* Karte 1 – Coach erstellt Plan */}
        <PlanCard
          num="1" numBg={COPPER}
          image="/images/plan_card_1.webp"
          titleLine1="COACH ERSTELLT"
          titleLine2="DEINEN PLAN"
          titleColor={COPPER_L}
          features={[
            { icon: <IconTarget color={COPPER_L}/>,  label: "Individuell\nabgestimmt" },
            { icon: <IconClock color={COPPER_L}/>,   label: "In Sekunden\nbereit" },
            { icon: <IconBars color={COPPER_L}/>,    label: "Wissenschaftlich\nfundiert" },
          ]}
          featureColor="#aaa"
          btnLabel="PLAN GENERIEREN"
          btnBg={COPPER_L}
          btnColor="#fff"
          onPress={() => setShowCoachWizard(true)}
          disabled={false}
          footerIcon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L11 7H16L12 10.5L13.5 16L9 13L4.5 16L6 10.5L2 7H7L9 2Z" fill="#fff" fillOpacity="0.8"/>
            </svg>
          }
        />

        {/* Karte 2 – Mit Coach */}
        <PlanCard
          num="2" numBg={BLUE}
          image="/images/plan_card_2.webp"
          titleLine1="PLAN MIT COACH"
          titleLine2="GEMEINSAM ERSTELLEN"
          titleColor={BLUE}
          features={[
            { icon: <IconBook color={BLUE}/>,    label: "Coach erklärt\nund empfiehlt" },
            { icon: <IconSliders color={BLUE}/>, label: "Anpassen &\nverstehen" },
            { icon: <IconShield color={BLUE}/>,  label: "Perfekt auf\ndich abgestimmt" },
          ]}
          featureColor="#aaa"
          btnLabel="MIT COACH STARTEN"
          btnBg={BLUE}
          btnColor="#fff"
          onPress={() => {}}
          disabled={true}
          footerIcon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="1.5"/>
              <circle cx="7" cy="7.5" r="1.5" fill="#fff"/>
              <circle cx="11" cy="7.5" r="1.5" fill="#fff"/>
              <path d="M6 11.5C6 11.5 7.5 13 9 13C10.5 13 12 11.5 12 11.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
        />

        {/* Karte 3 – Selbst erstellen */}
        <PlanCard
          num="3" numBg={GREEN}
          image="/images/plan_card_3.webp"
          titleLine1="PLAN ODER WORKOUT"
          titleLine2="SELBST ERSTELLEN"
          titleColor={GREEN}
          features={[
            { icon: <IconPencil color={GREEN}/>, label: "Alles selbst\nbestimmen" },
            { icon: <IconGrid color={GREEN}/>,   label: "Übungen & Sätze\nfrei wählen" },
            { icon: <IconStar color={GREEN}/>,   label: "Für Profis &\nIndividualisten" },
          ]}
          featureColor="#aaa"
          btnLabel="SELBST ERSTELLEN"
          btnBg={GREEN}
          btnColor="#fff"
          onPress={() => goTo("selfCreate")}
          footerIcon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13 4L16 7L7 16L3 17L4 13L13 4Z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          }
        />
      </div>

      {/* Footer */}
      <div className="mx-4 mt-5 rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ background: "#111", border: "1px solid #1e1e1e" }}>
        <img src="/images/coach_bertl.webp" alt="Bertl"
          className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0" />
        <div>
          <p className="font-black text-xs text-white" style={{ fontFamily: F }}>
            UNTERSTÜTZT VON BERTL
          </p>
          <p className="text-[10px] text-gray-500">
            Egal welchen Weg du wählst – ich helfe dir, deine Ziele zu erreichen.
          </p>
        </div>
        <button style={{ background: "none", border: "none", marginLeft: "auto" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 17.5C10 17.5 2.5 13 2.5 7.5C2.5 5 4.5 3 7 3C8.5 3 9.5 3.8 10 4.5C10.5 3.8 11.5 3 13 3C15.5 3 17.5 5 17.5 7.5C17.5 13 10 17.5 10 17.5Z" stroke="#888" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    {showCoachWizard && <CoachPlanWizard onClose={() => setShowCoachWizard(false)} />}
    </>
  );
}

// ── Self Create Sub-Screen ─────────────────────────────────────────────────────
function SelfCreateScreen({
  onBack,
  onCreatePlan,
  onCreateWorkout,
  onAllPlans,
}: {
  onBack:          () => void;
  onCreatePlan:    () => void;
  onCreateWorkout: () => void;
  onAllPlans:      () => void;
}) {
  const plans    = usePlanStore(s => s.plans);
  const workouts = usePlanStore(s => s.workouts);

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>
      <div className="px-5 pt-12 pb-6">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "#111", border: "none" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p className="font-black italic text-4xl text-white leading-none" style={{ fontFamily: F }}>
          SELBST ERSTELLEN
        </p>
        <p className="text-gray-500 text-sm mt-1">Dein Plan, deine Regeln.</p>
      </div>

      <div className="px-4 flex flex-col gap-3">

        {/* Trainingsplan erstellen */}
        <button onClick={onCreatePlan}
          className="w-full flex items-center gap-4 p-5 rounded-2xl text-left"
          style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${COPPER}18` }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="4" y="4" width="20" height="20" rx="3" stroke={ORANGE} strokeWidth="1.5"/>
              <line x1="14" y1="9" x2="14" y2="19" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="9" y1="14" x2="19" y2="14" stroke={COPPER_L} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-black text-lg text-white" style={{ fontFamily: F }}>
              TRAININGSPLAN ERSTELLEN
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Mehrere Tage, Übungen & Sätze</p>
          </div>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1L7 7L1 13" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Workout erstellen */}
        <button onClick={onCreateWorkout}
          className="w-full flex items-center gap-4 p-5 rounded-2xl text-left"
          style={{ background: "#111", border: `1px solid ${GREEN}33` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${GREEN}18` }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="12" width="4" height="4" rx="1" fill={GREEN}/>
              <rect x="6" y="10" width="2" height="8" rx="1" fill={GREEN}/>
              <rect x="8" y="12" width="12" height="4" rx="1" fill={GREEN}/>
              <rect x="20" y="10" width="2" height="8" rx="1" fill={GREEN}/>
              <rect x="22" y="12" width="4" height="4" rx="1" fill={GREEN}/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-black text-lg text-white" style={{ fontFamily: F }}>
              WORKOUT ERSTELLEN
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Einzelnes Workout konfigurieren</p>
          </div>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1L7 7L1 13" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Alle Pläne */}
        {(plans.length > 0 || workouts.length > 0) && (
          <button onClick={onAllPlans}
            className="w-full flex items-center gap-4 p-5 rounded-2xl text-left"
            style={{ background: "#111", border: "1px solid #1e1e1e" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#1e1e1e" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="6" width="20" height="4" rx="1.5" fill="#888"/>
                <rect x="4" y="12" width="20" height="4" rx="1.5" fill="#888" fillOpacity="0.7"/>
                <rect x="4" y="18" width="14" height="4" rx="1.5" fill="#888" fillOpacity="0.4"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-black text-lg text-white" style={{ fontFamily: F }}>
                MEINE PLÄNE & WORKOUTS
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {plans.length} Pläne · {workouts.length} Workouts
              </p>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1L7 7L1 13" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
