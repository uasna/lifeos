import { getBlenderDateKey } from "./blenderCourses.js";

export function createBlenderStorageKeys(date = new Date()) {
  const dateKey = getBlenderDateKey(date);
  return Object.freeze({
    dateKey,
    checklist: `lifeos:blender-academy:${dateKey}:checklist`,
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
