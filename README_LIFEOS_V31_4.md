# LifeOS v31.4 — Rocket Fundamentals + Fixed Schedule

## Cambios

- Rocket League pasa de 60 min a 90 min diarios.
- Ranked/1v1 queda como bloque opcional: no bloquea completar la misión Rocket.
- La rotación diaria cambia a fundamentos útiles para Platino/Diamond bajo:
  - Lunes: Powershots + precisión.
  - Martes: Recoveries + wavedash.
  - Miércoles: Dribbling + primer toque.
  - Jueves: Shadow defense + saves.
  - Viernes: Aéreos básicos + reads.
  - Sábado: Kickoffs + decision making, con speedflip solo como mantenimiento corto.
  - Domingo: Review suave + mecánica débil.
- Cálculo queda como bloque externo fijo:
  - Mañana: 8:10 AM–9:40 AM.
  - Noche: 11:15 PM–11:45 PM, repaso antes de dormir.
- Tarde fija:
  - 2:15 PM–2:40 PM: Mecanografía.
  - 2:40 PM–3:40 PM: Blender.
  - 3:40 PM–5:10 PM: Rocket League.
  - 5:10 PM en adelante: tiempo libre / ranked opcional.

## Estabilidad

- No cambia Supabase.
- No cambia PWA.
- No cambia Claude API.
- No cambia schema.
- No borra datos.

## Aplicación

Copiar el contenido del ZIP encima del proyecto real, no la carpeta completa.

Luego ejecutar:

```bash
npm run build
git add .
git commit -m "Refocus Rocket training and fix daily schedule"
git push
```
