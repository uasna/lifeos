import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, BookOpen, CheckCircle2, RefreshCw, Shield, Sparkles } from "lucide-react";

export default function CalculusTrainerViewFeature({ deps }) {
  const {
    persistent, pDispatch, uiDispatch, AC,
    getLifeOSDateKey, getCalculusPlanForDate, createCalculusInitialState, createCalculusCurrent,
    getCalculusAdaptiveMode, getCalculusWeakTopics, getCalculusVideoRecommendations,
    getCalculusPinnedPracticeForDate, getCalculusRecentHistory, getCalculusSeenTopicsUntil,
    getCalculusDifficultyDisplay, playLifeOSSound, CALCULUS_SOURCE_LABEL
  } = deps;
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


