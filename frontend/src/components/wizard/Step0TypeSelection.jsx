import React from 'react';
import WizardNavigationButtons from './WizardNavigationButtons';

const Step0TypeSelection = ({ formData, handleChange, setFormData, setStep, onNext, alert, setAlert }) => {
    const inputStyle = {
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        padding: '0.75rem 1rem',
        fontSize: '1rem'
    };

    const handleTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            submission_type: type,
            organization_subtype: type === 'organization' ? prev.organization_subtype : null,
            campaign_subtype: type === 'campaign' ? prev.campaign_subtype : null,
        }));
    };

    const handleSubtypeChange = (subtype, type) => {
        if (type === 'organization') {
            setFormData(prev => ({ ...prev, organization_subtype: subtype }));
        } else {
            setFormData(prev => ({ ...prev, campaign_subtype: subtype }));
        }
    };

    return (
        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                <i className="bi bi-diagram-3 me-2" style={{ color: '#667eea' }}></i>
                What are you building?
            </h4>
            
            <div className="mb-4">
                <div className="row g-3">
                    {/* Organization Option */}
                    <div className="col-md-6">
                        <div 
                            className={`card p-4 border-2 ${formData.submission_type === 'organization' ? 'border-primary' : 'border-secondary'}`}
                            style={{ 
                                cursor: 'pointer',
                                borderRadius: '12px',
                                transition: 'all 0.3s ease',
                                backgroundColor: formData.submission_type === 'organization' ? 'rgba(102, 126, 234, 0.05)' : '#ffffff',
                                borderColor: formData.submission_type === 'organization' ? '#667eea' : '#e2e8f0'
                            }}
                            onClick={() => handleTypeChange('organization')}
                        >
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="submission_type"
                                    id="type_organization"
                                    value="organization"
                                    checked={formData.submission_type === 'organization'}
                                    onChange={(e) => handleTypeChange(e.target.value)}
                                    style={{ cursor: 'pointer', width: '1.25rem', height: '1.25rem' }}
                                />
                                <label className="form-check-label ms-2" htmlFor="type_organization" style={{ cursor: 'pointer', fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>
                                    Organization
                                </label>
                            </div>
                            <p className="mt-2 mb-0" style={{ color: '#718096', fontSize: '0.9rem' }}>
                                Church / Charity / EDA / CA
                            </p>
                        </div>
                    </div>

                    {/* Campaign Option */}
                    <div className="col-md-6">
                        <div 
                            className={`card p-4 border-2 ${formData.submission_type === 'campaign' ? 'border-primary' : 'border-secondary'}`}
                            style={{ 
                                cursor: 'pointer',
                                borderRadius: '12px',
                                transition: 'all 0.3s ease',
                                backgroundColor: formData.submission_type === 'campaign' ? 'rgba(102, 126, 234, 0.05)' : '#ffffff',
                                borderColor: formData.submission_type === 'campaign' ? '#667eea' : '#e2e8f0'
                            }}
                            onClick={() => handleTypeChange('campaign')}
                        >
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="submission_type"
                                    id="type_campaign"
                                    value="campaign"
                                    checked={formData.submission_type === 'campaign'}
                                    onChange={(e) => handleTypeChange(e.target.value)}
                                    style={{ cursor: 'pointer', width: '1.25rem', height: '1.25rem' }}
                                />
                                <label className="form-check-label ms-2" htmlFor="type_campaign" style={{ cursor: 'pointer', fontSize: '1.1rem', fontWeight: '600', color: '#2d3748' }}>
                                    Campaign
                                </label>
                            </div>
                            <p className="mt-2 mb-0" style={{ color: '#718096', fontSize: '0.9rem' }}>
                                Campaign in a Box / Elections
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Organization Subtypes */}
            {formData.submission_type === 'organization' && (
                <div className="mb-4">
                    <label className="form-label fw-semibold mb-3" style={{ color: '#4a5568' }}>Organization Type</label>
                    <div className="row g-2">
                        {[
                            { value: 'church', label: 'Church' },
                            { value: 'charity', label: 'Charity' },
                            { value: 'eda', label: 'Economic Development Association' },
                            { value: 'ca', label: 'Community Association' },
                        ].map(subtype => (
                            <div key={subtype.value} className="col-md-6">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="organization_subtype"
                                        id={`org_${subtype.value}`}
                                        value={subtype.value}
                                        checked={formData.organization_subtype === subtype.value}
                                        onChange={(e) => handleSubtypeChange(e.target.value, 'organization')}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <label className="form-check-label" htmlFor={`org_${subtype.value}`} style={{ cursor: 'pointer', color: '#4a5568' }}>
                                        {subtype.label}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Campaign Subtypes */}
            {formData.submission_type === 'campaign' && (
                <div className="mb-4">
                    <label className="form-label fw-semibold mb-3" style={{ color: '#4a5568' }}>Campaign Type</label>
                    <div className="row g-2">
                        {[
                            { value: 'campaign', label: 'Campaign in a Box' },
                            { value: 'election', label: 'Election' },
                        ].map(subtype => (
                            <div key={subtype.value} className="col-md-6">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="campaign_subtype"
                                        id={`camp_${subtype.value}`}
                                        value={subtype.value}
                                        checked={formData.campaign_subtype === subtype.value}
                                        onChange={(e) => handleSubtypeChange(e.target.value, 'campaign')}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <label className="form-check-label" htmlFor={`camp_${subtype.value}`} style={{ cursor: 'pointer', color: '#4a5568' }}>
                                        {subtype.label}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                onBack={null}
                onNext={onNext}
            />
        </div>
    );
};

export default Step0TypeSelection;
