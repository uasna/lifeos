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

const BLENDER_COMPLETED_LESSONS_KEY = "lifeos:blender-academy:completed-lessons:v1";

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

export function readCompletedBlenderLessonIds() {
  return Array.from(new Set([...readJsonArray(BLENDER_COMPLETED_LESSONS_KEY), ...readLegacyCompletedLessonIds()]));
}

export function writeCompletedBlenderLessonIds(value) {
  return writeJsonArray(BLENDER_COMPLETED_LESSONS_KEY, Array.from(new Set(Array.isArray(value) ? value.filter(Boolean) : [])));
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
