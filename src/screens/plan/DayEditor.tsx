/**
 * DayEditor – bearbeitbarer Trainingstag im Plan-Creator
 * Mit aufklappbarer Satz/Wiederholungs-Konfiguration pro Übung
 */

import { useState, memo } from "react";
import type { CustomWorkoutDay } from "../../stores/planStore";
import type { PlanExercise }     from "../../data/plan_2er_split";
import { ExercisePickerModal }   from "./ExercisePicker";
import { F, ORANGE, COPPER, COPPER_L, COPPER_G, SURF, SURF2, BORDER, CARD, CARD2, BORDER2, GREEN, RED, BG } from "../../styles/tokens";


// ── Einzelne Übungszeile mit aufklappbarer Satz-Konfiguration ─────────────────
function ExerciseRow({
  ex,
  index,
  onChange,
  onDelete,
}: {
  ex:       PlanExercise;
  index:    number;
  onChange: (updated: PlanExercise) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  function updateReps(setIndex: number, delta: number) {
    const newSets = ex.sets.map((s, i) =>
      i === setIndex ? { reps: Math.max(1, s.reps + delta) } : s
    );
    onChange({ ...ex, sets: newSets });
  }

  function setRepsDirectly(setIndex: number, val: string) {
    const num = parseInt(val);
    if (isNaN(num) || num < 1) return;
    const newSets = ex.sets.map((s, i) =>
      i === setIndex ? { reps: Math.min(100, num) } : s
    );
    onChange({ ...ex, sets: newSets });
  }

  function addSet() {
    const lastReps = ex.sets[ex.sets.length - 1]?.reps ?? 8;
    onChange({ ...ex, sets: [...ex.sets, { reps: lastReps }] });
  }

  function removeSet() {
    if (ex.sets.length <= 1) return;
    onChange({ ...ex, sets: ex.sets.slice(0, -1) });
  }

  // Zusammenfassung z.B. "3×8" oder "2×8 · 1×6"
  const summary = (() => {
    const groups: { reps: number; count: number }[] = [];
    ex.sets.forEach(s => {
      const last = groups[groups.length - 1];
      if (last && last.reps === s.reps) last.count++;
      else groups.push({ reps: s.reps, count: 1 });
    });
    return groups.map(g => `${g.count}×${g.reps}`).join(" · ");
  })();

  return (
    <div className="border-b" style={{ borderColor: "#1a1a1a" }}>

      {/* Übungszeile – tippen zum Aufklappen */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        style={{ background: "none", border: "none" }}
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-gray-600 text-sm w-5 flex-shrink-0">{index + 1}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-bold truncate">{ex.name}</p>
          <p className="text-xs mt-0.5" style={{ color: ORANGE }}>{summary}</p>
        </div>
        <span className="text-gray-600 text-xs mr-1">{open ? "▲" : "▼"}</span>
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          style={{ background: "none", border: "none", color: "#ef4444", fontSize: 16, padding: "4px" }}>
          ✕
        </button>
      </button>

      {/* Aufgeklappte Satz-Konfiguration */}
      {open && (
        <div className="px-4 pb-3" style={{ background: `${SURF}` }}>

          {/* Sätze */}
          <div className="flex flex-col gap-2 mb-3 pt-2">
            {ex.sets.map((s, si) => (
              <div key={si} className="flex items-center gap-3">
                <p className="text-xs text-gray-500 w-12 flex-shrink-0"
                  style={{ fontFamily: F }}>
                  SATZ {si + 1}
                </p>
                {/* − Button */}
                <button
                  onClick={() => updateReps(si, -1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0"
                  style={{ background: `${SURF2}`, border: "none", color: "#fff" }}>
                  −
                </button>
                {/* Wdh-Eingabe */}
                <input
                  type="number"
                  value={s.reps}
                  onChange={e => setRepsDirectly(si, e.target.value)}
                  className="text-center font-black text-white outline-none rounded-xl"
                  style={{
                    background: `${SURF2}`,
                    border: `1px solid ${COPPER_L}44`,
                    width: 52, height: 32,
                    fontFamily: F, fontSize: 16,
                  }}
                  min={1} max={100}
                />
                {/* + Button */}
                <button
                  onClick={() => updateReps(si, 1)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0"
                  style={{ background: `${SURF2}`, border: "none", color: "#fff" }}>
                  +
                </button>
                <p className="text-xs text-gray-600">Wdh</p>
              </div>
            ))}
          </div>

          {/* Satz hinzufügen / entfernen */}
          <div className="flex gap-2">
            <button
              onClick={removeSet}
              disabled={ex.sets.length <= 1}
              className="flex-1 py-2 rounded-xl font-black text-xs"
              style={{
                fontFamily: F,
                background: ex.sets.length <= 1 ? "#111" : "#1e1e1e",
                border: "none",
                color: ex.sets.length <= 1 ? "#333" : "#ef4444",
              }}>
              − SATZ
            </button>
            <button
              onClick={addSet}
              className="flex-1 py-2 rounded-xl font-black text-xs"
              style={{ fontFamily: F, background: `${SURF2}`, border: "none", color: ORANGE }}>
              + SATZ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── DayEditor ─────────────────────────────────────────────────────────────────
export const DayEditor = memo(function DayEditor({
  day,
  onChange,
  onDelete,
}: {
  day:      CustomWorkoutDay;
  onChange: (d: CustomWorkoutDay) => void;
  onDelete: () => void;
}) {
  const [showPicker, setShowPicker] = useState(false);

  function updateExercise(i: number, updated: PlanExercise) {
    onChange({ ...day, exercises: day.exercises.map((e, j) => j === i ? updated : e) });
  }

  function deleteExercise(i: number) {
    onChange({ ...day, exercises: day.exercises.filter((_, j) => j !== i) });
  }

  return (
    <div className="rounded-2xl overflow-hidden mb-3" style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
      {showPicker && (
        <ExercisePickerModal
          onClose={() => setShowPicker(false)}
          onAdd={ex => { onChange({ ...day, exercises: [...day.exercises, ex] }); setShowPicker(false); }}
        />
      )}

      {/* Tag-Name */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "#1e1e1e" }}>
        <input
          value={day.label}
          onChange={e => onChange({ ...day, label: e.target.value })}
          className="flex-1 bg-transparent outline-none font-black text-white"
          style={{ fontFamily: F, border: "none", fontSize: 16 }}
          placeholder="Tag-Name..."
        />
        <button onClick={onDelete} style={{ background: "none", border: "none", color: "#ef4444", fontSize: 16 }}>
          🗑
        </button>
      </div>

      {/* Übungsliste */}
      {day.exercises.map((ex, i) => (
        <ExerciseRow
          key={i}
          ex={ex}
          index={i}
          onChange={updated => updateExercise(i, updated)}
          onDelete={() => deleteExercise(i)}
        />
      ))}

      <button
        onClick={() => setShowPicker(true)}
        className="w-full py-3 text-center font-black text-xs"
        style={{ background: "none", border: "none", color: ORANGE, fontFamily: F }}>
        + ÜBUNG HINZUFÜGEN
      </button>
    </div>
  );
});
