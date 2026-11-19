import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  AlertTriangle,
  Lightbulb,
  Users,
  Target,
  TrendingUp,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "sonner";

const INSIGHT_ICONS = {
  pain_point: AlertTriangle,
  opportunity: Lightbulb,
  user_need: Users,
  competitor_info: Target,
  trend: TrendingUp,
};

const SEVERITY_COLORS = {
  high: "bg-red-600/20 text-red-300",
  medium: "bg-amber-600/20 text-amber-300",
  low: "bg-green-600/20 text-green-300",
};

const copyText = (text, label) => {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied`);
};

export default function DocumentReviewPanel({ document }) {
  const insights = document.extracted_insights || [];
  const review = document.app_review || null;
  const suggestions = review?.suggestions || [];

  const insightsText = insights
    .map(
      (i, idx) =>
        `${idx + 1}. [${(i.type || "insight").replace("_", " ")} · ${i.severity || "medium"}] ${i.insight}`
    )
    .join("\n");

  const suggestionLines = (items) =>
    items
      .map(
        (s, idx) =>
          `${idx + 1}. ${s.area}${s.severity ? ` (${s.severity})` : ""}\n   Finding: ${s.finding}\n   Suggestion: ${s.suggestion}`
      )
      .join("\n");

  const suggestionsText = review
    ? [
        `App review suggestions — ${document.title}`,
        review.baseline_note || "",
        review.summary ? `\nSummary: ${review.summary}` : "",
        suggestions.length ? `\n${suggestionLines(suggestions)}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <div className="space-y-4 mt-3">
      {/* Source insights */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-slate-300">Source insights</h4>
          {insights.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyText(insightsText, "Insights")}
              className="text-slate-400 hover:text-white text-xs h-7 px-2"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy insights
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {insights.length === 0 && (
            <p className="text-slate-500 text-sm">No insights extracted yet.</p>
          )}
          {insights.map((insight, idx) => {
            const Icon = INSIGHT_ICONS[insight.type] || Lightbulb;
            return (
              <div key={idx} className="bg-slate-900/50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm">{insight.insight}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge
                        className={`${SEVERITY_COLORS[insight.severity] || SEVERITY_COLORS.medium} border-0 text-xs`}
                      >
                        {insight.severity}
                      </Badge>
                      <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                        {insight.type?.replace("_", " ")}
                      </Badge>
                      {insight.matched_pain_point && (
                        <Badge className="bg-purple-600/20 text-purple-300 border-0 text-xs">
                          Matches: {insight.matched_pain_point.substring(0, 40)}...
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* App review suggestions */}
      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-400" />
              App review suggestions
            </h4>
            {review && (
              <p className="text-xs text-slate-500 mt-1">
                {review.baseline_note}
                {review.generated_at
                  ? ` · ${new Date(review.generated_at).toLocaleDateString()}`
                  : ""}
              </p>
            )}
          </div>
          {suggestions.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyText(suggestionsText, "Suggestions")}
              className="text-slate-400 hover:text-white text-xs h-7 px-2 flex-shrink-0"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy all
            </Button>
          )}
        </div>

        {!review && (
          <p className="text-slate-500 text-sm">
            No app review yet — re-analyze this document to compare its findings with the original
            concept.
          </p>
        )}

        {review?.summary && (
          <p className="text-slate-300 text-sm bg-slate-900/50 rounded-lg p-3 mb-2">
            {review.summary}
          </p>
        )}

        {review && suggestions.length === 0 && (
          <p className="text-slate-500 text-sm">
            No drift found against the saved concept — nothing to review.
          </p>
        )}

        <div className="space-y-2">
          {suggestions.map((s, idx) => (
            <div key={idx} className="bg-slate-900/50 p-3 rounded-lg">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <Badge className="bg-emerald-600/20 text-emerald-300 border-0 text-xs">
                    {s.area}
                  </Badge>
                  <Badge
                    className={`${SEVERITY_COLORS[s.severity] || SEVERITY_COLORS.medium} border-0 text-xs`}
                  >
                    {s.severity}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    copyText(
                      `${s.area}${s.severity ? ` (${s.severity})` : ""}\nFinding: ${s.finding}\nSuggestion: ${s.suggestion}`,
                      "Suggestion"
                    )
                  }
                  className="text-slate-400 hover:text-white text-xs h-7 px-2 flex-shrink-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-slate-400 text-xs mt-2">
                <span className="text-slate-500">Finding: </span>
                {s.finding}
              </p>
              <p className="text-slate-200 text-sm mt-1">{s.suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}