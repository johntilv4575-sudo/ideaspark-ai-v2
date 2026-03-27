import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Archive, Brain, Loader2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

import DocumentUploadForm from "../components/vault/DocumentUploadForm";
import DocumentCard from "../components/vault/DocumentCard";

export default function ResearchVault() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [bulkExtracting, setBulkExtracting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [docs, projs] = await Promise.all([
        base44.entities.VaultDocument.list("-created_date"),
        base44.entities.ResearchProject.list("-created_date")
      ]);
      setDocuments(docs);
      setProjects(projs);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleDocumentCreated = (doc) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  const handleExtract = (docId, insights) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, extracted_insights: insights, status: "analyzed" } : d
      )
    );
  };

  const handleDelete = (docId) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleBulkExtract = async () => {
    const unanalyzed = filteredDocs.filter((d) => d.status !== "analyzed" && d.raw_text);
    if (unanalyzed.length === 0) {
      toast.info("All documents are already analyzed");
      return;
    }
    setBulkExtracting(true);
    for (const doc of unanalyzed) {
      const painPoints = getPainPointsForDoc(doc);
      const painPointsList = painPoints.map((pp) => pp.issue).join(", ");

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this document (category: "${doc.category}") and extract 3-8 key insights.

Document: """${doc.raw_text?.substring(0, 4000)}"""

${painPointsList ? `Existing pain points: ${painPointsList}` : ""}

For each insight provide: insight text, type (pain_point/opportunity/user_need/competitor_info/trend), severity (low/medium/high), matched_pain_point (exact matching text or empty string).`,
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
      await base44.entities.VaultDocument.update(doc.id, {
        extracted_insights: insights,
        status: "analyzed"
      });
      handleExtract(doc.id, insights);
    }
    setBulkExtracting(false);
    toast.success(`Extracted insights from ${unanalyzed.length} documents`);
  };

  const getPainPointsForDoc = (doc) => {
    if (!doc.project_id || doc.project_id === "none") return [];
    const project = projects.find((p) => p.id === doc.project_id);
    return project?.pain_points || [];
  };

  const filteredDocs = documents.filter((d) => {
    if (filterCategory !== "all" && d.category !== filterCategory) return false;
    if (filterProject !== "all" && d.project_id !== filterProject) return false;
    return true;
  });

  const totalInsights = documents.reduce((sum, d) => sum + (d.extracted_insights?.length || 0), 0);
  const analyzedCount = documents.filter((d) => d.status === "analyzed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <Archive className="w-7 h-7 text-indigo-400" />
                Research Vault
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Upload documents & extract AI-powered insights
              </p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{documents.length}</div>
            <div className="text-xs text-slate-400">Documents</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{analyzedCount}</div>
            <div className="text-xs text-slate-400">Analyzed</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{totalInsights}</div>
            <div className="text-xs text-slate-400">Insights</div>
          </div>
        </div>

        {/* Upload form */}
        <div className="mb-6">
          <DocumentUploadForm projects={projects} onDocumentCreated={handleDocumentCreated} />
        </div>

        {/* Filters + Bulk actions */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-44 bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="interview_notes">Interview Notes</SelectItem>
              <SelectItem value="survey_results">Survey Results</SelectItem>
              <SelectItem value="user_feedback">User Feedback</SelectItem>
              <SelectItem value="market_report">Market Report</SelectItem>
              <SelectItem value="competitor_analysis">Competitor Analysis</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-44 bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={handleBulkExtract}
            disabled={bulkExtracting}
            className="gradient-button ml-auto"
          >
            {bulkExtracting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-1" />
                Extract All
              </>
            )}
          </Button>
        </div>

        {/* Document list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/3 mb-3" />
                <div className="h-3 bg-slate-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-12">
            <Archive className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No documents yet. Upload your first one above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                projectPainPoints={getPainPointsForDoc(doc)}
                onExtract={handleExtract}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}