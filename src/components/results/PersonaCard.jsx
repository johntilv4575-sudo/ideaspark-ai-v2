import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    ChevronDown, 
    ChevronUp, 
    Smartphone, 
    Laptop, 
    Tablet,
    Monitor,
    RefreshCw,
    Quote,
    Target,
    Frown,
    Zap
} from "lucide-react";

const techColors = {
    low: "bg-blue-600/20 text-blue-300 border-blue-500/30",
    medium: "bg-amber-600/20 text-amber-300 border-amber-500/30",
    high: "bg-green-600/20 text-green-300 border-green-500/30"
};

const avatarColors = [
    "from-blue-500 to-purple-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-blue-600"
];

const getDeviceIcon = (device) => {
    const d = device.toLowerCase();
    if (d.includes('phone') || d.includes('mobile') || d.includes('iphone') || d.includes('android')) return Smartphone;
    if (d.includes('tablet') || d.includes('ipad')) return Tablet;
    if (d.includes('laptop')) return Laptop;
    return Monitor;
};

export default function PersonaCard({ persona, index, onRegenerate, isRegenerating }) {
    const [expanded, setExpanded] = useState(false);
    
    const initials = persona.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
    const avatarGradient = avatarColors[index % avatarColors.length];

    return (
        <Card className="bg-slate-800/50 border border-slate-700 overflow-hidden hover:border-slate-600 transition-all">
            <CardContent className="p-0">
                {/* Header */}
                <div className="p-4 border-b border-slate-700">
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <span className="text-white font-bold text-lg">{initials}</span>
                        </div>
                        
                        {/* Basic Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-white font-semibold text-lg">{persona.name}</h4>
                                    <p className="text-slate-400 text-sm">{persona.occupation}</p>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onRegenerate?.(index)}
                                    disabled={isRegenerating}
                                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <Badge variant="outline" className="text-slate-300 border-slate-600 text-xs">
                                    {persona.age} years
                                </Badge>
                                <Badge variant="outline" className="text-slate-300 border-slate-600 text-xs">
                                    {persona.location}
                                </Badge>
                                <Badge className={`${techColors[persona.tech_savviness]} text-xs`}>
                                    {persona.tech_savviness} tech
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote */}
                <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-700">
                    <div className="flex items-start gap-2">
                        <Quote className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-300 text-sm italic">"{persona.quote}"</p>
                    </div>
                </div>

                {/* Background */}
                <div className="p-4 border-b border-slate-700">
                    <p className="text-slate-400 text-sm">{persona.background}</p>
                </div>

                {/* Expandable Section */}
                <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[600px]' : 'max-h-0'}`}>
                    <div className="p-4 space-y-4 border-b border-slate-700">
                        {/* Goals */}
                        <div>
                            <h5 className="text-green-400 font-medium text-sm flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4" />
                                Goals & Motivations
                            </h5>
                            <ul className="space-y-1">
                                {persona.goals?.map((goal, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                        <span className="text-green-400 mt-1">•</span>
                                        {goal}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Frustrations */}
                        <div>
                            <h5 className="text-red-400 font-medium text-sm flex items-center gap-2 mb-2">
                                <Frown className="w-4 h-4" />
                                Key Frustrations
                            </h5>
                            <ul className="space-y-1">
                                {persona.frustrations?.map((frustration, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                                        <span className="text-red-400 mt-1">•</span>
                                        {frustration}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Behavior */}
                        <div>
                            <h5 className="text-amber-400 font-medium text-sm flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4" />
                                Current Behavior
                            </h5>
                            <p className="text-slate-300 text-sm">{persona.behavior}</p>
                        </div>

                        {/* Devices */}
                        <div>
                            <h5 className="text-blue-400 font-medium text-sm mb-2">Preferred Devices</h5>
                            <div className="flex flex-wrap gap-2">
                                {persona.devices?.map((device, i) => {
                                    const DeviceIcon = getDeviceIcon(device);
                                    return (
                                        <Badge key={i} variant="outline" className="text-slate-300 border-slate-600 text-xs flex items-center gap-1">
                                            <DeviceIcon className="w-3 h-3" />
                                            {device}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expand Toggle */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full p-3 flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                    {expanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            <span className="text-sm">Show Less</span>
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            <span className="text-sm">Show More</span>
                        </>
                    )}
                </button>
            </CardContent>
        </Card>
    );
}