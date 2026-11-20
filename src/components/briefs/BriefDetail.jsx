import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { formatBriefDate, getBriefFreshness, parseBrief } from "@/lib/marketBriefs";

const Row = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-800/70 last:border-0">
    <span className="text-xs text-slate-500 shrink-0">{label}</span>
    <span className="text-sm text-slate-200 text-right break-words">{value || "—"}</span>
  </div>
);

const Block = ({ title, children }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
    <h4 className="text-sm font-semibold text-white mb-2">{title}</h4>
    {children}
  </div>
);

const List = ({ items }) =>
  items?.length ? (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-slate-300 flex gap-2">
          <span className="text-slate-600">•</span>
          <span className="break-words">{item}</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-slate-500">Not recorded</p>
  );

export default function BriefDetail({ record }) {
  const brief = parseBrief(record) || {};
  const freshness = getBriefFreshness(record.researched_at);
  const ms = brief.market_size || {};
  const cb = brief.consumer_behavior || {};
  const tt = brief.technology_trends || {};
  const cl = brief.competitive_landscape || {};
  const opp = brief.opportunities || {};
  const risks = brief.risks || {};
  const sr = brief.strategic_recommendations || {};

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={`${freshness.tone} border`}>{freshness.label}</Badge>
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" />
          Researched {formatBriefDate(record.researched_at)}
        </span>
      </div>
      <p className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
        This is a snapshot from {formatBriefDate(record.researched_at)}. Market figures move — re-run
        the brief if it looks out of date.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Block title="Market size & growth">
          <Row label="Current size" value={ms.current_size} />
          <Row label="Projected size" value={ms.projected_size} />
          <Row label="Projection year" value={ms.projection_year} />
          <Row label="CAGR" value={ms.cagr} />
          <Row label="Growth" value={ms.growth_level} />
          <Row label="Fastest region" value={ms.fastest_growth_region} />
        </Block>
        <Block title="Consumer behaviour">
          <List items={cb.top_priorities} />
          {cb.spending_trends && <p className="text-xs text-slate-400 mt-2">{cb.spending_trends}</p>}
        </Block>
        <Block title="Technology trends">
          <List items={tt.emerging_tech} />
          {tt.adoption_insights && <p className="text-xs text-slate-400 mt-2">{tt.adoption_insights}</p>}
        </Block>
        <Block title="Competitive landscape">
          <Row label="Saturation" value={cl.saturation_level} />
          <Row label="Average pricing" value={cl.average_pricing} />
          <List items={(cl.top_players || []).map((p) => `${p.name} — ${p.description || ""}`)} />
        </Block>
        <Block title="Opportunities">
          <List items={(opp.high_priority || []).map((o) => `${o.title} — ${o.description || ""}`)} />
        </Block>
        <Block title="Risks">
          <List items={(risks.critical || []).map((r) => `${r.risk} → ${r.mitigation || "no mitigation noted"}`)} />
        </Block>
        <Block title="Strategy">
          <Row label="Target market" value={sr.target_market} />
          <Row label="Monetization" value={sr.monetization_model} />
          <Row label="Go to market" value={sr.go_to_market} />
        </Block>
        <Block title="Feature gaps">
          <List items={cl.feature_gaps} />
        </Block>
      </div>
    </div>
  );
}