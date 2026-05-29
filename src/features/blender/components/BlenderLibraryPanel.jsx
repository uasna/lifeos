import React from "react";
import { Archive } from "lucide-react";
import { BLENDER_LIBRARY_CATEGORIES } from "../blenderCourses.js";

export function BlenderLibraryPanel({ accent = "#22d3ee" }) {
  return (
    <section style={{ ...surfaceStyle, padding:22 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:14, flexWrap:"wrap" }}>
        <div>
          <div style={{ ...eyebrowStyle, color:accent }}><Archive size={14}/> Biblioteca personal</div>
          <h2 style={titleStyle}>Assets de aprendizaje, no inventario comercial</h2>
          <p style={bodyStyle}>Base visual para guardar piezas propias: props, materiales, escenas, cámaras, renders y clips.</p>
        </div>
        <span style={{ border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.035)", color:"#94a3b8", borderRadius:999, padding:"8px 11px", fontSize:11, fontWeight:900 }}>Fase 1 · datos estáticos</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:12, marginTop:18 }} className="mob-layout-grid">
        {BLENDER_LIBRARY_CATEGORIES.map(item => (
          <article key={item.id} style={{ border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.026)", borderRadius:17, padding:15, minHeight:132 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
              <h3 style={{ margin:0, color:"#f8fafc", fontSize:15, fontWeight:950 }}>{item.label}</h3>
              <span style={{ color:accent, fontSize:22, fontWeight:950 }}>{item.count}</span>
            </div>
            <p style={{ margin:"8px 0 0", color:"#94a3b8", fontSize:12, lineHeight:1.5 }}>{item.status}</p>
            <button style={{ marginTop:12, border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.035)", color:"#cbd5e1", borderRadius:11, padding:"8px 10px", fontSize:11, fontWeight:900, cursor:"pointer" }}>{item.cta}</button>
          </article>
        ))}
      </div>
    </section>
  );
}

const surfaceStyle = { border:"1px solid rgba(255,255,255,.075)", background:"linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.022))", borderRadius:24, boxShadow:"0 22px 70px rgba(0,0,0,.22)" };
const eyebrowStyle = { display:"inline-flex", alignItems:"center", gap:7, fontSize:11, fontWeight:950, textTransform:"uppercase", letterSpacing:".12em" };
const titleStyle = { margin:"8px 0 0", color:"#f8fafc", fontSize:24, lineHeight:1.08, fontWeight:950 };
const bodyStyle = { margin:"8px 0 0", color:"#a7b0c2", fontSize:13, lineHeight:1.65 };
