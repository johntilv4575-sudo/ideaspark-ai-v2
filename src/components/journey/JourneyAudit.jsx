import React from "react";
import { JOURNEY_CONNECTIONS } from "@/lib/journey";
import { CheckCircle2, PlusCircle, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS = {
  works: {
    label: "Works",
    icon: CheckCircle2,
    tone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  added: {
    label: "Added",
    icon: PlusCircle,
    tone: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  },
  fixed: {
    label: "Repaired",
    icon: Wrench,
    tone: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  },
};

function StatusBadge({ status }) {
  const meta = STATUS[status] || STATUS.works;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-semibold rounded-full border px-2 py-0.5 whitespace-nowrap",
        meta.tone
      )}
    >
      <meta.icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

export default function JourneyAudit() {
  const counts = JOURNEY_CONNECTIONS.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">Connection audit</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Every step-to-step connection, what it carries, and whether it worked before this pass.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <StatusBadge status="works" />
          <span className="text-[11px] text-slate-500 self-center">{counts.works || 0} connections</span>
          <StatusBadge status="added" />
          <span className="text-[11px] text-slate-500 self-center">{counts.added || 0} connections</span>
          <StatusBadge status="fixed" />
          <span className="text-[11px] text-slate-500 self-center">{counts.fixed || 0} connection</span>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-500 uppercase tracking-wide text-[10px]">
              <th className="py-2 pr-3 font-semibold">From</th>
              <th className="py-2 pr-3 font-semibold">To</th>
              <th className="py-2 pr-3 font-semibold">Trigger</th>
              <th className="py-2 pr-3 font-semibold">Carries</th>
              <th className="py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {JOURNEY_CONNECTIONS.map((c, i) => (
              <tr key={i} className="border-t border-slate-800 align-top">
                <td className="py-2.5 pr-3 text-slate-300 font-medium">{c.from}</td>
                <td className="py-2.5 pr-3 text-white font-semibold">{c.to}</td>
                <td className="py-2.5 pr-3 text-slate-400">{c.trigger}</td>
                <td className="py-2.5 pr-3 text-slate-400">{c.carries}</td>
                <td className="py-2.5">
                  <StatusBadge status={c.status} />
                  {c.detail && <p className="text-[11px] text-slate-500 mt-1 max-w-xs">{c.detail}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {JOURNEY_CONNECTIONS.map((c, i) => (
          <div key={i} className="rounded-xl border border-slate-700 bg-slate-800/40 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-slate-300">
                {c.from} <span className="text-slate-500">→</span>{" "}
                <span className="text-white font-semibold">{c.to}</span>
              </p>
              <StatusBadge status={c.status} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Trigger: {c.trigger}</p>
            <p className="text-[11px] text-slate-400">Carries: {c.carries}</p>
            {c.detail && <p className="text-[11px] text-slate-500 mt-1">{c.detail}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}