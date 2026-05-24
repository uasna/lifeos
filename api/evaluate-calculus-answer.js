import { callClaude, extractTextFromAnthropicResponse, jsonResponse, parseModelJson, readJsonBody } from "./_anthropic-utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return jsonResponse(res, 405, { error: "Método no permitido." });
  try {
    const body = await readJsonBody(req);
    const exercise = body.exercise && typeof body.exercise === "object" ? body.exercise : {};
    const answer = String(body.answer || "").trim().slice(0, 12000);
    const plan = body.plan && typeof body.plan === "object" ? body.plan : {};
    if (!exercise.statement || !answer) return jsonResponse(res, 400, { error: "Falta ejercicio o respuesta." });

    const system = `Eres un corrector estricto pero pedagógico de Cálculo I. Evalúas procedimiento, no solo respuesta final. Respondes únicamente JSON válido, sin markdown.`;
    const user = JSON.stringify({
      task: "Corrige la respuesta del estudiante.",
      rules: [
        "Usa español claro.",
        "Detecta errores de álgebra, concepto, notación, dominio, límites laterales, continuidad, derivación o integración según aplique.",
        "Si hay un error, explica el primer punto donde se desvía.",
        "Incluye solución correcta resumida con pasos suficientes.",
        "No humilles; sé exigente y útil.",
      ],
      plan: { topic: plan.topic, mode: plan.mode, focus: plan.focus },
      exercise,
      studentAnswer: answer,
      outputShape: {
        correct: "boolean",
        score: "number 0-100",
        feedback: "string",
        correctSolution: "string",
        errorType: "string",
        nextFocus: "string"
      }
    }, null, 2);

    const data = await callClaude({ system, user, maxTokens: 2200, temperature: 0.2 });
    const parsed = parseModelJson(extractTextFromAnthropicResponse(data));
    return jsonResponse(res, 200, {
      correct: Boolean(parsed.correct),
      score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
      feedback: String(parsed.feedback || "Revisá el procedimiento.").slice(0, 1600),
      correctSolution: String(parsed.correctSolution || "").slice(0, 3000),
      errorType: String(parsed.errorType || "sin clasificar").slice(0, 80),
      nextFocus: String(parsed.nextFocus || "Repetir un ejercicio similar.").slice(0, 240),
    });
  } catch (err) {
    return jsonResponse(res, err.statusCode || 500, { error: err.message || "Error corrigiendo respuesta." });
  }
}
