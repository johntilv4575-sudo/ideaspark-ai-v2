export const CONTEXT_MARKER = "\n\n— screen context —\n";

const PAGE_CONTEXT = {
  Dashboard: "Overview of research projects, stats, recent activity and quick actions.",
  MarketTrends: "Industry market brief: market size and growth, consumer priorities, technology trends, competitors, feature gaps, opportunities, risks and strategy.",
  NewResearch: "Runs pain point, competitor, persona and concept generation for a chosen market.",
  MasterPrompt: "Paste your own prompt to pre-fill a whole research project, then adjust it.",
  AppConcepts: "Browse, filter, group and combine the generated app concepts.",
  PromptCreator: "Architect and Builder prompts for a chosen concept, ready to copy or export.",
  ResearchVault: "Upload research documents, extract insights, and review them against the original concept to catch drift.",
  ConceptSummaryDashboard: "Every concept across all projects in one place, with summary stats.",
  ConceptExport: "Blueprint, PDF, markdown and JSON exports of concepts and prompts.",
  ResearchResults: "The generated pain points, competitor insights, personas and app concepts for one research project.",
  ResearchDetails: "A single research project's details and saved findings.",
  ConceptDetails: "One app concept: solution, MVP scope, risks, validation plan and its prompts.",
  BusinessModelCanvas: "The business model canvas for a concept.",
  SuiteGuide: "How the Spiral Beyond Suite apps fit together and hand off to each other.",
  SuiteLanding: "Overview of the Spiral Beyond Suite.",
  SuiteDemonstrationWalkThrough: "A walkthrough of how the suite apps work together.",
  Landing: "Public marketing page introducing Idea Spark.",
  About: "What Idea Spark is, how it works, and who built it.",
  Tutorial: "How to use Idea Spark, step by step.",
  ComfortSettings: "Accessibility and comfort preferences (contrast, motion, font).",
  ProfileSettings: "Account, plan and usage limits.",
  AirtableSettings: "Airtable sync configuration."
};

export function describeScreen(pageName, pathname) {
  const known = PAGE_CONTEXT[pageName];
  return `Screen: ${pageName || pathname || "unknown"} (${pathname || "/"}).${known ? ` ${known}` : ""}`;
}