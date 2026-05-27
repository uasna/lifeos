// ============================================================
// LifeOS v29 · Audio utility layer
// Browser-safe helpers. No React and no app state coupling.
// ============================================================

export const DEFAULT_SOUND_PREFS = Object.freeze({
  enabled: true,
  menu: true,
  complete: true,
  timer: true,
  mission: true,
  volume: 0.75,
});

export function getStoredAudioPrefs() {
  try {
    if (typeof localStorage === "undefined") return { ...DEFAULT_SOUND_PREFS };
    const raw = localStorage.getItem("lifeos:audio");
    if (!raw) return { ...DEFAULT_SOUND_PREFS };
    return { ...DEFAULT_SOUND_PREFS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SOUND_PREFS };
  }
}

export function persistAudioPrefs(sound) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("lifeos:audio", JSON.stringify({ ...DEFAULT_SOUND_PREFS, ...(sound || {}) }));
  } catch {}
}

let lifeOSAudioCtx = null;

export function getLifeOSAudioContext() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!lifeOSAudioCtx) lifeOSAudioCtx = new Ctx();
  return lifeOSAudioCtx;
}

export function unlockLifeOSAudio() {
  const ctx = getLifeOSAudioContext();
  if (ctx?.state === "suspended") ctx.resume().catch(() => {});
}

export function playLifeOSSound(kind = "complete") {
  const prefs = getStoredAudioPrefs();
  if (!prefs.enabled) return;
  if (kind === "menu" && prefs.menu === false) return;
  if (kind === "timer" && prefs.timer === false) return;
  if (kind === "mission" && prefs.mission === false) return;
  if ((kind === "complete" || !["menu", "timer", "mission"].includes(kind)) && prefs.complete === false) return;

  const ctx = getLifeOSAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});

  const now = ctx.currentTime;
  const volume = Math.max(0, Math.min(1, Number(prefs.volume) || 0.75));
  const patterns = {
    menu: [440, 554.37],
    timer: [660, 880],
    complete: [523.25, 659.25, 783.99],
    mission: [392, 523.25, 659.25, 987.77],
  };
  const notes = patterns[kind] || patterns.complete;

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = kind === "timer" ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, now + index * 0.09);
    gain.gain.setValueAtTime(0.0001, now + index * 0.09);
    gain.gain.exponentialRampToValueAtTime((kind === "mission" ? 0.055 : 0.04) * volume, now + index * 0.09 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + index * 0.09);
    osc.stop(now + index * 0.09 + 0.14);
  });
}
