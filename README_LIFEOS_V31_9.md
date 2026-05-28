# LifeOS v31.9 — Timer Pause Stability

## Fix
- Rocket League timers no longer visually reset when paused.
- Added local optimistic elapsed state so the UI keeps the elapsed seconds immediately after pausing while the reducer persistence catches up.
- Completing a timed Rocket block also updates local elapsed state immediately.

## Files changed
- `src/runtime/LifeOS.jsx`

## Apply
Copy the contents of this patch over the project root, then run:

```bash
npm run build
git add .
git commit -m "Fix Rocket timer pause reset"
git push
```
