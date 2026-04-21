import { useMemo } from "react";
import type { SensorWithReading } from "../sensors/types";

interface Props {
  sensors: SensorWithReading[];
}

export function StatusSummary({ sensors }: Props) {
  const counts = useMemo(() => {
    const c = { normal: 0, warning: 0, critical: 0, offline: 0 };
    for (const s of sensors) c[s.reading.status]++;
    return c;
  }, [sensors]);

  const overall =
    counts.critical > 0 ? "CRITICAL" : counts.warning > 0 ? "WARNING" : "NOMINAL";
  const overallClass =
    counts.critical > 0 ? "text-status-critical" : counts.warning > 0 ? "text-status-warning" : "text-status-normal";

  const now = new Date();
  const ts = now.toISOString().replace("T", " ").slice(0, 19) + "Z";

  return (
    <header className="panel scanline relative flex items-center gap-6 px-4 py-2.5">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary/15 text-primary">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 17l4-8 5 6 4-4 5 6" />
          </svg>
        </div>
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Launcher Monitoring</div>
          <div className="font-display text-sm font-semibold tracking-tight">BL-A07 · Span 14 → Span 15</div>
        </div>
      </div>

      <div className="mx-4 h-8 w-px bg-border" />

      <div className="flex items-center gap-2">
        <span className={`status-dot ${overall === "CRITICAL" ? "status-critical" : overall === "WARNING" ? "status-warning" : "status-normal"}`} />
        <span className={`mono text-xs font-bold uppercase tracking-widest ${overallClass}`}>{overall}</span>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Stat label="Normal" value={counts.normal} tone="normal" />
        <Stat label="Warning" value={counts.warning} tone="warning" />
        <Stat label="Critical" value={counts.critical} tone="critical" />
        <div className="hidden md:flex flex-col items-end">
          <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">UTC</div>
          <div className="mono text-xs">{ts}</div>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "normal" | "warning" | "critical" }) {
  const color =
    tone === "critical" ? "text-status-critical" : tone === "warning" ? "text-status-warning" : "text-status-normal";
  return (
    <div className="flex items-center gap-2 rounded-sm border border-border bg-surface/50 px-2.5 py-1">
      <span className={`status-dot status-${tone}`} />
      <div className="flex items-baseline gap-1.5">
        <span className={`mono text-sm font-bold tabular-nums ${color}`}>{value.toString().padStart(2, "0")}</span>
        <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
