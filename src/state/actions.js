// MODULE_BOUNDARY: state/actions
// Pure action creator functions — no side effects, no imports

export const AC = Object.freeze({
  setView:           (view)            => ({ type: "SET_VIEW",             payload: view }),
  completeBlock:     (dayIdx, blockId) => ({ type: "COMPLETE_BLOCK",       payload: { dayIdx, blockId } }),
  toggleHabit:       (id, date)        => ({ type: "TOGGLE_HABIT",         payload: { id, date } }),
  selectScheduleDay: (idx)             => ({ type: "SELECT_SCHEDULE_DAY",  payload: idx }),
  selectPlannerDay:  (idx)             => ({ type: "SELECT_PLANNER_DAY",   payload: idx }),
  triggerToast:      (msg, sub = "")   => ({ type: "TRIGGER_TOAST",        payload: { id: Math.random().toString(36).slice(2), msg, sub } }),
  dismissToast:      (id)              => ({ type: "DISMISS_TOAST",        payload: id }),
  showLevelUp:       ()                => ({ type: "SHOW_LEVEL_UP" }),
  hideLevelUp:       ()                => ({ type: "HIDE_LEVEL_UP" }),
  overwriteState:    (snapshot)        => ({ type: "OVERWRITE_STATE",       payload: snapshot }),
});