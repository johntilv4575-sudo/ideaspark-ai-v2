import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Search } from "lucide-react";
import DeepDiveModal from "./DeepDiveModal";

const severityConfig = {
    high: "bg-red-600/20 text-red-300 border-red-500/30",
    medium: "bg-amber-600/20 text-amber-300 border-amber-500/30",
    low: "bg-blue-600/20 text-blue-300 border-blue-500/30"
};

export default function PainPointsSection({ painPoints, projectTitle, industry }) {
    const [deepDiveOpen, setDeepDiveOpen] = useState(false);
    const [selectedPainPoint, setSelectedPainPoint] = useState(null);

    const handleDeepDive = (point) => {
        setSelectedPainPoint(point);
        setDeepDiveOpen(true);
    };

    return (
        <>
            <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Top User Pain Points
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {painPoints?.map((point, index) => (
                        <div key={index} className="p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-white">{point.issue}</h4>
                                <div className="flex items-center gap-2">
                                    <Badge className={severityConfig[point.severity]}>{point.severity} severity</Badge>
                                </div>
                            </div>
                            <div className="text-sm text-slate-400 italic border-l-2 border-slate-600 pl-3">
                                "{point.source_examples?.[0]}"
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <TrendingDown className="w-3 h-3" />
                                    <span>Frequency Score: {point.frequency}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeepDive(point)}
                                    className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 text-xs"
                                >
                                    <Search className="w-3 h-3 mr-1" />
                                    Deep Dive
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <DeepDiveModal
                open={deepDiveOpen}
                onClose={() => setDeepDiveOpen(false)}
                type="pain_point"
                subject={selectedPainPoint}
                projectTitle={projectTitle}
                industry={industry}
            />
        </>
    );
}