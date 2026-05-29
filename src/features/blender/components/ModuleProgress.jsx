import React from "react";
import { BookOpen, ChevronRight } from "lucide-react";
import { LessonCard } from "./LessonCard.jsx";

export function ModuleProgress({ course, module }) {
  return (
    <section style={{ ...surfaceStyle, padding:22 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
        <div>
          <div style={eyebrowStyle}><BookOpen size={14}/> Módulo actual</div>
          <h2 style={titleStyle}>{module.title}</h2>
          <p style={bodyStyle}>{module.objective}</p>
        </div>
        <span style={{ border:`1px solid ${course.accent}40`, background:`${course.accent}12`, color:course.accent, borderRadius:999, padding:"8px 11px", fontSize:11, fontWeight:900, display:"inline-flex", alignItems:"center", gap:6 }}>
          {module.lessons.length} lecciones <ChevronRight size={14}/>
        </span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:12, marginTop:18 }} className="mob-layout-grid">
        {module.lessons.map(item => <LessonCard key={item.id} lesson={item} accent={course.accent} compact />)}
      </div>
    </section>
  );
}

const surfaceStyle = {
  border:"1px solid rgba(255,255,255,.075)",
  background:"linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.022))",
  borderRadius:24,
  boxShadow:"0 22px 70px rgba(0,0,0,.22)",
};
const eyebrowStyle = { color:"#94a3b8", display:"inline-flex", alignItems:"center", gap:7, fontSize:11, fontWeight:950, textTransform:"uppercase", letterSpacing:".12em" };
const titleStyle = { margin:"8px 0 0", color:"#f8fafc", fontSize:24, lineHeight:1.08, fontWeight:950 };
const bodyStyle = { margin:"8px 0 0", color:"#a7b0c2", fontSize:13, lineHeight:1.65 };
