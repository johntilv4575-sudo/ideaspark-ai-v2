import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { INDUSTRIES, findIndustry } from "@/lib/industries";

const schema = {
  type: "object",
  properties: {
    suggestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          industry_id: { type: "string" },
          why: { type: "string" },
          angle: { type: "string" }
        },
        required: ["industry_id", "why", "angle"]
      }
    }
  },
  required: ["suggestions"]
};

export default function IndustrySuggester({ onSelect, defaultContext = "" }) {
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  const run = async () => {
    const text = (idea || defaultContext).trim();
    if (!text) {
      setError("Describe what you want to build first.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are helping a founder choose the industry category for a new app or business idea.

Idea / description: "${text}"

Pick the 4 best-fitting categories from this list. Use ONLY these ids, exactly as written:
${INDUSTRIES.map((i) => `${i.value} (${i.label})`).join(", ")}

For each: explain in one short sentence why it fits, and give one concrete angle or niche to pursue inside that category. Order them best first.`,
        response_json_schema: schema
      });
      setSuggestions((result?.suggestions || []).filter((s) => findIndustry(s.industry_id)));
    } catch (e) {
      setError("Could not generate suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-semibold text-white">Not sure which industry? Ask the assistant</span>
      </div>
      <p className="text-xs text-slate-400 mb-3">
        Describe your idea in plain words and we'll suggest the best-fitting industries.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              run();
            }
          }}
          placeholder={defaultContext ? `e.g. ${defaultContext}` : "e.g. an app that helps tradies quote jobs faster"}
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
        <Button
          type="button"
          onClick={run}
          disabled={isLoading}
          className="gradient-button whitespace-nowrap"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          {isLoading ? "Thinking..." : "Suggest"}
        </Button>
      </div>

      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      {suggestions.length > 0 && (
        <div className="mt-3 space-y-2">
          {suggestions.map((s) => {
            const industry = findIndustry(s.industry_id);
            return (
              <button
                key={s.industry_id}
                type="button"
                onClick={() => onSelect?.(industry)}
                className="w-full text-left rounded-lg border border-slate-700 bg-slate-800/70 hover:border-purple-500/60 hover:bg-slate-800 p-3 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white">
                    <span className="mr-2">{industry.icon}</span>
                    {industry.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-400 mt-1">{s.why}</p>
                {s.angle && (
                  <Badge variant="outline" className="mt-2 border-slate-600 text-slate-300 text-[11px] font-normal">
                    Angle: {s.angle}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}