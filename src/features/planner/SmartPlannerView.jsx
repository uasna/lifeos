import { memo, useMemo } from "react";
import { Clock }          from "lucide-react";
import { T_FONT, T_COLOR } from "@tokens/index.js";
import { useAdaptiveUX }   from "@hooks/useAdaptiveUX.js";
import { AdaptiveSurface } from "@shared/AdaptiveSurface.jsx";
import { PanelBoundary }   from "@shared/primitives.jsx";
import { useAppData, useAppUI } from "@state/contexts.js";
import { getScheduleBlocks }    from "@state/selectors.js";
import { DevLogger }       from "@runtime/logger.js";

// ─── PlannerTimeline ─────────────────────────────────────────────────────
const PlannerTimeline = memo(({ blocks, spacing, tokens, accentColor, emphasis }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: `${spacing.blockGap}px` }}>
    {blocks.map(b => (
      <div key={b.id} style={{
        display:         "flex",
        alignItems:      "center",
        gap:             "14px",
        padding:         `${spacing.rowPad}px`,
        backgroundColor: "rgba(255,255,255,0.02)",
        border:          `1px solid rgba(51,65,85,${emphasis.borderOpacity})`,
        borderRadius:    "8px",
        transition:      `all ${tokens.transitionMs}ms ease`,
        minHeight:       "52px",
        overflow:        "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <Clock size={13} style={{ color: accentColor }} />
          <span style={{ fontSize: "11px", fontWeight: 700, fontFamily: T_FONT.display, color: accentColor }}>{b.duration}M</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.title}</div>
          <div style={{ fontSize: "11px", color: T_COLOR.textMuted, marginTop: "2px", opacity: emphasis.mutedOpacity }}>{b.type}</div>
        </div>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: b.completed ? "#34d399" : "#fb923c", flexShrink: 0 }} />
      </div>
    ))}
  </div>
));
PlannerTimeline.displayName = "PlannerTimeline";

// ─── SmartPlannerView (panel root) ───────────────────────────────────────
export const SmartPlannerView = memo(() => {
  DevLogger.trackRender("SmartPlannerView");

  const { persistent } = useAppData();
  const { ui }         = useAppUI();

  const dayIdx   = ui.plannerSelectedDay ?? 0;
  const swimDays = persistent?.planner?.swimDays || [];

  const currentBlocks = useMemo(() => {
    const sd = getScheduleBlocks(dayIdx, swimDays);
    return sd.main || [...(sd.morning || []), ...(sd.afternoon || [])];
  }, [dayIdx, swimDays]);

  const ux = useAdaptiveUX(persistent, currentBlocks);
  const { spacing, tokens, accentColor, emphasis } = ux;

  return (
    <PanelBoundary panelId="planner">
      <AdaptiveSurface persistent={persistent} currentBlocks={currentBlocks} />
      <div style={{
        backgroundColor: T_COLOR.surface,
        border:          `1px solid rgba(51,65,85,${emphasis.borderOpacity})`,
        borderRadius:    "12px",
        padding:         `${spacing.cardPad}px`,
        transition:      `padding ${tokens.transitionMs}ms ease`,
        overflow:        "hidden",
      }}>
        <h3 style={{ fontSize: "14px", fontFamily: T_FONT.display, fontWeight: 700, marginBottom: "4px", letterSpacing: "0.5px" }}>
          LÍNEA TEMPORAL DINÁMICA
        </h3>
        <p style={{ color: T_COLOR.textMuted, fontSize: "12px", marginBottom: `${spacing.blockGap}px`, opacity: emphasis.mutedOpacity }}>
          Simulador y organizador cibernético de densidades operativas
        </p>
        <PlannerTimeline blocks={currentBlocks} spacing={spacing} tokens={tokens} accentColor={accentColor} emphasis={emphasis} />
      </div>
    </PanelBoundary>
  );
});
SmartPlannerView.displayName = "SmartPlannerView";