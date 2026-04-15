import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Search,
    Lightbulb,
    Target,
    Code,
    TrendingUp,
    ArrowLeft,
    Play
} from "lucide-react";

const TUTORIAL_STEPS = [
    {
        id: 1,
        title: "Welcome to Idea Spark",
        subtitle: "Your AI-powered app idea discovery platform",
        icon: Sparkles,
        description: "Idea Spark analyzes millions of real user complaints and market data to help you discover breakthrough app opportunities. Let's walk through how it works.",
        keyFeatures: [
            "Uses advanced AI to analyze user feedback",
            "Identifies real market gaps and pain points",
            "Generates detailed app concepts ready for development"
        ]
    },
    {
        id: 2,
        title: "Start Market Research",
        subtitle: "Discover opportunities in any industry",
        icon: Search,
        description: "Simply type the business or service you want to research - like 'Pet Care', 'Fitness', or 'Healthcare'. Our AI will deep dive into that specific market to uncover hidden opportunities.",
        keyFeatures: [
            "Research any industry in minutes",
            "AI scans reviews, forums, and social media",
            "Finds real user frustrations and complaints",
            "Optional: Add competitors to analyze"
        ]
    },
    {
        id: 3,
        title: "AI Analysis Process",
        subtitle: "Three powerful research phases",
        icon: Target,
        description: "Watch as our AI conducts comprehensive market research in three phases: Pain Point Analysis, Competitor Intelligence, and Concept Generation.",
        keyFeatures: [
            "Phase 1: Identifies top user frustrations",
            "Phase 2: Analyzes successful competitor features",
            "Phase 3: Generates innovative app concepts",
            "Real-time progress tracking"
        ]
    },
    {
        id: 4,
        title: "Explore Generated Concepts",
        subtitle: "Review your breakthrough app ideas",
        icon: Lightbulb,
        description: "Browse AI-generated app concepts complete with features, competitive advantages, and market potential assessments. Each concept addresses real user pain points.",
        keyFeatures: [
            "Multiple concepts per research project",
            "Market potential ratings (Niche/Moderate/Large)",
            "Development complexity assessment",
            "Detailed feature breakdowns"
        ]
    },
    {
        id: 5,
        title: "Development Blueprints",
        subtitle: "Turn ideas into actionable plans",
        icon: Code,
        description: "Get master prompts for architects and builders. Select your tech stack (React, Python, Flutter, etc.) and receive detailed development guidance.",
        keyFeatures: [
            "Choose from 9+ tech stacks",
            "Architect prompts for system design",
            "Builder prompts for implementation",
            "Copy-paste ready for your dev team"
        ]
    },
    {
        id: 6,
        title: "Market Intelligence",
        subtitle: "Track trends and opportunities",
        icon: TrendingUp,
        description: "View market insights, industry trends, and opportunity scores. Discover which concepts have the highest potential and where quick wins exist.",
        keyFeatures: [
            "Real-time opportunity scoring",
            "Industry distribution analysis",
            "Quick Win identification",
            "Strategic investment recommendations"
        ]
    }
];

export default function Tutorial() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const step = TUTORIAL_STEPS[currentStep];
    const StepIcon = step.icon;
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

    const handleNext = () => {
        if (!isLastStep) {
            setCurrentStep(prev => prev + 1);
        } else {
            navigate(createPageUrl("Dashboard"));
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-6">
            <div className="max-w-5xl mx-auto overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate(createPageUrl("Dashboard"))}
                        className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                            App Tutorial
                        </h1>
                        <p className="text-slate-400 mt-1">Learn how to discover your next breakthrough app idea</p>
                    </div>
                </div>

                {/* Step Indicators */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                    {TUTORIAL_STEPS.map((s, idx) => {
                        const StepIconSmall = s.icon;
                        return (
                            <button
                                key={s.id}
                                onClick={() => setCurrentStep(idx)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    idx === currentStep
                                        ? 'bg-blue-600 text-white'
                                        : idx < currentStep
                                        ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                                }`}
                            >
                                <StepIconSmall className="w-4 h-4" />
                                Step {s.id}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <Card className="bg-slate-800/50 border-slate-700 mb-6">
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left - Content */}
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <StepIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">
                                            {step.title}
                                        </h2>
                                        <p className="text-slate-400">
                                            {step.subtitle}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-slate-300 leading-relaxed text-lg">
                                    {step.description}
                                </p>

                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lightbulb className="w-5 h-5 text-amber-400" />
                                        <h3 className="font-semibold text-white">Key Features</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {step.keyFeatures.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-slate-300">
                                                <span className="text-blue-400 mt-1">•</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Right - Visual Placeholder */}
                            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                                <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                                    <Play className="w-12 h-12 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Interactive Demo
                                </h3>
                                <p className="text-slate-400">
                                    Try the feature in your dashboard
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={handlePrevious}
                        disabled={isFirstStep}
                        className="text-slate-400 hover:text-white disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    <span className="text-slate-400 text-sm">
                        {currentStep + 1} of {TUTORIAL_STEPS.length}
                    </span>

                    <Button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        {isLastStep ? 'Get Started' : 'Next'}
                        {!isLastStep && <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}