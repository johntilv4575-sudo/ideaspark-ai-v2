import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
    Star, 
    Lightbulb, 
    Code, 
    TrendingUp,
    GripVertical,
    Rocket,
    Search as SearchIcon,
    PauseCircle,
    ArrowRight,
    ChevronDown,
    ChevronRight,
    FolderOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const CATEGORIES = [
    { id: 'exploring', label: 'Exploring', icon: SearchIcon, color: 'bg-blue-500', borderColor: 'border-blue-500/30' },
    { id: 'developing', label: 'Developing', icon: Rocket, color: 'bg-green-500', borderColor: 'border-green-500/30' },
    { id: 'on_hold', label: 'On Hold', icon: PauseCircle, color: 'bg-amber-500', borderColor: 'border-amber-500/30' }
];

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

// Storage key for priorities
const PRIORITIES_STORAGE_KEY = 'concept_priorities';
const COLLAPSED_INDUSTRIES_KEY = 'collapsed_industries';

export default function ConceptKanbanBoard({ concepts, onConceptDeleted }) {
    const navigate = useNavigate();
    const [priorities, setPriorities] = useState(() => {
        const saved = localStorage.getItem(PRIORITIES_STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    });
    const [collapsedIndustries, setCollapsedIndustries] = useState({});

    // Organize concepts into categories
    const [columns, setColumns] = useState({
        exploring: [],
        developing: [],
        on_hold: [],
        uncategorized: []
    });

    useEffect(() => {
        organizeConceptsIntoColumns();
    }, [concepts, priorities]);

    // Ensure any new industries default to collapsed
    useEffect(() => {
        const industries = [...new Set(concepts.map(c => c.industry || 'general'))];
        const newCollapsed = { ...collapsedIndustries };
        let hasNewIndustry = false;
        
        industries.forEach(industry => {
            if (!(industry in newCollapsed)) {
                newCollapsed[industry] = true; // Default to collapsed
                hasNewIndustry = true;
            }
        });
        
        if (hasNewIndustry) {
            setCollapsedIndustries(newCollapsed);
            localStorage.setItem(COLLAPSED_INDUSTRIES_KEY, JSON.stringify(newCollapsed));
        }
    }, [concepts]);

    const organizeConceptsIntoColumns = () => {
        const newColumns = {
            exploring: [],
            developing: [],
            on_hold: [],
            uncategorized: []
        };

        concepts.forEach(concept => {
            const conceptKey = getConceptKey(concept);
            const priority = priorities[conceptKey];
            
            if (priority?.category && newColumns[priority.category]) {
                newColumns[priority.category].push({
                    ...concept,
                    favorite: priority.favorite || false,
                    shortlisted: priority.shortlisted || false
                });
            } else {
                newColumns.uncategorized.push({
                    ...concept,
                    favorite: priority?.favorite || false,
                    shortlisted: priority?.shortlisted || false
                });
            }
        });

        // Sort each column by favorites first, then shortlisted
        Object.keys(newColumns).forEach(key => {
            newColumns[key].sort((a, b) => {
                if (a.favorite !== b.favorite) return b.favorite ? 1 : -1;
                if (a.shortlisted !== b.shortlisted) return b.shortlisted ? 1 : -1;
                return 0;
            });
        });

        setColumns(newColumns);
    };

    const getConceptKey = (concept) => {
        return `${concept.project_id}_${concept.concept_name}`;
    };

    const savePriorities = (newPriorities) => {
        setPriorities(newPriorities);
        localStorage.setItem(PRIORITIES_STORAGE_KEY, JSON.stringify(newPriorities));
    };

    const toggleIndustryCollapse = (industry) => {
        const newCollapsed = { ...collapsedIndustries, [industry]: !collapsedIndustries[industry] };
        setCollapsedIndustries(newCollapsed);
        localStorage.setItem(COLLAPSED_INDUSTRIES_KEY, JSON.stringify(newCollapsed));
    };

    // Group uncategorized concepts by industry
    const getConceptsByIndustry = (uncategorizedConcepts) => {
        const grouped = {};
        uncategorizedConcepts.forEach(concept => {
            const industry = concept.industry || 'general';
            if (!grouped[industry]) {
                grouped[industry] = [];
            }
            grouped[industry].push(concept);
        });
        // Sort industries alphabetically
        return Object.keys(grouped).sort().reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
        }, {});
    };

    const toggleFavorite = (concept) => {
        const key = getConceptKey(concept);
        const current = priorities[key] || {};
        const newPriorities = {
            ...priorities,
            [key]: { ...current, favorite: !current.favorite }
        };
        savePriorities(newPriorities);
        toast.success(current.favorite ? 'Removed from favorites' : 'Added to favorites');
    };

    const toggleShortlist = (concept) => {
        const key = getConceptKey(concept);
        const current = priorities[key] || {};
        const newPriorities = {
            ...priorities,
            [key]: { ...current, shortlisted: !current.shortlisted }
        };
        savePriorities(newPriorities);
        toast.success(current.shortlisted ? 'Removed from shortlist' : 'Added to shortlist');
    };

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Find the concept
        const concept = concepts.find(c => getConceptKey(c) === draggableId);
        if (!concept) return;

        const key = getConceptKey(concept);
        const current = priorities[key] || {};
        
        const newCategory = destination.droppableId === 'uncategorized' ? null : destination.droppableId;
        
        const newPriorities = {
            ...priorities,
            [key]: { ...current, category: newCategory }
        };
        savePriorities(newPriorities);

        const categoryLabel = CATEGORIES.find(c => c.id === newCategory)?.label || 'Uncategorized';
        toast.success(`Moved to ${categoryLabel}`);
    };

    const handleViewDetails = async (concept) => {
        const project = await base44.entities.ResearchProject.get(concept.project_id);
        if (project && project.generated_concepts) {
            const index = project.generated_concepts.findIndex(
                c => c.concept_name === concept.concept_name
            );
            navigate(`/ConceptDetails?project=${concept.project_id}&concept=${index >= 0 ? index : 0}`);
        }
    };

    const renderConceptCard = (concept, index) => {
        const conceptKey = getConceptKey(concept);
        
        return (
            <Draggable key={conceptKey} draggableId={conceptKey} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`mb-3 ${snapshot.isDragging ? 'opacity-90' : ''}`}
                    >
                        <Card className={`bg-slate-800/60 border-slate-700 hover:border-slate-600 transition-all ${
                            concept.favorite ? 'ring-2 ring-yellow-500/50' : ''
                        } ${concept.shortlisted ? 'border-l-4 border-l-purple-500' : ''}`}>
                            <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                    <div {...provided.dragHandleProps} className="mt-1 cursor-grab active:cursor-grabbing">
                                        <GripVertical className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="text-white font-medium text-sm leading-tight line-clamp-2">
                                                {concept.concept_name}
                                            </h4>
                                            <div className="flex gap-1 flex-shrink-0">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className={`h-6 w-6 ${concept.favorite ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-400'}`}
                                                    onClick={() => toggleFavorite(concept)}
                                                >
                                                    <Star className={`w-3.5 h-3.5 ${concept.favorite ? 'fill-current' : ''}`} />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className={`h-6 w-6 ${concept.shortlisted ? 'text-purple-400' : 'text-slate-500 hover:text-purple-400'}`}
                                                    onClick={() => toggleShortlist(concept)}
                                                >
                                                    <Lightbulb className={`w-3.5 h-3.5 ${concept.shortlisted ? 'fill-current' : ''}`} />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <p className="text-slate-400 text-xs line-clamp-2 mb-2">
                                            {concept.core_solution}
                                        </p>

                                        <div className="flex flex-wrap gap-1 mb-2">
                                            <Badge className={`${complexityColors[concept.development_complexity]} text-[10px] px-1.5 py-0`}>
                                                <Code className="w-2.5 h-2.5 mr-0.5" />
                                                {concept.development_complexity}
                                            </Badge>
                                            <Badge className={`${potentialColors[concept.market_potential]} text-[10px] px-1.5 py-0`}>
                                                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                                                {concept.market_potential}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 text-[10px] truncate max-w-[100px]">
                                                {concept.project_title}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-2"
                                                onClick={() => handleViewDetails(concept)}
                                            >
                                                View
                                                <ArrowRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </Draggable>
        );
    };

    const renderColumn = (columnId, columnConcepts) => {
        const category = CATEGORIES.find(c => c.id === columnId);
        const Icon = category?.icon || Lightbulb;
        const label = category?.label || 'Concepts';
        const borderColor = category?.borderColor || 'border-slate-500/30';

        return (
            <div className="flex-1 min-w-[280px] max-w-[350px]">
                <div className={`mb-3 flex items-center gap-2 pb-2 border-b ${borderColor}`}>
                    <Icon className={`w-4 h-4 ${category ? category.color.replace('bg-', 'text-') : 'text-slate-400'}`} />
                    <h3 className="text-white font-semibold text-sm">{label}</h3>
                    <Badge variant="outline" className="ml-auto text-xs border-slate-600 text-slate-400">
                        {columnConcepts.length}
                    </Badge>
                </div>
                <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[200px] p-2 rounded-lg transition-colors ${
                                snapshot.isDraggingOver ? 'bg-slate-700/30' : 'bg-slate-800/20'
                            }`}
                        >
                            {columnConcepts.map((concept, index) => renderConceptCard(concept, index))}
                            {provided.placeholder}
                            {columnConcepts.length === 0 && (
                                <div className="text-center py-8 text-slate-500 text-sm">
                                    Drag concepts here
                                </div>
                            )}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    };

    // Render the "Concepts" column with industry groupings
    const renderConceptsColumnWithIndustries = () => {
        const conceptsByIndustry = getConceptsByIndustry(columns.uncategorized);
        const industries = Object.keys(conceptsByIndustry);
        
        // Calculate global index for draggable items
        let globalIndex = 0;

        return (
            <div className="flex-1 min-w-[280px] max-w-[400px]">
                <div className="mb-3 flex items-center gap-2 pb-2 border-b border-slate-500/30">
                    <FolderOpen className="w-4 h-4 text-slate-400" />
                    <h3 className="text-white font-semibold text-sm">Concepts</h3>
                    <Badge variant="outline" className="ml-auto text-xs border-slate-600 text-slate-400">
                        {columns.uncategorized.length}
                    </Badge>
                </div>
                <Droppable droppableId="uncategorized">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[200px] p-2 rounded-lg transition-colors max-h-[70vh] overflow-y-auto ${
                                snapshot.isDraggingOver ? 'bg-slate-700/30' : 'bg-slate-800/20'
                            }`}
                        >
                            {industries.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 text-sm">
                                    Drag concepts here
                                </div>
                            ) : (
                                industries.map(industry => {
                                    const industryConcepts = conceptsByIndustry[industry];
                                    const isCollapsed = collapsedIndustries[industry] !== false; // Default to collapsed if undefined
                                    const startIndex = globalIndex;
                                    globalIndex += industryConcepts.length;

                                    return (
                                        <div key={industry} className="mb-3">
                                            <button
                                                onClick={() => toggleIndustryCollapse(industry)}
                                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 transition-colors mb-2"
                                            >
                                                {isCollapsed ? (
                                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                                )}
                                                <span className="text-slate-300 text-xs font-medium capitalize flex-1 text-left">
                                                    {industry.replace(/_/g, ' ')}
                                                </span>
                                                <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                                                    {industryConcepts.length}
                                                </Badge>
                                            </button>
                                            {!isCollapsed && (
                                                <div className="pl-2">
                                                    {industryConcepts.map((concept, idx) => 
                                                        renderConceptCard(concept, startIndex + idx)
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span>Favorite</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                        <span>Shortlisted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <GripVertical className="w-3.5 h-3.5" />
                        <span>Drag to reorder</span>
                    </div>
                </div>

                {/* Kanban Columns */}
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {renderConceptsColumnWithIndustries()}
                    {CATEGORIES.map(category => renderColumn(category.id, columns[category.id]))}
                </div>
            </div>
        </DragDropContext>
    );
}