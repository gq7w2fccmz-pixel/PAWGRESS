/**
 * DayEditor – bearbeitbarer Trainingstag im Plan-Creator
 * Ausgelagert aus PlanScreen.tsx
 */

import { useState, memo } from "react";
import type { CustomWorkoutDay } from "../../stores/planStore";
import { ExercisePickerModal }   from "./ExercisePicker";

const F      = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

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

  return (
    <div className="rounded-2xl overflow-hidden mb-3" style={{ background:"#111", border:"1px solid #1e1e1e" }}>
      {showPicker && (
        <ExercisePickerModal
          onClose={() => setShowPicker(false)}
          onAdd={ex => { onChange({ ...day, exercises: [...day.exercises, ex] }); setShowPicker(false); }}
        />
      )}

      {/* Tag-Name */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor:"#1e1e1e" }}>
        <input
          value={day.label}
          onChange={e => onChange({ ...day, label: e.target.value })}
          className="flex-1 bg-transparent outline-none font-black text-white text-sm"
          style={{ fontFamily:F, border:"none" }}
          placeholder="Tag-Name..."
        />
        <button onClick={onDelete} style={{ background:"none", border:"none", color:"#ef4444", fontSize:16 }}>🗑</button>
      </div>

      {/* Übungsliste */}
      {day.exercises.map((ex, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b" style={{ borderColor:"#1a1a1a" }}>
          <span className="text-gray-600 text-sm w-5">{i + 1}</span>
          <p className="flex-1 text-sm text-white truncate">{ex.name}</p>
          <button
            onClick={() => onChange({ ...day, exercises: day.exercises.filter((_, j) => j !== i) })}
            style={{ background:"none", border:"none", color:"#ef4444", fontSize:14 }}>
            ✕
          </button>
        </div>
      ))}

      <button
        onClick={() => setShowPicker(true)}
        className="w-full py-2.5 text-center text-xs font-black"
        style={{ background:"none", border:"none", color:ORANGE, fontFamily:F }}>
        + ÜBUNG HINZUFÜGEN
      </button>
    </div>
  );
});
