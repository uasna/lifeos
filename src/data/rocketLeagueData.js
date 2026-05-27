// Rocket League static data + pure planning helpers extracted from LifeOS.jsx.
// Keep this module dependency-free: no React, no Supabase, no browser APIs.

// ── Rocket League static training system ────────────────────────
// Epic-safe custom training + Workshop normal maps. Avoid extra-mode maps because Epic can bug with custom modes.

export const ROCKET_LEAGUE_SESSION_MINUTES = 60;
export const ROCKET_LEAGUE_PARENT_QUEST_ID = 2;

export const ROCKET_LEAGUE_PROFILE = Object.freeze({
  duel: "1v1 Plat II",
  doubles: "2v2 Plat II",
  standard: "3v3 Plat II",
  platform: "Epic + Workshop normal",
  target: "Plat II · peak Diamond I low",
});

export const ROCKET_LEAGUE_CONTROLLER_PRESET = Object.freeze([
  { label: "Sensibilidad suelo", value: "1.45", note: "Precisa para Plat II; subí a 1.55 cuando los recoveries se sientan lentos." },
  { label: "Sensibilidad aérea", value: "1.45", note: "Igual que suelo para no cambiar sensación al saltar o salir de pared." },
  { label: "Zona muerta", value: "0.06", note: "DualSense nuevo: bajo y preciso. Si aparece drift, probá 0.07–0.08." },
  { label: "Zona esquive", value: "0.70", note: "Reduce backflips/sideflips accidentales en fast aerial y speedflip." },
  { label: "Ver a los lados", value: "5.00", note: "Camera swivel speed rápido sin sentirse nervioso." },
  { label: "Vibración", value: "Off", note: "Menos distracción y lectura más limpia del control." },
]);

export const ROCKET_LEAGUE_RECOVERY_TIPS = Object.freeze([
  "Aterrizá con las ruedas hacia la dirección donde querés salir, no donde venís mirando.",
  "Mantené powerslide al caer si el carro no está perfectamente alineado.",
  "Después de cada tiro, buscá pad pequeño antes de mirar si fue gol.",
  "Si caés en pared, convertí la caída en wavedash o salida lateral, no frenes.",
  "En defensa, salvar al centro cuenta como error: priorizá esquina o lateral.",
  "Cuando fallés un tiro, tu primera mecánica es recovery; no perseguir la pelota sin boost.",
  "Si quedás mirando hacia tu arco después de un challenge, half flip + pad pequeño antes de volver a saltar.",
]);

export const ROCKET_LEAGUE_PACKS = Object.freeze({
  powershots: {
    name: "Powershots",
    code: "7028-5E10-88EF-E83E",
    focus: "pegar fuerte, limpio y con dirección",
  },
  groundShots: {
    name: "Ground Shots",
    code: "6EB1-79B2-33B8-681C",
    focus: "tiros básicos consistentes",
  },
  shotsYouShouldntMiss: {
    name: "Shots You Shouldn't Miss",
    code: "42BF-686D-E047-574B",
    focus: "no fallar tiros ganables",
  },
  basicRebounds: {
    name: "Basic Rebound Practice",
    code: "3DBA-229E-745C-429C",
    focus: "leer rebotes simples",
  },
  backboardReads: {
    name: "Backboard Reads",
    code: "2486-EEA6-B887-A040",
    focus: "lecturas de pared/backboard",
  },
  aerialsOffWall: {
    name: "Aerials Off Wall",
    code: "5BFE-60D6-0D59-79F2",
    focus: "salidas de pared y control aéreo",
  },
  shadowDefense: {
    name: "Shadow Defense",
    code: "5CCE-FB29-7B05-A0B1",
    focus: "defender sin regalar espacio",
  },
  hardSaves: {
    name: "Hard Saves & Clears",
    code: "82D6-5637-12A7-5AC5",
    focus: "salvadas incómodas y clears con intención",
  },
  overheadSaves: {
    name: "Overhead Saves",
    code: "9223-FCC3-D504-D1B8",
    focus: "salvadas sobre tu cabeza y shadow bajo presión",
  },
  saveConsistency: {
    name: "Save Consistency",
    code: "5ED2-0D32-270A-3266",
    focus: "salvadas repetibles sin pánico",
  },
  platDiamond: {
    name: "Plat–Diamond Training",
    code: "3B40-CE8C-58EB-32B3",
    focus: "transición Plat II hacia Diamond I low",
  },
  speedflipMusty: {
    name: "Musty Speedflip Kickoff Test",
    code: "A503-264C-A7EB-D282",
    focus: "speedflip exigente para kickoff real",
  },
  airRollShots: {
    name: "Power shot + Air Roll Shot",
    code: "1C4E-D311-1506-B6C1",
    focus: "tiros con ajuste de air roll antes del impacto",
  },
  airRollShotsAlt: {
    name: "Air Roll Shots",
    code: "84D2-072D-80CF-7D0D",
    focus: "ángulos cerrados, botes largos y potencia con air roll",
  },
  directionalAirRoll: {
    name: "Directional Air Roll Practice",
    code: "F28D-A55C-C924-B26E",
    focus: "control de air roll en tiros de suelo y aéreos",
  },
  recoveryTraining: {
    name: "Recovery Training",
    code: "DA42-75B1-0469-8A0F",
    focus: "caídas incómodas, half flips y recoveries rápidas",
  },
  driftWavedashRecovery: {
    name: "Drift & Wave Dash Recovery",
    code: "C809-86F7-C4BB-F1C1",
    focus: "derrape + wavedash para recuperar velocidad",
  },
});

export const ROCKET_LEAGUE_WORKSHOP_RULES = Object.freeze([
  "Usar solo mapas Workshop normales: dribbling, rings, aerial control o recoveries simples.",
  "Evitar mapas con modos extra, mutators raros, scripts de minijuego, multiplayer custom o reglas especiales.",
  "Después de una partida, podés entrar directo al mapa Workshop normal sin reiniciar Rocket League.",
  "Si un mapa se buguea en Epic, salí del mapa y cambiá a training pack; no gastés la sesión peleando con el loader.",
]);

export const ROCKET_LEAGUE_WORKSHOP_MAPS = Object.freeze({
  dribblingChallenge1Remastered: {
    name: "Dribbling Challenge 1 Remastered",
    source: "BakkesPlugins map · Workshop normal",
    focus: "dribbling en suelo, balance y control fino",
    kind: "Dribbling",
    modeSafe: true,
    activeRotation: true,
    postMatch: true,
    avoid: "Usar en modo normal/freeplay. No buscar speedrun; buscá control limpio.",
    howToUse: "Ideal después de una partida: 10–15 min de control. Si se cae la pelota, reiniciá tranquilo sin reiniciar Rocket League.",
  },
  dribblingChallenge1: {
    name: "Dribbling Challenge 1",
    source: "BakkesPlugins map · Workshop normal",
    focus: "dribbling difícil, paciencia y microtoques",
    kind: "Dribbling difícil",
    modeSafe: true,
    activeRotation: false,
    libraryOnlyReason: "Redundante con Remastered y más frustrante para Plat II; dejar como reto opcional.",
    postMatch: true,
    avoid: "Es difícil: no lo uses para tiltearte. Si falla mucho, cambiá al Remastered.",
    howToUse: "Usalo como reto corto. Meta real: pasar 1–2 niveles con control, no terminar el mapa.",
  },
  twentyXXDribbleChallenge: {
    name: "20XX Dribble Challenge",
    source: "BakkesPlugins map · Workshop normal",
    focus: "dribbling variado y control bajo presión",
    kind: "Dribbling",
    modeSafe: true,
    activeRotation: true,
    postMatch: true,
    avoid: "No activar variantes ni modos raros; solo práctica normal.",
    howToUse: "Bloque de 10–15 min para variar dribbling sin repetir siempre el mismo mapa.",
  },
  iceRings: {
    name: "Ice Rings",
    source: "BakkesPlugins map · Rings",
    focus: "control aéreo básico, boost y estabilización",
    kind: "Rings / aéreo",
    modeSafe: true,
    activeRotation: true,
    postMatch: true,
    avoid: "No lo conviertas en speedrun. Menos choques > más velocidad.",
    howToUse: "10–15 min después de jugar: air roll solo para corregir, no para girar por girar.",
  },
  neonHeightsRings: {
    name: "Neon Heights Rings",
    source: "BakkesPlugins map · Rings",
    focus: "aerial control y rutas limpias",
    kind: "Rings / aéreo",
    modeSafe: true,
    activeRotation: false,
    libraryOnlyReason: "Variación de rings; no activa para evitar demasiados mapas a la vez.",
    postMatch: true,
    avoid: "Si te desorientás, soltá air roll y estabilizá primero.",
    howToUse: "Buen mapa para variar rings sin cambiar a modos extra.",
  },
  medievalRings: {
    name: "Medieval Rings",
    source: "BakkesPlugins map · Rings",
    focus: "control aéreo progresivo y recoveries al caer",
    kind: "Rings / recovery",
    modeSafe: true,
    activeRotation: false,
    libraryOnlyReason: "Variación secundaria de rings/recovery; usar solo si Ice Rings ya está dominado.",
    postMatch: true,
    avoid: "No forzar vueltas raras. La meta es aterrizar bien.",
    howToUse: "Úsalo cuando LifeOS programe recoveries/aéreo suave.",
  },
  lavaRings: {
    name: "Lava Rings",
    source: "BakkesPlugins map · Rings",
    focus: "aerial control con lectura visual distinta",
    kind: "Rings / aéreo",
    modeSafe: true,
    activeRotation: false,
    libraryOnlyReason: "Variación visual de rings; fuera de rotación para mantener enfoque.",
    postMatch: true,
    avoid: "Si el mapa se siente pesado, cambiá a Ice Rings.",
    howToUse: "Variación de rings para no repetir siempre el mismo mapa.",
  },
  orbitalRings: {
    name: "Orbital Rings",
    source: "BakkesPlugins map · Rings",
    focus: "control aéreo, dirección y paciencia",
    kind: "Rings / aéreo",
    modeSafe: true,
    activeRotation: false,
    libraryOnlyReason: "Variación avanzada de rings; no necesaria todavía para Plat II.",
    postMatch: true,
    avoid: "No usarlo en tilt alto; puede frustrar si te perdés.",
    howToUse: "Bloque corto para control aéreo cuando toque Workshop.",
  },
  airDribbleHoops: {
    name: "Air Dribble Hoops",
    source: "BakkesPlugins map · Workshop normal",
    focus: "air dribble básico con objetivo claro",
    kind: "Air dribble",
    modeSafe: true,
    activeRotation: false,
    libraryOnlyReason: "Air dribble ya tiene Warm Up y Gauntlet; evitar exceso de mapas similares.",
    postMatch: true,
    avoid: "Usar como práctica de setup + 1 toque útil, no para clips.",
    howToUse: "Ideal cuando toque ground-to-air o air dribble intro.",
  },
  airDribbleWarmUp: {
    name: "Air Dribble Warm Up",
    source: "BakkesPlugins map · Workshop normal",
    focus: "calentamiento aéreo y primer toque controlado",
    kind: "Air dribble warmup",
    modeSafe: true,
    activeRotation: true,
    postMatch: true,
    avoid: "Si empezás perdido, bajá ritmo y repetí setups fáciles.",
    howToUse: "Úsalo antes de Air Dribble Gauntlet o en días de baja energía.",
  },
  airDribbleGauntlet: {
    name: "Air Dribble Gauntlet",
    source: "BakkesPlugins map · Workshop normal",
    focus: "ground-to-air y air dribble básico por niveles",
    kind: "Air dribble básico",
    modeSafe: true,
    activeRotation: true,
    occasionalOnly: true,
    postMatch: true,
    avoid: "Usar niveles fáciles; evitar forzar clips o mapas con reglas raras.",
    howToUse: "Meta real: setup limpio + 1 toque útil. No forzar clips.",
  },
});

export const RL_SUBTASK_TYPES = Object.freeze({
  FREEPLAY: "Freeplay",
  SPEEDFLIP: "Speedflip",
  SPEEDFLIP_DAR: "Speedflip DAR",
  MECHANIC: "Mecánica",
  PACK: "Training Pack",
  WORKSHOP: "Workshop Map",
  MATCHES: "Partidas",
  MENTAL: "Mental",
});

export const RL_FREEPLAY_SUBTASK = Object.freeze({
  id: "freeplay",
  title: "Freeplay agresivo",
  type: RL_SUBTASK_TYPES.FREEPLAY,
  minutes: 10,
  instruction: "Bloque fijo diario: powershots, recoveries, pads pequeños y cero pausa entre toques. No ranked frío.",
  focus: "ritmo + confianza",
  accent: "#22d3ee",
});

export const RL_ONE_V_ONE_SUBTASK = Object.freeze({
  id: "one-v-one-before-friends",
  title: "1v1 antes de jugar con amigos",
  type: RL_SUBTASK_TYPES.MATCHES,
  minutes: 0,
  targetCount: 3,
  noTimer: true,
  instruction: "Bloque fijo diario: jugá 3 partidas de 1v1 como práctica real de kickoff, paciencia, shadow, 50s y reset mental antes de jugar con amigos.",
  focus: "3 partidas · warmup competitivo",
  accent: "#60a5fa",
});

export const makeRlMechanicSubtask = (id, title, focus, instruction, minutes = 10, accent = "#fb7185") => Object.freeze({
  id,
  title,
  type: RL_SUBTASK_TYPES.MECHANIC,
  minutes,
  instruction,
  focus,
  accent,
});

export const makeRlPackSubtask = (id, pack, minutes, instruction, accent = "#34d399") => Object.freeze({
  id,
  title: pack.name,
  type: RL_SUBTASK_TYPES.PACK,
  minutes,
  pack,
  instruction,
  focus: pack.focus,
  accent,
});

export const makeRlWorkshopSubtask = (id, workshop, minutes, instruction, accent = "#38bdf8") => Object.freeze({
  id,
  title: workshop.name,
  type: RL_SUBTASK_TYPES.WORKSHOP,
  minutes,
  workshop,
  instruction,
  focus: workshop.focus,
  accent,
});

export const makeRlMentalSubtask = (id, title, instruction, minutes = 5) => Object.freeze({
  id,
  title,
  type: RL_SUBTASK_TYPES.MENTAL,
  minutes,
  instruction,
  focus: "menos tilt + mejores decisiones",
  accent: "#a78bfa",
});

export const RL_MECHANIC_DRILLS = Object.freeze({
  speedflipBothSides: makeRlMechanicSubtask(
    "mechanic-speedflip-both-sides",
    "Speedflips · ambos lados",
    "kickoff izquierdo + derecho sin hacerlo diario",
    "5 min lado izquierdo + 5 min lado derecho. Priorizá aterrizaje recto y contacto; si falla el cancel, bajá velocidad.",
    10,
    "#fbbf24"
  ),
  driftCuts: makeRlMechanicSubtask(
    "mechanic-drift-cuts",
    "Drift cuts",
    "derrapar para agarrar balón y cambiar dirección",
    "Llevá la pelota hacia un lado, powerslide cut para recuperarla y salí con toque controlado. No busqués velocidad; buscá control.",
    10
  ),
  basicFlicks: makeRlMechanicSubtask(
    "mechanic-basic-flicks",
    "Flicks básicos",
    "dribbling estable → flick simple",
    "Arrancá con pelota encima del carro. Practicá front flick y diagonal flick suave; si se cae, reiniciá sin tiltearte.",
    10
  ),
  groundToAirIntro: makeRlMechanicSubtask(
    "mechanic-ground-to-air",
    "Ground to air dribble intro",
    "subir la pelota sin regalar posesión",
    "Desde dribble en suelo: primer toque levantando, salto controlado y un solo toque aéreo. La meta es setup limpio, no clip.",
    10,
    "#38bdf8"
  ),
  wallControl: makeRlMechanicSubtask(
    "mechanic-wall-control",
    "Wall control básico",
    "primer toque desde pared + recovery",
    "Subí la pelota a pared, tocá hacia adentro y aterrizá con powerslide. Si el toque sale mal, priorizá recovery inmediato.",
    10,
    "#60a5fa"
  ),
  recoveryChain: makeRlMechanicSubtask(
    "mechanic-recoveries",
    "Recoveries aplicadas",
    "wavedash, powerslide landing y momentum",
    "Cada tiro debe terminar con aterrizaje útil. Wavedash al caer, powerslide al girar y buscar pad pequeño.",
    10,
    "#34d399"
  ),
  savePathing: makeRlMechanicSubtask(
    "mechanic-save-pathing",
    "Salvadas + salida limpia",
    "save sin regalar rebote al centro",
    "Salvá hacia esquina, agarrá pad pequeño y salí por lateral. Si despejás al centro, repetí.",
    10,
    "#f472b6"
  ),
  shadowPatience: makeRlMechanicSubtask(
    "mechanic-shadow-patience",
    "Shadow patience",
    "aguantar sin tirarte de más",
    "Practicá retroceder con cámara al balón, cubrir net y desafiar solo cuando el rival perdería control.",
    10,
    "#818cf8"
  ),
  lowBoostDefense: makeRlMechanicSubtask(
    "mechanic-low-boost-defense",
    "Defensa con poco boost",
    "pads pequeños + paciencia defensiva",
    "Empezá con poco boost: cubrí net, tomá pads chicos y despejá a esquina. No saltes si el primer toque rival todavía no amenaza.",
    10,
    "#38bdf8"
  ),
  firstTouchControl: makeRlMechanicSubtask(
    "mechanic-first-touch",
    "Primer toque útil",
    "control antes que pegar por pegar",
    "Cada balón debe tener intención: controlar, tirar, fakear o salir a pared. Si el toque te aleja de la jugada, repetí.",
    10,
    "#22c55e"
  ),
  airDribbleIntro: makeRlMechanicSubtask(
    "mechanic-air-dribble-intro",
    "Air dribble intro",
    "toques aéreos simples, sin freestyle",
    "Usá pared o setup suave. Meta: 1–2 toques controlados y recovery. Si no hay setup limpio, no fuerces el aire.",
    10,
    "#22d3ee"
  ),
  airRollShotControl: makeRlMechanicSubtask(
    "mechanic-air-roll-shot-control",
    "Tiros con air roll",
    "alinear el carro antes del impacto",
    "Saltá, usá air roll solo para corregir ángulo y pegá con potencia. No gires por girar; air roll termina antes del contacto.",
    10,
    "#e879f9"
  ),
  halfFlipRecovery: makeRlMechanicSubtask(
    "mechanic-half-flip-recovery",
    "Half flip recovery",
    "volver a la jugada sin gastar boost de más",
    "Desde reversa o mala orientación: half flip, cancel limpio, enderezar con air roll/powerslide y salir hacia pad pequeño.",
    10,
    "#34d399"
  ),
  wallWavedash: makeRlMechanicSubtask(
    "mechanic-wall-wavedash",
    "Wall wavedash + salida",
    "bajar de pared sin perder velocidad",
    "Subí a pared, soltate, wavedash al piso y salí por lateral. Si aterrizás plano y frenás, repetí.",
    10,
    "#38bdf8"
  ),
  awkwardLanding: makeRlMechanicSubtask(
    "mechanic-awkward-landing",
    "Aterrizajes incómodos",
    "corregir carro en el aire y caer útil",
    "Tirate incómodo, girá el carro para caer con ruedas y mantené powerslide. Meta: no quedar muerto después del toque.",
    10,
    "#fbbf24"
  ),
  goalpostRecovery: makeRlMechanicSubtask(
    "mechanic-goalpost-recovery",
    "Poste → recovery defensiva",
    "usar postes y pared de arco para volver rápido",
    "Saltá desde defensa, tocá/salvá y usá poste o pared del arco para caer mirando hacia la jugada. Evitá quedar dentro de la red.",
    10,
    "#60a5fa"
  ),
});


export const RL_SPEEDFLIP_DAR_CLEAN_CANCEL_SUBTASK = Object.freeze({
  id: "mechanic-speedflip-dar-clean-cancel",
  title: "Speedflip DAR Clean Cancel",
  type: RL_SUBTASK_TYPES.SPEEDFLIP_DAR,
  minutes: 10,
  instruction: "Bloque previo al mapa de Musty/speedflip: primero limpieza, después velocidad. Llegar al balón no basta: debe caer plano.",
  focus: "DAR sostenido + cancel limpio + aterrizaje plano",
  accent: "#fbbf24",
  speedflipDar: true,
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

export function clampNumber(value, min = 0, max = 999) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function getSpeedflipDarNoseTouchValue(value) {
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
  if (!session) return "Registrá una sesión para que LifeOS te dé feedback específico.";
  const cleanRate = Number(session.cleanRate) || 0;
  const moment = session.touchMoment;
  const error = session.errorType;
  if (moment === "start" || error === "frontal") return "El primer diagonal probablemente está demasiado hacia adelante. En DAR Derecho probá 11 sin irte a 12. En DAR Izquierdo probá 1 sin irte a 12.";
  if (moment === "end" || error === "early_release" || error === "cancel_short") return "Probablemente estás soltando el cancel antes de tiempo. Mantené el stick abajo un instante más antes de volver a neutral.";
  if (String(session.noseTouches) === "2" || String(session.noseTouches) === "3+" || error === "lateral") return "El cancel está entrando, pero la salida no está limpia. Priorizá 11→6 en DAR Derecho o 1→6/6:30 en DAR Izquierdo.";
  if (cleanRate < 50) return "Mantené velocidad 75%. No subás todavía al mapa como métrica principal.";
  if (cleanRate < 80) return "Vas cerca. Mantené 75% hasta estabilizar 8/10 intentos limpios.";
  if (cleanRate < 90) return "Podés probar 85%, pero volvé a 75% si reaparece el doble toque.";
  return "El patrón está entrando. Empezá a transferirlo al mapa de Musty con control.";
}

export function getSpeedflipDarStats(history = []) {
  const sessions = Array.isArray(history) ? history.slice(-8) : [];
  const lastFive = sessions.slice(-5);
  const avgClean = lastFive.length ? Math.round(lastFive.reduce((sum, s) => sum + (Number(s.cleanRate) || 0), 0) / lastFive.length) : 0;
  const avgTouches = lastFive.length ? Math.round((lastFive.reduce((sum, s) => sum + (Number(s.noseTouchAvg) || 0), 0) / lastFive.length) * 100) / 100 : 0;
  const bySide = ["DAR Derecho", "DAR Izquierdo"].map(side => {
    const sideSessions = sessions.filter(s => s.side === side);
    const avg = sideSessions.length ? Math.round(sideSessions.reduce((sum, s) => sum + (Number(s.cleanRate) || 0), 0) / sideSessions.length) : 0;
    return { side, avg, count: sideSessions.length };
  });
  const cleanestSide = bySide.sort((a, b) => b.avg - a.avg)[0] || { side: "DAR Derecho", avg: 0, count: 0 };
  const trend = sessions.length >= 3
    ? Math.round((sessions.slice(-2).reduce((sum, s) => sum + (Number(s.cleanRate) || 0), 0) / 2) - (sessions.slice(0, 2).reduce((sum, s) => sum + (Number(s.cleanRate) || 0), 0) / 2))
    : 0;
  let status = "Necesito al menos 3 sesiones registradas para estimar.";
  let sessionsLeft = "—";
  if (sessions.length >= 3) {
    if (avgClean >= 95 && avgTouches <= .25) { status = "Masterizado en práctica controlada"; sessionsLeft = "0–2"; }
    else if (avgClean >= 85) { status = "Casi masterizado"; sessionsLeft = "3–6"; }
    else if (avgClean >= 70) { status = "Cerca"; sessionsLeft = "6–10"; }
    else if (avgClean >= 50) { status = "En progreso"; sessionsLeft = "10–14"; }
    else { status = "Lejos todavía"; sessionsLeft = "14–21"; }
  }
  return { sessions, lastFive, avgClean, avgTouches, cleanestSide, trend, status, sessionsLeft };
}

export const ROCKET_LEAGUE_WEEKLY_FOCUSES = Object.freeze([
  Object.freeze({
    id: "dribbling",
    label: "Dribbling + primeros toques",
    short: "Dribbling",
    goal: "dominar control de suelo, flicks simples y posesión sin regalar la pelota",
    accent: "#fb7185",
  }),
  Object.freeze({
    id: "recoveries",
    label: "Recoveries + defensa",
    short: "Recoveries",
    goal: "caer mejor, volver antes a la jugada y defender sin pánico",
    accent: "#34d399",
  }),
  Object.freeze({
    id: "speedflip",
    label: "Speedflip + kickoff limpio",
    short: "Speedflip",
    goal: "limpiar el cancel, aterrizar plano y transferirlo al kickoff real",
    accent: "#fbbf24",
  }),
  Object.freeze({
    id: "aerial",
    label: "Aerial control + air roll útil",
    short: "Aerial",
    goal: "usar air roll para corregir, no para girar por costumbre",
    accent: "#a78bfa",
  }),
  Object.freeze({
    id: "decision",
    label: "1v1 decision making",
    short: "1v1",
    goal: "elegir mejor cuándo controlar, desafiar, fakear o tirar",
    accent: "#22d3ee",
  }),
]);

export function parseRocketLeagueDateKey(dateKey = getRocketLeagueDateKey()) {
  const [y, m, d] = String(dateKey).split("-").map(Number);
  return new Date(y || 2026, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

export function getRocketLeagueWeekIndex(dateKey = getRocketLeagueDateKey()) {
  const d = parseRocketLeagueDateKey(dateKey);
  const mondayOffset = (d.getDay() + 6) % 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return Math.floor(monday.getTime() / (7 * 24 * 60 * 60 * 1000));
}

export function getRocketLeagueWeeklyFocus(dateKey = getRocketLeagueDateKey()) {
  const idx = Math.abs(getRocketLeagueWeekIndex(dateKey));
  return ROCKET_LEAGUE_WEEKLY_FOCUSES[idx % ROCKET_LEAGUE_WEEKLY_FOCUSES.length];
}

export function getRocketLeagueFocusRole(dateKey = getRocketLeagueDateKey()) {
  const d = parseRocketLeagueDateKey(dateKey);
  const mondayBasedDay = (d.getDay() + 6) % 7; // 0=Lun ... 6=Dom
  const varietyDay = mondayBasedDay === 2 || mondayBasedDay === 6; // Miércoles + Domingo
  return varietyDay
    ? { type: "variety", label: "30% variedad", detail: "día de mezcla para no aburrirte ni oxidarte" }
    : { type: "focus", label: "70% enfoque", detail: "día centrado en el foco semanal" };
}

export function getSecondsUntilNextRocketWeeklyFocus(now = Date.now()) {
  const d = new Date(now);
  const mondayOffset = (d.getDay() + 6) % 7;
  const nextMonday = new Date(d);
  nextMonday.setDate(d.getDate() - mondayOffset + 7);
  nextMonday.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((nextMonday.getTime() - now) / 1000));
}

export function inferRocketLeaguePrimaryFocus(id = "") {
  const key = String(id).toLowerCase();
  if (key.includes("speedflip") || key.includes("kickoff")) return "speedflip";
  if (key.includes("dribble") || key.includes("flick")) return "dribbling";
  if (key.includes("save") || key.includes("shadow") || key.includes("wall") || key.includes("backboard") || key.includes("boost") || key.includes("rebound")) return "recoveries";
  if (key.includes("air") || key.includes("aerial") || key.includes("ground-to-air")) return "aerial";
  if (key.includes("one-v-one") || key.includes("decision")) return "decision";
  return "dribbling";
}

export const makeRlPlan = (id, title, focus, variableBlocks, meta = {}) => {
  const blocks = [RL_FREEPLAY_SUBTASK, ...variableBlocks, RL_ONE_V_ONE_SUBTASK];
  const timedMinutes = blocks.reduce((sum, task) => sum + Math.max(0, Number(task.minutes) || 0), 0);
  return Object.freeze({
    id: `${id}-60m-flex-v5`,
    baseId: id,
    title,
    focus,
    primaryFocus: meta.primaryFocus || inferRocketLeaguePrimaryFocus(id),
    balance: "70% enfoque semanal · 30% variedad",
    minutes: timedMinutes,
    subtasks: Object.freeze(blocks),
  });
};

export const ROCKET_LEAGUE_TRAINING_PLANS = Object.freeze([
  makeRlPlan("speedflip-recovery", "Speedflip DAR + Musty Day", "Kickoff útil: primero limpieza, después velocidad", [
    RL_SPEEDFLIP_DAR_CLEAN_CANCEL_SUBTASK,
    makeRlPackSubtask("pack-speedflip-musty", ROCKET_LEAGUE_PACKS.speedflipMusty, 10, "Mapa de Musty/speedflip después del clean cancel. Si llegás al balón pero raspás dos veces, cuenta como intento no limpio.", "#fbbf24"),
    RL_MECHANIC_DRILLS.recoveryChain,
    makeRlWorkshopSubtask("workshop-ice-rings-recovery", ROCKET_LEAGUE_WORKSHOP_MAPS.iceRings, 15, "Ice Rings en modo recovery: no busques speedrun. Caé con ruedas, powerslide y recuperá control después de cada choque o caída incómoda.", "#34d399"),
    makeRlMentalSubtask("mental-recovery-review", "Recovery review", "Anotá 1 momento donde quedaste muerto y cómo lo vas a recuperar mañana.", 5),
  ], { primaryFocus: "speedflip" }),
  makeRlPlan("dribble-flick", "Dribble + Flick Day", "Control de suelo que amenaza gol", [
    makeRlWorkshopSubtask("workshop-dribbling-challenge-1-remastered", ROCKET_LEAGUE_WORKSHOP_MAPS.dribblingChallenge1Remastered, 15, "No corras. Balanceá la pelota y reiniciá cuando se caiga. Meta: control estable, no speedrun.", "#fb7185"),
    RL_MECHANIC_DRILLS.basicFlicks,
    makeRlPackSubtask("pack-ground-shots", ROCKET_LEAGUE_PACKS.groundShots, 10, "Terminá los dribbles con tiro simple. Si el tiro queda débil, revisá el primer toque.", "#34d399"),
    makeRlMentalSubtask("mental-flick-review", "Revisión de posesión", "Escribí cuándo regalaste la pelota por apurarte. La respuesta suele ser: primer toque sin intención.", 15),
  ], { primaryFocus: "dribbling" }),
  makeRlPlan("air-roll-shots", "Air Roll Shot Day", "Ajustar el carro para tirar fuerte sin girar por girar", [
    makeRlWorkshopSubtask("workshop-ice-rings-air-roll", ROCKET_LEAGUE_WORKSHOP_MAPS.iceRings, 15, "Rings suave: air roll solo para alinear. Si perdés control, soltá air roll y estabilizá.", "#e879f9"),
    RL_MECHANIC_DRILLS.airRollShotControl,
    makeRlPackSubtask("pack-air-roll-shots", ROCKET_LEAGUE_PACKS.airRollShots, 10, "Buscá contacto limpio: air roll corrige ángulo, el flip genera potencia.", "#e879f9"),
    makeRlMentalSubtask("mental-airroll-review", "Air roll review", "Marcá si giraste por costumbre o por corrección real. Menos giro, más impacto limpio.", 15),
  ], { primaryFocus: "aerial" }),
  makeRlPlan("saves-shadow", "Saves + Shadow Day", "Defender sin pánico ni clears al centro", [
    RL_MECHANIC_DRILLS.shadowPatience,
    makeRlPackSubtask("pack-hard-saves", ROCKET_LEAGUE_PACKS.hardSaves, 10, "Salvá fuerte hacia esquina. Si despejás al centro, repetí el intento.", "#f472b6"),
    makeRlPackSubtask("pack-shadow-defense", ROCKET_LEAGUE_PACKS.shadowDefense, 10, "Aguantá la distancia. No te tires si el rival todavía no perdió control.", "#818cf8"),
    makeRlPackSubtask("pack-recovery-training", ROCKET_LEAGUE_PACKS.recoveryTraining, 15, "Recovery training sin modos extra: caídas incómodas, half flips y salida limpia. Si querés Workshop ese día, usá Medieval Rings.", "#38bdf8"),
    makeRlMentalSubtask("mental-defense-review", "Defensa sin tilt", "Anotá si defendiste por miedo o por lectura. La meta es paciencia, no adivinar.", 5),
  ], { primaryFocus: "recoveries" }),
  makeRlPlan("wall-backboard", "Wall + Backboard Day", "Pared útil, lectura y recovery", [
    RL_MECHANIC_DRILLS.wallControl,
    makeRlPackSubtask("pack-backboard", ROCKET_LEAGUE_PACKS.backboardReads, 10, "Leé pared antes de saltar; si llegás tarde, defendé. Aterrizá listo para la siguiente jugada.", "#60a5fa"),
    makeRlWorkshopSubtask("workshop-ice-rings-wall-recovery", ROCKET_LEAGUE_WORKSHOP_MAPS.iceRings, 15, "Rings suave para control y recoveries. Si chocás mucho, soltá air roll y priorizá ruta limpia antes que velocidad.", "#22d3ee"),
    makeRlPackSubtask("pack-aerials-off-wall", ROCKET_LEAGUE_PACKS.aerialsOffWall, 10, "Salidas de pared con intención. Si el setup es malo, no fuerces el aerial.", "#38bdf8"),
    makeRlMentalSubtask("mental-wall-review", "Wall review", "Escribí si saltaste tarde o temprano. Ajustar timing vale más que pegar fuerte.", 5),
  ], { primaryFocus: "recoveries" }),
  makeRlPlan("ground-to-air", "Ground to Air Day", "Levantar pelota sin regalar posesión", [
    makeRlWorkshopSubtask("workshop-air-dribble-gauntlet", ROCKET_LEAGUE_WORKSHOP_MAPS.airDribbleGauntlet, 15, "Usá niveles fáciles. Meta: setup limpio + 1 toque útil. Nada de forzar clips.", "#22d3ee"),
    RL_MECHANIC_DRILLS.groundToAirIntro,
    makeRlPackSubtask("pack-plat-diamond", ROCKET_LEAGUE_PACKS.platDiamond, 10, "Aplicá lo básico: primer toque, setup, decisión. Si no hay control, no salgas al aire.", "#34d399"),
    RL_MECHANIC_DRILLS.awkwardLanding,
    makeRlMentalSubtask("mental-airdribble-review", "Setup review", "Anotá si el primer toque levantó bien la pelota o si empezaste el air dribble perdido.", 10),
  ], { primaryFocus: "aerial" }),
  makeRlPlan("low-boost-rebounds", "Low Boost + Clean Cancel", "Control con poco boost + speedflip limpio en baja presión", [
    RL_SPEEDFLIP_DAR_CLEAN_CANCEL_SUBTASK,
    RL_MECHANIC_DRILLS.lowBoostDefense,
    makeRlPackSubtask("pack-basic-rebounds", ROCKET_LEAGUE_PACKS.basicRebounds, 10, "Leé el rebote antes de saltar. Si llegás tarde, fake challenge y recuperá.", "#fbbf24"),
    makeRlWorkshopSubtask("workshop-20xx-dribble-challenge", ROCKET_LEAGUE_WORKSHOP_MAPS.twentyXXDribbleChallenge, 15, "Dribbling suave para control fino. No necesitás terminarlo: necesitás tocar mejor.", "#fb7185"),
    makeRlMentalSubtask("mental-boost-review", "Boost review", "Anotá cuándo buscaste boost grande y dejaste la jugada. Cambiá por pads pequeños.", 5),
  ], { primaryFocus: "recoveries" }),
  makeRlPlan("one-v-one-decision", "1v1 Decision + Kickoff Clean", "No regalar posesión y entrar a cada kickoff con calma", [
    RL_SPEEDFLIP_DAR_CLEAN_CANCEL_SUBTASK,
    RL_MECHANIC_DRILLS.firstTouchControl,
    makeRlPackSubtask("pack-shots-miss", ROCKET_LEAGUE_PACKS.shotsYouShouldntMiss, 10, "No fallar tiros ganables. Primero arco grande, luego precisión.", "#34d399"),
    RL_MECHANIC_DRILLS.driftCuts,
    makeRlPackSubtask("pack-powershots", ROCKET_LEAGUE_PACKS.powershots, 10, "Tirá fuerte solo si el balón queda delante. Si queda atrás, control primero.", "#fbbf24"),
  ], { primaryFocus: "decision" }),
]);

export function getRocketLeagueDateKey(date = new Date()) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getRocketLeaguePlanForDate(dateKey = getRocketLeagueDateKey()) {
  const seed = String(dateKey).split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const weeklyFocus = getRocketLeagueWeeklyFocus(dateKey);
  const focusRole = getRocketLeagueFocusRole(dateKey);
  const focusPlans = ROCKET_LEAGUE_TRAINING_PLANS.filter(plan => plan.primaryFocus === weeklyFocus.id);
  const varietyPlans = ROCKET_LEAGUE_TRAINING_PLANS.filter(plan => plan.primaryFocus !== weeklyFocus.id);
  const pool = focusRole.type === "focus" && focusPlans.length ? focusPlans : (varietyPlans.length ? varietyPlans : ROCKET_LEAGUE_TRAINING_PLANS);
  return pool[seed % pool.length];
}

export function getRocketLeaguePlanById(planId) {
  return ROCKET_LEAGUE_TRAINING_PLANS.find(plan => plan.id === planId) || null;
}

export function getRocketLeagueSubtaskTargetSeconds(planId, subtaskId) {
  const plan = getRocketLeaguePlanById(planId);
  const subtask = plan?.subtasks?.find(task => task.id === subtaskId);
  return subtask ? Math.max(0, Math.floor(Number(subtask.minutes) || 0) * 60) : 0;
}

export function createRocketLeagueCurrent(dateKey = getRocketLeagueDateKey(), planId = getRocketLeaguePlanForDate(dateKey).id) {
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
