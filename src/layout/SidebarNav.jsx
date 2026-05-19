import { memo, useMemo } from "react";
import {
  Home,
  Calendar,
  Layers,
  MessageSquare,
  User,
  Settings,
  BarChart3,
} from "lucide-react";
import { T_FONT, T_COLOR } from "@tokens/index.js";
import { BehaviorStateEngine } from "@engines/telemetry.engine.js";
import { useAppData, useAppUI } from "@state/contexts.js";
import { AC } from "@state/actions.js";

const NAV_PRIMARY = [
  { id: "DASHBOARD", label: "Terminal", icon: Home },
  { id: "PLANNER", label: "Smart Planner", icon: Layers },
  { id: "REFLECTION", label: "Reflection", icon: MessageSquare },
  { id: "HABITS", label: "Habits Tracker", icon: Calendar },
];

const NAV_SECONDARY = [
  { id: "ANALYTICS", label: "Analytics", icon: BarChart3, disabled: true },
  { id: "PROFILE", label: "Character Sheet", icon: User, disabled: true },
  { id: "SETTINGS", label: "Settings", icon: Settings, disabled: true },
];

const SidebarNav = memo(() => {
  const { ui, uiDispatch } = useAppUI();
  const { persistent } = useAppData();

  const navAccent = useMemo(() => {
    const trend = BehaviorStateEngine.calculateState(persistent)?.momentumTrend;
    if (trend === "BURNOUT_RISK") return "#7c5cd6";
    if (trend === "INCONSISTENCY_SPIRAL") return "#a78bfa";
    return "#8b5cf6";
  }, [persistent]);

  const renderItem = (item) => {
    const Icon = item.icon;
    const active = ui.currentView === item.id;

    return (
      <button
        key={item.id}
        disabled={item.disabled}
        onClick={() => !item.disabled && uiDispatch(AC.setView(item.id))}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 14px",
          borderRadius: "10px",
          border: active ? `1px solid ${navAccent}55` : "1px solid transparent",
          background: active ? "rgba(124,58,237,0.18)" : "transparent",
          color: active ? "#c4b5fd" : item.disabled ? "#334155" : "#64748b",
          cursor: item.disabled ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: active ? 800 : 700,
          textAlign: "left",
          transition: "all 220ms ease",
          boxShadow: active ? `0 0 20px ${navAccent}22 inset` : "none",
        }}
      >
        <Icon size={16} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <aside
      style={{
        width: "250px",
        minWidth: "250px",
        height: "100vh",
        background: "linear-gradient(180deg,#090914,#050509)",
        borderRight: "1px solid rgba(148,163,184,0.12)",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontFamily: T_FONT.display,
          fontWeight: 900,
          fontSize: "21px",
          letterSpacing: "-1px",
          color: T_COLOR.text,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "36px",
          padding: "0 12px",
        }}
      >
        <span
          style={{
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: navAccent,
            boxShadow: `0 0 16px ${navAccent}`,
          }}
        />
        LifeOS
        <span style={{ fontSize: "10px", opacity: 0.4 }}>v4</span>
      </div>

      <div style={{ marginBottom: "14px", padding: "0 14px", fontSize: "10px", letterSpacing: "1.6px", color: "#334155", fontWeight: 900 }}>
        CORE SYSTEMS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {NAV_PRIMARY.map(renderItem)}
      </div>

      <div style={{ margin: "28px 0 14px", padding: "0 14px", fontSize: "10px", letterSpacing: "1.6px", color: "#334155", fontWeight: 900 }}>
        ANALYSIS
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {NAV_SECONDARY.map(renderItem)}
      </div>

      <div
        style={{
          marginTop: "auto",
          padding: "14px",
          borderRadius: "14px",
          background: "rgba(124,58,237,0.12)",
          border: `1px solid ${navAccent}55`,
          boxShadow: `0 0 26px ${navAccent}22`,
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 900, color: "#fff" }}>Alex</div>
        <div style={{ fontSize: "11px", color: "#a78bfa", marginTop: "4px" }}>Lv.1 · Initiate</div>
      </div>
    </aside>
  );
});

SidebarNav.displayName = "SidebarNav";
export { SidebarNav };