import type { Sensor, SensorType } from "./types";

export const SENSOR_TYPE_META: Record<
  SensorType,
  { label: string; unit: string; icon: string; baseRange: [number, number] }
> = {
  strain: { label: "Strain", unit: "µε", icon: "⎓", baseRange: [200, 1200] },
  tilt: { label: "Tilt", unit: "°", icon: "⌖", baseRange: [0, 2.5] },
  vibration: { label: "Vibration", unit: "mm/s", icon: "≈", baseRange: [0.2, 6.5] },
  load: { label: "Load", unit: "t", icon: "⤓", baseRange: [40, 220] },
  temperature: { label: "Temperature", unit: "°C", icon: "°", baseRange: [12, 78] },
  displacement: { label: "Displacement", unit: "mm", icon: "↔", baseRange: [0.1, 14] },
};

// Sensors mapped on the bridge launcher truss.
// Coordinates are local to the launcher group (length along X axis).
export const SENSORS: Sensor[] = [
  { id: "ST-N1", label: "Front Nose Strain", type: "strain", unit: "µε", position: [9.2, 1.6, 0.9], attachedTo: "nose-girder", thresholds: { warning: 900, critical: 1100 } },
  { id: "ST-N2", label: "Front Nose Strain L", type: "strain", unit: "µε", position: [9.2, 1.6, -0.9], attachedTo: "nose-girder", thresholds: { warning: 900, critical: 1100 } },
  { id: "ST-M1", label: "Mid Span Strain", type: "strain", unit: "µε", position: [0, 1.6, 0.9], attachedTo: "main-girder", thresholds: { warning: 950, critical: 1150 } },
  { id: "ST-M2", label: "Mid Span Strain L", type: "strain", unit: "µε", position: [0, 1.6, -0.9], attachedTo: "main-girder", thresholds: { warning: 950, critical: 1150 } },
  { id: "TI-F1", label: "Front Pier Tilt", type: "tilt", unit: "°", position: [6.5, -0.4, 0], attachedTo: "front-support", thresholds: { warning: 1.5, critical: 2.2 } },
  { id: "TI-R1", label: "Rear Pier Tilt", type: "tilt", unit: "°", position: [-6.5, -0.4, 0], attachedTo: "rear-support", thresholds: { warning: 1.5, critical: 2.2 } },
  { id: "VB-G1", label: "Gantry Vibration", type: "vibration", unit: "mm/s", position: [3.2, 2.6, 0], attachedTo: "winch-trolley", thresholds: { warning: 4.5, critical: 6.0 } },
  { id: "VB-G2", label: "Trolley Vibration", type: "vibration", unit: "mm/s", position: [-2.4, 2.6, 0], attachedTo: "winch-trolley", thresholds: { warning: 4.5, critical: 6.0 } },
  { id: "LD-W1", label: "Winch Load", type: "load", unit: "t", position: [3.2, 2.2, 0.8], attachedTo: "winch-trolley", thresholds: { warning: 180, critical: 210 } },
  { id: "LD-W2", label: "Aux Winch Load", type: "load", unit: "t", position: [-2.4, 2.2, 0.8], attachedTo: "winch-trolley", thresholds: { warning: 180, critical: 210 } },
  { id: "TM-H1", label: "Hydraulic Temp", type: "temperature", unit: "°C", position: [6.5, 0.2, 0.9], attachedTo: "front-support", thresholds: { warning: 65, critical: 75 } },
  { id: "TM-H2", label: "Motor Temp Rear", type: "temperature", unit: "°C", position: [-6.5, 0.2, 0.9], attachedTo: "rear-support", thresholds: { warning: 65, critical: 75 } },
  { id: "DS-N1", label: "Nose Deflection", type: "displacement", unit: "mm", position: [11.5, 1.0, 0], attachedTo: "nose-girder", thresholds: { warning: 10, critical: 13 } },
  { id: "DS-M1", label: "Mid Deflection", type: "displacement", unit: "mm", position: [0, 1.0, 0], attachedTo: "main-girder", thresholds: { warning: 10, critical: 13 } },
];
