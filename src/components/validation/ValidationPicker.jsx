import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2, ShieldCheck } from "lucide-react";

export default function ValidationPicker({
  projects,
  projectId,
  conceptIndex,
  onProjectChange,
  onConceptChange,
  onRun,
  isRunning
}) {
  const project = projects.find((p) => p.id === projectId);
  const concepts = project?.generated_concepts || [];
  const canRun = Boolean(projectId) && conceptIndex !== "" && !isRunning;

  return (
    <div className="card-secondary p-4 md:p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            1 · Research project
          </label>
          <Select
            value={projectId || undefined}
            onValueChange={onProjectChange}
            disabled={isRunning}
          >
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Choose a project" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            2 · Concept
          </label>
          <Select
            value={conceptIndex === "" ? undefined : String(conceptIndex)}
            onValueChange={(v) => onConceptChange(Number(v))}
            disabled={isRunning || concepts.length === 0}
          >
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue
                placeholder={projectId ? "Choose a concept" : "Pick a project first"}
              />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {concepts.map((c, i) => (
                <SelectItem key={i} value={String(i)}>
                  {c.concept_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {projectId && concepts.length === 0 && (
            <p className="text-xs text-amber-400 mt-2">
              This project has no concepts yet — generate some in New Research first.
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={onRun}
        disabled={!canRun}
        className="gradient-button w-full h-12 text-base font-semibold"
      >
        {isRunning ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Checking the evidence...
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5 mr-2" />
            Run Validation
          </>
        )}
      </Button>
      <p className="text-xs text-slate-500 text-center">
        Takes about a minute. Scores are based on evidence it can find — missing evidence lowers the score.
      </p>
    </div>
  );
}