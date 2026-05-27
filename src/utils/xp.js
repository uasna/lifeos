// ============================================================
// LifeOS v29 · XP utility layer
// Pure helpers for level math and penalty calculations.
// ============================================================

export const XP_LEVEL_SIZE = 500;

export function safeXp(totalXp = 0) {
  return Math.max(0, Math.floor(Number(totalXp) || 0));
}

export function levelFromXp(totalXp = 0) {
  return Math.floor(safeXp(totalXp) / XP_LEVEL_SIZE) + 1;
}

export function levelPctFromXp(totalXp = 0) {
  return ((safeXp(totalXp) % XP_LEVEL_SIZE) / XP_LEVEL_SIZE) * 100;
}

export function levelXpFromXp(totalXp = 0) {
  return safeXp(totalXp) % XP_LEVEL_SIZE;
}

export function xpToNextLevel(totalXp = 0) {
  const remainder = safeXp(totalXp) % XP_LEVEL_SIZE;
  return remainder === 0 ? XP_LEVEL_SIZE : XP_LEVEL_SIZE - remainder;
}

export function calculateQuestPenaltyValue({
  baseXp = 0,
  rolePenalty = 0,
  started = false,
  partialEnabled = true,
  lowEnergy = false,
} = {}) {
  const xp = Math.max(0, Number(baseXp) || 0);
  const roleMultiplier = Math.max(0, Number(rolePenalty) || 0);
  const startedMultiplier = started && partialEnabled ? 0.5 : 1;
  const energyMultiplier = lowEnergy ? 0.35 : 1;
  return Math.ceil(xp * roleMultiplier * startedMultiplier * energyMultiplier);
}
