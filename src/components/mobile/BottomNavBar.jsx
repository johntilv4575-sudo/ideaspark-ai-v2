import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Lightbulb, TrendingUp, Archive } from "lucide-react";
import { createPageUrl } from "@/utils";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: createPageUrl("Dashboard") },
  { name: "Concepts", icon: Lightbulb, path: createPageUrl("AppConcepts") },
  { name: "Trends", icon: TrendingUp, path: createPageUrl("MarketTrends") },
  { name: "Vault", icon: Archive, path: createPageUrl("ResearchVault") },
];

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full select-none transition-colors ${
                isActive
                  ? "text-blue-400"
                  : "text-slate-500 active:text-slate-300"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}