import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Download, Lightbulb, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import ConceptExportCard from "@/components/export/ConceptExportCard";

export default function ConceptExport() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.ResearchProject.list('-created_date', 20);
        setProjects(data.filter(p => p.generated_concepts?.length > 0));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const allConcepts = projects.flatMap(p =>
    (p.generated_concepts || []).map(c => ({ ...c, projectTitle: p.title }))
  );

  const downloadAll = () => {
    let text = "=== IDEA SPARK — FULL CONCEPT EXPORT ===\n";
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `Total Concepts: ${allConcepts.length}\n\n`;

    projects.forEach(project => {
      if (!project.generated_concepts?.length) return;
      text += `${"=".repeat(80)}\nPROJECT: ${project.title}\nIndustry: ${project.industry || 'General'}\n${"=".repeat(80)}\n\n`;
      project.generated_concepts.forEach((concept, i) => {
        text += buildConceptText(concept, project, i + 1);
      });
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idea-spark-all-concepts-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Full export downloaded!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-400">Loading concepts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Concept Export</h1>
              <p className="text-slate-400 text-sm">{allConcepts.length} concepts across {projects.length} projects</p>
            </div>
          </div>
          {allConcepts.length > 0 && (
            <Button onClick={downloadAll} className="bg-amber-600 hover:bg-amber-700 text-white">
              <Download className="w-4 h-4 mr-2" /> Download Everything (.txt)
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.id}>
              <button
                onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-800/60 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-3 text-left">
                  <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <h2 className="text-lg font-bold text-white">{project.title}</h2>
                    <p className="text-slate-400 text-sm">{project.industry || 'General'} · {project.generated_concepts?.length || 0} concepts</p>
                  </div>
                </div>
                {expandedProject === project.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {expandedProject === project.id && (
                <div className="mt-3 space-y-4 pl-2">
                  {project.generated_concepts.map((concept, idx) => (
                    <ConceptExportCard key={idx} concept={concept} project={project} index={idx + 1} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20">
            <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No concepts generated yet. Start a research project first!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function buildConceptText(concept, project, num) {
  return `
${"─".repeat(60)}
CONCEPT ${num}: ${concept.concept_name}
${"─".repeat(60)}
ONE-LINER: ${concept.one_liner}
TARGET USER: ${concept.target_user}
MARKET POTENTIAL: ${concept.market_potential || 'N/A'}
COMPLEXITY: ${concept.development_complexity || 'N/A'}

CORE SOLUTION:
${concept.core_solution}

KEY FEATURES:
${(concept.key_features || []).map((f, i) => `  ${i + 1}. ${f}`).join('\n')}

PAIN POINTS:
${(concept.target_pain_points || []).map(p => `  • ${p}`).join('\n')}

DIFFERENTIATION: ${concept.differentiation}
COMPETITIVE ADVANTAGE: ${concept.competitive_advantage}

MVP IN SCOPE:
${(concept.mvp_scope?.in_scope || []).map(s => `  ✓ ${s}`).join('\n')}

MVP OUT OF SCOPE:
${(concept.mvp_scope?.out_of_scope || []).map(s => `  ✗ ${s}`).join('\n')}

RISKS:
${(concept.risks_assumptions || []).map(r => `  ⚠ ${r}`).join('\n')}

VALIDATION:
${(concept.validation_plan || []).map((v, i) => `  ${i + 1}. ${v}`).join('\n')}

ARCHITECT PROMPT:
${buildPrompt('architect', concept, project)}

BUILDER PROMPT:
${buildPrompt('builder', concept, project)}

`;
}

function buildPrompt(type, concept, project) {
  if (type === 'architect') {
    return `You are an expert software architect. Design the complete system architecture for "${concept.concept_name}".
Project: ${concept.concept_name} | Industry: ${project.industry || 'General'}
One-liner: ${concept.one_liner}
Core Solution: ${concept.core_solution}
Target User: ${concept.target_user}
Key Features: ${(concept.key_features || []).map((f, i) => `${i + 1}. ${f}`).join(', ')}
MVP In Scope: ${(concept.mvp_scope?.in_scope || []).join(', ')}
MVP Out of Scope: ${(concept.mvp_scope?.out_of_scope || []).join(', ')}
Differentiation: ${concept.differentiation}
Tasks: 1) System Requirements 2) Architecture Overview 3) Data Models 4) API Endpoints 5) Frontend Structure 6) User Journeys 7) Feature Priority Matrix 8) Risk Register`;
  }
  return `You are an expert developer. Build "${concept.concept_name}".
Stack: React + Tailwind CSS + Base44 Backend
What it does: ${concept.core_solution}
Target User: ${concept.target_user}
Features: ${(concept.key_features || []).map((f, i) => `${i + 1}. ${f}`).join(', ')}
MVP Build: ${(concept.mvp_scope?.in_scope || []).join(', ')}
Do NOT Build: ${(concept.mvp_scope?.out_of_scope || []).join(', ')}
Rules: Follow architecture, one module at a time, clean code, handle errors.`;
}