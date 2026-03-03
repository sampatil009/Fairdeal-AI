'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    tier: string;
}

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string, tier?: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
                    set({ user: res.data.user, token: res.data.token, isLoading: false });
                    return true;
                } catch (err: any) {
                    set({ error: err.response?.data?.error || 'Network error', isLoading: false });
                    return false;
                }
            },

            register: async (name, email, password, tier = 'Bronze') => {
                set({ isLoading: true, error: null });
                try {
                    const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, tier });
                    set({ user: res.data.user, token: res.data.token, isLoading: false });
                    return true;
                } catch (err: any) {
                    set({ error: err.response?.data?.error || 'Network error', isLoading: false });
                    return false;
                }
            },

            logout: () => set({ user: null, token: null }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'fairdeal-auth',
            partialize: (state) => ({ user: state.user, token: state.token }),
        }
    )
);
