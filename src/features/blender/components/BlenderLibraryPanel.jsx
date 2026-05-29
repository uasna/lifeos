import React, { useMemo, useState } from "react";
import { Archive, CheckCircle2, Lock, Plus, X } from "lucide-react";
import { BLENDER_LIBRARY_CATEGORIES } from "../blenderCourses.js";
import { readBlenderLibrary, writeBlenderLibrary } from "../blenderProgress.js";

export function BlenderLibraryPanel({ accent = "#22d3ee" }) {
  const [libraryItems, setLibraryItems] = useState(() => readBlenderLibrary());
  const [selectedCategoryId, setSelectedCategoryId] = useState("props");
  const [panelOpen, setPanelOpen] = useState(true);
  const [draftName, setDraftName] = useState("");
  const [lastSavedId, setLastSavedId] = useState(null);

  const selectedCategory = useMemo(
    () => BLENDER_LIBRARY_CATEGORIES.find(item => item.id === selectedCategoryId) || BLENDER_LIBRARY_CATEGORIES[0],
    [selectedCategoryId]
  );

  const selectedItems = Array.isArray(libraryItems[selectedCategory.id]) ? libraryItems[selectedCategory.id] : [];
  const visibleCategories = useMemo(() => BLENDER_LIBRARY_CATEGORIES.map(item => {
    const savedItems = Array.isArray(libraryItems[item.id]) ? libraryItems[item.id] : [];
    return { ...item, count: savedItems.length || item.count || 0 };
  }), [libraryItems]);

  const openCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setPanelOpen(true);
    setDraftName("");
    setLastSavedId(null);
  };

  const saveItem = () => {
    if (!selectedCategory.unlocked) return;
    const cleanName = draftName.trim();
    if (!cleanName) return;
    const entry = {
      id: `${selectedCategory.id}-${Date.now()}`,
      name: cleanName,
      createdAt: new Date().toISOString(),
      status: "WIP",
    };
    const next = {
      ...libraryItems,
      [selectedCategory.id]: [entry, ...selectedItems].slice(0, 12),
    };
    setLibraryItems(next);
    writeBlenderLibrary(next);
    setDraftName("");
    setLastSavedId(entry.id);
  };

  return (
    <section style={{ ...surfaceStyle, padding:22 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:14, flexWrap:"wrap" }}>
        <div>
          <div style={{ ...eyebrowStyle, color:accent }}><Archive size={14}/> Biblioteca personal</div>
          <h2 style={titleStyle}>Assets de aprendizaje, no inventario comercial</h2>
          <p style={bodyStyle}>Base visual para guardar piezas propias: props, materiales, escenas, cámaras, renders y clips.</p>
        </div>
        <span style={{ border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.035)", color:"#94a3b8", borderRadius:999, padding:"8px 11px", fontSize:11, fontWeight:900 }}>Fase 1 · guardado local</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:12, marginTop:18 }} className="mob-layout-grid">
        {visibleCategories.map(item => {
          const isSelected = item.id === selectedCategory.id && panelOpen;
          return (
            <article key={item.id} style={{ border:`1px solid ${isSelected ? `${accent}55` : "rgba(255,255,255,.07)"}`, background:isSelected ? `${accent}0d` : "rgba(255,255,255,.026)", borderRadius:17, padding:15, minHeight:132, transition:"border-color .2s ease, background .2s ease" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                <h3 style={{ margin:0, color:"#f8fafc", fontSize:15, fontWeight:950 }}>{item.label}</h3>
                <span style={{ color:accent, fontSize:22, fontWeight:950 }}>{item.count}</span>
              </div>
              <p style={{ margin:"8px 0 0", color:"#94a3b8", fontSize:12, lineHeight:1.5 }}>{item.status}</p>
              <button type="button" onClick={() => openCategory(item.id)} style={{ marginTop:12, border:`1px solid ${isSelected ? `${accent}66` : "rgba(255,255,255,.08)"}`, background:isSelected ? `${accent}18` : "rgba(255,255,255,.035)", color:isSelected ? accent : "#cbd5e1", borderRadius:11, padding:"8px 10px", fontSize:11, fontWeight:900, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:7 }}>
                {item.unlocked ? <Plus size={13}/> : <Lock size={13}/>} {item.count > 0 && item.unlocked ? "Agregar otra" : item.cta}
              </button>
            </article>
          );
        })}
      </div>

      {panelOpen ? (
        <div style={{ marginTop:16, border:`1px solid ${selectedCategory.unlocked ? `${accent}36` : "rgba(251,113,133,.28)"}`, background:selectedCategory.unlocked ? "rgba(255,255,255,.026)" : "rgba(251,113,133,.055)", borderRadius:20, padding:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(280px,.7fr)", gap:16, alignItems:"start" }} className="mob-layout-grid">
            <div>
              <div style={{ ...eyebrowStyle, color:selectedCategory.unlocked ? accent : "#fb7185" }}>
                {selectedCategory.unlocked ? <Plus size={14}/> : <Lock size={14}/>} {selectedCategory.actionTitle}
              </div>
              <h3 style={{ margin:"8px 0 0", color:"#f8fafc", fontSize:21, lineHeight:1.12, fontWeight:950 }}>{selectedCategory.label}</h3>
              <p style={bodyStyle}>{selectedCategory.helper}</p>

              {selectedCategory.unlocked ? (
                <div style={{ display:"grid", gap:10, marginTop:14 }}>
                  <label style={{ color:"#cbd5e1", fontSize:12, fontWeight:900 }} htmlFor={`blender-library-${selectedCategory.id}`}>Nombre de la pieza</label>
                  <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) auto", gap:10 }} className="mob-layout-grid">
                    <input
                      id={`blender-library-${selectedCategory.id}`}
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      onKeyDown={(event) => { if (event.key === "Enter") saveItem(); }}
                      placeholder={selectedCategory.placeholder}
                      style={inputStyle}
                    />
                    <button type="button" onClick={saveItem} disabled={!draftName.trim()} style={{ border:`1px solid ${draftName.trim() ? `${accent}66` : "rgba(255,255,255,.08)"}`, background:draftName.trim() ? `${accent}18` : "rgba(255,255,255,.025)", color:draftName.trim() ? accent : "#64748b", borderRadius:13, padding:"11px 13px", fontSize:12, fontWeight:950, cursor:draftName.trim() ? "pointer" : "not-allowed" }}>
                      Guardar en biblioteca
                    </button>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {selectedCategory.examples.map(example => (
                      <button key={example} type="button" onClick={() => setDraftName(example)} style={exampleButtonStyle}>
                        {example}
                      </button>
                    ))}
                  </div>
                  {lastSavedId ? (
                    <div style={{ display:"inline-flex", alignItems:"center", gap:8, color:"#34d399", fontSize:12, fontWeight:900 }}>
                      <CheckCircle2 size={15}/> Guardado localmente para esta academia.
                    </div>
                  ) : null}
                </div>
              ) : (
                <div style={{ marginTop:14, border:"1px solid rgba(251,113,133,.22)", background:"rgba(251,113,133,.08)", color:"#fecdd3", borderRadius:15, padding:13, fontSize:12, lineHeight:1.55 }}>
                  Se desbloquea en <b>{selectedCategory.unlockText}</b>. Por ahora no hace falta forzarlo.
                </div>
              )}
            </div>

            <aside style={{ border:"1px solid rgba(255,255,255,.075)", background:"rgba(15,23,42,.55)", borderRadius:17, padding:14 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                <div style={{ color:"#f8fafc", fontSize:14, fontWeight:950 }}>Piezas guardadas</div>
                <button type="button" onClick={() => setPanelOpen(false)} style={{ border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.035)", color:"#94a3b8", borderRadius:10, padding:6, cursor:"pointer" }} aria-label="Cerrar panel de biblioteca">
                  <X size={14}/>
                </button>
              </div>
              <div style={{ display:"grid", gap:8, marginTop:12 }}>
                {selectedItems.length ? selectedItems.map(item => (
                  <div key={item.id} style={{ border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.025)", borderRadius:13, padding:10 }}>
                    <div style={{ color:"#e5edf7", fontSize:12, fontWeight:900 }}>{item.name}</div>
                    <div style={{ marginTop:4, color:"#64748b", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:".08em" }}>{item.status} · guardado local</div>
                  </div>
                )) : (
                  <div style={{ border:"1px dashed rgba(255,255,255,.13)", background:"rgba(255,255,255,.018)", borderRadius:13, padding:12, color:"#94a3b8", fontSize:12, lineHeight:1.55 }}>
                    Todavía no hay piezas en esta categoría. Cuando terminés una entrega, guardá su nombre aquí para que la biblioteca deje de ser solo visual.
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      ) : null}
    </section>
  );
}

const surfaceStyle = { border:"1px solid rgba(255,255,255,.075)", background:"linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.022))", borderRadius:24, boxShadow:"0 22px 70px rgba(0,0,0,.22)" };
const eyebrowStyle = { display:"inline-flex", alignItems:"center", gap:7, fontSize:11, fontWeight:950, textTransform:"uppercase", letterSpacing:".12em" };
const titleStyle = { margin:"8px 0 0", color:"#f8fafc", fontSize:24, lineHeight:1.08, fontWeight:950 };
const bodyStyle = { margin:"8px 0 0", color:"#a7b0c2", fontSize:13, lineHeight:1.65 };
const inputStyle = { width:"100%", border:"1px solid rgba(255,255,255,.10)", background:"rgba(2,6,23,.35)", color:"#f8fafc", borderRadius:13, padding:"12px 13px", fontSize:13, outline:"none" };
const exampleButtonStyle = { border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.035)", color:"#cbd5e1", borderRadius:999, padding:"7px 10px", fontSize:11, fontWeight:850, cursor:"pointer" };
