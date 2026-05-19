// ENGINE_SEGMENT: AdaptiveEngine::Coordinator
// PURE — orchestrates PlannerEngine + TelemetryEngine
// CYCLIC_RISK: none — only consumes sibling engines
import { RecoveryBalanceEngine } from "./planner.engine.js";
import { BehaviorStateEngine }   from "./telemetry.engine.js";

export const AdaptiveEngine = Object.freeze({
  analyze(persistentState, currentBlocks = []) {
    const pacing        = RecoveryBalanceEngine.calculateMetrics(currentBlocks);
    const behavior      = BehaviorStateEngine.calculateState(persistentState);
    const recommendations = [];

    if (behavior.momentumTrend === "BURNOUT_RISK" || pacing.recoveryDebt > 50) {
      recommendations.push(Object.freeze({
        id: "shape_workload", type: "Modelado de Carga Adaptativo",
        message: "Saturación detectada. Reduce la duración de bloques de enfoque un 15% para proteger el rendimiento a largo plazo.",
        severity: "CRITICAL",
      }));
    }
    if (pacing.highStrainClustering > 70) {
      recommendations.push(Object.freeze({
        id: "redistribute_intensity", type: "Redistribución de Intensidad",
        message: "Clustering de alta tensión detectado. Añade un buffer obligatorio de 10 minutos antes del próximo enfoque.",
        severity: "WARNING",
      }));
    }

    const allInsights = [...pacing.insights, ...behavior.flags];
    return Object.freeze({
      pacing, behavior,
      recommendations: Object.freeze(recommendations),
      insights: Object.freeze(
        allInsights.length > 0 ? allInsights : ["Sistema operando dentro de parámetros nominales"]
      ),
    });
  },
});

// SELECTORS — pure derived-state helpers
// PURE: same input → same output, no side effects, no deps
export const SELECTORS = Object.freeze({
  level:         (xp) => Math.floor(Math.sqrt(xp / 100)) + 1,
  xpToNextLevel: (xp) => {
    const lvl = Math.floor(Math.sqrt(xp / 100)) + 1;
    return Math.pow(lvl, 2) * 100 - xp;
  },
  adaptiveIntel: (state, currentBlocks) => AdaptiveEngine.analyze(state, currentBlocks),
});