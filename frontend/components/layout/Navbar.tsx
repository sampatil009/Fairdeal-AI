'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Search, Menu, X, User, Heart, Mic, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Navbar() {
    const { user, logout } = useAuth();
    const { items } = useCart();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getTierColor = (tier?: string) => {
        switch (tier) {
            case 'Diamond': return 'bg-purple-500 text-white';
            case 'Gold': return 'bg-yellow-500 text-white';
            case 'Silver': return 'bg-slate-400 text-white';
            default: return 'bg-amber-700 text-white';
        }
    };

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm' : 'bg-background border-b border-transparent'}`}>
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* Brand */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                            ✨
                        </span>
                        <span className="hidden sm:inline-block">FairDeal<span className="text-primary">AI</span></span>
                    </Link>
                </div>

                {/* Central Search Bar (Amazon Style) */}
                <div className="hidden lg:flex flex-1 max-w-2xl items-center relative group">
                    <div className="absolute left-3 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Search className="h-4 w-4" />
                    </div>
                    <Input
                        className="w-full pl-10 pr-10 rounded-full bg-secondary/50 border-secondary focus-visible:bg-background focus-visible:ring-primary/20 h-10 transition-all"
                        placeholder="Search for smart deals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="absolute right-3 text-muted-foreground hover:text-primary transition-colors">
                        <Mic className="h-4 w-4" />
                    </button>
                </div>

                {/* Desktop Actions */}
                <div className="flex items-center gap-2 sm:gap-4">

                    <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                        <Heart className="h-5 w-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-secondary/50 rounded-full">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                                {user && (
                                    <div className="hidden xl:flex flex-col items-start leading-none">
                                        <span className="text-xs text-muted-foreground">Hello, {user.name.split(' ')[0]}</span>
                                        <span className="text-sm font-semibold flex items-center gap-1">Account
                                            <Badge className={`h-4 text-[10px] px-1 font-bold ${getTierColor(user.tier)}`}>{user.tier}</Badge>
                                        </span>
                                    </div>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {user ? (
                                <>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" /> Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" /> Log out
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link href="/login" className="cursor-pointer font-medium text-primary">Sign In</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/register" className="cursor-pointer">Create Account</Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href="/cart">
                        <Button variant="ghost" className="relative p-2 hover:bg-secondary/50 rounded-full h-10 w-10">
                            <ShoppingCart className="h-5 w-5 text-foreground" />
                            {cartCount > 0 && (
                                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full border-2 border-background">
                                    {cartCount}
                                </Badge>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Categories Bar (like Amazon's "All" bar) */}
            <div className="hidden lg:flex border-t border-border bg-secondary/30 h-10 items-center">
                <div className="container mx-auto px-4 flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/products" className="hover:text-foreground transition-colors flex items-center gap-1">
                        <Menu className="h-4 w-4" /> All
                    </Link>
                    <Link href="/products?category=Electronics" className="hover:text-foreground transition-colors">Electronics</Link>
                    <Link href="/products?category=Laptops" className="hover:text-foreground transition-colors">Laptops</Link>
                    <Link href="/products?category=Accessories" className="hover:text-foreground transition-colors">Accessories</Link>
                    <Link href="/products?negotiationEnabled=true" className="text-primary hover:text-primary/80 font-bold transition-colors">✨ AI Negotiable</Link>
                </div>
            </div>

            {/* Mobile Menu & Search (Visible on small screens) */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 w-full bg-background border-b border-border p-4 shadow-lg animate-in slide-in-from-top-2">
                    <div className="flex flex-col gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="w-full pl-10 rounded-full bg-secondary/50" placeholder="Search..." />
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Link href="/products" className="p-2 hover:bg-secondary rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
                            <Link href="/products?negotiationEnabled=true" className="p-2 hover:bg-secondary rounded-lg font-bold text-primary" onClick={() => setMobileMenuOpen(false)}>✨ AI Deals</Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
