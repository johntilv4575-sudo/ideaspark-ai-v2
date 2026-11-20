// Builds the project/context header that gets applied to the Architect & Builder prompts.

export function buildContextBlock(context) {
  if (!context) return "";
  const { projectName, mainFeature, customContext } = context;
  return [
    projectName ? `**Project:** ${projectName}` : "",
    mainFeature ? `**Focus Area:** ${mainFeature}` : "",
    customContext ? `**Project Context:**\n${customContext}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function composePrompt(body, context) {
  const block = buildContextBlock(context);
  return block ? `${block}\n\n---\n\n${body}` : body;
}

// Turns a saved concept into a structured brief so the receiving AI
// works from the real concept rather than guessing.
export function buildConceptContext(project, concept) {
  const lines = [
    project?.title ? `Project: ${project.title}` : "",
    project?.industry ? `Industry: ${project.industry}` : "",
    concept.target_user ? `Target user: ${concept.target_user}` : "",
    concept.one_liner ? `One-liner: ${concept.one_liner}` : "",
    concept.core_solution ? `Core solution: ${concept.core_solution}` : "",
    (concept.target_pain_points || []).length
      ? `Pain points solved: ${concept.target_pain_points.join("; ")}`
      : "",
    (concept.key_features || []).length
      ? `Key features: ${concept.key_features.join("; ")}`
      : "",
    (concept.mvp_scope?.in_scope || []).length
      ? `In scope for MVP: ${concept.mvp_scope.in_scope.join("; ")}`
      : "",
    (concept.mvp_scope?.out_of_scope || []).length
      ? `Out of scope for MVP: ${concept.mvp_scope.out_of_scope.join("; ")}`
      : "",
    concept.differentiation ? `Differentiation: ${concept.differentiation}` : "",
    concept.competitive_advantage
      ? `Competitive advantage: ${concept.competitive_advantage}`
      : "",
    (concept.risks_assumptions || []).length
      ? `Risks & assumptions: ${concept.risks_assumptions.join("; ")}`
      : "",
    concept.development_complexity
      ? `Development complexity: ${concept.development_complexity}`
      : "",
    concept.market_potential ? `Market potential: ${concept.market_potential}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}