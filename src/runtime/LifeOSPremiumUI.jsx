import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Gamepad2,
  HeartPulse,
  Home,
  Layers3,
  Moon,
  PenLine,
  Plus,
  Rocket,
  Search,
  Shirt,
  Sparkles,
  Star,
  Target,
  TimerReset,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "planner", label: "Planner", icon: Layers3 },
  { id: "habits", label: "Hábitos", icon: CalendarDays },
  { id: "calculus", label: "Cálculo", icon: BookOpen },
  { id: "rocket", label: "Rocket", icon: Gamepad2 },
  { id: "wardrobe", label: "Clóset", icon: Shirt },
  { id: "reflection", label: "Reflexión", icon: PenLine },
];

const plannerBlocks = [
  { time: "08:10", duration: "95m", title: "Cálculo I", meta: "Límites · continuidad · ejercicios base", status: "Foco", accent: "from-sky-400 to-cyan-300", load: 88 },
  { time: "10:10", duration: "35m", title: "Revisión activa", meta: "Errores, fórmulas y patrones", status: "Deep", accent: "from-violet-400 to-fuchsia-300", load: 62 },
  { time: "14:00", duration: "90m", title: "Rocket League", meta: "Shots simples + rotación 2v2", status: "Skill", accent: "from-orange-400 to-amber-300", load: 74 },
  { time: "16:00", duration: "45m", title: "Blender / proyecto", meta: "Progreso incremental sin overload", status: "Craft", accent: "from-emerald-400 to-teal-300", load: 58 },
  { time: "20:30", duration: "12m", title: "Reflection Log", meta: "Cierre mental y ajuste de mañana", status: "Reset", accent: "from-indigo-400 to-violet-300", load: 30 },
];

const weekConsistency = [
  { day: "L", habits: 87, calculus: 92, rocket: 76 },
  { day: "M", habits: 72, calculus: 88, rocket: 83 },
  { day: "M", habits: 94, calculus: 80, rocket: 70 },
  { day: "J", habits: 69, calculus: 96, rocket: 78 },
  { day: "V", habits: 82, calculus: 84, rocket: 90 },
  { day: "S", habits: 58, calculus: 74, rocket: 62 },
  { day: "D", habits: 76, calculus: 79, rocket: 68 },
];

const monthHeat = Array.from({ length: 35 }, (_, index) => {
  const value = [30, 50, 70, 90, 64, 42, 82][index % 7] + (index % 3) * 3;
  return { id: index + 1, value: Math.min(value, 100) };
});

const rocketSessions = [
  { label: "Freeplay agresivo", time: "10m", done: true },
  { label: "Foco del ciclo", time: "30m", done: true },
  { label: "Descanso técnico", time: "10m", done: false },
  { label: "Aplicación controlada", time: "20m", done: false },
  { label: "Fundamentos", time: "10m", done: false },
  { label: "Replay note", time: "5m", done: false },
  { label: "Cierre técnico", time: "5m", done: false },
];

const mmrTrend = [
  { d: "L", mmr: 835 },
  { d: "M", mmr: 842 },
  { d: "X", mmr: 831 },
  { d: "J", mmr: 856 },
  { d: "V", mmr: 869 },
  { d: "S", mmr: 861 },
  { d: "D", mmr: 884 },
];

const wardrobeItems = [
  { name: "Camisa blanca oxford", type: "Top", tone: "Neutro", tag: "limpio" },
  { name: "Pantalón beige", type: "Bottom", tone: "Cálido", tag: "casual" },
  { name: "Tenis grises", type: "Shoes", tone: "Frío", tag: "diario" },
  { name: "Hoodie azul marino", type: "Layer", tone: "Oscuro", tag: "relajado" },
];

const calculusSteps = [
  "Identifica el punto crítico",
  "Evalúa límites laterales",
  "Compara resultados",
  "Justifica continuidad",
];

function PremiumTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-white/15 bg-slate-950/90 px-3 py-2 text-xs text-slate-200 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <p className="mb-1 font-semibold text-white">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="text-slate-300">
          {item.name || item.dataKey}: <span className="font-bold text-white">{item.value}</span>
        </p>
      ))}
    </div>
  );
}

export function AdaptiveSurface({
  as: Tag = "section",
  children,
  className = "",
  glow = "violet",
  compact = false,
  interactive = true,
  ariaLabel,
}) {
  const glowMap = {
    violet: "before:bg-violet-500/20 after:bg-cyan-400/10",
    cyan: "before:bg-cyan-400/20 after:bg-sky-500/10",
    emerald: "before:bg-emerald-400/20 after:bg-teal-400/10",
    amber: "before:bg-amber-400/20 after:bg-orange-500/10",
    rose: "before:bg-rose-400/20 after:bg-fuchsia-500/10",
  };

  return (
    <Tag
      aria-label={ariaLabel}
      className={cx(
        "group relative isolate overflow-hidden rounded-[1.65rem] border border-white/15 bg-white/[0.075] text-slate-100 shadow-[0_24px_80px_rgba(2,6,23,0.38)] backdrop-blur-lg",
        "dark:border-white/10 dark:bg-slate-900/40",
        "before:pointer-events-none before:absolute before:-right-16 before:-top-16 before:h-44 before:w-44 before:rounded-full before:blur-3xl before:content-['']",
        "after:pointer-events-none after:absolute after:-bottom-20 after:left-10 after:h-52 after:w-52 after:rounded-full after:blur-3xl after:content-['']",
        "ring-1 ring-white/5",
        interactive && "transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.095] hover:shadow-[0_30px_100px_rgba(2,6,23,0.52)]",
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6 lg:p-7",
        glowMap[glow] || glowMap.violet,
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}

function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-200/80">
            {eyebrow}
          </p>
        )}
        <h1 className="text-balance text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, delta, glow = "violet" }) {
  return (
    <AdaptiveSurface compact glow={glow} ariaLabel={label}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-white">{value}</p>
          {delta && <p className="mt-2 text-xs font-semibold text-emerald-200">{delta}</p>}
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/10 text-cyan-200 shadow-inner shadow-white/10">
          <Icon size={20} aria-hidden="true" />
        </div>
      </div>
    </AdaptiveSurface>
  );
}

function ProgressLine({ value, label, accent = "bg-cyan-300" }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-300">{label}</span>
        <span className="font-black text-white">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
        <div className={cx("h-full rounded-full shadow-[0_0_18px_rgba(255,255,255,0.25)]", accent)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function SidebarNav({ currentView, onChange }) {
  return (
    <aside className="hidden h-dvh w-[18rem] shrink-0 border-r border-white/10 bg-slate-950/35 p-4 backdrop-blur-2xl lg:flex lg:flex-col">
      <div className="mb-6 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.065] p-3 shadow-2xl shadow-black/20">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-300 text-slate-950 shadow-lg shadow-violet-950/30">
          <Zap size={22} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-white">LifeOS</p>
          <p className="text-xs font-semibold text-slate-400">Premium System</p>
        </div>
      </div>

      <nav aria-label="Navegación principal" className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cx(
                "group flex min-h-12 items-center gap-3 rounded-2xl border px-3.5 text-left text-sm font-bold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-200/80",
                active
                  ? "border-white/20 bg-white/15 text-white shadow-xl shadow-violet-950/20"
                  : "border-transparent bg-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className={cx("grid h-9 w-9 place-items-center rounded-xl transition", active ? "bg-cyan-300/15 text-cyan-100" : "bg-white/[0.04] text-slate-500 group-hover:text-cyan-100")}>
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="flex-1">{item.label}</span>
              {active && <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />}
            </button>
          );
        })}
      </nav>

      <AdaptiveSurface compact glow="cyan" className="mt-4 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-sm font-black text-white">H</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">Hector</p>
            <p className="text-xs font-semibold text-cyan-100/75">Lv. 12 · Consistency Mode</p>
          </div>
        </div>
      </AdaptiveSurface>
    </aside>
  );
}

function MobileNav({ currentView, onChange }) {
  const mobileItems = navItems.slice(0, 5);
  return (
    <nav aria-label="Navegación móvil" className="fixed inset-x-3 bottom-3 z-50 rounded-[1.7rem] border border-white/15 bg-slate-950/75 p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cx(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[0.65rem] font-black outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-200/80",
                active ? "bg-white/15 text-white" : "text-slate-500 hover:bg-white/10 hover:text-white"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function TopBar({ onSearch }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/35 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="lg:hidden grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10 text-cyan-100">
          <Zap size={20} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-black uppercase tracking-[0.2em] text-slate-400">SaaS Command Center</p>
          <p className="truncate text-sm font-bold text-white sm:text-base">Hoy · enfoque limpio, medible y sostenible</p>
        </div>
        <label className="hidden w-full max-w-xs items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2.5 text-sm text-slate-300 shadow-inner shadow-white/5 md:flex">
          <Search size={16} className="text-slate-500" aria-hidden="true" />
          <span className="sr-only">Buscar en LifeOS</span>
          <input
            onChange={(event) => onSearch?.(event.target.value)}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="Buscar sistema…"
          />
        </label>
        <div className="hidden rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-100 sm:block">
          Sync activo
        </div>
      </div>
    </header>
  );
}

export function DashboardView({ setView }) {
  return (
    <main className="space-y-6" aria-labelledby="dashboard-title">
      <SectionHeader
        eyebrow="Control diario"
        title={<span id="dashboard-title">Dashboard</span>}
        description="Resumen de planificación, consistencia, Rocket League y Cálculo en una superficie de alta densidad visual."
        action={
          <button type="button" onClick={() => setView("planner")} className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80">
            Abrir planner
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Flame} label="Racha" value="12d" delta="+3 días vs semana pasada" glow="amber" />
        <MetricCard icon={Target} label="Foco hoy" value="84%" delta="Carga sostenible" glow="cyan" />
        <MetricCard icon={BookOpen} label="Cálculo" value="8:10" delta="Bloque fijo activo" glow="violet" />
        <MetricCard icon={Gamepad2} label="Rocket" value="90m" delta="Ciclo 1 · fundamentos" glow="emerald" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <AdaptiveSurface glow="violet" ariaLabel="Planificador principal">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-100/70">Planificador</p>
              <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-white">Bloques críticos del día</h2>
            </div>
            <button type="button" onClick={() => setView("planner")} className="rounded-2xl border border-white/10 bg-white/10 p-2 text-slate-200 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80" aria-label="Ir al planner">
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="space-y-3">
            {plannerBlocks.slice(0, 4).map((block) => (
              <div key={block.title} className="grid grid-cols-[4.2rem_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3">
                <div className="text-sm font-black text-white">{block.time}</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{block.title}</p>
                  <p className="truncate text-xs text-slate-400">{block.meta}</p>
                </div>
                <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-cyan-100">{block.status}</span>
              </div>
            ))}
          </div>
        </AdaptiveSurface>

        <AdaptiveSurface glow="emerald" ariaLabel="Hábitos y consistencia">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100/70">Hábitos</p>
              <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-white">Consistencia semanal</h2>
            </div>
            <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100">82%</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekConsistency} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashHabits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6ee7b7" stopOpacity={0.48} />
                    <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<PremiumTooltip />} />
                <Area type="monotone" dataKey="habits" stroke="#6ee7b7" strokeWidth={3} fill="url(#dashHabits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdaptiveSurface>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AdaptiveSurface glow="amber" ariaLabel="Rocket League resumen">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-100/70">Rocket League</p>
              <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-white">Shots simples + rotación 2v2</h2>
              <p className="mt-2 text-sm text-slate-300">Ciclo de 2 semanas · ranked opcional · cero mecánicas flashy.</p>
            </div>
            <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full border border-amber-200/20 bg-amber-300/10">
              <div className="text-center">
                <p className="text-3xl font-black text-white">884</p>
                <p className="text-xs font-black text-amber-100">MMR</p>
              </div>
            </div>
          </div>
        </AdaptiveSurface>

        <AdaptiveSurface glow="cyan" ariaLabel="Calculus Trainer resumen">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/70">Calculus Trainer</p>
              <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-white">Focus Mode</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">Resolver, validar procedimiento y registrar errores sin ruido visual.</p>
            </div>
            <button type="button" onClick={() => setView("calculus")} className="rounded-2xl border border-white/10 bg-white/10 p-2 text-cyan-100 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80" aria-label="Abrir Calculus Trainer">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="mt-6 space-y-3">
            <ProgressLine label="Límites laterales" value={78} accent="bg-cyan-300" />
            <ProgressLine label="Continuidad" value={64} accent="bg-violet-300" />
          </div>
        </AdaptiveSurface>
      </div>
    </main>
  );
}

export function SmartPlannerView() {
  return (
    <main className="space-y-6" aria-labelledby="planner-title">
      <SectionHeader
        eyebrow="Timeline operativo"
        title={<span id="planner-title">Smart Planner</span>}
        description="Bloques de tiempo densos, legibles y priorizados para que el día tenga dirección sin sentirse sobrecargado."
      />
      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <AdaptiveSurface glow="violet" ariaLabel="Línea temporal premium">
          <div className="relative space-y-4 before:absolute before:left-[5.25rem] before:top-5 before:h-[calc(100%-2.5rem)] before:w-px before:bg-white/10 sm:before:left-[6.25rem]">
            {plannerBlocks.map((block) => (
              <article key={block.title} className="relative grid grid-cols-[4.5rem_1fr] gap-4 sm:grid-cols-[5.5rem_1fr]">
                <div className="pt-4 text-right">
                  <p className="font-mono text-sm font-black text-white">{block.time}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{block.duration}</p>
                </div>
                <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.055] p-4 transition hover:border-white/20 hover:bg-white/[0.08]">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-black text-white">{block.title}</h2>
                      <p className="mt-1 text-sm text-slate-400">{block.meta}</p>
                    </div>
                    <span className={cx("rounded-full bg-gradient-to-r px-3 py-1 text-[0.65rem] font-black uppercase tracking-wide text-slate-950", block.accent)}>{block.status}</span>
                  </div>
                  <ProgressLine label="Carga cognitiva" value={block.load} accent="bg-gradient-to-r from-violet-300 to-cyan-200" />
                </div>
              </article>
            ))}
          </div>
        </AdaptiveSurface>

        <div className="space-y-4">
          <AdaptiveSurface compact glow="cyan" ariaLabel="Balance del día">
            <h2 className="text-lg font-black text-white">Balance del día</h2>
            <div className="mt-5 space-y-4">
              <ProgressLine label="Deep Work" value={74} accent="bg-cyan-300" />
              <ProgressLine label="Skill Training" value={68} accent="bg-orange-300" />
              <ProgressLine label="Recovery" value={42} accent="bg-emerald-300" />
            </div>
          </AdaptiveSurface>
          <AdaptiveSurface compact glow="emerald" ariaLabel="Sugerencia operativa">
            <div className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-100">
                <HeartPulse size={18} />
              </div>
              <div>
                <h2 className="font-black text-white">No compactar recuperación</h2>
                <p className="mt-1 text-sm leading-6 text-slate-300">El día ya tiene dos bloques intensos. Mantén el cierre técnico corto.</p>
              </div>
            </div>
          </AdaptiveSurface>
        </div>
      </div>
    </main>
  );
}

export function HabitsTrackerView() {
  return (
    <main className="space-y-6" aria-labelledby="habits-title">
      <SectionHeader
        eyebrow="Consistencia"
        title={<span id="habits-title">Habits Tracker</span>}
        description="Vista limpia para ver si el sistema se está sosteniendo semanal y mensualmente."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Check} label="Completados" value="31/42" delta="74% semanal" glow="emerald" />
        <MetricCard icon={Flame} label="Mejor racha" value="18d" delta="récord mensual" glow="amber" />
        <MetricCard icon={TrendingUp} label="Tendencia" value="+11%" delta="mejorando" glow="cyan" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <AdaptiveSurface glow="emerald" ariaLabel="Mapa mensual de consistencia">
          <h2 className="mb-5 text-xl font-black text-white">Mapa mensual</h2>
          <div className="grid grid-cols-7 gap-2" aria-label="Calendario de consistencia mensual">
            {monthHeat.map((cell) => (
              <div
                key={cell.id}
                className="aspect-square rounded-xl border border-white/10 bg-emerald-300/10 transition hover:scale-105 hover:bg-emerald-300/20"
                style={{ opacity: 0.22 + cell.value / 128 }}
                title={`Día ${cell.id}: ${cell.value}%`}
              />
            ))}
          </div>
        </AdaptiveSurface>
        <AdaptiveSurface glow="cyan" ariaLabel="Comparativa semanal de hábitos">
          <h2 className="mb-5 text-xl font-black text-white">Comparativa semanal</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekConsistency} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<PremiumTooltip />} />
                <Bar dataKey="habits" name="Hábitos" fill="#6ee7b7" radius={[10, 10, 10, 10]} />
                <Bar dataKey="calculus" name="Cálculo" fill="#67e8f9" radius={[10, 10, 10, 10]} />
                <Bar dataKey="rocket" name="Rocket" fill="#fbbf24" radius={[10, 10, 10, 10]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdaptiveSurface>
      </div>
    </main>
  );
}

export function CalculusTrainerView() {
  const [answer, setAnswer] = useState("");
  return (
    <main className="min-h-[calc(100dvh-8rem)]" aria-labelledby="calculus-title">
      <AdaptiveSurface glow="cyan" className="min-h-[calc(100dvh-9rem)]" ariaLabel="Calculus Trainer Focus Mode">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/75">Focus Mode</p>
            <h1 id="calculus-title" className="mt-2 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">Calculus Trainer</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Resuelve con calma. El input está priorizado; lo demás queda en segundo plano.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] px-5 py-4 text-right">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Sesión</p>
            <p className="mt-1 text-2xl font-black text-white">08:10–09:45</p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
          <section className="rounded-[1.8rem] border border-white/10 bg-slate-950/30 p-5 sm:p-7" aria-labelledby="problem-title">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-100">Límites laterales</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">Dificultad: Intermedia</span>
            </div>

            <h2 id="problem-title" className="text-balance text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">Determina si el límite existe</h2>
            <div className="my-7 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 text-center shadow-inner shadow-white/5">
              <p className="font-serif text-2xl leading-relaxed text-white sm:text-4xl">
                lim<span className="mx-1 text-base text-slate-400">x→2</span> f(x), &nbsp;
                f(x)=<span className="text-cyan-100">{"{"}</span>
                <span className="mx-2">x² − 1, x ≥ 2</span>
                <span className="mx-2">3x + 1, x &lt; 2</span>
                <span className="text-cyan-100">{"}"}</span>
              </p>
            </div>

            <label htmlFor="numeric-answer" className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-slate-300">Respuesta numérica o conclusión</label>
            <input
              id="numeric-answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              inputMode="decimal"
              placeholder="Ej: No existe"
              className="w-full rounded-[1.5rem] border border-cyan-200/25 bg-cyan-300/[0.075] px-5 py-5 text-2xl font-black text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/70 focus:ring-4 focus:ring-cyan-200/10 sm:text-3xl"
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="min-h-12 rounded-2xl bg-cyan-200 px-5 text-sm font-black text-slate-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Evaluar respuesta</button>
              <button type="button" className="min-h-12 rounded-2xl border border-white/10 bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80">Guardar intento</button>
            </div>
          </section>

          <aside className="space-y-4">
            <AdaptiveSurface compact glow="violet" ariaLabel="Pasos sugeridos">
              <h2 className="mb-4 text-lg font-black text-white">Checklist mental</h2>
              <div className="space-y-3">
                {calculusSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-violet-300/10 text-xs font-black text-violet-100">{index + 1}</div>
                    <p className="text-sm font-semibold text-slate-200">{step}</p>
                  </div>
                ))}
              </div>
            </AdaptiveSurface>
            <AdaptiveSurface compact glow="emerald" ariaLabel="Progreso de cálculo">
              <h2 className="mb-4 text-lg font-black text-white">Dominio actual</h2>
              <div className="space-y-4">
                <ProgressLine label="Procedimiento" value={71} accent="bg-emerald-300" />
                <ProgressLine label="Precisión" value={64} accent="bg-cyan-300" />
                <ProgressLine label="Velocidad" value={52} accent="bg-violet-300" />
              </div>
            </AdaptiveSurface>
          </aside>
        </div>
      </AdaptiveSurface>
    </main>
  );
}

export function RocketLeagueView() {
  const rankGauge = [{ name: "MMR", value: 74, fill: "#fbbf24" }];
  return (
    <main className="space-y-6" aria-labelledby="rocket-title">
      <SectionHeader
        eyebrow="Training telemetry"
        title={<span id="rocket-title">Rocket League</span>}
        description="Panel de MMR, rangos, rachas y entrenamiento del ciclo. Ranked es opcional; el foco principal son fundamentos."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Trophy} label="Rango" value="Diamond I" delta="Plat/Diamond bajo" glow="amber" />
        <MetricCard icon={TrendingUp} label="MMR" value="884" delta="+49 esta semana" glow="cyan" />
        <MetricCard icon={Flame} label="Racha" value="3W" delta="mental estable" glow="emerald" />
        <MetricCard icon={Target} label="Foco" value="Shots" delta="Ciclo 1/2" glow="violet" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <AdaptiveSurface glow="amber" ariaLabel="Telemetría MMR">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-100/70">MMR Telemetry</p>
              <h2 className="mt-1 text-xl font-black tracking-[-0.03em] text-white">Tendencia competitiva</h2>
            </div>
            <span className="rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100">+5.9%</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mmrTrend} margin={{ top: 8, right: 6, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mmrGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis hide domain={[820, 900]} />
                <Tooltip content={<PremiumTooltip />} />
                <Area type="monotone" dataKey="mmr" name="MMR" stroke="#fbbf24" strokeWidth={3} fill="url(#mmrGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdaptiveSurface>

        <AdaptiveSurface glow="cyan" ariaLabel="Gauge de rango">
          <h2 className="mb-3 text-xl font-black text-white">Progreso a Diamond II</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={rankGauge} startAngle={220} endAngle={-40}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={18} background={{ fill: "rgba(255,255,255,0.08)" }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="-mt-24 mb-10 text-center">
            <p className="text-5xl font-black tracking-[-0.06em] text-white">74%</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-slate-400">rank progress</p>
          </div>
        </AdaptiveSurface>
      </div>

      <AdaptiveSurface glow="violet" ariaLabel="Rutina Rocket League 90 minutos">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-100/70">Rutina 90m</p>
            <h2 className="text-xl font-black text-white">Ciclo actual: shots simples + rotación básica 2v2</h2>
          </div>
          <p className="text-sm font-bold text-slate-300">Speedflip: semana 7+ o mantenimiento 5–10m, 2–3 veces/semana.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          {rocketSessions.map((session) => (
            <div key={session.label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
              <div className={cx("mb-4 grid h-9 w-9 place-items-center rounded-xl", session.done ? "bg-emerald-300/15 text-emerald-100" : "bg-white/10 text-slate-400")}>
                {session.done ? <Check size={17} /> : <Clock3 size={17} />}
              </div>
              <p className="text-sm font-black text-white">{session.label}</p>
              <p className="mt-1 text-xs font-bold text-slate-400">{session.time}</p>
            </div>
          ))}
        </div>
      </AdaptiveSurface>
    </main>
  );
}

export function WardrobeView() {
  return (
    <main className="space-y-6" aria-labelledby="wardrobe-title">
      <SectionHeader
        eyebrow="Catálogo personal"
        title={<span id="wardrobe-title">Wardrobe</span>}
        description="Clóset visual de baja fricción para decidir rápido sin repetir combinaciones débiles."
        action={<button type="button" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80"><Plus size={16} /> Prenda</button>}
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_0.75fr]">
        <AdaptiveSurface glow="cyan" ariaLabel="Catálogo de prendas">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black text-white">Prendas guardadas</h2>
            <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-slate-300">
              <Search size={16} className="text-slate-500" />
              <span className="sr-only">Buscar prendas</span>
              <input className="w-full bg-transparent outline-none placeholder:text-slate-500" placeholder="Buscar…" />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {wardrobeItems.map((item) => (
              <article key={item.name} className="rounded-[1.4rem] border border-white/10 bg-white/[0.055] p-4 transition hover:border-white/20 hover:bg-white/[0.08]">
                <div className="mb-4 aspect-[4/3] rounded-[1.2rem] border border-white/10 bg-gradient-to-br from-white/15 via-white/[0.055] to-slate-950/20" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-black text-white">{item.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">{item.type} · {item.tone}</p>
                  </div>
                  <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-2.5 py-1 text-[0.65rem] font-black text-cyan-100">{item.tag}</span>
                </div>
              </article>
            ))}
          </div>
        </AdaptiveSurface>

        <AdaptiveSurface glow="violet" ariaLabel="Outfit recomendado">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-100/70">Recomendación</p>
          <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-white">Outfit limpio de hoy</h2>
          <div className="mt-6 space-y-3">
            {["Camisa blanca oxford", "Pantalón beige", "Tenis grises"].map((piece) => (
              <div key={piece} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-300/10 text-violet-100"><Shirt size={18} /></div>
                <p className="text-sm font-bold text-white">{piece}</p>
              </div>
            ))}
          </div>
          <button type="button" className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Marcar como usado</button>
        </AdaptiveSurface>
      </div>
    </main>
  );
}

export function ReflectionView() {
  const [mood, setMood] = useState(4);
  return (
    <main className="space-y-6" aria-labelledby="reflection-title">
      <SectionHeader
        eyebrow="Cierre del sistema"
        title={<span id="reflection-title">Reflection</span>}
        description="Formulario de baja fricción para detectar patrones sin convertir la reflexión en otra carga."
      />
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <AdaptiveSurface glow="emerald" ariaLabel="Estado actual">
          <h2 className="mb-5 text-xl font-black text-white">Estado actual</h2>
          <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Estado de ánimo">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMood(value)}
                className={cx("min-h-16 rounded-2xl border text-xl font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80", mood === value ? "border-emerald-200/50 bg-emerald-300/15 text-white" : "border-white/10 bg-white/[0.055] text-slate-500 hover:bg-white/10")}
                role="radio"
                aria-checked={mood === value}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            <ProgressLine label="Energía" value={68} accent="bg-emerald-300" />
            <ProgressLine label="Claridad" value={74} accent="bg-cyan-300" />
            <ProgressLine label="Estrés" value={36} accent="bg-rose-300" />
          </div>
        </AdaptiveSurface>

        <AdaptiveSurface glow="violet" ariaLabel="Formulario de reflexión">
          <form className="space-y-5">
            <div>
              <label htmlFor="wins" className="mb-2 block text-sm font-black text-white">Qué salió bien</label>
              <textarea id="wins" rows={4} className="w-full resize-none rounded-[1.35rem] border border-white/10 bg-white/[0.055] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50 focus:ring-4 focus:ring-cyan-200/10" placeholder="Una victoria concreta del día…" />
            </div>
            <div>
              <label htmlFor="friction" className="mb-2 block text-sm font-black text-white">Fricción principal</label>
              <textarea id="friction" rows={4} className="w-full resize-none rounded-[1.35rem] border border-white/10 bg-white/[0.055] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50 focus:ring-4 focus:ring-cyan-200/10" placeholder="Qué te frenó o te drenó…" />
            </div>
            <div>
              <label htmlFor="next" className="mb-2 block text-sm font-black text-white">Ajuste para mañana</label>
              <input id="next" className="w-full rounded-[1.35rem] border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/50 focus:ring-4 focus:ring-cyan-200/10" placeholder="Un ajuste pequeño y ejecutable" />
            </div>
            <button type="button" className="w-full rounded-2xl bg-gradient-to-r from-violet-200 to-cyan-100 px-5 py-3 text-sm font-black text-slate-950 transition hover:from-white hover:to-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Guardar reflexión</button>
          </form>
        </AdaptiveSurface>
      </div>
    </main>
  );
}

function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.24),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.14),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30" />
      <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
    </div>
  );
}

const viewMap = {
  dashboard: DashboardView,
  planner: SmartPlannerView,
  habits: HabitsTrackerView,
  calculus: CalculusTrainerView,
  rocket: RocketLeagueView,
  wardrobe: WardrobeView,
  reflection: ReflectionView,
};

export default function LifeOSPremiumUI() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [query, setQuery] = useState("");
  const ActiveView = useMemo(() => viewMap[currentView] || DashboardView, [currentView]);

  return (
    <div className="min-h-dvh overflow-hidden bg-slate-950 text-slate-100 antialiased selection:bg-cyan-200 selection:text-slate-950">
      <AmbientBackground />
      <div className="flex min-h-dvh">
        <SidebarNav currentView={currentView} onChange={setCurrentView} />
        <div className="min-w-0 flex-1">
          <TopBar onSearch={setQuery} />
          <div className="mx-auto w-full max-w-[96rem] px-4 py-5 pb-28 sm:px-6 sm:py-7 lg:px-8 lg:pb-8">
            {query ? (
              <AdaptiveSurface compact glow="cyan" className="mb-5">
                <p className="text-sm font-semibold text-slate-300">Filtro visual activo: <span className="font-black text-white">{query}</span></p>
              </AdaptiveSurface>
            ) : null}
            <ActiveView setView={setCurrentView} />
          </div>
        </div>
      </div>
      <MobileNav currentView={currentView} onChange={setCurrentView} />
    </div>
  );
}
