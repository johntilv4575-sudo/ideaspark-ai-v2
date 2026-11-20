import { base44 } from "@/api/base44Client";

/** A brief stays "current" for 90 days, gets a review warning until 180, then counts as out of date. */
export const FRESH_DAYS = 90;
export const AGING_DAYS = 180;

const slug = (text) => (text || "").toLowerCase().trim().replace(/\s+/g, "_");

export function getBriefFreshness(researchedAt) {
  const then = researchedAt ? new Date(researchedAt).getTime() : NaN;
  if (Number.isNaN(then)) {
    return {
      level: "out_of_date",
      label: "Date unknown",
      tone: "bg-red-500/15 text-red-300 border-red-500/30",
    };
  }
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= FRESH_DAYS) {
    return {
      level: "current",
      label: days <= 0 ? "Researched today" : `${days} day${days === 1 ? "" : "s"} old`,
      tone: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    };
  }
  if (days <= AGING_DAYS) {
    return {
      level: "aging",
      label: `Review — ${Math.round(days / 30)} months old`,
      tone: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    };
  }
  return {
    level: "out_of_date",
    label: `Out of date — ${Math.round(days / 30)} months old`,
    tone: "bg-red-500/15 text-red-300 border-red-500/30",
  };
}

export function formatBriefDate(researchedAt) {
  if (!researchedAt) return "Date unknown";
  return new Date(researchedAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function briefToSummary(brief) {
  return {
    current_size: brief?.market_size?.current_size || "",
    projected_size: brief?.market_size?.projected_size || "",
    projection_year: brief?.market_size?.projection_year || "",
    cagr: brief?.market_size?.cagr || "",
    growth_level: brief?.market_size?.growth_level || "",
    fastest_growth_region: brief?.market_size?.fastest_growth_region || "",
    saturation_level: brief?.competitive_landscape?.saturation_level || "",
    average_pricing: brief?.competitive_landscape?.average_pricing || "",
    target_market: brief?.strategic_recommendations?.target_market || "",
    monetization_model: brief?.strategic_recommendations?.monetization_model || "",
    go_to_market: brief?.strategic_recommendations?.go_to_market || "",
    spending_trends: brief?.consumer_behavior?.spending_trends || "",
    top_players: (brief?.competitive_landscape?.top_players || []).map((p) => p.name).filter(Boolean),
    feature_gaps: brief?.competitive_landscape?.feature_gaps || [],
    high_priority_opportunities: (brief?.opportunities?.high_priority || []).map((o) => o.title).filter(Boolean),
    top_priorities: brief?.consumer_behavior?.top_priorities || [],
    emerging_tech: brief?.technology_trends?.emerging_tech || [],
  };
}

function buildBriefPayload(brief, sourceQuery) {
  const name = brief?.industry_name || sourceQuery || "Untitled industry";
  return {
    industry_name: name,
    industry_key: slug(name),
    researched_at: new Date().toISOString(),
    source_query: sourceQuery || name,
    brief_json: JSON.stringify(brief || {}),
    summary: briefToSummary(brief),
  };
}

/** Saves a brief, replacing the previous saved brief for the same industry. */
export async function saveMarketBrief(brief, sourceQuery) {
  const payload = buildBriefPayload(brief, sourceQuery);
  const existing = await base44.entities.MarketBrief.filter(
    { industry_key: payload.industry_key },
    { sort: "-researched_at", limit: 1 }
  );
  const match = existing?.items?.[0];
  if (match) {
    return base44.entities.MarketBrief.update(match.id, payload);
  }
  return base44.entities.MarketBrief.create(payload);
}

export function parseBrief(record) {
  if (!record?.brief_json) return null;
  try {
    return JSON.parse(record.brief_json);
  } catch {
    return null;
  }
}

/** Maps a saved brief into the new-research form fields. */
export function briefToFormData(record, brief) {
  const data = brief || parseBrief(record) || {};
  return {
    title: record?.industry_name || data.industry_name || "",
    industry: record?.industry_key || "",
    description: `${data.market_size?.current_size || "N/A"} market growing at ${
      data.market_size?.cagr || "N/A"
    } CAGR. Key opportunities: ${
      (data.opportunities?.high_priority || []).slice(0, 2).map((o) => o.title).join(", ") || "N/A"
    }`,
    keywords: [
      ...(data.consumer_behavior?.top_priorities || []).slice(0, 3),
      ...(data.technology_trends?.emerging_tech || []).slice(0, 2),
    ]
      .filter(Boolean)
      .map((k) => k.toLowerCase()),
    competitor_apps: (data.competitive_landscape?.top_players || []).slice(0, 3).map((p) => p.name).filter(Boolean),
    target_demographics: data.strategic_recommendations?.target_market || "",
    geographic_focus: data.market_size?.fastest_growth_region || "global",
  };
}

/** Prompt block carrying a saved brief into concept generation, date included. */
export function briefContextText(record) {
  const brief = parseBrief(record);
  if (!brief) return "";
  const s = record.summary || briefToSummary(brief);
  const list = (items, prefix = "- ") =>
    (items || []).length ? items.map((i) => `${prefix}${i}`).join("\n") : "- None recorded";

  return `### Saved market brief — ${record.industry_name} (researched ${formatBriefDate(record.researched_at)})
This is a snapshot from ${formatBriefDate(record.researched_at)}. Treat it as background, not as confirmed current fact, and prefer the fresh research above where they disagree.

- Market size: ${s.current_size || "N/A"} → ${s.projected_size || "N/A"} (${s.projection_year || "N/A"})
- CAGR: ${s.cagr || "N/A"} · Growth: ${s.growth_level || "N/A"} · Competition: ${s.saturation_level || "N/A"}
- Average pricing: ${s.average_pricing || "N/A"}
- Target market: ${s.target_market || "N/A"} · Monetization: ${s.monetization_model || "N/A"}
- Top players: ${(s.top_players || []).join(", ") || "N/A"}

Consumer priorities:
${list(s.top_priorities)}

Feature gaps:
${list(s.feature_gaps)}

High-priority opportunities:
${list(s.high_priority_opportunities)}

Emerging technology:
${list(s.emerging_tech)}`;
}

/** Rows shown in the comparison view. */
export const COMPARE_ROWS = [
  { label: "Researched", get: (b) => formatBriefDate(b.researched_at) },
  { label: "Market size", get: (b) => b.summary?.current_size || "—" },
  { label: "Projected size", get: (b) => (b.summary?.projected_size ? `${b.summary.projected_size} (${b.summary.projection_year || "n/a"})` : "—") },
  { label: "CAGR", get: (b) => b.summary?.cagr || "—" },
  { label: "Growth", get: (b) => b.summary?.growth_level || "—" },
  { label: "Competition", get: (b) => b.summary?.saturation_level || "—" },
  { label: "Average pricing", get: (b) => b.summary?.average_pricing || "—" },
  { label: "Fastest region", get: (b) => b.summary?.fastest_growth_region || "—" },
  { label: "Target market", get: (b) => b.summary?.target_market || "—" },
  { label: "Monetization", get: (b) => b.summary?.monetization_model || "—" },
  { label: "Top players", get: (b) => (b.summary?.top_players || []).join(", ") || "—" },
  { label: "Feature gaps", get: (b) => (b.summary?.feature_gaps || []).slice(0, 3).join("; ") || "—" },
  { label: "Top opportunity", get: (b) => b.summary?.high_priority_opportunities?.[0] || "—" },
];