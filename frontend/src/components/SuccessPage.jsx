import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const SuccessPage = () => {
    const location = useLocation();
    const submission = location.state?.submission;
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);

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
            alert('Failed to copy to clipboard');
        });
    };

    const handleSendSMS = () => {
        if (!phone.trim()) {
            alert('Please enter a phone number');
            return;
        }
        // Format phone number (remove non-digits, add +1 if needed)
        const formattedPhone = phone.replace(/\D/g, '');
        const smsUrl = `sms:${formattedPhone}?body=${encodeURIComponent(messageText)}`;
        window.location.href = smsUrl;
    };

    const handleSendEmail = () => {
        if (!email.trim()) {
            alert('Please enter an email address');
            return;
        }
        const subject = encodeURIComponent('Check out my campaign site');
        const body = encodeURIComponent(messageText);
        const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
        window.location.href = mailtoUrl;
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '800px' }}>
            <div className="card p-5 shadow-lg border-0">
                {/* Success Header with Speed Messaging */}
                <div className="text-center mb-4">
                    <div className="mb-3">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h1 className="text-success mb-3">Your Campaign is Live!</h1>
                    <div className="alert alert-success d-inline-block">
                        <h4 className="mb-2">🎉 Your campaign was built in under 3 minutes!</h4>
                        <p className="mb-0">That's just 1 minute per page - faster than you can order coffee!</p>
                    </div>
                </div>

                {/* Progress Timeline Visualization */}
                <div className="card bg-light mb-4">
                    <div className="card-body">
                        <h5 className="text-center mb-3">Build Timeline</h5>
                        <div className="d-flex justify-content-between align-items-center">
                            {[
                                { step: 1, name: 'Identity', time: '30sec' },
                                { step: 2, name: 'Election Details', time: '30sec' },
                                { step: 3, name: 'Bio Setup', time: '30sec' },
                                { step: 4, name: 'Platform', time: '30sec' },
                                { step: 5, name: 'Customization', time: '30sec' }
                            ].map((item, idx) => (
                                <div key={item.step} className="text-center" style={{ flex: 1 }}>
                                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                                         style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        ✓
                                    </div>
                                    <div className="small">
                                        <div className="fw-bold">{item.name}</div>
                                        <div className="text-muted">{item.time}</div>
                                    </div>
                                    {idx < 4 && (
                                        <div className="position-absolute" style={{ 
                                            left: `${(idx + 1) * 20}%`, 
                                            top: '20px',
                                            width: '20%',
                                            height: '2px',
                                            backgroundColor: '#28a745',
                                            zIndex: 0
                                        }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-3">
                            <small className="text-muted">Total time: ~2.5 minutes | Build your campaign in under 3 minutes - 1 minute per page</small>
                        </div>
                    </div>
                </div>

                <p className="lead text-center mb-4">Your instant headquarters has been generated.</p>

                <div className="my-4 text-center">
                    <Link to={tempUrl} className="btn btn-primary btn-lg px-5 mb-3">
                        View My Site
                    </Link>
                </div>

                <div className="card bg-light mb-4">
                    <div className="card-body">
                        <h5 className="mb-3">Share this link:</h5>
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                value={fullUrl} 
                                readOnly 
                            />
                            <button 
                                className="btn btn-outline-secondary" 
                                onClick={() => {
                                    navigator.clipboard.writeText(fullUrl);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                            >
                                {copied ? '✓ Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Comprehensive Sharing Section */}
                <div className="card border-primary mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Share Your Campaign</h5>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label">Phone Number (for SMS)</label>
                            <input 
                                type="tel" 
                                className="form-control" 
                                placeholder="e.g., +1234567890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="friend@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Custom Message</label>
                            <textarea 
                                className="form-control" 
                                rows="6"
                                placeholder={defaultMessageTemplate}
                                value={message || defaultMessageTemplate}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                            <small className="text-muted">The [link] placeholder will be automatically replaced with your campaign URL when sending</small>
                        </div>

                        <div className="d-flex gap-2 flex-wrap">
                            <button 
                                className="btn btn-success flex-fill"
                                onClick={handleSendSMS}
                                disabled={!phone.trim()}
                            >
                                <i className="bi bi-phone me-2"></i>
                                Send SMS
                            </button>
                            <button 
                                className="btn btn-primary flex-fill"
                                onClick={handleSendEmail}
                                disabled={!email.trim()}
                            >
                                <i className="bi bi-envelope me-2"></i>
                                Send Email
                            </button>
                            <button 
                                className="btn btn-secondary flex-fill"
                                onClick={handleCopyToClipboard}
                            >
                                <i className="bi bi-clipboard me-2"></i>
                                {copied ? 'Copied!' : 'Copy Message'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="alert alert-info mt-4">
                    <strong>Next Steps:</strong> Check your SMS for login credentials to your permanent dashboard (arriving in ~5 mins).
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
