// Blender Creator Pipeline data + pure planning helpers.
// Dependency-free module: no React, no browser APIs.

export const BLENDER_SESSION_MINUTES = 60;
export const BLENDER_PARENT_QUEST_ID = 5;

export const BLENDER_PROFILE = Object.freeze({
  level: "Principiante con intentos",
  hardware: "MSI Thin GF63 12UCX · sin teclado numérico",
  goal: "crear props narrativos, mini escenarios, renders, animaciones cortas, criaturas y personajes anime low-poly",
  session: "60 min base · +30 min solo con activación manual",
});

export const BLENDER_PIPELINE_START_DATE = "2026-05-29";

export const BLENDER_PIPELINE_PHASES = Object.freeze([
  "Prop simple",
  "Prop limpio",
  "Material",
  "Biblioteca",
  "Mini escena",
  "Cámara/luz",
  "Render",
  "Animación corta",
  "Criatura",
  "Personaje",
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

export const BLENDER_PROP_EXAMPLES = Object.freeze([
  "lámpara",
  "mesa",
  "libro",
  "caja",
  "puerta",
  "ventana",
  "señal",
  "piedra",
  "árbol simple",
  "farol",
  "monitor",
  "silla",
  "cama",
  "mochila",
  "espada estilizada",
]);

export const BLENDER_CREATOR_PROJECTS = Object.freeze([
  Object.freeze({
    id: "narrative-props-base",
    title: "Biblioteca base · Props narrativos",
    subtitle: "Crear piezas simples reutilizables para construir escenas, renders y animaciones.",
    type: "Prop narrativo",
    phase: "Prop simple",
    status: "prop-simple",
    goal: "Crear piezas simples reutilizables para construir mundos anime/low-poly",
    todayObjective: "Crear 1 prop simple reutilizable con formas limpias, material básico y preview guardado.",
    deliverable: "1 prop reutilizable guardado con material básico y captura preview",
    nextAction: "Elegir un objeto simple: lámpara, mesa, libro, caja, puerta, ventana, señal, piedra, farol, monitor, silla, cama, mochila o espada estilizada.",
    difficulty: "Fácil",
    portfolioValue: "Primera pieza de biblioteca para escenas, renders y animaciones",
    accent: "#34d399",
  }),
  Object.freeze({
    id: "clean-prop-pass",
    title: "Prop limpio · Versión reutilizable",
    subtitle: "Convertir un objeto simple en una pieza ordenada para biblioteca.",
    type: "Prop narrativo",
    phase: "Prop limpio",
    status: "prop-limpio",
    goal: "Limpiar formas, nombres y escala de un prop para poder reutilizarlo",
    todayObjective: "Mejorar un prop simple sin agregar complejidad innecesaria",
    deliverable: "Prop limpio con origen, escala y nombre listos para biblioteca",
    nextAction: "Ordenar formas grandes, eliminar detalles flojos y guardar versión v02.",
    difficulty: "Fácil/Media",
    portfolioValue: "Pieza reusable para poblar mini escenarios sin empezar desde cero",
    accent: "#22d3ee",
  }),
  Object.freeze({
    id: "mini-diorama-base",
    title: "Mini escenario · Diorama base",
    subtitle: "Unir props simples para construir una escena pequeña con intención visual.",
    type: "Mini escenario",
    phase: "Mini escena",
    status: "mini-escena",
    goal: "Construir un diorama pequeño usando props narrativos propios",
    todayObjective: "Armar una mini escena con 3 a 5 piezas simples y punto focal claro",
    deliverable: "Diorama WIP con composición legible",
    nextAction: "Colocar piso/base, punto focal y 3 props sin saturar la escena.",
    difficulty: "Media",
    portfolioValue: "Primer mundo pequeño donde luego pueden vivir criaturas o personajes",
    accent: "#fbbf24",
  }),
  Object.freeze({
    id: "materials-camera-render",
    title: "Look visual · Material, cámara y render",
    subtitle: "Hacer que objetos simples se vean bien con color, luz y encuadre.",
    type: "Render",
    phase: "Cámara/luz",
    status: "camara-luz",
    goal: "Convertir una mini escena simple en un render presentable",
    todayObjective: "Aplicar materiales planos, luz principal y cámara cuidada al diorama",
    deliverable: "Render preview con lectura clara",
    nextAction: "Elegir paleta simple, ubicar cámara 3/4 y ajustar una luz principal.",
    difficulty: "Media",
    portfolioValue: "Render inicial para redes/portafolio sin depender de modelos complejos",
    accent: "#a78bfa",
  }),
  Object.freeze({
    id: "no-character-short-animation",
    title: "Animación corta · Sin personaje",
    subtitle: "Crear movimiento publicable usando cámara, luces u objetos simples.",
    type: "Animación",
    phase: "Animación corta",
    status: "animacion-corta",
    goal: "Crear un clip de 5 a 10 segundos sin rig ni personaje complejo",
    todayObjective: "Animar cámara, luz u objeto simple dentro de una mini escena",
    deliverable: "Viewport preview de animación corta",
    nextAction: "Definir inicio, final y un solo movimiento claro: cámara, farol, puerta, señal o prop.",
    difficulty: "Media",
    portfolioValue: "Primer loop/short 3D publicable sin bloqueo de rigging",
    accent: "#60a5fa",
  }),
  Object.freeze({
    id: "simple-stylized-creature",
    title: "Criatura simple estilizada",
    subtitle: "Crear una mascota/criatura sencilla para habitar tus mini mundos.",
    type: "Criatura",
    phase: "Criatura",
    status: "criatura",
    goal: "Crear una criatura simple con silueta clara antes de intentar humanos",
    todayObjective: "Bloquear cuerpo, cabeza y 2 rasgos reconocibles de una criatura sencilla",
    deliverable: "Criatura WIP reconocible con formas grandes",
    nextAction: "Definir animal/base fantasy y modelar solo silueta, no detalles finos.",
    difficulty: "Media",
    portfolioValue: "Acompañante narrativo para escenas fantasy/urbanas",
    accent: "#fb7185",
  }),
  Object.freeze({
    id: "anime-base-character",
    title: "Personaje anime low-poly",
    subtitle: "Llegar al personaje cuando ya hay props, escenas, cámara y criterio visual.",
    type: "Personaje",
    phase: "Personaje",
    status: "personaje",
    goal: "Crear un personaje humano estilizado reutilizable sin empezar por lo más difícil",
    todayObjective: "Definir silueta base del personaje usando lo aprendido en props, criaturas y composición",
    deliverable: "Concepto visual simple + primera captura WIP del personaje",
    nextAction: "Definir proporciones grandes antes de pelo, ropa o detalles.",
    difficulty: "Media/Difícil",
    portfolioValue: "Base reutilizable para renders, poses y animaciones futuras",
    accent: "#c084fc",
  }),
]);

export const BLENDER_CREATOR_LIBRARY = Object.freeze([
  Object.freeze({ id: "props", label: "Props narrativos", count: 0, status: "Primera pieza pendiente", cta: "Crear prop" }),
  Object.freeze({ id: "environments", label: "Mini escenarios", count: 0, status: "Diorama pendiente", cta: "Crear diorama" }),
  Object.freeze({ id: "materials", label: "Materials", count: 0, status: "Paleta inicial pendiente", cta: "Crear material" }),
  Object.freeze({ id: "cameras", label: "Cameras", count: 0, status: "Sin cámara guardada", cta: "Guardar cámara" }),
  Object.freeze({ id: "renders", label: "Renders", count: 0, status: "Esperando preview final", cta: "Agregar render" }),
  Object.freeze({ id: "animations", label: "Animations", count: 0, status: "Loop corto pendiente", cta: "Agregar clip" }),
  Object.freeze({ id: "creatures", label: "Creatures", count: 0, status: "Criatura para más adelante", cta: "Agregar criatura" }),
  Object.freeze({ id: "characters", label: "Characters", count: 0, status: "Personaje bloqueado hasta tener base", cta: "Preparar personaje" }),
]);

export const BLENDER_CREATOR_TRACKS = Object.freeze([
  Object.freeze({
    id: "props",
    title: "Props narrativos simples",
    status: "Activo",
    microSkills: Object.freeze(["formas limpias", "escala", "material básico"]),
    unlock: "biblioteca base reutilizable",
    relation: "piezas para construir mundos, no assets de videojuego",
    accent: "#34d399",
  }),
  Object.freeze({
    id: "dioramas",
    title: "Mini escenarios / dioramas",
    status: "Siguiente",
    microSkills: Object.freeze(["base", "punto focal", "3–5 props"]),
    unlock: "escena pequeña con storytelling",
    relation: "convierte objetos sueltos en mundo visual",
    accent: "#fbbf24",
  }),
  Object.freeze({
    id: "materials-light-camera",
    title: "Materiales, luces y cámara",
    status: "Base visual",
    microSkills: Object.freeze(["paleta", "key light", "cámara 3/4"]),
    unlock: "render preview legible",
    relation: "hace que modelos simples se vean bien",
    accent: "#a78bfa",
  }),
  Object.freeze({
    id: "shorts-no-character",
    title: "Animaciones cortas sin personaje",
    status: "Antes del rig",
    microSkills: Object.freeze(["keyframes", "timing", "cámara"]),
    unlock: "clip de 5–10 segundos",
    relation: "publicable sin depender de rigging humano",
    accent: "#60a5fa",
  }),
  Object.freeze({
    id: "creatures",
    title: "Criaturas simples estilizadas",
    status: "Después de escenas",
    microSkills: Object.freeze(["silueta", "rasgos claros", "poses simples"]),
    unlock: "mascota o criatura fantasy",
    relation: "primer ser vivo antes de personaje humano",
    accent: "#fb7185",
  }),
  Object.freeze({
    id: "characters",
    title: "Personaje anime low-poly",
    status: "Ruta avanzada",
    microSkills: Object.freeze(["proporción", "pelo simple", "ropa básica"]),
    unlock: "personaje base reusable",
    relation: "llega cuando ya dominás piezas, escena y presentación",
    accent: "#c084fc",
  }),
  Object.freeze({
    id: "portfolio",
    title: "Renders para portafolio",
    status: "Meta semanal",
    microSkills: Object.freeze(["composición", "preview", "export"]),
    unlock: "render terminado",
    relation: "evidencia visible de progreso real",
    accent: "#86efac",
  }),
  Object.freeze({
    id: "urban-scenes",
    title: "Escenarios urbanos estilizados",
    status: "Compatible",
    microSkills: Object.freeze(["calles", "neón", "profundidad"]),
    unlock: "calle nocturna low-poly",
    relation: "usar biblioteca de props para escenas modernas",
    accent: "#38bdf8",
  }),
  Object.freeze({
    id: "fantasy-scenes",
    title: "Escenarios fantasy simples",
    status: "Compatible",
    microSkills: Object.freeze(["ruinas", "bosque", "atmósfera"]),
    unlock: "diorama fantasy narrativo",
    relation: "mundo para criaturas y futuros personajes",
    accent: "#f97316",
  }),
  Object.freeze({
    id: "composition",
    title: "Composición visual",
    status: "Transversal",
    microSkills: Object.freeze(["silueta", "profundidad", "encuadre"]),
    unlock: "escenas más claras",
    relation: "evita depender de detalle excesivo",
    accent: "#22d3ee",
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
    body: "Si una guía usa numpad, traducila a menú/gizmo. La falta de numpad no bloquea props, mini escenas, cámara, luces ni renders.",
  },
]);

export const BLENDER_BEGINNER_RULES = Object.freeze([
  "Cada sesión debe dejar algo visible.",
  "No abrir Blender sin proyecto activo.",
  "Empezar por props narrativos simples antes de personajes completos.",
  "No tratar props como assets de videojuego; tratarlos como piezas para mundos, escenas y renders.",
  "No pasar más de 20 min buscando tutoriales.",
  "Si algo se complica, simplificar.",
  "Si falta tiempo, usar referencias, base meshes o assets gratuitos.",
  "El objetivo es terminar piezas, no perfeccionarlas.",
  "Guardar versión y preview al cierre.",
  "Todo debe acercar a portafolio o animaciones cortas.",
]);

export const BLENDER_SKILL_LADDER = Object.freeze([
  { level: "Base", title: "Viewport sin numpad", items: Object.freeze(["gizmo", "View menu", "orbit/pan/zoom", "guardar archivo"]) },
  { level: "Producción", title: "Props narrativos", items: Object.freeze(["formas limpias", "escala", "material básico", "biblioteca"]) },
  { level: "Presentación", title: "Mini escenas", items: Object.freeze(["diorama", "luz", "cámara", "preview"]) },
  { level: "Portafolio", title: "Cerrar piezas", items: Object.freeze(["render", "loop", "criatura", "personaje"]) },
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
    ["formas limpias", "entregable real"],
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
    "narrative-prop-start",
    0,
    "narrative-props-base",
    "Día 1 · Biblioteca base de props narrativos",
    "Crear 1 prop simple reutilizable con formas limpias, material básico y preview guardado",
    sessionBlocks("#34d399", "Elegí un prop simple —lámpara, mesa, libro, caja, puerta, ventana, señal, piedra, árbol simple, farol, monitor, silla, cama, mochila o espada estilizada— y construí una versión limpia. No lo trates como asset de videojuego: pensalo como pieza narrativa para escenas y renders.", "1 prop reutilizable con material básico + captura preview guardada."),
    "#34d399",
    {
      why: "Empezar por props reduce frustración: son piezas pequeñas, visibles y reutilizables para construir mundos antes de intentar personajes completos.",
      deliverable: "1 prop simple reutilizable con preview guardado",
      nextAction: "Elegir un prop de baja complejidad y bloquear su forma principal",
      checklist: Object.freeze(["Elegir 1 prop simple", "Bloquear formas principales", "Asignar material básico", "Guardar versión v01", "Sacar preview"]),
    }
  ),
  makeBlenderPlan(
    "clean-prop-library-pass",
    1,
    "clean-prop-pass",
    "Día 2 · Prop limpio para biblioteca",
    "Convertir el prop inicial en una pieza ordenada y reutilizable",
    sessionBlocks("#22d3ee", "Limpiá el prop: escala coherente, nombres simples, silueta clara y material estable. Si algo se complica, reducí detalle en lugar de abandonar.", "Prop limpio guardado como pieza de biblioteca."),
    "#22d3ee",
    {
      why: "Una biblioteca útil no nace de modelos perfectos, nace de piezas simples que podés volver a usar sin perder tiempo.",
      deliverable: "Prop limpio listo para reutilizar",
      nextAction: "Ordenar escala, materiales y versión del archivo",
      checklist: Object.freeze(["Revisar silueta", "Limpiar detalles débiles", "Nombrar pieza", "Guardar versión v02", "Mover a biblioteca"]),
    }
  ),
  makeBlenderPlan(
    "mini-diorama-layout",
    2,
    "mini-diorama-base",
    "Día 3 · Mini escenario / diorama",
    "Construir una mini escena con props simples y punto focal claro",
    sessionBlocks("#fbbf24", "Creá una base pequeña y colocá 3 a 5 props. Buscá lectura visual: frente, medio y fondo. No llenés la escena; que se entienda rápido.", "Diorama WIP con composición legible."),
    "#fbbf24",
    {
      why: "Los props ganan sentido cuando forman una escena. El objetivo es construir un pequeño mundo, no una colección suelta.",
      deliverable: "Mini escenario WIP con 3–5 props",
      nextAction: "Colocar base, punto focal y 3 props sin saturar",
      checklist: Object.freeze(["Crear base/piso", "Definir punto focal", "Colocar 3–5 props", "Separar frente/medio/fondo", "Sacar preview"]),
    }
  ),
  makeBlenderPlan(
    "visual-look-render-pass",
    3,
    "materials-camera-render",
    "Día 4 · Materiales, luz, cámara y render",
    "Hacer que la mini escena se vea bien con color, luz y encuadre",
    sessionBlocks("#a78bfa", "Aplicá una paleta simple, una luz principal y una cámara 3/4. Buscá que el render se lea bien aunque los modelos sean simples.", "Render preview con material, luz y cámara definidos."),
    "#a78bfa",
    {
      why: "El look anime/low-poly depende más de composición, luz y color que de detalle pesado.",
      deliverable: "Render preview del diorama",
      nextAction: "Elegir paleta simple, luz principal y cámara 3/4",
      checklist: Object.freeze(["Asignar materiales planos", "Poner luz principal", "Ubicar cámara", "Ajustar encuadre", "Guardar render preview"]),
    }
  ),
  makeBlenderPlan(
    "no-character-short-loop",
    4,
    "no-character-short-animation",
    "Día 5 · Animación corta sin personaje",
    "Crear un clip simple de 5 a 10 segundos sin rig ni personaje",
    sessionBlocks("#60a5fa", "Animá una cámara, luz u objeto simple. Un movimiento claro vale más que una animación compleja a medias. No abras tutoriales nuevos durante producción.", "Viewport preview de animación corta guardado."),
    "#60a5fa",
    {
      why: "Antes de rigging humano, conviene aprender timing y cámara con objetos simples para producir clips publicables más rápido.",
      deliverable: "Preview de animación de 5–10 segundos",
      nextAction: "Definir inicio, final y un solo movimiento claro",
      checklist: Object.freeze(["Elegir movimiento simple", "Crear keyframe inicial", "Crear keyframe final", "Revisar timing", "Guardar preview"]),
    }
  ),
  makeBlenderPlan(
    "simple-creature-blockout",
    5,
    "simple-stylized-creature",
    "Día 6 · Criatura simple estilizada",
    "Crear una criatura sencilla antes de pasar a personaje humano",
    sessionBlocks("#fb7185", "Bloqueá una criatura simple con formas grandes: cuerpo, cabeza y 2 rasgos reconocibles. No busqués anatomía compleja; buscá silueta clara.", "Criatura WIP reconocible con formas grandes."),
    "#fb7185",
    {
      why: "Una criatura simple entrena formas orgánicas sin la presión de un personaje humano completo.",
      deliverable: "Criatura simple WIP",
      nextAction: "Elegir animal/base fantasy y modelar solo la silueta",
      checklist: Object.freeze(["Elegir criatura base", "Bloquear cuerpo y cabeza", "Agregar 2 rasgos claros", "Asignar material simple", "Sacar preview"]),
    }
  ),
  makeBlenderPlan(
    "anime-character-later-start",
    6,
    "anime-base-character",
    "Día 7 · Preparación de personaje anime low-poly",
    "Empezar personaje solo después de tener base de props, escena, luz y cámara",
    sessionBlocks("#c084fc", "Definí una silueta humana muy simple usando lo aprendido: formas grandes, proporción básica y cero detalles finos. El objetivo es preparar, no terminar un personaje completo.", "Primer concepto WIP de personaje sin presión de acabado."),
    "#c084fc",
    {
      why: "El personaje llega al final de la primera vuelta para evitar frustración y aprovechar lo aprendido en props, criaturas, composición y render.",
      deliverable: "Concepto WIP de personaje base",
      nextAction: "Definir proporciones grandes antes de pelo, ropa o detalles",
      checklist: Object.freeze(["Definir silueta simple", "Bloquear cabeza/torso/piernas", "Evitar detalles finos", "Guardar versión v01", "Sacar preview WIP"]),
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
  const start = new Date(`${BLENDER_PIPELINE_START_DATE}T00:00:00`);
  const current = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const daysSinceStart = Math.max(0, Math.floor((current - startDay) / 86400000));
  const planIndex = daysSinceStart % BLENDER_WEEKLY_PLANS.length;
  return BLENDER_WEEKLY_PLANS[planIndex] || BLENDER_WEEKLY_PLANS[0];
}
