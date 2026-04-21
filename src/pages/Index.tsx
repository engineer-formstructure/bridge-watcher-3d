import { useState } from "react";
import { LauncherScene } from "@/features/launcher/LauncherScene";
import { SensorPanel } from "@/features/dashboard/SensorPanel";
import { StatusSummary } from "@/features/dashboard/StatusSummary";
import { useSensorStream } from "@/features/sensors/useSensorStream";

const Index = () => {
  const { sensors } = useSensorStream(800);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-screen flex-col gap-3 p-3">
      <StatusSummary sensors={sensors} />

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[1fr_360px]">
        <section className="panel relative min-h-0 overflow-hidden">
          {/* Corner HUD */}
          <div className="pointer-events-none absolute left-3 top-3 z-10 mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <div className="text-primary">◉ 3D VIEW · LIVE</div>
            <div>drag · rotate &nbsp; scroll · zoom &nbsp; right-drag · pan</div>
          </div>
          <div className="pointer-events-none absolute right-3 top-3 z-10 mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-right">
            <div>BL-A07 · LAUNCHER GIRDER</div>
            <div>{sensors.length} sensor nodes</div>
          </div>
          <LauncherScene sensors={sensors} selectedId={selectedId} onSelect={setSelectedId} />
        </section>

        <SensorPanel sensors={sensors} selectedId={selectedId} onSelect={setSelectedId} />
      </main>
    </div>
  );
};

export default Index;
