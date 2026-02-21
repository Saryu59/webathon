import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, User as UserIcon, Mail, Phone, MapPin, Camera, Check } from 'lucide-react';
import Logo from '../components/Logo';

const EditProfile = ({ user, setUser, theme, toggleTheme }) => {
    const navigate = useNavigate();
    const [editForm, setEditForm] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        photo: user?.photo || ''
    });
    const [saved, setSaved] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm(prev => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const updated = {
            ...user,
            ...editForm
        };
        setUser(updated);
        localStorage.setItem('userProfile', JSON.stringify(updated));
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            navigate('/profile');
        }, 1500);
    };

    return (
        <div className="container" style={{ padding: 0 }}>
            <div className="fade-in">
                {/* Header */}
                <header style={{
                    padding: '32px 24px 24px',
                    background: 'linear-gradient(135deg, var(--primary) 0%, #00695c 100%)',
                    color: 'white', position: 'sticky', top: 0, zIndex: 1000,
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ChevronLeft size={20} /> Back
                        </button>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Edit Profile</h1>
                        <div style={{ width: '40px' }}></div> {/* Spacer */}
                    </div>
                </header>

                <main style={{ padding: '24px 20px 80px' }}>
                    <form onSubmit={handleSave} className="glass-card" style={{ background: 'var(--surface)', padding: '24px', borderRadius: '24px' }}>
                        {/* Profile Photo Preview */}
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="profile-upload"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="profile-upload" style={{
                                    width: '100%', height: '100%', borderRadius: '50%', background: 'var(--input-bg)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                    border: '4px solid var(--border)', boxShadow: 'var(--shadow)', cursor: 'pointer'
                                }}>
                                    {editForm.photo ? (
                                        <img src={editForm.photo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <UserIcon size={48} color="var(--primary)" />
                                    )}
                                </label>
                                <label htmlFor="profile-upload" style={{
                                    position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)',
                                    color: 'white', borderRadius: '50%', padding: '8px', border: '2px solid white', cursor: 'pointer'
                                }}>
                                    <Camera size={16} />
                                </label>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tap to update your profile photo</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'block', color: 'var(--text-muted)' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <UserIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                    <input
                                        type="text"
                                        required
                                        value={editForm.fullName}
                                        onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                                        style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'block', color: 'var(--text-muted)' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                    <input
                                        type="email"
                                        required
                                        value={editForm.email}
                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                        style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'block', color: 'var(--text-muted)' }}>Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                    <input
                                        type="tel"
                                        required
                                        value={editForm.phone}
                                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                        style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'block', color: 'var(--text-muted)' }}>Office/Residential Address</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                    <input
                                        type="text"
                                        required
                                        value={editForm.address}
                                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                        style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)' }}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', display: 'block', color: 'var(--text-muted)' }}>Profile Photo URL</label>
                                <div style={{ position: 'relative' }}>
                                    <Camera size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                                    <input
                                        type="url"
                                        value={editForm.photo}
                                        onChange={e => setEditForm({ ...editForm, photo: e.target.value })}
                                        placeholder="https://example.com/avatar.jpg"
                                        style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)' }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saved}
                                className="btn-primary glow-effect"
                                style={{
                                    marginTop: '12px', padding: '16px', borderRadius: '16px',
                                    background: saved ? 'var(--verified)' : 'var(--primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                {saved ? <><Check size={20} /> Changes Saved!</> : <><Save size={20} /> Update Profile</>}
                            </button>
                        </div>
                    </form>
                </main>
            </div>

            {/* Logo Footer Overlay */}
            <div style={{ position: 'fixed', bottom: '24px', left: '0', right: '0', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 50 }}>
                <div style={{ background: 'var(--surface)', padding: '8px 16px', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)' }}>
                    <Logo size={24} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>CIVIC FLOW</span>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
