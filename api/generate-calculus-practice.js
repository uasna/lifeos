import { callClaude, extractTextFromAnthropicResponse, getClaudeModelName, jsonResponse, parseModelJson, readJsonBody } from "./_anthropic-utils.js";

function sanitizePlan(plan = {}) {
  return {
    dateKey: String(plan.dateKey || "").slice(0, 10),
    topic: String(plan.topic || "Cálculo I").slice(0, 240),
    mode: String(plan.mode || "Práctica").slice(0, 80),
    partial: String(plan.partial || "").slice(0, 30),
    focus: Array.isArray(plan.focus) ? plan.focus.map(x => String(x).slice(0, 80)).slice(0, 8) : [],
    source: String(plan.source || "Jornalización MM201 · II-PAC 2026").slice(0, 120),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return jsonResponse(res, 405, { error: "Método no permitido." });
  try {
    const body = await readJsonBody(req);
    const plan = sanitizePlan(body.plan || {});
    const recentHistory = Array.isArray(body.recentHistory) ? body.recentHistory.slice(-5) : [];
    const settings = body.settings && typeof body.settings === "object" ? body.settings : {};
    const isWeekend = /fin de semana|variado/i.test(plan.mode + " " + plan.topic);
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
        "Los fines de semana deben mezclar temas vistos.",
        "La semana previa a examen debe sentirse tipo parcial con dificultad mayor.",
        "No incluyas soluciones ni respuestas finales en el enunciado.",
        "Enunciados en español.",
      ],
      todayPlan: plan,
      adaptiveMode: body.adaptiveMode || "Práctica normal.",
      recentHistory,
      requestedCount,
      outputShape: {
        title: "string",
        instructions: "string",
        difficulty: "básico|medio|tipo examen|difícil",
        estimatedMinutes: "number",
        exercises: [
          { id: "e1", title: "string", statement: "string", topic: "string", type: "string", difficulty: "string", targetSkill: "string", hint: "string breve" }
        ]
      }
    }, null, 2);

    const data = await callClaude({ system, user, maxTokens: 2600, temperature: 0.45 });
    const parsed = parseModelJson(extractTextFromAnthropicResponse(data));
    if (!Array.isArray(parsed.exercises) || parsed.exercises.length === 0) throw new Error("Claude no generó ejercicios.");
    return jsonResponse(res, 200, {
      title: parsed.title || `Práctica de ${plan.topic}`,
      instructions: parsed.instructions || "Resolvé con procedimiento claro.",
      difficulty: parsed.difficulty || plan.mode || "medio",
      estimatedMinutes: parsed.estimatedMinutes || 75,
      exercises: parsed.exercises.slice(0, requestedCount),
      meta: { source: plan.source, dateKey: plan.dateKey, model: getClaudeModelName(), provider: "anthropic" }
    });
  } catch (err) {
    return jsonResponse(res, err.statusCode || 500, { error: err.message || "Error generando práctica." });
  }
}
