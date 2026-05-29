import React from "react";
import { Circle, CheckCircle2 } from "lucide-react";

export function LessonCard({ lesson, accent = "#22d3ee", compact = false, active = false, completed = false }) {
  const Icon = completed ? CheckCircle2 : Circle;
  const statusLabel = completed ? "Completada" : active ? "Lección de hoy" : "Pendiente";

  return (
    <article style={{
      border:`1px solid ${completed ? `${accent}70` : active ? `${accent}48` : `${accent}24`}`,
      background:completed
        ? `linear-gradient(145deg,${accent}1f,rgba(52,211,153,.08))`
        : active
          ? `linear-gradient(145deg,${accent}14,rgba(255,255,255,.03))`
          : `linear-gradient(145deg,${accent}0d,rgba(255,255,255,.025))`,
      borderRadius:18,
      padding:compact ? 14 : 16,
      display:"grid",
      gap:12,
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
        <div>
          <div style={{ color:accent, fontSize:10, fontWeight:950, textTransform:"uppercase", letterSpacing:".12em" }}>{lesson.durationMinutes} min</div>
          <h3 style={{ margin:"6px 0 0", color:"#f8fafc", fontSize:compact ? 15 : 18, lineHeight:1.14, fontWeight:950 }}>{lesson.title}</h3>
        </div>
        <div style={{ display:"grid", justifyItems:"end", gap:7, flexShrink:0 }}>
          <Icon size={19} color={completed ? accent : active ? accent : "#64748b"} />
          <span style={{
            border:`1px solid ${completed || active ? `${accent}45` : "rgba(148,163,184,.18)"}`,
            background:completed || active ? `${accent}12` : "rgba(255,255,255,.03)",
            color:completed || active ? accent : "#94a3b8",
            borderRadius:999,
            padding:"4px 7px",
            fontSize:9,
            fontWeight:950,
            textTransform:"uppercase",
            letterSpacing:".08em",
            whiteSpace:"nowrap",
          }}>
            {statusLabel}
          </span>
        </div>
      </div>
      <p style={{ margin:0, color:"#a7b0c2", fontSize:12, lineHeight:1.62 }}>{lesson.objective}</p>
      {!compact && (
        <div style={{ display:"grid", gap:7 }}>
          {lesson.checklist.slice(0, 3).map(item => (
            <div key={item} style={{ display:"flex", alignItems:"flex-start", gap:8, color:"#cbd5e1", fontSize:12, lineHeight:1.45 }}>
              <CheckCircle2 size={14} color={accent} style={{ marginTop:1, flexShrink:0 }}/>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
