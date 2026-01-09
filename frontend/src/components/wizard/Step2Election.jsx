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

    return (
        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                <i className="bi bi-calendar-check me-2" style={{ color: '#667eea' }}></i>
                Step 2: Election Details
            </h4>
            {/* Section 1: Election Information */}
            <div className="p-4 mb-4 rounded shadow-sm" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '28px', height: '28px', fontSize: '0.9rem', fontWeight: 'bold' }}>1</div>
                    <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>Election Information</h5>
                </div>

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
                onBack={() => setStep(1)}
                onNext={onNext}
            />
            <style>{`
                .react-datepicker {
                    font-family: system-ui, -apple-system, sans-serif;
                    border: none;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    background-color: #ffffff;
                }
                
                .react-datepicker__header {
                    background-color: #ffffff;
                    border-bottom: 1px solid #f0f0f0;
                    border-radius: 16px 16px 0 0;
                    padding: 1.5rem 0 0.5rem 0;
                }
                
                .react-datepicker__current-month {
                    color: #2d3748;
                    font-weight: 800;
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                    letter-spacing: -0.5px;
                }
                
                .react-datepicker__day-names {
                    display: flex;
                    justify-content: space-around;
                    padding: 0 0.5rem;
                    margin-bottom: 0.5rem;
                    width: 100%;
                    border-bottom: 1px solid #f7fafc;
                }
                
                .react-datepicker__day-name {
                    color: #667eea;
                    font-weight: 700;
                    font-size: 0.8rem;
                    width: 2.5rem;
                    height: 2rem;
                    line-height: 2rem;
                    margin: 0.2rem;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .react-datepicker__month {
                    margin: 1rem;
                }
                
                .react-datepicker__week {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 0.2rem;
                }
                
                .react-datepicker__day {
                    width: 2.5rem;
                    height: 2.5rem;
                    line-height: 2.5rem;
                    margin: 0.2rem;
                    border-radius: 12px;
                    color: #4a5568;
                    font-weight: 500;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .react-datepicker__day:hover {
                    background-color: #ebf4ff;
                    color: #5a67d8;
                    transform: translateY(-1px);
                }
                
                .react-datepicker__day--selected {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #ffffff;
                    font-weight: 700;
                    box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
                }
                
                .react-datepicker__day--selected:hover {
                    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
                    color: #ffffff;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 8px rgba(102, 126, 234, 0.4);
                }
                
                .react-datepicker__day--keyboard-selected {
                    background-color: #ebf4ff;
                    color: #5a67d8;
                }
                
                .react-datepicker__day--today {
                    color: #667eea;
                    background-color: transparent;
                    border: 2px solid #e2e8f0;
                    font-weight: 700;
                }
                
                .react-datepicker__day--today.react-datepicker__day--selected {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                }
                
                .react-datepicker__day--disabled {
                    color: #cbd5e0;
                    opacity: 0.5;
                }
                
                .react-datepicker__day--outside-month {
                    color: #e2e8f0;
                }
                
                .react-datepicker__navigation {
                    top: 1.5rem;
                }
                
                .react-datepicker__navigation-icon::before {
                    border-color: #a0aec0;
                    border-width: 2px 2px 0 0;
                    width: 8px;
                    height: 8px;
                    transition: border-color 0.2s;
                }
                
                .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
                    border-color: #4a5568;
                }
                
                .react-datepicker__input-container input {
                    border-radius: 12px;
                    border: 2px solid #e2e8f0;
                    padding: 1rem 1.25rem;
                    font-size: 1rem;
                    width: 100%;
                    transition: all 0.2s ease;
                    background-color: #f8fafc;
                    color: #2d3748;
                }
                
                .react-datepicker__input-container input:focus {
                    outline: none;
                    background-color: #ffffff;
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                }
                
            `}</style>
        </div>
    );
};

export default Step2Election;

