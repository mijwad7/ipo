import React from 'react';
import WizardNavigationButtons from './WizardNavigationButtons';

const PILLAR_OPTIONS = [
    "Lower Taxes", "Safer Streets", "Better Schools", "Community Safety",
    "Economic Growth", "Healthcare Access", "Support Seniors", "Youth Programs",
    "Infrastructure", "Environmental Protection", "Custom"
];

const Step4Platform = ({
    formData,
    handleChange,
    handleImageUpload,
    handlePillarChange,
    customPillarMode,
    setFormData,
    setStep,
    onNext,
    alert,
    setAlert
}) => {
    const inputStyle = {
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        padding: '0.75rem 1rem',
        fontSize: '1rem'
    };

    return (
        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                <i className="bi bi-bullseye me-2" style={{ color: '#667eea' }}></i>
                Step 4: Platform
            </h4>
            <p style={{ color: '#718096' }}>Select your top 3 priorities (Optional / Skip)</p>
            {[1, 2, 3].map(i => (
                <div key={i} className="mb-4 p-4 rounded shadow-sm" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '28px', height: '28px', fontSize: '0.9rem', fontWeight: 'bold' }}>{i}</div>
                        <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>Priority {i}</h5>
                    </div>

                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Topic</label>
                    <select
                        className="form-control mb-3"
                        name={`pillar_${i}`}
                        onChange={(e) => handlePillarChange(e, i)}
                        value={customPillarMode[i] ? 'Custom' : (formData[`pillar_${i}`] || '')}
                        style={inputStyle}
                    >
                        <option value="">Select...</option>
                        {PILLAR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    {customPillarMode[i] && (
                        <input
                            className="form-control mb-3"
                            placeholder="Type custom pillar title"
                            name={`pillar_${i}_custom`}
                            value={formData[`pillar_${i}`] || ''}
                            onChange={(e) => {
                                setFormData(prev => ({
                                    ...prev,
                                    [`pillar_${i}`]: e.target.value
                                }));
                            }}
                            style={inputStyle}
                        />
                    )}

                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Description</label>
                    <textarea
                        className="form-control mb-3"
                        name={`pillar_${i}_desc`}
                        placeholder={`Explain your stance on ${formData[`pillar_${i}`] || 'this topic'}...`}
                        rows="4"
                        onChange={handleChange}
                        value={formData[`pillar_${i}_desc`]}
                        style={inputStyle}
                    ></textarea>

                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Action Shot (Optional)</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, `action_shot_${i}`)}
                        style={inputStyle}
                    />
                    {formData[`action_shot_${i}`] && (
                        <div className="text-success small mt-1">✓ Image selected: {formData[`action_shot_${i}`].name}</div>
                    )}
                </div>
            ))}
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

export default Step4Platform;

