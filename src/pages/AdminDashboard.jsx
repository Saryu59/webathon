import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Trash2, CheckCircle, AlertTriangle, ArrowLeft, MoreVertical, MapPin, Bell, Send, Eye } from 'lucide-react';

const AdminDashboard = ({ issues, setIssues, updateStatus, addNotification }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleToggleVerified = (id) => {
        setIssues(issues.map(issue =>
            issue.id === id ? { ...issue, verified: !issue.verified, status: !issue.verified ? 'Verified' : 'Pending' } : issue
        ));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            setIssues(issues.filter(issue => issue.id !== id));
        }
    };

    const handleConfirmSolved = (id) => {
        const issue = issues.find(i => i.id === id);
        updateStatus(id, 'Solved', {
            solvedDate: new Date().toLocaleDateString(),
            solvedBy: issue?.acceptedBy || 'Admin'
        });
    };

    const handleSendVerification = (id) => {
        const issue = issues.find(i => i.id === id);
        addNotification({
            type: 'verify',
            title: 'Verification Request 🔍',
            message: `Admin requests nearby residents to verify: "${issue?.description?.substring(0, 50)}..." at ${issue?.location}`,
            postId: id
        });
        alert(`Verification notification sent to nearby users for: "${issue?.description?.substring(0, 40)}..."`);
    };

    const stats = {
        total: issues.length,
        pending: issues.filter(i => i.status === 'Pending').length,
        verified: issues.filter(i => i.status === 'Verified').length,
        inProgress: issues.filter(i => i.status === 'In Progress').length,
        fixed: issues.filter(i => i.status === 'Fixed').length,
        solved: issues.filter(i => i.status === 'Solved').length
    };

    const filteredIssues = issues.filter(i =>
        i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            {/* Top Nav */}
            <nav style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #00695c 100%)',
                padding: '16px 24px', color: 'white',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={24} />
                    <h1 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>CivicFlow Admin</h1>
                </div>
                <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={16} /> Exit Panel
                </button>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>Total Reports</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.total}</h2>
                    </div>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #90a4ae' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Pending</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#90a4ae' }}>{stats.pending}</h2>
                    </div>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid var(--verified)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Verified</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--verified)' }}>{stats.verified}</h2>
                    </div>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid var(--in-progress)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Needs Confirmation</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--in-progress)' }}>{stats.fixed}</h2>
                    </div>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid var(--solved)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Solved</p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--solved)' }}>{stats.solved}</h2>
                    </div>
                </div>

                {/* Management Table */}
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Active Reports Management</h3>
                        <input
                            type="text"
                            placeholder="Search issues..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '0.85rem', minWidth: '200px' }}
                        />
                    </div>

                    {/* Cards for each issue */}
                    <div style={{ padding: '16px' }}>
                        {filteredIssues.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p>No issues found.</p>
                            </div>
                        ) : (
                            filteredIssues.map(issue => (
                                <div key={issue.id} style={{
                                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                                    padding: '20px', borderBottom: '1px solid #f1f5f9',
                                    transition: 'background 0.2s'
                                }}>
                                    {/* Image */}
                                    {issue.image && (
                                        <div style={{ width: '64px', height: '64px', borderRadius: '10px', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img
                                                src={issue.image}
                                                alt=""
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    // Local Fallback for Admin
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.style.background = '#cfd8dc';
                                                    e.target.parentElement.innerText = '🚧';
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '0.95rem' }}>{issue.description.substring(0, 60)}...</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                            <MapPin size={13} /> {issue.location}
                                            {issue.address && <span>• {issue.address}</span>}
                                            {issue.category && (
                                                <span style={{
                                                    marginLeft: '8px', padding: '2px 8px', borderRadius: '4px',
                                                    background: 'rgba(0,0,0,0.05)', fontSize: '0.7rem', fontWeight: 'bold',
                                                    display: 'flex', alignItems: 'center', gap: '4px'
                                                }}>
                                                    {issue.categoryIcon} {issue.category}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{
                                                fontSize: '0.7rem', fontWeight: '700', padding: '4px 10px', borderRadius: '12px',
                                                background: issue.status === 'Solved' ? 'var(--solved)' :
                                                    issue.status === 'Fixed' ? 'var(--in-progress)' :
                                                        issue.status === 'In Progress' ? '#fb8c00' :
                                                            issue.status === 'Verified' ? 'var(--verified)' : '#90a4ae',
                                                color: 'white'
                                            }}>
                                                {issue.status}
                                            </span>
                                            {issue.acceptedBy && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    Accepted by: <strong>{issue.acceptedBy}</strong>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                                        {/* Send verification notification - visible on ALL issues */}
                                        <button
                                            onClick={() => handleSendVerification(issue.id)}
                                            title="Send verification notification to nearby users"
                                            style={{
                                                padding: '8px 14px', background: '#e3f2fd',
                                                color: '#1565c0', borderRadius: '8px', fontSize: '0.75rem',
                                                fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px',
                                                border: '1px solid #bbdefb'
                                            }}
                                        >
                                            <Send size={14} /> Send Verification
                                        </button>

                                        {/* Confirm solve */}
                                        {issue.status === 'Fixed' && (
                                            <button
                                                onClick={() => handleConfirmSolved(issue.id)}
                                                style={{
                                                    padding: '8px 14px', background: 'var(--verified)',
                                                    color: 'white', borderRadius: '8px', fontSize: '0.75rem',
                                                    fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px'
                                                }}
                                            >
                                                <CheckCircle size={14} /> Confirm Solved
                                            </button>
                                        )}

                                        {/* Verify pending */}
                                        {issue.status === 'Pending' && (
                                            <button
                                                onClick={() => handleToggleVerified(issue.id)}
                                                style={{
                                                    padding: '8px 14px', background: 'var(--primary)',
                                                    color: 'white', borderRadius: '8px', fontSize: '0.75rem',
                                                    fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px'
                                                }}
                                            >
                                                <Eye size={14} /> Verify
                                            </button>
                                        )}

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(issue.id)}
                                            style={{
                                                padding: '8px 14px', background: '#fff5f5',
                                                color: '#e53935', borderRadius: '8px', fontSize: '0.75rem',
                                                fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px',
                                                border: '1px solid #ffcdd2'
                                            }}
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #edf2f7', paddingBottom: '16px' }}>
                        <Users size={24} color="var(--primary)" />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Field Force Personnel Directory (India)</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {[
                            {
                                category: 'Sanitation & Waste',
                                workers: [
                                    { name: 'Rajesh Sharma', role: 'Team Lead', specialty: 'Waste Management', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', status: 'Active', phone: '+91 98451 12345', address: '23A, Rajajinagar, Bengaluru' },
                                    { name: 'Sunita Verma', role: 'Technician', specialty: 'Recycling Ops', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150', status: 'On Leave', phone: '+91 95561 67890', address: '14, Electronic City, Bengaluru' }
                                ]
                            },
                            {
                                category: 'Electrification',
                                workers: [
                                    { name: 'Amit Patel', role: 'Senior Engineer', specialty: 'Grid Maintenance', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', status: 'Active', phone: '+91 73451 44561', address: '7, Marine Drive, Mumbai' },
                                    { name: 'Priya Das', role: 'Specialist', specialty: 'Street Lighting', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', status: 'On Duty', phone: '+91 90081 23456', address: '5, Worli Sea Link Road, Mumbai' }
                                ]
                            },
                            {
                                category: 'Road Maintenance',
                                workers: [
                                    { name: 'Suresh Raina', role: 'Foreman', specialty: 'Asphalt Paving', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150', status: 'Active', phone: '+91 80121 78901', address: '33, Miyapur Main Road, Hyderabad' },
                                    { name: 'Kavita Reddy', role: 'Inspector', specialty: 'Structural Integrity', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150', status: 'On Duty', phone: '+91 96321 34567', address: '10, Gachibowli Flyover, Hyderabad' }
                                ]
                            },
                            {
                                category: 'Water & Sewage',
                                workers: [
                                    { name: 'Robert Dsouza', role: 'Plumbing Expert', specialty: 'Pipe Networks', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', status: 'Active', phone: '+91 91234 56789', address: '8, Anna Salai, Chennai' },
                                    { name: 'Lakshmi Nair', role: 'Drainage Tech', specialty: 'Stormwater Management', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150', status: 'On Duty', phone: '+91 88901 23456', address: '22, T-Nagar, Chennai' }
                                ]
                            }
                        ].map((cat, idx) => (
                            <div key={idx} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {cat.category}
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {cat.workers.map((worker, wIdx) => (
                                        <div key={wIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: wIdx !== cat.workers.length - 1 ? '12px' : 0, borderBottom: wIdx !== cat.workers.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                                            <img src={worker.photo} alt={worker.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0 }}>{worker.name}</p>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '1px 0' }}>{worker.role} • {worker.specialty}</p>
                                                {worker.phone && (
                                                    <a href={`tel:${worker.phone}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', margin: '2px 0' }}>
                                                        <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: '600' }}>📞 {worker.phone}</span>
                                                    </a>
                                                )}
                                                {worker.address && <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0 }}>📍 {worker.address}</p>}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                                                <span style={{
                                                    fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px',
                                                    background: worker.status === 'Active' ? '#e6fffa' : worker.status === 'On Duty' ? '#ebf8ff' : '#fff5f5',
                                                    color: worker.status === 'Active' ? '#319795' : worker.status === 'On Duty' ? '#3182ce' : '#e53935',
                                                    fontWeight: 'bold', border: `1px solid ${worker.status === 'Active' ? '#b2f5ea' : worker.status === 'On Duty' ? '#bee3f8' : '#feb2b2'}`,
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {worker.status}
                                                </span>
                                                <a href={`tel:${worker.phone}`} style={{
                                                    fontSize: '0.6rem', background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'
                                                }}>Call Now</a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
