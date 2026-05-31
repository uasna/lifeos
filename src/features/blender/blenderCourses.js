// Blender Academy static curriculum for LifeOS.
// Phase 1 keeps progress lightweight and local to the view: no app schema migration.

export const BLENDER_SESSION_MINUTES = 60;
export const BLENDER_EXTRA_MINUTES = 30;
export const BLENDER_PARENT_QUEST_ID = 5;

export const BLENDER_ACADEMY_PROFILE = Object.freeze({
  title: "Blender Academy",
  alternateTitle: "Blender Creator Academy",
  route: "Anime + low-poly · curso personal progresivo",
  level: "Principiante con intentos",
  hardware: "MSI Thin GF63 12UCX · sin teclado numérico",
  session: "60 min base · +30 min opcional solo si hay una razón clara",
  promise: "Lecciones, ejercicios guiados, entregas y proyectos reales dentro de LifeOS.",
});

export const BLENDER_STUDY_RULES = Object.freeze([
  "No abrir Blender sin lección activa.",
  "No buscar tutoriales más de 20 min.",
  "Cada sesión debe dejar una entrega visible.",
  "Terminado simple > perfecto incompleto.",
  "Usar referencias cuando ayuden a avanzar.",
  "Guardar versión y preview antes de cerrar.",
  "Registrar la próxima acción exacta.",
]);

export const BLENDER_NO_NUMPAD_NOTES = Object.freeze([
  Object.freeze({
    title: "La ruta no depende del numpad",
    body: "Las lecciones priorizan View menu, gizmos, orbit/pan/zoom y controles visibles antes que combinaciones pensadas para teclado numérico.",
  }),
  Object.freeze({
    title: "Vista sin fricción",
    body: "Usá la navegación del viewport, el menú View y favoritos de Blender para cambiar perspectiva sin perder tiempo buscando teclas.",
  }),
  Object.freeze({
    title: "Emulate Numpad solo si suma",
    body: "Activarlo puede ayudar, pero no debe romper tus atajos normales. La sesión sigue aunque no lo uses.",
  }),
]);

export const BLENDER_EXTRA_GATE_REASONS = Object.freeze([
  Object.freeze({
    id: "almost-done",
    label: "Ya casi termino la entrega",
    title: "Extra activado · cerrar entrega",
    action: "terminar lo que ya está encaminado, guardar versión y sacar preview",
    deliverable: "entrega del día cerrada sin rediseñar todo",
  }),
  Object.freeze({
    id: "inspired",
    label: "Estoy inspirado",
    title: "Extra activado · aprovechar claridad",
    action: "ejecutar una mejora visual concreta que ya está clara",
    deliverable: "avance visible extra antes de cortar",
  }),
  Object.freeze({
    id: "know-next",
    label: "Sé exactamente qué hacer",
    title: "Extra activado · acción definida",
    action: "hacer una acción específica sin abrir tutoriales nuevos",
    deliverable: "un cambio pequeño y verificable",
  }),
  Object.freeze({
    id: "preview",
    label: "Quiero sacar preview",
    title: "Extra activado · preview limpio",
    action: "ordenar cámara, guardar captura y comparar con el inicio",
    deliverable: "preview guardado para historial",
  }),
  Object.freeze({
    id: "next-lesson-ready",
    label: "Quiero dejar lista la próxima lección",
    title: "Extra activado · preparar continuidad",
    action: "nombrar archivo, ordenar carpeta y escribir siguiente acción",
    deliverable: "siguiente sesión lista para abrir y trabajar",
  }),
]);

export const BLENDER_LIBRARY_CATEGORIES = Object.freeze([
  Object.freeze({
    id: "props",
    label: "Props",
    singular: "prop narrativo",
    count: 0,
    status: "Primera pieza pendiente",
    cta: "Agregar prop",
    actionTitle: "Registrar prop narrativo",
    helper: "Guardá objetos simples que después sirvan para escenas, renders o animaciones. No son assets comerciales: son piezas de aprendizaje.",
    placeholder: "Ej. lámpara low-poly, libro antiguo, farol, caja estilizada",
    examples: Object.freeze(["Lámpara", "Libro", "Caja", "Puerta", "Señal", "Árbol simple"]),
    unlocked: true,
  }),
  Object.freeze({
    id: "materials",
    label: "Materiales",
    singular: "material",
    count: 0,
    status: "Paleta base pendiente",
    cta: "Guardar material",
    actionTitle: "Guardar material o paleta",
    helper: "Registrá colores, materiales planos o combinaciones toon/low-poly que querés reutilizar.",
    placeholder: "Ej. toon verde bosque, metal oscuro simple, paleta cuarto gamer",
    examples: Object.freeze(["Toon verde", "Madera simple", "Metal oscuro", "Emissive azul"]),
    unlocked: true,
  }),
  Object.freeze({
    id: "environments",
    label: "Escenarios",
    singular: "escenario",
    count: 0,
    status: "Sin diorama todavía",
    cta: "Crear escena",
    actionTitle: "Registrar mini escenario",
    helper: "Guardá dioramas o escenas pequeñas construidas con tus props: cuarto, calle, bosque, templo o ruina.",
    placeholder: "Ej. cuarto gamer WIP, calle nocturna, bosque mágico",
    examples: Object.freeze(["Cuarto gamer", "Calle nocturna", "Bosque mágico", "Entrada templo"]),
    unlocked: true,
  }),
  Object.freeze({
    id: "cameras",
    label: "Cámaras/Luces",
    singular: "setup de cámara/luz",
    count: 0,
    status: "Setup pendiente",
    cta: "Guardar setup",
    actionTitle: "Guardar setup visual",
    helper: "Registrá configuraciones de cámara, luces y atmósfera que hicieron que una escena se viera mejor.",
    placeholder: "Ej. cámara 3/4 + key light lateral, luz nocturna cyan",
    examples: Object.freeze(["Cámara 3/4", "Luz nocturna", "Key light", "Orbit preview"]),
    unlocked: true,
  }),
  Object.freeze({
    id: "renders",
    label: "Renders",
    singular: "render",
    count: 0,
    status: "Primer preview pendiente",
    cta: "Agregar render",
    actionTitle: "Registrar render o preview",
    helper: "Guardá evidencia visual: preview WIP, render final, captura de composición o imagen para comparar progreso.",
    placeholder: "Ej. preview prop caja v01, render calle nocturna WIP",
    examples: Object.freeze(["Preview WIP", "Render final", "Comparativa", "Portfolio draft"]),
    unlocked: true,
  }),
  Object.freeze({
    id: "animations",
    label: "Animaciones",
    singular: "clip",
    count: 0,
    status: "Loop pendiente",
    cta: "Agregar clip",
    actionTitle: "Registrar animación corta",
    helper: "Guardá loops, cámara en movimiento, puertas, luces, objetos flotando o clips cortos sin personaje.",
    placeholder: "Ej. orbit camera 5s, puerta abriéndose, luz parpadeando",
    examples: Object.freeze(["Orbit 5s", "Puerta", "Objeto flotando", "Loop luz"]),
    unlocked: true,
  }),
  Object.freeze({
    id: "creatures",
    label: "Criaturas",
    singular: "criatura",
    count: 0,
    status: "Bloqueada hasta curso 7",
    cta: "Ver ruta",
    actionTitle: "Ruta hacia criaturas",
    helper: "Primero construí base con control, props, materiales, cámara, dioramas y animaciones simples. Criaturas entra cuando ya tengas más seguridad.",
    placeholder: "Se desbloquea más adelante",
    examples: Object.freeze(["Slime", "Gato low-poly", "Zorrito", "Dragón bebé"]),
    unlocked: false,
    unlockText: "Curso 7 · Criaturas estilizadas",
  }),
  Object.freeze({
    id: "characters",
    label: "Personajes",
    singular: "personaje",
    count: 0,
    status: "Bloqueado hasta curso 8",
    cta: "Ver ruta",
    actionTitle: "Ruta hacia personaje anime",
    helper: "El personaje anime low-poly queda para después de practicar objetos, escenas, cámara, materiales, animación simple y criaturas.",
    placeholder: "Se desbloquea más adelante",
    examples: Object.freeze(["Base anime", "Pelo simple", "Ropa básica", "Pose"]),
    unlocked: false,
    unlockText: "Curso 8 · Personaje anime low-poly",
  }),
]);

const lesson = (id, title, durationMinutes, objective, steps, deliverable, checklist, nextAction) => Object.freeze({
  id,
  title,
  durationMinutes,
  objective,
  steps: Object.freeze(steps),
  deliverable,
  checklist: Object.freeze(checklist),
  nextAction,
});

const moduleBlock = (id, title, objective, lessons) => Object.freeze({
  id,
  title,
  objective,
  lessons: Object.freeze(lessons),
});

const course = (id, title, subtitle, level, status, estimatedSessions, goal, modules, accent) => Object.freeze({
  id,
  title,
  subtitle,
  level,
  status,
  estimatedSessions,
  goal,
  modules: Object.freeze(modules),
  accent,
});

export const BLENDER_COURSES = Object.freeze([
  course(
    "course-0-setup-control",
    "Curso 0 · Setup y control de Blender",
    "Navegación, guardado, organización y flujo sin numpad.",
    "Base",
    "active",
    3,
    "Aprender a entrar a Blender sin perderse: viewport, guardado, carpetas, archivo base y atajos seguros.",
    [
      moduleBlock(
        "module-0-control-no-numpad",
        "Módulo 1 · Control sin numpad",
        "Dejar lista una forma cómoda de navegar y guardar progreso sin depender del teclado numérico.",
        [
          lesson(
            "lesson-0-1-base-file",
            "Lección 1 · Navegación, guardado y archivo base",
            60,
            "Crear un archivo base usable, navegar el viewport sin numpad y guardar evidencia del setup.",
            [
              "Abrir Blender y crear un archivo nuevo limpio. No empieces modelando todavía.",
              "Probar orbit, pan y zoom con mouse/trackpad; después mover un cubo con el gizmo sin usar numpad.",
              "Abrir el menú View y ubicar las vistas Front, Right, Top y Camera para no depender de las teclas numéricas.",
              "Crear la carpeta Blender_Academy con subcarpetas: 00_Setup, Previews, Biblioteca y Exports.",
              "Guardar el archivo como curso00_archivo_base_v01.blend dentro de 00_Setup.",
              "Tomar una captura del viewport y escribir 3 controles que sí te funcionaron en tu laptop.",
              "Cerrar la lección anotando una próxima acción exacta para la siguiente sesión.",
            ],
            "Archivo base guardado + captura del viewport + nota de 3 controles usados sin numpad.",
            [
              "Puedo orbitar, mover y hacer zoom sin numpad.",
              "Sé dónde cambiar vistas desde el menú View sin usar teclado numérico.",
              "El archivo base está guardado con nombre claro.",
              "Existe una carpeta para previews, biblioteca y exports.",
              "Tengo una captura del viewport.",
              "Anoté la próxima acción exacta.",
            ],
            "Abrir el archivo base y crear el primer objeto simple con primitivas sin cambiar de curso todavía."
          ),
          lesson(
            "lesson-0-2-workspace-routine",
            "Lección 2 · Rutina de apertura y cierre",
            60,
            "Practicar un inicio/cierre repetible para que cada sesión deje evidencia.",
            [
              "Abrir el archivo base.",
              "Crear una escena mínima con un cubo, una luz y una cámara.",
              "Guardar una versión nueva.",
              "Sacar una captura antes/después.",
              "Escribir la próxima acción antes de cerrar.",
            ],
            "Archivo v02 + captura antes/después + próxima acción escrita.",
            ["Abrí sin perderme.", "Guardé versión.", "Saque preview.", "Cerré con próxima acción."],
            "Empezar Fundamentos low-poly con formas grandes."
          ),
        ]
      ),
    ],
    "#22d3ee"
  ),
  course(
    "course-1-low-poly-foundations",
    "Curso 1 · Fundamentos low-poly",
    "Primitivas, escala, proporciones, blockout y formas limpias.",
    "Principiante",
    "next",
    5,
    "Construir objetos simples desde formas grandes antes de pasar a props narrativos.",
    [
      moduleBlock(
        "module-1-large-shapes",
        "Módulo 1 · Formas grandes",
        "Aprender a crear modelos simples que se lean bien desde lejos.",
        [
          lesson(
            "lesson-1-1-simple-object",
            "Lección 1 · Crear un objeto simple con primitivas",
            60,
            "Crear un objeto limpio usando cubo, escala, rotación y material plano.",
            [
              "Abrir el archivo base del Curso 0 y guardarlo como una versión nueva antes de tocar nada.",
              "Crear una forma principal con una primitiva simple: cubo, cilindro o plano.",
              "Usar escala, mover y rotar para lograr una silueta clara sin agregar detalles pequeños.",
              "Asignar un material plano con color legible.",
              "Guardar versión con nombre claro dentro del curso correspondiente.",
              "Sacar preview del objeto desde una vista clara y anotar qué mejorarías después.",
            ],
            "Objeto simple guardado + preview.",
            ["La silueta se entiende.", "El objeto está limpio.", "Tiene material básico.", "Está guardado con nombre claro.", "Hay preview."],
            "Crear una caja estilizada con proporción y material plano."
          ),
        ]
      ),
    ],
    "#34d399"
  ),
  course(
    "course-2-narrative-props",
    "Curso 2 · Props narrativos",
    "Objetos reutilizables para escenas, renders y animaciones.",
    "Principiante",
    "locked",
    8,
    "Crear lámparas, mesas, libros, cajas, puertas, señales y objetos que ayuden a contar mundos.",
    [
      moduleBlock(
        "module-2-simple-props",
        "Módulo 1 · Objetos simples con primitivas",
        "Transformar formas básicas en piezas narrativas reutilizables.",
        [
          lesson(
            "lesson-2-1-stylized-box",
            "Lección 1 · Crear una caja estilizada",
            60,
            "Crear un objeto limpio usando cubo, escala, bevel simple y material plano.",
            ["Abrir archivo base.", "Crear forma principal.", "Ajustar proporciones.", "Agregar bevel simple si aplica.", "Asignar material básico.", "Guardar versión.", "Sacar preview."],
            "Modelo guardado + captura preview.",
            ["La silueta se entiende.", "El objeto está limpio.", "Tiene material básico.", "Está guardado con nombre claro.", "Hay preview."],
            "Crear otro prop: libro, lámpara, mesa, puerta o señal."
          ),
        ]
      ),
    ],
    "#f472b6"
  ),
  course(
    "course-3-toon-materials",
    "Curso 3 · Materiales toon / low-poly",
    "Color, materiales planos, paletas y look anime/low-poly.",
    "Principiante+",
    "locked",
    5,
    "Hacer que modelos simples se vean intencionales sin depender de detalle pesado.",
    [
      moduleBlock("module-3-flat-color", "Módulo 1 · Materiales planos", "Crear una paleta base reutilizable.", [
        lesson("lesson-3-1-palette", "Lección 1 · Paleta base de materiales", 60, "Crear 5 materiales simples para props y mini escenas.", ["Abrir biblioteca.", "Crear materiales planos.", "Nombrarlos por uso.", "Aplicarlos a 2 objetos.", "Guardar preview."], "Paleta base + preview.", ["5 materiales nombrados.", "Contraste legible.", "Preview guardado."], "Aplicar paleta a un prop narrativo."),
      ]),
    ],
    "#a78bfa"
  ),
  course("course-4-camera-light-composition", "Curso 4 · Cámara, luces y composición", "Encuadre, sombras, profundidad y render preview.", "Principiante+", "locked", 6, "Aprender a presentar piezas simples como escenas visuales.", [
    moduleBlock("module-4-frame-light", "Módulo 1 · Encuadre y luz", "Crear previews que se lean claros.", [
      lesson("lesson-4-1-render-preview", "Lección 1 · Primer render preview", 60, "Colocar cámara, luz principal y render preview de un prop.", ["Elegir prop.", "Colocar cámara.", "Agregar luz principal.", "Ajustar encuadre.", "Guardar render preview."], "Render preview de prop.", ["Cámara clara.", "Luz legible.", "Preview guardado."], "Aplicar setup a mini escenario."),
    ]),
  ], "#fbbf24"),
  course("course-5-mini-environments", "Curso 5 · Mini escenarios y dioramas", "Escenas pequeñas con props, atmósfera y storytelling.", "Intermedio inicial", "locked", 8, "Construir mundos pequeños: cuarto gamer, calle nocturna, bosque mágico o ruina fantasy.", [
    moduleBlock("module-5-diorama", "Módulo 1 · Diorama simple", "Unir props con composición visual.", [
      lesson("lesson-5-1-small-room", "Lección 1 · Mini escena con 3 props", 60, "Crear una escena pequeña con punto focal claro.", ["Elegir base.", "Colocar 3 props.", "Definir punto focal.", "Agregar luz.", "Sacar preview."], "Diorama WIP + preview.", ["3 props visibles.", "Punto focal claro.", "Preview guardado."], "Agregar variación de cámara."),
    ]),
  ], "#38bdf8"),
  course("course-6-simple-animation", "Curso 6 · Animaciones simples sin personaje", "Keyframes, loops, cámara en movimiento y clips cortos.", "Intermedio inicial", "locked", 7, "Animar objetos, luces y cámara antes de entrar a rigging o personaje.", [
    moduleBlock("module-6-keyframes", "Módulo 1 · Keyframes simples", "Crear movimiento claro sin personaje.", [
      lesson("lesson-6-1-orbit-camera", "Lección 1 · Orbit camera simple", 60, "Crear un movimiento de cámara de 5 segundos alrededor de un objeto.", ["Elegir objeto.", "Marcar frame inicial.", "Mover cámara.", "Marcar frame final.", "Ver preview."], "Viewport preview del movimiento.", ["Inicio claro.", "Final claro.", "Movimiento guardado."], "Convertirlo en loop corto."),
    ]),
  ], "#60a5fa"),
  course("course-7-stylized-creatures", "Curso 7 · Criaturas estilizadas", "Animales y criaturas simples antes del personaje humano.", "Intermedio", "locked", 8, "Crear slimes, gatos low-poly, pájaros, zorritos y criaturas fantasy con silueta clara.", [
    moduleBlock("module-7-creature-shapes", "Módulo 1 · Silueta de criatura", "Construir formas orgánicas simples.", [
      lesson("lesson-7-1-slime", "Lección 1 · Slime low-poly", 60, "Crear una criatura simple con cuerpo, ojos y material básico.", ["Crear forma principal.", "Agregar ojos.", "Asignar material.", "Posar en escena.", "Sacar preview."], "Criatura simple + preview.", ["Silueta reconocible.", "Material básico.", "Preview guardado."], "Crear variación de criatura."),
    ]),
  ], "#4ade80"),
  course("course-8-anime-character", "Curso 8 · Personaje anime low-poly", "Personaje simple reutilizable cuando ya exista base previa.", "Intermedio", "locked", 10, "Crear un personaje anime low-poly después de props, escenas, cámara, materiales y criaturas.", [
    moduleBlock("module-8-character-blockout", "Módulo 1 · Blockout humano", "Construir proporciones simples sin entrar a rig avanzado.", [
      lesson("lesson-8-1-body-blockout", "Lección 1 · Silueta base del personaje", 60, "Bloquear cabeza, torso y piernas con formas simples.", ["Definir proporciones.", "Crear cuerpo base.", "Marcar pelo simple.", "Guardar versión.", "Sacar preview."], "Personaje WIP + preview.", ["Silueta clara.", "Formas simples.", "Preview guardado."], "Agregar ropa básica."),
    ]),
  ], "#fb7185"),
  course("course-9-portfolio-project", "Curso 9 · Proyecto de portafolio", "Render final o animación corta de 5–10 segundos.", "Proyecto", "locked", 10, "Unir lo aprendido en una pieza publicable para redes o portafolio personal.", [
    moduleBlock("module-9-final-piece", "Módulo 1 · Pieza final", "Planear y cerrar una entrega completa.", [
      lesson("lesson-9-1-final-brief", "Lección 1 · Brief del proyecto final", 60, "Definir escena, objetivo visual y entregable final.", ["Elegir tipo de pieza.", "Listar assets necesarios.", "Definir cámara/luz.", "Crear checklist.", "Guardar brief."], "Brief + carpeta de proyecto final.", ["Objetivo claro.", "Entrega definida.", "Siguiente acción escrita."], "Producir blockout del proyecto final."),
    ]),
  ], "#c084fc"),
]);

export function getBlenderDateKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getCourseLessonCount(course) {
  return (course?.modules || []).reduce((sum, mod) => sum + (mod.lessons?.length || 0), 0);
}

export function getActiveBlenderCourse(courses = BLENDER_COURSES) {
  return courses.find(item => item.status === "active") || courses[0];
}

export function getNextBlenderCourse(courses = BLENDER_COURSES) {
  return courses.find(item => item.status === "next") || courses[1] || courses[0];
}

export function getBlenderLessonEntries(courses = BLENDER_COURSES) {
  return (courses || []).flatMap((courseItem, courseIndex) =>
    (courseItem.modules || []).flatMap((moduleItem, moduleIndex) =>
      (moduleItem.lessons || []).map((lessonItem, lessonIndex) => ({
        course: courseItem,
        module: moduleItem,
        lesson: lessonItem,
        courseIndex,
        moduleIndex,
        lessonIndex,
      }))
    )
  );
}

export function getTodayBlenderLesson(courses = BLENDER_COURSES, completedLessonIds = []) {
  const completed = new Set(Array.isArray(completedLessonIds) ? completedLessonIds : []);
  const entries = getBlenderLessonEntries(courses);
  const currentEntry = entries.find(entry => !completed.has(entry.lesson.id)) || entries[entries.length - 1];

  return {
    course: currentEntry?.course || getActiveBlenderCourse(courses),
    module: currentEntry?.module || getActiveBlenderCourse(courses)?.modules?.[0],
    lesson: currentEntry?.lesson || getActiveBlenderCourse(courses)?.modules?.[0]?.lessons?.[0],
  };
}
