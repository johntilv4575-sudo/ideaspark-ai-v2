import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Paginate through ALL projects (user-scoped, respects RLS)
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

    const summary = allProjects.map(p => ({
      id: p.id,
      title: p.title,
      status: p.status,
      concept_count: p.generated_concepts?.length || 0
    }));

    const totalConcepts = summary.reduce((sum, p) => sum + p.concept_count, 0);
    const projectsWithConcepts = summary.filter(p => p.concept_count > 0).length;

    return Response.json({ 
      totalProjects: allProjects.length,
      projectsWithConcepts,
      projectsWithoutConcepts: allProjects.length - projectsWithConcepts,
      totalConcepts,
      breakdown: summary.sort((a, b) => b.concept_count - a.concept_count)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});