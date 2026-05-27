# LifeOS v30 — Feature View Extraction

Optimización modular por fases. Esta versión extrae vistas grandes fuera de `src/runtime/LifeOS.jsx` sin cambiar comportamiento ni schema.

## Archivos nuevos

- `src/features/calculus/CalculusTrainerView.jsx`
- `src/features/rocket/RocketLeagueView.jsx`
- `src/features/wardrobe/WardrobeView.jsx`

## Qué cambia

- `LifeOS.jsx` queda como orquestador.
- Cálculo, Rocket League y Clóset viven en módulos de feature.
- Se mantienen Supabase, PWA, Claude API, reset diario, XP, Rocket League 70/30 y Clóset.

## Validación

Ejecutar:

```bash
npm run build
```
