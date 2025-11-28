import React, { useState } from 'react';
import { ResearchProject } from "@/entities/ResearchProject";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CombineConceptsModal({ concepts, onClose, onCombined }) {
    const navigate = useNavigate();
    const [isCombining, setIsCombining] = useState(false);

    const handleCombine = async () => {
        setIsCombining(true);
        
        try {
            const combinePrompt = `You are combining multiple app concepts into one innovative super-app. Analyze these concepts and create a unified, coherent app that combines the best elements:

${concepts.map((c, i) => `
CONCEPT ${i + 1}: ${c.concept_name}
Solution: ${c.core_solution}
Pain Points Addressed: ${c.target_pain_points?.join(', ')}
Key Features: ${c.key_features?.join(', ')}
Competitive Advantage: ${c.competitive_advantage}
`).join('\n')}

Create ONE unified app concept that:
1. Combines the strongest features from each concept
2. Addresses all the pain points mentioned
3. Creates synergies between the different concepts
4. Has a coherent value proposition
5. Is realistically buildable

Provide the combined concept with:
- A new name that reflects the combined solution
- A clear core solution that unifies all concepts
- Combined list of pain points addressed
- Integrated key features (merge and eliminate redundancies)
- Enhanced competitive advantage from the combination
- Assessment of development complexity
- Market potential evaluation`;

            const result = await InvokeLLM({
                prompt: combinePrompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        concept_name: { type: "string" },
                        core_solution: { type: "string" },
                        target_pain_points: {
                            type: "array",
                            items: { type: "string" }
                        },
                        key_features: {
                            type: "array",
                            items: { type: "string" }
                        },
                        competitive_advantage: { type: "string" },
                        development_complexity: {
                            type: "string",
                            enum: ["low", "medium", "high"]
                        },
                        market_potential: {
                            type: "string",
                            enum: ["niche", "moderate", "large"]
                        }
                    },
                    required: ["concept_name", "core_solution", "target_pain_points", "key_features", "competitive_advantage", "development_complexity", "market_potential"]
                }
            });

            // Create a new project for the combined concept
            const newProject = await ResearchProject.create({
                title: `Combined: ${result.concept_name}`,
                industry: 'combined',
                description: `AI-generated combination of ${concepts.length} concepts: ${concepts.map(c => c.concept_name).join(', ')}`,
                status: 'completed',
                generated_concepts: [result],
                pain_points: [],
                competitor_insights: []
            });

            toast.success("🎉 Concepts combined successfully!");
            onCombined();
            
            // Navigate directly to the combined concept details
            setTimeout(() => {
                navigate(createPageUrl(`ConceptDetails?project=${newProject.id}&concept=0`));
            }, 500);
            
        } catch (error) {
            console.error("Failed to combine concepts:", error);
            toast.error(`Failed to combine concepts: ${error.message}`);
        } finally {
            setIsCombining(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
            <Card className="bg-slate-800 border-slate-700 max-w-lg sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader className="border-b border-slate-700 p-4 sm:p-6">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-white flex items-center gap-3 text-lg sm:text-2xl">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                            Combine Into Super-App
                        </CardTitle>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={onClose}
                            disabled={isCombining}
                            className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8 sm:h-10 sm:w-10"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <p className="text-slate-300 text-sm sm:text-base">
                        AI will analyze these {concepts.length} concepts and create a unified super-app:
                    </p>

                    <div className="space-y-3">
                        {concepts.map((concept, i) => (
                            <div key={i} className="bg-slate-700/30 border border-slate-600 rounded-lg p-3 sm:p-4">
                                <h4 className="text-white font-semibold text-base sm:text-lg mb-2">{concept.concept_name}</h4>
                                <p className="text-slate-400 text-xs sm:text-sm mb-2 line-clamp-2">{concept.core_solution}</p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-xs">
                                        {concept.development_complexity} complexity
                                    </Badge>
                                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-xs">
                                        {concept.market_potential} market
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3 sm:p-4">
                        <p className="text-green-300 text-sm sm:text-base">
                            <Zap className="w-4 h-4 inline mr-2" />
                            The AI will merge pain points, integrate features, and create a coherent value proposition.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                            disabled={isCombining}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCombine}
                            disabled={isCombining}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                        >
                            {isCombining ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Combining...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Combine Concepts
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}