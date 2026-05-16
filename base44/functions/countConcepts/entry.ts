import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await base44.asServiceRole.entities.ResearchProject.list('-created_date', 50);

    const summary = projects.map(p => ({
      id: p.id,
      title: p.title,
      status: p.status,
      concept_count: p.generated_concepts?.length || 0,
      concept_names: (p.generated_concepts || []).map(c => c.concept_name)
    }));

    const totalConcepts = summary.reduce((sum, p) => sum + p.concept_count, 0);
    const projectsWithConcepts = summary.filter(p => p.concept_count > 0).length;
    const projectsWithoutConcepts = summary.filter(p => p.concept_count === 0).length;

    return Response.json({ 
      totalProjects: projects.length,
      projectsWithConcepts,
      projectsWithoutConcepts,
      totalConcepts,
      breakdown: summary.sort((a, b) => b.concept_count - a.concept_count)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});