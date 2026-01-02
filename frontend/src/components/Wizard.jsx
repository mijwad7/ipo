import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import WizardProgressBar from './wizard/WizardProgressBar';
import Step0TypeSelection from './wizard/Step0TypeSelection';
import Step1Identity from './wizard/Step1Identity';
import Step2TemplateSelection from './wizard/Step2TemplateSelection';
import Step3Election from './wizard/Step2Election';
import Step4Bio from './wizard/Step3Bio';
import Step5Platform from './wizard/Step4Platform';
import Step6Customization from './wizard/Step5Customization';

const Wizard = () => {
    const navigate = useNavigate();
    
    const getInitialFormData = () => ({
        // Type selection
        submission_type: 'campaign',
        organization_subtype: null,
        campaign_subtype: 'election',

        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        otp_code: '',
        otp_verified: false,

        // Election/Organization details
        riding_zone_name: '',
        election_date: '',
        organization_name: '', // Required for organizations

        // Bio
        headshot: null,
        background_picture: null,
        bio_text: '',
        position_running_for: '',
        tag_line: '',
        
        // Organization-specific images
        logo: null,
        owner_photo: null,
        sales_team_photo: null,

        // Platform/Services
        pillar_1: '',
        pillar_1_desc: '',
        pillar_2: '',
        pillar_2_desc: '',
        pillar_3: '',
        pillar_3_desc: '',
        action_shot_1: null,
        action_shot_2: null,
        action_shot_3: null,
        
        // Organization services (completely custom)
        service_1: '',
        service_1_desc: '',
        service_2: '',
        service_2_desc: '',
        service_3: '',
        service_3_desc: '',
        service_image_1: null,
        service_image_2: null,
        service_image_3: null,

        // Customization
        template_style: 'modern',
        preferred_template: 'modern',
        primary_color: '#1D3557',
        secondary_color: '#F1FAEE',
        custom_slug: '',
        is_password_protected: false,
        password: 'run',

        // Other
        donation_url: '',
        event_date: '',
    });

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });
    const [formData, setFormData] = useState(getInitialFormData());

    const [otpSent, setOtpSent] = useState(false);
    const [pillarDescriptions, setPillarDescriptions] = useState({});
    const [customSlugManuallyEdited, setCustomSlugManuallyEdited] = useState(false);
    const [electionDateError, setElectionDateError] = useState('');
    const [customSlugError, setCustomSlugError] = useState('');
    const [customPillarMode, setCustomPillarMode] = useState({ 1: false, 2: false, 3: false });
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

    const TOTAL_STEPS = 7;

    const stepConfig = [
        { number: 0, name: 'Type', time: '15 sec' },
        { number: 1, name: 'Identity', time: '30 sec' },
        { number: 2, name: 'Template', time: '20 sec' },
        { number: 3, name: formData.submission_type === 'organization' ? 'Organization' : 'Election', time: '30 sec' },
        { number: 4, name: 'Bio Setup', time: '30 sec' },
        { number: 5, name: formData.submission_type === 'organization' ? 'Services' : 'Platform', time: '30 sec' },
        { number: 6, name: 'Customization', time: '30 sec' },
    ];

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
        if (step === 0) {
            if (!formData.submission_type) {
                showAlert('Please select a type', 'warning');
                return;
            }
            if (formData.submission_type === 'organization' && !formData.organization_subtype) {
                showAlert('Please select an organization type', 'warning');
                return;
            }
            if (formData.submission_type === 'campaign' && !formData.campaign_subtype) {
                showAlert('Please select a campaign type', 'warning');
                return;
            }
        }
        if (step === 1 && !formData.otp_verified) {
            showAlert('Please verify your phone number first', 'warning');
            return;
        }
        if (step === 3) {
            if (formData.submission_type === 'organization') {
                if (!formData.organization_name || !formData.organization_name.trim()) {
                    showAlert('Please enter your organization name', 'warning');
                    return;
                }
            } else {
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
        }
        if (step === 4) {
            if (formData.submission_type === 'organization') {
                if (!formData.logo || !formData.owner_photo || !formData.bio_text) {
                    showAlert('Please upload logo, owner photo and provide a bio', 'warning');
                    return;
                }
            } else {
                if (!formData.headshot || !formData.bio_text) {
                    showAlert('Please upload a headshot and provide a bio', 'warning');
                    return;
                }
            }
        }
        if (step === 5) {
            if (formData.submission_type === 'organization') {
                if (!formData.service_1 || !formData.service_2 || !formData.service_3) {
                    showAlert('Please enter all 3 services', 'warning');
                    return;
                }
            } else {
                if (!formData.pillar_1 || !formData.pillar_2 || !formData.pillar_3) {
                    showAlert('Please select all 3 pillars', 'warning');
                    return;
                }
            }
        }
        if (step === 6) {
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
        
        // Always include submission_type first
        data.append('submission_type', formData.submission_type);
        
        // Define which fields to exclude based on submission type
        const organizationExcludeFields = [
            'headshot', 'position_running_for', 'donation_url', 'event_calendar_url',
            'riding_zone_name', 'election_date', 'pillar_1', 'pillar_1_desc',
            'pillar_2', 'pillar_2_desc', 'pillar_3', 'pillar_3_desc',
            'action_shot_1', 'action_shot_2', 'action_shot_3', 'campaign_subtype'
        ];
        
        const campaignExcludeFields = [
            'logo', 'owner_photo', 'sales_team_photo', 'organization_name',
            'organization_subtype', 'service_1', 'service_1_desc',
            'service_2', 'service_2_desc', 'service_3', 'service_3_desc',
            'service_image_1', 'service_image_2', 'service_image_3'
        ];
        
        const imageFields = [
            'headshot', 'background_picture', 'logo', 'owner_photo', 'sales_team_photo',
            'action_shot_1', 'action_shot_2', 'action_shot_3',
            'service_image_1', 'service_image_2', 'service_image_3'
        ];
        
        // Process all form fields
        Object.keys(formData).forEach(key => {
            // Skip submission_type (already added)
            if (key === 'submission_type') {
                return;
            }
            
            // Handle image fields
            if (imageFields.includes(key)) {
                if (formData[key]) {
                    data.append(key, formData[key], formData[key].name);
                }
                return;
            }
            
            // Handle custom_slug
            if (key === 'custom_slug') {
                if (customSlugManuallyEdited && formData.custom_slug && formData.custom_slug.trim()) {
                    data.append(key, formData[key]);
                }
                return;
            }
            
            // Filter fields based on submission type
            const excludeFields = formData.submission_type === 'organization' 
                ? organizationExcludeFields 
                : campaignExcludeFields;
            
            if (!excludeFields.includes(key)) {
                const value = formData[key];
                // Only append if value exists and is not empty
                if (value !== null && value !== undefined && value !== '') {
                    data.append(key, value);
                }
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
                        {formData.submission_type === 'organization' ? 'Build Your Organization Site' : 'Build Your Campaign HQ'}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                        Create your professional {formData.submission_type === 'organization' ? 'organization' : 'campaign'} site in minutes
                    </p>
                </div>

                <WizardProgressBar 
                    step={step} 
                    stepConfig={stepConfig} 
                    totalSteps={TOTAL_STEPS} 
                />

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
                        {step === 0 && (
                            <Step0TypeSelection
                                formData={formData}
                                handleChange={handleChange}
                                setFormData={setFormData}
                                setStep={setStep}
                                onNext={handleNext}
                                alert={alert}
                                setAlert={setAlert}
                            />
                        )}

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
                            <Step2TemplateSelection
                                formData={formData}
                                handleChange={handleChange}
                                hoveredTemplate={hoveredTemplate}
                                setHoveredTemplate={setHoveredTemplate}
                                setFormData={setFormData}
                                setStep={setStep}
                                onNext={handleNext}
                                alert={alert}
                                setAlert={setAlert}
                            />
                        )}

                        {step === 3 && (
                            <Step3Election
                                formData={formData}
                                handleChange={handleChange}
                                electionDateError={electionDateError}
                                setStep={setStep}
                                onNext={handleNext}
                                alert={alert}
                                setAlert={setAlert}
                            />
                        )}

                        {step === 4 && (
                            <Step4Bio
                                formData={formData}
                                handleChange={handleChange}
                                handleImageUpload={handleImageUpload}
                                setStep={setStep}
                                onNext={handleNext}
                                alert={alert}
                                setAlert={setAlert}
                            />
                        )}

                        {step === 5 && (
                            <Step5Platform
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

                        {step === 6 && (
                            <Step6Customization
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
