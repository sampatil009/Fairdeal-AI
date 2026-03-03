'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

function ProductsContent() {
    const searchParams = useSearchParams();
    const initCategory = searchParams.get('category') || undefined;
    const initSearch = searchParams.get('search') || undefined;
    const initNeg = searchParams.get('negotiationEnabled') === 'true';

    const { products, isLoading, filter, setFilter } = useProducts({
        category: initCategory !== 'All' ? (initCategory as any) : undefined,
        search: initSearch,
        negotiationEnabled: initNeg ? true : undefined,
    });

    const categories = ['All', 'Electronics', 'Laptops', 'Accessories'];

    return (
        <div className="container mx-auto px-4 py-8">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        {filter.category || 'All Products'}
                        {filter.negotiationEnabled && (
                            <Badge className="ml-3 bg-primary text-white text-sm" variant="secondary">
                                <Sparkles size={14} className="mr-1 inline" /> AI Deals Only
                            </Badge>
                        )}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {isLoading ? 'Loading items...' : `Showing ${products.length} results`}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2 font-medium">
                        <ArrowUpDown size={16} /> Sort by: Featured
                    </Button>
                    <Button variant="outline" className="gap-2 font-medium md:hidden">
                        <Filter size={16} /> Filters
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative">

                {/* Left Sidebar (Filters) */}
                <aside className="hidden md:block w-64 shrink-0 sticky top-24 space-y-8 bg-card border border-border p-6 rounded-xl shadow-sm">
                    {/* Amazon-style detailed filters */}
                    <div>
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                            <Filter className="h-4 w-4" /> Categories
                        </h3>
                        <ul className="space-y-3">
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        onClick={() => setFilter({ ...filter, category: cat === 'All' ? undefined : (cat as any) })}
                                        className={`text-sm flex items-center justify-between w-full transition-colors ${(filter.category === cat) || (!filter.category && cat === 'All')
                                            ? 'text-primary font-bold'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-6 border-t border-border">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                            <SlidersHorizontal className="h-4 w-4" /> Price Range
                        </h3>
                        <div className="space-y-6">
                            <Slider
                                defaultValue={[1000]}
                                max={3000}
                                step={100}
                                className="my-4"
                            />
                            <div className="flex items-center gap-2">
                                <Input type="number" placeholder="Min" className="h-9 input-base" />
                                <span className="text-muted-foreground">-</span>
                                <Input type="number" placeholder="Max" className="h-9 input-base" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                        <Button
                            onClick={() => setFilter({ ...filter, negotiationEnabled: !filter.negotiationEnabled })}
                            variant={filter.negotiationEnabled ? "default" : "outline"}
                            className="w-full gap-2 shadow-sm font-semibold"
                        >
                            <Sparkles size={16} />
                            {filter.negotiationEnabled ? 'Showing AI Deals' : 'Show Only AI Deals'}
                        </Button>
                    </div>
                </aside>

                {/* Product Grid Area */}
                <div className="flex-1 w-full">
                    {/* Mobile Search Input */}
                    <div className="mb-6 relative md:hidden">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search products..."
                            className="pl-10 h-11 w-full input-base"
                            value={filter.search || ''}
                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        />
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex flex-col gap-3">
                                    <Skeleton className="h-56 w-full rounded-xl" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-10 w-full mt-2" />
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center border-2 border-dashed border-border rounded-xl bg-card/50 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                                <Search size={24} className="text-muted-foreground" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">No products found</h2>
                            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                            <Button onClick={() => setFilter({})} className="font-semibold shadow-sm">
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-8 flex gap-8">
                <Skeleton className="w-64 h-[600px] hidden md:block rounded-xl" />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Skeleton className="h-[400px] rounded-xl" /><Skeleton className="h-[400px] rounded-xl" />
                    <Skeleton className="h-[400px] rounded-xl" /><Skeleton className="h-[400px] rounded-xl" />
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
