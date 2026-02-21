import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { UserPlus, User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

// Password strength calculator
const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { score, label: 'Fair', color: '#f97316' };
    if (score === 3) return { score, label: 'Good', color: '#eab308' };
    if (score === 4) return { score, label: 'Strong', color: '#22c55e' };
    return { score: 5, label: 'Very Strong', color: '#10b981' };
};

const RegisterPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [cameraPermission, setCameraPermission] = useState('pending'); // 'pending' | 'granted' | 'denied'
    const [showCameraBanner, setShowCameraBanner] = useState(true);
    const navigate = useNavigate();

    // Request camera permission on signup page load
    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    setCameraPermission('granted');
                    // Stop the stream immediately — we just needed permission
                    stream.getTracks().forEach(track => track.stop());
                })
                .catch(() => {
                    setCameraPermission('denied');
                });
        } else {
            setCameraPermission('denied');
        }
    }, []);

    const strength = getPasswordStrength(password);
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    const validate = () => {
        const e = {};
        if (!fullName.trim()) e.fullName = 'Full name is required';
        if (!email.trim()) e.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
        if (phone && !/^\+?[\d\s\-()]{7,15}$/.test(phone)) e.phone = 'Enter a valid phone number';
        if (!password) e.password = 'Password is required';
        else if (password.length < 6) e.password = 'Password must be at least 6 characters';
        if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
        else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        setTouched({ fullName: true, email: true, phone: true, password: true, confirmPassword: true });
        if (Object.keys(errs).length > 0) return;

        setIsLoading(true);
        setTimeout(() => {
            const newUser = { fullName, email: email.toLowerCase(), phone, password, role };
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const alreadyExists = existingUsers.some(u => u.email === email.toLowerCase());
            if (alreadyExists) {
                setErrors({ email: 'An account with this email already exists.' });
                setTouched(t => ({ ...t, email: true }));
                setIsLoading(false);
                return;
            }
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            setIsLoading(false);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2200);
        }, 1400);
    };

    const handleBlur = (field) => setTouched(t => ({ ...t, [field]: true }));

    const inputWrapper = { position: 'relative', marginBottom: '4px' };
    const inputBase = {
        width: '100%',
        padding: '14px 42px 14px 44px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.04)',
        color: 'white',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        boxSizing: 'border-box',
        fontFamily: "inherit"
    };
    const iconLeft = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' };
    const iconRight = { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', padding: 0, display: 'flex' };
    const errorText = { color: '#f87171', fontSize: '0.75rem', marginTop: '5px', marginLeft: '4px', display: 'flex', alignItems: 'center', gap: '4px' };

    const getInputStyle = (field) => ({
        ...inputBase,
        borderColor: touched[field] && errors[field]
            ? 'rgba(248,113,113,0.6)'
            : touched[field] && !errors[field]
                ? 'rgba(34,197,94,0.5)'
                : 'rgba(255,255,255,0.12)',
        boxShadow: touched[field] && errors[field]
            ? '0 0 0 3px rgba(248,113,113,0.08)'
            : touched[field] && !errors[field]
                ? '0 0 0 3px rgba(34,197,94,0.06)'
                : 'none'
    });

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a192f', fontFamily: "'Outfit', 'Inter', sans-serif", padding: '20px' }}>
                <div style={{ textAlign: 'center', padding: '48px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', maxWidth: '400px', width: '100%' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid rgba(34,197,94,0.3)' }}>
                        <CheckCircle2 size={40} color="#22c55e" />
                    </div>
                    <h2 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '700', marginBottom: '12px' }}>Account Created! 🎉</h2>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Welcome to <strong style={{ color: 'var(--accent)' }}>Civic Flow</strong>, {fullName.split(' ')[0]}!<br />
                        Redirecting you to login...
                    </p>
                    <div style={{ marginTop: '28px', width: '36px', height: '36px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '28px auto 0', animation: 'spin 0.8s linear infinite' }} />
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', background: '#0a192f', position: 'relative', overflow: 'hidden',
            fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
            {/* Animated gradient orbs */}
            <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(0,172,193,0.12) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, animation: 'pulse 6s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(124,77,255,0.1) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0, animation: 'pulse 8s ease-in-out infinite reverse' }} />
            <div style={{ position: 'absolute', top: '50%', right: '15%', width: '30%', height: '30%', background: 'radial-gradient(circle, rgba(0,172,193,0.06) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />

            <div style={{
                position: 'relative', zIndex: 10, width: '100%', maxWidth: '460px',
                padding: '40px', borderRadius: '24px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'
            }}>
                {/* Camera Permission Banner */}
                {showCameraBanner && (
                    <div style={{
                        background: cameraPermission === 'denied'
                            ? 'rgba(239,68,68,0.12)'
                            : 'rgba(0,172,193,0.1)',
                        border: `1px solid ${cameraPermission === 'denied' ? 'rgba(239,68,68,0.3)' : 'rgba(0,172,193,0.3)'}`,
                        borderRadius: '10px',
                        padding: '10px 14px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        position: 'relative'
                    }}>
                        <Camera size={16} color={cameraPermission === 'denied' ? '#ef4444' : '#00acc1'} />
                        <p style={{ fontSize: '0.78rem', color: cameraPermission === 'denied' ? '#fca5a5' : 'rgba(0,172,193,0.9)', flex: 1 }}>
                            {cameraPermission === 'denied'
                                ? '⚠️ Camera access denied. You can still register, but you\'ll need camera access to report issues later.'
                                : '📷 Camera access granted! You\'ll be able to upload issue photos after signing up.'}
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowCameraBanner(false)}
                            style={{ background: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1rem', lineHeight: 1, padding: '2px' }}
                        >✕</button>
                    </div>
                )}

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '64px', height: '64px', borderRadius: '18px', marginBottom: '16px',
                        background: 'linear-gradient(135deg, var(--accent, #00acc1) 0%, #7c4dff 100%)',
                        boxShadow: '0 8px 24px rgba(0,172,193,0.35)'
                    }}>
                        <UserPlus size={30} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '6px', letterSpacing: '-0.02em' }}>Create Account</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>Join the Civic Flow community today</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Full Name */}
                    <div style={{ marginBottom: '14px' }}>
                        <div style={inputWrapper}>
                            <User size={17} style={iconLeft} />
                            <input type="text" placeholder="Full Name" required
                                style={getInputStyle('fullName')} value={fullName}
                                onChange={e => { setFullName(e.target.value); if (touched.fullName) setErrors(v => ({ ...v, fullName: '' })); }}
                                onBlur={() => { handleBlur('fullName'); setErrors(v => ({ ...v, fullName: !fullName.trim() ? 'Full name is required' : '' })); }}
                            />
                        </div>
                        {touched.fullName && errors.fullName && <div style={errorText}><XCircle size={12} />{errors.fullName}</div>}
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '14px' }}>
                        <div style={inputWrapper}>
                            <Mail size={17} style={iconLeft} />
                            <input type="email" placeholder="Email Address" required
                                style={getInputStyle('email')} value={email}
                                onChange={e => { setEmail(e.target.value); if (touched.email) setErrors(v => ({ ...v, email: '' })); }}
                                onBlur={() => { handleBlur('email'); setErrors(v => ({ ...v, email: !email.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email' : '' })); }}
                            />
                        </div>
                        {touched.email && errors.email && <div style={errorText}><XCircle size={12} />{errors.email}</div>}
                    </div>

                    {/* Phone (optional) */}
                    <div style={{ marginBottom: '14px' }}>
                        <div style={inputWrapper}>
                            <Phone size={17} style={iconLeft} />
                            <input type="tel" placeholder="Phone Number (optional)"
                                style={getInputStyle('phone')} value={phone}
                                onChange={e => { setPhone(e.target.value); if (touched.phone) setErrors(v => ({ ...v, phone: '' })); }}
                                onBlur={() => { handleBlur('phone'); setErrors(v => ({ ...v, phone: phone && !/^\+?[\d\s\-()]{7,15}$/.test(phone) ? 'Enter a valid phone number' : '' })); }}
                            />
                        </div>
                        {touched.phone && errors.phone && <div style={errorText}><XCircle size={12} />{errors.phone}</div>}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '6px' }}>
                        <div style={inputWrapper}>
                            <Lock size={17} style={iconLeft} />
                            <input type={showPassword ? 'text' : 'password'} placeholder="Create Password" required
                                style={getInputStyle('password')} value={password}
                                onChange={e => { setPassword(e.target.value); if (touched.password) setErrors(v => ({ ...v, password: '' })); }}
                                onBlur={() => { handleBlur('password'); setErrors(v => ({ ...v, password: !password ? 'Password is required' : password.length < 6 ? 'Min 6 characters' : '' })); }}
                            />
                            <button type="button" style={iconRight} onClick={() => setShowPassword(s => !s)}>
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        {touched.password && errors.password && <div style={errorText}><XCircle size={12} />{errors.password}</div>}
                    </div>

                    {/* Password Strength Meter */}
                    {password.length > 0 && (
                        <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} style={{
                                        flex: 1, height: '3px', borderRadius: '99px',
                                        background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)',
                                        transition: 'background 0.3s'
                                    }} />
                                ))}
                            </div>
                            <p style={{ fontSize: '0.72rem', color: strength.color, textAlign: 'right', fontWeight: '600', letterSpacing: '0.5px' }}>
                                {strength.label}
                            </p>
                        </div>
                    )}

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '14px' }}>
                        <div style={inputWrapper}>
                            <Lock size={17} style={{ ...iconLeft, color: passwordsMatch ? '#22c55e' : passwordsMismatch ? '#f87171' : 'rgba(255,255,255,0.3)' }} />
                            <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm Password" required
                                style={{
                                    ...inputBase,
                                    borderColor: passwordsMismatch ? 'rgba(248,113,113,0.6)' : passwordsMatch ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.12)',
                                    boxShadow: passwordsMismatch ? '0 0 0 3px rgba(248,113,113,0.08)' : passwordsMatch ? '0 0 0 3px rgba(34,197,94,0.06)' : 'none'
                                }}
                                value={confirmPassword}
                                onChange={e => { setConfirmPassword(e.target.value); if (touched.confirmPassword) setErrors(v => ({ ...v, confirmPassword: '' })); }}
                                onBlur={() => { handleBlur('confirmPassword'); setErrors(v => ({ ...v, confirmPassword: !confirmPassword ? 'Please confirm your password' : password !== confirmPassword ? 'Passwords do not match' : '' })); }}
                            />
                            <button type="button" style={iconRight} onClick={() => setShowConfirm(s => !s)}>
                                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        {passwordsMismatch && <div style={errorText}><XCircle size={12} />Passwords do not match</div>}
                        {passwordsMatch && <div style={{ ...errorText, color: '#4ade80' }}><CheckCircle2 size={12} />Passwords match</div>}
                        {touched.confirmPassword && errors.confirmPassword && !passwordsMismatch && !passwordsMatch && <div style={errorText}><XCircle size={12} />{errors.confirmPassword}</div>}
                    </div>

                    {/* Role Selection */}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: '600' }}>Sign up as</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[
                                { value: 'user', label: '🏠 Resident', color: 'var(--accent, #00acc1)' },
                                { value: 'volunteer', label: '🙋 Volunteer', color: '#7c4dff' }
                            ].map(r => (
                                <button key={r.value} type="button" onClick={() => setRole(r.value)}
                                    style={{
                                        flex: 1, padding: '10px 8px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600',
                                        cursor: 'pointer', transition: 'all 0.25s', border: `1px solid`,
                                        borderColor: role === r.value ? r.color : 'rgba(255,255,255,0.1)',
                                        background: role === r.value ? `${r.color}22` : 'transparent',
                                        color: role === r.value ? 'white' : 'rgba(255,255,255,0.4)',
                                        boxShadow: role === r.value ? `0 0 12px ${r.color}33` : 'none'
                                    }}>
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={isLoading || passwordsMismatch}
                        style={{
                            width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
                            background: isLoading || passwordsMismatch
                                ? 'rgba(255,255,255,0.08)'
                                : 'linear-gradient(135deg, var(--accent, #00acc1) 0%, #7c4dff 100%)',
                            color: isLoading || passwordsMismatch ? 'rgba(255,255,255,0.3)' : 'white',
                            fontWeight: '700', fontSize: '1rem', cursor: isLoading || passwordsMismatch ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            transition: 'all 0.3s', boxShadow: isLoading || passwordsMismatch ? 'none' : '0 4px 20px rgba(0,172,193,0.3)',
                            fontFamily: 'inherit'
                        }}
                        onMouseOver={e => { if (!isLoading && !passwordsMismatch) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        {isLoading ? (
                            <>
                                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.38)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--accent, #00acc1)', textDecoration: 'none', fontWeight: '700' }}>
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
