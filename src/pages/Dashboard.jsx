import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PlusCircle, MapPin, ThumbsUp, Bell, User as UserIcon,
    AlertCircle, Handshake, CheckCircle2, Globe2, Trophy, ClipboardList, Users, Award, Clock
} from 'lucide-react';
import PostIssueModal from '../components/PostIssueModal';
import Logo from '../components/Logo';

const Dashboard = ({ issues, setIssues, notifications, setNotifications, updateStatus }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('active');

    // Countdown timer — refreshes every second for Fixed issues
    const FIXED_TIMEOUT_MS = 2 * 60 * 1000;
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getTimeRemaining = (fixedAt) => {
        if (!fixedAt) return null;
        const elapsed = now - fixedAt;
        const remaining = Math.max(0, FIXED_TIMEOUT_MS - elapsed);
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        return { remaining, mins, secs, percent: (remaining / FIXED_TIMEOUT_MS) * 100 };
    };

    const unreadCount = notifications.filter(n => n.unread).length;
    const solvedCount = issues.filter(i => i.status === 'Solved').length;

    const filteredIssues = issues.filter(issue =>
        activeTab === 'active' ? issue.status !== 'Solved' : issue.status === 'Solved'
    );

    const currentUser = 'You';

    const handlePostIssue = (newIssue) => {
        setIssues([{ ...newIssue, likedBy: [] }, ...issues]);
    };

    const handleToggleLike = (id) => {
        setIssues(issues.map(issue => {
            if (issue.id !== id) return issue;
            const alreadyLiked = (issue.likedBy || []).includes(currentUser);
            return {
                ...issue,
                likedBy: alreadyLiked
                    ? issue.likedBy.filter(u => u !== currentUser)
                    : [...(issue.likedBy || []), currentUser],
                likes: alreadyLiked ? issue.likes - 1 : issue.likes + 1
            };
        }));
    };

    const handleAccept = (id) => {
        updateStatus(id, 'In Progress', { acceptedBy: 'You' });
    };

    const handleVerify = (id) => {
        updateStatus(id, 'Verified', { verified: true });
    };

    const handleApproveFix = (id) => {
        handleToggleLike(id);
        alert('Community approval recorded! Admin will confirm the final solution.');
    };

    return (
        <div className="container" style={{ padding: 0 }}>
            {/* Header */}
            <header style={{
                padding: '24px 20px 16px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #00695c 100%)',
                color: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h1 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '2px' }}>Civic Flow</h1>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Clean City, Proud Citizen</p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/notifications')}>
                            <Bell size={24} />
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: '-6px', right: '-6px',
                                    background: '#e53935', color: 'white', fontSize: '10px',
                                    padding: '2px 6px', borderRadius: '50%', fontWeight: 'bold'
                                }}>
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <UserIcon size={24} style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')} />
                    </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                        padding: '14px 16px', background: 'rgba(255,255,255,0.15)',
                        borderRadius: '14px', backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', gap: '12px'
                    }}>
                        <Users size={22} />
                        <div>
                            <p style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>1,240</p>
                            <p style={{ fontSize: '0.7rem', opacity: 0.85 }}>Contributors</p>
                        </div>
                    </div>
                    <div style={{
                        padding: '14px 16px', background: 'rgba(255,255,255,0.15)',
                        borderRadius: '14px', backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', gap: '12px'
                    }}>
                        <Award size={22} />
                        <div>
                            <p style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>{solvedCount + 447}</p>
                            <p style={{ fontSize: '0.7rem', opacity: 0.85 }}>Issues Solved</p>
                        </div>
                    </div>
                </div>

                {/* Tab Selector */}
                <div style={{
                    display: 'flex', background: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px', padding: '4px'
                }}>
                    <button
                        onClick={() => setActiveTab('active')}
                        style={{
                            flex: 1, padding: '8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold',
                            background: activeTab === 'active' ? 'white' : 'transparent',
                            color: activeTab === 'active' ? 'var(--primary)' : 'white'
                        }}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setActiveTab('solved')}
                        style={{
                            flex: 1, padding: '8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold',
                            background: activeTab === 'solved' ? 'white' : 'transparent',
                            color: activeTab === 'solved' ? 'var(--primary)' : 'white'
                        }}
                    >
                        Solved
                    </button>
                </div>
            </header>

            {/* Feed */}
            <main style={{ padding: '20px 20px 80px', flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>{activeTab === 'active' ? 'Community Feed' : 'Solved Issues'}</h3>
                    {activeTab === 'active' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: 'var(--primary)', color: 'white',
                                padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem'
                            }}
                        >
                            <PlusCircle size={16} /> Post Issue
                        </button>
                    )}
                </div>

                {filteredIssues.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                        <AlertCircle size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                        <p>No {activeTab} issues found.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                        {filteredIssues.map(issue => (
                            <div key={issue.id} className="glass-card" style={{ overflow: 'hidden' }}>
                                {issue.image && (
                                    <img src={issue.image} alt="Issue" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                                )}
                                <div style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{issue.user}</span>
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px',
                                            background: issue.status === 'Solved' ? 'var(--solved)' :
                                                issue.status === 'Fixed' ? 'var(--verified)' :
                                                    issue.status === 'Verified' ? '#43a047' :
                                                        issue.status === 'In Progress' ? 'var(--in-progress)' : '#90a4ae',
                                            color: 'white'
                                        }}>
                                            {issue.status}
                                        </span>
                                    </div>

                                    {/* Countdown Timer for Accepted (In Progress) issues */}
                                    {issue.status === 'In Progress' && issue.acceptedAt && (() => {
                                        const timer = getTimeRemaining(issue.acceptedAt);
                                        if (!timer) return null;
                                        return (
                                            <div style={{
                                                background: timer.percent < 25 ? 'rgba(229,57,53,0.08)' : 'rgba(251,140,0,0.08)',
                                                border: `1px solid ${timer.percent < 25 ? 'rgba(229,57,53,0.2)' : 'rgba(251,140,0,0.2)'}`,
                                                borderRadius: '12px', padding: '10px 14px', marginBottom: '12px',
                                                display: 'flex', alignItems: 'center', gap: '10px'
                                            }}>
                                                <Clock size={16} color={timer.percent < 25 ? '#e53935' : '#fb8c00'} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: timer.percent < 25 ? '#e53935' : '#fb8c00' }}>
                                                            Fix before {timer.mins}:{String(timer.secs).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                    <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
                                                        <div style={{
                                                            width: `${timer.percent}%`, height: '100%',
                                                            background: timer.percent < 25 ? '#e53935' : '#fb8c00',
                                                            borderRadius: '4px', transition: 'width 1s linear'
                                                        }} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <p style={{ fontSize: '0.95rem', marginBottom: '14px', fontWeight: '500', lineHeight: '1.5' }}>{issue.description}</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            <MapPin size={14} color="var(--primary)" /> {issue.location}
                                            {issue.status === 'Solved' && issue.address && <span> - {issue.address}</span>}
                                        </div>
                                        {issue.status !== 'Solved' && issue.address && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '20px' }}>{issue.address}</p>
                                        )}
                                        {issue.status !== 'Solved' && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '20px' }}>{issue.time}</p>
                                        )}
                                    </div>

                                    {/* Solved metadata */}
                                    {issue.status === 'Solved' && (
                                        <div style={{
                                            background: 'rgba(30, 136, 229, 0.06)', padding: '12px',
                                            borderRadius: '12px', marginBottom: '14px', border: '1px solid rgba(30, 136, 229, 0.12)'
                                        }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                                                <p><span style={{ color: 'var(--text-muted)' }}>Posted:</span> {issue.postedDate || 'N/A'}</p>
                                                <p><span style={{ color: 'var(--text-muted)' }}>Solved:</span> {issue.solvedDate || 'N/A'}</p>
                                                <p style={{ gridColumn: 'span 2' }}><span style={{ color: 'var(--text-muted)' }}>Resolved by:</span> <strong>{issue.solvedBy}</strong></p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action buttons for active tab */}
                                    {activeTab === 'active' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <button onClick={() => handleToggleLike(issue.id)} style={{ background: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: (issue.likedBy || []).includes(currentUser) ? '#e53935' : 'var(--primary)', fontWeight: 'bold' }}>
                                                    <ThumbsUp size={18} fill={(issue.likedBy || []).includes(currentUser) ? '#e53935' : 'none'} /> <span style={{ fontSize: '0.9rem' }}>{issue.likes}</span>
                                                </button>

                                                {issue.acceptedBy === 'You' ? (
                                                    <div style={{
                                                        background: issue.status === 'Fixed' ? 'var(--verified)' : 'var(--in-progress)',
                                                        color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'
                                                    }}>
                                                        {issue.status === 'Fixed' ? 'Fix Reported' : 'In Progress'}
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAccept(issue.id)}
                                                        disabled={issue.status === 'Fixed'}
                                                        style={{
                                                            background: issue.status === 'Fixed' ? '#ccc' : 'var(--primary)',
                                                            color: 'white', padding: '6px 16px', borderRadius: '20px',
                                                            fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px'
                                                        }}
                                                    >
                                                        <Handshake size={16} /> {issue.status === 'Fixed' ? 'Awaiting Confirmation' : 'Accept Task'}
                                                    </button>
                                                )}
                                            </div>

                                            {issue.status === 'Fixed' && issue.acceptedBy !== 'You' && (
                                                <button
                                                    onClick={() => handleApproveFix(issue.id)}
                                                    style={{
                                                        width: '100%', background: 'rgba(67, 160, 71, 0.1)',
                                                        color: 'var(--verified)', padding: '10px', borderRadius: '12px',
                                                        fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid var(--verified)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                    }}
                                                >
                                                    <CheckCircle2 size={18} /> Approve Fix (Community)
                                                </button>
                                            )}

                                            {issue.status === 'Pending' && !issue.verified && (
                                                <button
                                                    onClick={() => handleVerify(issue.id)}
                                                    style={{
                                                        width: '100%', background: 'rgba(0, 77, 64, 0.05)',
                                                        color: 'var(--primary)', padding: '10px', borderRadius: '12px',
                                                        fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid var(--primary)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                    }}
                                                >
                                                    <AlertCircle size={18} /> Verify this Issue (Nearby)
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer Navigation */}
            <footer style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'white', padding: '12px 24px',
                display: 'flex', justifyContent: 'space-around',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                borderTop: '1px solid var(--border)', zIndex: 1000
            }}>
                <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                    <Globe2 size={22} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>Feed</span>
                </div>
                <div onClick={() => navigate('/rewards')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <Trophy size={22} />
                    <span style={{ fontSize: '0.7rem' }}>Rewards</span>
                </div>
                <div onClick={() => navigate('/notifications')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <div style={{ position: 'relative' }}>
                        <Bell size={22} />
                        {unreadCount > 0 && <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#e53935', borderRadius: '50%' }}></span>}
                    </div>
                    <span style={{ fontSize: '0.7rem' }}>Alerts</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '0 8px' }}>
                    <Logo size={28} />
                    <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '0.5px' }}>CIVIC FLOW</span>
                </div>
                <div onClick={() => navigate('/tasks')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <ClipboardList size={22} />
                    <span style={{ fontSize: '0.7rem' }}>Tasks</span>
                </div>
                <div onClick={() => navigate('/profile')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <UserIcon size={22} />
                    <span style={{ fontSize: '0.7rem' }}>Profile</span>
                </div>
            </footer>

            <PostIssueModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPost={handlePostIssue}
                issues={issues}
            />
        </div>
    );
};

export default Dashboard;
