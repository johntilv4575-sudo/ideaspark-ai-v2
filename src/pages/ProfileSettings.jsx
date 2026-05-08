import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Crown, BarChart3, FolderOpen, Lightbulb, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const TIER_LABELS = {
  free: { label: "Free", color: "bg-slate-600/20 text-slate-300" },
  pro: { label: "Pro", color: "bg-blue-600/20 text-blue-300" },
  suite_starter: { label: "Suite Starter", color: "bg-purple-600/20 text-purple-300" },
  suite_creator: { label: "Suite Creator", color: "bg-amber-600/20 text-amber-300" },
};

export default function ProfileSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const [projects, docs] = await Promise.all([
        base44.entities.ResearchProject.list(),
        base44.entities.VaultDocument.list(),
      ]);
      const concepts = projects.reduce((sum, p) => sum + (p.generated_concepts?.length || 0), 0);
      const completed = projects.filter(p => p.status === "completed").length;
      setStats({
        totalProjects: projects.length,
        completedProjects: completed,
        totalConcepts: concepts,
        totalDocuments: docs.length,
      });
      setLoading(false);
    };
    loadStats();
  }, []);

  const tier = user?.subscription_tier || "free";
  const tierInfo = TIER_LABELS[tier] || TIER_LABELS.free;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile & Settings</h1>
        </div>

        {/* User Info */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{user?.full_name?.charAt(0) || "U"}</span>
              </div>
              <div>
                <span className="block">{user?.full_name || "User"}</span>
                <span className="text-sm font-normal text-slate-400">{user?.email}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 text-sm">Current Plan:</span>
              <Badge className={`${tierInfo.color} border-0`}>{tierInfo.label}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Usage Overview
            </CardTitle>
            <CardDescription className="text-slate-400">Your activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 bg-slate-700 rounded-xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard icon={FolderOpen} label="Projects" value={stats.totalProjects} color="text-blue-400" />
                <StatCard icon={FolderOpen} label="Completed" value={stats.completedProjects} color="text-green-400" />
                <StatCard icon={Lightbulb} label="Concepts" value={stats.totalConcepts} color="text-amber-400" />
                <StatCard icon={FileText} label="Documents" value={stats.totalDocuments} color="text-purple-400" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Email</span>
              <span className="text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Role</span>
              <span className="text-white capitalize">{user?.role || "user"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Member Since</span>
              <span className="text-white">{user?.created_date ? new Date(user.created_date).toLocaleDateString() : "N/A"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-center">
      <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}