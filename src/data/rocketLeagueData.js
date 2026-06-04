// Rocket League Hub data for LifeOS.
// LifeOS owns the daily control panel; only internal training packs, Freeplay, replays and matches are used.

export const ROCKET_LEAGUE_SESSION_MINUTES = 90;
export const ROCKET_LEAGUE_PARENT_QUEST_ID = 2;

export const ROCKET_LEAGUE_PROFILE = Object.freeze({
  target: "Consistencia competitiva",
  routine: "Fija de 90 min",
  review: "Semanal",
});


export const ROCKET_LEAGUE_TODAY_FOCUS = Object.freeze({
  openNets: "Training pack interno o freeplay: 20 tiros abiertos medidos",
  airRoll: "Air roll shots con ajuste mínimo; control antes que estilo",
  kickoffs: "Kickoffs limpios: salida estable, cancel controlado y recuperación",
  fifty: "1v1/casual con objetivo: low 50, no regalar reto",
  rotation: "Replay corto: detectar 3 overcommits o llegadas tarde",
});

export const ROCKET_LEAGUE_ROUTINE_BLOCKS = Object.freeze([
  Object.freeze({ id: "rl-01", label: "RL 01", title: "Preparación / check-in", minutes: 3, do: "Conectar mando, abrir RL y confirmar que todo está igual que siempre.", avoid: "No tocar sensibilidad, binds ni settings por impulso.", metric: "Setup estable antes de empezar." }),
  Object.freeze({ id: "rl-02", label: "RL 02", title: "Warm-up freeplay con recoveries", minutes: 8, do: "Moverte, caer bien, recuperar y tocar balón sin pausa larga.", avoid: "No convertirlo en freestyle ni ranked mental.", metric: "Entrar caliente sin perder control." }),
  Object.freeze({ id: "rl-03", label: "RL 03", title: "Descanso corto", minutes: 2, do: "Soltar manos, respirar y resetear foco.", avoid: "No abrir TikTok ni cambiar el plan.", metric: "Volver sin ansiedad." }),
  Object.freeze({ id: "rl-04", label: "RL 04", title: "Open nets / tiros abiertos", minutes: 15, do: "Pegar fuerte, limpio y con dirección en packs internos o freeplay.", avoid: "No girar por girar antes del impacto.", metric: "Open nets buenos / 20." }),
  Object.freeze({ id: "rl-05", label: "RL 05", title: "Descanso", minutes: 3, do: "Agua, manos sueltas, mirar solo el objetivo siguiente.", avoid: "No saltarte el descanso.", metric: "Entrar al siguiente bloque fresco." }),
  Object.freeze({ id: "rl-06", label: "RL 06", title: "Air roll shots", minutes: 12, do: "Usar air roll mínimo para ajustar ángulo y contacto.", avoid: "No freestyle, no spins innecesarios.", metric: "Tiros controlados / 20." }),
  Object.freeze({ id: "rl-07", label: "RL 07", title: "Descanso corto", minutes: 2, do: "Cortar tensión y resetear muñeca.", avoid: "No llenar el descanso con clips/videos.", metric: "Listo para kickoffs." }),
  Object.freeze({ id: "rl-08", label: "RL 08", title: "Saques / kickoffs", minutes: 12, do: "Practicar salida, contacto y recovery después del kickoff.", avoid: "No subir velocidad si vuelve el doble toque o el control sucio.", metric: "Kickoffs limpios / 10." }),
  Object.freeze({ id: "rl-09", label: "RL 09", title: "Descanso", minutes: 3, do: "Respirar y recordar: reto bajo, no regalar balón.", avoid: "No entrar frustrado al 50/50.", metric: "Mental estable." }),
  Object.freeze({ id: "rl-10", label: "RL 10", title: "50/50 y low challenges", minutes: 12, do: "Jugar 1v1/casual con foco en low 50 y no saltar antes.", avoid: "No buscar clips ni challenge alto sin cobertura.", metric: "Mejor / Igual / Peor." }),
  Object.freeze({ id: "rl-11", label: "RL 11", title: "Descanso", minutes: 3, do: "Soltar, agua y preparar revisión de decisiones.", avoid: "No cambiar rutina aquí.", metric: "Seguir el plan." }),
  Object.freeze({ id: "rl-12", label: "RL 12", title: "Rotación / decisiones", minutes: 10, do: "Revisar replay corto o jugar casual con objetivo específico.", avoid: "No analizar una hora; solo 3 errores claros.", metric: "3 errores detectados." }),
  Object.freeze({ id: "rl-13", label: "RL 13", title: "Registro diario", minutes: 5, do: "Guardar energía, fluidez, error principal y corrección para mañana.", avoid: "No escribir novela ni justificar la sesión.", metric: "Una corrección accionable." }),
]);

export const ROCKET_LEAGUE_TRAINING_PACKS_SIMPLE = Object.freeze([
  Object.freeze({
    category: "Open nets / tiros abiertos",
    items: Object.freeze([
      "Ground Shots — 6EB1-79B2-33B8-681C",
      "Powershots — 7028-5E10-88EF-E83E",
      "Powershot Practice — C9E4-0F05-B71A-C322",
      "Alternativa: freeplay, 20 tiros abiertos medidos",
    ]),
  }),
  Object.freeze({
    category: "Air roll shots",
    items: Object.freeze([
      "Air Roll Shots — 84D2-072D-80CF-7D0D",
      "Power shot + Air roll shot — 1C4E-D311-1506-B6C1",
      "Alternativa: freeplay, tiros con air roll mínimo",
    ]),
  }),
  Object.freeze({
    category: "Kickoffs",
    items: Object.freeze([
      "Speedflip Kickoff Test — A503-264C-A7EB-D282",
      "Mastering Kickoffs — 8939-4C63-B233-83C1",
      "Kickoffs básicos — 4125-17D5-2C7B-EBEF",
      "Alternativa: freeplay, 20 respawns de kickoff",
    ]),
  }),
  Object.freeze({
    category: "50/50",
    items: Object.freeze([
      "1v1 casual con objetivo de low 50",
      "Freeplay para control detrás del balón",
      "Replay corto para detectar 50/50 regalados",
    ]),
  }),
  Object.freeze({
    category: "Rotación",
    items: Object.freeze([
      "Replay review corto",
      "Buscar 3 errores: open net fallado, 50/50 perdido, mala rotación / overcommit",
      "Alternativa: partida casual con objetivo específico",
    ]),
  }),
]);

export const ROCKET_LEAGUE_WEEKLY_REVIEW_ITEMS = Object.freeze([
  "¿Mejoraron los open nets?",
  "¿Perdí menos 50/50?",
  "¿Mis kickoffs fueron más limpios?",
  "¿Me desordené menos en rotación?",
  "¿Los air roll shots tuvieron más control?",
  "¿La rutina se sintió pesada o sostenible?",
]);

export const ROCKET_LEAGUE_WEEKLY_DECISIONS = Object.freeze([
  "Mantener rutina",
  "Ajustar un bloque",
  "Bajar volumen",
  "Subir dificultad",
  "Revisar error repetido",
]);

export const ROCKET_LEAGUE_REPLAY_TYPES = Object.freeze([
  "Rotación",
  "50/50",
  "Open net",
  "Kickoff",
  "Boost",
  "Mala decisión",
]);

export const ROCKET_LEAGUE_CONTROLLER_PRESET = Object.freeze([]);
export const ROCKET_LEAGUE_RECOVERY_TIPS = Object.freeze([]);
export const ROCKET_LEAGUE_PACKS = Object.freeze({});
export const ROCKET_LEAGUE_WORKSHOP_RULES = Object.freeze([]); // legacy export, unused in the new Rocket Hub
export const ROCKET_LEAGUE_WORKSHOP_MAPS = Object.freeze({}); // legacy export, unused in the new Rocket Hub

export const RL_SUBTASK_TYPES = Object.freeze({
  FREEPLAY: "freeplay",
  TRAINING_PACK: "training_pack",
  WORKSHOP: "legacy_external",
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
  short: "90 min fijos · control dentro de LifeOS",
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
