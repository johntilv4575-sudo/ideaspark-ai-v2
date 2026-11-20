import { base44 } from "@/api/base44Client";

export const CRITERIA = [
  {
    key: "demand",
    label: "Demand",
    question: "Do people already pay to solve this?",
    weight: 0.28
  },
  {
    key: "competition",
    label: "Competition & gap",
    question: "Is the market crowded, and is the gap real?",
    weight: 0.15
  },
  {
    key: "feasibility",
    label: "Build feasibility",
    question: "Can a small team ship the MVP?",
    weight: 0.15
  },
  {
    key: "money",
    label: "Money",
    question: "Will they pay, and can you price it?",
    weight: 0.27
  },
  {
    key: "reachability",
    label: "Reachability",
    question: "Can you find these buyers without a big budget?",
    weight: 0.15
  }
];

export const VERDICTS = {
  strong: {
    label: "Strong",
    meaning: "The evidence holds up. Worth building and selling.",
    tone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    bar: "bg-emerald-400"
  },
  promising: {
    label: "Promising",
    meaning: "Real opportunity, but key assumptions still need testing.",
    tone: "border-blue-500/40 bg-blue-500/10 text-blue-300",
    bar: "bg-blue-400"
  },
  needs_work: {
    label: "Needs work",
    meaning: "Fix the weak parts before you spend money building.",
    tone: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    bar: "bg-amber-400"
  },
  weak: {
    label: "Weak",
    meaning: "The evidence does not support building this yet.",
    tone: "border-rose-500/40 bg-rose-500/10 text-rose-300",
    bar: "bg-rose-400"
  }
};

export function verdictFor(score) {
  if (score >= 8) return "strong";
  if (score >= 6.5) return "promising";
  if (score >= 5) return "needs_work";
  return "weak";
}

const reportSchema = {
  type: "object",
  properties: {
    headline: { type: "string" },
    scores: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          score: { type: "number" },
          note: { type: "string" }
        },
        required: ["key", "score", "note"]
      }
    },
    proven: { type: "array", items: { type: "string" } },
    assumed: { type: "array", items: { type: "string" } },
    fatal_risks: {
      type: "array",
      items: {
        type: "object",
        properties: { risk: { type: "string" }, why: { type: "string" } },
        required: ["risk", "why"]
      }
    },
    tests: {
      type: "array",
      items: {
        type: "object",
        properties: {
          test: { type: "string" },
          how: { type: "string" },
          success_signal: { type: "string" },
          effort: { type: "string" }
        },
        required: ["test", "how", "success_signal", "effort"]
      }
    },
    how_to_sell: {
      type: "object",
      properties: {
        buyer: { type: "string" },
        price: { type: "string" },
        first_channel: { type: "string" }
      },
      required: ["buyer", "price", "first_channel"]
    },
    recommendation: { type: "string" }
  },
  required: ["headline", "scores", "proven", "assumed", "fatal_risks", "tests", "how_to_sell", "recommendation"]
};

function researchContext(project) {
  const painPoints = (project?.pain_points || [])
    .slice(0, 8)
    .map((p) => `- [${(p.severity || "").toUpperCase()}] ${p.issue}`)
    .join("\n");

  const competitors = (project?.competitor_insights || [])
    .slice(0, 5)
    .map(
      (c) =>
        `- ${c.app_name}: gaps = ${(c.improvement_opportunities || []).slice(0, 3).join("; ") || "none recorded"}`
    )
    .join("\n");

  const size = project?.market_trends?.market_size;
  const market = size
    ? `Market size: ${size.current_size || "unknown"} → ${size.projected_size || "unknown"} (${size.cagr || "n/a"} CAGR)`
    : "No market size saved";

  return `Market researched: ${project?.description || project?.title || "unknown"}
Industry: ${project?.industry || "general"}
Target users: ${project?.research_parameters?.target_demographics || "not specified"}
${market}

Pain points found:
${painPoints || "none saved"}

Competitors found:
${competitors || "none saved"}`;
}

/**
 * Scores one concept against the five things that decide whether an app sells,
 * and returns a plain-English validation report.
 */
export async function runConceptValidation(concept, project) {
  const criteriaText = CRITERIA.map(
    (c) => `- ${c.key} (${c.label}): ${c.question}`
  ).join("\n");

  const report = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a product validation analyst. Your job is honesty, not encouragement: tell the founder whether this app is worth building, and whether it can be sold.

THE CONCEPT
Name: ${concept.concept_name}
One-liner: ${concept.one_liner}
Target user: ${concept.target_user}
Solution: ${concept.core_solution}
Key features: ${(concept.key_features || []).join("; ")}
Differentiation: ${concept.differentiation}
Advantage: ${concept.competitive_advantage}
MVP in scope: ${(concept.mvp_scope?.in_scope || []).join("; ")}
Claimed complexity: ${concept.development_complexity}
Claimed market potential: ${concept.market_potential}

THE RESEARCH IT CAME FROM
${researchContext(project)}

TASK 1 — Score each criterion from 0 to 10, using this exact key:
${criteriaText}

Rules for scoring:
- Use real evidence where you can find it (pricing pages, review sites, market reports, app store data). Search if useful.
- If you cannot find evidence, say so in the note and score it down rather than guessing.
- 0-3 means the evidence argues against the concept, 4-6 means mixed or unknown, 7-8 means solid evidence, 9-10 means unusually strong.
- Each note is 1-2 plain-English sentences explaining the score, written to a non-technical founder.

TASK 2 — Fill in:
- headline: one sentence saying what this verdict means for them
- proven: 3-5 things the research genuinely supports
- assumed: 3-5 things the concept takes for granted with no evidence yet
- fatal_risks: 2-4 things that would sink it, each with why
- tests: 3 cheap tests to run before building, each with how to run it, the success signal to look for, and effort (e.g. "1 weekend", "2 hours", "under $100")
- how_to_sell: the buyer (who signs off), a realistic price, and the first channel to reach them
- recommendation: 3-4 sentences — build it, test it first, or drop it — and the reason.`,
    add_context_from_internet: true,
    response_json_schema: reportSchema
  });

  const scores = CRITERIA.map((c) => {
    const found = (report.scores || []).find((s) => s.key === c.key);
    return {
      key: c.key,
      label: c.label,
      score: Math.max(0, Math.min(10, Number(found?.score ?? 5))),
      note: found?.note || "No evidence found."
    };
  });

  const overall =
    Math.round(
      scores.reduce((sum, s, i) => sum + s.score * CRITERIA[i].weight, 0) * 10
    ) / 10;

  return {
    project_id: project?.id || "",
    project_title: project?.title || "",
    concept_index: project?.generated_concepts?.indexOf(concept) ?? 0,
    concept_name: concept.concept_name,
    one_liner: concept.one_liner || "",
    verdict: verdictFor(overall),
    overall_score: overall,
    headline: report.headline,
    scores,
    proven: report.proven || [],
    assumed: report.assumed || [],
    fatal_risks: report.fatal_risks || [],
    tests: report.tests || [],
    how_to_sell: report.how_to_sell || {},
    recommendation: report.recommendation,
    generated_at: new Date().toISOString()
  };
}