// ENGINE_SEGMENT: TelemetryEngine::BehaviorState
// PURE — no side effects, no imports
// INPUTS:  persistentState snapshot (reads xp.dailyLog, streak.count)
// OUTPUTS: frozen behavioral state object
export const BehaviorStateEngine = Object.freeze({
  calculateState(persistentState) {
    const dailyLog    = persistentState?.xp?.dailyLog || [];
    const streakCount = Number(persistentState?.streak?.count) || 0;

    if (dailyLog.length === 0) {
      return Object.freeze({
        entropyScore: 0, flags: Object.freeze(["NOMINAL"]),
        momentumTrend: "INITIALIZING", temporalAnomalies: Object.freeze([]),
      });
    }

    const last7Days  = dailyLog.slice(-7);
    const xpValues   = last7Days.map(d => Number(d.xp) || 0);
    const totalXp    = xpValues.reduce((a, b) => a + b, 0);
    const meanXp     = totalXp / (xpValues.length || 1);

    const streakInstability = streakCount < 2 && dailyLog.length > 7;
    const isDecaying        = xpValues.length >= 3
      && xpValues.slice(-3).every((v, idx, arr) => idx === 0 || v < arr[idx - 1]);

    const variance        = xpValues.reduce((s, v) => s + Math.pow(v - meanXp, 2), 0) / (xpValues.length || 1);
    const focusVolatility = Math.sqrt(variance);

    let sequenceBreaks = 0;
    for (let i = 1; i < xpValues.length; i++) {
      if (Math.abs(xpValues[i] - xpValues[i - 1]) > (meanXp * 0.7)) sequenceBreaks++;
    }
    const scheduleInconsistencyScore = Math.min(100, Math.round((sequenceBreaks / 6) * 100));

    const flags       = [];
    let momentumTrend = "STABLE_MOMENTUM";

    if (streakCount >= 3 && scheduleInconsistencyScore < 35) {
      flags.push("Momento estabilizado"); momentumTrend = "STABLE_MOMENTUM";
    }
    if (isDecaying || (meanXp < 100 && dailyLog.length > 5)) {
      flags.push("Riesgo de saturación cognitiva"); momentumTrend = "BURNOUT_RISK";
    }
    if (scheduleInconsistencyScore > 55) {
      flags.push("Espiral de inconsistencia activa"); momentumTrend = "INCONSISTENCY_SPIRAL";
    }

    const entropyScore = Math.min(100, Math.round(
      (scheduleInconsistencyScore * 0.4)
      + (focusVolatility > 120 ? 40 : focusVolatility * 0.33)
      + (streakInstability ? 20 : 0)
    ));

    return Object.freeze({
      entropyScore, flags: Object.freeze(flags), momentumTrend, temporalAnomalies: Object.freeze([]),
    });
  },
});