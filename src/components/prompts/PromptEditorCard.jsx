import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Pencil, RotateCcw, Check, X } from "lucide-react";
import { composePrompt } from "@/lib/promptBuilder";

export default function PromptEditorCard({
  title,
  icon: Icon,
  color,
  description,
  body,
  defaultBody,
  context,
  onSave,
  onCopy,
  onExport,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(body);
  const composed = composePrompt(body, context);
  const isCustom = body !== defaultBody;

  const startEditing = () => {
    setDraft(body);
    setIsEditing(true);
  };

  const restoreDefault = () => {
    setDraft(defaultBody);
    onSave(defaultBody);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-white flex items-center gap-3 text-lg">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            {title}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={startEditing}
            disabled={isEditing}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 shrink-0"
          >
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
        </div>
        <p className="text-slate-400 text-sm mt-2">{description}</p>
        {isCustom && !isEditing && (
          <p className="text-emerald-400 text-xs mt-1">
            Edited — your wording is what gets copied and exported.
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="bg-slate-900/70 border-slate-600 text-slate-200 font-mono text-xs min-h-[340px]"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                onClick={() => {
                  onSave(draft);
                  setIsEditing(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="ghost"
                onClick={restoreDefault}
                className="text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore Default Text
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-slate-900/50 rounded-lg p-4 max-h-64 overflow-y-auto mb-4">
              <pre className="text-slate-300 text-xs whitespace-pre-wrap font-mono">
                {composed.substring(0, 500)}…
              </pre>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onCopy(composed, title)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Prompt
              </Button>
              <Button
                onClick={() => onExport(title, composed)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 px-3"
                title="Export as a .md file"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}