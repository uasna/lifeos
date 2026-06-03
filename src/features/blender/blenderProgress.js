import { getBlenderDateKey } from "./blenderCourses.js";

export function createBlenderStorageKeys(date = new Date(), lessonId = "global") {
  const dateKey = getBlenderDateKey(date);
  const safeLessonId = String(lessonId || "global").replace(/[^a-zA-Z0-9_-]/g, "-");
  return Object.freeze({
    dateKey,
    lessonId: safeLessonId,
    checklist: `lifeos:blender-academy:${dateKey}:${safeLessonId}:checklist`,
    extraGate: `lifeos:blender-academy:${dateKey}:extraGate`,
  });
}

export function readJsonArray(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function writeJsonArray(key, value) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.isArray(value) ? value : []));
    return true;
  } catch {
    return false;
  }
}

const BLENDER_COMPLETED_LESSONS_KEY_V1 = "lifeos:blender-academy:completed-lessons:v1";
const BLENDER_COMPLETED_LESSONS_KEY = "lifeos:blender-academy:completed-lessons:v2";

const RUNAWAY_COMPLETION_LIMIT = 2;
const SAFE_FIRST_LESSON_ID = "lesson-0-1-base-file";

function readLegacyCompletedLessonIds() {
  if (typeof window === "undefined") return [];
  try {
    const completed = [];
    const legacyChecklistPattern = /^lifeos:blender-academy:\d{4}-\d{2}-\d{2}:checklist$/;
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || !legacyChecklistPattern.test(key)) continue;
      const items = readJsonArray(key);
      if (items.length >= 5) completed.push("lesson-0-1-base-file");
    }
    return completed;
  } catch {
    return [];
  }
}

function normalizeCompletedBlenderLessonIds(ids) {
  return Array.from(new Set(Array.isArray(ids) ? ids.filter(Boolean) : []));
}

function repairLegacyCompletedBlenderLessonIds(ids) {
  const unique = normalizeCompletedBlenderLessonIds(ids);

  // Early Phase 1 builds could mark several future lessons as completed just
  // because the parent Blender quest was already marked for the day. When that
  // happens, the academy appears to jump from Course 0 to a later course. Repair
  // only the old v1/legacy state conservatively; v2 progress can grow normally.
  if (unique.length > RUNAWAY_COMPLETION_LIMIT) {
    return unique.includes(SAFE_FIRST_LESSON_ID) ? [SAFE_FIRST_LESSON_ID] : unique.slice(0, 1);
  }

  return unique;
}

export function readCompletedBlenderLessonIds() {
  const current = readJsonArray(BLENDER_COMPLETED_LESSONS_KEY);
  if (current.length) return normalizeCompletedBlenderLessonIds(current);

  const migrated = repairLegacyCompletedBlenderLessonIds([
    ...readJsonArray(BLENDER_COMPLETED_LESSONS_KEY_V1),
    ...readLegacyCompletedLessonIds(),
  ]);

  if (migrated.length) writeJsonArray(BLENDER_COMPLETED_LESSONS_KEY, migrated);
  return migrated;
}

export function writeCompletedBlenderLessonIds(value) {
  return writeJsonArray(BLENDER_COMPLETED_LESSONS_KEY, normalizeCompletedBlenderLessonIds(value));
}

export function readString(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeOptionalString(key, value) {
  if (typeof window === "undefined") return false;
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

const BLENDER_LIBRARY_KEY = "lifeos:blender-academy:library:v1";

export function readBlenderLibrary() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(BLENDER_LIBRARY_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function writeBlenderLibrary(value) {
  if (typeof window === "undefined") return false;
  try {
    const safeValue = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    window.localStorage.setItem(BLENDER_LIBRARY_KEY, JSON.stringify(safeValue));
    return true;
  } catch {
    return false;
  }
}
