import { User } from '@/entities/User';

// Centralized subscription logic
export const checkSubscription = async () => {
    try {
        const user = await User.me();
        return {
            isPremium: user?.subscription_tier === 'premium',
            isActive: user?.subscription_status === 'active',
            user
        };
    } catch (error) {
        return { isPremium: false, isActive: false, user: null };
    }
};

export const SUBSCRIPTION_LIMITS = {
    FREE: {
        projects_per_month: 3,
        concepts_per_project: 3,
        exports_per_month: 0,
        advanced_analysis: false
    },
    PREMIUM: {
        projects_per_month: 50,
        concepts_per_project: 10,
        exports_per_month: 100,
        advanced_analysis: true
    }
};

export const canPerformAction = (user, action) => {
    const isPremium = user?.subscription_tier === 'premium';
    const limits = isPremium ? SUBSCRIPTION_LIMITS.PREMIUM : SUBSCRIPTION_LIMITS.FREE;
    
    switch (action) {
        case 'create_project':
            return (user?.projects_created_this_month || 0) < limits.projects_per_month;
        case 'export_report':
            return isPremium && (user?.exports_this_month || 0) < limits.exports_per_month;
        case 'advanced_analysis':
            return limits.advanced_analysis;
        default:
            return true;
    }
};