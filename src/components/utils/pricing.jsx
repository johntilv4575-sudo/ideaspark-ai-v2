
// Feature flags and licensing

const DEFAULT_FREE = {
  tier: 'free',
  features: {
    iacg: {
      export_pdf: false,
      market_scores: false,
      unlimited_projects: false,
      concept_combining: false
    },
    suite: {
      handoff: false,
      orchestrations: false,
      cross_app_data: false
    }
  },
  limits: {
    projects_per_month: 3,
    concepts_per_project: 3,
    exports_per_month: 0
  }
};

const TIER_CONFIGS = {
  free: DEFAULT_FREE,
  pro: {
    tier: 'pro',
    features: {
      iacg: {
        export_pdf: true,
        market_scores: true,
        unlimited_projects: true,
        concept_combining: true
      },
      suite: {
        handoff: false,
        orchestrations: false,
        cross_app_data: false
      }
    },
    limits: {
      projects_per_month: 999,
      concepts_per_project: 10,
      exports_per_month: 999
    }
  },
  suite_starter: {
    tier: 'suite_starter',
    features: {
      iacg: {
        export_pdf: true,
        market_scores: true,
        unlimited_projects: true,
        concept_combining: true
      },
      suite: {
        handoff: true,
        orchestrations: false,
        cross_app_data: true
      }
    },
    limits: {
      projects_per_month: 999,
      concepts_per_project: 10,
      exports_per_month: 999
    }
  },
  suite_creator: {
    tier: 'suite_creator',
    features: {
      iacg: {
        export_pdf: true,
        market_scores: true,
        unlimited_projects: true,
        concept_combining: true
      },
      suite: {
        handoff: true,
        orchestrations: true,
        cross_app_data: true
      }
    },
    limits: {
      projects_per_month: 999,
      concepts_per_project: 999,
      exports_per_month: 999
    }
  }
};

export function getLicense() {
  try {
    const stored = localStorage.getItem('license');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Check expiration only if expires field exists
      if (parsed.expires && new Date(parsed.expires) < new Date()) {
        return DEFAULT_FREE;
      }
      return TIER_CONFIGS[parsed.tier] || DEFAULT_FREE;
    }
  } catch {}
  return DEFAULT_FREE;
}

export function setLicense(tier) {
  const license = TIER_CONFIGS[tier];
  if (license) {
    localStorage.setItem('license', JSON.stringify(license));
  }
}

export function hasFeature(category, feature) {
  const license = getLicense();
  return license.features[category]?.[feature] || false;
}

export function canPerformAction(action) {
  const license = getLicense();
  
  // Check usage limits
  const usage = getUsage();
  
  switch (action) {
    case 'create_project':
      if (usage.projects_this_month >= license.limits.projects_per_month) {
        return { 
          allowed: false, 
          reason: `You've reached your monthly limit of ${license.limits.projects_per_month} projects. Upgrade to continue.` 
        };
      }
      return { allowed: true };
      
    case 'export':
      if (!hasFeature('iacg', 'export_pdf')) {
        return { 
          allowed: false, 
          reason: 'PDF export requires Pro or Suite tier. Upgrade to unlock.' 
        };
      }
      if (usage.exports_this_month >= license.limits.exports_per_month) {
        return { 
          allowed: false, 
          reason: `You've reached your monthly export limit. Upgrade for unlimited exports.` 
        };
      }
      return { allowed: true };
      
    case 'combine':
      if (!hasFeature('iacg', 'concept_combining')) {
        return { 
          allowed: false, 
          reason: 'Concept combining requires Pro or Suite tier.' 
        };
      }
      return { allowed: true };
      
    default:
      return { allowed: true };
  }
}

function getUsage() {
  try {
    const usage = JSON.parse(localStorage.getItem('usage') || '{}');
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    if (usage.month !== currentMonth) {
      // Reset monthly counters
      return {
        month: currentMonth,
        projects_this_month: 0,
        exports_this_month: 0
      };
    }
    
    return usage;
  } catch {
    return {
      month: new Date().toISOString().slice(0, 7),
      projects_this_month: 0,
      exports_this_month: 0
    };
  }
}

export function incrementUsage(action) {
  const usage = getUsage();
  
  if (action === 'project') {
    usage.projects_this_month++;
  } else if (action === 'export') {
    usage.exports_this_month++;
  }
  
  localStorage.setItem('usage', JSON.stringify(usage));
}
