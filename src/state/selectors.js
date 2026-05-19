// MODULE_BOUNDARY: state/selectors
// Pure helper — no state reads, stable output shape.
// Separate from adaptive.engine.js SELECTORS (which are XP/level derivations).

export function getScheduleBlocks(dayIdx, swimDays) {
  if (!swimDays || !swimDays[dayIdx]) return { main: [] };
  return swimDays[dayIdx];
}