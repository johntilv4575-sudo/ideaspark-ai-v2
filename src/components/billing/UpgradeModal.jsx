import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from 'lucide-react';

const PlanFeature = ({ feature, included = true }) => (
    <div className={`flex items-center gap-2 ${included ? 'text-slate-300' : 'text-slate-500'}`}>
        <Check className={`w-4 h-4 ${included ? 'text-green-400' : 'text-slate-500'}`} />
        <span>{feature}</span>
    </div>
);

export default function UpgradeModal({ isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            // This will be implemented when Stripe keys are provided
            // const response = await createCheckoutSession({ priceId: 'monthly_price_id' });
            // if (response.data.url) {
            //     window.location.href = response.data.url;
            // }
            console.log('Upgrade flow - requires Stripe setup');
        } catch (error) {
            console.error('Upgrade failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-slate-900 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-white text-center">
                        Unlock Premium Features
                    </DialogTitle>
                </DialogHeader>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {/* Free Plan */}
                    <Card className="bg-slate-800/30 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-slate-400" />
                                Free Tier
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-3xl font-bold text-white">$0<span className="text-lg text-slate-400">/month</span></div>
                            <div className="space-y-3">
                                <PlanFeature feature="3 research projects/month" />
                                <PlanFeature feature="Basic pain point analysis" />
                                <PlanFeature feature="3 app concepts per project" />
                                <PlanFeature feature="Standard competitor analysis" />
                                <PlanFeature feature="Export reports" included={false} />
                                <PlanFeature feature="Advanced market insights" included={false} />
                                <PlanFeature feature="Priority support" included={false} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Premium Plan */}
                    <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 relative">
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            Most Popular
                        </Badge>
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Crown className="w-5 h-5 text-amber-400" />
                                Premium Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-3xl font-bold text-white">$29<span className="text-lg text-slate-400">/month</span></div>
                            <div className="space-y-3">
                                <PlanFeature feature="50 research projects/month" />
                                <PlanFeature feature="Deep pain point analysis with sources" />
                                <PlanFeature feature="10 app concepts per project" />
                                <PlanFeature feature="Advanced competitor intelligence" />
                                <PlanFeature feature="Unlimited PDF exports" />
                                <PlanFeature feature="Market trend analysis" />
                                <PlanFeature feature="Priority email support" />
                                <PlanFeature feature="Development blueprints" />
                            </div>
                            <Button 
                                onClick={handleUpgrade}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-6"
                            >
                                {isLoading ? 'Processing...' : 'Upgrade to Premium'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}