import { callClaude, extractTextFromAnthropicResponse, getClaudeModelName, jsonResponse, parseModelJson, readJsonBody } from "./_anthropic-utils.js";

function sanitizePlan(plan = {}) {
  return {
    dateKey: String(plan.dateKey || "").slice(0, 10),
    topic: String(plan.topic || "Cálculo I").slice(0, 240),
    mode: String(plan.mode || "Práctica").slice(0, 80),
    partial: String(plan.partial || "").slice(0, 30),
    focus: Array.isArray(plan.focus) ? plan.focus.map(x => String(x).slice(0, 80)).slice(0, 8) : [],
    source: String(plan.source || "Jornalización MM201 · II-PAC 2026").slice(0, 120),
    cumulativeReview: Boolean(plan.cumulativeReview),
    reviewTopics: Array.isArray(plan.reviewTopics) ? plan.reviewTopics.map(x => String(x).slice(0, 160)).slice(0, 40) : [],
    latestClassTopic: plan.latestClassTopic ? String(plan.latestClassTopic).slice(0, 200) : null,
    rule: String(plan.rule || "").slice(0, 300),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return jsonResponse(res, 405, { error: "Método no permitido." });
  try {
    const body = await readJsonBody(req);
    const plan = sanitizePlan(body.plan || {});
    const recentHistory = Array.isArray(body.recentHistory) ? body.recentHistory.slice(-5) : [];
    const settings = body.settings && typeof body.settings === "object" ? body.settings : {};
    const seenTopics = Array.isArray(body.seenTopics) ? body.seenTopics.map(x => String(x).slice(0, 160)).slice(0, 40) : plan.reviewTopics;
    const cumulativeReview = Boolean(body.cumulativeReview || plan.cumulativeReview);
    const isWeekend = cumulativeReview || /fin de semana|variado|repaso acumulativo/i.test(plan.mode + " " + plan.topic);
    const isExamMode = /parcial|examen|simulación|tipo examen/i.test(plan.mode + " " + plan.topic);
    const requestedCount = Math.max(4, Math.min(12, Number(
      isExamMode ? settings.examModeExerciseCount : isWeekend ? settings.weekendExerciseCount : settings.dailyExerciseCount
    ) || (isExamMode ? 12 : isWeekend ? 10 : 8)));

    const system = `Eres un profesor senior de Cálculo I (MM201) para UNAH. Generas práctica original, clara y graduada. No das soluciones dentro de los enunciados. Respondes únicamente JSON válido, sin markdown.`;
    const user = JSON.stringify({
      task: "Genera ejercicios diarios adaptativos de Cálculo I para LifeOS.",
      constraints: [
        "Curso: MM201 Cálculo I.",
        "Fuente autorizada: Jornalización MM201 II-PAC 2026. No uses calendarios viejos.",
        "El estudiante estudia de 8:10 AM a 9:45 AM.",
        "Viernes, sábado y domingo deben funcionar como Repaso acumulativo: mezclar temas vistos hasta la fecha según la jornalización.",
        "No incluyas temas futuros que no estén en seenTopics/reviewTopics.",
        "La semana previa a examen debe sentirse tipo parcial con dificultad mayor.",
        "Usa dificultad clara con difficultyLevel 1-5: 1 Básico, 2 Fácil, 3 Intermedio, 4 Difícil, 5 Tipo examen.",
        "No incluyas soluciones ni respuestas finales en el enunciado.",
        "Enunciados en español.",
      ],
      todayPlan: plan,
      cumulativeReview,
      seenTopics,
      adaptiveMode: body.adaptiveMode || "Práctica normal.",
      recentHistory,
      requestedCount,
      outputShape: {
        title: "string",
        instructions: "string",
        difficulty: "básico|medio|tipo examen|difícil",
        estimatedMinutes: "number",
        exercises: [
          { id: "e1", title: "string", statement: "string", topic: "string", type: "string", difficultyLevel: "number 1-5", difficulty: "Nivel X · Nombre", targetSkill: "string", hint: "string breve" }
        ]
      }
    }, null, 2);

    const data = await callClaude({ system, user, maxTokens: 2600, temperature: 0.45 });
    const parsed = parseModelJson(extractTextFromAnthropicResponse(data));
    if (!Array.isArray(parsed.exercises) || parsed.exercises.length === 0) throw new Error("Claude no generó ejercicios.");
    return jsonResponse(res, 200, {
      title: parsed.title || `Práctica de ${plan.topic}`,
      instructions: parsed.instructions || "Resolvé con procedimiento claro.",
      difficulty: parsed.difficulty || (cumulativeReview ? "Repaso acumulativo" : plan.mode || "medio"),
      estimatedMinutes: parsed.estimatedMinutes || 75,
      exercises: parsed.exercises.slice(0, requestedCount),
      meta: { source: plan.source, dateKey: plan.dateKey, model: getClaudeModelName(), provider: "anthropic" }
    });
  } catch (err) {
    return jsonResponse(res, err.statusCode || 500, { error: err.message || "Error generando práctica." });
  }
}
