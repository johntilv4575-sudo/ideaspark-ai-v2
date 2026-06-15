import React from "react";
import { Lightbulb, FolderOpen, TrendingUp, Code, Globe } from "lucide-react";

export default function SummaryStatsBar({ totalConcepts, totalProjects, complexityBreakdown, potentialBreakdown, industryCount }) {
  const stats = [
    { label: "Total Concepts", value: totalConcepts, icon: Lightbulb, color: "text-blue-400", bg: "bg-blue-600/20" },
    { label: "Projects", value: totalProjects, icon: FolderOpen, color: "text-purple-400", bg: "bg-purple-600/20" },
    { label: "Industries", value: industryCount, icon: Globe, color: "text-emerald-400", bg: "bg-emerald-600/20" },
    { label: "High Potential", value: potentialBreakdown.large || 0, icon: TrendingUp, color: "text-pink-400", bg: "bg-pink-600/20" },
    { label: "Low Complexity", value: complexityBreakdown.low || 0, icon: Code, color: "text-green-400", bg: "bg-green-600/20" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
          <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <s.icon className={`w-5 h-5 ${s.color}`} />
          </div>
          <div>
            <p className="text-white text-xl font-bold leading-none">{s.value}</p>
            <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}