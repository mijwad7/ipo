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

            {/* Section 1: Campaign Basics */}
            <div className="p-4 mb-4 rounded shadow-sm" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '28px', height: '28px', fontSize: '0.9rem', fontWeight: 'bold' }}>1</div>
                    <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>Campaign Basics</h5>
                </div>

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
            </div>

            {/* Section 2: Campaign Imagery */}
            <div className="p-4 mb-4 rounded shadow-sm" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '28px', height: '28px', fontSize: '0.9rem', fontWeight: 'bold' }}>2</div>
                    <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>Campaign Imagery</h5>
                </div>

                <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Headshot (Optional)</label>
                <input
                    type="file"
                    className="form-control mb-3"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'headshot')}
                    style={inputStyle}
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
            </div>

            {/* Section 3: Candidate Biography */}
            <div className="p-4 mb-4 rounded shadow-sm" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '28px', height: '28px', fontSize: '0.9rem', fontWeight: 'bold' }}>3</div>
                    <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>Candidate Biography</h5>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-semibold mb-0" style={{ color: '#4a5568' }}>Bio (Optional)</label>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        type="button"
                        onClick={() => {
                            const filler = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
                            handleChange({ target: { name: 'bio_text', value: filler } });
                        }}
                        style={{ fontSize: '0.8rem', borderRadius: '20px' }}
                    >
                        <i className="bi bi-magic me-1"></i> Fill Random
                    </button>
                </div>
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
            <WizardNavigationButtons
                onBack={() => setStep(2)}
                onNext={onNext}
            />
        </div>
    );
};

export default Step3Bio;
