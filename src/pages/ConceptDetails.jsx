import React, { useState, useEffect } from "react";
import { ResearchProject, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Home, Send, Lock } from "lucide-react";
import DevelopmentBlueprint from "../components/details/DevelopmentBlueprint";
import { createAppForgeHandoffUrl, canUseHandoff, updatePipelineStatus, getPipelineStatus } from "@/components/utils/handoff";
import { canPerformAction } from "@/components/utils/pricing";
import { toast } from "sonner";
import PipelineTracker from "../components/concepts/PipelineTracker";
import PricingDrawer from "../components/pricing/PricingDrawer";
import { cn } from "@/lib/utils"; // Assuming cn utility is available from shadcn/ui

export default function ConceptDetails() {
  const navigate = useNavigate();
  const [concept, setConcept] = useState(null);
  const [project, setProject] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPricingDrawer, setShowPricingDrawer] = React.useState(false);
  const [pipelineStatus, setPipelineStatus] = React.useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("project");
    const conceptIndex = params.get("concept");

    if (projectId && conceptIndex !== null) {
      fetchData(projectId, parseInt(conceptIndex));
      
      // Load pipeline status for this concept
      const conceptId = `${projectId}_${conceptIndex}`;
      const status = getPipelineStatus(conceptId);
      setPipelineStatus(status);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchData = async (projectId, conceptIndex) => {
    setIsLoading(true);
    const [projectData, userData] = await Promise.all([
      ResearchProject.get(projectId),
      User.me()
    ]);
    setProject(projectData);
    setUser(userData);
    if (projectData && projectData.generated_concepts?.[conceptIndex]) {
      setConcept(projectData.generated_concepts[conceptIndex]);
    }
    setIsLoading(false);
  };

  const handleExport = () => {
    const printElement = document.getElementById('blueprint-content');
    if (!printElement) return;

    const clonedElement = printElement.cloneNode(true);
    const footerToRemove = clonedElement.querySelector('.blueprint-footer');
    if (footerToRemove) {
      footerToRemove.remove();
    }

    const printContent = clonedElement.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleSendToAppForge = async () => {
    const { allowed } = await canPerformAction('handoff');
    
    if (!allowed) {
      setShowPricingDrawer(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("project");
    const conceptIndex = params.get("concept");
    const conceptId = `${projectId}_${conceptIndex}`;

    // Update pipeline status
    updatePipelineStatus(conceptId, 'validation', 'App Forge');
    setPipelineStatus(getPipelineStatus(conceptId)); // Re-fetch to update state

    // Create handoff URL and open App Forge
    const handoffUrl = createAppForgeHandoffUrl(
      concept,
      project.title,
      project.industry
    );
    
    window.open(handoffUrl, '_blank');
    toast.success("Idea sent to App Forge for validation!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading concept blueprint...</p>
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
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isPremium = user?.subscription_tier !== 'free';
  const hasSuiteAccess = canUseHandoff(user);

  // Get project and concept IDs for refinement
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("project");
  const conceptIndex = parseInt(params.get("concept"));

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0B1426 0%, #1A2332 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header with CLEAR back button */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => window.history.length > 1 ? navigate(-1) : navigate(createPageUrl("Dashboard"))}
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white break-words">{concept.concept_name}</h1>
              <p className="text-slate-400 mt-1 text-xs sm:text-base">Blueprint for <span className="capitalize text-blue-300">{project.industry}</span></p>
            </div>
            <Button
              onClick={handleSendToAppForge}
              className={cn(
                "gap-2",
                hasSuiteAccess
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  : "bg-slate-700 hover:bg-slate-600"
              )}
              title={hasSuiteAccess ? "Send to App Forge" : "Requires Suite tier"}
            >
              {hasSuiteAccess ? <Send className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span className="hidden sm:inline">Send to App Forge</span>
            </Button>
          </div>

          {/* Pipeline Tracker */}
          {pipelineStatus && (
            <PipelineTracker 
              conceptId={`${projectId}_${conceptIndex}`}
              pipelineStatus={pipelineStatus}
            />
          )}
        </div>
        
        <div id="blueprint-content">
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #blueprint-content, #blueprint-content * { visibility: visible; }
              #blueprint-content { position: absolute; left: 0; top: 0; width: 100%; }
              @page { size: auto; margin: 20mm; }
              .blueprint-footer { display: none !important; }
            }
          `}</style>
          <DevelopmentBlueprint 
            concept={concept} 
            industry={project.industry}
            onExport={handleExport} 
            isPremium={isPremium}
            projectId={projectId}
            conceptIndex={conceptIndex}
          />
        </div>

        <PricingDrawer 
          open={showPricingDrawer}
          onClose={() => setShowPricingDrawer(false)}
          highlightFeature="cross-app handoffs and pipeline tracking"
        />
      </div>
    </div>
  );
}