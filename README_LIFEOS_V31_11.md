# LifeOS v31.11 — Timer sound unlock fix

## Cambios

- Refuerza `src/utils/audio.js` para desbloquear WebAudio con interacción real del usuario.
- Agrega un puente global de desbloqueo de audio en `LifeOS.jsx` usando pointer/click/key/touch.
- Cuando un bloque de Rocket llega al objetivo, dispara doble cue corto de timer para evitar que el primer intento se pierda por `resume()` asíncrono.
- El modo Sesión de enfoque usa el mismo cue reforzado.
- Agrega vibración como fallback en móvil cuando el navegador permite `navigator.vibrate`.

## No cambia

- Supabase
- PWA
- schema
- Rocket roadmap
- Training Packs
- Workshop pausado
- Cálculo como bloque/misión

## Aplicación

Copiar el contenido del ZIP sobre la raíz del proyecto y ejecutar:

```bash
npm run build
git add .
git commit -m "Fix LifeOS timer sound unlock"
git push
```
