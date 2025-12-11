import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const Wizard = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });
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
        position_running_for: '',
        tag_line: '',

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
    const [hoveredTemplate, setHoveredTemplate] = useState(null);

    const showAlert = (message, type = 'danger') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'danger' }), 5000);
    };

    const TOTAL_STEPS = 5;

    const stepConfig = [
        { number: 1, name: 'Identity', time: '30 sec' },
        { number: 2, name: 'Election Details', time: '30 sec' },
        { number: 3, name: 'Bio Setup', time: '30 sec' },
        { number: 4, name: 'Platform', time: '30 sec' },
        { number: 5, name: 'Customization', time: '30 sec' },
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
                showAlert('Image compression failed. Please try again with a different image.', 'danger');
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
            showAlert('OTP Sent', 'success');
        } catch (error) {
            showAlert('Failed to send OTP. Please try again.', 'danger');
        }
    };

    const verifyOtp = async () => {
        try {
            const res = await axios.post('/api/otp/verify/', { code: formData.otp_code });
            if (res.data.verified) {
                setFormData(prev => ({ ...prev, otp_verified: true }));
                setStep(2);
                showAlert('Phone number verified successfully!', 'success');
            }
        } catch (error) {
            showAlert('Invalid OTP code. Please try again.', 'danger');
        }
    };

    const handleNext = () => {
        // Basic validation before moving to next step
        if (step === 1 && !formData.otp_verified) {
            showAlert('Please verify your phone number first', 'warning');
            return;
        }
        if (step === 2) {
            if (!formData.riding_zone_name || !formData.election_date) {
                showAlert('Please fill in all election details', 'warning');
                return;
            }
            // Validate election date is in the future
            if (formData.election_date) {
                const selectedDate = new Date(formData.election_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate <= today) {
                    setElectionDateError('Election date must be in the future');
                    showAlert('Election date must be in the future', 'warning');
                    return;
                }
            }
        }
        if (step === 3 && (!formData.headshot || !formData.bio_text)) {
            showAlert('Please upload a headshot and provide a bio', 'warning');
            return;
        }
        if (step === 4 && (!formData.pillar_1 || !formData.pillar_2 || !formData.pillar_3)) {
            showAlert('Please select all 3 pillars', 'warning');
            return;
        }
        if (step === 5) {
            // Validate custom_slug format before submission
            if (formData.custom_slug && !/^[a-z0-9]+$/.test(formData.custom_slug)) {
                setCustomSlugError('Only letters and numbers allowed (no spaces, hyphens, or special characters)');
                showAlert('Please fix the custom URL format. Only letters and numbers are allowed.', 'warning');
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
            const errorMessage = error.response?.data 
                ? (typeof error.response.data === 'string' 
                    ? error.response.data 
                    : JSON.stringify(error.response.data))
                : error.message;
            showAlert(`Submission Failed: ${errorMessage}`, 'danger');
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
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem 0'
        }}>
            <div className="container" style={{ maxWidth: '700px' }}>
                {alert.show && (
                    <div className={`alert alert-${alert.type} alert-dismissible fade show shadow-sm`} role="alert" style={{ borderRadius: '12px', border: 'none' }}>
                        <i className={`bi ${alert.type === 'success' ? 'bi-check-circle-fill' : alert.type === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-x-circle-fill'} me-2`}></i>
                        {alert.message}
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setAlert({ show: false, message: '', type: 'danger' })}
                            aria-label="Close"
                        ></button>
                    </div>
                )}
                <div className="text-center mb-4">
                    <h2 className="mb-2" style={{ 
                        color: '#ffffff', 
                        fontWeight: '700',
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        fontSize: '2.5rem'
                    }}>
                        Build Your Campaign HQ
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                        Create your professional campaign site in minutes
                    </p>
                </div>
            
            {/* Enhanced Progress Bar */}
            <div className="card mb-4 border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <div className="card-body p-4" style={{ background: '#ffffff' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h5 className="mb-1" style={{ color: '#2d3748', fontWeight: '600' }}>
                                Step {step} of {TOTAL_STEPS} - {currentStepConfig.name}
                            </h5>
                            <small style={{ color: '#718096' }}>~{currentStepConfig.time}</small>
                        </div>
                        <div className="text-end">
                            <small style={{ color: '#718096' }}>Build your campaign in under 3 minutes</small>
                        </div>
                    </div>
                    <div className="progress mb-3" style={{ 
                        height: '30px', 
                        borderRadius: '15px',
                        backgroundColor: '#e2e8f0',
                        overflow: 'hidden'
                    }}>
                        <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ 
                                width: `${progressPercentage}%`,
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                transition: 'width 0.5s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '600',
                                color: '#ffffff',
                                fontSize: '0.9rem'
                            }}
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
                                className="text-center"
                                style={{ flex: 1 }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: idx + 1 <= step 
                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                        : '#e2e8f0',
                                    color: idx + 1 <= step ? '#ffffff' : '#a0aec0',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    marginBottom: '0.5rem',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {idx + 1 <= step ? '✓' : config.number}
                                </div>
                                <div style={{ 
                                    fontSize: '0.75rem',
                                    color: idx + 1 <= step ? '#667eea' : '#a0aec0',
                                    fontWeight: idx + 1 <= step ? '600' : '400'
                                }}>
                                    {config.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {loading && (
                <div className="card border-0 shadow-lg text-center p-5" style={{ borderRadius: '16px', background: '#ffffff' }}>
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h3 style={{ color: '#2d3748', fontWeight: '600' }}>Building your HQ...</h3>
                </div>
            )}

            {!loading && (
                <>
                    {/* Step 1: Identity */}
                    {step === 1 && (
                        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
                            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                                <i className="bi bi-person-badge me-2" style={{ color: '#667eea' }}></i>
                                Step 1: Identity
                            </h4>
                            <input 
                                name="first_name" 
                                className="form-control mb-3" 
                                placeholder="First Name" 
                                value={formData.first_name}
                                onChange={handleChange}
                                style={{ 
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem'
                                }}
                            />
                            <input 
                                name="last_name" 
                                className="form-control mb-3" 
                                placeholder="Last Name" 
                                value={formData.last_name}
                                onChange={handleChange}
                                style={{ 
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem'
                                }}
                            />
                            <input 
                                name="email" 
                                className="form-control mb-3" 
                                placeholder="Email" 
                                type="email" 
                                value={formData.email}
                                onChange={handleChange}
                                style={{ 
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem'
                                }}
                            />
                            <div className="d-flex gap-2 mb-3">
                                <input 
                                    name="phone" 
                                    className="form-control" 
                                    placeholder="Mobile Phone" 
                                    value={formData.phone}
                                    onChange={handleChange}
                                    style={{ 
                                        borderRadius: '10px',
                                        border: '2px solid #e2e8f0',
                                        padding: '0.75rem 1rem',
                                        fontSize: '1rem'
                                    }}
                                />
                                <button 
                                    className="btn" 
                                    onClick={sendOtp}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        padding: '0.75rem 1.5rem',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    Send OTP
                                </button>
                            </div>
                            {otpSent && (
                                <>
                                    <label className="form-label fw-bold">One Time Password (OTP) Check</label>
                                    <input 
                                        name="otp_code" 
                                        className="form-control mb-3" 
                                        placeholder="Enter One Time Password (OTP)" 
                                        value={formData.otp_code}
                                        onChange={handleChange}
                                        style={{ 
                                            borderRadius: '10px',
                                            border: '2px solid #e2e8f0',
                                            padding: '0.75rem 1rem',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    <small className="text-muted d-block mb-3">
                                        Please enter the One Time Password (OTP) code sent to your mobile phone.
                                    </small>
                                    <button 
                                        className="btn" 
                                        onClick={verifyOtp}
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            color: '#ffffff',
                                            fontWeight: '600',
                                            borderRadius: '10px',
                                            padding: '0.75rem 2rem',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        Verify OTP
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 2: Election Details */}
                    {step === 2 && (
                        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
                            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                                <i className="bi bi-calendar-check me-2" style={{ color: '#667eea' }}></i>
                                Step 2: Election Details
                            </h4>
                            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Riding / Zone Name</label>
                            <input 
                                name="riding_zone_name" 
                                className="form-control mb-3" 
                                placeholder="e.g., District 5, Ward 3" 
                                value={formData.riding_zone_name}
                                onChange={handleChange}
                                style={{ 
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Election Date</label>
                            <input 
                                name="election_date" 
                                type="date" 
                                className={`form-control mb-2 ${electionDateError ? 'is-invalid' : ''}`}
                                value={formData.election_date}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                style={{ 
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                            {electionDateError && (
                                <div className="text-danger small mb-3">{electionDateError}</div>
                            )}
                            <div className="d-flex gap-2 mt-4">
                                <button 
                                    className="btn" 
                                    onClick={() => setStep(1)}
                                    style={{
                                        background: '#e2e8f0',
                                        border: 'none',
                                        color: '#4a5568',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        padding: '0.75rem 2rem',
                                        flex: 1
                                    }}
                                >
                                    Back
                                </button>
                                <button 
                                    className="btn" 
                                    onClick={handleNext}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        padding: '0.75rem 2rem',
                                        flex: 1,
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Bio Setup */}
                    {step === 3 && (
                        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
                            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                                <i className="bi bi-file-person me-2" style={{ color: '#667eea' }}></i>
                                Step 3: Bio Setup
                            </h4>
                            
                            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Position Running For</label>
                            <input 
                                type="text" 
                                name="position_running_for" 
                                className="form-control mb-3" 
                                placeholder="e.g., Jeff for Mayor, Jeff for Leadership" 
                                value={formData.position_running_for}
                                onChange={handleChange}
                                style={{ 
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem'
                                }}
                            />
                            <small className="text-muted d-block mb-3">Enter the position you are running for</small>
                            
                            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Tag Line</label>
                            <input 
                                type="text" 
                                name="tag_line" 
                                className="form-control mb-3" 
                                placeholder="e.g., Family Faith Freedom, Vote for Leadership" 
                                value={formData.tag_line}
                                onChange={handleChange}
                                style={{ 
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem'
                                }}
                            />
                            <small className="text-muted d-block mb-3">Enter your campaign tag line</small>
                            
                            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Headshot (Required)</label>
                            <input 
                                type="file" 
                                className="form-control mb-3" 
                                accept="image/*" 
                                onChange={(e) => handleImageUpload(e, 'headshot')}
                                style={{ 
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                            {formData.headshot && (
                                <div className="text-success small mb-3">✓ Image selected: {formData.headshot.name}</div>
                            )}
                            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Bio</label>
                            <textarea 
                                name="bio_text" 
                                className="form-control mb-3" 
                                placeholder="Tell us about yourself and your campaign..." 
                                rows="5"
                                value={formData.bio_text}
                                onChange={handleChange}
                                style={{ 
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem'
                                }}
                                required
                            ></textarea>
                            <div className="d-flex gap-2 mt-4">
                                <button 
                                    className="btn" 
                                    onClick={() => setStep(2)}
                                    style={{
                                        background: '#e2e8f0',
                                        border: 'none',
                                        color: '#4a5568',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        padding: '0.75rem 2rem',
                                        flex: 1
                                    }}
                                >
                                    Back
                                </button>
                                <button 
                                    className="btn" 
                                    onClick={handleNext}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        padding: '0.75rem 2rem',
                                        flex: 1,
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Platform */}
                    {step === 4 && (
                        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
                            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                                <i className="bi bi-bullseye me-2" style={{ color: '#667eea' }}></i>
                                Step 4: Platform
                            </h4>
                            <p style={{ color: '#718096' }}>Select your top 3 priorities</p>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="mb-4 p-4 rounded" style={{ 
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    background: '#f7fafc'
                                }}>
                                    <h5 className="mb-3" style={{ color: '#2d3748', fontWeight: '600' }}>Pillar {i}</h5>

                                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Topic</label>
                                    <select 
                                        className="form-control mb-3" 
                                        name={`pillar_${i}`} 
                                        onChange={(e) => handlePillarChange(e, i)} 
                                        value={customPillarMode[i] ? 'Custom' : (formData[`pillar_${i}`] || '')}
                                        style={{ 
                                            borderRadius: '10px',
                                            border: '2px solid #e2e8f0',
                                            padding: '0.75rem 1rem',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        <option value="">Select...</option>
                                        {PILLAR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    {customPillarMode[i] && (
                                        <input 
                                            className="form-control mb-3" 
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
                                            style={{ 
                                                borderRadius: '10px',
                                                border: '2px solid #e2e8f0',
                                                padding: '0.75rem 1rem',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    )}

                                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Description</label>
                                    <textarea
                                        className="form-control mb-3"
                                        name={`pillar_${i}_desc`}
                                        placeholder={`Explain your stance on ${formData[`pillar_${i}`] || 'this topic'}...`}
                                        rows="4"
                                        onChange={handleChange}
                                        value={formData[`pillar_${i}_desc`]}
                                        style={{ 
                                            borderRadius: '10px',
                                            border: '2px solid #e2e8f0',
                                            padding: '0.75rem 1rem',
                                            fontSize: '1rem'
                                        }}
                                    ></textarea>

                                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Action Shot (Optional)</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, `action_shot_${i}`)}
                                        style={{ 
                                            borderRadius: '10px',
                                            border: '2px solid #e2e8f0',
                                            padding: '0.75rem 1rem',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    {formData[`action_shot_${i}`] && (
                                        <div className="text-success small mt-1">✓ Image selected</div>
                                    )}
                                </div>
                            ))}
                            <div className="d-flex gap-2 mt-4">
                                <button 
                                    className="btn" 
                                    onClick={() => setStep(3)}
                                    style={{
                                        background: '#e2e8f0',
                                        border: 'none',
                                        color: '#4a5568',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        padding: '0.75rem 2rem',
                                        flex: 1
                                    }}
                                >
                                    Back
                                </button>
                                <button 
                                    className="btn" 
                                    onClick={handleNext}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        padding: '0.75rem 2rem',
                                        flex: 1,
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Customization */}
                    {step === 5 && (
                        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
                            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                                <i className="bi bi-palette me-2" style={{ color: '#667eea' }}></i>
                                Step 5: Customization
                            </h4>
                            
                            {/* Disclosure Notice */}
                            <div className="alert d-flex align-items-center mb-4" role="alert" style={{
                                borderLeft: '4px solid #f59e0b',
                                backgroundColor: '#fffbeb',
                                borderColor: '#f59e0b',
                                borderRadius: '12px',
                                border: '2px solid #fde68a'
                            }}>
                                <i className="bi bi-exclamation-triangle-fill me-2" style={{ fontSize: '1.2rem', color: '#f59e0b' }}></i>
                                <div>
                                    <strong className="d-block mb-1" style={{ color: '#92400e' }}>Important Notice:</strong>
                                    <span style={{ color: '#78350f' }}>This is temporary Customization only. Hundreds of templates and full customization available after account creation</span>
                                </div>
                            </div>
                            
                            {/* Two-Column Layout: Left = Selection, Right = Preview */}
                            <div className="row g-4">
                                {/* Left Column: Template Selection (Desktop) / Template Selection + Color Pickers (Mobile) */}
                                <div className="col-lg-5 col-md-12 order-lg-1 order-1">
                                    <label className="form-label mb-3">Template Style</label>
                                    
                                    {/* Template Selection Cards - Stacked Vertically */}
                                    <div className="mb-4">
                                        <div 
                                            className="card mb-3 border-0"
                                            style={{ 
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                borderRadius: '12px',
                                                border: formData.template_style === 'modern' ? '3px solid #667eea' : '2px solid #e2e8f0',
                                                background: formData.template_style === 'modern' ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : '#ffffff',
                                                boxShadow: formData.template_style === 'modern' ? '0 4px 12px rgba(102, 126, 234, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                                                transform: hoveredTemplate === 'modern' ? 'translateY(-2px)' : 'translateY(0)'
                                            }}
                                            onMouseEnter={() => setHoveredTemplate('modern')}
                                            onMouseLeave={() => setHoveredTemplate(null)}
                                            onClick={() => setFormData(prev => ({ ...prev, template_style: 'modern' }))}
                                        >
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h5 className="card-title mb-1" style={{ color: '#2d3748', fontWeight: '600' }}>Modern</h5>
                                                        <p className="card-text small mb-0" style={{ color: '#718096' }}>Clean, contemporary design</p>
                                                    </div>
                                                    {formData.template_style === 'modern' && (
                                                        <i className="bi bi-check-circle-fill" style={{ fontSize: '1.5rem', color: '#667eea' }}></i>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            className="card mb-3 border-0"
                                            style={{ 
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                borderRadius: '12px',
                                                border: formData.template_style === 'traditional' ? '3px solid #667eea' : '2px solid #e2e8f0',
                                                background: formData.template_style === 'traditional' ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : '#ffffff',
                                                boxShadow: formData.template_style === 'traditional' ? '0 4px 12px rgba(102, 126, 234, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                                                transform: hoveredTemplate === 'traditional' ? 'translateY(-2px)' : 'translateY(0)'
                                            }}
                                            onMouseEnter={() => setHoveredTemplate('traditional')}
                                            onMouseLeave={() => setHoveredTemplate(null)}
                                            onClick={() => setFormData(prev => ({ ...prev, template_style: 'traditional' }))}
                                        >
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h5 className="card-title mb-1" style={{ color: '#2d3748', fontWeight: '600' }}>Traditional</h5>
                                                        <p className="card-text small mb-0" style={{ color: '#718096' }}>Classic, professional layout</p>
                                                    </div>
                                                    {formData.template_style === 'traditional' && (
                                                        <i className="bi bi-check-circle-fill" style={{ fontSize: '1.5rem', color: '#667eea' }}></i>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            className="card mb-3 border-0"
                                            style={{ 
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                borderRadius: '12px',
                                                border: formData.template_style === 'bold' ? '3px solid #667eea' : '2px solid #e2e8f0',
                                                background: formData.template_style === 'bold' ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : '#ffffff',
                                                boxShadow: formData.template_style === 'bold' ? '0 4px 12px rgba(102, 126, 234, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                                                transform: hoveredTemplate === 'bold' ? 'translateY(-2px)' : 'translateY(0)'
                                            }}
                                            onMouseEnter={() => setHoveredTemplate('bold')}
                                            onMouseLeave={() => setHoveredTemplate(null)}
                                            onClick={() => setFormData(prev => ({ ...prev, template_style: 'bold' }))}
                                        >
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h5 className="card-title mb-1" style={{ color: '#2d3748', fontWeight: '600' }}>Bold</h5>
                                                        <p className="card-text small mb-0" style={{ color: '#718096' }}>Striking, high-impact design</p>
                                                    </div>
                                                    {formData.template_style === 'bold' && (
                                                        <i className="bi bi-check-circle-fill" style={{ fontSize: '1.5rem', color: '#667eea' }}></i>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <small className="text-muted d-block mb-3">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Hover over a template to preview, click to select.
                                    </small>
                                    
                                    {/* Color Customization - Hidden on mobile (shown below screenshot) */}
                                    <div className="mb-3 d-lg-block d-md-none d-none">
                                        <label className="form-label mb-2">Color Customization</label>
                                        
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <label className="form-label small">Primary Color</label>
                                                <input 
                                                    type="color" 
                                                    className="form-control form-control-color mb-2" 
                                                    name="primary_color" 
                                                    value={formData.primary_color} 
                                                    onChange={handleChange} 
                                                    style={{ width: '100%', height: '50px', cursor: 'pointer' }}
                                                />
                                                <small className="text-muted small">Headers & buttons</small>
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label small">Secondary Color</label>
                                                <input 
                                                    type="color" 
                                                    className="form-control form-control-color mb-2" 
                                                    name="secondary_color" 
                                                    value={formData.secondary_color} 
                                                    onChange={handleChange} 
                                                    style={{ width: '100%', height: '50px', cursor: 'pointer' }}
                                                />
                                                <small className="text-muted small">Borders & accents</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Full Preview Link - Hidden on mobile */}
                                    <div className="mt-3 d-lg-block d-md-none d-none">
                                        <Link 
                                            to={`/preview/${formData.template_style}?primary=${encodeURIComponent(formData.primary_color)}&secondary=${encodeURIComponent(formData.secondary_color)}`}
                                            target="_blank"
                                            className="btn btn-outline-primary w-100"
                                        >
                                            <i className="bi bi-box-arrow-up-right me-2"></i>
                                            View Full Preview
                                        </Link>
                                    </div>
                                </div>
                                
                                {/* Right Column: Template Preview Thumbnail */}
                                <div className="col-lg-7 col-md-12 order-lg-2 order-2">
                                    <label className="form-label mb-2">Live Preview</label>
                                    <div 
                                        className="position-relative border rounded shadow-sm" 
                                        style={{ 
                                            border: '2px solid #dee2e6', 
                                            borderRadius: '8px', 
                                            overflow: 'hidden', 
                                            backgroundColor: '#f8f9fa',
                                            minHeight: '400px',
                                            maxHeight: '600px'
                                        }}
                                    >
                                        <img 
                                            src={`/template-${hoveredTemplate || formData.template_style}-preview.png`}
                                            alt={`${hoveredTemplate || formData.template_style} template preview`}
                                            className="img-fluid w-100"
                                            style={{ 
                                                display: 'block',
                                                height: 'auto',
                                                objectFit: 'contain'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const placeholder = e.target.nextElementSibling;
                                                if (placeholder) placeholder.style.display = 'flex';
                                            }}
                                        />
                                        <div 
                                            className="text-center p-4 text-muted d-none align-items-center justify-content-center" 
                                            style={{ 
                                                position: 'absolute', 
                                                top: 0, 
                                                left: 0, 
                                                right: 0, 
                                                bottom: 0,
                                                minHeight: '400px',
                                                flexDirection: 'column'
                                            }}
                                        >
                                            <i className="bi bi-image fs-1 d-block mb-2"></i>
                                            <small>Template preview screenshot will appear here</small>
                                            <br />
                                            <small className="text-danger">
                                                Please add template-{hoveredTemplate || formData.template_style}-preview.png to the public folder
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Color Customization - Mobile Only (shown below screenshot) */}
                                <div className="col-12 order-3 d-lg-none d-md-block d-block">
                                    <div className="mb-3 mt-4">
                                        <label className="form-label mb-2">Color Customization</label>
                                        
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <label className="form-label small">Primary Color</label>
                                                <input 
                                                    type="color" 
                                                    className="form-control form-control-color mb-2" 
                                                    name="primary_color" 
                                                    value={formData.primary_color} 
                                                    onChange={handleChange} 
                                                    style={{ width: '100%', height: '50px', cursor: 'pointer' }}
                                                />
                                                <small className="text-muted small">Headers & buttons</small>
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label small">Secondary Color</label>
                                                <input 
                                                    type="color" 
                                                    className="form-control form-control-color mb-2" 
                                                    name="secondary_color" 
                                                    value={formData.secondary_color} 
                                                    onChange={handleChange} 
                                                    style={{ width: '100%', height: '50px', cursor: 'pointer' }}
                                                />
                                                <small className="text-muted small">Borders & accents</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Full Preview Link - Mobile */}
                                    <div className="mt-3">
                                        <Link 
                                            to={`/preview/${formData.template_style}?primary=${encodeURIComponent(formData.primary_color)}&secondary=${encodeURIComponent(formData.secondary_color)}`}
                                            target="_blank"
                                            className="btn btn-outline-primary w-100"
                                        >
                                            <i className="bi bi-box-arrow-up-right me-2"></i>
                                            View Full Preview
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Customizable temporary website address</label>
                            <input 
                                type="text" 
                                className={`form-control mb-2 ${customSlugError ? 'is-invalid' : ''}`}
                                name="custom_slug" 
                                placeholder="e.g., jeffformayor, jeffwill, firstlast, johndoe" 
                                value={formData.custom_slug}
                                onChange={handleChange}
                                style={{ 
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem'
                                }}
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
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <label className="form-check-label" htmlFor="passwordProtection" style={{ cursor: 'pointer', color: '#4a5568' }}>
                                        Password protected
                                    </label>
                                </div>
                                <small className="text-muted d-block mt-1">
                                    Some people don't want temp websites public, so password protection helps with that.
                                </small>
                            </div>

                            {formData.is_password_protected && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Password</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="password" 
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="run"
                                        style={{ 
                                            borderRadius: '10px',
                                            border: '2px solid #e2e8f0',
                                            padding: '0.75rem 1rem',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                            )}

                            <div className="d-flex gap-2 mt-4">
                                <button 
                                    className="btn" 
                                    onClick={() => setStep(4)}
                                    style={{
                                        background: '#e2e8f0',
                                        border: 'none',
                                        color: '#4a5568',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        padding: '0.75rem 2rem',
                                        flex: 1
                                    }}
                                >
                                    Back
                                </button>
                                <button 
                                    className="btn btn-lg" 
                                    onClick={handleSubmit}
                                    style={{
                                        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontWeight: '700',
                                        borderRadius: '10px',
                                        padding: '0.75rem 2rem',
                                        flex: 2,
                                        fontSize: '1.1rem',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <i className="bi bi-rocket-takeoff me-2"></i>
                                    Launch My HQ
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
            </div>
        </div>
    );
};

export default Wizard;
