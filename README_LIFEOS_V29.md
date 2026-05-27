# LifeOS v29 — Utility Extraction Pass

Fase 2 de optimización modular.

## Objetivo
Reducir el tamaño y acoplamiento de `src/runtime/LifeOS.jsx` sin cambiar comportamiento funcional.

## Archivos nuevos

```txt
src/utils/time.js
src/utils/random.js
src/utils/audio.js
src/utils/xp.js
```

## Qué se movió

- Fechas, contadores y formato de tiempo → `src/utils/time.js`
- Random determinístico para rotaciones → `src/utils/random.js`
- Sonidos y preferencias locales de audio → `src/utils/audio.js`
- Matemática de XP/nivel/penalización → `src/utils/xp.js`

## Qué NO se cambió

- Supabase
- PWA / Service Worker
- Claude API
- Schema de persistencia
- Datos del usuario
- Lógica de Rocket League / Cálculo / Clóset

## Verificación

Ejecutar:

```bash
npm run build
```

Luego:

```bash
git add .
git commit -m "Extract LifeOS utility modules"
git push
```
