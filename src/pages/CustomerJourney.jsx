import React from "react";
import { Link } from "react-router-dom";
import { Route, ArrowRight, ShieldCheck } from "lucide-react";
import JourneyDiagram from "@/components/journey/JourneyDiagram";
import JourneyAudit from "@/components/journey/JourneyAudit";

export default function CustomerJourney() {
  return (
    <div className="min-h-screen app-background">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Route className="w-7 h-7 text-purple-400" />
            Customer journey
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            The full path a customer takes — from finding an idea, through research and concept
            selection, to validation, the architect and build blueprints. Below it is the audit of
            every connection: what it carries and where it now goes.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link
              to="/Validation"
              className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Open validation
            </Link>
            <Link
              to="/AppConcepts"
              className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
            >
              Start at concept selection
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <JourneyDiagram />
          <JourneyAudit />
        </div>
      </div>
    </div>
  );
}