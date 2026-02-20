import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Globe2, ArrowRight, Sparkles, Shield, Trophy, Users, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const containerStyle = {
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px'
    };

    return (
        <div style={containerStyle}>
            {/* Animated Mesh Gradient Background */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%',
                background: 'radial-gradient(circle, rgba(0, 172, 193, 0.08) 0%, transparent 70%)',
                filter: 'blur(100px)', zIndex: 0
            }} />
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: '60%', height: '60%',
                background: 'radial-gradient(circle, rgba(124, 77, 255, 0.06) 0%, transparent 70%)',
                filter: 'blur(100px)', zIndex: 0
            }} />

            <div className="slide-up" style={{ position: 'relative', zIndex: 1, maxWidth: '800px', width: '100%' }}>
                <div style={{ marginBottom: '4rem' }}>
                    <div className="glow-effect" style={{
                        display: 'inline-flex', padding: '12px', background: 'var(--surface)',
                        borderRadius: '20px', marginBottom: '24px', boxShadow: 'var(--shadow)',
                        border: '1px solid var(--border)'
                    }}>
                        <Globe2 size={40} color="var(--primary)" />
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(3rem, 10vw, 4.5rem)', fontWeight: '900', marginBottom: '1rem',
                        letterSpacing: '-0.04em', lineHeight: '1',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #00acc1 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>
                        Civic Flow
                    </h1>
                    <p style={{
                        color: 'var(--text-muted)', fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                        maxWidth: '540px', margin: '0 auto', fontWeight: '500',
                        lineHeight: '1.6'
                    }}>
                        Empowering communities through artificial intelligence and transparent collective action.
                    </p>
                </div>

                <div className="glass-card" style={{
                    padding: '40px', width: '100%', maxWidth: '440px', margin: '0 auto',
                    background: 'var(--surface)', border: '1px solid var(--border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        <Sparkles size={16} />
                        <span>Central Intelligence Portal</span>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary"
                            style={{ padding: '18px', fontSize: '1.1rem', width: '100%', borderRadius: '16px' }}
                        >
                            <span>Enter Portal</span>
                            <ArrowRight size={20} />
                        </button>

                        <button
                            onClick={() => navigate('/register')}
                            style={{
                                padding: '16px', borderRadius: '16px', border: '1px solid var(--border)',
                                background: 'transparent', color: 'var(--text)', fontWeight: '600',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                transition: 'var(--transition)'
                            }}
                        >
                            <span>Create Citizen Account</span>
                        </button>
                    </div>

                    <div style={{
                        marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        color: 'var(--text-muted)', fontSize: '0.75rem'
                    }}>
                        <Shield size={14} />
                        <span>Protected by CivicGuard Identity Protocol</span>
                    </div>
                </div>

                <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 8vw, 60px)' }}>
                    {[
                        { label: 'Citizens', val: '12k+', icon: <Users size={16} /> },
                        { label: 'Issues', val: '2.5k+', icon: <CheckCircle size={16} /> },
                        { label: 'Accuracy', val: '98%', icon: <Trophy size={16} /> }
                    ].map((stat, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ color: 'var(--primary)', marginBottom: '4px' }}>{stat.icon}</div>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', lineHeight: '1' }}>{stat.val}</p>
                            <p style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
