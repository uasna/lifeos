// ============================================================
// LifeOS v31.11 · Audio utility layer
// Browser-safe helpers with explicit user-gesture unlock.
// ============================================================

export const DEFAULT_SOUND_PREFS = Object.freeze({
  enabled: true,
  menu: true,
  complete: true,
  timer: true,
  alarm: true,
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
let lifeOSAudioUnlocked = false;
let lastSoundAt = 0;

function clampVolume(value) {
  return Math.max(0, Math.min(1, Number(value) || 0.75));
}

export function getLifeOSAudioContext() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!lifeOSAudioCtx) lifeOSAudioCtx = new Ctx();
  return lifeOSAudioCtx;
}

function primeLifeOSAudio(ctx) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime || 0;
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    gain.gain.setValueAtTime(0.00001, now);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  } catch {}
}

export function unlockLifeOSAudio() {
  const ctx = getLifeOSAudioContext();
  if (!ctx) return false;

  const markReady = () => {
    lifeOSAudioUnlocked = true;
    primeLifeOSAudio(ctx);
    return true;
  };

  if (ctx.state === "running") return markReady();

  try {
    const resume = ctx.resume?.();
    if (resume && typeof resume.then === "function") {
      resume.then(markReady).catch(() => {});
    }
    return true;
  } catch {
    return false;
  }
}

export function isLifeOSAudioUnlocked() {
  const ctx = lifeOSAudioCtx;
  return Boolean(lifeOSAudioUnlocked && ctx && ctx.state === "running");
}

function soundAllowed(kind, prefs) {
  if (!prefs.enabled) return false;
  if (kind === "menu" && prefs.menu === false) return false;
  if (kind === "timer" && prefs.timer === false) return false;
  if (kind === "alarm" && (prefs.alarm === false || prefs.timer === false)) return false;
  if (kind === "mission" && prefs.mission === false) return false;
  if ((kind === "complete" || !["menu", "timer", "alarm", "mission"].includes(kind)) && prefs.complete === false) return false;
  return true;
}

function emitLifeOSSound(ctx, kind, volume) {
  if (!ctx || ctx.state !== "running") return false;

  const now = ctx.currentTime;
  const patterns = {
    menu: [440, 554.37],
    timer: [660, 880, 1174.66],
    alarm: [880, 880, 880, 1174.66, 880, 1174.66],
    complete: [523.25, 659.25, 783.99],
    mission: [392, 523.25, 659.25, 987.77],
  };
  const notes = patterns[kind] || patterns.complete;

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + index * (kind === "alarm" ? 0.16 : kind === "timer" ? 0.11 : 0.09);
    const peak = kind === "alarm" ? 0.11 : kind === "timer" ? 0.065 : kind === "mission" ? 0.055 : 0.04;

    osc.type = kind === "alarm" ? "square" : kind === "timer" ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak * volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (kind === "alarm" ? 0.12 : kind === "timer" ? 0.18 : 0.12));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + (kind === "alarm" ? 0.14 : kind === "timer" ? 0.21 : 0.14));
  });

  if ((kind === "timer" || kind === "alarm" || kind === "mission") && typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    try { navigator.vibrate(kind === "alarm" ? [260, 90, 260, 90, 420] : kind === "timer" ? [70, 40, 70] : 80); } catch {}
  }

  lastSoundAt = Date.now();
  return true;
}

export function playLifeOSSound(kind = "complete") {
  const prefs = getStoredAudioPrefs();
  if (!soundAllowed(kind, prefs)) return false;

  const ctx = getLifeOSAudioContext();
  if (!ctx) return false;

  const volume = clampVolume(prefs.volume);
  const now = Date.now();
  if (kind !== "menu" && kind !== "alarm" && now - lastSoundAt < 220) return false;

  if (ctx.state === "running") {
    lifeOSAudioUnlocked = true;
    return emitLifeOSSound(ctx, kind, volume);
  }

  try {
    const resume = ctx.resume?.();
    if (resume && typeof resume.then === "function") {
      resume.then(() => {
        lifeOSAudioUnlocked = true;
        emitLifeOSSound(ctx, kind, volume);
      }).catch(() => {});
      return true;
    }
  } catch {}

  return false;
}
