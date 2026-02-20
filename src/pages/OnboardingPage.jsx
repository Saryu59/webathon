import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, Bell, Shield, ArrowRight, CheckCircle2, Globe2 } from 'lucide-react';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [permissions, setPermissions] = useState({
        location: false,
        camera: false,
        notifications: false
    });

    const steps = [
        {
            id: 'welcome',
            title: 'Welcome to Civic Flow',
            subtitle: 'Let\'s get your workspace ready for active citizenship.',
            icon: <Globe2 size={48} color="var(--primary)" />,
            content: 'To provide a seamless experience, we need a few essential permissions. This ensures your reports are accurate and you stay updated on community actions.',
            actionLabel: 'Get Started'
        },
        {
            id: 'location',
            permission: 'location',
            title: 'Real-time Location',
            subtitle: 'Accurate reporting starts with precise location data.',
            icon: <MapPin size={48} color="var(--primary)" />,
            content: 'We use your GPS data to automatically tag issues (potholes, waste, etc.) so the right municipal departments can reach them quickly.',
            actionLabel: 'Allow Location'
        },
        {
            id: 'camera',
            permission: 'camera',
            title: 'Visual Evidence',
            subtitle: 'Our Vision AI needs eye-witness photos.',
            icon: <Camera size={48} color="var(--primary)" />,
            content: 'Allowing camera access enables our AI to scan issues instantly, verify their severity, and prevent duplicate reports.',
            actionLabel: 'Allow Camera'
        },
        {
            id: 'notifications',
            permission: 'notifications',
            title: 'Stay Informed',
            subtitle: 'Never miss a community update.',
            icon: <Bell size={48} color="var(--primary)" />,
            content: 'Get instant alerts when your reported issues are accepted, fixed, or verified by your neighbors.',
            actionLabel: 'Enable Notifications'
        }
    ];

    const handleNext = () => {
        const currentStep = steps[step];
        if (currentStep.permission) {
            setPermissions(prev => ({ ...prev, [currentStep.permission]: true }));
        }

        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            localStorage.setItem('onboardingComplete', 'true');
            navigate('/dashboard');
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
    };

    const currentData = steps[step];

    return (
        <div style={containerStyle}>
            {/* Mesh Gradient Background */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(circle at 10% 10%, rgba(0,77,64,0.05) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(124,77,255,0.05) 0%, transparent 50%)',
                zIndex: 0
            }} />

            <div className="glass-card slide-up" style={{
                maxWidth: '440px', width: '100%', padding: '48px 32px',
                textAlign: 'center', position: 'relative', zIndex: 1
            }}>
                {/* Progress Bar */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%',
                    height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '24px 24px 0 0', overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${((step + 1) / steps.length) * 100}%`,
                        height: '100%', background: 'var(--primary)', transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                </div>

                <div className="glow-effect" style={{
                    width: '96px', height: '96px', borderRadius: '24px',
                    background: 'var(--surface)', margin: '0 auto 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow)', border: '1px solid var(--border)'
                }}>
                    {currentData.icon}
                </div>

                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                    {currentData.title}
                </h1>
                <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '24px' }}>
                    {currentData.subtitle}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '40px' }}>
                    {currentData.content}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                        onClick={handleNext}
                        className="btn-primary"
                        style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
                    >
                        {currentData.actionLabel}
                        <ArrowRight size={20} />
                    </button>

                    {step > 0 && (
                        <button
                            onClick={() => setStep(step + 1)}
                            style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}
                        >
                            Ask me later
                        </button>
                    )}
                </div>

                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <Shield size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Your data is end-to-end encrypted and never shared.</span>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
