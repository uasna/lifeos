# LifeOS v31.1 — Stabilization patch

This patch fixes runtime crashes when opening Rocket League and Clóset after v30/v31 modular feature extraction.

What changed:
- Restores RocketLeagueView and WardrobeView inline inside `src/runtime/LifeOS.jsx` for stability.
- Keeps the static data/util module extraction from v28.2/v29.
- Leaves feature files harmless if they already exist, but they are no longer used by the runtime.
- No schema change.
- No Supabase change.
- No PWA/API change.
- No data reset.

Apply by copying the contents of this folder over the real project root, then run:

```bash
npm run build
git add .
git commit -m "Stabilize Rocket League and closet views"
git push
```
