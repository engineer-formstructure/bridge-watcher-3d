import { useMemo } from "react";
import * as THREE from "three";
import type { SensorStatus } from "../sensors/types";

const STATUS_COLOR: Record<SensorStatus, string> = {
  normal: "#22c39a",
  warning: "#f5a623",
  critical: "#ef3b56",
  offline: "#6b7280",
};

interface Props {
  elementStatus: Record<string, SensorStatus>;
  highlightedElement?: string | null;
}

function statusEmissive(s: SensorStatus | undefined): THREE.Color {
  if (!s || s === "normal") return new THREE.Color("#0a1a18");
  if (s === "warning") return new THREE.Color("#3a2806");
  if (s === "critical") return new THREE.Color("#3a0a14");
  return new THREE.Color("#101418");
}

function Truss({ length = 18, height = 1.2, segments = 12, y = 1.4, color, emissive }: { length?: number; height?: number; segments?: number; y?: number; color: string; emissive: THREE.Color; }) {
  const half = length / 2;
  const step = length / segments;
  const beams = useMemo(() => {
    const arr: { pos: [number, number, number]; size: [number, number, number] }[] = [];
    // top and bottom chords (both sides z = ±0.7)
    for (const z of [-0.7, 0.7]) {
      arr.push({ pos: [0, y + height / 2, z], size: [length, 0.12, 0.12] });
      arr.push({ pos: [0, y - height / 2, z], size: [length, 0.12, 0.12] });
    }
    // verticals + diagonals
    for (let i = 0; i <= segments; i++) {
      const x = -half + i * step;
      for (const z of [-0.7, 0.7]) {
        arr.push({ pos: [x, y, z], size: [0.08, height, 0.08] });
      }
    }
    // cross braces top
    for (let i = 0; i < segments; i++) {
      const x = -half + i * step + step / 2;
      arr.push({ pos: [x, y + height / 2, 0], size: [step * 0.95, 0.06, 1.4] });
    }
    return arr;
  }, [length, height, segments, y]);

  return (
    <group>
      {beams.map((b, i) => (
        <mesh key={i} position={b.pos as any} castShadow receiveShadow>
          <boxGeometry args={b.size as any} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.6} metalness={0.6} roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

export function LauncherModel({ elementStatus, highlightedElement }: Props) {
  const baseColor = "#9aa6b2";

  const isHL = (id: string) => highlightedElement === id;

  return (
    <group>
      {/* Ground / bridge deck */}
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <boxGeometry args={[40, 0.2, 6]} />
        <meshStandardMaterial color="#1a2230" metalness={0.2} roughness={0.9} />
      </mesh>
      {/* Pier columns (existing piers) */}
      {[-12, -4, 4, 12].map((x) => (
        <mesh key={x} position={[x, -3, 0]}>
          <boxGeometry args={[1.2, 3.6, 1.2]} />
          <meshStandardMaterial color="#2a3340" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}

      {/* Main girder (longest truss) */}
      <group>
        <Truss
          length={18}
          height={1.4}
          segments={14}
          y={1.4}
          color={isHL("main-girder") ? "#cfeefe" : baseColor}
          emissive={statusEmissive(elementStatus["main-girder"])}
        />
      </group>

      {/* Nose girder (front, lighter) */}
      <group position={[12, 0, 0]}>
        <Truss
          length={6}
          height={1.0}
          segments={6}
          y={1.6}
          color={isHL("nose-girder") ? "#cfeefe" : "#b8c2cd"}
          emissive={statusEmissive(elementStatus["nose-girder"])}
        />
      </group>

      {/* Front support leg */}
      <group position={[6.5, 0, 0]}>
        {[-1.4, 1.4].map((z) => (
          <mesh key={z} position={[0, -0.4, z]}>
            <boxGeometry args={[0.5, 1.8, 0.5]} />
            <meshStandardMaterial
              color={isHL("front-support") ? "#cfeefe" : "#8a96a3"}
              emissive={statusEmissive(elementStatus["front-support"])}
              emissiveIntensity={0.6}
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
        ))}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.6, 0.2, 3.2]} />
          <meshStandardMaterial color="#8a96a3" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>

      {/* Rear support leg */}
      <group position={[-6.5, 0, 0]}>
        {[-1.4, 1.4].map((z) => (
          <mesh key={z} position={[0, -0.4, z]}>
            <boxGeometry args={[0.5, 1.8, 0.5]} />
            <meshStandardMaterial
              color={isHL("rear-support") ? "#cfeefe" : "#8a96a3"}
              emissive={statusEmissive(elementStatus["rear-support"])}
              emissiveIntensity={0.6}
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
        ))}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[0.6, 0.2, 3.2]} />
          <meshStandardMaterial color="#8a96a3" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>

      {/* Winch trolleys on top rail */}
      {[3.2, -2.4].map((x) => (
        <group key={x} position={[x, 2.4, 0]}>
          <mesh>
            <boxGeometry args={[1.6, 0.5, 1.8]} />
            <meshStandardMaterial
              color={isHL("winch-trolley") ? "#cfeefe" : "#c7d1dc"}
              emissive={statusEmissive(elementStatus["winch-trolley"])}
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1.4, 8]} />
            <meshStandardMaterial color="#3b4654" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export { STATUS_COLOR };
