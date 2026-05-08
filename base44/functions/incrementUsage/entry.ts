import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json();
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Auto-reset if month changed
    let projectsUsed = user.projects_created_this_month || 0;
    let exportsUsed = user.exports_this_month || 0;

    if (user.usage_month !== currentMonth) {
      projectsUsed = 0;
      exportsUsed = 0;
    }

    const updateData = { usage_month: currentMonth };

    if (action === 'project') {
      updateData.projects_created_this_month = projectsUsed + 1;
    } else if (action === 'export') {
      updateData.exports_this_month = exportsUsed + 1;
    } else {
      return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    await base44.auth.updateMe(updateData);

    return Response.json({ success: true, usage: updateData });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});