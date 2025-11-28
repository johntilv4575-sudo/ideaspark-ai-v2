import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Lightbulb,
  Clock,
  CheckCircle,
  Sparkles
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, change, color, bgGradient }) => (
    <Card className={`${bgGradient} backdrop-blur-sm border border-slate-600/50 rounded-xl overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
        <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-xl ${color} shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                {change && (
                    <div className="bg-emerald-500/10 text-emerald-400 px-2 py-1 text-xs sm:text-sm font-semibold flex items-center gap-1 rounded-full border border-emerald-500/20">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        {change}
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
                <p className="text-slate-400 text-sm sm:text-base font-medium">{label}</p>
            </div>
        </CardContent>
    </Card>
);

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <StatCard
                icon={Clock}
                label="Active Research"
                value={stats.activeProjects}
                change="+23%"
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                bgGradient="bg-gradient-to-br from-slate-800/80 via-blue-900/30 to-slate-900/80"
            />

            <StatCard
                icon={CheckCircle}
                label="Completed"
                value={stats.completedProjects}
                change="+15%"
                color="bg-gradient-to-r from-emerald-500 to-emerald-600"
                bgGradient="bg-gradient-to-br from-slate-800/80 via-emerald-900/30 to-slate-900/80"
            />

            <StatCard
                icon={Lightbulb}
                label="App Concepts"
                value={stats.totalConcepts}
                change="+42%"
                color="bg-gradient-to-r from-amber-500 to-amber-600"
                bgGradient="bg-gradient-to-br from-slate-800/80 via-amber-900/30 to-slate-900/80"
            />

            <StatCard
                icon={Sparkles}
                label="Total Projects"
                value={stats.totalProjects}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
                bgGradient="bg-gradient-to-br from-slate-800/80 via-purple-900/30 to-slate-900/80"
            />
        </div>
    );
}