import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import WizardNavigationButtons from './WizardNavigationButtons';

const Step2Election = ({ formData, handleChange, electionDateError, setStep, onNext, alert, setAlert }) => {
    const inputStyle = {
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        width: '100%'
    };

    const handleDateChange = (date) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0];
            handleChange({
                target: {
                    name: 'election_date',
                    value: formattedDate
                }
            });
        } else {
            handleChange({
                target: {
                    name: 'election_date',
                    value: ''
                }
            });
        }
    };

    const selectedDate = formData.election_date ? new Date(formData.election_date) : null;
    const minDate = new Date();

    const isOrganization = formData.submission_type === 'organization';

    return (
        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                <i className={`bi ${isOrganization ? 'bi-building' : 'bi-calendar-check'} me-2`} style={{ color: '#667eea' }}></i>
                Step 3: {isOrganization ? 'Organization Details' : 'Election Details'}
            </h4>
            
            {isOrganization ? (
                <>
                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Organization Name</label>
                    <input 
                        name="organization_name" 
                        className="form-control mb-3" 
                        placeholder="e.g., St. Mary's Church, Community Food Bank, Downtown EDA" 
                        value={formData.organization_name || ''}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                    <small className="text-muted d-block mb-3">Enter the full name of your organization</small>
                </>
            ) : (
                <>
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
                    <div className={`mb-2 ${electionDateError ? 'is-invalid' : ''}`}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            minDate={minDate}
                            dateFormat="MMMM dd, yyyy"
                            placeholderText="Select election date"
                            className={`form-control ${electionDateError ? 'is-invalid' : ''}`}
                            wrapperClassName="w-100"
                            calendarClassName="modern-calendar"
                            popperClassName="modern-calendar-popper"
                            style={inputStyle}
                            required
                            showPopperArrow={false}
                            popperPlacement="bottom-start"
                            popperModifiers={[
                                {
                                    name: "offset",
                                    options: {
                                        offset: [0, 8]
                                    }
                                }
                            ]}
                        />
                    </div>
                    {electionDateError && (
                        <div className="text-danger small mb-3">{electionDateError}</div>
                    )}
                </>
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
                onBack={() => setStep(2)} 
                onNext={onNext}
            />
            <style>{`
                .react-datepicker {
                    font-family: system-ui, -apple-system, sans-serif;
                    border: none;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                }
                
                .react-datepicker__header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-bottom: none;
                    border-radius: 16px 16px 0 0;
                    padding: 1rem 0;
                }
                
                .react-datepicker__current-month {
                    color: #ffffff;
                    font-weight: 600;
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }
                
                .react-datepicker__day-names {
                    display: flex;
                    justify-content: space-around;
                    padding: 0.5rem 0;
                }
                
                .react-datepicker__day-name {
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 600;
                    font-size: 0.875rem;
                    width: 2.5rem;
                    margin: 0.25rem;
                }
                
                .react-datepicker__month {
                    margin: 0.75rem;
                    padding: 0.5rem;
                }
                
                .react-datepicker__week {
                    display: flex;
                    justify-content: space-around;
                }
                
                .react-datepicker__day {
                    width: 2.5rem;
                    height: 2.5rem;
                    line-height: 2.5rem;
                    margin: 0.25rem;
                    border-radius: 10px;
                    color: #2d3748;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                
                .react-datepicker__day:hover {
                    background-color: #f0f4ff;
                    border-radius: 10px;
                    color: #667eea;
                }
                
                .react-datepicker__day--selected {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #ffffff;
                    font-weight: 600;
                    border-radius: 10px;
                }
                
                .react-datepicker__day--selected:hover {
                    background: linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%);
                    color: #ffffff;
                }
                
                .react-datepicker__day--keyboard-selected {
                    background-color: #f0f4ff;
                    color: #667eea;
                    border-radius: 10px;
                }
                
                .react-datepicker__day--today {
                    font-weight: 700;
                    color: #667eea;
                    border: 2px solid #667eea;
                    border-radius: 10px;
                }
                
                .react-datepicker__day--disabled {
                    color: #cbd5e0;
                    cursor: not-allowed;
                }
                
                .react-datepicker__day--disabled:hover {
                    background-color: transparent;
                }
                
                .react-datepicker__day--outside-month {
                    color: #cbd5e0;
                }
                
                .react-datepicker__navigation {
                    top: 1.25rem;
                }
                
                .react-datepicker__navigation-icon::before {
                    border-color: #ffffff;
                    border-width: 2px 2px 0 0;
                }
                
                .react-datepicker__navigation:hover *::before {
                    border-color: rgba(255, 255, 255, 0.8);
                }
                
                .react-datepicker__input-container input {
                    border-radius: 10px;
                    border: 2px solid #e2e8f0;
                    padding: 0.75rem 1rem;
                    font-size: 1rem;
                    width: 100%;
                    transition: all 0.2s ease;
                }
                
                .react-datepicker__input-container input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .react-datepicker__input-container input.is-invalid {
                    border-color: #dc3545;
                }
                
                .react-datepicker__input-container input.is-invalid:focus {
                    border-color: #dc3545;
                    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
                }
                
                .modern-calendar-popper {
                    z-index: 9999;
                }
                
                @media (max-width: 576px) {
                    .react-datepicker {
                        font-size: 0.875rem;
                    }
                    
                    .react-datepicker__day {
                        width: 2rem;
                        height: 2rem;
                        line-height: 2rem;
                        font-size: 0.875rem;
                    }
                    
                    .react-datepicker__day-name {
                        width: 2rem;
                        font-size: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Step2Election;

