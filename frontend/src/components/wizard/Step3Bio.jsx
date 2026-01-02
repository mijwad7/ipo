import React from 'react';
import WizardNavigationButtons from './WizardNavigationButtons';

const Step3Bio = ({ formData, handleChange, handleImageUpload, setStep, onNext, alert, setAlert }) => {
    const inputStyle = {
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        padding: '0.75rem 1rem',
        fontSize: '1rem'
    };

    const isOrganization = formData.submission_type === 'organization';

    return (
        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                <i className="bi bi-file-person me-2" style={{ color: '#667eea' }}></i>
                Step 4: Bio Setup
            </h4>
            
            {isOrganization ? (
                <>
                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Organization Tag Line / Slogan</label>
                    <input 
                        type="text" 
                        name="tag_line" 
                        className="form-control mb-3" 
                        placeholder="e.g., Serving Our Community, Building Together, Faith Hope Love" 
                        value={formData.tag_line || ''}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                    <small className="text-muted d-block mb-3">A short, memorable phrase that represents your organization</small>
                    
                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Organization Logo <span className="text-danger">*</span></label>
                    <input 
                        type="file" 
                        className="form-control mb-3" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, 'logo')}
                        style={inputStyle}
                        required
                    />
                    {formData.logo && (
                        <div className="text-success small mb-3">✓ Logo selected: {formData.logo.name}</div>
                    )}
                    <small className="text-muted d-block mb-3">Upload your organization's logo (will appear in the header)</small>
                    
                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Leader / Owner Photo <span className="text-danger">*</span></label>
                    <input 
                        type="file" 
                        className="form-control mb-3" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, 'owner_photo')}
                        style={inputStyle}
                        required
                    />
                    {formData.owner_photo && (
                        <div className="text-success small mb-3">✓ Photo selected: {formData.owner_photo.name}</div>
                    )}
                    <small className="text-muted d-block mb-3">Photo of the organization leader, pastor, director, or owner</small>
                    
                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Team / Staff Photo (Optional)</label>
                    <input 
                        type="file" 
                        className="form-control mb-3" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, 'sales_team_photo')}
                        style={inputStyle}
                    />
                    {formData.sales_team_photo && (
                        <div className="text-success small mb-3">✓ Photo selected: {formData.sales_team_photo.name}</div>
                    )}
                    <small className="text-muted d-block mb-3">Optional: Photo of your team, staff, or volunteers</small>
                    
                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Background Image (Optional)</label>
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
                    <small className="text-muted d-block mb-3">Optional: A background image that will appear behind your content with a color overlay</small>
                </>
            ) : (
                <>
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
                </>
            )}
            
            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>{isOrganization ? 'About Your Organization' : 'Bio'}</label>
            <textarea 
                name="bio_text" 
                className="form-control mb-3" 
                placeholder={isOrganization ? "Tell us about your organization, its mission, history, and what makes it special..." : "Tell us about yourself and your campaign..."}
                rows="5"
                value={formData.bio_text}
                onChange={handleChange}
                style={inputStyle}
                required
            ></textarea>
            <small className="text-muted d-block mb-3">{isOrganization ? "Describe your organization's mission, values, and impact on the community" : "Share your background, experience, and why you're running"}</small>
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
                onBack={() => setStep(3)} 
                onNext={onNext}
            />
        </div>
    );
};

export default Step3Bio;

