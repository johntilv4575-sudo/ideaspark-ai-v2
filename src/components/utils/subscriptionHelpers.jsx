import { base44 } from '@/api/base44Client';

/**
 * Centralized subscription logic — reads from User entity (server-backed).
 * For action validation, prefer using canPerformAction from @/components/utils/pricing
 * which calls the server-side checkUsageLimits function.
 */
export const checkSubscription = async () => {
    try {
        const user = await base44.auth.me();
        const tier = user?.subscription_tier || 'free';
        return {
            tier,
            isPremium: tier !== 'free',
            isSuite: ['suite_starter', 'suite_creator'].includes(tier),
            isActive: user?.subscription_status === 'active',
            user
        };
    } catch (error) {
        return { tier: 'free', isPremium: false, isSuite: false, isActive: false, user: null };
    }
};