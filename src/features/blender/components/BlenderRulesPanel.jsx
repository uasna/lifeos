import React from "react";
import { Keyboard, Shield } from "lucide-react";
import { BLENDER_NO_NUMPAD_NOTES, BLENDER_STUDY_RULES } from "../blenderCourses.js";

export function BlenderRulesPanel({ accent = "#22d3ee" }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }} className="mob-layout-grid">
      <section style={{ ...surfaceStyle, padding:22 }}>
        <div style={{ ...eyebrowStyle, color:accent }}><Shield size={14}/> Reglas de estudio</div>
        <h2 style={titleStyle}>Estructura antes que impulso</h2>
        <div style={{ display:"grid", gap:8, marginTop:16 }}>
          {BLENDER_STUDY_RULES.map((rule, index) => (
            <div key={rule} style={{ display:"grid", gridTemplateColumns:"24px 1fr", gap:9, alignItems:"start", color:"#cbd5e1", border:"1px solid rgba(255,255,255,.06)", background:"rgba(255,255,255,.025)", borderRadius:13, padding:10, fontSize:12, lineHeight:1.5 }}>
              <span style={{ color:accent, fontWeight:950 }}>{index + 1}.</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...surfaceStyle, padding:22 }}>
        <div style={{ ...eyebrowStyle, color:accent }}><Keyboard size={14}/> Sin teclado numérico</div>
        <h2 style={titleStyle}>Control usable desde tu setup real</h2>
        <div style={{ display:"grid", gap:12, marginTop:16 }}>
          {BLENDER_NO_NUMPAD_NOTES.map(note => (
            <article key={note.title} style={{ border:"1px solid rgba(255,255,255,.06)", background:"rgba(255,255,255,.025)", borderRadius:14, padding:13 }}>
              <h3 style={{ margin:0, color:"#f8fafc", fontSize:13, fontWeight:950 }}>{note.title}</h3>
              <p style={{ margin:"6px 0 0", color:"#a7b0c2", fontSize:12, lineHeight:1.58 }}>{note.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

const surfaceStyle = { border:"1px solid rgba(255,255,255,.075)", background:"linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.022))", borderRadius:24, boxShadow:"0 22px 70px rgba(0,0,0,.22)" };
const eyebrowStyle = { display:"inline-flex", alignItems:"center", gap:7, fontSize:11, fontWeight:950, textTransform:"uppercase", letterSpacing:".12em" };
const titleStyle = { margin:"8px 0 0", color:"#f8fafc", fontSize:23, lineHeight:1.08, fontWeight:950 };
