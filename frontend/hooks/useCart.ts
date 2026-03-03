'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/order';

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    applyNegotiatedPrice: (productId: string, finalPrice: number, sessionId: string, savingsPercent: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
    getSavings: () => number;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) =>
                set((state) => {
                    const existing = state.items.find((i) => i.productId === item.productId);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.productId === item.productId
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),

            removeItem: (productId) =>
                set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    items:
                        quantity <= 0
                            ? state.items.filter((i) => i.productId !== productId)
                            : state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
                })),

            applyNegotiatedPrice: (productId, finalPrice, sessionId, savingsPercent) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.productId === productId
                            ? { ...i, finalPrice, negotiated: true, negotiationSessionId: sessionId, savingsPercent }
                            : i
                    ),
                })),

            clearCart: () => set({ items: [] }),

            getTotal: () => get().items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0),
            getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
            getSavings: () =>
                get().items.reduce((sum, i) => sum + (i.originalPrice - i.finalPrice) * i.quantity, 0),
        }),
        { name: 'fairdeal-cart' }
    )
);
