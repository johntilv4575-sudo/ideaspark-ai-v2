import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "interview_notes", label: "Interview Notes" },
  { value: "survey_results", label: "Survey Results" },
  { value: "user_feedback", label: "User Feedback" },
  { value: "market_report", label: "Market Report" },
  { value: "competitor_analysis", label: "Competitor Analysis" },
  { value: "other", label: "Other" },
];

export default function DocumentUploadForm({ projects, onDocumentCreated }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("interview_notes");
  const [projectId, setProjectId] = useState("");
  const [rawText, setRawText] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a document title");
      return;
    }
    if (!rawText.trim() && !file) {
      toast.error("Please paste text or upload a file");
      return;
    }

    setUploading(true);

    let fileUrl = null;
    let textContent = rawText;

    if (file) {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      fileUrl = file_uri;

      if (!rawText.trim()) {
        // Get a temporary signed URL for extraction
        const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: fileUrl, expires_in: 600 });
        const extracted = await base44.integrations.Core.ExtractDataFromUploadedFile({
          file_url: signed_url,
          json_schema: {
            type: "object",
            properties: {
              text_content: { type: "string", description: "The full text content of the document" }
            }
          }
        });
        if (extracted?.output?.text_content) {
          textContent = extracted.output.text_content;
        }
      }
    }

    const doc = await base44.entities.VaultDocument.create({
      title: title.trim(),
      category,
      project_id: projectId || null,
      file_url: fileUrl,
      raw_text: textContent,
      status: "uploaded"
    });

    setTitle("");
    setCategory("interview_notes");
    setProjectId("");
    setRawText("");
    setFile(null);
    setUploading(false);
    toast.success("Document uploaded!");
    base44.analytics.track({ eventName: "document_uploaded", properties: { category } });
    onDocumentCreated(doc);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-400" />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., User Interview - Sarah M."
              className="bg-slate-900 border-slate-600 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Link to Project (optional)</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="No project linked" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project linked</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Upload File (PDF, TXT, CSV, etc.)</Label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center gap-2 p-3 bg-slate-900 border border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <FileText className="w-5 h-5 text-slate-400" />
                <span className="text-slate-400 text-sm">
                  {file ? file.name : "Choose a file..."}
                </span>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Or Paste Text Directly</Label>
            <Textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste interview notes, feedback, or any text here..."
              className="bg-slate-900 border-slate-600 text-white min-h-[120px]"
            />
          </div>

          <Button type="submit" disabled={uploading} className="gradient-button w-full">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}