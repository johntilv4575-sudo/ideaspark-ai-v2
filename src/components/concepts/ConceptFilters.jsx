
import React from 'react';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

const INDUSTRIES = [
    { value: "all", label: "All Industries" },
    { value: "fintech", label: "FinTech" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "travel", label: "Travel" },
    { value: "fitness", label: "Fitness" },
    { value: "other", label: "Other" }
];

const COMPLEXITY_OPTIONS = [
    { value: "all", label: "Any Complexity" },
    { value: "low", label: "Low Complexity" },
    { value: "medium", label: "Medium Complexity" },
    { value: "high", label: "High Complexity" }
];

const POTENTIAL_OPTIONS = [
    { value: "all", label: "Any Market Size" },
    { value: "niche", label: "Niche Market" },
    { value: "moderate", label: "Moderate Market" },
    { value: "large", label: "Large Market" }
];

export default function ConceptFilters({ filters, onFilterChange }) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <Select 
                    value={filters.industry} 
                    onValueChange={(value) => onFilterChange({...filters, industry: value})}
                >
                    <SelectTrigger className="flex-1 sm:w-40 bg-slate-800/50 border-slate-600 text-slate-300 focus:border-blue-500 h-10 text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                        {INDUSTRIES.map((industry) => (
                            <SelectItem 
                                key={industry.value} 
                                value={industry.value}
                                className="text-slate-300 hover:bg-slate-700"
                            >
                                {industry.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Select 
                value={filters.complexity} 
                onValueChange={(value) => onFilterChange({...filters, complexity: value})}
            >
                <SelectTrigger className="w-full sm:w-44 bg-slate-800/50 border-slate-600 text-slate-300 focus:border-blue-500 h-10 text-sm">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                    {COMPLEXITY_OPTIONS.map((option) => (
                        <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="text-slate-300 hover:bg-slate-700"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select 
                value={filters.potential} 
                onValueChange={(value) => onFilterChange({...filters, potential: value})}
            >
                <SelectTrigger className="w-full sm:w-44 bg-slate-800/50 border-slate-600 text-slate-300 focus:border-blue-500 h-10 text-sm">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                    {POTENTIAL_OPTIONS.map((option) => (
                        <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="text-slate-300 hover:bg-slate-700"
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
