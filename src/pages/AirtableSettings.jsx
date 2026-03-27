import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Save, TestTube2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { syncToAirtable } from "@/functions/syncToAirtable";

const STORAGE_KEY = "airtable_config";

const DEFAULT_TABLES = {
  researchProjects: "Research Projects",
  painPoints: "Pain Points",
  appConcepts: "App Concepts",
  userPersonas: "User Personas",
  competitorInsights: "Competitor Insights",
  prompts: "Prompts"
};

const TABLE_FIELDS = [
  { key: "researchProjects", label: "Research Projects Table", placeholder: "Research Projects" },
  { key: "painPoints", label: "Pain Points Table", placeholder: "Pain Points" },
  { key: "appConcepts", label: "App Concepts Table", placeholder: "App Concepts" },
  { key: "userPersonas", label: "User Personas Table", placeholder: "User Personas" },
  { key: "competitorInsights", label: "Competitor Insights Table", placeholder: "Competitor Insights" },
  { key: "prompts", label: "Prompts Table", placeholder: "Prompts" },
];

export default function AirtableSettings() {
  const [baseId, setBaseId] = useState("appjIfzwTFFBzRlLB");
  const [tables, setTables] = useState({ ...DEFAULT_TABLES });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      setBaseId(config.baseId || "appjIfzwTFFBzRlLB");
      if (config.tables) {
        setTables({ ...DEFAULT_TABLES, ...config.tables });
      } else if (config.tableName) {
        // migrate old single-table config
        setTables({ ...DEFAULT_TABLES, researchProjects: config.tableName });
      }
    }
  }, []);

  const handleTableChange = (key, value) => {
    setTables(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ baseId, tables }));
    setSaved(true);
    setTestResult(null);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await syncToAirtable({
        baseId,
        tableName: tables.researchProjects,
        records: [{ Name: "Test from Idea Spark", Source: "Idea Spark", Status: "Draft" }]
      });
      if (res.data?.success) {
        setTestResult({ success: true, message: `Connection works! Created test record in "${tables.researchProjects}"` });
      } else {
        setTestResult({ success: false, message: res.data?.error || "Unknown error" });
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message });
    }
    setTesting(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-green-500 rounded-xl flex items-center justify-center">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Airtable Integration</h1>
          <p className="text-sm text-slate-400">Connect your Idea Spark Hub base to auto-sync all data</p>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Base Configuration</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your Airtable Base ID (found in the URL: <code className="text-blue-400 bg-slate-900 px-1 rounded">app...</code>)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Base ID</Label>
            <Input
              placeholder="e.g., appXXXXXXXXXXXXXX"
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 mt-4">
        <CardHeader>
          <CardTitle className="text-white">Table Names</CardTitle>
          <CardDescription className="text-slate-400">
            Match these to the table names in your Airtable base. Defaults work with the Idea Spark Hub template.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {TABLE_FIELDS.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <Label className="text-slate-400 text-xs">{label}</Label>
              <Input
                placeholder={placeholder}
                value={tables[key]}
                onChange={(e) => handleTableChange(key, e.target.value)}
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          ))}

          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg border ${
              testResult.success
                ? "bg-emerald-900/30 border-emerald-700 text-emerald-300"
                : "bg-red-900/30 border-red-700 text-red-300"
            }`}>
              {testResult.success
                ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                : <AlertCircle className="w-4 h-4 shrink-0" />
              }
              <span className="text-sm">{testResult.message}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={!baseId}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saved ? "Saved!" : "Save Configuration"}
          </Button>
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={!baseId || !tables.researchProjects || testing}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            {testing
              ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              : <TestTube2 className="w-4 h-4 mr-2" />
            }
            Test Connection
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 mt-4">
        <CardHeader>
          <CardTitle className="text-white text-lg">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-400">
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 shrink-0">1</Badge>
            <p>Create the "Idea Spark Hub" base in Airtable with the 5 tables listed above.</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 shrink-0">2</Badge>
            <p>Paste your Base ID above and verify the table names match.</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 shrink-0">3</Badge>
            <p>Use <strong className="text-yellow-300">"Sync to Airtable"</strong> on any research results page to push all data at once — pain points, concepts, personas, competitor insights, prompts, and the project itself.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}