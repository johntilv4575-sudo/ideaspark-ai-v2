import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
    Search,
    Lightbulb,
    TrendingUp,
    ArrowRight,
    Sparkles,
    Users,
    Target,
    Zap,
    CheckCircle,
    Brain
} from "lucide-react";
import SuiteAppCard from "../components/common/SuiteAppCard";

export default function Landing() {
    const features = [
        {
            icon: Search,
            title: "AI-Powered Market Research",
            description: "Discover hidden opportunities by analyzing thousands of user complaints and market gaps across industries."
        },
        {
            icon: Target,
            title: "Pain Point Analysis",
            description: "Identify the most frustrating user experiences that are begging for innovative solutions."
        },
        {
            icon: Users,
            title: "Competitor Intelligence",
            description: "Understand what successful apps do well and where they fall short to find your competitive edge."
        },
        {
            icon: Lightbulb,
            title: "Concept Generation",
            description: "Generate breakthrough app ideas with detailed development blueprints and market potential analysis."
        }
    ];

    const benefits = [
        "Turn user frustrations into profitable app opportunities",
        "Reduce development risk with data-driven insights",
        "Access comprehensive competitor analysis",
        "Get detailed development roadmaps for each concept",
        "Identify emerging market trends before your competition"
    ];

    const accessibilityFeatures = [
        {
            title: "Keyboard Navigation",
            description: "Full keyboard support for all interactive elements with clear focus indicators"
        },
        {
            title: "Screen Reader Compatible",
            description: "ARIA labels and semantic HTML for screen reader accessibility"
        },
        {
            title: "High Contrast Mode",
            description: "Color schemes designed for visibility with WCAG AA compliance"
        },
        {
            title: "Responsive Text",
            description: "Text scales up to 200% without loss of functionality"
        },
        {
            title: "Alternative Text",
            description: "All images and icons include descriptive alt text"
        },
        {
            title: "Voice Command Ready",
            description: "Compatible with voice navigation software"
        }
    ];

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
            href: null,
            statusBadge: "Current App",
            gradient: "bg-gradient-to-br from-blue-900/30 to-purple-900/30",
            isCurrentApp: true
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

    return (
        <div className="min-h-screen app-background">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
                    <div className="text-center space-y-6 sm:space-y-8">
                        {/* Spiral Studios Logo */}
                        <div className="flex justify-center mb-8 sm:mb-12">
                            <img
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6887c010e19d31c2ef262747/481195ca2_SpiralStudiosLogo_512.png"
                                alt="Spiral Studios"
                                className="h-20 sm:h-32 w-auto object-contain logo-glow"
                            />
                        </div>

                        {/* Hero Headline */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-[#8b9bef] text-xs sm:text-sm font-medium">
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                AI-Powered App Discovery Platform
                            </div>

                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white leading-tight px-4">
                                Turn Frustrations Into
                                <span className="block bg-gradient-to-r from-[#8b9bef] to-[#b8c5f3] bg-clip-text text-transparent">
                                    Breakthrough Apps
                                </span>
                            </h1>

                            <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                                <strong className="text-white">Idea Spark</strong> uses advanced AI to analyze user pain points across industries,
                                study competitor successes, and generate innovative app concepts with detailed development blueprints.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-6 sm:pt-8 px-4">
                            <Link to={createPageUrl("Dashboard")} className="w-full sm:w-auto">
                                <Button size="lg" className="gradient-button w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold">
                                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                                    Start Discovering Ideas
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
                                </Button>
                            </Link>
                            <Link to={createPageUrl("SuiteLanding")} className="w-full sm:w-auto">
                                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-gray-300 hover:bg-gray-700 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                                    Explore the Suite
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section - FIXED CONTRAST */}
            <div className="py-16 sm:py-24 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-16">
                        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                            How Idea Spark Works
                        </h2>
                        <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto">
                            Our AI-driven platform transforms market research into actionable app concepts
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={index} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300 group">
                                    <CardContent className="p-6 sm:p-8 text-center">
                                        <div className="w-16 h-16 mx-auto mb-6 gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                        <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Benefits Section - FIXED CONTRAST */}
            <div className="py-16 sm:py-24 bg-slate-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
                                Why Choose Idea Spark?
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                                Stop guessing what apps to build. Let data and AI guide you to profitable opportunities
                                that solve real user problems.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-gray-200">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:order-first">
                            <Card className="bg-slate-800 border-slate-700 p-6 sm:p-8">
                                <div className="text-center space-y-4 sm:space-y-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-blue-600/30 rounded-2xl flex items-center justify-center">
                                        <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready to Get Started?</h3>
                                        <p className="text-gray-300 mb-4 sm:mb-6">
                                            Join innovators who are discovering their next breakthrough app idea
                                        </p>
                                        <Link to={createPageUrl("NewResearch")}>
                                            <Button className="gradient-button w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 font-semibold">
                                                Start Your First Research
                                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW: The Spiral Studios Suite Section - FIXED CONTRAST */}
            <div className="py-16 sm:py-24 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Section Header */}
                    <div className="text-center mb-8 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            The Complete Journey
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                            The Spiral Start-up Suite
                        </h2>
                        <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Four intelligent apps designed to take you from competitive analysis through idea discovery to launch - built for everyone, especially those who think differently.
                        </p>

                        {/* Workflow Explanation - FIXED CONTRAST */}
                        <div className="max-w-4xl mx-auto bg-slate-800 border-slate-700 rounded-xl p-6 sm:p-8">
                            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2 justify-center">
                                <Zap className="w-5 h-5 text-amber-400" />
                                How It Works as Your Complete Dev Assistant
                            </h3>
                            <div className="grid sm:grid-cols-4 gap-4 sm:gap-6 text-left">
                                <div className="space-y-2 bg-slate-900 p-4 rounded-lg border border-slate-700">
                                    <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">0</div>
                                    <h4 className="text-green-400 font-semibold">Analyze</h4>
                                    <p className="text-gray-300 text-sm">
                                        <strong className="text-white">SpiralPlan</strong> reveals competitor strengths, weaknesses, and market gaps you can exploit.
                                    </p>
                                </div>
                                <div className="space-y-2 bg-slate-900 p-4 rounded-lg border border-slate-700">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">1</div>
                                    <h4 className="text-blue-400 font-semibold">Discover</h4>
                                    <p className="text-gray-300 text-sm">
                                        <strong className="text-white">Idea Spark</strong> researches any market, finds pain points, and generates innovative app concepts with development blueprints.
                                    </p>
                                </div>
                                <div className="space-y-2 bg-slate-900 p-4 rounded-lg border border-slate-700">
                                    <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">2</div>
                                    <h4 className="text-purple-400 font-semibold">Validate & Plan</h4>
                                    <p className="text-gray-300 text-sm">
                                        <strong className="text-white">App Forge</strong> validates your idea's viability, creates your MVP plan with user stories, and crafts your go-to-market strategy.
                                    </p>
                                </div>
                                <div className="space-y-2 bg-slate-900 p-4 rounded-lg border border-slate-700">
                                    <div className="w-8 h-8 bg-amber-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">3</div>
                                    <h4 className="text-amber-400 font-semibold">Build & Launch</h4>
                                    <p className="text-gray-300 text-sm">
                                        <strong className="text-white">App Master</strong> manages your team, tracks development progress, and ensures you deliver on time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suite App Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
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
                                isCurrentApp={app.isCurrentApp}
                            />
                        ))}
                    </div>

                    {/* Vision Statement - FIXED CONTRAST */}
                    <div className="mt-16 text-center max-w-3xl mx-auto">
                        <div className="bg-slate-800 border-slate-700 rounded-xl p-8">
                            <h3 className="text-white font-bold text-2xl mb-4">Built for Everyone</h3>
                            <p className="text-gray-300 leading-relaxed">
                                The Spiral Start-up Suite is designed for <strong className="text-white">neurodivergent thinkers, solo founders, and anyone</strong> who feels excluded from traditional business mentoring.
                                We believe innovation shouldn't require conforming to "socially accepted" ways of working.
                                Your unique perspective is your strength - our tools amplify it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accessibility Section - FIXED CONTRAST */}
            <div className="py-16 sm:py-24 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-16">
                        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                            Built with Accessibility in Mind
                        </h2>
                        <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto">
                            Idea Spark ensures everyone can discover and develop innovative apps, regardless of ability
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {accessibilityFeatures.map((feature, index) => (
                            <div key={index} className="bg-slate-800 border-slate-700 rounded-xl p-4 sm:p-6 hover:border-[#667eea] transition-all duration-300">
                                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-gray-300 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Disclaimer Section - FIXED CONTRAST */}
            <div className="py-16 bg-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-4 sm:p-8">
                            <h3 className="text-white font-bold text-xl mb-4">Important Disclaimer</h3>
                            <div className="space-y-3 text-gray-300 text-sm">
                                <p>
                                    Idea Spark uses AI to research market opportunities and generate app concepts based on publicly available information. While we strive for accuracy, please note:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Research results are AI-generated and should be validated independently</li>
                                    <li>Market data and competitor insights may not reflect real-time information</li>
                                    <li>App concepts are suggestions only and do not guarantee market success</li>
                                    <li>Users are responsible for conducting their own due diligence before building or launching any app</li>
                                    <li>Development prompts are starting points and require technical expertise to implement</li>
                                    <li>Location-based research uses publicly available data and may not capture all regional nuances</li>
                                </ul>
                                <p className="mt-4">
                                    By using Idea Spark, you acknowledge that Spiral Studios and its affiliates are not responsible for any outcomes resulting from acting on AI-generated suggestions.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-[#2d3748] py-12 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <img
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6887c010e19d31c2ef262747/481195ca2_SpiralStudiosLogo_512.png"
                                alt="Spiral Studios"
                                className="h-12 w-auto object-contain opacity-80"
                            />
                            <p className="text-gray-300 text-sm text-center md:text-left">
                                © 2024 Spiral Studios. Transforming ideas into reality through intelligent innovation.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link to={createPageUrl("About")}>
                                <Button variant="ghost" className="text-gray-300 hover:bg-gray-700 hover:text-white">
                                    About Idea Spark
                                </Button>
                            </Link>
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-gray-300 hover:bg-gray-700 hover:text-white"
                                onClick={() => window.open('https://spiralstudios.com.au', '_blank')}
                            >
                                Spiral Studios
                            </Button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}