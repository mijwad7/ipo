import React from 'react';
import WizardNavigationButtons from './WizardNavigationButtons';

const Step3Bio = ({ formData, handleChange, handleImageUpload, setStep, onNext, alert, setAlert }) => {
    const inputStyle = {
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        padding: '0.75rem 1rem',
        fontSize: '1rem'
    };

    return (
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
                style={inputStyle}
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
                style={inputStyle}
            />
            <small className="text-muted d-block mb-3">Enter your campaign tag line</small>
            
            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Headshot (Required)</label>
            <input 
                type="file" 
                className="form-control mb-3" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, 'headshot')}
                style={inputStyle}
                required
            />
            {formData.headshot && (
                <div className="text-success small mb-3">✓ Image selected: {formData.headshot.name}</div>
            )}
            
            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Background Picture (Optional)</label>
            <input 
                type="file" 
                className="form-control mb-3" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, 'background_picture')}
                style={inputStyle}
            />
            {formData.background_picture && (
                <div className="text-success small mb-3">✓ Image selected: {formData.background_picture.name}</div>
            )}
            <small className="text-muted d-block mb-3">This will be used as a background with a color overlay in your chosen theme</small>
            
            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Bio</label>
            <textarea 
                name="bio_text" 
                className="form-control mb-3" 
                placeholder="Tell us about yourself and your campaign..." 
                rows="5"
                value={formData.bio_text}
                onChange={handleChange}
                style={inputStyle}
                required
            ></textarea>
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
            <WizardNavigationButtons 
                onBack={() => setStep(2)} 
                onNext={onNext}
            />
        </div>
    );
};

export default Step3Bio;

