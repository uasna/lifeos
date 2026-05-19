// MODULE_BOUNDARY: state/reducers
// CYCLIC_PREVENTION: reducers NEVER import from features/ or views/
// Allowed direction: features/ → state/ → persistence/ → design-tokens/

// ─── Persistent reducer ──────────────────────────────────────────────────
export function persistentReducer(state, action) {
  switch (action.type) {
    case "COMPLETE_BLOCK": {
      const { dayIdx, blockId } = action.payload;
      const nextSwimDays = [...state.planner.swimDays];
      if (!nextSwimDays[dayIdx]) return state;

      const targetList = nextSwimDays[dayIdx].main ? "main"
        : nextSwimDays[dayIdx].morning ? "morning" : null;
      if (!targetList) return state;

      const blockList = nextSwimDays[dayIdx][targetList];
      const blockIdx  = blockList.findIndex(b => b.id === blockId);
      if (blockIdx === -1) return state;

      const block        = blockList[blockIdx];
      const isCompleting = !block.completed;
      const nextBlocks   = [...blockList];
      nextBlocks[blockIdx] = { ...block, completed: isCompleting };

      nextSwimDays[dayIdx] = { ...nextSwimDays[dayIdx], [targetList]: nextBlocks };

      const xpGained    = isCompleting ? (block.type === "FOCUS" ? 50 : 25) : (block.type === "FOCUS" ? -50 : -25);
      const nextXpTotal = Math.max(0, state.xp.total + xpGained);

      return {
        ...state,
        planner: { ...state.planner, swimDays: nextSwimDays },
        xp:      { ...state.xp, total: nextXpTotal },
      };
    }

    case "TOGGLE_HABIT": {
      const { id, date } = action.payload;
      return {
        ...state,
        habits: state.habits.map(h => {
          if (h.id !== id) return h;
          const nextHistory = { ...h.history };
          nextHistory[date] ? delete nextHistory[date] : (nextHistory[date] = true);
          return { ...h, history: nextHistory };
        }),
      };
    }

    case "OVERWRITE_STATE":
      return action.payload;

    default:
      return state;
  }
}

// ─── UI reducer ─────────────────────────────────────────────────────────
export function uiReducer(state, action) {
  switch (action.type) {
    case "SET_VIEW":            return { ...state, currentView:         action.payload };
    case "SELECT_SCHEDULE_DAY": return { ...state, scheduleSelectedDay: action.payload };
    case "SELECT_PLANNER_DAY":  return { ...state, plannerSelectedDay:  action.payload };
    case "TRIGGER_TOAST":       return { ...state, toasts: [...state.toasts, action.payload] };
    case "DISMISS_TOAST":       return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case "SHOW_LEVEL_UP":       return { ...state, showLevelUp: true  };
    case "HIDE_LEVEL_UP":       return { ...state, showLevelUp: false };
    default:                    return state;
  }
}