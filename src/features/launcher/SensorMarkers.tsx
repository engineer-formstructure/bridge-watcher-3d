import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { SensorWithReading } from "../sensors/types";
import { STATUS_COLOR } from "./LauncherModel";

interface Props {
  sensors: SensorWithReading[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}

function Marker({
  sensor,
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  sensor: SensorWithReading;
  selected: boolean;
  hovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const color = STATUS_COLOR[sensor.reading.status];

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.elapsedTime;
    const pulse = sensor.reading.status === "critical" ? 1 + Math.sin(t * 6) * 0.25 : sensor.reading.status === "warning" ? 1 + Math.sin(t * 3) * 0.12 : 1;
    const scale = (selected ? 1.4 : hovered ? 1.2 : 1) * pulse;
    ringRef.current.scale.setScalar(scale);
    ringRef.current.lookAt(state.camera.position);
  });

  return (
    <group position={sensor.position}>
      <mesh
        ref={ringRef}
        onClick={(e) => { e.stopPropagation(); onSelect(sensor.id); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(sensor.id); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { onHover(null); document.body.style.cursor = "default"; }}
      >
        <ringGeometry args={[0.18, 0.28, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {(selected || hovered) && (
        <Html
          position={[0, 0.5, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: "none" }}
        >
          <div className="mono whitespace-nowrap rounded-sm border border-border-strong bg-background/90 px-2 py-1 text-[10px] uppercase tracking-wider text-foreground shadow-md">
            <span style={{ color }}>●</span> {sensor.id} · {sensor.reading.value.toFixed(1)} {sensor.unit}
          </div>
        </Html>
      )}
    </group>
  );
}

export function SensorMarkers({ sensors, selectedId, onSelect, hoveredId, onHover }: Props) {
  return (
    <>
      {sensors.map((s) => (
        <Marker
          key={s.id}
          sensor={s}
          selected={selectedId === s.id}
          hovered={hoveredId === s.id}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </>
  );
}
