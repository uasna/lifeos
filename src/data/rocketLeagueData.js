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
    name: "Powershots · Yeeza",
    code: "7028-5E10-88EF-E83E",
    focus: "pegar fuerte, limpio y con dirección",
  },
  groundShots: {
    name: "Ground Shots · Poquito",
    code: "6EB1-79B2-33B8-681C",
    focus: "tiros abiertos, básicos y repetibles",
  },
  mainShootingPair: {
    name: "2 mapas principales · Yeeza + Poquito",
    code: "Yeeza 7028-5E10-88EF-E83E · Poquito 6EB1-79B2-33B8-681C",
    focus: "15 min powershots + 15 min ground shots; potencia, dirección y tiros ganables",
  },
  powershotPractice: {
    name: "Powershot Practice",
    code: "C9E4-0F05-B71A-C322",
    focus: "potencia limpia en tiros abiertos de viernes",
  },
  tenShotsToMaster: {
    name: "10 Shots to Master",
    code: "8A9B-4843-7039-8611",
    focus: "precisión y lectura de tiros ganables",
  },
  airRollShotsBismo: {
    name: "Air Roll Shots",
    code: "B16C-8FDA-D26C-32FD",
    focus: "ajuste de ángulo con air roll antes del impacto",
  },
  shootingConsistency: {
    name: "Shooting Consistency",
    code: "4912-A5C9-9A56-55D",
    focus: "volumen limpio para pegar consistente sin sobrepensar",
  },
  shootingComplementaryRotation: {
    name: "Mapa complementario · rotación shooting",
    code: "10 Shots 8A9B-4843-7039-8611 · Air Roll B16C-8FDA-D26C-32FD · Consistency 4912-A5C9-9A56-55D",
    focus: "precisión, air roll shot o consistencia como complemento",
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
    focus: "defender sin regalar espacio ni saltar antes de tiempo",
  },
  defensiveSituations: {
    name: "Defensive Situations",
    code: "E494-9C3E-61BD-9097",
    focus: "rotación defensiva, shadow y decisiones bajo presión",
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
  speedflipKickoffTest: {
    name: "Speedflip Kickoff Test",
    code: "A503-264C-A7EB-D282",
    focus: "kickoff con speedflip limpio y contacto estable",
  },
  masteringKickoffs: {
    name: "Mastering Kickoffs",
    code: "8939-4C63-B233-83C1",
    focus: "saques consistentes, contacto central y salida útil",
  },
  basicKickoffs: {
    name: "Kickoffs básicos",
    code: "4125-17D5-2C7B-EBEF",
    focus: "kickoffs limpios sin buscar mecánica de más",
  },
  airRollShots: {
    name: "Power shot + Air roll shot",
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
  "Si un código no funciona, dejá nota y buscalo por nombre dentro del juego antes de cambiar el plan.",
  "Si un mapa Workshop no está instalado, usá el training pack alternativo indicado en ese bloque.",
  "En Epic, Workshop solo entra si BakkesMod + Workshop Map Loader ya funcionan. Si no, fallback sin perder tiempo.",
  "No agregar más de un mapa nuevo por día: si el bloque ya pide un Workshop nuevo y no está listo, usá fallback.",
  "Air roll shots no es freestyle: air roll solo corrige el ángulo antes del impacto.",
  "No saltarse descansos. La rutina cabe en 90 minutos porque los descansos ya están dentro.",
]);

export const ROCKET_LEAGUE_WORKSHOP_MAPS = Object.freeze({
  aimTrainingByCoCo: {
    name: "Aim Training · By CoCo",
    source: "Workshop",
    focus: "tiros abiertos y puntería con lectura rápida",
    kind: "Aim / Shooting",
    modeSafe: true,
    activeRotation: true,
    fallbackPackKey: "groundShots",
    avoid: "No buscar score perfecto; mantener tiros limpios y consistentes.",
    howToUse: "Usalo solo si ya está instalado. En Epic requiere BakkesMod + Workshop Map Loader; si no está listo, hacé Ground Shots de Poquito.",
  },
  speedJumpRings2: {
    name: "Speed Jump: Rings 2",
    source: "Workshop",
    focus: "control aéreo y air roll sin convertirlo en freestyle",
    kind: "Rings / Air roll",
    modeSafe: true,
    activeRotation: true,
    fallbackPackKey: "airRollShotsAlt",
    avoid: "No speedrun. No girar por girar. Estabilizar primero, corregir ángulo después.",
    howToUse: "Si ya está instalado, 12 min de control. Si no, fallback: Air Roll Shots 84D2-072D-80CF-7D0D.",
  },
  speedJumpRings3: {
    name: "Speed Jump: Rings 3",
    source: "Workshop",
    focus: "control aéreo progresivo con ruta más exigente",
    kind: "Rings / Air roll",
    modeSafe: true,
    activeRotation: true,
    fallbackPackKey: "airRollShots",
    avoid: "No clips, no freestyle, no pelear el mapa si estás tilteado.",
    howToUse: "Solo si ya está instalado. Si no, fallback: Power shot + Air roll shot 1C4E-D311-1506-B6C1.",
  },
  dribble2Overhaul: {
    name: "Dribble 2 Overhaul",
    source: "Workshop",
    focus: "control bajo, low 50 y retos sin regalar posesión",
    kind: "Dribbling / 50-50",
    modeSafe: true,
    activeRotation: true,
    fallbackPackKey: "shadowDefense",
    avoid: "No speedrun. Usarlo para control y challenges bajos, no para frustrarte.",
    howToUse: "Si no está instalado, usá Shadow Defense 5CCE-FB29-7B05-A0B1 o 1v1 casual con objetivo low 50.",
  },
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
  const dayLabel = getRocketLeagueDayLabel(dateKey);
  return Object.freeze({
    cycleIndex: 0,
    weekRange: "Rotación semanal fija",
    id: "daily-rotation",
    label: `Rotación ${dayLabel} · recursos elegidos`,
    short: "Rotación diaria",
    goal: "open nets, 50/50, kickoffs, rotación y air roll shots sin perder tiempo decidiendo mapas",
    planBaseId: "rocket-daily-rotation",
    accent: "#22d3ee",
    newMechanicRule: "La estructura de 90 min no cambia; solo rota el pack, Workshop o review exacto de cada bloque.",
    weekNumber: getRocketLeagueRoadmapWeekNumber(dateKey),
    cycleWeek: getRocketLeagueDayIndex(dateKey),
    roadmapLabel: `Rotación ${dayLabel}`,
  });
}

export function getRocketLeagueDailyFocus(dateKey = getRocketLeagueDateKey()) {
  return getRocketLeagueCycleFocus(dateKey);
}

export function getRocketLeagueWeeklyFocus(dateKey = getRocketLeagueDateKey()) {
  return getRocketLeagueCycleFocus(dateKey);
}

export function getRocketLeagueFocusRole(dateKey = getRocketLeagueDateKey()) {
  return { type: "daily-rotation", label: "Rotación diaria fija", detail: "LifeOS elige el recurso exacto de cada bloque; no se decide manualmente antes de entrenar." };
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


const RL_DAY_LABELS = Object.freeze(["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]);
const ROCKET_LEAGUE_DAILY_ROTATION_VERSION = "v32-rotation-selectors";

const rlPackResource = (name, pack, focus = pack.focus, note = "") => Object.freeze({ kind: "pack", name, pack, focus, note });
const rlWorkshopResource = (name, workshop, fallbackPack, focus = workshop.focus, note = "") => Object.freeze({ kind: "workshop", name, workshop, fallbackPack, focus, note });
const rlManualResource = (name, focus, note = "") => Object.freeze({ kind: "manual", name, focus, note });
const rlReplayResource = (name, focus, note = "") => Object.freeze({ kind: "replay", name, focus, note });
const rlTestResource = (name, focus, note = "") => Object.freeze({ kind: "test", name, focus, note });

function getRocketLeagueDayIndex(dateKey = getRocketLeagueDateKey()) {
  return parseRocketLeagueDateKey(dateKey).getDay();
}

export function getRocketLeagueDayLabel(dateKey = getRocketLeagueDateKey()) {
  return RL_DAY_LABELS[getRocketLeagueDayIndex(dateKey)] || "Día";
}

export const ROCKET_LEAGUE_DAILY_ROTATION = Object.freeze({
  openNets: Object.freeze([
    rlTestResource("Test de 20 tiros abiertos", "benchmark semanal de open nets", "Domingo: hacé 20 tiros abiertos, anotá cuántos metés limpios y no cambies de mapa."),
    rlPackResource("Ground Shots · Poquito", ROCKET_LEAGUE_PACKS.groundShots),
    rlPackResource("Powershots · Yeeza", ROCKET_LEAGUE_PACKS.powershots),
    rlWorkshopResource("Aim Training · By CoCo", ROCKET_LEAGUE_WORKSHOP_MAPS.aimTrainingByCoCo, ROCKET_LEAGUE_PACKS.groundShots, "open nets y puntería con Workshop", "Si no está instalado o ya agregaste un mapa nuevo hoy, usá Ground Shots de Poquito."),
    rlPackResource("Ground Shots · Poquito", ROCKET_LEAGUE_PACKS.groundShots),
    rlPackResource("Powershot Practice", ROCKET_LEAGUE_PACKS.powershotPractice),
    rlWorkshopResource("Aim Training · By CoCo", ROCKET_LEAGUE_WORKSHOP_MAPS.aimTrainingByCoCo, ROCKET_LEAGUE_PACKS.groundShots, "open nets y puntería con Workshop", "Si no está instalado o ya agregaste un mapa nuevo hoy, usá Ground Shots de Poquito."),
  ]),
  airRoll: Object.freeze([
    rlManualResource("Freeplay air roll shots", "air roll shots libres sin freestyle", "Domingo: tiros con air roll en freeplay; air roll solo corrige ángulo antes del contacto."),
    rlPackResource("Air Roll Shots", ROCKET_LEAGUE_PACKS.airRollShotsAlt),
    rlPackResource("Power shot + Air roll shot", ROCKET_LEAGUE_PACKS.airRollShots),
    rlWorkshopResource("Speed Jump: Rings 2", ROCKET_LEAGUE_WORKSHOP_MAPS.speedJumpRings2, ROCKET_LEAGUE_PACKS.airRollShotsAlt, "control aéreo y orientación", "Si el mapa no está instalado, hacé Air Roll Shots 84D2-072D-80CF-7D0D."),
    rlPackResource("Air Roll Shots", ROCKET_LEAGUE_PACKS.airRollShotsAlt),
    rlPackResource("Power shot + Air roll shot", ROCKET_LEAGUE_PACKS.airRollShots),
    rlWorkshopResource("Speed Jump: Rings 3", ROCKET_LEAGUE_WORKSHOP_MAPS.speedJumpRings3, ROCKET_LEAGUE_PACKS.airRollShots, "control aéreo progresivo", "Si el mapa no está instalado, hacé Power shot + Air roll shot 1C4E-D311-1506-B6C1."),
  ]),
  kickoffs: Object.freeze([
    rlTestResource("Test de 10 kickoffs limpios", "benchmark semanal de kickoffs", "Domingo: 10 kickoffs limpios. Medí contacto, recuperación y si quedás útil después del saque."),
    rlPackResource("Speedflip Kickoff Test", ROCKET_LEAGUE_PACKS.speedflipKickoffTest),
    rlPackResource("Mastering Kickoffs", ROCKET_LEAGUE_PACKS.masteringKickoffs),
    rlPackResource("Kickoffs básicos", ROCKET_LEAGUE_PACKS.basicKickoffs),
    rlPackResource("Speedflip Kickoff Test", ROCKET_LEAGUE_PACKS.speedflipKickoffTest),
    rlPackResource("Mastering Kickoffs", ROCKET_LEAGUE_PACKS.masteringKickoffs),
    rlManualResource("Freeplay · 20 respawns de kickoff", "20 saques limpios sin mapa nuevo", "Sábado: reiniciá kickoff 20 veces. Priorizá contacto, recuperación y no quedar muerto."),
  ]),
  challenges: Object.freeze([
    rlReplayResource("Replay corto · 3 50/50 perdidos", "detectar por qué perdés challenges", "Domingo: revisá un replay corto y anotá 3 50/50 perdidos: tarde, alto, sin boost o mal ángulo."),
    rlManualResource("1v1 casual · objetivo low 50", "low challenges sin saltar de más", "Jugá 1v1 casual o freeplay situacional. Objetivo: low 50, no challenge alto sin necesidad."),
    rlWorkshopResource("Dribble 2 Overhaul", ROCKET_LEAGUE_WORKSHOP_MAPS.dribble2Overhaul, ROCKET_LEAGUE_PACKS.shadowDefense, "dribble/control para low 50", "Si no está instalado, usá Shadow Defense o 1v1 casual con objetivo low 50."),
    rlPackResource("Shadow Defense", ROCKET_LEAGUE_PACKS.shadowDefense),
    rlManualResource("1v1 casual · no saltar antes de tiempo", "paciencia en low challenges", "Entrá a 1v1 casual con una sola regla: no saltar antes de tiempo. Perder la jugada por impaciencia cuenta como error."),
    rlWorkshopResource("Dribble 2 Overhaul", ROCKET_LEAGUE_WORKSHOP_MAPS.dribble2Overhaul, ROCKET_LEAGUE_PACKS.shadowDefense, "dribble/control para low 50", "Si no está instalado, usá Shadow Defense o 1v1 casual con objetivo low 50."),
    rlPackResource("Shadow Defense", ROCKET_LEAGUE_PACKS.shadowDefense),
  ]),
  decisions: Object.freeze([
    rlReplayResource("Resumen semanal del error más repetido", "cierre semanal de decisiones", "Domingo: anotá el error que más se repitió esta semana y una regla concreta para la próxima."),
    rlReplayResource("Replay · 3 errores de rotación", "rotación y posición", "Lunes: mirá un replay o recordá una partida. Anotá 3 errores de rotación sin justificarte."),
    rlPackResource("Defensive Situations", ROCKET_LEAGUE_PACKS.defensiveSituations),
    rlReplayResource("Replay · 3 overcommits", "detectar cuándo te fuiste de más", "Miércoles: buscá 3 overcommits y escribí qué opción más segura había."),
    rlPackResource("Shadow Defense", ROCKET_LEAGUE_PACKS.shadowDefense),
    rlReplayResource("Replay · 3 jugadas donde llegué tarde", "timing y lectura de jugada", "Viernes: encontrá 3 jugadas donde llegaste tarde y anotá si fue boost, posición o indecisión."),
    rlPackResource("Defensive Situations", ROCKET_LEAGUE_PACKS.defensiveSituations),
  ]),
});

function rlResourceInstruction(resource, fallbackSentence = "") {
  if (!resource) return "Seguí el recurso asignado por LifeOS y no cambies de mapa a mitad del bloque.";
  if (resource.kind === "pack") return `Training Pack asignado: ${resource.pack.name} · Código ${resource.pack.code}. Si el código no funciona, dejá nota y buscalo por nombre dentro del juego. ${resource.note || ""}`.trim();
  if (resource.kind === "workshop") {
    const fallback = resource.fallbackPack ? `Fallback: ${resource.fallbackPack.name} · Código ${resource.fallbackPack.code}.` : fallbackSentence;
    return `Workshop asignado: ${resource.workshop.name}. Usalo solo si ya está instalado y en Epic solo con BakkesMod + Workshop Map Loader funcionando. ${fallback} No agregues más de un mapa nuevo por día. ${resource.note || ""}`.trim();
  }
  return `${resource.note || resource.focus || "Bloque manual."} Si no tenés claro cómo hacerlo, simplificá y registrá una nota rápida.`.trim();
}

function makeRlSelectorSubtask(id, blockCode, blockTitle, resource, minutes, baseInstruction, accent, role = RL_TRAINING_ROLES.SUPPORT) {
  const taskType = resource?.kind === "pack"
    ? RL_SUBTASK_TYPES.PACK
    : resource?.kind === "workshop"
      ? RL_SUBTASK_TYPES.WORKSHOP
      : resource?.kind === "replay"
        ? RL_SUBTASK_TYPES.MENTAL
        : RL_SUBTASK_TYPES.MECHANIC;
  const title = `${blockCode} · ${blockTitle} · ${resource?.name || "recurso del día"}`;
  const task = Object.freeze({
    id,
    title,
    type: taskType,
    minutes,
    pack: resource?.kind === "pack" ? resource.pack : undefined,
    workshop: resource?.kind === "workshop" ? resource.workshop : undefined,
    resourceKind: resource?.kind || "manual",
    instruction: `${baseInstruction} ${rlResourceInstruction(resource)}`.replace(/\s+/g, " ").trim(),
    focus: resource?.focus || blockTitle,
    accent,
  });
  return withRlTrainingRole(task, role, `${blockCode} rota por día. LifeOS elige el recurso exacto para que no perdás tiempo decidiendo.`);
}

function makeRocketLeagueDailyRotationPlan(dateKey = getRocketLeagueDateKey()) {
  const dayIndex = getRocketLeagueDayIndex(dateKey);
  const dayLabel = getRocketLeagueDayLabel(dateKey);
  const openNets = ROCKET_LEAGUE_DAILY_ROTATION.openNets[dayIndex];
  const airRoll = ROCKET_LEAGUE_DAILY_ROTATION.airRoll[dayIndex];
  const kickoffs = ROCKET_LEAGUE_DAILY_ROTATION.kickoffs[dayIndex];
  const challenges = ROCKET_LEAGUE_DAILY_ROTATION.challenges[dayIndex];
  const decisions = ROCKET_LEAGUE_DAILY_ROTATION.decisions[dayIndex];
  const blocks = Object.freeze([
    RL_FREEPLAY_SUBTASK,
    makeRlSelectorSubtask("rl04-open-nets", "RL 04", "Open nets / tiros abiertos", openNets, 15, "Bloque de tiros abiertos. Meta: meter goles ganables con dirección, no tirar por tirar.", "#fbbf24", RL_TRAINING_ROLES.MAIN),
    makeRlBreakSubtask("rl05-break-7", 7, "Descanso técnico: agua, manos sueltas, cero TikTok. El siguiente bloque necesita precisión."),
    makeRlSelectorSubtask("rl06-air-roll-shots", "RL 06", "Air roll shots", airRoll, 12, "Air roll solo para cuadrar el carro antes del impacto. No freestyle, no clips.", "#e879f9", RL_TRAINING_ROLES.SUPPORT),
    makeRlSelectorSubtask("rl08-kickoffs", "RL 08", "Saques / kickoffs", kickoffs, 12, "Kickoffs limpios: contacto, recuperación y posición útil después del saque.", "#60a5fa", RL_TRAINING_ROLES.SUPPORT),
    makeRlBreakSubtask("rl09-break-7", 7, "Descanso técnico: soltá el control y reset mental antes de challenges/decisiones."),
    makeRlSelectorSubtask("rl10-low-challenges", "RL 10", "50/50 y low challenges", challenges, 12, "Low challenges: no saltar antes de tiempo, no regalar el challenge alto, salir vivo de la jugada.", "#34d399", RL_TRAINING_ROLES.SUPPORT),
    makeRlSelectorSubtask("rl12-rotation-decisions", "RL 12", "Rotación / decisiones", decisions, 10, "Decisiones: detectar el error repetido y convertirlo en una regla simple para la próxima partida.", "#a78bfa", RL_TRAINING_ROLES.REVIEW),
    makeMentalCloseTask("rl14-close-5", "5 min: guardá el error principal del día, el pack/mapa usado y una acción exacta para mañana. No metas otro mapa al final."),
    RL_ONE_V_ONE_SUBTASK,
  ]);
  const timedMinutes = blocks.reduce((sum, task) => sum + Math.max(0, Number(task.minutes) || 0), 0);
  return Object.freeze({
    id: `rocket-daily-rotation-${dateKey}-${ROCKET_LEAGUE_DAILY_ROTATION_VERSION}`,
    baseId: "rocket-daily-rotation",
    title: `Rotación diaria ${dayLabel} · 90 min`,
    focus: "Open nets, air roll shots, kickoffs, 50/50 y rotación sin decidir mapas manualmente",
    primaryFocus: "daily-rotation",
    primaryMechanicLabel: "Open nets + 50/50 + kickoffs",
    supportLabel: "90 min fijos: los recursos exactos rotan por día; descansos incluidos; no agregar más de un mapa nuevo por día.",
    masteryNote: "La estructura no cambia. Solo cambia el pack, Workshop o review exacto de cada bloque.",
    balance: "90 min entrenamiento · ranked opcional",
    minutes: timedMinutes,
    subtasks: blocks,
  });
}

export const ROCKET_LEAGUE_TRAINING_PLANS = Object.freeze([
  makeRlPlan("cycle-shots-rotation", "Ciclo 1–2 · Shooting diario: 2 principales + 1 complementario", "Yeeza powershots, Poquito ground shots y un complemento rotativo para no aburrirse", [
    makeApplicationTask(
      makeRlPackSubtask("main-powershots-pack-30", ROCKET_LEAGUE_PACKS.mainShootingPair, 30, "Bloque principal dividido: 15 min Powershots de Yeeza + 15 min Ground Shots de Poquito. Mismo objetivo: pegar fuerte, limpio y con dirección; no convertirlo en freestyle.", "#fbbf24"),
      "Foco principal del ciclo: dos mapas base de shooting. Se mantienen juntos en un bloque de 30 min para que el progreso de hoy no se pierda.",
      RL_TRAINING_ROLES.MAIN
    ),
    makeRlBreakSubtask("break-shots-10", 10),
    makeApplicationTask(
      makeRlPackSubtask("apply-air-roll-shot-angle-20", ROCKET_LEAGUE_PACKS.shootingComplementaryRotation, 20, "Mapa complementario: elegí solo 1 entre 10 Shots to Master, Air Roll Shots o Shooting Consistency. Sirve para variar sin alargar la rutina ni meter otra mecánica pesada.", "#e879f9"),
      "Complemento controlado del shooting diario: precisión, ajuste con air roll o consistencia. No es obligación hacer los tres."
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
    makeReplayNoteTask("replay-note-shots-5", "5 min: anotá qué mapa pegó mejor hoy: Yeeza, Poquito o el complementario."),
    makeMentalCloseTask("close-shots-5", "5 min: cerrá con 3 tiros simples perfectos o una nota clara de qué repetir mañana."),
  ], {
    primaryFocus: "shots-rotation",
    primaryMechanicLabel: "Shooting: 2 principales + 1 complementario",
    supportLabel: "Semanas 1–2: Freeplay + 2 mapas principales de shooting + descanso + 1 mapa complementario. Air roll solo ajusta el ángulo antes del tiro.",
    masteryNote: "Mejor meter tiros/powershots al 80%. El complemento da variedad, pero no convierte el día en cuatro mapas obligatorios.",
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
  return makeRocketLeagueDailyRotationPlan(dateKey);
}

export function getRocketLeaguePlanById(planId) {
  const id = String(planId || "");
  const match = id.match(/^rocket-daily-rotation-(\d{4}-\d{2}-\d{2})-/);
  if (match) return makeRocketLeagueDailyRotationPlan(match[1]);
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
