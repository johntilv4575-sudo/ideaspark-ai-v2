import React, { useState, useEffect, useCallback } from "react";
import { ResearchProject } from "@/entities/ResearchProject";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Plus,
  Search,
  TrendingUp,
  Lightbulb,
  Clock,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";

import StatsGrid from "../components/dashboard/StatsGrid";
import ProjectCard from "../components/dashboard/ProjectCard";
import QuickActions from "../components/dashboard/QuickActions";
import MarketInsightsModal from "../components/dashboard/MarketInsightsModal";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [marketInsights, setMarketInsights] = useState(null);
  const [showInsightsModal, setShowInsightsModal] = useState(false);

  const calculateMarketInsights = useCallback((projectsData) => {
    if (projectsData.length === 0) {
      setMarketInsights({
        trendingIndustry: null,
        opportunityIndustry: null,
        trendingScore: 0,
        opportunityScore: 0
      });
      return;
    }

    const industryCount = {};
    const industryOpportunityScores = {};

    projectsData.forEach((project) => {
      if (project.status === 'analyzing' || project.status === 'completed') {
        industryCount[project.industry] = (industryCount[project.industry] || 0) + 1;
      }

      if (project.generated_concepts && project.generated_concepts.length > 0) {
        const marketPotentialValues = {
          'large': 10,
          'moderate': 5,
          'niche': 1
        };

        let industryScore = 0;
        let conceptCount = 0;

        project.generated_concepts.forEach((concept) => {
          if (concept.market_potential) {
            industryScore += marketPotentialValues[concept.market_potential] || 0;
            conceptCount++;
          }
        });

        if (conceptCount > 0) {
          const avgScore = industryScore / conceptCount;
          if (!industryOpportunityScores[project.industry]) {
            industryOpportunityScores[project.industry] = { totalScore: 0, projectCount: 0 };
          }
          industryOpportunityScores[project.industry].totalScore += avgScore;
          industryOpportunityScores[project.industry].projectCount++;
        }
      }
    });

    let trendingIndustry = null;
    let maxCount = 0;
    Object.entries(industryCount).forEach(([industry, count]) => {
      if (count > maxCount) {
        maxCount = count;
        trendingIndustry = industry;
      }
    });

    let opportunityIndustry = null;
    let maxOpportunityScore = 0;
    Object.entries(industryOpportunityScores).forEach(([industry, data]) => {
      const avgOpportunityScore = data.totalScore / data.projectCount;
      if (avgOpportunityScore > maxOpportunityScore) {
        maxOpportunityScore = avgOpportunityScore;
        opportunityIndustry = industry;
      }
    });

    setMarketInsights({
      trendingIndustry,
      opportunityIndustry,
      trendingScore: maxCount,
      opportunityScore: maxOpportunityScore.toFixed(1)
    });
  }, []);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    const data = await ResearchProject.list("-created_date");
    setProjects(data);
    calculateMarketInsights(data);
    setIsLoading(false);
  }, [calculateMarketInsights]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const getStats = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === 'analyzing' || p.status === 'draft').length;
    const completedProjects = projects.filter((p) => p.status === 'completed').length;
    const totalConcepts = projects.reduce((sum, p) => sum + (p.generated_concepts?.length || 0), 0);

    return { totalProjects, activeProjects, completedProjects, totalConcepts };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen app-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Hero Header - MOBILE OPTIMIZED */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Idea Spark Dashboard
              </h1>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl">
                Transform user frustrations into breakthrough app ideas through AI-powered market research
              </p>
            </div>
            <Link to={createPageUrl("NewResearch")} className="w-full sm:w-auto">
              <Button className="gradient-button w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start New Research
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Main Content Grid - MOBILE OPTIMIZED */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-12">
          {/* Recent Projects */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                Recent Research Projects
              </h2>
              <Link to={createPageUrl("AppConcepts")} className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto text-gray-300 hover:text-white hover:bg-gray-700 px-3 sm:px-4 py-2 text-sm sm:text-base">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {isLoading ? (
                <div className="space-y-3 sm:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="card-secondary p-4 sm:p-6 animate-pulse">
                      <div className="h-4 bg-gray-700 rounded w-1/3 mb-3"></div>
                      <div className="h-3 bg-gray-700 rounded w-2/3 mb-4"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : projects.length > 0 ? (
                projects.slice(0, 5).map((project) => (
                  <ProjectCard key={project.id} project={project} onDelete={loadProjects} />
                ))
              ) : (
                <Card className="card-secondary">
                  <CardContent className="text-center py-8 sm:py-12 px-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No research projects yet</h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Start your first market research to discover breakthrough app opportunities</p>
                    <Link to={createPageUrl("NewResearch")}>
                      <Button className="gradient-button w-full sm:w-auto text-sm sm:text-base">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Project
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar - MOBILE OPTIMIZED */}
          <div className="space-y-4 sm:space-y-6">
            <QuickActions />
            
            {/* Market Insights */}
            <Card className="card-secondary hover:border-gray-600 transition-all cursor-pointer"
                  onClick={() => setShowInsightsModal(true)}>
              <CardHeader className="bg-[#374151] p-4 sm:p-6 flex flex-col space-y-1.5 border-b border-[#4b5563]">
                <CardTitle className="text-white flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  Market Insights
                  <Badge className="ml-auto bg-amber-500/20 text-yellow-300 border-amber-500/30 text-xs">Click to Explore</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-[#2d3748] p-4 sm:p-6 space-y-3 sm:space-y-4">
                {isLoading ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 sm:p-4 animate-pulse">
                      <div className="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                      <div className="h-5 bg-gray-600 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-600 rounded w-32"></div>
                    </div>
                    <div className="bg-gray-700 border border-gray-600 rounded-lg p-3 sm:p-4 animate-pulse">
                      <div className="h-4 bg-gray-600 rounded w-28 mb-2"></div>
                      <div className="h-5 bg-gray-600 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-600 rounded w-28"></div>
                    </div>
                  </div>
                ) : marketInsights?.trendingIndustry || marketInsights?.opportunityIndustry ? (
                  <div className="space-y-3 sm:space-y-4">
                    {marketInsights.trendingIndustry && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4 hover:bg-green-500/20 transition-all">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 font-medium text-xs sm:text-sm">Most Active Industry</span>
                        </div>
                        <p className="text-white font-semibold text-sm sm:text-base capitalize">{marketInsights.trendingIndustry.replace('_', ' ')}</p>
                        <p className="text-gray-400 text-xs sm:text-sm">{marketInsights.trendingScore} active projects</p>
                      </div>
                    )}
                    
                    {marketInsights.opportunityIndustry && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 sm:p-4 hover:bg-amber-500/20 transition-all">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                          <span className="text-amber-400 font-medium text-xs sm:text-sm">Highest Opportunity</span>
                        </div>
                        <p className="text-white font-semibold text-sm sm:text-base capitalize">{marketInsights.opportunityIndustry.replace('_', ' ')}</p>
                        <p className="text-gray-400 text-xs sm:text-sm">{marketInsights.opportunityScore}/10 potential score</p>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full border-amber-500/30 text-yellow-300 hover:bg-amber-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInsightsModal(true);
                      }}
                    >
                      View Detailed Analysis
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4 sm:py-6">
                    <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400 text-xs sm:text-sm">Complete your first research project to see market insights</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Market Insights Modal */}
      <MarketInsightsModal 
        open={showInsightsModal}
        onClose={() => setShowInsightsModal(false)}
        insights={marketInsights}
        projects={projects}
      />
    </div>
  );
}