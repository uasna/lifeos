# LifeOS v31.7 · Rocket 2-Week Fundamentals Roadmap

## Objetivo
Reemplaza el enfoque de mecánica distinta por día por un roadmap de ciclos de 2 semanas para Rocket League.

## Cambios
- Rocket ahora usa ciclos de 2 semanas:
  - Semanas 1–2: shots simples + rotación básica 2v2.
  - Semanas 3–4: ground dribble básico.
  - Semanas 5–6: aerial control direccional.
  - Semana 7+: speedflip limpio.
- Regla central: máximo 1 mecánica nueva a la vez.
- La sesión sigue siendo 90 min diarios.
- Ranked / 1v1 / 2v2 queda opcional y no bloquea la misión.
- Se mantienen fundamentos diarios:
  - recoveries básicas,
  - caer con ruedas,
  - boost management,
  - no double commit,
  - anti-tilt,
  - replay / mental note.
- Training Packs siguen activos como parte principal del entrenamiento.
- Workshop queda pausado hasta nuevo aviso.
- Dribbling Challenge 1 Remastered queda solo como biblioteca/benchmark manual, no misión diaria.
- Speedflip deja de ser diario: entra como foco desde semana 7+ o mantenimiento corto.

## Archivos modificados
- src/data/rocketLeagueData.js
- src/runtime/LifeOS.jsx
- src/features/rocket/RocketLeagueView.jsx

## Verificación
Build probado con:

```bash
npm run build
```

Resultado: compilación exitosa. Solo quedaron warnings existentes de Tailwind/chunk grande.
