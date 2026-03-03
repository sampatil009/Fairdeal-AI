'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const tiers = [
    { value: 'Bronze', label: '🥉 Bronze – 5% max discount', desc: 'Perfect to start your journey' },
    { value: 'Silver', label: '🥈 Silver – 10% max discount', desc: 'For regular shoppers' },
    { value: 'Gold', label: '🥇 Gold – 15% max discount', desc: 'Best value for power buyers' },
    { value: 'Platinum', label: '💎 Platinum – 20% max discount', desc: 'Ultimate deal seeker tier' },
];

export default function RegisterPage() {
    const { register, isLoading, error, clearError } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '', tier: 'Bronze' });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const ok = await register(form.name, form.email, form.password, form.tier);
        if (ok) router.push('/');
    }

    function update(key: string, value: string) {
        setForm(prev => ({ ...prev, [key]: value }));
        clearError();
    }

    return (
        <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ width: '100%', maxWidth: '480px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #6c63ff, #ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Zap size={28} color="white" />
                    </div>
                    <h1 style={{ color: '#f0f0ff', fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: '#8a8ab0' }}>Join FairDeal AI and start negotiating smarter deals</p>
                </div>

                <div className="glass" style={{ padding: '2rem', borderRadius: '1.25rem' }}>
                    {error && (
                        <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.75rem', color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: User },
                            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: Mail },
                            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••', icon: Lock },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={{ color: '#8a8ab0', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>{f.label}</label>
                                <div style={{ position: 'relative' }}>
                                    <f.icon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8a8ab0' }} />
                                    <input type={f.type} required value={(form as any)[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder} className="input-base" style={{ paddingLeft: '2.25rem' }} />
                                </div>
                            </div>
                        ))}

                        {/* Tier selection */}
                        <div>
                            <label style={{ color: '#8a8ab0', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Select Your Tier</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                {tiers.map(t => (
                                    <button key={t.value} type="button" onClick={() => update('tier', t.value)} style={{ padding: '0.75rem', borderRadius: '0.75rem', border: `1px solid ${form.tier === t.value ? '#6c63ff' : '#1e1e2e'}`, background: form.tier === t.value ? 'rgba(108,99,255,0.1)' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: form.tier === t.value ? '#6c63ff' : '#f0f0ff', marginBottom: '0.2rem' }}>{t.label.split('–')[0]}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#8a8ab0' }}>{t.label.split('–')[1]?.trim()}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                            {isLoading ? '⏳ Creating account...' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', color: '#8a8ab0', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: '#6c63ff', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
