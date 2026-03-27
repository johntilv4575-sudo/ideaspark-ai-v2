import React, { useState, useEffect } from "react"; // Added useEffect explicitly for clarity
import { ResearchProject } from "@/entities/ResearchProject";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    ArrowLeft
} from "lucide-react";
import toast from 'react-hot-toast'; // Added import for toast notifications

import ResearchForm from "../components/research/ResearchForm";
import AnalysisProgress from "../components/research/AnalysisProgress";

import { getLicense, canPerformAction, incrementUsage } from "@/components/utils/pricing";
import PricingDrawer from "../components/pricing/PricingDrawer";

const INDUSTRIES = [
    "fintech", "healthcare", "education", "ecommerce", "travel", "fitness",
    "food_delivery", "productivity", "entertainment", "social_media", 
    "real_estate", "automotive", "gaming", "fashion", "beauty", "other"
];

export default function NewResearch() {
    const navigate = useNavigate();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState('');
    const [currentProject, setCurrentProject] = useState(null);
    const [progressData, setProgressData] = useState({
        painPoints: null,
        competitors: null,
        concepts: null
    });
    const [formData, setFormData] = useState({
        title: "",
        industry: "",
        description: "",
        keywords: [],
        competitor_apps: [],
        target_demographics: "",
        geographic_focus: "global"
    });
    const [showPricingDrawer, setShowPricingDrawer] = useState(false);

    // NEW: Load market research data if available
    useEffect(() => {
        const savedMarketData = localStorage.getItem('market_research_data');
        if (savedMarketData) {
            try {
                const data = JSON.parse(savedMarketData);
                setFormData({
                    title: data.title || "",
                    industry: data.industry || "",
                    description: data.description || "",
                    keywords: data.keywords || [],
                    competitor_apps: data.competitor_apps || [],
                    target_demographics: data.target_demographics || "",
                    geographic_focus: data.geographic_focus || "global"
                });
                localStorage.removeItem('market_research_data'); // Clear after loading
                
                toast.success('Market intelligence loaded from Market Trends!', {
                    description: 'Review the pre-filled data and start your research.'
                });
            } catch (error) {
                console.error("Failed to load market data:", error);
            }
        }
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const startResearch = async () => {
        if (!formData.title || !formData.title.trim()) {
            alert("Please enter a business/service/app name to research");
            return;
        }

        const { allowed, reason } = canPerformAction('create_project');
        if (!allowed) {
            alert(reason);
            setShowPricingDrawer(true);
            return;
        }

        setIsAnalyzing(true);
        setProgressData({ painPoints: null, competitors: null, concepts: null });
        
        try {
            const project = await ResearchProject.create({
                title: formData.title,
                industry: formData.industry || 'general',
                description: formData.description,
                status: 'analyzing',
                research_parameters: {
                    keywords: formData.keywords,
                    competitor_apps: formData.competitor_apps,
                    target_demographics: formData.target_demographics,
                    geographic_focus: formData.geographic_focus
                }
            });
            
            setCurrentProject(project);
            incrementUsage('project');

            // Phase 1: Pain Point Analysis
            setAnalysisStep('Analyzing user pain points...');
            const industryContext = formData.industry && formData.industry !== 'general' ? formData.industry : '';
            const painPointPrompt = `You are researching the INDUSTRY and MARKET that "${formData.title}" operates in — NOT searching for reviews about "${formData.title}" itself.

Project Name: ${formData.title}
${industryContext ? `Industry: ${industryContext}` : ''}
${formData.description ? `Business Description: ${formData.description}` : ''}

IMPORTANT: Research the broader INDUSTRY and MARKET, not the specific business "${formData.title}". Find pain points that customers and users experience in this industry/market segment.

Research tasks:
- Find common frustrations and complaints users have in this industry/market space
- Search for Reddit posts, Twitter complaints, forum discussions about problems in this market
- Check app store reviews for competing products and services in this space
- Look for industry reports highlighting customer dissatisfaction trends
- Find YouTube comments and reviews about products/services in this market segment

${formData.keywords.length > 0 ? `Focus keywords: ${formData.keywords.join(', ')}` : ''}
${formData.competitor_apps.length > 0 ? `Key competitors to research: ${formData.competitor_apps.join(', ')}` : ''}
${formData.target_demographics ? `Target users: ${formData.target_demographics}` : ''}
Geographic focus: ${formData.geographic_focus}

Return the top 10 most frequently mentioned pain points in this INDUSTRY/MARKET, with real example quotes from users of competing products or services.`;

            const painPointsResult = await base44.integrations.Core.InvokeLLM({
                prompt: painPointPrompt,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        pain_points: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    issue: { type: "string" },
                                    frequency: { type: "number" },
                                    severity: { type: "string", enum: ["low", "medium", "high"] },
                                    source_examples: { 
                                        type: "array", 
                                        items: { type: "string" } 
                                    }
                                },
                                required: ["issue", "frequency", "severity", "source_examples"]
                            }
                        }
                    },
                    required: ["pain_points"]
                }
            });

            await ResearchProject.update(project.id, {
                pain_points: painPointsResult.pain_points
            });
            setProgressData(prev => ({ ...prev, painPoints: painPointsResult.pain_points }));

            // Phase 2: Competitor Analysis
            setAnalysisStep('Analyzing competitor successes...');
            const competitorPrompt = `Analyze the competitive landscape in the INDUSTRY/MARKET that "${formData.title}" operates in.

Project: ${formData.title}
${industryContext ? `Industry: ${industryContext}` : ''}
${formData.description ? `Business Description: ${formData.description}` : ''}

IMPORTANT: Research the top competitors and existing solutions in this market — NOT "${formData.title}" itself.

Search specifically for:
- Top apps, platforms, and services that compete in this market space
- What features users love in existing solutions in this industry
- Successful approaches and business models used by market leaders
- Gaps and improvement opportunities in current market offerings

${formData.competitor_apps.length > 0 ? `Analyze these competitors specifically: ${formData.competitor_apps.join(', ')}` : ''}
Geographic focus: ${formData.geographic_focus}

Return analysis of top 5 competitors/solutions in this market with their strengths and improvement opportunities.`;

            const competitorResult = await base44.integrations.Core.InvokeLLM({
                prompt: competitorPrompt,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        competitors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    app_name: { type: "string" },
                                    successful_features: {
                                        type: "array",
                                        items: { type: "string" }
                                    },
                                    user_praise: {
                                        type: "array", 
                                        items: { type: "string" }
                                    },
                                    improvement_opportunities: {
                                        type: "array",
                                        items: { type: "string" }
                                    }
                                },
                                required: ["app_name", "successful_features", "user_praise", "improvement_opportunities"]
                            }
                        }
                    },
                    required: ["competitors"]
                }
            });

            await ResearchProject.update(project.id, {
                competitor_insights: competitorResult.competitors
            });
            setProgressData(prev => ({ ...prev, competitors: competitorResult.competitors }));

            // Phase 3: App Concept Generation
            setAnalysisStep('Generating innovative app concepts...');
            const conceptPrompt = `Based on the pain points and competitor analysis below, generate 3-5 innovative app/product concepts that "${formData.title}" could build to succeed in this market.

Project: ${formData.title}
${industryContext ? `Industry: ${industryContext}` : ''}
${formData.description ? `Business Description: ${formData.description}` : ''}

Industry Pain Points Identified: ${JSON.stringify(painPointsResult.pain_points)}
Competitor Analysis: ${JSON.stringify(competitorResult.competitors)}

For each concept, provide:
- A unique name and core solution that addresses the identified market pain points
- Which industry pain points it solves
- Key features that differentiate it from existing competitors
- Competitive advantages over current market solutions
- Development complexity assessment
- Market potential evaluation

Focus on breakthrough ideas that solve real industry problems in innovative ways.`;

            const conceptsResult = await base44.integrations.Core.InvokeLLM({
                prompt: conceptPrompt,
                response_json_schema: {
                    type: "object", 
                    properties: {
                        app_concepts: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    concept_name: { type: "string" },
                                    core_solution: { type: "string" },
                                    target_pain_points: {
                                        type: "array",
                                        items: { type: "string" }
                                    },
                                    key_features: {
                                        type: "array", 
                                        items: { type: "string" }
                                    },
                                    competitive_advantage: { type: "string" },
                                    development_complexity: {
                                        type: "string",
                                        enum: ["low", "medium", "high"]
                                    },
                                    market_potential: {
                                        type: "string", 
                                        enum: ["niche", "moderate", "large"]
                                    }
                                },
                                required: ["concept_name", "core_solution", "target_pain_points", "key_features", "competitive_advantage", "development_complexity", "market_potential"]
                            }
                        }
                    },
                    required: ["app_concepts"]
                }
            });

            await ResearchProject.update(project.id, {
                status: 'completed',
                generated_concepts: conceptsResult.app_concepts
            });
            setProgressData(prev => ({ ...prev, concepts: conceptsResult.app_concepts }));

            setTimeout(() => {
                navigate(createPageUrl(`ResearchResults?id=${project.id}`));
            }, 2000);

        } catch (error) {
            console.error('Research failed:', error);
            setIsAnalyzing(false);
            setAnalysisStep('');
            alert(`Research failed: ${error.message || 'Unknown error occurred'}. Please try again.`);
        }
    };

    if (isAnalyzing) {
        return <AnalysisProgress 
            step={analysisStep} 
            progressData={progressData}
            projectTitle={formData.title}
        />;
    }

    return (
        <div className="min-h-screen app-background">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                {/* Header - MOBILE OPTIMIZED */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(createPageUrl("Dashboard"))}
                        className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 sm:h-10 sm:w-10"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            New Research Project
                        </h1>
                        <p className="text-gray-400 mt-1 text-xs sm:text-sm md:text-base">
                            Discover breakthrough app opportunities through AI-powered market analysis
                        </p>
                    </div>
                </div>

                {/* Research Form */}
                <ResearchForm 
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={startResearch}
                />
            </div>

            <PricingDrawer 
                open={showPricingDrawer}
                onClose={() => setShowPricingDrawer(false)}
                highlightFeature="unlimited projects"
            />
        </div>
    );
}