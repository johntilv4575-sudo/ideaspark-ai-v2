import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
    ArrowLeft,
    ArrowRight,
    Brain,
    Sparkles,
    Target,
    Users,
    CheckCircle,
    Zap,
    TrendingUp,
    FileText,
    Play,
    ChevronDown,
    ChevronUp,
    ExternalLink
} from "lucide-react";

export default function SuiteDemonstrationWalkThrough() {
    const navigate = useNavigate();
    const [expandedSection, setExpandedSection] = useState(0);

    const toggleSection = (index) => {
        setExpandedSection(expandedSection === index ? null : index);
    };

    const appStages = [
        {
            stageNumber: 0,
            stageName: "Analyze",
            appName: "SpiralPlan",
            icon: Brain,
            color: "green",
            statusBadge: "MVP",
            appUrl: "https://spiral-plan-0f142f84.base44.app",
            coreRole: "Competitive Intelligence & Market Positioning",
            description: "SpiralPlan helps you understand the competitive landscape before you build anything. By analyzing your competitors' strengths, weaknesses, and market positioning, you can identify untapped opportunities and strategic gaps.",
            keyActions: [
                "Analyze competitor features, pricing, and market position",
                "Generate SWOT analysis for key competitors",
                "Identify strategic market gaps and opportunities",
                "Create market positioning matrices",
                "Export competitive intelligence reports"
            ],
            visualPlaceholder: "[SCREENSHOT: SpiralPlan dashboard showing a completed competitor analysis with positioning matrix and gap identification]",
            handoffText: "Seamlessly transfer strategic market insights to Idea Spark for concept generation based on identified opportunities."
        },
        {
            stageNumber: 1,
            stageName: "Discover",
            appName: "Idea Spark",
            icon: Sparkles,
            color: "blue",
            statusBadge: "Live",
            appUrl: "https://idea-spark-ai-33ec6517.base44.app",
            coreRole: "Market Research & App Concept Generation",
            description: "Idea Spark transforms user frustrations into breakthrough app ideas. Using AI-powered market research, it analyzes real user complaints, competitor gaps, and market trends to generate innovative app concepts with detailed development blueprints.",
            keyActions: [
                "Create research projects for any market or industry",
                "AI analyzes thousands of user complaints and pain points",
                "Study successful competitors and their shortcomings",
                "Generate 3-5 innovative app concepts per project",
                "Access detailed development blueprints and prompts"
            ],
            visualPlaceholder: "[SCREENSHOT: Idea Spark research results page showing generated app concepts with pain points, competitor analysis, and features]",
            handoffText: "Your validated concepts flow directly into App Forge for detailed MVP planning and go-to-market strategy development."
        },
        {
            stageNumber: 2,
            stageName: "Validate & Plan",
            appName: "App Forge",
            icon: Target,
            color: "purple",
            statusBadge: "Live",
            appUrl: "https://app-forge-3bf6353f.base44.app",
            coreRole: "Idea Validation & MVP Planning",
            description: "App Forge ensures your idea is viable before you invest significant time and resources. It validates market demand, helps you plan your MVP feature set, creates user stories, and develops a comprehensive go-to-market strategy.",
            keyActions: [
                "Reality-check your app concept with AI validation",
                "Deep competitive intelligence on similar products",
                "Define MVP features and prioritize development",
                "Generate user stories and acceptance criteria",
                "Build complete go-to-market and launch strategy"
            ],
            visualPlaceholder: "[SCREENSHOT: App Forge MVP planning board with feature cards, user stories, and validation scores]",
            handoffText: "The complete MVP blueprint is now ready in App Master for development execution and team coordination."
        },
        {
            stageNumber: 3,
            stageName: "Build & Launch",
            appName: "App Master",
            icon: Users,
            color: "amber",
            statusBadge: "Live",
            appUrl: "https://app-master-c9c24cd9.base44.app",
            coreRole: "Project Management & Launch Coordination",
            description: "App Master brings your validated plan to life. It provides comprehensive project management tools to coordinate your team, track development progress, manage sprints, and ensure you deliver your product on time and within budget.",
            keyActions: [
                "Set up sprint planning and development cycles",
                "Assign tasks to team members with clear ownership",
                "Track progress with real-time velocity metrics",
                "Coordinate launch activities and timelines",
                "Manage post-launch iterations and updates"
            ],
            visualPlaceholder: "[SCREENSHOT: App Master project dashboard showing sprint board, team velocity, and launch timeline]",
            handoffText: null // Last stage, no handoff
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            green: {
                bg: "bg-green-500/10",
                border: "border-green-500/30",
                text: "text-green-400",
                badge: "bg-green-600"
            },
            blue: {
                bg: "bg-blue-500/10",
                border: "border-blue-500/30",
                text: "text-blue-400",
                badge: "bg-blue-600"
            },
            purple: {
                bg: "bg-purple-500/10",
                border: "border-purple-500/30",
                text: "text-purple-400",
                badge: "bg-purple-600"
            },
            amber: {
                bg: "bg-amber-500/10",
                border: "border-amber-500/30",
                text: "text-amber-400",
                badge: "bg-amber-600"
            }
        };
        return colors[color];
    };

    return (
        <div className="min-h-screen app-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(createPageUrl("SuiteLanding"))}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            Your End-to-End Innovation Journey
                        </h1>
                        <p className="text-gray-400 text-lg">
                            A guided tour of the Spiral Start-up Suite in action
                        </p>
                    </div>
                </div>

                {/* Introduction */}
                <Card className="card-secondary mb-12">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                                <Play className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    How the Suite Works Together
                                </h2>
                                <p className="text-gray-300 leading-relaxed">
                                    Each app in the Spiral Start-up Suite builds upon the last, ensuring data continuity, 
                                    strategic alignment, and efficient execution at every stage of your journey from concept to launch.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center">
                            <Badge className="bg-green-600 px-4 py-2">
                                <Brain className="w-4 h-4 mr-2" />
                                Analyze
                            </Badge>
                            <ArrowRight className="w-5 h-5 text-gray-500 self-center" />
                            <Badge className="bg-blue-600 px-4 py-2">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Discover
                            </Badge>
                            <ArrowRight className="w-5 h-5 text-gray-500 self-center" />
                            <Badge className="bg-purple-600 px-4 py-2">
                                <Target className="w-4 h-4 mr-2" />
                                Validate
                            </Badge>
                            <ArrowRight className="w-5 h-5 text-gray-500 self-center" />
                            <Badge className="bg-amber-600 px-4 py-2">
                                <Users className="w-4 h-4 mr-2" />
                                Build
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* App Stage Walkthroughs */}
                <div className="space-y-6">
                    {appStages.map((stage, index) => {
                        const Icon = stage.icon;
                        const colors = getColorClasses(stage.color);
                        const isExpanded = expandedSection === index;

                        return (
                            <Card key={index} className={`card-secondary ${colors.bg} border-2 ${colors.border}`}>
                                <CardHeader 
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => toggleSection(index)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 ${colors.badge} rounded-xl flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <Badge className={colors.badge}>
                                                        Stage {stage.stageNumber}
                                                    </Badge>
                                                    <Badge variant="outline" className="border-gray-600">
                                                        {stage.statusBadge}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-white text-xl sm:text-2xl">
                                                    {stage.stageName}: {stage.appName}
                                                </CardTitle>
                                                <p className={`${colors.text} text-sm font-semibold`}>
                                                    {stage.coreRole}
                                                </p>
                                            </div>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-6 h-6 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                </CardHeader>

                                {isExpanded && (
                                    <CardContent className="pt-0 pb-6 px-6">
                                        {/* Description */}
                                        <div className="mb-6">
                                            <p className="text-gray-300 leading-relaxed">
                                                {stage.description}
                                            </p>
                                        </div>

                                        {/* Key Actions */}
                                        <div className="mb-6">
                                            <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                                                <Zap className={`w-5 h-5 ${colors.text}`} />
                                                Key Actions & Features
                                            </h3>
                                            <ul className="space-y-2">
                                                {stage.keyActions.map((action, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                                                        <CheckCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                                                        <span>{action}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Visual Placeholder */}
                                        <div className="mb-6">
                                            <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                                                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                                <p className="text-gray-400 text-sm italic">
                                                    {stage.visualPlaceholder}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Handoff Information */}
                                        {stage.handoffText && (
                                            <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 mb-6`}>
                                                <div className="flex items-start gap-3">
                                                    <ArrowRight className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                                                    <div>
                                                        <h4 className="text-white font-semibold mb-1">Next Step</h4>
                                                        <p className="text-gray-300 text-sm">{stage.handoffText}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Go to App Button */}
                                        <div className="flex justify-end">
                                            <a href={stage.appUrl} target="_blank" rel="noopener noreferrer">
                                                <Button className={`${colors.badge} hover:opacity-90`}>
                                                    Go to {stage.appName}
                                                    <ExternalLink className="w-4 h-4 ml-2" />
                                                </Button>
                                            </a>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Recap Section */}
                <Card className="card-secondary mt-12">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            Why the Spiral Start-up Suite?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Data-Driven Decisions</h3>
                                    <p className="text-gray-400 text-sm">
                                        Eliminate guesswork with AI-powered insights at every stage of your journey.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Streamlined Workflow</h3>
                                    <p className="text-gray-400 text-sm">
                                        Reduce development time with integrated tools that work seamlessly together.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Strategic Alignment</h3>
                                    <p className="text-gray-400 text-sm">
                                        Ensure every decision from concept to launch stays true to your vision.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Built for Everyone</h3>
                                    <p className="text-gray-400 text-sm">
                                        Intuitive tools designed for all founders, especially neurodivergent thinkers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Final CTA */}
                <div className="mt-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Transform Your Ideas into Impact?
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Start with any app in the suite and experience the power of integrated innovation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://spiral-plan-0f142f84.base44.app" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="gradient-button px-8 py-4 text-lg font-semibold">
                                <Brain className="w-5 h-5 mr-2" />
                                Start with SpiralPlan
                            </Button>
                        </a>
                        <Link to={createPageUrl("SuiteLanding")}>
                            <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-8 py-4 text-lg">
                                Back to Suite Overview
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}