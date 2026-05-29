import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Circle, Clock3, GraduationCap, Layers, Sparkles } from "lucide-react";
import {
  BLENDER_ACADEMY_PROFILE,
  BLENDER_COURSES,
  BLENDER_EXTRA_GATE_REASONS,
  BLENDER_EXTRA_MINUTES,
  BLENDER_SESSION_MINUTES,
  getNextBlenderCourse,
  getTodayBlenderLesson,
} from "./blenderCourses.js";
import { createBlenderStorageKeys, readJsonArray, readString, writeJsonArray, writeOptionalString } from "./blenderProgress.js";
import { CourseCard } from "./components/CourseCard.jsx";
import { ModuleProgress } from "./components/ModuleProgress.jsx";
import { TodayLessonPanel } from "./components/TodayLessonPanel.jsx";
import { BlenderLibraryPanel } from "./components/BlenderLibraryPanel.jsx";
import { BlenderRulesPanel } from "./components/BlenderRulesPanel.jsx";
import { unlockLifeOSAudio, playLifeOSSound } from "../../utils/audio.js";

export function BlenderAcademyView({ questDone = false, onToggleSession }) {
  const { course, module, lesson } = useMemo(() => getTodayBlenderLesson(BLENDER_COURSES), []);
  const nextCourse = useMemo(() => getNextBlenderCourse(BLENDER_COURSES), []);
  const keys = useMemo(() => createBlenderStorageKeys(new Date()), []);

  const [completedChecklistItems, setCompletedChecklistItems] = useState(() => readJsonArray(keys.checklist));
  const [selectedExtraReason, setSelectedExtraReason] = useState(() => {
    const saved = readString(keys.extraGate);
    return BLENDER_EXTRA_GATE_REASONS.some(reason => reason.id === saved) ? saved : null;
  });

  useEffect(() => {
    writeJsonArray(keys.checklist, completedChecklistItems);
  }, [keys.checklist, completedChecklistItems]);

  useEffect(() => {
    writeOptionalString(keys.extraGate, selectedExtraReason);
  }, [keys.extraGate, selectedExtraReason]);

  const completedChecklist = useMemo(() => new Set(completedChecklistItems), [completedChecklistItems]);
  const activeExtra = useMemo(
    () => BLENDER_EXTRA_GATE_REASONS.find(reason => reason.id === selectedExtraReason) || null,
    [selectedExtraReason]
  );
  const checklistPct = Math.round((completedChecklistItems.length / Math.max(lesson.checklist.length, 1)) * 100);
  const lessonCompleted = questDone || checklistPct === 100;
  const completedLessonIds = useMemo(() => lessonCompleted ? [lesson.id] : [], [lesson.id, lessonCompleted]);

  const toggleChecklist = useCallback((item) => {
    unlockLifeOSAudio();
    playLifeOSSound("menu");
    setCompletedChecklistItems(items => items.includes(item) ? items.filter(x => x !== item) : [...items, item]);
  }, []);

  const toggleExtraReason = useCallback((reasonId) => {
    unlockLifeOSAudio();
    playLifeOSSound("menu");
    setSelectedExtraReason(current => current === reasonId ? null : reasonId);
  }, []);

  return (
    <div style={shellStyle}>
      <header style={{
        ...surfaceStyle,
        padding: 24,
        borderColor: `${course.accent}36`,
        background: `radial-gradient(circle at 12% 0%, ${course.accent}1f, transparent 34%), radial-gradient(circle at 90% 10%, rgba(244,114,182,.17), transparent 30%), linear-gradient(145deg, rgba(15,23,42,.96), rgba(2,6,23,.94))`,
      }}>
        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1.2fr) minmax(300px,.8fr)", gap:20, alignItems:"stretch" }} className="mob-layout-grid">
          <div style={{ display:"grid", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
              <span style={{ ...eyebrowStyle, color:course.accent }}><GraduationCap size={15}/> {BLENDER_ACADEMY_PROFILE.title}</span>
              <span style={chipStyle}>{BLENDER_ACADEMY_PROFILE.level}</span>
              <span style={chipStyle}>Sin numpad</span>
            </div>
            <div>
              <h1 style={{ margin:0, color:"#f8fafc", fontSize:"clamp(34px,5vw,64px)", lineHeight:.92, letterSpacing:"-.06em", fontWeight:950 }}>
                Tu curso personal de Blender
              </h1>
              <p style={{ margin:"13px 0 0", color:"#a7b0c2", fontSize:15, lineHeight:1.7, maxWidth:780 }}>
                {BLENDER_ACADEMY_PROFILE.promise} No es un reto suelto: es una ruta interna con cursos, módulos, lecciones, entregas y proyectos.
              </p>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              <span style={{ ...chipStyle, borderColor:`${course.accent}34`, color:course.accent }}>{BLENDER_ACADEMY_PROFILE.route}</span>
              <span style={chipStyle}>{BLENDER_SESSION_MINUTES} min base</span>
              <span style={chipStyle}>+{BLENDER_EXTRA_MINUTES} min opcional con compuerta</span>
            </div>
          </div>

          <aside style={{ border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.04)", borderRadius:22, padding:18, display:"grid", alignContent:"space-between", gap:16 }}>
            <div>
              <div style={{ ...eyebrowStyle, color:course.accent }}>Curso actual</div>
              <h2 style={{ margin:"8px 0 0", color:"#f8fafc", fontSize:24, lineHeight:1.08, fontWeight:950 }}>{course.title}</h2>
              <p style={{ margin:"8px 0 0", color:"#a7b0c2", fontSize:13, lineHeight:1.58 }}>{module.title} · {lesson.title}</p>
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:9 }}>
                <span style={{ color:"#94a3b8", fontSize:12, fontWeight:850 }}>Progreso de lección</span>
                <span style={{ color:course.accent, fontWeight:950 }}>{checklistPct}%</span>
              </div>
              <div style={{ height:8, borderRadius:999, background:"rgba(255,255,255,.07)", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${checklistPct}%`, background:`linear-gradient(90deg, ${course.accent}, #f472b6)`, borderRadius:999, transition:"width .25s ease" }}/>
              </div>
            </div>
            <button onClick={onToggleSession} style={{ border:`1px solid ${questDone ? "rgba(148,163,184,.26)" : `${course.accent}66`}`, background:questDone ? "rgba(148,163,184,.08)" : `${course.accent}18`, color:questDone ? "#94a3b8" : course.accent, borderRadius:15, padding:"13px 15px", fontWeight:950, cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:9 }}>
              {questDone ? <CheckCircle2 size={18}/> : <Circle size={18}/>} {questDone ? "Sesión marcada" : "Completar sesión Blender"}
            </button>
          </aside>
        </div>
      </header>

      <TodayLessonPanel
        course={course}
        module={module}
        lesson={lesson}
        completedChecklist={completedChecklist}
        onToggleChecklist={toggleChecklist}
      />

      <section style={{ ...surfaceStyle, padding:22 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:14, flexWrap:"wrap" }}>
          <div>
            <div style={{ ...eyebrowStyle, color:course.accent }}><Clock3 size={14}/> Bloque de sesión</div>
            <h2 style={sectionTitleStyle}>Cómo cerrar los 60 minutos</h2>
            <p style={sectionBodyStyle}>La sesión existe para completar la entrega de la lección, no para navegar tutoriales sin dirección.</p>
          </div>
          <span style={{ ...chipStyle, color:course.accent, borderColor:`${course.accent}36` }}>Rutina integrada a LifeOS</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:12, marginTop:18 }} className="mob-layout-grid">
          {SESSION_BLOCKS.map((block, index) => (
            <article key={block.title} style={{ border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.026)", borderRadius:18, padding:16, display:"grid", gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                <span style={{ color:course.accent, fontSize:11, fontWeight:950 }}>{String(index + 1).padStart(2,"0")} · {block.time}</span>
                <Layers size={16} color="#64748b" />
              </div>
              <h3 style={{ margin:0, color:"#f8fafc", fontSize:18, fontWeight:950 }}>{block.title}</h3>
              <p style={{ margin:0, color:"#a7b0c2", fontSize:12, lineHeight:1.58 }}>{block.body}</p>
              <div style={{ color:"#dbe7f4", fontSize:12, lineHeight:1.5, borderTop:"1px solid rgba(255,255,255,.07)", paddingTop:10 }}><b>Entrega:</b> {block.output}</div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ ...surfaceStyle, padding:22, borderColor:activeExtra ? "rgba(52,211,153,.38)" : "rgba(255,255,255,.075)", background:activeExtra ? "linear-gradient(135deg,rgba(52,211,153,.12),rgba(255,255,255,.025))" : surfaceStyle.background }}>
        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) auto", gap:16, alignItems:"start" }} className="mob-layout-grid">
          <div>
            <div style={{ ...eyebrowStyle, color:activeExtra ? "#34d399" : "#94a3b8" }}><Sparkles size={14}/> Extensión +30 min</div>
            <h2 style={sectionTitleStyle}>{activeExtra ? activeExtra.title : "Extra desactivado"}</h2>
            <p style={sectionBodyStyle}>No es obligación. Solo se activa si hay energía, una acción concreta y una entrega cercana.</p>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"flex-end" }}>
            {BLENDER_EXTRA_GATE_REASONS.map(reason => {
              const on = selectedExtraReason === reason.id;
              return (
                <button key={reason.id} onClick={() => toggleExtraReason(reason.id)} style={{ border:`1px solid ${on ? "rgba(52,211,153,.52)" : "rgba(255,255,255,.08)"}`, background:on ? "rgba(52,211,153,.16)" : "rgba(255,255,255,.035)", color:on ? "#34d399" : "#cbd5e1", borderRadius:14, padding:"10px 12px", fontSize:11, fontWeight:900, cursor:"pointer" }}>
                  {reason.label}
                </button>
              );
            })}
          </div>
        </div>
        {activeExtra ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:10, marginTop:16 }} className="mob-layout-grid">
            <ExtraTile label="Acción exacta" value={activeExtra.action}/>
            <ExtraTile label="Entrega rápida" value={activeExtra.deliverable}/>
            <ExtraTile label="Límite" value="No abrir tutoriales nuevos. Terminar, guardar y cortar."/>
          </div>
        ) : (
          <div style={{ marginTop:16, border:"1px dashed rgba(255,255,255,.13)", background:"rgba(255,255,255,.025)", borderRadius:16, padding:15, color:"#a7b0c2", fontSize:13, lineHeight:1.6 }}>
            Cerrá en 60 min. Guardar avance también cuenta como progreso.
          </div>
        )}
      </section>

      <section style={{ ...surfaceStyle, padding:22 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:14, flexWrap:"wrap", marginBottom:18 }}>
          <div>
            <div style={{ ...eyebrowStyle, color:course.accent }}><BookOpen size={14}/> Ruta de cursos</div>
            <h2 style={sectionTitleStyle}>Academia progresiva, no lista random</h2>
            <p style={sectionBodyStyle}>Personajes quedan después de control, fundamentos, props, materiales, cámara, dioramas, animación simple y criaturas.</p>
          </div>
          <span style={{ ...chipStyle, color:nextCourse.accent, borderColor:`${nextCourse.accent}36` }}>Siguiente: {nextCourse.title}</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:12 }} className="mob-layout-grid">
          {BLENDER_COURSES.map(item => <CourseCard key={item.id} course={item}/>)}
        </div>
      </section>

      <ModuleProgress course={course} module={module} activeLessonId={lesson.id} completedLessonIds={completedLessonIds}/>
      <BlenderLibraryPanel accent={course.accent}/>
      <BlenderRulesPanel accent={course.accent}/>
    </div>
  );
}

function ExtraTile({ label, value }) {
  return (
    <div style={{ border:"1px solid rgba(52,211,153,.18)", background:"rgba(52,211,153,.07)", borderRadius:15, padding:13 }}>
      <div style={{ color:"#34d399", fontSize:10, fontWeight:950, textTransform:"uppercase", letterSpacing:".12em" }}>{label}</div>
      <div style={{ marginTop:6, color:"#f8fafc", fontSize:12, lineHeight:1.5, fontWeight:850 }}>{value}</div>
    </div>
  );
}

const SESSION_BLOCKS = Object.freeze([
  Object.freeze({ title:"Arranque", time:"5 min", body:"Abrir proyecto, leer objetivo y revisar la próxima acción. No buscar tutoriales todavía.", output:"archivo correcto abierto" }),
  Object.freeze({ title:"Ejercicio guiado", time:"40 min", body:"Seguir los pasos de la lección y mantener foco en formas grandes, control y entrega.", output:"avance real de la lección" }),
  Object.freeze({ title:"Cierre visual", time:"10 min", body:"Guardar versión, sacar captura o preview y comparar contra el inicio.", output:"preview o evidencia guardada" }),
  Object.freeze({ title:"Log LifeOS", time:"5 min", body:"Anotar qué hice, qué quedó visible, qué me trabó y próxima acción exacta.", output:"continuidad para mañana" }),
]);

const shellStyle = {
  animation:"sldIn .3s ease",
  display:"grid",
  gap:22,
};

const surfaceStyle = {
  border:"1px solid rgba(255,255,255,.075)",
  background:"linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.022))",
  borderRadius:24,
  boxShadow:"0 22px 70px rgba(0,0,0,.22)",
};

const eyebrowStyle = {
  display:"inline-flex",
  alignItems:"center",
  gap:7,
  fontSize:11,
  fontWeight:950,
  textTransform:"uppercase",
  letterSpacing:".12em",
};

const chipStyle = {
  border:"1px solid rgba(255,255,255,.08)",
  background:"rgba(255,255,255,.04)",
  color:"#cbd5e1",
  borderRadius:999,
  padding:"7px 10px",
  fontSize:11,
  fontWeight:850,
};

const sectionTitleStyle = {
  margin:"8px 0 0",
  color:"#f8fafc",
  fontSize:26,
  lineHeight:1.08,
  fontWeight:950,
};

const sectionBodyStyle = {
  margin:"8px 0 0",
  color:"#a7b0c2",
  fontSize:13,
  lineHeight:1.65,
};
