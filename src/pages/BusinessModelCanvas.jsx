import React, { useState, useEffect } from "react";
import { ResearchProject } from "@/entities/ResearchProject";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Home, Save, Loader2, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import CanvasCell from "@/components/canvas/CanvasCell";
import AiSuggestionPanel from "@/components/canvas/AiSuggestionPanel";
import {
  Target, Users, DollarSign, Heart, Truck, Handshake,
  Megaphone, PiggyBank, Wrench
} from "lucide-react";

const CANVAS_SECTIONS = [
  { key: "key_partners", title: "Key Partners", icon: Handshake, color: "purple" },
  { key: "key_activities", title: "Key Activities", icon: Wrench, color: "blue" },
  { key: "value_proposition", title: "Value Proposition", icon: Heart, color: "rose" },
  { key: "customer_relationships", title: "Customer Relationships", icon: Users, color: "cyan" },
  { key: "customer_segments", title: "Customer Segments", icon: Target, color: "emerald" },
  { key: "key_resources", title: "Key Resources", icon: LayoutGrid, color: "indigo" },
  { key: "channels", title: "Channels", icon: Megaphone, color: "amber" },
  { key: "cost_structure", title: "Cost Structure", icon: PiggyBank, color: "orange" },
  { key: "revenue_streams", title: "Revenue Streams", icon: DollarSign, color: "teal" },
];

function buildInitialCanvas(concept) {
  return {
    key_partners: "",
    key_activities: (concept.key_features || []).join("\n• ") ? "• " + (concept.key_features || []).join("\n• ") : "",
    value_proposition: concept.core_solution || "",
    customer_relationships: "",
    customer_segments: concept.target_user || (concept.target_pain_points || []).join(", ") || "",
    key_resources: "",
    channels: "",
    cost_structure: concept.development_complexity ? `Development complexity: ${concept.development_complexity}` : "",
    revenue_streams: concept.market_potential ? `Market potential: ${concept.market_potential}` : "",
  };
}

export default function BusinessModelCanvas() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [concept, setConcept] = useState(null);
  const [conceptIndex, setConceptIndex] = useState(null);
  const [canvas, setCanvas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [aiPanel, setAiPanel] = useState({ open: false, section: null });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("project");
    const idx = params.get("concept");
    if (projectId && idx !== null) {
      setConceptIndex(parseInt(idx));
      fetchData(projectId, parseInt(idx));
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchData = async (projectId, idx) => {
    setIsLoading(true);
    const projectData = await ResearchProject.get(projectId);
    setProject(projectData);
    const c = projectData?.generated_concepts?.[idx];
    if (c) {
      setConcept(c);
      // Use saved canvas if it exists, otherwise build from concept
      setCanvas(c.business_model_canvas || buildInitialCanvas(c));
    }
    setIsLoading(false);
  };

  const updateCell = (key, value) => {
    setCanvas(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updatedConcepts = [...project.generated_concepts];
    updatedConcepts[conceptIndex] = {
      ...updatedConcepts[conceptIndex],
      business_model_canvas: canvas,
    };
    await ResearchProject.update(project.id, { generated_concepts: updatedConcepts });
    setHasChanges(false);
    setIsSaving(false);
    toast.success("Business Model Canvas saved!");
  };

  const handleAiRequest = (sectionTitle) => {
    setAiPanel({ open: true, section: sectionTitle });
  };

  const handleApplySuggestion = (sectionTitle, text) => {
    const section = CANVAS_SECTIONS.find(s => s.title === sectionTitle);
    if (section) {
      updateCell(section.key, text);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading Business Model Canvas...</p>
        </div>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Concept Not Found</h2>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))} className="bg-blue-600 hover:bg-blue-700">
            <Home className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0B1426 0%, #1A2332 100%)" }}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 transition-all ${aiPanel.open ? "mr-0 sm:mr-[400px]" : ""}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.history.length > 1 ? navigate(-1) : navigate(createPageUrl("Dashboard"))}
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{concept.concept_name}</h1>
              <p className="text-slate-400 text-sm">Business Model Canvas</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 flex-shrink-0"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? "Saving..." : "Save Canvas"}
          </Button>
        </div>

        {/* Canvas Grid — follows standard BMC layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Row 1: Key Partners | Key Activities + Key Resources | Value Proposition | Customer Relationships + Channels | Customer Segments */}
          <div className="md:row-span-2">
            <CanvasCell {...sectionProps("key_partners")} value={canvas.key_partners} onChange={v => updateCell("key_partners", v)} onAiRequest={handleAiRequest} />
          </div>
          <div>
            <CanvasCell {...sectionProps("key_activities")} value={canvas.key_activities} onChange={v => updateCell("key_activities", v)} onAiRequest={handleAiRequest} />
          </div>
          <div className="md:row-span-2">
            <CanvasCell {...sectionProps("value_proposition")} value={canvas.value_proposition} onChange={v => updateCell("value_proposition", v)} onAiRequest={handleAiRequest} />
          </div>
          <div>
            <CanvasCell {...sectionProps("customer_relationships")} value={canvas.customer_relationships} onChange={v => updateCell("customer_relationships", v)} onAiRequest={handleAiRequest} />
          </div>
          <div className="md:row-span-2">
            <CanvasCell {...sectionProps("customer_segments")} value={canvas.customer_segments} onChange={v => updateCell("customer_segments", v)} onAiRequest={handleAiRequest} />
          </div>

          {/* Row 2 (fills in gaps) */}
          <div>
            <CanvasCell {...sectionProps("key_resources")} value={canvas.key_resources} onChange={v => updateCell("key_resources", v)} onAiRequest={handleAiRequest} />
          </div>
          <div>
            <CanvasCell {...sectionProps("channels")} value={canvas.channels} onChange={v => updateCell("channels", v)} onAiRequest={handleAiRequest} />
          </div>

          {/* Row 3: Cost Structure (2.5 cols) | Revenue Streams (2.5 cols) */}
          <div className="md:col-span-2">
            <CanvasCell {...sectionProps("cost_structure")} value={canvas.cost_structure} onChange={v => updateCell("cost_structure", v)} onAiRequest={handleAiRequest} />
          </div>
          <div className="md:col-span-3">
            <CanvasCell {...sectionProps("revenue_streams")} value={canvas.revenue_streams} onChange={v => updateCell("revenue_streams", v)} onAiRequest={handleAiRequest} />
          </div>
        </div>
      </div>

      {/* AI Suggestion Panel */}
      <AiSuggestionPanel
        isOpen={aiPanel.open}
        onClose={() => setAiPanel({ open: false, section: null })}
        section={aiPanel.section}
        concept={concept}
        project={project}
        onApplySuggestion={handleApplySuggestion}
      />
    </div>
  );
}

function sectionProps(key) {
  const s = CANVAS_SECTIONS.find(sec => sec.key === key);
  return { title: s.title, icon: s.icon, color: s.color };
}