import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Lightbulb, ArrowLeft, SlidersHorizontal, X
} from "lucide-react";
import SummaryStatsBar from "@/components/summary/SummaryStatsBar";
import ConceptSummaryCard from "@/components/summary/ConceptSummaryCard";

export default function ConceptSummaryDashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [complexityFilter, setComplexityFilter] = useState("all");
  const [potentialFilter, setPotentialFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await base44.entities.ResearchProject.list("-created_date", 200);
      setProjects(data.filter(p => p.generated_concepts?.length > 0));
      setIsLoading(false);
    };
    load();
  }, []);

  // Flatten all concepts with parent project + market data attached
  const allConcepts = useMemo(() => {
    return projects.flatMap(project =>
      (project.generated_concepts || []).map((concept, idx) => ({
        ...concept,
        project_title: project.title,
        project_id: project.id,
        industry: project.industry || "general",
        marketTrends: project.market_trends || {},
        _conceptIndex: idx
      }))
    );
  }, [projects]);

  // Filter
  const filtered = useMemo(() => {
    return allConcepts.filter(c => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !q ||
        (c.concept_name || "").toLowerCase().includes(q) ||
        (c.core_solution || "").toLowerCase().includes(q) ||
        (c.industry || "").toLowerCase().includes(q) ||
        (c.key_features || []).some(f => f.toLowerCase().includes(q));
      const matchesIndustry = industryFilter === "all" || c.industry === industryFilter;
      const matchesComplexity = complexityFilter === "all" || c.development_complexity === complexityFilter;
      const matchesPotential = potentialFilter === "all" || c.market_potential === potentialFilter;
      return matchesSearch && matchesIndustry && matchesComplexity && matchesPotential;
    });
  }, [allConcepts, searchTerm, industryFilter, complexityFilter, potentialFilter]);

  // Stats
  const stats = useMemo(() => {
    const complexity = {};
    const potential = {};
    const industries = new Set();
    allConcepts.forEach(c => {
      complexity[c.development_complexity] = (complexity[c.development_complexity] || 0) + 1;
      potential[c.market_potential] = (potential[c.market_potential] || 0) + 1;
      industries.add(c.industry);
    });
    return { complexity, potential, industryCount: industries.size, industries: [...industries].sort() };
  }, [allConcepts]);

  const hasActiveFilters = industryFilter !== "all" || complexityFilter !== "all" || potentialFilter !== "all" || searchTerm;

  return (
    <div className="min-h-screen app-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link to={createPageUrl("Dashboard")}>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-8 w-8">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Concept Summary</h1>
            </div>
            <p className="text-slate-400 text-sm ml-11">
              High-level overview of all {allConcepts.length} concepts across {projects.length} projects
            </p>
          </div>
          <Link to={createPageUrl("AppConcepts")}>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 text-sm">
              <Lightbulb className="w-4 h-4 mr-2" /> Full Concept Manager
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading your concepts…</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6">
              <SummaryStatsBar
                totalConcepts={allConcepts.length}
                totalProjects={projects.length}
                complexityBreakdown={stats.complexity}
                potentialBreakdown={stats.potential}
                industryCount={stats.industryCount}
              />
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search concepts, features, industries…"
                  className="pl-9 input-primary h-10 text-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="input-primary px-3 py-2 text-xs rounded-lg"
                >
                  <option value="all">All Industries</option>
                  {stats.industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                <select
                  value={complexityFilter}
                  onChange={(e) => setComplexityFilter(e.target.value)}
                  className="input-primary px-3 py-2 text-xs rounded-lg"
                >
                  <option value="all">All Complexity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select
                  value={potentialFilter}
                  onChange={(e) => setPotentialFilter(e.target.value)}
                  className="input-primary px-3 py-2 text-xs rounded-lg"
                >
                  <option value="all">All Potential</option>
                  <option value="niche">Niche</option>
                  <option value="moderate">Moderate</option>
                  <option value="large">Large</option>
                </select>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white text-xs h-9"
                    onClick={() => { setSearchTerm(""); setIndustryFilter("all"); setComplexityFilter("all"); setPotentialFilter("all"); }}
                  >
                    <X className="w-3 h-3 mr-1" /> Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Results count */}
            <p className="text-slate-500 text-xs mb-4">
              Showing {filtered.length} of {allConcepts.length} concepts
            </p>

            {/* Concept Cards Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((concept, i) => (
                  <ConceptSummaryCard
                    key={`${concept.project_id}-${concept._conceptIndex}`}
                    concept={concept}
                    conceptIndex={concept._conceptIndex}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">No concepts match your filters</h3>
                <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}