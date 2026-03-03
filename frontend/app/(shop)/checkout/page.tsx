'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ShoppingBag, Tag, CreditCard } from 'lucide-react';
import axios from 'axios';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';

export default function CheckoutPage() {
    const { items, getTotal, getSavings, clearCart } = useCart();
    const { user, token } = useAuth();
    const [step, setStep] = useState<'details' | 'success'>('details');
    const [isProcessing, setIsProcessing] = useState(false);
    const [form, setForm] = useState({ fullName: user?.name || '', address: '', city: '', state: '', zipCode: '', country: 'US' });

    const total = getTotal();
    const savings = getSavings();

    async function handlePlaceOrder(e: React.FormEvent) {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(r => setTimeout(r, 2000));

        try {
            await axios.post('http://localhost:5000/api/orders',
                { items, shippingAddress: form, paymentMethod: 'Credit Card (Simulated)' },
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
        } catch { }

        clearCart();
        setStep('success');
        setIsProcessing(false);
    }

    if (items.length === 0 && step !== 'success') {
        return (
            <div style={{ textAlign: 'center', padding: '8rem 1.5rem' }}>
                <ShoppingBag size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.3, display: 'block', color: '#8a8ab0' }} />
                <h2 style={{ color: '#f0f0ff', marginBottom: '1rem' }}>No items to checkout</h2>
                <Link href="/products" className="btn-primary">Shop Now</Link>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div style={{ textAlign: 'center', padding: '8rem 1.5rem', maxWidth: '560px', margin: '0 auto' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(67,233,123,0.15)', border: '2px solid #43e97b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem' }}>
                    🎉
                </div>
                <h1 style={{ color: '#f0f0ff', fontWeight: 800, fontSize: '2rem', marginBottom: '0.75rem' }}>Order Placed!</h1>
                <p style={{ color: '#8a8ab0', marginBottom: '0.5rem' }}>Your order has been successfully placed and is being processed.</p>
                {savings > 0 && <p style={{ color: '#43e97b', fontWeight: 600, marginBottom: '2rem' }}>You saved {formatCurrency(savings)} through AI negotiation! 🤖</p>}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/products" className="btn-primary">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            <h1 style={{ color: '#f0f0ff', fontWeight: 800, fontSize: '2rem', marginBottom: '2rem' }}>Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
                {/* Form */}
                <form onSubmit={handlePlaceOrder}>
                    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ color: '#f0f0ff', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShoppingBag size={18} color="#6c63ff" /> Shipping Information
                        </h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {[
                                { key: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
                                { key: 'address', label: 'Street Address', placeholder: '123 Main St' },
                                { key: 'city', label: 'City', placeholder: 'New York' },
                                { key: 'state', label: 'State', placeholder: 'NY' },
                                { key: 'zipCode', label: 'ZIP Code', placeholder: '10001' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label style={{ color: '#8a8ab0', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>{f.label}</label>
                                    <input
                                        required
                                        className="input-base"
                                        placeholder={f.placeholder}
                                        value={(form as any)[f.key]}
                                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ color: '#f0f0ff', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CreditCard size={18} color="#6c63ff" /> Payment
                        </h2>
                        <div style={{ padding: '1rem', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '0.75rem', color: '#8a8ab0', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <CreditCard size={20} color="#6c63ff" />
                            Demo Mode — Simulated payment (no real charge)
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={isProcessing} style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', justifyContent: 'center' }}>
                        {isProcessing ? '⏳ Processing...' : `Place Order · ${formatCurrency(total)}`}
                    </button>
                </form>

                {/* Order summary */}
                <div className="card" style={{ padding: '1.5rem', minWidth: '270px', position: 'sticky', top: '80px' }}>
                    <h3 style={{ color: '#f0f0ff', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Order Summary</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                        {items.map(item => (
                            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: '#8a8ab0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{item.productName} ×{item.quantity}</span>
                                <span style={{ color: item.negotiated ? '#43e97b' : '#f0f0ff', fontWeight: 600 }}>{formatCurrency(item.finalPrice * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ height: '1px', background: '#1e1e2e', marginBottom: '1rem' }} />
                    {savings > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#43e97b', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                            <span><Tag size={12} style={{ display: 'inline' }} /> Savings</span><span>-{formatCurrency(savings)}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f0f0ff', fontWeight: 700, fontSize: '1.1rem' }}>
                        <span>Total</span><span>{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
