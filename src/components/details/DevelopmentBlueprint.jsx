import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
    Users, 
    AlertTriangle,
    Sparkles, 
    Rocket, 
    DollarSign,
    ShieldCheck,
    Shield,
    Cpu,
    Download,
    Lock,
    Copy,
    Loader2,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    CheckCircle
} from "lucide-react";
import PromptGenerator from "./PromptGenerator";
import { base44 } from "@/api/base44Client";
import { ResearchProject } from "@/entities/ResearchProject";

import { canPerformAction, incrementUsage } from "@/components/utils/pricing";
import PricingDrawer from "../pricing/PricingDrawer";

const Section = ({ icon: Icon, title, children, iconColor }) => (
    <div>
        <h3 className={`text-xl font-semibold flex items-center gap-3 mb-4 text-gray-800`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
            {title}
        </h3>
        <div className="text-gray-600 space-y-3 pl-8">{children}</div>
    </div>
);

const RefinableSection = ({ 
    icon: Icon, 
    title, 
    content, 
    iconColor, 
    onRefine, 
    isRefining,
    sectionKey,
    placeholder = "e.g., 'Add 3 more features focusing on mobile usability' or 'Rewrite to emphasize cost savings'"
}) => {
    const [showRefine, setShowRefine] = useState(false);
    const [refinePrompt, setRefinePrompt] = useState("");

    const handleRefine = async () => {
        if (!refinePrompt.trim()) {
            toast.error("Please enter refinement instructions");
            return;
        }
        
        await onRefine(sectionKey, refinePrompt);
        setRefinePrompt("");
        setShowRefine(false);
    };

    return (
        <div className="relative">
            <div className="flex items-start justify-between mb-4">
                <h3 className={`text-xl font-semibold flex items-center gap-3 text-gray-800`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                    {title}
                </h3>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRefine(!showRefine)}
                    disabled={isRefining}
                    className="border-purple-500/30 text-purple-600 hover:bg-purple-50"
                >
                    {showRefine ? (
                        <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Refine with AI
                        </>
                    )}
                </Button>
            </div>

            {showRefine && (
                <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        How would you like to refine this section?
                    </label>
                    <Textarea
                        value={refinePrompt}
                        onChange={(e) => setRefinePrompt(e.target.value)}
                        placeholder={placeholder}
                        className="mb-3 min-h-[80px]"
                        disabled={isRefining}
                    />
                    <Button
                        onClick={handleRefine}
                        disabled={isRefining || !refinePrompt.trim()}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {isRefining ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Refining...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Refine Section
                            </>
                        )}
                    </Button>
                </div>
            )}

            <div className="text-gray-600 space-y-3 pl-8">
                {content}
            </div>
        </div>
    );
};

export default function DevelopmentBlueprint({ concept, industry, onExport, isPremium, projectId, conceptIndex }) {
    const [showPricingDrawer, setShowPricingDrawer] = React.useState(false);
    const [isExporting, setIsExporting] = React.useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [localConcept, setLocalConcept] = useState(concept);

    const handleCopyTechStack = () => {
        const textToCopy = [
            "Frontend: React / Next.js for a fast, modern user experience.",
            "Backend: Node.js / Python with a framework like Express or Django for scalability.",
            "Database: PostgreSQL for relational data, or MongoDB for more flexibility.",
            "Deployment: Vercel for the frontend, and AWS/GCP for the backend and database."
        ].join('\n');
        navigator.clipboard.writeText(textToCopy);
        toast.success("Tech stack copied to clipboard!");
    };

    const handleRefineSection = async (sectionKey, userPrompt) => {
        setIsRefining(true);
        
        try {
            let refinementPrompt = "";
            let responseSchema = {};

            // Build section-specific prompts and schemas
            if (sectionKey === "key_features") {
                refinementPrompt = `You are refining the "Key Features" section of an app concept.

**Original Concept:**
Name: ${localConcept.concept_name}
Core Solution: ${localConcept.core_solution}
Current Key Features:
${localConcept.key_features?.map((f, i) => `${i + 1}. ${f}`).join('\n') || 'None'}

**User's Refinement Request:**
${userPrompt}

Generate an improved list of key features based on the user's request. Return 5-8 features that align with the concept and address the user's refinement instructions. Be specific and actionable.`;

                responseSchema = {
                    type: "object",
                    properties: {
                        refined_features: {
                            type: "array",
                            items: { type: "string" }
                        }
                    }
                };
            } else if (sectionKey === "competitive_advantage") {
                refinementPrompt = `You are refining the "Competitive Advantage" section of an app concept.

**Original Concept:**
Name: ${localConcept.concept_name}
Core Solution: ${localConcept.core_solution}
Current Competitive Advantage: ${localConcept.competitive_advantage || 'None'}

**User's Refinement Request:**
${userPrompt}

Generate a refined competitive advantage statement based on the user's request. Make it compelling, specific, and focused on what makes this app unique. Return a single paragraph (2-4 sentences).`;

                responseSchema = {
                    type: "object",
                    properties: {
                        refined_advantage: { type: "string" }
                    }
                };
            } else if (sectionKey === "core_solution") {
                refinementPrompt = `You are refining the "Core Solution" description of an app concept.

**Original Concept:**
Name: ${localConcept.concept_name}
Current Core Solution: ${localConcept.core_solution}
Target Pain Points: ${localConcept.target_pain_points?.join(', ') || 'N/A'}

**User's Refinement Request:**
${userPrompt}

Generate a refined core solution description based on the user's request. Make it clear, concise, and compelling. Return a single paragraph (2-4 sentences) that captures the essence of what this app does and why it matters.`;

                responseSchema = {
                    type: "object",
                    properties: {
                        refined_solution: { type: "string" }
                    }
                };
            } else if (sectionKey === "target_pain_points") {
                refinementPrompt = `You are refining the "Target Pain Points" section of an app concept.

**Original Concept:**
Name: ${localConcept.concept_name}
Core Solution: ${localConcept.core_solution}
Current Target Pain Points:
${localConcept.target_pain_points?.map((p, i) => `${i + 1}. ${p}`).join('\n') || 'None'}

**User's Refinement Request:**
${userPrompt}

Generate an improved list of target pain points based on the user's request. Return 3-6 specific pain points that this app addresses. Be clear and user-focused.`;

                responseSchema = {
                    type: "object",
                    properties: {
                        refined_pain_points: {
                            type: "array",
                            items: { type: "string" }
                        }
                    }
                };
            }

            // Call the LLM
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: refinementPrompt,
                response_json_schema: responseSchema
            });

            // Update local concept state based on section
            let updatedConcept = { ...localConcept };
            
            if (sectionKey === "key_features" && result.refined_features) {
                updatedConcept.key_features = result.refined_features;
            } else if (sectionKey === "competitive_advantage" && result.refined_advantage) {
                updatedConcept.competitive_advantage = result.refined_advantage;
            } else if (sectionKey === "core_solution" && result.refined_solution) {
                updatedConcept.core_solution = result.refined_solution;
            } else if (sectionKey === "target_pain_points" && result.refined_pain_points) {
                updatedConcept.target_pain_points = result.refined_pain_points;
            }

            setLocalConcept(updatedConcept);

            // Update database if projectId and conceptIndex are provided
            if (projectId && conceptIndex !== undefined) {
                const project = await ResearchProject.get(projectId);
                const updatedConcepts = [...project.generated_concepts];
                updatedConcepts[conceptIndex] = updatedConcept;
                
                await ResearchProject.update(projectId, {
                    generated_concepts: updatedConcepts
                });
            }

            toast.success("Section refined successfully!");

        } catch (error) {
            console.error('Refinement failed:', error);
            toast.error("Failed to refine section. Please try again.");
        } finally {
            setIsRefining(false);
        }
    };

    const handleExport = async () => {
        const { allowed, reason } = await canPerformAction('export');
        if (!allowed) {
            setShowPricingDrawer(true);
            toast.error(reason);
            return;
        }
        
        setIsExporting(true);
        await incrementUsage('export');

        try {
            const pdfContent = `
═══════════════════════════════════════════════════════════
              DEVELOPMENT BLUEPRINT
═══════════════════════════════════════════════════════════

Concept: ${localConcept.concept_name}
${localConcept.one_liner ? `Pitch: ${localConcept.one_liner}` : ''}
${localConcept.target_user ? `Target User: ${localConcept.target_user}` : ''}
Industry: ${industry}
Generated: ${new Date().toLocaleDateString()}

═══════════════════════════════════════════════════════════
CORE SOLUTION
═══════════════════════════════════════════════════════════

${localConcept.core_solution}

═══════════════════════════════════════════════════════════
TARGET AUDIENCE & PROBLEM
═══════════════════════════════════════════════════════════

${localConcept.target_pain_points?.map((point, i) => `${i + 1}. ${point}`).join('\n') || 'N/A'}

${localConcept.proposed_solution_sources?.length > 0 ? `═══════════════════════════════════════════════════════════
RESEARCH-DERIVED SOLUTION SOURCES
═══════════════════════════════════════════════════════════

${localConcept.proposed_solution_sources.map((src, i) => `${i + 1}. ${src}`).join('\n')}
` : ''}
═══════════════════════════════════════════════════════════
KEY FEATURES
═══════════════════════════════════════════════════════════

${localConcept.key_features?.map((feature, i) => `${i + 1}. ${feature}`).join('\n') || 'N/A'}

${localConcept.mvp_scope ? `═══════════════════════════════════════════════════════════
MVP SCOPE
═══════════════════════════════════════════════════════════

IN SCOPE:
${localConcept.mvp_scope.in_scope?.map((item, i) => `${i + 1}. ${item}`).join('\n') || 'N/A'}

OUT OF SCOPE:
${localConcept.mvp_scope.out_of_scope?.map((item, i) => `${i + 1}. ${item}`).join('\n') || 'N/A'}
` : ''}
${localConcept.differentiation ? `═══════════════════════════════════════════════════════════
DIFFERENTIATION
═══════════════════════════════════════════════════════════

${localConcept.differentiation}
` : ''}
═══════════════════════════════════════════════════════════
COMPETITIVE ADVANTAGE
═══════════════════════════════════════════════════════════

${localConcept.competitive_advantage || 'N/A'}

${localConcept.risks_assumptions?.length > 0 ? `═══════════════════════════════════════════════════════════
RISKS & ASSUMPTIONS
═══════════════════════════════════════════════════════════

${localConcept.risks_assumptions.map((r, i) => `${i + 1}. ${r}`).join('\n')}
` : ''}
${localConcept.validation_plan?.length > 0 ? `═══════════════════════════════════════════════════════════
VALIDATION PLAN
═══════════════════════════════════════════════════════════

${localConcept.validation_plan.map((t, i) => `${i + 1}. ${t}`).join('\n')}
` : ''}
═══════════════════════════════════════════════════════════
MONETIZATION STRATEGY
═══════════════════════════════════════════════════════════

• Freemium Model: Offer basic features for free to attract a 
  large user base.

• Subscription: A 'Pro' tier for power users with advanced 
  features, unlimited usage, and priority support.

• Partnerships: Integrate with complementary services for 
  affiliate revenue.

═══════════════════════════════════════════════════════════
GO-TO-MARKET SUGGESTIONS
═══════════════════════════════════════════════════════════

• Content Marketing: Blog posts and articles addressing the 
  identified pain points.

• Community Engagement: Participate in relevant online communities 
  (Reddit, forums) where the target audience is active.

• Social Media Ads: Target users based on demographics and 
  interests related to the industry.

═══════════════════════════════════════════════════════════
RECOMMENDED TECH STACK
═══════════════════════════════════════════════════════════

Frontend: React / Next.js for a fast, modern user experience.

Backend: Node.js / Python with a framework like Express or 
Django for scalability.

Database: PostgreSQL for relational data, or MongoDB for 
more flexibility.

Deployment: Vercel for the frontend, and AWS/GCP for the 
backend and database.

═══════════════════════════════════════════════════════════
DEVELOPMENT COMPLEXITY: ${localConcept.development_complexity?.toUpperCase() || 'MEDIUM'}
MARKET POTENTIAL: ${localConcept.market_potential?.toUpperCase() || 'MODERATE'}
═══════════════════════════════════════════════════════════

Generated by Idea Spark AI - Spiral Studios
`;

            const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${localConcept.concept_name.replace(/[^a-z0-9]/gi, '_')}_Blueprint.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Blueprint exported successfully!");
            base44.analytics.track({ eventName: "data_exported", properties: { format: "blueprint_txt" } });
        } catch (error) {
            console.error('Export error:', error);
            toast.error("Failed to export blueprint. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            <div className="space-y-8">
                <Card className="bg-white text-gray-800 rounded-lg shadow-2xl">
                    <CardHeader className="p-8 bg-slate-50 border-b border-slate-200">
                        <CardTitle className="text-3xl font-bold text-gray-900">{localConcept.concept_name}</CardTitle>
                        {localConcept.one_liner && (
                            <p className="text-lg text-purple-600 font-medium italic mt-1">{localConcept.one_liner}</p>
                        )}
                        <p className="text-base text-gray-600 mt-2">{localConcept.core_solution}</p>
                        {localConcept.target_user && (
                            <div className="mt-3 flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Target: {localConcept.target_user}</span>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="p-8 space-y-10">
                        {/* Core Solution - Refinable */}
                        <RefinableSection
                            icon={Sparkles}
                            title="Core Solution"
                            iconColor="text-purple-600"
                            sectionKey="core_solution"
                            onRefine={handleRefineSection}
                            isRefining={isRefining}
                            placeholder="e.g., 'Make it more focused on enterprise users' or 'Emphasize the AI-powered features'"
                            content={<p>{localConcept.core_solution}</p>}
                        />

                        {/* Target Pain Points - Refinable */}
                        <RefinableSection
                            icon={Users}
                            title="Target Audience & Problem"
                            iconColor="text-blue-600"
                            sectionKey="target_pain_points"
                            onRefine={handleRefineSection}
                            isRefining={isRefining}
                            placeholder="e.g., 'Add pain points related to time management' or 'Focus more on small business owners'"
                            content={
                                <>
                                    <p>The primary target for this app is individuals and groups who are experiencing the following frustrations:</p>
                                    <ul className="list-disc list-outside space-y-2 ml-5">
                                        {localConcept.target_pain_points?.map((point, i) => <li key={i}>{point}</li>)}
                                    </ul>
                                </>
                            }
                        />
                        
                        {/* Key Features - Refinable */}
                        <RefinableSection
                            icon={Sparkles}
                            title="Key Features & MVP"
                            iconColor="text-purple-600"
                            sectionKey="key_features"
                            onRefine={handleRefineSection}
                            isRefining={isRefining}
                            placeholder="e.g., 'Add 3 more features focusing on mobile usability' or 'Prioritize features for MVP launch'"
                            content={
                                <>
                                    <p>The Minimum Viable Product should focus on delivering the core value proposition by implementing these key features:</p>
                                    <ol className="list-decimal list-outside space-y-2 ml-5">
                                        {localConcept.key_features?.map((feature, i) => <li key={i}>{feature}</li>)}
                                    </ol>
                                </>
                            }
                        />
                        
                        {/* Differentiation */}
                        {localConcept.differentiation && (
                            <Section icon={Shield} title="Differentiation vs Competitors" iconColor="text-teal-600">
                                <p>{localConcept.differentiation}</p>
                            </Section>
                        )}

                        {/* Competitive Advantage - Refinable */}
                        <RefinableSection
                            icon={ShieldCheck}
                            title="Competitive Advantage"
                            iconColor="text-green-600"
                            sectionKey="competitive_advantage"
                            onRefine={handleRefineSection}
                            isRefining={isRefining}
                            placeholder="e.g., 'Rewrite to emphasize cost-effectiveness' or 'Focus on speed and efficiency'"
                            content={<p>{localConcept.competitive_advantage}</p>}
                        />

                        {/* Research Sources */}
                        {localConcept.proposed_solution_sources?.length > 0 && (
                            <Section icon={Lightbulb} title="Research-Derived Solution Sources" iconColor="text-amber-600">
                                <ul className="list-disc list-outside space-y-2 ml-5">
                                    {localConcept.proposed_solution_sources.map((src, i) => <li key={i}>{src}</li>)}
                                </ul>
                            </Section>
                        )}

                        {/* MVP Scope */}
                        {localConcept.mvp_scope && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <Section icon={CheckCircle} title="MVP — In Scope" iconColor="text-green-600">
                                    <ul className="list-disc list-outside space-y-1 ml-5">
                                        {localConcept.mvp_scope.in_scope?.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </Section>
                                <Section icon={AlertTriangle} title="MVP — Out of Scope" iconColor="text-slate-500">
                                    <ul className="list-disc list-outside space-y-1 ml-5">
                                        {localConcept.mvp_scope.out_of_scope?.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </Section>
                            </div>
                        )}

                        {/* Risks & Assumptions */}
                        {localConcept.risks_assumptions?.length > 0 && (
                            <Section icon={AlertTriangle} title="Risks & Assumptions" iconColor="text-red-600">
                                <ul className="list-disc list-outside space-y-2 ml-5">
                                    {localConcept.risks_assumptions.map((risk, i) => <li key={i}>{risk}</li>)}
                                </ul>
                            </Section>
                        )}

                        {/* Validation Plan */}
                        {localConcept.validation_plan?.length > 0 && (
                            <Section icon={CheckCircle} title="Validation Plan (3 Quick Tests)" iconColor="text-blue-600">
                                <ol className="list-decimal list-outside space-y-2 ml-5">
                                    {localConcept.validation_plan.map((test, i) => <li key={i}>{test}</li>)}
                                </ol>
                            </Section>
                        )}

                        <div className="grid md:grid-cols-2 gap-10">
                            <Section icon={DollarSign} title="Monetization Strategy" iconColor="text-amber-600">
                                <ul className="list-disc list-outside space-y-2 ml-5">
                                    <li><strong>Freemium Model:</strong> Offer basic features for free to attract a large user base.</li>
                                    <li><strong>Subscription:</strong> A 'Pro' tier for power users with advanced features, unlimited usage, and priority support.</li>
                                    <li><strong>Partnerships:</strong> Integrate with complementary services for affiliate revenue.</li>
                                </ul>
                            </Section>
                            
                            <Section icon={Rocket} title="Go-to-Market Suggestions" iconColor="text-red-600">
                                <ul className="list-disc list-outside space-y-2 ml-5">
                                    <li><strong>Content Marketing:</strong> Blog posts and articles addressing the identified pain points.</li>
                                    <li><strong>Community Engagement:</strong> Participate in relevant online communities (Reddit, forums) where the target audience is active.</li>
                                    <li><strong>Social Media Ads:</strong> Target users based on demographics and interests related to the industry.</li>
                                </ul>
                            </Section>
                        </div>

                        <Section icon={Cpu} title="Recommended Tech Stack" iconColor="text-slate-600">
                            <div className="text-sm bg-slate-100 p-4 rounded-lg border border-slate-200 relative group">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 h-7 w-7 bg-slate-200 hover:bg-slate-300 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={handleCopyTechStack}
                                >
                                    <Copy className="h-4 w-4 text-slate-700" />
                                </Button>
                                <p><strong>Frontend:</strong> React / Next.js for a fast, modern user experience.</p>
                                <p><strong>Backend:</strong> Node.js / Python with a framework like Express or Django for scalability.</p>
                                <p><strong>Database:</strong> PostgreSQL for relational data, or MongoDB for more flexibility.</p>
                                <p><strong>Deployment:</strong> Vercel for the frontend, and AWS/GCP for the backend and database.</p>
                            </div>
                        </Section>
                    </CardContent>
                    <CardFooter className="p-8 bg-slate-50 border-t border-slate-200 blueprint-footer">
                        <Button 
                            type="button"
                            onClick={handleExport}
                            disabled={isExporting}
                            className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 text-white animate-spin" />
                                    <span className="text-white">Generating Blueprint...</span>
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5 mr-3 text-white" />
                                    <span className="text-white">Export Blueprint & Save to Device</span>
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Master Development Prompts */}
                <PromptGenerator concept={localConcept} industry={industry} />
            </div>
            
            <PricingDrawer 
                open={showPricingDrawer}
                onClose={() => setShowPricingDrawer(false)}
                highlightFeature="PDF exports"
            />
        </>
    );
}