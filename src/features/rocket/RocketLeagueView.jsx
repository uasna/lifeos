import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle, Brain, CheckCircle2, Circle, Flame, Gamepad2, Layers,
  Pause, Play, Plus, RefreshCw, Sword, Target, Timer, Zap
} from "lucide-react";

function RocketSpeedflipDarCleanCancelCard({ recommended, deps }) {
  const {
    persistent, pDispatch, uiDispatch, AC,
    createRocketLeagueInitialState, normalizeSpeedflipDarSession,
    getSpeedflipDarSessionFeedback, getSpeedflipDarStats,
    SPEEDFLIP_DAR_ERROR_LABELS, SPEEDFLIP_DAR_TOUCH_MOMENTS,
    unlockLifeOSAudio, playLifeOSSound, T_COLOR, S
  } = deps;
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

export default function RocketLeagueViewFeature({ deps }) {
  const {
    persistent, pDispatch, uiDispatch, AC,
    getRocketLeagueDateKey, getRocketLeaguePlanForDate, createRocketLeagueInitialState,
    createRocketLeagueCurrent, getRocketLeagueWeeklyFocus, getRocketLeagueFocusRole,
    getSecondsUntilNextRocketWeeklyFocus, getSecondsUntilNextLocalDay,
    formatCountdownSeconds, formatSeconds, getActiveQuests, SELECTORS, QUESTS,
    ROCKET_LEAGUE_PARENT_QUEST_ID, ROCKET_LEAGUE_SESSION_MINUTES,
    ROCKET_LEAGUE_PROFILE, ROCKET_LEAGUE_CONTROLLER_PRESET, ROCKET_LEAGUE_RECOVERY_TIPS,
    ROCKET_LEAGUE_PACKS, ROCKET_LEAGUE_WORKSHOP_MAPS, ROCKET_LEAGUE_WORKSHOP_RULES,
    RL_SUBTASK_TYPES, unlockLifeOSAudio, playLifeOSSound, T_COLOR, T_FONT, S, ProgresoBar
  } = deps;

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
  const activeTimerRef = useRef({ id: null, startedAt: null });
  const targetSoundedRef = useRef(new Set());

  const commitActiveTimer = useCallback(() => {
    const { id, startedAt } = activeTimerRef.current;
    if (!id || !startedAt) return;
    const delta = Math.floor((Date.now() - startedAt) / 1000);
    if (delta > 0) pDispatch(AC.rlTimerCommit(id, delta));
    activeTimerRef.current = { id: null, startedAt: null };
  }, [pDispatch]);

  useEffect(() => {
    if (current.dateKey !== dateKey || current.planId !== plan.id) {
      commitActiveTimer();
      setActiveSubtaskId(null);
      pDispatch(AC.rlDailySync(dateKey, plan.id));
    }
  }, [current.dateKey, current.planId, dateKey, plan.id, pDispatch, commitActiveTimer]);

  useEffect(() => {
    targetSoundedRef.current = new Set();
  }, [current.dateKey, current.planId]);

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
    const persisted = Math.max(0, Math.floor(Number(elapsedBySubtask[subtaskId]) || 0));
    const active = activeTimerRef.current;
    if (active.id === subtaskId && active.startedAt) {
      return persisted + Math.max(0, Math.floor((tickNow - active.startedAt) / 1000));
    }
    return persisted;
  }, [elapsedBySubtask, tickNow]);

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
    if (!wasDone) playLifeOSSound("complete");
  }, [commitActiveTimer, completedSet, pDispatch]);

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
  const timedBlocksComplete = plan.subtasks.filter(task => !task.noTimer).every(task => completedSet.has(task.id));
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
              Regla central: máximo 1 mecánica nueva a la vez. Este ciclo dura 2 semanas ({weeklyFocus.label}); ranked/1v1/2v2 queda opcional y Workshop está pausado hasta nuevo aviso.
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
                      </div>
                      <div style={{ fontSize:11.5, color:T_COLOR.muted, lineHeight:1.45 }}>{task.instruction}</div>
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
              <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}><span style={{ color:T_COLOR.muted }}>1v1 antes de amigos</span><b style={{ color:matchTask && completedSet.has(matchTask.id) ? "#34d399" : "#fbbf24" }}>{matchTask ? `${matchCount}/${matchTask.targetCount || 3}` : "—"}</b></div>
              <div style={{ display:"flex", justifyContent:"space-between", gap:10 }}><span style={{ color:T_COLOR.muted }}>Mental</span><b style={{ color:mental.saved ? "#34d399" : "#64748b" }}>{mental.saved ? "Guardado" : "Sin guardar"}</b></div>
            </div>
            <div style={{ marginTop:12, color:T_COLOR.muted, fontSize:11.5, lineHeight:1.55 }}>
              Si terminás entrenamiento y el tilt está alto, jugá casual/freeplay antes de ranked. Si el 1v1 sale mal, tomalo como calentamiento, no como fracaso.
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
              {[ROCKET_LEAGUE_PACKS.powershots, ROCKET_LEAGUE_PACKS.groundShots, ROCKET_LEAGUE_PACKS.shotsYouShouldntMiss, ROCKET_LEAGUE_PACKS.basicRebounds, ROCKET_LEAGUE_PACKS.shadowDefense, ROCKET_LEAGUE_PACKS.hardSaves, ROCKET_LEAGUE_PACKS.recoveryTraining, ROCKET_LEAGUE_PACKS.speedflipMusty].map(pack => (
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

