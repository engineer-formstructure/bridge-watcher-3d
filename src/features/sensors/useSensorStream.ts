import { useEffect, useRef, useState, useCallback } from "react";
import { SENSORS, SENSOR_TYPE_META } from "./sensor-config";
import type { Sensor, SensorReading, SensorStatus, SensorWithReading } from "./types";

const HISTORY_LEN = 60;

function classify(value: number, sensor: Sensor): SensorStatus {
  if (value >= sensor.thresholds.critical) return "critical";
  if (value >= sensor.thresholds.warning) return "warning";
  return "normal";
}

// Simulated stream — replace with WebSocket easily.
function nextValue(prev: number, sensor: Sensor, t: number): number {
  const [min, max] = SENSOR_TYPE_META[sensor.type].baseRange;
  const span = max - min;
  // baseline oscillation per sensor
  const seed = sensor.id.charCodeAt(0) + sensor.id.charCodeAt(1);
  const baseline = min + span * 0.45 + Math.sin(t / 1500 + seed) * span * 0.15;
  // smooth toward baseline + small noise
  const noise = (Math.random() - 0.5) * span * 0.05;
  let next = prev + (baseline - prev) * 0.18 + noise;
  // occasional anomaly burst on a few sensors
  if (Math.random() < 0.004) next = max * (0.95 + Math.random() * 0.15);
  return Math.max(0, next);
}

export function useSensorStream(intervalMs = 800) {
  const [readings, setReadings] = useState<Record<string, SensorReading>>(() => {
    const init: Record<string, SensorReading> = {};
    const now = Date.now();
    for (const s of SENSORS) {
      const [min, max] = SENSOR_TYPE_META[s.type].baseRange;
      const v = min + (max - min) * 0.4;
      init[s.id] = { sensorId: s.id, value: v, status: classify(v, s), timestamp: now };
    }
    return init;
  });

  const historyRef = useRef<Record<string, SensorReading[]>>({});

  useEffect(() => {
    const id = window.setInterval(() => {
      const t = Date.now();
      setReadings((prev) => {
        const next: Record<string, SensorReading> = {};
        for (const s of SENSORS) {
          const prevR = prev[s.id];
          const v = nextValue(prevR.value, s, t);
          const r: SensorReading = { sensorId: s.id, value: v, status: classify(v, s), timestamp: t };
          next[s.id] = r;
          const hist = historyRef.current[s.id] ?? [];
          hist.push(r);
          if (hist.length > HISTORY_LEN) hist.shift();
          historyRef.current[s.id] = hist;
        }
        return next;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  const getSensors = useCallback((): SensorWithReading[] => {
    return SENSORS.map((s) => ({
      ...s,
      reading: readings[s.id],
      history: historyRef.current[s.id] ?? [],
    }));
  }, [readings]);

  return { sensors: getSensors(), readingsMap: readings, historyRef };
}
