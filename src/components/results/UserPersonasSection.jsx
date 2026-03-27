import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
    Users, 
    Sparkles, 
    Loader2, 
    RefreshCw,
    Download,
    Copy
} from "lucide-react";
import PersonaCard from "./PersonaCard";

export default function UserPersonasSection({ 
    personas, 
    painPoints, 
    projectId, 
    projectTitle, 
    industry,
    targetDemographics,
    geographicFocus,
    onPersonasUpdated 
}) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [regeneratingIndex, setRegeneratingIndex] = useState(null);
    const [localPersonas, setLocalPersonas] = useState(personas || []);

    const generatePersonas = async () => {
        if (!painPoints || painPoints.length === 0) {
            toast.error("No pain points available to generate personas");
            return;
        }

        setIsGenerating(true);

        try {
            const prompt = `Based on the following market research in the ${industry || 'general'} industry, generate 4 detailed user personas.

DO NOT create personas about "${projectTitle}" — that is an internal project name. Create personas of REAL USERS who experience these industry pain points.

**Identified Industry Pain Points:**
${painPoints.map((p, i) => `${i + 1}. ${p.issue} (Severity: ${p.severity})`).join('\n')}

**Target Demographics:** ${targetDemographics || 'General consumers'}
**Geographic Focus:** ${geographicFocus || 'Global'}

For each persona, create a realistic, relatable character that would be a target user experiencing these industry pain points. Make them diverse in age, occupation, and background. Each persona should be affected by 2-3 of the identified pain points.`;

            const result = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        personas: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    age: { type: "number" },
                                    location: { type: "string" },
                                    occupation: { type: "string" },
                                    background: { type: "string" },
                                    goals: { type: "array", items: { type: "string" } },
                                    frustrations: { type: "array", items: { type: "string" } },
                                    tech_savviness: { type: "string", enum: ["low", "medium", "high"] },
                                    devices: { type: "array", items: { type: "string" } },
                                    quote: { type: "string" },
                                    behavior: { type: "string" }
                                },
                                required: ["name", "age", "location", "occupation", "background", "goals", "frustrations", "tech_savviness", "devices", "quote", "behavior"]
                            }
                        }
                    },
                    required: ["personas"]
                }
            });

            const newPersonas = result.personas || [];
            setLocalPersonas(newPersonas);

            // Save to database
            await base44.entities.ResearchProject.update(projectId, {
                generated_personas: newPersonas
            });

            onPersonasUpdated?.(newPersonas);
            toast.success(`Generated ${newPersonas.length} user personas!`);

        } catch (error) {
            console.error("Failed to generate personas:", error);
            toast.error("Failed to generate personas. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const regeneratePersona = async (index) => {
        setRegeneratingIndex(index);

        try {
            const currentPersona = localPersonas[index];
            
            const prompt = `Generate a NEW and DIFFERENT user persona for the ${industry || 'general'} industry/market. 

This persona should be distinctly different from: ${currentPersona.name} (${currentPersona.occupation}).

**Industry Pain Points to address:**
${painPoints.slice(0, 4).map((p, i) => `${i + 1}. ${p.issue}`).join('\n')}

**Target Demographics:** ${targetDemographics || 'General consumers'}

Create ONE completely new persona that would be a real user in this market affected by 2-3 of these industry pain points. Make them realistic and relatable.`;

            const result = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        persona: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                age: { type: "number" },
                                location: { type: "string" },
                                occupation: { type: "string" },
                                background: { type: "string" },
                                goals: { type: "array", items: { type: "string" } },
                                frustrations: { type: "array", items: { type: "string" } },
                                tech_savviness: { type: "string", enum: ["low", "medium", "high"] },
                                devices: { type: "array", items: { type: "string" } },
                                quote: { type: "string" },
                                behavior: { type: "string" }
                            }
                        }
                    }
                }
            });

            const newPersona = result.persona;
            const updatedPersonas = [...localPersonas];
            updatedPersonas[index] = newPersona;
            setLocalPersonas(updatedPersonas);

            // Save to database
            await base44.entities.ResearchProject.update(projectId, {
                generated_personas: updatedPersonas
            });

            onPersonasUpdated?.(updatedPersonas);
            toast.success(`Regenerated persona: ${newPersona.name}`);

        } catch (error) {
            console.error("Failed to regenerate persona:", error);
            toast.error("Failed to regenerate persona. Please try again.");
        } finally {
            setRegeneratingIndex(null);
        }
    };

    const exportPersonas = () => {
        if (localPersonas.length === 0) return;

        let content = `USER PERSONAS - ${projectTitle}\n`;
        content += `Industry: ${industry || 'General'}\n`;
        content += `Generated: ${new Date().toLocaleDateString()}\n`;
        content += `${'='.repeat(50)}\n\n`;

        localPersonas.forEach((persona, i) => {
            content += `PERSONA ${i + 1}: ${persona.name}\n`;
            content += `${'-'.repeat(40)}\n`;
            content += `Age: ${persona.age} | Location: ${persona.location}\n`;
            content += `Occupation: ${persona.occupation}\n`;
            content += `Tech Savviness: ${persona.tech_savviness}\n\n`;
            content += `"${persona.quote}"\n\n`;
            content += `Background:\n${persona.background}\n\n`;
            content += `Goals:\n${persona.goals?.map(g => `• ${g}`).join('\n')}\n\n`;
            content += `Frustrations:\n${persona.frustrations?.map(f => `• ${f}`).join('\n')}\n\n`;
            content += `Current Behavior:\n${persona.behavior}\n\n`;
            content += `Devices: ${persona.devices?.join(', ')}\n`;
            content += `\n${'='.repeat(50)}\n\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectTitle.replace(/[^a-z0-9]/gi, '_')}_Personas.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success("Personas exported!");
    };

    const copyPersonas = () => {
        if (localPersonas.length === 0) return;

        const content = localPersonas.map(p => 
            `${p.name} (${p.age}, ${p.occupation}): "${p.quote}"`
        ).join('\n\n');

        navigator.clipboard.writeText(content);
        toast.success("Personas summary copied!");
    };

    return (
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle className="text-white flex items-center gap-3">
                        <Users className="w-5 h-5 text-indigo-400" />
                        User Personas
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {localPersonas.length > 0 && (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={copyPersonas}
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={exportPersonas}
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    Export
                                </Button>
                            </>
                        )}
                        <Button
                            size="sm"
                            onClick={generatePersonas}
                            disabled={isGenerating}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : localPersonas.length > 0 ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Regenerate All
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Personas
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {localPersonas.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-white text-lg font-medium mb-2">No Personas Yet</h3>
                        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                            Generate AI-powered user personas based on the identified pain points to better understand your target audience.
                        </p>
                        <Button
                            onClick={generatePersonas}
                            disabled={isGenerating}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating Personas...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate User Personas
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {localPersonas.map((persona, index) => (
                            <PersonaCard
                                key={index}
                                persona={persona}
                                index={index}
                                onRegenerate={regeneratePersona}
                                isRegenerating={regeneratingIndex === index}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}