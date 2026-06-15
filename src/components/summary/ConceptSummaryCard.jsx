import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb, Code, TrendingUp, Sparkles, Target, Users,
  ChevronDown, ChevronUp, ArrowRight, Globe, BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function ConceptSummaryCard({ concept, conceptIndex }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const marketTrends = concept.marketTrends;
  const hasMarketData = marketTrends && Object.keys(marketTrends).length > 0;

  return (
    <Card className="bg-slate-800/40 border-slate-700 hover:border-slate-600 transition-all duration-200">
      <CardContent className="p-4 sm:p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-semibold text-sm sm:text-base leading-tight truncate">{concept.concept_name}</h3>
              <p className="text-slate-400 text-xs mt-0.5 truncate">
                {concept.project_title} • <span className="capitalize">{concept.industry}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <Badge className={`${complexityColors[concept.development_complexity]} text-[10px] px-1.5`}>
              {concept.development_complexity}
            </Badge>
            <Badge className={`${potentialColors[concept.market_potential]} text-[10px] px-1.5`}>
              {concept.market_potential}
            </Badge>
          </div>
        </div>

        {/* Core Solution */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2">
          {concept.core_solution}
        </p>

        {/* Key Features (always visible, compact) */}
        <div className="mb-3">
          <h4 className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Features
          </h4>
          <div className="flex flex-wrap gap-1">
            {concept.key_features?.slice(0, expanded ? undefined : 4).map((f, i) => (
              <span key={i} className="inline-block bg-slate-700/60 text-slate-300 text-[11px] px-2 py-0.5 rounded-md">
                {f.length > 35 ? f.substring(0, 35) + '…' : f}
              </span>
            ))}
            {!expanded && concept.key_features?.length > 4 && (
              <span className="text-slate-500 text-[11px] px-1">+{concept.key_features.length - 4} more</span>
            )}
          </div>
        </div>

        {/* Market Trends Snapshot */}
        {hasMarketData && (
          <div className="mb-3 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
            <h4 className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
              <BarChart3 className="w-3 h-3" /> Market Snapshot
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {marketTrends.market_size?.current_size && (
                <div>
                  <p className="text-slate-500 text-[10px]">Market Size</p>
                  <p className="text-slate-200 font-medium">{marketTrends.market_size.current_size}</p>
                </div>
              )}
              {marketTrends.market_size?.cagr && (
                <div>
                  <p className="text-slate-500 text-[10px]">CAGR</p>
                  <p className="text-emerald-400 font-medium">{marketTrends.market_size.cagr}</p>
                </div>
              )}
              {marketTrends.competitive_landscape?.saturation_level && (
                <div>
                  <p className="text-slate-500 text-[10px]">Saturation</p>
                  <p className="text-slate-200 font-medium capitalize">{marketTrends.competitive_landscape.saturation_level}</p>
                </div>
              )}
              {marketTrends.market_size?.growth_level && (
                <div>
                  <p className="text-slate-500 text-[10px]">Growth</p>
                  <p className="text-slate-200 font-medium capitalize">{marketTrends.market_size.growth_level}</p>
                </div>
              )}
            </div>
            {expanded && marketTrends.technology_trends?.emerging_tech?.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-700/50">
                <p className="text-slate-500 text-[10px] mb-1">Emerging Tech</p>
                <div className="flex flex-wrap gap-1">
                  {marketTrends.technology_trends.emerging_tech.slice(0, 4).map((t, i) => (
                    <span key={i} className="bg-emerald-900/30 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expanded Details */}
        {expanded && (
          <div className="space-y-3 mb-3">
            {/* Target User & Pain Points */}
            {concept.target_user && (
              <div>
                <h4 className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                  <Users className="w-3 h-3" /> Target User
                </h4>
                <p className="text-slate-300 text-xs">{concept.target_user}</p>
              </div>
            )}
            {concept.target_pain_points?.length > 0 && (
              <div>
                <h4 className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                  <Target className="w-3 h-3" /> Pain Points
                </h4>
                <ul className="text-slate-300 text-xs space-y-0.5">
                  {concept.target_pain_points.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-slate-500 mt-0.5">•</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {concept.differentiation && (
              <div>
                <h4 className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mb-1">Differentiation</h4>
                <p className="text-slate-300 text-xs">{concept.differentiation}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white text-xs h-7 px-2"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
            {expanded ? "Less" : "More"}
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-3"
            onClick={() => navigate(`/ConceptDetails?project=${concept.project_id}&concept=${conceptIndex}`)}
          >
            Details <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}