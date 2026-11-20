import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { ResearchProject } from "@/entities/ResearchProject";
import { runConceptValidation, CRITERIA, VERDICTS } from "@/lib/validation";
import ValidationPicker from "@/components/validation/ValidationPicker";
import ValidationReport from "@/components/validation/ValidationReport";
import ValidationCard from "@/components/validation/ValidationCard";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Scale, Wallet, Wrench, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const HOW_IT_HELPS = [
  {
    icon: Scale,
    title: "Choosing which app to build",
    text: "Compares your concepts on the things that decide if an app sells, so you pick the one with evidence behind it instead of the one that sounds best."
  },
  {
    icon: Wallet,
    title: "Knowing if it can be sold",
    text: "Names the buyer, a realistic price and the first channel, so you know who to approach before you spend a month building."
  },
  {
    icon: Wrench,
    title: "Knowing what to fix first",
    text: "Shows what the research proves, what you are only assuming, and the three cheapest tests that would settle it."
  }
];

export default function Validation() {
  const [projects, setProjects] = useState([]);
  const [validations, setValidations] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [conceptIndex, setConceptIndex] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [active, setActive] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("project");
    const c = params.get("concept");
    if (p) setProjectId(p);
    if (c !== null && c !== "") setConceptIndex(Number(c));

    (async () => {
      const [projectList, validationPage] = await Promise.all([
        ResearchProject.list(),
        base44.entities.ConceptValidation.list({ sort: "-created_date", limit: 50 })
      ]);
      setProjects(projectList || []);
      setValidations(validationPage?.items || []);
      setIsLoading(false);
    })();
  }, []);

  const handleRun = async () => {
    const project = projects.find((p) => p.id === projectId);
    const concept = project?.generated_concepts?.[conceptIndex];
    if (!project || !concept) {
      toast.error("Choose a project and a concept first");
      return;
    }

    setIsRunning(true);
    try {
      const payload = await runConceptValidation(concept, project);
      const saved = await base44.entities.ConceptValidation.create(payload);
      setValidations((prev) => [saved, ...prev]);
      setActive(saved);
      toast.success("Validation report ready");
    } catch (error) {
      console.error("Validation failed:", error);
      toast.error("Could not validate that concept. Please try again.", {
        description: error.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen app-background">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            Validation
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Validation answers one question: should you build this app, and can you sell it? It scores
            a concept against the five things that decide that, then writes a report telling you what
            to fix or test next.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {HOW_IT_HELPS.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-700 bg-slate-800/40 p-3">
              <item.icon className="w-4 h-4 text-purple-400 mb-2" />
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="text-xs text-slate-400 mt-1">{item.text}</p>
            </div>
          ))}
        </div>

        <ValidationPicker
          projects={projects}
          projectId={projectId}
          conceptIndex={conceptIndex}
          onProjectChange={(id) => {
            setProjectId(id);
            setConceptIndex("");
          }}
          onConceptChange={setConceptIndex}
          onRun={handleRun}
          isRunning={isRunning}
        />

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mt-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            {active?.project_id && (
              <div className="mb-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-300">
                  Verdict:{" "}
                  <span className="font-semibold text-white">
                    {VERDICTS[active.verdict]?.label || active.verdict}
                  </span>{" "}
                  — next, take it into the blueprint.
                </p>
                <Link
                  to={`/ConceptDetails?project=${active.project_id}&concept=${active.concept_index}`}
                  className="text-xs font-semibold text-blue-300 hover:text-blue-200 inline-flex items-center gap-1"
                >
                  Take it into the blueprint
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
            {active ? (
              <ValidationReport validation={active} />
            ) : (
              <Card className="card-secondary">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-white font-semibold">No report open</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Run a validation above, or open a previous one from the list.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="order-1 lg:order-2 space-y-3">
            <div>
              <h2 className="text-sm font-bold text-white mb-2">Previous reports</h2>
              {isLoading ? (
                <div className="h-20 rounded-xl bg-slate-800/60 animate-pulse" />
              ) : validations.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Nothing validated yet. Your reports are saved here.
                </p>
              ) : (
                <div className="space-y-2">
                  {validations.map((v) => (
                    <ValidationCard
                      key={v.id}
                      validation={v}
                      isActive={active?.id === v.id}
                      onClick={() => setActive(v)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Scored on
              </p>
              <ul className="space-y-1.5">
                {CRITERIA.map((c) => (
                  <li key={c.key} className="text-xs text-slate-300">
                    <span className="font-semibold text-white">{c.label}</span> — {c.question}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}