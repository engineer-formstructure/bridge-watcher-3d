import { useMemo } from "react";
import type { SensorReading } from "../sensors/types";

interface Props {
  history: SensorReading[];
  warning: number;
  critical: number;
  color: string;
  width?: number;
  height?: number;
}

export function Sparkline({ history, warning, critical, color, width = 280, height = 80 }: Props) {
  const path = useMemo(() => {
    if (history.length < 2) return "";
    const max = Math.max(critical * 1.05, ...history.map((r) => r.value));
    const min = Math.min(0, ...history.map((r) => r.value));
    const span = max - min || 1;
    const step = width / (history.length - 1);
    return history
      .map((r, i) => {
        const x = i * step;
        const y = height - ((r.value - min) / span) * height;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [history, width, height, critical]);

  const max = history.length ? Math.max(critical * 1.05, ...history.map((r) => r.value)) : critical;
  const yFor = (v: number) => height - (v / max) * height;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20" preserveAspectRatio="none">
      <line x1="0" x2={width} y1={yFor(warning)} y2={yFor(warning)} stroke="hsl(var(--status-warning))" strokeDasharray="2 3" strokeOpacity="0.6" />
      <line x1="0" x2={width} y1={yFor(critical)} y2={yFor(critical)} stroke="hsl(var(--status-critical))" strokeDasharray="2 3" strokeOpacity="0.7" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
