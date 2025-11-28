import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    Loader2,
    Copy,
    RefreshCw,
    Users,
    Target,
    TrendingUp,
    Lightbulb,
    Link2,
    DollarSign,
    Newspaper,
    MessageSquare,
    Shield,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";

export default function DeepDiveModal({ 
    open, 
    onClose, 
    type, // 'pain_point' or 'competitor'
    subject, // the pain point or competitor object
    projectTitle,
    industry 
}) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);

    const performDeepDive = async () => {
        setIsAnalyzing(true);
        setError(null);

        try {
            if (type === 'pain_point') {
                const prompt = `Perform a comprehensive deep dive analysis on this user pain point from the ${industry || 'general'} industry.

**Pain Point:**
Issue: ${subject.issue}
Severity: ${subject.severity}
Frequency Score: ${subject.frequency}
User Examples: ${subject.source_examples?.join('\n') || 'N/A'}

**Context:**
Project: ${projectTitle}
Industry: ${industry || 'general'}

**Analysis Required:**
1. ROOT CAUSES: Identify 3-5 underlying reasons why this pain point exists
2. USER STORIES: Create 3-4 realistic user stories that illustrate this frustration (include persona name, scenario, and emotional impact)
3. MARKET IMPACT: Assess how widespread and significant this issue is (reach, affected demographics, economic impact)
4. SOLUTION OPPORTUNITIES: Suggest 4-6 specific ways to address this pain point (include feasibility assessment)
5. RELATED FRUSTRATIONS: Identify 3-5 connected pain points users might also experience

Use current real-world data and examples. Be specific and actionable.`;

                const result = await base44.integrations.Core.InvokeLLM({
                    prompt,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            root_causes: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        cause: { type: "string" },
                                        explanation: { type: "string" }
                                    }
                                }
                            },
                            user_stories: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        persona: { type: "string" },
                                        scenario: { type: "string" },
                                        impact: { type: "string" }
                                    }
                                }
                            },
                            market_impact: {
                                type: "object",
                                properties: {
                                    reach: { type: "string" },
                                    affected_demographics: { type: "array", items: { type: "string" } },
                                    economic_impact: { type: "string" }
                                }
                            },
                            solution_opportunities: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        solution: { type: "string" },
                                        feasibility: { type: "string" },
                                        impact_potential: { type: "string" }
                                    }
                                }
                            },
                            related_frustrations: {
                                type: "array",
                                items: { type: "string" }
                            }
                        }
                    }
                });

                setAnalysis({ type: 'pain_point', data: result });

            } else if (type === 'competitor') {
                const prompt = `Perform a comprehensive competitive intelligence analysis on "${subject.app_name}" in the ${industry || 'general'} industry.

**Competitor:**
Name: ${subject.app_name}
Known Strengths: ${subject.successful_features?.join(', ') || 'N/A'}
Known Weaknesses: ${subject.improvement_opportunities?.join(', ') || 'N/A'}

**Context:**
Project: ${projectTitle}
Industry: ${industry || 'general'}

**Analysis Required:**
1. MONETIZATION STRATEGY: Detail their pricing models, revenue streams, and business model
2. RECENT NEWS: Summarize 3-5 significant developments in the last 6 months (include dates if available)
3. USER SENTIMENT: Current user reviews and sentiment analysis (what they love/hate, overall trend)
4. STRATEGIC POSITIONING: Their market strategy, target audience, and key differentiators
5. VULNERABILITY ANALYSIS: 3-5 specific weaknesses or gaps you could exploit (include priority level)

Search for current information about this company. Be specific with numbers, dates, and examples.`;

                const result = await base44.integrations.Core.InvokeLLM({
                    prompt,
                    add_context_from_internet: true,
                    response_json_schema: {
                        type: "object",
                        properties: {
                            monetization: {
                                type: "object",
                                properties: {
                                    pricing_model: { type: "string" },
                                    revenue_streams: { type: "array", items: { type: "string" } },
                                    pricing_details: { type: "string" }
                                }
                            },
                            recent_news: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        date: { type: "string" },
                                        headline: { type: "string" },
                                        summary: { type: "string" }
                                    }
                                }
                            },
                            user_sentiment: {
                                type: "object",
                                properties: {
                                    overall_rating: { type: "string" },
                                    top_praises: { type: "array", items: { type: "string" } },
                                    top_complaints: { type: "array", items: { type: "string" } },
                                    sentiment_trend: { type: "string" }
                                }
                            },
                            strategic_positioning: {
                                type: "object",
                                properties: {
                                    target_market: { type: "string" },
                                    market_strategy: { type: "string" },
                                    key_differentiators: { type: "array", items: { type: "string" } }
                                }
                            },
                            vulnerabilities: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        weakness: { type: "string" },
                                        exploitation_strategy: { type: "string" },
                                        priority: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                });

                setAnalysis({ type: 'competitor', data: result });
            }

            toast.success("Deep dive analysis complete!");

        } catch (err) {
            console.error("Deep dive failed:", err);
            setError(err.message || "Failed to perform deep dive analysis");
            toast.error("Analysis failed. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCopy = () => {
        if (!analysis) return;
        
        let textContent = "";
        
        if (analysis.type === 'pain_point') {
            const d = analysis.data;
            textContent = `DEEP DIVE: ${subject.issue}\n\n`;
            textContent += `ROOT CAUSES:\n${d.root_causes?.map(c => `• ${c.cause}: ${c.explanation}`).join('\n') || 'N/A'}\n\n`;
            textContent += `USER STORIES:\n${d.user_stories?.map(s => `• ${s.persona}: ${s.scenario} (Impact: ${s.impact})`).join('\n') || 'N/A'}\n\n`;
            textContent += `MARKET IMPACT:\nReach: ${d.market_impact?.reach || 'N/A'}\nAffected: ${d.market_impact?.affected_demographics?.join(', ') || 'N/A'}\nEconomic Impact: ${d.market_impact?.economic_impact || 'N/A'}\n\n`;
            textContent += `SOLUTIONS:\n${d.solution_opportunities?.map(s => `• ${s.solution} (Feasibility: ${s.feasibility})`).join('\n') || 'N/A'}\n\n`;
            textContent += `RELATED ISSUES:\n${d.related_frustrations?.map(f => `• ${f}`).join('\n') || 'N/A'}`;
        } else {
            const d = analysis.data;
            textContent = `COMPETITIVE DEEP DIVE: ${subject.app_name}\n\n`;
            textContent += `MONETIZATION:\n${d.monetization?.pricing_model || 'N/A'}\nRevenue Streams: ${d.monetization?.revenue_streams?.join(', ') || 'N/A'}\n\n`;
            textContent += `RECENT NEWS:\n${d.recent_news?.map(n => `• [${n.date}] ${n.headline}`).join('\n') || 'N/A'}\n\n`;
            textContent += `USER SENTIMENT:\nRating: ${d.user_sentiment?.overall_rating || 'N/A'}\nTrend: ${d.user_sentiment?.sentiment_trend || 'N/A'}\n\n`;
            textContent += `VULNERABILITIES:\n${d.vulnerabilities?.map(v => `• ${v.weakness} (Priority: ${v.priority})`).join('\n') || 'N/A'}`;
        }

        navigator.clipboard.writeText(textContent);
        toast.success("Analysis copied to clipboard!");
    };

    // Reset state when modal opens
    React.useEffect(() => {
        if (open && !analysis && !isAnalyzing) {
            performDeepDive();
        }
    }, [open]);

    const handleClose = () => {
        setAnalysis(null);
        setError(null);
        onClose();
    };

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent className="w-full sm:max-w-2xl bg-slate-900 border-slate-700 overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-white text-xl flex items-center gap-3">
                        {type === 'pain_point' ? (
                            <>
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                                Pain Point Deep Dive
                            </>
                        ) : (
                            <>
                                <Users className="w-6 h-6 text-purple-400" />
                                Competitor Deep Dive
                            </>
                        )}
                    </SheetTitle>
                    <p className="text-slate-400 text-sm mt-1">
                        {type === 'pain_point' ? subject?.issue : subject?.app_name}
                    </p>
                </SheetHeader>

                {/* Loading State */}
                {isAnalyzing && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                        <p className="text-white text-lg font-medium mb-2">Analyzing with AI...</p>
                        <p className="text-slate-400 text-sm text-center">
                            Searching the web for current data and generating insights
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && !isAnalyzing && (
                    <div className="text-center py-12">
                        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <p className="text-white text-lg mb-2">Analysis Failed</p>
                        <p className="text-slate-400 text-sm mb-6">{error}</p>
                        <Button onClick={performDeepDive} className="bg-blue-600 hover:bg-blue-700">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Pain Point Analysis Results */}
                {analysis?.type === 'pain_point' && !isAnalyzing && (
                    <div className="space-y-6">
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopy} className="border-slate-600 text-slate-300 hover:bg-slate-800">
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={performDeepDive} className="border-slate-600 text-slate-300 hover:bg-slate-800">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </div>

                        <Tabs defaultValue="causes" className="w-full">
                            <TabsList className="grid w-full grid-cols-5 bg-slate-800">
                                <TabsTrigger value="causes" className="text-xs">Causes</TabsTrigger>
                                <TabsTrigger value="stories" className="text-xs">Stories</TabsTrigger>
                                <TabsTrigger value="impact" className="text-xs">Impact</TabsTrigger>
                                <TabsTrigger value="solutions" className="text-xs">Solutions</TabsTrigger>
                                <TabsTrigger value="related" className="text-xs">Related</TabsTrigger>
                            </TabsList>

                            <TabsContent value="causes" className="mt-4 space-y-3">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Target className="w-4 h-4 text-red-400" />
                                    Root Causes
                                </h3>
                                {analysis.data.root_causes?.map((cause, i) => (
                                    <div key={i} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                                        <p className="text-white font-medium">{cause.cause}</p>
                                        <p className="text-slate-400 text-sm mt-1">{cause.explanation}</p>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="stories" className="mt-4 space-y-3">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    User Stories
                                </h3>
                                {analysis.data.user_stories?.map((story, i) => (
                                    <div key={i} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                                        <p className="text-blue-300 font-medium">{story.persona}</p>
                                        <p className="text-slate-300 text-sm mt-1">{story.scenario}</p>
                                        <p className="text-amber-400 text-xs mt-2">Impact: {story.impact}</p>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="impact" className="mt-4 space-y-3">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                    Market Impact
                                </h3>
                                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-3">
                                    <div>
                                        <span className="text-slate-400 text-sm">Reach:</span>
                                        <p className="text-white">{analysis.data.market_impact?.reach || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-sm">Affected Demographics:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {analysis.data.market_impact?.affected_demographics?.map((demo, i) => (
                                                <Badge key={i} className="bg-blue-600/20 text-blue-300 border-blue-500/30">{demo}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-sm">Economic Impact:</span>
                                        <p className="text-white">{analysis.data.market_impact?.economic_impact || 'N/A'}</p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="solutions" className="mt-4 space-y-3">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-400" />
                                    Solution Opportunities
                                </h3>
                                {analysis.data.solution_opportunities?.map((sol, i) => (
                                    <div key={i} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                                        <p className="text-white">{sol.solution}</p>
                                        <div className="flex gap-4 mt-2 text-xs">
                                            <span className="text-slate-400">Feasibility: <span className="text-green-400">{sol.feasibility}</span></span>
                                            <span className="text-slate-400">Impact: <span className="text-blue-400">{sol.impact_potential}</span></span>
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="related" className="mt-4 space-y-3">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Link2 className="w-4 h-4 text-purple-400" />
                                    Related Frustrations
                                </h3>
                                <div className="space-y-2">
                                    {analysis.data.related_frustrations?.map((frustration, i) => (
                                        <div key={i} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                                            <p className="text-slate-300">{frustration}</p>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

                {/* Competitor Analysis Results */}
                {analysis?.type === 'competitor' && !isAnalyzing && (
                    <div className="space-y-6">
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopy} className="border-slate-600 text-slate-300 hover:bg-slate-800">
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={performDeepDive} className="border-slate-600 text-slate-300 hover:bg-slate-800">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </div>

                        <Tabs defaultValue="monetization" className="w-full">
                            <TabsList className="grid w-full grid-cols-5 bg-slate-800">
                                <TabsTrigger value="monetization" className="text-xs">Revenue</TabsTrigger>
                                <TabsTrigger value="news" className="text-xs">News</TabsTrigger>
                                <TabsTrigger value="sentiment" className="text-xs">Sentiment</TabsTrigger>
                                <TabsTrigger value="strategy" className="text-xs">Strategy</TabsTrigger>
                                <TabsTrigger value="vulnerabilities" className="text-xs">Weak</TabsTrigger>
                            </TabsList>

                            <TabsContent value="monetization" className="mt-4 space-y-3">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-400" />
                                    Monetization Strategy
                                </h3>
                                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-3">
                                    <div>
                                        <span className="text-slate-400 text-sm">Pricing Model:</span>
                                        <p className="text-white">{analysis.data.monetization?.pricing_model || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-sm">Revenue Streams:</span>
                                        <ul className="list-disc list-inside text-slate-300 text-sm mt-1">
                                            {analysis.data.monetization?.revenue_streams?.map((stream, i) => (
                                                <li key={i}>{stream}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-sm">Pricing Details:</span>
                                        <p className="text-white text-sm">{analysis.data.monetization?.pricing_details || 'N/A'}</p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="news" className="mt-4 space-y-3">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Newspaper className="w-4 h-4 text-blue-400" />
                                    Recent News
                                </h3>
                                {analysis.data.recent_news?.map((news, i) => (
                                    <div key={i} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-white font-medium">{news.headline}</p>
                                            <Badge className="bg-slate-700 text-slate-300 text-xs">{news.date}</Badge>
                                        </div>
                                        <p className="text-slate-400 text-sm">{news.summary}</p>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="sentiment" className="mt-4 space-y-3">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-amber-400" />
                                    User Sentiment
                                </h3>
                                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Overall Rating:</span>
                                        <span className="text-white font-medium">{analysis.data.user_sentiment?.overall_rating || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Trend:</span>
                                        <Badge className={
                                            analysis.data.user_sentiment?.sentiment_trend === 'improving' ? 'bg-green-600/20 text-green-300' :
                                            analysis.data.user_sentiment?.sentiment_trend === 'declining' ? 'bg-red-600/20 text-red-300' :
                                            'bg-slate-600/20 text-slate-300'
                                        }>
                                            {analysis.data.user_sentiment?.sentiment_trend || 'N/A'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <span className="text-green-400 text-sm font-medium">What Users Love:</span>
                                        <ul className="list-disc list-inside text-slate-300 text-sm mt-1">
                                            {analysis.data.user_sentiment?.top_praises?.map((praise, i) => (
                                                <li key={i}>{praise}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="text-red-400 text-sm font-medium">Common Complaints:</span>
                                        <ul className="list-disc list-inside text-slate-300 text-sm mt-1">
                                            {analysis.data.user_sentiment?.top_complaints?.map((complaint, i) => (
                                                <li key={i}>{complaint}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="strategy" className="mt-4 space-y-3">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Target className="w-4 h-4 text-purple-400" />
                                    Strategic Positioning
                                </h3>
                                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-3">
                                    <div>
                                        <span className="text-slate-400 text-sm">Target Market:</span>
                                        <p className="text-white">{analysis.data.strategic_positioning?.target_market || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-sm">Market Strategy:</span>
                                        <p className="text-white text-sm">{analysis.data.strategic_positioning?.market_strategy || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-sm">Key Differentiators:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {analysis.data.strategic_positioning?.key_differentiators?.map((diff, i) => (
                                                <Badge key={i} className="bg-purple-600/20 text-purple-300 border-purple-500/30">{diff}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="vulnerabilities" className="mt-4 space-y-3">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-red-400" />
                                    Vulnerabilities
                                </h3>
                                {analysis.data.vulnerabilities?.map((vuln, i) => (
                                    <div key={i} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-white font-medium">{vuln.weakness}</p>
                                            <Badge className={
                                                vuln.priority === 'high' ? 'bg-red-600/20 text-red-300' :
                                                vuln.priority === 'medium' ? 'bg-amber-600/20 text-amber-300' :
                                                'bg-blue-600/20 text-blue-300'
                                            }>
                                                {vuln.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-1">
                                            <span className="text-green-400">Strategy:</span> {vuln.exploitation_strategy}
                                        </p>
                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}