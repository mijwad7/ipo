import React from 'react';

const WizardProgressBar = ({ step, stepConfig, totalSteps }) => {
    // step is 0-indexed, so we add 1 for display and calculation
    const displayStep = step + 1;
    const progressPercentage = (displayStep / totalSteps) * 100;
    const currentStepConfig = stepConfig[step];

    return (
        <div className="card mb-4 border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div className="card-body p-4" style={{ background: '#ffffff' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5 className="mb-1" style={{ color: '#2d3748', fontWeight: '600' }}>
                            Step {displayStep} of {totalSteps} - {currentStepConfig.name}
                        </h5>
                        <small style={{ color: '#718096' }}>~{currentStepConfig.time}</small>
                    </div>
                    <div className="text-end">
                        <small style={{ color: '#718096' }}>Build your campaign in under 3 minutes</small>
                    </div>
                </div>
                <div className="progress mb-3" style={{ 
                    height: '30px', 
                    borderRadius: '15px',
                    backgroundColor: '#e2e8f0',
                    overflow: 'hidden'
                }}>
                    <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ 
                            width: `${progressPercentage}%`,
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                            transition: 'width 0.5s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600',
                            color: '#ffffff',
                            fontSize: '0.9rem'
                        }}
                        aria-valuenow={progressPercentage} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                    >
                        {Math.round(progressPercentage)}%
                    </div>
                </div>
                {/* Step indicators */}
                <div className="d-flex justify-content-between mt-3">
                    {stepConfig.map((config, idx) => (
                        <div 
                            key={config.number} 
                            className="text-center"
                            style={{ flex: 1 }}
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: idx <= step 
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                    : '#e2e8f0',
                                color: idx <= step ? '#ffffff' : '#a0aec0',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                marginBottom: '0.5rem',
                                transition: 'all 0.3s ease'
                            }}>
                                {idx <= step ? '✓' : config.number}
                            </div>
                            <div style={{ 
                                fontSize: '0.75rem',
                                color: idx <= step ? '#667eea' : '#a0aec0',
                                fontWeight: idx <= step ? '600' : '400'
                            }}>
                                {config.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WizardProgressBar;

