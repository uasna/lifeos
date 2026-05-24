# LifeOS v18 · Cálculo API con Claude / Anthropic

Archivos nuevos o reemplazados:

- `api/_anthropic-utils.js`
- `api/generate-calculus-practice.js`
- `api/evaluate-calculus-answer.js`
- `src/runtime/LifeOS.jsx`

Variable obligatoria en Vercel:

- `ANTHROPIC_API_KEY`

Variable opcional:

- `ANTHROPIC_MODEL`

Modelo por defecto:

- `claude-haiku-4-5-20251001`

Para más calidad en corrección de Cálculo, podés usar:

- `claude-sonnet-4-6`

La API key nunca debe ir dentro de `src/runtime/LifeOS.jsx` ni en `.env` subido a GitHub.
Guardala solo en Vercel → Project Settings → Environment Variables.
