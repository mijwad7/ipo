import React, { useState } from 'react';
import axios from 'axios';

const Step1Identity = ({ formData, handleChange, otpSent, setOtpSent, showAlert, setFormData, setStep, alert, setAlert }) => {
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

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
        // Basic phone validation - allows digits, spaces, dashes, parentheses, and + sign
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        const digitsOnly = phone.replace(/\D/g, '');
        
        if (!phoneRegex.test(phone) || digitsOnly.length < 10) {
            setPhoneError('Please enter a valid phone number (at least 10 digits)');
            return false;
        }
        setPhoneError('');
        return true;
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
        try {
            const res = await axios.post('/api/otp/send/', { 
                phone: formData.phone,
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
        }
    };

    const verifyOtp = async () => {
        try {
            const res = await axios.post('/api/otp/verify/', { 
                code: formData.otp_code,
                phone: formData.phone,
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
            <div className="d-flex gap-2 mb-1">
                <input 
                    name="phone" 
                    className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                    placeholder="Mobile Phone" 
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onBlur={(e) => validatePhone(e.target.value)}
                    style={inputStyle}
                />
                <button 
                    className="btn" 
                    onClick={sendOtp}
                    style={buttonStyle}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                >
                    Send OTP
                </button>
            </div>
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

