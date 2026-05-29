import React from "react";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { getCourseLessonCount } from "../blenderCourses.js";

const STATUS_LABEL = Object.freeze({
  active: "Activo",
  next: "Siguiente",
  locked: "Bloqueado",
  completed: "Completado",
});

const STATUS_ICON = Object.freeze({
  active: PlayCircle,
  next: PlayCircle,
  locked: Lock,
  completed: CheckCircle2,
});

export function CourseCard({ course }) {
  const Icon = STATUS_ICON[course.status] || PlayCircle;
  const isActive = course.status === "active";
  const lessonCount = getCourseLessonCount(course);

  return (
    <article style={{
      border: `1px solid ${isActive ? `${course.accent}66` : "rgba(255,255,255,.08)"}`,
      background: isActive ? `linear-gradient(145deg,${course.accent}18,rgba(255,255,255,.035))` : "rgba(255,255,255,.026)",
      borderRadius: 20,
      padding: 16,
      display: "grid",
      gap: 13,
      minHeight: 182,
      boxShadow: isActive ? `0 18px 48px ${course.accent}14` : "none",
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
        <div style={{ display:"grid", gap:6 }}>
          <span style={{ color:course.accent, fontSize:10, fontWeight:950, letterSpacing:".12em", textTransform:"uppercase" }}>{course.level}</span>
          <h3 style={{ margin:0, color:"#f8fafc", fontWeight:950, fontSize:16, lineHeight:1.15 }}>{course.title}</h3>
        </div>
        <span style={{ display:"inline-flex", alignItems:"center", gap:6, color:isActive ? course.accent : "#94a3b8", border:`1px solid ${isActive ? `${course.accent}44` : "rgba(255,255,255,.08)"}`, background:isActive ? `${course.accent}10` : "rgba(255,255,255,.035)", borderRadius:999, padding:"6px 9px", fontSize:10, fontWeight:900 }}>
          <Icon size={13}/> {STATUS_LABEL[course.status] || course.status}
        </span>
      </div>
      <p style={{ margin:0, color:"#a7b0c2", fontSize:12, lineHeight:1.6 }}>{course.subtitle}</p>
      <div style={{ marginTop:"auto", display:"flex", gap:8, flexWrap:"wrap" }}>
        <span style={chipStyle}>{course.estimatedSessions} sesiones</span>
        <span style={chipStyle}>{lessonCount} lecciones cargadas en este curso</span>
      </div>
      <div style={{ color:course.accent, fontSize:12, fontWeight:850, lineHeight:1.45 }}>{course.goal}</div>
    </article>
  );
}

const chipStyle = {
  border:"1px solid rgba(255,255,255,.08)",
  background:"rgba(255,255,255,.04)",
  color:"#cbd5e1",
  borderRadius:999,
  padding:"6px 9px",
  fontSize:10,
  fontWeight:850,
};
