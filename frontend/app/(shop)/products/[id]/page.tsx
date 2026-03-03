'use client';

import React, { useState } from 'react';
import { useProduct } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, Share2, Sparkles, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const { product, isLoading, error } = useProduct(id);
    const { addItem } = useCart();
    const { user } = useAuth();

    const [selectedImage, setSelectedImage] = useState(0);

    if (error) return notFound();

    if (isLoading) return (
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-[500px] rounded-2xl" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-[400px] rounded-2xl" />
        </div>
    );

    if (!product) return null;

    return (
        <div className="container mx-auto px-4 py-8 pb-24">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                <span>/</span>
                <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
                <span>/</span>
                <span className="text-foreground font-medium truncate max-wxs">{product.name}</span>
            </nav>

            {/* 3-Pane Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

                {/* Pane 1: Image Gallery (Span 5) */}
                <div className="col-span-1 lg:col-span-5 flex flex-col gap-4">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-border group">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-contain p-4 group-hover:scale-150 transition-transform duration-500 cursor-zoom-in origin-center"
                        />

                        {product.negotiationEnabled && (
                            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-primary text-white border-0 shadow-lg px-3 py-1.5 text-sm font-bold animate-fade-in">
                                <Sparkles className="w-4 h-4 mr-2" /> AI Negotiable
                            </Badge>
                        )}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <Button variant="secondary" size="icon" className="rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white text-muted-foreground hover:text-red-500">
                                <Heart className="w-5 h-5" />
                            </Button>
                            <Button variant="secondary" size="icon" className="rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white text-muted-foreground hover:text-primary">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pane 2: Product Info (Span 4) */}
                <div className="col-span-1 lg:col-span-4 flex flex-col">
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight leading-tight mb-2">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                            ))}
                        </div>
                        <span className="text-primary font-semibold text-sm hover:underline cursor-pointer">
                            {product.reviewCount} Ratings
                        </span>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-foreground mb-1">About this item</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
                                <Truck className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Free Delivery</p>
                                    <p className="text-xs text-muted-foreground">Arrives tomorrow</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
                                <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">1 Year Warranty</p>
                                    <p className="text-xs text-muted-foreground">FairDeal Protect</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pane 3: Buy / Negotiate Action Box (Span 3) */}
                <div className="col-span-1 lg:col-span-3">
                    <Card className="sticky top-24 border-primary/20 shadow-xl overflow-hidden">
                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-primary" />

                        <CardContent className="p-6">
                            <div className="mb-6">
                                <span className="text-sm text-muted-foreground line-through block mb-1">
                                    List Price {formatCurrency(product.price * 1.15)}
                                </span>
                                <div className="flex items-start gap-1">
                                    <span className="text-2xl font-bold text-foreground mt-1">₹</span>
                                    <span className="text-5xl font-extrabold text-foreground tracking-tighter">
                                        {product.price.toString().split('.')[0]}
                                    </span>
                                    {/* Sub-rupee values are rare in e-commerce, keeping it clean */}
                                </div>
                            </div>

                            {product.stock > 0 ? (
                                <div className="flex items-center gap-2 text-green-600 font-semibold mb-6">
                                    <CheckCircle className="w-5 h-5" /> In Stock ({product.stock} available)
                                </div>
                            ) : (
                                <div className="text-red-500 font-semibold mb-6">Out of Stock</div>
                            )}

                            <div className="space-y-3">
                                {product.negotiationEnabled ? (
                                    <>
                                        <Link href={`/negotiate/${product.id}`} className="w-full block">
                                            <Button className="w-full h-14 text-lg font-bold gap-2 bg-gradient-to-r from-blue-600 to-primary hover:opacity-90 transition-opacity shadow-md border-0 relative overflow-hidden group">
                                                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                                                <Sparkles className="w-5 h-5" /> Negotiate with AI
                                            </Button>
                                        </Link>
                                        <div className="text-center">
                                            <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-full">
                                                AI Agent is online
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <Button
                                        className="w-full h-14 text-lg font-bold shadow-md"
                                        onClick={() => {
                                            addItem({
                                                productId: product.id,
                                                productName: product.name,
                                                productImage: product.images[0],
                                                quantity: 1,
                                                originalPrice: product.price,
                                                finalPrice: product.price,
                                                negotiated: false,
                                                savingsPercent: 0
                                            });
                                            router.push('/cart');
                                        }}
                                        disabled={product.stock === 0}
                                    >
                                        Add to Cart
                                    </Button>
                                )}

                                {user ? (
                                    <div className="p-3 bg-secondary/50 rounded-xl border border-border mt-4 flex items-start gap-3">
                                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <p className="text-xs text-muted-foreground">
                                            Your <strong className={user.tier === 'Gold' ? 'text-yellow-500' : 'text-primary'}>{user.tier}</strong> tier gives you stronger negotiation power for this item.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center mt-4">
                                        <Link href="/login" className="text-xs text-primary font-medium hover:underline">
                                            Sign in for better tier discounts
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-border/50 text-xs text-muted-foreground space-y-2">
                                <div className="flex justify-between"><span>Ships from</span> <span className="font-medium text-foreground">FairDeal Fulfillment</span></div>
                                <div className="flex justify-between"><span>Sold by</span> <span className="font-medium text-foreground">FairDeal Verified Vendor</span></div>
                                <div className="flex justify-between"><span>Returns</span> <span className="font-medium text-foreground">30-day refund policy</span></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
