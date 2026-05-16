import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Paginate through ALL projects
    let allProjects = [];
    let page = 0;
    const pageSize = 50;
    while (true) {
      const batch = await base44.entities.ResearchProject.list('-created_date', pageSize, page * pageSize);
      if (!batch || batch.length === 0) break;
      allProjects = allProjects.concat(batch);
      if (batch.length < pageSize) break;
      page++;
    }

    const body = await req.json().catch(() => ({}));
    const format = body.format || 'text';

    if (format === 'json') {
      return Response.json(buildJsonExport(allProjects, user));
    }

    return new Response(buildTextExport(allProjects, user), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="IdeaSpark_Full_Export.txt"'
      }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ─── JSON EXPORT ───
function buildJsonExport(projects, user) {
  const researchProjects = [];
  const painPoints = [];
  const appConcepts = [];
  const userPersonas = [];
  const competitorInsights = [];
  const prompts = [];

  let conceptNum = 0;
  let personaNum = 0;
  let painPointNum = 0;
  let competitorNum = 0;

  for (const p of projects) {
    researchProjects.push({
      id: p.id,
      title: p.title,
      industry: p.industry || 'General',
      status: p.status,
      description: p.description || '',
      total_concepts: (p.generated_concepts || []).length,
      total_pain_points: (p.pain_points || []).length,
      total_personas: (p.generated_personas || []).length,
      total_competitors: (p.competitor_insights || []).length,
      created_date: p.created_date
    });

    for (const pp of (p.pain_points || [])) {
      painPointNum++;
      painPoints.push({ id: painPointNum, project_title: p.title, project_id: p.id, ...pp });
    }

    for (const c of (p.generated_concepts || [])) {
      conceptNum++;
      appConcepts.push({ id: conceptNum, project_title: p.title, project_id: p.id, ...c });
      prompts.push({
        concept_id: conceptNum,
        concept_name: c.concept_name,
        project_title: p.title,
        architect_prompt: buildArchitectPrompt(c, p),
        builder_prompt: buildBuilderPrompt(c, p)
      });
    }

    for (const persona of (p.generated_personas || [])) {
      personaNum++;
      userPersonas.push({ id: personaNum, project_title: p.title, project_id: p.id, ...persona });
    }

    for (const ci of (p.competitor_insights || [])) {
      competitorNum++;
      competitorInsights.push({ id: competitorNum, project_title: p.title, project_id: p.id, ...ci });
    }
  }

  return {
    exported_at: new Date().toISOString(),
    exported_by: user.full_name || user.email,
    summary: {
      total_projects: researchProjects.length,
      total_pain_points: painPoints.length,
      total_concepts: appConcepts.length,
      total_personas: userPersonas.length,
      total_competitors: competitorInsights.length,
      total_prompts: prompts.length
    },
    research_projects: researchProjects,
    pain_points: painPoints,
    app_concepts: appConcepts,
    user_personas: userPersonas,
    competitor_insights: competitorInsights,
    prompts
  };
}

// ─── TEXT EXPORT ───
function buildTextExport(projects, user) {
  const sep = '═'.repeat(80);
  const thinSep = '─'.repeat(80);
  let out = '';

  out += sep + '\n';
  out += '  IDEA SPARK — COMPLETE ORGANISED EXPORT\n';
  out += `  Exported: ${new Date().toISOString()}\n`;
  out += `  User: ${user.full_name || user.email}\n`;
  out += sep + '\n\n';

  // Collect all data into tables
  const painPoints = [];
  const appConcepts = [];
  const userPersonas = [];
  const competitorInsights = [];
  const promptEntries = [];

  let cNum = 0, ppNum = 0, perNum = 0, ciNum = 0;

  for (const p of projects) {
    for (const pp of (p.pain_points || [])) {
      ppNum++;
      painPoints.push({ num: ppNum, project: p.title, ...pp });
    }
    for (const c of (p.generated_concepts || [])) {
      cNum++;
      appConcepts.push({ num: cNum, project: p.title, industry: p.industry || 'General', ...c });
      promptEntries.push({ num: cNum, concept_name: c.concept_name, project: p.title, concept: c, projectData: p });
    }
    for (const persona of (p.generated_personas || [])) {
      perNum++;
      userPersonas.push({ num: perNum, project: p.title, ...persona });
    }
    for (const ci of (p.competitor_insights || [])) {
      ciNum++;
      competitorInsights.push({ num: ciNum, project: p.title, ...ci });
    }
  }

  // ──────────────────────────────────────────
  // TABLE 1: RESEARCH PROJECTS
  // ──────────────────────────────────────────
  out += sep + '\n';
  out += '  TABLE 1: RESEARCH PROJECTS\n';
  out += `  Total: ${projects.length} projects\n`;
  out += sep + '\n\n';

  for (const p of projects) {
    out += `  #${projects.indexOf(p) + 1}  ${p.title}\n`;
    out += `      Industry: ${p.industry || 'General'}  |  Status: ${p.status}\n`;
    out += `      Description: ${p.description || 'N/A'}\n`;
    out += `      Concepts: ${(p.generated_concepts || []).length}  |  Pain Points: ${(p.pain_points || []).length}  |  Personas: ${(p.generated_personas || []).length}  |  Competitors: ${(p.competitor_insights || []).length}\n`;
    if (p.research_parameters) {
      const rp = p.research_parameters;
      if (rp.keywords?.length) out += `      Keywords: ${rp.keywords.join(', ')}\n`;
      if (rp.competitor_apps?.length) out += `      Competitor Apps: ${rp.competitor_apps.join(', ')}\n`;
      if (rp.target_demographics) out += `      Demographics: ${rp.target_demographics}\n`;
      if (rp.geographic_focus) out += `      Geographic Focus: ${rp.geographic_focus}\n`;
    }
    out += '\n';
  }

  // ──────────────────────────────────────────
  // TABLE 2: PAIN POINTS
  // ──────────────────────────────────────────
  out += '\n' + sep + '\n';
  out += '  TABLE 2: PAIN POINTS\n';
  out += `  Total: ${painPoints.length} pain points\n`;
  out += sep + '\n\n';

  if (painPoints.length === 0) {
    out += '  (No pain points recorded)\n\n';
  } else {
    let currentProject = '';
    for (const pp of painPoints) {
      if (pp.project !== currentProject) {
        currentProject = pp.project;
        out += `\n  ┌── PROJECT: ${currentProject}\n`;
      }
      out += `  │  #${pp.num}  ${pp.issue || 'N/A'}\n`;
      out += `  │      Severity: ${pp.severity || 'N/A'}  |  Frequency: ${pp.frequency || 'N/A'}\n`;
      if (pp.source_examples?.length) {
        out += `  │      Sources: ${pp.source_examples.join(' | ')}\n`;
      }
    }
    out += '  └──\n';
  }

  // ──────────────────────────────────────────
  // TABLE 3: APP CONCEPTS
  // ──────────────────────────────────────────
  out += '\n' + sep + '\n';
  out += '  TABLE 3: APP CONCEPTS\n';
  out += `  Total: ${appConcepts.length} concepts\n`;
  out += sep + '\n\n';

  let currentConceptProject = '';
  for (const c of appConcepts) {
    if (c.project !== currentConceptProject) {
      currentConceptProject = c.project;
      out += `\n  ┌${'─'.repeat(76)}┐\n`;
      out += `  │  PROJECT: ${currentConceptProject}\n`;
      out += `  │  Industry: ${c.industry}\n`;
      out += `  └${'─'.repeat(76)}┘\n\n`;
    }

    out += `    ━━━ CONCEPT #${c.num}: ${c.concept_name || 'Unnamed'} ━━━\n\n`;
    out += `    One-Liner:              ${c.one_liner || 'N/A'}\n`;
    out += `    Target User:            ${c.target_user || 'N/A'}\n`;
    out += `    Core Solution:          ${c.core_solution || 'N/A'}\n`;
    out += `    Differentiation:        ${c.differentiation || 'N/A'}\n`;
    out += `    Competitive Advantage:  ${c.competitive_advantage || 'N/A'}\n`;
    out += `    Development Complexity: ${c.development_complexity || 'N/A'}\n`;
    out += `    Market Potential:       ${c.market_potential || 'N/A'}\n\n`;

    if (c.target_pain_points?.length) {
      out += `    Pain Points Addressed:\n`;
      c.target_pain_points.forEach(p => { out += `      • ${p}\n`; });
      out += '\n';
    }
    if (c.key_features?.length) {
      out += `    Key Features:\n`;
      c.key_features.forEach((f, i) => { out += `      ${i + 1}. ${f}\n`; });
      out += '\n';
    }
    if (c.mvp_scope) {
      out += `    MVP — In Scope:\n`;
      (c.mvp_scope.in_scope || []).forEach(s => { out += `      ✓ ${s}\n`; });
      out += `    MVP — Out of Scope:\n`;
      (c.mvp_scope.out_of_scope || []).forEach(s => { out += `      ✗ ${s}\n`; });
      out += '\n';
    }
    if (c.risks_assumptions?.length) {
      out += `    Risks & Assumptions:\n`;
      c.risks_assumptions.forEach(r => { out += `      ⚠ ${r}\n`; });
      out += '\n';
    }
    if (c.validation_plan?.length) {
      out += `    Validation Plan:\n`;
      c.validation_plan.forEach((v, i) => { out += `      ${i + 1}. ${v}\n`; });
      out += '\n';
    }

    out += `    ${thinSep}\n\n`;
  }

  // ──────────────────────────────────────────
  // TABLE 4: USER PERSONAS
  // ──────────────────────────────────────────
  out += '\n' + sep + '\n';
  out += '  TABLE 4: USER PERSONAS\n';
  out += `  Total: ${userPersonas.length} personas\n`;
  out += sep + '\n\n';

  if (userPersonas.length === 0) {
    out += '  (No personas generated)\n\n';
  } else {
    let currentPersonaProject = '';
    for (const p of userPersonas) {
      if (p.project !== currentPersonaProject) {
        currentPersonaProject = p.project;
        out += `\n  ┌── PROJECT: ${currentPersonaProject}\n`;
      }
      out += `\n  │  PERSONA #${p.num}: ${p.name || 'Unnamed'}\n`;
      out += `  │  Age: ${p.age || 'N/A'}  |  Location: ${p.location || 'N/A'}  |  Occupation: ${p.occupation || 'N/A'}\n`;
      out += `  │  Tech Savviness: ${p.tech_savviness || 'N/A'}\n`;
      if (p.background) out += `  │  Background: ${p.background}\n`;
      if (p.quote) out += `  │  Quote: "${p.quote}"\n`;
      if (p.behavior) out += `  │  Behavior: ${p.behavior}\n`;
      if (p.goals?.length) {
        out += `  │  Goals:\n`;
        p.goals.forEach(g => { out += `  │    • ${g}\n`; });
      }
      if (p.frustrations?.length) {
        out += `  │  Frustrations:\n`;
        p.frustrations.forEach(f => { out += `  │    • ${f}\n`; });
      }
      if (p.devices?.length) out += `  │  Devices: ${p.devices.join(', ')}\n`;
    }
    out += '  └──\n';
  }

  // ──────────────────────────────────────────
  // TABLE 5: COMPETITOR INSIGHTS
  // ──────────────────────────────────────────
  out += '\n' + sep + '\n';
  out += '  TABLE 5: COMPETITOR INSIGHTS\n';
  out += `  Total: ${competitorInsights.length} competitor analyses\n`;
  out += sep + '\n\n';

  if (competitorInsights.length === 0) {
    out += '  (No competitor insights recorded)\n\n';
  } else {
    let currentCIProject = '';
    for (const ci of competitorInsights) {
      if (ci.project !== currentCIProject) {
        currentCIProject = ci.project;
        out += `\n  ┌── PROJECT: ${currentCIProject}\n`;
      }
      out += `\n  │  COMPETITOR #${ci.num}: ${ci.app_name || 'Unnamed'}\n`;
      if (ci.successful_features?.length) {
        out += `  │  Successful Features:\n`;
        ci.successful_features.forEach(f => { out += `  │    ✦ ${f}\n`; });
      }
      if (ci.user_praise?.length) {
        out += `  │  User Praise:\n`;
        ci.user_praise.forEach(p => { out += `  │    ★ ${p}\n`; });
      }
      if (ci.improvement_opportunities?.length) {
        out += `  │  Improvement Opportunities:\n`;
        ci.improvement_opportunities.forEach(o => { out += `  │    → ${o}\n`; });
      }
    }
    out += '  └──\n';
  }

  // ──────────────────────────────────────────
  // TABLE 6: PROMPTS (Architect + Builder per concept)
  // ──────────────────────────────────────────
  out += '\n' + sep + '\n';
  out += '  TABLE 6: AI PROMPTS (ARCHITECT & BUILDER)\n';
  out += `  Total: ${promptEntries.length} concepts × 2 prompts = ${promptEntries.length * 2} prompts\n`;
  out += sep + '\n\n';

  let currentPromptProject = '';
  for (const entry of promptEntries) {
    if (entry.project !== currentPromptProject) {
      currentPromptProject = entry.project;
      out += `\n  ┌── PROJECT: ${currentPromptProject}\n`;
      out += `  └──\n\n`;
    }

    out += `    ━━━ CONCEPT #${entry.num}: ${entry.concept_name} — ARCHITECT PROMPT ━━━\n\n`;
    out += `    ${buildArchitectPrompt(entry.concept, entry.projectData).split('\n').join('\n    ')}\n\n`;
    out += `    ━━━ CONCEPT #${entry.num}: ${entry.concept_name} — BUILDER PROMPT ━━━\n\n`;
    out += `    ${buildBuilderPrompt(entry.concept, entry.projectData).split('\n').join('\n    ')}\n\n`;
    out += `    ${thinSep}\n\n`;
  }

  // FOOTER
  out += '\n' + sep + '\n';
  out += `  EXPORT COMPLETE\n`;
  out += `  Projects: ${projects.length}  |  Pain Points: ${painPoints.length}  |  Concepts: ${appConcepts.length}\n`;
  out += `  Personas: ${userPersonas.length}  |  Competitors: ${competitorInsights.length}  |  Prompts: ${promptEntries.length * 2}\n`;
  out += sep + '\n';

  return out;
}

function buildArchitectPrompt(concept, project) {
  return `You are a senior software architect. Design the complete technical architecture for:

App Name: ${concept.concept_name}
Description: ${concept.one_liner}
Core Solution: ${concept.core_solution}
Target User: ${concept.target_user}
Industry: ${project.industry || 'General'}

Key Features to Architect:
${(concept.key_features || []).map(f => '- ' + f).join('\n')}

MVP In-Scope:
${(concept.mvp_scope?.in_scope || []).map(s => '- ' + s).join('\n')}

MVP Out-of-Scope:
${(concept.mvp_scope?.out_of_scope || []).map(s => '- ' + s).join('\n')}

Competitive Advantage: ${concept.competitive_advantage}
Development Complexity: ${concept.development_complexity}

Provide: System architecture, tech stack, database schema, API design, authentication strategy, deployment plan, and scaling considerations.`;
}

function buildBuilderPrompt(concept, project) {
  return `You are an expert full-stack developer. Build the MVP for:

App Name: ${concept.concept_name}
Description: ${concept.one_liner}
Core Solution: ${concept.core_solution}
Target User: ${concept.target_user}

Features to Implement:
${(concept.key_features || []).map(f => '- ' + f).join('\n')}

MVP Scope:
${(concept.mvp_scope?.in_scope || []).map(s => '- ' + s).join('\n')}

Differentiation: ${concept.differentiation}
Complexity: ${concept.development_complexity}

Build as a modern web application with responsive UI, user auth, core features, database integration, and error handling.`;
}