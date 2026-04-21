import { useMemo, useState } from "react";
import type { SensorStatus, SensorType, SensorWithReading } from "../sensors/types";
import { SENSOR_TYPE_META } from "../sensors/sensor-config";
import { Sparkline } from "./Sparkline";

interface Props {
  sensors: SensorWithReading[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const STATUS_FILTERS: (SensorStatus | "all")[] = ["all", "critical", "warning", "normal"];

export function SensorPanel({ sensors, selectedId, onSelect }: Props) {
  const [statusFilter, setStatusFilter] = useState<SensorStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<SensorType | "all">("all");
  const [query, setQuery] = useState("");

  const types = Array.from(new Set(sensors.map((s) => s.type))) as SensorType[];

  const filtered = useMemo(() => {
    return sensors.filter((s) => {
      if (statusFilter !== "all" && s.reading.status !== statusFilter) return false;
      if (typeFilter !== "all" && s.type !== typeFilter) return false;
      if (query && !`${s.id} ${s.label}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [sensors, statusFilter, typeFilter, query]);

  const selected = sensors.find((s) => s.id === selectedId);

  return (
    <aside className="panel flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Telemetry</div>
        <div className="font-display text-sm font-semibold">Sensor Network · {sensors.length} nodes</div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 border-b border-border px-3 py-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ID or label…"
          className="mono w-full rounded-sm border border-border bg-surface px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`mono rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors ${
                statusFilter === f
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-surface text-muted-foreground hover:bg-surface-hover"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <FilterChip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>all types</FilterChip>
          {types.map((t) => (
            <FilterChip key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>
              {SENSOR_TYPE_META[t].label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Selected detail */}
      {selected && (
        <div className="border-b border-border bg-surface-elevated/60 px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className={`status-dot status-${selected.reading.status}`} />
                <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">{selected.id}</span>
              </div>
              <div className="font-display text-sm font-semibold">{selected.label}</div>
              <div className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {SENSOR_TYPE_META[selected.type].label} · {selected.attachedTo}
              </div>
            </div>
            <button
              onClick={() => onSelect(null)}
              className="mono rounded-sm border border-border px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground hover:bg-surface-hover"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span
              className="mono text-3xl font-bold tabular-nums"
              style={{ color: `hsl(var(--status-${selected.reading.status}))` }}
            >
              {selected.reading.value.toFixed(selected.type === "tilt" ? 2 : 1)}
            </span>
            <span className="mono text-xs text-muted-foreground">{selected.unit}</span>
          </div>

          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground mono">
            <span>warn ≥ {selected.thresholds.warning}</span>
            <span>crit ≥ {selected.thresholds.critical}</span>
          </div>

          <div className="mt-2">
            <Sparkline
              history={selected.history}
              warning={selected.thresholds.warning}
              critical={selected.thresholds.critical}
              color={`hsl(var(--status-${selected.reading.status}))`}
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center mono text-xs text-muted-foreground">No sensors match.</div>
        )}
        <ul className="divide-y divide-border">
          {filtered.map((s) => {
            const active = s.id === selectedId;
            return (
              <li key={s.id}>
                <button
                  onClick={() => onSelect(s.id)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                    active ? "bg-primary/10" : "hover:bg-surface-hover"
                  }`}
                >
                  <span className={`status-dot status-${s.reading.status}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="mono text-[11px] font-medium text-foreground">{s.id}</span>
                      <span
                        className="mono text-xs font-bold tabular-nums"
                        style={{ color: `hsl(var(--status-${s.reading.status}))` }}
                      >
                        {s.reading.value.toFixed(s.type === "tilt" ? 2 : 1)}
                        <span className="ml-1 text-muted-foreground font-normal">{s.unit}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mono">
                      <span className="truncate">{s.label}</span>
                      <span>{SENSOR_TYPE_META[s.type].label}</span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`mono rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors ${
        active ? "border-primary/60 bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground hover:bg-surface-hover"
      }`}
    >
      {children}
    </button>
  );
}
