import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COMPARE_ROWS, formatBriefDate, getBriefFreshness } from "@/lib/marketBriefs";

export default function BriefCompare({ briefs }) {
  if (briefs.length < 2) return null;

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-base sm:text-lg">Comparing {briefs.length} briefs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-800 bg-slate-900/80">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 sticky left-0 bg-slate-900/80">
                  Measure
                </th>
                {briefs.map((b) => {
                  const f = getBriefFreshness(b.researched_at);
                  return (
                    <th key={b.id} className="text-left px-4 py-3 min-w-[200px]">
                      <p className="text-white font-semibold break-words">{b.industry_name}</p>
                      <Badge className={`${f.tone} border text-[10px] mt-1.5`}>{f.label}</Badge>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-slate-800/70 last:border-0">
                  <td className="px-4 py-2.5 text-xs text-slate-500 sticky left-0 bg-slate-900/60 whitespace-nowrap">
                    {row.label}
                  </td>
                  {briefs.map((b) => (
                    <td key={b.id} className="px-4 py-2.5 text-slate-200 align-top break-words">
                      {row.get(b) || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-500 px-4 py-3 border-t border-slate-800">
          Figures are snapshots from each brief's research date —{" "}
          {briefs.map((b) => `${b.industry_name}: ${formatBriefDate(b.researched_at)}`).join(" · ")}
        </p>
      </CardContent>
    </Card>
  );
}