// ISOLATION: AppDataContext only — tab switches and toasts do NOT trigger rerenders here.
import { memo, useMemo }    from "react";
import { T_FONT, T_COLOR }   from "@tokens/index.js";
import { AdaptiveSurface }   from "@shared/AdaptiveSurface.jsx";
import { PanelBoundary }     from "@shared/primitives.jsx";
import { useAppData }        from "@state/contexts.js";
import { getScheduleBlocks } from "@state/selectors.js";

const ReflectionDriftCard = memo(() => (
  <div style={{ backgroundColor: T_COLOR.surface, border: `1px solid ${T_COLOR.border}`, borderRadius: "12px", padding: "20px", overflow: "hidden" }}>
    <h3 style={{ fontSize: "13px", fontFamily: T_FONT.display, fontWeight: 700, marginBottom: "12px", letterSpacing: "0.5px" }}>
      ANÁLISIS DE CORRELACIÓN Y DRIFT
    </h3>
    <p style={{ color: T_COLOR.textMuted, fontSize: "12px", lineHeight: "1.6" }}>
      El subsistema computa las variaciones semanales del rendimiento frente a las metas base de XP.
      Si las secuencias críticas sufren retrasos continuos, se activa la recalibración heurística.
    </p>
  </div>
));
ReflectionDriftCard.displayName = "ReflectionDriftCard";

const ReflectionStreakCard = memo(({ streak }) => (
  <div style={{ backgroundColor: T_COLOR.surface, border: `1px solid ${T_COLOR.border}`, borderRadius: "12px", padding: "20px", overflow: "hidden" }}>
    <h3 style={{ fontSize: "13px", fontFamily: T_FONT.display, fontWeight: 700, marginBottom: "12px", letterSpacing: "0.5px" }}>
      RENDIMIENTO DE RACHAS
    </h3>
    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px" }}>
      <div style={{ fontSize: "42px", fontWeight: 800, fontFamily: T_FONT.display, color: "#f97316", flexShrink: 0 }}>
        {streak.count}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: 700 }}>DÍAS CONSECUTIVOS</div>
        <div style={{ fontSize: "11px", color: T_COLOR.textMuted, marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Última validación: {streak.lastUpdated}
        </div>
      </div>
    </div>
  </div>
));
ReflectionStreakCard.displayName = "ReflectionStreakCard";

export const ReflectionView = memo(() => {
  const { persistent } = useAppData();

  const swimDays = persistent?.planner?.swimDays || [];
  const currentBlocks = useMemo(() => {
    const sd = getScheduleBlocks(0, swimDays);
    return sd.main || [...(sd.morning || []), ...(sd.afternoon || [])];
  }, [swimDays]);

  return (
    <PanelBoundary panelId="reflection">
      <AdaptiveSurface persistent={persistent} currentBlocks={currentBlocks} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", minWidth: 0 }}>
        <ReflectionDriftCard />
        <ReflectionStreakCard streak={persistent.streak} />
      </div>
    </PanelBoundary>
  );
});
ReflectionView.displayName = "ReflectionView";