import { memo } from "react";

// ─── BlockTypeBadge ──────────────────────────────────────────────────────
// Presentational atom — no context, no engines.
export const BlockTypeBadge = memo(({ type, accentColor }) => (
  <span style={{
    fontSize:        "9px",
    padding:         "2px 6px",
    borderRadius:    "4px",
    fontWeight:      700,
    backgroundColor: type === "FOCUS" ? `${accentColor}28` : "rgba(148,163,184,0.1)",
    color:           type === "FOCUS" ? accentColor         : "#94a3b8",
    flexShrink:      0,
  }}>{type}</span>
));
BlockTypeBadge.displayName = "BlockTypeBadge";

// ─── PanelBoundary ───────────────────────────────────────────────────────
// Zero-cost extraction seam — no-op today.
// When React.lazy / route splitting / Suspense lands, wrap content here
// without touching feature internals.
export const PanelBoundary = memo(({ children, panelId }) => (
  <div
    data-panel={panelId}
    style={{ width: "100%", height: "100%", overflow: "hidden", minWidth: 0 }}
  >
    {children}
  </div>
));
PanelBoundary.displayName = "PanelBoundary";