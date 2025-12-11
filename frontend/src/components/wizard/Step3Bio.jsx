import React from 'react';
import WizardNavigationButtons from './WizardNavigationButtons';

const Step3Bio = ({ formData, handleChange, handleImageUpload, setStep, onNext }) => {
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
            <WizardNavigationButtons 
                onBack={() => setStep(2)} 
                onNext={onNext}
            />
        </div>
    );
};

export default Step3Bio;

