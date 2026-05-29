import React from "react";
import { CheckCircle2, Circle, Target } from "lucide-react";

export function TodayLessonPanel({ course, module, lesson, completedChecklist, onToggleChecklist }) {
  const completedCount = lesson.checklist.filter(item => completedChecklist.has(item)).length;
  const pct = Math.round((completedCount / Math.max(lesson.checklist.length, 1)) * 100);

  return (
    <section style={{
      border:`1px solid ${course.accent}44`,
      background:`radial-gradient(circle at top left,${course.accent}1f,transparent 36%),linear-gradient(145deg,rgba(15,23,42,.96),rgba(2,6,23,.92))`,
      borderRadius:28,
      padding:24,
      boxShadow:`0 28px 90px ${course.accent}12`,
    }}>
      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1.2fr) minmax(260px,.8fr)", gap:20 }} className="mob-layout-grid">
        <div style={{ display:"grid", gap:18 }}>
          <div>
            <div style={{ color:course.accent, fontSize:11, fontWeight:950, textTransform:"uppercase", letterSpacing:".14em" }}>Lección de hoy</div>
            <h2 style={{ margin:"8px 0 0", color:"#f8fafc", fontSize:"clamp(27px,4vw,44px)", lineHeight:1, fontWeight:950 }}>{lesson.title}</h2>
            <p style={{ margin:"12px 0 0", color:"#a7b0c2", fontSize:14, lineHeight:1.7 }}>{lesson.objective}</p>
          </div>

          <div style={{
            border:`1px solid ${course.accent}33`,
            background:`linear-gradient(135deg,${course.accent}12,rgba(255,255,255,.026))`,
            borderRadius:18,
            padding:14,
            display:"grid",
            gap:8,
          }}>
            <div style={{ color:course.accent, fontSize:11, fontWeight:950, textTransform:"uppercase", letterSpacing:".12em" }}>Cómo usar esta sesión</div>
            <div style={{ color:"#f8fafc", fontSize:15, lineHeight:1.45, fontWeight:900 }}>Hoy solo hacés esta lección. No avances a otra hasta cerrar la entrega y marcar el checklist.</div>
            <div style={{ color:"#a7b0c2", fontSize:13, lineHeight:1.6 }}>El bloque de 60 minutos guía el ritmo: abrir, ejecutar pasos, guardar evidencia y anotar la próxima acción.</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:10 }} className="mob-layout-grid">
            <InfoTile label="Curso actual" value={course.title} accent={course.accent}/>
            <InfoTile label="Módulo actual" value={module.title} accent={course.accent}/>
            <InfoTile label="Entrega de esta lección" value={lesson.deliverable} accent={course.accent}/>
          </div>

          <div>
            <div style={{ color:"#f8fafc", fontSize:15, fontWeight:950, marginBottom:10 }}>Ejercicio guiado paso a paso</div>
            <div style={{ display:"grid", gap:8 }}>
              {lesson.steps.map((step, index) => (
                <div key={step} style={{ display:"grid", gridTemplateColumns:"30px 1fr", gap:10, alignItems:"start", border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.035)", borderRadius:14, padding:11 }}>
                  <span style={{ width:24, height:24, borderRadius:999, display:"grid", placeItems:"center", background:`${course.accent}18`, color:course.accent, fontSize:11, fontWeight:950 }}>{index + 1}</span>
                  <span style={{ color:"#dbe7f4", fontSize:13, lineHeight:1.5 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.035)", borderRadius:22, padding:18, display:"grid", gap:16, alignSelf:"start" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
            <div>
              <div style={{ color:course.accent, fontSize:11, fontWeight:950, textTransform:"uppercase", letterSpacing:".12em" }}>Checklist de dominio</div>
              <div style={{ color:"#f8fafc", fontSize:24, fontWeight:950, marginTop:4 }}>{completedCount}/{lesson.checklist.length}</div>
            </div>
            <div style={{ width:62, height:62, borderRadius:22, display:"grid", placeItems:"center", border:`1px solid ${course.accent}44`, background:`${course.accent}12`, color:course.accent, fontWeight:950 }}>{pct}%</div>
          </div>

          <div style={{ height:8, borderRadius:999, background:"rgba(255,255,255,.07)", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, borderRadius:999, background:`linear-gradient(90deg,${course.accent},#f472b6)`, transition:"width .25s ease" }}/>
          </div>

          <div style={{ display:"grid", gap:8 }}>
            {lesson.checklist.map(item => {
              const done = completedChecklist.has(item);
              return (
                <button key={item} onClick={() => onToggleChecklist(item)} style={{ display:"grid", gridTemplateColumns:"22px 1fr", gap:8, alignItems:"start", textAlign:"left", border:`1px solid ${done ? `${course.accent}3f` : "rgba(255,255,255,.07)"}`, background:done ? `${course.accent}10` : "rgba(255,255,255,.025)", color:done ? "#f8fafc" : "#cbd5e1", borderRadius:13, padding:10, cursor:"pointer", fontSize:12, lineHeight:1.45 }}>
                  {done ? <CheckCircle2 size={16} color={course.accent}/> : <Circle size={16} color="#64748b"/>}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>

          <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, color:course.accent, fontSize:12, fontWeight:950, marginBottom:6 }}><Target size={14}/> Próxima acción exacta</div>
            <div style={{ color:"#dbe7f4", fontSize:13, lineHeight:1.55 }}>{lesson.nextAction}</div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function InfoTile({ label, value, accent }) {
  return (
    <div style={{ border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.026)", borderRadius:16, padding:13 }}>
      <div style={{ color:accent, fontSize:10, fontWeight:950, textTransform:"uppercase", letterSpacing:".12em" }}>{label}</div>
      <div style={{ marginTop:6, color:"#f8fafc", fontSize:13, lineHeight:1.35, fontWeight:850 }}>
        {value}
      </div>
    </div>
  );
}
