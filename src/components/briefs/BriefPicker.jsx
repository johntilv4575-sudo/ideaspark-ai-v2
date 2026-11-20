import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, CalendarDays } from "lucide-react";
import { formatBriefDate, getBriefFreshness } from "@/lib/marketBriefs";

const NONE = "__none__";

export default function BriefPicker({ value, onChange }) {
  const [briefs, setBriefs] = useState([]);

  useEffect(() => {
    let active = true;
    base44.entities.MarketBrief.list({ sort: "-researched_at", limit: 50 }).then((page) => {
      if (active) setBriefs(page?.items || []);
    });
    return () => {
      active = false;
    };
  }, []);

  const freshness = value ? getBriefFreshness(value.researched_at) : null;

  return (
    <Card className="bg-slate-900/60 border-slate-800 mb-5">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-2">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            Use a saved market brief
          </label>
          <Link to="/MarketBriefLibrary" className="text-xs text-blue-400 hover:text-blue-300">
            Brief library
          </Link>
        </div>
        <Select
          value={value?.id || NONE}
          onValueChange={(id) => onChange(briefs.find((b) => b.id === id) || null)}
        >
          <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="No saved brief — research from scratch" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value={NONE} className="text-white">
              No saved brief — research from scratch
            </SelectItem>
            {briefs.map((brief) => (
              <SelectItem key={brief.id} value={brief.id} className="text-white">
                {brief.industry_name} · {formatBriefDate(brief.researched_at)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {value && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge className={`${freshness.tone} border text-[11px]`}>{freshness.label}</Badge>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              Researched {formatBriefDate(value.researched_at)} — included as context when concepts are
              generated, but it may have changed since.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}