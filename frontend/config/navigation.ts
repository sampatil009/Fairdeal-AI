import { Home, ShoppingBag, ShoppingCart, BarChart3, Tag, LogIn, UserPlus } from 'lucide-react';

export const mainNavLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: ShoppingBag },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
];

export const authNavLinks = [
    { href: '/login', label: 'Sign In', icon: LogIn },
    { href: '/register', label: 'Register', icon: UserPlus },
];

export const adminNavLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
];

export const productCategories = [
    'All',
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Toys',
    'Beauty',
    'Automotive',
] as const;

export const tierBadgeColors: Record<string, string> = {
    Bronze: 'from-amber-600 to-amber-800',
    Silver: 'from-gray-400 to-gray-600',
    Gold: 'from-yellow-400 to-yellow-600',
    Platinum: 'from-cyan-400 to-cyan-600',
};
