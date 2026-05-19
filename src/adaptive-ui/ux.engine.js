// MODULE_BOUNDARY: adaptive-ui/ux-engine
// PURE — maps intel → tokens → spacing/emphasis/accent/ambient
// DEPENDENCIES: @tokens/runtime.tokens.js
import { RT_TOKENS } from "@tokens/runtime.tokens.js";

// ─── AdaptiveUXEngine::TokenDerivation ──────────────────────────────────
// Maps behavioral intel → UX token set (loadTier, density, rhythm, gaps)
export const AdaptiveUXEngine = Object.freeze({
  deriveTokens(intel) {
    const pacing   = intel?.pacing;
    const behavior = intel?.behavior;
    const debt     = pacing?.recoveryDebt           ?? 0;
    const sustain  = pacing?.sustainablePacingIndex  ?? 100;
    const entropy  = behavior?.entropyScore          ?? 0;
    const trend    = behavior?.momentumTrend         ?? "STABLE_MOMENTUM";
    const strain   = pacing?.highStrainClustering    ?? 0;

    const loadTier = (debt > 60 || sustain < 35)   ? "OVERLOADED"
      : (debt > 35 || strain > 65)                  ? "STRAINED"
      : (debt < 15 && entropy < 30)                 ? "RECOVERY"
      :                                               "NOMINAL";

    const density = {
      OVERLOADED: "COMPRESSED", STRAINED: "STANDARD",
      NOMINAL:    "STANDARD",   RECOVERY: "EXPANDED",
    }[loadTier];

    const rhythm = ({
      STABLE_MOMENTUM: "STANDARD", BURNOUT_RISK: "CALM",
      INCONSISTENCY_SPIRAL: "CALM", INITIALIZING: "STANDARD",
    })[trend] ?? "STANDARD";

    const gapMultiplier    = { COMPRESSED: 0.72, STANDARD: 1.0, EXPANDED: 1.38 }[density] ?? 1.0;
    const surfaceIntensity = loadTier === "OVERLOADED" ? 0.58 : loadTier === "RECOVERY" ? 0.88 : 1.0;
    const transitionMs     = rhythm === "CALM"
      ? RT_TOKENS.interaction.transitionCalm
      : RT_TOKENS.interaction.transitionStandard;

    return Object.freeze({
      loadTier, density, rhythm, gapMultiplier, surfaceIntensity, transitionMs,
      entropyScore: entropy, momentumTrend: trend,
      isOverloaded: loadTier === "OVERLOADED",
      isRecovery:   loadTier === "RECOVERY",
      isStrained:   loadTier === "STRAINED",
    });
  },
});

// ─── AdaptiveUXEngine::CognitiveLoad ────────────────────────────────────
// Maps UX tokens → concrete CSS spacing + emphasis values
export const CognitiveLoadUX = Object.freeze({
  spacing(tokens) {
    const g = tokens?.gapMultiplier ?? 1;
    return Object.freeze({
      blockGap:     Math.round(RT_TOKENS.spacing.blockGap     * g),
      sectionGap:   Math.round(RT_TOKENS.spacing.sectionGap   * g),
      cardPad:      Math.round(RT_TOKENS.spacing.cardPad      * g),
      rowPad:       Math.round(RT_TOKENS.spacing.rowPad       * g),
      marginBottom: Math.round(RT_TOKENS.spacing.marginBottom * g),
    });
  },
  emphasis(tokens) {
    return Object.freeze({
      mutedOpacity: tokens?.isOverloaded ? RT_TOKENS.emphasis.mutedOverloaded
        : tokens?.isRecovery ? RT_TOKENS.emphasis.mutedRecovery
        : RT_TOKENS.emphasis.mutedNominal,
      borderOpacity: tokens?.surfaceIntensity ?? 1.0,
    });
  },
});

// ─── AdaptiveUXEngine::MomentumLayer ────────────────────────────────────
// Derives accent color, bg ambient, rec + insight filtering
export const MomentumUXLayer = Object.freeze({
  accentColor(tokens) {
    if (tokens?.isOverloaded || tokens?.momentumTrend === "BURNOUT_RISK") return "#7c5cd6";
    if (tokens?.isRecovery)                                                return "#34d399";
    if (tokens?.isStrained)                                                return "#a78bfa";
    return "#8b5cf6";
  },
  backgroundAmbient(tokens) {
    if (tokens?.isOverloaded) return RT_TOKENS.ambient.overload;
    if (tokens?.isRecovery)   return RT_TOKENS.ambient.recovery;
    if (tokens?.isStrained)   return RT_TOKENS.ambient.strained;
    return RT_TOKENS.ambient.nominal;
  },
  filteredRecommendations(tokens, recommendations) {
    if (!Array.isArray(recommendations)) return [];
    if (tokens?.isOverloaded) return recommendations.filter(r => r.severity === "CRITICAL");
    if (tokens?.isRecovery)   return [];
    return recommendations;
  },
  visibleInsights(tokens, insights) {
    if (!Array.isArray(insights) || insights.length === 0) return insights ?? [];
    if (tokens?.isOverloaded) return insights.slice(0, 1); // cognitive compression
    return insights;
  },
});

// ─── AdaptiveUXEngine::TemporalAmbient ──────────────────────────────────
// Time-of-day contrast + warmth phase derivation
// PURE: reads Date() — deterministic per-call
export const TemporalAmbientSystem = Object.freeze({
  derive() {
    const h = new Date().getHours();
    if (h >= 21 || h < 6)  return Object.freeze({ phase: "NIGHT",    contrastMod: 0.82, warmth: "rgba(180,140,80,0.018)"  });
    if (h < 10)             return Object.freeze({ phase: "MORNING",  contrastMod: 0.93, warmth: "rgba(110,220,160,0.014)" });
    if (h < 17)             return Object.freeze({ phase: "PEAK",     contrastMod: 1.0,  warmth: "transparent"             });
    return                         Object.freeze({ phase: "WINDDOWN", contrastMod: 0.90, warmth: "rgba(240,130,60,0.020)"  });
  },
});