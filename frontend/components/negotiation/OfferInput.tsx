'use client';

import { useState } from 'react';
import { Send, IndianRupee, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface OfferInputProps {
    onSendOffer: (amount: number, message: string) => void;
    isAIThinking: boolean;
    minPrice: number;
}

export function OfferInput({ onSendOffer, isAIThinking, minPrice }: OfferInputProps) {
    const [offerAmt, setOfferAmt] = useState<string>('');
    const [msg, setMsg] = useState<string>('');

    const handleSend = () => {
        const amt = parseFloat(offerAmt);
        if (!amt || isNaN(amt) || minPrice <= 0) return;
        onSendOffer(amt, msg || `I can offer ₹${amt.toLocaleString('en-IN')}.`);
        setOfferAmt('');
        setMsg('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full bg-card border-t border-border p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-2xl md:rounded-b-2xl md:border md:-bottom-6 lg:fixed lg:bottom-12 lg:w-full lg:max-w-4xl lg:left-1/2 lg:-translate-x-1/2 lg:shadow-2xl z-40 transition-all">

            {/* AI Thinking State */}
            <AnimatePresence>
                {isAIThinking && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex items-center gap-3 text-sm font-medium text-primary mb-3 bg-primary/10 px-4 py-2 rounded-full w-max mx-auto border border-primary/20 shadow-sm"
                    >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="animate-pulse">AI is computing the best deal...</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-3">
                {/* Required Number Input */}
                <div className="relative w-full sm:w-48 shrink-0 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <IndianRupee className="h-5 w-5" />
                    </div>
                    <Input
                        type="number"
                        min={minPrice * 0.5} // Don't let them easily offer $1
                        step="1"
                        placeholder="Your Offer"
                        className="pl-9 h-14 text-lg font-bold bg-secondary/50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                        value={offerAmt}
                        onChange={(e) => setOfferAmt(e.target.value)}
                        disabled={isAIThinking}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {/* Optional Context Message */}
                <div className="flex-1 flex gap-2">
                    <Input
                        type="text"
                        placeholder="Add a message (e.g. 'I'm a loyal customer buying today')"
                        className="flex-1 h-14 bg-secondary/50 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        disabled={isAIThinking}
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isAIThinking || !offerAmt}
                        size="icon"
                        className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-blue-600 to-primary hover:opacity-90 shadow-md transition-all hover:scale-105"
                    >
                        <Send className="h-5 w-5 text-white" />
                    </Button>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between px-2">
                <p className="text-xs text-muted-foreground hidden sm:block">
                    Press <kbd className="px-2 py-1 bg-secondary rounded-md font-sans font-bold border border-border mx-1">Enter ↵</kbd> to submit your official offer
                </p>
                <Badge variant="outline" className="text-xs text-muted-foreground bg-transparent border-0 font-normal ml-auto">
                    Powered by FairDeal AI Engine
                </Badge>
            </div>
        </div>
    );
}
