import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
    Search, 
    Users, 
    Lightbulb, 
    CheckCircle,
    Loader2,
    AlertTriangle,
    TrendingDown
} from "lucide-react";

const analysisSteps = [
    { id: 1, title: "Collecting Pain Points", icon: Search, description: "Mining user complaints and frustrations" },
    { id: 2, title: "Analyzing Competitors", icon: Users, description: "Studying successful app features" },
    { id: 3, title: "Generating Concepts", icon: Lightbulb, description: "Creating innovative app ideas" },
    { id: 4, title: "Finalizing Report", icon: CheckCircle, description: "Compiling comprehensive insights" }
];

const severityColors = {
    high: "bg-red-600/20 text-red-300 border-red-500/30",
    medium: "bg-amber-600/20 text-amber-300 border-amber-500/30",
    low: "bg-blue-600/20 text-blue-300 border-blue-500/30"
};

export default function AnalysisProgress({ step, progressData, projectTitle }) {
    const getCurrentStep = () => {
        if (step.includes('pain points')) return 1;
        if (step.includes('competitor')) return 2;
        if (step.includes('concept')) return 3;
        return 4;
    };

    const currentStep = getCurrentStep();
    const progress = (currentStep / 4) * 100;

    return (
        <div className="min-h-screen flex items-start justify-center pt-12" style={{background: 'linear-gradient(135deg, #0B1426 0%, #1A2332 100%)'}}>
            <div className="max-w-5xl w-full mx-auto px-6">
                <Card className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl">
                    <CardContent className="p-8 md:p-12">
                        <div className="text-center mb-12">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Loader2 className="w-10 h-10 text-white animate-spin" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Analyzing "{projectTitle}"
                            </h1>
                            <p className="text-slate-400 text-lg">
                                Our AI is analyzing thousands of data points to discover breakthrough app opportunities
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-300 font-medium">Overall Progress</span>
                                    <span className="text-blue-400 font-semibold">{Math.round(progress)}%</span>
                                </div>
                                <Progress 
                                    value={progress} 
                                    className="h-3 bg-slate-700"
                                />
                            </div>

                            <div className="space-y-4">
                                {analysisSteps.map((stepInfo) => {
                                    const StepIcon = stepInfo.icon;
                                    const isActive = stepInfo.id === currentStep;
                                    const isCompleted = stepInfo.id < currentStep;

                                    return (
                                        <div 
                                            key={stepInfo.id}
                                            className={`p-4 rounded-xl transition-all duration-300 ${
                                                isActive 
                                                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg' 
                                                    : isCompleted
                                                    ? 'bg-green-600/10 border border-green-500/20'
                                                    : 'bg-slate-700/30 border border-slate-600/30'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-lg ${
                                                    isActive 
                                                        ? 'bg-blue-600 animate-pulse' 
                                                        : isCompleted
                                                        ? 'bg-green-600'
                                                        : 'bg-slate-600'
                                                }`}>
                                                    {isActive ? (
                                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                    ) : (
                                                        <StepIcon className="w-5 h-5 text-white" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`font-semibold ${
                                                        isActive || isCompleted ? 'text-white' : 'text-slate-400'
                                                    }`}>
                                                        {stepInfo.title}
                                                    </h3>
                                                    <p className={`text-sm ${
                                                        isActive 
                                                            ? 'text-blue-300' 
                                                            : isCompleted
                                                            ? 'text-green-300'
                                                            : 'text-slate-500'
                                                    }`}>
                                                        {stepInfo.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Show Pain Points when available */}
                            {progressData.painPoints && progressData.painPoints.length > 0 && (
                                <Card className="bg-slate-700/30 border border-slate-600 rounded-xl mt-8">
                                    <CardHeader className="border-b border-slate-600 p-4">
                                        <CardTitle className="text-white flex items-center gap-3 text-lg">
                                            <AlertTriangle className="w-5 h-5 text-red-400" />
                                            Top Pain Points Discovered ({progressData.painPoints.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 max-h-96 overflow-y-auto">
                                        <div className="space-y-3">
                                            {progressData.painPoints.slice(0, 5).map((point, index) => (
                                                <div key={index} className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h4 className="font-medium text-white text-sm">{point.issue}</h4>
                                                        <Badge className={severityColors[point.severity]}>
                                                            {point.severity}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <TrendingDown className="w-3 h-3" />
                                                        <span>Frequency: {point.frequency}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {progressData.painPoints.length > 5 && (
                                                <p className="text-center text-slate-400 text-sm pt-2">
                                                    +{progressData.painPoints.length - 5} more pain points discovered
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Show Competitors when available */}
                            {progressData.competitors && progressData.competitors.length > 0 && (
                                <Card className="bg-slate-700/30 border border-slate-600 rounded-xl mt-4">
                                    <CardHeader className="border-b border-slate-600 p-4">
                                        <CardTitle className="text-white flex items-center gap-3 text-lg">
                                            <Users className="w-5 h-5 text-purple-400" />
                                            Competitors Analyzed ({progressData.competitors.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 max-h-96 overflow-y-auto">
                                        <div className="space-y-3">
                                            {progressData.competitors.map((comp, index) => (
                                                <div key={index} className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                                                    <h4 className="font-semibold text-white mb-2">{comp.app_name}</h4>
                                                    <p className="text-sm text-slate-400">
                                                        {comp.successful_features?.length || 0} features analyzed, {comp.improvement_opportunities?.length || 0} opportunities found
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Show Concepts when available */}
                            {progressData.concepts && progressData.concepts.length > 0 && (
                                <Card className="bg-slate-700/30 border border-slate-600 rounded-xl mt-4">
                                    <CardHeader className="border-b border-slate-600 p-4">
                                        <CardTitle className="text-white flex items-center gap-3 text-lg">
                                            <Lightbulb className="w-5 h-5 text-amber-400" />
                                            App Concepts Generated ({progressData.concepts.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            {progressData.concepts.map((concept, index) => (
                                                <div key={index} className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                                                    <h4 className="font-semibold text-white mb-1">{concept.concept_name}</h4>
                                                    <p className="text-sm text-slate-400 line-clamp-2">{concept.core_solution}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 text-center mt-6">
                                <p className="text-slate-300 font-medium mb-2">Current Step:</p>
                                <p className="text-blue-400 text-lg font-semibold">{step}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}