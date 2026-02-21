import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, MapPin, Send, Layout, CheckCircle, Globe2, Bell, Trophy, ClipboardList, Settings, LogOut, ChevronRight, ChevronLeft, X, Camera, Sun, Moon, Edit } from 'lucide-react';
import Logo from '../components/Logo';

const Profile = ({ user, setUser, onLogout, theme, toggleTheme }) => {
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    return (
        <div className="container" style={{ padding: '0 0 80px 0' }}>
            <div className="fade-in">
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, #00695c 100%)',
                    height: '160px', position: 'relative'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 24px', color: 'white' }}>
                        <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ChevronLeft size={20} /> Back
                        </button>
                        <h2 style={{ color: 'white', fontSize: '1.2rem' }}>My Profile</h2>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={toggleTheme} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px', borderRadius: '10px' }}>
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#ffd700" />}
                            </button>
                            <button onClick={() => navigate('/edit-profile')} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px', borderRadius: '10px' }}>
                                <Settings size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div style={{ marginTop: '-60px', padding: '0 20px' }}>
                    <div className="glass-card" style={{
                        background: 'var(--surface)', padding: '24px', borderRadius: '24px',
                        textAlign: 'center', boxShadow: 'var(--shadow)'
                    }}>
                        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 16px' }}>
                            <div style={{
                                width: '100%', height: '100%', borderRadius: '50%', background: '#e2e8f0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                {user.photo ? <img src={user.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserIcon size={40} color="var(--primary)" />}
                            </div>
                            <button
                                onClick={() => navigate('/edit-profile')}
                                style={{
                                    position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)',
                                    color: 'white', border: '2px solid white', borderRadius: '50%', padding: '6px'
                                }}
                            >
                                <Camera size={14} />
                            </button>
                        </div>
                        <h2 style={{ marginBottom: '4px' }}>{user.fullName}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Verified Citizen • Bengaluru, KA</p>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ padding: '24px 20px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Impact Overview</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div className="glass-card" style={{ background: 'var(--surface)', padding: '16px 8px', textAlign: 'center' }}>
                            <Send size={20} color="var(--primary)" style={{ marginBottom: '8px' }} />
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.postedCount}</p>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600' }}>Posted</p>
                        </div>
                        <div className="glass-card" style={{ background: 'var(--surface)', padding: '16px 8px', textAlign: 'center' }}>
                            <Layout size={20} color="#fb8c00" style={{ marginBottom: '8px' }} />
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.acceptedCount}</p>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600' }}>In Progress</p>
                        </div>
                        <div className="glass-card" style={{ background: 'var(--surface)', padding: '16px 8px', textAlign: 'center' }}>
                            <CheckCircle size={20} color="var(--verified)" style={{ marginBottom: '8px' }} />
                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.solvedCount}</p>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600' }}>Solved</p>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div style={{ padding: '0 20px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Contact Details</h3>
                    <div className="glass-card" style={{ background: 'var(--surface)', padding: '4px', borderRadius: '20px' }}>
                        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ background: 'var(--input-bg)', padding: '10px', borderRadius: '12px' }}><Mail size={18} color="var(--primary)" /></div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</p>
                                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.email}</p>
                            </div>
                        </div>
                        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ background: 'var(--input-bg)', padding: '10px', borderRadius: '12px' }}><Phone size={18} color="var(--primary)" /></div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone</p>
                                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.phone}</p>
                            </div>
                        </div>
                        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ background: 'var(--input-bg)', padding: '10px', borderRadius: '12px' }}><MapPin size={18} color="var(--primary)" /></div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Address</p>
                                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={() => { localStorage.clear(); navigate('/'); }}
                        style={{
                            width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(229, 57, 53, 0.05)',
                            border: '1px solid rgba(229, 57, 53, 0.2)', color: '#e53935', fontWeight: 'bold',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <LogOut size={18} /> Logout Session
                    </button>
                </div>
            </div>


            {/* Footer */}
            <footer style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'var(--surface)', padding: '12px 24px',
                display: 'flex', justifyContent: 'space-around',
                boxShadow: 'var(--shadow)',
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
                <div onClick={() => navigate('/notifications')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
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
                <div onClick={() => navigate('/profile')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                    <UserIcon size={22} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>Profile</span>
                </div>
            </footer>
        </div>
    );
};

export default Profile;
