// Rocket League static data + pure planning helpers extracted from LifeOS.jsx.
// Keep this module dependency-free: no React, no Supabase, no browser APIs.

// ── Rocket League static training system ────────────────────────
// Epic-safe custom training + Workshop normal maps. Avoid extra-mode maps because Epic can bug with custom modes.

export const ROCKET_LEAGUE_SESSION_MINUTES = 90;
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
  REST: "Descanso",
});

export const RL_TRAINING_ROLES = Object.freeze({
  FIXED: "Bloque fijo",
  MAIN: "Foco principal",
  SUPPORT: "Apoyo técnico",
  VARIETY: "Variedad controlada",
  REVIEW: "Registro mental",
});

export const withRlTrainingRole = (task, role, reason = "", extra = {}) => Object.freeze({
  ...task,
  ...extra,
  trainingRole: role,
  roleReason: reason,
});

export const RL_FREEPLAY_SUBTASK = Object.freeze({
  id: "freeplay",
  title: "Freeplay agresivo",
  type: RL_SUBTASK_TYPES.FREEPLAY,
  minutes: 10,
  instruction: "Bloque fijo diario: powershots, recoveries, pads pequeños y cero pausa entre toques. No ranked frío.",
  focus: "ritmo + confianza",
  trainingRole: RL_TRAINING_ROLES.FIXED,
  roleReason: "Siempre va primero para entrar caliente; no compite con el foco principal.",
  accent: "#22d3ee",
});

export const RL_ONE_V_ONE_SUBTASK = Object.freeze({
  id: "optional-ranked-application",
  title: "Ranked / 1v1 opcional",
  type: RL_SUBTASK_TYPES.MATCHES,
  minutes: 0,
  targetCount: 3,
  noTimer: true,
  optional: true,
  instruction: "Opcional: jugá 1–3 partidas solo si todavía tenés ganas. No bloquea la misión de Rocket; si hoy solo querés entrenar, marcá los 90 min y cerrá.",
  focus: "aplicación opcional · no obligatorio",
  trainingRole: "Opcional",
  roleReason: "Ranked ya no es obligación. Primero entrenamiento limpio; competir solo cuando haya energía y mental estable.",
  accent: "#94a3b8",
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

export const makeRlBreakSubtask = (id = "break-10", minutes = 10, instruction = "Descanso real: soltá el control, agua, manos sueltas y cero TikTok para no enfriarte mentalmente.") => Object.freeze({
  id,
  title: `Descanso técnico · ${minutes} min`,
  type: RL_SUBTASK_TYPES.REST,
  minutes,
  instruction,
  focus: "recuperar manos + evitar fatiga",
  trainingRole: "Descanso técnico",
  roleReason: "Este bloque existe para que el bloque de 30 min sí se absorba; no lo saltes si estás cansado.",
  accent: "#86efac",
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
  trainingRole: RL_TRAINING_ROLES.MAIN,
  roleReason: "Esta sí es la mecánica que se está masterizando en el día de speedflip.",
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

export const ROCKET_LEAGUE_DAILY_FOCUSES = Object.freeze([
  Object.freeze({
    dayIndex: 0,
    id: "powershots",
    label: "Lunes · Powershots + precisión",
    short: "Powershots",
    goal: "pegar fuerte, limpio y con intención; no regalar tiros suaves en Platino",
    planBaseId: "daily-powershots",
    accent: "#fbbf24",
  }),
  Object.freeze({
    dayIndex: 1,
    id: "recoveries",
    label: "Martes · Recoveries + wavedash",
    short: "Recoveries",
    goal: "caer con ruedas, mantener momentum y volver rápido sin gastar boost de más",
    planBaseId: "daily-recoveries",
    accent: "#34d399",
  }),
  Object.freeze({
    dayIndex: 2,
    id: "dribbling",
    label: "Miércoles · Dribbling + primer toque",
    short: "Dribbling",
    goal: "controlar posesión, primer toque útil y no entregar la pelota por ansiedad",
    planBaseId: "daily-dribbling",
    accent: "#fb7185",
  }),
  Object.freeze({
    dayIndex: 3,
    id: "defense",
    label: "Jueves · Shadow defense + saves",
    short: "Defensa",
    goal: "defender sin regalar centro, salvar hacia esquina y salir vivo",
    planBaseId: "daily-defense",
    accent: "#60a5fa",
  }),
  Object.freeze({
    dayIndex: 4,
    id: "aerials",
    label: "Viernes · Aéreos básicos + reads",
    short: "Aéreos básicos",
    goal: "llegar a balones simples, leer rebotes y caer listo para la siguiente jugada",
    planBaseId: "daily-aerials",
    accent: "#38bdf8",
  }),
  Object.freeze({
    dayIndex: 5,
    id: "kickoffs",
    label: "Sábado · Kickoffs + 1v1 decision making",
    short: "Kickoffs",
    goal: "salidas consistentes, 50s, paciencia y decisiones de 1v1 sin ranked obligatorio",
    planBaseId: "daily-kickoffs",
    accent: "#a78bfa",
  }),
  Object.freeze({
    dayIndex: 6,
    id: "review",
    label: "Domingo · Review suave + mecánica débil",
    short: "Review",
    goal: "bajar carga, repetir lo que peor salió y cerrar la semana sin quemarte",
    planBaseId: "daily-review",
    accent: "#86efac",
  }),
]);

// Backward-compatible export name: the UI still imports this symbol,
// but v31.4 uses a daily fundamentals focus instead of flashy advanced rotations.
export const ROCKET_LEAGUE_WEEKLY_FOCUSES = ROCKET_LEAGUE_DAILY_FOCUSES;

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

export function getRocketLeagueDailyFocus(dateKey = getRocketLeagueDateKey()) {
  const d = parseRocketLeagueDateKey(dateKey);
  const mondayBasedDay = (d.getDay() + 6) % 7;
  return ROCKET_LEAGUE_DAILY_FOCUSES.find(f => f.dayIndex === mondayBasedDay) || ROCKET_LEAGUE_DAILY_FOCUSES[0];
}

export function getRocketLeagueWeeklyFocus(dateKey = getRocketLeagueDateKey()) {
  return getRocketLeagueDailyFocus(dateKey);
}

export function getRocketLeagueFocusRole(dateKey = getRocketLeagueDateKey()) {
  const focus = getRocketLeagueDailyFocus(dateKey);
  if (focus.id === "review") {
    return { type: "review", label: "Review suave", detail: "bajar carga, repetir el punto débil y preparar la siguiente semana" };
  }
  return { type: "focus", label: "Fundamento del día", detail: "90 min de entrenamiento: warmup, bloque fuerte, descanso, aplicación y cierre" };
}

export function getSecondsUntilNextRocketWeeklyFocus(now = Date.now()) {
  const d = new Date(now);
  const next = new Date(d);
  next.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((next.getTime() - now) / 1000));
}

export function inferRocketLeaguePrimaryFocus(id = "") {
  const key = String(id).toLowerCase();
  if (key.includes("power") || key.includes("shot")) return "powershots";
  if (key.includes("recovery") || key.includes("recoveries") || key.includes("wave")) return "recoveries";
  if (key.includes("dribble") || key.includes("first-touch") || key.includes("flick")) return "dribbling";
  if (key.includes("save") || key.includes("shadow") || key.includes("defense") || key.includes("boost")) return "defense";
  if (key.includes("aerial") || key.includes("rings") || key.includes("rebound") || key.includes("backboard")) return "aerials";
  if (key.includes("kickoff") || key.includes("one-v-one") || key.includes("decision") || key.includes("speedflip")) return "kickoffs";
  if (key.includes("review")) return "review";
  return "powershots";
}

export const makeRlPlan = (id, title, focus, variableBlocks, meta = {}) => {
  const blocks = [RL_FREEPLAY_SUBTASK, ...variableBlocks, RL_ONE_V_ONE_SUBTASK];
  const timedMinutes = blocks.reduce((sum, task) => sum + Math.max(0, Number(task.minutes) || 0), 0);
  return Object.freeze({
    id: `${id}-90m-fundamentals-v31-4`,
    baseId: id,
    title,
    focus,
    primaryFocus: meta.primaryFocus || inferRocketLeaguePrimaryFocus(id),
    primaryMechanicLabel: meta.primaryMechanicLabel || null,
    supportLabel: meta.supportLabel || "90 min: 10 warmup + 30 foco + 10 descanso + 25 aplicación + 10 ajuste + 5 cierre.",
    masteryNote: meta.masteryNote || "Hoy se entrena un fundamento útil para Platino/Diamond bajo. Ranked queda opcional.",
    balance: "90 min entrenamiento · ranked opcional",
    minutes: timedMinutes,
    subtasks: Object.freeze(blocks),
  });
};

const makeMainMechanicTask = (id, title, focus, instruction, minutes = 30, accent = "#fb7185") => withRlTrainingRole(
  makeRlMechanicSubtask(id, title, focus, instruction, minutes, accent),
  RL_TRAINING_ROLES.MAIN,
  "Bloque principal. Esta es la mecánica/fundamento que toca mejorar hoy; no lo mezcles con clips ni metas extra."
);

const makeApplicationTask = (task, reason = "Aplicación conectada del foco principal; no es una segunda mecánica a masterizar.", role = RL_TRAINING_ROLES.SUPPORT) => withRlTrainingRole(
  task,
  role,
  reason
);

const makeMentalCloseTask = (id, instruction = "5 min: anotá qué salió mejor, qué falló y qué vas a repetir mañana. Si hubo tilt, cerrá sin ranked.") => withRlTrainingRole(
  makeRlMentalSubtask(id, "Cierre técnico", instruction, 5),
  RL_TRAINING_ROLES.REVIEW,
  "Cierre corto para que el entrenamiento se convierta en aprendizaje real."
);

export const ROCKET_LEAGUE_TRAINING_PLANS = Object.freeze([
  makeRlPlan("daily-powershots", "Lunes · Powershots + precisión", "Tiros fuertes, clears y puntería útil", [
    makeMainMechanicTask(
      "main-powershots-30",
      "Powershots · 30 min",
      "pegar fuerte después del bote y tirar con intención",
      "Freeplay/training pack: esperá el bote, golpeá con potencia y apuntá. Si el tiro sale suave, repetí. Meta: menos tiros regalados y más clears útiles.",
      30,
      "#fbbf24"
    ),
    makeRlBreakSubtask("break-powershots-10", 10),
    makeApplicationTask(
      makeRlPackSubtask("apply-ground-shots-25", ROCKET_LEAGUE_PACKS.groundShots, 25, "Aplicación: tiros de suelo consistentes. No busqués clip; buscá contacto sólido y dirección.", "#fbbf24"),
      "Sigue siendo powershots: transformar potencia en tiros ganables."
    ),
    makeApplicationTask(
      makeRlPackSubtask("adjust-shots-miss-10", ROCKET_LEAGUE_PACKS.shotsYouShouldntMiss, 10, "Ajuste final: 10 min de tiros que no deberías fallar. Cada fallo se repite con calma.", "#fb923c"),
      "Microbloque de consistencia para cerrar tiros simples.",
      RL_TRAINING_ROLES.VARIETY
    ),
    makeMentalCloseTask("close-powershots-5"),
  ], {
    primaryFocus: "powershots",
    primaryMechanicLabel: "Powershots",
    supportLabel: "Lunes: potencia + precisión. Esto sube más rápido que mecánicas flashy en Platino.",
  }),

  makeRlPlan("daily-recoveries", "Martes · Recoveries + wavedash", "Caer bien, wavedash y mantener momentum", [
    makeMainMechanicTask(
      "main-recoveries-30",
      "Recoveries + wavedash · 30 min",
      "wavedash, powerslide landing y half flip",
      "30 min: cada salto/tiro termina con ruedas, powerslide si caés torcido y salida hacia pad pequeño. Si quedás muerto, repetí la secuencia.",
      30,
      "#34d399"
    ),
    makeRlBreakSubtask("break-recoveries-10", 10),
    makeApplicationTask(
      makeRlPackSubtask("apply-recovery-pack-25", ROCKET_LEAGUE_PACKS.recoveryTraining, 25, "Aplicación: recoveries incómodas. La meta no es tocar rápido; es volver útil a la jugada.", "#34d399"),
      "Aplicación directa: salir vivo de posiciones feas."
    ),
    makeApplicationTask(
      RL_MECHANIC_DRILLS.halfFlipRecovery,
      "Microbloque conectado: half flip limpio para volver sin gastar boost de más.",
      RL_TRAINING_ROLES.VARIETY
    ),
    makeMentalCloseTask("close-recoveries-5"),
  ], {
    primaryFocus: "recoveries",
    primaryMechanicLabel: "Recoveries",
    supportLabel: "Martes: caer con ruedas, wavedash y momentum. Ser rápido empieza por no quedar muerto.",
  }),

  makeRlPlan("daily-dribbling", "Miércoles · Dribbling + primer toque", "Posesión, control y primer toque útil", [
    makeApplicationTask(
      makeRlWorkshopSubtask("main-dribbling-remastered-30", ROCKET_LEAGUE_WORKSHOP_MAPS.dribblingChallenge1Remastered, 30, "30 min de dribbling. No speedrun: pelota estable, microtoques y paciencia. Si se cae, reiniciá sin tiltearte.", "#fb7185"),
      "Bloque principal: control en suelo y posesión.",
      RL_TRAINING_ROLES.MAIN
    ),
    makeRlBreakSubtask("break-dribbling-10", 10),
    makeApplicationTask(
      {
        ...RL_MECHANIC_DRILLS.firstTouchControl,
        id: "apply-first-touch-25",
        minutes: 25,
        instruction: "25 min: cada balón debe tener intención. Primer toque hacia espacio, pared, tiro o control; si te aleja de la jugada, repetí."
      },
      "Aplicación: el primer toque decide si atacás o regalás posesión."
    ),
    makeApplicationTask(
      RL_MECHANIC_DRILLS.basicFlicks,
      "Microbloque de salida: flick simple solo cuando la pelota ya está controlada.",
      RL_TRAINING_ROLES.VARIETY
    ),
    makeMentalCloseTask("close-dribbling-5"),
  ], {
    primaryFocus: "dribbling",
    primaryMechanicLabel: "Dribbling",
    supportLabel: "Miércoles: posesión real. Controlar antes de tirar, no pegar por pegar.",
  }),

  makeRlPlan("daily-defense", "Jueves · Shadow defense + saves", "Defensa paciente, saves y clears hacia esquina", [
    makeApplicationTask(
      makeRlPackSubtask("main-shadow-defense-30", ROCKET_LEAGUE_PACKS.shadowDefense, 30, "30 min de shadow: cubrí net, no te tires de más y esperá el toque malo del rival. Save hacia esquina, no al centro.", "#60a5fa"),
      "Bloque principal: defensa real, no mecánica de clip.",
      RL_TRAINING_ROLES.MAIN
    ),
    makeRlBreakSubtask("break-defense-10", 10),
    makeApplicationTask(
      makeRlPackSubtask("apply-hard-saves-25", ROCKET_LEAGUE_PACKS.hardSaves, 25, "Aplicación: saves incómodos y clears con intención. Repetí cada despeje al centro.", "#60a5fa"),
      "Aplicación directa: salvar y salir, no solo tocar el balón."
    ),
    makeApplicationTask(
      RL_MECHANIC_DRILLS.lowBoostDefense,
      "Microbloque: defender con poco boost usando pads pequeños y paciencia.",
      RL_TRAINING_ROLES.VARIETY
    ),
    makeMentalCloseTask("close-defense-5"),
  ], {
    primaryFocus: "defense",
    primaryMechanicLabel: "Defensa",
    supportLabel: "Jueves: si te meten menos goles tontos, subís más rápido.",
  }),

  makeRlPlan("daily-aerials", "Viernes · Aéreos básicos + reads", "Aerial simple, rebotes y backboard reads sin freestyle", [
    makeApplicationTask(
      makeRlWorkshopSubtask("main-ice-rings-30", ROCKET_LEAGUE_WORKSHOP_MAPS.iceRings, 30, "30 min de control aéreo básico. Air roll solo para corregir; menos choques > más velocidad.", "#38bdf8"),
      "Bloque principal: control aéreo básico y estabilidad.",
      RL_TRAINING_ROLES.MAIN
    ),
    makeRlBreakSubtask("break-aerials-10", 10),
    makeApplicationTask(
      makeRlPackSubtask("apply-basic-rebounds-25", ROCKET_LEAGUE_PACKS.basicRebounds, 25, "Aplicación: leer rebotes simples, llegar a tiempo y caer listo para la siguiente jugada.", "#38bdf8"),
      "Aplicación del control aéreo a balones reales."
    ),
    makeApplicationTask(
      makeRlPackSubtask("adjust-backboard-10", ROCKET_LEAGUE_PACKS.backboardReads, 10, "Microbloque: backboard básico. Si no llegás cómodo, priorizá lectura y recovery.", "#22d3ee"),
      "Variación corta para reads, no air dribble ni freestyle.",
      RL_TRAINING_ROLES.VARIETY
    ),
    makeMentalCloseTask("close-aerials-5"),
  ], {
    primaryFocus: "aerials",
    primaryMechanicLabel: "Aéreos básicos",
    supportLabel: "Viernes: aéreos simples que sí aparecen en ranked, no clips avanzados.",
  }),

  makeRlPlan("daily-kickoffs", "Sábado · Kickoffs + 1v1 decision making", "Kickoffs consistentes, 50s y decisiones sin ranked obligatorio", [
    makeMainMechanicTask(
      "main-kickoffs-30",
      "Kickoffs básicos + 50s · 30 min",
      "salida consistente, diagonal/front flip útil y primer 50",
      "30 min: front flip/diagonal kickoff limpio, llegar centrado y jugar el 50. No conviertas todo en speedflip; primero consistencia.",
      30,
      "#a78bfa"
    ),
    makeRlBreakSubtask("break-kickoffs-10", 10),
    makeApplicationTask(
      makeRlPackSubtask("apply-speedflip-maintenance-10", ROCKET_LEAGUE_PACKS.speedflipMusty, 10, "Mantenimiento opcional dentro del día: máximo 10 min. Si raspás dos veces, bajá a 75% y no sigás spameando.", "#fbbf24"),
      "Speedflip queda como mantenimiento corto, no como obsesión diaria.",
      RL_TRAINING_ROLES.VARIETY
    ),
    makeApplicationTask(
      {
        ...RL_MECHANIC_DRILLS.shadowPatience,
        id: "apply-1v1-decisions-25",
        title: "1v1 decision making sin ranked · 25 min",
        minutes: 25,
        instruction: "25 min en freeplay/custom o casual mental: kickoff, primer 50, shadow y cuándo desafiar. No es cola ranked obligatoria."
      },
      "Aplicación de 1v1 sin ranked: paciencia, shadow y cuándo desafiar.",
      RL_TRAINING_ROLES.SUPPORT
    ),
    makeMentalCloseTask("close-kickoffs-5", "5 min: anotá si perdiste kickoffs por timing, dirección o ansiedad. Ranked queda opcional."),
  ], {
    primaryFocus: "kickoffs",
    primaryMechanicLabel: "Kickoffs",
    supportLabel: "Sábado: kickoffs y decisiones. Speedflip solo 10 min si está limpio; ranked opcional.",
  }),

  makeRlPlan("daily-review", "Domingo · Review suave + mecánica débil", "Repetir lo que peor salió y cerrar sin quemarte", [
    makeMainMechanicTask(
      "main-weekly-weakness-30",
      "Mecánica débil de la semana · 30 min",
      "repetir el fundamento que más falló",
      "Elegí una: powershots, recoveries, dribbling, defensa, aéreos o kickoffs. 30 min suave con calidad, no cantidad.",
      30,
      "#86efac"
    ),
    makeRlBreakSubtask("break-review-10", 10, "Descanso real: domingo es para absorber, no para quemarte."),
    makeApplicationTask(
      makeRlPackSubtask("apply-plat-diamond-25", ROCKET_LEAGUE_PACKS.platDiamond, 25, "Aplicación general Plat–Diamond: solo repetir lo que conecta con el punto débil elegido.", "#86efac"),
      "Aplicación general de baja carga para cerrar la semana."
    ),
    makeApplicationTask(
      RL_MECHANIC_DRILLS.firstTouchControl,
      "Microbloque universal: primer toque útil para llevar el review a partida.",
      RL_TRAINING_ROLES.VARIETY
    ),
    makeMentalCloseTask("close-review-5", "5 min: escribí la mecánica que mejoró, la que queda débil y el foco del lunes."),
  ], {
    primaryFocus: "review",
    primaryMechanicLabel: "Review",
    supportLabel: "Domingo: calidad, repaso y cierre. No es día para aprender una mecánica nueva.",
  }),
]);

export function getRocketLeaguePlanForDate(dateKey = getRocketLeagueDateKey()) {
  const dailyFocus = getRocketLeagueDailyFocus(dateKey);
  return ROCKET_LEAGUE_TRAINING_PLANS.find(plan => plan.baseId === dailyFocus.planBaseId) || ROCKET_LEAGUE_TRAINING_PLANS[0];
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

export function getRocketLeagueDateKey(date = new Date()) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
