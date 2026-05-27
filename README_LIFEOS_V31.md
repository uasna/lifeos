# LifeOS v31 — Modularization Stabilization Pass

This patch finishes the modularization pass and fixes the runtime crash introduced in v30.

## Fixes

- Imports extracted feature views from `src/features/*` into `src/runtime/LifeOS.jsx`.
- Fixes `RocketLeagueView` speedflip card dependency injection by passing `S` correctly.
- Keeps Supabase, PWA, Claude API, Rocket League, Cálculo and Clóset behavior unchanged.

## Apply

Copy the contents of this patch over your project root, then run:

```bash
npm run build
git add .
git commit -m "Stabilize LifeOS modular feature imports"
git push
```
