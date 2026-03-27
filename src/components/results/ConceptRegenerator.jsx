import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { RefreshCw, Loader2, Sparkles, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

const TUNING_KNOBS = [
    { key: 'target_segment', label: 'Target Segment', options: ['B2C consumers', 'B2B SMBs', 'Enterprise', 'Prosumers', 'Creators', 'Developers'], placeholder: 'e.g. Small business owners' },
    { key: 'pricing_model', label: 'Pricing Model', options: ['Freemium', 'Subscription', 'Pay-per-use', 'Marketplace/commission', 'One-time purchase', 'Ad-supported'], placeholder: 'e.g. Freemium with Pro tier' },
    { key: 'platform', label: 'Platform Focus', options: ['Mobile-first (iOS+Android)', 'Web app', 'Desktop', 'Cross-platform', 'API/SDK', 'Browser extension'], placeholder: 'e.g. Mobile-first' },
    { key: 'constraint_emphasis', label: 'Constraint Emphasis', options: ['Low budget (<$10K)', 'Solo developer', 'Speed to market', 'Regulatory compliance', 'Offline-capable', 'No constraints'], placeholder: 'e.g. Solo developer, speed' },
    { key: 'solution_approach', label: 'Solution Approach', options: ['AI-powered automation', 'Community/social', 'Marketplace/platform', 'Tool/utility', 'Content/education', 'Hardware+software'], placeholder: 'e.g. AI-powered' },
    { key: 'novelty_vs_feasibility', label: 'Novelty vs Feasibility', options: ['Max novelty (moonshot)', 'Balanced', 'Max feasibility (proven model)', 'Incremental improvement', 'Category creator'], placeholder: 'e.g. Balanced' },
];

export default function ConceptRegenerator({ project, onConceptsUpdated }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [params, setParams] = useState(project.refinement_params || {});

    const handleParamChange = (key, value) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const regenerateConcepts = async () => {
        setIsGenerating(true);

        const painPoints = project.pain_points || [];
        const competitors = project.competitor_insights || [];
        const deepDiveSolutions = project.deep_dive_solutions || [];
        const previousConcepts = project.generated_concepts || [];

        const isRefinement = previousConcepts.length > 0;
        const conceptCount = isRefinement ? 3 : 5;

        // Build the tuning context
        const tuningContext = Object.entries(params)
            .filter(([_, v]) => v && v.trim())
            .map(([k, v]) => {
                const knob = TUNING_KNOBS.find(t => t.key === k);
                return `- ${knob?.label || k}: ${v}`;
            }).join('\n');

        const competitorNames = competitors.map(c => c.app_name).join(', ') || 'N/A';
        const competitorWeaknesses = competitors.flatMap(c => c.improvement_opportunities || []).slice(0, 10);

        // Build competitor strengths for context
        const competitorStrengths = competitors.flatMap(c => 
            (c.successful_features || []).slice(0, 3).map(f => `${c.app_name}: ${f}`)
        ).slice(0, 10);

        let prompt = `You are "Idea Spark" — a product strategist and concept designer who traces every concept back to explicit research evidence.\n\n`;

        prompt += `## [RUN MODE]: ${isRefinement ? 'REFINE_PREVIOUS_RUN' : 'NEW_RUN'}\n\n`;

        prompt += `## [RESEARCH ARTIFACTS]\n\n`;

        prompt += `### Problem / Pain Points (HIGH WEIGHT — every concept must address at least 2):\n`;
        prompt += `${painPoints.map((p, i) => `${i+1}. [${p.severity?.toUpperCase()}] ${p.issue}`).join('\n')}\n\n`;

        prompt += `### Audience:\n`;
        prompt += `Market: ${project.industry || 'general'}\n`;
        prompt += `Description: ${project.description || 'N/A'}\n\n`;

        prompt += `### Competitors: ${competitorNames}\n`;
        prompt += `Strengths to match or exceed:\n${competitorStrengths.map((s, i) => `${i+1}. ${s}`).join('\n')}\n`;
        prompt += `Gaps/Weaknesses to exploit:\n${competitorWeaknesses.map((w, i) => `${i+1}. ${w}`).join('\n')}\n\n`;

        if (deepDiveSolutions.length > 0) {
            prompt += `### Solutions (HIGHEST-WEIGHT INPUT — every concept MUST derive its proposed solution from at least 1 item below):\n`;
            prompt += deepDiveSolutions.map((s, i) => `${i+1}. ${s.solution} [Feasibility: ${s.feasibility}, Impact: ${s.impact_potential}, Source Pain Point: ${s.source_pain_point}]`).join('\n');
            prompt += `\n\n`;
        }

        if (tuningContext) {
            prompt += `### Constraints / Tuning Parameters (apply these as hard constraints):\n${tuningContext}\n\n`;
        }

        if (isRefinement) {
            prompt += `## [PREVIOUS CONCEPTS] (Summarize in 5 bullets, then improve):\n`;
            previousConcepts.forEach((c, i) => {
                prompt += `${i+1}. ${c.concept_name}: ${c.one_liner || c.core_solution}\n`;
            });
            prompt += `\nGenerate ${conceptCount} REVISED concepts that improve on the above based on the tuning parameters. For each revised concept, include a "what_changed" field explaining specifically what changed and why (tied back to the parameter updates).\n\n`;
        }

        prompt += `## OPERATING RULES (NON-NEGOTIABLE)
- Do NOT ignore the research artifacts above. Every concept must trace back to specific findings.
${deepDiveSolutions.length > 0 ? '- "Solutions" is the highest-weight input. Every concept must derive its proposed solution from at least 1 Solutions item — cite which one(s).\n' : ''}- Every concept must explicitly reference at least 2 pain points (use exact text from the list).
- "proposed_solution_sources" must cite WHICH specific research findings, solutions, or competitor gaps inspired the concept — not generic descriptions.
- Prefer concrete, practical solutions over generic startup language.

## OUTPUT FORMAT
Each concept must include ALL fields: concept_name, one_liner, target_user, core_solution, target_pain_points, proposed_solution_sources, key_features (5-7), differentiation, competitive_advantage, mvp_scope (in_scope + out_of_scope), risks_assumptions (3-4), validation_plan (3 quick tests), development_complexity (low/medium/high), market_potential (niche/moderate/large)${isRefinement ? ', what_changed' : ''}`;

        const schemaProps = {
            concept_name: { type: "string" },
            one_liner: { type: "string" },
            target_user: { type: "string" },
            core_solution: { type: "string" },
            target_pain_points: { type: "array", items: { type: "string" } },
            proposed_solution_sources: { type: "array", items: { type: "string" } },
            key_features: { type: "array", items: { type: "string" } },
            differentiation: { type: "string" },
            competitive_advantage: { type: "string" },
            mvp_scope: {
                type: "object",
                properties: {
                    in_scope: { type: "array", items: { type: "string" } },
                    out_of_scope: { type: "array", items: { type: "string" } }
                }
            },
            risks_assumptions: { type: "array", items: { type: "string" } },
            validation_plan: { type: "array", items: { type: "string" } },
            development_complexity: { type: "string", enum: ["low", "medium", "high"] },
            market_potential: { type: "string", enum: ["niche", "moderate", "large"] }
        };

        if (isRefinement) {
            schemaProps.what_changed = { type: "string" };
        }

        try {
            const result = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        app_concepts: {
                            type: "array",
                            items: { type: "object", properties: schemaProps }
                        }
                    },
                    required: ["app_concepts"]
                }
            });

            const newConcepts = result.app_concepts || [];

            await base44.entities.ResearchProject.update(project.id, {
                generated_concepts: newConcepts,
                refinement_params: params
            });

            onConceptsUpdated(newConcepts);
            toast.success(`Generated ${newConcepts.length} ${isRefinement ? 'refined' : 'new'} concepts!`);
        } catch (error) {
            console.error('Concept generation failed:', error);
            toast.error('Failed to generate concepts. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const hasDeepDiveSolutions = (project.deep_dive_solutions || []).length > 0;
    const isRefinement = (project.generated_concepts || []).length > 0;

    return (
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-3">
                        <SlidersHorizontal className="w-5 h-5 text-purple-400" />
                        Concept Generator
                        {isRefinement && (
                            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-xs">
                                Refinement Mode
                            </Badge>
                        )}
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-slate-400 hover:text-white"
                    >
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                </div>
                {!isOpen && (
                    <p className="text-slate-400 text-sm mt-1">
                        {hasDeepDiveSolutions 
                            ? `${project.deep_dive_solutions.length} deep dive solutions available — click to tune & regenerate`
                            : 'Run Deep Dives on pain points first for best results, or regenerate with tuning knobs'
                        }
                    </p>
                )}
            </CardHeader>

            {isOpen && (
                <CardContent className="space-y-4">
                    {hasDeepDiveSolutions && (
                        <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-3">
                            <p className="text-emerald-300 text-sm font-medium mb-2">
                                Deep Dive Solutions ({project.deep_dive_solutions.length} available)
                            </p>
                            <div className="space-y-1">
                                {project.deep_dive_solutions.slice(0, 4).map((s, i) => (
                                    <p key={i} className="text-slate-300 text-xs">
                                        • {s.solution} <span className="text-slate-500">({s.feasibility})</span>
                                    </p>
                                ))}
                                {project.deep_dive_solutions.length > 4 && (
                                    <p className="text-slate-500 text-xs">+ {project.deep_dive_solutions.length - 4} more</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-3">
                        {TUNING_KNOBS.map(knob => (
                            <div key={knob.key}>
                                <label className="text-slate-400 text-xs font-medium mb-1 block">{knob.label}</label>
                                <Select
                                    value={params[knob.key] || ''}
                                    onValueChange={(val) => handleParamChange(knob.key, val)}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200 text-sm h-9">
                                        <SelectValue placeholder={knob.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        {knob.options.map(opt => (
                                            <SelectItem key={opt} value={opt} className="text-slate-200 text-sm">
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={regenerateConcepts}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {isRefinement ? 'Refining Concepts...' : 'Generating Concepts...'}
                            </>
                        ) : (
                            <>
                                {isRefinement ? <RefreshCw className="w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                {isRefinement ? `Refine Concepts (${hasDeepDiveSolutions ? 'with Solutions' : 'with Tuning'})` : 'Generate New Concepts'}
                            </>
                        )}
                    </Button>
                </CardContent>
            )}
        </Card>
    );
}