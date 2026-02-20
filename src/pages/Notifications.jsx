import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, AlertTriangle, Info, MapPin, Globe2, Trophy, ClipboardList, User, Eye } from 'lucide-react';
import Logo from '../components/Logo';

const Notifications = ({ notifications, setNotifications, issues }) => {
    const navigate = useNavigate();

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'verify': return <Eye size={20} color="#fb8c00" />;
            case 'confirm': return <CheckCircle size={20} color="var(--verified)" />;
            case 'update': return <Info size={20} color="var(--primary)" />;
            default: return <Bell size={20} color="var(--text-muted)" />;
        }
    };

    // Nearby issues — show all issues that are Pending or Verified (simulating radius logic)
    const nearbyIssues = (issues || []).filter(i => i.status === 'Pending' || i.status === 'Verified');

    return (
        <div className="container" style={{ padding: '24px 20px 80px' }}>
            <div className="fade-in">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '1.5rem' }}>Notifications</h1>
                    {notifications.length > 0 && (
                        <button
                            onClick={markAllRead}
                            style={{ background: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.85rem' }}
                        >
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Nearby Issues Section */}
                <section style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={18} color="var(--primary)" /> Nearby Issues
                    </h3>
                    {nearbyIssues.length === 0 ? (
                        <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p>No nearby issues right now.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {nearbyIssues.map(issue => (
                                <div
                                    key={issue.id}
                                    className="glass-card"
                                    onClick={() => navigate('/dashboard')}
                                    style={{
                                        padding: '14px 16px', cursor: 'pointer', background: 'white',
                                        display: 'flex', gap: '14px', alignItems: 'center'
                                    }}
                                >
                                    {issue.image && (
                                        <img src={issue.image} alt="" style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>{issue.description.substring(0, 50)}...</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <MapPin size={12} /> {issue.location}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.65rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '10px',
                                        background: issue.status === 'Verified' ? 'var(--verified)' : '#90a4ae',
                                        color: 'white', whiteSpace: 'nowrap'
                                    }}>
                                        {issue.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Alerts Section */}
                <section>
                    <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bell size={18} color="var(--primary)" /> Alerts
                    </h3>
                    {notifications.length === 0 ? (
                        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Bell size={48} style={{ opacity: 0.15, marginBottom: '16px' }} />
                            <p>No notifications yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    onClick={() => {
                                        markAsRead(notif.id);
                                        if (notif.postId) navigate('/dashboard');
                                    }}
                                    className="glass-card"
                                    style={{
                                        padding: '14px 16px', cursor: 'pointer',
                                        background: notif.unread ? 'rgba(0, 77, 64, 0.04)' : 'white',
                                        borderLeft: notif.unread ? '3px solid var(--primary)' : '3px solid transparent',
                                        display: 'flex', gap: '14px', alignItems: 'flex-start'
                                    }}
                                >
                                    <div style={{
                                        padding: '8px', background: '#f1f8e9', borderRadius: '12px', flexShrink: 0, marginTop: '2px'
                                    }}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>{notif.title}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{notif.message}</p>
                                        <p style={{ fontSize: '0.7rem', color: '#90a4ae', marginTop: '6px' }}>{notif.time}</p>
                                    </div>
                                    {notif.unread && (
                                        <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0, marginTop: '6px' }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Footer */}
            <footer style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'white', padding: '12px 24px',
                display: 'flex', justifyContent: 'space-around',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                borderTop: '1px solid var(--border)', zIndex: 100
            }}>
                <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <Globe2 size={22} />
                    <span style={{ fontSize: '0.7rem' }}>Feed</span>
                </div>
                <div onClick={() => navigate('/rewards')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <Trophy size={22} />
                    <span style={{ fontSize: '0.7rem' }}>Rewards</span>
                </div>
                <div onClick={() => navigate('/notifications')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                    <Bell size={24} />
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
                    <User size={22} />
                    <span style={{ fontSize: '0.7rem' }}>Profile</span>
                </div>
            </footer>
        </div>
    );
};

export default Notifications;
