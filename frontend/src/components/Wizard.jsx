import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const Wizard = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        otp_code: '',
        otp_verified: false,

        // Election details
        riding_zone_name: '',
        election_date: '',

        // Bio
        headshot: null,
        bio_text: '',

        // Platform
        pillar_1: '',
        pillar_1_desc: '',
        pillar_2: '',
        pillar_2_desc: '',
        pillar_3: '',
        pillar_3_desc: '',
        action_shot_1: null,
        action_shot_2: null,
        action_shot_3: null,

        // Customization
        template_style: 'modern',
        primary_color: '#1D3557',
        secondary_color: '#F1FAEE',
        custom_slug: '',
        is_password_protected: false,
        password: 'run',

        // Other
        donation_url: '',
        event_date: '',
    });

    const [otpSent, setOtpSent] = useState(false);
    const [pillarDescriptions, setPillarDescriptions] = useState({});
    const [customSlugManuallyEdited, setCustomSlugManuallyEdited] = useState(false);
    const [electionDateError, setElectionDateError] = useState('');
    const [customSlugError, setCustomSlugError] = useState('');
    const [customPillarMode, setCustomPillarMode] = useState({ 1: false, 2: false, 3: false });

    const TOTAL_STEPS = 5;

    const stepConfig = [
        { number: 1, name: 'Identity', time: '30sec' },
        { number: 2, name: 'Election Details', time: '30sec' },
        { number: 3, name: 'Bio Setup', time: '30sec' },
        { number: 4, name: 'Platform', time: '30sec' },
        { number: 5, name: 'Customization', time: '30sec' },
    ];

    // Fetch pillar descriptions on mount
    useEffect(() => {
        axios.get('/api/pillars/')
            .then(res => setPillarDescriptions(res.data))
            .catch(err => console.error('Failed to load pillar descriptions:', err));
    }, []);

    // Auto-generate custom_slug from first_name + last_name when they change
    // Only if it hasn't been manually edited
    useEffect(() => {
        if (formData.first_name && formData.last_name && !customSlugManuallyEdited) {
            const generatedSlug = `${formData.first_name}${formData.last_name}`.toLowerCase().replace(/[^a-z0-9]/g, '');
            setFormData(prev => {
                // Only update if current slug is empty or matches the auto-generated pattern
                const currentSlug = prev.custom_slug || '';
                const expectedSlug = `${prev.first_name}${prev.last_name}`.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (!currentSlug || currentSlug === expectedSlug) {
                    return { ...prev, custom_slug: generatedSlug };
                }
                return prev;
            });
        }
    }, [formData.first_name, formData.last_name, customSlugManuallyEdited]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let processedValue = value;
        
        // Auto-clean custom_slug to remove invalid characters
        if (name === 'custom_slug') {
            // Validate original value before cleaning
            const originalValue = value.toLowerCase();
            const hasInvalidChars = /[^a-z0-9]/.test(originalValue);
            
            // Auto-clean: remove invalid characters
            processedValue = originalValue.replace(/[^a-z0-9]/g, '');
            
            // Mark as manually edited if user is typing in the custom_slug field
            if (!customSlugManuallyEdited) {
                setCustomSlugManuallyEdited(true);
            }
            
            // Show error if invalid characters were present
            if (hasInvalidChars && processedValue) {
                setCustomSlugError('Only letters and numbers allowed (no spaces, hyphens, or special characters). Invalid characters were removed.');
            } else if (hasInvalidChars && !processedValue) {
                setCustomSlugError('Only letters and numbers allowed (no spaces, hyphens, or special characters)');
            } else {
                setCustomSlugError('');
            }
        }
        
        // Validate election_date is in the future
        if (name === 'election_date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate <= today) {
                setElectionDateError('Election date must be in the future');
            } else {
                setElectionDateError('');
            }
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : processedValue
        }));
    };

    const handleImageUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 800,
                useWebWorker: true,
            };
            try {
                const compressedFile = await imageCompression(file, options);
                const finalFile = new File([compressedFile], file.name, { type: file.type });
                setFormData(prev => ({ ...prev, [fieldName]: finalFile }));
            } catch (error) {
                console.log(error);
                alert('Image compression failed');
            }
        }
    };

    const handlePillarChange = (e, pillarNum) => {
        const pillarName = e.target.value;
        const pillarField = `pillar_${pillarNum}`;
        const descField = `pillar_${pillarNum}_desc`;
        
        // Update both pillar name and description in a single state update
        setFormData(prev => {
            const updates = {
                ...prev,
                [pillarField]: pillarName
            };
            
            // Auto-fill description when pillar changes (always update for new selections)
            if (pillarName && pillarName !== 'Custom' && pillarDescriptions[pillarName]) {
                // Get the previous pillar value to check if it's actually changing
                const previousPillar = prev[pillarField];
                
                // If pillar is actually changing (not the same), update the description
                if (previousPillar !== pillarName) {
                    updates[descField] = pillarDescriptions[pillarName];
                }
            } else if (pillarName === 'Custom') {
                // Clear description and set custom mode when Custom is selected
                updates[descField] = '';
                updates[pillarField] = ''; // Clear the pillar value so custom input can be used
                setCustomPillarMode(prev => ({ ...prev, [pillarNum]: true }));
            } else {
                // Not custom, so disable custom mode
                setCustomPillarMode(prev => ({ ...prev, [pillarNum]: false }));
            }
            
            return updates;
        });
    };

    const sendOtp = async () => {
        try {
            await axios.post('/api/otp/send/', { phone: formData.phone });
            setOtpSent(true);
            alert('OTP Sent (Check Console for Stub)');
        } catch (error) {
            alert('Failed to send OTP');
        }
    };

    const verifyOtp = async () => {
        try {
            const res = await axios.post('/api/otp/verify/', { code: formData.otp_code });
            if (res.data.verified) {
                setFormData(prev => ({ ...prev, otp_verified: true }));
                setStep(2);
            }
        } catch (error) {
            alert('Invalid Code');
        }
    };

    const handleNext = () => {
        // Basic validation before moving to next step
        if (step === 1 && !formData.otp_verified) {
            alert('Please verify your phone number first');
            return;
        }
        if (step === 2) {
            if (!formData.riding_zone_name || !formData.election_date) {
                alert('Please fill in all election details');
                return;
            }
            // Validate election date is in the future
            if (formData.election_date) {
                const selectedDate = new Date(formData.election_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate <= today) {
                    setElectionDateError('Election date must be in the future');
                    alert('Election date must be in the future');
                    return;
                }
            }
        }
        if (step === 3 && (!formData.headshot || !formData.bio_text)) {
            alert('Please upload a headshot and provide a bio');
            return;
        }
        if (step === 4 && (!formData.pillar_1 || !formData.pillar_2 || !formData.pillar_3)) {
            alert('Please select all 3 pillars');
            return;
        }
        if (step === 5) {
            // Validate custom_slug format before submission
            if (formData.custom_slug && !/^[a-z0-9]+$/.test(formData.custom_slug)) {
                setCustomSlugError('Only letters and numbers allowed (no spaces, hyphens, or special characters)');
                alert('Please fix the custom URL format. Only letters and numbers are allowed.');
                return;
            }
        }
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (['headshot', 'action_shot_1', 'action_shot_2', 'action_shot_3'].includes(key)) {
                if (formData[key]) {
                    data.append(key, formData[key], formData[key].name);
                }
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            const res = await axios.post('/api/submissions/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLoading(false);
            navigate('/success', { state: { submission: res.data } });
        } catch (error) {
            setLoading(false);
            alert('Submission Failed: ' + JSON.stringify(error.response?.data || error.message));
        }
    };

    const PILLAR_OPTIONS = [
        "Lower Taxes", "Safer Streets", "Better Schools", "Community Safety",
        "Economic Growth", "Healthcare Access", "Support Seniors", "Youth Programs",
        "Infrastructure", "Environmental Protection", "Custom"
    ];

    const currentStepConfig = stepConfig[step - 1];
    const progressPercentage = (step / TOTAL_STEPS) * 100;

    return (
        <div className="container mt-5" style={{ maxWidth: '700px' }}>
            <h2 className="mb-4 text-center">Build Your Campaign HQ</h2>
            
            {/* Enhanced Progress Bar */}
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h5 className="mb-0">
                                Step {step} of {TOTAL_STEPS} - {currentStepConfig.name}
                            </h5>
                            <small className="text-muted">~{currentStepConfig.time}</small>
                        </div>
                        <div className="text-end">
                            <small className="text-muted">Build your campaign in under 3 minutes - 1 minute per page</small>
                        </div>
                    </div>
                    <div className="progress" style={{ height: '25px' }}>
                        <div 
                            className="progress-bar bg-primary" 
                            role="progressbar" 
                            style={{ width: `${progressPercentage}%` }}
                            aria-valuenow={progressPercentage} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                        >
                            {Math.round(progressPercentage)}%
                        </div>
                    </div>
                    {/* Step indicators */}
                    <div className="d-flex justify-content-between mt-3">
                        {stepConfig.map((config, idx) => (
                            <div 
                                key={config.number} 
                                className={`text-center ${idx + 1 <= step ? 'text-primary fw-bold' : 'text-muted'}`}
                                style={{ flex: 1 }}
                            >
                                <small>{config.number}of{TOTAL_STEPS}</small><br />
                                <small style={{ fontSize: '0.7rem' }}>{config.name}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {loading && <div className="text-center"><h3>Building your HQ...</h3></div>}

            {!loading && (
                <>
                    {/* Step 1: Identity */}
                    {step === 1 && (
                        <div className="card p-4">
                            <h4 className="mb-4">Step 1: Identity</h4>
                            <input 
                                name="first_name" 
                                className="form-control mb-3" 
                                placeholder="First Name" 
                                value={formData.first_name}
                                onChange={handleChange} 
                            />
                            <input 
                                name="last_name" 
                                className="form-control mb-3" 
                                placeholder="Last Name" 
                                value={formData.last_name}
                                onChange={handleChange} 
                            />
                            <input 
                                name="email" 
                                className="form-control mb-3" 
                                placeholder="Email" 
                                type="email" 
                                value={formData.email}
                                onChange={handleChange} 
                            />
                            <div className="d-flex gap-2 mb-3">
                                <input 
                                    name="phone" 
                                    className="form-control" 
                                    placeholder="Mobile Phone" 
                                    value={formData.phone}
                                    onChange={handleChange} 
                                />
                                <button className="btn btn-secondary" onClick={sendOtp}>Send OTP</button>
                            </div>
                            {otpSent && (
                                <>
                                    <input 
                                        name="otp_code" 
                                        className="form-control mb-3" 
                                        placeholder="Enter 4-digit Code" 
                                        value={formData.otp_code}
                                        onChange={handleChange} 
                                    />
                                    <button className="btn btn-primary" onClick={verifyOtp}>Verify</button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 2: Election Details */}
                    {step === 2 && (
                        <div className="card p-4">
                            <h4 className="mb-4">Step 2: Election Details</h4>
                            <label className="form-label">Riding / Zone Name</label>
                            <input 
                                name="riding_zone_name" 
                                className="form-control mb-3" 
                                placeholder="e.g., District 5, Ward 3" 
                                value={formData.riding_zone_name}
                                onChange={handleChange} 
                                required
                            />
                            <label className="form-label">Election Date</label>
                            <input 
                                name="election_date" 
                                type="date" 
                                className={`form-control mb-2 ${electionDateError ? 'is-invalid' : ''}`}
                                value={formData.election_date}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                            {electionDateError && (
                                <div className="text-danger small mb-3">{electionDateError}</div>
                            )}
                            <div className="d-flex gap-2">
                                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                                <button className="btn btn-primary" onClick={handleNext}>Next</button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Bio Setup */}
                    {step === 3 && (
                        <div className="card p-4">
                            <h4 className="mb-4">Step 3: Bio Setup</h4>
                            <label className="form-label">Headshot (Required)</label>
                            <input 
                                type="file" 
                                className="form-control mb-3" 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e, 'headshot')} 
                                required
                            />
                            {formData.headshot && (
                                <div className="text-success small mb-3">✓ Image selected: {formData.headshot.name}</div>
                            )}
                            <label className="form-label">Bio</label>
                            <textarea 
                                name="bio_text" 
                                className="form-control mb-3" 
                                placeholder="Tell us about yourself and your campaign..." 
                                rows="5"
                                value={formData.bio_text}
                                onChange={handleChange}
                                required
                            ></textarea>
                            <div className="d-flex gap-2">
                                <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                                <button className="btn btn-primary" onClick={handleNext}>Next</button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Platform */}
                    {step === 4 && (
                        <div className="card p-4">
                            <h4 className="mb-4">Step 4: Platform</h4>
                            <p>Select your top 3 priorities</p>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="mb-4 border p-3 rounded">
                                    <h5 className="mb-3">Pillar {i}</h5>

                                    <label className="form-label">Topic</label>
                                    <select 
                                        className="form-control mb-2" 
                                        name={`pillar_${i}`} 
                                        onChange={(e) => handlePillarChange(e, i)} 
                                        value={customPillarMode[i] ? 'Custom' : (formData[`pillar_${i}`] || '')}
                                    >
                                        <option value="">Select...</option>
                                        {PILLAR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    {customPillarMode[i] && (
                                        <input 
                                            className="form-control mb-2" 
                                            placeholder="Type custom pillar title" 
                                            name={`pillar_${i}_custom`} 
                                            value={formData[`pillar_${i}`] || ''}
                                            onChange={(e) => {
                                                // When user types in custom field, update the pillar value directly
                                                setFormData(prev => ({
                                                    ...prev,
                                                    [`pillar_${i}`]: e.target.value
                                                }));
                                            }} 
                                        />
                                    )}

                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control mb-2"
                                        name={`pillar_${i}_desc`}
                                        placeholder={`Explain your stance on ${formData[`pillar_${i}`] || 'this topic'}...`}
                                        rows="4"
                                        onChange={handleChange}
                                        value={formData[`pillar_${i}_desc`]}
                                    ></textarea>

                                    <label className="form-label">Action Shot (Optional)</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, `action_shot_${i}`)}
                                    />
                                    {formData[`action_shot_${i}`] && (
                                        <div className="text-success small mt-1">✓ Image selected</div>
                                    )}
                                </div>
                            ))}
                            <div className="d-flex gap-2">
                                <button className="btn btn-secondary" onClick={() => setStep(3)}>Back</button>
                                <button className="btn btn-primary" onClick={handleNext}>Next</button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Customization */}
                    {step === 5 && (
                        <div className="card p-4">
                            <h4 className="mb-4">Step 5: Customization</h4>
                            
                            <label className="form-label">Template Style</label>
                            <div className="mb-3">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div 
                                            className={`card h-100 ${formData.template_style === 'modern' ? 'border-primary border-2' : 'border'}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setFormData(prev => ({ ...prev, template_style: 'modern' }))}
                                        >
                                            <div className="card-body text-center">
                                                <h5 className="card-title">Modern</h5>
                                                <p className="card-text small text-muted">Clean, contemporary design with smooth gradients</p>
                                                <Link 
                                                    to="/preview/modern" 
                                                    target="_blank"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Preview
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div 
                                            className={`card h-100 ${formData.template_style === 'traditional' ? 'border-primary border-2' : 'border'}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setFormData(prev => ({ ...prev, template_style: 'traditional' }))}
                                        >
                                            <div className="card-body text-center">
                                                <h5 className="card-title">Traditional</h5>
                                                <p className="card-text small text-muted">Classic, professional layout with serif typography</p>
                                                <Link 
                                                    to="/preview/traditional" 
                                                    target="_blank"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Preview
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div 
                                            className={`card h-100 ${formData.template_style === 'bold' ? 'border-primary border-2' : 'border'}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setFormData(prev => ({ ...prev, template_style: 'bold' }))}
                                        >
                                            <div className="card-body text-center">
                                                <h5 className="card-title">Bold</h5>
                                                <p className="card-text small text-muted">Striking, high-impact design with bold typography</p>
                                                <Link 
                                                    to="/preview/bold" 
                                                    target="_blank"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Preview
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <small className="text-muted d-block mt-2">
                                    Click on a template card to select it, or click "Preview" to see a full preview in a new tab.
                                </small>
                            </div>

                            <label className="form-label">Primary Color</label>
                            <input 
                                type="color" 
                                className="form-control form-control-color mb-3" 
                                name="primary_color" 
                                value={formData.primary_color} 
                                onChange={handleChange} 
                            />

                            <label className="form-label">Secondary Color</label>
                            <input 
                                type="color" 
                                className="form-control form-control-color mb-3" 
                                name="secondary_color" 
                                value={formData.secondary_color} 
                                onChange={handleChange} 
                            />

                            <label className="form-label">Customizable temporary website address</label>
                            <input 
                                type="text" 
                                className={`form-control mb-2 ${customSlugError ? 'is-invalid' : ''}`}
                                name="custom_slug" 
                                placeholder="e.g., jeffformayor, jeffwill, firstlast, johndoe" 
                                value={formData.custom_slug}
                                onChange={handleChange}
                            />
                            {customSlugError && (
                                <div className="text-danger small mb-2">{customSlugError}</div>
                            )}
                            <small className="text-muted mb-3 d-block">
                                Your site will be at: {window.location.origin}/temp/{formData.custom_slug || 'yourname'}
                            </small>

                            <div className="mb-3">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        name="is_password_protected" 
                                        id="passwordProtection"
                                        checked={formData.is_password_protected}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="passwordProtection">
                                        Password protected
                                    </label>
                                </div>
                                <small className="text-muted d-block mt-1">
                                    Some people don't want temp websites public, so password protection helps with that.
                                </small>
                            </div>

                            {formData.is_password_protected && (
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="password" 
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="run"
                                    />
                                </div>
                            )}

                            <div className="d-flex gap-2">
                                <button className="btn btn-secondary" onClick={() => setStep(4)}>Back</button>
                                <button className="btn btn-success btn-lg" onClick={handleSubmit}>Launch My HQ</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Wizard;
