import { useCallback, useEffect, useMemo, useState } from "react";
import { Palette, Plus, RefreshCw, Shirt, Star, Trash2 } from "lucide-react";

export default function WardrobeViewFeature({ deps }) {
  const {
    persistent, pDispatch, uiDispatch, AC,
    createWardrobeInitial, normalizeWardrobeItems, buildWardrobeWeek,
    deepMerge, getScheduleWeekKey, getLifeOSDateKey, getSecondsUntilNextScheduleWeek,
    formatCountdownSeconds, unlockLifeOSAudio, playLifeOSSound,
    WARDROBE_TYPES, WARDROBE_COLOR_GUIDE, T_COLOR, T_FONT, S
  } = deps;
  const wardrobe = persistent.wardrobe || createWardrobeInitial();
  const profile = deepMerge(createWardrobeInitial().profile, wardrobe.profile || {});
  const items = normalizeWardrobeItems(wardrobe.items);
  const [now, setNow] = useState(() => Date.now());
  const [draft, setDraft] = useState({ type:"top", name:"", color:"", style:"casual" });

  const closetInputStyle = useCallback(() => ({
    width: "100%",
    minHeight: 42,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.08)",
    background: "rgba(15,23,42,.42)",
    color: T_COLOR.text,
    padding: "0 12px",
    outline: "none",
    fontWeight: 700,
    fontFamily: T_FONT.body,
  }), []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weekKey = getScheduleWeekKey(new Date(now));
  const todayKey = getLifeOSDateKey(new Date(now));
  const laundryUntil = getLifeOSDateKey(new Date(now + 2 * 24 * 60 * 60 * 1000));
  const remixCountdown = formatCountdownSeconds(getSecondsUntilNextScheduleWeek(now));
  const outfits = useMemo(() => buildWardrobeWeek(wardrobe, weekKey), [wardrobe, weekKey]);
  const lastUsedOutfit = useMemo(() => (Array.isArray(wardrobe.history) ? [...wardrobe.history].reverse().find(h => h?.action === "used") : null), [wardrobe.history]);

  const addItem = useCallback(() => {
    const name = draft.name.trim();
    const color = draft.color.trim();
    if (!name && !color) return;
    unlockLifeOSAudio();
    playLifeOSSound("complete");
    pDispatch(AC.wardrobeItemAdd({ ...draft, name: name || `${WARDROBE_TYPES.find(t => t.id === draft.type)?.label || "Prenda"} ${color}`, color: color || "neutro" }));
    setDraft({ type:draft.type, name:"", color:"", style:draft.style || "casual" });
  }, [draft, pDispatch]);

  const deleteItem = useCallback((id) => {
    unlockLifeOSAudio();
    playLifeOSSound("menu");
    pDispatch(AC.wardrobeItemDelete(id));
  }, [pDispatch]);

  const updateProfile = useCallback((key, value) => {
    pDispatch(AC.wardrobeProfileUpdate({ [key]: value }));
  }, [pDispatch]);

  const markOutfit = useCallback((outfit, action) => {
    unlockLifeOSAudio();
    playLifeOSSound(action === "used" ? "complete" : "menu");
    pDispatch(AC.wardrobeOutfitMark({
      action,
      day: outfit.full,
      signature: outfit.signature,
      items: outfit.items.map(item => ({ id:item.id, type:item.type, name:item.name, color:item.color })),
    }));
    const msg = action === "used" ? "Outfit marcado como usado" : "Combinación evitada";
    const sub = action === "used" ? "LifeOS la baja de prioridad en próximas semanas." : "No debería repetirse tan fácil.";
    uiDispatch(AC.toastAdd(Date.now(), msg, sub));
  }, [pDispatch, uiDispatch]);

  const toggleFavorite = useCallback((item) => {
    pDispatch(AC.wardrobeItemUpdate(item.id, { favorite: !item.favorite }));
  }, [pDispatch]);

  const toggleLaundry = useCallback((item) => {
    const next = item.unavailableUntil && item.unavailableUntil >= todayKey ? "" : laundryUntil;
    pDispatch(AC.wardrobeItemUpdate(item.id, { unavailableUntil: next }));
  }, [pDispatch, todayKey, laundryUntil]);

  const resetCloset = useCallback(() => {
    if (!window.confirm("¿Borrar prendas, perfil e historial del clóset?")) return;
    pDispatch(AC.domainReset("wardrobe"));
    uiDispatch(AC.toastAdd(Date.now(), "Clóset reiniciado", "Volvió a la base sugerida."));
  }, [pDispatch, uiDispatch]);

  return (
    <div style={{ animation:"sldIn .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:14, alignItems:"flex-start", flexWrap:"wrap", marginBottom:18 }}>
        <div>
          <div style={S.ptitle}>Clóset / Ropero</div>
          <div style={S.psub}>Outfits semanales sin parecer retrato: camisa, pantalón y tenis con rotación inteligente.</div>
        </div>
        <div className="g" style={{ padding:14, minWidth:220 }}>
          <div style={{ fontSize:10, color:T_COLOR.muted, textTransform:"uppercase", letterSpacing:.8, fontWeight:900 }}>Próxima randomización</div>
          <div style={{ fontFamily:T_FONT.display, fontSize:24, fontWeight:900, color:"#a78bfa", fontVariantNumeric:"tabular-nums" }}>{remixCountdown}</div>
          <div style={{ fontSize:11, color:T_COLOR.muted }}>Semana activa: {weekKey}</div>
        </div>
      </div>

      <div className="wardrobe-grid">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="g" style={{ padding:18, borderColor:"rgba(34,211,238,.16)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <Palette size={18} color="#22d3ee"/>
              <div style={{ ...S.stitle, marginBottom:0 }}>Perfil de estilo</div>
            </div>
            <div className="mob-layout-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:10 }}>
              <input value={profile.skinTone || ""} onChange={(e) => updateProfile("skinTone", e.target.value.slice(0, 32))} placeholder="Tono" style={closetInputStyle()} />
              <input value={profile.style || ""} onChange={(e) => updateProfile("style", e.target.value.slice(0, 48))} placeholder="Estilo" style={closetInputStyle()} />
              <input value={profile.notes || ""} onChange={(e) => updateProfile("notes", e.target.value.slice(0, 90))} placeholder="Notas" style={closetInputStyle()} />
            </div>
            <div className="mob-layout-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
              <select value={profile.weather || "normal"} onChange={(e) => updateProfile("weather", e.target.value)} style={closetInputStyle()}>
                <option value="calor">Calor</option><option value="normal">Normal</option><option value="fresco">Fresco</option><option value="lluvia">Lluvia</option>
              </select>
              <select value={profile.occasion || "universidad"} onChange={(e) => updateProfile("occasion", e.target.value)} style={closetInputStyle()}>
                <option value="universidad">Universidad</option><option value="casa">Casa</option><option value="salida casual">Salida casual</option><option value="presentable">Presentable</option>
              </select>
            </div>
            <div style={{ marginTop:12, padding:12, borderRadius:12, background:"rgba(251,191,36,.07)", border:"1px solid rgba(251,191,36,.18)", color:"#fcd34d", fontSize:12, lineHeight:1.55 }}>
              LifeOS separa pantalones, evita repetir combinaciones usadas/no gustadas y prioriza tonos que favorecen piel canela: negro, terracota, crema, blanco cálido, camel, verde oliva, azul marino, borgoña, denim oscuro y gris carbón.
            </div>
            {lastUsedOutfit && <div style={{ marginTop:10, fontSize:11.5, color:T_COLOR.muted }}>Último outfit usado: {new Date(lastUsedOutfit.date).toLocaleDateString("es-ES")} · {lastUsedOutfit.day}</div>}
          </div>

          <div className="wardrobe-days">
            {outfits.map((outfit, idx) => (
              <div key={`${weekKey}-${outfit.day}`} className="g" style={{ padding:16, borderColor: idx === todayIdx ? "rgba(34,211,238,.32)" : "rgba(255,255,255,.07)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"center", marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:11, color:idx === todayIdx ? "#22d3ee" : T_COLOR.muted, fontWeight:900, textTransform:"uppercase", letterSpacing:.8 }}>{outfit.full}</div>
                    <div style={{ fontFamily:T_FONT.display, fontSize:17, color:T_COLOR.text, fontWeight:900 }}>{outfit.title}</div>
                  </div>
                  <Shirt size={20} color={idx === todayIdx ? "#22d3ee" : "#a78bfa"}/>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:10 }}>
                  {outfit.items.map(item => (
                    <div key={`${outfit.day}-${item.type}`} style={{ display:"flex", justifyContent:"space-between", gap:8, padding:"7px 9px", borderRadius:10, background:"rgba(255,255,255,.035)", border:"1px solid rgba(255,255,255,.055)", fontSize:12 }}>
                      <span style={{ color:T_COLOR.text, fontWeight:800 }}>{item.name}</span>
                      <span style={{ color:T_COLOR.muted }}>{item.color}</span>
                    </div>
                  ))}
                </div>
                <div style={{ color:T_COLOR.muted, fontSize:11.5, lineHeight:1.5, marginBottom:10 }}>{outfit.why}</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <button onClick={() => markOutfit(outfit, "used")} style={{ border:"1px solid rgba(52,211,153,.22)", background:"rgba(52,211,153,.08)", color:"#34d399", borderRadius:9, padding:"7px 9px", fontSize:11, fontWeight:900, cursor:"pointer" }}>Usé este outfit</button>
                  <button onClick={() => markOutfit(outfit, "dislike")} style={{ border:"1px solid rgba(248,113,113,.22)", background:"rgba(248,113,113,.08)", color:"#f87171", borderRadius:9, padding:"7px 9px", fontSize:11, fontWeight:900, cursor:"pointer" }}>No me gusta</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div className="g" style={{ padding:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <Plus size={18} color="#34d399"/>
              <div style={{ ...S.stitle, marginBottom:0 }}>Agregar prenda</div>
            </div>
            <div style={{ display:"grid", gap:9 }}>
              <select value={draft.type} onChange={(e) => setDraft(d => ({ ...d, type:e.target.value }))} style={closetInputStyle()}>
                {WARDROBE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <input value={draft.name} onChange={(e) => setDraft(d => ({ ...d, name:e.target.value }))} placeholder="Ej: camisa terracota, pantalón beige, tenis grises" style={closetInputStyle()} />
              <input value={draft.color} onChange={(e) => setDraft(d => ({ ...d, color:e.target.value }))} placeholder="Color" style={closetInputStyle()} />
              <input value={draft.style} onChange={(e) => setDraft(d => ({ ...d, style:e.target.value }))} placeholder="Estilo: casual, formal, deportivo" style={closetInputStyle()} />
              <button onClick={addItem} style={{ minHeight:42, borderRadius:12, border:"1px solid rgba(52,211,153,.28)", background:"rgba(52,211,153,.12)", color:"#34d399", fontWeight:900, cursor:"pointer" }}>Agregar al clóset</button>
            </div>
          </div>

          <div className="g" style={{ padding:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"center", marginBottom:10 }}>
              <div style={{ ...S.stitle, marginBottom:0 }}>Prendas guardadas</div>
              <button onClick={resetCloset} style={{ border:"1px solid rgba(248,113,113,.2)", background:"rgba(248,113,113,.06)", color:"#f87171", borderRadius:9, padding:"7px 9px", fontSize:11, fontWeight:900, cursor:"pointer" }}>Reset</button>
            </div>
            {items.length === 0 ? (
              <div style={{ color:T_COLOR.muted, fontSize:12, lineHeight:1.6 }}>Aún no agregaste ropa. Mientras tanto, LifeOS usa camisas, pantalones y tenis sugeridos. Agregá tus colores reales para evitar looks repetidos.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:520, overflow:"auto" }}>
                {items.map(item => {
                  const unavailable = item.unavailableUntil && item.unavailableUntil >= todayKey;
                  return (
                    <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:10, borderRadius:12, background:unavailable ? "rgba(248,113,113,.05)" : "rgba(255,255,255,.035)", border:unavailable ? "1px solid rgba(248,113,113,.14)" : "1px solid rgba(255,255,255,.06)" }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12.5, color:T_COLOR.text, fontWeight:900 }}>{item.favorite ? "★ " : ""}{item.name}</div>
                        <div style={{ fontSize:11, color:T_COLOR.muted }}>{WARDROBE_TYPES.find(t => t.id === item.type)?.label || item.type} · {item.color} · {item.style}{unavailable ? ` · lavando hasta ${item.unavailableUntil}` : ""}</div>
                      </div>
                      <button onClick={() => toggleFavorite(item)} style={{ width:34, height:34, borderRadius:10, border:"1px solid rgba(251,191,36,.22)", background:item.favorite ? "rgba(251,191,36,.14)" : "rgba(255,255,255,.035)", color:item.favorite ? "#fbbf24" : T_COLOR.muted, cursor:"pointer" }} title="Favorito"><Star size={14}/></button>
                      <button onClick={() => toggleLaundry(item)} style={{ width:34, height:34, borderRadius:10, border:"1px solid rgba(34,211,238,.22)", background:unavailable ? "rgba(34,211,238,.12)" : "rgba(255,255,255,.035)", color:unavailable ? "#22d3ee" : T_COLOR.muted, cursor:"pointer" }} title={unavailable ? "Disponible" : "Lavando"}><RefreshCw size={14}/></button>
                      <button onClick={() => deleteItem(item.id)} style={{ width:34, height:34, borderRadius:10, border:"1px solid rgba(248,113,113,.22)", background:"rgba(248,113,113,.08)", color:"#f87171", cursor:"pointer" }} title="Borrar"><Trash2 size={15}/></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function isLifeOSStandalone() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator?.standalone === true;
}

function isLikelyMobileDevice() {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent || "") || window.matchMedia?.("(max-width: 760px)")?.matches;
}

async function showLifeOSLocalNotification(title, body, tag = "lifeos-local") {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;

  const options = {
    body,
    tag,
    renotify: true,
    icon: "/pwa-192.png",
    badge: "/pwa-192.png",
    data: { url: "/" },
  };

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, options);
      return true;
    }
    new Notification(title, options);
    return true;
  } catch {
    try {
      new Notification(title, options);
      return true;
    } catch {
      return false;
    }
  }
}

