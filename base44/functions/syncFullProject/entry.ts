import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const AIRTABLE_API = 'https://api.airtable.com/v0';

async function createRecords(apiKey, baseId, tableName, records) {
  const createdIds = [];
  const batchSize = 10;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize).map(r => ({ fields: r }));
    const response = await fetch(`${AIRTABLE_API}/${baseId}/${encodeURIComponent(tableName)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: batch })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Airtable error on "${tableName}": ${err.error?.message || JSON.stringify(err)}`);
    }

    const data = await response.json();
    createdIds.push(...data.records.map(r => r.id));
  }

  return createdIds;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = Deno.env.get("AIRTABLE_API_KEY");
    if (!apiKey) {
      return Response.json({ error: 'AIRTABLE_API_KEY not configured' }, { status: 500 });
    }

    const { projectId, config } = await req.json();
    const { baseId, tables } = config;

    if (!baseId || !projectId) {
      return Response.json({ error: 'Missing baseId or projectId' }, { status: 400 });
    }

    // Fetch the project
    const project = await base44.entities.ResearchProject.get(projectId);
    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const syncDate = new Date().toISOString().split('T')[0];
    const results = { synced: {}, errors: [] };

    // 1. Sync Research Project
    if (tables.researchProjects) {
      try {
        const record = {
          "Name": project.title || '',
          "Industry": project.industry || 'General',
          "Description": project.description || '',
          "Status": (project.status || 'draft').charAt(0).toUpperCase() + (project.status || 'draft').slice(1),
          "Target Demographics": project.research_parameters?.target_demographics || '',
          "Geographic Focus": project.research_parameters?.geographic_focus || '',
          "Keywords": (project.research_parameters?.keywords || []).join(', '),
          "Competitor Apps": (project.research_parameters?.competitor_apps || []).join(', '),
          "Source": "Idea Spark",
          "Synced Date": syncDate
        };
        const ids = await createRecords(apiKey, baseId, tables.researchProjects, [record]);
        results.synced.researchProjects = { count: ids.length, ids };
      } catch (e) {
        results.errors.push({ table: 'Research Projects', error: e.message });
      }
    }

    // 2. Sync Pain Points
    if (tables.painPoints && project.pain_points?.length > 0) {
      try {
        const records = project.pain_points.map(pp => ({
          "Issue": pp.issue || '',
          "Severity": (pp.severity || 'medium').charAt(0).toUpperCase() + (pp.severity || 'medium').slice(1),
          "Frequency": pp.frequency || 0,
          "Source Examples": (pp.source_examples || []).join('\n'),
          "Synced Date": syncDate
        }));
        const ids = await createRecords(apiKey, baseId, tables.painPoints, records);
        results.synced.painPoints = { count: ids.length, ids };
      } catch (e) {
        results.errors.push({ table: 'Pain Points', error: e.message });
      }
    }

    // 3. Sync App Concepts
    if (tables.appConcepts && project.generated_concepts?.length > 0) {
      try {
        const records = project.generated_concepts.map(c => ({
          "Concept Name": c.concept_name || '',
          "Core Solution": c.core_solution || '',
          "Key Features": (c.key_features || []).join(', '),
          "Competitive Advantage": c.competitive_advantage || '',
          "Development Complexity": (c.development_complexity || 'medium').charAt(0).toUpperCase() + (c.development_complexity || 'medium').slice(1),
          "Market Potential": (c.market_potential || 'moderate').charAt(0).toUpperCase() + (c.market_potential || 'moderate').slice(1),
          "Target Pain Points": (c.target_pain_points || []).join(', '),
          "Synced Date": syncDate
        }));
        const ids = await createRecords(apiKey, baseId, tables.appConcepts, records);
        results.synced.appConcepts = { count: ids.length, ids };
      } catch (e) {
        results.errors.push({ table: 'App Concepts', error: e.message });
      }
    }

    // 4. Sync User Personas
    if (tables.userPersonas && project.generated_personas?.length > 0) {
      try {
        const records = project.generated_personas.map(p => ({
          "Name": p.name || '',
          "Age": p.age || 0,
          "Location": p.location || '',
          "Occupation": p.occupation || '',
          "Background": p.background || '',
          "Goals": (p.goals || []).join('\n'),
          "Frustrations": (p.frustrations || []).join('\n'),
          "Tech Savviness": (p.tech_savviness || 'medium').charAt(0).toUpperCase() + (p.tech_savviness || 'medium').slice(1),
          "Devices": (p.devices || []).join(', '),
          "Quote": p.quote || '',
          "Synced Date": syncDate
        }));
        const ids = await createRecords(apiKey, baseId, tables.userPersonas, records);
        results.synced.userPersonas = { count: ids.length, ids };
      } catch (e) {
        results.errors.push({ table: 'User Personas', error: e.message });
      }
    }

    // 5. Sync Competitor Insights
    if (tables.competitorInsights && project.competitor_insights?.length > 0) {
      try {
        const records = project.competitor_insights.map(ci => ({
          "App Name": ci.app_name || '',
          "Successful Features": (ci.successful_features || []).join('\n'),
          "User Praise": (ci.user_praise || []).join('\n'),
          "Improvement Opportunities": (ci.improvement_opportunities || []).join('\n'),
          "Synced Date": syncDate
        }));
        const ids = await createRecords(apiKey, baseId, tables.competitorInsights, records);
        results.synced.competitorInsights = { count: ids.length, ids };
      } catch (e) {
        results.errors.push({ table: 'Competitor Insights', error: e.message });
      }
    }

    // 6. Sync Prompts (one record per concept with blueprint + architect + builder prompts)
    if (tables.prompts && project.generated_concepts?.length > 0) {
      try {
        const records = project.generated_concepts.map(c => {
          const conceptName = c.concept_name || 'App Concept';
          const coreSolution = c.core_solution || '';
          const competitiveAdvantage = c.competitive_advantage || '';
          const painPoints = c.target_pain_points || [];
          const keyFeatures = c.key_features || [];
          const complexity = c.development_complexity || 'medium';
          const potential = c.market_potential || 'moderate';
          const industryName = project.industry || 'general';

          // Blueprint text
          const blueprint = [
            `Concept: ${conceptName}`,
            `Industry: ${industryName}`,
            `Core Solution: ${coreSolution}`,
            `Competitive Advantage: ${competitiveAdvantage}`,
            `Development Complexity: ${complexity}`,
            `Market Potential: ${potential}`,
            '',
            'TARGET PAIN POINTS:',
            ...painPoints.map((p, i) => `${i + 1}. ${p}`),
            '',
            'KEY FEATURES:',
            ...keyFeatures.map((f, i) => `${i + 1}. ${f}`)
          ].join('\n');

          // Architect prompt summary
          const architectPrompt = [
            `# MASTER PROMPT ARCHITECT - ${conceptName}`,
            `## Industry: ${industryName}`,
            '',
            '## VALIDATED PAIN POINTS TO SOLVE',
            ...painPoints.map((p, i) => `${i + 1}. ${p}`),
            '',
            `## CORE SOLUTION MANDATE`,
            coreSolution,
            '',
            `## COMPETITIVE ADVANTAGE REQUIREMENTS`,
            competitiveAdvantage,
            '',
            '## FEATURE PRIORITIZATION',
            ...keyFeatures.map((f, i) => `${i + 1}. ${f}`),
            '',
            `Development Complexity: ${complexity}`,
            `Market Potential: ${potential}`
          ].join('\n');

          // Builder prompt summary
          const builderPrompt = [
            `# MASTER APP BUILDER - ${conceptName}`,
            `## Industry: ${industryName}`,
            '',
            '## PAIN POINTS TO ELIMINATE:',
            ...painPoints.map((p, i) => `🎯 ${i + 1}: ${p}`),
            '',
            '## CORE FEATURES TO BUILD:',
            ...keyFeatures.map((f, i) => `${i + 1}. ${f}`),
            '',
            `## COMPETITIVE EDGE: ${competitiveAdvantage}`,
            '',
            `Complexity: ${complexity} | Market: ${potential}`
          ].join('\n');

          return {
            "Research Project": project.title || '',
            "Blueprint": blueprint,
            "Architect Prompt": architectPrompt,
            "Builder Prompts": builderPrompt,
            "Synced Date": syncDate
          };
        });
        const ids = await createRecords(apiKey, baseId, tables.prompts, records);
        results.synced.prompts = { count: ids.length, ids };
      } catch (e) {
        results.errors.push({ table: 'Prompts', error: e.message });
      }
    }

    const totalSynced = Object.values(results.synced).reduce((sum, t) => sum + t.count, 0);

    return Response.json({
      success: results.errors.length === 0,
      totalRecordsSynced: totalSynced,
      ...results
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});