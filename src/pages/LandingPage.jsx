import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Globe2 } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleSignIn = (role) => {
        localStorage.setItem('userRole', role);
        localStorage.setItem('isLoggedIn', 'true');
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div className="fade-in">
                <div style={{ marginBottom: '2rem' }}>
                    <Globe2 size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Civic Flow</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Empowering communities through transparent action.
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Sign In to Continue</h2>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <button
                            onClick={() => handleSignIn('user')}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                        >
                            <User size={20} />
                            User Sign In
                        </button>

                        <button
                            onClick={() => handleSignIn('admin')}
                            style={{
                                background: 'transparent',
                                border: '2px solid var(--primary)',
                                color: 'var(--primary)',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px'
                            }}
                        >
                            <ShieldCheck size={20} />
                            Admin Sign In
                        </button>
                    </div>

                    <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        By signing in, you agree to our terms of civic responsibility.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
