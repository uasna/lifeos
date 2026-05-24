const DEFAULT_MODEL = "claude-haiku-4-5-20251001";
const ANTHROPIC_VERSION = "2023-06-01";

export function jsonResponse(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export async function readJsonBody(req, maxBytes = 160_000) {
  return await new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (Buffer.byteLength(raw, "utf8") > maxBytes) {
        reject(new Error("Payload demasiado grande."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error("JSON inválido.")); }
    });
    req.on("error", reject);
  });
}

export function extractTextFromAnthropicResponse(data) {
  const parts = [];
  for (const item of data?.content || []) {
    if (item?.type === "text" && typeof item?.text === "string") parts.push(item.text);
  }
  return parts.join("\n").trim();
}

export function parseModelJson(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("Claude no devolvió contenido.");
  try { return JSON.parse(raw); } catch {}
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return JSON.parse(fenced[1]);
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) return JSON.parse(raw.slice(start, end + 1));
  throw new Error("Claude no devolvió JSON válido.");
}

export async function callClaude({ system, user, maxTokens = 1800, temperature = 0.35 }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const e = new Error("Falta ANTHROPIC_API_KEY en Vercel.");
    e.statusCode = 500;
    throw e;
  }
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const body = {
    model,
    max_tokens: maxTokens,
    temperature,
    system,
    messages: [
      { role: "user", content: [{ type: "text", text: user }] },
    ],
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || `Claude respondió ${response.status}`;
    const e = new Error(message);
    e.statusCode = response.status;
    throw e;
  }
  return data;
}

export function getClaudeModelName() {
  return process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
}
