import React from 'react';
import axios from 'axios';

const Step1Identity = ({ formData, handleChange, otpSent, setOtpSent, showAlert, setFormData, setStep }) => {
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
            <input 
                name="first_name" 
                className="form-control mb-3" 
                placeholder="First Name" 
                value={formData.first_name}
                onChange={handleChange}
                style={inputStyle}
            />
            <input 
                name="last_name" 
                className="form-control mb-3" 
                placeholder="Last Name" 
                value={formData.last_name}
                onChange={handleChange}
                style={inputStyle}
            />
            <input 
                name="email" 
                className="form-control mb-3" 
                placeholder="Email" 
                type="email" 
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
            />
            <div className="d-flex gap-2 mb-3">
                <input 
                    name="phone" 
                    className="form-control" 
                    placeholder="Mobile Phone" 
                    value={formData.phone}
                    onChange={handleChange}
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
        </div>
    );
};

export default Step1Identity;

