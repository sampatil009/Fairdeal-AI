'use client';

import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryRow } from '@/components/home/CategoryRow';
import { ProductCard } from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
    const { products, isLoading } = useProducts();

    // Featured and Negotiable splits
    const featuredProducts = products.filter(p => p.featured).slice(0, 4);
    const negotiableProducts = products.filter(p => p.negotiationEnabled).slice(0, 4);

    return (
        <div className="flex flex-col min-h-screen pb-12">
            {/* 1. Amazon-style Hero Slider */}
            <HeroCarousel />

            {/* 2. Category Round Icons Row */}
            <CategoryRow />

            {/* 3. Deal of the Day / AI Negotiable Row */}
            <section className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="text-primary w-6 h-6" />
                        AI Negotiable Deals
                    </h2>
                    <Link href="/products?negotiationEnabled=true" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <Skeleton className="h-48 w-full rounded-xl" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {negotiableProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* 4. Secondary Banner */}
            <section className="container mx-auto px-4 py-8">
                <div className="w-full bg-secondary/50 border border-border rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl space-y-4">
                        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                            Unlock Your Premium Tier
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Sign up today and reach Gold tier to unlock up to 20% off during AI negotiations. The more you buy, the harder the AI fights for your discounts.
                        </p>
                        <div className="pt-4">
                            <Link href="/register">
                                <Button className="font-bold px-8 shadow-md">Create Free Account</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div className="relative w-48 h-48 bg-gradient-to-br from-primary to-secondary/20 rounded-full flex items-center justify-center border-4 border-background shadow-2xl animate-pulse">
                            <span className="text-6xl">🏆</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Trending Products Row */}
            <section className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="text-blue-500 w-6 h-6" />
                        Trending Now
                    </h2>
                    <Link href="/products" className="text-muted-foreground text-sm font-semibold hover:text-foreground flex items-center gap-1">
                        See More <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {!isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
