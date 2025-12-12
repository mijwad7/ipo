import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import WizardProgressBar from './wizard/WizardProgressBar';
import Step1Identity from './wizard/Step1Identity';
import Step2Election from './wizard/Step2Election';
import Step3Bio from './wizard/Step3Bio';
import Step4Platform from './wizard/Step4Platform';
import Step5Customization from './wizard/Step5Customization';

const STORAGE_KEY = 'campaign_wizard_data';

const Wizard = () => {
    const navigate = useNavigate();
    
    // Load saved data from localStorage on mount
    const loadSavedData = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                const formData = parsed.formData || getInitialFormData();
                // Reset image fields to null since File objects can't be restored
                // Users will need to re-upload images, but all text data is preserved
                formData.headshot = null;
                formData.background_picture = null;
                formData.action_shot_1 = null;
                formData.action_shot_2 = null;
                formData.action_shot_3 = null;
                return {
                    step: parsed.step || 1,
                    formData,
                    otpSent: parsed.otpSent || false,
                    customSlugManuallyEdited: parsed.customSlugManuallyEdited || false,
                    customPillarMode: parsed.customPillarMode || { 1: false, 2: false, 3: false },
                };
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
            localStorage.removeItem(STORAGE_KEY);
        }
        return {
            step: 1,
            formData: getInitialFormData(),
            otpSent: false,
            customSlugManuallyEdited: false,
            customPillarMode: { 1: false, 2: false, 3: false },
        };
    };

    const getInitialFormData = () => ({
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
        background_picture: null,
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

    const savedData = loadSavedData();
    const [step, setStep] = useState(savedData.step);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });
    const [formData, setFormData] = useState(savedData.formData);
    const [progressRestored, setProgressRestored] = useState({ show: false, message: '' });

    const [otpSent, setOtpSent] = useState(savedData.otpSent);
    const [pillarDescriptions, setPillarDescriptions] = useState({});
    const [customSlugManuallyEdited, setCustomSlugManuallyEdited] = useState(savedData.customSlugManuallyEdited);
    const [electionDateError, setElectionDateError] = useState('');
    const [customSlugError, setCustomSlugError] = useState('');
    const [customPillarMode, setCustomPillarMode] = useState(savedData.customPillarMode);
    const [hoveredTemplate, setHoveredTemplate] = useState(null);

    const showAlert = (message, type = 'danger') => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: '', type: 'danger' });
        }, 5000);
        // Scroll to alert after a brief delay to ensure it's rendered
        setTimeout(() => {
            const alertElement = document.querySelector('.alert.show');
            if (alertElement) {
                alertElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
    };

    const TOTAL_STEPS = 5;

    const stepConfig = [
        { number: 1, name: 'Identity', time: '30 sec' },
        { number: 2, name: 'Election Details', time: '30 sec' },
        { number: 3, name: 'Bio Setup', time: '30 sec' },
        { number: 4, name: 'Platform', time: '30 sec' },
        { number: 5, name: 'Customization', time: '30 sec' },
    ];

    // Save data to localStorage whenever formData, step, or other state changes
    useEffect(() => {
        try {
            const dataToSave = {
                step,
                formData: {
                    ...formData,
                    // Don't save File objects, but save metadata
                    headshot: formData.headshot ? { 
                        name: formData.headshot.name, 
                        size: formData.headshot.size, 
                        type: formData.headshot.type 
                    } : null,
                    background_picture: formData.background_picture ? { 
                        name: formData.background_picture.name, 
                        size: formData.background_picture.size, 
                        type: formData.background_picture.type 
                    } : null,
                    action_shot_1: formData.action_shot_1 ? { 
                        name: formData.action_shot_1.name, 
                        size: formData.action_shot_1.size, 
                        type: formData.action_shot_1.type 
                    } : null,
                    action_shot_2: formData.action_shot_2 ? { 
                        name: formData.action_shot_2.name, 
                        size: formData.action_shot_2.size, 
                        type: formData.action_shot_2.type 
                    } : null,
                    action_shot_3: formData.action_shot_3 ? { 
                        name: formData.action_shot_3.name, 
                        size: formData.action_shot_3.size, 
                        type: formData.action_shot_3.type 
                    } : null,
                },
                otpSent,
                customSlugManuallyEdited,
                customPillarMode,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }, [formData, step, otpSent, customSlugManuallyEdited, customPillarMode]);

    // Show notification if data was restored on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.step > 1 || parsed.formData.first_name || parsed.formData.last_name) {
                    const hasImages = parsed.formData.headshot || parsed.formData.action_shot_1 || 
                                     parsed.formData.action_shot_2 || parsed.formData.action_shot_3;
                    if (hasImages) {
                        setProgressRestored({ 
                            show: true, 
                            message: 'Your previous progress has been restored! Please re-upload any images.' 
                        });
                    } else {
                        setProgressRestored({ 
                            show: true, 
                            message: 'Your previous progress has been restored!' 
                        });
                    }
                    // Auto-hide after 8 seconds
                    setTimeout(() => {
                        setProgressRestored({ show: false, message: '' });
                    }, 8000);
                }
            } catch (error) {
                // Ignore errors
            }
        }
    }, []);

    // Fetch pillar descriptions on mount
    useEffect(() => {
        axios.get('/api/pillars/')
            .then(res => setPillarDescriptions(res.data))
            .catch(err => console.error('Failed to load pillar descriptions:', err));
    }, []);

    // Auto-generate custom_slug from first_name + last_name when they change
    useEffect(() => {
        if (formData.first_name && formData.last_name && !customSlugManuallyEdited) {
            // Always regenerate from current first_name + last_name
            const first = (formData.first_name || '').trim();
            const last = (formData.last_name || '').trim();
            const generatedSlug = `${first}${last}`.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            setFormData(prev => {
                // Only update if the generated slug is different from current
                if (prev.custom_slug !== generatedSlug) {
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
            const originalValue = value.toLowerCase();
            const hasInvalidChars = /[^a-z0-9]/.test(originalValue);
            processedValue = originalValue.replace(/[^a-z0-9]/g, '');
            
            if (!customSlugManuallyEdited) {
                setCustomSlugManuallyEdited(true);
            }
            
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
            // Validate filename length (max 100 characters)
            if (file.name.length > 100) {
                showAlert(`Image filename is too long (${file.name.length} characters). Please rename the file to 100 characters or less.`, 'danger');
                // Clear the file input
                e.target.value = '';
                return;
            }
            
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
        
        setFormData(prev => {
            const updates = {
                ...prev,
                [pillarField]: pillarName
            };
            
            if (pillarName && pillarName !== 'Custom' && pillarDescriptions[pillarName]) {
                const previousPillar = prev[pillarField];
                if (previousPillar !== pillarName) {
                    updates[descField] = pillarDescriptions[pillarName];
                }
            } else if (pillarName === 'Custom') {
                updates[descField] = '';
                updates[pillarField] = '';
                setCustomPillarMode(prev => ({ ...prev, [pillarNum]: true }));
            } else {
                setCustomPillarMode(prev => ({ ...prev, [pillarNum]: false }));
            }
            
            return updates;
        });
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
            if (['headshot', 'background_picture', 'action_shot_1', 'action_shot_2', 'action_shot_3'].includes(key)) {
                if (formData[key]) {
                    data.append(key, formData[key], formData[key].name);
                }
            } else if (key === 'custom_slug') {
                // Only send custom_slug if it was manually edited, otherwise let backend generate from names
                if (customSlugManuallyEdited && formData.custom_slug && formData.custom_slug.trim()) {
                    data.append(key, formData[key]);
                }
                // If not manually edited, don't send it - backend will generate from first_name + last_name
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
            // Clear saved data on successful submission
            localStorage.removeItem(STORAGE_KEY);
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

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem 0'
        }}>
            <div className="container" style={{ maxWidth: '700px' }}>
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

                <WizardProgressBar 
                    step={step} 
                    stepConfig={stepConfig} 
                    totalSteps={TOTAL_STEPS} 
                />

                {/* Progress Restored Notification - Top of Form */}
                {progressRestored.show && (
                    <div className="alert alert-success alert-dismissible fade show shadow-sm mb-3" role="alert" style={{ borderRadius: '12px', border: 'none' }}>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        {progressRestored.message}
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setProgressRestored({ show: false, message: '' })}
                            aria-label="Close"
                        ></button>
                    </div>
                )}

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
                        {step === 1 && (
                            <Step1Identity
                                formData={formData}
                                handleChange={handleChange}
                                otpSent={otpSent}
                                setOtpSent={setOtpSent}
                                showAlert={showAlert}
                                setFormData={setFormData}
                                setStep={setStep}
                                alert={alert}
                                setAlert={setAlert}
                            />
                        )}

                        {step === 2 && (
                            <Step2Election
                                formData={formData}
                                handleChange={handleChange}
                                electionDateError={electionDateError}
                                setStep={setStep}
                                onNext={handleNext}
                                alert={alert}
                                setAlert={setAlert}
                            />
                        )}

                        {step === 3 && (
                            <Step3Bio
                                formData={formData}
                                handleChange={handleChange}
                                handleImageUpload={handleImageUpload}
                                setStep={setStep}
                                onNext={handleNext}
                                alert={alert}
                                setAlert={setAlert}
                            />
                        )}

                        {step === 4 && (
                            <Step4Platform
                                formData={formData}
                                handleChange={handleChange}
                                handleImageUpload={handleImageUpload}
                                handlePillarChange={handlePillarChange}
                                customPillarMode={customPillarMode}
                                setFormData={setFormData}
                                setStep={setStep}
                                onNext={handleNext}
                                alert={alert}
                                setAlert={setAlert}
                            />
                        )}

                        {step === 5 && (
                            <Step5Customization
                                formData={formData}
                                handleChange={handleChange}
                                customSlugError={customSlugError}
                                hoveredTemplate={hoveredTemplate}
                                setHoveredTemplate={setHoveredTemplate}
                                setFormData={setFormData}
                                setStep={setStep}
                                onSubmit={handleSubmit}
                                alert={alert}
                                setAlert={setAlert}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Wizard;
