import React from 'react';
import WizardNavigationButtons from './WizardNavigationButtons';

const Step2Election = ({ formData, handleChange, electionDateError, setStep, onNext }) => {
    const inputStyle = {
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        padding: '0.75rem 1rem',
        fontSize: '1rem'
    };

    return (
        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                <i className="bi bi-calendar-check me-2" style={{ color: '#667eea' }}></i>
                Step 2: Election Details
            </h4>
            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Riding / Zone Name</label>
            <input 
                name="riding_zone_name" 
                className="form-control mb-3" 
                placeholder="e.g., District 5, Ward 3" 
                value={formData.riding_zone_name}
                onChange={handleChange}
                style={inputStyle}
                required
            />
            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Election Date</label>
            <input 
                name="election_date" 
                type="date" 
                className={`form-control mb-2 ${electionDateError ? 'is-invalid' : ''}`}
                value={formData.election_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                style={inputStyle}
                required
            />
            {electionDateError && (
                <div className="text-danger small mb-3">{electionDateError}</div>
            )}
            <WizardNavigationButtons 
                onBack={() => setStep(1)} 
                onNext={onNext}
            />
        </div>
    );
};

export default Step2Election;

