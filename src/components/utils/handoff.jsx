/**
 * Cross-app handoff utilities for Spiral Studios Suite
 * Enables seamless data transfer between SpiralPlan, Idea Spark, App Forge, and App Master
 */

// Suite apps configuration
export const SUITE_APPS = {
    SPIRAL_PLAN: {
        name: 'SpiralPlan',
        url: 'https://spiral-plan-0f142f84.base44.app',
        color: 'green'
    },
    IDEA_SPARK: {
        name: 'Idea Spark',
        url: 'https://idea-spark-ai-33ec6517.base44.app',
        color: 'blue'
    },
    APP_FORGE: {
        name: 'App Forge',
        url: 'https://app-forge-3bf6353f.base44.app',
        color: 'purple'
    },
    APP_MASTER: {
        name: 'App Master',
        url: 'https://app-master-c9c24cd9.base44.app',
        color: 'amber'
    }
};

/**
 * Encodes concept data for safe URL transmission
 */
export function encodeConceptForHandoff(concept, projectTitle, industry) {
    const handoffData = {
        source: 'ideaspark',
        timestamp: new Date().toISOString(),
        concept: {
            name: concept.concept_name,
            description: concept.core_solution,
            industry: industry,
            project_title: projectTitle,
            pain_points: concept.target_pain_points,
            features: concept.key_features,
            competitive_advantage: concept.competitive_advantage,
            complexity: concept.development_complexity,
            market_potential: concept.market_potential
        }
    };
    
    // Encode as base64 for URL safety
    return btoa(JSON.stringify(handoffData));
}

/**
 * Creates App Forge URL with concept data
 */
export function createAppForgeHandoffUrl(concept, projectTitle, industry) {
    const baseUrl = SUITE_APPS.APP_FORGE.url;
    const encodedData = encodeConceptForHandoff(concept, projectTitle, industry);
    return `${baseUrl}?handoff=${encodedData}`;
}

/**
 * Creates App Master URL with validated project data
 */
export function createAppMasterHandoffUrl(validatedProject) {
    const baseUrl = SUITE_APPS.APP_MASTER.url;
    const handoffData = {
        source: 'appforge',
        timestamp: new Date().toISOString(),
        project: {
            name: validatedProject.name,
            description: validatedProject.description,
            mvp_features: validatedProject.mvp_features,
            user_stories: validatedProject.user_stories,
            timeline: validatedProject.timeline,
            budget_estimate: validatedProject.budget_estimate,
            team_requirements: validatedProject.team_requirements
        }
    };
    return `${baseUrl}?handoff=${btoa(JSON.stringify(handoffData))}`;
}

/**
 * Checks if user has suite access for handoff features.
 * Requires a pre-fetched user object — does NOT read from localStorage.
 */
export function canUseHandoff(user) {
    const tier = user?.subscription_tier || 'free';
    return ['suite_starter', 'suite_creator'].includes(tier);
}

/**
 * Create handoff URL for SpiralPlan
 */
export const createSpiralPlanHandoffUrl = (concept, projectTitle, industry) => {
    const handoffData = {
        source: 'idea_spark',
        timestamp: new Date().toISOString(),
        concept: {
            name: concept.concept_name,
            description: concept.core_solution,
            industry: industry,
            projectTitle: projectTitle,
            features: concept.key_features || [],
            painPoints: concept.target_pain_points || [],
            marketPotential: concept.market_potential,
            complexity: concept.development_complexity,
            competitiveAdvantage: concept.competitive_advantage
        }
    };

    const encodedData = encodeURIComponent(JSON.stringify(handoffData));
    return `${SUITE_APPS.SPIRAL_PLAN.url}?handoff=${encodedData}`;
};

/**
 * Gets pipeline status for an idea
 */
export function getPipelineStatus(conceptId) {
    try {
        const pipeline = JSON.parse(localStorage.getItem('idea_pipeline') || '{}');
        return pipeline[conceptId] || {
            stage: 'discovery',
            stages_completed: ['discovery'],
            current_app: 'Idea Spark',
            last_updated: new Date().toISOString()
        };
    } catch {
        return {
            stage: 'discovery',
            stages_completed: ['discovery'],
            current_app: 'Idea Spark',
            last_updated: new Date().toISOString()
        };
    }
}

/**
 * Updates pipeline status when idea moves between apps
 */
export function updatePipelineStatus(conceptId, stage, appName) {
    try {
        const pipeline = JSON.parse(localStorage.getItem('idea_pipeline') || '{}');
        const currentStatus = pipeline[conceptId] || { stages_completed: [] };
        
        pipeline[conceptId] = {
            ...currentStatus,
            stage: stage,
            current_app: appName,
            stages_completed: [...new Set([...currentStatus.stages_completed, stage])],
            last_updated: new Date().toISOString()
        };
        
        localStorage.setItem('idea_pipeline', JSON.stringify(pipeline));
    } catch (err) {
        console.error('Failed to update pipeline status:', err);
    }
}

/**
 * Pipeline stage definitions
 */
export const PIPELINE_STAGES = {
    analysis: {
        name: 'Analysis',
        app: 'SpiralPlan',
        description: 'Competitive intelligence & market positioning',
        color: 'green'
    },
    discovery: {
        name: 'Discovery',
        app: 'Idea Spark',
        description: 'Research & concept generation',
        color: 'blue'
    },
    validation: {
        name: 'Validation',
        app: 'App Forge',
        description: 'Idea validation & MVP planning',
        color: 'purple'
    },
    development: {
        name: 'Development',
        app: 'App Master',
        description: 'Build & project management',
        color: 'amber'
    },
    launch: {
        name: 'Launch',
        app: 'App Master',
        description: 'Go-to-market execution',
        color: 'green'
    }
};