import React, { useState } from 'react';
import { Camera, MapPin, X, Send, AlertCircle } from 'lucide-react';

const PostIssueModal = ({ isOpen, onClose, onPost, issues = [] }) => {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('Fetching location...');
    const [manualAddress, setManualAddress] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState('');
    const [confidence, setConfidence] = useState(0);
    const [detectedCategory, setDetectedCategory] = useState(null);

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

        const getCategory = (desc) => {
            const d = desc.toLowerCase();
            if (d.match(/pothole|road|pavement|sidewalk|street|lane|asphalt|concrete|tar|crack|crater|bump|uneven/)) return { name: 'Pothole', icon: '🚧' };
            if (d.match(/garbage|trash|waste|dump|litter|bin|container|debris|cleanup|sweep|spill|smell|stench|dirt|filth|sanitation/)) return { name: 'Waste', icon: '🗑️' };
            if (d.match(/light|lamp|electricity|power|pole|wire|cable|sign|signal|traffic|barricade|barrier|scaffolding|bridge|wall|fence/)) return { name: 'Infrastructure', icon: '💡' };
            if (d.match(/water|leak|leakage|pipe|drain|sewage|manhole|overflow|flood|stagnation|puddle|tap|valve|hydrant|pump|gutter/)) return { name: 'Water/Sanitation', icon: '💧' };
            if (d.match(/tree|branch|fire|hazard|danger|obstruction|graffiti|vandalism|stray|noise|smoke|dust|pollution|park|bench|playground/)) return { name: 'Safety/Public Space', icon: '🛡️' };
            return { name: 'General', icon: '📋' };
        };

        const category = getCategory(description);
        setDetectedCategory(category);

        // Simulate Realistic AI Image Verification
        setIsScanning(true);
        setError('');
        setConfidence(0);

        const steps = [
            { label: 'Detecting global objects...', time: 600 },
            { label: 'Analyzing street textures...', time: 1200 },
            { label: `Detected: ${category.name} ${category.icon}`, time: 1800 },
            { label: 'Comparing visual signatures...', time: 2400 },
            { label: 'Finalizing confidence score...', time: 3000 }
        ];

        steps.forEach((step, index) => {
            setTimeout(() => setScanStep(step.label), step.time);
        });

        setTimeout(() => {
            // Comprehensive Civic Keyword Database (Infrastructure, Sanitation, Utilities, Public Safety)
            const categories = [
                { name: 'Pothole', keywords: ['pothole', 'road', 'pavement', 'asphalt', 'crater', 'bump', 'uneven', 'hole', 'repair'] },
                { name: 'Waste', keywords: ['garbage', 'trash', 'waste', 'dump', 'litter', 'bin', 'cleanup', 'filth', 'smell', 'stench'] },
                { name: 'Infrastructure', keywords: ['light', 'lamp', 'power', 'pole', 'wire', 'sign', 'signal', 'electricity', 'broken'] },
                { name: 'Water', keywords: ['water', 'leak', 'leakage', 'pipe', 'drain', 'sewage', 'overflow', 'puddle', 'spill'] },
                { name: 'Safety', keywords: ['tree', 'branch', 'hazard', 'danger', 'fire', 'graffiti', 'stray', 'fallen', 'obstruct', 'block'] }
            ];

            const descriptionLower = description.toLowerCase();
            const matchingCategories = categories.filter(cat =>
                cat.keywords.some(kw => descriptionLower.includes(kw))
            );

            // Calculate a mock confidence score
            let score = 45; // Base score

            if (matchingCategories.length > 0) {
                // High category relevance bonus
                score += 35;

                // Keyword density reward: +8 for each additional specific keyword in the category
                const primaryCat = matchingCategories[0];
                const matchedKws = primaryCat.keywords.filter(kw => descriptionLower.includes(kw));
                score += (matchedKws.length - 1) * 8;
            }

            if (description.length > 30) score += 15;

            // Detect categorical conflicts (e.g., "water" and "tree" in same report)
            const hasConflict = matchingCategories.length > 1;
            if (hasConflict) {
                score -= 40; // Heavy penalty for "mixed signals"
            }

            score = Math.min(score, 98) - Math.floor(Math.random() * 3); // More stable score for high-quality reports
            setConfidence(score);

            if (description.trim().length < 15) {
                setError('AI Verification Failed (Confidence: ' + score + '%). Description is too short for accurate community analysis. Please provide more detail (min 15 chars).');
                setIsScanning(false);
                return;
            }

            if (hasConflict) {
                setError(`AI Conflict Detected (Confidence: ${score}%). Description contains contradictory civic categories (${matchingCategories.map(c => c.name).join(' & ')}). Our Vision AI cannot align this text with a single visual signature. Please describe only ONE specific issue.`);
                setIsScanning(false);
                return;
            }

            if (score <= 70) {
                setError('AI Verification Failed (Confidence: ' + score + '%). Visual identifiers in the photo do not sufficiently match the keywords in your description. Please provide a clearer photo or more specific keywords.');
                setIsScanning(false);
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
                status: 'Pending',
                aiConfidence: score,
                category: category.name,
                categoryIcon: category.icon
            };

            onPost(newIssue);
            setIsScanning(false);
            onClose();
            // Reset form
            setDescription('');
            setImage(null);
            setManualAddress('');
            setError('');
        }, 2800);
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

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isScanning}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '8px', padding: '14px',
                            opacity: isScanning ? 0.7 : 1,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {isScanning ? (
                            <>
                                <div className="scanning-line" style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
                                    background: 'white', opacity: 0.5, animation: 'scan 1.2s infinite linear'
                                }} />
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Camera size={18} className="spin" /> {scanStep || 'Analyzing...'}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Send size={18} /> Submit Issue
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostIssueModal;
