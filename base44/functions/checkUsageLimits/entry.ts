import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const TIER_CONFIGS = {
  free: {
    features: {
      export_pdf: false,
      market_scores: false,
      unlimited_projects: false,
      concept_combining: false,
      handoff: false,
      orchestrations: false,
      cross_app_data: false
    },
    limits: {
      projects_per_month: 3,
      concepts_per_project: 3,
      exports_per_month: 0
    }
  },
  pro: {
    features: {
      export_pdf: true,
      market_scores: true,
      unlimited_projects: true,
      concept_combining: true,
      handoff: false,
      orchestrations: false,
      cross_app_data: false
    },
    limits: {
      projects_per_month: 999,
      concepts_per_project: 10,
      exports_per_month: 999
    }
  },
  suite_starter: {
    features: {
      export_pdf: true,
      market_scores: true,
      unlimited_projects: true,
      concept_combining: true,
      handoff: true,
      orchestrations: false,
      cross_app_data: true
    },
    limits: {
      projects_per_month: 999,
      concepts_per_project: 10,
      exports_per_month: 999
    }
  },
  suite_creator: {
    features: {
      export_pdf: true,
      market_scores: true,
      unlimited_projects: true,
      concept_combining: true,
      handoff: true,
      orchestrations: true,
      cross_app_data: true
    },
    limits: {
      projects_per_month: 999,
      concepts_per_project: 999,
      exports_per_month: 999
    }
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json();
    const tier = user.subscription_tier || 'free';
    const config = TIER_CONFIGS[tier] || TIER_CONFIGS.free;
    const currentMonth = new Date().toISOString().slice(0, 7);

    // Auto-reset if month changed
    let projectsUsed = user.projects_created_this_month || 0;
    let exportsUsed = user.exports_this_month || 0;

    if (user.usage_month !== currentMonth) {
      projectsUsed = 0;
      exportsUsed = 0;
      // Reset on the user record
      await base44.auth.updateMe({
        usage_month: currentMonth,
        projects_created_this_month: 0,
        exports_this_month: 0
      });
    }

    let result = { allowed: true, reason: null };

    switch (action) {
      case 'create_project':
        if (projectsUsed >= config.limits.projects_per_month) {
          result = {
            allowed: false,
            reason: `You've reached your monthly limit of ${config.limits.projects_per_month} projects. Upgrade to continue.`
          };
        }
        break;

      case 'export':
        if (!config.features.export_pdf) {
          result = {
            allowed: false,
            reason: 'PDF export requires Pro or Suite tier. Upgrade to unlock.'
          };
        } else if (exportsUsed >= config.limits.exports_per_month) {
          result = {
            allowed: false,
            reason: "You've reached your monthly export limit. Upgrade for unlimited exports."
          };
        }
        break;

      case 'combine':
        if (!config.features.concept_combining) {
          result = {
            allowed: false,
            reason: 'Concept combining requires Pro or Suite tier.'
          };
        }
        break;

      case 'handoff':
        if (!config.features.handoff) {
          result = {
            allowed: false,
            reason: 'Suite handoff requires Suite Starter or Suite Creator tier.'
          };
        }
        break;

      default:
        result = { allowed: true, reason: null };
    }

    return Response.json({
      ...result,
      tier,
      features: config.features,
      limits: config.limits,
      usage: {
        projects_this_month: projectsUsed,
        exports_this_month: exportsUsed
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});