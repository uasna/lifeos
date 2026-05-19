import { memo, useMemo }    from "react";
import { AdaptiveEngine }    from "@engines/adaptive.engine.js";
import { AdaptiveUXEngine, MomentumUXLayer, TemporalAmbientSystem } from "@adaptive-ui/ux.engine.js";
import { getScheduleBlocks } from "@state/selectors.js";

// NOT a context consumer — receives persistent as prop directly from root.
// HOOK_NOTE: derive() useMemo([]) — stable for component lifetime.
// bgAmbient useMemo([persistent, blocks]) — re-derives on persistent dispatch.
// Cost acceptable (pure engine calls). Profile before optimizing.
export const TemporalAmbientOverlay = memo(({ persistent }) => {
  const temporal  = useMemo(() => TemporalAmbientSystem.derive(), []);
  const swimDays  = persistent?.planner?.swimDays || [];
  const blocks    = useMemo(() => (getScheduleBlocks(0, swimDays).main) || [], [swimDays]);

  const bgAmbient = useMemo(() => {
    const intel  = AdaptiveEngine.analyze(persistent, blocks);
    const tokens = AdaptiveUXEngine.deriveTokens(intel);
    return MomentumUXLayer.backgroundAmbient(tokens);
  }, [persistent, blocks]);

  if (temporal.warmth === "transparent" && bgAmbient === "transparent") return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed", inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        background: temporal.warmth !== "transparent"
          ? `radial-gradient(ellipse at 50% 0%, ${temporal.warmth} 0%, transparent 65%)`
          : "none",
      }}
    >
      {bgAmbient !== "transparent" && (
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 80% 50%, ${bgAmbient} 0%, transparent 60%)`,
        }} />
      )}
    </div>
  );
});
TemporalAmbientOverlay.displayName = "TemporalAmbientOverlay";