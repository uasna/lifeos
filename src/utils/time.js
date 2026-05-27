// ============================================================
// LifeOS v29 · Shared time/date utilities
// Pure helpers only. No React, no storage, no app state.
// ============================================================

export const T = (h, m = 0) => h * 60 + m;

export const fmt = (minutes = 0) => {
  const safe = Math.max(0, Math.floor(Number(minutes) || 0));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
};

export const fmtDur = (minutes = 0) => {
  const safe = Math.max(0, Math.floor(Number(minutes) || 0));
  return safe >= 60 ? `${Math.floor(safe / 60)}h${safe % 60 ? ` ${safe % 60}m` : ""}` : `${safe}m`;
};

export function buildTimed(startMin, blocks) {
  let cur = Number(startMin) || 0;
  return (Array.isArray(blocks) ? blocks : []).map((b) => {
    const duration = Number(b?.duration) || 0;
    const item = { ...b, startMin: cur, endMin: cur + duration };
    cur += duration;
    return item;
  });
}

export function formatSeconds(totalSeconds = 0) {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatCountdownSeconds(totalSeconds = 0) {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getSecondsUntilNextLocalDay(nowMs = Date.now()) {
  const now = new Date(nowMs);
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));
}

export function formatLocalDateKey(date = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getLifeOSDateKey(date = new Date()) {
  return formatLocalDateKey(date);
}

export function getScheduleWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1; // Monday = 0
  d.setDate(d.getDate() - dayIdx);
  return formatLocalDateKey(d);
}

export function getSecondsUntilNextScheduleWeek(nowMs = Date.now()) {
  const now = new Date(nowMs);
  const next = new Date(now);
  const daysUntilMonday = now.getDay() === 0 ? 1 : 8 - now.getDay();
  next.setDate(now.getDate() + daysUntilMonday);
  next.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));
}

export function parseDateKeyLocal(dateKey) {
  const [y, m, d] = String(dateKey || "").split("-").map(Number);
  return new Date(y || 2000, (m || 1) - 1, d || 1);
}

export function addDaysToDateKey(dateKey, days = 0) {
  const d = parseDateKeyLocal(dateKey);
  d.setDate(d.getDate() + Number(days || 0));
  return formatLocalDateKey(d);
}

export function daysBetweenDateKeys(fromKey, toKey) {
  const a = parseDateKeyLocal(fromKey);
  const b = parseDateKeyLocal(toKey);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function getDateKeyForScheduleDay(weekKey, dayIdx) {
  return addDaysToDateKey(weekKey || getScheduleWeekKey(), dayIdx || 0);
}
