
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ResearchProject } from "@/entities/ResearchProject"; 
import { 
    Lightbulb, 
    Target,
    TrendingUp,
    Users,
    Code,
    ArrowRight,
    Sparkles,
    Copy,
    Plus,
    CheckCircle,
    Trash2,
    Send,
    Lock
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createAppForgeHandoffUrl, canUseHandoff, updatePipelineStatus } from "../utils/handoff";
import PricingDrawer from "../pricing/PricingDrawer";
import { cn } from "@/lib/utils";

const complexityColors = {
    low: "bg-green-600/20 text-green-300 border-green-500/30",
    medium: "bg-amber-600/20 text-amber-300 border-amber-500/30", 
    high: "bg-red-600/20 text-red-300 border-red-500/30"
};

const potentialColors = {
    niche: "bg-blue-600/20 text-blue-300 border-blue-500/30",
    moderate: "bg-purple-600/20 text-purple-300 border-purple-500/30",
    large: "bg-pink-600/20 text-pink-300 border-pink-500/30"
};

export default function ConceptGrid({ concepts, selectedConcepts = [], onToggleSelection, onConceptDeleted }) {
    const navigate = useNavigate();
    const [deletingConcept, setDeletingConcept] = React.useState(null);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [showPricingDrawer, setShowPricingDrawer] = React.useState(false);

    const handleCopy = (concept) => {
        const textToCopy = `Concept: ${concept.concept_name}\nSolution: ${concept.core_solution}`;
        navigator.clipboard.writeText(textToCopy);
        toast.success("Concept summary copied to clipboard!");
    };

    const handleDeleteConcept = async (concept) => {
        setIsDeleting(true);
        try {
            // Get the project
            const project = await ResearchProject.get(concept.project_id);
            
            // Remove this concept from the array
            const updatedConcepts = project.generated_concepts.filter(
                c => c.concept_name !== concept.concept_name
            );
            
            // Update the project
            await ResearchProject.update(concept.project_id, {
                generated_concepts: updatedConcepts
            });
            
            toast.success("Concept removed successfully");
            setDeletingConcept(null);
            
            // Notify parent to refresh
            if (onConceptDeleted) onConceptDeleted();
        } catch (error) {
            toast.error("Failed to remove concept");
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const isSelected = (concept) => {
        return selectedConcepts.some(c => c.project_id === concept.project_id && c.concept_name === concept.concept_name);
    };

    const handleSendToAppForge = (concept) => {
        const hasSuiteAccess = canUseHandoff();
        
        if (!hasSuiteAccess) {
            setShowPricingDrawer(true);
            return;
        }

        // Update pipeline status
        updatePipelineStatus(
            `${concept.project_id}_${concept.concept_name}`,
            'validation',
            'App Forge'
        );

        // Create handoff URL and open App Forge
        const handoffUrl = createAppForgeHandoffUrl(
            concept,
            concept.project_title,
            concept.industry
        );
        
        window.open(handoffUrl, '_blank');
        toast.success("Idea sent to App Forge for validation!");
    };

    // Find the concept index in the original project
    const getConceptIndex = async (concept) => {
        try {
            const project = await ResearchProject.get(concept.project_id);
            if (project && project.generated_concepts) {
                const index = project.generated_concepts.findIndex(
                    c => c.concept_name === concept.concept_name
                );
                return index;
            }
            return 0; // Fallback if project or concepts not found
        } catch (error) {
            console.error("Error finding concept index:", error);
            return 0; // Fallback on error
        }
    };

    const handleViewDetails = async (concept) => {
        const index = await getConceptIndex(concept);
        navigate(`/ConceptDetails?project=${concept.project_id}&concept=${index}`);
    };

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {concepts.map((concept, displayIndex) => {
                    const selected = isSelected(concept);
                    const hasSuiteAccess = canUseHandoff();
                    
                    return (
                        <Card 
                            key={`${concept.project_id}-${displayIndex}`}
                            className={`bg-slate-800/30 backdrop-blur-sm border rounded-xl hover:bg-slate-800/50 transition-all duration-300 group flex flex-col ${
                                selected ? 'border-green-500 ring-2 ring-green-500/50' : 'border-slate-700 hover:border-slate-600'
                            }`}
                        >
                            <CardHeader className="p-4 pb-3 sm:p-6 sm:pb-4">
                                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-all duration-300 flex-shrink-0">
                                        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-blue-300 transition-colors leading-tight">
                                            {concept.concept_name}
                                        </CardTitle>
                                        <div className="flex items-center gap-1 sm:gap-2 text-xs text-slate-400 flex-wrap">
                                            <span>From:</span>
                                            <span className="text-slate-300 capitalize">{concept.industry}</span>
                                            <span>•</span>
                                            <span className="truncate">{concept.project_title}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-slate-300 text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                                    {concept.core_solution}
                                </p>

                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                    <Badge className={`${complexityColors[concept.development_complexity]} text-xs`}>
                                        <Code className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                                        {concept.development_complexity} complexity
                                    </Badge>
                                    <Badge className={`${potentialColors[concept.market_potential]} text-xs`}>
                                        <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                                        {concept.market_potential} market
                                    </Badge>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="px-4 pb-4 mt-auto sm:px-6 sm:pb-6">
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <h4 className="text-slate-300 font-medium text-xs sm:text-sm mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                                            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Solves Pain Points:
                                        </h4>
                                        <div className="flex flex-wrap gap-1">
                                            {concept.target_pain_points?.slice(0, 2).map((pain, i) => (
                                                <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                                    {pain.length > 30 ? pain.substring(0, 30) + '...' : pain}
                                                </Badge>
                                            ))}
                                            {concept.target_pain_points?.length > 2 && (
                                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                                    +{concept.target_pain_points.length - 2} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-slate-300 font-medium text-xs sm:text-sm mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                                            Key Features:
                                        </h4>
                                        <ul className="text-slate-400 text-xs space-y-1">
                                            {concept.key_features?.slice(0, 3).map((feature, i) => (
                                                <li key={i} className="flex items-start gap-1.5 sm:gap-2">
                                                    <div className="w-1 h-1 bg-slate-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                                    <span className="line-clamp-2">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Buttons - Primary Navigation */}
                                    <div className="flex gap-2 pt-2 border-t border-slate-700">
                                        <Button 
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleViewDetails(concept);
                                            }}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white group-hover:translate-y-[-2px] transition-all duration-200 text-xs sm:text-sm h-9 sm:h-10"
                                        >
                                            <span className="hidden sm:inline">View Full Details</span>
                                            <span className="sm:hidden">Details</span>
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
                                        </Button>
                                        
                                        <Button
                                            type="button"
                                            onClick={() => handleSendToAppForge(concept)}
                                            className={cn(
                                                "px-3 sm:px-4 h-9 sm:h-10",
                                                hasSuiteAccess
                                                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                                                    : "bg-slate-700 hover:bg-slate-600 text-slate-400"
                                            )}
                                            title={hasSuiteAccess ? "Send to App Forge" : "Requires Suite tier"}
                                        >
                                            {hasSuiteAccess ? <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                        </Button>
                                    </div>

                                    {/* Quick Actions Row */}
                                    <div className="flex gap-1 sm:gap-2 justify-end">
                                        {onToggleSelection && (
                                            <Button
                                                size="icon"
                                                type="button"
                                                className={`w-7 h-7 sm:w-8 sm:h-8 ${
                                                    selected 
                                                        ? 'bg-green-600 hover:bg-green-700' 
                                                        : 'bg-slate-700 hover:bg-slate-600'
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleSelection(concept);
                                                }}
                                                title={selected ? "Deselect concept" : "Select concept"}
                                            >
                                                {selected ? <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />}
                                            </Button>
                                        )}
                                        <Button
                                            size="icon"
                                            type="button"
                                            className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-700 hover:bg-slate-600 text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopy(concept);
                                            }}
                                            title="Copy concept summary"
                                        >
                                            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            type="button"
                                            className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-700 hover:bg-red-600 text-slate-400 hover:text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeletingConcept(concept);
                                            }}
                                            title="Delete concept"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <AlertDialog open={deletingConcept !== null} onOpenChange={() => setDeletingConcept(null)}>
                <AlertDialogContent className="bg-slate-800 border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Remove Concept?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to remove "<span className="text-white font-semibold">{deletingConcept?.concept_name}</span>"? 
                            This will remove it from the research project. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingConcept && handleDeleteConcept(deletingConcept)}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Removing..." : "Remove Concept"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <PricingDrawer 
                open={showPricingDrawer}
                onClose={() => setShowPricingDrawer(false)}
                highlightFeature="cross-app handoffs"
            />
        </>
    );
}
