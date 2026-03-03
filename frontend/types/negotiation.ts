export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai' | 'system';
    text: string;
    offerAmount?: number;
    timestamp: string;
    metadata?: any;
    explainabilityData?: {
        sentiment: number;
        confidence: number;
        explanation: string[];
    };
}

export interface NegotiationSession {
    id: string;
    productId: string;
    userId?: string; // Legacy
    originalPrice?: number; // Legacy
    minPrice?: number; // Legacy
    messages?: any[]; // Legacy
    createdAt?: string; // Legacy
    updatedAt?: string; // Legacy
    status: 'active' | 'accepted' | 'rejected' | 'timeout';
    currentRound?: number;
    maxRounds?: number;
    finalPrice?: number;
    savingsPercent?: number;
    [key: string]: any; // Allow legacy properties
}

export interface NegotiationRound {
    [key: string]: any;
}

export interface CounterOfferResult {
    [key: string]: any;
}
