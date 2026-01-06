import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

// Country codes
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

const SuccessPage = () => {
    const location = useLocation();
    const submission = location.state?.submission;
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [phoneError, setPhoneError] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });

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

    if (!submission) return <div className="container mt-5">No submission data found.</div>;

    const tempUrl = `/temp/${submission.slug}`;
    const fullUrl = `${window.location.origin}${tempUrl}`;

    // Default message template
    const defaultMessageTemplate = "Hey, I've been seriously thinking about running lately and wanted to get your honest take before I mention it to anyone else. I literally just threw this together in under 3 minutes as a super-rough private placeholder site just to see the idea in real life (definitely not public, I'll take it down right after you see it). Nothing's polished, it's mostly just a vibe check, but curious what your gut reaction is—does this feel like it could connect, or am I totally off base? Appreciate you looking! [link]";

    // Get message text with link replacement
    const getMessageText = () => {
        const msg = message || defaultMessageTemplate;
        return msg.replace('[link]', fullUrl);
    };

    const messageText = getMessageText();

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(messageText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            showAlert('Failed to copy to clipboard. Please try again.', 'danger');
        });
    };

    const validatePhone = (phoneNumber) => {
        if (!phoneNumber) {
            setPhoneError('');
            return false;
        }
        // Phone validation - only digits, spaces, dashes, parentheses
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        const digitsOnly = phoneNumber.replace(/\D/g, '');

        // Minimum 7 digits, maximum 15 digits (without country code)
        if (!phoneRegex.test(phoneNumber) || digitsOnly.length < 7 || digitsOnly.length > 15) {
            setPhoneError('Please enter a valid phone number (7-15 digits)');
            return false;
        }
        setPhoneError('');
        return true;
    };

    const [sending, setSending] = useState(false);

    const handleSendSMS = async () => {
        if (!validatePhone(phone)) {
            showAlert('Please enter a valid phone number', 'warning');
            return;
        }

        setSending(true);
        try {
            const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;
            await axios.post('/api/share/', {
                phone: fullPhone,
                message: messageText
            });
            showAlert('SMS sent successfully!', 'success');
            setPhone(''); // Optional: clear input on success
        } catch (error) {
            console.error('Error sending SMS:', error);
            showAlert(error.response?.data?.error || 'Failed to send SMS. Please try again.', 'danger');
        } finally {
            setSending(false);
        }
    };

    const handleSendEmail = async () => {
        if (!email.trim()) {
            showAlert('Please enter an email address', 'warning');
            return;
        }

        setSending(true);
        try {
            await axios.post('/api/share/', {
                email: email,
                message: messageText
            });
            showAlert('Email sent successfully!', 'success');
            setEmail(''); // Optional: clear input on success
        } catch (error) {
            console.error('Error sending Email:', error);
            showAlert(error.response?.data?.error || 'Failed to send Email. Please try again.', 'danger');
        } finally {
            setSending(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem 0'
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="card p-5 shadow-lg border-0" style={{ borderRadius: '16px', background: '#ffffff' }}>
                    {/* Success Header with Speed Messaging */}
                    <div className="text-center mb-4">
                        <div className="mb-3">
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 20px rgba(72, 187, 120, 0.3)'
                            }}>
                                <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem', color: '#ffffff' }}></i>
                            </div>
                        </div>
                        <h1 className="mb-3" style={{
                            color: '#2d3748',
                            fontWeight: '700',
                            fontSize: '2.5rem'
                        }}>
                            Your Campaign is Live!
                        </h1>
                        <div className="alert d-inline-block border-0 shadow-sm" style={{
                            background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%)',
                            borderRadius: '12px',
                            border: '2px solid rgba(72, 187, 120, 0.3)',
                            padding: '1rem 1.5rem'
                        }}>
                            <h4 className="mb-2" style={{ color: '#22543d', fontWeight: '600' }}>🎉 Your campaign was built in under 3 minutes!</h4>
                            <p className="mb-0" style={{ color: '#2f855a' }}>That's just 1 minute per page - faster than you can order coffee!</p>
                        </div>
                    </div>

                    {/* Progress Timeline Visualization */}
                    <div className="card mb-4 border-0 shadow-sm" style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '16px',
                        background: '#f7fafc'
                    }}>
                        {/* Gradient line at the top */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            zIndex: 1
                        }}></div>

                        <div className="card-body" style={{ paddingTop: '20px' }}>
                            <h5 className="text-center mb-4 fw-bold" style={{ color: '#2d3748', position: 'relative', zIndex: 2, fontWeight: '600' }}>Build Timeline</h5>

                            <div className="position-relative" style={{ padding: '20px 0' }}>
                                <div className="d-flex justify-content-between align-items-start" style={{ position: 'relative', zIndex: 1 }}>
                                    {[
                                        { step: 1, name: 'Identity', time: '30sec', icon: 'bi-person-badge' },
                                        { step: 2, name: 'Election Details', time: '30sec', icon: 'bi-calendar-check' },
                                        { step: 3, name: 'Bio Setup', time: '30sec', icon: 'bi-file-person' },
                                        { step: 4, name: 'Platform', time: '30sec', icon: 'bi-bullseye' },
                                        { step: 5, name: 'Customization', time: '30sec', icon: 'bi-palette' }
                                    ].map((item, idx) => (
                                        <div key={item.step} className="text-center" style={{ flex: 1, position: 'relative' }}>
                                            <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'bold',
                                                    position: 'relative',
                                                    zIndex: 2,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    color: '#ffffff',
                                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                                                }}>
                                                ✓
                                            </div>
                                            <div className="small">
                                                <div className="fw-bold" style={{ color: '#2d3748', fontSize: '0.85rem' }}>{item.name}</div>
                                                <div style={{ color: '#718096', fontSize: '0.75rem' }}>{item.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center mt-3">
                                <small style={{ color: '#718096' }}>Total time: ~2.5 minutes | Build your campaign in under 3 minutes - 1 minute per page</small>
                            </div>
                        </div>
                    </div>

                    <p className="text-center mb-4" style={{
                        color: '#4a5568',
                        fontSize: '1.2rem',
                        fontWeight: '500'
                    }}>
                        Your instant headquarters has been generated.
                    </p>

                    <div className="my-4 text-center">
                        <Link
                            target="_blank"
                            to={tempUrl}
                            className="btn btn-lg px-5 mb-3"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                color: '#ffffff',
                                fontWeight: '600',
                                borderRadius: '10px',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <i className="bi bi-box-arrow-up-right me-2"></i>
                            View My Temporary Site
                        </Link>
                    </div>

                    <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '16px', background: '#f7fafc' }}>
                        <div className="card-body p-4">
                            <h5 className="mb-3" style={{ color: '#2d3748', fontWeight: '600' }}>Share this link:</h5>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={fullUrl}
                                    readOnly
                                    style={{
                                        borderRadius: '10px 0 0 10px',
                                        border: '2px solid #e2e8f0',
                                        padding: '0.75rem 1rem',
                                        fontSize: '1rem',
                                        background: '#ffffff'
                                    }}
                                />
                                <button
                                    className="btn"
                                    onClick={() => {
                                        navigator.clipboard.writeText(fullUrl);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    style={{
                                        background: copied ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontWeight: '600',
                                        borderRadius: '0 10px 10px 0',
                                        padding: '0.75rem 1.5rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {copied ? '✓ Copied!' : 'Copy Link'}
                                </button>
                            </div>
                            {alert.show && (
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
                    </div>

                    {/* Comprehensive Sharing Section */}
                    <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <div className="card-header border-0 text-white" style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '1.25rem 1.5rem'
                        }}>
                            <h5 className="mb-0" style={{ fontWeight: '600' }}>
                                <i className="bi bi-share me-2"></i>
                                Share Your Campaign
                            </h5>
                        </div>
                        <div className="card-body p-4" style={{ background: '#ffffff' }}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Phone Number (for SMS)</label>
                                <div className="phone-input-container">
                                    <div className="d-flex phone-input-group">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="form-select country-code-select"
                                            style={{
                                                borderRadius: '10px',
                                                border: '2px solid #e2e8f0',
                                                padding: '0.75rem 1rem',
                                                fontSize: '1rem',
                                                paddingRight: '0.5rem',
                                                width: '120px',
                                                minWidth: '120px',
                                                cursor: 'pointer',
                                                flexShrink: 0
                                            }}
                                        >
                                            {COUNTRIES.map((country, idx) => (
                                                <option key={`${country.code}-${country.name}-${idx}`} value={country.code}>
                                                    {country.flag} {country.code}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="tel"
                                            className={`form-control phone-input ${phoneError ? 'is-invalid' : ''}`}
                                            placeholder="Phone Number"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                validatePhone(e.target.value);
                                            }}
                                            onBlur={(e) => validatePhone(e.target.value)}
                                            style={{
                                                borderRadius: '10px',
                                                border: '2px solid #e2e8f0',
                                                padding: '0.75rem 1rem',
                                                fontSize: '1rem',
                                                flex: '1',
                                                minWidth: '0'
                                            }}
                                        />
                                    </div>
                                </div>
                                {phoneError && (
                                    <div className="text-danger small mt-1">{phoneError}</div>
                                )}
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
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="friend@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        borderRadius: '10px',
                                        border: '2px solid #e2e8f0',
                                        padding: '0.75rem 1rem',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Custom Message</label>
                                <textarea
                                    className="form-control"
                                    rows="6"
                                    placeholder={defaultMessageTemplate}
                                    value={message || defaultMessageTemplate}
                                    onChange={(e) => setMessage(e.target.value)}
                                    style={{
                                        borderRadius: '10px',
                                        border: '2px solid #e2e8f0',
                                        padding: '0.75rem 1rem',
                                        fontSize: '1rem'
                                    }}
                                ></textarea>
                                <small className="text-muted">The [link] placeholder will be automatically replaced with your campaign URL when sending</small>
                            </div>

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

                            <div className="d-flex gap-2 flex-wrap">
                                <button
                                    className="btn flex-fill"
                                    onClick={handleSendSMS}
                                    disabled={!phone.trim() || sending}
                                    style={{
                                        background: !phone.trim() || sending ? '#e2e8f0' : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                        border: 'none',
                                        color: !phone.trim() || sending ? '#a0aec0' : '#ffffff',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        padding: '0.75rem 1rem',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        cursor: !phone.trim() || sending ? 'not-allowed' : 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (phone.trim() && !sending) {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <i className="bi bi-phone me-2"></i>
                                    {sending && phone.trim() ? 'Sending...' : 'Send SMS'}
                                </button>
                                <button
                                    className="btn flex-fill"
                                    onClick={handleSendEmail}
                                    disabled={!email.trim() || sending}
                                    type="button"
                                    style={{
                                        background: !email.trim() || sending ? '#e2e8f0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        color: !email.trim() || sending ? '#a0aec0' : '#ffffff',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        padding: '0.75rem 1rem',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        cursor: !email.trim() || sending ? 'not-allowed' : 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (email.trim() && !sending) {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    <i className="bi bi-envelope me-2"></i>
                                    {sending && email.trim() ? 'Sending...' : 'Send Email'}
                                </button>
                                <button
                                    className="btn flex-fill"
                                    onClick={handleCopyToClipboard}
                                    style={{
                                        background: copied ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' : '#e2e8f0',
                                        border: 'none',
                                        color: copied ? '#ffffff' : '#4a5568',
                                        fontWeight: '600',
                                        borderRadius: '10px',
                                        padding: '0.75rem 1rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <i className="bi bi-clipboard me-2"></i>
                                    {copied ? 'Copied!' : 'Copy Message'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="alert border-0 shadow-sm mt-4" style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        borderRadius: '12px',
                        border: '2px solid rgba(102, 126, 234, 0.3)',
                        padding: '1rem 1.5rem'
                    }}>
                        <strong style={{ color: '#2d3748' }}>Next Steps:</strong>
                        <span style={{ color: '#4a5568' }}> Check your SMS for login credentials to your permanent dashboard (arriving in ~5 mins).</span>
                        <div className="mt-2">
                            <em style={{ color: '#718096', fontSize: '0.95rem' }}>Check your SMS or Email, and also check your spam/junk folder.</em>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
