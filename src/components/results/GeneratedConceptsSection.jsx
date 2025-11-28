import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Lightbulb, ArrowRight, Code, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const complexityColors = {
    low: "bg-green-600/20 text-green-300 border-green-500/30",
    medium: "bg-amber-600/20 text-amber-300 border-amber-500/30", 
    high: "bg-red-600/20 text-red-300 border-red-500/30"
};

export default function GeneratedConceptsSection({ concepts, projectId }) {
    return (
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    Generated App Concepts
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {concepts?.map((concept, index) => (
                    <Link 
                        key={index} 
                        to={createPageUrl(`ConceptDetails?project=${projectId}&concept=${index}`)}
                        className="block p-4 border border-slate-700 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group"
                    >
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-white group-hover:text-blue-300">{concept.concept_name}</h4>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-300 transition-transform group-hover:translate-x-1" />
                        </div>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">{concept.core_solution}</p>
                        <div className="flex gap-2 mt-3">
                            <Badge className={complexityColors[concept.development_complexity]}>
                                <Code className="w-3 h-3 mr-1" />
                                {concept.development_complexity}
                            </Badge>
                             <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {concept.market_potential}
                            </Badge>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}