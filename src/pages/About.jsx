import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Sparkles,
  Target,
  Zap,
  Users,
  Shield,
  Globe } from
"lucide-react";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0B1426 0%, #1A2332 100%)' }}>
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate(createPageUrl("Landing"))}
            className="text-slate-400 hover:text-white hover:bg-slate-800">

                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            About Idea Spark
                        </h1>
                        <p className="text-slate-400 mt-2">AI-Powered App Discovery Platform by Spiral Studios</p>
                    </div>
                </div>

                {/* Mission */}
                <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl mb-8">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                            <Target className="w-6 h-6 text-blue-400" />
                            Our Mission
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-300 space-y-4">
                        <p className="text-lg leading-relaxed">
                            Idea Spark transforms how entrepreneurs and developers discover app opportunities. Instead of guessing what to build, we use advanced AI to analyze real user frustrations across any industry, study successful competitors, and generate innovative app concepts backed by data.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Whether you type "Fish", "Removalist", or "Healthcare" - our AI deep dives into that specific market to uncover pain points and opportunities that others miss.
                        </p>
                    </CardContent>
                </Card>

                {/* How It Works */}
                <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl mb-8">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                            <Zap className="w-6 h-6 text-purple-400" />
                            How It Works
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-400 font-bold text-lg">1</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Deep Market Research</h3>
                                <p className="text-slate-400">Our AI scours the internet for user complaints, negative reviews, Reddit discussions, and forum posts about your target market.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-purple-400 font-bold text-lg">2</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Competitor Analysis</h3>
                                <p className="text-slate-400">We analyze what successful apps in your space do well and where they fall short, identifying gaps you can fill.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-green-400 font-bold text-lg">3</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Concept Generation</h3>
                                <p className="text-slate-400">AI generates multiple innovative app concepts, each addressing specific pain points with unique features and competitive advantages.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-amber-400 font-bold text-lg">4</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-2">Development Blueprints</h3>
                                <p className="text-slate-400">Get master prompts for architects and builders, complete with tech stack recommendations and implementation strategies.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Features */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-amber-400" />
                                Key Features
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-300 space-y-3">
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>AI-powered market research in minutes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Real user pain point analysis</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Competitor intelligence reports</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Multiple app concept generation</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Development blueprints & prompts</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Concept combination for super-apps</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-3">
                                <Shield className="w-5 h-5 text-green-400" />
                                Built with Care
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-slate-300 space-y-3">
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>WCAG 2.2 AA accessibility standards</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Location-aware research (Australia+)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Auto-save for all your work</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Mobile-responsive design</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Secure data handling</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>Privacy-first approach</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Spiral Studios */}
                <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl mb-8">
                    <CardContent className="bg-slate-900 p-8">
                        <div className="flex items-center gap-6 mb-6">
                            <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68c928b8ad45368d33ec6517/4236da16e_SPIRAL_STUDIOS_LOGO_SAPPHIRE_LAVENDER.png"
                alt="Spiral Studios"
                className="h-20 w-auto object-contain" />

                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Built by Spiral Studios</h2>
                                <p className="text-slate-300">Transforming ideas into reality through intelligent innovation</p>
                            </div>
                        </div>
                        <p className="text-slate-300 mb-6">
                            Spiral Studios is a cutting-edge software development studio specializing in AI-powered solutions for entrepreneurs and businesses. We believe in making advanced technology accessible to everyone.
                        </p>
                        <Button
              type="button"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={() => window.open('https://spiralstudios.com.au', '_blank')}>

                            <span className="text-white">Visit Spiral Studios</span>
                            <ArrowLeft className="w-4 h-4 ml-2 rotate-180 text-white" />
                        </Button>
                    </CardContent>
                </Card>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Discover Your Next App?</h2>
                    <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                        Start researching any market in minutes. From "Fish" to "Fintech" - we'll uncover opportunities you never knew existed.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to={createPageUrl("Dashboard")}>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                                <Sparkles className="w-5 h-5 mr-2 text-white" />
                                <span className="text-white">Get Started Free</span>
                            </Button>
                        </Link>
                        <Link to={createPageUrl("Landing")}>
                            <Button variant="outline" className="border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white px-8 py-4 text-lg">
                                <span className="text-slate-300">Back to Home</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>);

}