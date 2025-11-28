import React, { useState, useEffect } from "react";
import { ResearchProject } from "@/entities/ResearchProject";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
    Search,
    Plus,
    Lightbulb,
    Filter,
    ArrowRight,
    Sparkles,
    LayoutGrid,
    Kanban
} from "lucide-react";

import ConceptGrid from "../components/concepts/ConceptGrid";
import ConceptFilters from "../components/concepts/ConceptFilters";
import CombineConceptsModal from "../components/concepts/CombineConceptsModal";
import ConceptGroupView from "../components/concepts/ConceptGroupView";
import ConceptKanbanBoard from "../components/concepts/ConceptKanbanBoard";

export default function AppConcepts() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        industry: 'all',
        complexity: 'all',
        potential: 'all'
    });
    const [selectedConcepts, setSelectedConcepts] = useState([]);
    const [showCombineModal, setShowCombineModal] = useState(false);
    const [groupBy, setGroupBy] = useState('project'); // NEW: grouping preference
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'kanban'

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setIsLoading(true);
        const data = await ResearchProject.list("-created_date");
        setProjects(data.filter(p => p.generated_concepts && p.generated_concepts.length > 0));
        setIsLoading(false);
    };

    const getAllConcepts = () => {
        return projects.flatMap(project =>
            project.generated_concepts.map(concept => ({
                ...concept,
                project_title: project.title,
                project_id: project.id,
                industry: project.industry
            }))
        );
    };

    const filteredConcepts = getAllConcepts().filter(concept => {
        // Safely handle null/undefined values
        const conceptName = concept.concept_name || '';
        const coreSolution = concept.core_solution || '';
        const searchLower = searchTerm.toLowerCase();

        const matchesSearch = conceptName.toLowerCase().includes(searchLower) ||
                            coreSolution.toLowerCase().includes(searchLower);

        const matchesIndustry = filters.industry === 'all' || concept.industry === filters.industry;
        const matchesComplexity = filters.complexity === 'all' || concept.development_complexity === filters.complexity;
        const matchesPotential = filters.potential === 'all' || concept.market_potential === filters.potential;

        return matchesSearch && matchesIndustry && matchesComplexity && matchesPotential;
    });

    const toggleConceptSelection = (concept) => {
        setSelectedConcepts(prev => {
            const exists = prev.some(c => c.concept_name === concept.concept_name && c.project_id === concept.project_id);
            if (exists) {
                return prev.filter(c => !(c.concept_name === concept.concept_name && c.project_id === concept.project_id));
            } else {
                return [...prev, concept];
            }
        });
    };

    const handleCombineConcepts = () => {
        if (selectedConcepts.length < 2) {
            alert("Please select at least 2 concepts to combine");
            return;
        }
        setShowCombineModal(true);
    };

    return (
        <div className="min-h-screen app-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">
                            Generated App Concepts
                        </h1>
                        <p className="text-gray-400 text-base sm:text-lg">
                            Innovative app ideas born from real user frustrations and market gaps
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-3">
                        {selectedConcepts.length > 0 && (
                            <Button
                                onClick={handleCombineConcepts}
                                className="gradient-button w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-sm sm:text-base"
                            >
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Combine {selectedConcepts.length} Concepts
                            </Button>
                        )}
                        <Link to={createPageUrl("NewResearch")} className="w-full sm:w-auto">
                            <Button className="gradient-button w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-sm sm:text-base">
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Generate New Ideas
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search app concepts..."
                            className="pl-9 sm:pl-10 input-primary h-10 sm:h-12 text-sm sm:text-base"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 items-center justify-between w-full">
                        <ConceptFilters filters={filters} onFilterChange={setFilters} />

                        <div className="flex items-center gap-2">
                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-slate-800 rounded-lg p-1">
                                <Button
                                    size="sm"
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    onClick={() => setViewMode('grid')}
                                    className={`h-7 px-2 text-xs ${viewMode === 'grid' ? 'bg-blue-600' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <LayoutGrid className="w-3.5 h-3.5 mr-1" />
                                    Grid
                                </Button>
                                <Button
                                    size="sm"
                                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                                    onClick={() => setViewMode('kanban')}
                                    className={`h-7 px-2 text-xs ${viewMode === 'kanban' ? 'bg-blue-600' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Kanban className="w-3.5 h-3.5 mr-1" />
                                    Board
                                </Button>
                            </div>

                            {viewMode === 'grid' && (
                                <select
                                    value={groupBy}
                                    onChange={(e) => setGroupBy(e.target.value)}
                                    className="input-primary px-2 py-1.5 text-xs focus:border-[#667eea]"
                                >
                                    <option value="none">No Group</option>
                                    <option value="project">Project</option>
                                    <option value="industry">Industry</option>
                                    <option value="complexity">Complexity</option>
                                    <option value="potential">Potential</option>
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                {/* Concepts Display */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-400">Loading your brilliant concepts...</p>
                    </div>
                ) : filteredConcepts.length > 0 ? (
                    viewMode === 'kanban' ? (
                        <ConceptKanbanBoard
                            concepts={filteredConcepts}
                            onConceptDeleted={loadProjects}
                        />
                    ) : groupBy === 'none' ? (
                        <ConceptGrid
                            concepts={filteredConcepts}
                            selectedConcepts={selectedConcepts}
                            onToggleSelection={toggleConceptSelection}
                            onConceptDeleted={loadProjects}
                        />
                    ) : (
                        <ConceptGroupView
                            concepts={filteredConcepts}
                            groupBy={groupBy}
                            selectedConcepts={selectedConcepts}
                            onToggleSelection={toggleConceptSelection}
                            onConceptDeleted={loadProjects}
                        />
                    )
                ) : (
                    <div className="text-center py-12 sm:py-16 px-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
                            {searchTerm || Object.values(filters).some(f => f !== 'all')
                                ? 'No concepts match your criteria'
                                : 'No app concepts yet'}
                        </h3>
                        <p className="text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                            {searchTerm || Object.values(filters).some(f => f !== 'all')
                                ? 'Try adjusting your search terms or filters'
                                : 'Start your first research project to generate innovative app ideas'}
                        </p>
                        <Link to={createPageUrl("NewResearch")}>
                            <Button className="gradient-button w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 font-semibold">
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Start Research Project
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Combine Concepts Modal */}
                {showCombineModal && (
                    <CombineConceptsModal
                        concepts={selectedConcepts}
                        onClose={() => setShowCombineModal(false)}
                        onCombined={() => {
                            setShowCombineModal(false);
                            setSelectedConcepts([]);
                            loadProjects();
                        }}
                    />
                )}
            </div>
        </div>
    );
}