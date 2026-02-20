import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default to Resident
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay for registration
        setTimeout(() => {
            // Save user to simulated database (localStorage)
            const newUser = {
                fullName,
                email: email.toLowerCase(),
                password, // In a real app, this would be hashed
                role
            };

            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));

            setIsLoading(false);
            setSuccess(true);

            // Auto redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }, 1500);
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
        maxWidth: '450px',
        padding: '40px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 10,
        textAlign: 'center'
    };

    const inputGroupStyle = {
        position: 'relative',
        marginBottom: '16px',
        textAlign: 'left'
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

    if (success) {
        return (
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '80px', height: '80px', background: 'rgba(67, 160, 71, 0.1)',
                        borderRadius: '50%', marginBottom: '24px', color: '#43a047'
                    }}>
                        <UserPlus size={40} />
                    </div>
                    <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '16px' }}>Account Created!</h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '32px' }}>
                        Welcome to the community. Redirecting you to the login portal...
                    </p>
                    <div className="spin" style={{
                        width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)',
                        borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto'
                    }}></div>
                </div>
            </div>
        );
    }

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
                        <UserPlus size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Create Account</h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>Join the Civic Flow community</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <User style={{ position: 'absolute', left: '14px', top: '14px', color: 'rgba(255, 255, 255, 0.3)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            style={inputStyle}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <Mail style={{ position: 'absolute', left: '14px', top: '14px', color: 'rgba(255, 255, 255, 0.3)' }} size={18} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            style={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <Lock style={{ position: 'absolute', left: '14px', top: '14px', color: 'rgba(255, 255, 255, 0.3)' }} size={18} />
                        <input
                            type="password"
                            placeholder="Create Password"
                            required
                            style={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Role Selection (Simplified for Register) */}
                    <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '10px' }}>Sign up as:</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: role === 'user' ? 'rgba(0, 172, 193, 0.2)' : 'transparent',
                                    borderColor: role === 'user' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                                    color: role === 'user' ? 'white' : 'rgba(255,255,255,0.4)',
                                    fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.3s'
                                }}
                            >Resident</button>
                            <button
                                type="button"
                                onClick={() => setRole('volunteer')}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: role === 'volunteer' ? 'rgba(124, 77, 255, 0.2)' : 'transparent',
                                    borderColor: role === 'volunteer' ? '#7c4dff' : 'rgba(255,255,255,0.1)',
                                    color: role === 'volunteer' ? 'white' : 'rgba(255,255,255,0.4)',
                                    fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.3s'
                                }}
                            >Volunteer</button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={btnStyle}
                    >
                        {isLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className="spin" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></div>
                                <span>Creating Account...</span>
                            </div>
                        ) : (
                            <>
                                <span>Register</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
