import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import { LauncherModel } from "./LauncherModel";
import { SensorMarkers } from "./SensorMarkers";
import type { SensorStatus, SensorWithReading } from "../sensors/types";

interface Props {
  sensors: SensorWithReading[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const STATUS_RANK: Record<SensorStatus, number> = { normal: 0, warning: 1, critical: 2, offline: 0 };

export function LauncherScene({ sensors, selectedId, onSelect }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const elementStatus = useMemo(() => {
    const map: Record<string, SensorStatus> = {};
    for (const s of sensors) {
      const cur = map[s.attachedTo];
      if (!cur || STATUS_RANK[s.reading.status] > STATUS_RANK[cur]) {
        map[s.attachedTo] = s.reading.status;
      }
    }
    return map;
  }, [sensors]);

  const highlightedElement = useMemo(() => {
    const id = hoveredId ?? selectedId;
    return id ? sensors.find((s) => s.id === id)?.attachedTo ?? null : null;
  }, [hoveredId, selectedId, sensors]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [22, 14, 22], fov: 42 }}
      onPointerMissed={() => onSelect(null)}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0b1018"]} />
      <fog attach="fog" args={["#0b1018", 35, 80]} />

      <ambientLight intensity={0.45} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-15, 10, -10]} intensity={0.35} color="#5fc7e8" />

      <Suspense fallback={null}>
        <Environment preset="city" />
        <LauncherModel elementStatus={elementStatus} highlightedElement={highlightedElement} />
        <SensorMarkers
          sensors={sensors}
          selectedId={selectedId}
          onSelect={onSelect}
          hoveredId={hoveredId}
          onHover={setHoveredId}
        />
      </Suspense>

      <Grid
        position={[0, -1.09, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1f2a38"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#2c8fae"
        fadeDistance={45}
        fadeStrength={1}
        infiniteGrid
      />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={8}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1, 0]}
      />
    </Canvas>
  );
}
