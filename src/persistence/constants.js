// MODULE_BOUNDARY: persistence/
// EXTRACTION_SAFE — constants only, zero runtime deps

export const STORAGE_KEY    = "lifeos_v4_data";
export const SCHEMA_VERSION = 1;

// ─── Persistent state initial shape ──────────────────────────────────────
// EXTRACTION_WARNING: keep co-located with persistentReducer
// (shape must stay in sync with reducer's COMPLETE_BLOCK logic)
export const INITIAL_PERSISTENT_STATE = Object.freeze({
  version: SCHEMA_VERSION,
  xp: {
    total:    750,
    dailyLog: [{ date: "2026-05-15", xp: 120 }],
  },
  streak: {
    count:       3,
    lastUpdated: "2026-05-15",
  },
  planner: {
    swimDays: [
      {
        main: [
          { id: "1", title: "Ingeniería de Sistemas Coraza",   type: "FOCUS",    duration: 90, completed: true  },
          { id: "2", title: "Calibración Operativa de Rutina", type: "BUFFER",   duration: 30, completed: true  },
          { id: "3", title: "Recuperación de Estado Mental",   type: "RECOVERY", duration: 25, completed: false },
        ],
      },
    ],
  },
  habits: [
    { id: "h1", name: "Bloque de Enfoque Profundo de 90 Mins",   category: "FOCUS",    history: { "2026-05-15": true  } },
    { id: "h2", name: "Acondicionamiento Físico de Alta Tensión", category: "PHYSICAL", history: { "2026-05-15": false } },
  ],
});

export const INITIAL_UI_STATE = Object.freeze({
  currentView:         "DASHBOARD",
  scheduleSelectedDay: 0,
  plannerSelectedDay:  0,
  toasts:              [],
  showLevelUp:         false,
});