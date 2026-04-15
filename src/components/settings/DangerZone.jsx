import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const CONFIRM_TEXT = "DELETE MY ACCOUNT";

export default function DangerZone() {
  const [showDialog, setShowDialog] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    // TODO: Wire to actual account deletion backend function
    await new Promise((r) => setTimeout(r, 1500));
    setIsDeleting(false);
    setShowDialog(false);
    setConfirmInput("");
    toast.info("Account deletion is not yet wired to a backend. This is a placeholder.");
  };

  return (
    <>
      <Card className="bg-red-950/30 border-red-800/50 mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm mb-4">
            Actions in this section are permanent and cannot be undone. Proceed with extreme caution.
          </p>
          <div className="flex items-center justify-between p-4 bg-red-950/40 border border-red-800/40 rounded-lg">
            <div>
              <p className="text-red-300 font-semibold text-sm">Permanently Delete Account</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Removes all your data, projects, concepts, and settings forever.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDialog(true)}
              className="bg-red-700 hover:bg-red-600 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-slate-900 border-red-800/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 space-y-3">
              <span className="block">
                This will <strong className="text-red-300">permanently delete</strong> your account and all associated data including research projects, concepts, documents, and settings.
              </span>
              <span className="block font-semibold text-slate-300">
                Type <code className="bg-slate-800 px-2 py-0.5 rounded text-red-300">{CONFIRM_TEXT}</code> below to confirm:
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={CONFIRM_TEXT}
            className="bg-slate-800 border-slate-700 text-white"
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
              onClick={() => setConfirmInput("")}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={confirmInput !== CONFIRM_TEXT || isDeleting}
              className="bg-red-700 hover:bg-red-600 text-white disabled:opacity-40"
            >
              {isDeleting ? "Deleting..." : "Permanently Delete My Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}