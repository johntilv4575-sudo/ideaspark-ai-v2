import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, CalendarDays, Eye, Trash2, TrendingUp, Users } from "lucide-react";
import { formatBriefDate, getBriefFreshness } from "@/lib/marketBriefs";

export default function BriefCard({ brief, selected, onToggleSelect, onView, onDelete }) {
  const navigate = useNavigate();
  const freshness = getBriefFreshness(brief.researched_at);
  const s = brief.summary || {};

  return (
    <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-colors">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelect(brief)}
              className="mt-1 border-slate-600"
              aria-label={`Compare ${brief.industry_name}`}
            />
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-base leading-tight break-words">
                {brief.industry_name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                {formatBriefDate(brief.researched_at)}
              </p>
            </div>
          </div>
          <Badge className={`${freshness.tone} border text-[11px] shrink-0`}>{freshness.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          <div className="rounded-lg bg-slate-800/50 px-2.5 py-2">
            <p className="text-slate-500">Market size</p>
            <p className="text-slate-200 font-medium truncate">{s.current_size || "—"}</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 px-2.5 py-2">
            <p className="text-slate-500">CAGR</p>
            <p className="text-slate-200 font-medium truncate">{s.cagr || "—"}</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 px-2.5 py-2">
            <p className="text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Growth
            </p>
            <p className="text-slate-200 font-medium truncate">{s.growth_level || "—"}</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 px-2.5 py-2">
            <p className="text-slate-500 flex items-center gap-1">
              <Users className="w-3 h-3" /> Competition
            </p>
            <p className="text-slate-200 font-medium truncate">{s.saturation_level || "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(brief)}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            View brief
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(`/NewResearch?brief=${brief.id}`)}
            className="gradient-button"
          >
            Start research
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(brief)}
            className="ml-auto text-slate-500 hover:text-red-400 hover:bg-red-950/30"
            aria-label={`Delete ${brief.industry_name} brief`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}