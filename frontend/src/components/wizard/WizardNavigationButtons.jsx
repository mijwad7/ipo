import React from 'react';

const WizardNavigationButtons = ({ onBack, onNext, showBack = true, backStep, nextLabel = 'Next' }) => {
    return (
        <div className="d-flex gap-2 mt-4">
            {showBack && (
                <button 
                    className="btn" 
                    onClick={onBack}
                    style={{
                        background: '#e2e8f0',
                        border: 'none',
                        color: '#4a5568',
                        fontWeight: '600',
                        borderRadius: '10px',
                        padding: '0.75rem 2rem',
                        flex: 1
                    }}
                >
                    Back
                </button>
            )}
            <button 
                className="btn" 
                onClick={onNext}
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '600',
                    borderRadius: '10px',
                    padding: '0.75rem 2rem',
                    flex: 1,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                }}
            >
                {nextLabel}
            </button>
        </div>
    );
};

export default WizardNavigationButtons;

