import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResearchProject } from "@/entities/ResearchProject";
import { canPerformAction, incrementUsage } from "@/components/utils/pricing";
import { runMasterPrompt, MASTER_STEPS } from "@/lib/masterPrompt";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Check, Loader2, Sparkles, Wand2, ClipboardPaste } from "lucide-react";
import { createPageUrl } from "@/utils";
import PricingDrawer from "@/components/pricing/PricingDrawer";

const FILLED = [
  "Project name, industry and market description",
  "10 researched pain points with quotes",
  "5 direct competitors and their gaps",
  "3 user personas",
  "5 app concepts with MVP scope and validation tests",
  "Market snapshot, opportunities, risks and strategy"
];

export default function MasterPrompt() {
  const navigate = useNavigate();
  const [promptText, setPromptText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState({});
  const [showPricingDrawer, setShowPricingDrawer] = useState(false);

  const handleStep = (key, status) => {
    setSteps((prev) => ({ ...prev, [key]: status }));
  };

  const handleGenerate = async () => {
    if (!promptText.trim()) {
      toast.error("Paste your prompt first");
      return;
    }

    const { allowed, reason } = await canPerformAction("create_project");
    if (!allowed) {
      toast.error(reason);
      setShowPricingDrawer(true);
      return;
    }

    setIsRunning(true);
    setSteps({});

    try {
      const payload = await runMasterPrompt(promptText, handleStep);
      const project = await ResearchProject.create(payload);
      await incrementUsage("project");
      toast.success("Everything is pre-filled — review and adjust below");
      navigate(createPageUrl(`ResearchResults?id=${project.id}`));
    } catch (error) {
      console.error("Master prompt failed:", error);
      toast.error("Could not pre-fill your project. Please try again.", {
        description: error.message,
        duration: 8000
      });
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen app-background">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="text-slate-300 hover:text-white hover:bg-slate-800 mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Wand2 className="w-7 h-7 text-purple-400" />
            Pre-fill from your own prompt
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Paste one prompt — the one you already use — and Idea Spark fills every section of a research
            project from it. Review what it produced, then adjust anything you don't like.
          </p>
        </div>

        <Card className="card-secondary mb-6">
          <CardContent className="p-4 md:p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-2">
                <ClipboardPaste className="w-4 h-4 text-blue-400" />
                Your prompt
              </label>
              <Textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                disabled={isRunning}
                placeholder="Paste your prompt here — the idea, the audience, the problem, the constraints, whatever you normally write."
                className="min-h-[220px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
              />
              <p className="text-xs text-slate-500 mt-2">
                The more specific your prompt, the closer the first draft will be.
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
              <p className="text-sm font-semibold text-white mb-2">What gets pre-filled</p>
              <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                {FILLED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isRunning || !promptText.trim()}
              className="gradient-button w-full h-12 text-base font-semibold"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Pre-filling your project...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Full Project
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {isRunning && (
          <Card className="card-secondary">
            <CardContent className="p-4 md:p-6">
              <p className="text-sm font-semibold text-white mb-4">Working through the research</p>
              <div className="space-y-3">
                {MASTER_STEPS.map((step) => {
                  const status = steps[step.key];
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      {status === "done" ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      ) : status === "running" ? (
                        <Loader2 className="w-6 h-6 text-purple-400 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-600 flex-shrink-0" />
                      )}
                      <span className={status === "done" ? "text-slate-400 text-sm" : "text-white text-sm"}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-4">
                This takes a minute or two — each step researches a different part of the project.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <PricingDrawer open={showPricingDrawer} onClose={() => setShowPricingDrawer(false)} />
    </div>
  );
}