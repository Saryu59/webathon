import React, { useState } from 'react';
import { Camera, MapPin, X, Send, AlertCircle, AlertTriangle } from 'lucide-react';

const PostIssueModal = ({ isOpen, onClose, onPost, issues = [] }) => {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('Fetching location...');
    const [manualAddress, setManualAddress] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [image, setImage] = useState(null);
    const [imageWarning, setImageWarning] = useState('');
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState('');
    const [confidence, setConfidence] = useState(0);
    const [detectedCategory, setDetectedCategory] = useState(null);
    const [locationWarning, setLocationWarning] = useState(false);
    const [pendingIssue, setPendingIssue] = useState(null);

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
                const dataUrl = reader.result;
                setImage(dataUrl);
                setError('');

                // Advanced Contrast-based Document/Screenshot Detector
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX = 64; // Smaller grid for faster processing
                    canvas.width = MAX;
                    canvas.height = MAX;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, MAX, MAX);
                    const data = ctx.getImageData(0, 0, MAX, MAX).data;

                    let lightPixels = 0;
                    let darkPixels = 0;
                    let sumLuma = 0;
                    let sumLumaSq = 0;
                    const colorCounts = new Set();
                    const total = MAX * MAX;

                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const luma = 0.299 * r + 0.587 * g + 0.114 * b;

                        sumLuma += luma;
                        sumLumaSq += luma * luma;

                        if (luma > 200) lightPixels++;
                        if (luma < 60) darkPixels++;

                        // Quantize color more strictly
                        const colorKey = `${Math.floor(r / 24)},${Math.floor(g / 24)},${Math.floor(b / 24)}`;
                        colorCounts.add(colorKey);
                    }

                    const meanLuma = sumLuma / total;
                    const varianceLuma = (sumLumaSq / total) - (meanLuma * meanLuma);
                    const stdDevLuma = Math.sqrt(Math.max(0, varianceLuma));

                    const lightRatio = lightPixels / total;
                    const darkRatio = darkPixels / total;
                    const colorDiversity = colorCounts.size;

                    // REAL photos usually have stdDevLuma > 40 and colorDiversity > 60
                    // Documents/Screenshots have low stdDev (mostly flat) or very low diversity
                    const isTooFlat = stdDevLuma < 35;
                    const isTextLikely = lightRatio > 0.45 && darkRatio > 0.02 && colorDiversity < 40;
                    const isUnnatural = colorDiversity < 30 || (lightRatio + darkRatio) > 0.92;

                    if (isTooFlat || isTextLikely || isUnnatural) {
                        setImageWarning('⚠️ Non-Civic Signature: This image looks like a document, screenshot, or digital graphic. Please upload a real, clear photo taken at the location.');
                    } else {
                        setImageWarning('');
                    }
                };
                img.src = dataUrl;
            };
            reader.readAsDataURL(file);
        }
    };

    const runAIVerificationAndPost = (overrideLocationWarning = false) => {
        const getCategory = (desc) => {
            const d = desc.toLowerCase();
            if (d.match(/pothole|road|pavement|sidewalk|street|lane|asphalt|concrete|tar|crack|crater|bump|uneven/)) return { name: 'Pothole', icon: '🚧' };
            if (d.match(/garbage|trash|waste|dump|litter|bin|container|debris|cleanup|sweep|spill|smell|stench|dirt|filth|sanitation/)) return { name: 'Waste', icon: '🗑️' };
            if (d.match(/light|lamp|electricity|power|pole|wire|cable|sign|signal|traffic|barricade|barrier|scaffolding|bridge|wall|fence/)) return { name: 'Infrastructure', icon: '💡' };
            if (d.match(/water|leak|leakage|pipe|drain|sewage|manhole|overflow|flood|stagnation|puddle|tap|valve|hydrant|pump|gutter/)) return { name: 'Water/Sanitation', icon: '💧' };
            if (d.match(/tree|branch|fire|hazard|danger|obstruction|graffiti|vandalism|stray|noise|smoke|dust|pollution|park|bench|playground/)) return { name: 'Safety/Public Space', icon: '🛡️' };
            return null;
        };

        const category = getCategory(description);

        // Block if no civic keywords at all
        if (!category) {
            setError('❌ Non-Civic Content: This does not appear to be a civic issue. Please describe an infrastructure, sanitation, water, road, or public safety problem only.');
            return;
        }

        setDetectedCategory(category);

        // Simulate Realistic AI Image Verification
        setIsScanning(true);
        setError('');
        setConfidence(0);

        const steps = [
            { label: 'Reading Image pixel arrays...', time: 600 },
            { label: 'Checking OCR Text Pattern signatures...', time: 1200 },
            { label: `Detected Type: ${category.name} ${category.icon}`, time: 1800 },
            { label: 'Analyzing Depth & Texture shadows...', time: 2400 },
            { label: 'Calculating Confidence score...', time: 3000 }
        ];

        steps.forEach((step) => {
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

            // Forbidden keywords (immediate penalty/rejection)
            const forbidden = ['pizza', 'burger', 'food', 'cat', 'dog', 'pet', 'meme', 'joke', 'movie', 'game', 'shopping', 'offer', 'iphone', 'laptop', 'porn', 'nsfw'];
            const foundForbidden = forbidden.filter(fw => descriptionLower.includes(fw));

            // Calculate a mock confidence score
            let score = 35; // Lowered base score

            if (matchingCategories.length > 0) {
                score += 45; // Significant boost for civic categories
                const primaryCat = matchingCategories[0];
                const matchedKws = primaryCat.keywords.filter(kw => descriptionLower.includes(kw));
                score += (matchedKws.length - 1) * 6;
            }

            if (description.length > 45) score += 10;
            if (description.length > 80) score += 5;

            // Multi-signal boost: if it matches more than one different civic category (e.g. road + drain)
            if (matchingCategories.length >= 2) score += 12;

            // CRITICAL: Penalize heavily if image detector flagged a document/screenshot
            if (imageWarning) {
                score = Math.min(score, 25); // Lowered hard cap for visual mismatch
                steps[3].label = "❌ Analysis: Non-civic visual signature";
                steps[4].label = "❌ Reject: High-confidence Document detection";
            }

            // Forbidden keyword penalty
            if (foundForbidden.length > 0) {
                score -= 50;
                steps[2].label = "⚠️ Alert: Non-civic context detected";
            }

            const hasConflict = matchingCategories.length > 2; // Increased allowance for complex civic reports
            if (hasConflict) {
                score -= 30;
            }

            score = Math.floor(Math.min(score, 98) - (Math.random() * 4));
            setConfidence(score);

            if (description.trim().length < 20) {
                setError('AI Verification Failed (Confidence: ' + score + '%). Description is too vague for accurate impact analysis. Please provide at least 20 characters of detail.');
                setIsScanning(false);
                return;
            }

            if (foundForbidden.length > 0) {
                setError(`AI Rejection (Confidence: ${score}%). Your report contains non-civic keywords (${foundForbidden.join(', ')}). Local councils only process infrastructure and public utility issues.`);
                setIsScanning(false);
                return;
            }

            if (score <= 80) {
                setError('AI Verification Failed (Confidence: ' + score + '%). This issue does not meet our strict civic signature requirements. Ensure you have a clear outdoor photo and specify which public infrastructure is affected.');
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
            setLocationWarning(false);
            setPendingIssue(null);
        }, 2800);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!image) {
            setError('Image upload is mandatory for reporting issues.');
            return;
        }

        if (imageWarning) {
            setError('❌ Your image appears to be a screenshot or document, not a civic issue photo. Please upload a real photo taken at the location.');
            return;
        }

        if (!description.trim()) {
            setError('Please provide a description of the issue.');
            return;
        }

        // Duplicate detection: only block if SAME location AND SAME category/description keywords
        const newAddr = (manualAddress || '').toLowerCase().trim();
        const newLoc = (location === 'Fetching location...' ? '' : location).toLowerCase().trim();
        const descLower = description.toLowerCase();
        const duplicate = issues.find(existing => {
            if (existing.status === 'Solved') return false;
            const existAddr = (existing.address || '').toLowerCase().trim();
            const existLoc = (existing.location || '').toLowerCase().trim();

            // Location must match
            const addrMatch = newAddr.length > 3 && existAddr.length > 3 && newAddr === existAddr;
            const locMatch = newLoc.length > 3 && existLoc.length > 3 && newLoc === existLoc;
            if (!addrMatch && !locMatch) return false;

            // AND category/type must also be the same
            const sameCategory = existing.category && detectedCategory && existing.category === detectedCategory.name;
            // OR description shares multiple keywords
            const existDesc = (existing.description || '').toLowerCase();
            const sharedWords = descLower.split(' ').filter(w => w.length > 4 && existDesc.includes(w));
            return sameCategory || sharedWords.length >= 2;
        });

        if (duplicate) {
            setError(`A very similar issue already exists at this location: "${duplicate.description.substring(0, 50)}..." (Status: ${duplicate.status}). Please upvote the existing report instead.`);
            return;
        }

        // Location mismatch check: GPS coords exist AND manual address is also filled
        const hasGPS = coordinates !== null && location !== 'Fetching location...' && location !== 'Location access denied';
        const hasManualAddr = manualAddress.trim().length > 0;
        if (hasGPS && hasManualAddr) {
            // Warn user that GPS and manual address may not match
            setLocationWarning(true);
            return;
        }

        runAIVerificationAndPost();
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

                {/* Location Mismatch Warning Modal */}
                {locationWarning && (
                    <div style={{
                        background: '#fff8e1', border: '1px solid #ffc107',
                        borderRadius: '12px', padding: '16px', marginBottom: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <AlertTriangle size={18} color="#f59e0b" />
                            <strong style={{ color: '#92400e', fontSize: '0.9rem' }}>Location Mismatch Warning</strong>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#78350f', marginBottom: '14px', lineHeight: '1.5' }}>
                            Your GPS location (<strong>{location}</strong>) and the manual address you entered (<strong>"{manualAddress}"</strong>) may refer to different places. Are you sure you want to continue?
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => { setLocationWarning(false); runAIVerificationAndPost(true); }}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '10px',
                                    background: '#f59e0b', color: 'white', fontWeight: 'bold', fontSize: '0.85rem'
                                }}
                            >
                                Proceed Anyway
                            </button>
                            <button
                                onClick={() => setLocationWarning(false)}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '10px',
                                    border: '1px solid #ccc', background: 'white', fontWeight: 'bold', fontSize: '0.85rem'
                                }}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                )}

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

                        {/* Screenshot/document warning */}
                        {imageWarning && (
                            <div style={{
                                marginTop: '8px', background: '#fff3cd', border: '1px solid #ffc107',
                                borderRadius: '8px', padding: '10px 12px', fontSize: '0.8rem', color: '#856404'
                            }}>
                                {imageWarning}
                            </div>
                        )}


                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Manual Address (Optional)</label>
                        <input
                            type="text"
                            value={manualAddress}
                            onChange={(e) => setManualAddress(e.target.value)}
                            placeholder="Enter area (e.g. Miyapur, Hyderabad)"
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
                            placeholder="Briefly describe the civic problem (e.g. pothole, broken streetlight, water leak)..."
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
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            ⚠️ Only civic issues (road, sanitation, water, electricity, safety) will be accepted.
                        </p>
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
