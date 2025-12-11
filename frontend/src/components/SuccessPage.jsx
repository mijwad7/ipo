import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const SuccessPage = () => {
    const location = useLocation();
    const submission = location.state?.submission;
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });

    const showAlert = (message, type = 'danger') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'danger' }), 5000);
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

    const handleSendSMS = () => {
        if (!phone.trim()) {
            showAlert('Please enter a phone number', 'warning');
            return;
        }
        // Format phone number (remove non-digits, add +1 if needed)
        const formattedPhone = phone.replace(/\D/g, '');
        const smsUrl = `sms:${formattedPhone}?body=${encodeURIComponent(messageText)}`;
        window.location.href = smsUrl;
    };

    const handleSendEmail = () => {
        if (!email.trim()) {
            showAlert('Please enter an email address', 'warning');
            return;
        }
        
        const subject = encodeURIComponent('Check out my campaign site');
        const body = encodeURIComponent(messageText);
        const recipientEmail = email.trim();
        
        // Open Gmail with pre-filled content
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${subject}&body=${body}`;
        window.open(gmailUrl, '_blank');
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem 0'
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
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
                        View My Site
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
                            <input 
                                type="tel" 
                                className="form-control" 
                                placeholder="e.g., +1234567890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{ 
                                    borderRadius: '10px',
                                    border: '2px solid #e2e8f0',
                                    padding: '0.75rem 1rem',
                                    fontSize: '1rem'
                                }}
                            />
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

                        <div className="d-flex gap-2 flex-wrap">
                            <button 
                                className="btn flex-fill"
                                onClick={handleSendSMS}
                                disabled={!phone.trim()}
                                style={{
                                    background: !phone.trim() ? '#e2e8f0' : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                    border: 'none',
                                    color: !phone.trim() ? '#a0aec0' : '#ffffff',
                                    fontWeight: '600',
                                    borderRadius: '10px',
                                    padding: '0.75rem 1rem',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    cursor: !phone.trim() ? 'not-allowed' : 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    if (phone.trim()) {
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
                                Send SMS
                            </button>
                            <button 
                                className="btn flex-fill"
                                onClick={handleSendEmail}
                                disabled={!email.trim()}
                                type="button"
                                style={{
                                    background: !email.trim() ? '#e2e8f0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    color: !email.trim() ? '#a0aec0' : '#ffffff',
                                    fontWeight: '600',
                                    borderRadius: '10px',
                                    padding: '0.75rem 1rem',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    cursor: !email.trim() ? 'not-allowed' : 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    if (email.trim()) {
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
                                Send Email
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
                </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
