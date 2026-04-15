import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ResearchProject } from "@/entities/ResearchProject";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Target,
  AlertTriangle,
  Users,
  Lightbulb,
  TrendingUp,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  Sparkles,
  BarChart3,
  Code,
  Shield } from
"lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from
"@/components/ui/alert-dialog";

const statusConfig = {
  draft: {
    icon: AlertTriangle,
    color: "bg-slate-600/20 text-slate-300 border-slate-500/30",
    label: "Draft",
    description: "Research not yet started"
  },
  analyzing: {
    icon: Clock,
    color: "bg-blue-600/20 text-blue-300 border-blue-500/30",
    label: "Analyzing",
    description: "AI is analyzing market data"
  },
  completed: {
    icon: CheckCircle,
    color: "bg-green-600/20 text-green-300 border-green-500/30",
    label: "Completed",
    description: "Research complete with insights"
  },
  archived: {
    icon: Archive,
    color: "bg-slate-600/20 text-slate-400 border-slate-500/30",
    label: "Archived",
    description: "Archived for reference"
  }
};

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

export default function ResearchDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get project ID from URL
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('id');

  useEffect(() => {
    if (projectId) {
      loadProject();
    } else {
      navigate(createPageUrl("Dashboard"));
    }
  }, [projectId]);

  const loadProject = async () => {
    setIsLoading(true);
    try {
      const projects = await ResearchProject.list();
      const foundProject = projects.find((p) => p.id === projectId);

      if (foundProject) {
        setProject(foundProject);
      } else {
        toast.error("Project not found");
        navigate(createPageUrl("Dashboard"));
      }
    } catch (error) {
      console.error("Failed to load project:", error);
      toast.error("Failed to load project details");
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await ResearchProject.delete(projectId);
      toast.success("Research project deleted successfully");
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleExport = () => {
    if (!project) return;

    const exportData = {
      project_title: project.title,
      industry: project.industry,
      status: project.status,
      created_date: project.created_date,
      pain_points: project.pain_points || [],
      competitor_insights: project.competitor_insights || [],
      generated_concepts: project.generated_concepts || []
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}_research.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Research data exported successfully");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading research details...</p>
                </div>
            </div>);

  }

  if (!project) {
    return null;
  }

  const statusInfo = statusConfig[project.status];
  const StatusIcon = statusInfo.icon;
  const painPoints = project.pain_points || [];
  const competitors = project.competitor_insights || [];
  const concepts = project.generated_concepts || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
            variant="ghost"
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate(createPageUrl("Dashboard"))}
            className="text-slate-400 hover:text-white mb-4">

                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white break-words">{project.title}</h1>
                                <Badge className={`${statusInfo.color} border text-sm flex-shrink-0`}>
                                    <StatusIcon className="w-4 h-4 mr-1" />
                                    {statusInfo.label}
                                </Badge>
                            </div>
                            <p className="text-slate-400 text-lg mb-4">
                                {project.description || `Market research for ${project.industry} industry`}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Created {format(new Date(project.created_date), 'MMMM d, yyyy')}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    <span className="capitalize">{project.industry}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" />
                                    {concepts.length} Concepts Generated
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                variant="outline"
                onClick={handleExport}
                className="border-slate-600 text-slate-300 hover:bg-slate-800">

                                <Download className="w-4 h-4 mr-2" />
                                Export Data
                            </Button>
                            <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="border-red-600/30 text-red-400 hover:bg-red-600/10">

                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{painPoints.length}</div>
                                    <div className="text-xs text-slate-400">Pain Points</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{competitors.length}</div>
                                    <div className="text-xs text-slate-400">Competitors</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{concepts.length}</div>
                                    <div className="text-xs text-slate-400">App Concepts</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">
                                        {concepts.filter((c) => c.market_potential === 'large').length}
                                    </div>
                                    <div className="text-xs text-slate-400">High Potential</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabbed Content */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="flex w-full overflow-x-auto bg-slate-800/50 border-slate-700 mb-6">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm whitespace-nowrap">
                            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="pain-points" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm whitespace-nowrap">
                            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Pain Points ({painPoints.length})
                        </TabsTrigger>
                        <TabsTrigger value="competitors" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm whitespace-nowrap">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Competitors ({competitors.length})
                        </TabsTrigger>
                        <TabsTrigger value="concepts" className="data-[state=active]:bg-blue-600 text-xs sm:text-sm whitespace-nowrap">
                            <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Concepts ({concepts.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <Card className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-blue-400" />
                                    Research Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Project Description</h3>
                                    <p className="text-slate-300">
                                        {project.description || `This research project analyzes the ${project.industry} industry to identify user pain points, competitive landscape, and generate innovative app concepts.`}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-white font-semibold mb-2">Research Parameters</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {project.research_parameters?.keywords &&
                    <div>
                                                <p className="text-slate-400 text-sm mb-1">Keywords</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.research_parameters.keywords.map((keyword, idx) =>
                        <Badge key={idx} variant="outline" className="text-slate-300">
                                                            {keyword}
                                                        </Badge>
                        )}
                                                </div>
                                            </div>
                    }
                                        {project.research_parameters?.competitor_apps &&
                    <div>
                                                <p className="text-slate-400 text-sm mb-1">Competitor Apps Analyzed</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.research_parameters.competitor_apps.map((app, idx) =>
                        <Badge key={idx} variant="outline" className="text-slate-300">
                                                            {app}
                                                        </Badge>
                        )}
                                                </div>
                                            </div>
                    }
                                    </div>
                                </div>

                                {concepts.length > 0 &&
                <div>
                                        <h3 className="text-white font-semibold mb-3">Market Opportunity Breakdown</h3>
                                        <div className="grid sm:grid-cols-3 gap-4">
                                            <div className="bg-gradient-to-br from-pink-900/20 to-pink-950/20 border border-pink-500/30 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-pink-300 mb-1">
                                                    {concepts.filter((c) => c.market_potential === 'large').length}
                                                </div>
                                                <div className="text-xs text-pink-200">Large Market</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border border-purple-500/30 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-purple-300 mb-1">
                                                    {concepts.filter((c) => c.market_potential === 'moderate').length}
                                                </div>
                                                <div className="text-xs text-purple-200">Moderate Market</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 border border-blue-500/30 rounded-lg p-4">
                                                <div className="text-2xl font-bold text-blue-300 mb-1">
                                                    {concepts.filter((c) => c.market_potential === 'niche').length}
                                                </div>
                                                <div className="text-xs text-blue-200">Niche Market</div>
                                            </div>
                                        </div>
                                    </div>
                }
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Pain Points Tab */}
                    <TabsContent value="pain-points" className="space-y-4">
                        {painPoints.length > 0 ?
            painPoints.map((point, idx) =>
            <Card key={idx} className="bg-slate-800/50 border-slate-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-white font-semibold">{point.issue}</h3>
                                                    {point.severity &&
                      <Badge className={`
                                                            ${point.severity === 'high' ? 'bg-red-600/20 text-red-300 border-red-500/30' : ''}
                                                            ${point.severity === 'medium' ? 'bg-amber-600/20 text-amber-300 border-amber-500/30' : ''}
                                                            ${point.severity === 'low' ? 'bg-blue-600/20 text-blue-300 border-blue-500/30' : ''}
                                                            border text-xs
                                                        `}>
                                                            {point.severity} severity
                                                        </Badge>
                      }
                                                </div>
                                                {point.frequency &&
                    <p className="text-slate-400 text-sm mb-3">
                                                        Mentioned {point.frequency} times in user feedback
                                                    </p>
                    }
                                                {point.source_examples && point.source_examples.length > 0 &&
                    <div>
                                                        <p className="text-slate-400 text-sm font-semibold mb-2">Example Complaints:</p>
                                                        <div className="space-y-2">
                                                            {point.source_examples.slice(0, 3).map((example, exIdx) =>
                        <div key={exIdx} className="bg-slate-900/50 rounded-lg p-3 border-l-2 border-red-500/30">
                                                                    <p className="text-slate-300 text-sm italic">"{example}"</p>
                                                                </div>
                        )}
                                                        </div>
                                                    </div>
                    }
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
            ) :

            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-12 text-center">
                                    <AlertTriangle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                    <h3 className="text-white font-semibold mb-2">No Pain Points Yet</h3>
                                    <p className="text-slate-400">
                                        {project.status === 'analyzing' ?
                  'AI is currently analyzing user feedback to identify pain points...' :
                  'Pain points will appear here once the research is complete.'}
                                    </p>
                                </CardContent>
                            </Card>
            }
                    </TabsContent>

                    {/* Competitors Tab */}
                    <TabsContent value="competitors" className="space-y-4">
                        {competitors.length > 0 ?
            competitors.map((competitor, idx) =>
            <Card key={idx} className="bg-slate-800/50 border-slate-700">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Shield className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold text-lg mb-4">{competitor.app_name}</h3>
                                                
                                                {competitor.successful_features && competitor.successful_features.length > 0 &&
                    <div className="mb-4">
                                                        <p className="text-green-400 text-sm font-semibold mb-2 flex items-center gap-2">
                                                            <CheckCircle className="w-4 h-4" />
                                                            What They Do Well:
                                                        </p>
                                                        <ul className="space-y-1">
                                                            {competitor.successful_features.map((feature, fIdx) =>
                        <li key={fIdx} className="text-slate-300 text-sm pl-6">
                                                                    • {feature}
                                                                </li>
                        )}
                                                        </ul>
                                                    </div>
                    }

                                                {competitor.user_praise && competitor.user_praise.length > 0 &&
                    <div className="mb-4">
                                                        <p className="text-blue-400 text-sm font-semibold mb-2">User Praise:</p>
                                                        <div className="space-y-2">
                                                            {competitor.user_praise.map((praise, pIdx) =>
                        <div key={pIdx} className="bg-blue-900/20 rounded-lg p-2 border-l-2 border-blue-500/30">
                                                                    <p className="text-slate-300 text-sm italic">"{praise}"</p>
                                                                </div>
                        )}
                                                        </div>
                                                    </div>
                    }

                                                {competitor.improvement_opportunities && competitor.improvement_opportunities.length > 0 &&
                    <div>
                                                        <p className="text-amber-400 text-sm font-semibold mb-2 flex items-center gap-2">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            Opportunities for Improvement:
                                                        </p>
                                                        <ul className="space-y-1">
                                                            {competitor.improvement_opportunities.map((opp, oIdx) =>
                        <li key={oIdx} className="text-slate-300 text-sm pl-6">
                                                                    • {opp}
                                                                </li>
                        )}
                                                        </ul>
                                                    </div>
                    }
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
            ) :

            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-12 text-center">
                                    <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                    <h3 className="text-white font-semibold mb-2">No Competitor Analysis Yet</h3>
                                    <p className="text-slate-400">
                                        {project.status === 'analyzing' ?
                  'AI is currently analyzing competitors...' :
                  'Competitor insights will appear here once the research is complete.'}
                                    </p>
                                </CardContent>
                            </Card>
            }
                    </TabsContent>

                    {/* Concepts Tab */}
                    <TabsContent value="concepts" className="space-y-4">
                        {concepts.length > 0 ?
            concepts.map((concept, idx) =>
            <Card key={idx} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold text-xl mb-2">{concept.concept_name}</h3>
                                                <p className="text-slate-300 mb-4">{concept.core_solution}</p>
                                            </div>
                                            <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/ConceptDetails?project=${projectId}&concept=${idx}`);
                    }}
                    className="border-blue-500/30 text-blue-300 hover:bg-blue-600/10">

                                                <Code className="w-4 h-4 mr-2" />
                                                View Details
                                            </Button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {concept.market_potential &&
                  <Badge className={`${potentialColors[concept.market_potential]} border`}>
                                                    {concept.market_potential} market
                                                </Badge>
                  }
                                            {concept.development_complexity &&
                  <Badge className={`${complexityColors[concept.development_complexity]} border`}>
                                                    {concept.development_complexity} complexity
                                                </Badge>
                  }
                                        </div>

                                        {concept.target_pain_points && concept.target_pain_points.length > 0 &&
                <div className="mb-4">
                                                <p className="text-slate-400 text-sm font-semibold mb-2">Solves These Pain Points:</p>
                                                <ul className="space-y-1">
                                                    {concept.target_pain_points.map((point, pIdx) =>
                    <li key={pIdx} className="text-slate-300 text-sm pl-4">
                                                            • {point}
                                                        </li>
                    )}
                                                </ul>
                                            </div>
                }

                                        {concept.key_features && concept.key_features.length > 0 &&
                <div className="mb-4">
                                                <p className="text-slate-400 text-sm font-semibold mb-2">Key Features:</p>
                                                <div className="grid sm:grid-cols-2 gap-2">
                                                    {concept.key_features.map((feature, fIdx) =>
                    <div key={fIdx} className="bg-slate-900/50 rounded-lg p-2">
                                                            <p className="text-slate-300 text-sm">{feature}</p>
                                                        </div>
                    )}
                                                </div>
                                            </div>
                }

                                        {concept.competitive_advantage &&
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-4">
                                                <p className="text-purple-300 text-sm font-semibold mb-1">Competitive Advantage:</p>
                                                <p className="text-slate-300 text-sm">{concept.competitive_advantage}</p>
                                            </div>
                }
                                    </CardContent>
                                </Card>
            ) :

            <Card className="bg-slate-800/50 border-slate-700">
                                <CardContent className="p-12 text-center">
                                    <Lightbulb className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                                    <h3 className="text-white font-semibold mb-2">No Concepts Generated Yet</h3>
                                    <p className="text-slate-400">
                                        {project.status === 'analyzing' ?
                  'AI is generating innovative app concepts...' :
                  'App concepts will appear here once the research is complete.'}
                                    </p>
                                </CardContent>
                            </Card>
            }
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-slate-800 border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Research Project?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to delete "<span className="text-white font-semibold">{project.title}</span>"? 
                            This will permanently delete the project and all its data including {painPoints.length} pain points, 
                            {competitors.length} competitor analyses, and {concepts.length} generated concepts. 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white">

                            {isDeleting ? "Deleting..." : "Delete Project"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>);

}