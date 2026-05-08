import { base44 } from "@/api/base44Client";
import { checkUsageLimits } from "@/functions/checkUsageLimits";
import { incrementUsage as incrementUsageBackend } from "@/functions/incrementUsage";

// Tier config for local feature checks (read-only, not security-critical)
const TIER_CONFIGS = {
  free: {
    tier: 'free',
    features: {
      iacg: { export_pdf: false, market_scores: false, unlimited_projects: false, concept_combining: false },
      suite: { handoff: false, orchestrations: false, cross_app_data: false }
    },
    limits: { projects_per_month: 3, concepts_per_project: 3, exports_per_month: 0 }
  },
  pro: {
    tier: 'pro',
    features: {
      iacg: { export_pdf: true, market_scores: true, unlimited_projects: true, concept_combining: true },
      suite: { handoff: false, orchestrations: false, cross_app_data: false }
    },
    limits: { projects_per_month: 999, concepts_per_project: 10, exports_per_month: 999 }
  },
  suite_starter: {
    tier: 'suite_starter',
    features: {
      iacg: { export_pdf: true, market_scores: true, unlimited_projects: true, concept_combining: true },
      suite: { handoff: true, orchestrations: false, cross_app_data: true }
    },
    limits: { projects_per_month: 999, concepts_per_project: 10, exports_per_month: 999 }
  },
  suite_creator: {
    tier: 'suite_creator',
    features: {
      iacg: { export_pdf: true, market_scores: true, unlimited_projects: true, concept_combining: true },
      suite: { handoff: true, orchestrations: true, cross_app_data: true }
    },
    limits: { projects_per_month: 999, concepts_per_project: 999, exports_per_month: 999 }
  }
};

/**
 * Get license config from user data (async, reads from User entity)
 */
export async function getLicense() {
  try {
    const user = await base44.auth.me();
    const tier = user?.subscription_tier || 'free';
    return TIER_CONFIGS[tier] || TIER_CONFIGS.free;
  } catch {
    return TIER_CONFIGS.free;
  }
}

/**
 * Get license config from a pre-fetched user object (sync, no API call)
 */
export function getLicenseFromUser(user) {
  const tier = user?.subscription_tier || 'free';
  return TIER_CONFIGS[tier] || TIER_CONFIGS.free;
}

/**
 * Check if user has a specific feature (async, server-validated)
 */
export function hasFeatureFromUser(user, category, feature) {
  const license = getLicenseFromUser(user);
  return license.features[category]?.[feature] || false;
}

/**
 * Server-validated action check (async — calls backend)
 */
export async function canPerformAction(action) {
  const res = await checkUsageLimits({ action });
  return { allowed: res.data.allowed, reason: res.data.reason };
}

/**
 * Server-side usage increment (async — calls backend)
 */
export async function incrementUsage(action) {
  await incrementUsageBackend({ action });
}

/**
 * Check if user has suite handoff access from user object (sync)
 */
export function canUseHandoffFromUser(user) {
  const tier = user?.subscription_tier || 'free';
  return ['suite_starter', 'suite_creator'].includes(tier);
}