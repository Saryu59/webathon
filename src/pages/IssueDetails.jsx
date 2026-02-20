import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Clock, ThumbsUp, ShieldCheck,
    AlertCircle, CheckCircle2, Globe2, Share2, MessageCircle, Sun, Moon
} from 'lucide-react';
import Logo from '../components/Logo';

const IssueDetails = ({ issues, updateStatus, theme, toggleTheme }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const issue = issues.find(i => i.id === parseInt(id));

    if (!issue) {
        return (
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
                <AlertCircle size={64} color="var(--not-verified)" style={{ marginBottom: '20px', opacity: 0.3 }} />
                <h1 style={{ marginBottom: '16px' }}>Issue Not Found</h1>
                <button onClick={() => navigate('/dashboard')} className="btn-primary">Back to Feed</button>
            </div>
        );
    }

    const containerStyle = {
        paddingBottom: '40px',
        minHeight: '100vh',
        background: 'var(--background)',
        color: 'var(--text)'
    };

    const headerStyle = {
        padding: '20px',
        background: 'var(--surface)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow)',
        borderBottom: '1px solid var(--border)'
    };

    const imageContainerStyle = {
        width: '100%',
        height: '350px',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--border)'
    };

    const contentStyle = {
        padding: '24px 20px',
        maxWidth: '800px',
        margin: '0 auto'
    };

    const badgeStyle = {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'white',
        background: issue.status === 'Solved' ? 'var(--solved)' :
            issue.status === 'Fixed' ? 'var(--verified)' :
                issue.status === 'In Progress' ? 'var(--in-progress)' : '#90a4ae'
    };

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                    <ArrowLeft size={24} />
                </button>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Issue Details</h2>
                </div>
                <div
                    onClick={toggleTheme}
                    style={{
                        cursor: 'pointer', padding: '8px', background: 'var(--input-bg)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid var(--border)', transition: 'var(--transition)', marginRight: '8px'
                    }}
                >
                    {theme === 'light' ? <Moon size={18} color="var(--text-muted)" /> : <Sun size={18} color="#ffd700" />}
                </div>
                <Logo size={32} />
            </header>

            <div style={imageContainerStyle}>
                <img
                    src={issue.image}
                    alt={issue.description}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        parent.style.background = 'linear-gradient(135deg, #cfd8dc 0%, #90a4ae 100%)';
                        const icon = document.createElement('div');
                        icon.style.cssText = 'height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem;';
                        icon.innerText = issue.categoryIcon || '📷';
                        parent.appendChild(icon);
                    }}
                />
                <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
                    <span style={badgeStyle}>{issue.status}</span>
                    {issue.verified && (
                        <span style={{ ...badgeStyle, background: 'rgba(255,255,255,0.9)', color: 'var(--verified)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ShieldCheck size={14} /> Verified
                        </span>
                    )}
                </div>
            </div>

            <div style={contentStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{issue.category?.toUpperCase() || 'CIVIC'}</span>
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2', color: 'var(--text)' }}>{issue.location}</h1>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>{issue.user}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{issue.time}</p>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: 'var(--surface)' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text)', marginBottom: '0' }}>{issue.description}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--surface)', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                        <MapPin size={24} color="var(--primary)" />
                        <div>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Address</p>
                            <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{issue.address}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--surface)', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
                        <ThumbsUp size={24} color="var(--primary)" />
                        <div>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Support</p>
                            <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{issue.likes} Residents</p>
                        </div>
                    </div>
                </div>

                {issue.aiConfidence && (
                    <div className="glass-card" style={{
                        padding: '20px', marginBottom: '32px',
                        background: 'rgba(0, 172, 193, 0.04)',
                        border: '1px dashed rgba(0, 172, 193, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Globe2 size={24} color="var(--accent)" />
                            <div>
                                <p style={{ fontWeight: 'bold', color: 'var(--accent)' }}>AI Analysis Report</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Confidence Score: {issue.aiConfidence}% match</p>
                            </div>
                        </div>
                        <CheckCircle2 size={24} color="var(--accent)" />
                    </div>
                )}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Share2 size={20} /> Share Issue
                    </button>
                    <button style={{
                        flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid var(--primary)',
                        color: 'var(--primary)', fontWeight: 'bold', background: 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}>
                        <MessageCircle size={20} /> Chat Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IssueDetails;
