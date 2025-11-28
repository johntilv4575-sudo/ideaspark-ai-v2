import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Copy,
  Wand2,
  Building2,
  Hammer,
  Zap,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileText,
  ChevronDown,
  ChevronUp } from
"lucide-react";

const ARCHITECT_PROMPT = `You are an expert software architect. Your role is to:

1. **Define System Requirements**
   - Gather and clarify business goals
   - Identify target users and their pain points
   - Define functional and non-functional requirements

2. **Design System Architecture**
   - Create high-level system overview
   - Define data models and database schema
   - Design API endpoints and contracts
   - Plan frontend structure and component hierarchy

3. **Map User Journeys**
   - Define primary user flows
   - Identify edge cases and error states
   - Connect features to pain points they solve

4. **Plan Implementation Phases**
   - MVP: Core features only
   - Growth: Enhanced features and optimizations
   - Scale: Performance, security, and expansion

5. **Identify Risks & Constraints**
   - Technical risks and mitigations
   - Dependencies and integrations
   - Security and compliance considerations

**Output Format:**
- System Overview (1 paragraph)
- Data Models (with fields and relationships)
- API Design (endpoints, methods, payloads)
- Frontend Structure (pages, components, state)
- Feature Priority Matrix (MVP/Growth/Scale)
- Risk Register (risk, impact, mitigation)

Always ask clarifying questions before finalizing the architecture.`;

const BUILDER_PROMPT = `You are an expert software developer. Your role is to implement code based on architectural decisions.

**Your Responsibilities:**

1. **Project Setup**
   - Initialize project structure
   - Configure build tools and dependencies
   - Set up development environment

2. **Implementation Standards**
   - Follow the provided architecture exactly
   - Use consistent naming conventions
   - Write clean, maintainable code
   - Include inline documentation

3. **Code Generation**
   - Backend: Models, routes, controllers, services
   - Frontend: Components, hooks, state management
   - Tests: Unit tests for critical paths
   - Configs: Environment, deployment, CI/CD

4. **Quality Checks**
   - Validate against architecture specs
   - Ensure type safety where applicable
   - Handle errors gracefully
   - Follow security best practices

**Rules:**
- Only implement what is defined in the architecture
- Do not invent new entities or endpoints
- Ask for clarification if specs are ambiguous
- Keep scope focused to one feature/module at a time

**Output Format:**
- File path and name
- Complete, runnable code
- Brief explanation of implementation choices
- Any assumptions made`;

const QUICK_BUILD_PROMPT = `You are a rapid prototyping assistant. Build a functional MVP quickly.

**Project:** [PROJECT_NAME]
**Core Feature:** [MAIN_FEATURE]
**Stack:** React + Tailwind + Base44 Backend

**Instructions:**
1. Create the minimum viable implementation
2. Focus on core user flow only
3. Use simple, clean code patterns
4. Skip edge cases for now (mark with TODOs)
5. Prioritize working over perfect

**Generate:**
- Main page component
- Essential sub-components
- Data entity schema
- Basic CRUD operations

Keep it simple. Ship fast. Iterate later.`;

export default function PromptCreator() {
  const [activeTab, setActiveTab] = useState('readme');
  const [projectName, setProjectName] = useState('');
  const [mainFeature, setMainFeature] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [showFullReadme, setShowFullReadme] = useState(false);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const generateCustomPrompt = (basePrompt, type) => {
    let customized = basePrompt;

    if (projectName) {
      customized = `**Project:** ${projectName}\n\n${customized}`;
    }
    if (mainFeature) {
      customized = customized.replace('[MAIN_FEATURE]', mainFeature);
      customized = `**Focus Area:** ${mainFeature}\n\n${customized}`;
    }
    if (customContext) {
      customized = `**Additional Context:**\n${customContext}\n\n${customized}`;
    }

    customized = customized.replace('[PROJECT_NAME]', projectName || 'My Project');
    customized = customized.replace('[MAIN_FEATURE]', mainFeature || 'Core Feature');

    return customized;
  };

  const PromptCard = ({ title, icon: Icon, prompt, color, description }) =>
  <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
            <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-3 text-lg">
                    <div className={`p-2 rounded-lg ${color}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    {title}
                </CardTitle>
                <p className="text-slate-400 text-sm mt-2">{description}</p>
            </CardHeader>
            <CardContent>
                <div className="bg-slate-900/50 rounded-lg p-4 max-h-64 overflow-y-auto mb-4">
                    <pre className="text-slate-300 text-xs whitespace-pre-wrap font-mono">
                        {prompt.substring(0, 500)}...
                    </pre>
                </div>
                <div className="flex gap-2">
                    <Button
          onClick={() => copyToClipboard(prompt, title)}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white">

                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                    </Button>
                    <Button
          onClick={() => copyToClipboard(generateCustomPrompt(prompt, title), `Customized ${title}`)}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
          disabled={!projectName && !mainFeature && !customContext}>

                        <Wand2 className="w-4 h-4 mr-2" />
                        Copy with Context
                    </Button>
                </div>
            </CardContent>
        </Card>;


  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0B1426 0%, #1A2332 100%)' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                            <Wand2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Prompt Creator</h1>
                            <p className="text-slate-400 text-sm">Architect & Builder prompts for structured development</p>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-slate-800/50 border border-slate-700 p-1">
                        <TabsTrigger value="readme" className="data-[state=active]:bg-slate-700">
                            <BookOpen className="w-4 h-4 mr-2" />
                            README Guide
                        </TabsTrigger>
                        <TabsTrigger value="prompts" className="data-[state=active]:bg-slate-700">
                            <FileText className="w-4 h-4 mr-2" />
                            Prompts
                        </TabsTrigger>
                        <TabsTrigger value="quick" className="data-[state=active]:bg-slate-700">
                            <Zap className="w-4 h-4 mr-2" />
                            Quick Build
                        </TabsTrigger>
                    </TabsList>

                    {/* README Tab */}
                    <TabsContent value="readme" className="space-y-6">
                        <Card className="bg-slate-800/30 border-slate-700">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white flex items-center gap-3">
                                        <BookOpen className="w-5 h-5 text-blue-400" />
                                        How To Best Use the Architect & Builder Prompts Together
                                    </CardTitle>
                                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(README_CONTENT, 'README Guide')} className="bg-slate-500 text-slate-300 px-3 text-xs font-medium rounded-md inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border shadow-sm hover:text-accent-foreground h-8 border-slate-600 hover:bg-slate-700">


                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Full Guide
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="prose prose-invert max-w-none">
                                <div className="space-y-6 text-slate-300">
                                    {/* Section 1 */}
                                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">1</Badge>
                                            Purpose of Each Prompt
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/30">
                                                <h4 className="font-semibold text-purple-300 flex items-center gap-2 mb-2">
                                                    <Building2 className="w-4 h-4" /> Architect Prompt
                                                </h4>
                                                <p className="text-sm text-slate-400 mb-2">Defines <strong className="text-white">what</strong> you are building and <strong className="text-white">why</strong>.</p>
                                                <ul className="text-sm text-slate-400 space-y-1">
                                                    <li>• Requirements & system design</li>
                                                    <li>• Data models & APIs</li>
                                                    <li>• User journeys & feature priority</li>
                                                    <li>• Output = Architecture & plan</li>
                                                </ul>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-4 border border-green-500/30">
                                                <h4 className="font-semibold text-green-300 flex items-center gap-2 mb-2">
                                                    <Hammer className="w-4 h-4" /> Builder Prompt
                                                </h4>
                                                <p className="text-sm text-slate-400 mb-2">Decides <strong className="text-white">how</strong> to implement the plan in code.</p>
                                                <ul className="text-sm text-slate-400 space-y-1">
                                                    <li>• Project setup & folders</li>
                                                    <li>• Components & endpoints</li>
                                                    <li>• Tests & CI/CD</li>
                                                    <li>• Output = Code & configs</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                            <p className="text-amber-300 text-sm font-medium">
                                                ⚡ Core Rule: The Architect prompt is the source of truth. The Builder implements only what the Architect has defined.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Section 2 */}
                                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">2</Badge>
                                            When to Use Each Prompt
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-purple-300 mb-2">Use Architect When:</h4>
                                                <ul className="text-sm text-slate-400 space-y-1">
                                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Define or refine the overall system</li>
                                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Decide on features, data models, APIs</li>
                                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Map user journeys</li>
                                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Plan phases: MVP → Growth → Scale</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-300 mb-2">Use Builder When:</h4>
                                                <ul className="text-sm text-slate-400 space-y-1">
                                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400" /> Set up projects (frontend/backend)</li>
                                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400" /> Generate or refactor code</li>
                                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400" /> Create tests, scripts, pipelines</li>
                                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-400" /> Implement architectural decisions</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3 - Workflow */}
                                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">3</Badge>
                                            Standard Workflow (End-to-End)
                                        </h3>
                                        <div className="space-y-4">
                                            {[
                      { step: 1, title: 'Run the Architect Prompt', desc: 'Start a new AI chat, paste and run the Architect Prompt. Generate system overview, data models, API design, frontend structure.' },
                      { step: 2, title: 'Extract "Build Briefs"', desc: 'For each feature/module, ask the Architect for a short build brief (goal, data models, endpoints, components, user flows).' },
                      { step: 3, title: 'Start a Fresh Builder Session', desc: 'Open a new AI chat. Paste and run the Builder Prompt so the model knows the stack and coding style.' },
                      { step: 4, title: 'Feed Architect → Builder', desc: 'Provide the Build Brief for each feature. Let Builder generate backend, frontend, and tests. Repeat per feature.' },
                      { step: 5, title: 'Review for Alignment', desc: 'Compare generated code against original Architect design. Fix any inconsistencies in naming, endpoints, or scope.' },
                      { step: 6, title: 'Integrate & Update Docs', desc: 'Copy code into project, run tests, update Architecture doc if implementation revealed improvements.' }].
                      map((item, i) =>
                      <div key={i} className="flex items-start gap-4 p-3 bg-slate-800/50 rounded-lg">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-sm">
                                                        {item.step}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-white">{item.title}</h4>
                                                        <p className="text-sm text-slate-400">{item.desc}</p>
                                                    </div>
                                                </div>
                      )}
                                        </div>
                                    </div>

                                    {/* Expandable sections */}
                                    <Button
                    variant="ghost"
                    className="w-full text-slate-400 hover:text-white"
                    onClick={() => setShowFullReadme(!showFullReadme)}>

                                        {showFullReadme ?
                    <>
                                                <ChevronUp className="w-4 h-4 mr-2" />
                                                Show Less
                                            </> :

                    <>
                                                <ChevronDown className="w-4 h-4 mr-2" />
                                                Show Safe Use Patterns & Quick Summary
                                            </>
                    }
                                    </Button>

                                    {showFullReadme &&
                  <>
                                            {/* Section 4 - Safe Use Patterns */}
                                            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">4</Badge>
                                                    Safe Use Patterns
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                                        <h4 className="font-semibold text-red-300 mb-2">❌ Do NOT merge prompts</h4>
                                                        <p className="text-sm text-slate-400">Avoid putting both prompts into the same chat. This leads to ignored decisions, inconsistent naming, and "freestyle" code.</p>
                                                    </div>
                                                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                                        <h4 className="font-semibold text-green-300 mb-2">✓ Keep Scope Small & Explicit</h4>
                                                        <p className="text-sm text-slate-400">Implement one feature at a time. Always mention "Only this module" and "Follow the Build Brief exactly".</p>
                                                    </div>
                                                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                                        <h4 className="font-semibold text-purple-300 mb-2">👑 Architect is Boss, Builder is Muscle</h4>
                                                        <p className="text-sm text-slate-400">If there's a conflict, the Architect's models, endpoints, and flows win. Update architecture first, then instruct Builder.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 5 - Quick Summary */}
                                            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/30">
                                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                                    Quick Summary
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <h4 className="font-semibold text-purple-300 mb-2">Architect Prompt:</h4>
                                                        <ul className="text-sm text-slate-300 space-y-1">
                                                            <li>• Define system, features, data, APIs</li>
                                                            <li>• Produce Build Briefs for each module</li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-green-300 mb-2">Builder Prompt:</h4>
                                                        <ul className="text-sm text-slate-300 space-y-1">
                                                            <li>• Turn Build Briefs into real code</li>
                                                            <li>• Generate tests, configs, CI/CD</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-slate-900/50 rounded-lg">
                                                    <p className="text-white font-medium text-center">
                                                        Rhythm: Architect → Build Brief → Builder → Code → Review → Integrate
                                                    </p>
                                                    <p className="text-slate-400 text-sm text-center mt-1">(Repeat per feature)</p>
                                                </div>
                                            </div>
                                        </>
                  }
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Prompts Tab */}
                    <TabsContent value="prompts" className="space-y-6">
                        {/* Context Customization */}
                        <Card className="bg-slate-800/30 border-slate-700">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                    <Wand2 className="w-5 h-5 text-purple-400" />
                                    Customize Your Prompts (Optional)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-slate-400 text-sm mb-1 block">Project Name</label>
                                        <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g., TaskFlow Pro"
                      className="bg-slate-900/50 border-slate-600 text-white" />

                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-1 block">Main Feature/Focus</label>
                                        <Input
                      value={mainFeature}
                      onChange={(e) => setMainFeature(e.target.value)}
                      placeholder="e.g., Real-time collaboration"
                      className="bg-slate-900/50 border-slate-600 text-white" />

                                    </div>
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-1 block">Additional Context</label>
                                    <Textarea
                    value={customContext}
                    onChange={(e) => setCustomContext(e.target.value)}
                    placeholder="Any specific requirements, constraints, or context..."
                    className="bg-slate-900/50 border-slate-600 text-white min-h-[80px]" />

                                </div>
                            </CardContent>
                        </Card>

                        {/* Prompt Cards */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <PromptCard
                title="Architect Prompt"
                icon={Building2}
                prompt={ARCHITECT_PROMPT}
                color="bg-purple-500/20 text-purple-300"
                description="Use to define system architecture, data models, APIs, and feature planning." />

                            <PromptCard
                title="Builder Prompt"
                icon={Hammer}
                prompt={BUILDER_PROMPT}
                color="bg-green-500/20 text-green-300"
                description="Use to generate implementation code based on architectural decisions." />

                        </div>
                    </TabsContent>

                    {/* Quick Build Tab */}
                    <TabsContent value="quick" className="space-y-6">
                        <Card className="bg-slate-800/30 border-slate-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-amber-500/20">
                                        <Zap className="w-5 h-5 text-amber-300" />
                                    </div>
                                    Quick Build Prompt
                                </CardTitle>
                                <p className="text-slate-400 text-sm mt-2">
                                    For rapid prototyping when you need something working fast. Skips detailed architecture for speed.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-slate-400 text-sm mb-1 block">Project Name *</label>
                                        <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g., QuickNotes App"
                      className="bg-slate-900/50 border-slate-600 text-white" />

                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-sm mb-1 block">Core Feature *</label>
                                        <Input
                      value={mainFeature}
                      onChange={(e) => setMainFeature(e.target.value)}
                      placeholder="e.g., Quick note-taking with tags"
                      className="bg-slate-900/50 border-slate-600 text-white" />

                                    </div>
                                </div>

                                <div className="bg-slate-900/50 rounded-lg p-4">
                                    <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono">
                                        {generateCustomPrompt(QUICK_BUILD_PROMPT, 'Quick Build')}
                                    </pre>
                                </div>

                                <Button
                  onClick={() => copyToClipboard(generateCustomPrompt(QUICK_BUILD_PROMPT, 'Quick Build'), 'Quick Build Prompt')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  disabled={!projectName || !mainFeature}>

                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Quick Build Prompt
                                </Button>

                                {(!projectName || !mainFeature) &&
                <p className="text-amber-400 text-sm text-center">
                                        Fill in both Project Name and Core Feature to generate your prompt
                                    </p>
                }
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>);

}

const README_CONTENT = `# How To Best Use the Architect & Builder Prompts Together

A simple workflow guide

## 1. Purpose of Each Prompt

### Architect Prompt
- Defines **what** you are building and **why**.
- Focuses on: requirements, system design, data models, APIs, user journeys, feature priority, risks.
- Output = Architecture & plan.

### Builder Prompt
- Decides **how** to implement the plan in code.
- Focuses on: project setup, folders, components, endpoints, tests, CI/CD, deployment details.
- Output = Code, configs, and implementation snippets.

**Core rule:**
The Architect prompt is the source of truth.
The Builder prompt implements only what the Architect has defined, unless explicitly told to extend it.

## 2. When to Use Each Prompt

### Use the Architect Prompt when you need to:
- Define or refine the overall system.
- Decide on features, data models, and APIs.
- Map user journeys and how they solve pain points.
- Plan phases: MVP → Growth → Scale.

### Use the Builder Prompt when you need to:
- Set up projects (frontend/backend).
- Generate or refactor code for a specific feature/module.
- Create tests, scripts, and deployment pipelines.
- Implement changes that already have an architectural decision.

## 3. Standard Workflow (End-to-End)

### Step 1 – Run the Architect Prompt
Start a new AI chat. Paste and run the Architect Prompt. Let it generate:
- System overview
- Data models/database schema
- API design
- Frontend structure
- Feature list and phases

This becomes your Architecture Document.

### Step 2 – Extract "Build Briefs" from the Architect Output
Rather than building everything at once, break it down. For each feature or module, ask the Architect for a short build brief.

### Step 3 – Start a Fresh Builder Session
Open a new AI chat. Paste and run the Builder Prompt so the model knows the stack and coding style.

### Step 4 – Feed Architect → Builder (Per Feature)
For each feature/module you want to implement, provide the Build Brief and let the Builder generate code.

### Step 5 – Review for Alignment with the Architecture
Compare what was generated against the original Architect design.

### Step 6 – Integrate, Commit, and Update Docs
Copy the Builder's code into the project, run tests, and update documentation.

## 4. Safe Use Patterns

### A. Do not merge prompts
Avoid putting both prompts into the same chat.

### B. Keep Scope Small and Explicit
Implement one feature/module at a time.

### C. Architect is Boss, Builder is Muscle
If there is a conflict, the Architect's models, endpoints, and flows win.

### D. Feedback Loop (Optional but Powerful)
Copy key pieces of generated code back into the Architect chat to update the architecture.

## 5. Quick Summary

**Rhythm:**
Architect → Build Brief → Builder → Code → Review → Integrate
(Repeat per feature)
`;