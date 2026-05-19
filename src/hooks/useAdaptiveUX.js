// MODULE_BOUNDARY: hooks/
// EXTRACTION_SAFE — zero AppContext reads, zero state mutations
//
// MEMO_CONTRACT:
//   deps: [persistent, currentBlocks]
//   ⚠ currentBlocks MUST be a stable useMemo ref at every call site.
//     Callers that rebuild the array on every render without memoizing
//     will cause this hook to re-run on every render.
//
// RETURN CONTRACT:
//   Frozen object — primitive values safe for shallow prop equality.
//
// CYCLIC_RISK: none
import { useMemo } from "react";
import { AdaptiveEngine }        from "@engines/adaptive.engine.js";
import {
  AdaptiveUXEngine,
  CognitiveLoadUX,
  MomentumUXLayer,
  TemporalAmbientSystem,
} from "@adaptive-ui/ux.engine.js";

export function useAdaptiveUX(persistent, currentBlocks) {
  return useMemo(() => {
    const intel        = AdaptiveEngine.analyze(persistent, currentBlocks);
    const tokens       = AdaptiveUXEngine.deriveTokens(intel);
    const spacing      = CognitiveLoadUX.spacing(tokens);
    const emphasis     = CognitiveLoadUX.emphasis(tokens);
    const accentColor  = MomentumUXLayer.accentColor(tokens);
    const bgAmbient    = MomentumUXLayer.backgroundAmbient(tokens);
    const temporal     = TemporalAmbientSystem.derive();
    const filteredRecs = MomentumUXLayer.filteredRecommendations(tokens, intel?.recommendations);
    const visInsights  = MomentumUXLayer.visibleInsights(tokens, intel?.insights);
    return Object.freeze({
      tokens, spacing, emphasis, accentColor, bgAmbient,
      temporal, filteredRecs, visInsights, intel,
    });
  }, [persistent, currentBlocks]);
}