'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/utils';
import { ShoppingCart, Trash2, Tag, ShieldCheck, ArrowRight, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, getSavings } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const total = getTotal();
    const savings = getSavings();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 md:py-24 max-w-2xl text-center">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-extrabold text-foreground mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8 text-lg">
                    Looks like you haven't locked in any AI negotiated deals yet.
                </p>
                <Link href="/products">
                    <Button size="lg" className="font-bold shadow-lg">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>

            {/* Split Amazon Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left List Pane (Span 8) */}
                <div className="col-span-1 lg:col-span-8 flex flex-col gap-4">
                    <Card className="border-border shadow-sm">
                        <CardContent className="p-0">
                            <div className="hidden md:grid grid-cols-12 gap-4 p-4 font-semibold text-sm border-b border-border text-muted-foreground bg-secondary/30">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-3 text-center">Quantity</div>
                                <div className="col-span-3 text-right">Price</div>
                            </div>

                            {items.map((item) => (
                                <div key={item.productId} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-6 items-center border-b border-border/50 last:border-0 hover:bg-secondary/10 transition-colors">
                                    <div className="col-span-1 md:col-span-6 flex items-start gap-4">
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border border-border shrink-0 bg-white"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <Link href={`/products/${item.productId}`} className="font-bold text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {item.productName}
                                            </Link>

                                            <div className="flex items-center gap-2 mt-1">
                                                {item.negotiated ? (
                                                    <span className="text-xs font-bold text-green-savings bg-green-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <Tag className="w-3 h-3" /> Negotiated
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">List Price</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="text-xs text-red-500 font-medium hover:underline self-start mt-2 flex items-center gap-1"
                                            >
                                                <Trash2 className="w-3 h-3" /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center items-center mt-2 md:mt-0">
                                        <div className="flex items-center border border-border rounded-lg bg-background">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors rounded-l-lg"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors rounded-r-lg"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price Block */}
                                    <div className="col-span-1 md:col-span-3 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end mt-2 md:mt-0">
                                        <span className="md:hidden text-sm font-semibold text-muted-foreground">Price:</span>
                                        <div className="flex flex-col items-end">
                                            {item.negotiated && (
                                                <span className="text-xs text-muted-foreground line-through">
                                                    {formatCurrency(item.originalPrice * item.quantity)}
                                                </span>
                                            )}
                                            <span className="text-lg font-extrabold text-foreground">
                                                {formatCurrency(item.finalPrice * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Summary Pane (Span 4) */}
                <div className="col-span-1 lg:col-span-4 sticky top-24">
                    <Card className="border-border shadow-md">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Items ({items.reduce((a, b) => a + b.quantity, 0)})</span>
                                    <span>{formatCurrency(total + savings)}</span>
                                </div>

                                {savings > 0 && (
                                    <div className="flex justify-between text-green-savings font-medium">
                                        <span>AI Negotiated Savings</span>
                                        <span>-{formatCurrency(savings)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-muted-foreground">
                                    <span>Estimated Shipping</span>
                                    <span className="text-foreground font-semibold">Free</span>
                                </div>

                                <Separator className="my-2" />

                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-bold text-base">Total</span>
                                    <span className="text-2xl font-extrabold">{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <Button
                                    className="w-full py-6 text-base font-bold shadow-md bg-yellow-400 hover:bg-yellow-500 text-black border border-yellow-500/50 group"
                                    onClick={() => setIsCheckingOut(true)}
                                    disabled={isCheckingOut}
                                >
                                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                Secure Checkout with FairDeal Protect
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
