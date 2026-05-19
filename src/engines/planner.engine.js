// ENGINE_SEGMENT: PlannerEngine::RecoveryBalance
// PURE — no side effects, no state reads, no imports
// INPUTS:  blocks[] — array of schedule block objects
// OUTPUTS: frozen metrics object — safe for useMemo deps
export const RecoveryBalanceEngine = Object.freeze({
  calculateMetrics(blocks = []) {
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return Object.freeze({
        recoveryDebt: 0, decompressionSpacing: 0, mentalLoadBalance: 50,
        highStrainClustering: 0, recoveryEfficiency: 100, sustainablePacingIndex: 100,
        insights: Object.freeze([]),
      });
    }

    let focusMins = 0, recoveryMins = 0, bufferMins = 0, physicalMins = 0, totalMins = 0;
    let gapDurations = [], currentFocusCluster = 0, maxFocusCluster = 0, currentGap = 0;

    blocks.forEach((b) => {
      const duration = Number(b.duration) || 0;
      totalMins += duration;
      if (b.type === "FOCUS" || b.type === "CREATIVE" || b.type === "SKILL") {
        focusMins += duration;
        currentFocusCluster += duration;
        if (currentFocusCluster > maxFocusCluster) maxFocusCluster = currentFocusCluster;
        if (currentGap > 0) { gapDurations.push(currentGap); currentGap = 0; }
      } else if (b.type === "RECOVERY") {
        recoveryMins += duration; currentFocusCluster = 0; currentGap += duration;
      } else if (b.type === "BUFFER") {
        bufferMins += duration; currentFocusCluster = 0; currentGap += duration * 0.5;
      } else if (b.type === "PHYSICAL") {
        physicalMins += duration; currentFocusCluster = 0;
      }
    });

    const targetRecovery   = (focusMins / 60) * 25;
    const recoveryDebt     = targetRecovery === 0 ? 0
      : Math.max(0, Math.min(100, Math.round(((targetRecovery - recoveryMins) / targetRecovery) * 100)));
    const decompressionSpacing = gapDurations.length === 0
      ? totalMins : Math.round(gapDurations.reduce((a, b) => a + b, 0) / gapDurations.length);
    const totalFocusWeight    = (focusMins * 3) + physicalMins;
    const totalRecoveryWeight = (recoveryMins * 2) + bufferMins;
    const mentalLoadBalance   = totalFocusWeight === 0 ? 100
      : Math.max(0, Math.min(100, Math.round((totalRecoveryWeight / totalFocusWeight) * 100)));
    const highStrainClustering  = Math.max(0, Math.min(100, Math.round((maxFocusCluster / 150) * 100)));
    const sustainablePacingIndex = Math.max(0, Math.min(100, Math.round(
      100 - (recoveryDebt * 0.4 + (highStrainClustering > 70 ? 30 : 0) + (decompressionSpacing < 15 ? 20 : 0))
    )));

    const insights = [];
    if (recoveryDebt > 45)                               insights.push("Deuda de recuperación acumulada");
    if (highStrainClustering > 75)                       insights.push("Densidad de enfoque inestable");
    if (sustainablePacingIndex < 50)                     insights.push("Distribución de intensidad insostenible");
    if (recoveryDebt < 15 && highStrainClustering < 50)  insights.push("Espaciado de recuperación óptimo");

    return Object.freeze({
      recoveryDebt, decompressionSpacing, mentalLoadBalance,
      highStrainClustering, sustainablePacingIndex, insights: Object.freeze(insights),
    });
  },
});