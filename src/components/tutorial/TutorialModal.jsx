import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Search,
    Lightbulb,
    Target,
    Code,
    TrendingUp,
    X
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
        ],
        demoText: "Interactive Demo Coming Soon",
        demoSubtext: "Visual walkthrough of this feature"
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
        ],
        demoText: "Try it yourself!",
        demoSubtext: "Click 'New Research' in the sidebar to get started"
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
        ],
        demoText: "Analysis takes 2-3 minutes",
        demoSubtext: "Results are automatically saved"
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
        ],
        demoText: "Filter by industry or complexity",
        demoSubtext: "Find concepts in App Concepts page"
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
        ],
        demoText: "Export to App Forge",
        demoSubtext: "Continue validation in our sister app"
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
            "Export data to App Master for project management"
        ],
        demoText: "You're all set!",
        demoSubtext: "Start discovering breakthrough app ideas now"
    }
];

export default function TutorialModal({ open, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);

    const step = TUTORIAL_STEPS[currentStep];
    const StepIcon = step.icon;
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

    const handleNext = () => {
        if (!isLastStep) {
            setCurrentStep(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
                {/* Header */}
                <DialogHeader className="border-b border-slate-700 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-blue-400" />
                                App Tutorial
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 mt-1">
                                Learn how to discover your next breakthrough app idea
                            </DialogDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                        {TUTORIAL_STEPS.map((s, idx) => {
                            const StepIconSmall = s.icon;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setCurrentStep(idx)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                        idx === currentStep
                                            ? 'bg-blue-600 text-white'
                                            : idx < currentStep
                                            ? 'bg-green-600/20 text-green-300'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                                >
                                    <StepIconSmall className="w-4 h-4" />
                                    Step {s.id}
                                </button>
                            );
                        })}
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="py-6 min-h-[400px]">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column - Content */}
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

                            <p className="text-slate-300 leading-relaxed">
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

                        {/* Right Column - Demo Placeholder */}
                        <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                                <StepIcon className="w-12 h-12 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {step.demoText}
                            </h3>
                            <p className="text-slate-400">
                                {step.demoSubtext}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
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
            </DialogContent>
        </Dialog>
    );
}