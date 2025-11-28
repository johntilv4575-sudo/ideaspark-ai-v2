
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    Target,
    Users,
    Globe,
    Search,
    Plus,
    X,
    Sparkles,
    ArrowRight,
    RefreshCw
} from "lucide-react";
import { useAutoSave } from "../utils/useAutoSave";
import AutoSaveIndicator from "./AutoSaveIndicator";

const INDUSTRIES = [
    { value: "fintech", label: "FinTech & Banking" },
    { value: "healthcare", label: "Healthcare & Medical" },
    { value: "education", label: "Education & Learning" },
    { value: "ecommerce", label: "E-commerce & Retail" },
    { value: "travel", label: "Travel & Hospitality" },
    { value: "fitness", label: "Fitness & Wellness" },
    { value: "food_delivery", label: "Food & Delivery" },
    { value: "productivity", label: "Productivity & Tools" },
    { value: "entertainment", label: "Entertainment & Media" },
    { value: "social_media", label: "Social & Communication" },
    { value: "real_estate", label: "Real Estate & Property" },
    { value: "automotive", label: "Automotive & Transport" },
    { value: "gaming", label: "Gaming & Interactive" },
    { value: "fashion", label: "Fashion & Beauty" },
    { value: "other", label: "Other Industry" }
];

export default function ResearchForm({ formData, onInputChange, onSubmit }) {
    const { 
        data: autoSavedData, 
        updateData, 
        lastSaved, 
        isSaving, 
        clearAutoSave 
    } = useAutoSave('research_form', formData);

    const [keywordInput, setKeywordInput] = React.useState('');
    const [competitorInput, setCompetitorInput] = React.useState('');
    const [hasAutoSavedData, setHasAutoSavedData] = React.useState(false);

    // Check if there's auto-saved data different from current form
    React.useEffect(() => {
        const hasUnsavedChanges = JSON.stringify(autoSavedData) !== JSON.stringify(formData) && 
                                  (autoSavedData.title || autoSavedData.industry || autoSavedData.description);
        setHasAutoSavedData(hasUnsavedChanges);
    }, [autoSavedData, formData]);

    const handleInputChange = (field, value) => {
        onInputChange(field, value);
        updateData({ [field]: value });
    };

    const loadAutoSavedData = () => {
        Object.keys(autoSavedData).forEach(key => {
            onInputChange(key, autoSavedData[key]);
        });
        setHasAutoSavedData(false);
    };

    const addKeyword = () => {
        if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
            const newKeywords = [...formData.keywords, keywordInput.trim()];
            handleInputChange('keywords', newKeywords);
            setKeywordInput('');
        }
    };

    const removeKeyword = (keyword) => {
        handleInputChange('keywords', formData.keywords.filter(k => k !== keyword));
    };

    const addCompetitor = () => {
        if (competitorInput.trim() && !formData.competitor_apps.includes(competitorInput.trim())) {
            const newCompetitors = [...formData.competitor_apps, competitorInput.trim()];
            handleInputChange('competitor_apps', newCompetitors);
            setCompetitorInput('');
        }
    };

    const removeCompetitor = (app) => {
        handleInputChange('competitor_apps', formData.competitor_apps.filter(c => c !== app));
    };

    const handleSubmit = () => {
        clearAutoSave(); // Clear auto-save on successful submit
        onSubmit();
    };

    // Only require the title field
    const canSubmit = formData.title.trim().length > 0;

    return (
        <div className="space-y-8">
            {/* Auto-save indicator and load prompt */}
            <div className="flex justify-between items-center">
                <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
                {hasAutoSavedData && (
                    <Alert className="bg-blue-600/10 border-blue-500/20 max-w-md">
                        <RefreshCw className="h-4 w-4 text-blue-400" />
                        <AlertDescription className="text-blue-300 text-sm">
                            Found unsaved changes. 
                            <Button 
                                variant="link" 
                                className="text-blue-300 underline p-0 h-auto ml-2"
                                onClick={loadAutoSavedData}
                            >
                                Load them?
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Project Basics */}
            <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl">
                <CardHeader className="border-b border-slate-700">
                    <CardTitle className="text-white flex items-center gap-3">
                        <Target className="w-5 h-5 text-blue-400" />
                        Research Target
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-300 font-medium">
                            What Business/Service/App Do You Want to Research? *
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="e.g., Fish, Removalist, Dog Walking, Plumbing, Real Estate..."
                            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 text-lg py-6"
                        />
                        <p className="text-xs text-slate-400">
                            Just type anything - even one word like "Fish" - and we'll research pain points and generate app concepts
                        </p>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-slate-300 font-medium">
                            Industry Category (Optional - helps with context)
                        </Label>
                        <Select 
                            value={formData.industry} 
                            onValueChange={(value) => handleInputChange('industry', value)}
                        >
                            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500">
                                <SelectValue placeholder="Select if you want to categorize" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                {INDUSTRIES.map((industry) => (
                                    <SelectItem 
                                        key={industry.value} 
                                        value={industry.value}
                                        className="text-white hover:bg-slate-700"
                                    >
                                        {industry.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-400">
                            Optional - we'll still focus on "{formData.title || 'your input'}" regardless of category
                        </p>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-300 font-medium">Additional Context (Optional)</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Any specific aspects you want to focus on..."
                            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 h-24"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Research Parameters */}
            <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl">
                <CardHeader className="border-b border-slate-700">
                    <CardTitle className="text-white flex items-center gap-3">
                        <Search className="w-5 h-5 text-purple-400" />
                        Research Parameters (All Optional)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {/* Keywords */}
                    <div className="space-y-3">
                        <Label className="text-slate-300 font-medium">Keywords & Topics</Label>
                        <div className="flex gap-2">
                            <Input
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                placeholder="Add keyword or topic..."
                                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
                            />
                            <Button 
                                onClick={addKeyword}
                                type="button"
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4"
                            >
                                <Plus className="w-5 h-5 text-white" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.keywords.map((keyword) => (
                                <Badge 
                                    key={keyword}
                                    variant="secondary"
                                    className="bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30"
                                >
                                    {keyword}
                                    <button
                                        type="button"
                                        onClick={() => removeKeyword(keyword)}
                                        className="ml-2 hover:text-purple-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Competitors */}
                    <div className="space-y-3">
                        <Label className="text-slate-300 font-medium">Competitor Apps (Optional)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={competitorInput}
                                onChange={(e) => setCompetitorInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
                                placeholder="Add competitor app name..."
                                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
                            />
                            <Button 
                                onClick={addCompetitor}
                                type="button"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-4"
                            >
                                <Plus className="w-5 h-5 text-white" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.competitor_apps.map((app) => (
                                <Badge 
                                    key={app}
                                    variant="secondary"
                                    className="bg-amber-600/20 text-amber-300 border-amber-500/30 hover:bg-amber-600/30"
                                >
                                    {app}
                                    <button
                                        type="button"
                                        onClick={() => removeCompetitor(app)}
                                        className="ml-2 hover:text-amber-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-slate-300 font-medium">Target Demographics</Label>
                            <Input
                                value={formData.target_demographics}
                                onChange={(e) => handleInputChange('target_demographics', e.target.value)}
                                placeholder="e.g., millennials, small business owners..."
                                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300 font-medium">Geographic Focus</Label>
                            <Select 
                                value={formData.geographic_focus} 
                                onValueChange={(value) => handleInputChange('geographic_focus', value)}
                            >
                                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="global" className="text-white hover:bg-slate-700">Global</SelectItem>
                                    <SelectItem value="australia" className="text-white hover:bg-slate-700">Australia</SelectItem>
                                    <SelectItem value="us" className="text-white hover:bg-slate-700">United States</SelectItem>
                                    <SelectItem value="europe" className="text-white hover:bg-slate-700">Europe</SelectItem>
                                    <SelectItem value="asia" className="text-white hover:bg-slate-700">Asia</SelectItem>
                                    <SelectItem value="uk" className="text-white hover:bg-slate-700">United Kingdom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSubmit}
                    type="button"
                    disabled={!canSubmit}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-600 transition-all duration-300"
                >
                    <Sparkles className="w-5 h-5 mr-3 text-white" />
                    <span className="text-white">Start AI Research</span>
                    <ArrowRight className="w-5 h-5 ml-3 text-white" />
                </Button>
            </div>

            {!canSubmit && (
                <p className="text-center text-amber-400 text-sm">
                    Enter a business/service/app name to start researching
                </p>
            )}
        </div>
    );
}
