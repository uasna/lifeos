// Rocket League static data + pure planning helpers extracted from LifeOS.jsx.
// Keep this module dependency-free: no React, no Supabase, no browser APIs.

// ── Rocket League static training system ────────────────────────
// Rocket League fundamentals roadmap. Workshop maps are paused until further notice; active training uses Freeplay + Training Packs.

export const ROCKET_LEAGUE_SESSION_MINUTES = 90;
export const ROCKET_LEAGUE_PARENT_QUEST_ID = 2;

export const ROCKET_LEAGUE_PROFILE = Object.freeze({
  duel: "1v1 Plat II",
  doubles: "2v2 Plat II",
  standard: "3v3 Plat II",
  platform: "Epic · Freeplay + Training Packs",
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
  "Workshop queda pausado hasta nuevo aviso: no aparece en la rutina activa.",
  "La sesión activa usa Freeplay + Training Packs para controlar mejor la dificultad.",
  "Dribbling Challenge 1 Remastered y mapas similares quedan solo como biblioteca/benchmark manual, no como misión diaria.",
  "Si más adelante se reactiva Workshop, debe volver como bloque opcional corto, nunca como foco principal para noob.",
]);

export const ROCKET_LEAGUE_WORKSHOP_MAPS = Object.freeze({
  dribblingChallenge1Remastered: {
    name: "Dribbling Challenge 1 Remastered",
    source: "BakkesPlugins map · Workshop normal",
    focus: "dribbling en suelo, balance y control fino",
    kind: "Dribbling",
    modeSafe: true,
    activeRotation: false,
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
    activeRotation: false,
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
    activeRotation: false,
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
    activeRotation: false,
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
    activeRotation: false,
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

export const ROCKET_LEAGUE_ROADMAP_START_DATE_KEY = "2026-05-27";

export const ROCKET_LEAGUE_TWO_WEEK_CYCLES = Object.freeze([
  Object.freeze({
    cycleIndex: 0,
    weekRange: "Semanas 1–2",
    id: "shots-rotation",
    label: "Semanas 1–2 · Shots simples + powershots + rotación básica 2v2",
    short: "Shots + powershots",
    goal: "convertir tiros ganables, powershots, clears y rotación simple en hábitos antes de meter mecánicas flashy",
    planBaseId: "cycle-shots-rotation",
    accent: "#fbbf24",
    newMechanicRule: "Ninguna mecánica avanzada nueva. Air roll solo sirve para cuadrar el carro antes del impacto; no se entrena como mecánica separada.",
  }),
  Object.freeze({
    cycleIndex: 1,
    weekRange: "Semanas 3–4",
    id: "ground-dribble",
    label: "Semanas 3–4 · Ground dribble básico",
    short: "Ground dribble",
    goal: "llevar la pelota con control, no regalar posesión y terminar con tiro simple",
    planBaseId: "cycle-ground-dribble",
    accent: "#fb7185",
    newMechanicRule: "Una sola mecánica nueva: ground dribble básico. Flicks solo si el carry fue estable.",
  }),
  Object.freeze({
    cycleIndex: 2,
    weekRange: "Semanas 5–6",
    id: "aerial-control",
    label: "Semanas 5–6 · Aerial control direccional",
    short: "Aerial control",
    goal: "dirigir el carro hacia donde querés, leer balones simples y caer útil después del toque",
    planBaseId: "cycle-aerial-control",
    accent: "#38bdf8",
    newMechanicRule: "Una sola mecánica nueva: control aéreo direccional. Sin air dribble avanzado.",
  }),
  Object.freeze({
    cycleIndex: 3,
    weekRange: "Semana 7+",
    id: "speedflip-clean",
    label: "Semana 7+ · Speedflip limpio",
    short: "Speedflip limpio",
    goal: "pulir kickoff y aterrizaje plano sin convertirlo en spam diario sin propósito",
    planBaseId: "cycle-speedflip-clean",
    accent: "#a78bfa",
    newMechanicRule: "Speedflip entra tarde: 5–10 min de mantenimiento 2–3 veces/semana o bloque principal solo en este ciclo.",
  }),
]);

export const ROCKET_LEAGUE_DAILY_FOCUSES = ROCKET_LEAGUE_TWO_WEEK_CYCLES;
export const ROCKET_LEAGUE_WEEKLY_FOCUSES = ROCKET_LEAGUE_TWO_WEEK_CYCLES;

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

export function getRocketLeagueRoadmapWeekNumber(dateKey = getRocketLeagueDateKey()) {
  const start = parseRocketLeagueDateKey(ROCKET_LEAGUE_ROADMAP_START_DATE_KEY);
  const current = parseRocketLeagueDateKey(dateKey);
  start.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((current.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return Math.max(1, Math.floor(Math.max(0, diffDays) / 7) + 1);
}

export function getRocketLeagueCycleFocus(dateKey = getRocketLeagueDateKey()) {
  const weekNumber = getRocketLeagueRoadmapWeekNumber(dateKey);
  const cycle = weekNumber <= 2
    ? ROCKET_LEAGUE_TWO_WEEK_CYCLES[0]
    : weekNumber <= 4
      ? ROCKET_LEAGUE_TWO_WEEK_CYCLES[1]
      : weekNumber <= 6
        ? ROCKET_LEAGUE_TWO_WEEK_CYCLES[2]
        : ROCKET_LEAGUE_TWO_WEEK_CYCLES[3];
  return Object.freeze({
    ...cycle,
    weekNumber,
    cycleWeek: cycle.cycleIndex < 3 ? ((weekNumber - 1) % 2) + 1 : Math.max(1, weekNumber - 6),
    roadmapLabel: `Semana ${weekNumber} · ${cycle.short}`,
  });
}

export function getRocketLeagueDailyFocus(dateKey = getRocketLeagueDateKey()) {
  return getRocketLeagueCycleFocus(dateKey);
}

export function getRocketLeagueWeeklyFocus(dateKey = getRocketLeagueDateKey()) {
  return getRocketLeagueCycleFocus(dateKey);
}

export function getRocketLeagueFocusRole(dateKey = getRocketLeagueDateKey()) {
  const focus = getRocketLeagueCycleFocus(dateKey);
  if (focus.id === "speedflip-clean") {
    return { type: "advanced", label: "Ciclo avanzado", detail: "speedflip solo después de consolidar shots, ground dribble y aerial control" };
  }
  return { type: "cycle", label: "Ciclo de 2 semanas", detail: "máximo 1 mecánica nueva a la vez; fundamentos diarios se mantienen" };
}

export function getSecondsUntilNextRocketWeeklyFocus(now = Date.now()) {
  const current = new Date(now);
  const dateKey = getRocketLeagueDateKey(current);
  const focus = getRocketLeagueCycleFocus(dateKey);
  const start = parseRocketLeagueDateKey(ROCKET_LEAGUE_ROADMAP_START_DATE_KEY);
  start.setHours(0, 0, 0, 0);
  let boundaryWeek = focus.cycleIndex < 3 ? (focus.cycleIndex + 1) * 2 + 1 : getRocketLeagueRoadmapWeekNumber(dateKey) + 1;
  const next = new Date(start);
  next.setDate(start.getDate() + (boundaryWeek - 1) * 7);
  next.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((next.getTime() - now) / 1000));
}

export function inferRocketLeaguePrimaryFocus(id = "") {
  const key = String(id).toLowerCase();
  if (key.includes("shot") || key.includes("rotation")) return "shots-rotation";
  if (key.includes("ground") || key.includes("dribble") || key.includes("first-touch")) return "ground-dribble";
  if (key.includes("aerial") || key.includes("rebound") || key.includes("backboard")) return "aerial-control";
  if (key.includes("speedflip") || key.includes("kickoff")) return "speedflip-clean";
  if (key.includes("recovery") || key.includes("wave")) return "recoveries";
  if (key.includes("save") || key.includes("shadow") || key.includes("defense") || key.includes("boost")) return "defense";
  if (key.includes("review")) return "review";
  return "shots-rotation";
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

const makeReplayNoteTask = (id, instruction = "5 min: revisá mentalmente 1 error repetido y 1 decisión correcta. Si hubo tilt, cerrá sin ranked.") => withRlTrainingRole(
  makeRlMentalSubtask(id, "Replay / mental note", instruction, 5),
  RL_TRAINING_ROLES.REVIEW,
  "Este bloque convierte la práctica en aprendizaje. No se reemplaza por otra partida."
);

export const ROCKET_LEAGUE_TRAINING_PLANS = Object.freeze([
  makeRlPlan("cycle-shots-rotation", "Ciclo 1–2 · Shots simples + powershots + rotación básica 2v2", "Consistencia de tiros, powershots, clears y decisiones simples", [
    makeApplicationTask(
      makeRlPackSubtask("main-powershots-pack-30", ROCKET_LEAGUE_PACKS.powershots, 30, "Training Pack: pegá después del bote, apuntá y priorizá potencia limpia. Usá air roll básico solo para cuadrar el carro antes del impacto; si empezás a girar por girar, repetí.", "#fbbf24"),
      "Foco principal del ciclo: shots simples + powershots. El air roll aquí es ajuste de ángulo, no una mecánica nueva.",
      RL_TRAINING_ROLES.MAIN
    ),
    makeRlBreakSubtask("break-shots-10", 10),
    makeApplicationTask(
      makeRlPackSubtask("apply-air-roll-shot-angle-20", ROCKET_LEAGUE_PACKS.airRollShots, 20, "Aplicación controlada: ajustá el ángulo del carro con air roll básico antes del contacto. Meta: pegar recto, fuerte y con intención; no air roll estético.", "#e879f9"),
      "Mismo foco, otro contexto: powershots con ajuste de carro. No cuenta como aprender air roll completo."
    ),
    makeApplicationTask(
      {
        ...RL_MECHANIC_DRILLS.recoveryChain,
        id: "maintenance-recoveries-10",
        minutes: 10,
        instruction: "Fundamento de mantenimiento: después de cada tiro, caer con ruedas, powerslide si hace falta y salir hacia pad pequeño."
      },
      "Fundamento diario que no cuenta como mecánica nueva.",
      RL_TRAINING_ROLES.SUPPORT
    ),
    makeReplayNoteTask("replay-note-shots-5", "5 min: anotá si fallaste por timing, mala dirección, poco boost o ansiedad al tirar."),
    makeMentalCloseTask("close-shots-5", "5 min: cerrá con 3 tiros simples perfectos o una nota clara de qué repetir mañana."),
  ], {
    primaryFocus: "shots-rotation",
    primaryMechanicLabel: "Shots + powershots",
    supportLabel: "Semanas 1–2: shots simples, powershots y rotación básica 2v2. Air roll solo para ajustar el carro antes del tiro.",
    masteryNote: "Mejor meter tiros/powershots al 80%. El air roll del ciclo 1 solo alinea el carro; no es otra mecánica a masterizar.",
  }),

  makeRlPlan("cycle-ground-dribble", "Ciclo 3–4 · Ground dribble básico", "Carry simple, primer toque útil y posesión", [
    makeMainMechanicTask(
      "main-ground-dribble-freeplay-30",
      "Ground dribble básico · 30 min",
      "carry estable sin Workshop",
      "Freeplay: llevar la pelota encima del carro 3–5s, caminar sin boost, círculos amplios y cortes suaves. Si se cae, reiniciá sin tilt.",
      30,
      "#fb7185"
    ),
    makeRlBreakSubtask("break-ground-dribble-10", 10),
    makeApplicationTask(
      {
        ...RL_MECHANIC_DRILLS.firstTouchControl,
        id: "apply-first-touch-carry-20",
        minutes: 20,
        instruction: "Aplicación: primer toque hacia espacio + intento de carry. Si el primer toque te aleja de la jugada, repetí."
      },
      "Aplica el ground dribble a situaciones más parecidas a ranked."
    ),
    makeApplicationTask(
      makeRlPackSubtask("maintenance-shots-10", ROCKET_LEAGUE_PACKS.shotsYouShouldntMiss, 10, "Mantenimiento: tiros simples después de controlar. No flick avanzado si el carry no fue estable.", "#34d399"),
      "Mantiene shots sin aprender otra mecánica nueva.",
      RL_TRAINING_ROLES.SUPPORT
    ),
    makeReplayNoteTask("replay-note-ground-dribble-5", "5 min: anotá si perdiste posesión por acelerar, usar boost de más o tocar muy fuerte."),
    makeMentalCloseTask("close-ground-dribble-5", "5 min: cerrá con 2 carries limpios o una nota del error principal."),
  ], {
    primaryFocus: "ground-dribble",
    primaryMechanicLabel: "Ground dribble",
    supportLabel: "Semanas 3–4: una sola mecánica nueva. Dribbling en Freeplay, no Workshop difícil.",
    masteryNote: "Dribbling Challenge 1 Remastered queda fuera de la rutina activa hasta nuevo aviso.",
  }),

  makeRlPlan("cycle-aerial-control", "Ciclo 5–6 · Aerial control direccional", "Dirección aérea, reads simples y caída útil", [
    makeApplicationTask(
      makeRlPackSubtask("main-basic-rebounds-30", ROCKET_LEAGUE_PACKS.basicRebounds, 30, "Training Pack: leé el rebote, saltá con calma, dirigí el carro y aterrizá listo. No air dribble avanzado.", "#38bdf8"),
      "Foco principal: controlar dirección en el aire, no girar por estética.",
      RL_TRAINING_ROLES.MAIN
    ),
    makeRlBreakSubtask("break-aerial-control-10", 10),
    makeApplicationTask(
      makeRlPackSubtask("apply-aerials-off-wall-20", ROCKET_LEAGUE_PACKS.aerialsOffWall, 20, "Aplicación controlada: salidas simples de pared y control del carro. Si el setup es malo, priorizá recovery.", "#38bdf8"),
      "Mismo foco aplicado a pared/reads sin convertirlo en freestyle."
    ),
    makeApplicationTask(
      {
        ...RL_MECHANIC_DRILLS.awkwardLanding,
        id: "maintenance-awkward-landings-10",
        minutes: 10,
        instruction: "Mantenimiento: corregí el carro en el aire y caé con ruedas. El toque no sirve si quedás muerto."
      },
      "Fundamento diario: recoveries aéreas y aterrizaje útil.",
      RL_TRAINING_ROLES.SUPPORT
    ),
    makeReplayNoteTask("replay-note-aerial-control-5", "5 min: anotá si fallaste por mal despegue, mala lectura, poco boost o mala caída."),
    makeMentalCloseTask("close-aerial-control-5", "5 min: cerrá con 2 aéreos simples controlados o una nota clara de ajuste."),
  ], {
    primaryFocus: "aerial-control",
    primaryMechanicLabel: "Aerial control",
    supportLabel: "Semanas 5–6: dirección aérea básica. Sin air dribble avanzado ni rings por ahora.",
    masteryNote: "Aerial control no significa girar bonito: significa llegar, tocar útil y caer vivo.",
  }),

  makeRlPlan("cycle-speedflip-clean", "Semana 7+ · Speedflip limpio", "Kickoff eficiente, cancel limpio y aterrizaje plano", [
    withRlTrainingRole(
      {
        ...RL_SPEEDFLIP_DAR_CLEAN_CANCEL_SUBTASK,
        id: "main-speedflip-clean-30",
        title: "Speedflip limpio · 30 min",
        minutes: 30,
        instruction: "Bloque principal solo desde semana 7+: DAR sostenido, cancel limpio, caída plana. Si raspa doble, bajá a 75% y reducilo a mantenimiento."
      },
      RL_TRAINING_ROLES.MAIN,
      "Este foco entra tarde. No reemplaza shots, ground dribble ni aerial control; llega después de consolidarlos."
    ),
    makeRlBreakSubtask("break-speedflip-10", 10),
    makeApplicationTask(
      makeRlPackSubtask("apply-speedflip-pack-20", ROCKET_LEAGUE_PACKS.speedflipMusty, 20, "Aplicación controlada: mapa/pack de speedflip solo si el movimiento cae plano. Llegar al balón no basta.", "#a78bfa"),
      "Aplicación del speedflip limpio, no spam de intentos feos."
    ),
    makeApplicationTask(
      makeRlPackSubtask("maintenance-shots-speedflip-cycle-10", ROCKET_LEAGUE_PACKS.groundShots, 10, "Mantenimiento: 10 min de tiros simples para no perder fundamentos mientras pulís kickoff.", "#34d399"),
      "Fundamentos diarios: no abandonar tiros por aprender speedflip.",
      RL_TRAINING_ROLES.SUPPORT
    ),
    makeReplayNoteTask("replay-note-speedflip-5", "5 min: anotá clean rate, si raspó al inicio/final y si el kickoff dejó buena posición."),
    makeMentalCloseTask("close-speedflip-5", "5 min: cerrá con una nota. Si hubo frustración, speedflip queda mantenimiento 5–10 min, 2–3 veces/semana."),
  ], {
    primaryFocus: "speedflip-clean",
    primaryMechanicLabel: "Speedflip limpio",
    supportLabel: "Semana 7+: speedflip limpio. Antes de esto, solo mantenimiento corto si de verdad sobra energía.",
    masteryNote: "Speedflip no es prioridad diaria; entra cuando los fundamentos ya sostienen tu rango.",
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
