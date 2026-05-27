import { useState } from "react";
import { F, ORANGE, COPPER, COPPER_L, SURF, SURF2, BORDER, GREEN, RED, BORDER2, CARD } from "../../styles/tokens";
import { useHistoryStore } from "../../stores/historyStore";
import { useStatsStore } from "../../stores/statsStore";
import type { WorkoutRecord, ExerciseRecord } from "../../stores/historyStore";
import { fmtVolume, fmtDuration } from "../../lib/format";
import { saveHistory } from "../../lib/syncService";

export function WorkoutDetailModal({ workout, onClose }: {
  workout: WorkoutRecord;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditLabel, setShowEditLabel] = useState(false);
  const [editLabelDraft, setEditLabelDraft] = useState(workout.dayLabel);
  const [editMode, setEditMode] = useState(false);
  const [editedExercises, setEditedExercises] = useState<ExerciseRecord[]>(workout.exercises);
  const deleteWorkout = useHistoryStore(s => s.deleteWorkout);
  const updateWorkoutLabel = useHistoryStore(s => s.updateWorkoutLabel);
  const updateWorkoutExercises = useHistoryStore(s => s.updateWorkoutExercises);

  function handleDelete() {
    deleteWorkout(workout.id);
    // Sync deletion to Supabase
    const h = useHistoryStore.getState();
    saveHistory(h.workouts, h.personalRecords).catch(e =>
      console.warn("[WorkoutDetailModal] saveHistory fehlgeschlagen:", e)
    );
    onClose();
  }

  function handleSaveLabel() {
    if (editLabelDraft.trim()) {
      updateWorkoutLabel(workout.id, editLabelDraft.trim());
      // Sync label update to Supabase
      const h = useHistoryStore.getState();
      saveHistory(h.workouts, h.personalRecords).catch(e =>
        console.warn("[WorkoutDetailModal] saveHistory fehlgeschlagen:", e)
      );
    }
    setShowEditLabel(false);
  }

  function handleSaveExercises() {
    updateWorkoutExercises(workout.id, editedExercises);
    // Sync exercise edits to Supabase
    const h = useHistoryStore.getState();
    saveHistory(h.workouts, h.personalRecords).catch(e =>
      console.warn("[WorkoutDetailModal] saveHistory fehlgeschlagen:", e)
    );
    setEditMode(false);
  }

  function updateSet(exIdx: number, setIdx: number, field: "weight" | "reps", delta: number) {
    setEditedExercises(prev => prev.map((ex, i) => {
      if (i !== exIdx) return ex;
      const newSets = ex.sets.map((s, si) => {
        if (si !== setIdx) return s;
        const val = Math.max(0, (s[field] ?? 0) + delta);
        return { ...s, [field]: val };
      });
      const volume = newSets.reduce((a, s) => a + s.weight * s.reps, 0);
      const bestSet = newSets.reduce((b, s) => s.weight > b.weight ? s : b, newSets[0]);
      return { ...ex, sets: newSets, volume, bestSet };
    }));
  }

  function addSet(exIdx: number) {
    setEditedExercises(prev => prev.map((ex, i) => {
      if (i !== exIdx) return ex;
      const lastSet = ex.sets[ex.sets.length - 1] ?? { weight: 0, reps: 8 };
      const newSets = [...ex.sets, { ...lastSet }];
      const volume = newSets.reduce((a, s) => a + s.weight * s.reps, 0);
      return { ...ex, sets: newSets, volume };
    }));
  }

  function removeSet(exIdx: number, setIdx: number) {
    setEditedExercises(prev => prev.map((ex, i) => {
      if (i !== exIdx) return ex;
      if (ex.sets.length <= 1) return ex;
      const newSets = ex.sets.filter((_, si) => si !== setIdx);
      const volume = newSets.reduce((a, s) => a + s.weight * s.reps, 0);
      return { ...ex, sets: newSets, volume };
    }));
  }

  function removeExercise(exIdx: number) {
    setEditedExercises(prev => prev.filter((_, i) => i !== exIdx));
  }

  return (
    <div className="fixed inset-0 z-[55] flex flex-col" style={{ background: "#080808" }}>
      <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: `${BORDER}` }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 22 }}>←</button>
        <div className="text-center">
          <p className="font-black text-lg text-white" style={{ fontFamily: F }}>{workout.dayLabel.toUpperCase()}</p>
          <p className="text-xs text-gray-500">{workout.date}</p>
        </div>
        {/* Actions menu */}
        <div className="flex gap-2">
          <button onClick={() => setEditMode(e => !e)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: editMode ? `${COPPER}33` : `${COPPER}18`, color: COPPER_L, border: `1px solid ${COPPER}${editMode ? "88" : "44"}` }}>
            {editMode ? "✓ Fertig" : "✏️ Bearbeiten"}
          </button>
          <button onClick={() => setShowDeleteConfirm(true)}
            className="px-2 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: "#ef444418", color: "#ef4444", border: "1px solid #ef444433" }}>
            🗑️
          </button>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.92)" }}>
          <div className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-4"
            style={{ background: "#141414", border: "1px solid #2a2a2a" }}>
            <div className="text-center">
              <p className="text-3xl mb-2">🗑️</p>
              <p className="font-black italic text-xl text-white mb-1" style={{ fontFamily: F }}>WORKOUT LÖSCHEN?</p>
              <p className="text-sm text-gray-400">Das kann nicht rückgängig gemacht werden.</p>
            </div>
            <button onClick={handleDelete}
              className="w-full py-4 rounded-2xl font-black text-base"
              style={{ background: "#ef4444", color: "#fff", fontFamily: F }}>
              JA, LÖSCHEN
            </button>
            <button onClick={() => setShowDeleteConfirm(false)}
              className="w-full py-3 rounded-2xl font-black text-sm"
              style={{ background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a", fontFamily: F }}>
              ABBRECHEN
            </button>
          </div>
        </div>
      )}

      {/* Edit Label Modal */}
      {showEditLabel && (
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.92)" }}>
          <div className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-4"
            style={{ background: "#141414", border: "1px solid #2a2a2a" }}>
            <p className="font-black italic text-xl text-white" style={{ fontFamily: F }}>WORKOUT UMBENENNEN</p>
            <input
              value={editLabelDraft}
              onChange={e => setEditLabelDraft(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-white font-bold text-base"
              style={{ background: "#1a1a1a", border: `1px solid ${COPPER}44`, outline: "none", fontFamily: F }}
              autoFocus
            />
            <button onClick={handleSaveLabel}
              className="w-full py-4 rounded-2xl font-black text-base text-white"
              style={{ background: `linear-gradient(135deg, #b8660a 0%, #e8a050 40%, #cd7f32 100%)`, fontFamily: F }}>
              SPEICHERN
            </button>
            <button onClick={() => setShowEditLabel(false)}
              className="w-full py-3 rounded-2xl font-black text-sm"
              style={{ background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a", fontFamily: F }}>
              ABBRECHEN
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 pb-10">
        <div className="grid grid-cols-3 gap-3 my-4">
          {[
            {
              label: "ZEIT", value: fmtDuration(workout.durationSeconds),
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="13" r="8" stroke={COPPER_L} strokeWidth="1.5"/>
                  <path d="M12 9v4l2.5 2.5" stroke={COPPER_L} strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M9 2h6M12 2v3" stroke={COPPER_L} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
            },
            {
              label: "VOLUMEN", value: fmtVolume(workout.totalVolume),
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <polyline points="3,17 8,12 12,15 17,8 21,11" stroke={COPPER_L} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="17,8 21,8 21,12" stroke={COPPER_L} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
            },
            {
              label: "SÄTZE", value: String(workout.totalSets),
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={COPPER_L} strokeWidth="1.5"/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={COPPER_L} strokeWidth="1.5"/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={COPPER_L} strokeWidth="1.5"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={COPPER_L} strokeWidth="1.5"/>
                </svg>
              ),
            },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center flex flex-col items-center"
              style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
              <div className="mb-1.5">{s.icon}</div>
              <p className="font-black text-xl text-white" style={{ fontFamily: F }}>{s.value}</p>
              <p className="text-[9px] text-gray-500 tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-black italic text-base text-white" style={{ fontFamily: F }}>ÜBUNGEN</p>
          {editMode && (
            <button onClick={handleSaveExercises}
              className="px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: `linear-gradient(135deg, #b8660a 0%, #e8a050 40%, #cd7f32 100%)`, color: "#fff", fontFamily: F }}>
              SPEICHERN
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {(editMode ? editedExercises : workout.exercises).map((ex, i) => (
            <div key={i} className="rounded-2xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${expanded === i ? COPPER+"55" : BORDER}` }}>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left"
                style={{ background: "none", border: "none" }}
                onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: `${COPPER}22`, color: COPPER_L, fontFamily: F }}>{i+1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-white truncate" style={{ fontFamily: F }}>{ex.name}</p>
                  <p className="text-xs text-gray-500">{ex.sets.length} Sätze · {fmtVolume(ex.volume)}</p>
                </div>
                {ex.isPR && !editMode && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-black"
                    style={{ background: `linear-gradient(135deg, ${COPPER} 0%, ${COPPER_L} 100%)`, color: "#fff", fontFamily: F }}>PR</span>
                )}
                {editMode
                  ? <button onClick={e => { e.stopPropagation(); removeExercise(i); }}
                      className="text-red-400 text-base px-1" style={{ background: "none", border: "none" }}>✕</button>
                  : <span className="text-[10px]">{expanded === i ? "∧" : "∨"}</span>
                }
              </button>
              {expanded === i && (
                <div className="px-4 pb-3 border-t" style={{ borderColor: `${BORDER}` }}>
                  {ex.sets.map((set, si) => (
                    <div key={si} className="flex items-center gap-2 py-2 border-b" style={{ borderColor: `${BORDER}` }}>
                      <span className="text-[10px] text-gray-500 w-10">Satz {si+1}</span>
                      {editMode ? (
                        <>
                          {/* Weight stepper */}
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateSet(i, si, "weight", -2.5)}
                              className="w-6 h-6 rounded-full text-sm font-bold" style={{ background: "#1e1e1e", color: COPPER_L, border: "none" }}>−</button>
                            <span className="text-xs text-white font-bold w-14 text-center">{set.weight > 0 ? `${set.weight}kg` : "BW"}</span>
                            <button onClick={() => updateSet(i, si, "weight", 2.5)}
                              className="w-6 h-6 rounded-full text-sm font-bold" style={{ background: "#1e1e1e", color: COPPER_L, border: "none" }}>+</button>
                          </div>
                          <span className="text-gray-600 text-xs">×</span>
                          {/* Reps stepper */}
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateSet(i, si, "reps", -1)}
                              className="w-6 h-6 rounded-full text-sm font-bold" style={{ background: "#1e1e1e", color: COPPER_L, border: "none" }}>−</button>
                            <span className="text-xs text-white font-bold w-8 text-center">{set.reps} Wdh</span>
                            <button onClick={() => updateSet(i, si, "reps", 1)}
                              className="w-6 h-6 rounded-full text-sm font-bold" style={{ background: "#1e1e1e", color: COPPER_L, border: "none" }}>+</button>
                          </div>
                          <button onClick={() => removeSet(i, si)}
                            className="ml-auto text-red-400 text-xs" style={{ background: "none", border: "none" }}>✕</button>
                        </>
                      ) : (
                        <span className="text-sm text-white font-bold">
                          {set.weight > 0 ? `${set.weight} kg` : "BW"} × {set.reps} Wdh
                        </span>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button onClick={() => addSet(i)}
                      className="w-full mt-2 py-2 rounded-xl text-xs font-bold"
                      style={{ background: "#111", color: COPPER_L, border: `1px dashed ${COPPER}44` }}>
                      + Satz hinzufügen
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export function GoalPicker({ current, onClose }: { current: number; onClose: () => void }) {
  const setWeeklyGoal = useStatsStore(s => s.setWeeklyGoal);
  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.88)" }}>
      <div className="w-full rounded-t-3xl p-6" style={{ background: `linear-gradient(135deg, ${SURF} 0%, ${SURF2} 100%)`, border: `1px solid ${BORDER}` }}>
        <p className="font-black italic text-xl text-white mb-4" style={{ fontFamily: F }}>
          WOCHENZIEL FESTLEGEN
        </p>
        <div className="grid grid-cols-7 gap-2 mb-5">
          {[1,2,3,4,5,6,7].map(n => (
            <button key={n} onClick={() => { setWeeklyGoal(n); onClose(); }}
              className="py-3 rounded-xl font-black text-lg"
              style={{
                fontFamily: F,
                background: current === n ? `linear-gradient(135deg, ${COPPER} 0%, ${COPPER_L} 100%)` : SURF2,
                color: current === n ? "#fff" : "#888",
                border: `1px solid ${current === n ? COPPER_L : BORDER}`,
              }}>{n}</button>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl font-black text-white"
          style={{ background: "#2a2a2a", fontFamily: F, border: "none" }}>SCHLIESSEN</button>
      </div>
    </div>
  );
}

