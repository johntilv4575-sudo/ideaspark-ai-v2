// Mode detection and suite configuration
export const isSuiteMode = () => {
  if (typeof window === 'undefined') return false;
  return !!window.__SUITE_REGISTRY__ || !!localStorage.getItem('suite_mode');
};

export const getSuiteRegistry = () => {
  if (!isSuiteMode()) return null;
  try {
    return window.__SUITE_REGISTRY__ || JSON.parse(localStorage.getItem('suite_registry') || '[]');
  } catch {
    return [];
  }
};

export const setSuiteMode = (enabled, registry) => {
  if (enabled) {
    localStorage.setItem('suite_mode', 'true');
    if (registry) {
      localStorage.setItem('suite_registry', JSON.stringify(registry));
      window.__SUITE_REGISTRY__ = registry;
    }
  } else {
    localStorage.removeItem('suite_mode');
    localStorage.removeItem('suite_registry');
    delete window.__SUITE_REGISTRY__;
  }
};

// Sample suite registry for development
export const SAMPLE_SUITE_REGISTRY = [
  {
    id: "spiral-writer",
    name: "Spiral Writer",
    url: "http://localhost:5174",
    capabilities: ["outline", "chapter_gen", "character_dev"],
    events: ["story.created", "outline.completed"],
    schemaVersion: "1.0.0"
  },
  {
    id: "spiral-rpg",
    name: "Spiral RPG",
    url: "http://localhost:5175",
    capabilities: ["npc_gen", "quest_gen", "world_build"],
    events: ["character.created", "quest.started"],
    schemaVersion: "1.0.0"
  }
];

// IACG Agent Manifest
export const IACG_MANIFEST = {
  id: "iacg",
  name: "Industry App Concept Generator",
  version: "1.0.0",
  capabilities: [
    "generate_concepts",
    "score_feasibility",
    "analyze_pain_points",
    "competitive_analysis",
    "export_brief"
  ],
  events: [
    "concept.created",
    "concept.combined",
    "research.completed",
    "bundle.requested"
  ],
  invoke: {
    generate: "POST /agent/generate",
    score: "POST /agent/score",
    analyze: "POST /agent/analyze"
  },
  schemaVersion: "1.0.0"
};