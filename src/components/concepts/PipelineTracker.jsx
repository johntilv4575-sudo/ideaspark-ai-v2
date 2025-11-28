import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PIPELINE_STAGES } from "../utils/handoff";

const PipelineTracker = ({ conceptId, pipelineStatus }) => {
    const stages = Object.entries(PIPELINE_STAGES);
    const currentStageIndex = stages.findIndex(([key]) => key === pipelineStatus.stage);

    return (
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <h4 className="text-white font-semibold text-sm mb-3">Idea Pipeline Status</h4>
            <div className="flex items-center gap-2 overflow-x-auto">
                {stages.map(([key, stage], index) => {
                    const isCompleted = pipelineStatus.stages_completed.includes(key);
                    const isCurrent = key === pipelineStatus.stage;
                    const isPast = index < currentStageIndex;

                    return (
                        <React.Fragment key={key}>
                            <div className={cn(
                                "flex flex-col items-center gap-1 min-w-[80px]",
                                isCurrent && "scale-110"
                            )}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                    isCompleted || isCurrent
                                        ? `bg-${stage.color}-600 text-white`
                                        : "bg-slate-700 text-slate-400"
                                )}>
                                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                                </div>
                                <span className={cn(
                                    "text-xs text-center",
                                    isCurrent ? "text-white font-semibold" : "text-slate-400"
                                )}>
                                    {stage.name}
                                </span>
                                <Badge className={cn(
                                    "text-[10px] px-1 py-0",
                                    isCurrent 
                                        ? `bg-${stage.color}-600/20 text-${stage.color}-300 border-${stage.color}-500/30`
                                        : "bg-slate-700/20 text-slate-500 border-slate-600/30"
                                )}>
                                    {stage.app}
                                </Badge>
                            </div>
                            {index < stages.length - 1 && (
                                <ArrowRight className={cn(
                                    "w-4 h-4 flex-shrink-0",
                                    isPast ? "text-blue-400" : "text-slate-600"
                                )} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default PipelineTracker;