import { base44 } from "@/api/base44Client";
import { INDUSTRIES } from "@/lib/industries";

export const MASTER_STEPS = [
  { key: "brief", label: "Reading your prompt and defining the market" },
  { key: "competitors", label: "Competitors and user personas" },
  { key: "concepts", label: "Generating app concepts" },
  { key: "market", label: "Market snapshot and strategy" }
];

const industryList = INDUSTRIES.map((i) => `${i.value} (${i.label})`).join(", ");

const briefSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    industry_id: { type: "string" },
    description: { type: "string" },
    target_demographics: { type: "string" },
    geographic_focus: { type: "string" },
    keywords: { type: "array", items: { type: "string" } },
    competitor_apps: { type: "array", items: { type: "string" } },
    pain_points: {
      type: "array",
      items: {
        type: "object",
        properties: {
          issue: { type: "string" },
          frequency: { type: "number" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          source_examples: { type: "array", items: { type: "string" } }
        },
        required: ["issue", "frequency", "severity", "source_examples"]
      }
    }
  },
  required: [
    "title",
    "industry_id",
    "description",
    "target_demographics",
    "geographic_focus",
    "keywords",
    "competitor_apps",
    "pain_points"
  ]
};

const competitorsSchema = {
  type: "object",
  properties: {
    competitors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          app_name: { type: "string" },
          successful_features: { type: "array", items: { type: "string" } },
          user_praise: { type: "array", items: { type: "string" } },
          improvement_opportunities: { type: "array", items: { type: "string" } }
        },
        required: ["app_name", "successful_features", "user_praise", "improvement_opportunities"]
      }
    },
    personas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
          location: { type: "string" },
          occupation: { type: "string" },
          background: { type: "string" },
          goals: { type: "array", items: { type: "string" } },
          frustrations: { type: "array", items: { type: "string" } },
          tech_savviness: { type: "string", enum: ["low", "medium", "high"] },
          devices: { type: "array", items: { type: "string" } },
          quote: { type: "string" },
          behavior: { type: "string" }
        },
        required: ["name", "occupation", "goals", "frustrations", "quote"]
      }
    }
  },
  required: ["competitors", "personas"]
};

const conceptsSchema = {
  type: "object",
  properties: {
    app_concepts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          concept_name: { type: "string" },
          one_liner: { type: "string" },
          target_user: { type: "string" },
          core_solution: { type: "string" },
          target_pain_points: { type: "array", items: { type: "string" } },
          proposed_solution_sources: { type: "array", items: { type: "string" } },
          key_features: { type: "array", items: { type: "string" } },
          differentiation: { type: "string" },
          competitive_advantage: { type: "string" },
          mvp_scope: {
            type: "object",
            properties: {
              in_scope: { type: "array", items: { type: "string" } },
              out_of_scope: { type: "array", items: { type: "string" } }
            }
          },
          risks_assumptions: { type: "array", items: { type: "string" } },
          validation_plan: { type: "array", items: { type: "string" } },
          development_complexity: { type: "string", enum: ["low", "medium", "high"] },
          market_potential: { type: "string", enum: ["niche", "moderate", "large"] }
        },
        required: [
          "concept_name",
          "one_liner",
          "target_user",
          "core_solution",
          "target_pain_points",
          "proposed_solution_sources",
          "key_features",
          "differentiation",
          "competitive_advantage",
          "mvp_scope",
          "risks_assumptions",
          "validation_plan",
          "development_complexity",
          "market_potential"
        ]
      }
    }
  },
  required: ["app_concepts"]
};

const marketSchema = {
  type: "object",
  properties: {
    market_size: {
      type: "object",
      properties: {
        current_size: { type: "string" },
        projected_size: { type: "string" },
        projection_year: { type: "string" },
        cagr: { type: "string" },
        growth_level: { type: "string" },
        regional_leaders: { type: "array", items: { type: "string" } },
        fastest_growth_region: { type: "string" },
        confidence: { type: "string" }
      }
    },
    consumer_behavior: {
      type: "object",
      properties: {
        top_priorities: { type: "array", items: { type: "string" } },
        spending_trends: { type: "string" },
        demographic_shifts: { type: "array", items: { type: "string" } }
      }
    },
    technology_trends: {
      type: "object",
      properties: {
        emerging_tech: { type: "array", items: { type: "string" } },
        required_features: { type: "array", items: { type: "string" } },
        adoption_insights: { type: "string" }
      }
    },
    competitive_landscape: {
      type: "object",
      properties: {
        saturation_level: { type: "string" },
        top_players: {
          type: "array",
          items: {
            type: "object",
            properties: { name: { type: "string" }, description: { type: "string" } }
          }
        },
        average_pricing: { type: "string" },
        feature_gaps: { type: "array", items: { type: "string" } }
      }
    },
    opportunities: {
      type: "object",
      properties: {
        high_priority: {
          type: "array",
          items: {
            type: "object",
            properties: { title: { type: "string" }, description: { type: "string" } }
          }
        },
        moderate_priority: {
          type: "array",
          items: {
            type: "object",
            properties: { title: { type: "string" }, description: { type: "string" } }
          }
        }
      }
    },
    risks: {
      type: "object",
      properties: {
        critical: {
          type: "array",
          items: {
            type: "object",
            properties: { risk: { type: "string" }, mitigation: { type: "string" } }
          }
        },
        moderate: {
          type: "array",
          items: {
            type: "object",
            properties: { risk: { type: "string" }, mitigation: { type: "string" } }
          }
        }
      }
    },
    strategic_recommendations: {
      type: "object",
      properties: {
        target_market: { type: "string" },
        core_differentiators: { type: "array", items: { type: "string" } },
        monetization_model: { type: "string" },
        tech_stack_suggestions: { type: "array", items: { type: "string" } },
        go_to_market: { type: "string" }
      }
    }
  },
  required: ["market_size", "competitive_landscape", "opportunities", "strategic_recommendations"]
};

/**
 * Turns one free-form prompt into a fully populated research project payload.
 * onStep(key, status) where status is "running" | "done" | "error".
 */
export async function runMasterPrompt(userPrompt, onStep = () => {}) {
  const prompt = userPrompt.trim();

  // 1. Project brief + pain points
  onStep("brief", "running");
  const brief = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a market researcher preparing a complete research project from a founder's own brief.

THE FOUNDER'S BRIEF:
"""
${prompt}
"""

From this brief, define the project and research the market it describes.

Return:
- title: a short project name (3-6 words) describing the market being researched
- industry_id: the single best-fitting id from this list: ${industryList}
- description: 2-3 sentences describing the exact market and problem space
- target_demographics: the specific people or businesses who have this problem
- geographic_focus: e.g. "global", "Australia", "United States"
- keywords: 5-8 search terms a researcher would use for this market
- competitor_apps: up to 5 named products or companies that already serve this market
- pain_points: the 10 most common real frustrations in this market, each with an estimated frequency (1-100), a severity, and 1-2 example quotes or sources. Use real market evidence where you can find it; never invent statistics.

The brief is the primary source of intent — research the market it points at, not the words it happens to use.`,
    add_context_from_internet: true,
    response_json_schema: briefSchema
  });
  onStep("brief", "done");

  const industry = INDUSTRIES.find((i) => i.value === brief.industry_id);
  const painPointSummary = (brief.pain_points || [])
    .map((p, i) => `${i + 1}. [${(p.severity || "").toUpperCase()}] ${p.issue} (freq: ${p.frequency})`)
    .join("\n");

  // 2. Competitors + personas
  onStep("competitors", "running");
  const competition = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a competitive intelligence analyst and UX researcher.

MARKET: ${brief.description}
Industry: ${industry ? industry.label : brief.industry_id}
Target users: ${brief.target_demographics}
Geographic focus: ${brief.geographic_focus}
${brief.competitor_apps?.length ? `Known competitors to include: ${brief.competitor_apps.join(", ")}` : ""}

PAIN POINTS ALREADY FOUND:
${painPointSummary}

Tasks:
1. Return the top 5 DIRECT competitors in this exact market (not generic tools). For each: successful features, what users praise in real reviews, and the gaps or weaknesses to exploit.
2. Return 3 personas built from the pain points above: realistic people who experience them, with goals, frustrations, tech savviness, devices, a quote in their own voice, and typical behaviour.`,
    add_context_from_internet: true,
    response_json_schema: competitorsSchema
  });
  onStep("competitors", "done");

  const competitorNames = (competition.competitors || []).map((c) => c.app_name).join(", ") || "N/A";
  const competitorStrengths = (competition.competitors || []).flatMap((c) =>
    (c.successful_features || []).slice(0, 3).map((f) => `${c.app_name}: ${f}`)
  );
  const competitorWeaknesses = (competition.competitors || []).flatMap((c) =>
    (c.improvement_opportunities || []).slice(0, 2)
  );

  // 3. Concepts
  onStep("concepts", "running");
  const concepts = await base44.integrations.Core.InvokeLLM({
    prompt: `You are "Idea Spark" — a product strategist. Generate app concepts that trace back to explicit research evidence.

### Pain points (every concept must address at least 2, using exact text):
${painPointSummary}

### Audience:
Market: ${brief.description}
Target users: ${brief.target_demographics}
Geographic focus: ${brief.geographic_focus}

### Competitors (${competitorNames})
Strengths to match or exceed:
${competitorStrengths.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Gaps to exploit:
${competitorWeaknesses.map((w, i) => `${i + 1}. ${w}`).join("\n")}

### Rules
- Each concept must reference at least 2 pain points with their exact wording.
- Each must solve a specific competitor gap.
- "proposed_solution_sources" must cite the exact research findings that inspired it.
- Prefer concrete, practical solutions over startup language.

Generate exactly 5 concepts with every field: name, one-liner, target user, core solution, target pain points, sources, 5-7 key features, differentiation, advantage, MVP scope, risks, 3 validation tests, complexity, market potential.`,
    response_json_schema: conceptsSchema
  });
  onStep("concepts", "done");

  // 4. Market snapshot
  onStep("market", "running");
  const market = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a market analyst. Build a market snapshot for this specific market.

MARKET: ${brief.description}
Industry: ${industry ? industry.label : brief.industry_id}
Target users: ${brief.target_demographics}
Geographic focus: ${brief.geographic_focus}

Cover market size (current and projected with year and CAGR, mark confidence honestly), consumer priorities and spending trends, technology trends and expected features, competitive saturation with top players and pricing, feature gaps, high and moderate priority opportunities, critical and moderate risks with mitigations, and strategic recommendations (target market, differentiators, monetization, tech stack, go-to-market).

Use real, current information where available. If a figure is uncertain, say so in the text rather than inventing a precise number.`,
    add_context_from_internet: true,
    response_json_schema: marketSchema
  });
  onStep("market", "done");

  return {
    title: brief.title,
    industry: brief.industry_id || "other",
    description: brief.description,
    status: "completed",
    research_parameters: {
      keywords: brief.keywords || [],
      competitor_apps: brief.competitor_apps || [],
      target_demographics: brief.target_demographics || "",
      geographic_focus: brief.geographic_focus || "global"
    },
    pain_points: brief.pain_points || [],
    competitor_insights: competition.competitors || [],
    generated_personas: competition.personas || [],
    generated_concepts: concepts.app_concepts || [],
    market_trends: {
      ...market,
      industry_name: industry ? industry.label : brief.industry_id,
      researched_at: new Date().toISOString()
    }
  };
}