import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ClipboardCheck,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { analyzeAndSave } from "@/lib/vaultAnalysis";
import DocumentReviewPanel from "./DocumentReviewPanel";

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

export default function DocumentCard({ document, project, onAnalyzed, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const insights = document.extracted_insights || [];
  const isAnalyzed = document.status === "analyzed" && insights.length > 0;
  const hasReview = (document.app_review?.suggestions || []).length > 0;

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const result = await analyzeAndSave(document, project);
      onAnalyzed(document.id, result);
      setExpanded(true);
      toast.success(
        `${isAnalyzed ? "Re-analyzed" : "Extracted"} — ${result.insights.length} insights, ${
          result.app_review.suggestions.length
        } review suggestions`
      );
    } catch (error) {
      toast.error("Analysis failed — please try again");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    await base44.entities.VaultDocument.delete(document.id);
    toast.success("Document deleted");
    onDelete(document.id);
  };

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
              {hasReview && (
                <Badge className="bg-emerald-600/20 text-emerald-300 border-0 text-xs">
                  <ClipboardCheck className="w-3 h-3 mr-1" />
                  Review ready
                </Badge>
              )}
              {insights.some((i) => i.matched_pain_point) && (
                <Badge className="bg-purple-600/20 text-purple-300 border-0 text-xs">Linked</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            {!isAnalyzed ? (
              <Button
                size="sm"
                onClick={runAnalysis}
                disabled={analyzing || !document.raw_text}
                className="gradient-button text-xs px-3"
              >
                {analyzing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Brain className="w-3 h-3 mr-1" />
                    Extract
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={runAnalysis}
                disabled={analyzing || !document.raw_text}
                className="border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs px-3"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Re-analyze
                  </>
                )}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="text-slate-400 hover:text-red-400"
            >
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
            {expanded ? "Hide insights & review" : "Show insights & review"}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>

          {expanded && <DocumentReviewPanel document={document} />}
        </CardContent>
      )}
    </Card>
  );
}