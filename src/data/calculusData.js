// Cálculo I / MM201 static data extracted from LifeOS.jsx.
// This file is intentionally data-only; keep runtime/API calls out.

export const CALCULUS_FIXED_START_MIN = 8 * 60 + 10;

export const CALCULUS_FIXED_DURATION_MIN = 90;

export const CALCULUS_FIXED_END_MIN = CALCULUS_FIXED_START_MIN + CALCULUS_FIXED_DURATION_MIN;

export const CALCULUS_SOURCE_LABEL = "Jornalización MM201 · II-PAC 2026";

export const CALCULUS_JOURNALIZATION_II_PAC_2026 = Object.freeze([
  { date:"2026-05-25", partial:1, topic:"Asíntotas: verticales, horizontales y oblicuas", focus:["Asíntotas verticales", "Asíntotas horizontales", "Asíntotas oblicuas"], mode:"Clase + práctica" },
  { date:"2026-05-26", partial:1, topic:"Asíntotas: verticales, horizontales y oblicuas", focus:["Dominio", "Límites al infinito", "Rectas oblicuas"], mode:"Práctica guiada" },
  { date:"2026-05-27", partial:1, topic:"Límites trigonométricos", focus:["Identidades", "Límites notables", "Simplificación"], mode:"Clase + práctica" },
  { date:"2026-05-28", partial:1, topic:"Límites trigonométricos", focus:["Seno/coseno", "Tangente", "Transformaciones"], mode:"Práctica" },
  { date:"2026-05-29", partial:1, topic:"Límites trigonométricos", focus:["Ejercicios mixtos", "Errores comunes", "Velocidad"], mode:"Cierre de tema" },
  { date:"2026-06-01", partial:1, topic:"Continuidad y discontinuidad en un punto", focus:["Continuidad", "Discontinuidad removible", "Saltos"], mode:"Clase + práctica" },
  { date:"2026-06-02", partial:1, topic:"Continuidad y discontinuidad en un punto", focus:["Condiciones", "Funciones por partes", "Justificación"], mode:"Práctica" },
  { date:"2026-06-03", partial:1, topic:"Construcción de gráficas dadas condiciones de límites", focus:["Gráficas", "Límites laterales", "Asíntotas"], mode:"Tipo examen" },
  { date:"2026-06-04", partial:1, topic:"Construcción de gráficas dadas condiciones de límites", focus:["Repaso parcial I", "Gráficas", "Continuidad"], mode:"Simulación corta" },
  { date:"2026-06-05", partial:1, topic:"Examen 1 · 7:00–9:00 AM", focus:["Parcial I", "Llegar temprano", "Sin sobrecargar"], mode:"Examen" },

  { date:"2026-06-08", partial:2, topic:"Pendiente de la recta tangente y definición de derivada", focus:["Pendiente", "Definición formal", "Límite incremental"], mode:"Clase + práctica" },
  { date:"2026-06-09", partial:2, topic:"Derivadas laterales, diferenciabilidad y continuidad", focus:["Derivadas laterales", "Diferenciabilidad", "Continuidad"], mode:"Clase + práctica" },
  { date:"2026-06-10", partial:2, topic:"Derivadas laterales, diferenciabilidad y continuidad", focus:["Funciones por partes", "Puntos críticos", "Justificación"], mode:"Práctica" },
  { date:"2026-06-11", partial:2, topic:"Propiedades de la derivada y teoremas básicos", focus:["Reglas", "Linealidad", "Producto/cociente"], mode:"Clase + práctica" },
  { date:"2026-06-12", partial:2, topic:"Propiedades de la derivada y teoremas básicos", focus:["Reglas mixtas", "Simplificación", "Velocidad"], mode:"Práctica" },
  { date:"2026-06-15", partial:2, topic:"Derivada de funciones trigonométricas", focus:["sen/cos", "tan/sec", "Identidades"], mode:"Clase + práctica" },
  { date:"2026-06-16", partial:2, topic:"Regla de la cadena y derivada de funciones compuestas", focus:["Cadena", "Composición", "Potencias"], mode:"Clase + práctica" },
  { date:"2026-06-17", partial:2, topic:"Regla de la cadena y derivada de funciones compuestas", focus:["Ejercicios mixtos", "Errores de anidación", "Velocidad"], mode:"Práctica" },
  { date:"2026-06-18", partial:2, topic:"Derivada de funciones trigonométricas inversas", focus:["arcsen", "arctan", "Composición"], mode:"Clase + práctica" },
  { date:"2026-06-19", partial:2, topic:"Derivada logarítmica y exponencial", focus:["ln", "exp", "Base a"], mode:"Clase + práctica" },
  { date:"2026-06-22", partial:2, topic:"Derivación implícita", focus:["y' implícita", "Orden", "Algebra"], mode:"Clase + práctica" },
  { date:"2026-06-23", partial:2, topic:"Derivación implícita y derivadas de orden superior", focus:["Segunda derivada", "Implícita", "Simplificación"], mode:"Práctica" },
  { date:"2026-06-24", partial:2, topic:"Derivación logarítmica", focus:["Logaritmos", "Productos", "Potencias variables"], mode:"Clase + práctica" },
  { date:"2026-06-25", partial:2, topic:"Regla de L’Hopital", focus:["0/0", "∞/∞", "Condiciones"], mode:"Clase + práctica" },
  { date:"2026-06-26", partial:2, topic:"Regla de L’Hopital", focus:["Casos mixtos", "Indeterminaciones", "Justificación"], mode:"Práctica" },
  { date:"2026-06-29", partial:2, topic:"Gráficas con primera y segunda derivada", focus:["Crecimiento", "Concavidad", "Puntos críticos"], mode:"Clase + práctica" },
  { date:"2026-06-30", partial:2, topic:"Gráficas con primera y segunda derivada", focus:["Extremos", "Inflexión", "Tabla de signos"], mode:"Práctica" },
  { date:"2026-07-01", partial:2, topic:"Gráficas con primera y segunda derivada", focus:["Análisis completo", "Bosquejo", "Justificación"], mode:"Tipo examen" },
  { date:"2026-07-02", partial:2, topic:"Gráficas con primera y segunda derivada", focus:["Repaso parcial II", "Derivadas", "L’Hopital"], mode:"Simulación corta" },
  { date:"2026-07-03", partial:2, topic:"Examen 2 · 7:00–9:00 AM", focus:["Parcial II", "Llegar temprano", "No repasar pesado"], mode:"Examen" },

  { date:"2026-07-06", partial:3, topic:"Valores extremos y Teorema de Valor Medio", focus:["Extremos", "TVM", "Condiciones"], mode:"Clase + práctica" },
  { date:"2026-07-07", partial:3, topic:"Problemas aplicados de optimización", focus:["Modelar", "Restricciones", "Derivar"], mode:"Clase + práctica" },
  { date:"2026-07-08", partial:3, topic:"Problemas aplicados de optimización", focus:["Máximos/mínimos", "Unidades", "Interpretación"], mode:"Práctica" },
  { date:"2026-07-09", partial:3, topic:"Problemas aplicados de optimización", focus:["Tipo examen", "Modelos mixtos", "Verificación"], mode:"Práctica intensa" },
  { date:"2026-07-10", partial:3, topic:"Interpretación geométrica de la derivada: tangentes y normales", focus:["Recta tangente", "Recta normal", "Pendiente"], mode:"Clase + práctica" },
  { date:"2026-07-13", partial:3, topic:"Tangentes y normales a curvas", focus:["Punto de tangencia", "Normal", "Ecuaciones"], mode:"Práctica" },
  { date:"2026-07-14", partial:3, topic:"Definición de antiderivada", focus:["Antiderivada", "Constante C", "Familias"], mode:"Clase + práctica" },
  { date:"2026-07-15", partial:3, topic:"Teoremas sobre la antiderivada", focus:["Reglas", "Linealidad", "Patrones"], mode:"Clase + práctica" },
  { date:"2026-07-16", partial:3, topic:"Sustitución de variable e integración de función compuesta", focus:["u-sustitución", "Diferenciales", "Reescritura"], mode:"Clase + práctica" },
  { date:"2026-07-17", partial:3, topic:"Sustitución de variable e integración de función compuesta", focus:["Patrones", "Trig/exponencial", "Verificar"], mode:"Práctica" },
  { date:"2026-07-20", partial:3, topic:"Sustitución de variable e integración de función compuesta", focus:["Ejercicios mixtos", "Cambio de variable", "Orden"], mode:"Práctica" },
  { date:"2026-07-21", partial:3, topic:"Sustitución de variable e integración de función compuesta", focus:["Tipo examen", "Errores comunes", "Velocidad"], mode:"Práctica intensa" },
  { date:"2026-07-22", partial:3, topic:"Integral definida: idea intuitiva y definición", focus:["Área", "Sumas", "Definición"], mode:"Clase + práctica" },
  { date:"2026-07-23", partial:3, topic:"Teoremas de la integral definida y Teorema Fundamental del Cálculo", focus:["TFC", "Evaluación", "Propiedades"], mode:"Clase + práctica" },
  { date:"2026-07-24", partial:3, topic:"Área de regiones entre curvas", focus:["Intersecciones", "Arriba-abajo", "Integral"], mode:"Clase + práctica" },
  { date:"2026-07-27", partial:3, topic:"Área de regiones entre curvas", focus:["Bosquejo", "Límites", "Integración"], mode:"Práctica" },
  { date:"2026-07-28", partial:3, topic:"Área de regiones entre curvas", focus:["Regiones mixtas", "Partir intervalos", "Verificar"], mode:"Práctica" },
  { date:"2026-07-29", partial:3, topic:"Área entre curvas usando inversa cuando sea necesario", focus:["Inversa", "dx/dy", "Región"], mode:"Tipo examen" },
  { date:"2026-07-30", partial:3, topic:"Área entre curvas usando inversa cuando sea necesario", focus:["Repaso parcial III", "Área", "Integrales"], mode:"Simulación corta" },
  { date:"2026-07-31", partial:3, topic:"Examen 3 · 7:00–9:00 AM", focus:["Parcial III", "Llegar temprano", "Cierre"], mode:"Examen" },
  { date:"2026-08-05", partial:"reposicion", topic:"Reposición · 7:00–9:00 AM", focus:["Temas débiles", "Pautas", "Errores repetidos"], mode:"Reposición" },
]);

export const CALCULUS_DIFFICULTY_LEVELS = Object.freeze({
  1: { level: 1, name: "Básico", description: "Reconocimiento directo o cálculo simple." },
  2: { level: 2, name: "Fácil", description: "Procedimiento corto con poca trampa." },
  3: { level: 3, name: "Intermedio", description: "Requiere elegir método o combinar pasos." },
  4: { level: 4, name: "Difícil", description: "Mezcla conceptos, álgebra o análisis." },
  5: { level: 5, name: "Tipo examen", description: "Ejercicio largo, con interpretación o varios casos." },
});

export const CALCULUS_I_VIDEO_SCOPE = "Cálculo I · MM201 II-PAC 2026";

export const CALCULUS_I_VIDEO_BLOCKED_TERMS = Object.freeze([
  "cálculo ii", "calculo ii", "cálculo 2", "calculo 2",
  "cálculo iii", "calculo iii", "cálculo 3", "calculo 3",
  "multivariable", "variable vectorial", "cálculo vectorial", "calculo vectorial",
  "integrales múltiples", "integrales multiples", "dobles integrales", "triple integral",
  "series", "sucesiones", "ecuaciones diferenciales", "laplace", "fourier",
  "gradiente", "divergencia", "rotacional", "paramétricas", "parametricas"
]);

export const CALCULUS_PINNED_PRACTICE_BY_DATE = Object.freeze({
  "2026-05-26": {
    title: "Práctica fijada · Asíntotas verticales, horizontales y oblicuas",
    instructions: "Estos son los mismos ejercicios guardados desde tu PDF de hoy para no gastar tokens. Mañana LifeOS vuelve a generar práctica nueva según la jornalización.",
    difficulty: "Nivel 3 · Intermedio",
    estimatedMinutes: 85,
    pinned: true,
    exercises: [
      { id:"pinned-asym-1", title:"Identificar asíntotas verticales por dominio", topic:"Asíntotas verticales", type:"Procedimiento", questionMode:"procedimiento", difficultyLevel:1, statement:"Sea f(x) = (2x + 3)/(x² − 4). Determina los valores de x donde existen asíntotas verticales. Justifica por qué esos puntos hacen indefinida la función y analiza el comportamiento de los límites laterales.", hint:"Factorizá el denominador y buscá dónde se anula. Luego evaluá límites cuando x se acerca a esos valores desde ambos lados." },
      { id:"pinned-asym-2", title:"Calcular asíntota horizontal con límites al infinito", topic:"Asíntotas horizontales", type:"Procedimiento", questionMode:"procedimiento", difficultyLevel:2, statement:"Analiza g(x) = (3x² + 2x − 1)/(5x² + 4). Calcula limₓ→∞ g(x) y limₓ→−∞ g(x). ¿Existe asíntota horizontal? Si es así, escribe su ecuación.", hint:"Dividí numerador y denominador por la potencia más alta de x. Observá qué términos tienden a cero." },
      { id:"pinned-asym-3", title:"Asíntota horizontal en función racional con raíces", topic:"Asíntotas horizontales", type:"Procedimiento", questionMode:"procedimiento", difficultyLevel:3, statement:"Para h(x) = √(4x² + 1)/(2x − 3), calcula limₓ→∞ h(x). ¿Existe asíntota horizontal? Justifica tu respuesta.", hint:"Recordá que √(x²) = |x|. Para x → ∞, |x| = x." },
      { id:"pinned-asym-4", title:"Identificar asíntota oblicua por división polinomial", topic:"Asíntotas oblicuas", type:"Procedimiento", questionMode:"procedimiento", difficultyLevel:3, statement:"Sea f(x) = (x² + 3x + 2)/(x + 1). Realiza la división polinomial del numerador entre el denominador. ¿Existe asíntota oblicua? Si es así, escribe su ecuación y explica por qué la recta obtenida es la asíntota.", hint:"Dividí x² + 3x + 2 entre x + 1. Revisá si hay residuo y si existe discontinuidad removible." },
      { id:"pinned-asym-5", title:"Análisis completo de asíntotas en función racional", topic:"Asíntotas verticales, horizontales y oblicuas", type:"Procedimiento", questionMode:"procedimiento", difficultyLevel:3, statement:"Analiza completamente la función f(x) = (2x² − x − 3)/(x² − 3). Encuentra: a) dominio, b) asíntotas verticales, c) asíntotas horizontales. Justifica cada respuesta.", hint:"Factorizá numerador y denominador. Identificá discontinuidades y luego compará grados para asíntotas horizontales." },
      { id:"pinned-asym-6", title:"Asíntota oblicua con grados consecutivos", topic:"Asíntotas oblicuas", type:"Procedimiento", questionMode:"procedimiento", difficultyLevel:4, statement:"Dada f(x) = (x³ − 2x² + 1)/(x² + 1), realiza división polinomial. Determina si existe asíntota oblicua y escribe su ecuación. ¿Qué tipo de asíntota es?", hint:"Dividí x³ − 2x² + 1 entre x² + 1. El cociente es una expresión lineal: esa es la asíntota oblicua." },
      { id:"pinned-asym-7", title:"Comportamiento de función cerca de asíntotas", topic:"Análisis gráfico de asíntotas", type:"Procedimiento", questionMode:"procedimiento", difficultyLevel:4, statement:"Para f(x) = (x + 2)/(x(x − 3)), identifica todas las asíntotas. Luego, describe el comportamiento de f(x) en cada región del dominio: x < 0, 0 < x < 3, x > 3. ¿La función cruza alguna asíntota?", hint:"Identificá asíntotas verticales x = 0 y x = 3, y horizontal y = 0. Luego evaluá signos por región." },
      { id:"pinned-asym-8", title:"Caso especial: oblicua con cancelación de factores", topic:"Discontinuidad removible vs. asíntota", type:"Procedimiento", questionMode:"procedimiento", difficultyLevel:4, statement:"Sea f(x) = (x² − 1)/(x − 1) para x ≠ 1. Simplifica la función. ¿Tiene asíntotas verticales? ¿Tiene asíntotas horizontales u oblicuas? Explica por qué la simplificación cambia el análisis.", hint:"Factorizá numerador y denominador. Cancelá factores comunes. La función simplificada no tiene asíntota vertical en x = 1, sino un agujero." },
      { id:"pinned-asym-9", title:"Verdadero/Falso conceptual", topic:"Teoría de asíntotas", type:"Verdadero/Falso", questionMode:"verdadero/falso", difficultyLevel:2, statement:"Decide si cada afirmación es verdadera o falsa y justifica con una oración: a) Toda discontinuidad produce una asíntota vertical. b) Una función racional puede cruzar una asíntota horizontal. c) Si el grado del numerador es exactamente uno mayor que el del denominador, puede existir asíntota oblicua.", hint:"Pensá en discontinuidades removibles, comportamiento al infinito y división polinomial." },
      { id:"pinned-asym-10", title:"Selección múltiple rápida", topic:"Clasificación de asíntotas", type:"Selección", questionMode:"selección múltiple", difficultyLevel:2, statement:"Para una función racional con grado del numerador 3 y grado del denominador 2, ¿qué comportamiento al infinito esperás normalmente?", options:["Asíntota horizontal y = 0", "Asíntota horizontal igual al cociente de coeficientes líderes", "Asíntota oblicua o polinomial lineal", "No se puede analizar con grados"], hint:"Compará los grados: numerador = denominador + 1." },
      { id:"pinned-asym-11", title:"Competición contra reloj", topic:"Asíntotas mixtas", type:"Competición", questionMode:"reto contra reloj", difficultyLevel:3, statement:"Reto de 6 minutos: clasifica el tipo de asíntota de estas funciones sin resolver todo el procedimiento. Escribe solo el tipo y la razón: a) (x + 1)/(x² + 4), b) (3x² − 1)/(x² + 2), c) (x² + 5)/(x − 1), d) (x³ + 1)/(x² − 4).", hint:"Usá comparación de grados y luego revisá denominadores para verticales." },
    ],
  },
});

