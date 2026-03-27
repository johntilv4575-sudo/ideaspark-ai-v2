import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Lightbulb,
  Sparkles,
  Menu,
  LayoutDashboard,
  Plus,
  FileText,
  Info,
  TrendingUp, // Added TrendingUp icon
  HelpCircle, // Added HelpCircle icon
  Settings, // Added Settings icon
  Database // Added Database icon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger } from
"@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Added Button import
import { ResearchProject } from "@/entities/ResearchProject";
import { User } from "@/entities/User";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ activeProjects: 0, ideasGenerated: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const publicPages = ['Landing', 'About'];
  const isPublicPage = publicPages.includes(currentPageName);

  const menuItems = [
      { name: "Dashboard", icon: LayoutDashboard, path: createPageUrl("Dashboard"), description: "Overview & Projects" },
      { name: "New Research", icon: Plus, path: createPageUrl("NewResearch"), description: "Start Analysis" },
      { name: "App Concepts", icon: Lightbulb, path: createPageUrl("AppConcepts"), description: "Generated Ideas" },
      { name: "Market Trends", icon: TrendingUp, path: createPageUrl("MarketTrends"), description: "Industry Intelligence" },
      { name: "Prompt Creator", icon: Sparkles, path: createPageUrl("PromptCreator"), description: "Architect & Builder" },
      { name: "Suite Guide", icon: FileText, path: createPageUrl("SuiteGuide"), description: "Integration Guide" },
      { name: "About", icon: Info, path: createPageUrl("About"), description: "About Idea Spark" },
      { name: "Airtable", icon: Database, path: createPageUrl("AirtableSettings"), description: "Sync Configuration" }];


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await User.me();
        setUser(userData);

        // If on root path after successful login, navigate to Dashboard or Landing if applicable
        if (location.pathname === '/' || location.pathname === '') {
          // If user is logged in, navigate to Dashboard, otherwise let publicPage logic handle it
          navigate(createPageUrl("Dashboard"), { replace: true });
        }
      } catch (error) {
        setUser(null);

        // If authentication fails and it's not a public page, redirect to Landing
        if (!isPublicPage) {
          navigate(createPageUrl("Landing"), { replace: true });
        }

        // If on root path and authentication failed, ensure we're on Landing
        if (location.pathname === '/' || location.pathname === '') {
          navigate(createPageUrl("Landing"), { replace: true });
        }
      } finally {
        setAuthChecked(true);
        // setIsLoading(false); // This is now handled in the conditional publicPage block or in the stats fetch
      }
    };

    checkAuth();
  }, [currentPageName, isPublicPage, navigate, location.pathname]);

  useEffect(() => {
    // If not authenticated yet, or it's a public page, or user object hasn't been set,
    // we don't need to fetch stats. Just set loading to false.
    if (!authChecked || !user || isPublicPage) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const projects = await ResearchProject.list();
        const activeProjects = projects.filter((p) => p.status === 'draft' || p.status === 'analyzing').length;
        const ideasGenerated = projects.reduce((sum, p) => sum + (p.generated_concepts?.length || 0), 0);
        setStats({ activeProjects, ideasGenerated });
      } catch (error) {
        console.error("Failed to fetch sidebar stats:", error);
        setStats({ activeProjects: 0, ideasGenerated: 0 });
      }
      setIsLoading(false);
    };

    fetchStats();
  }, [location.pathname, user, isPublicPage, authChecked]); // Added authChecked to dependencies

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>);

  }

  if (isPublicPage) {
    return (
      <div className="min-h-screen">
        <Toaster theme="dark" position="bottom-right" />
        {children}
      </div>);

  }

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --sidebar-bg: #0F172A;
          --sidebar-surface: #1E293B;
          --sidebar-border: #334155;
          --sidebar-text-primary: #F8FAFC;
          --sidebar-text-secondary: #CBD5E1;
          --sidebar-text-muted: #94A3B8;
          --sidebar-accent: #3B82F6;
          --sidebar-accent-hover: #2563EB;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Toaster theme="dark" position="bottom-right" />
        <Sidebar className="border-r border-slate-800 bg-slate-950">
          <SidebarHeader className="border-b border-slate-800 p-6 bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">Idea Spark</h2>
                <p className="text-xs text-slate-400 font-medium">AI-Powered Discovery</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4 bg-slate-950">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 py-3 mb-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          className={`group transition-all duration-200 rounded-xl py-3.5 px-4 min-h-[68px] border ${
                          isActive ?
                          'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-500 shadow-lg shadow-blue-500/20' :
                          'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'}`
                          }>

                          <Link to={item.path} className="flex items-center gap-3 w-full">
                            <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`
                            } />
                            <div className="flex-1 min-w-0">
                              <span className={`font-semibold text-[15px] block mb-0.5 leading-tight ${
                              isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`
                              }>
                                {item.name}
                              </span>
                              <p className={`text-[11px] leading-tight ${
                              isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-400'}`
                              }>
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>);

                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 py-3 mb-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 space-y-3">
                  <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 border border-emerald-800/30 rounded-xl p-4 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <Plus className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-emerald-300 font-semibold text-sm">Active Projects</span>
                    </div>
                    {isLoading ?
                    <Skeleton className="h-8 w-12 bg-slate-800" /> :

                    <span className="text-white font-bold text-2xl">{stats.activeProjects}</span>
                    }
                  </div>

                  <div className="bg-gradient-to-br from-amber-900/30 to-amber-950/30 border border-amber-800/30 rounded-xl p-4 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="text-amber-300 font-semibold text-sm">Ideas Generated</span>
                    </div>
                    {isLoading ?
                    <Skeleton className="h-8 w-12 bg-slate-800" /> :

                    <span className="text-white font-bold text-2xl">{stats.ideasGenerated}</span>
                    }
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="bg-slate-900 p-5 flex flex-col gap-2 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
                <span className="text-white font-bold text-base">{user?.full_name?.charAt(0) || 'U'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate leading-tight">{user?.full_name || 'User'}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden hover:bg-slate-800 p-2 rounded-lg transition-colors duration-200">
                <Menu className="w-5 h-5 text-slate-300" />
              </SidebarTrigger>
              <h1 className="text-xl font-bold text-white md:hidden">Idea Spark</h1>
            </div>
            
            {/* Help Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white hover:bg-slate-800">

                  <HelpCircle className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
                <DropdownMenuItem
                  onClick={() => navigate(createPageUrl("Tutorial"))}
                  className="text-slate-300 hover:bg-slate-700 cursor-pointer">

                  <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                  App Tutorial
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(createPageUrl("ComfortSettings"))}
                  className="text-slate-300 hover:bg-slate-700 cursor-pointer">

                  <Settings className="w-4 h-4 mr-2 text-purple-400" />
                  Comfort Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(createPageUrl("About"))}
                  className="text-slate-300 hover:bg-slate-700 cursor-pointer">

                  <Info className="w-4 h-4 mr-2 text-slate-400" />
                  About Idea Spark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>);

}