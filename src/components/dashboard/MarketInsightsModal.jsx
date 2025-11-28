
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
    TrendingUp,
    Sparkles,
    Target,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Lightbulb,
    DollarSign,
    Users,
    Zap,
    CheckCircle2,
    TrendingDown,
    ChevronDown,
    ChevronRight,
    ExternalLink
} from "lucide-react";

export default function MarketInsightsModal({ open, onClose, insights, projects }) {
    const navigate = useNavigate();
    const [expandedSections, setExpandedSections] = useState({});
    
    if (!insights) return null;

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Calculate detailed opportunity metrics
    const getOpportunityDetails = (industry) => {
        const industryProjects = projects.filter(p => p.industry === industry);
        
        // Get all concepts for this industry with project info
        const allConcepts = industryProjects.reduce((acc, p) => {
            if (p.generated_concepts) {
                return [...acc, ...p.generated_concepts.map((c, idx) => ({
                    ...c, 
                    projectTitle: p.title,
                    projectId: p.id,
                    conceptIndex: idx
                }))];
            }
            return acc;
        }, []);

        // Categorize by market potential
        const largePotential = allConcepts.filter(c => c.market_potential === 'large');
        const moderatePotential = allConcepts.filter(c => c.market_potential === 'moderate');
        const nichePotential = allConcepts.filter(c => c.market_potential === 'niche');

        // Categorize by complexity
        const lowComplexity = allConcepts.filter(c => c.development_complexity === 'low');
        const mediumComplexity = allConcepts.filter(c => c.development_complexity === 'medium');
        const highComplexity = allConcepts.filter(c => c.development_complexity === 'high');

        // Get unique pain points
        const allPainPoints = allConcepts.reduce((acc, c) => {
            if (c.target_pain_points) {
                return [...acc, ...c.target_pain_points];
            }
            return acc;
        }, []);
        const uniquePainPoints = [...new Set(allPainPoints)];

        // Calculate average features per concept
        const totalFeatures = allConcepts.reduce((sum, c) => sum + (c.key_features?.length || 0), 0);
        const avgFeatures = allConcepts.length > 0 ? (totalFeatures / allConcepts.length).toFixed(1) : 0;

        // Find best concepts (large potential + low/medium complexity)
        const quickWins = allConcepts.filter(c => 
            c.market_potential === 'large' && 
            (c.development_complexity === 'low' || c.development_complexity === 'medium')
        );

        return {
            projectCount: industryProjects.length,
            totalConcepts: allConcepts.length,
            largePotentialConcepts: largePotential,
            moderatePotentialConcepts: moderatePotential,
            nichePotentialConcepts: nichePotential,
            largePotential: largePotential.length,
            moderatePotential: moderatePotential.length,
            nichePotential: nichePotential.length,
            lowComplexityConcepts: lowComplexity,
            mediumComplexityConcepts: mediumComplexity,
            highComplexityConcepts: highComplexity,
            lowComplexity: lowComplexity.length,
            mediumComplexity: mediumComplexity.length,
            highComplexity: highComplexity.length,
            uniquePainPoints: uniquePainPoints.length,
            avgFeatures: avgFeatures,
            quickWins: quickWins,
            topConcepts: largePotential.slice(0, 3),
            industryProjects: industryProjects
        };
    };

    const opportunityDetails = insights.opportunityIndustry ? getOpportunityDetails(insights.opportunityIndustry) : null;
    const trendingDetails = insights.trendingIndustry ? getOpportunityDetails(insights.trendingIndustry) : null;

    // Calculate opportunity score explanation
    const getOpportunityExplanation = (details) => {
        if (!details) return null;

        const score = parseFloat(insights.opportunityScore);
        const factors = [];

        if (details.largePotential >= 3) {
            factors.push(`${details.largePotential} concepts with LARGE market potential identified`);
        }
        if (details.quickWins.length > 0) {
            factors.push(`${details.quickWins.length} "Quick Win" opportunities (large potential + manageable complexity)`);
        }
        if (details.uniquePainPoints >= 5) {
            factors.push(`${details.uniquePainPoints} distinct user pain points discovered`);
        }
        if (details.lowComplexity + details.mediumComplexity > details.highComplexity) {
            factors.push(`Majority of concepts have low-to-medium development complexity`);
        }

        let recommendation = '';
        if (score >= 7) {
            recommendation = '🚀 STRONG OPPORTUNITY - Multiple validated concepts with high market demand. Recommend immediate action.';
        } else if (score >= 5) {
            recommendation = '✅ GOOD OPPORTUNITY - Solid potential with several viable concepts. Worth pursuing with proper validation.';
        } else if (score >= 3) {
            recommendation = '⚠️ MODERATE OPPORTUNITY - Some potential exists but may require more research or niche positioning.';
        } else {
            recommendation = '❌ LIMITED OPPORTUNITY - Consider exploring other industries or conducting deeper market research.';
        }

        return { factors, recommendation, score };
    };

    const opportunityAnalysis = opportunityDetails ? getOpportunityExplanation(opportunityDetails) : null;

    // Component to render expandable concept list - NOW WITH NAVIGATION
    const ConceptList = ({ concepts, type, color }) => {
        const isExpanded = expandedSections[type];
        const hasContent = concepts && concepts.length > 0;
        
        if (!hasContent) return null;

        const handleConceptClick = (concept) => {
            navigate(`/ConceptDetails?project=${concept.projectId}&concept=${concept.conceptIndex}`);
            onClose(); // Close the modal after navigation
        };

        return (
            <div className="space-y-2">
                <button
                    onClick={() => toggleSection(type)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border ${color.border} ${color.bg} hover:opacity-80 transition-all`}
                >
                    <span className={`${color.text} text-xs font-medium`}>
                        {isExpanded ? 'Hide' : 'Show'} {concepts.length} {type} concept{concepts.length !== 1 ? 's' : ''}
                    </span>
                    {isExpanded ? (
                        <ChevronDown className={`w-4 h-4 ${color.text}`} />
                    ) : (
                        <ChevronRight className={`w-4 h-4 ${color.text}`} />
                    )}
                </button>
                
                {isExpanded && (
                    <div className="space-y-2 pl-2">
                        {concepts.map((concept, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleConceptClick(concept)}
                                className="w-full bg-slate-900/50 rounded-lg p-3 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-900/70 transition-all group text-left"
                            >
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h5 className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors">{concept.concept_name}</h5>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${color.badge} text-xs flex-shrink-0`}>
                                            {concept.development_complexity || 'N/A'}
                                        </Badge>
                                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                </div>
                                <p className="text-slate-400 text-xs line-clamp-2 mb-2">{concept.core_solution}</p>
                                <p className="text-slate-500 text-xs">From: {concept.projectTitle}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:max-w-2xl bg-slate-900 border-slate-700 overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-white text-2xl flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                        Market Intelligence Report
                    </SheetTitle>
                    <SheetDescription className="text-slate-400">
                        Data-driven insights from {projects.length} research project{projects.length !== 1 ? 's' : ''}. Click on any concept to view its full blueprint.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Highest Opportunity - ENHANCED */}
                    {insights.opportunityIndustry && opportunityDetails && opportunityAnalysis && (
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2 text-lg">
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                    Highest Market Opportunity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Industry Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white capitalize mb-1">
                                            {insights.opportunityIndustry.replace('_', ' ')}
                                        </h3>
                                        <p className="text-slate-400 text-sm">
                                            Based on {opportunityDetails.projectCount} research project{opportunityDetails.projectCount !== 1 ? 's' : ''} 
                                            • {opportunityDetails.totalConcepts} concepts analyzed
                                        </p>
                                    </div>
                                    <Badge className="bg-amber-600/20 text-amber-300 text-xl px-4 py-2">
                                        {opportunityAnalysis.score}/10
                                    </Badge>
                                </div>

                                {/* Opportunity Score Explanation */}
                                <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
                                    <p className="text-amber-300 font-semibold text-sm mb-3">📊 What This Score Means:</p>
                                    <p className="text-amber-100 text-sm mb-3">
                                        {opportunityAnalysis.recommendation}
                                    </p>
                                    <div className="space-y-2">
                                        <p className="text-amber-200 text-xs font-semibold">Score Based On:</p>
                                        <ul className="space-y-1 text-amber-200 text-xs">
                                            {opportunityAnalysis.factors.map((factor, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                                                    <span>{factor}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Market Potential Breakdown - NOW EXPANDABLE */}
                                <div>
                                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-400" />
                                        Market Potential Distribution
                                    </h4>
                                    <p className="text-slate-400 text-xs mb-3">Click to see which apps fall into each category</p>
                                    
                                    <div className="space-y-3">
                                        {/* Large Market */}
                                        <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <div className="text-2xl font-bold text-pink-300">{opportunityDetails.largePotential}</div>
                                                    <div className="text-xs text-pink-200 mt-1">Large Market Concepts</div>
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {opportunityDetails.totalConcepts > 0 
                                                        ? ((opportunityDetails.largePotential / opportunityDetails.totalConcepts) * 100).toFixed(0) 
                                                        : 0}% of total
                                                </div>
                                            </div>
                                            <ConceptList 
                                                concepts={opportunityDetails.largePotentialConcepts}
                                                type="large-market"
                                                color={{
                                                    bg: 'bg-pink-900/10',
                                                    border: 'border-pink-500/30',
                                                    text: 'text-pink-300',
                                                    badge: 'bg-pink-600/20 text-pink-300'
                                                }}
                                            />
                                        </div>

                                        {/* Moderate Market */}
                                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <div className="text-2xl font-bold text-purple-300">{opportunityDetails.moderatePotential}</div>
                                                    <div className="text-xs text-purple-200 mt-1">Moderate Market Concepts</div>
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {opportunityDetails.totalConcepts > 0 
                                                        ? ((opportunityDetails.moderatePotential / opportunityDetails.totalConcepts) * 100).toFixed(0) 
                                                        : 0}% of total
                                                </div>
                                            </div>
                                            <ConceptList 
                                                concepts={opportunityDetails.moderatePotentialConcepts}
                                                type="moderate-market"
                                                color={{
                                                    bg: 'bg-purple-900/10',
                                                    border: 'border-purple-500/30',
                                                    text: 'text-purple-300',
                                                    badge: 'bg-purple-600/20 text-purple-300'
                                                }}
                                            />
                                        </div>

                                        {/* Niche Market */}
                                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <div className="text-2xl font-bold text-blue-300">{opportunityDetails.nichePotential}</div>
                                                    <div className="text-xs text-blue-200 mt-1">Niche Market Concepts</div>
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {opportunityDetails.totalConcepts > 0 
                                                        ? ((opportunityDetails.nichePotential / opportunityDetails.totalConcepts) * 100).toFixed(0) 
                                                        : 0}% of total
                                                </div>
                                            </div>
                                            <ConceptList 
                                                concepts={opportunityDetails.nichePotentialConcepts}
                                                type="niche-market"
                                                color={{
                                                    bg: 'bg-blue-900/10',
                                                    border: 'border-blue-500/30',
                                                    text: 'text-blue-300',
                                                    badge: 'bg-blue-600/20 text-blue-300'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Development Complexity - NOW EXPANDABLE TOO */}
                                <div>
                                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                        Development Feasibility
                                    </h4>
                                    <p className="text-slate-400 text-xs mb-3">Click to see which apps require low/medium/high development effort</p>
                                    
                                    <div className="space-y-3">
                                        {/* Low Complexity */}
                                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <div className="text-2xl font-bold text-green-300">{opportunityDetails.lowComplexity}</div>
                                                    <div className="text-xs text-green-200 mt-1">Low Complexity</div>
                                                </div>
                                                <div className="text-xs text-slate-400">Quick to build</div>
                                            </div>
                                            <ConceptList 
                                                concepts={opportunityDetails.lowComplexityConcepts}
                                                type="low-complexity"
                                                color={{
                                                    bg: 'bg-green-900/10',
                                                    border: 'border-green-500/30',
                                                    text: 'text-green-300',
                                                    badge: 'bg-green-600/20 text-green-300'
                                                }}
                                            />
                                        </div>

                                        {/* Medium Complexity */}
                                        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <div className="text-2xl font-bold text-amber-300">{opportunityDetails.mediumComplexity}</div>
                                                    <div className="text-xs text-amber-200 mt-1">Medium Complexity</div>
                                                </div>
                                                <div className="text-xs text-slate-400">Manageable</div>
                                            </div>
                                            <ConceptList 
                                                concepts={opportunityDetails.mediumComplexityConcepts}
                                                type="medium-complexity"
                                                color={{
                                                    bg: 'bg-amber-900/10',
                                                    border: 'border-amber-500/30',
                                                    text: 'text-amber-300',
                                                    badge: 'bg-amber-600/20 text-amber-300'
                                                }}
                                            />
                                        </div>

                                        {/* High Complexity */}
                                        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <div className="text-2xl font-bold text-red-300">{opportunityDetails.highComplexity}</div>
                                                    <div className="text-xs text-red-200 mt-1">High Complexity</div>
                                                </div>
                                                <div className="text-xs text-slate-400">Resource intensive</div>
                                            </div>
                                            <ConceptList 
                                                concepts={opportunityDetails.highComplexityConcepts}
                                                type="high-complexity"
                                                color={{
                                                    bg: 'bg-red-900/10',
                                                    border: 'border-red-500/30',
                                                    text: 'text-red-300',
                                                    badge: 'bg-red-600/20 text-red-300'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Wins */}
                                {opportunityDetails.quickWins.length > 0 && (
                                    <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
                                        <h4 className="text-green-300 font-semibold mb-3 flex items-center gap-2">
                                            <Target className="w-4 h-4" />
                                            🎯 Quick Win Opportunities ({opportunityDetails.quickWins.length})
                                        </h4>
                                        <p className="text-green-200 text-sm mb-3">
                                            These concepts combine large market potential with manageable development complexity - ideal for rapid validation and launch.
                                        </p>
                                        <div className="space-y-2">
                                            {opportunityDetails.quickWins.slice(0, 3).map((concept, idx) => (
                                                <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-green-500/20">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="text-white font-semibold text-sm">{concept.concept_name}</p>
                                                            <p className="text-slate-400 text-xs mt-1">{concept.core_solution?.substring(0, 100)}...</p>
                                                        </div>
                                                        <Badge className="bg-green-600/20 text-green-300 text-xs flex-shrink-0">
                                                            {concept.development_complexity}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Market Insights */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                        <Users className="w-4 h-4 text-blue-400 mb-2" />
                                        <div className="text-2xl font-bold text-white">{opportunityDetails.uniquePainPoints}</div>
                                        <div className="text-xs text-slate-400 mt-1">Unique Pain Points</div>
                                        <div className="text-xs text-slate-500 mt-1">Market demand signals</div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                        <Lightbulb className="w-4 h-4 text-amber-400 mb-2" />
                                        <div className="text-2xl font-bold text-white">{opportunityDetails.avgFeatures}</div>
                                        <div className="text-xs text-slate-400 mt-1">Avg Features/Concept</div>
                                        <div className="text-xs text-slate-500 mt-1">Solution complexity</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2">
                                    <Link to={createPageUrl("AppConcepts")} className="w-full">
                                        <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Explore All {opportunityDetails.totalConcepts} Concepts
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                    <Link to={createPageUrl("MarketTrends")} className="w-full">
                                        <Button variant="outline" className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-600/10">
                                            <BarChart3 className="w-4 h-4 mr-2" />
                                            View Full Market Analysis
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Keep existing Trending Industry and Comparison sections */}
                    {insights.trendingIndustry && trendingDetails && (
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2 text-lg">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    Most Active Industry
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white capitalize">
                                            {insights.trendingIndustry.replace('_', ' ')}
                                        </h3>
                                        <p className="text-slate-400 text-sm">
                                            {trendingDetails.projectCount} active research project{trendingDetails.projectCount !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <Badge className="bg-green-600/20 text-green-300 text-lg px-3 py-1">
                                        #{1} Trending
                                    </Badge>
                                </div>

                                <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
                                    <p className="text-green-300 text-sm font-semibold mb-2">⚠️ Competition Alert:</p>
                                    <p className="text-green-200 text-sm">
                                        High research activity indicates growing market interest. While this validates demand, 
                                        it also means increased competition. {trendingDetails.quickWins.length > 0 
                                            ? `However, ${trendingDetails.quickWins.length} "Quick Win" opportunities identified.`
                                            : 'Focus on strong differentiation and unique value propositions.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                        <p className="text-slate-400 text-sm">Total Concepts</p>
                                        <p className="text-white text-2xl font-bold">{trendingDetails.totalConcepts}</p>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                        <p className="text-slate-400 text-sm">High Potential</p>
                                        <p className="text-white text-2xl font-bold">{trendingDetails.largePotential}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {insights.trendingIndustry && insights.opportunityIndustry && insights.trendingIndustry !== insights.opportunityIndustry && (
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2 text-lg">
                                    <Target className="w-5 h-5 text-purple-400" />
                                    Strategic Comparison
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                                    <p className="text-blue-300 text-sm font-semibold mb-2">💡 Investment Strategy:</p>
                                    <p className="text-blue-200 text-sm">
                                        <strong className="text-white">{insights.trendingIndustry.replace('_', ' ')}</strong> has {trendingDetails?.projectCount} projects (high activity), 
                                        while <strong className="text-white">{insights.opportunityIndustry.replace('_', ' ')}</strong> shows 
                                        a {insights.opportunityScore}/10 opportunity score. Consider focusing on less saturated markets 
                                        with strong potential for better ROI and competitive advantage.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
