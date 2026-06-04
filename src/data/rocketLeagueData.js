// Rocket League minimal control-center data for LifeOS.
// Detailed packs, workshop maps, selector tables, metrics and replay notes now live in public/Rocket_League_Training_System.xlsx.

export const ROCKET_LEAGUE_SESSION_MINUTES = 90;
export const ROCKET_LEAGUE_PARENT_QUEST_ID = 2;

export const ROCKET_LEAGUE_PROFILE = Object.freeze({
  target: "Consistencia competitiva",
  routine: "Fija de 90 min",
  review: "Semanal",
});

export const ROCKET_LEAGUE_CONTROLLER_PRESET = Object.freeze([]);
export const ROCKET_LEAGUE_RECOVERY_TIPS = Object.freeze([]);
export const ROCKET_LEAGUE_PACKS = Object.freeze({});
export const ROCKET_LEAGUE_WORKSHOP_RULES = Object.freeze([]);
export const ROCKET_LEAGUE_WORKSHOP_MAPS = Object.freeze({});

export const RL_SUBTASK_TYPES = Object.freeze({
  FREEPLAY: "freeplay",
  TRAINING_PACK: "training_pack",
  WORKSHOP: "workshop",
  MATCHES: "matches",
  MENTAL: "mental",
  NOTE: "note",
  SPEEDFLIP_DAR: "speedflip_dar",
});

export const SPEEDFLIP_DAR_ERROR_LABELS = Object.freeze({
  frontal: "Diagonal demasiado frontal",
  cancel_short: "Cancel no sostenido",
  lateral: "Cancel demasiado lateral",
  early_release: "Salida del cancel temprana",
  dar_late: "DAR endereza tarde",
  other: "Otro",
});

export const SPEEDFLIP_DAR_TOUCH_MOMENTS = Object.freeze({
  none: "No tocó",
  start: "Inicio de la vuelta",
  middle: "Mitad de la vuelta",
  end: "Final de la vuelta",
});

const ROCKET_LEAGUE_CONTROL_PLAN = Object.freeze({
  id: "rocket-control-90",
  title: "Rocket League",
  focus: "Consistencia competitiva",
  short: "90 min fijos · detalle en Excel",
  minutes: ROCKET_LEAGUE_SESSION_MINUTES,
  subtasks: Object.freeze([
    Object.freeze({ id: "rl-control-session", title: "Rutina fija de 90 min", minutes: 90, type: RL_SUBTASK_TYPES.NOTE, optional: false }),
  ]),
});

export function getRocketLeagueDateKey(date = new Date()) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getRocketLeaguePlanForDate() {
  return ROCKET_LEAGUE_CONTROL_PLAN;
}

export function getRocketLeaguePlanById() {
  return ROCKET_LEAGUE_CONTROL_PLAN;
}

export function getRocketLeagueSubtaskTargetSeconds(planId, subtaskId) {
  const task = ROCKET_LEAGUE_CONTROL_PLAN.subtasks.find(item => item.id === subtaskId);
  return task ? task.minutes * 60 : ROCKET_LEAGUE_SESSION_MINUTES * 60;
}

export function getRocketLeagueWeeklyFocus() {
  return {
    label: "Consistencia competitiva",
    short: "Control limpio",
    goal: "Open nets, 50/50, kickoffs, rotación y air roll shots sin cambiar la rutina diaria.",
    accent: "#22d3ee",
  };
}

export function getRocketLeagueFocusRole() {
  return "control";
}

export function getSecondsUntilNextRocketWeeklyFocus() {
  return 0;
}

export function createRocketLeagueCurrent(dateKey = getRocketLeagueDateKey(), planId = ROCKET_LEAGUE_CONTROL_PLAN.id) {
  return {
    dateKey,
    planId,
    completedSubtaskIds: [],
    elapsedBySubtask: {},
    matchCountBySubtask: {},
    mental: {
      moodBefore: null,
      moodAfter: null,
      tiltLevel: null,
      note: "",
      saved: false,
    },
  };
}

export function createRocketLeagueInitialState() {
  return {
    current: createRocketLeagueCurrent(),
    history: [],
    speedflipDar: {
      dominantSide: "DAR Derecho",
      targetWeeklySessions: 3,
      history: [],
    },
  };
}

export function hasRocketLeagueProgress(current) {
  if (!current || typeof current !== "object") return false;
  const elapsed = Object.values(current.elapsedBySubtask || {}).reduce((sum, v) => sum + Math.max(0, Number(v) || 0), 0);
  const matchCount = Object.values(current.matchCountBySubtask || {}).reduce((sum, v) => sum + Math.max(0, Number(v) || 0), 0);
  const mental = current.mental || {};
  return (
    (current.completedSubtaskIds || []).length > 0 ||
    elapsed > 0 ||
    matchCount > 0 ||
    mental.moodBefore !== null ||
    mental.moodAfter !== null ||
    mental.tiltLevel !== null ||
    Boolean(String(mental.note || "").trim()) ||
    mental.saved === true
  );
}

export function hasRocketLeagueSpeedflipDarProgress(rocketLeague) {
  return Array.isArray(rocketLeague?.speedflipDar?.history) && rocketLeague.speedflipDar.history.length > 0;
}

function clampNumber(value, min = 0, max = 999) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function getSpeedflipDarNoseTouchValue(value) {
  if (String(value) === "3+") return 3;
  return Math.max(0, Math.min(3, Math.floor(Number(value) || 0)));
}

export function normalizeSpeedflipDarSession(session = {}) {
  const attempts = Math.max(1, Math.floor(clampNumber(session.attempts, 1, 200)));
  const clean = Math.max(0, Math.min(attempts, Math.floor(clampNumber(session.clean, 0, attempts))));
  const noseTouches = ["0", "1", "2", "3+"].includes(String(session.noseTouches)) ? String(session.noseTouches) : "0";
  const side = String(session.side || "DAR Derecho").includes("Izquierdo") ? "DAR Izquierdo" : "DAR Derecho";
  const speed = ["75%", "85%", "100%"].includes(String(session.speed)) ? String(session.speed) : "75%";
  const touchMoment = SPEEDFLIP_DAR_TOUCH_MOMENTS[session.touchMoment] ? session.touchMoment : "none";
  const errorType = SPEEDFLIP_DAR_ERROR_LABELS[session.errorType] ? session.errorType : "other";
  const cleanRate = Math.round((clean / Math.max(attempts, 1)) * 100);
  const noseTouchAvg = Math.round(((attempts - clean) / Math.max(attempts, 1)) * getSpeedflipDarNoseTouchValue(noseTouches) * 100) / 100;
  return {
    id: `sfd-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
    side,
    speed,
    attempts,
    clean,
    noseTouches,
    touchMoment,
    errorType,
    notes: String(session.notes || "").slice(0, 500),
    cleanRate,
    noseTouchAvg,
  };
}

export function getSpeedflipDarSessionFeedback(session) {
  if (!session) return "Registrá una sesión para feedback específico.";
  const cleanRate = Number(session.cleanRate) || 0;
  if (cleanRate < 50) return "Mantené velocidad 75%. Primero limpieza, después velocidad.";
  if (cleanRate < 80) return "Vas cerca. No subás dificultad hasta estabilizar intentos limpios.";
  if (cleanRate < 90) return "Podés probar 85%, pero volvé a 75% si reaparece el doble toque.";
  return "El patrón está entrando. Transferilo con control, no con spam.";
}

export function getSpeedflipDarStats(history = []) {
  const sessions = Array.isArray(history) ? history.slice(-8) : [];
  const lastFive = sessions.slice(-5);
  const avgClean = lastFive.length ? Math.round(lastFive.reduce((sum, s) => sum + (Number(s.cleanRate) || 0), 0) / lastFive.length) : 0;
  const avgTouches = lastFive.length ? Math.round((lastFive.reduce((sum, s) => sum + (Number(s.noseTouchAvg) || 0), 0) / lastFive.length) * 100) / 100 : 0;
  const cleanestSide = { side: "DAR Derecho", avg: avgClean, count: sessions.length };
  return { sessions, lastFive, avgClean, avgTouches, cleanestSide, trend: 0, status: sessions.length ? "En progreso" : "Sin sesiones registradas", sessionsLeft: sessions.length ? "—" : "—" };
}
