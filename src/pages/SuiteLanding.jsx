import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
    ArrowRight,
    Sparkles,
    Brain,
    Target,
    Users,
    Zap,
    CheckCircle,
    TrendingUp,
    Lightbulb,
    Shield,
    Globe
} from "lucide-react";
import SuiteAppCard from "../components/common/SuiteAppCard";

export default function SuiteLanding() {
    const suiteApps = [
        {
            icon: Brain,
            title: "SpiralPlan",
            conciseDescription: "Competitive intelligence and market positioning. Analyze competitors, identify gaps, and understand where you can win before building anything.",
            features: [
                "Competitor Feature Analysis",
                "Market Positioning Matrix",
                "Gap Identification",
                "SWOT Analysis",
                "Strategic Recommendations"
            ],
            href: "https://spiral-plan-0f142f84.base44.app",
            statusBadge: "MVP",
            gradient: "bg-gradient-to-br from-green-900/30 to-emerald-900/30"
        },
        {
            icon: Sparkles,
            title: "Idea Spark",
            conciseDescription: "Transform user frustrations into breakthrough app ideas through AI-powered market research and concept generation.",
            features: [
                "AI-Powered Market Research",
                "Pain Point Analysis",
                "Competitor Intelligence",
                "Concept Generation",
                "Development Blueprints"
            ],
            href: "https://idea-spark-ai-33ec6517.base44.app",
            statusBadge: "Live",
            gradient: "bg-gradient-to-br from-blue-900/30 to-purple-900/30"
        },
        {
            icon: Target,
            title: "App Forge",
            conciseDescription: "Your mission control for validating, planning, and launching your app. Ensure your ideas are viable and actionable before investing time and resources.",
            features: [
                "Idea Validation & Reality Check",
                "Competitive Intelligence Agent",
                "MVP Planning Board",
                "Feature Cards & User Stories",
                "Go-To-Market Strategy"
            ],
            href: "https://app-forge-3bf6353f.base44.app",
            statusBadge: "Live",
            gradient: "bg-gradient-to-br from-purple-900/30 to-pink-900/30"
        },
        {
            icon: Users,
            title: "App Master",
            conciseDescription: "A powerful project management platform for teams to collaborate, track progress, and deliver projects on time with an intuitive interface.",
            features: [
                "Team Collaboration Tools",
                "Progress Tracking & Analytics",
                "Task Management System",
                "Sprint Planning",
                "Launch Coordination"
            ],
            href: "https://app-master-c9c24cd9.base44.app",
            statusBadge: "Live",
            gradient: "bg-gradient-to-br from-amber-900/30 to-orange-900/30"
        }
    ];

    const suiteAdvantages = [
        {
            icon: Zap,
            title: "Seamless Data Flow",
            description: "Information flows automatically between apps, eliminating manual data entry and ensuring consistency."
        },
        {
            icon: TrendingUp,
            title: "Strategic Alignment",
            description: "Each app builds upon the last, ensuring your entire journey from idea to launch stays strategically aligned."
        },
        {
            icon: Shield,
            title: "Reduced Risk",
            description: "Data-driven decisions at every stage minimize the risk of building the wrong product."
        },
        {
            icon: CheckCircle,
            title: "Faster Time to Market",
            description: "Integrated workflows eliminate friction and accelerate your path from concept to launch."
        }
    ];

    return (
        <div className="min-h-screen app-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Hero Section */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="flex justify-center mb-6">
                        <img
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6887c010e19d31c2ef262747/481195ca2_SpiralStudiosLogo_512.png"
                            alt="Spiral Studios"
                            className="h-16 sm:h-24 w-auto object-contain logo-glow"
                        />
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        The Complete Innovation Journey
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                        The Spiral Start-up Suite
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                        Four AI-powered applications working in harmony to take you from 
                        <span className="text-[#8b9bef] font-semibold"> competitive analysis</span> through 
                        <span className="text-[#8b9bef] font-semibold"> idea discovery</span> to 
                        <span className="text-[#8b9bef] font-semibold"> successful launch</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to={createPageUrl("SuiteDemonstrationWalkThrough")}>
                            <Button size="lg" className="gradient-button px-8 py-4 text-lg font-semibold">
                                <Lightbulb className="w-5 h-5 mr-3" />
                                See How It Works
                                <ArrowRight className="w-5 h-5 ml-3" />
                            </Button>
                        </Link>
                        <Link to={createPageUrl("SuiteGuide")}>
                            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-8 py-4 text-lg">
                                Integration Guide
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Visual Workflow */}
                <div className="mb-16">
                    <Card className="card-secondary">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl sm:text-3xl text-white">
                                Your Path to Success
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8">
                            <div className="grid sm:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                        <Brain className="w-8 h-8 text-white" />
                                    </div>
                                    <Badge className="mb-2 bg-green-600">Stage 0</Badge>
                                    <h3 className="text-white font-bold mb-2">Analyze</h3>
                                    <p className="text-gray-400 text-sm">
                                        Uncover competitor strengths, weaknesses, and market gaps with SpiralPlan
                                    </p>
                                </div>

                                <div className="hidden sm:flex items-center justify-center">
                                    <ArrowRight className="w-8 h-8 text-blue-400" />
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                    <Badge className="mb-2 bg-blue-600">Stage 1</Badge>
                                    <h3 className="text-white font-bold mb-2">Discover</h3>
                                    <p className="text-gray-400 text-sm">
                                        Generate innovative app concepts backed by real user pain points
                                    </p>
                                </div>

                                <div className="hidden sm:flex items-center justify-center">
                                    <ArrowRight className="w-8 h-8 text-purple-400" />
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                        <Target className="w-8 h-8 text-white" />
                                    </div>
                                    <Badge className="mb-2 bg-purple-600">Stage 2</Badge>
                                    <h3 className="text-white font-bold mb-2">Validate & Plan</h3>
                                    <p className="text-gray-400 text-sm">
                                        Validate viability and create detailed MVP plans with App Forge
                                    </p>
                                </div>

                                <div className="hidden sm:flex items-center justify-center">
                                    <ArrowRight className="w-8 h-8 text-amber-400" />
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                    <Badge className="mb-2 bg-amber-600">Stage 3</Badge>
                                    <h3 className="text-white font-bold mb-2">Build & Launch</h3>
                                    <p className="text-gray-400 text-sm">
                                        Manage development and coordinate your successful launch
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Individual App Cards */}
                <div className="mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
                        Meet the Applications
                    </h2>
                    <p className="text-gray-400 text-center text-lg mb-12 max-w-3xl mx-auto">
                        Each application is powerful on its own, but together they create an unbeatable ecosystem for startup success.
                    </p>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {suiteApps.map((app, idx) => (
                            <SuiteAppCard
                                key={idx}
                                icon={app.icon}
                                title={app.title}
                                conciseDescription={app.conciseDescription}
                                features={app.features}
                                href={app.href}
                                statusBadge={app.statusBadge}
                                gradient={app.gradient}
                            />
                        ))}
                    </div>
                </div>

                {/* Suite Advantages */}
                <div className="mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
                        Why Use the Full Suite?
                    </h2>
                    <p className="text-gray-400 text-center text-lg mb-12 max-w-3xl mx-auto">
                        The Spiral Start-up Suite isn't just a collection of tools—it's an integrated system designed to maximize your chances of success.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {suiteAdvantages.map((advantage, idx) => {
                            const Icon = advantage.icon;
                            return (
                                <Card key={idx} className="card-secondary hover:border-[#667eea] transition-all duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-lg mb-2">{advantage.title}</h3>
                                                <p className="text-gray-400">{advantage.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Built for Everyone */}
                <div className="mb-16">
                    <Card className="card-secondary">
                        <CardContent className="p-8 sm:p-12 text-center">
                            <Globe className="w-16 h-16 mx-auto mb-6 text-[#8b9bef]" />
                            <h2 className="text-3xl font-bold text-white mb-4">Built for Everyone</h2>
                            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                                The Spiral Start-up Suite is designed for <strong className="text-white">neurodivergent thinkers, solo founders, and anyone</strong> who feels excluded from traditional business mentoring. 
                                We believe innovation shouldn't require conforming to "socially accepted" ways of working. 
                                Your unique perspective is your strength—our tools amplify it.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Final CTA */}
                <div className="text-center">
                    <Card className="card-primary p-8 sm:p-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Ideas?
                        </h2>
                        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                            Start with any app in the suite, or dive into the complete experience. 
                            Your breakthrough is waiting.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to={createPageUrl("Dashboard")}>
                                <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Start Your Journey
                                </Button>
                            </Link>
                            <Link to={createPageUrl("SuiteDemonstrationWalkThrough")}>
                                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                                    Watch Demo
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}