'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { ChatMessage } from '@/types/negotiation';
import { siteConfig } from '@/config/site';

interface AIExplanation {
    explanation: string[];
    sentiment: number;
    confidence: number;
}

export function useNegotiationSocket(productId: string) {
    const { token } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [currentRound, setCurrentRound] = useState(1);
    const [isAccepted, setIsAccepted] = useState(false);
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [savingsPercent, setSavingsPercent] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [latestExplanation, setLatestExplanation] = useState<AIExplanation | null>(null);

    const maxRounds = siteConfig.maxNegotiationRounds;

    useEffect(() => {
        if (!token) return;

        const s = io('http://localhost:5000', {
            auth: { token },
            transports: ['websocket'],
        });

        s.on('connect', () => {
            s.emit('join_negotiation', { productId });
        });

        s.on('negotiation_history', (data: any) => {
            if (data.messages) setMessages(data.messages);
            setCurrentRound(data.currentRound || 1);
            if (data.status === 'accepted') {
                setIsAccepted(true);
                setFinalPrice(data.finalPrice);
                setSavingsPercent(data.savingsPercent);
            }
        });

        s.on('receive_message', (msg: ChatMessage) => {
            setIsThinking(false);
            setMessages(p => [...p, msg]);

            // Extract AI explanation data if it exists
            if (msg.sender === 'ai' && msg.metadata?.explanation) {
                setLatestExplanation(msg.metadata as AIExplanation);
            }
        });

        s.on('round_update', (round: number) => {
            setCurrentRound(round);
        });

        s.on('deal_accepted', (data: any) => {
            setIsThinking(false);
            setIsAccepted(true);
            setFinalPrice(data.price);
            setSavingsPercent(data.savingsPercent);
        });

        s.on('negotiation_error', (err: any) => {
            setIsThinking(false);
            setError(err.message);
        });

        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, [productId, token]);

    const startNegotiation = async (originalPrice: number) => {
        if (messages.length === 0) {
            setMessages([{
                id: 'welcome',
                sender: 'ai',
                text: `Hi! I'm the FairDeal pricing AI. This item lists for $${originalPrice}. What's your offer?`,
                timestamp: new Date().toISOString(),
            }]);
        }
    };

    const submitOffer = (price: number) => {
        if (!socket || isAccepted || currentRound > maxRounds) return;

        setError(null);
        setIsThinking(true);

        const msg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: `I'll offer $${price}`,
            offerAmount: price,
            timestamp: new Date().toISOString()
        };

        setMessages(p => [...p, msg]);
        socket.emit('send_offer', { productId, offer: price });
    };

    return {
        messages,
        isThinking,
        currentRound,
        roundsLeft: Math.max(0, maxRounds - currentRound),
        maxRounds,
        isAccepted,
        finalPrice,
        savingsPercent,
        error,
        latestExplanation,
        startNegotiation,
        submitOffer,
    };
}
