import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Copy, Loader2, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function AiSuggestionPanel({ isOpen, onClose, section, concept, project, onApplySuggestion }) {
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const generateSuggestion = async () => {
    setIsLoading(true);
    setSuggestion("");

    const painPointsSummary = (project.pain_points || [])
      .slice(0, 5)
      .map(p => `- ${p.issue} (severity: ${p.severity})`)
      .join("\n");

    const competitorSummary = (project.competitor_insights || [])
      .slice(0, 3)
      .map(c => `- ${c.app_name}: ${(c.successful_features || []).slice(0, 3).join(", ")}`)
      .join("\n");

    const prompt = `You are a business strategist. Based on the research data below, provide a concise, actionable suggestion for the "${section}" section of a Business Model Canvas.

CONCEPT: ${concept.concept_name}
CORE SOLUTION: ${concept.core_solution || "N/A"}
TARGET PAIN POINTS: ${(concept.target_pain_points || []).join(", ")}
KEY FEATURES: ${(concept.key_features || []).join(", ")}
INDUSTRY: ${project.industry || "general"}

RESEARCH PAIN POINTS:
${painPointsSummary || "None available"}

COMPETITOR INSIGHTS:
${competitorSummary || "None available"}

Provide a clear, bullet-point suggestion for the "${section}" section. Be specific and grounded in the research data. Keep it under 200 words.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setSuggestion(result);
    setHistory(prev => [{ section, text: result }, ...prev].slice(0, 10));
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (isOpen && section) {
      generateSuggestion();
    }
  }, [isOpen, section]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-slate-900 border-l border-slate-700 z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-white font-semibold">AI Suggestions</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {/* Current suggestion */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ChevronRight className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium text-sm">{section}</span>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-3 p-6 rounded-xl bg-slate-800/50 border border-slate-700">
              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              <span className="text-slate-300 text-sm">Analyzing research data...</span>
            </div>
          ) : suggestion ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-800/50 border border-purple-500/20 p-4">
                <ReactMarkdown className="text-slate-300 text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  {suggestion}
                </ReactMarkdown>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => { onApplySuggestion(section, suggestion); toast.success("Suggestion applied!"); }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Apply to Canvas
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { navigator.clipboard.writeText(suggestion); toast.success("Copied!"); }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateSuggestion}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Regenerate
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        {/* History */}
        {history.length > 1 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Previous Suggestions</h3>
            <div className="space-y-3">
              {history.slice(1).map((item, idx) => (
                <div key={idx} className="rounded-lg bg-slate-800/30 border border-slate-700/50 p-3">
                  <span className="text-xs text-purple-400 font-medium">{item.section}</span>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-3">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}