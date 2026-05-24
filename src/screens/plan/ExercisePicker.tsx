/**
 * ExercisePicker – vollständige Übungsbibliothek mit Filter
 * Ausgelagert aus PlanScreen.tsx
 */

import { useState, useMemo, memo } from "react";
import type { PlanExercise } from "../../data/plan_2er_split";
import type { AreaExercise }  from "../../types";
import { BRUST_EXERCISES }    from "../../data/exercises_brust";
import { RUECKEN_EXERCISES }  from "../../data/exercises_ruecken";
import { SCHULTERN_EXERCISES } from "../../data/exercises_schultern";
import { ARME_EXERCISES }     from "../../data/exercises_arme";
import { BEINE_EXERCISES }    from "../../data/exercises_beine";
import { CORE_EXERCISES }     from "../../data/exercises_core";
import { CARDIO_EXERCISES }   from "../../data/exercises_cardio";

const F      = "'Barlow Condensed', sans-serif";
const ORANGE = "#f97316";

export const AREA_SOURCES: {
  key: string; label: string; color: string; exercises: AreaExercise[];
}[] = [
  { key: "BRUST",     label: "Brust",     color: "#ef4444", exercises: BRUST_EXERCISES },
  { key: "RUECKEN",   label: "Rücken",    color: "#3b82f6", exercises: RUECKEN_EXERCISES },
  { key: "BEINE",     label: "Beine",     color: "#22c55e", exercises: BEINE_EXERCISES },
  { key: "SCHULTERN", label: "Schultern", color: "#a855f7", exercises: SCHULTERN_EXERCISES },
  { key: "ARME",      label: "Arme",      color: "#f97316", exercises: ARME_EXERCISES },
  { key: "CORE",      label: "Core",      color: "#eab308", exercises: CORE_EXERCISES },
  { key: "CARDIO",    label: "Cardio",    color: "#06b6d4", exercises: CARDIO_EXERCISES },
];

export const LEVEL_COLORS: Record<string, string> = {
  "Anfänger":       "#22c55e",
  "Fortgeschritten":"#f97316",
  "Alle Level":     "#3b82f6",
};

const RISK_COLORS: Record<string, string> = {
  low: "#22c55e", medium: "#eab308", high: "#ef4444",
};

export function areaExToPlanEx(ex: AreaExercise): PlanExercise {
  const isCompound = ex.compound_isolation === "compound";
  const isCardio   = ex.movement_pattern === "cardio" || ex.movement_pattern === "conditioning";
  const reps = isCardio ? 1 : isCompound ? 8 : 12;
  const sets = isCardio ? 1 : 3;
  return { name: ex.name, sets: Array(sets).fill({ reps }) };
}

export const ExercisePickerModal = memo(function ExercisePickerModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd:   (ex: PlanExercise) => void;
}) {
  const [search,   setSearch]   = useState("");
  const [area,     setArea]     = useState("ALLE");
  const [level,    setLevel]    = useState("ALLE");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const seen   = new Set<string>();
    const result: { ex: AreaExercise; areaColor: string }[] = [];
    for (const src of AREA_SOURCES) {
      if (area !== "ALLE" && src.key !== area) continue;
      for (const ex of src.exercises) {
        if (seen.has(ex.name)) continue;
        seen.add(ex.name);
        if (level !== "ALLE" && ex.experience_level && ex.experience_level !== level) continue;
        if (search && !ex.name.toLowerCase().includes(search.toLowerCase()) &&
            !ex.sub?.toLowerCase().includes(search.toLowerCase())) continue;
        result.push({ ex, areaColor: src.color });
      }
    }
    return result;
  }, [search, area, level]);

  const LEVELS = ["ALLE", "Anfänger", "Fortgeschritten", "Alle Level"];
  const AREAS  = ["ALLE", ...AREA_SOURCES.map(a => a.key)];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: "rgba(0,0,0,0.97)" }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#1e1e1e" }}>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#fff", fontSize:22 }}>←</button>
        <p className="font-black italic text-xl text-white flex-1" style={{ fontFamily:F }}>ÜBUNG HINZUFÜGEN</p>
        <p className="text-xs text-gray-600">{filtered.length} Übungen</p>
      </div>

      {/* Suche */}
      <div className="px-4 py-3 border-b" style={{ borderColor:"#1e1e1e" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Übung suchen..." autoFocus
          className="w-full px-4 py-2.5 rounded-xl text-white outline-none text-sm"
          style={{ background:"#111", border:"1px solid #2a2a2a" }} />
      </div>

      {/* Bereich-Filter */}
      <div className="flex gap-2 px-4 py-2.5 overflow-x-auto border-b" style={{ borderColor:"#1e1e1e" }}>
        {AREAS.map(a => {
          const src    = AREA_SOURCES.find(s => s.key === a);
          const active = area === a;
          const color  = src?.color ?? ORANGE;
          return (
            <button key={a} onClick={() => setArea(a)}
              className="flex-shrink-0 px-3 py-1 rounded-full font-black text-[11px]"
              style={{
                fontFamily: F,
                background: active ? color : "#1a1a1a",
                color:      active ? "#fff" : "#888",
                border:     `1px solid ${active ? color : "#2a2a2a"}`,
              }}>
              {a === "ALLE" ? "ALLE" : src?.label ?? a}
            </button>
          );
        })}
      </div>

      {/* Level-Filter */}
      <div className="flex gap-2 px-4 py-2 border-b" style={{ borderColor:"#1e1e1e" }}>
        {LEVELS.map(l => {
          const active = level === l;
          const color  = l === "ALLE" ? "#888" : LEVEL_COLORS[l] ?? "#888";
          return (
            <button key={l} onClick={() => setLevel(l)}
              className="flex-shrink-0 px-3 py-1 rounded-full font-black text-[10px]"
              style={{
                fontFamily: F,
                background: active ? color + "33" : "transparent",
                color:      active ? color : "#555",
                border:     `1px solid ${active ? color : "#222"}`,
              }}>
              {l === "ALLE" ? "Alle Level" : l}
            </button>
          );
        })}
      </div>

      {/* Übungsliste */}
      <div className="flex-1 overflow-y-auto px-4 pb-10">
        {filtered.length === 0 ? (
          <p className="text-gray-600 text-sm text-center mt-10">Keine Übungen gefunden</p>
        ) : filtered.map(({ ex, areaColor }) => {
          const isOpen = expanded === ex.name;
          return (
            <div key={ex.name} className="border-b" style={{ borderColor:"#1a1a1a" }}>
              <div className="flex items-center gap-3 py-3">
                <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: areaColor }} />
                <button className="flex-1 min-w-0 text-left"
                  style={{ background:"none", border:"none" }}
                  onClick={() => setExpanded(isOpen ? null : ex.name)}>
                  <p className="font-bold text-sm text-white truncate">{ex.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <p className="text-xs text-gray-500 truncate">{ex.sub}</p>
                    {ex.experience_level && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          background: (LEVEL_COLORS[ex.experience_level] ?? "#888") + "22",
                          color:       LEVEL_COLORS[ex.experience_level] ?? "#888",
                        }}>
                        {ex.experience_level}
                      </span>
                    )}
                    {ex.injury_risk && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          background: (RISK_COLORS[ex.injury_risk] ?? "#888") + "22",
                          color:       RISK_COLORS[ex.injury_risk] ?? "#888",
                        }}>
                        {ex.injury_risk === "low" ? "🟢" : ex.injury_risk === "medium" ? "🟡" : "🔴"} Risiko
                      </span>
                    )}
                  </div>
                </button>
                <button onClick={() => onAdd(areaExToPlanEx(ex))}
                  className="px-3 py-1.5 rounded-xl font-black text-xs flex-shrink-0"
                  style={{ background:ORANGE, color:"#fff", fontFamily:F, border:"none" }}>
                  + ADD
                </button>
              </div>
              {isOpen && (
                <div className="pb-3 pl-4 flex flex-col gap-1.5">
                  {ex.primary && (
                    <p className="text-xs text-gray-400">
                      <span className="text-gray-600">Primär: </span>{ex.primary}
                    </p>
                  )}
                  {ex.secondary && (
                    <p className="text-xs text-gray-400">
                      <span className="text-gray-600">Sekundär: </span>{ex.secondary}
                    </p>
                  )}
                  {ex.compound_isolation && (
                    <p className="text-xs text-gray-500">
                      {ex.compound_isolation === "compound" ? "🏋️ Compound" : "🎯 Isolation"}
                      {ex.unilateral ? " · einseitig" : ""}
                    </p>
                  )}
                  {ex.cues && ex.cues.length > 0 && (
                    <p className="text-xs text-gray-600">
                      💡 {ex.cues.slice(0, 2).join(" · ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
