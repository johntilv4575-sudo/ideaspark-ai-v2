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
      // Full JSON export
      const allConcepts = [];
      for (const project of allProjects) {
        const concepts = project.generated_concepts || [];
        for (const concept of concepts) {
          allConcepts.push({
            project_title: project.title,
            project_id: project.id,
            project_industry: project.industry || 'general',
            project_status: project.status,
            ...concept
          });
        }
      }
      return Response.json({
        total_concepts: allConcepts.length,
        total_projects: allProjects.length,
        exported_at: new Date().toISOString(),
        concepts: allConcepts
      });
    }

    // Text/blueprint export
    let output = '';
    output += '═══════════════════════════════════════════════════════════════\n';
    output += '  IDEA SPARK — COMPLETE CONCEPT & BLUEPRINT EXPORT\n';
    output += `  Exported: ${new Date().toISOString()}\n`;
    output += `  User: ${user.full_name || user.email}\n`;
    output += '═══════════════════════════════════════════════════════════════\n\n';

    let conceptNumber = 0;

    for (const project of allProjects) {
      const concepts = project.generated_concepts || [];
      if (concepts.length === 0) continue;

      output += '┌─────────────────────────────────────────────────────────────┐\n';
      output += `│  PROJECT: ${project.title}\n`;
      output += `│  Industry: ${project.industry || 'General'}  |  Status: ${project.status}\n`;
      output += `│  Concepts: ${concepts.length}\n`;
      output += '└─────────────────────────────────────────────────────────────┘\n\n';

      for (const c of concepts) {
        conceptNumber++;
        output += `━━━ CONCEPT #${conceptNumber}: ${c.concept_name || 'Unnamed'} ━━━\n\n`;
        output += `One-Liner: ${c.one_liner || 'N/A'}\n`;
        output += `Target User: ${c.target_user || 'N/A'}\n`;
        output += `Core Solution: ${c.core_solution || 'N/A'}\n`;
        output += `Differentiation: ${c.differentiation || 'N/A'}\n`;
        output += `Competitive Advantage: ${c.competitive_advantage || 'N/A'}\n`;
        output += `Development Complexity: ${c.development_complexity || 'N/A'}\n`;
        output += `Market Potential: ${c.market_potential || 'N/A'}\n\n`;

        if (c.target_pain_points?.length) {
          output += `Pain Points Addressed:\n`;
          c.target_pain_points.forEach(pp => { output += `  • ${pp}\n`; });
          output += '\n';
        }

        if (c.key_features?.length) {
          output += `Key Features:\n`;
          c.key_features.forEach(f => { output += `  • ${f}\n`; });
          output += '\n';
        }

        if (c.mvp_scope) {
          output += `MVP Scope — In Scope:\n`;
          (c.mvp_scope.in_scope || []).forEach(s => { output += `  ✓ ${s}\n`; });
          output += `MVP Scope — Out of Scope:\n`;
          (c.mvp_scope.out_of_scope || []).forEach(s => { output += `  ✗ ${s}\n`; });
          output += '\n';
        }

        if (c.risks_assumptions?.length) {
          output += `Risks & Assumptions:\n`;
          c.risks_assumptions.forEach(r => { output += `  ⚠ ${r}\n`; });
          output += '\n';
        }

        if (c.validation_plan?.length) {
          output += `Validation Plan:\n`;
          c.validation_plan.forEach((v, i) => { output += `  ${i + 1}. ${v}\n`; });
          output += '\n';
        }

        // BLUEPRINT — Architect Prompt
        output += `── ARCHITECT BLUEPRINT ──\n`;
        output += generateArchitectPrompt(c, project);
        output += '\n\n';

        // BLUEPRINT — Builder Prompt  
        output += `── BUILDER BLUEPRINT ──\n`;
        output += generateBuilderPrompt(c, project);
        output += '\n\n';

        output += '───────────────────────────────────────────────────────────────\n\n';
      }
    }

    output += `\n\nTOTAL: ${conceptNumber} concepts exported from ${allProjects.filter(p => (p.generated_concepts?.length || 0) > 0).length} projects.\n`;

    return new Response(output, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="IdeaSpark_206_Concepts_Export.txt"`
      }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function generateArchitectPrompt(concept, project) {
  return `You are a senior software architect. Design the complete technical architecture for:

App Name: ${concept.concept_name}
Description: ${concept.one_liner}
Core Solution: ${concept.core_solution}
Target User: ${concept.target_user}
Industry: ${project.industry || 'General'}

Key Features to Architect:
${(concept.key_features || []).map(f => `- ${f}`).join('\n')}

MVP In-Scope:
${(concept.mvp_scope?.in_scope || []).map(s => `- ${s}`).join('\n')}

MVP Out-of-Scope:
${(concept.mvp_scope?.out_of_scope || []).map(s => `- ${s}`).join('\n')}

Competitive Advantage: ${concept.competitive_advantage}
Development Complexity: ${concept.development_complexity}

Provide: System architecture diagram description, tech stack recommendation, database schema, API design, authentication strategy, deployment plan, and scaling considerations.`;
}

function generateBuilderPrompt(concept, project) {
  return `You are an expert full-stack developer. Build the MVP for:

App Name: ${concept.concept_name}
Description: ${concept.one_liner}
Core Solution: ${concept.core_solution}
Target User: ${concept.target_user}

Features to Implement:
${(concept.key_features || []).map(f => `- ${f}`).join('\n')}

MVP Scope:
${(concept.mvp_scope?.in_scope || []).map(s => `- ${s}`).join('\n')}

Differentiation: ${concept.differentiation}
Complexity: ${concept.development_complexity}

Build this as a modern web application. Include: responsive UI, user authentication, core feature implementation, database integration, and error handling. Focus on clean, maintainable code with a great user experience.`;
}