// Blender Creator Pipeline data + pure planning helpers.
// Dependency-free module: no React, no browser APIs.

export const BLENDER_SESSION_MINUTES = 60;
export const BLENDER_PARENT_QUEST_ID = 5;

export const BLENDER_PROFILE = Object.freeze({
  level: "Principiante con intentos",
  hardware: "MSI Thin GF63 12UCX · sin teclado numérico",
  goal: "crear personajes, criaturas, escenarios, renders y animaciones anime low-poly",
  session: "60 min base · +30 min solo con activación manual",
});

export const BLENDER_PIPELINE_PHASES = Object.freeze([
  "Idea",
  "Blockout",
  "Modelado limpio",
  "Materiales",
  "Luces",
  "Cámara",
  "Render",
  "Animación",
  "Portafolio",
]);

export const BLENDER_EXTRA_GATE_REASONS = Object.freeze([
  {
    id: "almost-finished",
    label: "Ya casi acabo el proyecto",
    title: "Extra activado: cerrar versión publicable",
    action: "cerrar la pieza sin rediseñar todo",
    deliverable: "preview/render rápido guardado",
  },
  {
    id: "inspired-clear",
    label: "Estoy inspirado y sé qué hacer",
    title: "Extra activado: aprovechar claridad creativa",
    action: "ejecutar una acción concreta ya decidida",
    deliverable: "avance visible antes de cortar",
  },
]);

export const BLENDER_CREATOR_PROJECTS = Object.freeze([
  Object.freeze({
    id: "anime-base-character",
    title: "Personaje anime base",
    type: "Personaje",
    phase: "Blockout",
    status: "blockout",
    goal: "Crear un personaje humano estilizado reutilizable",
    todayObjective: "Terminar silueta principal y sacar preview WIP",
    deliverable: "Captura frontal y 3/4 del personaje",
    nextAction: "Ajustar proporciones grandes antes de agregar detalles",
    difficulty: "Media",
    portfolioValue: "Base reutilizable para renders y animaciones",
    accent: "#22d3ee",
  }),
  Object.freeze({
    id: "anime-character-pose",
    title: "Personaje anime · pose y materiales",
    type: "Personaje",
    phase: "Materiales",
    status: "materiales",
    goal: "Convertir el personaje base en una pieza presentable",
    todayObjective: "Aplicar materiales planos, pose simple y cámara limpia",
    deliverable: "Render WIP del personaje con pose básica",
    nextAction: "Separar pelo/ropa/cuerpo con colores simples",
    difficulty: "Media",
    portfolioValue: "Primer render de personaje para portafolio inicial",
    accent: "#a78bfa",
  }),
  Object.freeze({
    id: "fantasy-creature",
    title: "Criatura fantasy estilizada",
    type: "Criatura",
    phase: "Modelado limpio",
    status: "modelado",
    goal: "Crear una criatura simple para escenas narrativas",
    todayObjective: "Bloquear cuerpo, cabeza y rasgos principales",
    deliverable: "Modelo WIP reconocible con silueta clara",
    nextAction: "Definir silueta antes de materiales",
    difficulty: "Media",
    portfolioValue: "Acompañante/personaje secundario para escenas fantasy",
    accent: "#34d399",
  }),
  Object.freeze({
    id: "cinematic-fantasy-scene",
    title: "Escena fantasy cinematográfica",
    type: "Escenario",
    phase: "Luces",
    status: "luces",
    goal: "Construir una escena que cuente algo con formas simples",
    todayObjective: "Armar ambiente, luz principal y profundidad visual",
    deliverable: "Render preview con lectura cinematográfica",
    nextAction: "Colocar 3 planos de profundidad: frente, medio y fondo",
    difficulty: "Media",
    portfolioValue: "Render narrativo para redes/portafolio",
    accent: "#fbbf24",
  }),
  Object.freeze({
    id: "cinematic-urban-scene",
    title: "Calle nocturna low-poly",
    type: "Escenario",
    phase: "Cámara",
    status: "camara",
    goal: "Construir una escena urbana cinematográfica",
    todayObjective: "Configurar luces, cámara y atmósfera nocturna",
    deliverable: "Render preview con composición clara",
    nextAction: "Ajustar luz principal y encuadre",
    difficulty: "Media",
    portfolioValue: "Render estilizado para redes/portafolio",
    accent: "#fb7185",
  }),
  Object.freeze({
    id: "camera-short-animation",
    title: "Animación corta de cámara",
    type: "Animación",
    phase: "Animación",
    status: "animacion",
    goal: "Crear un clip corto de 5 a 10 segundos",
    todayObjective: "Animar cámara o movimiento simple sin complicar el rig",
    deliverable: "Viewport preview del movimiento principal",
    nextAction: "Definir inicio, final y un solo movimiento claro",
    difficulty: "Difícil",
    portfolioValue: "Primer loop/short 3D publicable",
    accent: "#60a5fa",
  }),
  Object.freeze({
    id: "portfolio-render-pass",
    title: "Render para portafolio",
    type: "Render",
    phase: "Portafolio",
    status: "portafolio",
    goal: "Cerrar una pieza simple con presentación cuidada",
    todayObjective: "Pulir cámara, luz, composición y guardar render final",
    deliverable: "Imagen lista para carpeta Portfolio/Renders",
    nextAction: "Ajustar encuadre y cortar antes de sobretrabajar detalles",
    difficulty: "Media",
    portfolioValue: "Pieza terminada para mostrar progreso real",
    accent: "#c084fc",
  }),
]);

export const BLENDER_CREATOR_LIBRARY = Object.freeze([
  Object.freeze({ id: "characters", label: "Characters", count: 1, status: "Base anime en progreso", cta: "Ver piezas" }),
  Object.freeze({ id: "creatures", label: "Creatures", count: 0, status: "Próxima criatura WIP", cta: "Agregar a biblioteca" }),
  Object.freeze({ id: "environments", label: "Environments", count: 1, status: "Escena inicial", cta: "Ver piezas" }),
  Object.freeze({ id: "props", label: "Props de apoyo", count: 3, status: "Objetos narrativos simples", cta: "Agregar prop" }),
  Object.freeze({ id: "materials", label: "Materials", count: 4, status: "Toon/low-poly base", cta: "Ver materiales" }),
  Object.freeze({ id: "cameras", label: "Cameras", count: 1, status: "Cámara hero 3/4", cta: "Guardar cámara" }),
  Object.freeze({ id: "renders", label: "Renders", count: 0, status: "Esperando preview final", cta: "Agregar render" }),
  Object.freeze({ id: "animations", label: "Animations", count: 0, status: "Loop corto pendiente", cta: "Agregar clip" }),
]);

export const BLENDER_CREATOR_TRACKS = Object.freeze([
  Object.freeze({
    id: "characters",
    title: "Personajes anime low-poly",
    status: "Activo",
    microSkills: Object.freeze(["silueta", "pelo simple", "ropa básica"]),
    unlock: "personaje base reusable",
    relation: "base para renders, poses y clips",
    accent: "#22d3ee",
  }),
  Object.freeze({
    id: "creatures",
    title: "Criaturas/animales estilizados",
    status: "Siguiente",
    microSkills: Object.freeze(["formas grandes", "rasgos claros", "poses simples"]),
    unlock: "mascota o criatura fantasy",
    relation: "apoya escenas narrativas",
    accent: "#34d399",
  }),
  Object.freeze({
    id: "fantasy-scenes",
    title: "Escenarios fantasy",
    status: "En cola",
    microSkills: Object.freeze(["ruinas", "bosques", "atmósfera"]),
    unlock: "escena con storytelling",
    relation: "mundo para personajes y criaturas",
    accent: "#fbbf24",
  }),
  Object.freeze({
    id: "urban-scenes",
    title: "Escenarios urbanos",
    status: "En cola",
    microSkills: Object.freeze(["calles", "neón", "profundidad"]),
    unlock: "calle nocturna low-poly",
    relation: "renders para redes",
    accent: "#fb7185",
  }),
  Object.freeze({
    id: "camera",
    title: "Cámara cinematográfica",
    status: "Transversal",
    microSkills: Object.freeze(["3/4", "focal", "movimiento simple"]),
    unlock: "encuadres publicables",
    relation: "eleva modelos simples",
    accent: "#60a5fa",
  }),
  Object.freeze({
    id: "lighting",
    title: "Iluminación toon/low-poly",
    status: "Transversal",
    microSkills: Object.freeze(["key light", "rim", "sombra limpia"]),
    unlock: "look anime legible",
    relation: "mejora cada render",
    accent: "#a78bfa",
  }),
  Object.freeze({
    id: "materials",
    title: "Materiales simples",
    status: "Base",
    microSkills: Object.freeze(["paleta", "roughness", "toon"]),
    unlock: "biblioteca de materiales",
    relation: "calidad sin polígonos extra",
    accent: "#c084fc",
  }),
  Object.freeze({
    id: "shorts",
    title: "Animaciones cortas",
    status: "Meta 30 días",
    microSkills: Object.freeze(["keyframes", "timing", "loop"]),
    unlock: "clip de 5–10 segundos",
    relation: "pieza publicable/monetizable",
    accent: "#38bdf8",
  }),
  Object.freeze({
    id: "portfolio",
    title: "Renders para portafolio",
    status: "Meta semanal",
    microSkills: Object.freeze(["composición", "preview", "export"]),
    unlock: "render terminado",
    relation: "evidencia visible de progreso",
    accent: "#86efac",
  }),
  Object.freeze({
    id: "props",
    title: "Props narrativos de apoyo",
    status: "Soporte",
    microSkills: Object.freeze(["muebles", "objetos", "decoración"]),
    unlock: "biblioteca reutilizable",
    relation: "rellena mundos sin dominar la ruta",
    accent: "#f97316",
  }),
]);

export const BLENDER_NO_NUMPAD_GUIDE = Object.freeze([
  {
    title: "La ruta no depende del numpad",
    body: "Usá el gizmo de navegación, el menú View/Viewport y el pie de vistas. El objetivo es producir piezas visibles, no memorizar vistas numéricas.",
  },
  {
    title: "Vistas alternativas",
    body: "Usá View → Viewpoint para frontal/lateral/superior, el gizmo del viewport para orientar cámara y el atajo de favoritos si te resulta más natural.",
  },
  {
    title: "Emulate Numpad opcional",
    body: "Preferences → Input → Emulate Numpad puede servir, pero activalo solo si no te estorba con números normales o Edit Mode.",
  },
  {
    title: "No frenar por hardware",
    body: "Si una guía usa numpad, traducila a menú/gizmo. La falta de numpad no bloquea modelado, cámara, luces ni renders.",
  },
]);

export const BLENDER_BEGINNER_RULES = Object.freeze([
  "Cada sesión debe dejar algo visible.",
  "No abrir Blender sin proyecto activo.",
  "No pasar más de 20 min buscando tutoriales.",
  "Si algo se complica, simplificar.",
  "Si falta tiempo, usar referencias, base meshes o assets gratuitos.",
  "El objetivo es terminar piezas, no perfeccionarlas.",
  "Guardar versión y preview al cierre.",
  "Cada semana debe producir un render, preview o clip.",
  "Los props existen para apoyar escenas, no como objetivo comercial principal.",
  "Todo debe acercar a portafolio o animaciones cortas.",
]);

export const BLENDER_SKILL_LADDER = Object.freeze([
  { level: "Base", title: "Viewport sin numpad", items: Object.freeze(["gizmo", "View menu", "orbit/pan/zoom", "guardar archivo"]) },
  { level: "Producción", title: "Formas grandes", items: Object.freeze(["blockout", "silueta", "proporción", "simplificar"]) },
  { level: "Presentación", title: "Look visible", items: Object.freeze(["material", "luz", "cámara", "preview"]) },
  { level: "Portafolio", title: "Cerrar piezas", items: Object.freeze(["render", "loop", "biblioteca", "publicar"]) },
]);

export const makeBlenderTask = (id, title, minutes, role, instruction, deliverable, focus = [], accent = "#34d399") => Object.freeze({
  id,
  title,
  minutes,
  role,
  instruction,
  deliverable,
  focus: Object.freeze(focus),
  accent,
});

export const makeBlenderPlan = (id, dayIndex, projectId, title, goal, tasks, accent = "#34d399", meta = {}) => Object.freeze({
  id,
  dayIndex,
  projectId,
  title,
  goal,
  minutes: tasks.reduce((sum, task) => sum + (Number(task.minutes) || 0), 0),
  tasks: Object.freeze(tasks),
  accent,
  ...meta,
});

const sessionBlocks = (projectAccent, mainInstruction, mainDeliverable) => Object.freeze([
  makeBlenderTask(
    "session-start",
    "Arranque",
    5,
    "Preparar escena",
    "Abrí el proyecto activo, revisá la próxima acción exacta y no busqués tutoriales todavía.",
    "Proyecto abierto y dirección clara antes de tocar detalles.",
    ["foco", "sin tutoriales"],
    "#22d3ee"
  ),
  makeBlenderTask(
    "main-production",
    "Producción principal",
    40,
    "Pieza visible",
    mainInstruction,
    mainDeliverable,
    ["formas grandes", "entregable real"],
    projectAccent
  ),
  makeBlenderTask(
    "visual-close",
    "Cierre visual",
    10,
    "Preview",
    "Guardá versión, sacá captura o render preview y compará con el inicio de la sesión.",
    "Versión guardada + preview visible.",
    ["guardar", "preview"],
    "#a78bfa"
  ),
  makeBlenderTask(
    "lifeos-log",
    "Log LifeOS",
    5,
    "Registro",
    "Anotá qué hiciste, qué quedó visible, qué te trabó y la próxima acción exacta.",
    "Registro listo para retomar sin perderte.",
    ["log", "próximo paso"],
    "#fbbf24"
  ),
]);

export const BLENDER_WEEKLY_PLANS = Object.freeze([
  makeBlenderPlan(
    "anime-character-blockout",
    0,
    "anime-base-character",
    "Lunes · Personaje anime base",
    "Terminar la silueta del cuerpo y sacar preview WIP",
    sessionBlocks("#22d3ee", "Ajustá proporciones principales del personaje: cabeza, torso, piernas y pelo simple. No detalles finos; primero que la silueta se lea.", "Captura frontal y 3/4 del personaje base."),
    "#22d3ee",
    {
      why: "La silueta define si el personaje se siente anime/low-poly antes de invertir tiempo en detalles.",
      deliverable: "1 captura frontal + 1 captura 3/4",
      nextAction: "Ajustar proporciones grandes antes de agregar detalles",
      checklist: Object.freeze(["Ajustar proporciones principales", "Bloquear cabeza/cuerpo/piernas", "Agregar pelo simple", "Guardar versión v02", "Sacar preview"]),
    }
  ),
  makeBlenderPlan(
    "anime-character-materials",
    1,
    "anime-character-pose",
    "Martes · Personaje con materiales",
    "Aplicar materiales planos, pose simple y cámara limpia",
    sessionBlocks("#a78bfa", "Separá pelo, ropa y cuerpo con materiales planos. Ajustá una pose simple y colocá cámara 3/4 sin perseguir perfección.", "Render WIP del personaje con pose y materiales."),
    "#a78bfa",
    {
      why: "Un modelo simple gana valor visual cuando color, pose y cámara comunican intención.",
      deliverable: "Render WIP del personaje con pose básica",
      nextAction: "Separar pelo/ropa/cuerpo con colores simples",
      checklist: Object.freeze(["Asignar materiales planos", "Separar pelo/ropa/cuerpo", "Crear pose simple", "Colocar cámara 3/4", "Guardar preview"]),
    }
  ),
  makeBlenderPlan(
    "fantasy-creature-shape",
    2,
    "fantasy-creature",
    "Miércoles · Criatura fantasy",
    "Bloquear cuerpo, cabeza y rasgos principales",
    sessionBlocks("#34d399", "Construí una criatura reconocible con formas grandes. Cuerpo, cabeza, patas/alas/orejas primero; materiales después.", "Modelo WIP reconocible con silueta clara."),
    "#34d399",
    {
      why: "Las criaturas funcionan cuando la silueta se entiende incluso antes del color.",
      deliverable: "Modelo WIP reconocible",
      nextAction: "Definir silueta antes de materiales",
      checklist: Object.freeze(["Elegir animal/criatura base", "Bloquear cuerpo y cabeza", "Agregar 2 rasgos distintivos", "Nombrar piezas", "Sacar preview"]),
    }
  ),
  makeBlenderPlan(
    "fantasy-scene-lighting",
    3,
    "cinematic-fantasy-scene",
    "Jueves · Escena fantasy cinematográfica",
    "Armar ambiente, luz principal y profundidad visual",
    sessionBlocks("#fbbf24", "Construí una escena con frente, medio y fondo. Sumá una luz principal y atmósfera ligera; que cuente algo sin explicación larga.", "Render preview con composición narrativa."),
    "#fbbf24",
    {
      why: "Una escena simple puede verse cinematográfica si tiene profundidad, luz y foco narrativo.",
      deliverable: "Render preview con profundidad visual",
      nextAction: "Colocar 3 planos de profundidad: frente, medio y fondo",
      checklist: Object.freeze(["Definir punto focal", "Colocar 3 planos de profundidad", "Agregar 3–5 props simples", "Poner luz principal", "Sacar preview"]),
    }
  ),
  makeBlenderPlan(
    "urban-scene-camera",
    4,
    "cinematic-urban-scene",
    "Viernes · Calle nocturna low-poly",
    "Configurar luces, cámara y atmósfera nocturna",
    sessionBlocks("#fb7185", "Ajustá una calle low-poly con luces de contraste, cámara baja/3/4 y elementos simples que guíen la mirada.", "Render preview urbano con composición clara."),
    "#fb7185",
    {
      why: "La cámara y la luz hacen que una calle simple parezca una escena con historia.",
      deliverable: "Render preview de calle nocturna",
      nextAction: "Ajustar luz principal y encuadre",
      checklist: Object.freeze(["Ubicar cámara", "Ajustar luz principal", "Crear contraste de color", "Agregar profundidad", "Guardar render preview"]),
    }
  ),
  makeBlenderPlan(
    "camera-short-loop",
    5,
    "camera-short-animation",
    "Sábado · Animación corta de cámara",
    "Animar cámara o movimiento simple sin complicar el rig",
    sessionBlocks("#60a5fa", "Definí inicio y final del movimiento. Animá una cámara, objeto o gesto simple de 5–10 segundos. No abras un tutorial nuevo durante el bloque.", "Viewport preview del movimiento principal."),
    "#60a5fa",
    {
      why: "El primer clip no necesita rig avanzado; necesita timing claro y una acción visible.",
      deliverable: "Preview de animación de 5–10 segundos",
      nextAction: "Definir inicio, final y un solo movimiento claro",
      checklist: Object.freeze(["Definir inicio/final", "Poner keyframes básicos", "Revisar timing", "Guardar preview", "Anotar mejora próxima"]),
    }
  ),
  makeBlenderPlan(
    "portfolio-render-close",
    6,
    "portfolio-render-pass",
    "Domingo · Render para portafolio",
    "Pulir cámara, luz, composición y guardar render final",
    sessionBlocks("#c084fc", "Elegí una pieza WIP de la semana y cerrala para preview/render. Solo cámara, luz, color y encuadre; no rehacer el modelo.", "Imagen lista para carpeta Portfolio/Renders."),
    "#c084fc",
    {
      why: "Cerrar piezas crea evidencia de progreso y evita acumular proyectos eternos.",
      deliverable: "Render final o preview fuerte para portafolio",
      nextAction: "Ajustar encuadre y cortar antes de sobretrabajar detalles",
      checklist: Object.freeze(["Elegir WIP de la semana", "Ajustar cámara", "Ajustar luz", "Guardar render", "Mover a carpeta Portfolio/Renders"]),
    }
  ),
]);

export function getBlenderDateKey(date = new Date()) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getBlenderPlanForDate(date = new Date()) {
  const d = new Date(date);
  const mondayBasedDay = (d.getDay() + 6) % 7;
  return BLENDER_WEEKLY_PLANS.find(plan => plan.dayIndex === mondayBasedDay) || BLENDER_WEEKLY_PLANS[0];
}
