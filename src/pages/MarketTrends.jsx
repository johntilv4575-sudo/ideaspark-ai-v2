import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import {
    Search,
    TrendingUp,
    TrendingDown,
    Users,
    Cpu,
    Target,
    AlertTriangle,
    Sparkles,
    ArrowRight,
    Globe,
    DollarSign,
    Shield,
    Zap,
    Brain,
    Loader2,
    BookmarkPlus,
    Bookmark,
    ExternalLink,
    ArrowLeft
} from "lucide-react";

const POPULAR_INDUSTRIES = [
    { id: "healthcare", label: "Healthcare & Medical", icon: "🏥" },
    { id: "fintech", label: "FinTech & Banking", icon: "💰" },
    { id: "edtech", label: "Education & Learning", icon: "📚" },
    { id: "wellness", label: "Wellness & Fitness", icon: "🧘" },
    { id: "ecommerce", label: "E-commerce & Retail", icon: "🛒" },
    { id: "saas", label: "SaaS & Productivity", icon: "💼" },
    { id: "pet_care", label: "Pet Care & Services", icon: "🐾" },
    { id: "food_delivery", label: "Food & Delivery", icon: "🍔" },
    { id: "travel", label: "Travel & Hospitality", icon: "✈️" },
    { id: "gaming", label: "Gaming & Entertainment", icon: "🎮" }
];

const GrowthIndicator = ({ level }) => {
    const config = {
        strong: { icon: TrendingUp, color: "text-green-400", bg: "bg-green-600/20", label: "Strong Growth" },
        moderate: { icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-600/20", label: "Moderate Growth" },
        weak: { icon: TrendingDown, color: "text-amber-400", bg: "bg-amber-600/20", label: "Slow Growth" },
        declining: { icon: TrendingDown, color: "text-red-400", bg: "bg-red-600/20", label: "Declining" }
    };
    const { icon: Icon, color, bg, label } = config[level] || config.moderate;
    
    return (
        <Badge className={`${bg} ${color} border-0`}>
            <Icon className="w-3 h-3 mr-1" />
            {label}
        </Badge>
    );
};

const SaturationIndicator = ({ level }) => {
    const config = {
        low: { color: "bg-green-500", label: "Low Competition", textColor: "text-green-300" },
        medium: { color: "bg-amber-500", label: "Medium Competition", textColor: "text-amber-300" },
        high: { color: "bg-red-500", label: "High Competition", textColor: "text-red-300" }
    };
    const { color, label, textColor } = config[level] || config.medium;
    
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                <div className={`w-2 h-8 rounded ${level === 'low' || level === 'medium' || level === 'high' ? color : 'bg-slate-700'}`}></div>
                <div className={`w-2 h-8 rounded ${level === 'medium' || level === 'high' ? color : 'bg-slate-700'}`}></div>
                <div className={`w-2 h-8 rounded ${level === 'high' ? color : 'bg-slate-700'}`}></div>
            </div>
            <span className={`text-sm font-medium ${textColor}`}>{label}</span>
        </div>
    );
};

export default function MarketTrends() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [isResearching, setIsResearching] = useState(false);
    const [marketData, setMarketData] = useState(null);
    const [savedIndustries, setSavedIndustries] = useState(() => {
        try {
            const saved = localStorage.getItem('saved_industries');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const researchMarket = async (industryQuery) => {
        setIsResearching(true);
        setMarketData(null);

        try {
            const prompt = `Research the current state of the "${industryQuery}" market/industry. Provide comprehensive market intelligence covering:

1. Market Size & Growth: Current market size, projected size (with year), CAGR percentage, regional leaders, fastest growth region, confidence level (high/medium/low), growth_level (strong/moderate/weak/declining)
2. Consumer Behavior: Top 5-7 priorities (as strings), spending trends, demographic shifts
3. Technology Trends: 5-7 emerging technologies, required features, adoption insights
4. Competitive Landscape: saturation_level (low/medium/high), top 5 players (name + description), average pricing, 3-5 feature gaps
5. Neurodivergent Accessibility: current_state (poor/fair/good/excellent), barriers, existing solutions, accessibility gaps (each with gap, impact as critical/high/medium, and opportunity)
6. Industry Improvements: missing features (each with feature, rationale, user_impact), user complaints, transformation opportunities (each with innovation and why_transformative)
7. Opportunities: 3-5 high priority (title+description) and 2-3 moderate priority (title+description)
8. Risks: 2-3 critical and 2-3 moderate (each with risk and mitigation)
9. Strategic Recommendations: target market, 3-5 core differentiators, monetization model, tech stack suggestions, go-to-market strategy

Be specific and data-driven with real numbers where possible.`;

            const schema = {
                type: "object",
                properties: {
                    industry_name: { type: "string" },
                    market_size: {
                        type: "object",
                        properties: {
                            current_size: { type: "string" },
                            projected_size: { type: "string" },
                            projection_year: { type: "string" },
                            cagr: { type: "string" },
                            growth_level: { type: "string" },
                            regional_leaders: { type: "array", items: { type: "string" } },
                            fastest_growth_region: { type: "string" },
                            confidence: { type: "string" }
                        }
                    },
                    consumer_behavior: {
                        type: "object",
                        properties: {
                            top_priorities: { type: "array", items: { type: "string" } },
                            spending_trends: { type: "string" },
                            demographic_shifts: { type: "array", items: { type: "string" } }
                        }
                    },
                    technology_trends: {
                        type: "object",
                        properties: {
                            emerging_tech: { type: "array", items: { type: "string" } },
                            required_features: { type: "array", items: { type: "string" } },
                            adoption_insights: { type: "string" }
                        }
                    },
                    competitive_landscape: {
                        type: "object",
                        properties: {
                            saturation_level: { type: "string" },
                            top_players: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" } } } },
                            average_pricing: { type: "string" },
                            feature_gaps: { type: "array", items: { type: "string" } }
                        }
                    },
                    neurodivergent_accessibility: {
                        type: "object",
                        properties: {
                            current_state: { type: "string" },
                            barriers: { type: "array", items: { type: "string" } },
                            existing_solutions: { type: "array", items: { type: "string" } },
                            accessibility_gaps: { type: "array", items: { type: "object", properties: { gap: { type: "string" }, impact: { type: "string" }, opportunity: { type: "string" } } } }
                        }
                    },
                    industry_improvements: {
                        type: "object",
                        properties: {
                            missing_features: { type: "array", items: { type: "object", properties: { feature: { type: "string" }, rationale: { type: "string" }, user_impact: { type: "string" } } } },
                            user_complaints: { type: "array", items: { type: "string" } },
                            transformation_opportunities: { type: "array", items: { type: "object", properties: { innovation: { type: "string" }, why_transformative: { type: "string" } } } }
                        }
                    },
                    opportunities: {
                        type: "object",
                        properties: {
                            high_priority: { type: "array", items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" } } } },
                            moderate_priority: { type: "array", items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" } } } }
                        }
                    },
                    risks: {
                        type: "object",
                        properties: {
                            critical: { type: "array", items: { type: "object", properties: { risk: { type: "string" }, mitigation: { type: "string" } } } },
                            moderate: { type: "array", items: { type: "object", properties: { risk: { type: "string" }, mitigation: { type: "string" } } } }
                        }
                    },
                    strategic_recommendations: {
                        type: "object",
                        properties: {
                            target_market: { type: "string" },
                            core_differentiators: { type: "array", items: { type: "string" } },
                            monetization_model: { type: "string" },
                            tech_stack_suggestions: { type: "array", items: { type: "string" } },
                            go_to_market: { type: "string" }
                        }
                    }
                }
            };

            const result = await base44.integrations.Core.InvokeLLM({
                prompt,
                model: "gemini_3_flash",
                add_context_from_internet: true,
                response_json_schema: schema
            });

            setMarketData(result);
            toast.success(`Market intelligence loaded for ${result.industry_name}`);

        } catch (error) {
            console.error('Market research failed:', error);
            toast.error('Failed to research market. Please try again.');
        } finally {
            setIsResearching(false);
        }
    };

    const handleIndustryClick = (industry) => {
        setSearchQuery(industry.label);
        researchMarket(industry.label);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            researchMarket(searchQuery.trim());
        }
    };

    const handleResearchThisMarket = () => {
        if (!marketData) return;

        const marketResearchData = {
            title: marketData.industry_name,
            industry: searchQuery.toLowerCase().replace(/\s+/g, '_'),
            description: `${marketData.market_size?.current_size || 'N/A'} market growing at ${marketData.market_size?.cagr || 'N/A'} CAGR. Key opportunities: ${marketData.opportunities?.high_priority?.slice(0, 2).map(o => o.title).join(', ') || 'N/A'}`,
            keywords: [
                ...(marketData.consumer_behavior?.top_priorities || []).slice(0, 3),
                ...(marketData.technology_trends?.emerging_tech || []).slice(0, 2)
            ].map(k => k.toLowerCase()),
            competitor_apps: (marketData.competitive_landscape?.top_players || []).slice(0, 3).map(p => p.name),
            target_demographics: marketData.strategic_recommendations?.target_market || 'N/A',
            geographic_focus: marketData.market_size?.fastest_growth_region || "global"
        };

        localStorage.setItem('market_research_data', JSON.stringify(marketResearchData));
        
        navigate(createPageUrl("NewResearch"));
        toast.success('Market intelligence loaded into research form!');
    };

    const toggleSaveIndustry = () => {
        if (!marketData) return;

        const industryData = {
            name: marketData.industry_name,
            query: searchQuery,
            savedAt: new Date().toISOString()
        };

        const isSaved = savedIndustries.some(i => i.query === searchQuery);
        
        let updated;
        if (isSaved) {
            updated = savedIndustries.filter(i => i.query !== searchQuery);
            toast.success('Removed from saved industries');
        } else {
            updated = [...savedIndustries, industryData];
            toast.success('Saved to your industries');
        }

        setSavedIndustries(updated);
        localStorage.setItem('saved_industries', JSON.stringify(updated));
    };

    const isSaved = marketData && savedIndustries.some(i => i.query === searchQuery);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-6">
            <div className="max-w-7xl mx-auto overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate(createPageUrl("Dashboard"))}
                            className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
                                Market Trends & Industry Intelligence
                            </h1>
                            <p className="text-slate-400 mt-1">
                                Research any industry before you start building
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:relative">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search any industry..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 sm:pr-32 py-6 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 text-base sm:text-lg"
                            />
                        </div>
                        <Button 
                            type="submit"
                            disabled={!searchQuery.trim() || isResearching}
                            className="w-full sm:w-auto sm:absolute sm:right-2 sm:top-1/2 sm:transform sm:-translate-y-1/2 gradient-button"
                        >
                            {isResearching ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Researching...
                                </>
                            ) : (
                                <>
                                    <Brain className="w-4 h-4 mr-2" />
                                    Research
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                <div className="max-w-6xl mx-auto mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        Popular Industries
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {POPULAR_INDUSTRIES.map((industry) => (
                            <Button
                                key={industry.id}
                                variant="outline"
                                onClick={() => handleIndustryClick(industry)}
                                disabled={isResearching}
                                className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-white justify-start"
                            >
                                <span className="mr-2 text-xl">{industry.icon}</span>
                                <span className="text-sm">{industry.label}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                {savedIndustries.length > 0 && !isResearching && !marketData && (
                    <div className="max-w-6xl mx-auto mb-8">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Bookmark className="w-5 h-5 text-amber-400" />
                            Your Saved Industries
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {savedIndustries.map((industry, idx) => (
                                <Button
                                    key={idx}
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery(industry.query);
                                        researchMarket(industry.query);
                                    }}
                                    className="border-amber-600/30 bg-amber-900/20 hover:bg-amber-900/30 text-white justify-start"
                                >
                                    <Bookmark className="w-4 h-4 mr-2 text-amber-400" />
                                    <div className="text-left flex-1 min-w-0">
                                        <div className="font-medium truncate">{industry.name}</div>
                                        <div className="text-xs text-slate-400">
                                            Saved {new Date(industry.savedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {isResearching && (
                    <div className="max-w-4xl mx-auto">
                        <Card className="bg-slate-800 border-slate-700">
                            <CardContent className="p-12">
                                <div className="flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                                        <Brain className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            Analyzing {searchQuery}...
                                        </h3>
                                        <p className="text-slate-400">
                                            Our AI is gathering market intelligence, consumer insights, and competitive data
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {marketData && !isResearching && (
                    <div className="max-w-7xl mx-auto space-y-6">
                        <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div>
                                        <CardTitle className="text-xl sm:text-3xl text-white mb-2 break-words">
                                            {marketData.industry_name}
                                        </CardTitle>
                                        <p className="text-slate-300 text-sm sm:text-base">
                                            Market Intelligence Report
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                            variant="outline"
                                            onClick={toggleSaveIndustry}
                                            className="border-amber-600/30 bg-amber-900/20 hover:bg-amber-900/30"
                                        >
                                            {isSaved ? (
                                                <>
                                                    <Bookmark className="w-4 h-4 mr-2 text-amber-400 fill-current" />
                                                    Saved
                                                </>
                                            ) : (
                                                <>
                                                    <BookmarkPlus className="w-4 h-4 mr-2 text-amber-400" />
                                                    Save
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={handleResearchThisMarket}
                                            className="gradient-button"
                                        >
                                            <Target className="w-4 h-4 mr-2" />
                                            Research This Market
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="flex w-full overflow-x-auto bg-slate-800 border-slate-700">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="consumers">Consumers</TabsTrigger>
                                <TabsTrigger value="competition">Competition</TabsTrigger>
                                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                                <TabsTrigger value="strategy">Strategy</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card className="bg-slate-800 border-slate-700">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-white">
                                                <DollarSign className="w-5 h-5 text-green-400" />
                                                Market Size & Growth
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <div className="text-sm text-slate-400 mb-1">Current Market Size</div>
                                                <div className="text-2xl font-bold text-white">{marketData.market_size?.current_size || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-400 mb-1">Projected Size ({marketData.market_size?.projection_year || 'N/A'})</div>
                                                <div className="text-2xl font-bold text-white">{marketData.market_size?.projected_size || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-slate-400 mb-1">CAGR</div>
                                                <div className="text-xl font-bold text-green-400">{marketData.market_size?.cagr || 'N/A'}</div>
                                            </div>
                                            <div className="flex items-center gap-2 pt-2">
                                                <GrowthIndicator level={marketData.market_size?.growth_level || 'moderate'} />
                                                <Badge variant="outline" className="text-slate-300 border-slate-600">
                                                    {marketData.market_size?.confidence || 'N/A'} confidence
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-slate-800 border-slate-700">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-white">
                                                <Globe className="w-5 h-5 text-blue-400" />
                                                Regional Insights
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <div className="text-sm text-slate-400 mb-2">Market Leaders</div>
                                                <div className="space-y-2">
                                                    {(marketData.market_size?.regional_leaders || []).map((region, idx) => (
                                                        <Badge key={idx} variant="outline" className="mr-2 text-slate-300 border-slate-600">
                                                            {region}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="pt-4">
                                                <div className="text-sm text-slate-400 mb-2">Fastest Growing Region</div>
                                                <Badge className="bg-green-600/20 text-green-300 border-0">
                                                    <TrendingUp className="w-3 h-3 mr-1" />
                                                    {marketData.market_size?.fastest_growth_region || 'N/A'}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="bg-slate-800 border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-white">
                                            <Cpu className="w-5 h-5 text-purple-400" />
                                            Technology Trends
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-300 mb-3">Emerging Technologies</div>
                                            <div className="flex flex-wrap gap-2">
                                                {(marketData.technology_trends?.emerging_tech || []).map((tech, idx) => (
                                                    <Badge key={idx} className="bg-purple-600/20 text-purple-300 border-0">
                                                        <Zap className="w-3 h-3 mr-1" />
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-slate-300 mb-3">Required Features</div>
                                            <ul className="space-y-2">
                                                {(marketData.technology_trends?.required_features || []).map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                                                        <ArrowRight className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="pt-4 border-t border-slate-700">
                                            <div className="text-sm text-slate-400 mb-2">Adoption Insights</div>
                                            <p className="text-slate-300">{marketData.technology_trends?.adoption_insights || 'N/A'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {marketData.neurodivergent_accessibility && (
                                    <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-white">
                                                <Brain className="w-5 h-5 text-blue-400" />
                                                Neurodivergent Accessibility Analysis
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <div className="text-sm text-slate-400 mb-2">Current State</div>
                                                <Badge className={`
                                                    ${marketData.neurodivergent_accessibility.current_state === 'excellent' ? 'bg-green-600/20 text-green-300' : ''}
                                                    ${marketData.neurodivergent_accessibility.current_state === 'good' ? 'bg-blue-600/20 text-blue-300' : ''}
                                                    ${marketData.neurodivergent_accessibility.current_state === 'fair' ? 'bg-amber-600/20 text-amber-300' : ''}
                                                    ${marketData.neurodivergent_accessibility.current_state === 'poor' ? 'bg-red-600/20 text-red-300' : ''}
                                                    border-0 capitalize
                                                `}>
                                                    {marketData.neurodivergent_accessibility.current_state}
                                                </Badge>
                                            </div>

                                            <div>
                                                <div className="text-sm font-semibold text-slate-300 mb-2">Barriers</div>
                                                <ul className="space-y-2">
                                                    {(marketData.neurodivergent_accessibility.barriers || []).map((barrier, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                                                            <AlertTriangle className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                                                            {barrier}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {marketData.neurodivergent_accessibility.existing_solutions && marketData.neurodivergent_accessibility.existing_solutions.length > 0 && (
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-300 mb-2">Existing Solutions</div>
                                                    <ul className="space-y-2">
                                                        {marketData.neurodivergent_accessibility.existing_solutions.map((solution, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-slate-300">
                                                                <Shield className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                                                {solution}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {marketData.neurodivergent_accessibility.accessibility_gaps && marketData.neurodivergent_accessibility.accessibility_gaps.length > 0 && (
                                                <div className="pt-4 border-t border-slate-700/50">
                                                    <div className="text-sm font-semibold text-slate-300 mb-3">Major Accessibility Gaps (Opportunities)</div>
                                                    <div className="space-y-4">
                                                        {marketData.neurodivergent_accessibility.accessibility_gaps.map((gap, idx) => (
                                                            <div key={idx} className="bg-slate-900/50 p-4 rounded-lg">
                                                                <div className="flex items-start gap-2 mb-2">
                                                                    <Badge className={`
                                                                        ${gap.impact === 'critical' ? 'bg-red-600/20 text-red-300' : ''}
                                                                        ${gap.impact === 'high' ? 'bg-amber-600/20 text-amber-300' : ''}
                                                                        ${gap.impact === 'medium' ? 'bg-blue-600/20 text-blue-300' : ''}
                                                                        border-0
                                                                    `}>
                                                                        {gap.impact} impact
                                                                    </Badge>
                                                                </div>
                                                                <div className="text-white font-medium mb-2">{gap.gap}</div>
                                                                <div className="text-slate-300 text-sm">{gap.opportunity}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {marketData.industry_improvements && (
                                    <Card className="bg-slate-800 border-slate-700">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-white">
                                                <Sparkles className="w-5 h-5 text-amber-400" />
                                                Industry Improvement Opportunities
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {marketData.industry_improvements.missing_features && marketData.industry_improvements.missing_features.length > 0 && (
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-300 mb-3">Missing Features</div>
                                                    <div className="space-y-3">
                                                        {marketData.industry_improvements.missing_features.map((item, idx) => (
                                                            <div key={idx} className="bg-slate-900/50 p-4 rounded-lg">
                                                                <div className="text-white font-medium mb-1">{item.feature}</div>
                                                                <div className="text-slate-300 text-sm mb-2">{item.rationale}</div>
                                                                <div className="text-blue-300 text-sm">
                                                                    <strong>User Impact:</strong> {item.user_impact}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {marketData.industry_improvements.user_complaints && marketData.industry_improvements.user_complaints.length > 0 && (
                                                <div className="pt-4 border-t border-slate-700">
                                                    <div className="text-sm font-semibold text-slate-300 mb-3">Common User Complaints</div>
                                                    <ul className="space-y-2">
                                                        {marketData.industry_improvements.user_complaints.map((complaint, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-slate-300">
                                                                <AlertTriangle className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                                                                {complaint}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {marketData.industry_improvements.transformation_opportunities && marketData.industry_improvements.transformation_opportunities.length > 0 && (
                                                <div className="pt-4 border-t border-slate-700">
                                                    <div className="text-sm font-semibold text-slate-300 mb-3">Transformative Innovations</div>
                                                    <div className="space-y-3">
                                                        {marketData.industry_improvements.transformation_opportunities.map((item, idx) => (
                                                            <div key={idx} className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-lg border border-purple-700/30">
                                                                <div className="text-white font-medium mb-2 flex items-center gap-2">
                                                                    <Zap className="w-4 h-4 text-amber-400" />
                                                                    {item.innovation}
                                                                </div>
                                                                <div className="text-slate-300 text-sm">{item.why_transformative}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="consumers" className="space-y-6">
                                <Card className="bg-slate-800 border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-white">
                                            <Users className="w-5 h-5 text-blue-400" />
                                            Consumer Behavior & Priorities
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-300 mb-3">Top Priorities</div>
                                            <div className="grid gap-3">
                                                {(marketData.consumer_behavior?.top_priorities || []).map((priority, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 bg-slate-900/50 p-4 rounded-lg">
                                                        <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-300 font-bold text-sm flex-shrink-0">
                                                            {idx + 1}
                                                        </div>
                                                        <div className="text-slate-300">{priority}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-700">
                                            <div className="text-sm font-semibold text-slate-300 mb-2">Spending Trends</div>
                                            <p className="text-slate-300">{marketData.consumer_behavior?.spending_trends || 'N/A'}</p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-700">
                                            <div className="text-sm font-semibold text-slate-300 mb-3">Demographic Shifts</div>
                                            <ul className="space-y-2">
                                                {(marketData.consumer_behavior?.demographic_shifts || []).map((shift, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                                                        <TrendingUp className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                                        {shift}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="competition" className="space-y-6">
                                <Card className="bg-slate-800 border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-white">
                                            <Target className="w-5 h-5 text-red-400" />
                                            Competitive Landscape
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-300 mb-3">Market Saturation</div>
                                            <SaturationIndicator level={marketData.competitive_landscape?.saturation_level || 'medium'} />
                                        </div>

                                        <div className="pt-4 border-t border-slate-700">
                                            <div className="text-sm font-semibold text-slate-300 mb-2">Average Pricing</div>
                                            <div className="text-2xl font-bold text-white">{marketData.competitive_landscape?.average_pricing || 'N/A'}</div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-700">
                                            <div className="text-sm font-semibold text-slate-300 mb-3">Top Players</div>
                                            <div className="space-y-3">
                                                {(marketData.competitive_landscape?.top_players || []).map((player, idx) => (
                                                    <div key={idx} className="bg-slate-900/50 p-4 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-300 font-bold text-xs">
                                                                {idx + 1}
                                                            </div>
                                                            <div className="text-white font-medium">{player.name}</div>
                                                        </div>
                                                        <div className="text-slate-300 text-sm">{player.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-700">
                                            <div className="text-sm font-semibold text-slate-300 mb-3">Feature Gaps (Your Opportunities)</div>
                                            <ul className="space-y-2">
                                                {(marketData.competitive_landscape?.feature_gaps || []).map((gap, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                                                        <Sparkles className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                                                        {gap}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="opportunities" className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-700/50">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-white">
                                                <Target className="w-5 h-5 text-green-400" />
                                                High Priority Opportunities
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {(marketData.opportunities?.high_priority || []).map((opp, idx) => (
                                                <div key={idx} className="bg-slate-900/50 p-4 rounded-lg">
                                                    <div className="text-white font-medium mb-2">{opp.title}</div>
                                                    <div className="text-slate-300 text-sm">{opp.description}</div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-700/50">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-white">
                                                <Target className="w-5 h-5 text-blue-400" />
                                                Moderate Priority Opportunities
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {(marketData.opportunities?.moderate_priority || []).map((opp, idx) => (
                                                <div key={idx} className="bg-slate-900/50 p-4 rounded-lg">
                                                    <div className="text-white font-medium mb-2">{opp.title}</div>
                                                    <div className="text-slate-300 text-sm">{opp.description}</div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card className="bg-slate-800 border-red-700/50">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-white">
                                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                                Critical Risks
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {(marketData.risks?.critical || []).map((risk, idx) => (
                                                <div key={idx} className="bg-red-900/20 p-4 rounded-lg border border-red-700/30">
                                                    <div className="text-red-300 font-medium mb-2">{risk.risk}</div>
                                                    <div className="text-slate-300 text-sm">
                                                        <strong className="text-green-300">Mitigation:</strong> {risk.mitigation}
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-slate-800 border-amber-700/50">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-white">
                                                <AlertTriangle className="w-5 h-5 text-amber-400" />
                                                Moderate Risks
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {(marketData.risks?.moderate || []).map((risk, idx) => (
                                                <div key={idx} className="bg-amber-900/20 p-4 rounded-lg border border-amber-700/30">
                                                    <div className="text-amber-300 font-medium mb-2">{risk.risk}</div>
                                                    <div className="text-slate-300 text-sm">
                                                        <strong className="text-green-300">Mitigation:</strong> {risk.mitigation}
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="strategy" className="space-y-6">
                                <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-white">
                                            <Zap className="w-5 h-5 text-purple-400" />
                                            Strategic Recommendations
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-300 mb-2">Target Market Segment</div>
                                            <p className="text-white text-lg">{marketData.strategic_recommendations?.target_market || 'N/A'}</p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-700/50">
                                            <div className="text-sm font-semibold text-slate-300 mb-3">Core Differentiators</div>
                                            <ul className="space-y-2">
                                                {(marketData.strategic_recommendations?.core_differentiators || []).map((diff, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                                                        <Sparkles className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                                                        {diff}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="pt-4 border-t border-slate-700/50">
                                            <div className="text-sm font-semibold text-slate-300 mb-2">Monetization Model</div>
                                            <p className="text-slate-300">{marketData.strategic_recommendations?.monetization_model || 'N/A'}</p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-700/50">
                                            <div className="text-sm font-semibold text-slate-300 mb-3">Technology Stack Suggestions</div>
                                            <div className="flex flex-wrap gap-2">
                                                {(marketData.strategic_recommendations?.tech_stack_suggestions || []).map((tech, idx) => (
                                                    <Badge key={idx} className="bg-blue-600/20 text-blue-300 border-0">
                                                        <Cpu className="w-3 h-3 mr-1" />
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-700/50">
                                            <div className="text-sm font-semibold text-slate-300 mb-2">Go-to-Market Strategy</div>
                                            <p className="text-slate-300">{marketData.strategic_recommendations?.go_to_market || 'N/A'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-slate-800 border-slate-700">
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-white font-semibold mb-1">Ready to Start Research?</h3>
                                                <p className="text-slate-400 text-sm">
                                                    Use this intelligence to create detailed market research
                                                </p>
                                            </div>
                                            <Button
                                                onClick={handleResearchThisMarket}
                                                className="gradient-button"
                                            >
                                                <Target className="w-4 h-4 mr-2" />
                                                Research This Market
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </div>
        </div>
    );
}