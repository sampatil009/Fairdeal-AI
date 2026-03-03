import { dashboardStats } from '@/lib/db';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { BarChart3, Users, ShoppingBag, TrendingUp, Award, DollarSign } from 'lucide-react';

export default function DashboardPage() {
    const stats = dashboardStats;

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: '#6c63ff', bg: 'rgba(108,99,255,0.1)', change: '+12.4%' },
        { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingBag, color: '#ff6584', bg: 'rgba(255,101,132,0.1)', change: '+8.1%' },
        { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: '#43e97b', bg: 'rgba(67,233,123,0.1)', change: '+15.3%' },
        { label: 'Negotiation Success', value: `${stats.negotiationSuccessRate}%`, icon: Award, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', change: '+2.1%' },
        { label: 'Avg Savings', value: `${stats.averageSavings}%`, icon: TrendingUp, color: '#38b2f9', bg: 'rgba(56,178,249,0.1)', change: '+0.8%' },
    ];

    const maxRevenue = Math.max(...stats.revenueByMonth.map(m => m.revenue));

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ color: '#f0f0ff', fontWeight: 800, fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <BarChart3 size={32} color="#6c63ff" /> Admin Dashboard
                </h1>
                <p style={{ color: '#8a8ab0' }}>Overview of FairDeal AI platform performance</p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {statCards.map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <s.icon size={22} color={s.color} />
                            </div>
                            <span style={{ color: '#43e97b', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(67,233,123,0.1)', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                                {s.change}
                            </span>
                        </div>
                        <p style={{ color: '#8a8ab0', fontSize: '0.8rem', marginBottom: '0.35rem' }}>{s.label}</p>
                        <p style={{ color: '#f0f0ff', fontWeight: 800, fontSize: '1.6rem' }}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Revenue chart */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ color: '#f0f0ff', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>Monthly Revenue</h2>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '160px' }}>
                        {stats.revenueByMonth.map(m => {
                            const h = (m.revenue / maxRevenue) * 100;
                            return (
                                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                                    <span style={{ color: '#6c63ff', fontSize: '0.65rem', fontWeight: 600 }}>${(m.revenue / 1000).toFixed(0)}k</span>
                                    <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(to top, #6c63ff, #9d71ff)', borderRadius: '0.5rem 0.5rem 0 0', transition: 'height 0.4s', minHeight: '8px' }} />
                                    <span style={{ color: '#8a8ab0', fontSize: '0.7rem' }}>{m.month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top negotiated products */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h2 style={{ color: '#f0f0ff', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>Top Negotiated Products</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {stats.topNegotiatedProducts.map((p, i) => (
                            <div key={p.productId} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ color: '#8a8ab0', fontWeight: 700, fontSize: '0.8rem', minWidth: '20px' }}>#{i + 1}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ color: '#c0c0e0', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                                        <span style={{ color: '#43e97b', fontWeight: 600, fontSize: '0.8rem', flexShrink: 0, marginLeft: '0.5rem' }}>{p.successRate}%</span>
                                    </div>
                                    <div style={{ height: '4px', background: '#2a2a3e', borderRadius: '2px' }}>
                                        <div style={{ height: '100%', width: `${p.successRate}%`, background: 'linear-gradient(90deg, #6c63ff, #43e97b)', borderRadius: '2px' }} />
                                    </div>
                                    <span style={{ color: '#8a8ab0', fontSize: '0.7rem' }}>{p.negotiations} negotiations</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Negotiation stats */}
            <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                <h2 style={{ color: '#f0f0ff', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>AI Negotiation Insights</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { label: 'Success Rate', value: `${stats.negotiationSuccessRate}%`, icon: '🎯' },
                        { label: 'Avg Savings', value: `${stats.averageSavings}%`, icon: '💰' },
                        { label: 'Total Negotiations', value: '6,284', icon: '🤖' },
                        { label: 'Avg Rounds per Deal', value: '2.3', icon: '🔄' },
                        { label: 'Badge Achievers', value: '1,201', icon: '🏆' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid #1e1e2e' }}>
                            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                            <div style={{ color: '#f0f0ff', fontWeight: 800, fontSize: '1.25rem' }}>{s.value}</div>
                            <div style={{ color: '#8a8ab0', fontSize: '0.75rem' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
