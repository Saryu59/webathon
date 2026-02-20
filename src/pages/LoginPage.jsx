import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const lowerEmail = email.toLowerCase();
            const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

            // Strict Role Enforcement logic - Specific Admin Whitelist
            if (role === 'admin') {
                if (lowerEmail !== '24071a6959@vnrvjiet.in') {
                    setError('Access Denied: Only the primary administrator (24071A6959@vnrvjiet.in) can sign in.');
                    setIsLoading(false);
                    return;
                }
                // For demo purposes, we'll allow the admin login if email matches
                onLogin(role);
                navigate('/admin');
            } else {
                // Resident Login - Check if user exists in registration database
                const user = storedUsers.find(u => u.email === lowerEmail && u.password === password);

                if (user) {
                    onLogin(user.role || 'user', user);
                    navigate('/dashboard');
                } else {
                    setError('Invalid email or password. Please register an account if you haven’t already.');
                }
            }
            setIsLoading(false);
        }, 1200);
    };

    const containerStyle = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: '#0a192f', // Dark background
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Outfit', 'Inter', sans-serif"
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 10
    };

    const inputGroupStyle = {
        position: 'relative',
        marginBottom: '16px'
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 14px 14px 44px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.05)',
        color: 'white',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.3s'
    };

    const btnStyle = {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(135deg, var(--accent) 0%, #7c4dff 100%)',
        color: 'white',
        fontWeight: '700',
        fontSize: '1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '24px',
        transition: 'all 0.3s'
    };

    return (
        <div style={containerStyle}>
            {/* Background Decorative Gradients */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
                background: 'radial-gradient(circle, rgba(0, 172, 193, 0.15) 0%, transparent 70%)',
                filter: 'blur(60px)', zIndex: 0
            }} />
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
                background: 'radial-gradient(circle, rgba(124, 77, 255, 0.1) 0%, transparent 70%)',
                filter: 'blur(60px)', zIndex: 0
            }} />

            <div style={cardStyle}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '64px', height: '64px', background: 'linear-gradient(135deg, var(--accent) 0%, #7c4dff 100%)',
                        borderRadius: '16px', marginBottom: '16px', boxShadow: '0 8px 16px rgba(0, 172, 193, 0.3)'
                    }}>
                        <LogIn size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Civic Flow</h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>Sign in to continue</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(229, 57, 53, 0.1)',
                        border: '1px solid rgba(229, 57, 53, 0.3)',
                        borderRadius: '12px',
                        padding: '12px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#ef5350',
                        fontSize: '0.85rem'
                    }}>
                        <ShieldCheck size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <div style={{ display: 'flex', padding: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', marginBottom: '24px' }}>
                        <button
                            type="button"
                            onClick={() => setRole('user')}
                            style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '10px', borderRadius: '8px', border: 'none', transition: 'all 0.3s',
                                background: role === 'user' ? 'var(--accent)' : 'transparent',
                                color: role === 'user' ? 'white' : 'rgba(255, 255, 255, 0.4)'
                            }}
                        >
                            <User size={18} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Resident</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '10px', borderRadius: '8px', border: 'none', transition: 'all 0.3s',
                                background: role === 'admin' ? '#7c4dff' : 'transparent',
                                color: role === 'admin' ? 'white' : 'rgba(255, 255, 255, 0.4)'
                            }}
                        >
                            <ShieldCheck size={18} />
                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Admin</span>
                        </button>
                    </div>

                    <div style={inputGroupStyle}>
                        <Mail className="absolute" style={{ position: 'absolute', left: '14px', top: '14px', color: 'rgba(255, 255, 255, 0.3)' }} size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            style={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <Lock className="absolute" style={{ position: 'absolute', left: '14px', top: '14px', color: 'rgba(255, 255, 255, 0.3)' }} size={18} />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            style={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={btnStyle}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {isLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className="spin" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></div>
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
