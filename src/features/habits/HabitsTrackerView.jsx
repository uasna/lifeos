// ISOLATION: AppDataContext only — zero rerenders from UI state mutations.
import { memo, useCallback } from "react";
import { T_FONT, T_COLOR }   from "@tokens/index.js";
import { PanelBoundary }     from "@shared/primitives.jsx";
import { useAppData }        from "@state/contexts.js";
import { AC }                from "@state/actions.js";

const TARGET_DATE = "2026-05-15"; // domain-scoped constant

const HabitRow = memo(({ habit, targetDate, onToggle }) => {
  const checked = !!habit.history[targetDate];
  return (
    <div
      onClick={() => onToggle(habit.id, targetDate)}
      style={{
        display:         "flex",
        justifyContent:  "space-between",
        alignItems:      "center",
        padding:         "14px 16px",
        backgroundColor: "rgba(255,255,255,0.01)",
        border:          `1px solid ${T_COLOR.border}`,
        borderRadius:    "8px",
        cursor:          "pointer",
        transition:      "all 0.2s ease",
        minHeight:       "52px", // WCAG touch target
        gap:             "12px",
      }}
    >
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {habit.name}
        </span>
        <span style={{
          fontSize:        "10px",
          padding:         "2px 6px",
          borderRadius:    "4px",
          backgroundColor: "rgba(255,255,255,0.05)",
          color:           T_COLOR.textMuted,
          flexShrink:      0,
        }}>{habit.category}</span>
      </div>
      <div style={{
        width:           "20px",
        height:          "20px",
        borderRadius:    "4px",
        border:          `2px solid ${checked ? T_COLOR.accent : "#475569"}`,
        backgroundColor: checked ? T_COLOR.accent : "transparent",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        flexShrink:      0,
        transition:      "all 0.2s ease",
      }}>
        {checked && <div style={{ width: "8px", height: "8px", backgroundColor: "#020617", borderRadius: "1px" }} />}
      </div>
    </div>
  );
});
HabitRow.displayName = "HabitRow";

export const HabitsTrackerView = memo(() => {
  const { persistent, persistentDispatch } = useAppData();

  const handleToggle = useCallback((id, date) => {
    persistentDispatch(AC.toggleHabit(id, date));
  }, [persistentDispatch]);

  return (
    <PanelBoundary panelId="habits">
      <div style={{ backgroundColor: T_COLOR.surface, border: `1px solid ${T_COLOR.border}`, borderRadius: "12px", padding: "20px", overflow: "hidden" }}>
        <h3 style={{ fontSize: "13px", fontFamily: T_FONT.display, fontWeight: 700, marginBottom: "4px", letterSpacing: "0.5px" }}>
          REGISTRO OPERATIVO DE HÁBITOS
        </h3>
        <p style={{ color: T_COLOR.textMuted, fontSize: "12px", marginBottom: "16px" }}>
          Evaluación y conmutación binaria de comportamientos rutinarios
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {persistent.habits.map(h => (
            <HabitRow key={h.id} habit={h} targetDate={TARGET_DATE} onToggle={handleToggle} />
          ))}
        </div>
      </div>
    </PanelBoundary>
  );
});
HabitsTrackerView.displayName = "HabitsTrackerView";