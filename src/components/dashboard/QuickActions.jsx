import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    Plus, 
    Lightbulb, 
    TrendingUp, 
    FileText,
    Sparkles,
    Settings
} from "lucide-react";

export default function QuickActions() {
    const actions = [
        {
            icon: Plus,
            title: "New Research",
            description: "Start market analysis",
            path: createPageUrl("NewResearch"),
            color: "from-blue-600 to-blue-700"
        },
        {
            icon: Lightbulb,
            title: "View Concepts",
            description: "Browse generated ideas",
            path: createPageUrl("AppConcepts"),
            color: "from-purple-600 to-purple-700"
        },
        {
            icon: TrendingUp,
            title: "Market Trends",
            description: "Intelligence insights",
            path: createPageUrl("MarketTrends"),
            color: "from-green-600 to-green-700"
        },
        {
            icon: FileText,
            title: "Suite Guide",
            description: "Integration tools",
            path: createPageUrl("SuiteGuide"),
            color: "from-amber-600 to-amber-700"
        },
        {
            icon: Sparkles,
            title: "Tutorial",
            description: "Learn the app",
            path: createPageUrl("Tutorial"),
            color: "from-pink-600 to-pink-700"
        },
        {
            icon: Settings,
            title: "Comfort Settings",
            description: "Personalize experience",
            path: createPageUrl("ComfortSettings"),
            color: "from-indigo-600 to-indigo-700"
        }
    ];

    return (
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl">
            <CardHeader className="bg-slate-800 p-4 sm:p-6 flex flex-col space-y-1.5 border-b border-slate-700">
                <CardTitle className="text-white text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-800 p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-3">
                    {actions.map((action, index) => (
                        <Link key={index} to={action.path}>
                            <button className={`w-full bg-gradient-to-br ${action.color} hover:opacity-90 rounded-lg p-3 sm:p-4 text-left transition-all duration-200 transform md:hover:scale-105 shadow-lg overflow-hidden`}>
                                <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white mb-2" />
                                <div className="text-white font-semibold text-xs sm:text-sm mb-0.5 break-words">{action.title}</div>
                                <div className="text-white/80 text-[10px] sm:text-xs break-words">{action.description}</div>
                            </button>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}