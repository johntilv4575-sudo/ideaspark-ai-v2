import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Copy, Download, Building2, Hammer, Target, Shield, Zap,
  ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Sparkles
} from "lucide-react";

export default function ConceptExportCard({ concept, project, index }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('blueprint');

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const architectPrompt = buildArchitectPrompt(concept, project);
  const builderPrompt = buildBuilderPrompt(concept, project);

  const complexityColor = { low: 'bg-green-500/20 text-green-300', medium: 'bg-amber-500/20 text-amber-300', high: 'bg-red-500/20 text-red-300' };
  const potentialColor = { niche: 'bg-slate-500/20 text-slate-300', moderate: 'bg-blue-500/20 text-blue-300', large: 'bg-emerald-500/20 text-emerald-300' };

  return (
    <Card className="bg-slate-800/40 border-slate-700">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <button onClick={() => setExpanded(!expanded)} className="text-left flex-1">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <span className="text-amber-400 font-mono text-sm">#{index}</span>
              {concept.concept_name}
              {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
            </CardTitle>
            <p className="text-slate-400 text-sm mt-1">{concept.one_liner}</p>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className={complexityColor[concept.development_complexity] || 'bg-slate-500/20 text-slate-300'}>
            {concept.development_complexity || 'N/A'} complexity
          </Badge>
          <Badge className={potentialColor[concept.market_potential] || 'bg-slate-500/20 text-slate-300'}>
            {concept.market_potential || 'N/A'} market
          </Badge>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-900/50 border border-slate-700 p-1 mb-4">
              <TabsTrigger value="blueprint" className="data-[state=active]:bg-slate-700 text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 mr-1" /> Blueprint
              </TabsTrigger>
              <TabsTrigger value="architect" className="data-[state=active]:bg-purple-700 text-xs sm:text-sm">
                <Building2 className="w-3 h-3 mr-1" /> Architect
              </TabsTrigger>
              <TabsTrigger value="builder" className="data-[state=active]:bg-green-700 text-xs sm:text-sm">
                <Hammer className="w-3 h-3 mr-1" /> Builder
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blueprint" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoBlock icon={Target} title="Target User" color="text-blue-400" content={concept.target_user} />
                <InfoBlock icon={Shield} title="Competitive Advantage" color="text-purple-400" content={concept.competitive_advantage} />
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Core Solution</h4>
                <p className="text-slate-300 text-sm">{concept.core_solution}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <h4 className="text-white font-semibold mb-2">Key Features</h4>
                <ul className="space-y-1">
                  {(concept.key_features || []).map((f, i) => (
                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-green-500/20">
                  <h4 className="text-green-300 font-semibold mb-2 text-sm">MVP In Scope</h4>
                  <ul className="space-y-1">
                    {(concept.mvp_scope?.in_scope || []).map((s, i) => <li key={i} className="text-slate-300 text-xs">✓ {s}</li>)}
                  </ul>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-red-500/20">
                  <h4 className="text-red-300 font-semibold mb-2 text-sm">Out of Scope</h4>
                  <ul className="space-y-1">
                    {(concept.mvp_scope?.out_of_scope || []).map((s, i) => <li key={i} className="text-slate-300 text-xs">✗ {s}</li>)}
                  </ul>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-amber-500/20">
                <h4 className="text-amber-300 font-semibold mb-2 text-sm flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Risks</h4>
                <ul className="space-y-1">
                  {(concept.risks_assumptions || []).map((r, i) => <li key={i} className="text-slate-300 text-xs">⚠ {r}</li>)}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="architect">
              <PromptBlock title="Architect Prompt" prompt={architectPrompt} color="border-purple-500/30" onCopy={() => copyText(architectPrompt, 'Architect Prompt')} />
            </TabsContent>

            <TabsContent value="builder">
              <PromptBlock title="Builder Prompt" prompt={builderPrompt} color="border-green-500/30" onCopy={() => copyText(builderPrompt, 'Builder Prompt')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}

function InfoBlock({ icon: Icon, title, color, content }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
      <h4 className={`font-semibold mb-1 text-sm flex items-center gap-2 ${color}`}><Icon className="w-4 h-4" /> {title}</h4>
      <p className="text-slate-300 text-sm">{content}</p>
    </div>
  );
}

function PromptBlock({ title, prompt, color, onCopy }) {
  return (
    <div className={`bg-slate-900/50 rounded-lg p-4 border ${color}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-semibold">{title}</h4>
        <Button size="sm" onClick={onCopy} className="bg-slate-700 hover:bg-slate-600 text-white"><Copy className="w-3 h-3 mr-1" /> Copy</Button>
      </div>
      <pre className="text-slate-300 text-xs whitespace-pre-wrap font-mono max-h-96 overflow-y-auto bg-slate-950/50 rounded-lg p-4">{prompt}</pre>
    </div>
  );
}

function buildArchitectPrompt(concept, project) {
  return `You are an expert software architect. Design the complete system architecture for "${concept.concept_name}".

Project: ${concept.concept_name}
Industry: ${project.industry || 'General'}
One-liner: ${concept.one_liner}
Core Solution: ${concept.core_solution}
Target User: ${concept.target_user}

Key Features:
${(concept.key_features || []).map((f, i) => `${i + 1}. ${f}`).join('\n')}

Pain Points:
${(concept.target_pain_points || []).map(p => `• ${p}`).join('\n')}

MVP In Scope: ${(concept.mvp_scope?.in_scope || []).join(', ')}
MVP Out of Scope: ${(concept.mvp_scope?.out_of_scope || []).join(', ')}
Differentiation: ${concept.differentiation}

Tasks:
1. Define System Requirements
2. Design System Architecture
3. Create Data Models
4. Design API Endpoints
5. Plan Frontend Structure
6. Map User Journeys
7. Create Feature Priority Matrix
8. Build Risk Register`;
}

function buildBuilderPrompt(concept, project) {
  return `You are an expert developer. Build "${concept.concept_name}".

Stack: React + Tailwind CSS + Base44 Backend
Core Solution: ${concept.core_solution}
Target User: ${concept.target_user}

Features to Build:
${(concept.key_features || []).map((f, i) => `${i + 1}. ${f}`).join('\n')}

MVP Scope:
${(concept.mvp_scope?.in_scope || []).map(s => `✓ ${s}`).join('\n')}

Out of Scope:
${(concept.mvp_scope?.out_of_scope || []).map(s => `✗ ${s}`).join('\n')}

Rules:
- Follow architecture specs exactly
- One module at a time
- Clean, maintainable code
- Handle errors gracefully
- Output: file path + complete runnable code`;
}