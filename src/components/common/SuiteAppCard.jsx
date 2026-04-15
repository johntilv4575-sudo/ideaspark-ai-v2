import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SuiteAppCard = ({ 
    icon: Icon, 
    title, 
    conciseDescription, 
    features, 
    href, 
    statusBadge, 
    gradient,
    isCurrentApp = false 
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const isExternalLink = href && href.startsWith("http");

    const CardWrapper = ({ children }) => {
        if (isCurrentApp) {
            return <div className="cursor-default">{children}</div>;
        }
        if (isExternalLink) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="block">
                    {children}
                </a>
            );
        }
        return <div className="cursor-pointer">{children}</div>;
    };

    return (
        <CardWrapper>
            <Card
                className={cn(
                    "group relative overflow-hidden bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl transition-all duration-300 h-full flex flex-col",
                    !isCurrentApp && "hover:border-blue-500/50 hover:shadow-xl md:hover:scale-105",
                    gradient
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4 relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-lg transition-all duration-300",
                                isCurrentApp 
                                    ? "bg-blue-500/20" 
                                    : "bg-white/10 group-hover:bg-white/20 group-hover:scale-110"
                            )}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <CardTitle className="text-white text-lg sm:text-xl font-semibold">
                                {title}
                            </CardTitle>
                        </div>
                        {statusBadge && (
                            <Badge className={cn(
                                "text-xs whitespace-nowrap flex-shrink-0",
                                statusBadge.includes("Premium") 
                                    ? "bg-purple-600/20 text-purple-300 border-purple-500/30"
                                    : statusBadge.includes("Current")
                                    ? "bg-blue-600/20 text-blue-300 border-blue-500/30"
                                    : "bg-amber-600/20 text-amber-300 border-amber-500/30"
                            )}>
                                {statusBadge}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 pt-0 relative z-10 flex flex-col">
                    {/* Concise Description */}
                    <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
                        {conciseDescription}
                    </p>

                    {/* Features - Show on hover */}
                    <div className={cn(
                        "transition-all duration-300 flex-1",
                        isHovered ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
                    )}>
                        <div className="border-t border-slate-600/50 pt-4 space-y-2">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Key Features
                            </p>
                            <ul className="space-y-2">
                                {features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                        <Sparkles className="w-3 h-3 text-blue-400 mt-1 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Action Button */}
                    {!isCurrentApp && href && (
                        <div className={cn(
                            "mt-4 transition-all duration-300",
                            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        )}>
                            <Button
                                variant="ghost"
                                className="w-full text-blue-300 hover:text-white hover:bg-blue-600/20 transition-all group-hover:translate-x-1"
                            >
                                {statusBadge?.includes("Development") ? "Coming Soon" : "Explore App"}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}

                    {isCurrentApp && (
                        <div className="mt-4">
                            <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-xs">
                                You are here
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>
        </CardWrapper>
    );
};

export default SuiteAppCard;