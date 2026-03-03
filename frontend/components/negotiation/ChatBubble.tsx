'use client';

import { motion } from 'framer-motion';
import { ChatMessage } from '@/types/negotiation';
import { formatCurrency } from '@/lib/utils';
import { Bot, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatBubbleProps {
    msg: ChatMessage;
}

export function ChatBubble({ msg }: ChatBubbleProps) {
    const isAI = msg.sender === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                duration: 0.3
            }}
            className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'} mb-6`}
        >
            <div className={`flex gap-3 max-w-[85%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>

                {/* Avatar */}
                <Avatar className={`w-10 h-10 border-2 shadow-sm ${isAI ? 'border-primary/20 bg-primary/10' : 'border-secondary bg-secondary'}`}>
                    <AvatarFallback>
                        {isAI ? <Bot className="w-5 h-5 text-primary" /> : <UserIcon className="w-5 h-5 text-muted-foreground" />}
                    </AvatarFallback>
                </Avatar>

                {/* Bubble */}
                <div className={`relative px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${isAI
                    ? 'bg-card border border-border text-foreground chat-ai'
                    : 'bg-primary text-primary-foreground chat-user'
                    }`}>
                    {/* Formatted Content */}
                    <div className="whitespace-pre-wrap">
                        {msg.text.split(/\n/).map((line, i) => (
                            <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                        ))}
                    </div>

                    {/* Pricing Highlight Pill */}
                    {msg.offerAmount && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`mt-3 inline-flex items-center px-4 py-2 font-bold rounded-xl text-lg shadow-sm border ${isAI
                                ? 'bg-background border-primary/20 text-primary'
                                : 'bg-primary-foreground/10 border-white/20 text-white'
                                }`}
                        >
                            Offer: {formatCurrency(msg.offerAmount)}
                        </motion.div>
                    )}

                    {/* Timestamp */}
                    <div className={`text-[10px] mt-2 font-medium ${isAI ? 'text-muted-foreground' : 'text-primary-foreground/70 text-right'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
