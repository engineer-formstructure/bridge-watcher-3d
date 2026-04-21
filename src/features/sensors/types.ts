export type SensorStatus = "normal" | "warning" | "critical" | "offline";

export type SensorType =
  | "strain"
  | "tilt"
  | "vibration"
  | "load"
  | "temperature"
  | "displacement";

export interface SensorThresholds {
  warning: number;
  critical: number;
}

export interface Sensor {
  id: string;
  label: string;
  type: SensorType;
  unit: string;
  position: [number, number, number]; // local 3D coordinates on the launcher
  attachedTo: string; // structural element id
  thresholds: SensorThresholds;
}

export interface SensorReading {
  sensorId: string;
  value: number;
  status: SensorStatus;
  timestamp: number;
}

export interface SensorWithReading extends Sensor {
  reading: SensorReading;
  history: SensorReading[];
}
