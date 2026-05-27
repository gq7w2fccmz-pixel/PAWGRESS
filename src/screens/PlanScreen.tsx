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

  type SubScreen = null | "createPlan" | "createWorkout" | "allPlans" | "editWorkout" | "selfCreate" | "bertlTipps";
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
  if (sub === "bertlTipps")    return <BertlTippsScreen    onBack={() => goTo(null)} />;
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

      {/* Tipps von Bertl */}
      <button
        onClick={() => goTo("bertlTipps")}
        className="mx-4 mt-5 rounded-2xl px-4 py-3 flex items-center gap-3 w-[calc(100%-2rem)]"
        style={{ background: "#111", border: "1px solid #1e1e1e" }}>
        <img src="/images/coach_bertl.webp" alt="Bertl"
          className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0" />
        <div className="text-left">
          <p className="font-black text-xs text-white" style={{ fontFamily: F }}>
            TIPPS VON BERTL
          </p>
          <p className="text-[10px] text-gray-500">
            Kraft · Hypertrophie · Kraftausdauer – alles erklärt
          </p>
        </div>
        <div className="ml-auto flex-shrink-0">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M1 1L7 7L1 13" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
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

// ── BertlTippsScreen ───────────────────────────────────────────────────────────
function BertlTippsScreen({ onBack }: { onBack: () => void }) {
  const [showKraft, setShowKraft] = useState(false);
  const [showHypertrophie, setShowHypertrophie] = useState(false);
  const [showKraftausdauer, setShowKraftausdauer] = useState(false);

  if (showKraft) return <KraftDetailScreen onBack={() => setShowKraft(false)} />;
  if (showHypertrophie) return <HypertrophieDetailScreen onBack={() => setShowHypertrophie(false)} />;
  if (showKraftausdauer) return <KraftausdauerDetailScreen onBack={() => setShowKraftausdauer(false)} />;

  const tips = [
    {
      key: "kraft",
      title: "Kraft",
      emoji: "🏋️",
      color: "#e8a050",
      subtitle: "1–6 Wdh · sehr schwer · lange Pausen",
      desc: "Maximale Kraftentwicklung durch schwere Lasten und hohe neuronale Ansteuerung.",
      onClick: () => setShowKraft(true),
    },
    {
      key: "hypertrophie",
      title: "Hypertrophie",
      emoji: "💪",
      color: GREEN,
      subtitle: "8–12 Wdh · mittel · 1–2 min Pause",
      desc: "Muskelaufbau durch hohes Volumen, metabolischen Stress und Kombination aus Grund- und Isolationsübungen.",
      onClick: () => setShowHypertrophie(true),
    },
    {
      key: "kraftausdauer",
      title: "Kraftausdauer",
      emoji: "⚡",
      color: BLUE,
      subtitle: "20+ Wdh · sehr leicht · 30–60 sek Pause",
      desc: "Trainiert die Fähigkeit, Kraft über längere Zeit aufrechtzuerhalten – ideal für Ausdauer und Fettabbau.",
      onClick: () => setShowKraftausdauer(true),
    },
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
          <p className="font-black italic text-2xl text-white leading-none" style={{ fontFamily: F }}>
            TIPPS VON BERTL
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Trainingsarten im Überblick</p>
        </div>
        <img src="/images/coach_bertl.webp" alt="Bertl"
          className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0 ml-auto" />
      </div>

      {/* Tipp-Karten */}
      <div className="px-4 flex flex-col gap-4 mt-2">
        {tips.map(tip => (
          <button key={tip.key}
            onClick={tip.onClick}
            className="rounded-2xl overflow-hidden w-full text-left"
            style={{ background: "#111", border: `1px solid ${tip.color}22` }}>

            {/* Karten-Header */}
            <div className="px-4 py-3 flex items-center gap-3"
              style={{ borderBottom: "1px solid #1e1e1e" }}>
              <span className="text-2xl">{tip.emoji}</span>
              <div className="flex-1">
                <p className="font-black text-base" style={{ fontFamily: F, color: tip.color }}>
                  {tip.title.toUpperCase()}
                </p>
                <p className="text-[11px]" style={{ color: "#888" }}>{tip.subtitle}</p>
              </div>
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M1 1L7 7L1 13" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Beschreibung */}
            <div className="px-4 py-3">
              <p className="text-sm text-gray-300 leading-relaxed">{tip.desc}</p>
            </div>
          </button>
        ))}

        {/* Bertl-Zitat */}
        <div className="rounded-2xl px-4 py-4 mt-1 mb-2"
          style={{ background: "#111", border: "1px solid #1e1e1e" }}>
          <p className="text-xs text-gray-500 italic leading-relaxed">
            „Wähle die Methode, die zu deinem Ziel passt – und bleib dabei konsequent.
            Kein System schlägt Beständigkeit."
          </p>
          <p className="text-[10px] mt-2 font-black" style={{ color: ORANGE, fontFamily: F }}>
            — BERTL
          </p>
        </div>
      </div>
    </div>
  );
}

// ── KraftDetailScreen ──────────────────────────────────────────────────────────
function KraftDetailScreen({ onBack }: { onBack: () => void }) {
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
          ].map((t, i) => <Bullet key={i} text={t} />)}
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
            .map((t, i) => <Bullet key={i} text={t} />)}
          <p className="text-xs font-bold text-white mt-3 mb-1.5">Ergänzende Übungen</p>
          {["Trizepsdrücken", "Bizepscurls", "Beinbeuger", "Wadenheben"]
            .map((t, i) => <Bullet key={i} text={t} />)}
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
          ].map((t, i) => <Bullet key={i} text={t} />)}
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
            ].map((t, i) => <Bullet key={i} text={t} />)}
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
          ].map((t, i) => <Bullet key={i} text={t} />)}
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
function HypertrophieDetailScreen({ onBack }: { onBack: () => void }) {
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
            .map((t, i) => <Bullet key={i} text={t} />)}
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
            .map((t, i) => <Bullet key={i} text={t} />)}
          <p className="text-xs font-bold text-white mt-3 mb-1.5">Isolationsübungen</p>
          {["Flys", "Seitheben", "Bizepscurls", "Trizepsstrecken", "Beinstrecken", "Crunches"]
            .map((t, i) => <Bullet key={i} text={t} />)}
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
          ].map((t, i) => <Bullet key={i} text={t} />)}
        </div>

        {/* Periodisierung */}
        <Section title="Periodisierung" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-xs font-bold text-white mb-1.5">Hypertrophiephase</p>
          {["Hohe Satzanzahl", "8–12 Wiederholungen", "Geringere Intensität", "Sehr hohes Volumen"]
            .map((t, i) => <Bullet key={i} text={t} />)}
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <p className="text-xs font-bold text-white mb-1.5">Ziel</p>
            {["Aufbau von Muskelmasse", "Vorbereitung auf spätere Kraftphasen"]
              .map((t, i) => <Bullet key={i} text={t} />)}
          </div>
        </div>

        {/* Umgekehrte lineare Periodisierung */}
        <Section title="Umgekehrte lineare Periodisierung" />
        <div className="rounded-2xl px-4 py-3 mb-6" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          <p className="text-sm text-gray-300 mb-2">Bei Hypertrophiefokus:</p>
          {["Intensität sinkt im Verlauf", "Volumen steigt im Verlauf"]
            .map((t, i) => <Bullet key={i} text={t} />)}
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
function KraftausdauerDetailScreen({ onBack }: { onBack: () => void }) {
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
          ].map((t, i) => <Bullet key={i} text={t} />)}
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
            .map((t, i) => <Bullet key={i} text={t} />)}
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <p className="text-xs font-bold text-white mb-1.5">Beispiele</p>
            {["Kniebeugen", "Ausfallschritte", "Liegestütze", "Rudern", "Crunches"]
              .map((t, i) => <Bullet key={i} text={t} />)}
          </div>
        </div>

        <Section title="Charakteristik" />
        <div className="rounded-2xl px-4 py-3" style={{ background: "#111", border: `1px solid ${COLOR}22` }}>
          {["Leichte Gewichte", "Sehr viele Wiederholungen", "Kurze Pausen", "Hohe metabolische Belastung", "Starke Ermüdung"]
            .map((t, i) => <Bullet key={i} text={t} />)}
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
function KraftPeriodisierungScreen({ onBack }: { onBack: () => void }) {
  const COLOR = "#e8a050";

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
            Die Phasen entwickeln sich von hohem Volumen + niedriger Intensität hin zu niedrigerem Volumen + hoher Intensität.
          </p>
          <SubTitle text="Reihenfolge" />
          <Steps items={["Hypertrophie", "Maximalkraft", "Schnellkraft / Wettkampf"]} />
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <SubTitle text="Maximalkraftphase" />
            <Table rows={[
              { label: "Sätze", value: "3–5" },
              { label: "Wiederholungen", value: "2–6" },
              { label: "Intensität", value: "Hoch" },
              { label: "Volumen", value: "Mittel bis hoch" },
              { label: "Pause", value: "2–5 min" },
            ]} />
            <SubTitle text="Ziel" />
            <Bullet text="Maximale Kraftentwicklung" />
            <Bullet text="Neuronale Anpassungen" />
            <Bullet text="Höhere Rekrutierung motorischer Einheiten" />
          </div>
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <SubTitle text="Eigenschaften" />
            <Bullet text="Schwere Gewichte, lange Satzpausen" />
            <Bullet text="Niedrige Wiederholungen" />
            <Bullet text="Fokus auf Leistung statt Muskelerschöpfung" />
          </div>
        </Card>

        {/* 2. Umgekehrte lineare Periodisierung für Hypertrophie */}
        <Section num={2} title="Umgekehrte lineare Periodisierung – Hypertrophie" />
        <Card>
          <Bullet text="Intensität sinkt im Verlauf" />
          <Bullet text="Volumen steigt im Verlauf" />
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <SubTitle text="Reihenfolge" />
            <Steps items={["Schnellkraft", "Maximalkraft", "Hypertrophie"]} />
          </div>
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <SubTitle text="Maximalkraftphase" />
            <Table rows={[
              { label: "Sätze", value: "3–4" },
              { label: "Wiederholungen", value: "2–6" },
              { label: "Intensität", value: "Hoch" },
              { label: "Volumen", value: "Mittel bis hoch" },
            ]} />
            <Bullet text="Aufbau maximaler Kraft" />
            <Bullet text="Vorbereitung auf hohe Volumenphasen" />
          </div>
        </Card>

        {/* 3. Umgekehrte lineare Periodisierung für Kraftausdauer */}
        <Section num={3} title="Umgekehrte lineare Periodisierung – Kraftausdauer" />
        <Card>
          <SubTitle text="Reihenfolge" />
          <Steps items={["Maximalkraft", "Hypertrophie", "Kraftausdauer"]} />
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <SubTitle text="Maximalkraftphase" />
            <Table rows={[
              { label: "Sätze", value: "3–4" },
              { label: "Wiederholungen", value: "2–6" },
              { label: "Intensität", value: "Hoch" },
              { label: "Volumen", value: "Mittel" },
            ]} />
            <Bullet text="Kraftbasis für spätere Kraftausdauer aufbauen" />
          </div>
        </Card>

        {/* 4. Mikrozyklusschema */}
        <Section num={4} title="Mikrozyklusschema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Jede Woche hat einen eigenen Schwerpunkt – die Belastung variiert gezielt innerhalb des Zyklus.
          </p>
          <SubTitle text="Maximalkraft-Woche" />
          <Table rows={[
            { label: "Gewicht", value: "Mittel bis schwer" },
            { label: "Wiederholungen", value: "4–6" },
          ]} />
          <Bullet text="Kraftsteigerung & höhere Intensität" />
          <Bullet text="Vorbereitung auf Schnellkraft" />
        </Card>

        {/* 5. Wellenförmige Workouts */}
        <Section num={5} title="Wellenförmige Workouts" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Mehrere Trainingsformen wechseln innerhalb einer Woche — so werden verschiedene Systeme gleichzeitig trainiert.
          </p>
          <SubTitle text="Maximalkraft-Workout" />
          <Table rows={[
            { label: "Sätze", value: "3–5" },
            { label: "Wiederholungen", value: "2–4" },
            { label: "Satzpause", value: "4–5 min" },
          ]} />
          <Bullet text="Sehr hohe Intensität, Fokus Nervensystem" />
          <Bullet text="Schwere Gewichte, maximale Leistung pro Satz" />
        </Card>

        {/* 6. Pendelschema */}
        <Section num={6} title="Pendelschema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Regelmäßiger Wechsel zwischen Hypertrophie, Kraft und Schnellkraft — verhindert Plateaus und gibt einzelnen Systemen Erholung.
          </p>
          <SubTitle text="Kraftphase" />
          <Table rows={[
            { label: "Gewicht", value: "Mittel / Schwer" },
            { label: "Wiederholungen", value: "6–8" },
          ]} />
          <Bullet text="Kraftsteigerung" />
          <Bullet text="Vermeidung von Plateaus" />
          <Bullet text="Erholung einzelner Systeme durch Belastungswechsel" />
        </Card>

        {/* 7. Powerliftingzyklus */}
        <Section num={7} title="Powerliftingzyklus" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Progressive Intensitätssteigerung über 10 Wochen — Woche für Woche steigt das Gewicht, während die Wiederholungen sinken. Ziel ist das Erreichen der maximalen Leistung zum richtigen Zeitpunkt.
          </p>
          <SubTitle text="Wochenverlauf" />
          <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
            {/* Header */}
            <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
              <p className="text-[11px] font-bold text-gray-400 w-14">Woche</p>
              <p className="text-[11px] font-bold text-gray-400 w-16">%1RM</p>
              <p className="text-[11px] font-bold text-gray-400 w-12">Wdh</p>
              <p className="text-[11px] font-bold text-gray-400">Sätze</p>
            </div>
            {[
              ["1", "55 %", "5", "5"],
              ["2", "60 %", "5", "5"],
              ["3", "65 %", "5", "5"],
              ["4", "70 %", "5", "5"],
              ["5", "75 %", "5", "5"],
              ["6", "85 %", "3", "3"],
              ["7", "90 %", "3", "3"],
              ["8", "95 %", "3", "3"],
              ["9", "95 %", "2", "2"],
              ["10", "100 %", "2", "2"],
            ].map(([w, pct, reps, sets], i, arr) => (
              <div key={i} className="flex px-3 py-2.5 items-center"
                style={{
                  borderBottom: i < arr.length - 1 ? "1px solid #1e1e1e" : "none",
                  background: pct === "100 %" ? `${COLOR}18` : "transparent",
                }}>
                <p className="text-sm text-gray-300 w-14">{w}</p>
                <p className="text-sm font-bold w-16" style={{ color: parseFloat(pct) >= 90 ? COLOR : "#fff" }}>{pct}</p>
                <p className="text-sm text-gray-300 w-12">{reps}</p>
                <p className="text-sm text-gray-300">{sets}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl px-3 py-2.5 mb-3" style={{ background: `${COLOR}15`, border: `1px solid ${COLOR}33` }}>
            <p className="text-xs font-bold mb-1" style={{ color: COLOR }}>Woche 11</p>
            <p className="text-sm text-gray-300">Aktive Pause / Testphase</p>
          </div>
          <SubTitle text="Ziel" />
          <Bullet text="Maximalkraft-Peaking zum richtigen Zeitpunkt" />
          <Bullet text="Wettkampfvorbereitung" />
          <Bullet text="Systematische, messbare Kraftsteigerung" />
        </Card>

        <div className="mb-6" />
      </div>
    </div>
  );
}

// ── HypertrophiePeriodisierungScreen ──────────────────────────────────────────
function HypertrophiePeriodisierungScreen({ onBack }: { onBack: () => void }) {
  const COLOR = GREEN;

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
            Start mit hohem Volumen und geringer Intensität — im Verlauf steigt die Intensität, während das Volumen abnimmt.
          </p>
          <SubTitle text="Hypertrophiephase" />
          <Table rows={[
            { label: "Sätze", value: "3–5" },
            { label: "Wiederholungen", value: "8–12" },
            { label: "Intensität", value: "Gering" },
            { label: "Volumen", value: "Sehr hoch" },
            { label: "Pause", value: "1–2 min" },
          ]} />
          <SubTitle text="Ziel" />
          <Bullet text="Muskelaufbau & Erhöhung des Muskelquerschnitts" />
          <Bullet text="Hoher metabolischer Stress" />
        </Card>

        {/* 2 */}
        <Section num={2} title="Umgekehrte lineare Periodisierung – Hypertrophie" />
        <Card>
          <Bullet text="Intensität sinkt im Verlauf" />
          <Bullet text="Volumen steigt im Verlauf" />
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <SubTitle text="Reihenfolge" />
            <Steps items={["Schnellkraft", "Maximalkraft", "Hypertrophie"]} />
          </div>
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <SubTitle text="Hypertrophiephase" />
            <Table rows={[
              { label: "Sätze", value: "3–6" },
              { label: "Wiederholungen", value: "8–12" },
              { label: "Intensität", value: "Gering" },
              { label: "Volumen", value: "Hoch" },
            ]} />
            <Bullet text="Maximaler Muskelaufbau" />
            <Bullet text="Hohe Trainingsdichte" />
          </div>
        </Card>

        {/* 3 */}
        <Section num={3} title="Umgekehrte lineare Periodisierung – Kraftausdauer" />
        <Card>
          <SubTitle text="Reihenfolge" />
          <Steps items={["Maximalkraft", "Hypertrophie", "Kraftausdauer"]} />
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <SubTitle text="Hypertrophiephase" />
            <Table rows={[
              { label: "Sätze", value: "3–6" },
              { label: "Wiederholungen", value: "8–12" },
              { label: "Intensität", value: "Gering" },
              { label: "Volumen", value: "Hoch" },
            ]} />
            <Bullet text="Muskelmasseaufbau" />
            <Bullet text="Vorbereitung auf Kraftausdauerphase" />
          </div>
        </Card>

        {/* 4 */}
        <Section num={4} title="Mikrozyklusschema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Jede Woche hat einen eigenen Schwerpunkt. Die Hypertrophie-Woche fokussiert mittlere Intensität mit höherem Volumen.
          </p>
          <SubTitle text="Hypertrophie-Woche" />
          <Table rows={[
            { label: "Gewicht", value: "Mittel" },
            { label: "Wiederholungen", value: "8–12" },
          ]} />
          <Bullet text="Muskelwachstum & höheres Volumen" />
          <Bullet text="Mittlere Intensität als Basis" />
        </Card>

        {/* 5 */}
        <Section num={5} title="Kombiniertes lineares & umgekehrt lineares Schema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Grundübungen werden linear periodisiert (Gewicht ↑, Wiederholungen ↓), Isolationsübungen umgekehrt (Gewicht ↓, Wiederholungen ↑).
          </p>
          <SubTitle text="Verbundübungen – Linear" />
          <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
            <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
              <p className="text-[11px] font-bold text-gray-400 flex-1">Mikrozyklus</p>
              <p className="text-[11px] font-bold text-gray-400">Wdh.</p>
            </div>
            {[["1 / 4", "9–11"], ["2 / 5", "6–8"], ["3 / 6", "3–5"]].map(([mk, wdh], i) => (
              <div key={i} className="flex px-3 py-2.5 items-center"
                style={{ borderBottom: i < 2 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                <p className="text-sm text-gray-300 flex-1">{mk}</p>
                <p className="text-sm font-bold text-white">{wdh}</p>
              </div>
            ))}
          </div>
          <SubTitle text="Isolationsübungen – Umgekehrt linear" />
          <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
            <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
              <p className="text-[11px] font-bold text-gray-400 flex-1">Mikrozyklus</p>
              <p className="text-[11px] font-bold text-gray-400">Wdh.</p>
            </div>
            {[["1 / 4", "12–15"], ["2 / 5", "16–20"], ["3 / 6", "21–30"]].map(([mk, wdh], i) => (
              <div key={i} className="flex px-3 py-2.5 items-center"
                style={{ borderBottom: i < 2 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                <p className="text-sm text-gray-300 flex-1">{mk}</p>
                <p className="text-sm font-bold text-white">{wdh}</p>
              </div>
            ))}
          </div>
          <SubTitle text="Ziel" />
          <Bullet text="Muskelaufbau & gleichzeitige Kraftentwicklung" />
          <Bullet text="Kombination aus schweren Grundübungen und metabolischem Isolationstraining" />
        </Card>

        {/* 6 */}
        <Section num={6} title="Wellenförmige Workouts" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Mehrere Trainingsformen wechseln innerhalb einer Woche. Das Hypertrophie-Workout steht dabei im Mittelpunkt des Zyklus.
          </p>
          <SubTitle text="Hypertrophie-Workout" />
          <Table rows={[
            { label: "Sätze", value: "3–4" },
            { label: "Wiederholungen", value: "8–12" },
            { label: "Satzpause", value: "2–3 min" },
          ]} />
          <Bullet text="Mittlere Intensität, hohes Volumen" />
          <Bullet text="Hoher metabolischer Stress" />
        </Card>

        {/* 7 */}
        <Section num={7} title="Pendelschema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Regelmäßiger Wechsel zwischen Hypertrophie, Kraft und Schnellkraft — verhindert Plateaus und hält den Reiz variabel.
          </p>
          <SubTitle text="Hypertrophiephase" />
          <Table rows={[
            { label: "Gewicht", value: "Mittel" },
            { label: "Wiederholungen", value: "8–12" },
          ]} />
          <Bullet text="Muskelwachstum" />
          <Bullet text="Regelmäßiger Belastungswechsel & Plateaureduktion" />
        </Card>

        {/* 8 */}
        <Section num={8} title="Linearer Massezyklus" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Abwechselnd schwere und leichte Tage mit verschiedenen Muskelgruppen und variablen Pausen — maximaler Muskelaufbau durch hohe Trainingsfrequenz.
          </p>
          <SubTitle text="Typische Parameter" />
          <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
            <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
              <p className="text-[11px] font-bold text-gray-400 flex-1">Muskelgruppe</p>
              <p className="text-[11px] font-bold text-gray-400 w-14 text-center">Wdh.</p>
              <p className="text-[11px] font-bold text-gray-400 w-10 text-center">Sätze</p>
              <p className="text-[11px] font-bold text-gray-400 w-16 text-right">Pause</p>
            </div>
            {[
              ["Brust / Schultern / Trizeps", "8–10", "3", "2–3 min"],
              ["Rücken / Bizeps", "12–15", "3", "<1–2 min"],
              ["Beine", "8–10", "3", "3–4 min"],
            ].map(([mg, wdh, sets, pause], i) => (
              <div key={i} className="flex px-3 py-2.5 items-center"
                style={{ borderBottom: i < 2 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                <p className="text-xs text-gray-300 flex-1">{mg}</p>
                <p className="text-xs font-bold text-white w-14 text-center">{wdh}</p>
                <p className="text-xs text-gray-300 w-10 text-center">{sets}</p>
                <p className="text-xs text-gray-400 w-16 text-right">{pause}</p>
              </div>
            ))}
          </div>
          <Bullet text="Maximaler Muskelaufbau durch hohe Frequenz" />
          <Bullet text="Variation der Belastung für anhaltenden Wachstumsreiz" />
        </Card>

        <div className="mb-6" />
      </div>
    </div>
  );
}

// ── KraftausdauerPeriodisierungScreen ─────────────────────────────────────────
function KraftausdauerPeriodisierungScreen({ onBack }: { onBack: () => void }) {
  const COLOR = BLUE;

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
            ⚡ KRAFTAUSDAUER – PERIODISIERUNG
          </p>
          <p className="text-xs text-gray-500 mt-0.5">6 Modelle im Überblick</p>
        </div>
      </div>

      <div className="px-4">

        {/* 1 */}
        <Section num={1} title="Allgemeines Kraftausdauertraining" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Das Fundament der Kraftausdauer — viele Wiederholungen, leichte Gewichte, kurze Pausen. Der Muskel wird auf Dauerleistung trainiert, nicht auf maximale Kraft.
          </p>
          <Table rows={[
            { label: "Wiederholungen", value: "20+" },
            { label: "Intensität", value: "Sehr gering" },
            { label: "Gewicht", value: "20RM+" },
            { label: "Sätze", value: "3–6" },
            { label: "Pause", value: "30–60 sek" },
            { label: "Volumen", value: "Sehr hoch" },
          ]} />
          <SubTitle text="Ziel" />
          <Bullet text="Ermüdungsresistenz & längere Leistungsfähigkeit" />
          <Bullet text="Lokale muskuläre Ausdauer" />
        </Card>

        {/* 2 */}
        <Section num={2} title="Umgekehrte lineare Periodisierung – Kraftausdauer" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Die Intensität sinkt über die Phasen hinweg, während das Volumen steigt. Die Kraftausdauer steht am Ende des Zyklus als Höhepunkt.
          </p>
          <SubTitle text="Reihenfolge" />
          <Steps items={["Maximalkraft", "Hypertrophie", "Kraftausdauer"]} />
          <div style={{ borderTop: "1px solid #1e1e1e" }} className="mt-3 pt-3">
            <SubTitle text="Kraftausdauerphase" />
            <Table rows={[
              { label: "Sätze", value: "3–6" },
              { label: "Wiederholungen", value: "15–30" },
              { label: "Intensität", value: "Sehr gering" },
              { label: "Volumen", value: "Sehr hoch" },
            ]} />
            <Bullet text="Hohe Ermüdungsresistenz" />
            <Bullet text="Stoffwechselanpassung" />
          </div>
        </Card>

        {/* 3 */}
        <Section num={3} title="Mikrozyklusschema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Jede Woche hat einen eigenen Schwerpunkt. Die Kraftausdauer-Woche dient als Grundlagenbelastung und Vorbereitung für intensivere Phasen.
          </p>
          <SubTitle text="Kraftausdauer-Woche" />
          <Table rows={[
            { label: "Gewicht", value: "Leicht" },
            { label: "Wiederholungen", value: "12–15" },
          ]} />
          <Bullet text="Stoffwechseltraining & Grundlagenbelastung" />
          <Bullet text="Vorbereitung für höhere Intensitäten" />
        </Card>

        {/* 4 */}
        <Section num={4} title="Kombiniertes lineares & umgekehrt lineares Schema" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Isolationsübungen werden umgekehrt linear periodisiert — das Gewicht sinkt, die Wiederholungen steigen. So entsteht im Verlauf des Zyklus immer mehr metabolische Belastung.
          </p>
          <SubTitle text="Isolationsübungen – Umgekehrt linear" />
          <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
            <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
              <p className="text-[11px] font-bold text-gray-400 flex-1">Mikrozyklus</p>
              <p className="text-[11px] font-bold text-gray-400">Wdh.</p>
            </div>
            {[["1 / 4", "12–15"], ["2 / 5", "16–20"], ["3 / 6", "21–30"]].map(([mk, wdh], i) => (
              <div key={i} className="flex px-3 py-2.5 items-center"
                style={{ borderBottom: i < 2 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                <p className="text-sm text-gray-300 flex-1">{mk}</p>
                <p className="text-sm font-bold text-white">{wdh}</p>
              </div>
            ))}
          </div>
          <Bullet text="Steigendes Volumen, sinkende Intensität" />
          <Bullet text="Hohe metabolische Belastung am Ende des Zyklus" />
        </Card>

        {/* 5 */}
        <Section num={5} title="Wellenförmige Workouts" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Verschiedene Trainingsformen wechseln innerhalb einer Woche. Das Kraftausdauer-Workout zeichnet sich durch kurze Pausen und hohes Volumen aus.
          </p>
          <SubTitle text="Kraftausdauer-Workout" />
          <Table rows={[
            { label: "Sätze", value: "3–4" },
            { label: "Wiederholungen", value: "15–30" },
            { label: "Satzpause", value: "1–2 min" },
          ]} />
          <Bullet text="Kurze Pausen, hohe Ermüdung" />
          <Bullet text="Geringere Gewichte, hohes Volumen" />
        </Card>

        {/* 6 */}
        <Section num={6} title="Linearer Massezyklus" />
        <Card>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            Auch im Massezyklus entstehen durch hohe Wiederholungszahlen und kurze Pausen kraftausdauerspezifische Reize — besonders bei Rücken/Bizeps mit 12–15 Wdh. und unter einer Minute Pause.
          </p>
          <div className="rounded-xl overflow-hidden mb-3" style={{ border: "1px solid #1e1e1e" }}>
            <div className="flex px-3 py-2" style={{ background: "#1a1a1a", borderBottom: "1px solid #1e1e1e" }}>
              <p className="text-[11px] font-bold text-gray-400 flex-1">Muskelgruppe</p>
              <p className="text-[11px] font-bold text-gray-400 w-14 text-center">Wdh.</p>
              <p className="text-[11px] font-bold text-gray-400 w-16 text-right">Pause</p>
            </div>
            {[
              ["Rücken / Bizeps", "12–15", "<1 min"],
              ["Brust / Schultern / Trizeps", "12–15", "1–2 min"],
            ].map(([mg, wdh, pause], i) => (
              <div key={i} className="flex px-3 py-2.5 items-center"
                style={{ borderBottom: i < 1 ? "1px solid #1e1e1e" : "none", background: "#111" }}>
                <p className="text-xs text-gray-300 flex-1">{mg}</p>
                <p className="text-xs font-bold text-white w-14 text-center">{wdh}</p>
                <p className="text-xs text-gray-400 w-16 text-right">{pause}</p>
              </div>
            ))}
          </div>
          <Bullet text="Lokale muskuläre Ausdauer & metabolischer Stress" />
          <Bullet text="Erhöhte Trainingskapazität" />
        </Card>

        <div className="mb-6" />
      </div>
    </div>
  );
}
