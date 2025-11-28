import React from 'react';
import { Check, Clock, Save } from 'lucide-react';
import { format } from 'date-fns';

export default function AutoSaveIndicator({ lastSaved, isSaving }) {
    if (isSaving) {
        return (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>Saving...</span>
            </div>
        );
    }

    if (lastSaved) {
        return (
            <div className="flex items-center gap-2 text-green-400 text-sm">
                <Check className="w-4 h-4" />
                <span>Saved {format(lastSaved, 'HH:mm:ss')}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Save className="w-4 h-4" />
            <span>Changes will be saved automatically</span>
        </div>
    );
}