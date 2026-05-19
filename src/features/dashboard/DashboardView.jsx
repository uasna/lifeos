import { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

import {
  Brain,
  Dumbbell,
  BookOpen,
  Snowflake,
  Target,
  Moon,
} from "lucide-react";

import { T_FONT, T_COLOR } from "@tokens/index.js";
import { useAdaptiveUX } from "@hooks/useAdaptiveUX.js";
import { AdaptiveSurface } from "@shared/AdaptiveSurface.jsx";
import { PanelBoundary } from "@shared/primitives.jsx";
import { useAppData, useAppUI } from "@state/contexts.js";
import { getScheduleBlocks } from "@state/selectors.js";
import { AC } from "@state/actions.js";
import { DevLogger } from "@runtime/logger.js";

const QUESTS = [
  {
    id: 1,
    title: "Morning Meditation",
    subtitle: "10 min · mindfulness",
    xp: 50,
    difficulty: "EASY",
    icon: Brain,
    color: "#8b5cf6",
  },
  {
    id: 2,
    title: "Power Workout",
    subtitle: "45 min · strength session",
    xp: 120,
    difficulty: "HARD",
    icon: Dumbbell,
    color: "#10b981",
  },
  {
    id: 3,
    title: "Deep Reading",
    subtitle: "30 pages · any genre",
    xp: 80,
    difficulty: "MEDIUM",
    icon: BookOpen,
    color: "#3b82f6",
  },
  {
    id: 4,
    title: "Cold Exposure",
    subtitle: "3 min · cold shower",
    xp: 100,
    difficulty: "HARD",
    icon: Snowflake,
    color: "#f59e0b",
  },
  {
    id: 5,
    title: "Deep Work Block",
    subtitle: "2 hrs · distraction free",
    xp: 150,
    difficulty: "HARD",
    icon: Target,
    color: "#06b6d4",
  },
  {
    id: 6,
    title: "Evening Journal",
    subtitle: "Reflect · plan tomorrow",
    xp: 60,
    difficulty: "EASY",
    icon: Moon,
    color: "#a855f7",
  },
];

const WEEK_DATA = [
  { day: "M", xp: 320 },
  { day: "T", xp: 500 },
  { day: "W", xp: 260 },
  { day: "T", xp: 610 },
  { day: "F", xp: 460 },
  { day: "S", xp: 180 },
  { day: "S", xp: 110 },
];

const StatCard = ({ value, label, color }) => (
  <div
    style={{
      background: "rgba(15,23,42,0.75)",
      border: "1px solid rgba(148,163,184,0.08)",
      borderRadius: "20px",
      padding: "24px",
      minHeight: "120px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      boxShadow: `0 0 30px ${color}11`,
    }}
  >
    <div
      style={{
        fontSize: "46px",
        fontWeight: 900,
        fontFamily: T_FONT.display,
        color,
        letterSpacing: "-2px",
      }}
    >
      {value}
    </div>

    <div
      style={{
        marginTop: "8px",
        fontSize: "12px",
        letterSpacing: "1px",
        color: "#64748b",
        fontWeight: 800,
      }}
    >
      {label}
    </div>
  </div>
);

const QuestCard = ({ q }) => {
  const Icon = q.icon;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(148,163,184,0.08)",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: `${q.color}22`,
          display: "grid",
          placeItems: "center",
          color: q.color,
          flexShrink: 0,
        }}
      >
        <Icon size={22} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, color: "#fff", fontSize: "17px" }}>
          {q.title}
        </div>

        <div style={{ marginTop: "4px", color: "#64748b", fontSize: "14px" }}>
          {q.subtitle}
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div
          style={{
            color: q.color,
            fontWeight: 900,
            fontSize: "15px",
          }}
        >
          +{q.xp} XP
        </div>

        <div
          style={{
            marginTop: "8px",
            fontSize: "11px",
            fontWeight: 800,
            padding: "4px 10px",
            borderRadius: "999px",
            background: `${q.color}22`,
            color: q.color,
          }}
        >
          {q.difficulty}
        </div>
      </div>
    </div>
  );
};

export const DashboardView = memo(() => {
  DevLogger.trackRender("DashboardView");

  const { persistent } = useAppData();
  const { ui } = useAppUI();

  const dayIdx = ui.scheduleSelectedDay ?? 0;
  const swimDays = persistent?.planner?.swimDays || [];

  const currentBlocks = useMemo(() => {
    const sd = getScheduleBlocks(dayIdx, swimDays);
    return sd.main || [];
  }, [dayIdx, swimDays]);

  const ux = useAdaptiveUX(persistent, currentBlocks);

  const completed = 0;
  const total = QUESTS.length;

  return (
    <PanelBoundary panelId="dashboard">
      <AdaptiveSurface
        persistent={persistent}
        currentBlocks={currentBlocks}
      />

      <div
        style={{
          marginTop: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        {/* HEADER */}
        <div>
          <div
            style={{
              fontFamily: T_FONT.display,
              fontSize: "56px",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-3px",
            }}
          >
            Daily Quests
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "18px",
            }}
          >
            Complete quests to earn XP and level up your character
          </div>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(180px,1fr))",
            gap: "20px",
          }}
        >
          <StatCard value={completed} label="COMPLETED" color="#34d399" />
          <StatCard value={0} label="XP EARNED" color="#a78bfa" />
          <StatCard value={6} label="REMAINING" color="#f87171" />
        </div>

        {/* MAIN GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* QUESTS */}
          <div
            style={{
              background: "rgba(15,23,42,0.68)",
              borderRadius: "24px",
              border: "1px solid rgba(148,163,184,0.08)",
              padding: "26px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: T_FONT.display,
                  fontSize: "40px",
                  fontWeight: 900,
                  letterSpacing: "-2px",
                }}
              >
                Daily Quests
              </div>

              <div style={{ color: "#64748b", fontWeight: 700 }}>
                {completed}/{total}
              </div>
            </div>

            <div style={{ marginTop: "22px" }}>
              <div
                style={{
                  height: "8px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.05)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "0%",
                    height: "100%",
                    background: "#8b5cf6",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "26px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {QUESTS.map((q) => (
                <QuestCard key={q.id} q={q} />
              ))}
            </div>
          </div>

          {/* WEEKLY XP */}
          <div
            style={{
              background: "rgba(15,23,42,0.68)",
              borderRadius: "24px",
              border: "1px solid rgba(148,163,184,0.08)",
              padding: "24px",
              minHeight: "420px",
            }}
          >
            <div
              style={{
                fontFamily: T_FONT.display,
                fontSize: "34px",
                fontWeight: 900,
                letterSpacing: "-2px",
                marginBottom: "20px",
              }}
            >
              Weekly XP
            </div>

            <div style={{ width: "100%", height: "320px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEK_DATA}>
                  <XAxis dataKey="day" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip
                    contentStyle={{
                      background: "#020617",
                      border: "1px solid #1e293b",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar
                    dataKey="xp"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </PanelBoundary>
  );
});

DashboardView.displayName = "DashboardView";