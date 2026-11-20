import React from "react";
import { JOURNEY_STAGES } from "@/lib/journey";
import JourneyStageCard from "@/components/journey/JourneyStageCard";

export default function JourneyDiagram() {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white">Wireframe</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            One path from first idea to a build you can hand off — numbered in the order a customer walks it.
          </p>
        </div>
        <span className="text-[11px] text-slate-500">
          {JOURNEY_STAGES.length} stages · solid line = the main path
        </span>
      </div>

      <div>
        {JOURNEY_STAGES.map((stage, i) => (
          <JourneyStageCard
            key={stage.id}
            stage={stage}
            isLast={i === JOURNEY_STAGES.length - 1}
          />
        ))}
      </div>
    </div>
  );
}