import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Loader2, Trash2, ChevronDown, ChevronUp, AlertTriangle, Lightbulb, TrendingUp, Users, Target } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const CATEGORY_LABELS = {
  interview_notes: "Interview Notes",
  survey_results: "Survey Results",
  user_feedback: "User Feedback",
  market_report: "Market Report",
  competitor_analysis: "Competitor Analysis",
  other: "Other",
};

const CATEGORY_COLORS = {
  interview_notes: "bg-blue-600/20 text-blue-300",
  survey_results: "bg-purple-600/20 text-purple-300",
  user_feedback: "bg-green-600/20 text-green-300",
  market_report: "bg-amber-600/20 text-amber-300",
  competitor_analysis: "bg-red-600/20 text-red-300",
  other: "bg-slate-600/20 text-slate-300",
};

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

export default function DocumentCard({ document, projectPainPoints, onExtract, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const handleExtract = async () => {
    setExtracting(true);
    
    const painPointsList = (projectPainPoints || []).map(pp => pp.issue).join(", ");

    const prompt = `Analyze this document and extract key insights. The document is categorized as "${document.category}".

Document content:
"""
${document.raw_text?.substring(0, 4000) || "No text content available"}
"""

${painPointsList ? `Existing pain points from the project: ${painPointsList}` : "No existing pain points to match against."}

Extract 3-8 key insights. For each insight, determine:
1. The insight text (concise, actionable)
2. Type: pain_point, opportunity, user_need, competitor_info, or trend
3. Severity: low, medium, or high
4. If it matches an existing pain point, include the exact matching pain point text in matched_pain_point (otherwise leave empty string)`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: "gemini_3_flash",
      response_json_schema: {
        type: "object",
        properties: {
          insights: {
            type: "array",
            items: {
              type: "object",
              properties: {
                insight: { type: "string" },
                type: { type: "string" },
                severity: { type: "string" },
                matched_pain_point: { type: "string" }
              }
            }
          }
        }
      }
    });

    const insights = result?.insights || [];
    
    await base44.entities.VaultDocument.update(document.id, {
      extracted_insights: insights,
      status: "analyzed"
    });

    setExtracting(false);
    toast.success(`Extracted ${insights.length} insights!`);
    onExtract(document.id, insights);
  };

  const handleDelete = async () => {
    await base44.entities.VaultDocument.delete(document.id);
    toast.success("Document deleted");
    onDelete(document.id);
  };

  const insights = document.extracted_insights || [];
  const isAnalyzed = document.status === "analyzed" && insights.length > 0;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-white text-base truncate">{document.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={`${CATEGORY_COLORS[document.category]} border-0 text-xs`}>
                {CATEGORY_LABELS[document.category]}
              </Badge>
              {isAnalyzed && (
                <Badge className="bg-green-600/20 text-green-300 border-0 text-xs">
                  {insights.length} insights
                </Badge>
              )}
              {insights.some(i => i.matched_pain_point) && (
                <Badge className="bg-purple-600/20 text-purple-300 border-0 text-xs">
                  Linked
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            {!isAnalyzed && (
              <Button
                size="sm"
                onClick={handleExtract}
                disabled={extracting || !document.raw_text}
                className="gradient-button text-xs px-3"
              >
                {extracting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Brain className="w-3 h-3 mr-1" />
                    Extract
                  </>
                )}
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={handleDelete} className="text-slate-400 hover:text-red-400">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isAnalyzed && (
        <CardContent className="pt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-slate-400 hover:text-white w-full justify-between text-xs"
          >
            {expanded ? "Hide Insights" : "Show Insights"}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
          
          {expanded && (
            <div className="space-y-2 mt-2">
              {insights.map((insight, idx) => {
                const Icon = INSIGHT_ICONS[insight.type] || Lightbulb;
                return (
                  <div key={idx} className="bg-slate-900/50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Icon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 text-sm">{insight.insight}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge className={`${SEVERITY_COLORS[insight.severity] || SEVERITY_COLORS.medium} border-0 text-xs`}>
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
          )}
        </CardContent>
      )}
    </Card>
  );
}