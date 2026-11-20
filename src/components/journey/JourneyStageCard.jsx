import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CornerDownRight, Split } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JourneyStageCard({ stage, isLast }) {
  return (
    <div className="relative pl-12 sm:pl-16">
      <div className="absolute left-0 top-1 flex flex-col items-center">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-blue-500/20">
          {stage.step}
        </div>
        {!isLast && <div className="w-px flex-1 min-h-[40px] bg-slate-700 mt-2" />}
      </div>

      <div className="card-secondary p-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white">{stage.title}</h3>
          <code className="text-[11px] text-purple-300 bg-slate-900/60 border border-slate-700 rounded px-2 py-0.5">
            {stage.page}
          </code>
        </div>

        <p className="text-xs text-slate-400 mt-1.5">{stage.does}</p>

        <div className="grid sm:grid-cols-2 gap-2 mt-3">
          <div className="rounded-lg bg-slate-900/40 border border-slate-700/60 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Leaves with</p>
            <p className="text-xs text-emerald-300 mt-0.5">{stage.produces}</p>
          </div>
          <div className="rounded-lg bg-slate-900/40 border border-slate-700/60 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Passes forward</p>
            <p className="text-xs text-slate-300 mt-0.5">{stage.carries}</p>
          </div>
        </div>

        {stage.branch && (
          <p className="text-[11px] text-amber-300/90 mt-2 flex items-start gap-1.5">
            <Split className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            {stage.branch}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-700/60">
          {stage.openTo ? (
            <Link
              to={stage.openTo}
              className="text-xs font-semibold text-blue-300 hover:text-blue-200 inline-flex items-center gap-1"
            >
              {stage.openLabel}
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <span className="text-xs text-slate-500">Outside this app</span>
          )}
          {stage.back && (
            <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
              <CornerDownRight className="w-3 h-3 rotate-180" />
              back to {stage.back}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}