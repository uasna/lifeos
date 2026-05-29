import React from "react";
import { Circle, CheckCircle2 } from "lucide-react";

export function LessonCard({ lesson, accent = "#22d3ee", compact = false }) {
  return (
    <article style={{
      border:`1px solid ${accent}24`,
      background:`linear-gradient(145deg,${accent}0d,rgba(255,255,255,.025))`,
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
        <Circle size={18} color="#64748b" />
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
