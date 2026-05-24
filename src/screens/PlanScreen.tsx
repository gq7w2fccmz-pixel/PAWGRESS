/**
 * PlanScreen – schlanke Hauptkomponente
 * Sub-Screens ausgelagert nach:
 *   ./plan/ExercisePicker.tsx
 *   ./plan/DayEditor.tsx
 *   ./plan/PlanSubScreens.tsx
 */

import { useState } from "react";
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

const F      = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

// ── Main PlanScreen ────────────────────────────────────────────────────────────
export function PlanScreen() {
  const navigate      = useNavigate();
  const stats         = useStatsStore(s => s.stats);
  const weeklyGoal    = useStatsStore(s => s.weeklyGoal);
  const weeklyWorkouts = stats.weeklyWorkouts;
  const setWeeklyGoal = useStatsStore(s => s.setWeeklyGoal);

  const plans        = usePlanStore(s => s.plans);
  const workouts     = usePlanStore(s => s.workouts);
  const activePlanId = usePlanStore(s => s.activePlanId);
  const deletePlan   = usePlanStore(s => s.deletePlan);
  const duplicatePlan = usePlanStore(s => s.duplicatePlan);
  const activePlan   = plans.find(p => p.id === activePlanId) ?? plans[0];

  type SubScreen = null | "createPlan" | "createWorkout" | "allPlans" | "editWorkout";
  const [sub,               setSub]               = useState<SubScreen>(null);
  const [editWOId,          setEditWOId]          = useState<string | undefined>(undefined);
  const [showGoalEdit,      setShowGoalEdit]      = useState(false);
  const [dayDetail,         setDayDetail]         = useState<{ label:string; exercises:PlanExercise[]; color:string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sub-Screen routing
  if (sub === "createPlan")    return <PlanCreatorScreen   onBack={() => setSub(null)} />;
  if (sub === "createWorkout") return <WorkoutCreatorScreen onBack={() => setSub(null)} />;
  if (sub === "editWorkout" && editWOId)
    return <WorkoutCreatorScreen onBack={() => setSub(null)} existingId={editWOId} />;
  if (sub === "allPlans")
    return <AllPlansScreen onBack={() => setSub(null)}
      onEditWorkout={(id) => { setEditWOId(id); setSub("editWorkout"); }} />;
  if (dayDetail)
    return <DayDetailScreen day={dayDetail} color={dayDetail.color} onBack={() => setDayDetail(null)} />;

  const shownItems = [
    ...plans.slice(0, 3),
    ...workouts.slice(0, Math.max(0, 3 - plans.length)),
  ];
  const goal     = weeklyGoal ?? 4;
  const progress = Math.min(weeklyWorkouts / goal, 1);

  return (
    <div className="min-h-screen pb-28" style={{ background:"#080808", color:"#fff" }}>

      {/* Goal Edit Modal */}
      {showGoalEdit && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background:"rgba(0,0,0,0.88)" }}>
          <div className="w-full rounded-t-3xl p-6" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
            <p className="font-black italic text-xl text-white mb-1" style={{ fontFamily:F }}>WOCHENZIEL FESTLEGEN</p>
            <p className="text-xs text-gray-500 mb-4">Wie viele Workouts pro Woche?</p>
            <div className="grid grid-cols-7 gap-2 mb-5">
              {[1,2,3,4,5,6,7].map(n => (
                <button key={n} onClick={() => setWeeklyGoal(n)}
                  className="py-3 rounded-xl font-black text-lg"
                  style={{ fontFamily:F, background: goal===n ? ORANGE : "#1e1e1e",
                    color: goal===n ? "#fff" : "#888", border:`1px solid ${goal===n ? ORANGE : "#2a2a2a"}` }}>{n}</button>
              ))}
            </div>
            <button onClick={() => setShowGoalEdit(false)} className="w-full py-3 rounded-xl font-black"
              style={{ background:ORANGE, color:"#fff", fontFamily:F, border:"none" }}>FERTIG</button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background:"rgba(0,0,0,0.9)" }}>
          <div className="rounded-2xl p-6 w-full" style={{ background:"#111", border:"1px solid #ef4444" }}>
            <p className="font-black text-xl text-white mb-2" style={{ fontFamily:F }}>PLAN LÖSCHEN?</p>
            <p className="text-sm text-gray-400 mb-5">"{activePlan?.name}" wird dauerhaft gelöscht.</p>
            <button
              onClick={() => { if (activePlan) { deletePlan(activePlan.id); setShowDeleteConfirm(false); } }}
              className="w-full py-3 rounded-xl font-black text-white mb-2"
              style={{ background:"#ef4444", fontFamily:F, border:"none" }}>LÖSCHEN</button>
            <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-3 rounded-xl font-black"
              style={{ background:"#2a2a2a", color:"#fff", fontFamily:F, border:"none" }}>ABBRECHEN</button>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 260 }}>
        <img src="/images/plan_hero.webp" alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(8,8,8,0.92) 40%, rgba(8,8,8,0.5) 70%, rgba(8,8,8,0.1) 100%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, transparent 50%, rgba(8,8,8,1) 100%)",
        }} />
        <div className="relative z-10 px-4 pt-6">
          <p className="font-black italic leading-none text-white" style={{ fontFamily:F, fontSize:56 }}>PLAN</p>
        </div>
        <div className="absolute bottom-4 left-0 right-0 z-10 px-4">
          <p className="text-sm text-gray-300">Dein Training. Dein Ziel.</p>
          <p className="text-sm font-black" style={{ color:ORANGE }}>In Sekunden startbereit.</p>
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-5">

        {/* Create Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setSub("createPlan")}
            className="flex items-center gap-3 p-4 rounded-2xl text-left"
            style={{ background:"#111", border:"1px solid #1e1e1e", position:"relative", overflow:"hidden" }}>
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background:ORANGE }} />
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ml-2"
              style={{ background:`${ORANGE}18` }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="3" width="16" height="16" rx="3" stroke={ORANGE} strokeWidth="1.5"/>
                <line x1="11" y1="7" x2="11" y2="15" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="7" y1="11" x2="15" y2="11" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="font-black text-sm text-white leading-tight" style={{ fontFamily:F }}>TRAININGSPLAN{"\n"}ERSTELLEN</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Eigenen Plan anlegen</p>
            </div>
          </button>
          <button onClick={() => setSub("createWorkout")}
            className="flex items-center gap-3 p-4 rounded-2xl text-left"
            style={{ background:"#111", border:"1px solid #1e1e1e", position:"relative", overflow:"hidden" }}>
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background:ORANGE }} />
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ml-2"
              style={{ background:`${ORANGE}18` }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="1" y="9" width="3" height="4" rx="1" fill={ORANGE}/>
                <rect x="4" y="7" width="2" height="8" rx="1" fill={ORANGE}/>
                <rect x="6" y="10" width="10" height="2" rx="1" fill={ORANGE}/>
                <rect x="16" y="7" width="2" height="8" rx="1" fill={ORANGE}/>
                <rect x="18" y="9" width="3" height="4" rx="1" fill={ORANGE}/>
              </svg>
            </div>
            <div>
              <p className="font-black text-sm text-white leading-tight" style={{ fontFamily:F }}>WORKOUT{"\n"}ERSTELLEN</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Individuelles Workout</p>
            </div>
          </button>
        </div>

        {/* Meine Pläne */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black italic text-xl text-white" style={{ fontFamily:F }}>MEINE PLÄNE</p>
            <button onClick={() => setSub("allPlans")} className="text-xs font-bold"
              style={{ color:ORANGE, background:"none", border:"none" }}>Alle anzeigen ›</button>
          </div>
          <div className="flex flex-col gap-2.5">
            {shownItems.map((item: CustomPlan | StandaloneWorkout) => {
              const isPlan   = "days" in item;
              const plan     = item as CustomPlan;
              const wo       = item as StandaloneWorkout;
              const isActive = isPlan && plan.id === activePlanId;
              const color    = isPlan ? plan.color : ORANGE;
              const icon     = isPlan ? plan.icon : "💪";
              return (
                <button key={item.id}
                  onClick={() => isPlan && plan.days[0] &&
                    setDayDetail({ label:plan.days[0].label, exercises:plan.days[0].exercises, color })}
                  className="w-full text-left rounded-2xl overflow-hidden"
                  style={{ background:"#111", border:`1px solid ${isActive ? color+"55" : "#1e1e1e"}`,
                    padding:0, boxShadow: isActive ? `0 0 12px ${color}18` : "none" }}>
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background:`${color}18`, border:`1px solid ${color}33` }}>{icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="font-black text-base text-white" style={{ fontFamily:F }}>{item.name}</p>
                        {isActive && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black"
                            style={{ background:"#22c55e", color:"#fff", fontFamily:F }}>AKTIV</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{isPlan ? plan.desc : wo.desc}</p>
                      <p className="text-[10px] text-gray-600">
                        {isPlan ? `${plan.daysPerWeek} Tage/Woche · ${plan.focus}` : `${wo.exercises.length} Übungen`}
                      </p>
                    </div>
                    <span className="text-gray-600 text-xl flex-shrink-0">›</span>
                  </div>
                </button>
              );
            })}
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mt-2.5"
            style={{ background:"#0d0d0d", border:"1px solid #1e1e1e" }}>
            <span style={{ color:ORANGE, fontSize:18 }}>↑</span>
            <p className="font-black text-sm flex-1 text-left" style={{ color:ORANGE, fontFamily:F }}>NEUEN PLAN IMPORTIEREN</p>
            <span className="text-gray-600">›</span>
          </button>
        </div>

        {/* Schnellaktionen */}
        <div>
          <p className="font-black italic text-xl text-white mb-3" style={{ fontFamily:F }}>Schnellaktionen</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                svg: <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4 17.5V14L13.5 4.5L17 8L7.5 17.5H4Z" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round"/>
                  <line x1="11" y1="7" x2="15" y2="11" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>,
                label: "PLAN\nBEARBEITEN", action: () => setSub("createPlan"), color: "#3b82f6",
              },
              {
                svg: <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="3" y="5" width="13" height="15" rx="2" stroke={ORANGE} strokeWidth="1.5"/>
                  <rect x="6" y="2" width="13" height="15" rx="2" stroke={ORANGE} strokeWidth="1.5" strokeDasharray="3 2"/>
                  <line x1="7" y1="10" x2="13" y2="10" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="7" y1="13" x2="11" y2="13" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>,
                label: "PLAN\nDUPLIZIEREN", action: () => { if (activePlan) duplicatePlan(activePlan.id); }, color: ORANGE,
              },
              {
                svg: <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <polyline points="4,6 18,6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 6V4h6v2" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="6" y="8" width="10" height="11" rx="1.5" stroke="#ef4444" strokeWidth="1.5"/>
                  <line x1="9" y1="11" x2="9" y2="16" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="13" y1="11" x2="13" y2="16" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>,
                label: "PLAN\nLÖSCHEN", action: () => setShowDeleteConfirm(true), color: "#ef4444",
              },
              {
                svg: <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="13" width="4" height="7" rx="1" fill="#22c55e" fillOpacity="0.4"/>
                  <rect x="9" y="8" width="4" height="12" rx="1" fill="#22c55e" fillOpacity="0.7"/>
                  <rect x="16" y="3" width="4" height="17" rx="1" fill="#22c55e"/>
                </svg>,
                label: "PLAN\nSTATISTIKEN", action: () => navigate("/profil"), color: "#22c55e",
              },
            ].map((a, i) => (
              <button key={i} onClick={a.action}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl"
                style={{ background:"#111", border:"1px solid #1e1e1e" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background:`${a.color}18` }}>{a.svg}</div>
                <p className="font-black text-[9px] text-center text-white whitespace-pre-line leading-tight"
                  style={{ fontFamily:F }}>{a.label}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
