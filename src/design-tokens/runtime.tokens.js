// MODULE_BOUNDARY: design-tokens/runtime
// EXTRACTION_SAFE — canonical source for spacing, timing, emphasis, ambient values.
// CognitiveLoadUX.spacing() multiplies these by gapMultiplier.
export const RT_TOKENS = Object.freeze({
  spacing: Object.freeze({
    blockGap:     10,
    sectionGap:   24,
    cardPad:      16,
    rowPad:       12,
    marginBottom: 24,
  }),
  interaction: Object.freeze({
    transitionStandard: 220,  // NOMINAL + STRAINED tiers
    transitionCalm:     400,  // OVERLOADED + RECOVERY tiers
    debounceAutosave:  1200,  // persistence write debounce window
  }),
  emphasis: Object.freeze({
    surfaceFull:       1.00,
    surfaceRecovery:   0.88,
    surfaceCompressed: 0.58,
    mutedNominal:      0.65,
    mutedRecovery:     0.72,
    mutedOverloaded:   0.52,
  }),
  ambient: Object.freeze({
    overload: "rgba(248, 113, 113, 0.025)",
    recovery: "rgba(52, 211, 153, 0.028)",
    strained: "rgba(251, 191, 36, 0.018)",
    nominal:  "transparent",
  }),
});