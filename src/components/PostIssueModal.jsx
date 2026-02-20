import React, { useState } from 'react';
import { Camera, MapPin, X, Send, AlertCircle } from 'lucide-react';

const PostIssueModal = ({ isOpen, onClose, onPost, issues = [] }) => {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('Fetching location...');
    const [manualAddress, setManualAddress] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    const handleCaptureLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates({ lat: latitude, lng: longitude });
                setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                setError('');
            }, (err) => {
                setLocation('Location access denied');
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!image) {
            setError('Image upload is mandatory for reporting issues.');
            return;
        }

        if (!description.trim()) {
            setError('Please provide a description of the issue.');
            return;
        }

        // Duplicate detection: check if an active issue already exists at same location
        const newAddr = (manualAddress || '').toLowerCase().trim();
        const newLoc = (location === 'Fetching location...' ? '' : location).toLowerCase().trim();
        const duplicate = issues.find(existing => {
            if (existing.status === 'Solved') return false;
            const existAddr = (existing.address || '').toLowerCase().trim();
            const existLoc = (existing.location || '').toLowerCase().trim();
            // Match if same address or same GPS location string
            const addrMatch = newAddr && existAddr && (newAddr === existAddr || existAddr.includes(newAddr) || newAddr.includes(existAddr));
            const locMatch = newLoc && existLoc && newLoc === existLoc;
            return addrMatch || locMatch;
        });

        if (duplicate) {
            setError(`A similar issue already exists at this location: "${duplicate.description.substring(0, 50)}..." (Status: ${duplicate.status}). Please upvote the existing issue instead.`);
            return;
        }

        const newIssue = {
            id: Date.now(),
            user: 'You',
            description,
            location: location === 'Fetching location...' ? (manualAddress || 'Unknown') : location,
            address: manualAddress,
            coordinates,
            image: image,
            time: 'Just now',
            postedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            verified: false,
            likes: 0,
            likedBy: [],
            status: 'Pending'
        };

        onPost(newIssue);
        onClose();
        // Reset form
        setDescription('');
        setImage(null);
        setManualAddress('');
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 2000
        }}>
            <div className="fade-in" style={{
                background: 'white',
                width: '100%',
                maxWidth: '480px',
                margin: '0 auto',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '24px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Report a Civic Issue</h2>
                    <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}><X /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            background: '#ffebee', color: '#c62828', padding: '12px',
                            borderRadius: '8px', marginBottom: '16px', display: 'flex',
                            alignItems: 'center', gap: '8px', fontSize: '0.85rem'
                        }}>
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            id="image-upload"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="image-upload" style={{
                            height: '180px',
                            background: image ? `url(${image})` : '#f5f5f5',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: image ? 'none' : '2px dashed var(--border)',
                            color: 'var(--text-muted)'
                        }}>
                            {!image && (
                                <>
                                    <Camera size={40} />
                                    <span style={{ marginTop: '8px', fontWeight: '600' }}>Capture/Upload Photo*</span>
                                    <span style={{ fontSize: '0.7rem' }}>(Mandatory)</span>
                                </>
                            )}
                            {image && (
                                <div style={{
                                    background: 'rgba(0,0,0,0.4)', color: 'white',
                                    padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem'
                                }}>
                                    Tap to change
                                </div>
                            )}
                        </label>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Manual Address (Optional)</label>
                        <input
                            type="text"
                            value={manualAddress}
                            onChange={(e) => setManualAddress(e.target.value)}
                            placeholder="Enter street name, area, etc."
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Issue Description*</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe the problem..."
                            style={{
                                width: '100%',
                                height: '100px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                fontFamily: 'inherit',
                                fontSize: '0.9rem'
                            }}
                            required
                        />
                    </div>

                    <div style={{
                        background: 'var(--background)',
                        padding: '12px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={18} color="var(--primary)" />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>GPS Location</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{location}</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleCaptureLocation}
                            style={{ background: 'none', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem' }}
                        >
                            Refetch
                        </button>
                    </div>

                    <button type="submit" className="btn-primary" style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '8px', padding: '14px'
                    }}>
                        <Send size={18} /> Submit Issue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostIssueModal;
