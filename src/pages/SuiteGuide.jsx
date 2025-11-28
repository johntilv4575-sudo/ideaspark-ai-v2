import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Target,
  Zap,
  Users,
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
  Brain,
  TrendingUp } from
"lucide-react";

export default function SuiteGuide() {
  return (
    <div className="min-h-screen app-background text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-8">
                    <Badge className="mb-4 bg-blue-600">For Business Mentors & Demonstrators</Badge>
                    <h1 className="text-4xl font-bold mb-4">Spiral Start-up Suite Integration Guide</h1>
                    <p className="text-xl text-slate-300">
                        Complete demo flow showing how SpiralPlan, Idea Spark, App Forge, and App Master work together
                        to take entrepreneurs from competitive analysis through discovery to launch.
                    </p>
                </div>

                {/* Overview */}
                <Card className="card-secondary mb-8">
                    <CardHeader className="bg-slate-800 p-6 flex flex-col space-y-1.5">
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-400" />
                            Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-gray-950 pt-0 p-6 space-y-4">
                        <p className="text-slate-300">
                            The Spiral Start-up Suite consists of four interconnected applications:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                <Brain className="w-8 h-8 text-green-400 mb-2" />
                                <h3 className="text-white mb-2 font-semibold">0. SpiralPlan</h3>
                                <p className="text-sm text-slate-400">Competitive intelligence and market positioning analysis</p>
                                <p className="text-xs text-green-300 mt-2">https://spiral-plan-0f142f84.base44.app</p>
                            </div>
                            
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <Sparkles className="w-8 h-8 text-blue-400 mb-2" />
                                <h3 className="font-semibold mb-2">1. Idea Spark</h3>
                                <p className="text-sm text-slate-400">AI-powered market research and app concept generation</p>
                                <p className="text-xs text-blue-300 mt-2">https://idea-spark-ai-33ec6517.base44.app</p>
                            </div>
                            
                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                                <Target className="w-8 h-8 text-purple-400 mb-2" />
                                <h3 className="font-semibold mb-2">2. App Forge</h3>
                                <p className="text-sm text-slate-400">Idea validation, MVP planning, and go-to-market strategy</p>
                                <p className="text-xs text-purple-300 mt-2">https://app-forge-3bf6353f.base44.app</p>
                            </div>
                            
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                                <Users className="w-8 h-8 text-amber-400 mb-2" />
                                <h3 className="font-semibold mb-2">3. App Master</h3>
                                <p className="text-sm text-slate-400">Project management, team coordination, and launch execution</p>
                                <p className="text-xs text-amber-300 mt-2">https://app-master-c9c24cd9.base44.app</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stage 0: Competitive Intelligence */}
                <Card className="card-secondary mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold">0</div>
                            Stage 0: Competitive Intelligence (SpiralPlan)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-gray-900 pt-0 p-6 space-y-6">
                        <div>
                            <h3 className="text-slate-200 mb-3 text-lg font-semibold flex items-center gap-2">Step 1: Analyze Competitors


              </h3>
                            <ol className="space-y-2 text-slate-300 ml-7">
                                <li>1. Open <strong>SpiralPlan</strong></li>
                                <li>2. Click <strong>"New Analysis"</strong></li>
                                <li>3. Enter competitor information:</li>
                            </ol>
                            <div className="bg-slate-900/50 rounded-lg p-4 mt-3 ml-7">
                                <ul className="space-y-1 text-sm text-slate-400">
                                    <li><strong className="text-white">Competitor Name:</strong> "Rover" (example)</li>
                                    <li><strong className="text-white">Industry:</strong> Pet Care Services</li>
                                    <li><strong className="text-white">Website:</strong> https://rover.com</li>
                                    <li><strong className="text-white">Analysis Focus:</strong> Features, Pricing, Market Position</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <Brain className="w-5 h-5 text-green-400" />
                                Step 2: Review Competitive Intelligence
                            </h3>
                            <p className="text-slate-300 ml-7 mb-2">SpiralPlan provides:</p>
                            <ul className="space-y-1 text-slate-300 ml-7 list-disc list-inside">
                                <li>Competitor strengths and weaknesses</li>
                                <li>Market positioning analysis</li>
                                <li>Feature gaps and opportunities</li>
                                <li>Pricing strategy insights</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <ArrowRight className="w-5 h-5 text-green-400" />
                                Step 3: Export to Idea Spark (Suite Feature)
                            </h3>
                            <ol className="space-y-2 text-slate-300 ml-7">
                                <li>1. Click <strong>"Send to Idea Spark"</strong> button</li>
                                <li>2. <span className="text-amber-400 font-semibold">IMPORTANT:</span> This requires <Badge className="bg-purple-600">Suite Starter</Badge> or <Badge className="bg-amber-600">Suite Creator</Badge> tier</li>
                                <li>3. Competitive insights transfer to inform market research</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>

                {/* Stage 1: Discovery */}
                <Card className="card-secondary mb-8">
                    <CardHeader className="bg-slate-800 p-6 flex flex-col space-y-1.5">
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">1</div>
                            Stage 1: Discovery (Idea Spark)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-gray-950 pt-0 p-6 space-y-6">
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <p className="text-sm font-semibold mb-1">Idea Spark URL:</p>
                            <a href="https://idea-spark-ai-33ec6517.base44.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                                https://idea-spark-ai-33ec6517.base44.app
                            </a>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-400" />
                                Step 4: Receive Handoff from SpiralPlan (Optional)
                            </h3>
                            <p className="text-slate-300 ml-7">
                                If coming from SpiralPlan, competitive intelligence is pre-loaded. Otherwise, start fresh research.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-blue-400" />
                                Step 5: Create New Research Project
                            </h3>
                            <ol className="space-y-2 text-slate-300 ml-7">
                                <li>1. Click <strong>"Start New Research"</strong> button</li>
                                <li>2. Fill in the research form:</li>
                            </ol>
                            <div className="bg-slate-900/50 rounded-lg p-4 mt-3 ml-7">
                                <ul className="space-y-1 text-sm text-slate-400">
                                    <li><strong className="text-white">Title:</strong> "Pet Care Services" (example)</li>
                                    <li><strong className="text-white">Industry:</strong> Select "healthcare" or "other"</li>
                                    <li><strong className="text-white">Description:</strong> "Services for busy pet owners who struggle to find reliable pet care"</li>
                                    <li><strong className="text-white">Keywords:</strong> Add: "pet sitting", "dog walking", "veterinary"</li>
                                    <li><strong className="text-white">Geographic Focus:</strong> Select "Australia" (or your region)</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-400" />
                                Step 6: AI Analysis (Automated - Takes 2-3 minutes)
                            </h3>
                            <p className="text-slate-300 ml-7 mb-2">The AI will:</p>
                            <ul className="space-y-1 text-slate-300 ml-7 list-disc list-inside">
                                <li>Analyze user complaints about pet care services</li>
                                <li>Research successful pet care apps</li>
                                <li>Generate 3-5 innovative app concepts</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <ArrowRight className="w-5 h-5 text-green-400" />
                                Step 7: Send to App Forge (Suite Feature)
                            </h3>
                            <ol className="space-y-2 text-slate-300 ml-7">
                                <li>1. On the concept details page, click <strong>"Send to App Forge"</strong> button</li>
                                <li>2. A new browser tab opens with <strong>App Forge</strong> pre-loaded with your concept data</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>

                {/* Stage 2: Validation */}
                <Card className="card-secondary mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold">2</div>
                            Stage 2: Validation (App Forge)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-gray-950 pt-0 p-6 space-y-6">
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                            <p className="text-sm font-semibold mb-1">App Forge URL:</p>
                            <a href="https://app-forge-3bf6353f.base44.app" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">
                                https://app-forge-3bf6353f.base44.app
                            </a>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-3">Step 8: Validate the Idea</h3>
                            <p className="text-slate-300 ml-7 mb-2">Use App Forge to:</p>
                            <ul className="space-y-1 text-slate-300 ml-7 list-disc list-inside">
                                <li>Reality check the concept</li>
                                <li>Deep dive into competitors</li>
                                <li>Define MVP features</li>
                                <li>Create user stories</li>
                                <li>Build go-to-market strategy</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                <ArrowRight className="w-5 h-5 text-green-400" />
                                Step 9: Send to App Master (Suite Feature)
                            </h3>
                            <ol className="space-y-2 text-slate-300 ml-7">
                                <li>1. In App Forge, once MVP is planned, click <strong>"Send to App Master"</strong></li>
                                <li>2. This transfers all validated planning data to project management</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>

                {/* Stage 3: Development */}
                <Card className="card-secondary mb-8">
                    <CardHeader className="bg-slate-800 p-6 flex flex-col space-y-1.5">
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-amber-600 text-white rounded-lg flex items-center justify-center font-bold">3</div>
                            Stage 3: Development & Launch (App Master)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="bg-gray-950 pt-0 p-6 space-y-6">
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                            <p className="text-sm font-semibold mb-1">App Master URL:</p>
                            <a href="https://app-master-c9c24cd9.base44.app" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
                                https://app-master-c9c24cd9.base44.app
                            </a>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-3">Step 10: Manage Development</h3>
                            <ul className="space-y-1 text-slate-300 ml-7 list-disc list-inside">
                                <li>Set up sprint planning</li>
                                <li>Assign tasks to team members</li>
                                <li>Track progress and velocity</li>
                                <li>Coordinate launch activities</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* Complete Workflow Diagram */}
                <Card className="card-secondary mb-8">
                    <CardHeader className="bg-slate-800 p-6 flex flex-col space-y-1.5">
                        <CardTitle>Complete Suite Workflow</CardTitle>
                    </CardHeader>
                    <CardContent className="bg-gray-950 pt-0 p-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <div className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">0</div>
                                <div>
                                    <p className="text-white font-semibold">SpiralPlan</p>
                                    <p className="text-slate-400 text-sm">Analyze competitors → Identify market gaps</p>
                                </div>
                                <ArrowRight className="w-6 h-6 text-green-400 ml-auto" />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">1</div>
                                <div>
                                    <p className="text-white font-semibold">Idea Spark</p>
                                    <p className="text-slate-400 text-sm">Research pain points → Generate concepts</p>
                                </div>
                                <ArrowRight className="w-6 h-6 text-blue-400 ml-auto" />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                <div className="w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">2</div>
                                <div>
                                    <p className="text-white font-semibold">App Forge</p>
                                    <p className="text-slate-400 text-sm">Validate concept → Plan MVP</p>
                                </div>
                                <ArrowRight className="w-6 h-6 text-purple-400 ml-auto" />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                <div className="w-10 h-10 bg-amber-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">3</div>
                                <div>
                                    <p className="text-white font-semibold">App Master</p>
                                    <p className="text-slate-400 text-sm">Manage development → Launch product</p>
                                </div>
                                <CheckCircle className="w-6 h-6 text-amber-400 ml-auto" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Messages */}
                <Card className="card-secondary mb-8">
                    <CardHeader className="bg-slate-800 p-6 flex flex-col space-y-1.5">
                        <CardTitle>Key Messages for Each App</CardTitle>
                    </CardHeader>
                    <CardContent className="bg-gray-950 pt-0 p-6 space-y-4">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <h3 className="text-white mb-2 font-semibold flex items-center gap-2">SpiralPlan


              </h3>
                            <ul className="space-y-1 text-sm text-slate-300 list-disc list-inside">
                                <li>"Know your competition before you build"</li>
                                <li>"Find the gaps in the market that competitors miss"</li>
                                <li>"From competitive analysis to strategic positioning"</li>
                            </ul>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <h3 className="text-white mb-2 font-semibold flex items-center gap-2">Idea Spark


              </h3>
                            <ul className="space-y-1 text-sm text-slate-300 list-disc list-inside">
                                <li>"Stop guessing what to build - let AI research the market for you"</li>
                                <li>"Turn user frustrations into profitable opportunities"</li>
                                <li>"From 'I have an idea' to 'Here's 5 validated concepts' in minutes"</li>
                            </ul>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                            <h3 className="text-white mb-2 font-semibold flex items-center gap-2">App Forge


              </h3>
                            <ul className="space-y-1 text-sm text-slate-300 list-disc list-inside">
                                <li>"Before you write a single line of code, validate your idea"</li>
                                <li>"Your personal CTO and business strategist in one app"</li>
                                <li>"Transform concepts into actionable MVP plans"</li>
                            </ul>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                            <h3 className="text-white mb-2 font-semibold flex items-center gap-2">App Master


              </h3>
                            <ul className="space-y-1 text-sm text-slate-300 list-disc list-inside">
                                <li>"From plan to launch with clarity and confidence"</li>
                                <li>"Keep your team aligned and your project on track"</li>
                                <li>"Launch with precision, iterate with purpose"</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing Tiers */}
                <Card className="card-secondary">
                    <CardHeader className="bg-slate-800 p-6 flex flex-col space-y-1.5">
                        <CardTitle>Suite Tier Messaging</CardTitle>
                    </CardHeader>
                    <CardContent className="bg-gray-950 pt-0 p-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 rounded-lg p-4">
                                <Badge className="mb-2 bg-slate-600">Free Tier</Badge>
                                <ul className="space-y-1 text-sm text-slate-300">
                                    <li>• 3 research projects per month</li>
                                    <li>• 3 concepts per project</li>
                                    <li>• Single-app usage only</li>
                                    <li>• No cross-app handoffs</li>
                                </ul>
                            </div>

                            <div className="bg-slate-900/50 rounded-lg p-4">
                                <Badge className="mb-2 bg-blue-600">Pro Tier</Badge>
                                <ul className="space-y-1 text-sm text-slate-300">
                                    <li>• Unlimited projects</li>
                                    <li>• 10 concepts per project</li>
                                    <li>• PDF exports</li>
                                    <li>• Advanced market scoring</li>
                                    <li>• Single-app usage</li>
                                </ul>
                            </div>

                            <div className="bg-slate-900/50 rounded-lg p-4">
                                <Badge className="mb-2 bg-purple-600">Suite Starter</Badge>
                                <ul className="space-y-1 text-sm text-slate-300">
                                    <li>• Everything in Pro</li>
                                    <li>• <strong>Cross-app handoffs</strong> (All 4 apps)</li>
                                    <li>• Pipeline tracking</li>
                                    <li>• Shared context across apps</li>
                                    <li>• SpiralPlan → Idea Spark → App Forge</li>
                                </ul>
                            </div>

                            <div className="bg-slate-900/50 rounded-lg p-4">
                                <Badge className="mb-2 bg-amber-600">Suite Creator</Badge>
                                <ul className="space-y-1 text-sm text-slate-300">
                                    <li>• Everything in Suite Starter</li>
                                    <li>• <strong>Full 4-app orchestration</strong></li>
                                    <li>• AI orchestrations between apps</li>
                                    <li>• Priority support</li>
                                    <li>• Complete workflow automation</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>);

}