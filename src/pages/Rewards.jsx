import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Award, Star, History, ChevronRight, Globe2, Bell, ClipboardList, User, Users, TrendingUp, Sun, Moon } from 'lucide-react';
import Logo from '../components/Logo';

const Rewards = ({ user, theme, toggleTheme }) => {
    const navigate = useNavigate();

    const displayName = user.fullName ? (user.fullName.split(' ')[0] + ' ' + (user.fullName.split(' ')[1]?.[0] || '') + '.').trim() : 'You';
    const leaderboard = [
        { id: 1, name: 'Amit S.', points: 1250, rank: 1, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100' },
        { id: 2, name: 'Priya K.', points: 1100, rank: 2, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100' },
        { id: 3, name: displayName, points: user.points, rank: 8, avatar: null }, // You
        { id: 4, name: 'Rahul R.', points: 420, rank: 9, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100' }
    ];

    return (
        <div className="container" style={{ padding: '24px 20px 80px' }}>
            <div className="fade-in">
                {/* Theme Toggle */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <div
                        onClick={toggleTheme}
                        style={{
                            cursor: 'pointer', padding: '8px', background: 'var(--input-bg)',
                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid var(--border)', transition: 'var(--transition)'
                        }}
                    >
                        {theme === 'light' ? <Moon size={18} color="var(--text-muted)" /> : <Sun size={18} color="#ffd700" />}
                    </div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, #00695c 100%)',
                    borderRadius: '24px', padding: '32px 24px', color: 'white', textAlign: 'center',
                    marginBottom: '24px', boxShadow: '0 12px 24px rgba(0, 77, 64, 0.2)'
                }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                        margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                        <Trophy size={40} color="#ffd700" />
                    </div>
                    <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '4px' }}>{user.points}</h1>
                    <p style={{ opacity: 0.9, fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Civic Points</p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
                        <div>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.rank}</p>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Global Rank</p>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                        <div>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.streak}</p>
                            <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Daily Streak</p>
                        </div>
                    </div>
                </div>

                <section style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Badges & Achievements</h3>
                        <span
                            onClick={() => navigate('/notifications')}
                            style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            View All Alerts
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
                        {user.badges.map(badge => (
                            <div key={badge.id} className="glass-card" style={{
                                padding: '20px 16px', minWidth: '130px', textAlign: 'center',
                                border: '1px solid var(--border)', background: 'var(--surface)'
                            }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '50%',
                                    background: badge.tier === 'Gold' ? 'linear-gradient(135deg, #fff9c4, #fbc02d)' : 'linear-gradient(135deg, #f5f5f5, #bdbdbd)',
                                    margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Award size={28} color="white" />
                                </div>
                                <p style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{badge.name}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{badge.tier} Achievement</p>
                            </div>
                        ))}
                        <div className="glass-card" style={{
                            padding: '20px 16px', minWidth: '130px', textAlign: 'center',
                            border: '1px dashed var(--border)', background: 'transparent',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                        }}>
                            <TrendingUp size={24} color="var(--border)" />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Next Badge at 500 pts</p>
                        </div>
                    </div>
                </section>

                <section style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Leaderboard</h3>
                    <div className="glass-card" style={{ background: 'var(--surface)', padding: '8px' }}>
                        {leaderboard.map((player, idx) => (
                            <div key={player.id} style={{
                                display: 'flex', alignItems: 'center', padding: '12px',
                                borderBottom: idx === leaderboard.length - 1 ? 'none' : '1px solid var(--border)',
                                background: player.name === displayName ? 'var(--input-bg)' : 'transparent',
                                borderRadius: player.name === displayName ? '12px' : '0'
                            }}>
                                <span style={{ width: '24px', fontWeight: 'bold', fontSize: '0.9rem', color: idx < 3 ? 'var(--primary)' : 'var(--text-muted)' }}>{player.rank}</span>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0',
                                    marginRight: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {player.avatar ? <img src={player.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={20} color="#94a3b8" />}
                                </div>
                                <span style={{ flex: 1, fontWeight: '600', fontSize: '0.9rem' }}>{player.name} {player.name === displayName && '(You)'}</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>{player.points} pts</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Point History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {user.history.map(item => (
                            <div key={item.id} className="glass-card" style={{ background: 'var(--surface)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ padding: '10px', background: 'rgba(0, 77, 64, 0.08)', borderRadius: '12px' }}>
                                        <History size={18} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.action}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.date}</p>
                                    </div>
                                </div>
                                <span style={{ color: 'var(--verified)', fontWeight: 'bold' }}>+{item.points}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <footer style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'var(--surface)', padding: '12px 24px',
                display: 'flex', justifyContent: 'space-around',
                boxShadow: 'var(--shadow)',
                borderTop: '1px solid var(--border)', zIndex: 100
            }}>
                <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <Globe2 size={24} />
                    <span style={{ fontSize: '0.7rem' }}>Feed</span>
                </div>
                <div onClick={() => navigate('/rewards')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                    <Trophy size={24} />
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
                    <ClipboardList size={24} />
                    <span style={{ fontSize: '0.7rem' }}>Tasks</span>
                </div>
                <div onClick={() => navigate('/profile')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <User size={24} />
                    <span style={{ fontSize: '0.7rem' }}>Profile</span>
                </div>
            </footer>
        </div>
    );
};

export default Rewards;
