import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Settings,
    Sparkles,
    Type,
    Eye,
    Palette,
    Volume2,
    Zap,
    Moon,
    Sun,
    Monitor,
    CheckCircle,
    Keyboard,
    Mouse
} from "lucide-react";
import DangerZone from "../components/settings/DangerZone";

export default function ComfortSettings() {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('comfort_settings');
        return saved ? JSON.parse(saved) : {
            textSize: 'medium',
            highContrast: false,
            reducedMotion: false,
            dyslexicFont: false,
            colorScheme: 'system',
            soundEffects: true,
            voiceCommands: false,
            keyboardShortcuts: true,
            autoSave: true,
            fontSize: 100
        };
    });

    useEffect(() => {
        applySettings(settings);
        localStorage.setItem('comfort_settings', JSON.stringify(settings));
    }, [settings]);

    const applySettings = (newSettings) => {
        // Apply font size
        document.documentElement.style.fontSize = `${newSettings.fontSize}%`;

        // Apply high contrast
        if (newSettings.highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }

        // Apply reduced motion
        if (newSettings.reducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        } else {
            document.documentElement.classList.remove('reduced-motion');
        }

        // Apply dyslexic font
        if (newSettings.dyslexicFont) {
            document.documentElement.classList.add('dyslexic-font');
        } else {
            document.documentElement.classList.remove('dyslexic-font');
        }

        // Apply color scheme
        if (newSettings.colorScheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else if (newSettings.colorScheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        toast.success("Setting updated", {
            description: "Your comfort preferences have been saved"
        });
    };

    const resetSettings = () => {
        const defaults = {
            textSize: 'medium',
            highContrast: false,
            reducedMotion: false,
            dyslexicFont: false,
            colorScheme: 'system',
            soundEffects: true,
            voiceCommands: false,
            keyboardShortcuts: true,
            autoSave: true,
            fontSize: 100
        };
        setSettings(defaults);
        toast.success("Settings reset to defaults");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-8 h-8 text-blue-400" />
                        <h1 className="text-4xl font-bold">Comfort Settings</h1>
                    </div>
                    <p className="text-slate-400 text-lg">
                        Personalize your Idea Spark experience for maximum comfort and accessibility
                    </p>
                </div>

                {/* AI-Powered Card */}
                <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 mb-8">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Powered by AI</h3>
                                <p className="text-blue-200 mb-3">
                                    Use voice commands or customize your experience in Comfort Settings! We're committed to making Idea Spark accessible and comfortable for everyone.
                                </p>
                                <Badge className="bg-blue-600/20 text-blue-300">
                                    Neurodivergent-Friendly Design
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Visual Settings */}
                    <Card className="bg-slate-900/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5 text-purple-400" />
                                Visual Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Font Size Slider */}
                            <div className="space-y-2">
                                <Label className="text-slate-300">Font Size: {settings.fontSize}%</Label>
                                <Slider
                                    value={[settings.fontSize]}
                                    onValueChange={(value) => updateSetting('fontSize', value[0])}
                                    min={80}
                                    max={150}
                                    step={10}
                                    className="w-full"
                                />
                                <p className="text-xs text-slate-500">Adjust text size throughout the app</p>
                            </div>

                            {/* Color Scheme */}
                            <div className="space-y-2">
                                <Label className="text-slate-300">Color Scheme</Label>
                                <Select value={settings.colorScheme} onValueChange={(value) => updateSetting('colorScheme', value)}>
                                    <SelectTrigger className="bg-slate-800 border-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="system">
                                            <div className="flex items-center gap-2">
                                                <Monitor className="w-4 h-4" />
                                                System Default
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="light">
                                            <div className="flex items-center gap-2">
                                                <Sun className="w-4 h-4" />
                                                Light Mode
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="dark">
                                            <div className="flex items-center gap-2">
                                                <Moon className="w-4 h-4" />
                                                Dark Mode
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* High Contrast */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-slate-300">High Contrast Mode</Label>
                                    <p className="text-xs text-slate-500">Increase color contrast for better visibility</p>
                                </div>
                                <Switch
                                    checked={settings.highContrast}
                                    onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                                />
                            </div>

                            {/* Dyslexic Font */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-slate-300">Dyslexia-Friendly Font</Label>
                                    <p className="text-xs text-slate-500">Use OpenDyslexic font</p>
                                </div>
                                <Switch
                                    checked={settings.dyslexicFont}
                                    onCheckedChange={(checked) => updateSetting('dyslexicFont', checked)}
                                />
                            </div>

                            {/* Reduced Motion */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-slate-300">Reduce Motion</Label>
                                    <p className="text-xs text-slate-500">Minimize animations and transitions</p>
                                </div>
                                <Switch
                                    checked={settings.reducedMotion}
                                    onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interaction Settings */}
                    <Card className="bg-slate-900/50 border-slate-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mouse className="w-5 h-5 text-blue-400" />
                                Interaction Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Sound Effects */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-slate-300">Sound Effects</Label>
                                    <p className="text-xs text-slate-500">Play sounds for notifications</p>
                                </div>
                                <Switch
                                    checked={settings.soundEffects}
                                    onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
                                />
                            </div>

                            {/* Voice Commands */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-slate-300">Voice Commands (Beta)</Label>
                                    <p className="text-xs text-slate-500">Control app with voice</p>
                                </div>
                                <Switch
                                    checked={settings.voiceCommands}
                                    onCheckedChange={(checked) => updateSetting('voiceCommands', checked)}
                                />
                            </div>

                            {/* Keyboard Shortcuts */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-slate-300">Keyboard Shortcuts</Label>
                                    <p className="text-xs text-slate-500">Enable keyboard navigation</p>
                                </div>
                                <Switch
                                    checked={settings.keyboardShortcuts}
                                    onCheckedChange={(checked) => updateSetting('keyboardShortcuts', checked)}
                                />
                            </div>

                            {/* Auto-Save */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-slate-300">Auto-Save</Label>
                                    <p className="text-xs text-slate-500">Automatically save your work</p>
                                </div>
                                <Switch
                                    checked={settings.autoSave}
                                    onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                                />
                            </div>

                            {/* Keyboard Shortcuts Guide */}
                            {settings.keyboardShortcuts && (
                                <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Keyboard className="w-4 h-4 text-blue-400" />
                                        <h4 className="font-semibold text-sm">Keyboard Shortcuts</h4>
                                    </div>
                                    <div className="space-y-1 text-xs text-slate-400">
                                        <div className="flex justify-between">
                                            <span>New Research</span>
                                            <code className="bg-slate-700 px-2 py-1 rounded">Ctrl+N</code>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Search Concepts</span>
                                            <code className="bg-slate-700 px-2 py-1 rounded">Ctrl+K</code>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Dashboard</span>
                                            <code className="bg-slate-700 px-2 py-1 rounded">Ctrl+H</code>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Accessibility Info */}
                <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30 mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            Accessibility Commitment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-green-200 mb-4">
                            Idea Spark is designed to be fully accessible and comfortable for everyone, especially neurodivergent users. 
                            We follow WCAG 2.2 AA standards and continuously improve our accessibility features.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-green-300">Screen reader compatible</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-green-300">Full keyboard navigation</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-green-300">Adjustable text sizes</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-green-300">Color-blind friendly</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={resetSettings}
                        className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                        Reset to Defaults
                    </Button>
                    <Button
                        onClick={() => toast.success("All settings saved successfully!")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Save Settings
                    </Button>
                </div>

                {/* Danger Zone */}
                <DangerZone />
            </div>
        </div>
    );
}