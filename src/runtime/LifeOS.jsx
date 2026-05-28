// ============================================================
// LIFE OS v29 · Utilities extraction pass
// ─ Dual-reducer state (persistent / UI)
// ─ Typed action creators
// ─ Numeric schema versioning (v1)
// ─ Migration engine (chainable, forward-only)
// ─ Corrupted snapshot recovery (deepMerge partial restore)
// ─ Field-level integrity validation
// ─ Debounced autosave (1.2s) + beforeunload flush
// ─ Retry writes (2 retries, 50ms backoff)
// ─ Stable storage key (version-independent)
// ─ Formalized SELECTORS namespace
// ─ Split contexts → no cross-domain rerenders
// ─ Pure selectors for all derived state
// ─ React.memo on all leaf components
// ─ Design token system
// ─ SmartPlannerView (Timeline · Heatmap · Intel)
// ============================================================

import {
  useState, useCallback, useMemo, useReducer,
  useEffect, useRef, createContext, useContext, memo,
} from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  AreaChart, Area, LineChart, Line,
} from "recharts";
import {
  Zap, Flame, Target, Brain, Dumbbell, BookOpen, Moon, Sun,
  Shield, Crown, Sword, Lock, Trophy, BarChart2, User, Home,
  Star, Bell, CheckCircle2, Circle, TrendingUp, Award, ChevronRight,
  Settings, Sparkles, Calendar, RefreshCw, Layers, MessageSquare,
  Heart, AlertTriangle, Battery, Activity, Edit3, Wind,
  ChevronDown, ChevronUp, ArrowRight, Lightbulb, Gamepad2, Timer, Play, Pause,
  Shirt, Palette, Plus, Trash2,
} from "lucide-react";
import { supabase } from "../supabaseClient.js";

import {
  ROCKET_LEAGUE_SESSION_MINUTES,
  ROCKET_LEAGUE_PARENT_QUEST_ID,
  ROCKET_LEAGUE_PROFILE,
  ROCKET_LEAGUE_CONTROLLER_PRESET,
  ROCKET_LEAGUE_RECOVERY_TIPS,
  ROCKET_LEAGUE_PACKS,
  ROCKET_LEAGUE_WORKSHOP_RULES,
  ROCKET_LEAGUE_WORKSHOP_MAPS,
  RL_SUBTASK_TYPES,
  SPEEDFLIP_DAR_ERROR_LABELS,
  SPEEDFLIP_DAR_TOUCH_MOMENTS,
  normalizeSpeedflipDarSession,
  getSpeedflipDarSessionFeedback,
  getSpeedflipDarStats,
  getRocketLeagueWeeklyFocus,
  getRocketLeagueFocusRole,
  getSecondsUntilNextRocketWeeklyFocus,
  getRocketLeagueDateKey,
  getRocketLeaguePlanForDate,
  getRocketLeaguePlanById,
  getRocketLeagueSubtaskTargetSeconds,
  createRocketLeagueCurrent,
  createRocketLeagueInitialState,
  hasRocketLeagueProgress
} from "../data/rocketLeagueData.js";
import {
  WARDROBE_TYPES,
  WARDROBE_COLOR_GUIDE,
  WARDROBE_FALLBACK_ITEMS
} from "../data/wardrobeData.js";
import {
  CALCULUS_FIXED_START_MIN,
  CALCULUS_FIXED_DURATION_MIN,
  CALCULUS_FIXED_END_MIN,
  CALCULUS_SOURCE_LABEL,
  CALCULUS_JOURNALIZATION_II_PAC_2026,
  CALCULUS_DIFFICULTY_LEVELS,
  CALCULUS_I_VIDEO_SCOPE,
  CALCULUS_I_VIDEO_BLOCKED_TERMS,
  CALCULUS_PINNED_PRACTICE_BY_DATE
} from "../data/calculusData.js";
import {
  BLENDER_SESSION_MINUTES,
  BLENDER_PARENT_QUEST_ID,
  BLENDER_PROFILE,
  BLENDER_NO_NUMPAD_GUIDE,
  BLENDER_BEGINNER_RULES,
  BLENDER_SKILL_LADDER,
  getBlenderDateKey,
  getBlenderPlanForDate
} from "../data/blenderData.js";

import {
  T, fmt, fmtDur, buildTimed,
  formatSeconds, formatCountdownSeconds,
  getSecondsUntilNextLocalDay, formatLocalDateKey, getLifeOSDateKey,
  getScheduleWeekKey, getSecondsUntilNextScheduleWeek,
  parseDateKeyLocal, addDaysToDateKey, daysBetweenDateKeys, getDateKeyForScheduleDay
} from "../utils/time.js";
import { hashStringSeed, seededRandom, seededShuffle } from "../utils/random.js";
import { getStoredAudioPrefs, persistAudioPrefs, unlockLifeOSAudio, playLifeOSSound } from "../utils/audio.js";
import {
  XP_LEVEL_SIZE, levelFromXp, levelPctFromXp, levelXpFromXp,
  xpToNextLevel, calculateQuestPenaltyValue
} from "../utils/xp.js";


// ─────────────────────────────────────────────────────────────────
// § 1 · ACTION TYPES (typed, frozen, tree-shakeable)
// ─────────────────────────────────────────────────────────────────

const AT = Object.freeze({
  // ── Quest domain ─────────────────────────────────────────────
  QUEST_COMPLETE:             "QUEST_COMPLETE",
  QUESTS_CUSTOM_UPDATE:       "QUESTS_CUSTOM_UPDATE",
  QUESTS_DAILY_SYNC:          "QUESTS_DAILY_SYNC",
  QUEST_START:                "QUEST_START",
  APP_SETTINGS_UPDATE:        "APP_SETTINGS_UPDATE",
  // ── Calculus trainer domain ─────────────────────────────────
  CALC_DAILY_SYNC:            "CALC_DAILY_SYNC",
  CALC_SESSION_GENERATED:     "CALC_SESSION_GENERATED",
  CALC_ANSWER_SAVE:           "CALC_ANSWER_SAVE",
  CALC_FIELD_UPDATE:          "CALC_FIELD_UPDATE",
  CALC_SETTINGS_UPDATE:       "CALC_SETTINGS_UPDATE",
  // ── Wardrobe / closet domain ─────────────────────────────────
  WARDROBE_PROFILE_UPDATE:    "WARDROBE_PROFILE_UPDATE",
  WARDROBE_ITEM_ADD:          "WARDROBE_ITEM_ADD",
  WARDROBE_ITEM_UPDATE:       "WARDROBE_ITEM_UPDATE",
  WARDROBE_ITEM_DELETE:       "WARDROBE_ITEM_DELETE",
  WARDROBE_OUTFIT_MARK:       "WARDROBE_OUTFIT_MARK",
  DOMAIN_RESET:               "DOMAIN_RESET",
  // ── Rocket League domain ─────────────────────────────────────
  RL_DAILY_SYNC:             "RL_DAILY_SYNC",
  RL_SUBTASK_TOGGLE:         "RL_SUBTASK_TOGGLE",
  RL_TIMER_COMMIT:           "RL_TIMER_COMMIT",
  RL_MENTAL_UPDATE:          "RL_MENTAL_UPDATE",
  RL_MENTAL_SAVE:            "RL_MENTAL_SAVE",
  RL_MATCH_PROGRESS:        "RL_MATCH_PROGRESS",
  RL_SPEEDFLIP_DAR_SAVE:    "RL_SPEEDFLIP_DAR_SAVE",
  // ── Reflection domain ─────────────────────────────────────────
  REFLECTION_FIELD_UPDATE:    "REFLECTION_FIELD_UPDATE",
  REFLECTION_TOGGLE_CATEGORY: "REFLECTION_TOGGLE_CATEGORY",
  REFLECTION_SAVE:            "REFLECTION_SAVE",
  // ── Planner domain ───────────────────────────────────────────
  PLANNER_REGEN_SWIM:         "PLANNER_REGEN_SWIM",
  PLANNER_SET_BLENDER:        "PLANNER_SET_BLENDER",
  // ── Persistence ──────────────────────────────────────────────
  STATE_HYDRATE:              "STATE_HYDRATE",
  // ── UI domain (ephemeral, never persisted) ────────────────────
  UI_SET_VIEW:                "UI_SET_VIEW",
  UI_SET_QUEST_FILTER:        "UI_SET_QUEST_FILTER",
  UI_TOAST_ADD:               "UI_TOAST_ADD",
  UI_TOAST_REMOVE:            "UI_TOAST_REMOVE",
  UI_SET_BURST:               "UI_SET_BURST",
  UI_CLEAR_BURST:             "UI_CLEAR_BURST",
  UI_SHOW_LEVELUP:            "UI_SHOW_LEVELUP",
  UI_HIDE_LEVELUP:            "UI_HIDE_LEVELUP",
  UI_SCHEDULE_SELECT_DAY:     "UI_SCHEDULE_SELECT_DAY",
  UI_PLANNER_SELECT_DAY:      "UI_PLANNER_SELECT_DAY",
  UI_PLANNER_SET_MODE:        "UI_PLANNER_SET_MODE",
});

// ─────────────────────────────────────────────────────────────────
// § 2 · ACTION CREATORS (pure functions → action objects)
// ─────────────────────────────────────────────────────────────────

const AC = Object.freeze({
  // Persistent
  questComplete:           (questId, xpGained, newNivel) => ({ type: AT.QUEST_COMPLETE, questId, xpGained, newNivel }),
  questsCustomUpdate:      (items) => ({ type: AT.QUESTS_CUSTOM_UPDATE, items }),
  questsDailySync:         (dateKey) => ({ type: AT.QUESTS_DAILY_SYNC, dateKey }),
  questStart:              (questId) => ({ type: AT.QUEST_START, questId }),
  appSettingsUpdate:       (patch) => ({ type: AT.APP_SETTINGS_UPDATE, patch }),
  calcDailySync:          (dateKey, plan) => ({ type: AT.CALC_DAILY_SYNC, dateKey, plan }),
  calcSessionGenerated:   (payload) => ({ type: AT.CALC_SESSION_GENERATED, payload }),
  calcAnswerSave:         (exerciseId, answer, evaluation) => ({ type: AT.CALC_ANSWER_SAVE, exerciseId, answer, evaluation }),
  calcFieldUpdate:        (key, value) => ({ type: AT.CALC_FIELD_UPDATE, key, value }),
  calcSettingsUpdate:     (patch) => ({ type: AT.CALC_SETTINGS_UPDATE, patch }),
  wardrobeProfileUpdate:   (patch) => ({ type: AT.WARDROBE_PROFILE_UPDATE, patch }),
  wardrobeItemAdd:         (item) => ({ type: AT.WARDROBE_ITEM_ADD, item }),
  wardrobeItemUpdate:      (id, patch) => ({ type: AT.WARDROBE_ITEM_UPDATE, id, patch }),
  wardrobeItemDelete:      (id) => ({ type: AT.WARDROBE_ITEM_DELETE, id }),
  wardrobeOutfitMark:      (entry) => ({ type: AT.WARDROBE_OUTFIT_MARK, entry }),
  domainReset:             (domain) => ({ type: AT.DOMAIN_RESET, domain }),
  rlDailySync:            (dateKey, planId) => ({ type: AT.RL_DAILY_SYNC, dateKey, planId }),
  rlSubtaskToggle:        (subtaskId) => ({ type: AT.RL_SUBTASK_TOGGLE, subtaskId }),
  rlTimerCommit:          (subtaskId, secondsDelta) => ({ type: AT.RL_TIMER_COMMIT, subtaskId, secondsDelta }),
  rlMentalUpdate:         (key, value) => ({ type: AT.RL_MENTAL_UPDATE, key, value }),
  rlMentalSave:           () => ({ type: AT.RL_MENTAL_SAVE }),
  rlMatchProgress:        (subtaskId, delta) => ({ type: AT.RL_MATCH_PROGRESS, subtaskId, delta }),
  rlSpeedflipDarSave:      (session) => ({ type: AT.RL_SPEEDFLIP_DAR_SAVE, session }),
  reflectionFieldUpdate:   (key, value)   => ({ type: AT.REFLECTION_FIELD_UPDATE, key, value }),
  reflectionToggleCategory:(id)           => ({ type: AT.REFLECTION_TOGGLE_CATEGORY, id }),
  reflectionSave:          ()             => ({ type: AT.REFLECTION_SAVE }),
  plannerRegenSwim:        ()             => ({ type: AT.PLANNER_REGEN_SWIM }),
  plannerSetBlender:       (mode)         => ({ type: AT.PLANNER_SET_BLENDER, mode }),
  stateHydrate:            (snapshot)     => ({ type: AT.STATE_HYDRATE, snapshot }),
  // UI
  setView:                 (view)         => ({ type: AT.UI_SET_VIEW, view }),
  setQuestFilter:          (filter)       => ({ type: AT.UI_SET_QUEST_FILTER, filter }),
  toastAdd:                (id, msg, sub) => ({ type: AT.UI_TOAST_ADD, id, msg, sub }),
  toastRemove:             (id)           => ({ type: AT.UI_TOAST_REMOVE, id }),
  setBurst:                (questId)      => ({ type: AT.UI_SET_BURST, questId }),
  clearBurst:              ()             => ({ type: AT.UI_CLEAR_BURST }),
  showNivelUp:             ()             => ({ type: AT.UI_SHOW_LEVELUP }),
  hideNivelUp:             ()             => ({ type: AT.UI_HIDE_LEVELUP }),
  scheduleSelectDay:       (day)          => ({ type: AT.UI_SCHEDULE_SELECT_DAY, day }),
  plannerSelectDay:        (day)          => ({ type: AT.UI_PLANNER_SELECT_DAY, day }),
  plannerSetMode:          (mode)         => ({ type: AT.UI_PLANNER_SET_MODE, mode }),
});

// ─────────────────────────────────────────────────────────────────
// § 3 · DATA LAYER (static constants, immutable references)
// ─────────────────────────────────────────────────────────────────

const RANK_NAMES = ["Iniciado","Buscador","Adepto","Guerrero","Élite","Maestro","Gran maestro","Sabio","Leyenda","Apex"];
const DAY_NAMES  = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const DAY_FULL   = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const SWIM_PAIRS = [[1,3],[1,4],[2,4]];

const LIFEOS_LINKS = Object.freeze([
  { id:"vacaciones",label:"Plan de vacaciones",url:"https://uasna.github.io/vacaciones-v2.html",   note:"Ruta diaria de cálculo, RL y Blender." },
  { id:"blender",   label:"Blender Path",      url:"https://uasna.github.io/blender-path.html",    note:"Ruta de aprendizaje y proyectos de Blender." },
  { id:"portfolio", label:"UASNA 3D",          url:"https://uasna.github.io/",                     note:"Portafolio público de renders y trabajos 3D." },
]);

const QUESTS = Object.freeze([
  {
    id:1,
    title:"Estudiar cálculo",
    sub:"8:10–9:40 · bloque externo · marcar al terminar",
    xp:18,
    icon:BookOpen,
    diff:"DIFÍCIL",
    cat:"work",
    accent:"#60a5fa",
    iconKey:"BookOpen",
    linkLabel:"",
    link:"",
    links:[],
  },
  {
    id:2,
    title:"Rocket League training",
    sub:"90 min · entrenamiento enfocado · ranked opcional",
    xp:12,
    icon:Target,
    diff:"MEDIO",
    cat:"work",
    accent:"#22d3ee",
    iconKey:"Target",
    linkLabel:"Abrir Rocket League",
    link:"",
    links:[],
  },
  {
    id:3,
    title:"Inglés activo",
    sub:"20–25 min · listening, vocabulario o speaking",
    xp:10,
    icon:Brain,
    diff:"MEDIO",
    cat:"mind",
    accent:"#a78bfa",
    iconKey:"Brain",
    linkLabel:"",
    link:"",
    links:[],
  },
  {
    id:4,
    title:"Proyecto LifeOS / código",
    sub:"30–45 min · mejorar la app o documentar ideas",
    xp:15,
    icon:Zap,
    diff:"DIFÍCIL",
    cat:"work",
    accent:"#fbbf24",
    iconKey:"Zap",
    linkLabel:"Abrir LifeOS",
    link:"https://lifeos-brown-one.vercel.app",
    links:[
      { label:"LifeOS online", url:"https://lifeos-brown-one.vercel.app" },
    ],
  },
  {
    id:5,
    title:"Blender / 3D",
    sub:"2:40–3:40 PM · ejercicios principiante de Blender",
    xp:12,
    icon:Dumbbell,
    diff:"MEDIO",
    cat:"work",
    accent:"#34d399",
    iconKey:"Dumbbell",
    linkLabel:"Abrir Blender",
    link:"https://uasna.github.io/blender-path.html",
    links:[
      { label:"Blender Path", url:"https://uasna.github.io/blender-path.html" },
      { label:"UASNA 3D", url:"https://uasna.github.io/" },
    ],
  },
  {
    id:6,
    title:"Reflexión nocturna",
    sub:"5 min · revisar el día y planear mañana",
    xp:5,
    icon:Moon,
    diff:"FÁCIL",
    cat:"mind",
    accent:"#c084fc",
    iconKey:"Moon",
    linkLabel:"",
    link:"",
    links:[],
  },
]);

const QUEST_ICON_KEYS = ["Brain", "Dumbbell", "BookOpen", "Sun", "Target", "Moon"];
const QUEST_ICON_MAP = Object.freeze({ Brain, Dumbbell, BookOpen, Sun, Target, Moon, Zap, Flame });
const QUEST_ACCENTS = ["#a78bfa", "#34d399", "#60a5fa", "#fbbf24", "#22d3ee", "#c084fc"];

const QUEST_ROLE_META = Object.freeze({
  mandatory: { label:"Obligatoria", color:"#f87171", penalty:1 },
  training:  { label:"Entrenamiento", color:"#22d3ee", penalty:.65 },
  optional:  { label:"Opcional", color:"#94a3b8", penalty:0 },
  rest:      { label:"Descanso", color:"#34d399", penalty:0 },
});

function inferQuestRole(q = {}) {
  const text = `${q.title || ""} ${q.sub || ""}`.toLowerCase();
  if (text.includes("cálculo") || text.includes("calculo") || text.includes("examen")) return "mandatory";
  if (text.includes("reflex") || text.includes("nocturn")) return "mandatory";
  if (q.id === 2 || text.includes("rocket") || text.includes("inglés") || text.includes("ingles") || text.includes("blender") || text.includes("3d")) return "training";
  if (text.includes("descanso") || text.includes("pausa")) return "rest";
  return "optional";
}

function getQuestRole(q = {}) {
  return QUEST_ROLE_META[q.role] ? q.role : inferQuestRole(q);
}

function getQuestRoleMeta(q = {}) {
  const role = getQuestRole(q);
  return QUEST_ROLE_META[role] || QUEST_ROLE_META.optional;
}

function sanitizeQuestItems(items = []) {
  const source = Array.isArray(items) && items.length > 0 ? items : QUESTS;
  return source.slice(0, 24).map((q, i) => ({
    id: Number(q.id) || i + 1,
    title: String(q.title || `Misión ${i + 1}`).slice(0, 80),
    sub: String(q.sub || "").slice(0, 120),
    xp: Math.max(0, Math.min(999, Number(q.xp) || 0)),
    iconKey: q.iconKey || QUEST_ICON_KEYS[i % QUEST_ICON_KEYS.length],
    diff: ["FÁCIL", "MEDIO", "DIFÍCIL"].includes(q.diff) ? q.diff : "MEDIO",
    cat: ["mind", "body", "work"].includes(q.cat) ? q.cat : "mind",
    role: QUEST_ROLE_META[q.role] ? q.role : inferQuestRole(q),
    accent: q.accent || QUEST_ACCENTS[i % QUEST_ACCENTS.length],
    link: String(q.link || "").slice(0, 240),
    linkLabel: String(q.linkLabel || "").slice(0, 60),
    links: Array.isArray(q.links)
      ? q.links.slice(0, 4).map((l) => ({
          label: String(l?.label || "Abrir enlace").slice(0, 60),
          url: String(l?.url || "").slice(0, 240),
        })).filter((l) => l.url)
      : [],
  }));
}

function hydrateQuestItems(items = []) {
  return sanitizeQuestItems(items).map((q) => ({
    ...q,
    icon: QUEST_ICON_MAP[q.iconKey] || Target,
  }));
}

function getActiveQuests(persistentState) {
  const custom = persistentState?.quests?.customItems;
  return hydrateQuestItems(Array.isArray(custom) && custom.length > 0 ? custom : QUESTS);
}


// ── Rocket League data/planning extracted to src/data/rocketLeagueData.js ─────

// ── Shared time/random utilities extracted to src/utils/*.js ──────────────


// WARDROBE_TYPES extracted to data module.


// WARDROBE_COLOR_GUIDE extracted to data module.


// WARDROBE_FALLBACK_ITEMS extracted to data module.


function createWardrobeInitial() {
  return {
    profile: {
      skinTone: "canela",
      style: "casual limpio",
      notes: "Priorizar tonos cálidos, neutros profundos y contrastes limpios.",
      weather: "normal",
      occasion: "universidad",
    },
    items: [],
    history: [],
  };
}

function sanitizeWardrobeItem(item = {}) {
  const allowedTypes = new Set(WARDROBE_TYPES.map(t => t.id));
  if (!allowedTypes.has(item.type)) return null;
  const unavailableUntil = typeof item.unavailableUntil === "string" ? item.unavailableUntil.slice(0, 10) : "";
  return {
    id: typeof item.id === "number" || typeof item.id === "string" ? item.id : Date.now(),
    type: item.type,
    name: String(item.name || "Prenda").slice(0, 48),
    color: String(item.color || "neutro").slice(0, 28),
    style: String(item.style || "casual").slice(0, 36),
    favorite: Boolean(item.favorite),
    unavailableUntil,
  };
}

function normalizeWardrobeItems(items = []) {
  return (Array.isArray(items) ? items : []).map(sanitizeWardrobeItem).filter(Boolean).slice(0, 80);
}

function isWardrobeItemAvailable(item, dateKey = getLifeOSDateKey()) {
  if (!item?.unavailableUntil) return true;
  return String(item.unavailableUntil).slice(0, 10) < dateKey;
}

function getWardrobePool(items, type, dateKey = getLifeOSDateKey()) {
  const availableUserItems = items.filter(item => item.type === type && isWardrobeItemAvailable(item, dateKey));
  const fallbackItems = WARDROBE_FALLBACK_ITEMS.filter(item => item.type === type);
  return availableUserItems.length ? availableUserItems : fallbackItems;
}

function pickFromWardrobePool(pool, seed, bannedIds = [], preferFavorite = false) {
  const blocked = new Set(bannedIds.filter(Boolean));
  const available = pool.filter(item => !blocked.has(item.id));
  let choices = available.length ? available : pool;
  const favorites = choices.filter(item => item.favorite);
  if (preferFavorite && favorites.length) choices = favorites;
  if (!choices.length) return null;
  const rand = seededRandom(hashStringSeed(`${seed}:${choices.map(item => item.id).join("|")}`));
  return choices[Math.floor(rand() * choices.length)] || choices[0];
}

function getWardrobeOutfitSignature(items = []) {
  return items.map(item => `${item.type}:${item.id}`).join("|");
}

function buildWardrobeWeek(wardrobe = createWardrobeInitial(), weekKey = getScheduleWeekKey()) {
  const items = normalizeWardrobeItems(wardrobe.items);
  const history = Array.isArray(wardrobe.history) ? wardrobe.history : [];
  const profile = deepMerge(createWardrobeInitial().profile, wardrobe.profile || {});
  const dateKey = getLifeOSDateKey();
  const palette = seededShuffle(WARDROBE_COLOR_GUIDE, `wardrobe-palette:${weekKey}:${profile.style}:${profile.weather}:${profile.occasion}:${items.length}`).slice(0, 7);
  const topPool = getWardrobePool(items, "top", dateKey);
  const bottomPool = seededShuffle(getWardrobePool(items, "bottom", dateKey), `wardrobe-bottoms:${weekKey}:${profile.style}:${items.length}`);
  const shoePool = getWardrobePool(items, "shoes", dateKey);
  const bottomGap = bottomPool.length >= 4 ? 2 : bottomPool.length >= 2 ? 1 : 0;
  const recentBottomIds = [];
  const usedThisWeek = new Set();
  const disliked = new Set(history.filter(h => h?.action === "dislike").map(h => h.signature).filter(Boolean));
  const recentlyUsed = new Set(history.filter(h => h?.action === "used").slice(-14).map(h => h.signature).filter(Boolean));

  return DAY_NAMES.map((day, idx) => {
    let chosen = null;
    for (let attempt = 0; attempt < 9; attempt += 1) {
      const seed = `wardrobe:${weekKey}:${idx}:${attempt}:${items.length}:${profile.style}:${profile.weather}:${profile.occasion}`;
      const mainColor = palette[(idx + attempt) % palette.length] || "crema";
      const top = pickFromWardrobePool(topPool, `${seed}:top:${mainColor}`, [], attempt % 3 === 0) || { id:`fallback-top-${idx}`, type:"top", name:`Camisa ${mainColor}`, color:mainColor, style:"sugerido" };
      const bottom = pickFromWardrobePool(bottomPool, `${seed}:bottom`, recentBottomIds) || { id:`fallback-bottom-${idx}`, type:"bottom", name:"Pantalón denim oscuro", color:"denim oscuro", style:"sugerido" };
      const shoes = pickFromWardrobePool(shoePool, `${seed}:shoes:${top.color}:${bottom.color}`, [], attempt % 4 === 0) || { id:`fallback-shoes-${idx}`, type:"shoes", name:"Tenis neutros", color:"negros", style:"sugerido" };
      const outfitItems = [top, bottom, shoes];
      const signature = getWardrobeOutfitSignature(outfitItems);
      const scorePenalty = (usedThisWeek.has(signature) ? 3 : 0) + (disliked.has(signature) ? 2 : 0) + (recentlyUsed.has(signature) ? 1 : 0);
      if (!chosen || scorePenalty < chosen.scorePenalty) chosen = { top, bottom, shoes, mainColor, signature, scorePenalty };
      if (scorePenalty === 0) break;
    }

    const top = chosen.top;
    const bottom = chosen.bottom;
    const shoes = chosen.shoes;
    const mainColor = chosen.mainColor;
    usedThisWeek.add(chosen.signature);
    recentBottomIds.push(bottom.id);
    while (recentBottomIds.length > bottomGap) recentBottomIds.shift();

    return {
      day,
      full: DAY_FULL[idx],
      title: `${top.color} + ${bottom.color}`,
      tone: mainColor,
      signature: chosen.signature,
      items: [top, bottom, shoes],
      why: `Look para tono ${profile.skinTone || "canela"}, clima ${profile.weather || "normal"} y ocasión ${profile.occasion || "casual"}. Evita repetir pantalón pegado cuando hay opciones y baja prioridad a combinaciones que marcaste como repetidas o feas.`,
    };
  });
}

function isNightlyQuest(q) {
  const text = `${q?.title || ""} ${q?.sub || ""}`.toLowerCase();
  return text.includes("reflex") || text.includes("diario") || text.includes("nocturn") || text.includes("journal");
}

function isTypingQuest(q) {
  const text = `${q?.title || ""} ${q?.sub || ""}`.toLowerCase();
  return text.includes("mecanografía") || text.includes("mecanografia") || text.includes("typing") || text.includes("teclado");
}

function isBlenderQuest(q) {
  const text = `${q?.title || ""} ${q?.sub || ""}`.toLowerCase();
  return text.includes("blender") || text.includes("3d");
}

function isRocketQuest(q) {
  const text = `${q?.title || ""} ${q?.sub || ""}`.toLowerCase();
  return q?.id === ROCKET_LEAGUE_PARENT_QUEST_ID || text.includes("rocket");
}

function createFixedQuestScheduleBlock(q, key, name, type, duration, desc, startMin, dateKey, focus = []) {
  return B(key, name || q?.title || "Bloque", type, duration, desc || q?.sub || "Misión diaria", {
    questId: q?.id,
    quest: q || null,
    focus: focus.length ? focus : (q ? questScheduleFocus(q) : ["Bloque", "Ejecución"]),
    randomized: false,
    dateKey,
    startMin,
    endMin: startMin + duration,
  });
}

function getLifeOSDayMode(state, dateKey = getLifeOSDateKey()) {
  if (isLifeOSManualRestDay(dateKey)) return "rest";
  const entry = state?.appSettings?.restDays?.[dateKey];
  if (!entry?.enabled) return "normal";
  return entry.mode || "rest";
}

function isLifeOSLowEnergyDay(state, dateKey = getLifeOSDateKey()) {
  return getLifeOSDayMode(state, dateKey) === "lowEnergy";
}

function calculateMissedQuestPenalty(state, completedIds = [], dateKey = getLifeOSDateKey()) {
  const activeQuests = getActiveQuests(state);
  const completedSet = new Set(Array.isArray(completedIds) ? completedIds : []);
  const startedSet = new Set(Array.isArray(state?.quests?.startedIds) ? state.quests.startedIds : []);
  const partialEnabled = state?.appSettings?.penalties?.partialCreditStarted !== false;
  const lowEnergy = isLifeOSLowEnergyDay(state, dateKey);
  const missedQuests = activeQuests.filter(q => !completedSet.has(q.id));
  const missedBreakdown = missedQuests.map(q => {
    const baseXp = Math.max(0, Number(q.xp) || 0);
    const roleMeta = getQuestRoleMeta(q);
    const started = startedSet.has(q.id);
    const penaltyXp = calculateQuestPenaltyValue({
      baseXp,
      rolePenalty: roleMeta.penalty,
      started,
      partialEnabled,
      lowEnergy,
    });
    return { ...q, role:getQuestRole(q), roleLabel:roleMeta.label, started, lowEnergy, penaltyXp };
  });
  const missedXp = missedBreakdown.reduce((sum, q) => sum + q.penaltyXp, 0);
  return { missedQuests: missedBreakdown, missedXp };
}

function shouldApplyMissedQuestPenalty(state) {
  return state?.appSettings?.penalties?.missedQuestXp !== false;
}

function isLifeOSRestDay(state, dateKey = getLifeOSDateKey()) {
  return getLifeOSDayMode(state, dateKey) === "rest";
}

function getCalculusWeakTopics(calculus, limit = 5) {
  const rows = [];
  const current = calculus?.current;
  const days = [current, ...(Array.isArray(calculus?.history) ? calculus.history : [])].filter(Boolean);
  for (const day of days) {
    const exercises = Array.isArray(day.exercises) ? day.exercises : [];
    const evals = day.evaluationsById || {};
    for (const ex of exercises) {
      const ev = evals[ex.id];
      if (!ev) continue;
      const score = Number(ev.score);
      if (!Number.isFinite(score) || score >= 75) continue;
      rows.push({
        topic: ex.topic || day.topic || "Tema sin clasificar",
        errorType: ev.errorType || "Error de procedimiento",
        score,
        dateKey: day.dateKey,
      });
    }
  }
  const grouped = new Map();
  for (const r of rows) {
    const key = `${r.topic} · ${r.errorType}`;
    const prev = grouped.get(key) || { ...r, count:0, avg:0 };
    prev.count += 1;
    prev.avg += r.score;
    grouped.set(key, prev);
  }
  return Array.from(grouped.values())
    .map(r => ({ ...r, avg: Math.round(r.avg / Math.max(r.count, 1)) }))
    .sort((a,b) => b.count - a.count || a.avg - b.avg)
    .slice(0, limit);
}

function normalizeQuestCompletedIdsForDate(completedIds = [], dailyLog = [], dateKey = getLifeOSDateKey()) {
  const ids = Array.from(new Set((Array.isArray(completedIds) ? completedIds : []).filter(id => typeof id === "number")));
  const log = Array.isArray(dailyLog) ? dailyLog : [];
  const latestByQuest = new Map();

  for (const entry of log) {
    if (!entry || typeof entry !== "object" || typeof entry.questId !== "number") continue;
    if (!ids.includes(entry.questId)) continue;
    const time = new Date(entry.date || 0).getTime();
    const prev = latestByQuest.get(entry.questId);
    const prevTime = prev ? new Date(prev.date || 0).getTime() : -Infinity;
    if (Number.isFinite(time) && time >= prevTime) latestByQuest.set(entry.questId, entry);
  }

  // If there is no dated quest log yet, preserve the current state instead of wiping it blindly.
  if (latestByQuest.size === 0) return ids;

  return ids.filter(id => {
    const entry = latestByQuest.get(id);
    if (!entry) return false;
    const entryDateKey = getLifeOSDateKey(entry.date);
    const wasCompleted = entry.action !== "undo" && Number(entry.amount || 0) >= 0;
    return entryDateKey === dateKey && wasCompleted;
  });
}


function applyDailyQuestReset(state, dateKey = getLifeOSDateKey()) {
  if (!state || typeof state !== "object") return state;
  const quests = state.quests || {};
  const lastResetDate = typeof quests.lastResetDate === "string" ? quests.lastResetDate : null;

  if (lastResetDate === dateKey) {
    return state;
  }

  const activeIds = new Set(getActiveQuests(state).map(q => q.id));
  const completedIds = Array.from(new Set((quests.completedIds || []).filter(id => activeIds.has(id))));
  const hasPreviousDay = Boolean(lastResetDate);
  const { missedQuests, missedXp } = calculateMissedQuestPenalty(state, completedIds);
  const previousDayWasManualRest = Boolean(lastResetDate && isLifeOSRestDay(state, lastResetDate));
  const penaltyEnabled = hasPreviousDay && !previousDayWasManualRest && shouldApplyMissedQuestPenalty(state) && missedXp > 0;
  const archiveEntry = hasPreviousDay
    ? {
        dateKey: lastResetDate,
        completedIds,
        missedIds: missedQuests.map(q => q.id),
        completedCount: completedIds.length,
        missedCount: missedQuests.length,
        totalCount: activeIds.size,
        penaltyXp: penaltyEnabled ? missedXp : 0,
        penaltyBreakdown: missedQuests.map(q => ({ id:q.id, title:q.title, xp:q.xp, penaltyXp:q.penaltyXp, started:Boolean(q.started) })),
        manualRest: previousDayWasManualRest,
        lowEnergy: isLifeOSLowEnergyDay(state, lastResetDate),
        archivedAt: new Date().toISOString(),
      }
    : null;

  const penaltyLog = penaltyEnabled
    ? missedQuests.map(q => ({
        date: new Date().toISOString(),
        amount: -Math.max(0, Number(q.penaltyXp) || 0),
        questId: q.id,
        action: q.started ? "missed-partial" : "missed",
        missedDateKey: lastResetDate,
      }))
    : [];

  return {
    ...state,
    xp: {
      ...(state.xp || { total: 0, dailyLog: [] }),
      total: Math.max(0, Number(state.xp?.total || 0) - (penaltyEnabled ? missedXp : 0)),
      dailyLog: [...(Array.isArray(state.xp?.dailyLog) ? state.xp.dailyLog : []), ...penaltyLog],
    },
    quests: {
      ...quests,
      completedIds: [],
      startedIds: [],
      dailyHistory: archiveEntry
        ? [...(Array.isArray(quests.dailyHistory) ? quests.dailyHistory : []), archiveEntry].slice(-120)
        : (Array.isArray(quests.dailyHistory) ? quests.dailyHistory : []),
      lastResetDate: dateKey,
      lastPenalty: archiveEntry ? {
        dateKey: lastResetDate,
        missedCount: missedQuests.length,
        penaltyXp: penaltyEnabled ? missedXp : 0,
        appliedAt: new Date().toISOString(),
      } : quests.lastPenalty,
    },
  };
}

function createAppSettingsInitial() {
  return {
    sound: {
      enabled: true,
      menu: true,
      complete: true,
      timer: true,
      mission: true,
      volume: 0.75,
    },
    pwa: {
      mobileNotifications: false,
      reminderLeadMinutes: 10,
      installDismissed: false,
      taskReminders: true,
      notifyTaskStart: true,
      pendingDigest: true,
      quietAfterHour: 22,
    },
    penalties: {
      missedQuestXp: true,
      partialCreditStarted: true,
    },
    restDays: {},
    backup: {
      lastExportAt: null,
      lastImportAt: null,
    },
  };
}

// ── Audio utilities extracted to src/utils/audio.js ─────────────────────


const ACHIEVEMENTS = Object.freeze([
  { id:1, title:"Primera victoria",      desc:"Completá tu primera misión",  icon:Sword,  rarity:"COMÚN",    glow:"#94a3b8", unlocked:true  },
  { id:2, title:"En llamas",          desc:"Lográ una racha de 3 días",     icon:Flame,  rarity:"RARO",      glow:"#60a5fa", unlocked:true  },
  { id:3, title:"Mente sobre materia", desc:"Completá 10 misiones mentales",    icon:Brain,  rarity:"RARO",      glow:"#60a5fa", unlocked:true  },
  { id:4, title:"Centurión",        desc:"Completá 100 misiones totales",  icon:Shield, rarity:"ÉPICO",      glow:"#a78bfa", unlocked:false },
  { id:5, title:"Imparable",      desc:"Lográ una racha de 7 días",     icon:Zap,    rarity:"ÉPICO",      glow:"#a78bfa", unlocked:false },
  { id:6, title:"Depredador Apex",    desc:"Alcanzá el nivel 10",             icon:Crown,  rarity:"LEGENDARIO", glow:"#fbbf24", unlocked:false },
]);

const WEEK_DATA  = Object.freeze([
  {d:"M",xp:340},{d:"T",xp:520},{d:"W",xp:280},
  {d:"T",xp:610},{d:"F",xp:460},{d:"S",xp:200},{d:"S",xp:130},
]);

const MONTH_DATA = Object.freeze(
  [180,340,420,280,500,380,90,560,310,240,620,400,350,480,220,
   580,440,160,520,370,290,610,430,270,540,380,190,470,310,400]
  .map((xp,i) => ({ d:i+1, xp }))
);

// ── Reflection static data ──────────────────────────────────────

const REFLECTION_CATEGORIES = Object.freeze([
  { id:"low_energy",   label:"Baja energía",          icon:Battery,       color:"#f87171", desc:"El cuerpo pesaba, sin impulso"      },
  { id:"poor_sleep",   label:"Mal sueño",           icon:Moon,          color:"#818cf8", desc:"No descansaste lo suficiente"        },
  { id:"distractions", label:"Distracciones",         icon:Wind,          color:"#fbbf24", desc:"Perdiste foco, mente dispersa" },
  { id:"overloaded",   label:"Plan poco realista", icon:Layers,        color:"#fb923c", desc:"Demasiado para hoy"    },
  { id:"emotional",    label:"Cansancio emocional", icon:Heart,         color:"#f472b6", desc:"La mente estaba en otro lado" },
  { id:"motivation",   label:"Baja motivación",       icon:Zap,           color:"#94a3b8", desc:"Costó arrancar"   },
  { id:"unexpected",   label:"Interrupciones",     icon:AlertTriangle, color:"#22d3ee", desc:"Aparecieron cosas inesperadas"   },
  { id:"overwhelmed",  label:"Saturación",     icon:Activity,      color:"#a78bfa", desc:"Demasiadas cosas a la vez"        },
]);

const REFLECTION_PROMPTS = Object.freeze({
  low_energy:   ["¿Cómo estaba tu energía al empezar el día?","¿Hay un patrón en los momentos donde tu energía baja?"],
  poor_sleep:   ["¿Qué tenías en la cabeza cuando intentabas dormir?","¿Qué cambio simple podría facilitar el sueño de esta noche?"],
  distractions: ["¿Qué te sacó más la atención hoy?","¿Qué cambio de entorno te ayudaría a estar más presente mañana?"],
  overloaded:   ["Viendo hacia atrás, ¿el plan de hoy era realista desde el inicio?","¿Qué tarea merecía realmente la mayor parte de tu foco?"],
  emotional:    ["¿Qué te viene pesando y todavía no procesaste del todo?","¿Qué se sentiría como descanso real esta noche?"],
  motivation:   ["¿Qué suele hacer que una tarea valga la pena empezar?","¿Qué acción pequeña podrías hacer en los próximos 5 minutos?"],
  unexpected:   ["¿Algo te sorprendió hoy y no podías preverlo?","¿Cómo podrías meter más flexibilidad en el plan de mañana?"],
  overwhelmed:  ["Si solo una cosa importara hoy, ¿cuál sería?","¿Qué podés soltar sin una consecuencia real?"],
  default:      ["¿Qué te enseñó hoy sobre cómo funcionás?","¿Cómo sería una versión realista y sostenible de mañana?"],
});

const RECOVERY_RECS = Object.freeze({
  low_energy:   { icon:"🛌", label:"Protegé el sueño de esta noche",            desc:"Reducí pantallas 1 hora antes de dormir. Tu cuerpo está pidiendo recuperación." },
  poor_sleep:   { icon:"🌿", label:"Bajá la carga de mañana un 30%",       desc:"La recuperación acumula. Un día más liviano hoy da más capacidad la próxima semana." },
  distractions: { icon:"🎯", label:"Empezá con un bloque de foco de 25 min",  desc:"Una sola tarea, celular lejos. El ritmo se construye con victorias pequeñas." },
  overloaded:   { icon:"✂️", label:"Quitá una cosa de mañana",      desc:"Menos prioridades significa ejecución más profunda. Calidad antes que volumen." },
  emotional:    { icon:"💆", label:"Agendá un buffer real",             desc:"20 minutos de nada mañana. Tu mente necesita espacio sin estructura." },
  motivation:   { icon:"⚡", label:"Empezá por la victoria más fácil",         desc:"La motivación sigue a la acción, no al revés. Empezá con 5 minutos." },
  unexpected:   { icon:"🔄", label:"Reconstruí buffers de transición",         desc:"Agregá buffers de 15 minutos entre tareas para absorber imprevistos." },
  overwhelmed:  { icon:"⚓", label:"Elegí tu tarea ancla",              desc:"Identificá la única cosa que haría exitoso el día si la completás." },
});

const MOOD_STATES = Object.freeze([
  { v:1, label:"Difícil",   emoji:"😔", color:"#f87171" },
  { v:2, label:"Bajo",     emoji:"😐", color:"#fb923c" },
  { v:3, label:"Neutral", emoji:"😶", color:"#94a3b8" },
  { v:4, label:"Bien",    emoji:"🙂", color:"#34d399" },
  { v:5, label:"Genial",   emoji:"😄", color:"#a78bfa" },
]);

const ENERGY_STATES = Object.freeze([
  { v:1, label:"Agotado", color:"#f87171" },
  { v:2, label:"Bajo",     color:"#fb923c" },
  { v:3, label:"Neutral", color:"#94a3b8" },
  { v:4, label:"Con energía", color:"#34d399" },
  { v:5, label:"Máximo",    color:"#a78bfa" },
]);

const PATTERN_HISTORY = Object.freeze([
  { d:"Mon", mood:3, energy:4, quests:5 },
  { d:"Tue", mood:4, energy:4, quests:6 },
  { d:"Wed", mood:2, energy:2, quests:2 },
  { d:"Thu", mood:3, energy:3, quests:4 },
  { d:"Fri", mood:4, energy:3, quests:5 },
  { d:"Sat", mood:5, energy:5, quests:4 },
  { d:"Sun", mood:3, energy:2, quests:3 },
]);

// ── Schedule engine ─────────────────────────────────────────────

const ACT_TYPES = Object.freeze({
  FOCUS:    { label:"Deep Focus",  color:"#a78bfa", bg:"rgba(167,139,250,.11)" },
  CREATIVE: { label:"Creative",    color:"#22d3ee", bg:"rgba(34,211,238,.10)"  },
  FLOW:     { label:"Flow State",  color:"#34d399", bg:"rgba(52,211,153,.10)"  },
  PHYSICAL: { label:"Physical",    color:"#60a5fa", bg:"rgba(96,165,250,.11)"  },
  SKILL:    { label:"Skill",       color:"#fb923c", bg:"rgba(251,146,60,.10)"  },
  RECOVERY: { label:"Recovery",    color:"#86efac", bg:"rgba(134,239,172,.08)" },
  BUFFER:   { label:"Transition",  color:"#475569", bg:"rgba(71,85,105,.05)"   },
});

const LOAD_WEIGHTS = Object.freeze({ FOCUS:3, CREATIVE:2, FLOW:1.5, PHYSICAL:1, SKILL:2, RECOVERY:-1.5, BUFFER:-0.5 });

const B = (key, name, type, dur, desc, extras={}) => ({ key, name, type, duration:dur, desc, ...extras });

const LIFEOS_MANUAL_REST_DAYS = Object.freeze({
  "2026-05-24": {
    label: "Descanso intencional",
    note: "Domingo libre: hoy no se penalizan misiones pendientes. Las tareas vuelven mañana.",
  },
});

// CALCULUS_FIXED_START_MIN extracted to data module.

// CALCULUS_FIXED_DURATION_MIN extracted to data module.

// CALCULUS_FIXED_END_MIN extracted to data module.

// CALCULUS_SOURCE_LABEL extracted to data module.


// CALCULUS_JOURNALIZATION_II_PAC_2026 extracted to data module.


// ── Date-key utilities extracted to src/utils/time.js ───────────────────


function isLifeOSManualRestDay(dateKey) {
  return Boolean(LIFEOS_MANUAL_REST_DAYS[String(dateKey || "").slice(0, 10)]);
}

function getCalculusSeenTopicsUntil(dateKey = getLifeOSDateKey(), includeToday = true) {
  const key = String(dateKey || "").slice(0, 10);
  const seen = CALCULUS_JOURNALIZATION_II_PAC_2026
    .filter(item => (includeToday ? item.date <= key : item.date < key) && item.mode !== "Examen")
    .map(item => ({ date: item.date, topic: item.topic, focus: item.focus || [], partial: item.partial }))
    .filter(item => item.topic);
  const unique = [];
  const used = new Set();
  for (const item of seen) {
    const normalized = String(item.topic || "").toLowerCase();
    if (used.has(normalized)) continue;
    used.add(normalized);
    unique.push(item);
  }
  return unique;
}

function buildCalculusCumulativeReviewPlan(key, nextExam, daysToExam, exact = null) {
  const seenTopics = getCalculusSeenTopicsUntil(key, true);
  const latestTopics = seenTopics.slice(-6);
  const topicList = latestTopics.map(item => item.topic);
  const examSoon = daysToExam <= 7;
  return {
    ...(exact || {}),
    dateKey:key,
    partial: nextExam?.partial || exact?.partial || latestTopics[latestTopics.length - 1]?.partial || "repaso",
    topic: topicList.length
      ? `Repaso acumulativo: ${topicList.slice(-4).join(" · ")}`
      : "Repaso acumulativo de temas vistos",
    focus: examSoon
      ? ["Repaso acumulativo", "Tipo examen", "Errores frecuentes", "Temas vistos"]
      : ["Repaso acumulativo", "Variados", "Refuerzo", "Temas vistos"],
    mode: examSoon ? "Repaso acumulativo · Modo parcial" : "Repaso acumulativo",
    source: CALCULUS_SOURCE_LABEL,
    cumulativeReview: true,
    reviewTopics: topicList,
    latestClassTopic: exact?.topic || null,
    rule: "Ejercicios variados de los temas vistos hasta ahora según la jornalización.",
  };
}

function getCalculusPlanForDate(dateKey = getLifeOSDateKey()) {
  const key = String(dateKey || "").slice(0, 10);
  const day = parseDateKeyLocal(key).getDay();
  const exact = CALCULUS_JOURNALIZATION_II_PAC_2026.find(item => item.date === key);
  const previous = CALCULUS_JOURNALIZATION_II_PAC_2026.filter(item => item.date < key && item.mode !== "Examen").slice(-5);
  const nextExam = CALCULUS_JOURNALIZATION_II_PAC_2026.find(item => item.date >= key && String(item.mode).toLowerCase().includes("examen"));
  const daysToExam = nextExam ? daysBetweenDateKeys(key, nextExam.date) : Infinity;

  if (day === 5 || day === 6 || day === 0) {
    return buildCalculusCumulativeReviewPlan(key, nextExam, daysToExam, exact);
  }

  if (exact) return { ...exact, dateKey:key, source: CALCULUS_SOURCE_LABEL, cumulativeReview:false, reviewTopics:getCalculusSeenTopicsUntil(key, true).map(item => item.topic) };

  if (daysToExam <= 7) {
    const topics = getCalculusSeenTopicsUntil(key, true).map(item => item.topic);
    return {
      dateKey:key,
      partial: nextExam?.partial || "repaso",
      topic:`Modo parcial ${nextExam?.partial || ""}: repaso acumulado antes del examen`,
      focus:["Pautas", "Tiempo real", "Errores repetidos", "Temas vistos"],
      mode:"Modo parcial",
      source: CALCULUS_SOURCE_LABEL,
      cumulativeReview:true,
      reviewTopics:topics,
      rule:"Semana previa a examen: práctica más difícil tipo parcial con temas vistos.",
    };
  }

  const nearest = previous[previous.length - 1] || CALCULUS_JOURNALIZATION_II_PAC_2026[0];
  return {
    dateKey:key,
    partial: nearest?.partial || 1,
    topic: nearest ? `Repaso: ${nearest.topic}` : "Preparación de Cálculo I",
    focus:["Repasar", "Practicar", "Corregir"],
    mode:"Repaso",
    source: CALCULUS_SOURCE_LABEL,
    cumulativeReview:false,
    reviewTopics:getCalculusSeenTopicsUntil(key, true).map(item => item.topic),
  };
}

function isCalculusQuest(q) {
  const text = `${q?.title || ""} ${q?.sub || ""}`.toLowerCase();
  return q?.id === 1 || text.includes("cálculo") || text.includes("calculo");
}

function createCalculusScheduleBlock(q, dateKey) {
  const plan = getCalculusPlanForDate(dateKey);
  return B(`quest-${q.id}`, q.title, "FOCUS", CALCULUS_FIXED_DURATION_MIN, `${plan.mode} · ${plan.topic}`, {
    questId: q.id,
    quest: q,
    focus: plan.focus,
    fixedTime: true,
    dateKey,
    calculusPlan: plan,
    source: plan.source,
  });
}

function getCalculusPlanId(plan) {
  const p = plan || getCalculusPlanForDate();
  return `${p.dateKey || getLifeOSDateKey()}::${String(p.partial || "p")}`;
}

function createCalculusCurrent(dateKey = getLifeOSDateKey(), plan = getCalculusPlanForDate(dateKey)) {
  return {
    dateKey,
    planId: getCalculusPlanId(plan),
    topic: plan.topic || "Cálculo I",
    mode: plan.mode || "Práctica",
    focus: Array.isArray(plan.focus) ? plan.focus : [],
    source: plan.source || CALCULUS_SOURCE_LABEL,
    cumulativeReview: Boolean(plan.cumulativeReview),
    reviewTopics: Array.isArray(plan.reviewTopics) ? plan.reviewTopics : [],
    generatedAt: null,
    exercises: [],
    answersById: {},
    evaluationsById: {},
    sessionNotes: "",
    selfRating: null,
    lastErrorType: null,
    saved: false,
  };
}

function createCalculusInitialState() {
  return {
    current: createCalculusCurrent(),
    history: [],
    errorBank: [],
    examSimulations: [],
    settings: {
      dailyExerciseCount: 8,
      weekendExerciseCount: 10,
      examModeExerciseCount: 12,
      strictMode: true,
      examMode: false,
    },
  };
}


// CALCULUS_DIFFICULTY_LEVELS extracted to data module.


function inferCalculusDifficultyLevel(value) {
  const raw = String(value ?? "").toLowerCase().trim();
  const numeric = Number(String(raw).match(/[1-5]/)?.[0]);
  if (Number.isFinite(numeric) && numeric >= 1 && numeric <= 5) return numeric;
  if (/b[aá]sic/.test(raw)) return 1;
  if (/f[aá]cil/.test(raw)) return 2;
  if (/intermedio|medio/.test(raw)) return 3;
  if (/dif[ií]cil|avanz/.test(raw)) return 4;
  if (/examen|parcial/.test(raw)) return 5;
  return 3;
}

function getCalculusDifficultyInfo(value) {
  const level = inferCalculusDifficultyLevel(value);
  return CALCULUS_DIFFICULTY_LEVELS[level] || CALCULUS_DIFFICULTY_LEVELS[3];
}

function getCalculusDifficultyDisplay(value) {
  const info = getCalculusDifficultyInfo(value);
  return `Nivel ${info.level} · ${info.name}`;
}

function hasCalculusProgress(current) {
  if (!current || typeof current !== "object") return false;
  return Boolean(
    (Array.isArray(current.exercises) && current.exercises.length > 0) ||
    Object.keys(current.answersById || {}).length > 0 ||
    Object.keys(current.evaluationsById || {}).length > 0 ||
    String(current.sessionNotes || "").trim()
  );
}

function normalizeCalculusExercise(raw, idx = 0) {
  if (!raw || typeof raw !== "object") return null;
  const id = String(raw.id || `calc-${idx + 1}`).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || `calc-${idx + 1}`;
  const statement = String(raw.statement || raw.enunciado || "").trim();
  if (!statement) return null;
  const rawOptions = Array.isArray(raw.options || raw.opciones) ? (raw.options || raw.opciones) : [];
  const options = rawOptions.map((opt, i) => typeof opt === "object"
    ? { key: String(opt.key || opt.label || String.fromCharCode(65 + i)).slice(0, 6), text: String(opt.text || opt.value || opt.label || "").slice(0, 260) }
    : { key: String.fromCharCode(65 + i), text: String(opt || "").slice(0, 260) }
  ).filter(opt => opt.text).slice(0, 6);
  return {
    id,
    title: String(raw.title || raw.titulo || `Ejercicio ${idx + 1}`).slice(0, 80),
    statement,
    topic: String(raw.topic || raw.tema || "Cálculo I").slice(0, 120),
    type: String(raw.type || raw.tipo || "práctica").slice(0, 80),
    questionMode: String(raw.questionMode || raw.formato || raw.type || raw.tipo || "procedimiento").slice(0, 80),
    options,
    difficulty: getCalculusDifficultyDisplay(raw.difficultyLevel || raw.level || raw.difficulty || raw.dificultad || "intermedio"),
    difficultyLevel: inferCalculusDifficultyLevel(raw.difficultyLevel || raw.level || raw.difficulty || raw.dificultad || "intermedio"),
    targetSkill: String(raw.targetSkill || raw.habilidad || "resolver con orden").slice(0, 120),
    hint: String(raw.hint || raw.pista || "").slice(0, 500),
  };
}

function normalizeCalculusPayload(payload, fallbackPlan = getCalculusPlanForDate()) {
  const rawExercises = Array.isArray(payload?.exercises) ? payload.exercises : [];
  const exercises = rawExercises.map(normalizeCalculusExercise).filter(Boolean).slice(0, 16);
  return {
    title: String(payload?.title || `Práctica de ${fallbackPlan.topic}`).slice(0, 120),
    instructions: String(payload?.instructions || "Resolvé con procedimiento claro. No solo pongás respuesta final.").slice(0, 800),
    difficulty: getCalculusDifficultyDisplay(payload?.difficultyLevel || payload?.difficulty || fallbackPlan.mode || "intermedio"),
    estimatedMinutes: Math.max(15, Math.min(120, Math.floor(Number(payload?.estimatedMinutes) || 75))),
    exercises,
  };
}



// CALCULUS_I_VIDEO_SCOPE extracted to data module.

// CALCULUS_I_VIDEO_BLOCKED_TERMS extracted to data module.


function makeCalculusIVideoSearch(query) {
  const base = `${query} Cálculo I español límites derivadas funciones`.trim();
  const exclusions = CALCULUS_I_VIDEO_BLOCKED_TERMS.map(term => `-${term}`).join(" ");
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${base} ${exclusions}`)}`;
}

function makeCalculusIVideo(title, query) {
  return {
    title: title.includes("Cálculo I") ? title : `${title} · Cálculo I`,
    url: makeCalculusIVideoSearch(query),
  };
}

const CALCULUS_TOPIC_VIDEO_RECOMMENDATIONS = Object.freeze([
  {
    match: [/as[ií]ntota/, /vertical/, /horizontal/, /oblicua/],
    title: "Videos Cálculo I · Asíntotas",
    note: "Solo Cálculo I/MM201: dominio, límites al infinito, asíntotas verticales, horizontales y oblicuas. Evitá resultados de Cálculo II/III.",
    videos: [
      makeCalculusIVideo("JulioProfe · Asíntotas verticales, horizontales y oblicuas", "JulioProfe asíntotas verticales horizontales oblicuas Cálculo I funciones racionales"),
      makeCalculusIVideo("Khan Academy Español · Asíntotas de funciones racionales", "Khan Academy Español asíntotas funciones racionales Cálculo I"),
      makeCalculusIVideo("math2me · Asíntotas con división polinomial", "math2me asíntotas división polinomial Cálculo I funciones racionales"),
    ],
  },
  {
    match: [/l[ií]mite/, /laterales/, /impropios/, /infinito/],
    title: "Videos Cálculo I · Límites",
    note: "Solo temas iniciales de Cálculo I: límites, límites laterales, límites infinitos y límites al infinito.",
    videos: [
      makeCalculusIVideo("JulioProfe · Límites laterales e infinitos", "JulioProfe límites laterales límites infinitos Cálculo I"),
      makeCalculusIVideo("Khan Academy Español · Límites al infinito", "Khan Academy Español límites al infinito Cálculo I"),
      makeCalculusIVideo("math2me · Límites indeterminados", "math2me límites indeterminados Cálculo I ejercicios"),
    ],
  },
  {
    match: [/continuidad/, /discontinuidad/],
    title: "Videos Cálculo I · Continuidad",
    note: "Solo Cálculo I: continuidad en un punto, límites laterales y tipos de discontinuidad.",
    videos: [
      makeCalculusIVideo("JulioProfe · Continuidad de funciones", "JulioProfe continuidad de funciones Cálculo I"),
      makeCalculusIVideo("Khan Academy Español · Continuidad y discontinuidades", "Khan Academy Español continuidad discontinuidades Cálculo I"),
      makeCalculusIVideo("math2me · Continuidad en un punto", "math2me continuidad en un punto Cálculo I"),
    ],
  },
  {
    match: [/derivada/, /tangente/, /cadena/, /l'hopital/, /lhopital/, /optimizaci[oó]n/, /gr[aá]fica/],
    title: "Videos Cálculo I · Derivadas",
    note: "Solo Cálculo I: definición de derivada, recta tangente, reglas, cadena, implícita, L’Hopital, gráficas y optimización básica.",
    videos: [
      makeCalculusIVideo("JulioProfe · Derivadas desde cero", "JulioProfe derivadas desde cero Cálculo I"),
      makeCalculusIVideo("Khan Academy Español · Regla de la cadena", "Khan Academy Español regla de la cadena Cálculo I"),
      makeCalculusIVideo("math2me · Optimización con derivadas", "math2me optimización derivadas Cálculo I"),
    ],
  },
  {
    match: [/integral/, /antiderivada/, /sustituci[oó]n/, /[aá]rea/],
    title: "Videos Cálculo I · Antiderivadas e integral definida",
    note: "Solo el tramo básico de Cálculo I: antiderivadas, sustitución, integral definida y áreas entre curvas. Nada de integrales múltiples ni Cálculo II.",
    videos: [
      makeCalculusIVideo("JulioProfe · Antiderivadas e integrales por sustitución", "JulioProfe antiderivadas integrales por sustitución Cálculo I"),
      makeCalculusIVideo("Khan Academy Español · Integral definida", "Khan Academy Español integral definida Cálculo I"),
      makeCalculusIVideo("math2me · Área entre curvas", "math2me área entre curvas integral definida Cálculo I"),
    ],
  },
]);

function getCalculusVideoRecommendations(plan = getCalculusPlanForDate()) {
  const haystack = `${plan.topic || ""} ${(plan.focus || []).join(" ")} ${(plan.reviewTopics || []).slice(-6).join(" ")}`.toLowerCase();
  const found = CALCULUS_TOPIC_VIDEO_RECOMMENDATIONS.find(group => group.match.some(rx => rx.test(haystack)));
  return found || {
    title: "Videos Cálculo I · Apoyo del tema",
    note: `Filtro estricto: ${CALCULUS_I_VIDEO_SCOPE}. Si YouTube muestra Cálculo II/III, ignoralo y buscá una explicación de límites, continuidad, derivadas o integrales básicas.`,
    videos: [
      makeCalculusIVideo(`Buscar explicación de ${plan.topic || "Cálculo I"}`, `${plan.topic || "Cálculo I"} explicación ejercicios`),
      makeCalculusIVideo("Khan Academy Español · Cálculo I", "Khan Academy Español Cálculo I límites derivadas integrales básicas"),
    ],
  };
}

// CALCULUS_PINNED_PRACTICE_BY_DATE extracted to data module.


function getCalculusPinnedPracticeForDate(dateKey = getLifeOSDateKey()) {
  const key = String(dateKey || "").slice(0, 10);
  return CALCULUS_PINNED_PRACTICE_BY_DATE[key] || null;
}

function getCalculusRecentHistory(calculus, limit = 5) {
  const history = Array.isArray(calculus?.history) ? calculus.history : [];
  return history.slice(-limit).map(day => ({
    dateKey: day.dateKey,
    topic: day.topic,
    mode: day.mode,
    selfRating: day.selfRating ?? null,
    lastErrorType: day.lastErrorType || null,
    evaluatedCount: Object.keys(day.evaluationsById || {}).length,
    notes: String(day.sessionNotes || "").slice(0, 240),
  }));
}

function getCalculusAdaptiveMode(plan, calculus) {
  const history = Array.isArray(calculus?.history) ? calculus.history : [];
  const last = history[history.length - 1];
  const scoreValues = Object.values(last?.evaluationsById || {}).map(e => Number(e.score)).filter(n => Number.isFinite(n));
  const avg = scoreValues.length ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : null;
  if (plan?.cumulativeReview) return "Repaso acumulativo: ejercicios variados de los temas vistos hasta ahora según la jornalización.";
  if (String(plan?.mode || "").toLowerCase().includes("examen") || String(plan?.mode || "").toLowerCase().includes("parcial")) return "Modo parcial: ejercicios más difíciles, mezclados y con menos pistas.";
  if (avg !== null && avg < 60) return "Refuerzo adaptativo: repetir errores de ayer con pasos más guiados.";
  if (avg !== null && avg >= 80) return "Progresión: subir dificultad y mezclar con temas anteriores.";
  return "Práctica normal: tema del día + repaso corto de errores recientes.";
}

const SCHEDULE_BLOCKS = Object.freeze({
  WD_SWIM: [
    B("buf0","Arrival Buffer","BUFFER",15,"Settle in · quick mental reset"),
    B("calc","Calculus I","FOCUS",75,"Problem sets · theory deep-dive",{focus:["Limits","Derivatives","Integrals"]}),
    B("prep","Break + Pool Prep","BUFFER",20,"Snack · change into swim gear · decompress"),
    B("walk1","Walk to Pool","BUFFER",10,"10 min walk"),
    B("swim","Swimming","PHYSICAL",90,"1h30 pool session",{focus:["Floating","Breathing","Water confidence"]}),
    B("walk2","Change + Walk Back","BUFFER",20,"Dry off · change · 10 min walk home"),
    B("rec","Post-swim Decompression","RECOVERY",20,"Rehydrate · snack · let mind drift"),
    B("rl","Rocket League","FLOW",60,"1h training block",{focus:["Powershots","Recoveries","Speedflips","Fast aerials"]}),
    B("buf1","Transition","BUFFER",15,"Hydrate · step away from screen"),
    B("blen","Blender","CREATIVE",60,"1h · current project or random challenge"),
    B("buf2","Transition","BUFFER",10,"Light stretch · mind reset"),
    B("read","Lectura profunda","SKILL",25,"25 min · any genre"),
    B("type","Typing Practice","SKILL",15,"WPM + accuracy drill"),
    B("jour","Diario nocturno","RECOVERY",20,"Reflect · set tomorrow's intentions"),
  ],
  WD_NO_SWIM: [
    B("buf0","Arrival Buffer","BUFFER",15,"Settle in · quick mental reset"),
    B("calc","Calculus I","FOCUS",90,"1h30 deep problem work",{focus:["Limits","Derivatives","Integrals"]}),
    B("brk","Break","RECOVERY",15,"Step away · stretch · breathe deeply"),
    B("rl","Rocket League","FLOW",60,"1h focused training session",{focus:["Powershots","Speedflips","Replay analysis","Positioning"]}),
    B("buf1","Transition","BUFFER",15,"Hydrate · mental reset"),
    B("blen","Blender","CREATIVE",60,"1h · project or random challenge"),
    B("buf2","Transition","BUFFER",15,"Screen break · stretch"),
    B("type","Typing + Non-Dom Writing","SKILL",30,"Typing 20 min · non-dominant hand 10 min"),
    B("read","Lectura profunda","SKILL",40,"40 min · any genre"),
    B("buf3","Decompression","RECOVERY",15,"No screens · step outside briefly"),
    B("med","Meditation","RECOVERY",10,"10 min mindfulness · breathwork"),
    B("jour","Diario nocturno","RECOVERY",25,"Reflect · set intentions · plan tomorrow"),
  ],
  WD_MONDAY: [
    B("buf0","Arrival Buffer","BUFFER",15,"Week kickoff · brief planning review"),
    B("calc","Calculus I","FOCUS",60,"1h fresh-week review + light problem work",{focus:["Review session","Concept gaps"]}),
    B("brk","Ease-out Break","RECOVERY",20,"Stretch · breathe · reset brain"),
    B("blen","Blender","CREATIVE",75,"1h15 · momentum build on current project"),
    B("buf1","Transition","BUFFER",15,"Hydrate · rest eyes"),
    B("rl","Rocket League","FLOW",60,"1h warm-up for the week",{focus:["Fundamentals","Consistency","Mentality reset"]}),
    B("buf2","Transition","BUFFER",15,"Light snack · stretch"),
    B("type","Typing Practice","SKILL",20,"20 min · WPM baseline for the week"),
    B("read","Lectura profunda","SKILL",35,"Relaxed reading · any genre"),
    B("buf3","Decompression","RECOVERY",15,"No screens · wind down"),
    B("jour","Weekly Intentions","RECOVERY",30,"Set weekly goals · swim days · reflect on last week"),
  ],
  WE_MORNING: [
    B("ease","Morning Ease-in","RECOVERY",10,"Coffee · light stretch · no rush"),
    B("calc","Calculus I","FOCUS",60,"Fresh morning focus",{focus:["Review","Practice sets","Concept solidification"]}),
    B("buf","Break","BUFFER",10,"Step away · breathe"),
    B("read","Reading","SKILL",30,"30 min reading block"),
    B("snip","Journal Snippet","RECOVERY",10,"Quick morning reflection"),
  ],
  WE_AFTERNOON: [
    B("buf0","Arrival Buffer","BUFFER",15,"Settle in · ease into the session"),
    B("blen","Blender","CREATIVE",75,"1h15 project deep dive or challenge"),
    B("buf1","Transition","BUFFER",15,"Stretch · step back from screen"),
    B("rl","Rocket League","FLOW",60,"1h training block",{focus:["Mechanics","Positioning","Decision-making","Mentality"]}),
    B("buf2","Transition","BUFFER",15,"Reset · hydrate · quick snack"),
    B("skills","Skill Stack","SKILL",45,"Typing 20 min · Non-dom writing 15 min · Breathwork 10 min"),
    B("buf3","Break","RECOVERY",15,"Decompress · no task pressure"),
    B("deep","Deep Work","FOCUS",60,"1h Calculus deep work block"),
    B("buf4","Buffer","BUFFER",15,"Wind down mindfully"),
    B("read","Reading","SKILL",30,"Chill reading · whatever feels good"),
    B("buf5","Decompression","RECOVERY",20,"No screens · walk · light stretch"),
    B("med","Meditation + Stretch","RECOVERY",20,"End-of-day body scan + breathwork"),
    B("jour","Diario nocturno","RECOVERY",30,"Weekend reflection · plan upcoming week"),
  ],
});

// ── Schedule time helpers extracted to src/utils/time.js ───────────────


function parseQuestDurationMinutes(q, fallback = 30) {
  const text = `${q?.title || ""} ${q?.sub || ""}`.toLowerCase();
  if (q?.id === ROCKET_LEAGUE_PARENT_QUEST_ID || text.includes("rocket")) return ROCKET_LEAGUE_SESSION_MINUTES;
  const matches = [...text.matchAll(/(\d+)\s*(?:–|-|a)?\s*(\d+)?\s*(?:min|m|minute|minutes)/g)];
  if (matches.length) {
    const values = matches.flatMap((m) => [m[1], m[2]]).filter(Boolean).map(Number).filter((n) => Number.isFinite(n));
    if (values.length) return Math.max(5, Math.min(180, Math.max(...values)));
  }
  const hourMatch = text.match(/(\d+)\s*h/);
  if (hourMatch) return Math.max(15, Math.min(180, Number(hourMatch[1]) * 60));
  return fallback;
}

function questScheduleType(q) {
  const text = `${q?.title || ""} ${q?.sub || ""}`.toLowerCase();
  if (q?.id === ROCKET_LEAGUE_PARENT_QUEST_ID || text.includes("rocket")) return "FLOW";
  if (text.includes("blender") || text.includes("3d")) return "CREATIVE";
  if (text.includes("reflex") || text.includes("diario") || text.includes("medit")) return "RECOVERY";
  if (text.includes("inglés") || text.includes("ingles") || text.includes("typing") || text.includes("lectura")) return "SKILL";
  if (text.includes("cálculo") || text.includes("calculo") || text.includes("estudi")) return "FOCUS";
  if (q?.cat === "body") return "PHYSICAL";
  if (q?.cat === "mind") return "SKILL";
  return "FOCUS";
}

function questScheduleFocus(q) {
  const text = `${q?.title || ""} ${q?.sub || ""}`.toLowerCase();
  if (q?.id === ROCKET_LEAGUE_PARENT_QUEST_ID || text.includes("rocket")) return ["Freeplay", "Speedflips", "Flicks", "Mental"];
  if (text.includes("cálculo") || text.includes("calculo")) return ["Tema del día", "Ejercicios", "Corrección"];
  if (text.includes("blender")) return ["Principiante", "Ejercicio del día", "Sin numpad"];
  if (text.includes("inglés") || text.includes("ingles")) return ["Listening", "Vocabulario", "Speaking"];
  if (text.includes("reflex")) return ["Cierre", "Plan mañana", "Mental"];
  return ["Misión", "Ejecución"];
}

function buildMissionScheduleBlocks(dayIdx, quests = QUESTS, weekKey = getScheduleWeekKey()) {
  const active = hydrateQuestItems(Array.isArray(quests) && quests.length ? quests : QUESTS);
  const scheduleDateKey = getDateKeyForScheduleDay(weekKey, dayIdx);

  if (isLifeOSManualRestDay(scheduleDateKey)) {
    const rest = LIFEOS_MANUAL_REST_DAYS[scheduleDateKey];
    return buildTimed(T(15, 40), [
      B("rest-day", rest.label, "RECOVERY", 30, rest.note, {
        focus:["Descanso", "Sin penalización", "Mañana se retoma"],
        dateKey:scheduleDateKey,
      }),
    ]);
  }

  const blocks = [];
  const calculusQuest = active.find(isCalculusQuest);
  const typingQuest = active.find(isTypingQuest);
  const blenderQuest = active.find(isBlenderQuest);
  const rocketQuest = active.find(isRocketQuest);
  const nightlyQuest = active.find(isNightlyQuest);

  if (calculusQuest) {
    const calc = createCalculusScheduleBlock(calculusQuest, scheduleDateKey);
    calc.startMin = CALCULUS_FIXED_START_MIN;
    calc.endMin = CALCULUS_FIXED_END_MIN;
    blocks.push(calc);

    blocks.push(createFixedQuestScheduleBlock(
      calculusQuest,
      "calc-night-review",
      "Repaso cálculo nocturno",
      "FOCUS",
      30,
      "11:15–11:45 PM · repaso externo, dudas y preparación del proyecto de Cálculo antes de dormir",
      T(23, 15),
      scheduleDateKey,
      ["Repaso", "Dudas", "Preparar mañana"]
    ));
  }

  const fixedQuestIds = new Set([
    calculusQuest?.id,
    typingQuest?.id,
    blenderQuest?.id,
    rocketQuest?.id,
    nightlyQuest?.id,
  ].filter(Boolean));

  const morningMovable = active.filter(q => !fixedQuestIds.has(q.id));
  const morningBlocks = [];
  morningMovable.forEach((q, idx) => {
    const duration = parseQuestDurationMinutes(q, idx === 0 ? 35 : 25);
    morningBlocks.push(B(`quest-${q.id}`, q.title, questScheduleType(q), duration, q.sub || "Misión diaria", {
      questId: q.id,
      quest: q,
      focus: questScheduleFocus(q),
      randomized: false,
      scheduleWeekKey: weekKey,
      dateKey:scheduleDateKey,
    }));
    if (idx < morningMovable.length - 1) morningBlocks.push(B(`buf-${q.id}`, "Reset corto", "BUFFER", 10, "Agua · estirar · preparar siguiente bloque"));
  });
  blocks.push(...buildTimed(T(10, 0), morningBlocks));

  blocks.push(createFixedQuestScheduleBlock(
    typingQuest,
    "typing-fixed-afternoon",
    typingQuest?.title || "Mecanografía",
    "SKILL",
    25,
    typingQuest?.sub || "2:15–2:40 PM · práctica limpia de teclado",
    T(14, 15),
    scheduleDateKey,
    ["Precisión", "Ritmo", "Constancia"]
  ));

  blocks.push(createFixedQuestScheduleBlock(
    blenderQuest,
    "blender-fixed-afternoon",
    blenderQuest?.title || "Blender",
    "CREATIVE",
    BLENDER_SESSION_MINUTES,
    "2:40–3:40 PM · Blender principiante: ejercicio del día, tareas y práctica sin numpad",
    T(14, 40),
    scheduleDateKey,
    ["Principiante", "Ejercicio del día", "Sin numpad"]
  ));

  if (rocketQuest) {
    blocks.push(createFixedQuestScheduleBlock(
      rocketQuest,
      "rocket-fixed-afternoon",
      rocketQuest.title,
      "FLOW",
      ROCKET_LEAGUE_SESSION_MINUTES,
      "3:40–5:10 PM · 90 min full entrenamiento; ranked/1v1 queda opcional",
      T(15, 40),
      scheduleDateKey,
      ["Fundamentos", "Training", "Sin ranked obligatorio"]
    ));
  }

  blocks.push(B("free-after-rocket", "Tiempo libre total", "RECOVERY", 20, "5:10 PM en adelante · estudiar, series, descansar o ranked solo si de verdad querés", {
    focus:["Libre", "Descanso", "Sin obligación"],
    randomized:false,
    dateKey:scheduleDateKey,
    startMin:T(17, 10),
    endMin:T(17, 30),
  }));

  if (nightlyQuest) {
    blocks.push(createFixedQuestScheduleBlock(
      nightlyQuest,
      "night-reflection-fixed",
      nightlyQuest.title,
      "RECOVERY",
      Math.max(5, Math.min(15, parseQuestDurationMinutes(nightlyQuest, 5))),
      "11:45 PM · cierre rápido antes de dormir a las 12:00 AM",
      T(23, 45),
      scheduleDateKey,
      ["Cierre", "Plan mañana", "Dormir"]
    ));
  }

  return blocks.sort((a, b) => (a.startMin || 0) - (b.startMin || 0));
}

function getScheduleBlocks(dayIdx, swimDays, quests = QUESTS, weekKey = getScheduleWeekKey()) {
  return { main: buildMissionScheduleBlocks(dayIdx, quests, weekKey) };
}

function calcLoad(blocks) {
  const productive = blocks.filter(b => b.type !== "BUFFER" && b.type !== "RECOVERY");
  const mx = productive.length * 3;
  const score = blocks.reduce((s, b) => s + (LOAD_WEIGHTS[b.type] || 0), 0);
  return Math.round(Math.max(20, Math.min(95, (score / (mx || 1)) * 100)));
}

function loadInfo(s) {
  if (s < 38) return { label:"Easy Day",   color:"#34d399", bar:"linear-gradient(90deg,#34d39966,#34d399)" };
  if (s < 58) return { label:"Balanced",   color:"#22d3ee", bar:"linear-gradient(90deg,#22d3ee66,#22d3ee)" };
  if (s < 75) return { label:"Productive", color:"#a78bfa", bar:"linear-gradient(90deg,#a78bfa66,#a78bfa)" };
  return             { label:"Intense",    color:"#f87171", bar:"linear-gradient(90deg,#f8717166,#f87171)" };
}

// ─────────────────────────────────────────────────────────────────
// § 4 · PERSISTENCE ENGINE — Production Hardened
// ─────────────────────────────────────────────────────────────────

// ── 4.1 · Schema versioning (numeric, forward-only) ─────────────
//
// RULES:
//   • Increment STORAGE_SCHEMA_VERSION when PERSISTENT_INITIAL shape changes.
//   • Add a corresponding entry in MIGRATIONS for every version gap.
//   • Never decrement. Never delete past migrations.
//   • Version is stored inside the blob — NOT in the storage key.
//     The key stays stable across version bumps, enabling migrations
//     instead of invisible data loss.

const STORAGE_SCHEMA_VERSION = 13; // integer — bump on schema change

// Stable, version-independent storage key.
// Version lives in the blob (_schema field), not the key.
const STORAGE_KEY = "lifeos:app";

// ── 4.2 · Migration engine ───────────────────────────────────────
//
// Map of { [fromVersion: number]: (snapshot) => migratedSnapshot }
// Each function transforms the shape from `fromVersion` → `fromVersion + 1`.
// migrateSnapshot() chains them automatically.
//
// Template for future migrations:
//   [1]: (snap) => ({
//     ...snap,
//     newDomain: { field: defaultValue },          // add new domain
//     existingDomain: { ...snap.existingDomain, newField: 0 }, // add field
//   }),

const MIGRATIONS = Object.freeze({
  [1]: (snap) => ({
    ...snap,
    rocketLeague: snap?.rocketLeague && typeof snap.rocketLeague === "object"
      ? deepMerge(createRocketLeagueInitialState(), snap.rocketLeague)
      : createRocketLeagueInitialState(),
  }),
  [2]: (snap) => ({
    ...snap,
    appSettings: snap?.appSettings && typeof snap.appSettings === "object"
      ? deepMerge(createAppSettingsInitial(), snap.appSettings)
      : createAppSettingsInitial(),
  }),
  [3]: (snap) => {
    const dateKey = getLifeOSDateKey();
    const quests = snap?.quests && typeof snap.quests === "object" ? snap.quests : {};
    const completedIds = Array.isArray(quests.completedIds) ? quests.completedIds : [];
    return {
      ...snap,
      quests: {
        ...quests,
        completedIds: normalizeQuestCompletedIdsForDate(completedIds, snap?.xp?.dailyLog, dateKey),
        dailyHistory: Array.isArray(quests.dailyHistory) ? quests.dailyHistory : [],
        lastResetDate: dateKey,
      },
    };
  },
  [4]: (snap) => ({
    ...snap,
    wardrobe: snap?.wardrobe && typeof snap.wardrobe === "object"
      ? deepMerge(createWardrobeInitial(), snap.wardrobe)
      : createWardrobeInitial(),
  }),
  [5]: (snap) => ({
    ...snap,
    rocketLeague: snap?.rocketLeague && typeof snap.rocketLeague === "object"
      ? {
          ...deepMerge(createRocketLeagueInitialState(), snap.rocketLeague),
          current: {
            ...deepMerge(createRocketLeagueCurrent(), snap.rocketLeague?.current || {}),
            matchCountBySubtask: snap.rocketLeague?.current?.matchCountBySubtask && typeof snap.rocketLeague.current.matchCountBySubtask === "object" && !Array.isArray(snap.rocketLeague.current.matchCountBySubtask)
              ? snap.rocketLeague.current.matchCountBySubtask
              : {},
          },
        }
      : createRocketLeagueInitialState(),
  }),
  [6]: (snap) => ({
    ...snap,
    appSettings: snap?.appSettings && typeof snap.appSettings === "object"
      ? deepMerge(createAppSettingsInitial(), snap.appSettings)
      : createAppSettingsInitial(),
  }),
  [7]: (snap) => ({
    ...snap,
    appSettings: snap?.appSettings && typeof snap.appSettings === "object"
      ? deepMerge(createAppSettingsInitial(), snap.appSettings)
      : createAppSettingsInitial(),
    quests: snap?.quests && typeof snap.quests === "object"
      ? { ...snap.quests, dailyHistory: Array.isArray(snap.quests.dailyHistory) ? snap.quests.dailyHistory : [] }
      : PERSISTENT_INITIAL.quests,
  }),
  [8]: (snap) => ({
    ...snap,
    wardrobe: snap?.wardrobe && typeof snap.wardrobe === "object"
      ? deepMerge(createWardrobeInitial(), snap.wardrobe)
      : createWardrobeInitial(),
    appSettings: snap?.appSettings && typeof snap.appSettings === "object"
      ? deepMerge(createAppSettingsInitial(), snap.appSettings)
      : createAppSettingsInitial(),
  }),
  [9]: (snap) => ({
    ...snap,
    calculus: snap?.calculus && typeof snap.calculus === "object"
      ? deepMerge(createCalculusInitialState(), snap.calculus)
      : createCalculusInitialState(),
  }),
  [10]: (snap) => ({
    ...snap,
    quests: snap?.quests && typeof snap.quests === "object"
      ? { ...snap.quests, startedIds: Array.isArray(snap.quests.startedIds) ? snap.quests.startedIds : [] }
      : PERSISTENT_INITIAL.quests,
    appSettings: snap?.appSettings && typeof snap.appSettings === "object"
      ? deepMerge(createAppSettingsInitial(), snap.appSettings)
      : createAppSettingsInitial(),
    calculus: snap?.calculus && typeof snap.calculus === "object"
      ? deepMerge(createCalculusInitialState(), snap.calculus)
      : createCalculusInitialState(),
  }),
  [12]: (snap) => ({
    ...snap,
    rocketLeague: snap?.rocketLeague && typeof snap.rocketLeague === "object"
      ? deepMerge(createRocketLeagueInitialState(), snap.rocketLeague)
      : createRocketLeagueInitialState(),
    calculus: snap?.calculus && typeof snap.calculus === "object"
      ? deepMerge(createCalculusInitialState(), snap.calculus)
      : createCalculusInitialState(),
  }),
});

// Chains migration functions from savedVersion → STORAGE_SCHEMA_VERSION.
// Returns null if any migration throws (triggers corrupted-save recovery).
function migrateSnapshot(snapshot, savedVersion) {
  let state = snapshot;
  let v     = savedVersion;

  while (v < STORAGE_SCHEMA_VERSION) {
    const fn = MIGRATIONS[v];
    if (typeof fn === "function") {
      try {
        const next = fn(state);
        if (!next || typeof next !== "object") {
          console.warn(`[LifeOS:migrate] v${v}→v${v+1} returned invalid shape`);
          return null;
        }
        state = next;
      } catch (err) {
        console.warn(`[LifeOS:migrate] v${v}→v${v+1} threw:`, err?.message);
        return null; // escalate to corrupted-save recovery
      }
    }
    v++;
  }

  return state;
}

// ── 4.3 · Deep merge utility ─────────────────────────────────────
//
// Merges `source` onto `target` recursively.
// Arrays are replaced wholesale (not merged element-by-element).
// Undefined source values do not overwrite target defaults.
// Used for partial snapshot recovery — fills gaps with PERSISTENT_INITIAL
// instead of crashing reducers on missing keys.

function deepMerge(target, source) {
  if (
    typeof target !== "object" || target === null ||
    typeof source !== "object" || source === null
  ) {
    return source !== undefined ? source : target;
  }

  // Arrays: source wins wholesale — no element merging
  if (Array.isArray(target) || Array.isArray(source)) {
    return Array.isArray(source) ? source : target;
  }

  const result = { ...target };

  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (sv === undefined) continue; // source gap → keep target default

    if (
      typeof tv === "object" && tv !== null && !Array.isArray(tv) &&
      typeof sv === "object" && sv !== null && !Array.isArray(sv)
    ) {
      result[key] = deepMerge(tv, sv); // recurse into nested objects
    } else {
      result[key] = sv;
    }
  }

  return result;
}

// ── 4.4 · Field-level integrity validation ───────────────────────
//
// Guards against schema drift, NaN injection, and type corruption.
// Returns false → triggers deepMerge partial recovery instead of total wipe.
// Intentionally permissive: catches hard corruptions, not semantic errors.

function validateSnapshotIntegrity(snap) {
  if (!snap || typeof snap !== "object") return false;

  // Required top-level domains
  const REQUIRED_DOMAINS = ["xp", "quests", "streak", "planner", "reflection", "achievements", "rocketLeague", "appSettings", "wardrobe", "calculus"];
  if (!REQUIRED_DOMAINS.every(k => snap[k] !== null && typeof snap[k] === "object")) return false;

  // XP domain
  const { xp } = snap;
  if (typeof xp.total !== "number" || !isFinite(xp.total) || xp.total < 0) return false;
  if (!Array.isArray(xp.dailyLog)) return false;

  // Quests domain
  const { quests } = snap;
  if (!Array.isArray(quests.completedIds)) return false;
  if (!quests.completedIds.every(id => typeof id === "number")) return false;
  if (quests.dailyHistory !== undefined && !Array.isArray(quests.dailyHistory)) return false;
  if (quests.lastResetDate !== undefined && typeof quests.lastResetDate !== "string") return false;

  // Racha domain
  const { streak } = snap;
  if (typeof streak.current !== "number" || !isFinite(streak.current) || streak.current < 0) return false;
  if (typeof streak.best    !== "number" || !isFinite(streak.best)    || streak.best    < 0) return false;

  // Planner domain
  const { planner } = snap;
  if (typeof planner.swimPairIndex !== "number") return false;
  if (!["continue","challenge"].includes(planner.blenderMode)) return false;

  // Achievements domain
  const { achievements } = snap;
  if (!Array.isArray(achievements.unlockedIds)) return false;

  // Reflection domain (structure check only — content is user-typed)
  const { reflection } = snap;
  if (!reflection.current || typeof reflection.current !== "object") return false;
  if (!Array.isArray(reflection.history)) return false;

  // Rocket League domain
  const { rocketLeague } = snap;
  if (!rocketLeague.current || typeof rocketLeague.current !== "object") return false;
  if (!Array.isArray(rocketLeague.history)) return false;
  if (!Array.isArray(rocketLeague.current.completedSubtaskIds)) return false;
  if (rocketLeague.current.elapsedBySubtask === null || typeof rocketLeague.current.elapsedBySubtask !== "object" || Array.isArray(rocketLeague.current.elapsedBySubtask)) return false;
  if (rocketLeague.current.matchCountBySubtask === null || typeof rocketLeague.current.matchCountBySubtask !== "object" || Array.isArray(rocketLeague.current.matchCountBySubtask)) return false;
  if (!rocketLeague.current.mental || typeof rocketLeague.current.mental !== "object") return false;
  if (rocketLeague.speedflipDar !== undefined) {
    if (!rocketLeague.speedflipDar || typeof rocketLeague.speedflipDar !== "object" || Array.isArray(rocketLeague.speedflipDar)) return false;
    if (!Array.isArray(rocketLeague.speedflipDar.history)) return false;
  }

  // App settings domain
  const { appSettings } = snap;
  if (!appSettings || typeof appSettings !== "object") return false;
  if (!appSettings.sound || typeof appSettings.sound !== "object") return false;
  if (appSettings.pwa !== undefined && (appSettings.pwa === null || typeof appSettings.pwa !== "object" || Array.isArray(appSettings.pwa))) return false;

  // Wardrobe domain
  const { wardrobe } = snap;
  if (!wardrobe || typeof wardrobe !== "object") return false;
  if (!wardrobe.profile || typeof wardrobe.profile !== "object") return false;
  if (!Array.isArray(wardrobe.items)) return false;
  if (!Array.isArray(wardrobe.history)) return false;

  // Calculus trainer domain
  const { calculus } = snap;
  if (!calculus || typeof calculus !== "object") return false;
  if (!calculus.current || typeof calculus.current !== "object") return false;
  if (!Array.isArray(calculus.history)) return false;
  if (!Array.isArray(calculus.current.exercises)) return false;
  if (!calculus.current.answersById || typeof calculus.current.answersById !== "object" || Array.isArray(calculus.current.answersById)) return false;
  if (!calculus.current.evaluationsById || typeof calculus.current.evaluationsById !== "object" || Array.isArray(calculus.current.evaluationsById)) return false;

  return true;
}

// ── 4.5 · Storage adapter (real localStorage, guarded) ──────────
//
// All methods wrapped in try/catch: handles private-mode, quota errors, SSR.
// Returns null on failure — callers must handle null explicitly.

const StorageAdapter = Object.freeze({
  async get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? { value: raw } : null;
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn("[LifeOS:storage] Write failed:", e?.name);
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

// ── 4.6 · Serialization ──────────────────────────────────────────
//
// Writes numeric schema version into the blob.
// UI state is intentionally never serialized.

const PERSISTENT_DOMAINS = Object.freeze([
  "xp", "quests", "streak", "achievements", "planner", "reflection", "energy", "rocketLeague", "appSettings", "wardrobe", "calculus"
]);

function serializeAppState(persistentState) {
  return JSON.stringify({
    _schema:  STORAGE_SCHEMA_VERSION,   // numeric version in blob
    _savedAt: new Date().toISOString(),
    ...Object.fromEntries(
      PERSISTENT_DOMAINS.map(k => [k, persistentState[k]])
    ),
  });
}

// ── 4.7 · Deserialization + migration + partial recovery ─────────
//
// Pipeline:
//   1. Parse JSON             → null on SyntaxError
//   2. Read _schema version   → null if missing or wrong type
//   3. Run migration chain    → null if any migration throws
//   4. Integrity validation   → deepMerge partial recovery on failure
//   5. Return clean snapshot  → consumed by hydrateStateAsync

function deserializeAppState(raw) {
  // Step 1: parse
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn("[LifeOS:deser] JSON parse failed — corrupted blob");
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;

  // Step 2: schema version gate
  const savedVersion = parsed._schema;
  if (typeof savedVersion !== "number" || !isFinite(savedVersion) || savedVersion < 1) {
    console.warn("[LifeOS:deser] Missing or invalid _schema — rejecting save");
    return null;
  }
  if (savedVersion > STORAGE_SCHEMA_VERSION) {
    console.warn(`[LifeOS:deser] Save is from future schema v${savedVersion} — rejecting`);
    return null;
  }

  // Strip metadata fields
  const { _schema, _savedAt, ...stateSlice } = parsed;

  // Step 3: migration chain (if saved version is behind current)
  let migratedSlice = stateSlice;
  if (savedVersion < STORAGE_SCHEMA_VERSION) {
    console.info(`[LifeOS:migrate] Upgrading schema v${savedVersion} → v${STORAGE_SCHEMA_VERSION}`);
    migratedSlice = migrateSnapshot(stateSlice, savedVersion);
    if (migratedSlice === null) {
      console.warn("[LifeOS:migrate] Migration failed — falling back to partial recovery");
      try {
        return deepMerge(PERSISTENT_INITIAL, stateSlice); // best-effort with old shape
      } catch {
        return null;
      }
    }
  }

  // Step 4: integrity validation → partial recovery on failure
  if (!validateSnapshotIntegrity(migratedSlice)) {
    console.warn("[LifeOS:validate] Integrity check failed — applying deepMerge partial recovery");
    try {
      const recovered = deepMerge(PERSISTENT_INITIAL, migratedSlice);
      // Second-pass validation on the merged result
      if (!validateSnapshotIntegrity(recovered)) {
        console.warn("[LifeOS:validate] Post-recovery validation also failed — booting fresh");
        return null;
      }
      return recovered;
    } catch {
      return null;
    }
  }

  return migratedSlice;
}


// ── 4.7b · Cloud state normalization ───────────────────────────
//
// Supabase stores the same persistent slice as JSONB. This helper keeps
// old / partial cloud snapshots safe by merging them into the local baseline.
function normalizeCloudState(cloudState) {
  if (!cloudState || typeof cloudState !== "object") return null;
  const clean = Object.fromEntries(
    PERSISTENT_DOMAINS
      .filter((k) => cloudState[k] !== undefined)
      .map((k) => [k, cloudState[k]])
  );
  return deepMerge(PERSISTENT_INITIAL, clean);
}

// ── 4.8 · Core persistence I/O (with retry) ─────────────────────
//
// persistStateAsync: up to `retries` attempts with exponential-ish backoff.
// hydrateStateAsync: single read — if storage unavailable, returns null.
// wipePersistedState: deletes stable key only.

async function persistStateAsync(persistentState, retries = 2) {
  const blob = serializeAppState(persistentState);

  for (let attempt = 0; attempt <= retries; attempt++) {
    const ok = await StorageAdapter.set(STORAGE_KEY, blob);
    if (ok) return true;

    if (attempt < retries) {
      // Linear backoff: 50ms, 100ms, ...
      await new Promise(r => setTimeout(r, 50 * (attempt + 1)));
      console.warn(`[LifeOS:persist] Write attempt ${attempt + 1} failed — retrying`);
    }
  }

  console.error(`[LifeOS:persist] All ${retries + 1} write attempts failed`);
  return false;
}

async function hydrateStateAsync() {
  try {
    const result = await StorageAdapter.get(STORAGE_KEY);
    if (!result) return null;
    return deserializeAppState(result.value);
  } catch {
    return null;
  }
}

async function wipePersistedState() {
  await StorageAdapter.delete(STORAGE_KEY);
}

// ── 4.9 · Debounce utility (no external dependency) ─────────────

function makeDebouncedSave(fn, ms) {
  let timer  = null;
  let latest = null; // always flush with the most recent arg

  return {
    trigger(arg) {
      latest = arg;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { fn(latest); timer = null; latest = null; }, ms);
    },
    flush(arg) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        fn(arg ?? latest ?? arg);
        latest = null;
      }
    },
    cancel() {
      if (timer) { clearTimeout(timer); timer = null; latest = null; }
    },
  };
}

// ── 4.10 · Persistence status tokens ────────────────────────────

const PERSIST_STATUS = Object.freeze({
  IDLE:     "idle",
  SAVING:   "saving",
  SAVED:    "saved",
  HYDRATED: "hydrated",
  ERROR:    "error",
});

// ─────────────────────────────────────────────────────────────────
// § 5 · STATE ARCHITECTURE
// ─────────────────────────────────────────────────────────────────

// ── 5a · Initial states ────────────────────────────────────────

const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

const PERSISTENT_INITIAL = {
  xp: {
    total:      0,
    dailyLog:   [],
  },
  quests: {
    completedIds: [],
    startedIds: [],
    dailyHistory: [],
    customItems: null,
    lastResetDate: getLifeOSDateKey(),
  },
  streak: {
    current:     0,
    best:        0,
    lastCheckin: null,
  },
  achievements: {
    unlockedIds: [],
  },
  planner: {
    swimPairIndex: 0,
    blenderMode:   "continue",
  },
  reflection: {
    current: {
      mood:       null,
      energy:     null,
      categories: [],
      journal:    "",
      saved:      false,
      date:       new Date().toDateString(),
    },
    history: [],
  },
  energy: {
    history: [],
  },
  rocketLeague: createRocketLeagueInitialState(),
  appSettings: createAppSettingsInitial(),
  wardrobe: createWardrobeInitial(),
  calculus: createCalculusInitialState(),
};

const UI_INITIAL = {
  view:              "dashboard",
  questFilter:       "all",
  toasts:            [],
  burstQuestId:      null,
  showNivelUp:       false,
  scheduleDay:       todayIdx,
  plannerDay:        todayIdx,
  plannerMode:       "timeline",
};

// ── 5b · Reducers ──────────────────────────────────────────────

function persistentReducer(state, action) {
  switch (action.type) {

    case AT.QUEST_COMPLETE: {
      const currentIds = Array.from(new Set(state.quests.completedIds || []));
      const alreadyDone = currentIds.includes(action.questId);
      const deltaXp = alreadyDone ? -action.xpGained : action.xpGained;
      const newCompletadasIds = alreadyDone
        ? currentIds.filter(id => id !== action.questId)
        : [...currentIds, action.questId];
      const newTotal = Math.max(0, state.xp.total + deltaXp);
      return {
        ...state,
        xp: {
          ...state.xp,
          total: newTotal,
          dailyLog: [...state.xp.dailyLog, { date: new Date().toISOString(), amount: deltaXp, questId: action.questId, action: alreadyDone ? "undo" : "complete" }],
        },
        quests: {
          ...state.quests,
          completedIds: newCompletadasIds,
          startedIds: alreadyDone ? (state.quests.startedIds || []) : Array.from(new Set([...(state.quests.startedIds || []), action.questId])),
        },
      };
    }



    case AT.QUEST_START: {
      const id = Number(action.questId);
      if (!Number.isFinite(id)) return state;
      const startedIds = Array.from(new Set([...(state.quests.startedIds || []), id]));
      return {
        ...state,
        quests: {
          ...state.quests,
          startedIds,
        },
      };
    }

    case AT.QUESTS_CUSTOM_UPDATE: {
      const items = sanitizeQuestItems(action.items);
      const validIds = new Set(items.map(q => q.id));
      return {
        ...state,
        quests: {
          ...state.quests,
          customItems: items,
          completedIds: (state.quests.completedIds || []).filter(id => validIds.has(id)),
          startedIds: (state.quests.startedIds || []).filter(id => validIds.has(id)),
        },
      };
    }

    case AT.QUESTS_DAILY_SYNC: {
      return applyDailyQuestReset(state, action.dateKey || getLifeOSDateKey());
    }

    case AT.RL_DAILY_SYNC: {
      const dateKey = action.dateKey || getRocketLeagueDateKey();
      const planId = action.planId || getRocketLeaguePlanForDate(dateKey).id;
      const current = state.rocketLeague?.current || createRocketLeagueCurrent(dateKey, planId);

      if (current.dateKey === dateKey && current.planId === planId) {
        return state;
      }

      const shouldArchive = hasRocketLeagueProgress(current);
      return {
        ...state,
        quests: {
          ...state.quests,
          completedIds: (state.quests.completedIds || []).filter(id => id !== ROCKET_LEAGUE_PARENT_QUEST_ID),
        },
        rocketLeague: {
          current: createRocketLeagueCurrent(dateKey, planId),
          history: shouldArchive
            ? [...(state.rocketLeague?.history || []), { ...current, archivedAt: new Date().toISOString() }].slice(-90)
            : (state.rocketLeague?.history || []),
        },
      };
    }

    case AT.RL_SUBTASK_TOGGLE: {
      const current = state.rocketLeague?.current || createRocketLeagueCurrent();
      const ids = Array.isArray(current.completedSubtaskIds) ? current.completedSubtaskIds : [];
      const exists = ids.includes(action.subtaskId);
      const elapsed = current.elapsedBySubtask || {};
      const matchCounts = current.matchCountBySubtask || {};
      const currentElapsed = Math.max(0, Math.floor(Number(elapsed[action.subtaskId]) || 0));
      const targetSeconds = getRocketLeagueSubtaskTargetSeconds(current.planId, action.subtaskId);
      const plan = getRocketLeaguePlanById(current.planId);
      const task = plan?.subtasks?.find(t => t.id === action.subtaskId);
      const targetCount = Math.max(0, Math.floor(Number(task?.targetCount) || 0));
      const nextElapsedBySubtask = exists || task?.noTimer
        ? elapsed
        : {
            ...elapsed,
            [action.subtaskId]: Math.max(currentElapsed, targetSeconds),
          };
      const nextMatchCountBySubtask = !targetCount
        ? matchCounts
        : {
            ...matchCounts,
            [action.subtaskId]: exists ? 0 : Math.max(Math.floor(Number(matchCounts[action.subtaskId]) || 0), targetCount),
          };
      return {
        ...state,
        rocketLeague: {
          ...(state.rocketLeague || createRocketLeagueInitialState()),
          current: {
            ...current,
            completedSubtaskIds: exists ? ids.filter(id => id !== action.subtaskId) : [...ids, action.subtaskId],
            elapsedBySubtask: nextElapsedBySubtask,
            matchCountBySubtask: nextMatchCountBySubtask,
          },
        },
      };
    }

    case AT.RL_TIMER_COMMIT: {
      const delta = Math.max(0, Math.floor(Number(action.secondsDelta) || 0));
      if (!action.subtaskId || delta <= 0) return state;
      const current = state.rocketLeague?.current || createRocketLeagueCurrent();
      const elapsed = current.elapsedBySubtask || {};
      return {
        ...state,
        rocketLeague: {
          ...(state.rocketLeague || createRocketLeagueInitialState()),
          current: {
            ...current,
            elapsedBySubtask: {
              ...elapsed,
              [action.subtaskId]: Math.max(0, Math.floor(Number(elapsed[action.subtaskId]) || 0)) + delta,
            },
          },
        },
      };
    }

    case AT.RL_MATCH_PROGRESS: {
      const delta = Math.floor(Number(action.delta) || 0);
      if (!action.subtaskId || delta === 0) return state;
      const current = state.rocketLeague?.current || createRocketLeagueCurrent();
      const plan = getRocketLeaguePlanById(current.planId);
      const task = plan?.subtasks?.find(t => t.id === action.subtaskId);
      const targetCount = Math.max(1, Math.floor(Number(task?.targetCount) || 1));
      const matchCounts = current.matchCountBySubtask || {};
      const ids = Array.isArray(current.completedSubtaskIds) ? current.completedSubtaskIds : [];
      const currentCount = Math.max(0, Math.floor(Number(matchCounts[action.subtaskId]) || 0));
      const nextCount = Math.min(targetCount, Math.max(0, currentCount + delta));
      const shouldComplete = nextCount >= targetCount;
      const nextIds = shouldComplete
        ? (ids.includes(action.subtaskId) ? ids : [...ids, action.subtaskId])
        : ids.filter(id => id !== action.subtaskId);
      return {
        ...state,
        rocketLeague: {
          ...(state.rocketLeague || createRocketLeagueInitialState()),
          current: {
            ...current,
            completedSubtaskIds: nextIds,
            matchCountBySubtask: {
              ...matchCounts,
              [action.subtaskId]: nextCount,
            },
          },
        },
      };
    }

    case AT.RL_SPEEDFLIP_DAR_SAVE: {
      const rocketLeague = state.rocketLeague || createRocketLeagueInitialState();
      const speedflipDar = rocketLeague.speedflipDar || createRocketLeagueInitialState().speedflipDar;
      const session = normalizeSpeedflipDarSession(action.session || {});
      const history = Array.isArray(speedflipDar.history) ? speedflipDar.history : [];
      return {
        ...state,
        rocketLeague: {
          ...rocketLeague,
          speedflipDar: {
            ...speedflipDar,
            dominantSide: session.side || speedflipDar.dominantSide || "DAR Derecho",
            history: [...history, session].slice(-40),
          },
        },
      };
    }

    case AT.RL_MENTAL_UPDATE: {
      const current = state.rocketLeague?.current || createRocketLeagueCurrent();
      const mental = current.mental || createRocketLeagueCurrent().mental;
      return {
        ...state,
        rocketLeague: {
          ...(state.rocketLeague || createRocketLeagueInitialState()),
          current: {
            ...current,
            mental: {
              ...mental,
              [action.key]: action.value,
              saved: false,
            },
          },
        },
      };
    }

    case AT.RL_MENTAL_SAVE: {
      const current = state.rocketLeague?.current || createRocketLeagueCurrent();
      const mental = current.mental || createRocketLeagueCurrent().mental;
      return {
        ...state,
        rocketLeague: {
          ...(state.rocketLeague || createRocketLeagueInitialState()),
          current: {
            ...current,
            mental: { ...mental, saved: true },
          },
        },
      };
    }

    case AT.REFLECTION_FIELD_UPDATE:
      return {
        ...state,
        reflection: {
          ...state.reflection,
          current: { ...state.reflection.current, [action.key]: action.value, saved: false },
        },
      };

    case AT.REFLECTION_TOGGLE_CATEGORY: {
      const cats = state.reflection.current.categories;
      const next = cats.includes(action.id) ? cats.filter(c => c !== action.id) : [...cats, action.id];
      return {
        ...state,
        reflection: {
          ...state.reflection,
          current: { ...state.reflection.current, categories: next, saved: false },
        },
      };
    }

    case AT.REFLECTION_SAVE:
      return {
        ...state,
        reflection: {
          current:  { ...state.reflection.current, saved: true },
          history:  [...state.reflection.history, { ...state.reflection.current, saved: true, date: new Date().toISOString() }],
        },
      };

    case AT.PLANNER_REGEN_SWIM:
      return {
        ...state,
        planner: { ...state.planner, swimPairIndex: (state.planner.swimPairIndex + 1) % SWIM_PAIRS.length },
      };

    case AT.PLANNER_SET_BLENDER:
      return { ...state, planner: { ...state.planner, blenderMode: action.mode } };

    case AT.CALC_DAILY_SYNC: {
      const dateKey = action.dateKey || getLifeOSDateKey();
      const plan = action.plan || getCalculusPlanForDate(dateKey);
      const planId = getCalculusPlanId(plan);
      const calculus = state.calculus || createCalculusInitialState();
      const current = calculus.current || createCalculusCurrent(dateKey, plan);
      if (current.dateKey === dateKey && current.planId === planId) return state;
      const shouldArchive = hasCalculusProgress(current);
      return {
        ...state,
        calculus: {
          ...calculus,
          current: createCalculusCurrent(dateKey, plan),
          history: shouldArchive
            ? [...(calculus.history || []), { ...current, archivedAt: new Date().toISOString() }].slice(-120)
            : (calculus.history || []),
        },
      };
    }

    case AT.CALC_SESSION_GENERATED: {
      const calculus = state.calculus || createCalculusInitialState();
      const current = calculus.current || createCalculusCurrent();
      const payload = normalizeCalculusPayload(action.payload || {}, getCalculusPlanForDate(current.dateKey));
      return {
        ...state,
        calculus: {
          ...calculus,
          current: {
            ...current,
            generatedAt: new Date().toISOString(),
            sessionTitle: payload.title,
            sessionInstructions: payload.instructions,
            sessionDifficulty: payload.difficulty,
            estimatedMinutes: payload.estimatedMinutes,
            exercises: payload.exercises,
            answersById: {},
            evaluationsById: {},
            saved: false,
          },
        },
      };
    }

    case AT.CALC_ANSWER_SAVE: {
      const calculus = state.calculus || createCalculusInitialState();
      const current = calculus.current || createCalculusCurrent();
      const exerciseId = String(action.exerciseId || "");
      if (!exerciseId) return state;
      const evaluation = action.evaluation && typeof action.evaluation === "object" ? action.evaluation : null;
      return {
        ...state,
        calculus: {
          ...calculus,
          current: {
            ...current,
            answersById: {
              ...(current.answersById || {}),
              [exerciseId]: { answer: String(action.answer || ""), savedAt: new Date().toISOString() },
            },
            evaluationsById: evaluation ? {
              ...(current.evaluationsById || {}),
              [exerciseId]: { ...evaluation, evaluatedAt: new Date().toISOString() },
            } : (current.evaluationsById || {}),
            lastErrorType: evaluation?.errorType || current.lastErrorType || null,
            saved: false,
          },
          errorBank: evaluation ? [
            ...(Array.isArray(calculus.errorBank) ? calculus.errorBank : []),
            {
              dateKey: current.dateKey,
              exerciseId,
              topic: current.exercises?.find?.(ex => ex.id === exerciseId)?.topic || current.topic || null,
              errorType: evaluation.errorType || "Sin categoría",
              score: Number(evaluation.score) || 0,
              correct: Boolean(evaluation.correct),
              savedAt: new Date().toISOString(),
            },
          ].slice(-200) : (calculus.errorBank || []),
        },
      };
    }

    case AT.CALC_FIELD_UPDATE: {
      const calculus = state.calculus || createCalculusInitialState();
      const current = calculus.current || createCalculusCurrent();
      return {
        ...state,
        calculus: {
          ...calculus,
          current: {
            ...current,
            [action.key]: action.value,
            saved: false,
          },
        },
      };
    }

    case AT.CALC_SETTINGS_UPDATE: {
      const calculus = state.calculus || createCalculusInitialState();
      return {
        ...state,
        calculus: {
          ...calculus,
          settings: {
            ...(calculus.settings || createCalculusInitialState().settings),
            ...(action.patch || {}),
          },
        },
      };
    }

    case AT.WARDROBE_PROFILE_UPDATE: {
      const wardrobe = state.wardrobe || createWardrobeInitial();
      return {
        ...state,
        wardrobe: {
          ...wardrobe,
          profile: {
            ...(wardrobe.profile || createWardrobeInitial().profile),
            ...(action.patch || {}),
          },
        },
      };
    }

    case AT.WARDROBE_ITEM_ADD: {
      const wardrobe = state.wardrobe || createWardrobeInitial();
      const item = sanitizeWardrobeItem({ ...(action.item || {}), id: Date.now() });
      if (!item) return state;
      return {
        ...state,
        wardrobe: {
          ...wardrobe,
          items: [...normalizeWardrobeItems(wardrobe.items), item].slice(0, 80),
        },
      };
    }

    case AT.WARDROBE_ITEM_UPDATE: {
      const wardrobe = state.wardrobe || createWardrobeInitial();
      const items = normalizeWardrobeItems(wardrobe.items).map(item => {
        if (item.id !== action.id) return item;
        return sanitizeWardrobeItem({ ...item, ...(action.patch || {}) }) || item;
      });
      return { ...state, wardrobe: { ...wardrobe, items } };
    }

    case AT.WARDROBE_OUTFIT_MARK: {
      const wardrobe = state.wardrobe || createWardrobeInitial();
      const entry = {
        date: new Date().toISOString(),
        weekKey: getScheduleWeekKey(),
        ...(action.entry || {}),
      };
      return {
        ...state,
        wardrobe: {
          ...wardrobe,
          history: [...(Array.isArray(wardrobe.history) ? wardrobe.history : []), entry].slice(-160),
        },
      };
    }

    case AT.WARDROBE_ITEM_DELETE: {
      const wardrobe = state.wardrobe || createWardrobeInitial();
      return {
        ...state,
        wardrobe: {
          ...wardrobe,
          items: normalizeWardrobeItems(wardrobe.items).filter(item => item.id !== action.id),
        },
      };
    }

    case AT.DOMAIN_RESET: {
      if (action.domain === "rocketLeague") return { ...state, rocketLeague: createRocketLeagueInitialState() };
      if (action.domain === "wardrobe") return { ...state, wardrobe: createWardrobeInitial() };
      if (action.domain === "calculus") return { ...state, calculus: createCalculusInitialState() };
      return state;
    }

    case AT.APP_SETTINGS_UPDATE: {
      const next = deepMerge(state.appSettings || createAppSettingsInitial(), action.patch || {});
      if (next.sound) persistAudioPrefs(next.sound);
      return { ...state, appSettings: next };
    }

    case AT.STATE_HYDRATE: {
      const hydrated = applyDailyQuestReset({ ...state, ...action.snapshot }, getLifeOSDateKey());
      if (hydrated.appSettings?.sound) persistAudioPrefs(hydrated.appSettings.sound);
      return hydrated;
    }

    default:
      return state;
  }
}

function uiReducer(state, action) {
  switch (action.type) {
    case AT.UI_SET_VIEW:            return { ...state, view: action.view };
    case AT.UI_SET_QUEST_FILTER:    return { ...state, questFilter: action.filter };
    case AT.UI_TOAST_ADD:           return { ...state, toasts: [...state.toasts, { id: action.id, msg: action.msg, sub: action.sub }] };
    case AT.UI_TOAST_REMOVE:        return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case AT.UI_SET_BURST:           return { ...state, burstQuestId: action.questId };
    case AT.UI_CLEAR_BURST:         return { ...state, burstQuestId: null };
    case AT.UI_SHOW_LEVELUP:        return { ...state, showNivelUp: true };
    case AT.UI_HIDE_LEVELUP:        return { ...state, showNivelUp: false };
    case AT.UI_SCHEDULE_SELECT_DAY: return { ...state, scheduleDay: action.day };
    case AT.UI_PLANNER_SELECT_DAY:  return { ...state, plannerDay: action.day };
    case AT.UI_PLANNER_SET_MODE:    return { ...state, plannerMode: action.mode };
    default:                        return state;
  }
}

// ─────────────────────────────────────────────────────────────────
// § 6 · SELECTORS — Formalized namespace + derived state layer
// ─────────────────────────────────────────────────────────────────
//
// All selectors are pure functions: (input) → derived value.
// They are memoized at consumption sites via useMemo.
// The SELECTORS namespace makes the derivation layer explicit and
// prevents selector logic from leaking into view components.

const SELECTORS = Object.freeze({
  // ── Progresoion ───────────────────────────────────────────────
  level:         levelFromXp,
  levelPct:      levelPctFromXp,
  levelXp:       levelXpFromXp,
  rank:          (level)    => RANK_NAMES[Math.min(level - 1, 9)],
  xpToNextNivel: xpToNextLevel,

  // ── Planner ───────────────────────────────────────────────────
  swimDays:      (pairIdx)  => SWIM_PAIRS[pairIdx % SWIM_PAIRS.length],

  // ── Quests ────────────────────────────────────────────────────
  completedSet:  (ids)      => new Set(ids),
  todayXp:       (completedIds, quests = QUESTS) =>
    quests.filter(q => completedIds.includes(q.id)).reduce((s, q) => s + q.xp, 0),
  completionRate:(completedIds, quests = QUESTS) =>
    Math.round((completedIds.length / Math.max(quests.length, 1)) * 100),
  missedQuests:  (completedIds, quests = QUESTS) =>
    quests.filter(q => !completedIds.includes(q.id)),

  // ── Reflection triggers ───────────────────────────────────────
  reflectionTriggers: (completedIds, streak, quests = QUESTS) => {
    const missed = quests.length - completedIds.length;
    const rate   = (completedIds.length / Math.max(quests.length, 1)) * 100;
    const out    = [];
    if (missed >= 3)  out.push({ type:"quests",  label:`${missed} quests incomplete`, severity:"medium" });
    if (rate < 40)    out.push({ type:"low_day", label:"Low completion day",           severity:"soft"   });
    if (streak < 2)   out.push({ type:"streak",  label:"Racha at risk",               severity:"soft"   });
    return out;
  },

  // ── Schedule / Load ───────────────────────────────────────────
  weekLoadData: (swimDays) =>
    DAY_NAMES.map((d, i) => {
      const s   = getScheduleBlocks(i, swimDays);
      const all = [...(s.main||[]), ...(s.morning||[]), ...(s.afternoon||[])];
      return { d, load: calcLoad(all.filter(b => b.type !== "BUFFER")), swim: swimDays.includes(i) ? 1 : 0 };
    }),

  // ── Racha health ─────────────────────────────────────────────
  streakHealth: (current, best) => ({
    isAtRisk:     current < 2,
    isOnFire:     current >= 3,
    isPeakRacha: current >= best && best > 0,
    pct:          Math.min(100, Math.round((current / Math.max(best, 7)) * 100)),
  }),
});

// ── Backward-compatible standalone aliases ────────────────────────
// Kept so existing view components don't need modification.
const selectNivel             = SELECTORS.level;
const selectNivelPct          = SELECTORS.levelPct;
const selectNivelXp           = SELECTORS.levelXp;
const selectRank              = SELECTORS.rank;
const selectSwimDays          = SELECTORS.swimDays;
const selectCompletadasSet      = SELECTORS.completedSet;
const selectTodayXp           = SELECTORS.todayXp;
const selectReflectionTriggers = SELECTORS.reflectionTriggers;
const selectWeekLoadData      = SELECTORS.weekLoadData;

// ─────────────────────────────────────────────────────────────────
// § 7 · CONTEXT (split: data vs UI → isolated rerenders)
// ─────────────────────────────────────────────────────────────────

const AppDataCtx = createContext(null);
const AppUICtx   = createContext(null);

const useAppData = () => useContext(AppDataCtx);
const useAppUI   = () => useContext(AppUICtx);

// ── useMobile — lightweight viewport hook ─────────────────────
function useMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth <= 640);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 640);
    window.addEventListener("resize", check, { passive:true });
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

// ── MOBILE NAVIGATION ──────────────────────────────────────────
const MOB_PRIMARY_ITEMS = [
  { id:"dashboard",    icon:Home,     label:"Hoy"      },
  { id:"quests",       icon:Target,   label:"Misiones" },
  { id:"rocketLeague", icon:Gamepad2, label:"Rocket"   },
  { id:"schedule",     icon:Calendar, label:"Horario"  },
];

const MOB_MORE_ITEMS = [
  { id:"focus",      icon:Timer,         label:"Sesión"    },
  { id:"wardrobe",   icon:Shirt,         label:"Clóset"    },
  { id:"blender",    icon:Layers,        label:"Blender"   },
  { id:"stats",      icon:BarChart2,     label:"Análisis"  },
  { id:"reflection", icon:MessageSquare, label:"Reflexión", accent:true },
  { id:"profile",    icon:User,          label:"Perfil"    },
  { id:"settings",   icon:Settings,      label:"Ajustes"   },
];

const MobileBottomNav = memo(function MobileBottomNav() {
  const { ui, uiDispatch } = useAppUI();
  const { persistent }     = useAppData();
  const [moreOpen, setMoreOpen] = useState(false);
  const activeQuests = useMemo(() => getActiveQuests(persistent), [persistent.quests.customItems]);
  const triggers = useMemo(
    () => SELECTORS.reflectionTriggers(persistent.quests.completedIds, persistent.streak.current, activeQuests),
    [persistent.quests.completedIds, persistent.streak.current, activeQuests]
  );
  const moreActive = MOB_MORE_ITEMS.some(n => n.id === ui.view);
  const handleNav = useCallback((id) => {
    unlockLifeOSAudio();
    if (ui.view !== id) playLifeOSSound("menu");
    uiDispatch(AC.setView(id));
    setMoreOpen(false);
  }, [ui.view, uiDispatch]);

  return (
    <>
      {moreOpen && <div className="mob-more-backdrop" onClick={() => setMoreOpen(false)}/>} 
      {moreOpen && (
        <div className="mob-more-panel">
          <div className="mob-more-title">Más herramientas</div>
          <div className="mob-more-grid">
            {MOB_MORE_ITEMS.map(n => {
              const I = n.icon;
              const on = ui.view === n.id;
              return (
                <button key={n.id} className={`mob-more-btn ${on ? "on" : ""}`} onClick={() => handleNav(n.id)}>
                  {n.accent && !on && triggers.length > 0 && <span className="mob-nav-dot"/>}
                  <I size={18}/>
                  <span>{n.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <nav className="mob-nav">
        {MOB_PRIMARY_ITEMS.map(n => {
          const I  = n.icon;
          const on = ui.view === n.id;
          return (
            <div key={n.id} className={`mob-nav-item ${on ? "on" : ""}`} onClick={() => handleNav(n.id)}>
              <I size={20}/>
              <span className="mob-nav-label">{n.label}</span>
            </div>
          );
        })}
        <div className={`mob-nav-item ${moreActive || moreOpen ? "on" : ""}`} onClick={() => { unlockLifeOSAudio(); playLifeOSSound("menu"); setMoreOpen(v => !v); }}>
          <Layers size={20}/>
          <span className="mob-nav-label">Más</span>
        </div>
      </nav>
    </>
  );
});

// ─────────────────────────────────────────────────────────────────
// § 8 · DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────

const T_COLOR = Object.freeze({
  brand:   "#7c3aed",
  cyan:    "#06b6d4",
  purple:  "#a78bfa",
  green:   "#34d399",
  yellow:  "#fbbf24",
  red:     "#f87171",
  orange:  "#fb923c",
  blue:    "#60a5fa",
  muted:   "#64748b",
  dimmer:  "#475569",
  darkest: "#374151",
  text:    "#eef2f8",
  subtext: "#8892a4",
  border:  "rgba(255,255,255,.07)",
  glass:   "rgba(255,255,255,.03)",
  glassMd: "rgba(255,255,255,.06)",
});

const T_RADIUS = Object.freeze({ sm:8, md:11, lg:14, xl:16, pill:100 });
const T_FONT   = Object.freeze({ display:"'Barlow',system-ui,sans-serif", body:"'Barlow',system-ui,sans-serif" });

const S = Object.freeze({
  flexCenter:   { display:"flex", alignItems:"center" },
  flexCol:      { display:"flex", flexDirection:"column" },
  glassBorder:  { background:T_COLOR.glass, border:`1px solid ${T_COLOR.border}` },
  sectionLabel: { fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:T_COLOR.darkest, marginBottom:11, display:"flex", alignItems:"center", gap:8 },
  cardValue:    { fontFamily:T_FONT.display, fontWeight:800, lineHeight:1 },
  chipBase:     { display:"flex", alignItems:"center", gap:6, padding:"5px 11px", borderRadius:T_RADIUS.pill, fontSize:12, fontWeight:600, cursor:"default", whiteSpace:"nowrap" },
  diffBase:     { fontSize:9, fontWeight:700, letterSpacing:1, padding:"2px 7px", borderRadius:T_RADIUS.pill, whiteSpace:"nowrap", marginTop:4 },
  ptitle:       { fontFamily:T_FONT.display, fontSize:23, fontWeight:800, color:T_COLOR.text, lineHeight:1.15, marginBottom:4 },
  psub:         { fontSize:13, color:T_COLOR.muted, marginBottom:22 },
  stitle:       { fontFamily:T_FONT.display, fontSize:16.5, fontWeight:800, color:T_COLOR.text, marginBottom:16 },
});

// ─────────────────────────────────────────────────────────────────
// § 9 · CSS
// ─────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.los{display:flex;height:100vh;width:100%;background:#050508;font-family:'Barlow',system-ui,sans-serif;color:#eef2f8;overflow:hidden;position:relative}
.orb1,.orb2{position:fixed;border-radius:50%;pointer-events:none;z-index:0}
.orb1{width:700px;height:700px;background:radial-gradient(circle,rgba(139,92,246,.09) 0%,transparent 65%);top:-280px;left:-180px;animation:orbF 10s ease-in-out infinite alternate}
.orb2{width:650px;height:650px;background:radial-gradient(circle,rgba(34,211,238,.07) 0%,transparent 65%);bottom:-220px;right:-180px;animation:orbF 12s ease-in-out infinite alternate-reverse}
.sb{width:220px;height:100vh;background:rgba(7,7,13,.97);border-right:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;flex-shrink:0;position:relative;z-index:10;padding:22px 14px;backdrop-filter:blur(24px)}
.sb-logo{display:flex;align-items:center;gap:10px;padding-bottom:22px;margin-bottom:18px;border-bottom:1px solid rgba(255,255,255,.06)}
.sb-icon{width:34px;height:34px;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 16px rgba(124,58,237,.4)}
.sb-name{font-family:'Barlow',system-ui,sans-serif;font-size:15px;font-weight:800;letter-spacing:.5px;background:linear-gradient(90deg,#f8fafc,#8892a4);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sb-ver{font-size:9px;font-weight:600;color:#22d3ee;letter-spacing:1.8px;text-transform:uppercase;margin-top:-2px}
.ni{display:flex;align-items:center;gap:11px;padding:10px 11px;border-radius:10px;cursor:pointer;transition:all .2s cubic-bezier(.34,1.56,.64,1);color:#64748b;font-size:13.5px;font-weight:500;border:1px solid transparent;margin-bottom:3px;position:relative;overflow:hidden;user-select:none}
.ni:hover{color:#eef2f8;transform:translateX(3px);background:rgba(255,255,255,.04)}
.ni.on{color:#eef2f8;background:rgba(124,58,237,.14);border-color:rgba(124,58,237,.3);box-shadow:0 0 28px rgba(124,58,237,.08)}
.ni-bar{position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:55%;background:linear-gradient(180deg,#7c3aed,#06b6d4);border-radius:0 3px 3px 0}
.ni span{flex:1}
.sb-footer{margin-top:auto;padding-top:18px;border-top:1px solid rgba(255,255,255,.06)}
.user-card{display:flex;align-items:center;gap:10px;padding:11px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:11px;cursor:pointer;transition:all .2s ease;animation:glowP 4s ease-in-out infinite}
.user-card:hover{background:rgba(255,255,255,.07);border-color:rgba(124,58,237,.35)}
.ava{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#7c3aed,#06b6d4);display:flex;align-items:center;justify-content:center;font-family:'Barlow',system-ui,sans-serif;font-size:13px;font-weight:800;color:white;flex-shrink:0;box-shadow:0 0 0 2px rgba(124,58,237,.5),0 0 14px rgba(124,58,237,.3)}
.los-main{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative;z-index:1}
.tb{padding:13px 24px;display:flex;align-items:center;gap:14px;border-bottom:1px solid rgba(255,255,255,.05);background:rgba(7,7,13,.85);backdrop-filter:blur(22px);flex-shrink:0}
.tb-greet{margin-right:auto}
.xp-track{flex:1;max-width:280px;height:5px;background:rgba(255,255,255,.08);border-radius:100px;overflow:hidden}
.xp-fill{height:100%;background:linear-gradient(90deg,#7c3aed,#06b6d4);border-radius:100px;transition:width .9s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden}
.xp-fill::after{content:'';position:absolute;top:0;right:0;width:14px;height:100%;background:rgba(255,255,255,.6);border-radius:100px;animation:shimD 2s ease-in-out infinite}
.ib{width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748b;transition:all .2s ease}
.ib:hover{color:#eef2f8;background:rgba(255,255,255,.09)}
.ca{flex:1;overflow-y:auto;padding:24px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.07) transparent}
.ca::-webkit-scrollbar{width:4px}
.ca::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:100px}
.g{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;backdrop-filter:blur(18px);transition:all .28s cubic-bezier(.34,1.56,.64,1)}
.g:hover{border-color:rgba(255,255,255,.13);transform:translateY(-2px);box-shadow:0 22px 60px rgba(0,0,0,.48)}
.s-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:20px}
.sc{padding:18px;position:relative;overflow:hidden}
.sc-icon{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;margin-bottom:13px}
.sc-val{font-family:'Barlow',system-ui,sans-serif;font-size:26px;font-weight:800;line-height:1;margin-bottom:4px}
.sc-lbl{font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:#64748b}
.sc-sub{font-size:11px;color:#8892a4;margin-top:3px}
.ql{display:flex;flex-direction:column;gap:9px}
.qi{display:flex;align-items:center;gap:13px;padding:13px 17px;border-radius:13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);cursor:pointer;transition:all .26s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden;user-select:none}
.qi::before{content:'';position:absolute;inset:0;background:var(--qa);opacity:0;transition:opacity .3s}
.qi:hover{border-color:rgba(255,255,255,.13);transform:translateX(5px)}
.qi:hover::before{opacity:.04}
.qi.done{opacity:.45;cursor:pointer}
.qi.pop{animation:pop .45s cubic-bezier(.34,1.56,.64,1)}
.qcheck{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .3s cubic-bezier(.34,1.56,.64,1)}
.qi-ico{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.q-xp{font-size:11px;font-weight:700;padding:3px 9px;border-radius:100px;letter-spacing:.3px;white-space:nowrap}
.diff{font-size:9px;font-weight:700;letter-spacing:1px;padding:2px 7px;border-radius:100px;white-space:nowrap;margin-top:4px}
.pt{height:6px;background:rgba(255,255,255,.07);border-radius:100px;overflow:hidden}
.pf{height:100%;border-radius:100px;transition:width .75s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden}
.pf::after{content:'';position:absolute;top:0;left:-100%;width:80px;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);animation:shim 2.2s ease-in-out infinite}
.ach-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}
.ac{padding:22px 16px;text-align:center;position:relative;overflow:hidden;cursor:default}
.ac.locked{opacity:.38;filter:grayscale(.9)}
.ac-ico{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 11px;position:relative}
.ac-ring::before{content:'';position:absolute;inset:-3px;border-radius:50%;background:conic-gradient(var(--glow) 0%,transparent 45%,var(--glow) 100%);animation:spin 5s linear infinite;opacity:0;transition:opacity .3s}
.ac:not(.locked):hover .ac-ring::before{opacity:.7}
.rtag{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:3px 9px;border-radius:100px;display:inline-block;margin-bottom:8px}
.toast{display:flex;align-items:center;gap:10px;padding:10px 15px;background:rgba(7,7,15,.97);border:1px solid rgba(124,58,237,.4);border-radius:11px;backdrop-filter:blur(22px);box-shadow:0 8px 36px rgba(0,0,0,.55);animation:tIn .38s cubic-bezier(.34,1.56,.64,1),tOut .3s ease 2.5s forwards;pointer-events:none}
.lvlup{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;background:rgba(5,5,8,.9);backdrop-filter:blur(14px);animation:fIn .3s ease}
.lvlup-box{text-align:center;padding:52px 68px;background:rgba(11,11,20,.97);border:1px solid rgba(251,191,36,.4);border-radius:22px;box-shadow:0 0 100px rgba(251,191,36,.12),0 40px 80px rgba(0,0,0,.5);animation:lvlPop .65s cubic-bezier(.34,1.56,.64,1)}
.sch-day-tabs{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap}
.sdt{padding:6px 14px;border-radius:100px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:#64748b;transition:all .22s ease;user-select:none;position:relative}
.sdt:hover{color:#c4ccd8;background:rgba(255,255,255,.06)}
.sdt.today{border-color:rgba(34,211,238,.35);color:#22d3ee;background:rgba(34,211,238,.07)}
.sdt.sel{border-color:rgba(124,58,237,.5);color:#a78bfa;background:rgba(124,58,237,.14)}
.sdt.swim-day::after{content:'🏊';position:absolute;top:-7px;right:-3px;font-size:9px;line-height:1}
.tl-wrap{display:flex;flex-direction:column;gap:2px}
.tl-buf{display:flex;align-items:center;gap:8px;padding:5px 6px 5px 14px;color:#374151;font-size:11px;min-height:30px;border-left:1px dashed rgba(255,255,255,.06);margin-left:42px}
.tl-block{display:flex;gap:10px;align-items:stretch;margin-bottom:2px}
.tl-time-col{width:40px;flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;padding-top:12px}
.tl-tval{font-size:10px;font-weight:600;color:#475569;font-variant-numeric:tabular-nums}
.tl-connector{width:1px;flex:1;background:rgba(255,255,255,.05);margin:4px auto 0;border-radius:1px}
.tl-card{flex:1;border-radius:0 11px 11px 0;padding:11px 14px;border:1px solid;border-left-width:3px;transition:all .2s cubic-bezier(.34,1.56,.64,1);cursor:default;position:relative;overflow:hidden}
.tl-card:hover{transform:translateX(4px)}
.tl-type-chip{font-size:9px;font-weight:700;letter-spacing:.8px;padding:2px 7px;border-radius:100px;white-space:nowrap;flex-shrink:0}
.tl-focus-tags{display:flex;gap:4px;flex-wrap:wrap;margin-top:7px}
.tl-ftag{font-size:9.5px;padding:2px 6px;border-radius:100px;background:rgba(255,255,255,.04);color:#475569;border:1px solid rgba(255,255,255,.05)}
.load-bar-wrap{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px}
.load-bar-track{flex:1;height:5px;background:rgba(255,255,255,.07);border-radius:100px;overflow:hidden}
.load-bar-fill{height:100%;border-radius:100px;transition:width .9s cubic-bezier(.34,1.56,.64,1)}
.swim-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:100px;font-size:11.5px;font-weight:700;background:rgba(96,165,250,.1);border:1px solid rgba(96,165,250,.28);color:#60a5fa;margin:2px}
.bm-toggle{display:flex;gap:5px;padding:4px;background:rgba(255,255,255,.03);border-radius:8px;border:1px solid rgba(255,255,255,.07)}
.bmt{flex:1;padding:6px 8px;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;text-align:center;border:none;transition:all .2s ease;color:#64748b;background:transparent;line-height:1.3}
.bmt.on{background:rgba(34,211,238,.13);color:#22d3ee;border:1px solid rgba(34,211,238,.28)}
.week-day-cell{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px;border-radius:9px;cursor:pointer;transition:all .2s ease;border:1px solid transparent;min-width:0;flex:1}
.week-day-cell.wdc-sel{background:rgba(124,58,237,.12);border-color:rgba(124,58,237,.3)}
.week-day-cell.wdc-today{border-color:rgba(34,211,238,.25)}
.wdc-name{font-size:10px;font-weight:700;color:#475569;letter-spacing:.5px;text-transform:uppercase}
.wdc-name.today{color:#22d3ee}.wdc-name.sel{color:#a78bfa}
.wdc-bar{height:3px;border-radius:100px;background:rgba(255,255,255,.07)}
.day-stat-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.day-stat-row:last-child{border-bottom:none}
.rf-banner{display:flex;align-items:flex-start;gap:14px;padding:18px 20px;border-radius:15px;margin-bottom:22px;position:relative;overflow:hidden;animation:rfIn .4s cubic-bezier(.34,1.56,.64,1)}
.rf-scale{display:flex;gap:7px}
.rf-scale-btn{flex:1;padding:10px 4px;border-radius:11px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);cursor:pointer;text-align:center;transition:all .22s cubic-bezier(.34,1.56,.64,1);user-select:none}
.rf-scale-btn:hover{transform:translateY(-2px)}
.rf-scale-btn.sel{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.4)}
.rf-cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:20px}
.rf-cat{padding:13px 11px;border-radius:12px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);cursor:pointer;text-align:center;transition:all .22s cubic-bezier(.34,1.56,.64,1);user-select:none;position:relative;overflow:hidden}
.rf-cat:hover{transform:translateY(-2px);background:rgba(255,255,255,.06)}
.rf-cat.sel{transform:translateY(-2px)}
.rf-cat-ico{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;transition:all .2s ease}
.rf-cat-label{font-size:11px;font-weight:600;color:#94a3b8;letter-spacing:.2px;transition:color .2s}
.rf-cat.sel .rf-cat-label{color:#eef2f8}
.rf-cat-desc{font-size:9.5px;color:#475569;margin-top:3px;line-height:1.4}
.rf-prompt{padding:18px 22px;border-radius:14px;border-left-width:3px;margin-bottom:18px;border-left-style:solid}
.rf-journal{width:100%;min-height:110px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px 16px;color:#c4ccd8;font-family:'Barlow',system-ui,sans-serif;font-size:13px;line-height:1.7;resize:none;outline:none;transition:border-color .2s,box-shadow .2s}
.rf-journal:focus{border-color:rgba(124,58,237,.35);box-shadow:0 0 0 3px rgba(124,58,237,.08)}
.rf-journal::placeholder{color:#374151}
.rf-rec{display:flex;align-items:flex-start;gap:13px;padding:15px 18px;border-radius:13px;border:1px solid;transition:all .22s ease}
.rf-rec:hover{transform:translateY(-2px)}
.rf-save{display:flex;align-items:center;gap:8px;padding:12px 24px;border-radius:11px;background:linear-gradient(135deg,rgba(124,58,237,.25),rgba(6,182,212,.18));border:1px solid rgba(124,58,237,.4);color:#a78bfa;font-size:13px;font-weight:700;cursor:pointer;transition:all .22s cubic-bezier(.34,1.56,.64,1);font-family:'Barlow',system-ui,sans-serif}
.rf-save:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,.25)}
.rf-saved{display:flex;align-items:center;gap:8px;padding:12px 24px;border-radius:11px;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.3);color:#34d399;font-size:13px;font-weight:700}
.rf-section{margin-bottom:20px}
.rf-workload{padding:16px 18px;border-radius:14px;background:rgba(34,211,238,.05);border:1px solid rgba(34,211,238,.14)}
.wp-strip{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:20px}
.wp-day{padding:14px 8px 11px;border-radius:13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);cursor:pointer;text-align:center;transition:all .24s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden;user-select:none;min-width:0}
.wp-day:hover{background:rgba(255,255,255,.07);transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.35)}
.wp-day.wp-today{border-color:rgba(34,211,238,.28);background:rgba(34,211,238,.05)}
.wp-day.wp-sel{border-color:rgba(124,58,237,.45);background:rgba(124,58,237,.1);box-shadow:0 8px 30px rgba(124,58,237,.14)}
.wp-day-name{font-size:9.5px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#475569;margin-bottom:7px}
.wp-day-name.wdn-today{color:#22d3ee}.wp-day-name.wdn-sel{color:#a78bfa}
.wp-load-num{font-family:'Barlow',system-ui,sans-serif;font-size:17px;font-weight:800;line-height:1;margin:3px 0 4px}
.wp-sys-dots{display:flex;gap:3px;justify-content:center;flex-wrap:wrap;margin-top:5px;min-height:10px}
.wp-sys-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.wp-today-ring{position:absolute;inset:-1px;border-radius:13px;border:1.5px solid rgba(34,211,238,.45);pointer-events:none;animation:wpRing 3s ease-in-out infinite}
.wp-mode-tabs{display:flex;gap:4px;padding:4px;background:rgba(255,255,255,.03);border-radius:9px;border:1px solid rgba(255,255,255,.07);margin-bottom:20px;width:fit-content}
.wp-mode-btn{padding:6px 16px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:none;color:#64748b;background:transparent;transition:all .2s ease;font-family:'Barlow',system-ui,sans-serif;letter-spacing:.2px}
.wp-mode-btn.on{background:rgba(124,58,237,.16);color:#a78bfa;border:1px solid rgba(124,58,237,.3)}
.wp-sys-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px}
.wp-sys-card{padding:16px 15px;border-radius:13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);position:relative;overflow:hidden;transition:all .22s cubic-bezier(.34,1.56,.64,1)}
.wp-sys-card:hover{border-color:rgba(255,255,255,.13);transform:translateY(-2px);box-shadow:0 16px 40px rgba(0,0,0,.4)}
.wp-sys-bar-track{height:4px;background:rgba(255,255,255,.07);border-radius:100px;overflow:hidden;margin:9px 0 6px}
.wp-sys-bar-fill{height:100%;border-radius:100px;transition:width .7s cubic-bezier(.34,1.56,.64,1)}
.wp-gauge-track{height:6px;background:rgba(255,255,255,.07);border-radius:100px;overflow:hidden;margin:8px 0}
.wp-gauge-fill{height:100%;border-radius:100px;transition:width 1s cubic-bezier(.34,1.56,.64,1)}
.wp-balance-row{display:flex;align-items:center;gap:9px;margin-bottom:8px}
.wp-balance-label{font-size:11px;color:#64748b;width:66px;flex-shrink:0;font-weight:500}
.wp-balance-track{flex:1;height:4px;background:rgba(255,255,255,.06);border-radius:100px;overflow:hidden}
.wp-balance-fill{height:100%;border-radius:100px;transition:width .8s cubic-bezier(.34,1.56,.64,1)}
.wp-balance-val{font-size:11px;font-weight:700;width:34px;text-align:right;flex-shrink:0;font-variant-numeric:tabular-nums}
.wp-intel-rec{display:flex;gap:10px;padding:12px 14px;border-radius:11px;border:1px solid;margin-bottom:8px;transition:all .2s ease}
.wp-intel-rec:last-child{margin-bottom:0}
.wp-intel-rec:hover{transform:translateX(3px)}
.wp-hm-cell{border-radius:4px;transition:all .18s ease;cursor:default}
.wp-hm-cell:hover{transform:scale(1.25);z-index:2;box-shadow:0 4px 14px rgba(0,0,0,.4)}
.wp-detail-panel{margin-bottom:18px;padding:18px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07)}
@keyframes orbF{0%{transform:translate(0,0) scale(1)}100%{transform:translate(28px,38px) scale(1.12)}}
@keyframes shim{0%{left:-100%}60%,100%{left:200%}}
@keyframes shimD{0%,100%{opacity:.35}50%{opacity:.85}}
@keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.045) translateX(5px)}100%{transform:scale(1) translateX(5px)}}
@keyframes tIn{from{opacity:0;transform:translateX(22px) scale(.94)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes tOut{from{opacity:1}to{opacity:0;transform:scale(.88) translateX(12px)}}
@keyframes fIn{from{opacity:0}to{opacity:1}}
@keyframes lvlPop{from{transform:scale(.72) rotate(-3deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
@keyframes glowP{0%,100%{box-shadow:0 0 0 2px rgba(124,58,237,.4),0 0 12px rgba(124,58,237,.2)}50%{box-shadow:0 0 0 2px rgba(124,58,237,.6),0 0 24px rgba(124,58,237,.4)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes sldIn{from{transform:translateX(-10px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes rfIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes rfSlideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
@keyframes wpRing{0%,100%{opacity:.45}50%{opacity:.85}}
@keyframes mobNavIn{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes tapFeedback{0%{transform:scale(1)}50%{transform:scale(.94)}100%{transform:scale(1)}}
.dash-main-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:18px}
.sch-main-grid{display:grid;grid-template-columns:1.45fr 1fr;gap:18px;align-items:start}
.planner-tl-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:18px;align-items:start}
.planner-hm-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:18px}
.planner-intel-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:18px}
.rf-main-grid{display:grid;grid-template-columns:1.35fr 1fr;gap:18px;align-items:start}
.profile-main-grid{display:grid;grid-template-columns:1fr 1.6fr;gap:18px;margin-bottom:18px}
.rl-main-grid{display:grid;grid-template-columns:1.35fr .9fr;gap:18px;align-items:start}
.rl-task-grid{display:grid;grid-template-columns:1fr;gap:10px}
.rl-chip-row{display:flex;gap:8px;flex-wrap:wrap}
.rl-task-card{padding:16px;border-radius:15px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.075);transition:all .22s ease}
.rl-task-card:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.14)}
	.rl-sticky-timer{position:sticky;top:12px;z-index:20;backdrop-filter:blur(22px)}
.mob-nav{display:none;position:fixed;bottom:0;left:0;right:0;z-index:200;background:rgba(5,5,10,.98);border-top:1px solid rgba(255,255,255,.07);padding:6px 8px calc(6px + env(safe-area-inset-bottom));backdrop-filter:blur(28px);animation:mobNavIn .32s cubic-bezier(.34,1.56,.64,1);overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.mob-nav::-webkit-scrollbar{display:none}
.mob-nav-item{flex:0 0 64px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:7px 2px 5px;border-radius:11px;cursor:pointer;transition:all .22s cubic-bezier(.34,1.56,.64,1);color:#4b5563;position:relative;min-height:48px;-webkit-tap-highlight-color:transparent;user-select:none}
.mob-nav-item.on{color:#a78bfa;background:rgba(167,139,250,.1)}
.mob-nav-item.on::before{content:'';position:absolute;top:-1px;left:50%;transform:translateX(-50%);width:26px;height:3px;background:linear-gradient(90deg,#7c3aed,#06b6d4);border-radius:0 0 3px 3px}
.mob-nav-item:active{animation:tapFeedback .18s ease;background:rgba(255,255,255,.06)}
.mob-nav-label{font-size:9px;font-weight:700;letter-spacing:.3px;line-height:1;transition:color .2s}
.mob-nav-dot{position:absolute;top:6px;right:calc(50% - 14px);width:7px;height:7px;border-radius:50%;background:#a78bfa;border:2px solid #050508;box-shadow:0 0 6px rgba(167,139,250,.8)}
.mob-more-backdrop{display:none;position:fixed;inset:0;z-index:210;background:rgba(0,0,0,.35);backdrop-filter:blur(6px)}
.mob-more-panel{display:none;position:fixed;left:12px;right:12px;bottom:78px;z-index:220;padding:14px;background:rgba(9,9,18,.98);border:1px solid rgba(255,255,255,.09);border-radius:18px;box-shadow:0 20px 70px rgba(0,0,0,.6);backdrop-filter:blur(28px);animation:mobNavIn .22s ease}
.mob-more-title{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;font-weight:900;margin:0 0 10px 2px}
.mob-more-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.mob-more-btn{position:relative;display:flex;align-items:center;gap:9px;min-height:44px;padding:10px 11px;border-radius:12px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.035);color:#94a3b8;font-family:'Barlow',system-ui,sans-serif;font-size:12px;font-weight:800;text-align:left}
.mob-more-btn.on{color:#c4b5fd;background:rgba(167,139,250,.14);border-color:rgba(167,139,250,.35)}
.wardrobe-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:18px;align-items:start}
.wardrobe-days{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media(max-width:860px){
  .sb{width:58px;padding:14px 8px}
  .sb-name,.sb-ver,.ni span,.user-info{display:none}
  .sb-logo{justify-content:center}
  .ni{justify-content:center;padding:10px}
  .s-grid{grid-template-columns:repeat(2,1fr)}
  .ach-grid{grid-template-columns:repeat(2,1fr)}
  .rf-cat-grid{grid-template-columns:repeat(2,1fr)}
  .wp-sys-grid{grid-template-columns:repeat(2,1fr)}
  .dash-main-grid,.sch-main-grid,.planner-tl-grid,.planner-hm-grid,.planner-intel-grid,.rf-main-grid,.profile-main-grid,.rl-main-grid,.wardrobe-grid{gap:14px}
}
@media(max-width:640px){
  .sb{display:none}
  .mob-nav{display:flex;justify-content:space-around;overflow-x:visible}
  .mob-nav-item{flex:1;max-width:88px}
  .mob-more-backdrop,.mob-more-panel{display:block}
  .mob-layout-grid{grid-template-columns:1fr!important}
  .mob-layout-grid input{width:100%;min-height:42px}
  .mob-layout-grid button{min-height:44px}
  .ca{padding:16px 14px 98px;overflow-x:hidden}
  .tb{padding:10px 14px;gap:8px}
  .tb-xp-track{display:none}
  .tb-xp-pct{display:none}
  .tb-level-chip{display:none}
  .dash-main-grid{grid-template-columns:1fr}
  .sch-main-grid{grid-template-columns:1fr}
  .planner-tl-grid{grid-template-columns:1fr}
  .planner-hm-grid{grid-template-columns:1fr}
  .planner-intel-grid{grid-template-columns:1fr}
  .rf-main-grid{grid-template-columns:1fr}
  .profile-main-grid{grid-template-columns:1fr}
  .rl-main-grid{grid-template-columns:1fr}
  .wardrobe-grid{grid-template-columns:1fr}
  .wardrobe-days{grid-template-columns:1fr}
	  .rl-sticky-timer{position:relative;top:auto}
  .s-grid{grid-template-columns:1fr 1fr}
  .ach-grid{grid-template-columns:1fr 1fr}
  .rf-cat-grid{grid-template-columns:1fr 1fr}
  .wp-sys-grid{grid-template-columns:1fr 1fr}
  .wp-strip{display:flex!important;overflow-x:auto;-webkit-overflow-scrolling:touch;gap:8px;padding-bottom:6px;scrollbar-width:none;-ms-overflow-style:none;grid-template-columns:unset!important}
  .wp-strip::-webkit-scrollbar{display:none}
  .wp-strip .wp-day{flex:0 0 72px;min-width:72px}
  .sch-day-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch;flex-wrap:nowrap;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:4px;gap:5px}
  .sch-day-tabs::-webkit-scrollbar{display:none}
  .sdt{white-space:nowrap;flex-shrink:0;padding:7px 12px;min-height:36px}
  .qi{padding:13px 13px;min-height:58px;-webkit-tap-highlight-color:transparent}
  .qi-ico{width:36px;height:36px;flex-shrink:0}
  .qcheck{width:28px;height:28px}
  .ni{min-height:44px}
  .rf-scale-btn{min-height:58px}
  .rf-cat{padding:12px 8px;min-height:80px}
  .rf-cat-ico{width:32px;height:32px}
  .rf-save,.rf-saved{min-height:48px;justify-content:center}
  .bmt{min-height:44px;font-size:11px}
  .wp-mode-btn{min-height:38px;padding:6px 12px}
  .week-day-cell{padding:7px 4px;min-height:52px}
  .sc{padding:14px}
  .sc-val{font-size:22px}
  .tl-card{border-radius:0 10px 10px 0}
  .mob-ptitle{font-size:19px!important}
  .mob-psub{font-size:12px!important;margin-bottom:16px!important}
  .hm-scroll-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
  .hm-scroll-wrap::-webkit-scrollbar{display:none}
  .hm-inner{min-width:380px}
  .quest-filter-row{overflow-x:auto;-webkit-overflow-scrolling:touch;flex-wrap:nowrap!important;scrollbar-width:none;padding-bottom:2px}
  .quest-filter-row::-webkit-scrollbar{display:none}
  .quest-filter-row button{flex-shrink:0!important;white-space:nowrap}
}
@media(max-width:390px){
  .ca{padding:12px 12px 88px}
  .s-grid{grid-template-columns:1fr 1fr}
  .rf-cat-grid{grid-template-columns:1fr 1fr}
  .sc-val{font-size:20px}
}
`;

// ─────────────────────────────────────────────────────────────────
// § 10 · SHARED UI PRIMITIVES (all memoized)
// ─────────────────────────────────────────────────────────────────

const StatCard = memo(function StatCard({ val, label, icon: Icon, accent, sub }) {
  return (
    <div className="g sc">
      <div style={{ position:"absolute", top:0, right:0, width:90, height:90, borderRadius:"50%",
        background:`radial-gradient(circle,${accent}20 0%,transparent 70%)`, transform:"translate(35px,-35px)", pointerEvents:"none" }}/>
      <div className="sc-icon" style={{ background:`${accent}18`, color:accent }}><Icon size={19}/></div>
      <div className="sc-val" style={{ color:accent }}>{val}</div>
      <div className="sc-lbl">{label}</div>
      {sub && <div className="sc-sub">{sub}</div>}
    </div>
  );
});

const DIFF_COLOR = { "FÁCIL":"#34d399", "MEDIO":"#fbbf24", "DIFÍCIL":"#f87171" };

const QuestItem = memo(function QuestItem({ q, completed, onComplete, isBurst }) {
  const Icon = q.icon;
  const dc   = DIFF_COLOR[q.diff];
  const roleMeta = getQuestRoleMeta(q);
  return (
    <div
      className={`qi ${completed ? "done" : ""} ${isBurst ? "pop" : ""}`}
      style={{ "--qa": q.accent }}
      onClick={() => onComplete(q)}
      title={completed ? "Click para desmarcar" : "Click para completar"}
    >
      <div className="qcheck" style={{ background: completed ? `${q.accent}22` : "rgba(255,255,255,.04)", border:`1.5px solid ${completed ? q.accent : "rgba(255,255,255,.1)"}`, color:q.accent }}>
        {completed
          ? <CheckCircle2 size={15} style={{ animation:"chkIn .4s cubic-bezier(.34,1.56,.64,1)" }}/>
          : <Circle size={15} style={{ opacity:.35 }}/>
        }
      </div>
      <div className="qi-ico" style={{ background:`${q.accent}14`, color:q.accent }}><Icon size={19}/></div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13.5, fontWeight:600, color:completed ? "#374151" : "#eef2f8", marginBottom:1, transition:"color .3s" }}>{q.title}</div>
        <div style={{ fontSize:11.5, color:"#64748b" }}>{q.sub}</div>
        {(q.link || (Array.isArray(q.links) && q.links.length > 0)) && (
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:7 }}>
            {(Array.isArray(q.links) && q.links.length > 0 ? q.links : [{ label:q.linkLabel || "Abrir página", url:q.link }]).map((lnk, idx) => (
              <a
                key={`${q.id}-link-${idx}`}
                href={lnk.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display:"inline-flex",
                  alignItems:"center",
                  gap:4,
                  width:"fit-content",
                  maxWidth:"100%",
                  padding:"4px 7px",
                  borderRadius:8,
                  border:`1px solid ${q.accent}35`,
                  background:`${q.accent}10`,
                  color:q.accent,
                  fontSize:10.5,
                  fontWeight:800,
                  textDecoration:"none",
                }}
              >
                {lnk.label || q.linkLabel || "Abrir página"} <ArrowRight size={10}/>
              </a>
            ))}
          </div>
        )}
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0 }}>
        <div className="q-xp" style={{ background:`${q.accent}14`, color:q.accent, border:`1px solid ${q.accent}28` }}>+{q.xp} XP</div>
        <div className="diff" style={{ background:`${roleMeta.color}12`, color:roleMeta.color, border:`1px solid ${roleMeta.color}25` }}>{roleMeta.label}</div>
        <div className="diff" style={{ background:`${dc}12`, color:dc, border:`1px solid ${dc}25` }}>{q.diff}</div>
      </div>
    </div>
  );
});

const TimelineBlock = memo(function TimelineBlock({ block, showConnector, completed = false, onComplete }) {
  const type = ACT_TYPES[block.type] || ACT_TYPES.SKILL;
  const canComplete = Boolean(block.quest && typeof onComplete === "function");
  if (block.type === "BUFFER") {
    return (
      <div className="tl-buf" style={{ minHeight: block.duration >= 15 ? 34 : 26 }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:"rgba(255,255,255,.07)", flexShrink:0 }}/>
        <span>
          <span style={{ fontVariantNumeric:"tabular-nums", marginRight:4 }}>{fmt(block.startMin)}</span>
          <span style={{ margin:"0 4px", color:"#2d3748" }}>·</span>
          <span style={{ margin:"0 4px", color:"#374151" }}>{block.duration}min</span>
          <span style={{ color:"#2d3748" }}>·</span>
          <span style={{ marginLeft:4, color:"#374151" }}>{block.desc}</span>
        </span>
      </div>
    );
  }
  const blockH = Math.max(52, block.duration * 1.6);
  return (
    <div className="tl-block">
      <div className="tl-time-col">
        <div className="tl-tval">{fmt(block.startMin)}</div>
        {showConnector && <div className="tl-connector"/>}
      </div>
      <div className="tl-card" style={{ minHeight:blockH, background:type.bg, borderColor:`${type.color}20`, borderLeftColor:type.color }}>
        <div style={{ position:"absolute", top:0, right:0, width:80, height:80, borderRadius:"50%",
          background:`radial-gradient(circle,${type.color}15 0%,transparent 70%)`, transform:"translate(30px,-30px)", pointerEvents:"none" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:3, position:"relative" }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#eef2f8", lineHeight:1.3 }}>{block.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
            <div className="tl-type-chip" style={{ background:`${type.color}14`, color:type.color, border:`1px solid ${type.color}22`, marginTop:1 }}>{type.label}</div>
            {canComplete && (
              <button
                onClick={(e) => { e.stopPropagation(); onComplete(block.quest); }}
                style={{
                  width:28,
                  height:28,
                  borderRadius:9,
                  border:`1px solid ${completed ? type.color : "rgba(255,255,255,.1)"}`,
                  background:completed ? `${type.color}18` : "rgba(255,255,255,.04)",
                  color:completed ? type.color : "#64748b",
                  cursor:"pointer",
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                }}
                title={completed ? "Desmarcar misión" : "Completar misión"}
              >
                {completed ? <CheckCircle2 size={15}/> : <Circle size={15}/>} 
              </button>
            )}
          </div>
        </div>
        <div style={{ fontSize:11, color:"#64748b", position:"relative" }}>
          <span style={{ fontWeight:600, color:"#4b5563" }}>{fmtDur(block.duration)}</span>
          <span style={{ margin:"0 5px", color:"#2d3748" }}>·</span>
          <span>{block.desc}</span>
        </div>
        {block.focus && (
          <div className="tl-focus-tags">
            {block.focus.map(f => <span key={f} className="tl-ftag">{f}</span>)}
          </div>
        )}
      </div>
    </div>
  );
});

const ProgresoBar = memo(function ProgresoBar({ pct, gradient, height = 6 }) {
  return (
    <div className="pt" style={{ height }}>
      <div className="pf" style={{ width:`${pct}%`, background:gradient }}/>
    </div>
  );
});

const ToastItem = memo(function ToastItem({ msg, sub }) {
  return (
    <div className="toast">
      <div style={{ width:28, height:28, borderRadius:8, background:"rgba(124,58,237,.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Zap size={14} color="#a78bfa"/>
      </div>
      <div>
        <div style={{ fontSize:13, fontWeight:700, color:"#a78bfa" }}>{msg}</div>
        <div style={{ fontSize:11, color:"#64748b" }}>{sub}</div>
      </div>
    </div>
  );
});

function buildXpHistoryData(dailyLog = [], days = 30) {
  const now = new Date();
  const byDate = new Map();
  (Array.isArray(dailyLog) ? dailyLog : []).forEach((entry) => {
    if (!entry?.date) return;
    const key = new Date(entry.date).toISOString().slice(0, 10);
    byDate.set(key, (byDate.get(key) || 0) + (Number(entry.amount) || 0));
  });
  return Array.from({ length: days }, (_, idx) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (days - 1 - idx));
    const key = d.toISOString().slice(0, 10);
    const label = days <= 7 ? DAY_NAMES[(d.getDay() + 6) % 7] : String(d.getDate());
    return { d: label, key, xp: Math.round(byDate.get(key) || 0) };
  });
}

function buildRecentQuestEvents(dailyLog = [], quests = QUESTS, limit = 10) {
  const questMap = new Map((quests || QUESTS).map(q => [q.id, q]));
  return (Array.isArray(dailyLog) ? dailyLog : [])
    .filter(e => e && typeof e.questId === "number")
    .slice(-limit)
    .reverse()
    .map(e => ({
      ...e,
      quest: questMap.get(e.questId),
      when: e.date ? new Date(e.date).toLocaleString([], { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" }) : "—",
    }));
}

// ─────────────────────────────────────────────────────────────────
// § 11 · DOMAIN VIEWS
// ─────────────────────────────────────────────────────────────────

function DashboardView() {
  const { persistent, pDispatch } = useAppData();
  const { ui, uiDispatch } = useAppUI();

  const activeQuests = useMemo(() => getActiveQuests(persistent), [persistent.quests.customItems]);
  const completedSet = useMemo(() => SELECTORS.completedSet(persistent.quests.completedIds), [persistent.quests.completedIds]);
  const level        = useMemo(() => SELECTORS.level(persistent.xp.total),     [persistent.xp.total]);
  const todayXp      = useMemo(() => SELECTORS.todayXp(persistent.quests.completedIds, activeQuests), [persistent.quests.completedIds, activeQuests]);
  const missedRisk   = useMemo(() => calculateMissedQuestPenalty(persistent, persistent.quests.completedIds), [persistent, persistent.quests.completedIds]);
  const todayKey     = getLifeOSDateKey();
  const dayMode      = getLifeOSDayMode(persistent, todayKey);
  const isRestToday  = dayMode === "rest";
  const isLowEnergy  = dayMode === "lowEnergy";
  const pct = completedSet.size / Math.max(activeQuests.length, 1) * 100;
  const lastPenalty  = persistent.quests?.lastPenalty;

  const scheduleBlocks = useMemo(() => {
    const weekKey = getScheduleWeekKey();
    const idx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const sched = getScheduleBlocks(idx, [], activeQuests, weekKey);
    return [...(sched.main || []), ...(sched.morning || []), ...(sched.afternoon || [])]
      .filter(b => b.type !== "BUFFER")
      .sort((a,b) => (a.startMin || 0) - (b.startMin || 0));
  }, [activeQuests]);

  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const nextBlock = scheduleBlocks.find(b => (b.endMin || 0) >= nowMin && !completedSet.has(b.questId)) || scheduleBlocks.find(b => b.questId && !completedSet.has(b.questId)) || scheduleBlocks[0];
  const nextQuest = nextBlock?.quest || activeQuests.find(q => !completedSet.has(q.id)) || activeQuests[0];
  const calcPlan = useMemo(() => getCalculusPlanForDate(todayKey), [todayKey]);
  const rocketPlan = useMemo(() => getRocketLeaguePlanForDate(todayKey), [todayKey]);
  const wardrobeWeek = useMemo(() => buildWardrobeWeek(persistent.wardrobe || createWardrobeInitial(), getScheduleWeekKey()), [persistent.wardrobe]);
  const todayOutfit = wardrobeWeek[(new Date().getDay() + 6) % 7];

  const setDayMode = useCallback((mode) => {
    const entry = mode === "normal"
      ? { enabled:false, mode:"normal", reason:"Día normal", createdAt:new Date().toISOString() }
      : { enabled:true, mode, reason: mode === "rest" ? "Descanso planificado" : "Modo bajo energía", createdAt:new Date().toISOString() };
    pDispatch(AC.appSettingsUpdate({ restDays:{ [todayKey]: entry } }));
  }, [pDispatch, todayKey]);

  const handleQuestComplete = useCallback((q) => {
    if (q.id === ROCKET_LEAGUE_PARENT_QUEST_ID) {
      const id = Date.now();
      unlockLifeOSAudio();
      playLifeOSSound("menu");
      uiDispatch(AC.setView("rocketLeague"));
      uiDispatch(AC.toastAdd(id, "Abrí Rocket League", "Completá los 90 min; ranked queda opcional"));
      setTimeout(() => uiDispatch(AC.toastRemove(id)), 2700);
      return;
    }
    const wasCompleted = completedSet.has(q.id);
    unlockLifeOSAudio();
    if (!wasCompleted) playLifeOSSound("complete");
    const deltaXp = wasCompleted ? -q.xp : q.xp;
    const oldNivel = SELECTORS.level(persistent.xp.total);
    pDispatch(AC.questComplete(q.id, q.xp, oldNivel));
    const id = Date.now();
    uiDispatch(AC.setBurst(q.id));
    uiDispatch(AC.toastAdd(id, `${deltaXp > 0 ? "+" : ""}${deltaXp} XP`, wasCompleted ? `Desmarcado · ${q.title}` : q.title));
    setTimeout(() => uiDispatch(AC.clearBurst()), 900);
    setTimeout(() => uiDispatch(AC.toastRemove(id)), 2900);
  }, [completedSet, persistent.xp.total, pDispatch, uiDispatch]);

  const missionGroups = useMemo(() => {
    const byRole = { mandatory:[], training:[], optional:[], rest:[] };
    activeQuests.forEach(q => (byRole[getQuestRole(q)] || byRole.optional).push(q));
    return byRole;
  }, [activeQuests]);

  return (
    <div style={{ animation:"sldIn .3s ease" }}>
      <div style={S.ptitle} className="mob-ptitle">Hoy</div>
      <div style={S.psub} className="mob-psub">Centro diario · {completedSet.size}/{activeQuests.length} misiones · {todayXp} XP ganados · -{missedRisk.missedXp} XP en riesgo</div>

      <div className="s-grid">
        <StatCard val={`Lv.${level}`} label="Nivel" icon={Crown} accent="#fbbf24" sub={SELECTORS.rank(level)}/>
        <StatCard val={todayXp} label="XP hoy" icon={Zap} accent="#a78bfa"/>
        <StatCard val={`${Math.round(pct)}%`} label="Día" icon={Target} accent={pct >= 70 ? "#34d399" : "#22d3ee"} sub={`${completedSet.size}/${activeQuests.length}`}/>
        <StatCard val={`-${missedRisk.missedXp}`} label="XP en riesgo" icon={AlertTriangle} accent={missedRisk.missedXp > 0 ? "#f87171" : "#34d399"} sub={isLowEnergy ? "modo bajo energía" : missedRisk.missedXp ? `${missedRisk.missedQuests.length} pendientes` : "seguro"}/>
      </div>

      <section className="g" style={{ padding:18, marginBottom:16, background:"linear-gradient(135deg,rgba(34,211,238,.10),rgba(124,58,237,.055))", borderColor:"rgba(34,211,238,.18)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1.2fr) minmax(240px,.8fr)", gap:16 }} className="mob-layout-grid">
          <div>
            <div style={{ fontSize:11, color:"#22d3ee", textTransform:"uppercase", letterSpacing:1, fontWeight:900, marginBottom:6 }}>Siguiente acción</div>
            <div style={{ fontSize:21, fontWeight:900, color:T_COLOR.text, lineHeight:1.15 }}>{nextBlock?.title || nextQuest?.title || "Día libre"}</div>
            <div style={{ marginTop:7, color:T_COLOR.muted, fontSize:12, lineHeight:1.55 }}>
              {nextBlock?.startMin !== undefined ? `${fmt(nextBlock.startMin)}–${fmt(nextBlock.endMin)} · ` : ""}{nextBlock?.desc || nextQuest?.sub || "No hay tareas pendientes."}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:13 }}>
              <button onClick={() => { unlockLifeOSAudio(); playLifeOSSound("menu"); uiDispatch(AC.setView(nextQuest?.id === 1 ? "schedule" : nextQuest?.id === ROCKET_LEAGUE_PARENT_QUEST_ID ? "rocketLeague" : "focus")); }} style={{ border:"1px solid rgba(34,211,238,.28)", background:"rgba(34,211,238,.10)", color:"#22d3ee", borderRadius:11, padding:"10px 13px", fontWeight:900, cursor:"pointer" }}>Empezar ahora</button>
              {nextQuest && <button onClick={() => handleQuestComplete(nextQuest)} style={{ border:"1px solid rgba(52,211,153,.25)", background:"rgba(52,211,153,.09)", color:"#34d399", borderRadius:11, padding:"10px 13px", fontWeight:900, cursor:"pointer" }}>Completar</button>}
            </div>
          </div>
          <div style={{ display:"grid", gap:8 }}>
            <div style={{ padding:11, borderRadius:13, background:"rgba(96,165,250,.08)", border:"1px solid rgba(96,165,250,.16)" }}><b style={{ color:"#93c5fd" }}>Cálculo:</b> <span style={{ color:T_COLOR.muted }}>8:10–9:45 · bloque externo · marcar al terminar</span></div>
            <div style={{ padding:11, borderRadius:13, background:"rgba(34,211,238,.08)", border:"1px solid rgba(34,211,238,.16)" }}><b style={{ color:"#67e8f9" }}>Rocket:</b> <span style={{ color:T_COLOR.muted }}>{rocketPlan.focus || rocketPlan.title}</span></div>
            {todayOutfit && <div style={{ padding:11, borderRadius:13, background:"rgba(251,191,36,.07)", border:"1px solid rgba(251,191,36,.15)" }}><b style={{ color:"#fbbf24" }}>Outfit:</b> <span style={{ color:T_COLOR.muted }}>{todayOutfit.title}</span></div>}
          </div>
        </div>
      </section>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"13px 16px", marginBottom:18, borderRadius:13, background:isRestToday ? "rgba(52,211,153,.075)" : isLowEnergy ? "rgba(251,191,36,.075)" : "rgba(255,255,255,.035)", border:`1px solid ${isRestToday ? "rgba(52,211,153,.2)" : isLowEnergy ? "rgba(251,191,36,.2)" : "rgba(255,255,255,.08)"}` }}>
        <div>
          <div style={{ fontSize:13, fontWeight:900, color:isRestToday ? "#34d399" : isLowEnergy ? "#fbbf24" : T_COLOR.text }}>{isRestToday ? "Hoy es descanso" : isLowEnergy ? "Modo bajo energía" : "Día normal"}</div>
          <div style={{ fontSize:11.5, color:T_COLOR.muted }}>{isLowEnergy ? "Las misiones pendientes pierden mucho menos XP. Hacé la versión mínima y salvá el día." : "Usá descanso solo cuando de verdad no podás trabajar."}</div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
          <button onClick={() => setDayMode(isLowEnergy ? "normal" : "lowEnergy")} style={{ border:"1px solid rgba(251,191,36,.25)", background:isLowEnergy ? "rgba(251,191,36,.14)" : "rgba(251,191,36,.06)", color:"#fbbf24", borderRadius:10, padding:"9px 12px", fontWeight:900, cursor:"pointer" }}>{isLowEnergy ? "Quitar bajo energía" : "Modo bajo energía"}</button>
          <button onClick={() => setDayMode(isRestToday ? "normal" : "rest")} style={{ border:"1px solid rgba(52,211,153,.25)", background:isRestToday ? "rgba(52,211,153,.14)" : "rgba(52,211,153,.06)", color:"#34d399", borderRadius:10, padding:"9px 12px", fontWeight:900, cursor:"pointer" }}>{isRestToday ? "Quitar descanso" : "Marcar descanso"}</button>
        </div>
      </div>

      {lastPenalty?.penaltyXp > 0 && (
        <div style={{ display:"flex", alignItems:"center", gap:13, padding:"13px 16px", marginBottom:18, borderRadius:13, background:"rgba(248,113,113,.075)", border:"1px solid rgba(248,113,113,.2)" }}>
          <AlertTriangle size={18} color="#f87171"/><div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:900, color:"#f87171" }}>Castigo aplicado al reset diario</div><div style={{ fontSize:11.5, color:T_COLOR.muted }}>Ayer quedaron {lastPenalty.missedCount} misiones sin completar · -{lastPenalty.penaltyXp} XP</div></div>
        </div>
      )}

      <div className="dash-main-grid">
        <div className="g" style={{ padding:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}><div style={{ ...S.stitle, marginBottom:0 }}>Misiones por prioridad</div><div style={{ fontSize:11.5, color:"#64748b", fontWeight:600 }}>{completedSet.size}/{activeQuests.length}</div></div>
          <ProgresoBar pct={pct} gradient="linear-gradient(90deg,#7c3aed,#06b6d4)"/>
          <div style={{ display:"grid", gap:13, marginTop:16 }}>
            {[
              ["mandatory", "Obligatorias"],
              ["training", "Entrenamiento"],
              ["optional", "Opcionales"],
            ].map(([role,label]) => missionGroups[role]?.length > 0 && (
              <div key={role}>
                <div style={{ fontSize:10.5, color:getQuestRoleMeta({ role }).color, fontWeight:900, textTransform:"uppercase", letterSpacing:1, margin:"0 0 7px 4px" }}>{label}</div>
                <div className="ql">{missionGroups[role].map(q => <QuestItem key={q.id} q={q} completed={completedSet.has(q.id)} onComplete={handleQuestComplete} isBurst={ui.burstQuestId === q.id}/>)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:15 }}>
          <div className="g" style={{ padding:18 }}>
            <div style={S.stitle}>Ruta mínima si estás cansado</div>
            <div style={{ color:T_COLOR.muted, fontSize:12, lineHeight:1.6, marginBottom:12 }}>No abandones todo: Cálculo externo 20 min, Rocket solo freeplay + 1v1, reflexión 2 min. El modo bajo energía reduce el castigo.</div>
            <button onClick={() => setDayMode("lowEnergy")} style={{ border:"1px solid rgba(251,191,36,.25)", background:"rgba(251,191,36,.08)", color:"#fbbf24", borderRadius:10, padding:"10px 12px", fontWeight:900, cursor:"pointer" }}>Activar bajo energía</button>
          </div>
          <div className="g" style={{ padding:18 }}>
            <div style={S.stitle}>Atajos</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[ ["schedule", "Horario"], ["rocketLeague", "Rocket"], ["blender", "Blender"], ["wardrobe", "Clóset"], ["stats", "Análisis"] ].map(([view,label]) => <button key={view} onClick={() => uiDispatch(AC.setView(view))} style={{ border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.04)", color:T_COLOR.text, borderRadius:10, padding:"10px 9px", fontWeight:900, cursor:"pointer" }}>{label}</button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalculusTrainerView() {
  const { persistent, pDispatch } = useAppData();
  const { uiDispatch } = useAppUI();
  const dateKey = getLifeOSDateKey();
  const plan = useMemo(() => getCalculusPlanForDate(dateKey), [dateKey]);
  const calculus = persistent.calculus || createCalculusInitialState();
  const current = calculus.current || createCalculusCurrent(dateKey, plan);
  const adaptiveMode = useMemo(() => getCalculusAdaptiveMode(plan, calculus), [plan, calculus]);
  const [loading, setLoading] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState(null);
  const [error, setError] = useState("");
  const [answerDrafts, setAnswerDrafts] = useState({});

  useEffect(() => {
    pDispatch(AC.calcDailySync(dateKey, plan));
  }, [dateKey, plan.topic, plan.mode, pDispatch]);

  useEffect(() => {
    setAnswerDrafts(Object.fromEntries(Object.entries(current.answersById || {}).map(([id, v]) => [id, v?.answer || ""])));
  }, [current.dateKey, current.generatedAt]);

  const generated = Array.isArray(current.exercises) && current.exercises.length > 0;
  const evaluatedCount = Object.keys(current.evaluationsById || {}).length;
  const scoreValues = Object.values(current.evaluationsById || {}).map(e => Number(e.score)).filter(n => Number.isFinite(n));
  const avgScore = scoreValues.length ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) : null;
  const weakTopics = useMemo(() => getCalculusWeakTopics(calculus), [calculus]);
  const examModeOn = Boolean(calculus.settings?.examMode || String(plan.mode || "").toLowerCase().includes("examen") || String(plan.mode || "").toLowerCase().includes("simulación"));
  const videoRecommendations = useMemo(() => getCalculusVideoRecommendations(plan), [plan]);
  const pinnedToday = useMemo(() => getCalculusPinnedPracticeForDate(dateKey), [dateKey]);

  const generatePractice = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const pinned = getCalculusPinnedPracticeForDate(dateKey);
      if (pinned) {
        pDispatch(AC.calcSessionGenerated({ ...pinned, meta: { source: "PDF guardado del día", dateKey, pinned: true } }));
        uiDispatch(AC.toastAdd(Date.now(), "Práctica fijada cargada", "Mismos ejercicios del PDF de hoy · sin gastar API"));
        playLifeOSSound("complete");
        return;
      }
      const res = await fetch("/api/generate-calculus-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateKey,
          plan,
          adaptiveMode,
          settings: calculus.settings || {},
          recentHistory: getCalculusRecentHistory(calculus),
          weakTopics: getCalculusWeakTopics(calculus),
          seenTopics: Array.isArray(plan.reviewTopics) ? plan.reviewTopics : getCalculusSeenTopicsUntil(dateKey, true).map(item => item.topic),
          cumulativeReview: Boolean(plan.cumulativeReview),
          examMode: Boolean(calculus.settings?.examMode || String(plan.mode || "").toLowerCase().includes("examen") || String(plan.mode || "").toLowerCase().includes("simulación") || String(plan.mode || "").toLowerCase().includes("parcial")),
          profile: {
            course: "MM201 Cálculo I",
            source: CALCULUS_SOURCE_LABEL,
            studyWindow: "8:10 AM–9:45 AM",
            instruction: "Generar ejercicios originales, no resolverlos en el enunciado.",
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "No se pudo generar la práctica.");
      pDispatch(AC.calcSessionGenerated(data));
      uiDispatch(AC.toastAdd(Date.now(), "Práctica de Cálculo lista", plan.topic));
      playLifeOSSound("complete");
    } catch (err) {
      setError(err?.message || "Error generando ejercicios.");
    } finally {
      setLoading(false);
    }
  }, [dateKey, plan, adaptiveMode, calculus, pDispatch, uiDispatch]);

  const evaluateExercise = useCallback(async (exercise) => {
    const answer = String(answerDrafts[exercise.id] || "").trim();
    if (!answer) {
      setError("Escribí tu procedimiento antes de corregir.");
      return;
    }
    setEvaluatingId(exercise.id);
    setError("");
    try {
      const res = await fetch("/api/evaluate-calculus-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercise, answer, plan, adaptiveMode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "No se pudo corregir la respuesta.");
      pDispatch(AC.calcAnswerSave(exercise.id, answer, data));
      uiDispatch(AC.toastAdd(Date.now(), data.correct ? "Respuesta correcta" : "Respuesta revisada", `${Math.round(Number(data.score) || 0)}/100 · ${data.errorType || "sin categoría"}`));
      playLifeOSSound(data.correct ? "complete" : "timer");
    } catch (err) {
      setError(err?.message || "Error corrigiendo respuesta.");
    } finally {
      setEvaluatingId(null);
    }
  }, [answerDrafts, plan, adaptiveMode, pDispatch, uiDispatch]);

  const pill = (label, color = "#60a5fa") => (
    <span style={{ padding:"5px 9px", borderRadius:999, border:`1px solid ${color}33`, background:`${color}12`, color, fontSize:11, fontWeight:900 }}>{label}</span>
  );

  return (
    <div className="view-enter" style={{ display:"grid", gap:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"flex-start", flexWrap:"wrap" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
            <div style={{ width:38, height:38, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(96,165,250,.14)", color:"#60a5fa", border:"1px solid rgba(96,165,250,.22)" }}><BookOpen size={19}/></div>
            <div>
              <h1 style={{ margin:0, fontSize:24, color:"#f8fafc", letterSpacing:"-.4px" }}>Cálculo Trainer</h1>
              <div style={{ fontSize:12, color:"#64748b", fontWeight:700 }}>8:10 AM – 9:45 AM · {CALCULUS_SOURCE_LABEL}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            {pill(plan.mode, String(plan.mode).toLowerCase().includes("parcial") ? "#fbbf24" : "#60a5fa")}
            {plan.cumulativeReview && pill("Repaso acumulativo", "#34d399")}
            {pill(`Parcial ${plan.partial || "repaso"}`, "#a78bfa")}
            {pill(`${evaluatedCount}/${current.exercises?.length || 0} corregidos`, "#34d399")}
            {avgScore !== null && pill(`Promedio ${avgScore}/100`, avgScore >= 75 ? "#34d399" : "#fb923c")}
            {pinnedToday && pill("Ejercicios fijados hoy", "#fbbf24")}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button onClick={() => pDispatch(AC.calcSettingsUpdate({ examMode: !examModeOn }))} style={{ padding:"10px 12px", borderRadius:12, border:"1px solid rgba(251,191,36,.25)", background:examModeOn ? "rgba(251,191,36,.13)" : "rgba(255,255,255,.04)", color:examModeOn ? "#fbbf24" : "#cbd5e1", fontWeight:900, cursor:"pointer" }}>
            {examModeOn ? "Modo examen ON" : "Modo examen"}
          </button>
          <button onClick={() => uiDispatch(AC.setView("schedule"))} style={{ padding:"10px 12px", borderRadius:12, border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.04)", color:"#cbd5e1", fontWeight:900, cursor:"pointer" }}>
            Ver horario
          </button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1.15fr) minmax(260px,.85fr)", gap:14 }} className="calc-grid">
        <section style={{ border:"1px solid rgba(96,165,250,.14)", background:"linear-gradient(135deg,rgba(96,165,250,.11),rgba(15,23,42,.72))", borderRadius:22, padding:16, boxShadow:"0 18px 50px rgba(0,0,0,.28)" }}>
          <div style={{ fontSize:10, color:"#60a5fa", textTransform:"uppercase", letterSpacing:1, fontWeight:900, marginBottom:6 }}>Tema de hoy</div>
          <div style={{ fontSize:20, color:"#f8fafc", fontWeight:900, lineHeight:1.12, marginBottom:9 }}>{plan.topic}</div>
          <div style={{ color:"#94a3b8", fontSize:13, lineHeight:1.55, marginBottom:12 }}>{adaptiveMode}</div>
          {plan.cumulativeReview && <div style={{ color:"#86efac", fontSize:12, lineHeight:1.5, marginBottom:12, padding:10, borderRadius:12, background:"rgba(52,211,153,.08)", border:"1px solid rgba(52,211,153,.16)" }}>Ejercicios variados de los temas vistos hasta ahora según la jornalización. No incluye temas futuros.</div>}
          {pinnedToday && <div style={{ color:"#fde68a", fontSize:12, lineHeight:1.5, marginBottom:12, padding:10, borderRadius:12, background:"rgba(251,191,36,.08)", border:"1px solid rgba(251,191,36,.18)" }}>Hoy LifeOS usa los ejercicios guardados del PDF para no gastar créditos. Mañana vuelve a generar práctica nueva.</div>}
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:14 }}>
            {(plan.focus || []).map(f => <span key={f} className="tl-ftag">{f}</span>)}
          </div>
          <button disabled={loading} onClick={generatePractice} style={{ width:"100%", padding:"13px 14px", borderRadius:16, border:"1px solid rgba(96,165,250,.28)", background:loading ? "rgba(96,165,250,.08)" : "linear-gradient(135deg,#2563eb,#7c3aed)", color:"white", fontWeight:900, cursor:loading ? "wait" : "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
            {loading ? <RefreshCw size={17} className="spin"/> : <Sparkles size={17}/>} {pinnedToday ? "Cargar ejercicios guardados de hoy" : (generated ? "Regenerar práctica adaptativa" : "Generar práctica de hoy")}
          </button>
          {error && <div style={{ marginTop:10, padding:10, borderRadius:12, border:"1px solid rgba(248,113,113,.25)", background:"rgba(248,113,113,.08)", color:"#fca5a5", fontSize:12, fontWeight:800 }}>{error}</div>}
        </section>

        <aside style={{ border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.035)", borderRadius:22, padding:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, color:"#e2e8f0", fontWeight:900, marginBottom:10 }}><Shield size={17} color="#34d399"/> API segura</div>
          <div style={{ color:"#94a3b8", fontSize:12, lineHeight:1.55 }}>
            LifeOS llama a <b style={{ color:"#cbd5e1" }}>/api/generate-calculus-practice</b> y <b style={{ color:"#cbd5e1" }}>/api/evaluate-calculus-answer</b>. Tu API key de Claude queda en Vercel como variable de entorno y nunca se guarda en el navegador.
          </div>
          <div style={{ marginTop:12, display:"grid", gap:8 }}>
            <div style={{ padding:10, borderRadius:12, background:"rgba(52,211,153,.08)", color:"#86efac", fontSize:12, fontWeight:800 }}>Variable necesaria: ANTHROPIC_API_KEY</div>
            <div style={{ padding:10, borderRadius:12, background:"rgba(167,139,250,.08)", color:"#c4b5fd", fontSize:12, fontWeight:800 }}>Modelo opcional: ANTHROPIC_MODEL</div>
          </div>
          <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid rgba(255,255,255,.08)" }}>
            <div style={{ color:"#e2e8f0", fontWeight:900, fontSize:13, marginBottom:5 }}>Videos recomendados</div>
            <div style={{ color:"#94a3b8", fontSize:11.5, lineHeight:1.45, marginBottom:8 }}>{videoRecommendations.note}</div>
            <div style={{ display:"grid", gap:7 }}>
              {videoRecommendations.videos.map(v => <a key={v.url} href={v.url} target="_blank" rel="noreferrer" style={{ padding:9, borderRadius:11, background:"rgba(96,165,250,.08)", border:"1px solid rgba(96,165,250,.13)", color:"#93c5fd", fontSize:11.5, fontWeight:900, textDecoration:"none", lineHeight:1.35 }}>{v.title}</a>)}
            </div>
          </div>
        </aside>
      </div>

      {weakTopics.length > 0 && (
        <section style={{ border:"1px solid rgba(251,146,60,.18)", background:"rgba(251,146,60,.065)", borderRadius:18, padding:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, color:"#fdba74", fontWeight:900, marginBottom:8 }}><AlertTriangle size={16}/> Errores frecuentes detectados</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:8 }}>
            {weakTopics.map(w => <div key={`${w.topic}-${w.errorType}`} style={{ padding:10, borderRadius:12, background:"rgba(2,6,23,.25)", border:"1px solid rgba(255,255,255,.06)" }}>
              <div style={{ color:"#e2e8f0", fontWeight:900, fontSize:12 }}>{w.topic}</div>
              <div style={{ color:"#94a3b8", fontSize:11, marginTop:3 }}>{w.errorType} · {w.count} vez/veces · promedio {w.avg}/100</div>
            </div>)}
          </div>
        </section>
      )}

      {examModeOn && (
        <section style={{ border:"1px solid rgba(251,191,36,.2)", background:"rgba(251,191,36,.075)", borderRadius:18, padding:14, color:"#fef3c7", fontSize:12, lineHeight:1.6 }}>
          <b>Modo examen activo:</b> resolvé sin ver pistas, medí el tiempo y corregí al final. LifeOS pedirá más mezcla, dificultad y procedimientos completos.
        </section>
      )}

      {generated && (
        <section style={{ display:"grid", gap:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:10, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:18, color:"#f8fafc", fontWeight:900 }}>{current.sessionTitle || "Práctica generada"}</div>
              <div style={{ fontSize:12, color:"#64748b", marginTop:3 }}>{current.sessionInstructions || "Resolvé con procedimiento claro."}</div>
            </div>
            <div style={{ color:"#94a3b8", fontSize:12, fontWeight:800 }}>{current.estimatedMinutes || 75} min estimados</div>
          </div>

          {current.exercises.map((ex, idx) => {
            const evaluation = current.evaluationsById?.[ex.id];
            const answer = answerDrafts[ex.id] ?? current.answersById?.[ex.id]?.answer ?? "";
            return (
              <div key={ex.id} style={{ border:"1px solid rgba(255,255,255,.075)", background:"rgba(255,255,255,.035)", borderRadius:18, padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:8 }}>
                  <div>
                    <div style={{ color:"#f8fafc", fontWeight:900, fontSize:15 }}>{idx + 1}. {ex.title}</div>
                    <div style={{ color:"#64748b", fontSize:11, fontWeight:800, marginTop:2 }}>{ex.topic} · {ex.type} · {getCalculusDifficultyDisplay(ex.difficultyLevel || ex.difficulty)}</div>
                  </div>
                  {evaluation && <div style={{ padding:"5px 8px", borderRadius:999, background:(Number(evaluation.score) >= 75 ? "rgba(52,211,153,.12)" : "rgba(251,146,60,.12)"), color:(Number(evaluation.score) >= 75 ? "#86efac" : "#fdba74"), fontSize:11, fontWeight:900 }}>{Math.round(Number(evaluation.score) || 0)}/100</div>}
                </div>
                <div style={{ color:"#cbd5e1", fontSize:14, lineHeight:1.55, whiteSpace:"pre-wrap", marginBottom:10 }}>{ex.statement}</div>
                {Array.isArray(ex.options) && ex.options.length > 0 && <div style={{ display:"grid", gap:7, marginBottom:10 }}>
                  {ex.options.map(opt => <div key={`${ex.id}-${opt.key}`} style={{ padding:"8px 10px", borderRadius:11, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", color:"#cbd5e1", fontSize:12, lineHeight:1.35 }}><b style={{ color:"#93c5fd" }}>{opt.key}.</b> {opt.text}</div>)}
                </div>}
                {ex.hint && <div style={{ color:"#94a3b8", fontSize:12, marginBottom:10 }}><b style={{ color:"#cbd5e1" }}>Pista:</b> {ex.hint}</div>}
                <textarea value={answer} onChange={e => setAnswerDrafts(prev => ({ ...prev, [ex.id]: e.target.value }))} placeholder={Array.isArray(ex.options) && ex.options.length ? "Escribí la opción y tu justificación..." : "Escribí tu procedimiento aquí..."} style={{ width:"100%", minHeight:86, borderRadius:14, border:"1px solid rgba(255,255,255,.08)", background:"rgba(2,6,23,.35)", color:"#e2e8f0", padding:11, resize:"vertical", fontFamily:"inherit", fontSize:13, outline:"none" }}/>
                <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"center", marginTop:10, flexWrap:"wrap" }}>
                  <button disabled={evaluatingId === ex.id} onClick={() => evaluateExercise(ex)} style={{ padding:"10px 12px", borderRadius:12, border:"1px solid rgba(52,211,153,.24)", background:"rgba(52,211,153,.12)", color:"#86efac", fontWeight:900, cursor:evaluatingId === ex.id ? "wait" : "pointer", display:"flex", alignItems:"center", gap:7 }}>
                    {evaluatingId === ex.id ? <RefreshCw size={15} className="spin"/> : <CheckCircle2 size={15}/>} Corregir
                  </button>
                  {evaluation && <div style={{ flex:1, minWidth:220, color:"#94a3b8", fontSize:12, lineHeight:1.45 }}><b style={{ color:"#e2e8f0" }}>{evaluation.errorType || "Feedback"}:</b> {evaluation.feedback}</div>}
                </div>
                {evaluation?.correctSolution && <details style={{ marginTop:10, color:"#94a3b8", fontSize:12 }}><summary style={{ cursor:"pointer", color:"#c4b5fd", fontWeight:900 }}>Ver solución correcta</summary><div style={{ marginTop:8, whiteSpace:"pre-wrap", lineHeight:1.55 }}>{evaluation.correctSolution}</div></details>}
              </div>
            );
          })}
        </section>
      )}

      {!generated && (
        <div style={{ border:"1px dashed rgba(255,255,255,.12)", borderRadius:18, padding:18, color:"#64748b", textAlign:"center", fontWeight:800 }}>
          Mañana solo abrís Cálculo, tocás “Generar práctica de hoy” y LifeOS usa la jornalización correcta para decidir qué toca.
        </div>
      )}

      <section style={{ border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.03)", borderRadius:18, padding:14 }}>
        <div style={{ color:"#e2e8f0", fontWeight:900, marginBottom:8 }}>Cierre rápido</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:10, alignItems:"center" }}>
          <textarea value={current.sessionNotes || ""} onChange={e => pDispatch(AC.calcFieldUpdate("sessionNotes", e.target.value))} placeholder="¿Qué se me hizo difícil? ¿Qué error repetí?" style={{ minHeight:58, borderRadius:14, border:"1px solid rgba(255,255,255,.08)", background:"rgba(2,6,23,.32)", color:"#e2e8f0", padding:11, resize:"vertical", fontFamily:"inherit", fontSize:13, outline:"none" }}/>
          <select value={current.selfRating || ""} onChange={e => pDispatch(AC.calcFieldUpdate("selfRating", e.target.value ? Number(e.target.value) : null))} style={{ height:44, borderRadius:12, border:"1px solid rgba(255,255,255,.08)", background:"#111827", color:"#e2e8f0", padding:"0 10px", fontWeight:800 }}>
            <option value="">Nivel</option><option value="1">Nivel 1 · Básico</option><option value="2">Nivel 2 · Fácil</option><option value="3">Nivel 3 · Intermedio</option><option value="4">Nivel 4 · Difícil</option><option value="5">Nivel 5 · Tipo examen</option>
          </select>
        </div>
      </section>
    </div>
  );
}


function RocketSpeedflipDarCleanCancelCard({ recommended }) {
  const { persistent, pDispatch } = useAppData();
  const { uiDispatch } = useAppUI();
  const speedflipDar = persistent.rocketLeague?.speedflipDar || createRocketLeagueInitialState().speedflipDar;
  const history = Array.isArray(speedflipDar.history) ? speedflipDar.history : [];
  const stats = useMemo(() => getSpeedflipDarStats(history), [history]);
  const last = history[history.length - 1] || null;
  const [form, setForm] = useState({ side: speedflipDar.dominantSide || "DAR Derecho", speed: "75%", attempts: 10, clean: 0, noseTouches: "2", touchMoment: "end", errorType: "early_release", notes: "" });
  const preview = useMemo(() => normalizeSpeedflipDarSession({ ...form, attempts: Math.max(1, Number(form.attempts) || 10), clean: Math.min(Number(form.clean) || 0, Number(form.attempts) || 10) }), [form]);
  const feedback = getSpeedflipDarSessionFeedback(last || preview);
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const save = () => {
    unlockLifeOSAudio();
    pDispatch(AC.rlSpeedflipDarSave(form));
    playLifeOSSound("complete");
    const id = Date.now();
    uiDispatch(AC.toastAdd(id, "Speedflip DAR guardado", `${preview.cleanRate}% limpio · ${form.side}`));
    setTimeout(() => uiDispatch(AC.toastRemove(id)), 2800);
  };
  const inputStyle = { width:"100%", borderRadius:10, border:"1px solid rgba(255,255,255,.08)", background:"rgba(2,6,23,.36)", color:T_COLOR.text, padding:"9px 10px", fontFamily:"inherit", fontSize:12, outline:"none" };
  const FieldHelp = ({ title, children, color="#94a3b8" }) => <div style={{ color, fontSize:10.5, lineHeight:1.35, marginTop:4 }}>{title && <b style={{ color:"#cbd5e1" }}>{title}: </b>}{children}</div>;
  const MiniGuideRow = ({ title, text, color="#fbbf24" }) => <div style={{ padding:9, borderRadius:11, background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.07)", fontSize:11.5, lineHeight:1.42 }}><b style={{ color }}>{title}</b><div style={{ color:T_COLOR.muted, marginTop:2 }}>{text}</div></div>;
  return (
    <div className="g" style={{ padding:18, borderColor: recommended ? "rgba(251,191,36,.28)" : "rgba(251,191,36,.14)", background: recommended ? "linear-gradient(135deg,rgba(251,191,36,.09),rgba(255,255,255,.03))" : undefined }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <Zap size={18} color="#fbbf24"/>
          <div style={{ ...S.stitle, marginBottom:0 }}>Speedflip DAR Clean Cancel</div>
        </div>
        {recommended && <span style={{ fontSize:10, color:"#fbbf24", fontWeight:900, border:"1px solid rgba(251,191,36,.28)", background:"rgba(251,191,36,.10)", borderRadius:99, padding:"4px 8px" }}>Hoy toca</span>}
      </div>

      <div style={{ color:T_COLOR.muted, fontSize:12.5, lineHeight:1.6, marginBottom:12 }}>
        <b style={{ color:"#fde68a" }}>Objetivo:</b> limpiar el aterrizaje antes de ir al mapa de Musty. Llegar al balón no basta si el carro raspa la trompa dos veces.
        <br/><b style={{ color:"#fde68a" }}>Regla:</b> primero limpieza, después velocidad. Si raspa al final, sostené más el cancel; si raspa al inicio, revisá el primer diagonal.
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:8, marginBottom:12 }} className="mob-layout-grid">
        <MiniGuideRow title="1 · Warmup sin balón · 2 min" text="Repetí el movimiento sin buscar el balón. Solo mirá si cae plano." />
        <MiniGuideRow title="2 · Repeticiones por lado · 3 min" text="Probá DAR Derecho o Izquierdo. Contá intentos buenos y malos." />
        <MiniGuideRow title="3 · Lado dominante · 3 min" text="En tu caso: DAR Derecho. Consistencia antes que velocidad." />
        <MiniGuideRow title="4 · Musty / speedflip map · 2 min" text="Ahora sí kickoff completo. Si llega pero raspa doble, no cuenta limpio." />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:10 }} className="mob-layout-grid">
        <label style={{ display:"grid", gap:4 }}>
          <span style={{ fontSize:11, color:"#e2e8f0", fontWeight:900 }}>Lado practicado</span>
          <select value={form.side} onChange={e => update("side", e.target.value)} style={inputStyle}><option>DAR Derecho</option><option>DAR Izquierdo</option></select>
          <FieldHelp>Qué air roll usaste más en esta sesión.</FieldHelp>
        </label>
        <label style={{ display:"grid", gap:4 }}>
          <span style={{ fontSize:11, color:"#e2e8f0", fontWeight:900 }}>Velocidad de práctica</span>
          <select value={form.speed} onChange={e => update("speed", e.target.value)} style={inputStyle}><option>75%</option><option>85%</option><option>100%</option></select>
          <FieldHelp>Si estás raspando doble, volvé a 75%.</FieldHelp>
        </label>
        <label style={{ display:"grid", gap:4 }}>
          <span style={{ fontSize:11, color:"#e2e8f0", fontWeight:900 }}>Intentos totales</span>
          <input type="number" min="1" max="200" value={form.attempts} onChange={e => update("attempts", e.target.value)} placeholder="Ej. 10" style={inputStyle}/>
          <FieldHelp>Cuántos speedflips intentaste en total.</FieldHelp>
        </label>
        <label style={{ display:"grid", gap:4 }}>
          <span style={{ fontSize:11, color:"#e2e8f0", fontWeight:900 }}>Intentos limpios</span>
          <input type="number" min="0" max={form.attempts || 10} value={form.clean} onChange={e => update("clean", e.target.value)} placeholder="Ej. 6" style={inputStyle}/>
          <FieldHelp>Caen planos, sin doble raspón y con control.</FieldHelp>
        </label>
        <label style={{ display:"grid", gap:4 }}>
          <span style={{ fontSize:11, color:"#e2e8f0", fontWeight:900 }}>Toques de trompa más comunes</span>
          <select value={form.noseTouches} onChange={e => update("noseTouches", e.target.value)} style={inputStyle}><option value="0">0 toques</option><option value="1">1 toque</option><option value="2">2 toques</option><option value="3+">3+ toques</option></select>
          <FieldHelp>No cuentes limpio si pega dos veces.</FieldHelp>
        </label>
        <label style={{ display:"grid", gap:4 }}>
          <span style={{ fontSize:11, color:"#e2e8f0", fontWeight:900 }}>¿Cuándo raspa?</span>
          <select value={form.touchMoment} onChange={e => update("touchMoment", e.target.value)} style={inputStyle}>{Object.entries(SPEEDFLIP_DAR_TOUCH_MOMENTS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select>
          <FieldHelp>En qué parte del movimiento toca el suelo.</FieldHelp>
        </label>
        <label style={{ display:"grid", gap:4, gridColumn:"1 / -1" }}>
          <span style={{ fontSize:11, color:"#e2e8f0", fontWeight:900 }}>Error principal</span>
          <select value={form.errorType} onChange={e => update("errorType", e.target.value)} style={inputStyle}>{Object.entries(SPEEDFLIP_DAR_ERROR_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select>
          <FieldHelp>Elegí lo que más se repitió. LifeOS usa esto para recomendar el próximo ajuste.</FieldHelp>
        </label>
        <label style={{ display:"grid", gap:4, gridColumn:"1 / -1" }}>
          <span style={{ fontSize:11, color:"#e2e8f0", fontWeight:900 }}>Notas rápidas</span>
          <textarea value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Ej. raspa al final, me sale mejor derecha, solté el stick temprano..." style={{ ...inputStyle, minHeight:66, resize:"vertical" }}/>
        </label>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginTop:12 }}>
        <div style={{ padding:10, borderRadius:11, background:"rgba(251,191,36,.08)", border:"1px solid rgba(251,191,36,.14)" }}><div style={{ fontSize:10, color:T_COLOR.muted, fontWeight:900 }}>Clean rate</div><b style={{ color:"#fbbf24", fontSize:18 }}>{preview.cleanRate}%</b><div style={{ color:T_COLOR.muted, fontSize:10, marginTop:2 }}>limpios / total</div></div>
        <div style={{ padding:10, borderRadius:11, background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.07)" }}><div style={{ fontSize:10, color:T_COLOR.muted, fontWeight:900 }}>Toques/intento</div><b style={{ color:T_COLOR.text, fontSize:18 }}>{preview.noseTouchAvg}</b><div style={{ color:T_COLOR.muted, fontSize:10, marginTop:2 }}>menos es mejor</div></div>
        <div style={{ padding:10, borderRadius:11, background:"rgba(52,211,153,.08)", border:"1px solid rgba(52,211,153,.14)" }}><div style={{ fontSize:10, color:T_COLOR.muted, fontWeight:900 }}>Lado más limpio</div><b style={{ color:"#86efac", fontSize:12 }}>{stats.cleanestSide.count ? `${stats.cleanestSide.side} · ${stats.cleanestSide.avg}%` : form.side}</b></div>
      </div>

      <div style={{ marginTop:12, display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:8 }} className="mob-layout-grid">
        <MiniGuideRow title="Cómo saber si fue limpio" text="Cae plano, no pega doble, no pierde dirección y no necesitás corregir mucho después del flip." color="#86efac" />
        <MiniGuideRow title="Cómo leer errores" text="Inicio = diagonal muy frontal. Final = soltaste cancel temprano. Doble raspón = salida sucia." color="#fbbf24" />
      </div>

      <div style={{ marginTop:12, padding:10, borderRadius:12, background:"rgba(2,6,23,.25)", border:"1px solid rgba(255,255,255,.07)", color:T_COLOR.muted, fontSize:11.5, lineHeight:1.5 }}>
        <b style={{ color:"#e2e8f0" }}>{stats.status}</b>{stats.sessionsLeft !== "—" ? ` · Si mantenés este ritmo, podrías dominarlo en ${stats.sessionsLeft} sesiones.` : ""}<br/>{feedback}
      </div>
      <button onClick={save} style={{ marginTop:12, width:"100%", minHeight:40, borderRadius:12, border:"1px solid rgba(251,191,36,.28)", background:"rgba(251,191,36,.12)", color:"#fbbf24", fontWeight:900, cursor:"pointer" }}>Guardar sesión</button>
      {stats.lastFive.length > 0 && <div style={{ marginTop:12, display:"grid", gap:6 }}>{stats.lastFive.slice().reverse().map(s => <div key={s.id} style={{ display:"flex", justifyContent:"space-between", gap:8, fontSize:10.5, color:T_COLOR.muted, padding:7, borderRadius:9, background:"rgba(255,255,255,.03)" }}><span>{new Date(s.date).toLocaleDateString()} · {s.side} · {s.speed}</span><b style={{ color:s.cleanRate >= 80 ? "#86efac" : "#fbbf24" }}>{s.cleanRate}%</b></div>)}</div>}
    </div>
  );
}

function getRocketLeagueTaskRole(task, plan) {
  if (task?.trainingRole) return task.trainingRole;
  if (task?.optional) return "Opcional";
  if (task?.type === RL_SUBTASK_TYPES.FREEPLAY || task?.type === RL_SUBTASK_TYPES.MATCHES) return "Bloque fijo";
  if (task?.type === RL_SUBTASK_TYPES.MENTAL) return "Registro mental";
  if (plan?.primaryMechanicLabel && String(task?.title || "").toLowerCase().includes(String(plan.primaryMechanicLabel).toLowerCase().split(" ")[0])) return "Foco principal";
  return "Apoyo técnico";
}

function getRocketLeagueRoleBadgeStyle(role, accent = "#22d3ee") {
  if (role === "Foco principal") return { color:"#fbbf24", background:"rgba(251,191,36,.09)", border:"1px solid rgba(251,191,36,.18)" };
  if (role === "Apoyo técnico") return { color:"#34d399", background:"rgba(52,211,153,.08)", border:"1px solid rgba(52,211,153,.16)" };
  if (role === "Bloque fijo") return { color:"#22d3ee", background:"rgba(34,211,238,.08)", border:"1px solid rgba(34,211,238,.16)" };
  if (role === "Registro mental") return { color:"#c4b5fd", background:"rgba(167,139,250,.08)", border:"1px solid rgba(167,139,250,.16)" };
  if (role === "Opcional") return { color:"#94a3b8", background:"rgba(148,163,184,.07)", border:"1px solid rgba(148,163,184,.16)" };
  return { color:accent, background:`${accent}12`, border:`1px solid ${accent}24` };
}

function RocketLeagueView() {
  const { persistent, pDispatch } = useAppData();
  const { uiDispatch } = useAppUI();

  const [dateKey, setDateKey] = useState(() => getRocketLeagueDateKey());
  const plan = useMemo(() => getRocketLeaguePlanForDate(dateKey), [dateKey]);
  const current = persistent.rocketLeague?.current || createRocketLeagueCurrent(dateKey, plan.id);
  const completedIds = current.completedSubtaskIds || [];
  const elapsedBySubtask = current.elapsedBySubtask || {};
  const matchCountBySubtask = current.matchCountBySubtask || {};
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const activeQuests = useMemo(() => getActiveQuests(persistent), [persistent.quests.customItems]);
  const parentQuest = useMemo(
    () => activeQuests.find(q => q.id === ROCKET_LEAGUE_PARENT_QUEST_ID) || QUESTS.find(q => q.id === ROCKET_LEAGUE_PARENT_QUEST_ID),
    [activeQuests]
  );
  const parentCompleted = (persistent.quests.completedIds || []).includes(ROCKET_LEAGUE_PARENT_QUEST_ID);
  const requiredRocketTasks = plan.subtasks.filter(task => !task.optional);
  const allComplete = requiredRocketTasks.every(task => completedSet.has(task.id));
  const doneCount = requiredRocketTasks.filter(task => completedSet.has(task.id)).length;
  const totalTargetSeconds = plan.subtasks.reduce((sum, task) => sum + task.minutes * 60, 0);

  const [activeSubtaskId, setActiveSubtaskId] = useState(null);
  const [tickNow, setTickNow] = useState(Date.now());
  const [localElapsedBySubtask, setLocalElapsedBySubtask] = useState(() => ({ ...elapsedBySubtask }));
  const activeTimerRef = useRef({ id: null, startedAt: null });
  const targetSoundedRef = useRef(new Set());

  const mergeElapsedMaps = useCallback((base = {}, incoming = {}) => {
    const next = { ...(base || {}) };
    Object.entries(incoming || {}).forEach(([key, value]) => {
      next[key] = Math.max(
        Math.max(0, Math.floor(Number(next[key]) || 0)),
        Math.max(0, Math.floor(Number(value) || 0))
      );
    });
    return next;
  }, []);

  const commitActiveTimer = useCallback(() => {
    const { id, startedAt } = activeTimerRef.current;
    if (!id || !startedAt) return 0;
    const delta = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
    activeTimerRef.current = { id: null, startedAt: null };
    if (delta > 0) {
      setLocalElapsedBySubtask(prev => ({
        ...(prev || {}),
        [id]: Math.max(0, Math.floor(Number(prev?.[id]) || 0)) + delta,
      }));
      pDispatch(AC.rlTimerCommit(id, delta));
    }
    return delta;
  }, [pDispatch]);

  useEffect(() => {
    if (current.dateKey !== dateKey || current.planId !== plan.id) {
      commitActiveTimer();
      setActiveSubtaskId(null);
      pDispatch(AC.rlDailySync(dateKey, plan.id));
    }
  }, [current.dateKey, current.planId, dateKey, plan.id, pDispatch, commitActiveTimer]);

  useEffect(() => {
    setLocalElapsedBySubtask({ ...(elapsedBySubtask || {}) });
    targetSoundedRef.current = new Set();
  }, [current.dateKey, current.planId]);

  useEffect(() => {
    setLocalElapsedBySubtask(prev => mergeElapsedMaps(prev, elapsedBySubtask));
  }, [elapsedBySubtask, mergeElapsedMaps]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setTickNow(now);
      setDateKey(prev => {
        const next = getRocketLeagueDateKey(new Date(now));
        return prev === next ? prev : next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => () => commitActiveTimer(), [commitActiveTimer]);

  const getElapsedSeconds = useCallback((subtaskId) => {
    const persisted = Math.max(0, Math.floor(Number(localElapsedBySubtask?.[subtaskId]) || 0));
    const active = activeTimerRef.current;
    if (active.id === subtaskId && active.startedAt) {
      return persisted + Math.max(0, Math.floor((tickNow - active.startedAt) / 1000));
    }
    return persisted;
  }, [localElapsedBySubtask, tickNow]);

  const getMatchCount = useCallback((subtaskId) => {
    return Math.max(0, Math.floor(Number(matchCountBySubtask[subtaskId]) || 0));
  }, [matchCountBySubtask]);

  const totalElapsedSeconds = useMemo(
    () => plan.subtasks.reduce((sum, task) => sum + getElapsedSeconds(task.id), 0),
    [plan.subtasks, getElapsedSeconds]
  );

  const nextRotationSeconds = getSecondsUntilNextLocalDay(tickNow);
  const tomorrowDateKey = getRocketLeagueDateKey(new Date(tickNow + 24 * 60 * 60 * 1000));
  const tomorrowPlan = useMemo(() => getRocketLeaguePlanForDate(tomorrowDateKey), [tomorrowDateKey]);
  const weeklyFocus = useMemo(() => getRocketLeagueWeeklyFocus(dateKey), [dateKey]);
  const focusRole = useMemo(() => getRocketLeagueFocusRole(dateKey), [dateKey]);
  const nextWeeklyFocusSeconds = useMemo(() => getSecondsUntilNextRocketWeeklyFocus(tickNow), [tickNow]);

  useEffect(() => {
    if (!activeSubtaskId) return;
    const activeTask = plan.subtasks.find(task => task.id === activeSubtaskId);
    if (!activeTask) return;
    const targetSeconds = activeTask.minutes * 60;
    const elapsed = getElapsedSeconds(activeSubtaskId);
    const soundKey = `${current.dateKey}:${current.planId}:${activeSubtaskId}`;
    if (elapsed >= targetSeconds && !targetSoundedRef.current.has(soundKey)) {
      targetSoundedRef.current.add(soundKey);
      unlockLifeOSAudio();
      playLifeOSSound("timer");
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([140, 60, 140]);
      const id = Date.now();
      uiDispatch(AC.toastAdd(id, `${activeTask.title}: tiempo objetivo`, `${activeTask.minutes} min completados`));
      setTimeout(() => uiDispatch(AC.toastRemove(id)), 2600);
    }
  }, [activeSubtaskId, tickNow, plan.subtasks, current.dateKey, current.planId, getElapsedSeconds, uiDispatch]);

  const progressPct = Math.min(100, Math.round((doneCount / Math.max(requiredRocketTasks.length, 1)) * 100));
  const timePct = Math.min(100, Math.round((totalElapsedSeconds / Math.max(totalTargetSeconds, 1)) * 100));

  const toggleTimer = useCallback((subtaskId) => {
    unlockLifeOSAudio();
    if (activeTimerRef.current.id === subtaskId) {
      commitActiveTimer();
      setTickNow(Date.now());
      setActiveSubtaskId(null);
      return;
    }
    commitActiveTimer();
    activeTimerRef.current = { id: subtaskId, startedAt: Date.now() };
    setTickNow(Date.now());
    setActiveSubtaskId(subtaskId);
  }, [commitActiveTimer]);

  const toggleSubtask = useCallback((subtaskId) => {
    unlockLifeOSAudio();
    const wasDone = completedSet.has(subtaskId);
    if (activeTimerRef.current.id === subtaskId) {
      commitActiveTimer();
      setActiveSubtaskId(null);
    }
    pDispatch(AC.rlSubtaskToggle(subtaskId));
    if (!wasDone) {
      const targetSeconds = getRocketLeagueSubtaskTargetSeconds(current.planId, subtaskId);
      if (targetSeconds > 0) {
        setLocalElapsedBySubtask(prev => ({
          ...(prev || {}),
          [subtaskId]: Math.max(Math.max(0, Math.floor(Number(prev?.[subtaskId]) || 0)), targetSeconds),
        }));
      }
      playLifeOSSound("complete");
    }
  }, [commitActiveTimer, completedSet, current.planId, pDispatch]);

  const updateMatchProgress = useCallback((task, delta) => {
    unlockLifeOSAudio();
    const before = getMatchCount(task.id);
    const target = Math.max(1, Math.floor(Number(task.targetCount) || 1));
    const after = Math.min(target, Math.max(0, before + delta));
    pDispatch(AC.rlMatchProgress(task.id, delta));
    if (before < target && after >= target) {
      playLifeOSSound("complete");
      const id = Date.now();
      uiDispatch(AC.toastAdd(id, `${task.title}: completado`, `${target} partidas de 1v1 listas`));
      setTimeout(() => uiDispatch(AC.toastRemove(id)), 2600);
    }
  }, [getMatchCount, pDispatch, uiDispatch]);

  const updateMental = useCallback((key, value) => {
    pDispatch(AC.rlMentalUpdate(key, value));
  }, [pDispatch]);

  const saveMental = useCallback(() => {
    commitActiveTimer();
    pDispatch(AC.rlMentalSave());
    const id = Date.now();
    uiDispatch(AC.toastAdd(id, "Reflexión Rocket guardada", "Mental fuerte: menos tilt, mejores decisiones"));
    setTimeout(() => uiDispatch(AC.toastRemove(id)), 2800);
  }, [commitActiveTimer, pDispatch, uiDispatch]);

  useEffect(() => {
    if (!parentQuest) return;
    if (allComplete && !parentCompleted) {
      const oldNivel = SELECTORS.level(persistent.xp.total);
      pDispatch(AC.questComplete(ROCKET_LEAGUE_PARENT_QUEST_ID, parentQuest.xp, oldNivel));
      const id = Date.now();
      uiDispatch(AC.toastAdd(id, "Rocket League Training completado", `+${parentQuest.xp} XP · buen trabajo, no ranked frío`));
      playLifeOSSound("mission");
      setTimeout(() => uiDispatch(AC.toastRemove(id)), 3200);
    }
    if (!allComplete && parentCompleted) {
      const oldNivel = SELECTORS.level(persistent.xp.total);
      pDispatch(AC.questComplete(ROCKET_LEAGUE_PARENT_QUEST_ID, parentQuest.xp, oldNivel));
    }
  }, [allComplete, parentCompleted, parentQuest, persistent.xp.total, pDispatch, uiDispatch]);

  const missionStatus = parentCompleted
    ? { label: "Completada", color: "#34d399" }
    : allComplete
      ? { label: "Lista para completar", color: "#fbbf24" }
      : { label: "Pendiente", color: "#64748b" };

  const mental = current.mental || createRocketLeagueCurrent().mental;
  const moodOptions = [1, 2, 3, 4, 5];
  const activeTask = activeSubtaskId ? plan.subtasks.find(task => task.id === activeSubtaskId) : null;
  const nextIncompleteTask = plan.subtasks.find(task => !completedSet.has(task.id));
  const timedBlocksComplete = plan.subtasks.filter(task => !task.noTimer && !task.optional).every(task => completedSet.has(task.id));
  const matchTask = plan.subtasks.find(task => task.type === RL_SUBTASK_TYPES.MATCHES || task.noTimer);
  const matchCount = matchTask ? getMatchCount(matchTask.id) : 0;
  const speedflipDarRecommended = plan.subtasks.some(task => task.speedflipDar || String(task.id).includes("speedflip") || String(task.title).toLowerCase().includes("speedflip"));

  const markTilted = useCallback(() => {
    unlockLifeOSAudio();
    playLifeOSSound("timer");
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([180, 80, 180]);
    const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const previousNote = String(mental.note || "").trim();
    const line = `[${stamp}] Estoy tilteado: parar ranked, 5 min freeplay suave y volver solo si bajo a 2/5.`;
    pDispatch(AC.rlMentalUpdate("tiltLevel", 5));
    pDispatch(AC.rlMentalUpdate("note", previousNote ? `${previousNote}
${line}` : line));
    const id = Date.now();
    uiDispatch(AC.toastAdd(id, "Modo anti-tilt activado", "Pará ranked: freeplay suave o cerrá sesión."));
    setTimeout(() => uiDispatch(AC.toastRemove(id)), 3600);
  }, [mental.note, pDispatch, uiDispatch]);

  const startNextBlock = useCallback(() => {
    const task = plan.subtasks.find(t => !completedSet.has(t.id) && !t.noTimer);
    if (!task) return;
    toggleTimer(task.id);
  }, [plan.subtasks, completedSet, toggleTimer]);

  const completeCurrentOrNext = useCallback(() => {
    const target = activeTask || nextIncompleteTask;
    if (!target) return;
    if (target.noTimer) return;
    toggleSubtask(target.id);
  }, [activeTask, nextIncompleteTask, toggleSubtask]);

  return (
    <div style={{ animation:"sldIn .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:14, alignItems:"flex-start", marginBottom:18, flexWrap:"wrap" }}>
        <div>
          <div style={S.ptitle}>Rocket League Training</div>
          <div style={S.psub}>90 min · ciclos de 2 semanas · 1 mecánica nueva a la vez · Training Packs + Freeplay</div>
          <div className="rl-chip-row">
            {[ROCKET_LEAGUE_PROFILE.duel, ROCKET_LEAGUE_PROFILE.doubles, ROCKET_LEAGUE_PROFILE.standard, ROCKET_LEAGUE_PROFILE.platform].map(chip => (
              <span key={chip} style={{ ...S.chipBase, background:"rgba(34,211,238,.09)", border:"1px solid rgba(34,211,238,.18)", color:"#22d3ee" }}>{chip}</span>
            ))}
          </div>
        </div>
        <div className="g" style={{ padding:14, minWidth:220 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:11, color:T_COLOR.muted, fontWeight:800, textTransform:"uppercase", letterSpacing:.8 }}>Misión padre</span>
            <span style={{ fontSize:11, color:missionStatus.color, fontWeight:800 }}>{missionStatus.label}</span>
          </div>
          <ProgresoBar pct={progressPct} gradient="linear-gradient(90deg,#22d3ee,#a78bfa)" height={7}/>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T_COLOR.muted, marginTop:8 }}>
            <span>{doneCount}/{plan.subtasks.length} submisiones</span>
            <span>{formatSeconds(totalElapsedSeconds)} / {formatSeconds(totalTargetSeconds)}</span>
          </div>
        </div>
      </div>

      <div className="rl-main-grid">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="g" style={{ padding:18, borderColor:"rgba(34,211,238,.18)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:38, height:38, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(34,211,238,.12)", color:"#22d3ee" }}><Gamepad2 size={19}/></div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:T_FONT.display, fontSize:18, fontWeight:800, color:T_COLOR.text }}>{plan.title}</div>
                <div style={{ fontSize:12, color:T_COLOR.muted }}>{plan.focus}</div>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginTop:8 }}>
                  <span style={{ fontSize:10.5, fontWeight:900, color:weeklyFocus.accent, background:`${weeklyFocus.accent}12`, border:`1px solid ${weeklyFocus.accent}24`, borderRadius:999, padding:"4px 8px" }}>Ciclo actual: {weeklyFocus.short}</span>
                  <span style={{ fontSize:10.5, fontWeight:900, color:focusRole.type === "focus" ? "#34d399" : "#fbbf24", background:focusRole.type === "focus" ? "rgba(52,211,153,.08)" : "rgba(251,191,36,.08)", border:focusRole.type === "focus" ? "1px solid rgba(52,211,153,.16)" : "1px solid rgba(251,191,36,.16)", borderRadius:999, padding:"4px 8px" }}>{focusRole.label}</span>
                </div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }} className="mob-layout-grid">
              <div style={{ padding:12, borderRadius:12, background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.07)" }}>
                <div style={{ fontSize:10, color:T_COLOR.muted, textTransform:"uppercase", fontWeight:800, letterSpacing:.8 }}>Duración</div>
                <div style={{ fontSize:20, fontWeight:900, color:T_COLOR.text }}>{plan.minutes} min</div>
              </div>
              <div style={{ padding:12, borderRadius:12, background:`${weeklyFocus.accent}10`, border:`1px solid ${weeklyFocus.accent}22` }}>
                <div style={{ fontSize:10, color:weeklyFocus.accent, textTransform:"uppercase", fontWeight:800, letterSpacing:.8 }}>Ciclo</div>
                <div style={{ fontSize:13, fontWeight:900, color:T_COLOR.text, lineHeight:1.25 }}>{weeklyFocus.short}</div>
                <div style={{ fontSize:10.5, color:T_COLOR.muted, marginTop:2 }}>{formatCountdownSeconds(nextWeeklyFocusSeconds)}</div>
              </div>
              <div style={{ padding:12, borderRadius:12, background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.07)" }}>
                <div style={{ fontSize:10, color:T_COLOR.muted, textTransform:"uppercase", fontWeight:800, letterSpacing:.8 }}>Tiempo</div>
                <div style={{ fontSize:20, fontWeight:900, color:"#22d3ee" }}>{formatSeconds(totalElapsedSeconds)}</div>
              </div>
              <div style={{ padding:12, borderRadius:12, background:"rgba(251,191,36,.075)", border:"1px solid rgba(251,191,36,.18)" }}>
                <div style={{ fontSize:10, color:"#fbbf24", textTransform:"uppercase", fontWeight:800, letterSpacing:.8 }}>Regla</div>
                <div style={{ fontSize:12, fontWeight:800, color:T_COLOR.text, lineHeight:1.35 }}>1 mecánica nueva</div>
              </div>
              <div style={{ padding:12, borderRadius:12, background:"rgba(167,139,250,.075)", border:"1px solid rgba(167,139,250,.18)" }}>
                <div style={{ fontSize:10, color:"#c4b5fd", textTransform:"uppercase", fontWeight:800, letterSpacing:.8 }}>Próximo ciclo</div>
                <div style={{ fontSize:18, fontWeight:900, color:"#c4b5fd", fontVariantNumeric:"tabular-nums" }}>{formatCountdownSeconds(nextWeeklyFocusSeconds)}</div>
                <div style={{ fontSize:10.5, color:T_COLOR.muted, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Plan diario: {tomorrowPlan.title}</div>
              </div>
            </div>
            <div style={{ marginTop:12, padding:12, borderRadius:12, background:"rgba(248,113,113,.07)", border:"1px solid rgba(248,113,113,.18)", color:"#fca5a5", fontSize:12, fontWeight:700 }}>
              Roadmap por ciclos: el foco actual es <b style={{ color:weeklyFocus.accent }}>{plan.primaryMechanicLabel || weeklyFocus.label}</b>. {plan.supportLabel || "90 min: freeplay, foco principal, descanso, aplicación, fundamentos, replay y cierre."}
            </div>
            <div style={{ marginTop:10, padding:12, borderRadius:12, background:"rgba(52,211,153,.06)", border:"1px solid rgba(52,211,153,.15)", color:"#bbf7d0", fontSize:11.8, lineHeight:1.55 }}>
              <b style={{ color:"#34d399" }}>Lectura correcta:</b> una mecánica nueva por ciclo de 2 semanas. Recoveries, boost management, no double commit, anti-tilt y replay note se mantienen como fundamentos diarios.
            </div>
          </div>

          <div className="g rl-sticky-timer" style={{ padding:16, borderColor:activeTask ? "rgba(34,211,238,.32)" : "rgba(255,255,255,.08)", background:activeTask ? "rgba(34,211,238,.055)" : "rgba(255,255,255,.025)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ minWidth:0, flex:1 }}>
                <div style={{ fontSize:10, color:T_COLOR.muted, textTransform:"uppercase", letterSpacing:.8, fontWeight:900 }}>{activeTask ? "Bloque activo" : "Siguiente bloque"}</div>
                <div style={{ fontFamily:T_FONT.display, fontSize:18, color:T_COLOR.text, fontWeight:900, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{activeTask?.title || nextIncompleteTask?.title || "Entrenamiento completo"}</div>
                <div style={{ fontSize:11.5, color:T_COLOR.muted }}>{activeTask ? `${formatSeconds(getElapsedSeconds(activeTask.id))} / ${activeTask.minutes}:00` : nextIncompleteTask ? "Tocá iniciar para seguir sin perderte" : "Revisá el resumen final"}</div>
              </div>
              <div style={{ fontFamily:T_FONT.display, fontSize:32, fontWeight:900, color:activeTask ? "#22d3ee" : T_COLOR.text, fontVariantNumeric:"tabular-nums" }}>{activeTask ? formatSeconds(getElapsedSeconds(activeTask.id)) : formatSeconds(totalElapsedSeconds)}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button onClick={activeTask ? () => toggleTimer(activeTask.id) : startNextBlock} disabled={!activeTask && !nextIncompleteTask} style={{ border:"1px solid rgba(34,211,238,.28)", background:"rgba(34,211,238,.10)", color:"#22d3ee", borderRadius:11, padding:"9px 12px", fontWeight:900, cursor:"pointer", opacity:(!activeTask && !nextIncompleteTask) ? .45 : 1 }}>{activeTask ? "Pausar" : "Iniciar siguiente"}</button>
                <button onClick={completeCurrentOrNext} disabled={!activeTask && !nextIncompleteTask} style={{ border:"1px solid rgba(52,211,153,.25)", background:"rgba(52,211,153,.09)", color:"#34d399", borderRadius:11, padding:"9px 12px", fontWeight:900, cursor:"pointer", opacity:(!activeTask && !nextIncompleteTask) ? .45 : 1 }}>Completar bloque</button>
              </div>
            </div>
          </div>

          <div className="rl-task-grid">
            {plan.subtasks.map((task, index) => {
              const done = completedSet.has(task.id);
              const active = activeSubtaskId === task.id;
              const elapsed = getElapsedSeconds(task.id);
              const isMatchTask = task.type === RL_SUBTASK_TYPES.MATCHES || task.noTimer;
              const matchCount = isMatchTask ? getMatchCount(task.id) : 0;
              const targetCount = Math.max(1, Math.floor(Number(task.targetCount) || 1));
              const target = task.minutes * 60;
              const pct = isMatchTask
                ? Math.min(100, Math.round((matchCount / targetCount) * 100))
                : Math.min(100, Math.round((elapsed / Math.max(target, 1)) * 100));
              const over = !isMatchTask && elapsed > target;
              const Icon = task.type === RL_SUBTASK_TYPES.MENTAL ? Brain : (task.type === RL_SUBTASK_TYPES.SPEEDFLIP || task.type === RL_SUBTASK_TYPES.SPEEDFLIP_DAR) ? Zap : task.type === RL_SUBTASK_TYPES.FREEPLAY ? Flame : task.type === RL_SUBTASK_TYPES.MATCHES ? Sword : task.type === RL_SUBTASK_TYPES.WORKSHOP ? Layers : Target;
              const taskRole = getRocketLeagueTaskRole(task, plan);
              const taskRoleStyle = getRocketLeagueRoleBadgeStyle(taskRole, task.accent);
              return (
                <div key={task.id} className="rl-task-card" style={{ opacity: done ? .72 : 1, borderColor: done ? `${task.accent}35` : "rgba(255,255,255,.075)" }}>
                  <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ width:40, height:40, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background:`${task.accent}14`, color:task.accent, border:`1px solid ${task.accent}24` }}>
                      <Icon size={18}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                        <span style={{ fontSize:10, fontWeight:900, color:task.accent, letterSpacing:1 }}>#{index + 1}</span>
                        <span style={{ fontSize:13.5, fontWeight:800, color:T_COLOR.text }}>{task.title}</span>
                        <span style={{ fontSize:10, fontWeight:800, color:T_COLOR.muted, border:"1px solid rgba(255,255,255,.08)", borderRadius:99, padding:"2px 7px" }}>{task.type}</span>
                        <span style={{ fontSize:10, fontWeight:900, ...taskRoleStyle, borderRadius:99, padding:"2px 7px" }}>{taskRole}</span>
                      </div>
                      <div style={{ fontSize:11.5, color:T_COLOR.muted, lineHeight:1.45 }}>{task.instruction}</div>
                      {task.roleReason && (
                        <div style={{ marginTop:7, fontSize:10.8, color:taskRole === "Foco principal" ? "#fde68a" : "#bbf7d0", lineHeight:1.45, background:taskRole === "Foco principal" ? "rgba(251,191,36,.055)" : "rgba(52,211,153,.045)", border:taskRole === "Foco principal" ? "1px solid rgba(251,191,36,.12)" : "1px solid rgba(52,211,153,.10)", borderRadius:9, padding:"7px 8px" }}>
                          {task.roleReason}
                        </div>
                      )}
                      {task.pack && (
                        <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:9 }}>
                          <span style={{ fontSize:11, color:"#22d3ee", fontWeight:900, background:"rgba(34,211,238,.09)", border:"1px solid rgba(34,211,238,.18)", borderRadius:9, padding:"4px 8px" }}>Código: {task.pack.code}</span>
                          <span style={{ fontSize:11, color:T_COLOR.muted, fontWeight:700, background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.07)", borderRadius:9, padding:"4px 8px" }}>{task.pack.focus}</span>
                        </div>
                      )}
                      {task.workshop && (
                        <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:9 }}>
                          <span style={{ fontSize:11, color:"#38bdf8", fontWeight:900, background:"rgba(56,189,248,.09)", border:"1px solid rgba(56,189,248,.18)", borderRadius:9, padding:"4px 8px" }}>Workshop normal: {task.workshop.name}</span>
                          <span style={{ fontSize:11, color:"#34d399", fontWeight:900, background:"rgba(52,211,153,.08)", border:"1px solid rgba(52,211,153,.16)", borderRadius:9, padding:"4px 8px" }}>Epic safe · sin modos extra</span>
                          <span style={{ fontSize:11, color:T_COLOR.muted, fontWeight:700, background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.07)", borderRadius:9, padding:"4px 8px" }}>{task.workshop.focus}</span>
                          <span style={{ fontSize:10.5, color:T_COLOR.muted, fontWeight:700, width:"100%" }}>{task.workshop.howToUse}</span>
                        </div>
                      )}
                      <div style={{ marginTop:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:over ? "#fbbf24" : T_COLOR.muted, marginBottom:6 }}>
                          {isMatchTask ? (
                            <>
                              <span><Sword size={11} style={{ verticalAlign:"-2px", marginRight:4 }}/> {matchCount}/{targetCount} partidas</span>
                              <span>sin cronómetro</span>
                            </>
                          ) : (
                            <>
                              <span><Timer size={11} style={{ verticalAlign:"-2px", marginRight:4 }}/> {formatSeconds(elapsed)}</span>
                              <span>objetivo {task.minutes}:00{over ? " · overrun" : ""}</span>
                            </>
                          )}
                        </div>
                        <ProgresoBar pct={pct} gradient={over ? "linear-gradient(90deg,#fbbf24,#fb923c)" : `linear-gradient(90deg,${task.accent}88,${task.accent})`} height={6}/>
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
                      <button
                        onClick={() => isMatchTask ? updateMatchProgress(task, 1) : toggleTimer(task.id)}
                        style={{ width:38, height:38, borderRadius:11, border:`1px solid ${active || isMatchTask ? task.accent : "rgba(255,255,255,.1)"}`, background:active || isMatchTask ? `${task.accent}18` : "rgba(255,255,255,.04)", color:active || isMatchTask ? task.accent : T_COLOR.muted, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                        title={isMatchTask ? "+1 partida" : active ? "Pausar" : "Iniciar"}
                      >
                        {isMatchTask ? <Plus size={16}/> : active ? <Pause size={16}/> : <Play size={16}/>} 
                      </button>
                      <button onClick={() => toggleSubtask(task.id)} style={{ width:38, height:38, borderRadius:11, border:`1px solid ${done ? task.accent : "rgba(255,255,255,.1)"}`, background:done ? `${task.accent}18` : "rgba(255,255,255,.04)", color:done ? task.accent : T_COLOR.muted, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }} title={done ? "Desmarcar" : "Completar"}>
                        {done ? <CheckCircle2 size={17}/> : <Circle size={17}/>} 
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="g" style={{ padding:18 }}>
            <div style={S.stitle}>Cronómetro</div>
            <div style={{ fontFamily:T_FONT.display, fontSize:38, fontWeight:900, color:activeSubtaskId ? "#22d3ee" : T_COLOR.text, lineHeight:1 }}>{formatSeconds(totalElapsedSeconds)}</div>
            <div style={{ fontSize:12, color:T_COLOR.muted, margin:"6px 0 12px" }}>{activeSubtaskId ? `Activo: ${plan.subtasks.find(t => t.id === activeSubtaskId)?.title || "bloque"}` : "Sin bloque activo"}</div>
            <ProgresoBar pct={timePct} gradient="linear-gradient(90deg,#22d3ee,#7c3aed)" height={8}/>
          </div>

          <div className="g" style={{ padding:18, borderColor:allComplete ? "rgba(52,211,153,.22)" : "rgba(251,191,36,.16)" }}>
            <div style={S.stitle}>Resumen Rocket</div>
            <div style={{ display:"grid", gap:8, fontSize:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}><span style={{ color:T_COLOR.muted }}>Entrenamiento 90 min</span><b style={{ color:timedBlocksComplete ? "#34d399" : "#fbbf24" }}>{timedBlocksComplete ? "Listo" : "Pendiente"}</b></div>
              <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}><span style={{ color:T_COLOR.muted }}>Ranked opcional</span><b style={{ color:matchTask && completedSet.has(matchTask.id) ? "#34d399" : "#fbbf24" }}>{matchTask ? `${matchCount}/${matchTask.targetCount || 3}` : "—"}</b></div>
              <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}><span style={{ color:T_COLOR.muted }}>Mental</span><b style={{ color:mental.saved ? "#34d399" : "#64748b" }}>{mental.saved ? "Guardado" : "Sin guardar"}</b></div>
              <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}><span style={{ color:T_COLOR.muted }}>Foco del ciclo</span><b style={{ color:weeklyFocus.accent }}>{plan.primaryMechanicLabel || weeklyFocus.short}</b></div>
            </div>
            <div style={{ marginTop:12, color:T_COLOR.muted, fontSize:11.5, lineHeight:1.55 }}>
              Si terminás los 90 min y no tenés ganas de ranked, cerrá ahí. Ranked/1v1 es opcional: primero consistencia, después cola competitiva.
            </div>
          </div>

          {speedflipDarRecommended && <RocketSpeedflipDarCleanCancelCard recommended={speedflipDarRecommended}/>}

          <div className="g" style={{ padding:18, borderColor:"rgba(56,189,248,.18)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
              <Layers size={18} color="#38bdf8"/>
              <div style={{ ...S.stitle, marginBottom:0 }}>Workshop pausado</div>
            </div>
            <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.55 }}>
              Workshop queda fuera hasta nuevo aviso. La rutina activa usa Freeplay + Training Packs para controlar mejor la dificultad y evitar que Dribbling Challenge/Rings se vuelvan foco antes de tiempo.
            </div>
            <div style={{ display:"grid", gap:6, marginTop:10 }}>
              {ROCKET_LEAGUE_WORKSHOP_RULES.map((rule, i) => (
                <div key={rule} style={{ display:"flex", gap:8, alignItems:"flex-start", fontSize:11.2, color:T_COLOR.muted, lineHeight:1.35 }}>
                  <span style={{ color:"#38bdf8", fontWeight:900 }}>{i + 1}.</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gap:7, marginTop:12 }}>
              {Object.values(ROCKET_LEAGUE_WORKSHOP_MAPS).filter(map => map.modeSafe !== false && map.activeRotation !== false).slice(0, 6).map(map => (
                <div key={map.name} style={{ padding:10, borderRadius:11, background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.07)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    <div style={{ fontSize:12, fontWeight:900, color:T_COLOR.text }}>{map.name}</div>
                    <span style={{ fontSize:9.5, color:"#34d399", fontWeight:900, border:"1px solid rgba(52,211,153,.18)", background:"rgba(52,211,153,.08)", borderRadius:99, padding:"2px 7px" }}>sin modos extra</span>
                  </div>
                  <div style={{ fontSize:10.5, color:"#38bdf8", fontWeight:900, marginTop:2 }}>{map.source} · {map.kind}</div>
                  <div style={{ fontSize:10.5, color:T_COLOR.muted, marginTop:2 }}>{map.focus}</div>
                  <div style={{ fontSize:10.5, color:"#cbd5e1", marginTop:5, lineHeight:1.35 }}>{map.howToUse}</div>
                  <div style={{ fontSize:10, color:"#fbbf24", marginTop:5, lineHeight:1.35 }}>Evitar: {map.avoid}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="g" style={{ padding:18, borderColor:"rgba(232,121,249,.18)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
              <Target size={18} color="#e879f9"/>
              <div style={{ ...S.stitle, marginBottom:0 }}>Training Packs útiles</div>
            </div>
            <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.55 }}>
              Lista de packs que LifeOS usa según el ciclo. No son todos para el mismo día: el plan de 90 min ya elige el pack correcto para el foco actual.
            </div>
            <div style={{ display:"grid", gap:7, marginTop:12 }}>
              {[ROCKET_LEAGUE_PACKS.powershots, ROCKET_LEAGUE_PACKS.airRollShots, ROCKET_LEAGUE_PACKS.groundShots, ROCKET_LEAGUE_PACKS.shotsYouShouldntMiss, ROCKET_LEAGUE_PACKS.basicRebounds, ROCKET_LEAGUE_PACKS.shadowDefense, ROCKET_LEAGUE_PACKS.hardSaves, ROCKET_LEAGUE_PACKS.recoveryTraining, ROCKET_LEAGUE_PACKS.speedflipMusty].map(pack => (
                <div key={pack.code} style={{ padding:10, borderRadius:11, background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.07)" }}>
                  <div style={{ fontSize:12, fontWeight:900, color:T_COLOR.text }}>{pack.name}</div>
                  <div style={{ fontSize:11, color:"#e879f9", fontWeight:900, marginTop:3 }}>Código: {pack.code}</div>
                  <div style={{ fontSize:10.5, color:T_COLOR.muted, marginTop:2 }}>{pack.focus}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="g" style={{ padding:18, borderColor:"rgba(52,211,153,.18)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
              <RefreshCw size={18} color="#34d399"/>
              <div style={{ ...S.stitle, marginBottom:0 }}>Recoveries clave</div>
            </div>
            <div style={{ display:"grid", gap:8 }}>
              {ROCKET_LEAGUE_RECOVERY_TIPS.map((tip, i) => (
                <div key={tip} style={{ display:"flex", gap:8, alignItems:"flex-start", fontSize:11.5, color:T_COLOR.muted, lineHeight:1.45 }}>
                  <span style={{ color:"#34d399", fontWeight:900 }}>{i + 1}.</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="g" style={{ padding:18, borderColor:"rgba(96,165,250,.18)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
              <Gamepad2 size={18} color="#60a5fa"/>
              <div style={{ ...S.stitle, marginBottom:0 }}>DualSense PS5 preset</div>
            </div>
            <div style={{ fontSize:11.5, color:T_COLOR.muted, lineHeight:1.5, marginBottom:12 }}>
              Comprado el 5 de mayo: todavía debería aceptar zona muerta baja. Si sentís drift, subila poco a poco.
            </div>
            <div style={{ display:"grid", gap:8 }}>
              {ROCKET_LEAGUE_CONTROLLER_PRESET.map(setting => (
                <div key={setting.label} style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:8, padding:9, borderRadius:11, background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.07)" }}>
                  <div>
                    <div style={{ fontSize:11.5, color:T_COLOR.text, fontWeight:900 }}>{setting.label}</div>
                    <div style={{ fontSize:10.5, color:T_COLOR.muted, marginTop:2, lineHeight:1.35 }}>{setting.note}</div>
                  </div>
                  <div style={{ fontFamily:T_FONT.display, color:"#60a5fa", fontWeight:900, fontSize:16 }}>{setting.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="g" style={{ padding:18, borderColor:"rgba(167,139,250,.18)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:12 }}>
              <Brain size={18} color="#a78bfa"/>
              <div style={{ ...S.stitle, marginBottom:0 }}>Mental anti-tilt</div>
            </div>
            <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.55, marginBottom:14 }}>
              Si perdiste 2 seguidas por tilt, no sigas ranked. Volvé a freeplay o cerrá sesión.
            </div>
            <button onClick={markTilted} style={{ width:"100%", minHeight:42, borderRadius:12, border:"1px solid rgba(248,113,113,.32)", background:"rgba(248,113,113,.12)", color:"#fca5a5", fontWeight:900, cursor:"pointer", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <AlertTriangle size={16}/> Estoy tilteado
            </button>

            <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:.8, color:T_COLOR.muted, fontWeight:900, marginBottom:7 }}>Ranked después del entreno</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:14 }}>
              {[
                ["win", "Gané", "#34d399"],
                ["loss", "Perdí", "#f87171"],
                ["tilt", "Tilt", "#fb923c"],
                ["skip", "No ranked", "#94a3b8"],
              ].map(([key,label,color]) => (
                <button key={key} onClick={() => updateMental("rankedResult", key)} style={{ minHeight:34, borderRadius:10, border:mental.rankedResult === key ? `1px solid ${color}80` : "1px solid rgba(255,255,255,.08)", background:mental.rankedResult === key ? `${color}20` : "rgba(255,255,255,.035)", color:mental.rankedResult === key ? color : T_COLOR.muted, fontWeight:900, cursor:"pointer", fontSize:11 }}>{label}</button>
              ))}
            </div>

            {[{ key:"moodBefore", label:"Mood antes" }, { key:"moodAfter", label:"Mood después" }, { key:"tiltLevel", label:"Tilt level" }].map(group => (
              <div key={group.key} style={{ marginBottom:13 }}>
                <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:.8, color:T_COLOR.muted, fontWeight:900, marginBottom:7 }}>{group.label}</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 }}>
                  {moodOptions.map(v => {
                    const on = mental[group.key] === v;
                    return (
                      <button key={`${group.key}-${v}`} onClick={() => updateMental(group.key, v)} style={{ minHeight:34, borderRadius:10, border:on ? "1px solid rgba(167,139,250,.45)" : "1px solid rgba(255,255,255,.08)", background:on ? "rgba(167,139,250,.16)" : "rgba(255,255,255,.035)", color:on ? "#c4b5fd" : T_COLOR.muted, fontWeight:900, cursor:"pointer" }}>{v}</button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:.8, color:T_COLOR.muted, fontWeight:900, marginBottom:7 }}>Nota rápida</div>
            <textarea
              value={mental.note || ""}
              onChange={(e) => updateMental("note", e.target.value.slice(0, 600))}
              placeholder="¿Qué error repetí hoy? ¿Qué hice bien aunque perdiera? ¿Cuándo empezó el tilt?"
              style={{ width:"100%", minHeight:110, resize:"vertical", borderRadius:12, border:"1px solid rgba(255,255,255,.08)", background:"rgba(0,0,0,.18)", color:T_COLOR.text, padding:12, outline:"none", fontFamily:"inherit", fontSize:12, lineHeight:1.5 }}
            />
            <button onClick={saveMental} style={{ marginTop:10, width:"100%", minHeight:42, borderRadius:12, border:"1px solid rgba(167,139,250,.32)", background:mental.saved ? "rgba(52,211,153,.14)" : "rgba(167,139,250,.14)", color:mental.saved ? "#34d399" : "#c4b5fd", fontWeight:900, cursor:"pointer" }}>
              {mental.saved ? "Reflexión guardada" : "Guardar reflexión Rocket League"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function BlenderView() {
  const { persistent, pDispatch } = useAppData();
  const { uiDispatch } = useAppUI();

  const todayKey = useMemo(() => getBlenderDateKey(), []);
  const plan = useMemo(() => getBlenderPlanForDate(new Date()), []);
  const activeQuests = useMemo(() => getActiveQuests(persistent), [persistent.quests.customItems]);
  const blenderQuest = useMemo(
    () => activeQuests.find(q => q.id === BLENDER_PARENT_QUEST_ID) || activeQuests.find(isBlenderQuest) || QUESTS.find(q => q.id === BLENDER_PARENT_QUEST_ID),
    [activeQuests]
  );
  const questDone = Boolean(blenderQuest && (persistent.quests.completedIds || []).includes(blenderQuest.id));
  const storageKey = `lifeos:blender:${todayKey}:completedTasks`;
  const [completedTaskIds, setCompletedTaskIds] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(completedTaskIds)); } catch {}
  }, [storageKey, completedTaskIds]);

  const completedSet = useMemo(() => new Set(completedTaskIds), [completedTaskIds]);
  const completedMinutes = useMemo(
    () => plan.tasks.filter(t => completedSet.has(t.id)).reduce((sum, t) => sum + (Number(t.minutes) || 0), 0),
    [plan.tasks, completedSet]
  );
  const pct = Math.round((completedTaskIds.length / Math.max(plan.tasks.length, 1)) * 100);

  const toggleTask = useCallback((taskId) => {
    unlockLifeOSAudio();
    setCompletedTaskIds(ids => ids.includes(taskId) ? ids.filter(id => id !== taskId) : [...ids, taskId]);
    playLifeOSSound("menu");
  }, []);

  const toggleBlenderQuest = useCallback(() => {
    if (!blenderQuest) return;
    unlockLifeOSAudio();
    if (!questDone) playLifeOSSound("complete");
    const oldNivel = SELECTORS.level(persistent.xp.total);
    pDispatch(AC.questComplete(blenderQuest.id, blenderQuest.xp, oldNivel));
    const id = Date.now();
    uiDispatch(AC.setBurst(blenderQuest.id));
    uiDispatch(AC.toastAdd(id, questDone ? "Blender desmarcado" : "+12 XP", questDone ? "Bloque de Blender pendiente" : "Blender completado"));
    setTimeout(() => uiDispatch(AC.clearBurst()), 900);
    setTimeout(() => uiDispatch(AC.toastRemove(id)), 2800);
    const newNivel = SELECTORS.level(Math.max(0, persistent.xp.total + (questDone ? -blenderQuest.xp : blenderQuest.xp)));
    if (!questDone && newNivel > oldNivel) {
      setTimeout(() => { uiDispatch(AC.showNivelUp()); setTimeout(() => uiDispatch(AC.hideNivelUp()), 3200); }, 300);
    }
  }, [blenderQuest, questDone, persistent.xp.total, pDispatch, uiDispatch]);

  return (
    <div style={{ animation:"sldIn .3s ease" }}>
      <div style={S.ptitle}>Blender Trainer</div>
      <div style={S.psub}>Ruta principiante principiante · 2:40–3:40 PM · optimizada para laptop/teclado sin numpad</div>

      <div style={{ display:"grid", gridTemplateColumns:"1.35fr .65fr", gap:16, marginBottom:18 }} className="mob-layout-grid">
        <div className="g" style={{ padding:22, borderColor:"rgba(52,211,153,.18)", background:"linear-gradient(135deg,rgba(52,211,153,.08),rgba(255,255,255,.025))" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:11, color:plan.accent, fontWeight:900, letterSpacing:1.2, textTransform:"uppercase" }}>Plan de hoy</div>
              <div style={{ fontFamily:T_FONT.display, fontSize:26, fontWeight:900, color:T_COLOR.text, marginTop:4 }}>{plan.title}</div>
              <div style={{ color:T_COLOR.subtext, lineHeight:1.65, marginTop:8, maxWidth:760 }}>{plan.goal}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:T_FONT.display, fontSize:34, fontWeight:900, color:plan.accent }}>{completedMinutes}/{plan.minutes}</div>
              <div style={{ fontSize:11, color:T_COLOR.muted, fontWeight:800, textTransform:"uppercase" }}>min completados</div>
            </div>
          </div>
          <div style={{ height:9, borderRadius:999, background:"rgba(255,255,255,.07)", overflow:"hidden", marginTop:18 }}>
            <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${plan.accent}88,${plan.accent})`, transition:"width .25s ease" }}/>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginTop:14, flexWrap:"wrap" }}>
            <div style={{ fontSize:12, color:T_COLOR.muted }}>{completedTaskIds.length}/{plan.tasks.length} tareas · {pct}% del bloque</div>
            <button onClick={toggleBlenderQuest} style={{ border:`1px solid ${questDone ? "rgba(148,163,184,.25)" : "rgba(52,211,153,.32)"}`, background:questDone ? "rgba(148,163,184,.08)" : "rgba(52,211,153,.10)", color:questDone ? "#94a3b8" : "#34d399", borderRadius:12, padding:"10px 14px", fontWeight:900, cursor:"pointer" }}>
              {questDone ? "Bloque marcado" : "Marcar Blender completado"}
            </button>
          </div>
        </div>

        <div className="g" style={{ padding:22 }}>
          <div style={S.stitle}>Perfil del bloque</div>
          {[BLENDER_PROFILE.level, BLENDER_PROFILE.hardware, BLENDER_PROFILE.session].map((item, idx) => (
            <div key={idx} style={{ display:"flex", gap:8, alignItems:"flex-start", marginTop:10, color:T_COLOR.subtext, fontSize:13, lineHeight:1.5 }}>
              <CheckCircle2 size={15} color="#34d399" style={{ flexShrink:0, marginTop:2 }}/>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14, marginBottom:18 }} className="mob-layout-grid">
        {plan.tasks.map(task => {
          const done = completedSet.has(task.id);
          return (
            <div key={task.id} className="g" style={{ padding:18, borderColor:done ? `${task.accent}55` : "rgba(255,255,255,.07)", background:done ? `${task.accent}12` : "rgba(255,255,255,.03)" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                <div>
                  <div style={{ fontSize:10, color:task.accent, fontWeight:900, letterSpacing:1.1, textTransform:"uppercase" }}>{task.role} · {task.minutes} min</div>
                  <div style={{ fontFamily:T_FONT.display, fontSize:18, fontWeight:900, color:T_COLOR.text, marginTop:5 }}>{task.title}</div>
                </div>
                <button onClick={() => toggleTask(task.id)} style={{ border:`1px solid ${done ? task.accent : "rgba(255,255,255,.12)"}`, background:done ? `${task.accent}22` : "rgba(255,255,255,.04)", color:done ? task.accent : T_COLOR.subtext, borderRadius:10, padding:"8px 10px", fontWeight:900, cursor:"pointer" }}>
                  {done ? <CheckCircle2 size={17}/> : <Circle size={17}/>} 
                </button>
              </div>
              <div style={{ marginTop:12, color:T_COLOR.subtext, fontSize:13, lineHeight:1.6 }}>{task.instruction}</div>
              <div style={{ marginTop:12, padding:"10px 12px", borderRadius:12, background:"rgba(0,0,0,.18)", border:"1px solid rgba(255,255,255,.06)", color:T_COLOR.text, fontSize:12, lineHeight:1.5 }}>
                <b>Entrega:</b> {task.deliverable}
              </div>
              {task.focus?.length > 0 && (
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10 }}>
                  {task.focus.map(f => <span key={f} style={{ fontSize:10, fontWeight:800, color:task.accent, border:`1px solid ${task.accent}33`, background:`${task.accent}11`, borderRadius:999, padding:"4px 8px" }}>{f}</span>)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }} className="mob-layout-grid">
        <div className="g" style={{ padding:22 }}>
          <div style={S.stitle}>Sin teclado numérico</div>
          <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.7, marginBottom:12 }}>
            LifeOS no te va a enseñar como si tuvieras numpad. La ruta usa alternativas para laptop y teclado compacto.
          </div>
          {BLENDER_NO_NUMPAD_GUIDE.map((item, idx) => (
            <div key={idx} style={{ padding:"11px 0", borderTop:idx ? "1px solid rgba(255,255,255,.06)" : "0" }}>
              <div style={{ color:T_COLOR.text, fontWeight:900, fontSize:13 }}>{item.title}</div>
              <div style={{ color:T_COLOR.subtext, fontSize:12, lineHeight:1.6, marginTop:4 }}>{item.body}</div>
            </div>
          ))}
        </div>

        <div className="g" style={{ padding:22 }}>
          <div style={S.stitle}>Reglas de principiante</div>
          {BLENDER_BEGINNER_RULES.map((rule, idx) => (
            <div key={idx} style={{ display:"flex", gap:9, alignItems:"flex-start", color:T_COLOR.subtext, fontSize:12, lineHeight:1.55, marginTop:10 }}>
              <span style={{ color:"#34d399", fontWeight:900 }}>{idx + 1}.</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="g" style={{ padding:22, marginTop:16 }}>
        <div style={S.stitle}>Escalera de habilidades</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:12 }} className="mob-layout-grid">
          {BLENDER_SKILL_LADDER.map(step => (
            <div key={step.level} style={{ border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.03)", borderRadius:14, padding:14 }}>
              <div style={{ fontSize:10, color:"#34d399", fontWeight:900, letterSpacing:1, textTransform:"uppercase" }}>{step.level}</div>
              <div style={{ color:T_COLOR.text, fontWeight:900, marginTop:4 }}>{step.title}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:10 }}>
                {step.items.map(item => <span key={item} style={{ fontSize:10, color:T_COLOR.subtext, border:"1px solid rgba(255,255,255,.08)", borderRadius:999, padding:"4px 7px" }}>{item}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestsView() {
  const { persistent, pDispatch } = useAppData();
  const { ui, uiDispatch }        = useAppUI();

  const activeQuests = useMemo(() => getActiveQuests(persistent), [persistent.quests.customItems]);
  const completedSet = useMemo(() => SELECTORS.completedSet(persistent.quests.completedIds), [persistent.quests.completedIds]);
  const todayXp      = useMemo(() => SELECTORS.todayXp(persistent.quests.completedIds, activeQuests), [persistent.quests.completedIds, activeQuests]);
  const filtered     = useMemo(() => ui.questFilter === "all" ? activeQuests : activeQuests.filter(q => q.cat === ui.questFilter), [ui.questFilter, activeQuests]);

  const handleComplete = useCallback((q) => {
    if (q.id === ROCKET_LEAGUE_PARENT_QUEST_ID) {
      const id = Date.now();
      unlockLifeOSAudio();
      playLifeOSSound("menu");
      uiDispatch(AC.setView("rocketLeague"));
      uiDispatch(AC.toastAdd(id, "Abrí Rocket League", "La misión se completa al terminar las submisiones"));
      setTimeout(() => uiDispatch(AC.toastRemove(id)), 2700);
      return;
    }
    const wasCompleted = completedSet.has(q.id);
    unlockLifeOSAudio();
    if (!wasCompleted) playLifeOSSound("complete");
    const deltaXp = wasCompleted ? -q.xp : q.xp;
    const oldNivel = SELECTORS.level(persistent.xp.total);
    pDispatch(AC.questComplete(q.id, q.xp, oldNivel));
    const id = Date.now();
    uiDispatch(AC.setBurst(q.id));
    uiDispatch(AC.toastAdd(id, `${deltaXp > 0 ? "+" : ""}${deltaXp} XP`, wasCompleted ? `Desmarcado · ${q.title}` : q.title));
    setTimeout(() => uiDispatch(AC.clearBurst()), 900);
    setTimeout(() => uiDispatch(AC.toastRemove(id)), 2900);
    const newNivel = SELECTORS.level(Math.max(0, persistent.xp.total + deltaXp));
    if (!wasCompleted && newNivel > oldNivel) {
      setTimeout(() => { uiDispatch(AC.showNivelUp()); setTimeout(() => uiDispatch(AC.hideNivelUp()), 3200); }, 300);
    }
  }, [completedSet, persistent.xp.total, pDispatch, uiDispatch]);

  const cats = [{ id:"all", label:"Todo" },{ id:"mind", label:"Mente" },{ id:"body", label:"Cuerpo" },{ id:"work", label:"Trabajo" }];

  return (
    <div style={{ animation:"sldIn .3s ease" }}>
      <div style={S.ptitle}>Misiones diarias</div>
      <div style={S.psub}>Completá misiones para ganar XP y subir de nivel</div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:22 }}>
        {[
          { v:completedSet.size,                   l:"Completadas", a:"#34d399" },
          { v:todayXp,                              l:"XP ganados", a:"#a78bfa" },
          { v:activeQuests.length - completedSet.size,    l:"Restantes", a:"#f87171" },
        ].map((s,i) => (
          <div key={i} className="g" style={{ padding:"14px 18px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontFamily:T_FONT.display, fontSize:24, fontWeight:800, color:s.a }}>{s.v}</div>
            <div style={{ fontSize:11, color:"#64748b", fontWeight:600, textTransform:"uppercase", letterSpacing:.7 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:18 }} className="quest-filter-row">
        {cats.map(c => (
          <button key={c.id} onClick={() => uiDispatch(AC.setQuestFilter(c.id))} style={{ padding:"6px 16px", borderRadius:100, fontSize:12, fontWeight:600, textTransform:"capitalize", cursor:"pointer", border: ui.questFilter===c.id ? "1px solid rgba(124,58,237,.5)" : "1px solid rgba(255,255,255,.07)", background: ui.questFilter===c.id ? "rgba(124,58,237,.18)" : "rgba(255,255,255,.03)", color: ui.questFilter===c.id ? "#a78bfa" : "#64748b", transition:"all .2s ease" }}>{c.label}</button>
        ))}
      </div>

      <div className="ql">
        {filtered.map(q => (
          <QuestItem key={q.id} q={q} completed={completedSet.has(q.id)} onComplete={handleComplete} isBurst={ui.burstQuestId === q.id}/>
        ))}
      </div>
    </div>
  );
}

function ScheduleView() {
  const { persistent, pDispatch } = useAppData();
  const { ui, uiDispatch }        = useAppUI();

  const activeQuests = useMemo(() => getActiveQuests(persistent), [persistent.quests.customItems]);
  const completedSet = useMemo(() => SELECTORS.completedSet(persistent.quests.completedIds), [persistent.quests.completedIds]);
  const swimDays  = useMemo(() => SELECTORS.swimDays(persistent.planner.swimPairIndex), [persistent.planner.swimPairIndex]);
  const sel       = ui.scheduleDay;
  const [scheduleNow, setScheduleNow] = useState(() => Date.now());
  const scheduleWeekKey = getScheduleWeekKey(new Date(scheduleNow));
  const missionResetCountdown = formatCountdownSeconds(getSecondsUntilNextLocalDay(scheduleNow));
  const weeklyRemixCountdown = formatCountdownSeconds(getSecondsUntilNextScheduleWeek(scheduleNow));
  const sched     = useMemo(() => getScheduleBlocks(sel, swimDays, activeQuests, scheduleWeekKey), [sel, swimDays, activeQuests, scheduleWeekKey]);
  const allBlocks = useMemo(() => [...(sched.main||[]),...(sched.morning||[]),...(sched.afternoon||[])], [sched]);

  useEffect(() => {
    const interval = setInterval(() => setScheduleNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  const missionBlocks = useMemo(() => allBlocks.filter(b => b.questId), [allBlocks]);

  const load   = useMemo(() => calcLoad(allBlocks.filter(b => b.type !== "BUFFER")), [allBlocks]);
  const li     = loadInfo(load);

  const typeMins = useCallback((type) => allBlocks.filter(b => b.type === type).reduce((sum,b) => sum + b.duration, 0), [allBlocks]);
  const focusMin = useMemo(() => typeMins("FOCUS"),    [typeMins]);
  const creMin   = useMemo(() => typeMins("CREATIVE"), [typeMins]);
  const flowMin  = useMemo(() => typeMins("FLOW"),     [typeMins]);
  const skillMin = useMemo(() => typeMins("SKILL"),    [typeMins]);
  const recMin   = useMemo(() => (typeMins("RECOVERY") + typeMins("BUFFER")), [typeMins]);

  const completedMissionCount = useMemo(() => missionBlocks.filter(b => completedSet.has(b.questId)).length, [missionBlocks, completedSet]);
  const missionPct = missionBlocks.length ? Math.round((completedMissionCount / missionBlocks.length) * 100) : 0;
  const missedRisk = useMemo(() => calculateMissedQuestPenalty(persistent, persistent.quests.completedIds), [persistent, persistent.quests.completedIds]);

  const handleQuestComplete = useCallback((q) => {
    if (!q) return;
    if (q.id === ROCKET_LEAGUE_PARENT_QUEST_ID) {
      const id = Date.now();
      unlockLifeOSAudio();
      playLifeOSSound("menu");
      uiDispatch(AC.setView("rocketLeague"));
      uiDispatch(AC.toastAdd(id, "Abrí Rocket League", "La misión se completa al terminar las submisiones"));
      setTimeout(() => uiDispatch(AC.toastRemove(id)), 2700);
      return;
    }
    const wasCompleted = completedSet.has(q.id);
    unlockLifeOSAudio();
    if (!wasCompleted) playLifeOSSound("complete");
    const deltaXp = wasCompleted ? -q.xp : q.xp;
    const oldNivel = SELECTORS.level(persistent.xp.total);
    pDispatch(AC.questComplete(q.id, q.xp, oldNivel));
    const id = Date.now();
    uiDispatch(AC.setBurst(q.id));
    uiDispatch(AC.toastAdd(id, `${deltaXp > 0 ? "+" : ""}${deltaXp} XP`, wasCompleted ? `Desmarcado · ${q.title}` : `Completado desde Horario · ${q.title}`));
    setTimeout(() => uiDispatch(AC.clearBurst()), 900);
    setTimeout(() => uiDispatch(AC.toastRemove(id)), 2900);
    const newNivel = SELECTORS.level(Math.max(0, persistent.xp.total + deltaXp));
    if (!wasCompleted && newNivel > oldNivel) {
      setTimeout(() => { uiDispatch(AC.showNivelUp()); setTimeout(() => uiDispatch(AC.hideNivelUp()), 3200); }, 300);
    }
  }, [completedSet, persistent.xp.total, pDispatch, uiDispatch]);

  const TimelineSection = ({ blocks, label, labelColor, labelBg, labelBorder }) => (
    <div className="g" style={{ padding:"18px 16px 16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ ...S.stitle, marginBottom:0, fontSize:15 }}>{DAY_FULL[sel]}</div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {label && <span style={{ fontSize:10, fontWeight:700, letterSpacing:.6, color:labelColor, background:labelBg, border:`1px solid ${labelBorder}`, borderRadius:100, padding:"2px 9px" }}>{label}</span>}
          {blocks[0] && <span style={{ fontSize:11, color:"#475569" }}>{fmt(blocks[0].startMin)} – {fmt(blocks[blocks.length-1].endMin)}</span>}
        </div>
      </div>
      <div className="tl-wrap">
        {blocks.map((b,i) => (
          <TimelineBlock
            key={`${b.key}-${i}`}
            block={b}
            showConnector={i < blocks.length-1}
            completed={b.questId ? completedSet.has(b.questId) : false}
            onComplete={handleQuestComplete}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ animation:"sldIn .3s ease" }}>
      <div style={S.ptitle} className="mob-ptitle">Horario</div>
      <div style={S.psub} className="mob-psub">Tus misiones diarias ordenadas por tiempo. Misiones = qué hacer · Horario = cuándo hacerlo.</div>

      <div className="g" style={{ padding:16, marginBottom:16, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, borderColor:"rgba(34,211,238,.16)", background:"rgba(34,211,238,.035)" }}>
        <div>
          <div style={{ fontSize:10, color:T_COLOR.muted, textTransform:"uppercase", letterSpacing:.8, fontWeight:900, marginBottom:4 }}>Reset diario de misiones</div>
          <div style={{ fontFamily:T_FONT.display, fontSize:24, fontWeight:900, color:"#22d3ee", fontVariantNumeric:"tabular-nums" }}>{missionResetCountdown}</div>
          <div style={{ fontSize:11, color:T_COLOR.muted, marginTop:3 }}>Al llegar a 00:00 se limpian completadas y las pendientes restan XP.</div>
        </div>
        <div>
          <div style={{ fontSize:10, color:T_COLOR.muted, textTransform:"uppercase", letterSpacing:.8, fontWeight:900, marginBottom:4 }}>Próxima randomización semanal</div>
          <div style={{ fontFamily:T_FONT.display, fontSize:24, fontWeight:900, color:"#a78bfa", fontVariantNumeric:"tabular-nums" }}>{weeklyRemixCountdown}</div>
          <div style={{ fontSize:11, color:T_COLOR.muted, marginTop:3 }}>Semana activa: {scheduleWeekKey} · las horas cambian cada 7 días.</div>
        </div>
      </div>

      <div className="g" style={{ padding:16, marginBottom:16, borderColor:"rgba(96,165,250,.16)", background:"rgba(96,165,250,.035)" }}>
        {(() => {
          const selectedDateKey = getDateKeyForScheduleDay(scheduleWeekKey, sel);
          const rest = LIFEOS_MANUAL_REST_DAYS[selectedDateKey];
          const calcPlan = getCalculusPlanForDate(selectedDateKey);
          return rest ? (
            <>
              <div style={{ fontSize:10, color:"#86efac", textTransform:"uppercase", letterSpacing:.8, fontWeight:900, marginBottom:5 }}>Día libre manual</div>
              <div style={{ fontSize:14, color:"#e5e7eb", fontWeight:900 }}>{rest.label}</div>
              <div style={{ fontSize:12, color:T_COLOR.muted, marginTop:4 }}>{rest.note}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize:10, color:"#60a5fa", textTransform:"uppercase", letterSpacing:.8, fontWeight:900, marginBottom:5 }}>Cálculo · 8:10 AM – 9:45 AM</div>
              <div style={{ fontSize:14, color:"#e5e7eb", fontWeight:900 }}>{calcPlan.topic}</div>
              <div style={{ fontSize:12, color:T_COLOR.muted, marginTop:4 }}>{calcPlan.mode} · {calcPlan.source}</div>
            </>
          );
        })()}
      </div>

      <div className="sch-day-tabs">
        {DAY_NAMES.map((d, i) => (
          <div key={i} className={`sdt${sel===i?" sel":""}${i===todayIdx&&sel!==i?" today":""}`} onClick={() => uiDispatch(AC.scheduleSelectDay(i))}>
            {d}
            {i===todayIdx && <span style={{ marginLeft:4, fontSize:10, color:"#22d3ee", verticalAlign:"middle" }}>•</span>}
          </div>
        ))}
      </div>

      <div className="sch-main-grid">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="g load-bar-wrap" style={{ borderColor:`${li.color}20`, background:`${li.color}06` }}>
            <div style={{ flexShrink:0 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:li.color, marginBottom:2 }}>{li.label}</div>
              <div style={{ fontSize:11, color:"#4b5563" }}>Carga estimada · {load}/100</div>
            </div>
            <div className="load-bar-track"><div className="load-bar-fill" style={{ width:`${load}%`, background:li.bar }}/></div>
            <div style={{ fontSize:20, fontWeight:800, color:li.color, fontFamily:T_FONT.display, flexShrink:0 }}>{load}</div>
          </div>

          {sched.main && <TimelineSection blocks={sched.main}/>} 
          {sched.morning && (
            <>
              <TimelineSection blocks={sched.morning} label="Mañana" labelColor="#34d399" labelBg="rgba(52,211,153,.1)" labelBorder="rgba(52,211,153,.22)"/>
              <TimelineSection blocks={sched.afternoon} label="Tarde" labelColor="#a78bfa" labelBg="rgba(167,139,250,.1)" labelBorder="rgba(167,139,250,.22)"/>
            </>
          )}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
          <div className="g" style={{ padding:18 }}>
            <div style={{ ...S.stitle, fontSize:14, marginBottom:12 }}>Progreso del día</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:12, color:T_COLOR.muted }}>{completedMissionCount}/{missionBlocks.length} misiones</span>
              <span style={{ fontSize:20, fontWeight:900, color:missionPct >= 100 ? "#34d399" : "#a78bfa", fontFamily:T_FONT.display }}>{missionPct}%</span>
            </div>
            <ProgresoBar pct={missionPct} gradient="linear-gradient(90deg,#7c3aed,#06b6d4)" height={8}/>
            <div style={{ fontSize:11.5, color:T_COLOR.muted, lineHeight:1.6, marginTop:10 }}>
              Si completás una tarjeta aquí, también se marca en Misiones. Si la desmarcás desde Misiones, el Horario se actualiza.
            </div>
            <div style={{ marginTop:10, padding:"10px 11px", borderRadius:12, background:missedRisk.missedXp > 0 ? "rgba(248,113,113,.07)" : "rgba(52,211,153,.06)", border:`1px solid ${missedRisk.missedXp > 0 ? "rgba(248,113,113,.18)" : "rgba(52,211,153,.16)"}`, color:missedRisk.missedXp > 0 ? "#f87171" : "#34d399", fontSize:12, fontWeight:900 }}>
              XP en riesgo al reset: -{missedRisk.missedXp}
            </div>
          </div>

          <div className="g" style={{ padding:18 }}>
            <div style={{ ...S.stitle, fontSize:14, marginBottom:12 }}>Distribución</div>
            {[
              { l:"Estudio profundo", v: fmtDur(focusMin), c:"#a78bfa" },
              { l:"Creativo",         v: fmtDur(creMin),   c:"#22d3ee" },
              { l:"Rocket League",    v: fmtDur(flowMin),  c:"#34d399" },
              { l:"Skill",            v: fmtDur(skillMin), c:"#fb923c" },
              { l:"Reset/descanso",   v: fmtDur(recMin),   c:"#86efac" },
            ].map(s => (
              <div key={s.l} className="day-stat-row">
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <div style={{ width:7, height:7, borderRadius:2, background:s.c, flexShrink:0 }}/>
                  <span style={{ fontSize:12, color:"#64748b" }}>{s.l}</span>
                </div>
                <span style={{ fontSize:12.5, fontWeight:700, color:s.c, fontVariantNumeric:"tabular-nums" }}>{s.v}</span>
              </div>
            ))}
          </div>

          <div className="g" style={{ padding:18, borderColor:"rgba(34,211,238,.16)", background:"rgba(34,211,238,.035)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <Lightbulb size={15} color="#22d3ee"/>
              <div style={{ ...S.stitle, fontSize:14, marginBottom:0 }}>Arquitectura limpia</div>
            </div>
            <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.7 }}>
              Plan semanal se fusionó con Horario. Editá tus misiones en Ajustes: el horario las reordena con una rotación semanal estable para que no caigan siempre a la misma hora.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmartPlannerView() {
  const { persistent, pDispatch } = useAppData();
  const { ui, uiDispatch }        = useAppUI();

  const swimDays    = useMemo(() => SELECTORS.swimDays(persistent.planner.swimPairIndex), [persistent.planner.swimPairIndex]);
  const plannerMode = ui.plannerMode;
  const selDay      = ui.plannerDay ?? todayIdx;

  const weekData = useMemo(() => DAY_NAMES.map((d, i) => {
    const s       = getScheduleBlocks(i, swimDays);
    const all     = [...(s.main||[]), ...(s.morning||[]), ...(s.afternoon||[])];
    const active  = all.filter(b => b.type !== "BUFFER");
    const byType  = (type) => all.filter(b => b.type === type).reduce((s, b) => s + b.duration, 0);
    const li      = loadInfo(calcLoad(active));
    return {
      d, i, all, active,
      load:       calcLoad(active),
      li,
      swim:       swimDays.includes(i),
      focusMin:   byType("FOCUS"),
      creMin:     byType("CREATIVE"),
      flowMin:    byType("FLOW"),
      physMin:    byType("PHYSICAL"),
      recMin:     byType("RECOVERY"),
      totalMin:   all.reduce((s, b) => s + b.duration, 0),
    };
  }), [swimDays]);

  const selDayData = weekData[selDay];

  const weekMetrics = useMemo(() => {
    const totFocus    = weekData.reduce((s, d) => s + d.focusMin, 0);
    const totCreative = weekData.reduce((s, d) => s + d.creMin, 0);
    const totFlow     = weekData.reduce((s, d) => s + d.flowMin, 0);
    const totPhys     = weekData.reduce((s, d) => s + d.physMin, 0);
    const totRec      = weekData.reduce((s, d) => s + d.recMin, 0);
    const grand       = totFocus + totCreative + totFlow + totPhys + totRec;
    const avgLoad     = weekData.reduce((s, d) => s + d.load, 0) / 7;
    const peakLoad    = Math.max(...weekData.map(d => d.load));
    const swimCount   = swimDays.length;
    return { totFocus, totCreative, totFlow, totPhys, totRec, grand, avgLoad, peakLoad, swimCount };
  }, [weekData, swimDays]);

  const heatmapData = useMemo(() => {
    const SLOTS = [9,10,11,12,14,15,16,17,18,19,20,21];
    return SLOTS.map(h => {
      const timeMin = h * 60;
      return {
        hour: fmt(timeMin),
        days: weekData.map(d => {
          const block = d.all.find(b => b.startMin <= timeMin && b.endMin > timeMin);
          if (!block) return { type:"EMPTY", color:"rgba(255,255,255,.03)" };
          return { type: block.type, color: ACT_TYPES[block.type]?.color || "#475569", bg: ACT_TYPES[block.type]?.bg || "transparent" };
        }),
      };
    });
  }, [weekData]);

  const intelRecs = useMemo(() => {
    const recs = [];
    if (weekMetrics.peakLoad > 80) recs.push({ icon:"⚡", priority:"HIGH", color:"#f87171", title:"Peak load alert", desc:`${DAY_NAMES[weekData.findIndex(d => d.load === weekMetrics.peakLoad)]} is at ${weekMetrics.peakLoad}% cognitive load. Add a recovery buffer or reduce one activity.` });
    if (weekMetrics.totRec < 120) recs.push({ icon:"🌿", priority:"HIGH", color:"#34d399", title:"Recovery deficit", desc:`Only ${fmtDur(weekMetrics.totRec)} of recovery scheduled this week. Burnout risk increases above 5 consecutive high-load days.` });
    if (weekMetrics.swimCount < 2) recs.push({ icon:"🏊", priority:"MED", color:"#60a5fa", title:"Physical underscheduled", desc:"Less than 2 swim sessions this week. Physical activity is a compounding cognitive investment." });
    if (weekMetrics.totFocus / (weekMetrics.grand || 1) > 0.45) recs.push({ icon:"🎯", priority:"MED", color:"#a78bfa", title:"Focus-heavy week", desc:"Over 45% of productive time is deep focus. Consider interleaving more creative or flow blocks to sustain output quality." });
    if (weekMetrics.avgLoad < 35) recs.push({ icon:"📈", priority:"LOW", color:"#fbbf24", title:"Underloaded week", desc:"Average load is below 35. You have capacity to add a skill block or extend a focus session without burnout risk." });
    if (recs.length === 0) recs.push({ icon:"✅", priority:"LOW", color:"#34d399", title:"Week looks balanced", desc:"Load distribution, recovery, and activity mix are within optimal ranges. Execute with consistency." });
    return recs;
  }, [weekMetrics, weekData]);

  const pctOf = (v) => Math.round((v / (weekMetrics.grand || 1)) * 100);

  return (
    <div style={{ animation:"sldIn .3s ease" }}>
      <div style={S.ptitle} className="mob-ptitle">Week Planner</div>
      <div style={S.psub} className="mob-psub">Cognitive architecture · load distribution · recovery intelligence</div>

      <div className="wp-strip">
        {weekData.map(d => {
          const isToday = d.i === todayIdx;
          const isSel   = d.i === selDay;
          const li      = d.li;
          return (
            <div key={d.i} className={`wp-day${isToday?" wp-today":""}${isSel?" wp-sel":""}`} onClick={() => uiDispatch(AC.plannerSelectDay(d.i))}>
              {isToday && <div className="wp-today-ring"/>}
              <div className={`wp-day-name${isToday?" wdn-today":""}${isSel?" wdn-sel":""}`}>{d.d}</div>
              <div className="wp-load-num" style={{ color: li.color }}>{d.load}</div>
              <div className="wp-sys-dots">
                {d.all.filter(b => b.type !== "BUFFER" && b.type !== "RECOVERY").slice(0,5).map((b,bi) => (
                  <div key={bi} className="wp-sys-dot" style={{ background: ACT_TYPES[b.type]?.color || "#475569" }}/>
                ))}
              </div>
              {d.swim && <div style={{ fontSize:9, marginTop:4 }}>🏊</div>}
            </div>
          );
        })}
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:0 }}>
        <div className="wp-mode-tabs">
          {[["timeline","Timeline"],["heatmap","Heatmap"],["intel","Intelligence"]].map(([m,l]) => (
            <button key={m} className={`wp-mode-btn ${plannerMode===m?"on":""}`} onClick={() => uiDispatch(AC.plannerSetMode(m))}>{l}</button>
          ))}
        </div>
        <button onClick={() => pDispatch(AC.plannerRegenSwim())} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, color:"#60a5fa", background:"rgba(96,165,250,.08)", border:"1px solid rgba(96,165,250,.22)", borderRadius:7, padding:"5px 10px", cursor:"pointer" }}>
          <RefreshCw size={11}/>Regenerate Swim
        </button>
      </div>

      <div style={{ marginTop:18 }}>
        {plannerMode === "timeline" && (
          <div className="planner-tl-grid">
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div className="g" style={{ padding:"16px 16px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <div style={{ fontFamily:T_FONT.display, fontSize:15, fontWeight:800, color:T_COLOR.text }}>{DAY_FULL[selDay]}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {selDayData.swim && <span style={{ fontSize:10, fontWeight:700, color:"#60a5fa", background:"rgba(96,165,250,.1)", border:"1px solid rgba(96,165,250,.28)", borderRadius:100, padding:"2px 9px" }}>🏊 Swim</span>}
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:.5, color:selDayData.li.color, background:`${selDayData.li.color}12`, border:`1px solid ${selDayData.li.color}25`, borderRadius:100, padding:"2px 9px" }}>{selDayData.li.label} · {selDayData.load}</span>
                  </div>
                </div>
                <div className="tl-wrap">
                  {selDayData.all.map((b,i) => <TimelineBlock key={`wp-${b.key}-${i}`} block={b} showConnector={i < selDayData.all.length-1}/>)}
                </div>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div className="g" style={{ padding:18 }}>
                <div style={{ ...S.stitle, fontSize:14, marginBottom:14 }}>Day at a Glance</div>
                {[
                  { l:"Deep Focus",  v:selDayData.focusMin, c:"#a78bfa" },
                  { l:"Creative",    v:selDayData.creMin,   c:"#22d3ee" },
                  { l:"Flow State",  v:selDayData.flowMin,  c:"#34d399" },
                  { l:"Physical",    v:selDayData.physMin,  c:"#60a5fa" },
                  { l:"Recovery",    v:selDayData.recMin,   c:"#86efac" },
                ].map(s => (
                  <div key={s.l} className="wp-balance-row">
                    <div className="wp-balance-label">{s.l}</div>
                    <div className="wp-balance-track">
                      <div className="wp-balance-fill" style={{ width:`${Math.min(100, s.v / 1.5)}%`, background:s.c }}/>
                    </div>
                    <div className="wp-balance-val" style={{ color: s.v > 0 ? s.c : "#2d3748" }}>{s.v > 0 ? fmtDur(s.v) : "—"}</div>
                  </div>
                ))}
              </div>

              <div className="g" style={{ padding:18 }}>
                <div style={{ ...S.stitle, fontSize:14, marginBottom:14 }}>Week Summary</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    { l:"Avg Load",    v:`${Math.round(weekMetrics.avgLoad)}%`, c:"#a78bfa" },
                    { l:"Peak Load",   v:`${weekMetrics.peakLoad}%`,            c:"#f87171" },
                    { l:"Focus Total", v:fmtDur(weekMetrics.totFocus),          c:"#22d3ee" },
                    { l:"Swim Days",   v:weekMetrics.swimCount,                 c:"#60a5fa" },
                  ].map(s => (
                    <div key={s.l} style={{ padding:"12px 14px", borderRadius:10, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)" }}>
                      <div style={{ fontFamily:T_FONT.display, fontSize:18, fontWeight:800, color:s.c, lineHeight:1 }}>{s.v}</div>
                      <div style={{ fontSize:9.5, color:"#475569", fontWeight:600, letterSpacing:.5, marginTop:3, textTransform:"uppercase" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {intelRecs.slice(0,2).map((rec,i) => (
                <div key={i} className="wp-intel-rec" style={{ borderColor:`${rec.color}20`, background:`${rec.color}06`, animationDelay:`${i*.1}s` }}>
                  <div style={{ fontSize:16, flexShrink:0, lineHeight:1 }}>{rec.icon}</div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:rec.color }}>{rec.title}</div>
                      <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:.8, padding:"2px 6px", borderRadius:100, background:`${rec.color}15`, color:rec.color, border:`1px solid ${rec.color}25` }}>{rec.priority}</div>
                    </div>
                    <div style={{ fontSize:11.5, color:"#64748b", lineHeight:1.55 }}>{rec.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {plannerMode === "heatmap" && (
          <div className="planner-hm-grid">
            <div className="g" style={{ padding:20 }}>
              <div style={{ ...S.stitle, fontSize:14, marginBottom:14 }}>Activity Heatmap</div>
              <div className="hm-scroll-wrap">
              <div className="hm-inner">
              <div style={{ display:"grid", gridTemplateColumns:"48px repeat(7,1fr)", gap:4, marginBottom:6 }}>
                <div/>
                {DAY_NAMES.map((d,i) => (
                  <div key={i} style={{ textAlign:"center", fontSize:9, fontWeight:700, color: i===todayIdx ? "#22d3ee" : "#475569", letterSpacing:.5, textTransform:"uppercase" }}>{d}</div>
                ))}
              </div>
              {heatmapData.map((row, ri) => (
                <div key={ri} style={{ display:"grid", gridTemplateColumns:"48px repeat(7,1fr)", gap:4, marginBottom:4 }}>
                  <div style={{ fontSize:9, fontWeight:600, color:"#374151", display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:8, fontVariantNumeric:"tabular-nums" }}>{row.hour}</div>
                  {row.days.map((cell, ci) => (
                    <div
                      key={ci}
                      className="wp-hm-cell"
                      title={cell.type !== "EMPTY" ? ACT_TYPES[cell.type]?.label : ""}
                      style={{ height:18, background: cell.type === "EMPTY" ? "rgba(255,255,255,.025)" : `${cell.color}30`, border:`1px solid ${cell.type === "EMPTY" ? "rgba(255,255,255,.04)" : `${cell.color}20`}`, borderRadius:4 }}
                    />
                  ))}
                </div>
              ))}
              </div>
              </div>
              <div style={{ display:"flex", gap:12, marginTop:14, flexWrap:"wrap" }}>
                {Object.entries(ACT_TYPES).filter(([k]) => k !== "BUFFER").map(([key, v]) => (
                  <div key={key} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:10, height:10, borderRadius:2, background:`${v.color}50`, border:`1px solid ${v.color}40` }}/>
                    <span style={{ fontSize:9.5, color:"#475569", fontWeight:600 }}>{v.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div className="g" style={{ padding:18 }}>
                <div style={{ ...S.stitle, fontSize:14, marginBottom:14 }}>Week Balance</div>
                {[
                  { l:"Focus",     v:weekMetrics.totFocus,    c:"#a78bfa" },
                  { l:"Creative",  v:weekMetrics.totCreative, c:"#22d3ee" },
                  { l:"Flow",      v:weekMetrics.totFlow,     c:"#34d399" },
                  { l:"Physical",  v:weekMetrics.totPhys,     c:"#60a5fa" },
                  { l:"Recovery",  v:weekMetrics.totRec,      c:"#86efac" },
                ].map(s => (
                  <div key={s.l} className="wp-balance-row">
                    <div className="wp-balance-label">{s.l}</div>
                    <div className="wp-balance-track">
                      <div className="wp-balance-fill" style={{ width:`${pctOf(s.v)}%`, background:s.c }}/>
                    </div>
                    <div className="wp-balance-val" style={{ color: s.v > 0 ? s.c : "#2d3748" }}>{pctOf(s.v)}%</div>
                  </div>
                ))}
              </div>

              <div className="wp-sys-grid" style={{ gridTemplateColumns:"1fr 1fr", gap:9 }}>
                {[
                  { label:"Focus Hours",  val:fmtDur(weekMetrics.totFocus),    pct:Math.round(weekMetrics.totFocus/420*100),   color:"#a78bfa", status: weekMetrics.totFocus > 300 ? "PEAK" : "OK" },
                  { label:"Swim Days",    val:`${weekMetrics.swimCount}/3`,     pct:Math.round(weekMetrics.swimCount/3*100),    color:"#60a5fa", status: weekMetrics.swimCount >= 2 ? "ON TRACK" : "LOW" },
                  { label:"Recovery",     val:fmtDur(weekMetrics.totRec),       pct:Math.round(weekMetrics.totRec/210*100),    color:"#86efac", status: weekMetrics.totRec > 120 ? "HEALTHY" : "LOW" },
                  { label:"Flow State",   val:fmtDur(weekMetrics.totFlow),      pct:Math.round(weekMetrics.totFlow/420*100),   color:"#34d399", status: weekMetrics.totFlow > 200 ? "STRONG" : "OK" },
                ].map((s,i) => (
                  <div key={i} className="wp-sys-card">
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div style={{ fontSize:10, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:.6 }}>{s.label}</div>
                      <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:.7, padding:"2px 6px", borderRadius:100, background:`${s.color}15`, color:s.color, border:`1px solid ${s.color}25`, whiteSpace:"nowrap" }}>{s.status}</div>
                    </div>
                    <div style={{ fontFamily:T_FONT.display, fontSize:18, fontWeight:800, color:s.color, marginTop:6, lineHeight:1 }}>{s.val}</div>
                    <div className="wp-sys-bar-track">
                      <div className="wp-sys-bar-fill" style={{ width:`${Math.min(100,s.pct)}%`, background:s.color }}/>
                    </div>
                    <div style={{ fontSize:9, color:"#374151" }}>{s.pct}% of weekly target</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {plannerMode === "intel" && (
          <div className="planner-intel-grid">
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div className="g" style={{ padding:18 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:"rgba(167,139,250,.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Lightbulb size={15} color="#a78bfa"/>
                  </div>
                  <div style={{ fontFamily:T_FONT.display, fontSize:14, fontWeight:800, color:T_COLOR.text }}>Week Intelligence</div>
                </div>
                {intelRecs.map((rec, i) => (
                  <div key={i} className="wp-intel-rec" style={{ borderColor:`${rec.color}20`, background:`${rec.color}05`, animationDelay:`${i*.08}s`, animation:"rfSlideIn .35s ease both" }}>
                    <div style={{ fontSize:18, flexShrink:0, lineHeight:1, marginTop:1 }}>{rec.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                        <div style={{ fontSize:12.5, fontWeight:700, color:rec.color }}>{rec.title}</div>
                        <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:.8, padding:"2px 6px", borderRadius:100, background:`${rec.color}14`, color:rec.color, border:`1px solid ${rec.color}22` }}>{rec.priority}</div>
                      </div>
                      <div style={{ fontSize:11.5, color:"#64748b", lineHeight:1.6 }}>{rec.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="g" style={{ padding:18 }}>
                <div style={{ ...S.stitle, fontSize:14, marginBottom:14 }}>Load Distribution</div>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={weekData} barSize={14} margin={{ top:0, right:0, left:-30, bottom:0 }}>
                    <defs>
                      <linearGradient id="wpl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity={.9}/>
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={.3}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="d" tick={{ fill:"#475569", fontSize:9 }} axisLine={false} tickLine={false}/>
                    <YAxis hide domain={[0,100]}/>
                    <Tooltip contentStyle={{ background:"rgba(7,7,15,.97)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, fontSize:11 }} cursor={{ fill:"rgba(255,255,255,.03)" }} formatter={v => [`${v}%`, "Load"]}/>
                    <Bar dataKey="load" fill="url(#wpl)" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div className="wp-sys-grid">
                {[
                  { label:"Avg Cognitive Load", val:`${Math.round(weekMetrics.avgLoad)}%`, pct:weekMetrics.avgLoad, color: weekMetrics.avgLoad > 70 ? "#f87171" : weekMetrics.avgLoad > 50 ? "#a78bfa" : "#34d399", icon:"🧠", status: weekMetrics.avgLoad > 70 ? "HEAVY" : "OPTIMAL" },
                  { label:"Focus Depth",         val:fmtDur(weekMetrics.totFocus),          pct:Math.min(100,weekMetrics.totFocus/420*100),    color:"#22d3ee", icon:"🎯", status: weekMetrics.totFocus > 300 ? "DEEP" : "SURFACE" },
                  { label:"Recovery Ratio",      val:`${Math.round(weekMetrics.totRec/(weekMetrics.grand||1)*100)}%`, pct:Math.min(100,weekMetrics.totRec/210*100), color:"#86efac", icon:"🌿", status: weekMetrics.totRec > 120 ? "HEALTHY" : "RISK" },
                ].map((s,i) => (
                  <div key={i} className="wp-sys-card" style={{ borderColor:`${s.color}18` }}>
                    <div style={{ fontSize:16, marginBottom:8, lineHeight:1 }}>{s.icon}</div>
                    <div style={{ fontSize:10, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:.6, marginBottom:4 }}>{s.label}</div>
                    <div style={{ fontFamily:T_FONT.display, fontSize:22, fontWeight:800, color:s.color, lineHeight:1 }}>{s.val}</div>
                    <div className="wp-gauge-track">
                      <div className="wp-gauge-fill" style={{ width:`${s.pct}%`, background:`linear-gradient(90deg,${s.color}60,${s.color})` }}/>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:9.5, color:"#374151" }}>{Math.round(s.pct)}% of target</div>
                      <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:.7, padding:"2px 6px", borderRadius:100, background:`${s.color}14`, color:s.color }}>{s.status}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="g" style={{ padding:18 }}>
                <div style={{ ...S.stitle, fontSize:14, marginBottom:14 }}>Weekly Activity Split</div>
                {[
                  { l:"Deep Focus",  v:weekMetrics.totFocus,    c:"#a78bfa" },
                  { l:"Creative",    v:weekMetrics.totCreative, c:"#22d3ee" },
                  { l:"Flow State",  v:weekMetrics.totFlow,     c:"#34d399" },
                  { l:"Physical",    v:weekMetrics.totPhys,     c:"#60a5fa" },
                  { l:"Recovery",    v:weekMetrics.totRec,      c:"#86efac" },
                ].map(s => (
                  <div key={s.l} className="wp-balance-row">
                    <div className="wp-balance-label">{s.l}</div>
                    <div className="wp-balance-track">
                      <div className="wp-balance-fill" style={{ width:`${pctOf(s.v)}%`, background:s.c }}/>
                    </div>
                    <div className="wp-balance-val" style={{ color: s.v > 0 ? s.c : "#2d3748" }}>{fmtDur(s.v)}</div>
                  </div>
                ))}
              </div>

              <div className="g" style={{ padding:16, background:"rgba(134,239,172,.04)", borderColor:"rgba(134,239,172,.14)" }}>
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ fontSize:16, flexShrink:0 }}>🌱</div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:"#86efac", marginBottom:3 }}>Sustainability First</div>
                    <div style={{ fontSize:11, color:"#4b5563", lineHeight:1.65 }}>Consistent 65–75% load with adequate recovery outperforms peak effort followed by burnout every time. Plan for the long game.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const RARITY_STYLE = {
  COMMON:    ["#94a3b8","rgba(148,163,184,.12)"],
  RARE:      ["#60a5fa","rgba(96,165,250,.12)"],
  EPIC:      ["#a78bfa","rgba(167,139,250,.14)"],
  LEGENDARY: ["#fbbf24","rgba(251,191,36,.14)"],
};

function AchievementsView() {
  const { persistent } = useAppData();
  const unlockedIds = Array.isArray(persistent?.achievements?.unlockedIds)
    ? persistent.achievements.unlockedIds
    : [];

  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;
  const pct = totalCount === 0 ? 0 : Math.round((unlockedCount / totalCount) * 100);

  return (
    <div style={{ animation:"sldIn .3s ease" }}>
      <div style={S.ptitle}>Logros</div>
      <div style={S.psub}>{unlockedCount} de {totalCount} desbloqueados · Seguí empujando tus límites</div>

      <div className="g" style={{ padding:18, marginBottom:18, background:"rgba(124,58,237,.045)", borderColor:"rgba(124,58,237,.16)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:14, marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:12, background:"rgba(167,139,250,.13)", border:"1px solid rgba(167,139,250,.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Trophy size={18} color="#a78bfa" />
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:T_COLOR.text }}>Progreso de logros</div>
              <div style={{ fontSize:11.5, color:T_COLOR.muted, marginTop:2 }}>{unlockedCount} desbloqueados · {totalCount - unlockedCount} pendientes</div>
            </div>
          </div>
          <div style={{ fontFamily:T_FONT.display, fontWeight:800, color:"#a78bfa", fontSize:18 }}>{pct}%</div>
        </div>
        <ProgresoBar pct={pct} gradient="linear-gradient(90deg,#7c3aed,#06b6d4)" height={6}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 }}>
        {ACHIEVEMENTS.map(a => {
          const I = a.icon || Trophy;
          const unlocked = unlockedIds.includes(a.id);
          const [col, bg] = RARITY_STYLE[a.rarity] || ["#94a3b8", "rgba(148,163,184,.12)"];

          return (
            <div
              key={a.id}
              className="g"
              style={{
                padding:18,
                minHeight:148,
                position:"relative",
                overflow:"hidden",
                opacity: unlocked ? 1 : .48,
                borderColor: unlocked ? `${col}24` : "rgba(255,255,255,.05)",
                background: unlocked ? `linear-gradient(135deg, ${bg}, rgba(255,255,255,.018))` : "rgba(255,255,255,.015)",
              }}
            >
              {unlocked && (
                <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 80% 0%, ${col}14 0%, transparent 62%)`, pointerEvents:"none" }}/>
              )}

              <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", background: unlocked ? `${col}18` : "rgba(255,255,255,.04)", border:`1px solid ${unlocked ? `${col}30` : "rgba(255,255,255,.06)"}`, boxShadow: unlocked ? `0 0 18px ${col}18` : "none" }}>
                  {unlocked ? <I size={20} color={col}/> : <Lock size={18} color="#475569"/>}
                </div>

                <div style={{ fontSize:9, fontWeight:900, letterSpacing:1, padding:"4px 8px", borderRadius:999, color: unlocked ? col : "#475569", background: unlocked ? `${col}14` : "rgba(255,255,255,.035)", border:`1px solid ${unlocked ? `${col}28` : "rgba(255,255,255,.06)"}` }}>
                  {a.rarity}
                </div>
              </div>

              <div style={{ position:"relative", zIndex:1, marginTop:14 }}>
                <div style={{ fontFamily:T_FONT.display, fontSize:15, fontWeight:800, color: unlocked ? T_COLOR.text : "#64748b", marginBottom:6 }}>
                  {a.title}
                </div>
                <div style={{ fontSize:12, color: unlocked ? T_COLOR.muted : "#475569", lineHeight:1.5 }}>
                  {a.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatsView() {
  const { persistent } = useAppData();
  const activeQuests = useMemo(() => getActiveQuests(persistent), [persistent.quests.customItems]);
  const completedIds   = persistent.quests.completedIds || [];
  const totalXp        = persistent.xp.total || 0;
  const monthData      = useMemo(() => buildXpHistoryData(persistent.xp.dailyLog, 30), [persistent.xp.dailyLog]);
  const weekData       = useMemo(() => buildXpHistoryData(persistent.xp.dailyLog, 7), [persistent.xp.dailyLog]);
  const recentEvents   = useMemo(() => buildRecentQuestEvents(persistent.xp.dailyLog, activeQuests, 12), [persistent.xp.dailyLog, activeQuests]);

  const avgDay  = Math.round(monthData.reduce((s,d) => s+d.xp, 0) / Math.max(monthData.length, 1));
  const bestDay = Math.max(0, ...monthData.map(d => d.xp));
  const rate    = Math.round((completedIds.length / Math.max(activeQuests.length, 1)) * 100);
  const rlCurrent = persistent.rocketLeague?.current;
  const rlTodaySeconds = Object.values(rlCurrent?.elapsedBySubtask || {}).reduce((sum, v) => sum + Math.max(0, Number(v) || 0), 0);
  const questHistory = Array.isArray(persistent.quests?.dailyHistory) ? persistent.quests.dailyHistory : [];
  const last7History = questHistory.slice(-7);
  const histCompleted = last7History.reduce((sum, d) => sum + Math.max(0, Number(d.completedCount) || 0), 0);
  const histTotal = last7History.reduce((sum, d) => sum + Math.max(0, Number(d.totalCount) || 0), 0);
  const histRate = histTotal ? Math.round((histCompleted / histTotal) * 100) : rate;
  const penaltyLast7 = last7History.reduce((sum, d) => sum + Math.max(0, Number(d.penaltyXp) || 0), 0);
  const missedFrequency = useMemo(() => {
    const map = new Map();
    questHistory.slice(-30).forEach(day => (day.missedIds || []).forEach(id => map.set(id, (map.get(id) || 0) + 1)));
    return [...map.entries()].sort((a,b) => b[1] - a[1]).slice(0, 5).map(([id, count]) => ({ quest: activeQuests.find(q => q.id === id) || { title:`Misión ${id}` }, count }));
  }, [questHistory, activeQuests]);
  const insights = useMemo(() => {
    const rows = [];
    if (histRate >= 80) rows.push({ color:"#34d399", title:"Semana sólida", text:`Cumplimiento de ${histRate}% en los últimos 7 días. Mantené Cálculo antes de Rocket para proteger el ritmo.` });
    else if (histRate > 0) rows.push({ color:"#fbbf24", title:"Hay patrón que corregir", text:`Cumplimiento de ${histRate}%. Mirá qué misión se repite abajo y movela a la mañana o al modo sesión.` });
    if (penaltyLast7 > 0) rows.push({ color:"#f87171", title:"XP perdido", text:`Perdiste ${penaltyLast7} XP esta semana. Las obligatorias duelen más; las opcionales ya no castigan.` });
    if (missedFrequency[0]) rows.push({ color:"#fb923c", title:"Misión frágil", text:`La que más se escapa es “${missedFrequency[0].quest.title}”. Bajale duración o ponela justo después de Cálculo.` });
    if (rlTodaySeconds > 0) rows.push({ color:"#22d3ee", title:"Rocket activo", text:`Hoy ya registraste ${formatSeconds(rlTodaySeconds)} de entrenamiento. Ranked solo si tilt está 1–2/5.` });
    if (!rows.length) rows.push({ color:"#94a3b8", title:"Aún faltan datos", text:"Completá unos días más para que LifeOS detecte tus patrones reales." });
    return rows.slice(0, 4);
  }, [histRate, penaltyLast7, missedFrequency, rlTodaySeconds]);

  return (
    <div style={{ animation:"sldIn .3s ease" }}>
      <div style={S.ptitle}>Análisis</div>
      <div style={S.psub}>Datos reales de tus misiones, XP, Rocket League y sesiones recientes.</div>

      <div className="s-grid" style={{ marginBottom:20 }}>
        <StatCard val={totalXp.toLocaleString()} label="XP total"     icon={Zap}        accent="#a78bfa"/>
        <StatCard val={avgDay}                   label="XP prom./día" icon={TrendingUp}  accent="#34d399"/>
        <StatCard val={bestDay}                  label="Mejor día"      icon={Award}       accent="#fbbf24"/>
        <StatCard val={formatSeconds(rlTodaySeconds)} label="RL hoy" icon={Gamepad2} accent="#22d3ee"/>
        <StatCard val={`${histRate}%`} label="Cumplimiento 7d" icon={CheckCircle2} accent={histRate >= 70 ? "#34d399" : "#fbbf24"}/>
        <StatCard val={`-${penaltyLast7}`} label="XP perdido 7d" icon={AlertTriangle} accent={penaltyLast7 > 0 ? "#f87171" : "#34d399"}/>
      </div>

      <div className="g" style={{ padding:18, marginBottom:16 }}>
        <div style={S.stitle}>Lectura rápida</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:10 }}>
          {insights.map((it, idx) => (
            <div key={idx} style={{ padding:12, borderRadius:13, background:`${it.color}0f`, border:`1px solid ${it.color}24` }}>
              <div style={{ color:it.color, fontWeight:900, fontSize:12, marginBottom:5 }}>{it.title}</div>
              <div style={{ color:T_COLOR.muted, fontSize:12, lineHeight:1.5 }}>{it.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="g" style={{ padding:20, marginBottom:16 }}>
        <div style={S.stitle}>Historial real de XP · 30 días</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthData} margin={{ top:5, right:5, left:-20, bottom:0 }}>
            <defs>
              <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={.4}/>
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={.02}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="d" tick={{ fill:"#64748b", fontSize:10 }} axisLine={false} tickLine={false} interval={4}/>
            <YAxis hide/>
            <Tooltip contentStyle={{ background:"rgba(7,7,15,.96)", border:"1px solid rgba(255,255,255,.09)", borderRadius:9, fontSize:12 }} cursor={{ stroke:"rgba(124,58,237,.4)", strokeWidth:1 }} labelStyle={{ color:"#eef2f8" }} itemStyle={{ color:"#a78bfa" }}/>
            <Area type="monotone" dataKey="xp" stroke="#7c3aed" strokeWidth={2} fill="url(#ag1)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.1fr .9fr", gap:16 }} className="mob-layout-grid">
        <div className="g" style={{ padding:20 }}>
          <div style={S.stitle}>Esta semana</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekData} barSize={22} margin={{ top:0, right:5, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={.85}/>
                  <stop offset="100%" stopColor="#0891b2" stopOpacity={.3}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="d" tick={{ fill:"#64748b", fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={{ background:"rgba(7,7,15,.96)", border:"1px solid rgba(255,255,255,.09)", borderRadius:9, fontSize:12 }} cursor={{ fill:"rgba(255,255,255,.03)" }} labelStyle={{ color:"#eef2f8" }} itemStyle={{ color:"#22d3ee" }}/>
              <Bar dataKey="xp" fill="url(#bg2)" radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="g" style={{ padding:20 }}>
          <div style={S.stitle}>Últimos movimientos</div>
          <div style={{ display:"flex", flexDirection:"column", gap:9, maxHeight:220, overflow:"auto" }}>
            {recentEvents.length ? recentEvents.map((e, idx) => {
              const positive = (Number(e.amount) || 0) >= 0;
              return (
                <div key={`${e.date}-${idx}`} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, padding:"9px 10px", borderRadius:10, background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.05)" }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:800, color:T_COLOR.text }}>{e.quest?.title || `Misión ${e.questId}`}</div>
                    <div style={{ fontSize:10.5, color:T_COLOR.muted, marginTop:2 }}>{e.when}</div>
                  </div>
                  <div style={{ fontSize:12, fontWeight:900, color:positive ? "#34d399" : "#f87171" }}>{positive ? "+" : ""}{Number(e.amount) || 0} XP</div>
                </div>
              );
            }) : (
              <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.6 }}>Todavía no hay movimientos. Completá una misión para empezar tu historial real.</div>
            )}
          </div>
        </div>
      </div>

      <div className="g" style={{ padding:18, marginTop:16 }}>
        <div style={S.stitle}>Misiones que más se te escapan</div>
        <div style={{ display:"grid", gap:8 }}>
          {missedFrequency.length ? missedFrequency.map(row => (
            <div key={row.quest.id || row.quest.title} style={{ display:"flex", justifyContent:"space-between", gap:12, padding:"9px 10px", borderRadius:10, background:"rgba(248,113,113,.045)", border:"1px solid rgba(248,113,113,.10)" }}>
              <span style={{ color:T_COLOR.text, fontSize:12, fontWeight:800 }}>{row.quest.title}</span>
              <span style={{ color:"#f87171", fontSize:12, fontWeight:900 }}>{row.count} fallos / 30d</span>
            </div>
          )) : <div style={{ color:T_COLOR.muted, fontSize:12 }}>Todavía no hay suficientes resets diarios para detectar patrones.</div>}
        </div>
      </div>

      <div className="g" style={{ padding:18, marginTop:16, background: rate >= 70 ? "rgba(52,211,153,.055)" : "rgba(251,191,36,.055)", borderColor: rate >= 70 ? "rgba(52,211,153,.14)" : "rgba(251,191,36,.14)" }}>
        <div style={{ fontSize:13, fontWeight:900, color: rate >= 70 ? "#34d399" : "#fbbf24", marginBottom:5 }}>
          {rate >= 70 ? "Buen ritmo diario" : "Todavía queda margen"}
        </div>
        <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.6 }}>
          Llevás {completedIds.length}/{activeQuests.length} misiones de hoy. El historial ahora sale de tus completados reales, no de datos de muestra.
        </div>
      </div>
    </div>
  );
}


const FOCUS_TIMER_STORAGE_KEY = "lifeos:focus-session-timers:v1";
const FOCUS_TIMER_CALC_BOOTSTRAP = Object.freeze({
  dateKey: "2026-05-28",
  questId: 1,
  elapsedSeconds: 20 * 60,
  id: "calc-2026-05-28-20m",
});

function safeFocusTimerDateKey() {
  try { return getLifeOSDateKey(); } catch { return new Date().toISOString().slice(0, 10); }
}

function focusTimerRecordKey(questId, dateKey = safeFocusTimerDateKey()) {
  return `${dateKey}::${String(questId || "none")}`;
}

function normalizeFocusTimerStore(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { records:{}, bootstraps:{} };
  return {
    records: raw.records && typeof raw.records === "object" && !Array.isArray(raw.records) ? raw.records : {},
    bootstraps: raw.bootstraps && typeof raw.bootstraps === "object" && !Array.isArray(raw.bootstraps) ? raw.bootstraps : {},
  };
}

function readFocusTimerStore() {
  if (typeof window === "undefined" || !window.localStorage) return { records:{}, bootstraps:{} };
  try {
    return normalizeFocusTimerStore(JSON.parse(window.localStorage.getItem(FOCUS_TIMER_STORAGE_KEY) || "{}"));
  } catch {
    return { records:{}, bootstraps:{} };
  }
}

function writeFocusTimerStore(store) {
  if (typeof window === "undefined" || !window.localStorage) return false;
  try {
    window.localStorage.setItem(FOCUS_TIMER_STORAGE_KEY, JSON.stringify(normalizeFocusTimerStore(store)));
    return true;
  } catch {
    return false;
  }
}

function getFocusTimerBootstrapSeconds(questId, dateKey) {
  if (String(dateKey) === FOCUS_TIMER_CALC_BOOTSTRAP.dateKey && Number(questId) === FOCUS_TIMER_CALC_BOOTSTRAP.questId) {
    return FOCUS_TIMER_CALC_BOOTSTRAP.elapsedSeconds;
  }
  return 0;
}

function getStoredFocusTimerElapsed(questId, dateKey = safeFocusTimerDateKey()) {
  const key = focusTimerRecordKey(questId, dateKey);
  const store = readFocusTimerStore();
  const record = store.records[key] || {};
  let elapsed = Math.max(0, Math.floor(Number(record.elapsedSeconds) || 0));

  const bootstrapSeconds = getFocusTimerBootstrapSeconds(questId, dateKey);
  const bootstrapKey = `${key}::${FOCUS_TIMER_CALC_BOOTSTRAP.id}`;
  if (bootstrapSeconds > elapsed && !store.bootstraps[bootstrapKey]) {
    elapsed = bootstrapSeconds;
    store.records[key] = {
      ...record,
      dateKey,
      questId,
      elapsedSeconds: elapsed,
      updatedAt: new Date().toISOString(),
      bootstrap: FOCUS_TIMER_CALC_BOOTSTRAP.id,
    };
    store.bootstraps[bootstrapKey] = true;
    writeFocusTimerStore(store);
  }

  return elapsed;
}

function saveFocusTimerElapsed(questId, elapsedSeconds, dateKey = safeFocusTimerDateKey()) {
  if (!questId) return false;
  const key = focusTimerRecordKey(questId, dateKey);
  const store = readFocusTimerStore();
  const current = store.records[key] || {};
  store.records[key] = {
    ...current,
    dateKey,
    questId,
    elapsedSeconds: Math.max(0, Math.floor(Number(elapsedSeconds) || 0)),
    updatedAt: new Date().toISOString(),
  };
  return writeFocusTimerStore(store);
}


function FocusSessionView() {
  const { persistent, pDispatch } = useAppData();
  const { uiDispatch } = useAppUI();
  const activeQuests = useMemo(() => getActiveQuests(persistent), [persistent.quests.customItems]);
  const completedSet = useMemo(() => SELECTORS.completedSet(persistent.quests.completedIds || []), [persistent.quests.completedIds]);
  const firstOpen = activeQuests.find(q => !completedSet.has(q.id)) || activeQuests[0];
  const [selectedId, setSelectedId] = useState(() => firstOpen?.id || activeQuests[0]?.id || 1);
  const selectedQuest = useMemo(() => activeQuests.find(q => q.id === selectedId) || firstOpen || activeQuests[0], [activeQuests, selectedId, firstOpen]);
  const targetSeconds = useMemo(() => isCalculusQuest(selectedQuest) ? 90 * 60 : Math.max(60, parseQuestDurationMinutes(selectedQuest, 30) * 60), [selectedQuest]);
  const [focusDateKey, setFocusDateKey] = useState(() => safeFocusTimerDateKey());
  const [elapsed, setElapsed] = useState(() => getStoredFocusTimerElapsed(selectedId, safeFocusTimerDateKey()));
  const [running, setRunning] = useState(false);
  const [tickNow, setTickNow] = useState(Date.now());
  const startedAtRef = useRef(null);
  const elapsedRef = useRef(elapsed);
  const savePulseRef = useRef(0);
  const soundedRef = useRef(false);

  const syncFocusTimerElapsed = useCallback((options = {}) => {
    if (!selectedQuest) return elapsedRef.current;
    const now = Date.now();
    const liveElapsed = running && startedAtRef.current
      ? Math.max(0, Math.floor((now - startedAtRef.current) / 1000))
      : Math.max(0, Math.floor(Number(elapsedRef.current) || 0));
    elapsedRef.current = liveElapsed;
    setElapsed(liveElapsed);
    setTickNow(now);

    const shouldPersist = options.force || Math.abs(now - savePulseRef.current) >= 3000;
    if (shouldPersist) {
      savePulseRef.current = now;
      saveFocusTimerElapsed(selectedQuest.id, liveElapsed, focusDateKey);
    }

    if (liveElapsed >= targetSeconds && !soundedRef.current) {
      soundedRef.current = true;
      unlockLifeOSAudio();
      playLifeOSSound("timer");
      uiDispatch(AC.toastAdd(Date.now(), "Tiempo objetivo alcanzado", selectedQuest?.title || "Sesión"));
    }

    return liveElapsed;
  }, [selectedQuest, running, targetSeconds, focusDateKey, selectedQuest?.title, uiDispatch]);

  useEffect(() => {
    if (!selectedQuest) return;
    const nextDateKey = safeFocusTimerDateKey();
    const savedElapsed = getStoredFocusTimerElapsed(selectedQuest.id, nextDateKey);
    elapsedRef.current = savedElapsed;
    startedAtRef.current = null;
    savePulseRef.current = 0;
    setFocusDateKey(nextDateKey);
    setElapsed(savedElapsed);
    setRunning(false);
    soundedRef.current = savedElapsed >= targetSeconds;
  }, [selectedQuest?.id, targetSeconds]);

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => syncFocusTimerElapsed(), 1000);
    return () => clearInterval(timer);
  }, [running, syncFocusTimerElapsed]);

  useEffect(() => {
    if (!running) return undefined;
    const syncOnReturn = () => syncFocusTimerElapsed({ force:true });
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", syncOnReturn);
    if (typeof window !== "undefined") {
      window.addEventListener("focus", syncOnReturn);
      window.addEventListener("beforeunload", syncOnReturn);
    }
    return () => {
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", syncOnReturn);
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", syncOnReturn);
        window.removeEventListener("beforeunload", syncOnReturn);
      }
    };
  }, [running, syncFocusTimerElapsed]);

  useEffect(() => () => {
    if (selectedQuest) syncFocusTimerElapsed({ force:true });
  }, [selectedQuest?.id, syncFocusTimerElapsed]);

  const pct = Math.min(100, (elapsed / Math.max(targetSeconds, 1)) * 100);
  const isDone = selectedQuest ? completedSet.has(selectedQuest.id) : false;

  const completeQuest = useCallback(() => {
    if (!selectedQuest) return;
    syncFocusTimerElapsed({ force:true });
    startedAtRef.current = null;
    if (selectedQuest.id === ROCKET_LEAGUE_PARENT_QUEST_ID) {
      setRunning(false);
      unlockLifeOSAudio();
      playLifeOSSound("menu");
      uiDispatch(AC.setView("rocketLeague"));
      const id = Date.now();
      uiDispatch(AC.toastAdd(id, "Abrí Rocket League", "La misión padre se completa al terminar todas las submisiones."));
      setTimeout(() => uiDispatch(AC.toastRemove(id)), 2800);
      return;
    }
    const wasCompleted = completedSet.has(selectedQuest.id);
    unlockLifeOSAudio();
    if (!wasCompleted) playLifeOSSound("mission");
    const oldNivel = SELECTORS.level(persistent.xp.total);
    pDispatch(AC.questComplete(selectedQuest.id, selectedQuest.xp, oldNivel));
    const deltaXp = wasCompleted ? -selectedQuest.xp : selectedQuest.xp;
    const id = Date.now();
    uiDispatch(AC.toastAdd(id, `${deltaXp > 0 ? "+" : ""}${deltaXp} XP`, wasCompleted ? `Desmarcado · ${selectedQuest.title}` : `Completado · ${selectedQuest.title}`));
    setTimeout(() => uiDispatch(AC.toastRemove(id)), 2900);
    setRunning(false);
  }, [selectedQuest, completedSet, persistent.xp.total, pDispatch, uiDispatch, syncFocusTimerElapsed]);

  const toggleFocusTimer = useCallback(() => {
    if (!selectedQuest) return;
    unlockLifeOSAudio();
    playLifeOSSound("menu");
    if (running) {
      const liveElapsed = syncFocusTimerElapsed({ force:true });
      elapsedRef.current = liveElapsed;
      startedAtRef.current = null;
      setRunning(false);
      return;
    }
    pDispatch(AC.questStart(selectedQuest.id));
    const baseElapsed = Math.max(0, Math.floor(Number(elapsedRef.current) || 0));
    startedAtRef.current = Date.now() - baseElapsed * 1000;
    savePulseRef.current = 0;
    setTickNow(Date.now());
    setRunning(true);
  }, [selectedQuest, running, pDispatch, syncFocusTimerElapsed]);

  const resetFocusTimer = useCallback(() => {
    if (!selectedQuest) return;
    startedAtRef.current = null;
    elapsedRef.current = 0;
    savePulseRef.current = Date.now();
    setRunning(false);
    setElapsed(0);
    soundedRef.current = false;
    saveFocusTimerElapsed(selectedQuest.id, 0, focusDateKey);
  }, [selectedQuest, focusDateKey]);

  const nextOpen = activeQuests.find(q => !completedSet.has(q.id) && q.id !== selectedQuest?.id);

  return (
    <div style={{ animation:"sldIn .3s ease", maxWidth:980 }}>
      <div style={S.ptitle} className="mob-ptitle">Sesión de enfoque</div>
      <div style={S.psub} className="mob-psub">Un modo limpio para trabajar una misión a la vez con temporizador, sonido y cierre claro.</div>

      <div className="g" style={{ padding:22, marginBottom:16, background:"linear-gradient(135deg,rgba(124,58,237,.08),rgba(34,211,238,.04))", borderColor:"rgba(167,139,250,.18)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap", marginBottom:18 }}>
          <div>
            <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:1.2, color:T_COLOR.muted, fontWeight:900, marginBottom:6 }}>Misión actual</div>
            <div style={{ fontFamily:T_FONT.display, fontSize:26, fontWeight:900, color:T_COLOR.text }}>{selectedQuest?.title || "Sin misión"}</div>
            <div style={{ fontSize:13, color:T_COLOR.muted, lineHeight:1.6, marginTop:5 }}>{selectedQuest?.sub || "Agregá una misión en Ajustes."}</div>
          </div>
          <div style={{ minWidth:145, textAlign:"right" }}>
            <div style={{ fontFamily:T_FONT.display, fontSize:34, fontWeight:900, color: elapsed >= targetSeconds ? "#fbbf24" : "#22d3ee", fontVariantNumeric:"tabular-nums" }}>{formatSeconds(elapsed)}</div>
            <div style={{ fontSize:11, color:T_COLOR.muted }}>objetivo {formatSeconds(targetSeconds)}</div>
          </div>
        </div>

        <ProgresoBar pct={pct} gradient={elapsed >= targetSeconds ? "linear-gradient(90deg,#fbbf24,#f97316)" : "linear-gradient(90deg,#7c3aed,#06b6d4)"} height={8}/>

        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:18 }}>
          <button onClick={toggleFocusTimer} style={{ border:"1px solid rgba(34,211,238,.28)", background:"rgba(34,211,238,.08)", color:"#22d3ee", borderRadius:12, padding:"11px 15px", fontWeight:900, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
            {running ? <Pause size={16}/> : <Play size={16}/>} {running ? "Pausar" : "Iniciar"}
          </button>
          <button onClick={resetFocusTimer} style={{ border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.035)", color:T_COLOR.muted, borderRadius:12, padding:"11px 15px", fontWeight:900, cursor:"pointer" }}>
            Reiniciar
          </button>
          <button onClick={completeQuest} disabled={!selectedQuest} style={{ border:"1px solid rgba(52,211,153,.28)", background:"rgba(52,211,153,.08)", color:isDone ? "#94a3b8" : "#34d399", borderRadius:12, padding:"11px 15px", fontWeight:900, cursor:selectedQuest ? "pointer" : "not-allowed", display:"flex", alignItems:"center", gap:8 }}>
            <CheckCircle2 size={16}/> {isDone ? "Desmarcar misión" : "Completar misión"}
          </button>
          {nextOpen && (
            <button onClick={() => setSelectedId(nextOpen.id)} style={{ border:"1px solid rgba(167,139,250,.25)", background:"rgba(167,139,250,.08)", color:"#a78bfa", borderRadius:12, padding:"11px 15px", fontWeight:900, cursor:"pointer" }}>
              Siguiente pendiente
            </button>
          )}
        </div>
      </div>

      <div className="g" style={{ padding:20 }}>
        <div style={S.stitle}>Elegir misión</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:10 }}>
          {activeQuests.map(q => {
            const done = completedSet.has(q.id);
            const on = selectedQuest?.id === q.id;
            const I = q.icon || Target;
            return (
              <button key={q.id} onClick={() => setSelectedId(q.id)} style={{ textAlign:"left", border:`1px solid ${on ? `${q.accent}55` : "rgba(255,255,255,.06)"}`, background:on ? `${q.accent}10` : "rgba(255,255,255,.025)", borderRadius:13, padding:13, cursor:"pointer", color:T_COLOR.text }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                  <div style={{ width:32, height:32, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", background:`${q.accent}12`, color:q.accent }}><I size={15}/></div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:900, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{q.title}</div>
                    <div style={{ fontSize:10.5, color:T_COLOR.muted }}>{parseQuestDurationMinutes(q, 30)} min · {q.xp} XP</div>
                  </div>
                  {done ? <CheckCircle2 size={15} color="#34d399"/> : <Circle size={15} color="#475569"/>}
                </div>
                <div style={{ fontSize:11, color:T_COLOR.muted, lineHeight:1.4 }}>{q.sub}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


function ReflectionView() {
  const { persistent, pDispatch } = useAppData();
  const { ui, uiDispatch }        = useAppUI();
  const [journalOpen, setJournalOpen] = useState(false);

  const rf           = persistent.reflection.current;
  const completedIds = persistent.quests.completedIds;
  const activeQuests = useMemo(() => getActiveQuests(persistent), [persistent.quests.customItems]);
  const streak       = persistent.streak.current;

  const completionRate = Math.round((completedIds.length / Math.max(activeQuests.length, 1)) * 100);
  const missed         = activeQuests.length - completedIds.length;

  const contextHeader = useMemo(() => {
    if (completedIds.length === activeQuests.length) return { headline:"Hoy cumpliste.", sub:`Completaste todo. Esta reflexión es para profundizar, no para arreglar nada.`, color:"#34d399", bg:"rgba(52,211,153,.08)", border:"rgba(52,211,153,.2)", icon:"✦" };
    if (completionRate >= 60) return { headline:"Casi todo listo. ¿Qué frenó el resto?", sub:`${completedIds.length} de ${activeQuests.length} misiones hechas. Buena base. Entendamos la brecha.`, color:"#22d3ee", bg:"rgba(34,211,238,.07)", border:"rgba(34,211,238,.18)", icon:"◈" };
    if (completionRate >= 30) return { headline:"Algo se interpuso hoy.", sub:`${missed} misiones quedaron pendientes. Sin juicio: solo curiosidad por entender qué pasó.`, color:"#a78bfa", bg:"rgba(167,139,250,.08)", border:"rgba(167,139,250,.2)", icon:"◇" };
    return { headline:"Hoy fue un día pesado.", sub:"Los días de baja ejecución son datos, no fracaso. ¿Qué estaba pasando realmente?", color:"#fb923c", bg:"rgba(251,146,60,.07)", border:"rgba(251,146,60,.18)", icon:"○" };
  }, [completedIds.length, completionRate, missed]);

  const activeRecs = useMemo(() =>
    rf.categories.slice(0,3).map(id => ({ id, ...RECOVERY_RECS[id] })).filter(Boolean),
    [rf.categories]
  );

  const activePrompts = useMemo(() => {
    if (rf.categories.length === 0) return REFLECTION_PROMPTS.default;
    return REFLECTION_PROMPTS[rf.categories[0]] || REFLECTION_PROMPTS.default;
  }, [rf.categories]);

  const workloadSuggestion = useMemo(() => {
    const score = ((rf.mood||3) + (rf.energy||3)) / 2;
    if (score >= 4.5) return { label:"Agenda completa recomendada",        color:"#34d399", desc:"Tenés capacidad. Mañana podés exigirte un poco más.", icon:"🔥" };
    if (score >= 3.5) return { label:"Carga normal, un buffer extra",    color:"#22d3ee", desc:"Agregá un bloque de descompresión de 15 min. Protegé la calidad de tu foco.", icon:"🎯" };
    if (score >= 2.5) return { label:"Reducí mañana un 20%",           color:"#a78bfa", desc:"Quitá la tarea de menor prioridad. Recuperar también es producir.", icon:"🌿" };
    return                    { label:"Día mínimo viable mañana",      color:"#fb923c", desc:"Una sola tarea ancla. Dejá que cuerpo y mente se reinicien antes de cargar más.", icon:"🛌" };
  }, [rf.mood, rf.energy]);

  const avgÁnimo   = PATTERN_HISTORY.reduce((s,d) => s+d.mood,0) / PATTERN_HISTORY.length;
  const avgEnergía = PATTERN_HISTORY.reduce((s,d) => s+d.energy,0) / PATTERN_HISTORY.length;
  const lowDays   = PATTERN_HISTORY.filter(d => d.mood <= 2 || d.energy <= 2).length;

  const handleSave = useCallback(() => {
    pDispatch(AC.reflectionSave());
    const id = Date.now();
    uiDispatch(AC.toastAdd(id, "Reflexión guardada", "Patrones registrados · Recuperación planificada"));
    setTimeout(() => uiDispatch(AC.toastRemove(id)), 2900);
  }, [pDispatch, uiDispatch]);

  const canSave = rf.mood || rf.energy || rf.categories.length > 0 || (rf.journal || "").trim().length > 0;

  return (
    <div style={{ animation:"sldIn .3s ease", maxWidth:900 }}>
      <div style={S.ptitle} className="mob-ptitle">¿Qué falló hoy?</div>
      <div style={S.psub} className="mob-psub">Autoconciencia sin juicio · Patrones antes que castigo · Recuperación como estrategia</div>

      <div className="rf-banner" style={{ background:contextHeader.bg, border:`1px solid ${contextHeader.border}` }}>
        <div style={{ width:42, height:42, borderRadius:11, flexShrink:0, background:`${contextHeader.color}18`, border:`1px solid ${contextHeader.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{contextHeader.icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:T_FONT.display, fontSize:16, fontWeight:800, color:contextHeader.color, marginBottom:4 }}>{contextHeader.headline}</div>
          <div style={{ fontSize:12.5, color:"#64748b", lineHeight:1.55 }}>{contextHeader.sub}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:5, alignItems:"flex-end", flexShrink:0 }}>
          <div style={{ padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700, background:`${contextHeader.color}15`, color:contextHeader.color, border:`1px solid ${contextHeader.color}25`, whiteSpace:"nowrap" }}>{completedIds.length}/{activeQuests.length} misiones</div>
          <div style={{ padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:600, background: streak>=3 ? "rgba(251,191,36,.12)" : "rgba(248,113,113,.1)", color: streak>=3 ? "#fbbf24" : "#f87171", border:`1px solid ${streak>=3 ? "rgba(251,191,36,.25)" : "rgba(248,113,113,.22)"}`, whiteSpace:"nowrap" }}>{streak}d de racha {streak>=3?"🔥":"·"}</div>
        </div>
      </div>

      <div className="rf-main-grid">
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div className="g" style={{ padding:20 }}>
            <div style={{ ...S.stitle, fontSize:14, marginBottom:18 }}>¿Cómo te sentís ahora mismo?</div>
            <div className="rf-section">
              <div style={{ ...S.sectionLabel }}><Heart size={11} color="#f472b6"/>Ánimo</div>
              <div className="rf-scale">
                {MOOD_STATES.map(s => {
                  const sel = rf.mood === s.v;
                  return (
                    <button key={s.v} className={`rf-scale-btn ${sel?"sel":""}`} onClick={() => pDispatch(AC.reflectionFieldUpdate("mood", sel ? null : s.v))} style={{ borderColor: sel ? `${s.color}50` : "rgba(255,255,255,.07)", background: sel ? `${s.color}14` : "rgba(255,255,255,.03)", boxShadow: sel ? `0 8px 28px ${s.color}20` : "none" }}>
                      <div style={{ fontSize:18, marginBottom:4 }}>{s.emoji}</div>
                      <div style={{ fontSize:10, fontWeight:700, color: sel ? s.color : "#475569", letterSpacing:.3 }}>{s.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="rf-section">
              <div style={{ ...S.sectionLabel }}><Battery size={11} color="#34d399"/>Nivel de energía</div>
              <div className="rf-scale">
                {ENERGY_STATES.map((s,i) => {
                  const sel = rf.energy === s.v;
                  return (
                    <button key={s.v} className={`rf-scale-btn ${sel?"sel":""}`} onClick={() => pDispatch(AC.reflectionFieldUpdate("energy", sel ? null : s.v))} style={{ borderColor: sel ? `${s.color}50` : "rgba(255,255,255,.07)", background: sel ? `${s.color}14` : "rgba(255,255,255,.03)", boxShadow: sel ? `0 8px 28px ${s.color}20` : "none", padding:"10px 6px" }}>
                      <div style={{ display:"flex", gap:2, justifyContent:"center", marginBottom:6, alignItems:"flex-end" }}>
                        {[1,2,3,4,5].map(b => <div key={b} style={{ width:4, height:4+b*2.5, borderRadius:2, background: b<=i+1 ? s.color : "rgba(255,255,255,.07)", transition:"background .2s" }}/>)}
                      </div>
                      <div style={{ fontSize:10, fontWeight:700, color: sel ? s.color : "#475569", letterSpacing:.3 }}>{s.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="g" style={{ padding:20 }}>
            <div style={{ ...S.stitle, fontSize:14, marginBottom:6 }}>¿Qué se interpuso?</div>
            <div style={{ fontSize:12, color:"#475569", marginBottom:16, lineHeight:1.5 }}>Seleccioná todo lo que aplique. No hay respuestas incorrectas.</div>
            <div className="rf-cat-grid">
              {REFLECTION_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const sel  = rf.categories.includes(cat.id);
                return (
                  <div key={cat.id} className={`rf-cat ${sel?"sel":""}`} onClick={() => pDispatch(AC.reflectionToggleCategory(cat.id))} style={{ borderColor: sel ? `${cat.color}45` : "rgba(255,255,255,.07)", background: sel ? `${cat.color}10` : "rgba(255,255,255,.03)", boxShadow: sel ? `0 6px 22px ${cat.color}15` : "none" }}>
                    <div className="rf-cat-ico" style={{ background: sel ? `${cat.color}18` : "rgba(255,255,255,.04)", color: sel ? cat.color : "#475569", border:`1px solid ${sel ? `${cat.color}30` : "rgba(255,255,255,.06)"}` }}><Icon size={17}/></div>
                    <div className="rf-cat-label" style={{ color: sel ? cat.color : "#64748b" }}>{cat.label}</div>
                    <div className="rf-cat-desc">{cat.desc}</div>
                    {sel && <div style={{ position:"absolute", top:8, right:8, width:14, height:14, borderRadius:"50%", background:cat.color, display:"flex", alignItems:"center", justifyContent:"center" }}><CheckCircle2 size={10} color="#fff"/></div>}
                  </div>
                );
              })}
            </div>
          </div>

          {(rf.categories.length > 0 || (rf.mood && rf.energy)) && (
            <div className="g" style={{ padding:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"rgba(167,139,250,.12)", display:"flex", alignItems:"center", justifyContent:"center" }}><Lightbulb size={16} color="#a78bfa"/></div>
                <div style={{ ...S.stitle, fontSize:14, marginBottom:0 }}>Reflexioná sobre esto</div>
              </div>
              <div className="rf-prompt" style={{ background:"rgba(167,139,250,.06)", borderColor:"rgba(167,139,250,.2)", borderLeftColor:"#a78bfa", paddingLeft:22 }}>
                {activePrompts.map((p,i) => (
                  <div key={i} style={{ fontSize: i===0 ? 14 : 13, color: i===0 ? "#c4ccd8" : "#64748b", fontWeight: i===0 ? 500 : 400, padding:"8px 0", position:"relative" }}>{p}</div>
                ))}
              </div>
              <button onClick={() => setJournalOpen(v => !v)} style={{ display:"flex", alignItems:"center", gap:8, background:"transparent", border:"none", cursor:"pointer", color: journalOpen ? "#a78bfa" : "#475569", fontSize:12, fontWeight:600, padding:"6px 0", transition:"color .2s", letterSpacing:.3, fontFamily:T_FONT.body }}>
                <Edit3 size={13}/>{journalOpen ? "Cerrar diario" : "Abrir diario opcional"}{journalOpen ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
              </button>
              {journalOpen && (
                <div style={{ marginTop:10, animation:"rfSlideIn .3s ease" }}>
                  <textarea className="rf-journal" placeholder="Volcá lo que tengas en la cabeza. Sin estructura, sin juicio." value={rf.journal} onChange={e => pDispatch(AC.reflectionFieldUpdate("journal", e.target.value))}/>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:"#374151" }}>
                    <span>Privado · Solo vos lo ves</span>
                    <span>{rf.journal.length > 0 ? `${rf.journal.split(/\s+/).filter(Boolean).length} palabras` : "Vacío"}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {rf.saved ? (
              <div className="rf-saved"><CheckCircle2 size={15}/>Reflexión guardada por hoy</div>
            ) : (
              <button className="rf-save" onClick={handleSave} disabled={!canSave} style={{ opacity: canSave ? 1 : .35 }}>
                <ArrowRight size={14}/>Guardar reflexión de hoy
              </button>
            )}
            <div style={{ fontSize:11, color:"#374151", lineHeight:1.5 }}>Construye datos de patrón<br/>con el tiempo</div>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {(rf.mood || rf.energy) && (
            <div className="rf-workload" style={{ animation:"rfIn .4s ease" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <span style={{ fontSize:16 }}>{workloadSuggestion.icon}</span>
                <div>
                  <div style={{ fontFamily:T_FONT.display, fontSize:13, fontWeight:800, color:workloadSuggestion.color }}>{workloadSuggestion.label}</div>
                  <div style={{ fontSize:10, color:"#4b5563", fontWeight:600, letterSpacing:.5, textTransform:"uppercase" }}>Carga sugerida para mañana</div>
                </div>
              </div>
              <div style={{ fontSize:12, color:"#475569", lineHeight:1.6 }}>{workloadSuggestion.desc}</div>
            </div>
          )}

          {activeRecs.length > 0 && (
            <div className="g" style={{ padding:18 }}>
              <div style={{ ...S.stitle, fontSize:14, marginBottom:14 }}>Plan de recuperación</div>
              <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                {activeRecs.map((rec,i) => {
                  const catData = REFLECTION_CATEGORIES.find(c => c.id === rec.id);
                  return (
                    <div key={rec.id} className="rf-rec" style={{ borderColor:`${catData?.color||"#a78bfa"}20`, background:`${catData?.color||"#a78bfa"}06`, animation:"rfSlideIn .35s ease both", animationDelay:`${i*.08}s` }}>
                      <div style={{ fontSize:20, flexShrink:0 }}>{rec.icon}</div>
                      <div>
                        <div style={{ fontSize:12.5, fontWeight:700, color:catData?.color||"#a78bfa", marginBottom:3 }}>{rec.label}</div>
                        <div style={{ fontSize:11.5, color:"#64748b", lineHeight:1.55 }}>{rec.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="g" style={{ padding:18 }}>
            <div style={{ ...S.stitle, fontSize:14, marginBottom:14 }}>Patrones de 7 días</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
              {[
                { label:"Avg Ánimo",   val: avgÁnimo.toFixed(1),   color:"#f472b6", suffix:"/5" },
                { label:"Energía prom.", val: avgEnergía.toFixed(1), color:"#34d399", suffix:"/5" },
                { label:"Días bajos",   val: lowDays,              color: lowDays>=3 ? "#f87171" : "#94a3b8", suffix:"d" },
              ].map(s => (
                <div key={s.label} style={{ padding:"10px 12px", borderRadius:10, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", textAlign:"center" }}>
                  <div style={{ fontFamily:T_FONT.display, fontSize:18, fontWeight:800, color:s.color, lineHeight:1 }}>{s.val}<span style={{ fontSize:11, opacity:.6 }}>{s.suffix}</span></div>
                  <div style={{ fontSize:9.5, color:"#475569", fontWeight:600, letterSpacing:.5, marginTop:3, textTransform:"uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={PATTERN_HISTORY} margin={{ top:5, right:8, left:-30, bottom:0 }}>
                <defs>
                  <linearGradient id="moodG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f472b6" stopOpacity={.8}/><stop offset="100%" stopColor="#a78bfa" stopOpacity={.8}/></linearGradient>
                  <linearGradient id="energyG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#34d399" stopOpacity={.7}/><stop offset="100%" stopColor="#22d3ee" stopOpacity={.7}/></linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fill:"#475569", fontSize:9 }} axisLine={false} tickLine={false}/>
                <YAxis hide domain={[0,6]}/>
                <Tooltip contentStyle={{ background:"rgba(7,7,15,.97)", border:"1px solid rgba(255,255,255,.08)", borderRadius:8, fontSize:11, padding:"5px 10px" }} cursor={{ stroke:"rgba(255,255,255,.06)", strokeWidth:1 }} labelStyle={{ color:"#eef2f8", fontWeight:600 }}/>
                <Line type="monotone" dataKey="mood"   stroke="url(#moodG)"   strokeWidth={2} dot={{ fill:"#f472b6", r:3, strokeWidth:0 }} name="Ánimo"/>
                <Line type="monotone" dataKey="energy" stroke="url(#energyG)" strokeWidth={2} dot={{ fill:"#34d399", r:3, strokeWidth:0 }} name="Energía"/>
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", gap:14, marginTop:8, justifyContent:"center" }}>
              {[{color:"#f472b6",label:"Ánimo"},{color:"#34d399",label:"Energía"}].map(l => (
                <div key={l.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:18, height:2, borderRadius:1, background:l.color }}/>
                  <span style={{ fontSize:10, color:"#475569", fontWeight:600 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {lowDays >= 3 && (
            <div className="g" style={{ padding:16, background:"rgba(248,113,113,.05)", borderColor:"rgba(248,113,113,.18)", animation:"rfIn .5s ease" }}>
              <div style={{ display:"flex", gap:10 }}><AlertTriangle size={16} color="#f87171" style={{ flexShrink:0, marginTop:1 }}/><div><div style={{ fontSize:12, fontWeight:700, color:"#f87171", marginBottom:4 }}>Patrón de saturación detectado</div><div style={{ fontSize:11, color:"#4b5563", lineHeight:1.6 }}>{lowDays} días de baja energía esta semana. Considerá bajar la carga 2–3 días y reconstruir el ritmo poco a poco.</div></div></div>
            </div>
          )}

          {rf.categories.includes("motivation") && (
            <div className="g" style={{ padding:16, background:"rgba(167,139,250,.05)", borderColor:"rgba(167,139,250,.18)" }}>
              <div style={{ display:"flex", gap:10 }}><Brain size={15} color="#a78bfa" style={{ flexShrink:0, marginTop:1 }}/><div><div style={{ fontSize:12, fontWeight:700, color:"#a78bfa", marginBottom:4 }}>The 2-minute principle</div><div style={{ fontSize:11, color:"#4b5563", lineHeight:1.6 }}>When motivation is low, the barrier is starting — not doing. Tomorrow, begin any task with "I'll just do 2 minutes." Momentum is earned, not assumed.</div></div></div>
            </div>
          )}

          <div className="g" style={{ padding:15, background:"rgba(134,239,172,.04)", borderColor:"rgba(134,239,172,.12)" }}>
            <div style={{ display:"flex", gap:10 }}><div style={{ fontSize:15, flexShrink:0 }}>🌱</div><div><div style={{ fontSize:12, fontWeight:600, color:"#86efac", marginBottom:3 }}>Progreso, not perfection</div><div style={{ fontSize:11, color:"#4b5563", lineHeight:1.6 }}>Hard days are not wasted days. Every reflection you complete builds self-knowledge that compounds into better systems.</div></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileView() {
  const { persistent }  = useAppData();
  const totalXp         = persistent.xp.total;
  const streak          = persistent.streak.current;
  const completedIds    = persistent.quests.completedIds;
  const unlockedIds     = persistent.achievements.unlockedIds;
  const completedSet    = useMemo(() => SELECTORS.completedSet(completedIds), [completedIds]);

  const level = useMemo(() => SELECTORS.level(totalXp),    [totalXp]);
  const xpPct = useMemo(() => SELECTORS.levelPct(totalXp), [totalXp]);
  const rank  = SELECTORS.rank(level);

  const stats = [
    { l:"Misiones totales",  v: completedIds.length,           a:"#34d399" },
    { l:"XP total",      v: totalXp.toLocaleString(),       a:"#a78bfa" },
    { l:"Day Racha",    v: `${streak}d`,                   a:"#f87171" },
    { l:"Achievements",  v: `${unlockedIds.length}/${ACHIEVEMENTS.length}`, a:"#fbbf24" },
  ];

  return (
    <div style={{ animation:"sldIn .3s ease" }}>
      <div style={S.ptitle} className="mob-ptitle">Profile</div>
      <div style={S.psub} className="mob-psub">Tus estadísticas personales y progreso</div>

      <div className="profile-main-grid">
        <div className="g" style={{ padding:28, textAlign:"center", background:"rgba(124,58,237,.06)", borderColor:"rgba(124,58,237,.2)" }}>
          <div style={{ width:72, height:72, borderRadius:18, background:"linear-gradient(135deg,#7c3aed,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:26, fontFamily:T_FONT.display, fontWeight:800, color:"white", boxShadow:"0 0 0 3px rgba(124,58,237,.4),0 0 30px rgba(124,58,237,.35)", animation:"glowP 4s ease-in-out infinite" }}>H</div>
          <div style={{ fontFamily:T_FONT.display, fontSize:20, fontWeight:800, color:"#eef2f8", marginBottom:4 }}>Hector</div>
          <div style={{ fontSize:12, color:"#a78bfa", fontWeight:700, letterSpacing:.8, textTransform:"uppercase", marginBottom:16 }}>{rank}</div>
          <div style={{ background:"rgba(251,191,36,.08)", border:"1px solid rgba(251,191,36,.2)", borderRadius:12, padding:"10px 14px", marginBottom:16 }}>
            <div style={{ fontFamily:T_FONT.display, fontSize:32, fontWeight:800, color:"#fbbf24", lineHeight:1 }}>Lv.{level}</div>
            <div style={{ fontSize:10, color:"#92400e", fontWeight:600, letterSpacing:1, marginTop:3, textTransform:"uppercase" }}>Nivel actual</div>
          </div>
          <div style={{ fontSize:11, color:"#64748b", marginBottom:6 }}>Progreso to Lv.{level+1}</div>
          <ProgresoBar pct={xpPct} gradient="linear-gradient(90deg,#fbbf24,#f97316)"/>
          <div style={{ fontSize:11, color:"#475569", marginTop:5 }}>{Math.round(xpPct)}% · {SELECTORS.levelXp(totalXp)} / 500 XP</div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {stats.map((s,i) => (
              <div key={i} className="g" style={{ padding:"16px 18px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, right:0, width:60, height:60, borderRadius:"50%", background:`radial-gradient(circle,${s.a}18 0%,transparent 70%)`, transform:"translate(20px,-20px)", pointerEvents:"none" }}/>
                <div style={{ fontFamily:T_FONT.display, fontSize:22, fontWeight:800, color:s.a, marginBottom:3 }}>{s.v}</div>
                <div style={{ fontSize:10.5, color:"#64748b", fontWeight:600, textTransform:"uppercase", letterSpacing:.7 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div className="g" style={{ padding:18, flex:1 }}>
            <div style={{ ...S.stitle, fontSize:14, marginBottom:12 }}>Progreso de misiones</div>
            {getActiveQuests(persistent).map(q => {
              const Icon = q.icon;
              const done = completedSet.has(q.id);
              return (
                <div key={q.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:`${q.accent}14`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Icon size={14} color={q.accent}/></div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:500, color: done ? "#eef2f8" : "#64748b", marginBottom:4 }}>{q.title}</div>
                    <ProgresoBar pct={done ? 100 : 0} gradient={q.accent} height={4}/>
                  </div>
                  <div style={{ width:16, height:16, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {done ? <CheckCircle2 size={14} color={q.accent}/> : <Circle size={14} color="#374151"/>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


function WardrobeView() {
  const { persistent, pDispatch } = useAppData();
  const { uiDispatch } = useAppUI();
  const wardrobe = persistent.wardrobe || createWardrobeInitial();
  const profile = deepMerge(createWardrobeInitial().profile, wardrobe.profile || {});
  const items = normalizeWardrobeItems(wardrobe.items);
  const [now, setNow] = useState(() => Date.now());
  const [draft, setDraft] = useState({ type:"top", name:"", color:"", style:"casual" });

  const closetInputStyle = useCallback(() => ({
    width: "100%",
    minHeight: 42,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(15,23,42,.42)",
    color: T_COLOR.text,
    padding: "0 12px",
    outline: "none",
    fontWeight: 700,
    fontFamily: T_FONT.body,
  }), []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weekKey = getScheduleWeekKey(new Date(now));
  const todayKey = getLifeOSDateKey(new Date(now));
  const laundryUntil = getLifeOSDateKey(new Date(now + 2 * 24 * 60 * 60 * 1000));
  const remixCountdown = formatCountdownSeconds(getSecondsUntilNextScheduleWeek(now));
  const outfits = useMemo(() => buildWardrobeWeek(wardrobe, weekKey), [wardrobe, weekKey]);
  const lastUsedOutfit = useMemo(() => (Array.isArray(wardrobe.history) ? [...wardrobe.history].reverse().find(h => h?.action === "used") : null), [wardrobe.history]);

  const addItem = useCallback(() => {
    const name = draft.name.trim();
    const color = draft.color.trim();
    if (!name && !color) return;
    unlockLifeOSAudio();
    playLifeOSSound("complete");
    pDispatch(AC.wardrobeItemAdd({ ...draft, name: name || `${WARDROBE_TYPES.find(t => t.id === draft.type)?.label || "Prenda"} ${color}`, color: color || "neutro" }));
    setDraft({ type:draft.type, name:"", color:"", style:draft.style || "casual" });
  }, [draft, pDispatch]);

  const deleteItem = useCallback((id) => {
    unlockLifeOSAudio();
    playLifeOSSound("menu");
    pDispatch(AC.wardrobeItemDelete(id));
  }, [pDispatch]);

  const updateProfile = useCallback((key, value) => {
    pDispatch(AC.wardrobeProfileUpdate({ [key]: value }));
  }, [pDispatch]);

  const markOutfit = useCallback((outfit, action) => {
    unlockLifeOSAudio();
    playLifeOSSound(action === "used" ? "complete" : "menu");
    pDispatch(AC.wardrobeOutfitMark({
      action,
      day: outfit.full,
      signature: outfit.signature,
      items: outfit.items.map(item => ({ id:item.id, type:item.type, name:item.name, color:item.color })),
    }));
    const msg = action === "used" ? "Outfit marcado como usado" : "Combinación evitada";
    const sub = action === "used" ? "LifeOS la baja de prioridad en próximas semanas." : "No debería repetirse tan fácil.";
    uiDispatch(AC.toastAdd(Date.now(), msg, sub));
  }, [pDispatch, uiDispatch]);

  const toggleFavorite = useCallback((item) => {
    pDispatch(AC.wardrobeItemUpdate(item.id, { favorite: !item.favorite }));
  }, [pDispatch]);

  const toggleLaundry = useCallback((item) => {
    const next = item.unavailableUntil && item.unavailableUntil >= todayKey ? "" : laundryUntil;
    pDispatch(AC.wardrobeItemUpdate(item.id, { unavailableUntil: next }));
  }, [pDispatch, todayKey, laundryUntil]);

  const resetCloset = useCallback(() => {
    if (!window.confirm("¿Borrar prendas, perfil e historial del clóset?")) return;
    pDispatch(AC.domainReset("wardrobe"));
    uiDispatch(AC.toastAdd(Date.now(), "Clóset reiniciado", "Volvió a la base sugerida."));
  }, [pDispatch, uiDispatch]);

  return (
    <div style={{ animation:"sldIn .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:14, alignItems:"flex-start", flexWrap:"wrap", marginBottom:18 }}>
        <div>
          <div style={S.ptitle}>Clóset / Ropero</div>
          <div style={S.psub}>Outfits semanales sin parecer retrato: camisa, pantalón y tenis con rotación inteligente.</div>
        </div>
        <div className="g" style={{ padding:14, minWidth:220 }}>
          <div style={{ fontSize:10, color:T_COLOR.muted, textTransform:"uppercase", letterSpacing:.8, fontWeight:900 }}>Próxima randomización</div>
          <div style={{ fontFamily:T_FONT.display, fontSize:24, fontWeight:900, color:"#a78bfa", fontVariantNumeric:"tabular-nums" }}>{remixCountdown}</div>
          <div style={{ fontSize:11, color:T_COLOR.muted }}>Semana activa: {weekKey}</div>
        </div>
      </div>

      <div className="wardrobe-grid">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="g" style={{ padding:18, borderColor:"rgba(34,211,238,.16)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <Palette size={18} color="#22d3ee"/>
              <div style={{ ...S.stitle, marginBottom:0 }}>Perfil de estilo</div>
            </div>
            <div className="mob-layout-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:10 }}>
              <input value={profile.skinTone || ""} onChange={(e) => updateProfile("skinTone", e.target.value.slice(0, 32))} placeholder="Tono" style={closetInputStyle()} />
              <input value={profile.style || ""} onChange={(e) => updateProfile("style", e.target.value.slice(0, 48))} placeholder="Estilo" style={closetInputStyle()} />
              <input value={profile.notes || ""} onChange={(e) => updateProfile("notes", e.target.value.slice(0, 90))} placeholder="Notas" style={closetInputStyle()} />
            </div>
            <div className="mob-layout-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
              <select value={profile.weather || "normal"} onChange={(e) => updateProfile("weather", e.target.value)} style={closetInputStyle()}>
                <option value="calor">Calor</option><option value="normal">Normal</option><option value="fresco">Fresco</option><option value="lluvia">Lluvia</option>
              </select>
              <select value={profile.occasion || "universidad"} onChange={(e) => updateProfile("occasion", e.target.value)} style={closetInputStyle()}>
                <option value="universidad">Universidad</option><option value="casa">Casa</option><option value="salida casual">Salida casual</option><option value="presentable">Presentable</option>
              </select>
            </div>
            <div style={{ marginTop:12, padding:12, borderRadius:12, background:"rgba(251,191,36,.07)", border:"1px solid rgba(251,191,36,.18)", color:"#fcd34d", fontSize:12, lineHeight:1.55 }}>
              LifeOS separa pantalones, evita repetir combinaciones usadas/no gustadas y prioriza tonos que favorecen piel canela: negro, terracota, crema, blanco cálido, camel, verde oliva, azul marino, borgoña, denim oscuro y gris carbón.
            </div>
            {lastUsedOutfit && <div style={{ marginTop:10, fontSize:11.5, color:T_COLOR.muted }}>Último outfit usado: {new Date(lastUsedOutfit.date).toLocaleDateString("es-ES")} · {lastUsedOutfit.day}</div>}
          </div>

          <div className="wardrobe-days">
            {outfits.map((outfit, idx) => (
              <div key={`${weekKey}-${outfit.day}`} className="g" style={{ padding:16, borderColor: idx === todayIdx ? "rgba(34,211,238,.32)" : "rgba(255,255,255,.07)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"center", marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:11, color:idx === todayIdx ? "#22d3ee" : T_COLOR.muted, fontWeight:900, textTransform:"uppercase", letterSpacing:.8 }}>{outfit.full}</div>
                    <div style={{ fontFamily:T_FONT.display, fontSize:17, color:T_COLOR.text, fontWeight:900 }}>{outfit.title}</div>
                  </div>
                  <Shirt size={20} color={idx === todayIdx ? "#22d3ee" : "#a78bfa"}/>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:10 }}>
                  {outfit.items.map(item => (
                    <div key={`${outfit.day}-${item.type}`} style={{ display:"flex", justifyContent:"space-between", gap:8, padding:"7px 9px", borderRadius:10, background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.055)", fontSize:12 }}>
                      <span style={{ color:T_COLOR.text, fontWeight:800 }}>{item.name}</span>
                      <span style={{ color:T_COLOR.muted }}>{item.color}</span>
                    </div>
                  ))}
                </div>
                <div style={{ color:T_COLOR.muted, fontSize:11.5, lineHeight:1.5, marginBottom:10 }}>{outfit.why}</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <button onClick={() => markOutfit(outfit, "used")} style={{ border:"1px solid rgba(52,211,153,.22)", background:"rgba(52,211,153,.08)", color:"#34d399", borderRadius:9, padding:"7px 9px", fontSize:11, fontWeight:900, cursor:"pointer" }}>Usé este outfit</button>
                  <button onClick={() => markOutfit(outfit, "dislike")} style={{ border:"1px solid rgba(248,113,113,.22)", background:"rgba(248,113,113,.08)", color:"#f87171", borderRadius:9, padding:"7px 9px", fontSize:11, fontWeight:900, cursor:"pointer" }}>No me gusta</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="g" style={{ padding:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <Plus size={18} color="#34d399"/>
              <div style={{ ...S.stitle, marginBottom:0 }}>Agregar prenda</div>
            </div>
            <div style={{ display:"grid", gap:9 }}>
              <select value={draft.type} onChange={(e) => setDraft(d => ({ ...d, type:e.target.value }))} style={closetInputStyle()}>
                {WARDROBE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <input value={draft.name} onChange={(e) => setDraft(d => ({ ...d, name:e.target.value }))} placeholder="Ej: camisa terracota, pantalón beige, tenis grises" style={closetInputStyle()} />
              <input value={draft.color} onChange={(e) => setDraft(d => ({ ...d, color:e.target.value }))} placeholder="Color" style={closetInputStyle()} />
              <input value={draft.style} onChange={(e) => setDraft(d => ({ ...d, style:e.target.value }))} placeholder="Estilo: casual, formal, deportivo" style={closetInputStyle()} />
              <button onClick={addItem} style={{ minHeight:42, borderRadius:12, border:"1px solid rgba(52,211,153,.28)", background:"rgba(52,211,153,.12)", color:"#34d399", fontWeight:900, cursor:"pointer" }}>Agregar al clóset</button>
            </div>
          </div>

          <div className="g" style={{ padding:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"center", marginBottom:10 }}>
              <div style={{ ...S.stitle, marginBottom:0 }}>Prendas guardadas</div>
              <button onClick={resetCloset} style={{ border:"1px solid rgba(248,113,113,.2)", background:"rgba(248,113,113,.06)", color:"#f87171", borderRadius:9, padding:"7px 9px", fontSize:11, fontWeight:900, cursor:"pointer" }}>Reset</button>
            </div>
            {items.length === 0 ? (
              <div style={{ color:T_COLOR.muted, fontSize:12, lineHeight:1.6 }}>Aún no agregaste ropa. Mientras tanto, LifeOS usa camisas, pantalones y tenis sugeridos. Agregá tus colores reales para evitar looks repetidos.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:520, overflow:"auto" }}>
                {items.map(item => {
                  const unavailable = item.unavailableUntil && item.unavailableUntil >= todayKey;
                  return (
                    <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:10, borderRadius:12, background:unavailable ? "rgba(248,113,113,.05)" : "rgba(255,255,255,.035)", border:unavailable ? "1px solid rgba(248,113,113,.14)" : "1px solid rgba(255,255,255,.06)" }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12.5, color:T_COLOR.text, fontWeight:900 }}>{item.favorite ? "★ " : ""}{item.name}</div>
                        <div style={{ fontSize:11, color:T_COLOR.muted }}>{WARDROBE_TYPES.find(t => t.id === item.type)?.label || item.type} · {item.color} · {item.style}{unavailable ? ` · lavando hasta ${item.unavailableUntil}` : ""}</div>
                      </div>
                      <button onClick={() => toggleFavorite(item)} style={{ width:34, height:34, borderRadius:10, border:"1px solid rgba(251,191,36,.22)", background:item.favorite ? "rgba(251,191,36,.14)" : "rgba(255,255,255,.035)", color:item.favorite ? "#fbbf24" : T_COLOR.muted, cursor:"pointer" }} title="Favorito"><Star size={14}/></button>
                      <button onClick={() => toggleLaundry(item)} style={{ width:34, height:34, borderRadius:10, border:"1px solid rgba(34,211,238,.22)", background:unavailable ? "rgba(34,211,238,.12)" : "rgba(255,255,255,.035)", color:unavailable ? "#22d3ee" : T_COLOR.muted, cursor:"pointer" }} title={unavailable ? "Disponible" : "Lavando"}><RefreshCw size={14}/></button>
                      <button onClick={() => deleteItem(item.id)} style={{ width:34, height:34, borderRadius:10, border:"1px solid rgba(248,113,113,.22)", background:"rgba(248,113,113,.08)", color:"#f87171", cursor:"pointer" }} title="Borrar"><Trash2 size={15}/></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function isLifeOSStandalone() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator?.standalone === true;
}

function isLikelyMobileDevice() {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent || "") || window.matchMedia?.("(max-width: 760px)")?.matches;
}

async function showLifeOSLocalNotification(title, body, tag = "lifeos-local") {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;

  const options = {
    body,
    tag,
    renotify: true,
    icon: "/pwa-192.png",
    badge: "/pwa-192.png",
    data: { url: "/" },
  };

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, options);
      return true;
    }
    new Notification(title, options);
    return true;
  } catch {
    try {
      new Notification(title, options);
      return true;
    } catch {
      return false;
    }
  }
}

function SettingsView() {
  const {
    persistent, pDispatch,
    cloudUser, cloudEmail, setCloudEmail, cloudStatus, cloudMessage,
    handleCloudLogin, handleCloudLogout,
  } = useAppData();
  const { uiDispatch } = useAppUI();
  const importRef = useRef(null);

  const activeQuests = useMemo(() => getActiveQuests(persistent), [persistent.quests.customItems]);
  const [questDraft, setQuestDraft] = useState(() => sanitizeQuestItems(activeQuests));
  const audioSettings = deepMerge(createAppSettingsInitial().sound, persistent.appSettings?.sound || {});
  const pwaSettings = deepMerge(createAppSettingsInitial().pwa, persistent.appSettings?.pwa || {});
  const backupSettings = deepMerge(createAppSettingsInitial().backup, persistent.appSettings?.backup || {});
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isInstalledPWA, setIsInstalledPWA] = useState(() => isLifeOSStandalone());
  const [notificationPermission, setNotificationPermission] = useState(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    return Notification.permission;
  });
  const isMobilePWADevice = useMemo(() => isLikelyMobileDevice(), []);

  useEffect(() => {
    setQuestDraft(sanitizeQuestItems(activeQuests));
  }, [activeQuests]);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event);
    };
    const onAppInstalled = () => {
      setIsInstalledPWA(true);
      setDeferredInstallPrompt(null);
      uiDispatch(AC.toastAdd(Date.now(), "LifeOS instalado", "La app quedó instalada en este dispositivo."));
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [uiDispatch]);

  const updateAudioSetting = useCallback((key, value) => {
    const nextSound = { ...audioSettings, [key]: value };
    persistAudioPrefs(nextSound);
    pDispatch(AC.appSettingsUpdate({ sound: nextSound }));
  }, [audioSettings, pDispatch]);

  const updatePWASetting = useCallback((key, value) => {
    const nextPWA = { ...pwaSettings, [key]: value };
    pDispatch(AC.appSettingsUpdate({ pwa: nextPWA }));
  }, [pwaSettings, pDispatch]);

  const installLifeOSApp = useCallback(async () => {
    if (isInstalledPWA) {
      uiDispatch(AC.toastAdd(Date.now(), "LifeOS ya está instalado", "Abrilo desde el icono de la pantalla principal."));
      return;
    }
    if (!deferredInstallPrompt) {
      uiDispatch(AC.toastAdd(Date.now(), "Instalación manual", "En Android: menú del navegador → Agregar a pantalla principal / Instalar app."));
      return;
    }
    try {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      setDeferredInstallPrompt(null);
      if (choice?.outcome === "accepted") {
        setIsInstalledPWA(true);
        uiDispatch(AC.toastAdd(Date.now(), "Instalando LifeOS", "La app se agregará al celular."));
      } else {
        updatePWASetting("installDismissed", true);
      }
    } catch {
      uiDispatch(AC.toastAdd(Date.now(), "No se pudo instalar", "Probá desde el menú del navegador."));
    }
  }, [deferredInstallPrompt, isInstalledPWA, uiDispatch, updatePWASetting]);

  const requestMobileNotifications = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      uiDispatch(AC.toastAdd(Date.now(), "Notificaciones no disponibles", "Este navegador no soporta notificaciones web."));
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      updatePWASetting("mobileNotifications", permission === "granted");
      if (permission === "granted") {
        await showLifeOSLocalNotification("LifeOS", "Notificaciones móviles activas.");
        uiDispatch(AC.toastAdd(Date.now(), "Notificaciones activadas", "El celular ya puede recibir avisos de LifeOS."));
      } else {
        uiDispatch(AC.toastAdd(Date.now(), "Permiso no concedido", "Activá las notificaciones del sitio desde el navegador."));
      }
    } catch {
      uiDispatch(AC.toastAdd(Date.now(), "No se pudo pedir permiso", "El navegador bloqueó la solicitud de notificaciones."));
    }
  }, [uiDispatch, updatePWASetting]);

  const testMobileNotification = useCallback(async () => {
    const ok = await showLifeOSLocalNotification("LifeOS", "Prueba de recordatorio móvil funcionando.");
    if (!ok) uiDispatch(AC.toastAdd(Date.now(), "Sin permiso de notificación", "Primero activá notificaciones móviles."));
  }, [uiDispatch]);

  const clearLocalProgreso = useCallback(() => {
    const ok = window.confirm("¿Seguro que querés borrar el progreso guardado en este navegador?");
    if (!ok) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      uiDispatch(AC.toastAdd(Date.now(), "Progreso local borrado", "Recargá la página para volver al estado inicial."));
    } catch {
      uiDispatch(AC.toastAdd(Date.now(), "No se pudo borrar", "El navegador bloqueó localStorage."));
    }
  }, [uiDispatch]);

  const exportBackup = useCallback(() => {
    try {
      const blob = new Blob([serializeAppState(persistent)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `lifeos-respaldo-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      pDispatch(AC.appSettingsUpdate({ backup: { lastExportAt: new Date().toISOString() } }));
      uiDispatch(AC.toastAdd(Date.now(), "Respaldo exportado", "Guardá el archivo JSON en una carpeta segura."));
    } catch {
      uiDispatch(AC.toastAdd(Date.now(), "No se pudo exportar", "El navegador bloqueó la descarga del respaldo."));
    }
  }, [persistent, pDispatch, uiDispatch]);

  const importBackup = useCallback((event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const slice = deserializeAppState(String(reader.result || ""));
        if (!slice) throw new Error("Archivo inválido");
        const snapshot = deepMerge(PERSISTENT_INITIAL, slice);
        pDispatch(AC.stateHydrate(snapshot));
        pDispatch(AC.appSettingsUpdate({ backup: { lastImportAt: new Date().toISOString() } }));
        uiDispatch(AC.toastAdd(Date.now(), "Respaldo importado", "Tus datos fueron restaurados en este navegador."));
      } catch {
        uiDispatch(AC.toastAdd(Date.now(), "No se pudo importar", "El archivo no parece ser un respaldo válido de LifeOS."));
      }
    };
    reader.readAsText(file);
  }, [pDispatch, uiDispatch]);

  const resetRocketLeagueData = useCallback(() => {
    if (!window.confirm("¿Resetear solo Rocket League? Se borrará el progreso de entrenamiento y 1v1, no tus misiones generales.")) return;
    pDispatch(AC.domainReset("rocketLeague"));
    uiDispatch(AC.toastAdd(Date.now(), "Rocket League reiniciado", "El sistema Rocket volvió a cero."));
  }, [pDispatch, uiDispatch]);

  const resetWardrobeData = useCallback(() => {
    if (!window.confirm("¿Resetear solo Clóset/Ropero? Se borrarán prendas e historial de outfits.")) return;
    pDispatch(AC.domainReset("wardrobe"));
    uiDispatch(AC.toastAdd(Date.now(), "Clóset reiniciado", "El ropero volvió a la base sugerida."));
  }, [pDispatch, uiDispatch]);

  const formatBackupDate = useCallback((value) => {
    if (!value) return "Nunca";
    try { return new Date(value).toLocaleString("es-ES", { dateStyle:"short", timeStyle:"short" }); }
    catch { return "Registrado"; }
  }, []);

  const updateQuestDraft = useCallback((idx, patch) => {
    setQuestDraft((prev) => prev.map((q, i) => i === idx ? { ...q, ...patch } : q));
  }, []);

  const addQuestDraft = useCallback(() => {
    setQuestDraft((prev) => {
      const nextId = Math.max(0, ...prev.map(q => Number(q.id) || 0)) + 1;
      return sanitizeQuestItems([
        ...prev,
        {
          id: nextId,
          title: `Nueva misión ${nextId}`,
          sub: "30 min · describí la tarea",
          xp: 8,
          iconKey: QUEST_ICON_KEYS[nextId % QUEST_ICON_KEYS.length],
          diff: "MEDIO",
          cat: "mind",
          accent: QUEST_ACCENTS[nextId % QUEST_ACCENTS.length],
          link: "",
          linkLabel: "",
          links: [],
        },
      ]);
    });
  }, []);

  const removeQuestDraft = useCallback((idx) => {
    setQuestDraft((prev) => prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx));
  }, []);

  const moveQuestDraft = useCallback((idx, dir) => {
    setQuestDraft((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  const saveQuestDraft = useCallback(() => {
    pDispatch(AC.questsCustomUpdate(questDraft));
    uiDispatch(AC.toastAdd(Date.now(), "Misiones actualizadas", "Tus misiones personalizadas se guardaron localmente."));
  }, [pDispatch, questDraft, uiDispatch]);

  const resetQuestDraft = useCallback(() => {
    const defaults = sanitizeQuestItems(QUESTS);
    setQuestDraft(defaults);
    pDispatch(AC.questsCustomUpdate(defaults));
    uiDispatch(AC.toastAdd(Date.now(), "Misiones restauradas", "Volviste a las misiones base de LifeOS."));
  }, [pDispatch, uiDispatch]);

  return (
    <div style={{ animation:"sldIn .3s ease", maxWidth:980 }}>
      <div style={S.ptitle} className="mob-ptitle">Ajustes</div>
      <div style={S.psub} className="mob-psub">Respaldos, sincronización, persistencia local y edición rápida de tus misiones diarias.</div>

      <div className="g" style={{ padding:22, marginBottom:16 }}>
        <div style={S.stitle}>Sincronización en la nube</div>
        <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.7, marginBottom:16 }}>
          Conectá tu correo para sincronizar LifeOS entre laptop y celular. localStorage queda como respaldo automático.
        </div>

        {cloudUser ? (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ fontSize:13, color:"#34d399", fontWeight:800 }}>Conectado como {cloudUser.email}</div>
            <div style={{ fontSize:12, color:T_COLOR.muted }}>Estado: {cloudStatus}</div>
            {cloudMessage && <div style={{ fontSize:12, color:T_COLOR.subtext }}>{cloudMessage}</div>}
            <button onClick={handleCloudLogout} style={{ border:"1px solid rgba(248,113,113,.25)", background:"rgba(248,113,113,.08)", color:"#f87171", borderRadius:10, padding:"10px 14px", fontWeight:800, cursor:"pointer", width:"fit-content" }}>
              Cerrar sesión en la nube
            </button>
          </div>
        ) : (
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
            <input
              value={cloudEmail}
              onChange={(e) => setCloudEmail(e.target.value)}
              placeholder="tu-correo@gmail.com"
              style={{ flex:"1 1 240px", minHeight:42, background:"rgba(0,0,0,.2)", border:"1px solid rgba(255,255,255,.07)", color:T_COLOR.text, borderRadius:10, padding:"10px 12px", outline:"none" }}
            />
            <button onClick={handleCloudLogin} style={{ border:"1px solid rgba(34,211,238,.28)", background:"rgba(34,211,238,.08)", color:"#22d3ee", borderRadius:10, padding:"10px 14px", fontWeight:800, cursor:"pointer", minHeight:42 }}>
              Enviar enlace mágico
            </button>
            {cloudMessage && <div style={{ width:"100%", fontSize:12, color:T_COLOR.subtext }}>{cloudMessage}</div>}
          </div>
        )}
      </div>

      <div className="g" style={{ padding:22, marginBottom:16 }}>
        <div style={S.stitle}>App móvil / PWA</div>
        <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.7, marginBottom:16 }}>
          Instalá LifeOS como app en el celular. Los cambios siguen saliendo por GitHub → Vercel, así que web y app usan la misma versión. Las notificaciones están pensadas para móvil; en PC no hace falta activarlas.
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:12 }}>
          <div style={{ padding:14, borderRadius:14, border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.025)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, color:T_COLOR.text, fontWeight:900, fontSize:13, marginBottom:7 }}>
              <Home size={16} /> Estado de instalación
            </div>
            <div style={{ fontSize:12, color:isInstalledPWA ? "#34d399" : "#fbbf24", fontWeight:900, marginBottom:10 }}>
              {isInstalledPWA ? "Instalada como app" : "Todavía en navegador"}
            </div>
            <button onClick={installLifeOSApp} style={{ border:"1px solid rgba(34,211,238,.25)", background:"rgba(34,211,238,.08)", color:"#22d3ee", borderRadius:10, padding:"10px 12px", fontWeight:900, cursor:"pointer", width:"100%" }}>
              {isInstalledPWA ? "Abrir desde pantalla principal" : "Instalar LifeOS"}
            </button>
            {!deferredInstallPrompt && !isInstalledPWA && (
              <div style={{ fontSize:11, color:T_COLOR.muted, lineHeight:1.6, marginTop:9 }}>
                Si el botón no abre el instalador: menú del navegador → Agregar a pantalla principal / Instalar app.
              </div>
            )}
          </div>

          <div style={{ padding:14, borderRadius:14, border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.025)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, color:T_COLOR.text, fontWeight:900, fontSize:13, marginBottom:7 }}>
              <Bell size={16} /> Notificaciones móviles
            </div>
            <div style={{ fontSize:12, color:notificationPermission === "granted" ? "#34d399" : T_COLOR.muted, lineHeight:1.6, marginBottom:10 }}>
              Estado: {notificationPermission === "unsupported" ? "no soportadas" : notificationPermission === "granted" ? "activas" : notificationPermission === "denied" ? "bloqueadas" : "pendientes"}
              {!isMobilePWADevice ? " · activalas mejor desde el celular" : ""}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <button onClick={requestMobileNotifications} style={{ border:"1px solid rgba(52,211,153,.25)", background:"rgba(52,211,153,.08)", color:"#34d399", borderRadius:10, padding:"10px 12px", fontWeight:900, cursor:"pointer", flex:"1 1 140px" }}>
                Activar
              </button>
              <button onClick={testMobileNotification} style={{ border:"1px solid rgba(167,139,250,.25)", background:"rgba(167,139,250,.08)", color:"#a78bfa", borderRadius:10, padding:"10px 12px", fontWeight:900, cursor:"pointer", flex:"1 1 120px" }}>
                Probar
              </button>
            </div>
            <div style={{ fontSize:11, color:T_COLOR.muted, lineHeight:1.6, marginTop:9 }}>
              Los avisos de horario funcionan mejor con LifeOS instalada y abierta en segundo plano. Push con servidor queda para otra fase.
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:10 }}>
              <button onClick={() => updatePWASetting("taskReminders", !pwaSettings.taskReminders)} style={{ border:"1px solid rgba(255,255,255,.08)", background:pwaSettings.taskReminders ? "rgba(52,211,153,.08)" : "rgba(255,255,255,.03)", color:pwaSettings.taskReminders ? "#34d399" : T_COLOR.muted, borderRadius:10, padding:"9px 10px", fontWeight:900, cursor:"pointer" }}>
                Recordatorios de tareas: {pwaSettings.taskReminders ? "ON" : "OFF"}
              </button>
              <button onClick={() => updatePWASetting("notifyTaskStart", !pwaSettings.notifyTaskStart)} style={{ border:"1px solid rgba(255,255,255,.08)", background:pwaSettings.notifyTaskStart ? "rgba(34,211,238,.08)" : "rgba(255,255,255,.03)", color:pwaSettings.notifyTaskStart ? "#22d3ee" : T_COLOR.muted, borderRadius:10, padding:"9px 10px", fontWeight:900, cursor:"pointer" }}>
                Avisar al iniciar tarea: {pwaSettings.notifyTaskStart ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="g" style={{ padding:22, marginBottom:16, borderColor:"rgba(248,113,113,.16)", background:"rgba(248,113,113,.035)" }}>
        <div style={S.stitle}>XP y castigos</div>
        <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.7, marginBottom:12 }}>
          Si una misión queda pendiente al reset diario, LifeOS resta el XP de esa misión. Esto no borra tus misiones ni tus datos; solo evita subir de nivel por inercia.
        </div>
        <button onClick={() => pDispatch(AC.appSettingsUpdate({ penalties:{ missedQuestXp: !(persistent.appSettings?.penalties?.missedQuestXp !== false) } }))} style={{ border:"1px solid rgba(248,113,113,.25)", background:(persistent.appSettings?.penalties?.missedQuestXp !== false) ? "rgba(248,113,113,.08)" : "rgba(255,255,255,.03)", color:(persistent.appSettings?.penalties?.missedQuestXp !== false) ? "#f87171" : T_COLOR.muted, borderRadius:10, padding:"10px 14px", fontWeight:900, cursor:"pointer" }}>
          Castigo por misiones fallidas: {(persistent.appSettings?.penalties?.missedQuestXp !== false) ? "ON" : "OFF"}
        </button>
        <button onClick={() => pDispatch(AC.appSettingsUpdate({ penalties:{ partialCreditStarted: !(persistent.appSettings?.penalties?.partialCreditStarted !== false) } }))} style={{ border:"1px solid rgba(251,191,36,.25)", background:(persistent.appSettings?.penalties?.partialCreditStarted !== false) ? "rgba(251,191,36,.08)" : "rgba(255,255,255,.03)", color:(persistent.appSettings?.penalties?.partialCreditStarted !== false) ? "#fbbf24" : T_COLOR.muted, borderRadius:10, padding:"10px 14px", fontWeight:900, cursor:"pointer" }}>
          Si inicié pero no terminé: {(persistent.appSettings?.penalties?.partialCreditStarted !== false) ? "pierde 50%" : "pierde 100%"}
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }} className="mob-layout-grid">
        <div className="g" style={{ padding:22 }}>
          <div style={S.stitle}>Perfil</div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:54, height:54, borderRadius:14, background:"linear-gradient(135deg,#7c3aed,#06b6d4)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:T_FONT.display, fontWeight:800, fontSize:22, color:"white" }}>H</div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:T_COLOR.text }}>Hector</div>
              <div style={{ fontSize:12, color:T_COLOR.muted, marginTop:3 }}>Lv.{SELECTORS.level(persistent.xp.total)} · {SELECTORS.rank(SELECTORS.level(persistent.xp.total))}</div>
            </div>
          </div>
        </div>

        <div className="g" style={{ padding:22 }}>
          <div style={S.stitle}>Respaldo y resets seguros</div>
          <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.7 }}>
            Exportá un JSON antes de cambios grandes. También podés resetear solo sistemas específicos sin tocar todo LifeOS.
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12, fontSize:11.5, color:T_COLOR.muted }}>
            <div style={{ padding:9, borderRadius:10, border:"1px solid rgba(255,255,255,.06)", background:"rgba(255,255,255,.025)" }}>Último export: <b style={{ color:T_COLOR.text }}>{formatBackupDate(backupSettings.lastExportAt)}</b></div>
            <div style={{ padding:9, borderRadius:10, border:"1px solid rgba(255,255,255,.06)", background:"rgba(255,255,255,.025)" }}>Última importación: <b style={{ color:T_COLOR.text }}>{formatBackupDate(backupSettings.lastImportAt)}</b></div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:16 }}>
            <button onClick={exportBackup} style={{ border:"1px solid rgba(52,211,153,.25)", background:"rgba(52,211,153,.08)", color:"#34d399", borderRadius:10, padding:"10px 14px", fontWeight:800, cursor:"pointer" }}>
              Exportar respaldo
            </button>
            <button onClick={() => importRef.current?.click()} style={{ border:"1px solid rgba(167,139,250,.25)", background:"rgba(167,139,250,.08)", color:"#a78bfa", borderRadius:10, padding:"10px 14px", fontWeight:800, cursor:"pointer" }}>
              Importar respaldo
            </button>
            <button onClick={resetRocketLeagueData} style={{ border:"1px solid rgba(34,211,238,.22)", background:"rgba(34,211,238,.07)", color:"#22d3ee", borderRadius:10, padding:"10px 14px", fontWeight:800, cursor:"pointer" }}>
              Reset Rocket
            </button>
            <button onClick={resetWardrobeData} style={{ border:"1px solid rgba(251,191,36,.22)", background:"rgba(251,191,36,.07)", color:"#fbbf24", borderRadius:10, padding:"10px 14px", fontWeight:800, cursor:"pointer" }}>
              Reset Clóset
            </button>
            <input ref={importRef} type="file" accept="application/json,.json" onChange={importBackup} style={{ display:"none" }} />
          </div>
        </div>
      </div>

      <div className="g" style={{ padding:22, marginBottom:16 }}>
        <div style={S.stitle}>Sonidos y avisos</div>
        <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.7, marginBottom:14 }}>
          Controlá los sonidos de menú, misiones, cronómetros y misión padre. En móvil puede requerir tocar la pantalla una vez para activar audio.
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:10, marginBottom:14 }}>
          {[
            ["enabled", "Sonido general"],
            ["menu", "Menú"],
            ["complete", "Misiones"],
            ["timer", "Cronómetro"],
            ["mission", "Misión padre"],
          ].map(([key, label]) => (
            <label key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, padding:"11px 12px", borderRadius:12, background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.06)", color:T_COLOR.text, fontSize:12, fontWeight:800 }}>
              <span>{label}</span>
              <input type="checkbox" checked={audioSettings[key] !== false} onChange={(e) => updateAudioSetting(key, e.target.checked)} />
            </label>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:12, color:T_COLOR.muted, minWidth:70 }}>Volumen</span>
          <input type="range" min="0" max="1" step="0.05" value={Number(audioSettings.volume) || 0.75} onChange={(e) => updateAudioSetting("volume", Number(e.target.value))} style={{ flex:1 }} />
          <button onClick={() => { unlockLifeOSAudio(); playLifeOSSound("mission"); }} style={{ border:"1px solid rgba(34,211,238,.25)", background:"rgba(34,211,238,.08)", color:"#22d3ee", borderRadius:10, padding:"8px 11px", fontWeight:900, cursor:"pointer" }}>Probar</button>
        </div>
      </div>

      <div className="g" style={{ padding:22, marginBottom:16 }}>
        <div style={S.stitle}>Links de páginas</div>
        <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.7, marginBottom:16 }}>
          Accesos rápidos a tus páginas externas para estudiar, practicar y ver tus proyectos.
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:10 }} className="mob-layout-grid">
          {LIFEOS_LINKS.map((lnk) => (
            <a
              key={lnk.id}
              href={lnk.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                gap:12,
                padding:14,
                borderRadius:12,
                border:"1px solid rgba(34,211,238,.18)",
                background:"rgba(34,211,238,.055)",
                color:T_COLOR.text,
                textDecoration:"none",
              }}
            >
              <div>
                <div style={{ fontSize:13, fontWeight:900, marginBottom:4 }}>{lnk.label}</div>
                <div style={{ fontSize:11, color:T_COLOR.subtext, lineHeight:1.45 }}>{lnk.note}</div>
              </div>
              <ArrowRight size={16} color="#22d3ee" style={{ flexShrink:0 }}/>
            </a>
          ))}
        </div>
      </div>

      <div className="g" style={{ padding:22, marginBottom:16 }}>
        <div style={S.stitle}>Misiones diarias editables</div>
        <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.7, marginBottom:16 }}>
          Cambiá nombres, descripciones y XP sin tocar código. Esto te permite usar LifeOS con tus responsabilidades reales hasta que agreguemos el generador inteligente.
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {questDraft.map((q, idx) => (
            <div key={q.id} style={{ display:"grid", gridTemplateColumns:"1.05fr 1.25fr .8fr 1fr 70px 112px", gap:10, alignItems:"center", padding:12, borderRadius:12, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)" }} className="mob-layout-grid">
              <input value={q.title} onChange={(e) => updateQuestDraft(idx, { title:e.target.value })} style={{ background:"rgba(0,0,0,.2)", border:"1px solid rgba(255,255,255,.07)", color:T_COLOR.text, borderRadius:9, padding:"10px 12px", fontWeight:700 }} />
              <input value={q.sub} onChange={(e) => updateQuestDraft(idx, { sub:e.target.value })} placeholder="Duración + descripción" style={{ background:"rgba(0,0,0,.2)", border:"1px solid rgba(255,255,255,.07)", color:T_COLOR.subtext, borderRadius:9, padding:"10px 12px" }} />
              <select value={getQuestRole(q)} onChange={(e) => updateQuestDraft(idx, { role:e.target.value })} style={{ background:"rgba(0,0,0,.2)", border:"1px solid rgba(255,255,255,.07)", color:getQuestRoleMeta({ role:getQuestRole(q) }).color, borderRadius:9, padding:"10px 10px", fontWeight:900 }}>
                <option value="mandatory">Obligatoria</option>
                <option value="training">Entrenamiento</option>
                <option value="optional">Opcional</option>
                <option value="rest">Descanso</option>
              </select>
              <input value={q.link || ""} onChange={(e) => updateQuestDraft(idx, { link:e.target.value, linkLabel:q.linkLabel || "Abrir página" })} placeholder="Link opcional" style={{ background:"rgba(0,0,0,.2)", border:"1px solid rgba(255,255,255,.07)", color:"#22d3ee", borderRadius:9, padding:"10px 12px" }} />
              <input type="number" min="0" max="999" value={q.xp} onChange={(e) => updateQuestDraft(idx, { xp:Number(e.target.value) || 0 })} style={{ background:"rgba(0,0,0,.2)", border:"1px solid rgba(255,255,255,.07)", color:q.accent, borderRadius:9, padding:"10px 12px", fontWeight:900 }} />
              <div style={{ display:"flex", gap:6, justifyContent:"flex-end" }}>
                <button onClick={() => moveQuestDraft(idx, -1)} disabled={idx === 0} style={{ width:30, height:34, borderRadius:9, border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.035)", color:idx === 0 ? "#334155" : T_COLOR.muted, cursor:idx === 0 ? "not-allowed" : "pointer" }}>↑</button>
                <button onClick={() => moveQuestDraft(idx, 1)} disabled={idx === questDraft.length - 1} style={{ width:30, height:34, borderRadius:9, border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.035)", color:idx === questDraft.length - 1 ? "#334155" : T_COLOR.muted, cursor:idx === questDraft.length - 1 ? "not-allowed" : "pointer" }}>↓</button>
                <button onClick={() => removeQuestDraft(idx)} disabled={questDraft.length <= 1} style={{ width:34, height:34, borderRadius:9, border:"1px solid rgba(248,113,113,.18)", background:"rgba(248,113,113,.07)", color:questDraft.length <= 1 ? "#334155" : "#f87171", cursor:questDraft.length <= 1 ? "not-allowed" : "pointer", fontWeight:900 }}>×</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:16 }}>
          <button onClick={addQuestDraft} disabled={questDraft.length >= 24} style={{ border:"1px solid rgba(52,211,153,.28)", background:"rgba(52,211,153,.08)", color:questDraft.length >= 24 ? "#475569" : "#34d399", borderRadius:10, padding:"10px 14px", fontWeight:800, cursor:questDraft.length >= 24 ? "not-allowed" : "pointer" }}>
            Agregar misión
          </button>
          <button onClick={saveQuestDraft} style={{ border:"1px solid rgba(34,211,238,.28)", background:"rgba(34,211,238,.08)", color:"#22d3ee", borderRadius:10, padding:"10px 14px", fontWeight:800, cursor:"pointer" }}>
            Guardar misiones
          </button>
          <button onClick={resetQuestDraft} style={{ border:"1px solid rgba(251,191,36,.25)", background:"rgba(251,191,36,.08)", color:"#fbbf24", borderRadius:10, padding:"10px 14px", fontWeight:800, cursor:"pointer" }}>
            Restaurar misiones base
          </button>
          <span style={{ alignSelf:"center", fontSize:11, color:T_COLOR.muted }}>{questDraft.length}/24 misiones</span>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }} className="mob-layout-grid">
        <div className="g" style={{ padding:22 }}>
          <div style={S.stitle}>Persistencia local</div>
          <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.7 }}>
            Autosave activo con localStorage. Usá siempre el mismo navegador o exportá/importá tu respaldo.
          </div>
          <button
            onClick={clearLocalProgreso}
            style={{ marginTop:16, border:"1px solid rgba(248,113,113,.25)", background:"rgba(248,113,113,.08)", color:"#f87171", borderRadius:10, padding:"10px 14px", fontWeight:800, cursor:"pointer" }}
          >
            Borrar progreso local
          </button>
        </div>

        <div className="g" style={{ padding:22 }}>
          <div style={S.stitle}>Sistema</div>
          <div style={{ fontSize:12, color:T_COLOR.muted, lineHeight:1.7 }}>
            LIFE OS v31.5 · Estado operativo · Schema {STORAGE_SCHEMA_VERSION}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// § 12 · NAVIGATION DEFINITION
// ─────────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    title: "Día",
    items: [
      { id:"dashboard",    icon:Home,     label:"Hoy"      },
      { id:"quests",       icon:Target,   label:"Misiones" },
      { id:"schedule",     icon:Calendar, label:"Horario"  },
      { id:"focus",        icon:Timer,    label:"Sesión"   },
    ],
  },
  {
    title: "Sistemas",
    items: [
      { id:"rocketLeague", icon:Gamepad2, label:"Rocket" },
      { id:"blender",      icon:Layers,   label:"Blender" },
      { id:"wardrobe",     icon:Shirt,    label:"Clóset" },
      { id:"reflection",   icon:MessageSquare, label:"Reflexión", accent:true },
    ],
  },
  {
    title: "Control",
    items: [
      { id:"stats",        icon:BarChart2, label:"Análisis" },
      { id:"profile",      icon:User,      label:"Perfil"   },
      { id:"settings",     icon:Settings,  label:"Ajustes"  },
    ],
  },
];

const NAV_ITEMS = NAV_GROUPS.flatMap(group => group.items);

const VIEW_ALIASES = Object.freeze({
  inicio:       "dashboard",
  hoy:          "dashboard",
  today:        "dashboard",
  home:         "dashboard",
  terminal:     "dashboard",
  misiones:     "quests",
  quests:       "quests",
  calculo:      "schedule",
  cálculo:      "schedule",
  calculus:     "schedule",
  mm201:        "schedule",
  trainercalc:  "schedule",
  rocket:       "rocketLeague",
  rocketleague: "rocketLeague",
  rl:           "rocketLeague",
  training:     "rocketLeague",
  rocketLeague: "rocketLeague",
  blender:      "blender",
  blender3d:    "blender",
  b3d:          "blender",
  "3d":         "blender",
  horario:      "schedule",
  schedule:     "schedule",
  plan:         "schedule",
  planner:      "schedule",
  sesion:       "focus",
  sesión:       "focus",
  focus:        "focus",
  enfoque:      "focus",
  closet:       "wardrobe",
  clóset:       "wardrobe",
  ropero:       "wardrobe",
  ropa:         "wardrobe",
  wardrobe:     "wardrobe",
  logros:       "focus",
  logro:        "focus",
  achievements: "focus",
  achievement:  "focus",
  trophies:     "focus",
  trofeos:      "focus",
  analisis:     "stats",
  análisis:     "stats",
  stats:        "stats",
  reflection:   "reflection",
  reflexion:    "reflection",
  reflexión:    "reflection",
  perfil:       "profile",
  profile:      "profile",
  ajustes:      "settings",
  settings:     "settings",
});

const normalizeView = (view) => VIEW_ALIASES[String(view || "dashboard").toLowerCase()] || "dashboard";

const VIEW_MAP = {
  dashboard:    DashboardView,
  quests:       QuestsView,
  calculus:     CalculusTrainerView,
  rocketLeague: RocketLeagueView,
  blender:      BlenderView,
  schedule:     ScheduleView,
  focus:        FocusSessionView,
  wardrobe:     WardrobeView,
  stats:        StatsView,
  reflection:   ReflectionView,
  profile:      ProfileView,
  settings:     SettingsView,
};

// ─────────────────────────────────────────────────────────────────
// § 13 · ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────

export default function LifeOS() {
  const [persistent, pDispatch] = useReducer(persistentReducer, PERSISTENT_INITIAL);
  const [ui,         uiDispatch] = useReducer(uiReducer,         UI_INITIAL);

  // ── Persistence engine state ──────────────────────────────────
  const [hydrated,       setHydrated]       = useState(false);
  const [persistStatus,  setPersistStatus]  = useState(PERSIST_STATUS.IDLE);
  const isFirstRender                       = useRef(true);
  const debouncedSaver                      = useRef(null);

  // ── Cloud sync state (Supabase, optional; localStorage remains fallback) ─
  const [cloudUser,      setCloudUser]      = useState(null);
  const [cloudEmail,     setCloudEmail]     = useState("");
  const [cloudStatus,    setCloudStatus]    = useState("LOCAL");
  const [cloudMessage,   setCloudMessage]   = useState("");
  const cloudHydratedRef                    = useRef(false);
  const cloudSaveTimerRef                   = useRef(null);
  const persistentRef                       = useRef(persistent);
  persistentRef.current                     = persistent;

  const loadCloudState = useCallback(async (userId) => {
    if (!supabase || !userId) return;

    setCloudStatus("CARGANDO");
    setCloudMessage("Cargando datos desde la nube…");

    const { data, error } = await supabase
      .from("lifeos_profiles")
      .select("state")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.warn("[LifeOS Cloud] Load failed:", error.message);
      setCloudStatus("ERROR");
      setCloudMessage("No se pudo cargar la nube. Se mantiene el guardado local.");
      cloudHydratedRef.current = true;
      return;
    }

    const normalized = normalizeCloudState(data?.state);

    if (normalized) {
      pDispatch(AC.stateHydrate(normalized));
      setCloudMessage("Datos cargados desde la nube.");
    } else {
      const { error: upsertError } = await supabase.from("lifeos_profiles").upsert({
        user_id: userId,
        state: Object.fromEntries(PERSISTENT_DOMAINS.map((k) => [k, persistentRef.current?.[k] ?? PERSISTENT_INITIAL[k]])),
        updated_at: new Date().toISOString(),
      });

      if (upsertError) {
        console.warn("[LifeOS Cloud] Initial save failed:", upsertError.message);
        setCloudStatus("ERROR");
        setCloudMessage("No se pudo crear tu perfil en la nube.");
        cloudHydratedRef.current = true;
        return;
      }

      setCloudMessage("Perfil creado en la nube.");
    }

    cloudHydratedRef.current = true;
    setCloudStatus("SINCRONIZADO");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCloudLogin = useCallback(async () => {
    if (!supabase) {
      setCloudStatus("ERROR");
      setCloudMessage("Supabase no está configurado en este entorno.");
      return;
    }

    const email = cloudEmail.trim();
    if (!email) {
      setCloudMessage("Escribí tu correo primero.");
      return;
    }

    setCloudStatus("ENVIANDO");
    setCloudMessage("Enviando enlace mágico…");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      console.warn("[LifeOS Cloud] Login failed:", error.message);
      setCloudStatus("ERROR");
      setCloudMessage(error.message);
      return;
    }

    setCloudStatus("REVISA_TU_CORREO");
    setCloudMessage("Te envié un enlace mágico. Abrilo para iniciar sesión.");
  }, [cloudEmail]);

  const handleCloudLogout = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setCloudUser(null);
    setCloudStatus("LOCAL");
    setCloudMessage("Sesión cerrada. Usando guardado local.");
    cloudHydratedRef.current = false;
  }, []);

  // ── Startup hydration ─────────────────────────────────────────
  // Pipeline: read → deserialize → migrate → validate → deepMerge → dispatch
  // Any failure at any stage boots from PERSISTENT_INITIAL silently.
  useEffect(() => {
    let cancelled = false;

    hydrateStateAsync().then(snapshot => {
      if (cancelled) return;

      if (snapshot && typeof snapshot === "object") {
        // Filter to only domains present in the snapshot to prevent
        // accidental overwrites of default values with undefined.
        const safeSnapshot = Object.fromEntries(
          PERSISTENT_DOMAINS
            .filter(k => snapshot[k] !== undefined)
            .map(k => [k, snapshot[k]])
        );

        if (Object.keys(safeSnapshot).length > 0) {
          pDispatch(AC.stateHydrate(safeSnapshot));
        }
      }

      setHydrated(true);
      setPersistStatus(PERSIST_STATUS.HYDRATED);
      setTimeout(() => setPersistStatus(PERSIST_STATUS.IDLE), 2200);
    }).catch(() => {
      if (!cancelled) setHydrated(true); // storage unavailable — boot with defaults
    });

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cloud session bootstrap ───────────────────────────────────
  useEffect(() => {
    if (!supabase) {
      setCloudStatus("LOCAL");
      setCloudMessage("Modo local activo.");
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const user = data?.session?.user ?? null;
      setCloudUser(user);
      if (user?.email) setCloudEmail(user.email);
      if (user?.id) loadCloudState(user.id);
      else setCloudStatus("LOCAL");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setCloudUser(user);
      if (user?.email) setCloudEmail(user.email);

      if (user?.id) {
        cloudHydratedRef.current = false;
        loadCloudState(user.id);
      } else {
        cloudHydratedRef.current = false;
        setCloudStatus("LOCAL");
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, [loadCloudState]);

  // ── Cloud autosave ───────────────────────────────────────────
  useEffect(() => {
    if (!supabase || !cloudUser?.id) return;
    if (!hydrated || !cloudHydratedRef.current) return;

    setCloudStatus("GUARDANDO");

    if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);

    cloudSaveTimerRef.current = setTimeout(async () => {
      const state = Object.fromEntries(PERSISTENT_DOMAINS.map((k) => [k, persistent[k]]));
      const { error } = await supabase.from("lifeos_profiles").upsert({
        user_id: cloudUser.id,
        state,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.warn("[LifeOS Cloud] Save failed:", error.message);
        setCloudStatus("ERROR");
        setCloudMessage("No se pudo guardar en la nube. Se mantiene el respaldo local.");
        return;
      }

      setCloudStatus("SINCRONIZADO");
      setCloudMessage("Guardado en la nube.");
    }, 900);

    return () => {
      if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);
    };
  }, [persistent, cloudUser, hydrated]);

  // ── Daily mission reset ───────────────────────────────────────
  // Keeps normal missions aligned with the current local day, even if the app
  // stays open past midnight. Rocket League keeps its own subtask reset.
  useEffect(() => {
    if (!hydrated) return;

    const syncDailyMissions = () => {
      const today = getLifeOSDateKey();
      if (persistentRef.current?.quests?.lastResetDate !== today) {
        pDispatch(AC.questsDailySync(today));
      }
    };

    syncDailyMissions();
    const interval = setInterval(syncDailyMissions, 60 * 1000);
    return () => clearInterval(interval);
  }, [hydrated, pDispatch]);

  // ── Debounced autosave ────────────────────────────────────────
  // Fires on every persistent state mutation after hydration completes.
  // 1.2s debounce window. Writes always flush on beforeunload (see below).
  useEffect(() => {
    if (!debouncedSaver.current) {
      debouncedSaver.current = makeDebouncedSave(async (state) => {
        setPersistStatus(PERSIST_STATUS.SAVING);
        const ok = await persistStateAsync(state); // includes 2-retry logic
        setPersistStatus(ok ? PERSIST_STATUS.SAVED : PERSIST_STATUS.ERROR);
        setTimeout(() => setPersistStatus(PERSIST_STATUS.IDLE), 1800);
      }, 1200);
    }

    if (!hydrated) return;

    // Skip first render post-hydration: state hasn't been user-modified yet.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setPersistStatus(PERSIST_STATUS.SAVING);
    debouncedSaver.current.trigger(persistent);

    return () => {
      // Flush on component teardown (in-flight debounce → immediate write)
      debouncedSaver.current?.flush(persistent);
    };
  }, [persistent, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── beforeunload flush ────────────────────────────────────────
  // Tab close / navigation away: synchronously drain the debounce buffer.
  // Uses the current persistent ref to avoid stale closure capture.
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Flush debounce buffer with the most recent state snapshot.
      // This ensures no XP / quest / reflection data is lost on tab close.
      debouncedSaver.current?.flush(persistentRef.current);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stable context values ─────────────────────────────────────
  const dataCtxValue = useMemo(() => ({
    persistent, pDispatch,
    cloudUser, cloudEmail, setCloudEmail, cloudStatus, cloudMessage,
    handleCloudLogin, handleCloudLogout,
  }), [persistent, cloudUser, cloudEmail, cloudStatus, cloudMessage, handleCloudLogin, handleCloudLogout]);
  const uiCtxValue   = useMemo(() => ({ ui, uiDispatch }),         [ui]);

  const level  = useMemo(() => SELECTORS.level(persistent.xp.total),    [persistent.xp.total]);
  const xpPct  = useMemo(() => SELECTORS.levelPct(persistent.xp.total), [persistent.xp.total]);
  const streak = persistent.streak.current;

  const activeQuests = useMemo(() => getActiveQuests(persistent), [persistent.quests.customItems]);
  const triggers = useMemo(
    () => SELECTORS.reflectionTriggers(persistent.quests.completedIds, streak, activeQuests),
    [persistent.quests.completedIds, streak, activeQuests]
  );

  const notificationSentRef = useRef(new Set());

  useEffect(() => {
    if (!hydrated) return;
    const prefs = deepMerge(createAppSettingsInitial().pwa, persistent.appSettings?.pwa || {});
    if (!prefs.mobileNotifications || !prefs.taskReminders || typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") return;
    if (!isLikelyMobileDevice()) return;

    const checkScheduleNotifications = () => {
      const now = new Date();
      const today = (now.getDay() + 6) % 7;
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const lead = Math.max(1, Math.min(60, Math.floor(Number(prefs.reminderLeadMinutes) || 10)));
      const weekKey = getScheduleWeekKey(now);
      const swimDays = SELECTORS.swimDays(persistentRef.current?.planner?.swimPairIndex || 0);
      const quests = getActiveQuests(persistentRef.current || persistent);
      const blocks = getScheduleBlocks(today, swimDays, quests, weekKey);
      const allBlocks = [...(blocks.main || []), ...(blocks.morning || []), ...(blocks.afternoon || [])].filter(b => b.questId && b.type !== "BUFFER");
      const dateKey = getLifeOSDateKey(now);

      for (const block of allBlocks) {
        const quest = quests.find(q => q.id === block.questId);
        if (!quest) continue;
        const diff = block.startMin - nowMin;
        const beforeKey = `${dateKey}:${block.key}:before`;
        const startKey = `${dateKey}:${block.key}:start`;
        if (diff <= lead && diff >= lead - 1 && !notificationSentRef.current.has(beforeKey)) {
          notificationSentRef.current.add(beforeKey);
          showLifeOSLocalNotification("LifeOS", `En ${lead} min toca: ${quest.title}`, `lifeos-${beforeKey}`);
        }
        if (prefs.notifyTaskStart && diff <= 0 && diff >= -1 && !notificationSentRef.current.has(startKey)) {
          notificationSentRef.current.add(startKey);
          showLifeOSLocalNotification("LifeOS", `Ahora toca: ${quest.title}`, `lifeos-${startKey}`);
        }
      }
      const quietHour = Math.max(18, Math.min(23, Math.floor(Number(prefs.quietAfterHour) || 22)));
      const digestKey = `${dateKey}:pending-digest`;
      if (prefs.pendingDigest && now.getHours() === Math.max(19, quietHour - 1) && now.getMinutes() <= 1 && !notificationSentRef.current.has(digestKey)) {
        const done = new Set(persistentRef.current?.quests?.completedIds || []);
        const pending = quests.filter(q => !done.has(q.id));
        if (pending.length > 0) {
          notificationSentRef.current.add(digestKey);
          showLifeOSLocalNotification("LifeOS", `Te quedan ${pending.length} misiones pendientes`, `lifeos-${digestKey}`);
        }
      }
    };

    checkScheduleNotifications();
    const interval = setInterval(checkScheduleNotifications, 60 * 1000);
    return () => clearInterval(interval);
  }, [hydrated, persistent.appSettings?.pwa, persistent.quests.customItems]);

  const normalizedView = normalizeView(ui.view);
  const ActiveView = VIEW_MAP[normalizedView] || DashboardView;

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 17 ? "Buenas tardes" : "Buenas noches";

  const handleNavClick = useCallback((id) => {
    unlockLifeOSAudio();
    if (ui.view !== id) playLifeOSSound("menu");
    uiDispatch(AC.setView(id));
  }, [ui.view, uiDispatch]);

  return (
    <AppDataCtx.Provider value={dataCtxValue}>
      <AppUICtx.Provider value={uiCtxValue}>
        <style>{CSS}</style>

        {/* ── Hydration shield ───────────────────────────────────────
            Prevents PERSISTENT_INITIAL flash before localStorage hydrates.
            ~20–60ms on first paint, imperceptible on subsequent loads.    */}
        {!hydrated && (
          <div style={{
            position:"fixed", inset:0, background:"#050508", zIndex:9999,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
              <div style={{ width:38, height:38, background:"linear-gradient(135deg,#7c3aed,#06b6d4)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 22px rgba(124,58,237,.5)", animation:"glowP 2s ease-in-out infinite" }}>
                <Zap size={19} color="white"/>
              </div>
              <div style={{ fontFamily:T_FONT.display, fontSize:11, fontWeight:700, letterSpacing:2, color:"#374151", textTransform:"uppercase" }}>Restaurando tu OS…</div>
            </div>
          </div>
        )}

        {/* Nivel-up overlay */}
        {ui.showNivelUp && (
          <div className="lvlup" onClick={() => uiDispatch(AC.hideNivelUp())}>
            <div className="lvlup-box">
              <div style={{ fontSize:48, marginBottom:12 }}>⚡</div>
              <div style={{ fontFamily:T_FONT.display, fontSize:13, fontWeight:700, letterSpacing:3, color:"#fbbf24", textTransform:"uppercase", marginBottom:8 }}>Nivel superado</div>
              <div style={{ fontFamily:T_FONT.display, fontSize:52, fontWeight:800, background:"linear-gradient(135deg,#fbbf24,#f59e0b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>Lv.{level}</div>
              <div style={{ fontSize:14, color:"#8892a4", marginTop:8 }}>{SELECTORS.rank(level)}</div>
              <div style={{ marginTop:24, fontSize:12, color:"#475569", letterSpacing:.5 }}>Haz clic en cualquier lugar para continuar</div>
            </div>
          </div>
        )}

        {/* Toast stack */}
        <div style={{ position:"fixed", top:16, right:16, zIndex:1000, display:"flex", flexDirection:"column", gap:8, pointerEvents:"none" }}>
          {ui.toasts.map(t => <ToastItem key={t.id} msg={t.msg} sub={t.sub}/>)}
        </div>

        <div className="los">
          <div className="orb1"/><div className="orb2"/>

          {/* ── Sidebar ── */}
          <aside className="sb">
            <div className="sb-logo">
              <div className="sb-icon"><Zap size={17} color="white"/></div>
              <div><div className="sb-name">LIFE OS</div><div className="sb-ver">v31.5</div></div>
            </div>

            <nav style={{ flex:1, overflow:"auto", paddingRight:2 }}>
              {NAV_GROUPS.map(group => (
                <div key={group.title} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, color:"#475569", fontWeight:900, letterSpacing:1.1, textTransform:"uppercase", padding:"0 12px 6px" }}>{group.title}</div>
                  {group.items.map(n => {
                    const I  = n.icon;
                    const on = ui.view === n.id;
                    return (
                      <div
                        key={n.id}
                        className={`ni ${on ? "on" : ""}`}
                        onClick={() => handleNavClick(n.id)}
                        style={n.accent && !on ? { borderColor:"rgba(167,139,250,.12)", background:"rgba(167,139,250,.04)" } : {}}
                      >
                        {on && <span className="ni-bar"/>}
                        <I size={17} style={{ flexShrink:0, color: n.accent && !on ? "#a78bfa80" : "" }}/>
                        <span>{n.label}</span>
                        {n.accent && !on && triggers.length > 0 && (
                          <span style={{ width:7, height:7, borderRadius:"50%", background:"#a78bfa", flexShrink:0, boxShadow:"0 0 6px #a78bfa" }}/>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="sb-footer">
              <div className="user-card">
                <div className="ava">H</div>
                <div className="user-info">
                  <div style={{ fontSize:13, fontWeight:600, color:"#eef2f8" }}>Hector</div>
                  <div style={{ fontSize:11, color:"#7c3aed", fontWeight:700, letterSpacing:.4 }}>Lv.{level} · {SELECTORS.rank(level)}</div>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="los-main">
            <header className="tb">
              <div className="tb-greet">
                <div style={{ fontSize:13, color:"#8892a4" }}>
                  {greeting}, <span style={{ color:"#eef2f8", fontWeight:600 }}>Hector</span>
                </div>
                <div style={{ fontSize:11, color:"#374151", marginTop:1 }}>
                  {new Date().toLocaleDateString("es-ES", { weekday:"long", month:"long", day:"numeric" })}
                </div>
              </div>

              <div style={{ ...S.chipBase, background:"rgba(124,58,237,.12)", border:"1px solid rgba(124,58,237,.28)", color:"#a78bfa" }}>
                <Star size={11}/><span>Nivel {level}</span>
              </div>

              <div className="xp-track">
                <div className="xp-fill" style={{ width:`${xpPct}%` }}/>
              </div>
              <div style={{ fontSize:11, color:"#64748b", whiteSpace:"nowrap" }}>{Math.round(xpPct)}%</div>

              <div style={{ ...S.chipBase, background:"rgba(251,191,36,.1)", border:"1px solid rgba(251,191,36,.22)", color:"#fbbf24" }}>
                <Flame size={12}/><span>{streak}d</span>
              </div>

              {/* Persistence status dot — version + status on hover */}
              <div
                title={
                  persistStatus === PERSIST_STATUS.SAVING   ? `Saving… (schema v${STORAGE_SCHEMA_VERSION})` :
                  persistStatus === PERSIST_STATUS.SAVED    ? `Saved (schema v${STORAGE_SCHEMA_VERSION})`   :
                  persistStatus === PERSIST_STATUS.HYDRATED ? "Progreso restored"                            :
                  persistStatus === PERSIST_STATUS.ERROR    ? "Save failed — retrying"                       : ""
                }
                style={{
                  width:7, height:7, borderRadius:"50%", flexShrink:0,
                  transition:"background .4s ease, box-shadow .4s ease",
                  background:
                    persistStatus === PERSIST_STATUS.SAVING   ? "#fbbf24" :
                    persistStatus === PERSIST_STATUS.SAVED    ? "#34d399" :
                    persistStatus === PERSIST_STATUS.HYDRATED ? "#22d3ee" :
                    persistStatus === PERSIST_STATUS.ERROR    ? "#f87171" : "#1e293b",
                  boxShadow:
                    persistStatus === PERSIST_STATUS.SAVING   ? "0 0 6px #fbbf24" :
                    persistStatus === PERSIST_STATUS.SAVED    ? "0 0 6px #34d399" :
                    persistStatus === PERSIST_STATUS.HYDRATED ? "0 0 8px #22d3ee" :
                    persistStatus === PERSIST_STATUS.ERROR    ? "0 0 6px #f87171" : "none",
                }}
              />

              <div className="ib"><Bell size={14}/></div>
            </header>

            <div className="ca">
              <ActiveView/>
            </div>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <MobileBottomNav/>
      </AppUICtx.Provider>
    </AppDataCtx.Provider>
  );
}
