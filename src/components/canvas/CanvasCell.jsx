import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, Sparkles } from "lucide-react";

export default function CanvasCell({ title, icon: Icon, value, onChange, onAiRequest, color = "blue" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  const handleSave = () => {
    onChange(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(value || "");
    setIsEditing(false);
  };

  const colorMap = {
    blue: "border-blue-500/30 bg-blue-950/20",
    purple: "border-purple-500/30 bg-purple-950/20",
    emerald: "border-emerald-500/30 bg-emerald-950/20",
    amber: "border-amber-500/30 bg-amber-950/20",
    rose: "border-rose-500/30 bg-rose-950/20",
    cyan: "border-cyan-500/30 bg-cyan-950/20",
    indigo: "border-indigo-500/30 bg-indigo-950/20",
    teal: "border-teal-500/30 bg-teal-950/20",
    orange: "border-orange-500/30 bg-orange-950/20",
  };

  const iconColorMap = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
    cyan: "text-cyan-400",
    indigo: "text-indigo-400",
    teal: "text-teal-400",
    orange: "text-orange-400",
  };

  return (
    <div className={`rounded-xl border p-4 flex flex-col h-full ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconColorMap[color]}`} />
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10"
            onClick={() => onAiRequest(title)}
            title="Get AI suggestion"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </Button>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700"
              onClick={() => { setDraft(value || ""); setIsEditing(true); }}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex-1 flex flex-col gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 bg-slate-900/60 border-slate-700 text-slate-200 text-sm resize-none min-h-[80px]"
            autoFocus
          />
          <div className="flex gap-1 justify-end">
            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="h-7 bg-blue-600 hover:bg-blue-700 text-white">
              <Check className="w-3.5 h-3.5 mr-1" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
          {value || <span className="text-slate-500 italic">Click edit to add content...</span>}
        </div>
      )}
    </div>
  );
}