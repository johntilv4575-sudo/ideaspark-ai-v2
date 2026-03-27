import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Lightbulb, ArrowRight, Code, TrendingUp, Target, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const complexityColors = {
    low: "bg-green-600/20 text-green-300 border-green-500/30",
    medium: "bg-amber-600/20 text-amber-300 border-amber-500/30", 
    high: "bg-red-600/20 text-red-300 border-red-500/30"
};

const potentialColors = {
    niche: "bg-blue-600/20 text-blue-300 border-blue-500/30",
    moderate: "bg-purple-600/20 text-purple-300 border-purple-500/30",
    large: "bg-pink-600/20 text-pink-300 border-pink-500/30"
};

export default function GeneratedConceptsSection({ concepts, projectId }) {
    return (
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    Generated App Concepts ({concepts?.length || 0})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {concepts?.map((concept, index) => (
                    <Link 
                        key={index} 
                        to={createPageUrl(`ConceptDetails?project=${projectId}&concept=${index}`)}
                        className="block p-4 border border-slate-700 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-white group-hover:text-blue-300">{concept.concept_name}</h4>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-300 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                        </div>
                        
                        {concept.one_liner && (
                            <p className="text-sm text-blue-300/80 italic mb-1">{concept.one_liner}</p>
                        )}
                        
                        <p className="text-sm text-slate-400 line-clamp-2 mb-2">{concept.core_solution}</p>
                        
                        {concept.target_user && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                                <Target className="w-3 h-3" />
                                {concept.target_user}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-1.5 mb-2">
                            <Badge className={complexityColors[concept.development_complexity]}>
                                <Code className="w-3 h-3 mr-1" />
                                {concept.development_complexity}
                            </Badge>
                            <Badge className={potentialColors[concept.market_potential] || "bg-purple-600/20 text-purple-300 border-purple-500/30"}>
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {concept.market_potential}
                            </Badge>
                        </div>

                        {concept.validation_plan && concept.validation_plan.length > 0 && (
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {concept.validation_plan.length} validation tests
                            </div>
                        )}

                        {concept.what_changed && (
                            <div className="mt-2 p-2 bg-purple-900/20 border border-purple-700/30 rounded text-xs text-purple-300">
                                <span className="font-medium">Changed:</span> {concept.what_changed}
                            </div>
                        )}
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}