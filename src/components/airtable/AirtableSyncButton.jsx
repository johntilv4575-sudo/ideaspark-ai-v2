import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Database, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { syncFullProject } from "@/functions/syncFullProject";
import { base44 } from "@/api/base44Client";

export default function AirtableSyncButton({ projectId, variant = "outline", size = "default" }) {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user?.airtable_config?.base_id) {
        setConfig({
          baseId: user.airtable_config.base_id,
          tables: user.airtable_config.tables || {}
        });
      }
    }).catch(() => {});
  }, []);

  const handleSync = async () => {
    if (!config?.baseId) {
      setResult({ success: false, message: "Airtable not configured — go to Airtable in the sidebar to set your Base ID" });
      setTimeout(() => setResult(null), 5000);
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
      base44.analytics.track({ eventName: "airtable_synced", properties: { records: data.totalRecordsSynced } });
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