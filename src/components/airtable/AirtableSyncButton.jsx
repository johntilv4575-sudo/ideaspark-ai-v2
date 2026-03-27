import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { syncFullProject } from "@/functions/syncFullProject";

const STORAGE_KEY = "airtable_config";

export default function AirtableSyncButton({ projectId, variant = "outline", size = "default" }) {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);

  const getConfig = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  };

  const handleSync = async () => {
    const config = getConfig();
    if (!config?.baseId) {
      setResult({ success: false, message: "Configure Airtable first in Settings" });
      setTimeout(() => setResult(null), 3000);
      return;
    }

    setSyncing(true);
    setResult(null);

    const res = await syncFullProject({ projectId, config });
    const data = res.data;

    if (data?.totalRecordsSynced > 0) {
      setResult({
        success: true,
        message: `Synced ${data.totalRecordsSynced} records${data.errors?.length ? ` (${data.errors.length} table errors)` : ''}`
      });
    } else {
      setResult({
        success: false,
        message: data?.error || data?.errors?.[0]?.error || "Sync failed"
      });
    }

    setSyncing(false);
    setTimeout(() => setResult(null), 4000);
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleSync}
        disabled={syncing}
        className="border-yellow-600/40 text-yellow-300 hover:bg-yellow-600/10 hover:text-yellow-200"
      >
        {syncing ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Database className="w-4 h-4 mr-2" />
        )}
        {syncing ? "Syncing..." : "Sync to Airtable"}
      </Button>
      {result && (
        <span className={`text-xs flex items-center gap-1 ${result.success ? "text-emerald-400" : "text-red-400"}`}>
          {result.success ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {result.message}
        </span>
      )}
    </div>
  );
}