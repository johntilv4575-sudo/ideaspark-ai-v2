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
    CheckCircle
} from "lucide-react";

export default function Home() {
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

    return (
        <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0B1426 0%, #1A2332 100%)'}}>
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
                    <div className="text-center space-y-6 sm:space-y-8">
                        {/* Spiral Studios Logo */}
                        <div className="flex justify-center mb-8 sm:mb-12">
                            <img 
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c928b8ad45368d33ec6517/4236da16e_SPIRAL_STUDIOS_LOGO_SAPPHIRE_LAVENDER.png"
                                alt="Spiral Studios"
                                className="h-20 sm:h-32 w-auto object-contain"
                            />
                        </div>

                        {/* Hero Headline */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-xs sm:text-sm font-medium">
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                AI-Powered App Discovery Platform
                            </div>
                            
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight px-4">
                                Turn Frustrations Into
                                <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                                    Breakthrough Apps
                                </span>
                            </h1>
                            
                            <p className="text-base sm:text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed px-4">
                                <strong className="text-white">IdeaForge</strong> uses advanced AI to analyze user pain points across industries, 
                                study competitor successes, and generate innovative app concepts with detailed development blueprints.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-6 sm:pt-8 px-4">
                            <Link to={createPageUrl("Dashboard")} className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                                    Start Discovering Ideas
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
                                </Button>
                            </Link>
                            <Link to={createPageUrl("About")} className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                                    Learn How It Works
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 sm:py-24 bg-gradient-to-b from-transparent to-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-16">
                        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                            How IdeaForge Works
                        </h2>
                        <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto">
                            Our AI-driven platform transforms market research into actionable app concepts
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={index} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 hover:border-slate-600 transition-all duration-300 group">
                                    <CardContent className="p-6 sm:p-8 text-center">
                                        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-all duration-300">
                                            <Icon className="w-8 h-8 text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                        <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-16 sm:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
                                Why Choose IdeaForge?
                            </h2>
                            <p className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8 leading-relaxed">
                                Stop guessing what apps to build. Let data and AI guide you to profitable opportunities 
                                that solve real user problems.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-slate-300">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:order-first">
                            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 p-6 sm:p-8">
                                <div className="text-center space-y-4 sm:space-y-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                                        <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready to Get Started?</h3>
                                        <p className="text-slate-400 mb-4 sm:mb-6">
                                            Join innovators who are discovering their next breakthrough app idea
                                        </p>
                                        <Link to={createPageUrl("NewResearch")}>
                                            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 font-semibold">
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

            {/* Accessibility Section */}
            <div className="py-16 sm:py-24 bg-gradient-to-b from-slate-900/50 to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-16">
                        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                            Built with Accessibility in Mind
                        </h2>
                        <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto">
                            IdeaForge ensures everyone can discover and develop innovative apps, regardless of ability
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {accessibilityFeatures.map((feature, index) => (
                            <div key={index} className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 sm:p-6 hover:border-blue-500/50 transition-all duration-300">
                                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                                    <CheckCircle className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Disclaimer Section */}
            <div className="py-16 bg-slate-900/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Card className="bg-slate-800/30 border border-slate-700">
                        <CardContent className="p-4 sm:p-8">
                            <h3 className="text-white font-bold text-xl mb-4">Important Disclaimer</h3>
                            <div className="space-y-3 text-slate-400 text-sm">
                                <p>
                                    IdeaForge uses AI to research market opportunities and generate app concepts based on publicly available information. While we strive for accuracy, please note:
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
                                    By using IdeaForge, you acknowledge that Spiral Studios and its affiliates are not responsible for any outcomes resulting from acting on AI-generated suggestions.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-12 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <img 
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c928b8ad45368d33ec6517/4236da16e_SPIRAL_STUDIOS_LOGO_SAPPHIRE_LAVENDER.png"
                                alt="Spiral Studios"
                                className="h-12 w-auto object-contain opacity-80"
                            />
                            <p className="text-slate-400 text-sm text-center md:text-left">
                                © 2024 Spiral Studios. Transforming ideas into reality through intelligent innovation.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Link to={createPageUrl("About")}>
                                <Button variant="outline" className="w-full sm:w-auto border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white">
                                    <span className="text-slate-300">About IdeaForge</span>
                                </Button>
                            </Link>
                            <Button
                                type="button"
                                variant="outline"
                                className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                                onClick={() => window.open('https://spiralstudios.com.au', '_blank')}
                            >
                                <span className="text-slate-300">Spiral Studios</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}