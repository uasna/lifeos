// MODULE_BOUNDARY: persistence/serialization
// ROLE: serialize/deserialize app state blob, migration chain, integrity validation.
// SCHEMA VERSIONING: version lives INSIDE the blob, not in the key.
import { SCHEMA_VERSION, INITIAL_PERSISTENT_STATE } from "./constants.js";

// ─── Migration chain ────────────────────────────────────────────────────
// Each entry: MIGRATIONS[fromVersion] = (snap) => nextSnap
// Never delete past entries. Never mutate the original snapshot.
//
// v1 → current baseline (identity transform)
// To bump to v2: add MIGRATIONS[1] = snap => ({ ...snap, newDomain: {} })
const MIGRATIONS = Object.freeze({
  1: (snap) => snap,
});

function migrateSnapshot(snapshot, savedVersion) {
  let current = snapshot;
  try {
    for (let v = savedVersion; v < SCHEMA_VERSION; v++) {
      const migrate = MIGRATIONS[v];
      if (!migrate) throw new Error(`Missing migration for v${v}`);
      current = migrate({ ...current });
    }
    return current;
  } catch {
    return null; // triggers deepMerge partial recovery
  }
}

// ─── Deep merge ─────────────────────────────────────────────────────────
// Arrays: source wins wholesale. Undefined source values do not overwrite.
function deepMerge(target, source) {
  if (typeof target !== "object" || typeof source !== "object") return source ?? target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (sv === undefined) continue;
    if (Array.isArray(sv))        result[key] = sv;
    else if (typeof sv === "object" && sv !== null && !Array.isArray(tv)) {
      result[key] = deepMerge(tv ?? {}, sv);
    } else {
      result[key] = sv;
    }
  }
  return result;
}

// ─── Integrity validation ────────────────────────────────────────────────
// Permissive for content fields, strict for structural/numeric fields.
function validateSnapshotIntegrity(snap) {
  if (!snap || typeof snap !== "object") return false;
  try {
    const { xp, quests, streak, planner, habits } = snap;
    if (!xp || typeof xp !== "object")            return false;
    if (!Number.isFinite(xp.total) || xp.total < 0) return false;
    if (!Array.isArray(xp.dailyLog))               return false;
    if (!streak || typeof streak !== "object")     return false;
    if (!Number.isFinite(streak.count))            return false;
    if (!planner || typeof planner !== "object")   return false;
    if (!Array.isArray(planner.swimDays))          return false;
    if (!Array.isArray(habits))                    return false;
    return true;
  } catch {
    return false;
  }
}

// ─── Public API ──────────────────────────────────────────────────────────

export function serializeAppState(state) {
  return JSON.stringify({
    _schema:  SCHEMA_VERSION,
    _savedAt: new Date().toISOString(),
    ...state,
  });
}

export function deserializeAppState(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed._schema)                       return null;
    if (parsed._schema > SCHEMA_VERSION)       return null; // future schema — unreadable

    const savedVersion = Number(parsed._schema);
    const { _schema, _savedAt, ...domainSnap } = parsed;

    const migrated = migrateSnapshot(domainSnap, savedVersion);
    if (!migrated) {
      // Migration failed — attempt partial recovery
      const recovered = deepMerge(INITIAL_PERSISTENT_STATE, domainSnap);
      return validateSnapshotIntegrity(recovered) ? recovered : null;
    }

    if (!validateSnapshotIntegrity(migrated)) {
      const recovered = deepMerge(INITIAL_PERSISTENT_STATE, migrated);
      if (!validateSnapshotIntegrity(recovered)) return null;
      return recovered;
    }

    return migrated;
  } catch {
    return null; // parse failure → boot from defaults
  }
}