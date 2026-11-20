import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, BookOpen, Search, X } from "lucide-react";
import { toast } from "sonner";
import BriefCard from "@/components/briefs/BriefCard";
import BriefDetail from "@/components/briefs/BriefDetail";
import BriefCompare from "@/components/briefs/BriefCompare";

export default function MarketBriefLibrary() {
  const navigate = useNavigate();
  const [briefs, setBriefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewing, setViewing] = useState(null);

  const load = async () => {
    setIsLoading(true);
    const page = await base44.entities.MarketBrief.list({ sort: "-researched_at", limit: 100 });
    setBriefs(page?.items || []);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return briefs;
    return briefs.filter(
      (b) =>
        b.industry_name?.toLowerCase().includes(term) ||
        b.summary?.top_players?.some((p) => p.toLowerCase().includes(term))
    );
  }, [briefs, search]);

  const selected = briefs.filter((b) => selectedIds.includes(b.id));

  const toggleSelect = (brief) => {
    setSelectedIds((prev) => {
      if (prev.includes(brief.id)) return prev.filter((id) => id !== brief.id);
      if (prev.length >= 3) {
        toast.error("Compare up to three briefs at a time");
        return prev;
      }
      return [...prev, brief.id];
    });
  };

  const handleDelete = async (brief) => {
    await base44.entities.MarketBrief.delete(brief.id);
    setSelectedIds((prev) => prev.filter((id) => id !== brief.id));
    setBriefs((prev) => prev.filter((b) => b.id !== brief.id));
    toast.success(`${brief.industry_name} brief deleted`);
  };

  return (
    <div className="min-h-screen app-background">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/Dashboard")}
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-400" />
                Market Brief Library
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Every saved industry brief, with the date it was researched. Revisit one any time, tick
                two or three to compare them, or start research from a brief.
              </p>
            </div>
          </div>
          <Button onClick={() => navigate("/MarketTrends")} className="gradient-button shrink-0">
            Research a new brief
          </Button>
        </div>

        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search industry or competitor..."
            className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-slate-400">
              {selected.length} selected for comparison
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-white h-7"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-56 w-full bg-slate-800/60" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-white font-medium">
              {briefs.length === 0 ? "No saved briefs yet" : "No briefs match that search"}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {briefs.length === 0
                ? "Research an industry on Market Trends and the brief lands here automatically."
                : "Try another industry or competitor name."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {visible.map((brief) => (
              <BriefCard
                key={brief.id}
                brief={brief}
                selected={selectedIds.includes(brief.id)}
                onToggleSelect={toggleSelect}
                onView={setViewing}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {selected.length >= 2 && (
          <div className="mt-6">
            <BriefCompare briefs={selected} />
          </div>
        )}
      </div>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-3xl bg-slate-950 border-slate-800 text-white max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{viewing?.industry_name} — market brief</DialogTitle>
          </DialogHeader>
          {viewing && <BriefDetail record={viewing} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}