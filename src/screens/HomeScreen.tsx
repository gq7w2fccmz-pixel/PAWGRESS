import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PLAN_2ER_SPLIT } from "../data/plan_2er_split";
import { usePawgressStore } from "../hooks/usePawgressStore";
import { useHistoryStore } from "../stores/historyStore";
import { useStatsStore } from "../stores/statsStore";

const F = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";
const DAY_LABELS = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "GUTEN MORGEN,";
  if (h < 18) return "HALLO,";
  return "GUTEN ABEND,";
}

function fmtVolume(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace(".", ",")}t`;
  return `${Math.round(v)} kg`;
}

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  return `${m} Min`;
}

import type { WorkoutRecord } from "../stores/historyStore";

function WorkoutDetailModal({ workout, onClose }: {
  workout: WorkoutRecord;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#080808" }}>
      <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "#1e1e1e" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="text-center">
          <p className="font-black text-lg text-white" style={{ fontFamily: F }}>{workout.dayLabel.toUpperCase()}</p>
          <p className="text-xs text-gray-500">{workout.date}</p>
        </div>
        <div style={{ width: 28 }} />
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-10">
        <div className="grid grid-cols-3 gap-3 my-4">
          {[
            { label: "ZEIT",    value: fmtDuration(workout.durationSeconds), icon: "⏱" },
            { label: "VOLUMEN", value: fmtVolume(workout.totalVolume),        icon: "📊" },
            { label: "SÄTZE",   value: String(workout.totalSets),             icon: "🏋️" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center"
              style={{ background: "#111", border: "1px solid #1e1e1e" }}>
              <p className="text-lg mb-1">{s.icon}</p>
              <p className="font-black text-xl text-white" style={{ fontFamily: F }}>{s.value}</p>
              <p className="text-[9px] text-gray-500 tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="font-black italic text-base text-white mb-3" style={{ fontFamily: F }}>ÜBUNGEN</p>
        <div className="flex flex-col gap-2">
          {workout.exercises.map((ex, i) => (
            <div key={i} className="rounded-2xl overflow-hidden"
              style={{ background: "#111", border: `1px solid ${expanded === i ? ORANGE+"44" : "#1e1e1e"}` }}>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left"
                style={{ background: "none", border: "none" }}
                onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: `${ORANGE}22`, color: ORANGE, fontFamily: F }}>{i+1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-white truncate" style={{ fontFamily: F }}>{ex.name}</p>
                  <p className="text-xs text-gray-500">{ex.sets.length} Sätze · {fmtVolume(ex.volume)}</p>
                </div>
                {ex.isPR && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-black"
                    style={{ background: ORANGE, color: "#fff", fontFamily: F }}>PR</span>
                )}
                <span className="text-gray-600">{expanded === i ? "∧" : "∨"}</span>
              </button>
              {expanded === i && (
                <div className="px-4 pb-3 border-t" style={{ borderColor: "#1e1e1e" }}>
                  {ex.sets.map((set, si) => (
                    <div key={si} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: "#1a1a1a" }}>
                      <span className="text-xs text-gray-600 w-8">Satz {si+1}</span>
                      <span className="text-sm text-white font-bold">
                        {set.weight > 0 ? `${set.weight} kg` : "BW"} × {set.reps} Wdh
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalPicker({ current, onClose }: { current: number; onClose: () => void }) {
  const setWeeklyGoal = useStatsStore(s => s.setWeeklyGoal);
  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.88)" }}>
      <div className="w-full rounded-t-3xl p-6" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
        <p className="font-black italic text-xl text-white mb-4" style={{ fontFamily: F }}>
          WOCHENZIEL FESTLEGEN
        </p>
        <div className="grid grid-cols-7 gap-2 mb-5">
          {[1,2,3,4,5,6,7].map(n => (
            <button key={n} onClick={() => { setWeeklyGoal(n); onClose(); }}
              className="py-3 rounded-xl font-black text-lg"
              style={{
                fontFamily: F,
                background: current === n ? ORANGE : "#1e1e1e",
                color: current === n ? "#fff" : "#888",
                border: `1px solid ${current === n ? ORANGE : "#2a2a2a"}`,
              }}>{n}</button>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl font-black text-white"
          style={{ background: "#2a2a2a", fontFamily: F, border: "none" }}>SCHLIESSEN</button>
      </div>
    </div>
  );
}

export function HomeScreen() {
  const navigate = useNavigate();
  const { stats, weekDays, weeklyGoal, coachProgress } = usePawgressStore();
  const recentWorkouts = useHistoryStore(s => s.getRecentWorkouts)(1);
  const lastWorkout    = recentWorkouts[0] ?? null;

  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const [showWorkoutDetail, setShowWorkoutDetail] = useState(false);

  const dayIndex  = stats.totalWorkouts % 4;
  const nextDay   = PLAN_2ER_SPLIT[dayIndex];
  const streak    = coachProgress.currentStreak;
  const weekVol   = stats.weeklyVolume;
  const weekCount = stats.weeklyWorkouts;
  const goal      = weeklyGoal ?? 4;
  const volLabel  = fmtVolume(weekVol);

  const now = new Date();
  const todayDow = now.getDay();
  const mondayIdx = (todayDow === 0 ? 6 : todayDow - 1);

  return (
    <div className="min-h-screen pb-28" style={{ background: "#080808", color: "#fff" }}>

      {showGoalPicker && <GoalPicker current={goal} onClose={() => setShowGoalPicker(false)} />}
      {showWorkoutDetail && lastWorkout && (
        <WorkoutDetailModal workout={lastWorkout} onClose={() => setShowWorkoutDetail(false)} />
      )}

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: 300 }}>
        <img src="/images/home_hero.webp" alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center center" }} />
        {/* Left-to-right dark gradient so text is readable */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(8,8,8,0.92) 40%, rgba(8,8,8,0.55) 70%, rgba(8,8,8,0.1) 100%)",
        }} />
        {/* Bottom fade */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, transparent 55%, rgba(8,8,8,1) 100%)",
        }} />

        <div className="relative z-10 px-5 pt-6">
          <p className="text-xs tracking-widest font-bold uppercase" style={{ color: "rgba(255,255,255,0.45)", fontFamily: F }}>
            {greeting()}
          </p>
          <h1 className="font-black italic leading-none" style={{ fontFamily: F, fontSize: 52, color: "#fff" }}>
            CHAMPION
          </h1>
          <p className="text-sm italic mt-1" style={{ color: "#999" }}>
            no excuses, just <span style={{ color: ORANGE }}>pawgress</span>
          </p>
        </div>
      </div>

      <div className="px-4 -mt-2 flex flex-col gap-4">

        {/* ── NÄCHSTES TRAINING ── */}
        <div className="rounded-2xl p-4" style={{
          background: "#111",
          border: `1.5px solid ${ORANGE}66`,
          boxShadow: `0 0 20px ${ORANGE}18`,
        }}>
          <p className="font-black text-xs tracking-widest mb-2" style={{ color: ORANGE, fontFamily: F }}>
            NÄCHSTES TRAINING
          </p>
          <div className="flex items-start gap-3">
            {/* Left: title + subtitle + meta */}
            <div className="flex-1 min-w-0">
              <p className="font-black italic leading-none mb-1" style={{ fontFamily: F, fontSize: 40, color: "#fff" }}>
                {nextDay.label.toUpperCase()}
              </p>
              <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                {nextDay.tag === "PUSH" ? "Brust • Schultern • Trizeps" : "Rücken • Bizeps • Core"}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>⏱</span>
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>~60 Min</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ color: ORANGE, fontSize: 13 }}>🏆</span>
                  <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>{nextDay.exercises.length} Übungen</span>
                </div>
              </div>
            </div>
            {/* Right: buttons stacked */}
            <div className="flex flex-col gap-2 flex-shrink-0" style={{ minWidth: 148 }}>
              <button onClick={() => navigate("/training")}
                className="flex items-center justify-center gap-2 rounded-2xl font-black text-sm text-white"
                style={{
                  background: ORANGE,
                  fontFamily: F,
                  border: "none",
                  boxShadow: `0 0 16px ${ORANGE}55`,
                  padding: "14px 12px",
                  lineHeight: 1.2,
                }}>
                <svg viewBox="0 0 20 20" fill="white" width="16" height="16" style={{ flexShrink: 0 }}>
                  <polygon points="5,3 18,10 5,17"/>
                </svg>
                WORKOUT<br/>STARTEN
              </button>
              <button onClick={() => navigate("/plan")}
                className="rounded-2xl font-black text-xs text-white text-center"
                style={{
                  background: "transparent",
                  border: "1px solid #2a2a2a",
                  fontFamily: F,
                  padding: "10px 12px",
                }}>
                Details ansehen ›
              </button>
            </div>
          </div>
        </div>

        {/* ── DEIN WOCHENSTATUS ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
          <div className="px-4 pt-4 pb-3">
            <p className="font-black italic text-base text-white" style={{ fontFamily: F }}>DEIN WOCHENSTATUS</p>
          </div>

          <div className="grid grid-cols-3" style={{ borderTop: "1px solid #1e1e1e" }}>
            {/* Wochenziel */}
            <button onClick={() => setShowGoalPicker(true)}
              className="flex flex-col items-center py-4 px-2"
              style={{ background: "none", border: "none", borderRight: "1px solid #1e1e1e" }}>
              <span className="text-2xl mb-1">🎯</span>
              <p className="text-[9px] text-gray-500 tracking-widest font-bold mb-1">WOCHENZIEL</p>
              <p className="font-black text-2xl text-white" style={{ fontFamily: F }}>
                {weekCount} <span className="text-gray-500">/ {goal}</span>
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">Workouts</p>
            </button>

            {/* Streak */}
            <div className="flex flex-col items-center py-4 px-2"
              style={{ borderRight: "1px solid #1e1e1e" }}>
              <span className="text-2xl mb-1">🔥</span>
              <p className="text-[9px] text-gray-500 tracking-widest font-bold mb-1">STREAK</p>
              <p className="font-black text-2xl" style={{ fontFamily: F, color: ORANGE }}>{streak}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">Tage</p>
            </div>

            {/* Volumen */}
            <div className="flex flex-col items-center py-4 px-2">
              <span className="text-2xl mb-1">📊</span>
              <p className="text-[9px] text-gray-500 tracking-widest font-bold mb-1">VOLUMEN</p>
              <p className="font-black text-2xl text-white" style={{ fontFamily: F }}>{volLabel}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">vs. letzte Woche</p>
            </div>
          </div>

          {/* Week day dots */}
          <div className="flex items-center justify-around px-4 py-3 border-t" style={{ borderColor: "#1e1e1e" }}>
            {DAY_LABELS.map((d, i) => {
              const isToday = i === mondayIdx;
              const isDone  = weekDays[i];
              return (
                <div key={d} className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: isDone ? ORANGE : isToday ? "#1e1e1e" : "transparent",
                      border: `1.5px solid ${isDone ? ORANGE : isToday ? ORANGE : "#333"}`,
                    }}>
                    {isDone
                      ? <span className="text-white text-xs font-bold">✓</span>
                      : <span className="text-[10px] font-bold" style={{ color: isToday ? ORANGE : "#555" }}>{d}</span>
                    }
                  </div>
                  <p className="text-[8px]" style={{ color: isToday ? ORANGE : "#444" }}>{d}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── LETZTES WORKOUT ── */}
        <div className="rounded-2xl p-4" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
          <p className="font-black italic text-base text-white mb-3" style={{ fontFamily: F }}>LETZTES WORKOUT</p>
          {lastWorkout ? (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl"
                style={{ background: `${ORANGE}18`, border: `1px solid ${ORANGE}33` }}>
                {lastWorkout.dayTag === "PUSH" ? "🏋️" : "💪"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-lg text-white leading-tight" style={{ fontFamily: F }}>
                  {lastWorkout.dayLabel.toUpperCase()}
                </p>
                <p className="text-xs text-gray-400">
                  {lastWorkout.dayTag === "PUSH" ? "Brust · Schultern · Trizeps" : "Rücken · Bizeps · Core"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-600">Gestern</span>
                  <span className="text-gray-700 text-xs">·</span>
                  <span className="text-xs text-gray-600">{fmtDuration(lastWorkout.durationSeconds)}</span>
                  <span className="text-gray-700 text-xs">·</span>
                  <span className="text-xs text-gray-600">🏋️ {lastWorkout.exercises.length} Übungen</span>
                </div>
              </div>
              <button onClick={() => setShowWorkoutDetail(true)}
                className="px-4 py-2 rounded-xl font-black text-xs text-white flex-shrink-0 flex items-center gap-1"
                style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", fontFamily: F }}>
                Analysieren ›
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 py-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "#1e1e1e" }}>🏁</div>
              <div>
                <p className="text-sm text-white font-bold">Noch kein Workout absolviert</p>
                <p className="text-xs text-gray-500 mt-0.5">Starte dein erstes Training!</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
