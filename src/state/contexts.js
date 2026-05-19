// MODULE_BOUNDARY: state/contexts
// §1 CONTEXT SPLIT — AppDataContext + AppUIContext
//   Each domain has an independent useMemo in the root provider.
//   A persistent mutation does NOT re-memo uiCtxValue, and vice versa.
import { createContext, useContext } from "react";

// AppDataContext — { persistent, persistentDispatch }
// Re-renders consumers ONLY on persistent mutations.
export const AppDataContext = createContext(null);

// AppUIContext — { ui, uiDispatch }
// Re-renders consumers ONLY on ui mutations.
export const AppUIContext = createContext(null);

// Typed accessor hooks — never call useContext(AppDataContext) directly in views.
// This enforces the domain boundary at every call site and is extraction-safe.
export const useAppData = () => useContext(AppDataContext);
export const useAppUI   = () => useContext(AppUIContext);