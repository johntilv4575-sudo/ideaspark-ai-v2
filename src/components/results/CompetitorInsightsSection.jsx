import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Users, Search } from "lucide-react";
import DeepDiveModal from "./DeepDiveModal";

export default function CompetitorInsightsSection({ insights, projectTitle, industry }) {
    const [deepDiveOpen, setDeepDiveOpen] = useState(false);
    const [selectedCompetitor, setSelectedCompetitor] = useState(null);

    const handleDeepDive = (competitor) => {
        setSelectedCompetitor(competitor);
        setDeepDiveOpen(true);
    };

    return (
        <>
            <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                        <Users className="w-5 h-5 text-purple-400" />
                        Competitor Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {insights?.map((insight, index) => (
                        <div key={index} className="p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-lg text-white">{insight.app_name}</h4>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeepDive(insight)}
                                    className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 text-xs"
                                >
                                    <Search className="w-3 h-3 mr-1" />
                                    Deep Dive
                                </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h5 className="flex items-center gap-2 font-semibold text-green-400 mb-2"><ThumbsUp className="w-4 h-4" /> What Users Love</h5>
                                    <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                                        {insight.successful_features?.map((feature, i) => <li key={i}>{feature}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="flex items-center gap-2 font-semibold text-amber-400 mb-2"><ThumbsDown className="w-4 h-4" /> Opportunities for Improvement</h5>
                                    <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                                        {insight.improvement_opportunities?.map((opp, i) => <li key={i}>{opp}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <DeepDiveModal
                open={deepDiveOpen}
                onClose={() => setDeepDiveOpen(false)}
                type="competitor"
                subject={selectedCompetitor}
                projectTitle={projectTitle}
                industry={industry}
            />
        </>
    );
}