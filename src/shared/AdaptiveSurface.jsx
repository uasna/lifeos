// MODULE_BOUNDARY: shared/
// PERF: React.memo — shallowly compares { persistent, currentBlocks }.
// P10C+ contract: currentBlocks MUST be a stable useMemo ref at every call site.
// EXTRACTION_WARNING: must be co-extracted with useAdaptiveUX.
import { memo }          from "react";
import { Activity, Sparkles } from "lucide-react";
import { T_FONT }        from "@tokens/typography.tokens.js";
import { useAdaptiveUX } from "@hooks/useAdaptiveUX.js";

export const AdaptiveSurface = memo(({ persistent, currentBlocks }) => {
  const ux = useAdaptiveUX(persistent, currentBlocks);
  if (!ux.visInsights || ux.visInsights.length === 0) return null;

  const { tokens, spacing, accentColor, filteredRecs, visInsights } = ux;
  const borderColor  = `rgba(139, 92, 246, ${0.18 + tokens.surfaceIntensity * 0.12})`;
  const label        = tokens.isOverloaded ? "MODO COMPRESIÓN COGNITIVA"
    : tokens.isRecovery ? "MODO RECUPERACIÓN ACTIVA"
    : "CAPA COMPORTAMIENTO ADAPTATIVO";

  return (
    <div style={{
      background:     "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.8))",
      border:         `1px solid ${borderColor}`,
      borderRadius:   "12px",
      padding:        `${spacing.cardPad}px`,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      boxShadow:      tokens.isRecovery ? "0 4px 20px rgba(52,211,153,0.06)" : "0 8px 32px rgba(0,0,0,0.5)",
      marginBottom:   `${spacing.marginBottom}px`,
      transition:     `all ${tokens.transitionMs}ms ease`,
      overflow:       "hidden",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={13} style={{ color: accentColor, transition: `color ${tokens.transitionMs}ms ease`, flexShrink: 0 }} />
          <span style={{ fontSize: "11px", fontFamily: T_FONT.display, fontWeight: 700, letterSpacing: "1px", color: "#e2e8f0", opacity: tokens.surfaceIntensity }}>
            {label}
          </span>
        </div>
        {!tokens.isOverloaded && (
          <div style={{ display: "flex", gap: "14px", fontSize: "11px", fontFamily: T_FONT.display, color: "#94a3b8", flexWrap: "wrap" }}>
            <span>Sustentabilidad: <strong style={{ color: ux.intel.pacing.sustainablePacingIndex > 60 ? "#34d399" : "#f87171" }}>{ux.intel.pacing.sustainablePacingIndex}/100</strong></span>
            <span>Entropía: <strong style={{ color: ux.intel.behavior.entropyScore < 40 ? "#34d399" : "#fb923c" }}>{ux.intel.behavior.entropyScore}%</strong></span>
          </div>
        )}
      </div>

      {/* Insight pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing.blockGap * 0.7}px`, marginBottom: filteredRecs.length > 0 ? "10px" : 0 }}>
        {visInsights.map((msg, i) => (
          <div key={i} style={{
            background:  tokens.isRecovery ? "rgba(52,211,153,0.06)" : "rgba(124,58,237,0.07)",
            border:      `1px solid ${tokens.isRecovery ? "rgba(52,211,153,0.22)" : "rgba(124,58,237,0.22)"}`,
            borderRadius:"6px", padding: "4px 10px", fontSize: "12px",
            color:       tokens.isRecovery ? "#6ee7b7" : "#c084fc",
            fontWeight:  500, display: "flex", alignItems: "center", gap: "6px",
            opacity:     tokens.surfaceIntensity,
          }}>
            <Activity size={10} />
            <span>{msg}</span>
          </div>
        ))}
      </div>

      {/* Recommendation banners */}
      {filteredRecs.map((rec) => (
        <div key={rec.id} style={{
          background:   "rgba(0,0,0,0.18)",
          borderLeft:   `3px solid ${rec.severity === "CRITICAL" ? "#f87171" : "#fbbf24"}`,
          padding:      `${spacing.rowPad * 0.8}px 12px`,
          borderRadius: "0 6px 6px 0", marginTop: "8px",
          fontSize: "12px", color: "#cbd5e1", lineHeight: "1.45",
          transition: `opacity ${tokens.transitionMs}ms ease`,
        }}>
          <span style={{ fontWeight: 700, color: "#f1f5f9", display: "block", marginBottom: "3px", fontSize: "11px", textTransform: "uppercase" }}>
            ⚠️ {rec.type}
          </span>
          {rec.message}
        </div>
      ))}
    </div>
  );
});
AdaptiveSurface.displayName = "AdaptiveSurface";