import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Code, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

function sanitizeFilename(name) {
  return (name || 'project').replace(/[^a-z0-9]/gi, '_');
}

function formatDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function generateBlueprintText(concept, industry) {
  return [
    `Concept: ${concept.concept_name || 'N/A'}`,
    `Industry: ${industry || 'general'}`,
    `Core Solution: ${concept.core_solution || 'N/A'}`,
    `Competitive Advantage: ${concept.competitive_advantage || 'N/A'}`,
    `Development Complexity: ${concept.development_complexity || 'medium'}`,
    `Market Potential: ${concept.market_potential || 'moderate'}`,
    '',
    'Target Pain Points:',
    ...(concept.target_pain_points || []).map((p, i) => `  ${i + 1}. ${p}`),
    '',
    'Key Features:',
    ...(concept.key_features || []).map((f, i) => `  ${i + 1}. ${f}`)
  ].join('\n');
}

function generateArchitectPrompt(concept, industry) {
  const name = concept.concept_name || 'App Concept';
  const painPoints = concept.target_pain_points || [];
  const features = concept.key_features || [];
  return [
    `MASTER PROMPT ARCHITECT - ${name}`,
    `Industry: ${industry || 'general'}`,
    '',
    'VALIDATED PAIN POINTS TO SOLVE:',
    ...(painPoints.length ? painPoints.map((p, i) => `  ${i + 1}. ${p}`) : ['  No specific pain points provided']),
    '',
    `CORE SOLUTION MANDATE:`,
    `  ${concept.core_solution || 'N/A'}`,
    '',
    `COMPETITIVE ADVANTAGE REQUIREMENTS:`,
    `  ${concept.competitive_advantage || 'N/A'}`,
    '',
    'FEATURE PRIORITIZATION:',
    ...(features.length ? features.map((f, i) => `  ${i + 1}. ${f}`) : ['  No specific features provided']),
    '',
    `Development Complexity: ${concept.development_complexity || 'medium'}`,
    `Market Potential: ${concept.market_potential || 'moderate'}`
  ].join('\n');
}

function generateBuilderPrompt(concept, industry) {
  const name = concept.concept_name || 'App Concept';
  const painPoints = concept.target_pain_points || [];
  const features = concept.key_features || [];
  return [
    `MASTER APP BUILDER - ${name}`,
    `Industry: ${industry || 'general'}`,
    '',
    'PAIN POINTS TO ELIMINATE:',
    ...(painPoints.length ? painPoints.map((p, i) => `  ${i + 1}. ${p}`) : ['  Pain points to be defined']),
    '',
    'CORE FEATURES TO BUILD:',
    ...(features.length ? features.map((f, i) => `  ${i + 1}. ${f}`) : ['  Features to be defined']),
    '',
    `COMPETITIVE EDGE: ${concept.competitive_advantage || 'N/A'}`,
    `Complexity: ${concept.development_complexity || 'medium'} | Market: ${concept.market_potential || 'moderate'}`
  ].join('\n');
}

// PDF helper: wraps long text and manages page breaks
function addWrappedText(doc, text, x, y, maxWidth, lineHeight, pageHeight, marginBottom) {
  const lines = doc.splitTextToSize(text, maxWidth);
  for (const line of lines) {
    if (y + lineHeight > pageHeight - marginBottom) {
      doc.addPage();
      y = 25;
    }
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

function addSectionHeading(doc, title, y, pageHeight) {
  if (y + 20 > pageHeight - 20) {
    doc.addPage();
    y = 25;
  }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(title, 15, y);
  y += 2;
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);
  y += 7;
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  return y;
}

export default function ProjectExportMenu({ project }) {
  const [isExporting, setIsExporting] = useState(false);

  const filename = `${sanitizeFilename(project.title)}_${formatDate()}`;
  const industry = project.industry || 'general';
  const pageH = 297;
  const marginB = 20;
  const contentW = 175;
  const lh = 5;

  const handlePDFExport = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      let y = 15;

      // Title page
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(project.title || 'Research Project', 15, y);
      y += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Industry: ${industry}  |  Generated: ${formatDate()}`, 15, y);
      y += 5;
      doc.text(`Status: ${project.status || 'N/A'}`, 15, y);
      y += 12;

      // 1. Market Research Summary
      y = addSectionHeading(doc, '1. MARKET RESEARCH SUMMARY', y, pageH);
      const summary = [
        `Project: ${project.title}`,
        `Industry: ${industry}`,
        `Description: ${project.description || 'N/A'}`,
        `Pain Points Identified: ${project.pain_points?.length || 0}`,
        `App Concepts Generated: ${project.generated_concepts?.length || 0}`,
        `User Personas Created: ${project.generated_personas?.length || 0}`,
        `Competitors Analyzed: ${project.competitor_insights?.length || 0}`,
      ].join('\n');
      y = addWrappedText(doc, summary, 15, y, contentW, lh, pageH, marginB);
      y += 6;

      // 2. Pain Points
      y = addSectionHeading(doc, '2. PAIN POINTS', y, pageH);
      if (project.pain_points?.length) {
        for (const pp of project.pain_points) {
          doc.setFont('helvetica', 'bold');
          y = addWrappedText(doc, `• ${pp.issue} (Severity: ${pp.severity || 'N/A'}, Frequency: ${pp.frequency || 'N/A'})`, 15, y, contentW, lh, pageH, marginB);
          doc.setFont('helvetica', 'normal');
          if (pp.source_examples?.length) {
            y = addWrappedText(doc, `  Examples: ${pp.source_examples.join('; ')}`, 18, y, contentW - 3, lh, pageH, marginB);
          }
          y += 2;
        }
      } else {
        y = addWrappedText(doc, 'No pain points recorded.', 15, y, contentW, lh, pageH, marginB);
      }
      y += 4;

      // 3. App Concepts
      y = addSectionHeading(doc, '3. APP CONCEPTS', y, pageH);
      if (project.generated_concepts?.length) {
        project.generated_concepts.forEach((c, idx) => {
          doc.setFont('helvetica', 'bold');
          y = addWrappedText(doc, `Concept ${idx + 1}: ${c.concept_name || 'Unnamed'}`, 15, y, contentW, lh, pageH, marginB);
          doc.setFont('helvetica', 'normal');
          y = addWrappedText(doc, `Core Solution: ${c.core_solution || 'N/A'}`, 18, y, contentW - 3, lh, pageH, marginB);
          y = addWrappedText(doc, `Competitive Advantage: ${c.competitive_advantage || 'N/A'}`, 18, y, contentW - 3, lh, pageH, marginB);
          y = addWrappedText(doc, `Complexity: ${c.development_complexity || 'N/A'} | Market Potential: ${c.market_potential || 'N/A'}`, 18, y, contentW - 3, lh, pageH, marginB);
          if (c.target_pain_points?.length) {
            y = addWrappedText(doc, `Pain Points: ${c.target_pain_points.join(', ')}`, 18, y, contentW - 3, lh, pageH, marginB);
          }
          if (c.key_features?.length) {
            y = addWrappedText(doc, `Key Features: ${c.key_features.join(', ')}`, 18, y, contentW - 3, lh, pageH, marginB);
          }
          y += 4;
        });
      } else {
        y = addWrappedText(doc, 'No app concepts generated.', 15, y, contentW, lh, pageH, marginB);
      }
      y += 2;

      // 4. User Personas
      y = addSectionHeading(doc, '4. USER PERSONAS', y, pageH);
      if (project.generated_personas?.length) {
        project.generated_personas.forEach((p, idx) => {
          doc.setFont('helvetica', 'bold');
          y = addWrappedText(doc, `Persona ${idx + 1}: ${p.name || 'Unnamed'}`, 15, y, contentW, lh, pageH, marginB);
          doc.setFont('helvetica', 'normal');
          const details = [
            p.age ? `Age: ${p.age}` : null,
            p.occupation ? `Occupation: ${p.occupation}` : null,
            p.location ? `Location: ${p.location}` : null,
            p.tech_savviness ? `Tech Savviness: ${p.tech_savviness}` : null,
          ].filter(Boolean).join(' | ');
          if (details) y = addWrappedText(doc, details, 18, y, contentW - 3, lh, pageH, marginB);
          if (p.background) y = addWrappedText(doc, `Background: ${p.background}`, 18, y, contentW - 3, lh, pageH, marginB);
          if (p.goals?.length) y = addWrappedText(doc, `Goals: ${p.goals.join(', ')}`, 18, y, contentW - 3, lh, pageH, marginB);
          if (p.frustrations?.length) y = addWrappedText(doc, `Frustrations: ${p.frustrations.join(', ')}`, 18, y, contentW - 3, lh, pageH, marginB);
          if (p.quote) y = addWrappedText(doc, `"${p.quote}"`, 18, y, contentW - 3, lh, pageH, marginB);
          y += 4;
        });
      } else {
        y = addWrappedText(doc, 'No user personas generated.', 15, y, contentW, lh, pageH, marginB);
      }
      y += 2;

      // 5. Competitor Insights
      y = addSectionHeading(doc, '5. COMPETITOR INSIGHTS', y, pageH);
      if (project.competitor_insights?.length) {
        project.competitor_insights.forEach((ci, idx) => {
          doc.setFont('helvetica', 'bold');
          y = addWrappedText(doc, `${idx + 1}. ${ci.app_name || 'Unnamed Competitor'}`, 15, y, contentW, lh, pageH, marginB);
          doc.setFont('helvetica', 'normal');
          if (ci.successful_features?.length) y = addWrappedText(doc, `Successful Features: ${ci.successful_features.join(', ')}`, 18, y, contentW - 3, lh, pageH, marginB);
          if (ci.user_praise?.length) y = addWrappedText(doc, `User Praise: ${ci.user_praise.join(', ')}`, 18, y, contentW - 3, lh, pageH, marginB);
          if (ci.improvement_opportunities?.length) y = addWrappedText(doc, `Improvement Opportunities: ${ci.improvement_opportunities.join(', ')}`, 18, y, contentW - 3, lh, pageH, marginB);
          y += 3;
        });
      } else {
        y = addWrappedText(doc, 'No competitor insights recorded.', 15, y, contentW, lh, pageH, marginB);
      }
      y += 4;

      // 6-8. For each concept: Blueprint, Architect Prompt, Builder Prompt
      if (project.generated_concepts?.length) {
        project.generated_concepts.forEach((c, idx) => {
          const label = c.concept_name || `Concept ${idx + 1}`;

          y = addSectionHeading(doc, `6.${idx + 1} BLUEPRINT — ${label}`, y, pageH);
          y = addWrappedText(doc, generateBlueprintText(c, industry), 15, y, contentW, lh, pageH, marginB);
          y += 6;

          y = addSectionHeading(doc, `7.${idx + 1} ARCHITECT PROMPT — ${label}`, y, pageH);
          y = addWrappedText(doc, generateArchitectPrompt(c, industry), 15, y, contentW, lh, pageH, marginB);
          y += 6;

          y = addSectionHeading(doc, `8.${idx + 1} BUILDER PROMPT — ${label}`, y, pageH);
          y = addWrappedText(doc, generateBuilderPrompt(c, industry), 15, y, contentW, lh, pageH, marginB);
          y += 8;
        });
      }

      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Generated by Idea Spark — Spiral Studios', 15, pageH - 10);

      doc.save(`${filename}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleJSONExport = () => {
    const concepts = (project.generated_concepts || []).map(c => ({
      ...c,
      blueprint: generateBlueprintText(c, industry),
      architect_prompt: generateArchitectPrompt(c, industry),
      builder_prompt: generateBuilderPrompt(c, industry),
    }));

    const exportData = {
      project: {
        title: project.title,
        industry: project.industry,
        description: project.description,
        status: project.status,
        created_date: project.created_date,
        research_parameters: project.research_parameters,
      },
      pain_points: project.pain_points || [],
      generated_concepts: concepts,
      generated_personas: project.generated_personas || [],
      competitor_insights: project.competitor_insights || [],
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON exported successfully!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 gap-2"
          disabled={isExporting}
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
        <DropdownMenuItem
          onClick={handlePDFExport}
          className="text-slate-300 hover:bg-slate-700 cursor-pointer gap-2"
        >
          <FileText className="w-4 h-4 text-red-400" />
          Download as PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleJSONExport}
          className="text-slate-300 hover:bg-slate-700 cursor-pointer gap-2"
        >
          <Code className="w-4 h-4 text-green-400" />
          Download as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}