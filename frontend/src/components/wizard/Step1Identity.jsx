import React, { useState } from 'react';
import axios from 'axios';

// Country codes with flags (emoji flags)
const COUNTRIES = [
    { code: '+1', name: 'Canada', flag: '🇨🇦' },
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
    { code: '+32', name: 'Belgium', flag: '🇧🇪' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
    { code: '+46', name: 'Sweden', flag: '🇸🇪' },
    { code: '+47', name: 'Norway', flag: '🇳🇴' },
    { code: '+45', name: 'Denmark', flag: '🇩🇰' },
    { code: '+358', name: 'Finland', flag: '🇫🇮' },
    { code: '+353', name: 'Ireland', flag: '🇮🇪' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' },
    { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
    { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+971', name: 'UAE', flag: '🇦🇪' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+974', name: 'Qatar', flag: '🇶🇦' },
    { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
    { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
    { code: '+968', name: 'Oman', flag: '🇴🇲' },
];

const Step1Identity = ({ formData, handleChange, otpSent, setOtpSent, showAlert, setFormData, setStep, alert, setAlert }) => {
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [sendingOtp, setSendingOtp] = useState(false);

    // Initialize country_code if not set (default to Canada +1)
    if (!formData.country_code) {
        setFormData(prev => ({ ...prev, country_code: '+1' }));
    }

    const validateEmail = (email) => {
        if (!email) {
            setEmailError('');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePhone = (phone) => {
        if (!phone) {
            setPhoneError('');
            return false;
        }
        // Phone validation - only digits, spaces, dashes, parentheses (no + sign since country code is separate)
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        const digitsOnly = phone.replace(/\D/g, '');

        // Minimum 7 digits, maximum 15 digits (without country code)
        if (!phoneRegex.test(phone) || digitsOnly.length < 7 || digitsOnly.length > 15) {
            setPhoneError('Please enter a valid phone number (7-15 digits)');
            return false;
        }
        setPhoneError('');
        return true;
    };

    const handleCountryCodeChange = (e) => {
        setFormData(prev => ({ ...prev, country_code: e.target.value }));
    };

    const handleEmailChange = (e) => {
        handleChange(e);
        validateEmail(e.target.value);
    };

    const handlePhoneChange = (e) => {
        handleChange(e);
        validatePhone(e.target.value);
    };

    const sendOtp = async () => {
        if (!validatePhone(formData.phone)) {
            showAlert('Please enter a valid phone number before sending OTP', 'warning');
            return;
        }
        setSendingOtp(true);
        try {
            // Combine country code and phone number
            const countryCode = formData.country_code || '+1';
            const phoneNumber = formData.phone.replace(/\D/g, ''); // Remove non-digits
            const fullPhone = `${countryCode}${phoneNumber}`;

            const res = await axios.post('/api/otp/request/', {
                phone: fullPhone,
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name
            });
            // Store contact_id for OTP verification
            if (res.data.contact_id) {
                setFormData(prev => ({ ...prev, ghl_contact_id: res.data.contact_id }));
            }
            setOtpSent(true);
            showAlert('OTP Sent', 'success');
        } catch (error) {
            showAlert('Failed to send OTP. Please try again.', 'danger');
        } finally {
            setSendingOtp(false);
        }
    };

    const verifyOtp = async () => {
        try {
            // Combine country code and phone number for verification
            const countryCode = formData.country_code || '+1';
            const phoneNumber = formData.phone.replace(/\D/g, ''); // Remove non-digits
            const fullPhone = `${countryCode}${phoneNumber}`;

            const res = await axios.post('/api/otp/verify/', {
                code: formData.otp_code,
                phone: fullPhone,
                contact_id: formData.ghl_contact_id
            });
            if (res.data.verified) {
                setFormData(prev => ({ ...prev, otp_verified: true }));
                setStep(2);
                showAlert('Phone number verified successfully!', 'success');
            }
        } catch (error) {
            showAlert('Invalid OTP code. Please try again.', 'danger');
        }
    };

    const inputStyle = {
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        padding: '0.75rem 1rem',
        fontSize: '1rem'
    };

    const buttonStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '10px',
        padding: '0.75rem 1.5rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    };

    const handleButtonHover = (e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
    };

    const handleButtonLeave = (e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                <i className="bi bi-person-badge me-2" style={{ color: '#667eea' }}></i>
                Step 1: Identity
            </h4>
            <label className="form-label fw-semibold mb-2" style={{ color: '#4a5568' }}>First Name</label>
            <input
                name="first_name"
                className="form-control mb-3"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                style={inputStyle}
            />
            <label className="form-label fw-semibold mb-2" style={{ color: '#4a5568' }}>Last Name</label>
            <input
                name="last_name"
                className="form-control mb-3"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                style={inputStyle}
            />
            <label className="form-label fw-semibold mb-2" style={{ color: '#4a5568' }}>Email</label>
            <input
                name="email"
                className={`form-control mb-1 ${emailError ? 'is-invalid' : ''}`}
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                onBlur={(e) => validateEmail(e.target.value)}
                style={inputStyle}
            />
            {emailError && (
                <div className="text-danger small mb-3">{emailError}</div>
            )}
            <label className="form-label fw-semibold mb-2" style={{ color: '#4a5568' }}>Mobile Phone</label>
            <div className="mb-1">
                {/* Mobile: Stack vertically, Desktop: Horizontal */}
                <div className="phone-input-container">
                    <div className="d-flex phone-input-group">
                        <select
                            name="country_code"
                            value={formData.country_code || '+1'}
                            onChange={handleCountryCodeChange}
                            className="form-select country-code-select"
                            style={{
                                ...inputStyle,
                                paddingRight: '0.5rem',
                                width: '120px',
                                minWidth: '120px',
                                cursor: 'pointer',
                                flexShrink: 0
                            }}
                        >
                            {COUNTRIES.map((country) => (
                                <option key={`${country.code}-${country.name}`} value={country.code}>
                                    {country.flag} {country.code}
                                </option>
                            ))}
                        </select>
                        <input
                            name="phone"
                            className={`form-control phone-input ${phoneError ? 'is-invalid' : ''}`}
                            placeholder="Phone Number"
                            value={formData.phone || ''}
                            onChange={handlePhoneChange}
                            onBlur={(e) => validatePhone(e.target.value)}
                            style={{
                                ...inputStyle,
                                flex: '1',
                                minWidth: '0'
                            }}
                        />
                    </div>
                    <button
                        className="btn send-otp-btn"
                        onClick={sendOtp}
                        disabled={sendingOtp}
                        style={{
                            ...buttonStyle,
                            opacity: sendingOtp ? 0.7 : 1,
                            cursor: sendingOtp ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                        }}
                        onMouseEnter={!sendingOtp ? handleButtonHover : undefined}
                        onMouseLeave={!sendingOtp ? handleButtonLeave : undefined}
                    >
                        {sendingOtp ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ borderColor: 'rgba(255, 255, 255, 0.3)', borderRightColor: '#ffffff' }}
                                ></span>
                                Sending...
                            </>
                        ) : (
                            'Send OTP'
                        )}
                    </button>
                </div>
            </div>
            <style>{`
                .phone-input-container {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .phone-input-group {
                    flex: 1 1 auto;
                    min-width: 0;
                }
                
                /* Mobile styles */
                @media (max-width: 767.98px) {
                    .phone-input-container {
                        gap: 0.75rem;
                    }
                    
                    .phone-input-group {
                        flex-direction: column;
                    }
                    
                    .country-code-select {
                        border-radius: 10px !important;
                        border: 2px solid #e2e8f0 !important;
                        width: 100% !important;
                        min-width: 100% !important;
                    }
                    
                    .phone-input {
                        border-radius: 10px !important;
                        border: 2px solid #e2e8f0 !important;
                        width: 100% !important;
                    }
                    
                    .send-otp-btn {
                        width: 100% !important;
                    }
                }
                
                /* Desktop styles */
                @media (min-width: 768px) {
                    .phone-input-container {
                        flex-direction: row;
                        gap: 0.5rem;
                    }
                    
                    .phone-input-group {
                        flex-direction: row;
                    }
                    
                    .country-code-select {
                        border-top-right-radius: 0 !important;
                        border-bottom-right-radius: 0 !important;
                        border-right: none !important;
                    }
                    
                    .phone-input {
                        border-top-left-radius: 0 !important;
                        border-bottom-left-radius: 0 !important;
                        border-left: none !important;
                    }
                }
            `}</style>
            {phoneError && (
                <div className="text-danger small mb-3">{phoneError}</div>
            )}
            {otpSent && (
                <>
                    <label className="form-label fw-bold">One Time Password (OTP) Check</label>
                    <input
                        name="otp_code"
                        className="form-control mb-3"
                        placeholder="Enter One Time Password (OTP)"
                        value={formData.otp_code}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <small className="text-muted d-block mb-3">
                        Please enter the One Time Password (OTP) code sent to your mobile phone.
                    </small>
                    {alert.show && (
                        <div className={`alert alert-${alert.type} alert-dismissible fade show shadow-sm mb-3`} role="alert" style={{ borderRadius: '12px', border: 'none' }}>
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
                    <button
                        className="btn"
                        onClick={verifyOtp}
                        style={{ ...buttonStyle, padding: '0.75rem 2rem' }}
                        onMouseEnter={handleButtonHover}
                        onMouseLeave={handleButtonLeave}
                    >
                        Verify OTP
                    </button>
                </>
            )}
            {alert.show && !otpSent && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show shadow-sm mt-3`} role="alert" style={{ borderRadius: '12px', border: 'none' }}>
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
        </div>
    );
};

export default Step1Identity;

