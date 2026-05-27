# LifeOS v31.2 — Rocket 70/30 clarity patch

Este patch estabiliza la lectura del entrenamiento Rocket League para evitar que un día de foco parezca tres mecánicas distintas a masterizar.

## Cambios

- Añade roles visibles por bloque:
  - Foco principal
  - Apoyo técnico
  - Bloque fijo
  - Registro mental
- En días de speedflip, deja claro que:
  - Speedflip DAR Clean Cancel y Musty map son el foco principal.
  - Recoveries e Ice Rings son apoyo técnico para aterrizaje, powerslide y salida limpia.
  - Ice Rings baja a 8 minutos para no sentirse como otro entrenamiento completo.
- Añade explicación visual de la regla 70/30 dentro de Rocket League.
- Mantiene Freeplay y 3 partidas de 1v1 como bloques fijos.

## No toca

- Supabase
- PWA
- Claude API
- Schema
- Datos guardados
- Cálculo
- Clóset

## Aplicación

Copiar el contenido de este ZIP encima del proyecto real, no la carpeta completa.

```bash
npm run build
git add .
git commit -m "Clarify Rocket 70 30 training roles"
git push
```
