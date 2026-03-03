'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useProducts';
import { useNegotiationSocket } from '@/hooks/useNegotiationSocket';
import { formatCurrency } from '@/lib/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Info, ShieldCheck, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { ChatBubble } from '@/components/negotiation/ChatBubble';
import { OfferInput } from '@/components/negotiation/OfferInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NegotiatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const { user } = useAuth();
    const { addItem } = useCart();
    const { width, height } = useWindowSize();
    const scrollRef = useRef<HTMLDivElement>(null);

    const { product, isLoading: isProductLoading } = useProduct(id);
    const {
        isAccepted,
        finalPrice,
        currentRound,
        maxRounds,
        messages,
        submitOffer,
        isThinking,
        error: socketError,
        latestExplanation
    } = useNegotiationSocket(id);

    const [showConfetti, setShowConfetti] = useState(false);

    // Auto-scroll to latest message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    useEffect(() => {
        if (!user) {
            router.push(`/login?redirect=/negotiate/${id}`);
        }
    }, [user, router, id]);

    useEffect(() => {
        if (isAccepted) {
            setShowConfetti(true);
        }
    }, [isAccepted]);

    if (!user || isProductLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground font-medium animate-pulse">Initializing AI Negotiator...</p>
            </div>
        );
    }

    if (!product || !product.negotiationEnabled) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold mb-2">Item Not Negotiable</h1>
                <p className="text-muted-foreground mb-6">This product is either not found or does not support AI price negotiation.</p>
                <Button onClick={() => router.push('/products')}>Back to Shop</Button>
            </div>
        );
    }

    const handleLockDeal = () => {
        if (!isAccepted) return;

        addItem({
            productId: product.id,
            productName: product.name,
            productImage: product.images[0],
            quantity: 1,
            originalPrice: product.price,
            finalPrice: finalPrice || product.price,
            negotiated: true,
            savingsPercent: ((product.price - (finalPrice || product.price)) / product.price) * 100
        });
        router.push('/cart');
    };

    // Helper to map AI Sentiment Payload to Emoji indicator
    const getSentimentEmoji = () => {
        if (!latestExplanation) return "🤖";

        const score = latestExplanation.sentiment;
        if (score > 0.4) return "😃";
        if (score > 0.1) return "🙂";
        if (score > -0.1) return "😐";
        if (score > -0.4) return "😕";
        return "😠";
    };

    // Extract SHAP Explanations
    const latestExplanations = latestExplanation?.explanation || [];

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background">
            {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

            {/* Top Banner */}
            <div className="bg-secondary/40 border-b border-border shrink-0">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                        <Link href={`/products/${product.id}`}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Product
                        </Link>
                    </Button>

                    <div className="flex items-center gap-4 text-sm font-semibold">
                        {!isAccepted && (
                            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 flex items-center gap-1.5 px-3 py-1">
                                <Clock className="w-3.5 h-3.5" /> Rounds: {currentRound} / {maxRounds}
                            </Badge>
                        )}
                        <Badge variant="secondary" className="bg-card shadow-sm border border-border px-3 py-1 flex items-center gap-2">
                            Sentiment: <span className="text-xl leading-none" title="AI Mood Indicator">{getSentimentEmoji()}</span>
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Main Negotiation Screen */}
            <div className="flex-1 container mx-auto px-0 md:px-4 flex flex-col lg:flex-row overflow-hidden pb-safe">

                {/* Chat Area (Left/Center) */}
                <div className="flex-1 flex flex-col relative h-full">
                    {socketError && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 text-center border-b border-destructive/20 font-medium">
                            {socketError}
                        </div>
                    )}

                    <ScrollArea className="flex-1 p-4 md:p-8" ref={scrollRef}>
                        <div className="max-w-3xl mx-auto pb-40">
                            {/* Product Context Intro Ticket */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm mb-8 flex flex-col sm:flex-row gap-6 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
                                <img src={product.images[0]} alt={product.name} className="w-24 h-24 sm:w-32 sm:h-32 object-contain bg-white rounded-xl border border-border shrink-0" />
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold text-foreground line-clamp-2">{product.name}</h3>
                                    <div className="mt-2 text-muted-foreground text-sm flex items-center gap-4">
                                        <span>List: <span className="line-through">{formatCurrency(product.price * 1.2)}</span></span>
                                        <span className="font-bold text-foreground text-lg">Current: {formatCurrency(product.price)}</span>
                                    </div>
                                    <p className="mt-3 text-sm text-primary font-medium flex items-center gap-1">
                                        <Sparkles className="w-4 h-4" /> AI Negotiation Protocol Initiated
                                    </p>
                                </div>
                            </motion.div>

                            {/* Chat Thread */}
                            <div className="space-y-6">
                                <AnimatePresence>
                                    {messages.map((msg, i) => (
                                        <ChatBubble key={`${msg.id}-${i}`} msg={msg} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Offer Input / Success State mapped to the bottom */}
                    <div className="w-full">
                        {isAccepted ? (
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-card border-t border-border p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:fixed lg:bottom-12 lg:w-full lg:max-w-4xl lg:left-1/2 lg:-translate-x-1/2 lg:rounded-2xl lg:border z-40"
                            >
                                <div className="text-center">
                                    <h3 className="text-2xl font-extrabold text-green-savings mb-2 tracking-tight">Deal Secured!</h3>
                                    <p className="text-muted-foreground mb-6">
                                        You successfully negotiated the price from <span className="line-through">{formatCurrency(product.price)}</span> to{" "}
                                        <strong className="text-foreground text-xl">{formatCurrency(finalPrice || product.price)}</strong>.
                                    </p>
                                    <Button size="lg" onClick={handleLockDeal} className="w-full sm:w-auto font-bold px-12 shadow-lg bg-green-500 hover:bg-green-600 text-white gap-2">
                                        <ShoppingCart className="w-5 h-5" /> Add to Cart & Lock Price
                                    </Button>
                                </div>
                            </motion.div>
                        ) : currentRound > maxRounds ? (
                            <div className="bg-card border-t border-border p-6 shadow-2xl lg:fixed lg:bottom-12 lg:w-full lg:max-w-4xl lg:left-1/2 lg:-translate-x-1/2 lg:rounded-2xl lg:border z-40 text-center">
                                <h3 className="text-xl font-bold text-destructive mb-2">Negotiation Failed</h3>
                                <p className="text-muted-foreground mb-6">
                                    We couldn't reach an agreement within the maximum allowed rounds. The item remains at its original price.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Button variant="outline" onClick={() => router.push(`/products/${product.id}`)}>Go Back</Button>
                                    <Button
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
                                    >
                                        Buy at Original Price
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <OfferInput
                                onSendOffer={(amount, msg) => submitOffer(amount)}
                                isAIThinking={isThinking}
                                minPrice={product.minPrice}
                            />
                        )}
                    </div>
                </div>

                {/* Right Sidebar (AI Insights & Explainability) - Hidden on mobile, visible on LG Desktop */}
                <div className="hidden lg:block w-80 shrink-0 border-l border-border bg-card/50 overflow-y-auto p-6 h-full">
                    <h3 className="font-bold text-foreground flex items-center gap-2 mb-6">
                        <Sparkles className="w-4 h-4 text-primary" /> AI Brain Insights
                    </h3>

                    <div className="space-y-6">
                        {/* SHAP Explanations Panel */}
                        <Card className="shadow-none bg-background border-border/60">
                            <CardContent className="p-4">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Decision Factors</h4>
                                {latestExplanations.length > 0 ? (
                                    <ul className="space-y-3">
                                        {latestExplanations.map((exp: string, idx: number) => (
                                            <motion.li
                                                key={idx}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="text-sm flex items-start gap-2"
                                            >
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                <span className="text-foreground leading-snug">{exp}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-sm text-muted-foreground italic text-center py-4 bg-secondary/30 rounded-lg">
                                        Awaiting initial offer to compute SHAP values and strategy...
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-none bg-background border-border/60">
                            <CardContent className="p-4">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Your Profile Impact</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Loyalty Tier</span>
                                        <Badge variant="outline" className={`${user?.tier === 'Gold' ? 'border-yellow-500 text-yellow-600' : 'border-primary text-primary'}`}>
                                            {user?.tier || 'Guest'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Patience Factor</span>
                                        <span className="font-semibold text-foreground">Round {currentRound || 1}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Confidence</span>
                                        <span className="font-semibold text-green-500">
                                            {latestExplanation
                                                ? `${Math.round((latestExplanation.confidence || 0.8) * 100)}%`
                                                : '80%'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-700 dark:text-blue-400 font-medium flex items-start gap-3">
                            <Info className="w-5 h-5 shrink-0" />
                            <p>Our Deep Reinforcement Learning agent (DQN) continuously maps your intent, sentiment, and pricing bounds to find a mutual win.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
