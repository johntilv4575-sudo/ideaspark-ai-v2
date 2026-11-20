import React from "react";
import { format } from "date-fns";
import { VERDICTS } from "@/lib/validation";
import { cn } from "@/lib/utils";

export default function ValidationCard({ validation, isActive, onClick }) {
  const verdict = VERDICTS[validation.verdict] || VERDICTS.promising;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-3 transition-colors",
        isActive
          ? "border-purple-500/60 bg-slate-800"
          : "border-slate-700 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{validation.concept_name}</p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            {validation.project_title}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className={cn("text-[11px] font-bold rounded-full border px-2 py-0.5", verdict.tone)}>
            {verdict.label}
          </span>
          <p className="text-xs text-slate-400 mt-1">{validation.overall_score}/10</p>
        </div>
      </div>
      {validation.generated_at && (
        <p className="text-[10px] text-slate-500 mt-2">
          {format(new Date(validation.generated_at), "d MMM yyyy")}
        </p>
      )}
    </button>
  );
}