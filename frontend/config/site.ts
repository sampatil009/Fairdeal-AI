export const siteConfig = {
    name: 'FairDeal AI',
    tagline: 'Negotiate Smarter. Buy Better.',
    description:
        'AI-powered e-commerce platform where you can negotiate prices with our intelligent pricing engine.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    ogImage: '/og-image.png',
    version: '1.0.0',
    features: {
        negotiation: true,
        gamification: true,
        adminDashboard: true,
        darkMode: true,
    },
    maxNegotiationRounds: 5,
    tierDiscounts: {
        Bronze: 0.05,
        Silver: 0.10,
        Gold: 0.15,
        Platinum: 0.20,
    },
    savingsBadgeThreshold: 0.15, // 15% savings triggers badge
};
