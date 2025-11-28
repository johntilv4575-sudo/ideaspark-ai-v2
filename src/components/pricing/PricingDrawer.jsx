
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

const PRICING_PLANS = [
  {
    sku: 'IACG_FREE',
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Sparkles,
    color: 'text-slate-400',
    features: [
      '3 research projects/month',
      'Up to 3 concepts per project',
      'Basic pain point analysis',
      'Competitor insights',
      'Community support'
    ],
    limits: [
      'No PDF exports',
      'No concept combining',
      'No suite mode'
    ]
  },
  {
    sku: 'IACG_PRO',
    name: 'Pro',
    price: '$29',
    period: '/month',
    icon: Zap,
    color: 'text-blue-400',
    popular: true,
    features: [
      'Unlimited research projects',
      'Up to 10 concepts per project',
      '✨ PDF export & blueprints',
      '✨ Market feasibility scores',
      '✨ Combine concepts into super-apps',
      'Advanced pain point analysis',
      'Priority support'
    ],
    limits: []
  },
  {
    sku: 'SUITE_STARTER_BUNDLE',
    name: 'Suite Starter',
    price: '$79',
    period: '/month',
    icon: Crown,
    color: 'text-purple-400',
    badge: 'Best Value',
    features: [
      'Everything in Pro',
      '🚀 Cross-app handoffs',
      '🚀 Shared workspace',
      'Access to 3 Spiral apps',
      'Integrated workflows',
      'Suite orchestration',
      'Premium support'
    ],
    limits: []
  },
  {
    sku: 'SUITE_CREATOR_BUNDLE',
    name: 'Suite Creator',
    price: '$199',
    period: '/month',
    icon: Crown,
    color: 'text-amber-400',
    badge: 'Enterprise',
    features: [
      'Everything in Suite Starter',
      '⭐ Access to ALL Spiral apps',
      '⭐ Advanced orchestrations',
      '⭐ White-label options',
      '⭐ API access',
      'Custom integrations',
      'Dedicated support',
      'Early access to new features'
    ],
    limits: []
  }
];

// Helper map to convert SKUs to simplified tier names used by currentTier prop and localStorage
const SKU_TO_SIMPLE_TIER_MAP = {
  'IACG_FREE': 'free',
  'IACG_PRO': 'pro',
  'SUITE_STARTER_BUNDLE': 'suite_starter',
  'SUITE_CREATOR_BUNDLE': 'suite_creator'
};

export default function PricingDrawer({ open, onClose, currentTier = 'free', highlightFeature }) {
  const [billingCycle, setBillingCycle] = React.useState('monthly');

  const handleUpgrade = (sku) => {
    // TESTING MODE: Simulate the upgrade by setting localStorage
    // This grants access WITHOUT any real payment
    
    const tier = SKU_TO_SIMPLE_TIER_MAP[sku];
    
    if (tier) {
        // Set the simulated license in localStorage
        const license = {
            tier: tier,
            expires: null, // No expiration for testing
            granted_at: new Date().toISOString()
        };
        localStorage.setItem('license', JSON.stringify(license));
        
        // Reset usage counters so they can use the new limits
        const currentMonth = new Date().toISOString().slice(0, 7);
        const usage = {
            month: currentMonth,
            projects_this_month: 0,
            exports_this_month: 0
        };
        localStorage.setItem('usage', JSON.stringify(usage));
        
        // Show success message
        alert(`✅ TESTING MODE: Simulated upgrade to ${tier.replace(/_/g, ' ').toUpperCase()}!\n\n` +
              `You now have access to all ${tier.replace(/_/g, ' ')} features.\n` +
              `No real payment was processed.\n\n` +
              `The page will reload to apply changes.`);
        
        // Reload to apply new permissions
        window.location.reload();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-4xl bg-slate-900 border-slate-700 overflow-y-auto">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-white text-3xl">Choose Your Plan</SheetTitle>
          <SheetDescription className="text-slate-400 text-lg">
            {highlightFeature 
              ? `Unlock ${highlightFeature} and more with a paid plan`
              : 'Unlock powerful features to accelerate your app discovery'}
          </SheetDescription>
        </SheetHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {PRICING_PLANS.map((plan) => {
            const Icon = plan.icon;
            // Use the common SKU_TO_SIMPLE_TIER_MAP to determine if the plan is current
            const isCurrent = currentTier === SKU_TO_SIMPLE_TIER_MAP[plan.sku];
            
            return (
              <div
                key={plan.sku}
                className={`relative bg-slate-800/50 border rounded-xl p-6 ${
                  plan.popular 
                    ? 'border-blue-500 ring-2 ring-blue-500/20' 
                    : 'border-slate-700'
                } ${isCurrent ? 'opacity-60' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`w-6 h-6 ${plan.color}`} />
                    <h3 className="text-white text-2xl font-bold">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white text-4xl font-bold">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limits.length > 0 && (
                  <div className="border-t border-slate-700 pt-4 mb-6">
                    {plan.limits.map((limit, idx) => (
                      <div key={idx} className="flex items-start gap-3 opacity-50">
                        <span className="text-slate-500 text-sm">✗ {limit}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => handleUpgrade(plan.sku)}
                  disabled={isCurrent}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : 'bg-slate-700 hover:bg-slate-600'
                  } text-white`}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
          <p className="text-slate-400 text-sm text-center">
            All plans include 14-day money-back guarantee • Cancel anytime • Secure payment via Stripe
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
