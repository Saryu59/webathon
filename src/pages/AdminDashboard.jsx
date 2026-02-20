import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Trash2, CheckCircle, AlertTriangle, ArrowLeft, MoreVertical, MapPin, Bell, Send, Eye } from 'lucide-react';

const AdminDashboard = ({ issues, setIssues, addNotification }) => {
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
        setIssues(issues.map(i =>
            i.id === id ? {
                ...i,
                status: 'Solved',
                solvedDate: new Date().toLocaleDateString(),
                solvedBy: i.acceptedBy || 'Admin'
            } : i
        ));
        addNotification({
            type: 'confirm',
            title: 'Issue Resolved ✅',
            message: `"${issue?.description?.substring(0, 50)}..." has been confirmed as solved by Admin.`,
            postId: id
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
                                        <img src={issue.image} alt="" style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
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
                                        {/* Send verification notification */}
                                        {(issue.status === 'Pending' || issue.status === 'Fixed') && (
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
                                        )}

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
            </div>
        </div>
    );
};

export default AdminDashboard;
