'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
    const { login, isLoading, error, clearError } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const ok = await login(email, password);
        if (ok) router.push('/');
    }

    return (
        <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #6c63ff, #ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Zap size={28} color="white" />
                    </div>
                    <h1 style={{ color: '#f0f0ff', fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: '#8a8ab0' }}>Sign in to continue negotiating great deals</p>
                </div>

                <div className="glass" style={{ padding: '2rem', borderRadius: '1.25rem' }}>
                    {/* Demo hint */}
                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#8a8ab0' }}>
                        <strong style={{ color: '#6c63ff' }}>Demo Accounts:</strong><br />
                        buyer@fairdeal.ai / password123 (Bronze)<br />
                        gold@fairdeal.ai / goldpass123 (Gold)<br />
                        admin@fairdeal.ai / admin123 (Admin)
                    </div>

                    {error && (
                        <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.75rem', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ color: '#8a8ab0', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8a8ab0' }} />
                                <input type="email" required value={email} onChange={e => { setEmail(e.target.value); clearError(); }} placeholder="you@example.com" className="input-base" style={{ paddingLeft: '2.25rem' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ color: '#8a8ab0', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8a8ab0' }} />
                                <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => { setPassword(e.target.value); clearError(); }} placeholder="••••••••" className="input-base" style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }} />
                                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8a8ab0', cursor: 'pointer', display: 'flex' }}>
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                            {isLoading ? '⏳ Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', color: '#8a8ab0', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    Don't have an account?{' '}
                    <Link href="/register" style={{ color: '#6c63ff', fontWeight: 600, textDecoration: 'none' }}>Create account</Link>
                </p>
            </div>
        </div>
    );
}
