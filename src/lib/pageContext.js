export const CONTEXT_MARKER = "\n\n— screen context —\n";

const MAX_CONTENT_CHARS = 3500;
const HISTORY_LIMIT = 6;

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

let screenHistory = [];

export function recordScreenVisit(pageName) {
  if (!pageName) return;
  if (screenHistory[screenHistory.length - 1] === pageName) return;
  screenHistory = [...screenHistory, pageName].slice(-HISTORY_LIMIT);
}

export function getScreenHistory() {
  return [...screenHistory];
}

// Reads what is actually on the user's screen so the assistant never needs
// the user to paste page content by hand.
function readVisibleText() {
  if (typeof document === "undefined") return "";
  const main = document.querySelector("main");
  const source = main || document.body;
  if (!source) return "";

  const raw = source.innerText || source.textContent || "";
  const cleaned = raw
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();

  return cleaned.length > MAX_CONTENT_CHARS
    ? `${cleaned.slice(0, MAX_CONTENT_CHARS)}… [truncated]`
    : cleaned;
}

export function buildScreenContext({ pageName, pathname, search }) {
  recordScreenVisit(pageName);

  const params = [...new URLSearchParams(search || "").entries()]
    .map(([key, value]) => `${key}=${value}`)
    .join(", ");

  const earlier = screenHistory.filter((name) => name !== pageName);
  const visible = readVisibleText();

  return [
    `Screen: ${pageName || pathname || "unknown"} (${pathname || "/"}${search || ""})`,
    PAGE_CONTEXT[pageName] ? `What this page is: ${PAGE_CONTEXT[pageName]}` : "",
    params ? `Page parameters: ${params}` : "",
    earlier.length ? `Screens visited just before: ${earlier.join(" → ")}` : "",
    visible
      ? `Visible page content, read from the user's screen:\n"""\n${visible}\n"""`
      : ""
  ]
    .filter(Boolean)
    .join("\n");
}

export function describeScreen(pageName, pathname) {
  const known = PAGE_CONTEXT[pageName];
  return `Screen: ${pageName || pathname || "unknown"} (${pathname || "/"}).${known ? ` ${known}` : ""}`;
}