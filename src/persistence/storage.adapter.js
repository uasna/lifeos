// StorageAdapter — async-safe localStorage wrapper
// Async signatures prepare the adapter for IndexedDB swap (§10 MAPA_CONCEPTUAL)
// without touching any call sites.
//
// All methods are wrapped in try/catch:
// private browsing, quota errors, SSR → return null/false, never throw.

export const StorageAdapter = Object.freeze({
  async get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return { value: raw };
    } catch {
      return null;
    }
  },

  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  async delete(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
});