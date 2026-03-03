import Link from 'next/link';
import { Swords, Star, TrendingUp, Shield, Zap, ChevronRight, Package } from 'lucide-react';
import { products } from '@/lib/db';
import { ProductCard } from '@/components/product/ProductCard';

export default function HomePage() {
    const featured = products.filter((p) => p.featured).slice(0, 4);
    const negotiable = products.filter((p) => p.negotiationEnabled).slice(0, 4);

    return (
        <div>
            {/* ── Hero Section ───────────────────────────────────────── */}
            <section style={{ position: 'relative', padding: '6rem 1.5rem 5rem', textAlign: 'center', overflow: 'hidden' }}>
                {/* Background glow blobs */}
                <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                    <div className="badge animate-fade-in" style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', color: '#6c63ff', marginBottom: '1.5rem', padding: '0.4rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={14} /> AI-Powered Price Negotiation
                    </div>

                    <h1 style={{ fontWeight: 900, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem', color: '#f0f0ff' }}>
                        Stop Paying <br />
                        <span className="gradient-text">Full Price.</span> <br />
                        Negotiate with AI.
                    </h1>

                    <p style={{ color: '#8a8ab0', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
                        FairDeal AI lets you negotiate product prices in real-time with our intelligent pricing engine. Get the deals you deserve.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/products" className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                            <Package size={18} /> Shop Now
                        </Link>
                        <Link href="/products?negotiationEnabled=true" className="btn-green" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                            <Swords size={18} /> Start Negotiating
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                        {[
                            { icon: '🛡️', text: 'Secure Payments' },
                            { icon: '⚡', text: 'Instant Deals' },
                            { icon: '🏆', text: '68% Success Rate' },
                            { icon: '💰', text: 'Avg 12% Savings' },
                        ].map((t) => (
                            <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8a8ab0', fontSize: '0.875rem' }}>
                                <span>{t.icon}</span>
                                <span>{t.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ───────────────────────────────────────── */}
            <section style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '2rem', color: '#f0f0ff', marginBottom: '0.75rem' }}>How It Works</h2>
                <p style={{ textAlign: 'center', color: '#8a8ab0', marginBottom: '3rem' }}>Three simple steps to your best deal</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { icon: '🛒', step: '01', title: 'Browse Products', desc: 'Explore our catalog with negotiation-enabled items marked clearly.' },
                        { icon: '🤖', step: '02', title: 'Make an Offer', desc: 'Open the AI chat and submit your price offer. Our engine responds instantly.' },
                        { icon: '🎉', step: '03', title: 'Lock the Deal', desc: 'Accept the counter-offer and checkout at your negotiated price.' },
                    ].map((s) => (
                        <div key={s.step} className="glass" style={{ padding: '2rem', borderRadius: '1rem', textAlign: 'center', position: 'relative' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6c63ff', letterSpacing: '0.1em', marginBottom: '0.75rem', opacity: 0.6 }}>STEP {s.step}</div>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
                            <h3 style={{ color: '#f0f0ff', fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</h3>
                            <p style={{ color: '#8a8ab0', fontSize: '0.875rem', lineHeight: 1.6 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Featured Products ───────────────────────────────────── */}
            <section style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ color: '#f0f0ff', fontWeight: 800, fontSize: '1.75rem' }}>Featured Products</h2>
                        <p style={{ color: '#8a8ab0', fontSize: '0.9rem' }}>Hand-picked top deals</p>
                    </div>
                    <Link href="/products" style={{ color: '#6c63ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
                        View All <ChevronRight size={16} />
                    </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
                    {featured.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
            </section>

            {/* ── Negotiable Products ─────────────────────────────────── */}
            <section style={{ padding: '4rem 1.5rem', background: 'rgba(108,99,255,0.03)', borderTop: '1px solid #1e1e2e', borderBottom: '1px solid #1e1e2e' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div className="badge" style={{ background: 'rgba(67,233,123,0.1)', border: '1px solid rgba(67,233,123,0.3)', color: '#43e97b', marginBottom: '1rem', padding: '0.4rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Swords size={14} /> AI Negotiation Available
                        </div>
                        <h2 style={{ color: '#f0f0ff', fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.5rem' }}>Negotiate & Save</h2>
                        <p style={{ color: '#8a8ab0' }}>These products support real-time AI price negotiation</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
                        {negotiable.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>
            </section>

            {/* ── Tier CTA ────────────────────────────────────────────── */}
            <section style={{ padding: '5rem 1.5rem', maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ color: '#f0f0ff', fontWeight: 800, fontSize: '2rem', marginBottom: '1rem' }}>Unlock Better Discounts with Higher Tiers</h2>
                <p style={{ color: '#8a8ab0', marginBottom: '2.5rem', lineHeight: 1.7 }}>Your loyalty tier determines how aggressively you can negotiate.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1rem' }}>
                    {[
                        { emoji: '🥉', name: 'Bronze', max: '5%', color: '#b45309' },
                        { emoji: '🥈', name: 'Silver', max: '10%', color: '#6b7280' },
                        { emoji: '🥇', name: 'Gold', max: '15%', color: '#d97706' },
                        { emoji: '💎', name: 'Platinum', max: '20%', color: '#0891b2' },
                    ].map((t) => (
                        <div key={t.name} className="glass" style={{ padding: '1.5rem 1rem', borderRadius: '1rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.emoji}</div>
                            <div style={{ color: t.color, fontWeight: 700, marginBottom: '0.25rem' }}>{t.name}</div>
                            <div style={{ color: '#f0f0ff', fontWeight: 800, fontSize: '1.25rem' }}>{t.max} off</div>
                            <div style={{ color: '#8a8ab0', fontSize: '0.75rem' }}>max discount</div>
                        </div>
                    ))}
                </div>
                <Link href="/register" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-flex', padding: '0.875rem 2rem' }}>
                    Start Negotiating Free
                </Link>
            </section>
        </div>
    );
}
