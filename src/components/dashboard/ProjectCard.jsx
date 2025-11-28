
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ResearchProject } from "@/entities/ResearchProject";
import { toast } from "sonner";
import { 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    Archive,
    ArrowRight,
    Target,
    Lightbulb,
    Trash2
} from "lucide-react";
import { format } from "date-fns";
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

const statusConfig = {
    draft: { 
        icon: AlertCircle, 
        color: "bg-slate-600/20 text-slate-300 border-slate-500/30",
        label: "Draft"
    },
    analyzing: { 
        icon: Clock, 
        color: "bg-blue-600/20 text-blue-300 border-blue-500/30",
        label: "Analyzing"
    },
    completed: { 
        icon: CheckCircle, 
        color: "bg-green-600/20 text-green-300 border-green-500/30",
        label: "Completed"
    },
    archived: { 
        icon: Archive, 
        color: "bg-slate-600/20 text-slate-400 border-slate-500/30",
        label: "Archived"
    }
};

export default function ProjectCard({ project, onDelete }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const statusInfo = statusConfig[project.status];
    const StatusIcon = statusInfo.icon;
    
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await ResearchProject.delete(project.id);
            toast.success("Research project deleted successfully");
            if (onDelete) onDelete();
        } catch (error) {
            toast.error("Failed to delete project");
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };
    
    return (
        <>
            <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group">
                <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-white font-semibold text-base sm:text-lg group-hover:text-blue-300 transition-colors truncate">
                                    {project.title}
                                </h3>
                                <Badge className={`${statusInfo.color} border text-xs font-medium flex-shrink-0`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusInfo.label}
                                </Badge>
                            </div>
                            <p className="text-slate-400 text-xs sm:text-sm line-clamp-2">
                                {project.description || `Research project analyzing the ${project.industry} industry for app opportunities`}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowDeleteDialog(true);
                            }}
                            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                        >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400 flex-wrap">
                            <div className="flex items-center gap-1">
                                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="capitalize">{project.industry}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>{project.generated_concepts?.length || 0} ideas</span>
                            </div>
                            <span>{format(new Date(project.created_date), "MMM d")}</span>
                        </div>
                        <Link to={createPageUrl(`ResearchDetails?id=${project.id}`)} className="w-full sm:w-auto">
                            <Button 
                                type="button"
                                variant="ghost" 
                                size="sm"
                                className="w-full sm:w-auto text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200 group-hover:translate-x-1 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
                            >
                                <span className="text-white">View Details</span>
                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-slate-800 border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Research Project?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to delete "<span className="text-white font-semibold">{project.title}</span>"? 
                            This will permanently delete the project and all its generated concepts. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Deleting..." : "Delete Project"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
