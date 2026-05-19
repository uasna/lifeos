// MODULE_BOUNDARY: runtime/logger
// DEV-only — all exports are no-ops in production.
// Zero external dependencies. Zero prod bundle cost.
const IS_DEV = (
  typeof process !== "undefined"
    ? process.env.NODE_ENV !== "production"
    : typeof window !== "undefined" && !window.__LIFEOS_PROD__
);

const _rr = new Map(); // render registry
const _ar = new Map(); // adaptive calc registry

export const DevLogger = Object.freeze({
  // Warns when a component exceeds STORM_THRESHOLD renders within 1s window.
  trackRender(name) {
    if (!IS_DEV) return;
    const now = Date.now();
    const e   = _rr.get(name) ?? { count: 0, t: now };
    if (now - e.t > 1000) { _rr.set(name, { count: 1, t: now }); return; }
    const c = e.count + 1;
    _rr.set(name, { count: c, t: e.t });
    if (c === 15) console.warn(`[LifeOS] Render storm: ${name} (${c}× / 1s) — verify memo boundaries`);
  },

  // Warns when AdaptiveEngine re-runs excessively — signals unstable currentBlocks ref.
  trackAdaptive(label) {
    if (!IS_DEV) return;
    const now = Date.now();
    const e   = _ar.get(label) ?? { count: 0, t: now };
    if (now - e.t > 500) { _ar.set(label, { count: 1, t: now }); return; }
    const c = e.count + 1;
    _ar.set(label, { count: c, t: e.t });
    if (c === 8) console.warn(`[LifeOS] Adaptive storm: ${label} (${c}× / 500ms) — check currentBlocks stability at call site`);
  },

  resetCounters() {
    if (!IS_DEV) return;
    _rr.clear(); _ar.clear();
  },
});