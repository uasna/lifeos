# LifeOS v28.2 — Modular Data Extraction

This patch keeps behavior unchanged and starts the safe modular optimization pass.

Files changed/added:

- `src/runtime/LifeOS.jsx`
- `src/data/rocketLeagueData.js`
- `src/data/wardrobeData.js`
- `src/data/calculusData.js`

What moved out of `LifeOS.jsx`:

- Rocket League static data, plan definitions, weekly focus helpers and pure planning helpers.
- Wardrobe static item/color/type data.
- Cálculo I/MM201 static schedule, difficulty labels, blocked video terms and pinned practice data.

No state schema change. No Supabase change. No PWA/service worker change. No API change.
