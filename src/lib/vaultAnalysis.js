import { base44 } from "@/api/base44Client";

export function getProjectForDocument(document, projects) {
  if (!document?.project_id || document.project_id === "none") return null;
  return (projects || []).find((p) => p.id === document.project_id) || null;
}

function baselineConcept(project) {
  return project?.generated_concepts?.[0] || null;
}

function baselineText(concept) {
  return [
    `Concept name: ${concept.concept_name || "Untitled"}`,
    concept.one_liner ? `One liner: ${concept.one_liner}` : "",
    concept.target_user ? `Target user: ${concept.target_user}` : "",
    concept.core_solution ? `Core solution: ${concept.core_solution}` : "",
    concept.target_pain_points?.length
      ? `Pain points addressed: ${concept.target_pain_points.join("; ")}`
      : "",
    concept.key_features?.length ? `Key features: ${concept.key_features.join("; ")}` : "",
    concept.mvp_scope?.in_scope?.length
      ? `MVP in scope: ${concept.mvp_scope.in_scope.join("; ")}`
      : "",
    concept.differentiation ? `Differentiation: ${concept.differentiation}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function analyzeDocument(document, project) {
  const concept = baselineConcept(project);
  const painPointsList = (project?.pain_points || []).map((p) => p.issue).join(", ");

  const prompt = `You are reviewing research material for an app project.

## Document (category: "${document.category}")
"""
${document.raw_text?.substring(0, 4000) || "No text content available"}
"""

${painPointsList ? `## Existing project pain points\n${painPointsList}` : "## Existing project pain points\nNone recorded yet."}

${
  concept
    ? `## Original concept (the baseline to compare against)\n${baselineText(concept)}`
    : "## Original concept\nNo concept has been generated for this project yet, so there is no baseline to compare against."
}

## Task 1 — Extract insights
Extract 3-8 key insights from the document. For each insight give:
1. insight — concise, actionable text
2. type — pain_point, opportunity, user_need, competitor_info or trend
3. severity — low, medium or high
4. matched_pain_point — the exact existing pain point text it supports, or an empty string

## Task 2 — App review suggestions
Compare the document's findings with the original concept${
    concept
      ? ""
      : " (none available — base the review on the document and the project description alone)"
  }. Look for drift: places where the evidence now points somewhere different from the concept — for example the target audience has changed but the UI, features or messaging were not updated, or a claimed pain point is no longer supported.
Return:
- summary — 2-3 sentences on how well the concept still matches the evidence
- suggestions — 3-6 items, each with:
  - area — the part of the app it touches, e.g. "Target audience", "UI & experience", "Core solution", "Features & scope", "Messaging", "Differentiation"
  - finding — what the document shows
  - suggestion — a concrete change worth reviewing
  - severity — low, medium or high

Only suggest changes. Never rewrite the concept.`;

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    model: "gemini_3_flash",
    response_json_schema: {
      type: "object",
      properties: {
        insights: {
          type: "array",
          items: {
            type: "object",
            properties: {
              insight: { type: "string" },
              type: { type: "string" },
              severity: { type: "string" },
              matched_pain_point: { type: "string" },
            },
          },
        },
        summary: { type: "string" },
        suggestions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              area: { type: "string" },
              finding: { type: "string" },
              suggestion: { type: "string" },
              severity: { type: "string" },
            },
          },
        },
      },
    },
  });

  const insights = result?.insights || [];
  const app_review = {
    generated_at: new Date().toISOString(),
    concept_name: concept?.concept_name || "",
    baseline_used: !!concept,
    baseline_note: concept
      ? `Compared against "${concept.concept_name}"`
      : "No concept generated for this project yet — review based on the document alone.",
    summary: result?.summary || "",
    suggestions: result?.suggestions || [],
  };

  return { insights, app_review };
}

export async function analyzeAndSave(document, project) {
  const result = await analyzeDocument(document, project);
  await base44.entities.VaultDocument.update(document.id, {
    extracted_insights: result.insights,
    app_review: result.app_review,
    status: "analyzed",
  });
  return result;
}