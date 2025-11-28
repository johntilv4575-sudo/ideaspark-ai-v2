import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import ConceptGrid from './ConceptGrid';
import { Badge } from '@/components/ui/badge';

export default function ConceptGroupView({ 
    concepts, 
    groupBy, 
    selectedConcepts, 
    onToggleSelection, 
    onConceptDeleted 
}) {
    const [expandedGroups, setExpandedGroups] = useState({});

    // Group concepts based on the selected grouping method
    const groupedConcepts = () => {
        const groups = {};
        
        concepts.forEach(concept => {
            let groupKey;
            let groupLabel;
            
            switch(groupBy) {
                case 'project':
                    groupKey = concept.project_id;
                    groupLabel = concept.project_title;
                    break;
                case 'industry':
                    groupKey = concept.industry || 'other';
                    groupLabel = (concept.industry || 'other').replace('_', ' ').toUpperCase();
                    break;
                case 'complexity':
                    groupKey = concept.development_complexity || 'unknown';
                    groupLabel = `${(concept.development_complexity || 'unknown').toUpperCase()} Complexity`;
                    break;
                case 'potential':
                    groupKey = concept.market_potential || 'unknown';
                    groupLabel = `${(concept.market_potential || 'unknown').toUpperCase()} Market Potential`;
                    break;
                default:
                    groupKey = 'all';
                    groupLabel = 'All Concepts';
            }
            
            if (!groups[groupKey]) {
                groups[groupKey] = {
                    label: groupLabel,
                    concepts: []
                };
            }
            groups[groupKey].concepts.push(concept);
        });
        
        return groups;
    };

    const toggleGroup = (groupKey) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey]
        }));
    };

    const groups = groupedConcepts();
    const groupKeys = Object.keys(groups);

    // Auto-expand first group on mount
    React.useEffect(() => {
        if (groupKeys.length > 0 && Object.keys(expandedGroups).length === 0) {
            setExpandedGroups({ [groupKeys[0]]: true });
        }
    }, [groupKeys.length]);

    return (
        <div className="space-y-6">
            {groupKeys.map(groupKey => {
                const group = groups[groupKey];
                const isExpanded = expandedGroups[groupKey];
                
                return (
                    <div key={groupKey} className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/20">
                        {/* Group Header */}
                        <button
                            onClick={() => toggleGroup(groupKey)}
                            className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {isExpanded ? (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                )}
                                <Folder className="w-5 h-5 text-blue-400" />
                                <h3 className="text-white font-semibold text-lg capitalize">
                                    {group.label}
                                </h3>
                                <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                                    {group.concepts.length} {group.concepts.length === 1 ? 'concept' : 'concepts'}
                                </Badge>
                            </div>
                        </button>

                        {/* Group Content */}
                        {isExpanded && (
                            <div className="p-4 sm:p-6">
                                <ConceptGrid
                                    concepts={group.concepts}
                                    selectedConcepts={selectedConcepts}
                                    onToggleSelection={onToggleSelection}
                                    onConceptDeleted={onConceptDeleted}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}