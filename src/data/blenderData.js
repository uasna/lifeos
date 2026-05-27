// Blender beginner training data + pure planning helpers.
// Dependency-free module: no React, no browser APIs.

export const BLENDER_SESSION_MINUTES = 60;
export const BLENDER_PARENT_QUEST_ID = 5;

export const BLENDER_PROFILE = Object.freeze({
  level: "Principiante principiante",
  hardware: "Laptop/teclado sin numpad",
  goal: "aprender fundamentos reales de Blender sin depender del teclado numérico",
  session: "2:40–3:40 PM · 1 hora fija",
});

export const BLENDER_NO_NUMPAD_GUIDE = Object.freeze([
  {
    title: "Vista sin teclado numérico",
    body: "Usá el gizmo de navegación, el menú View/Viewport y el pie de vistas. No dependás del numpad para aprender.",
  },
  {
    title: "Emulate Numpad opcional",
    body: "En Preferences → Input podés activar Emulate Numpad para que la fila de números funcione como numpad. Úsalo solo si no te estorba en Edit Mode.",
  },
  {
    title: "Regla de principiante",
    body: "Primero orbitar, mover, escalar, rotar, guardar y deshacer. Nada de addons ni atajos raros hasta que esto sea natural.",
  },
]);

export const BLENDER_BEGINNER_RULES = Object.freeze([
  "Un ejercicio terminado vale más que 20 tutoriales guardados.",
  "No buscar renders perfectos: buscar entender una herramienta por día.",
  "Nombrar objetos y guardar versiones: v01, v02, v03.",
  "Si te perdés en la vista, no reinicies: usá el gizmo/menú View y volvé a una vista simple.",
  "Máximo 1 concepto nuevo por sesión; el resto es repetición.",
]);

export const BLENDER_SKILL_LADDER = Object.freeze([
  { level: "Nivel 0", title: "Moverse en Blender", items: ["orbitar", "pan", "zoom", "gizmo", "guardar archivo"] },
  { level: "Nivel 1", title: "Transformaciones", items: ["mover", "rotar", "escalar", "duplicar", "aplicar escala"] },
  { level: "Nivel 2", title: "Objetos básicos", items: ["cubo", "cilindro", "esfera", "bevel simple", "shade smooth"] },
  { level: "Nivel 3", title: "Edit Mode básico", items: ["vértices", "aristas", "caras", "extrude", "loop cut"] },
  { level: "Nivel 4", title: "Materiales y luz", items: ["material base", "color", "roughness", "luz", "cámara"] },
  { level: "Nivel 5", title: "Mini proyecto", items: ["modelar", "material", "luz", "cámara", "render simple"] },
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

export const makeBlenderPlan = (id, dayIndex, title, goal, tasks, accent = "#34d399") => Object.freeze({
  id,
  dayIndex,
  title,
  goal,
  minutes: tasks.reduce((sum, task) => sum + (Number(task.minutes) || 0), 0),
  tasks: Object.freeze(tasks),
  accent,
});

export const BLENDER_WEEKLY_PLANS = Object.freeze([
  makeBlenderPlan("navigation-basics", 0, "Lunes · Navegación + objetos básicos", "sentirte cómodo moviéndote sin teclado numérico", [
    makeBlenderTask("setup-no-numpad", "Setup sin numpad", 10, "Base", "Abrí Blender, revisá gizmo/menú View y probá cambiar vista sin numpad. Activá Emulate Numpad solo si te resulta cómodo.", "Podés volver a una vista clara sin perderte.", ["gizmo", "View", "orientación"], "#22d3ee"),
    makeBlenderTask("primitive-tour", "Tour de primitivas", 20, "Ejercicio principal", "Agregá cubo, esfera, cilindro y cono. Movelos, rotalos y escalalos con calma.", "Escena con 4 objetos separados y nombrados.", ["Add Mesh", "Move", "Scale", "Rotate"], "#34d399"),
    makeBlenderTask("save-versions", "Guardar v01/v02", 10, "Hábito", "Guardá el archivo como practica_lunes_v01.blend, duplicá algo y guardá v02.", "Dos versiones guardadas.", ["guardar", "organización"], "#a78bfa"),
    makeBlenderTask("mini-scene", "Mini escena simple", 20, "Aplicación", "Con esas primitivas armá una mesa, torre o robot muy básico. No detalles; solo silueta.", "Un objeto reconocible hecho con primitivas.", ["composición", "formas"], "#fbbf24"),
  ], "#22d3ee"),

  makeBlenderPlan("transform-control", 1, "Martes · Transformaciones limpias", "dominar mover, rotar y escalar sin deformar todo", [
    makeBlenderTask("warm-transform", "Warmup de transformación", 10, "Base", "Mové 5 cubos en ejes distintos, rotá 3 y escalá 3. Usá gizmos si los atajos te confunden.", "Objetos ordenados, no encimados.", ["Move", "Rotate", "Scale"], "#34d399"),
    makeBlenderTask("stack-blocks", "Construcción con bloques", 25, "Ejercicio principal", "Construí una casita low poly solo con cubos. Cada pieza debe tener tamaño intencional.", "Casa simple con paredes, techo y puerta.", ["proporción", "bloques"], "#fbbf24"),
    makeBlenderTask("origin-check", "Orden y nombres", 10, "Hábito", "Nombrá objetos: pared_frente, techo, puerta. Agrupá visualmente y guardá versión.", "Outliner entendible.", ["outliner", "nombres"], "#a78bfa"),
    makeBlenderTask("camera-preview", "Vista de cámara básica", 15, "Aplicación", "Colocá cámara mirando la casita usando gizmo/menú View. No busqués render perfecto.", "Cámara apuntando al modelo.", ["cámara", "encuadre"], "#60a5fa"),
  ], "#34d399"),

  makeBlenderPlan("edit-mode-intro", 2, "Miércoles · Edit Mode desde cero", "entender vértices, aristas y caras sin apurarte", [
    makeBlenderTask("selection-modes", "Vertex/Edge/Face", 15, "Base", "Entrá a Edit Mode y practicá seleccionar vértices, aristas y caras. Sin numpad: seguí usando gizmo/menú View para orientarte.", "Sabés qué estás seleccionando.", ["Edit Mode", "selección"], "#60a5fa"),
    makeBlenderTask("extrude-basic", "Extrude básico", 25, "Ejercicio principal", "Partí de un cubo y extruí caras para crear una silla simple. Si se deforma, deshacé y repetí más lento.", "Silla low poly con asiento, respaldo y patas.", ["extrude", "caras"], "#fb7185"),
    makeBlenderTask("loop-cut-intro", "Loop cut suave", 10, "Técnica", "Probá un loop cut en un cubo separado. Solo entender qué hace, no usarlo en todo.", "Un cubo de prueba con cortes limpios.", ["loop cut"], "#fbbf24"),
    makeBlenderTask("clean-save", "Guardar y nota", 10, "Cierre", "Guardá v02 y escribí en una nota qué herramienta entendiste y cuál se sintió confusa.", "Archivo guardado + nota corta.", ["feedback"], "#a78bfa"),
  ], "#60a5fa"),

  makeBlenderPlan("materials-light", 3, "Jueves · Materiales + luz", "hacer que un modelo simple se vea presentable", [
    makeBlenderTask("material-basics", "Materiales básicos", 20, "Ejercicio principal", "Aplicá 3 materiales simples: color base, roughness medio y nombres claros. Nada de texturas todavía.", "Modelo con 3 materiales nombrados.", ["material", "color"], "#a78bfa"),
    makeBlenderTask("lighting-one", "Una luz bien puesta", 15, "Técnica", "Agregá una luz y movela hasta que se entienda la forma. Probá intensidad, no mil luces.", "Escena iluminada de forma legible.", ["luz", "intensidad"], "#fbbf24"),
    makeBlenderTask("camera-frame", "Encuadre simple", 15, "Aplicación", "Ajustá cámara para que el objeto entre completo. Usá View/Camera desde menú si no tenés numpad.", "Cámara con encuadre limpio.", ["cámara", "composición"], "#60a5fa"),
    makeBlenderTask("viewport-render", "Captura o render rápido", 10, "Cierre", "Sacá un render/captura rápido para ver progreso. No lo compares con renders pro.", "Imagen simple guardada.", ["render", "progreso"], "#34d399"),
  ], "#a78bfa"),

  makeBlenderPlan("low-poly-prop", 4, "Viernes · Prop low poly", "crear un objeto pequeño terminado", [
    makeBlenderTask("choose-prop", "Elegir objeto", 5, "Base", "Elegí un objeto fácil: taza, mesa, silla, caja, monitor, espada simple o lápiz.", "Objeto elegido y escrito.", ["decisión"], "#fbbf24"),
    makeBlenderTask("blockout", "Blockout", 25, "Ejercicio principal", "Armá la forma general con primitivas. Primero silueta, después detalles.", "Blockout reconocible.", ["blockout", "formas"], "#fb7185"),
    makeBlenderTask("simple-detail", "Detalles simples", 15, "Aplicación", "Agregá 2–3 detalles máximo. Si empieza a romperse, volvé a formas grandes.", "Objeto con pocos detalles limpios.", ["detalle", "control"], "#34d399"),
    makeBlenderTask("material-pass", "Material pass", 15, "Cierre", "Poné colores simples, cámara y guardá versión final del día.", "Modelo con materiales y cámara.", ["material", "guardado"], "#a78bfa"),
  ], "#fb7185"),

  makeBlenderPlan("mini-project", 5, "Sábado · Mini proyecto guiado", "unir navegación, modelado básico, materiales y cámara", [
    makeBlenderTask("plan-mini", "Plan de 5 líneas", 10, "Base", "Escribí qué harás: objeto, piezas principales, colores, cámara y límite de detalles.", "Plan corto antes de modelar.", ["plan", "límite"], "#fbbf24"),
    makeBlenderTask("build-mini", "Construcción principal", 30, "Ejercicio principal", "Modelá el mini proyecto con herramientas que ya usaste. Nada de tutorial nuevo durante este bloque.", "Mini escena/modelo completo en forma básica.", ["modelado", "consistencia"], "#34d399"),
    makeBlenderTask("present-mini", "Presentación básica", 15, "Aplicación", "Agregá material, luz y cámara. Buscá que se entienda, no perfección.", "Vista presentable del mini proyecto.", ["luz", "cámara"], "#60a5fa"),
    makeBlenderTask("export-note", "Cierre de aprendizaje", 5, "Cierre", "Anotá qué herramienta te costó más y qué repetirás el lunes.", "Nota de progreso.", ["reflexión"], "#a78bfa"),
  ], "#34d399"),

  makeBlenderPlan("review-cleanup", 6, "Domingo · Repaso suave", "repetir sin cansarte y ordenar archivos", [
    makeBlenderTask("open-old", "Abrir proyecto viejo", 10, "Base", "Abrí un archivo de la semana y miralo sin editar 2 minutos. Detectá qué está desordenado.", "Lista mental de mejoras.", ["review"], "#86efac"),
    makeBlenderTask("fix-one-thing", "Arreglar una cosa", 25, "Ejercicio principal", "Solo una mejora: proporción, material, cámara, nombres o luz. No rehacer todo.", "Una mejora clara aplicada.", ["mejora", "control"], "#34d399"),
    makeBlenderTask("shortcut-practice", "Práctica sin numpad", 15, "Técnica", "Movete por vistas con gizmo/menú/pie y repetí navegación hasta que no te pierdas.", "Más confianza sin numpad.", ["navegación", "gizmo"], "#22d3ee"),
    makeBlenderTask("weekly-note", "Nota semanal", 10, "Cierre", "Escribí: mejor ejercicio, peor herramienta, próximo mini proyecto.", "Nota semanal guardada.", ["planificación"], "#a78bfa"),
  ], "#86efac"),
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
