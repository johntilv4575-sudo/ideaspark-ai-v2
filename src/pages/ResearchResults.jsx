import React, { useState, useEffect } from "react";
import { ResearchProject } from "@/entities/ResearchProject";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Home, AlertTriangle, RefreshCw } from "lucide-react";
import AirtableSyncButton from "../components/airtable/AirtableSyncButton";
import ProjectExportMenu from "../components/results/ProjectExportMenu";
import PainPointsSection from "../components/results/PainPointsSection";
import CompetitorInsightsSection from "../components/results/CompetitorInsightsSection";
import GeneratedConceptsSection from "../components/results/GeneratedConceptsSection";
import UserPersonasSection from "../components/results/UserPersonasSection";
import ConceptRegenerator from "../components/results/ConceptRegenerator";

export default function ResearchResults() {
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const projectId = new URLSearchParams(window.location.search).get("id");
        if (projectId) {
            fetchData(projectId);
        } else {
            setError("No project ID provided in URL");
            setIsLoading(false);
        }
    }, []);

    const fetchData = async (projectId) => {
        setIsLoading(true);
        setError(null);
        try {
            const [projectData, userData] = await Promise.all([
                ResearchProject.get(projectId),
                User.me()
            ]);
            
            if (!projectData) {
                setError("Project not found.");
            } else {
                setProject(projectData);
                setUser(userData);
            }
        } catch (err) {
            console.error("Failed to fetch project:", err);
            setError(`Failed to load project: ${err.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading research results...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0B1426 0%, #1A2332 100%)'}}>
                <Card className="bg-slate-800/30 backdrop-blur-sm border border-red-600/30 rounded-xl max-w-2xl mx-4">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                            Unable to Load Project
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-slate-300 text-lg">{error || "Project not found."}</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={() => navigate(createPageUrl("Dashboard"))}
                                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                            <Button
                                onClick={() => {
                                    const projectId = new URLSearchParams(window.location.search).get("id");
                                    if (projectId) fetchData(projectId);
                                }}
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:bg-slate-800 w-full sm:w-auto"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0B1426 0%, #1A2332 100%)'}}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header with CLEAR back button */}
                <div className="flex items-center gap-4 mb-6 sm:mb-8">
                    <Button
                        variant="outline"
                        onClick={() => navigate(createPageUrl("Dashboard"))}
                        className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">{project.title}</h1>
                            <div className="flex items-center gap-2">
                                <ProjectExportMenu project={project} />
                                <AirtableSyncButton projectId={project.id} />
                            </div>
                        </div>
                        <p className="text-slate-400 mt-1 text-sm sm:text-base">Full Market Analysis for <span className="capitalize text-blue-300">{project.industry}</span></p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        <PainPointsSection 
                            painPoints={project.pain_points} 
                            projectTitle={project.title} 
                            industry={project.industry}
                            projectId={project.id}
                            onSolutionsSaved={(solutions) => setProject({...project, deep_dive_solutions: solutions})}
                        />
                        <UserPersonasSection 
                            personas={project.generated_personas}
                            painPoints={project.pain_points}
                            projectId={project.id}
                            projectTitle={project.title}
                            industry={project.industry}
                            targetDemographics={project.research_parameters?.target_demographics}
                            geographicFocus={project.research_parameters?.geographic_focus}
                            onPersonasUpdated={(newPersonas) => setProject({...project, generated_personas: newPersonas})}
                        />
                        <CompetitorInsightsSection insights={project.competitor_insights} projectTitle={project.title} industry={project.industry} />
                    </div>
                    <div className="space-y-6">
                        <ConceptRegenerator 
                            project={project} 
                            onConceptsUpdated={(newConcepts) => setProject({...project, generated_concepts: newConcepts})} 
                        />
                        <GeneratedConceptsSection concepts={project.generated_concepts} projectId={project.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}