import React from 'react';
import { Link } from 'react-router-dom';
import WizardNavigationButtons from './WizardNavigationButtons';

const Step2TemplateSelection = ({ 
    formData, 
    handleChange, 
    hoveredTemplate, 
    setHoveredTemplate, 
    setFormData, 
    setStep, 
    onNext,
    alert,
    setAlert
}) => {
    // Determine which templates to show based on submission type
    const isOrganization = formData.submission_type === 'organization';
    
    const templates = isOrganization 
        ? [
            { style: 'modern', name: 'Modern', description: 'Clean, contemporary design perfect for organizations' },
            { style: 'traditional', name: 'Traditional', description: 'Classic, professional layout for established organizations' },
            { style: 'bold', name: 'Bold', description: 'High-impact design to make your organization stand out' },
          ]
        : [
            { style: 'modern', name: 'Modern', description: 'Clean, contemporary design' },
            { style: 'traditional', name: 'Traditional', description: 'Classic, professional layout' },
            { style: 'bold', name: 'Bold', description: 'Striking, high-impact design' },
          ];

    const TemplateCard = ({ template, isSelected }) => (
        <div 
            className="card mb-3 border-0"
            style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '12px',
                border: isSelected ? '3px solid #667eea' : '2px solid #e2e8f0',
                background: isSelected ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : '#ffffff',
                boxShadow: isSelected ? '0 4px 12px rgba(102, 126, 234, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                transform: hoveredTemplate === template.style ? 'translateY(-2px)' : 'translateY(0)'
            }}
            onMouseEnter={() => setHoveredTemplate(template.style)}
            onMouseLeave={() => setHoveredTemplate(null)}
            onClick={() => setFormData(prev => ({ ...prev, template_style: template.style, preferred_template: template.style }))}
        >
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title mb-1" style={{ color: '#2d3748', fontWeight: '600' }}>{template.name}</h5>
                        <p className="card-text small mb-0" style={{ color: '#718096' }}>{template.description}</p>
                    </div>
                    {isSelected && (
                        <i className="bi bi-check-circle-fill" style={{ fontSize: '1.5rem', color: '#667eea' }}></i>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="card p-4 border-0 shadow-lg" style={{ borderRadius: '16px', background: '#ffffff' }}>
            <h4 className="mb-4" style={{ color: '#2d3748', fontWeight: '600' }}>
                <i className="bi bi-palette me-2" style={{ color: '#667eea' }}></i>
                Step 2: Template Selection
            </h4>
            
            {/* Important Notice */}
            <div className="alert d-flex align-items-center mb-4" role="alert" style={{
                borderLeft: '4px solid #667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderColor: '#667eea',
                borderRadius: '12px',
                border: '2px solid rgba(102, 126, 234, 0.3)'
            }}>
                <i className="bi bi-info-circle-fill me-2" style={{ fontSize: '1.2rem', color: '#667eea' }}></i>
                <div>
                    <strong className="d-block mb-1" style={{ color: '#2d3748' }}>All Templates Will Be Generated</strong>
                    <span style={{ color: '#4a5568' }}>You're selecting your preferred template, but we'll generate all 3 templates for you to test and share.</span>
                </div>
            </div>
            
            {/* Template Selection */}
            <div className="mb-4">
                <label className="form-label mb-3 fw-semibold" style={{ color: '#4a5568' }}>Choose Your Preferred Template</label>
                {templates.map(template => (
                    <TemplateCard 
                        key={template.style}
                        template={template}
                        isSelected={formData.template_style === template.style}
                    />
                ))}
            </div>
            
            {/* Preview Section */}
            <div className="mb-4">
                <label className="form-label mb-2 fw-semibold" style={{ color: '#4a5568' }}>Preview</label>
                <div 
                    className="position-relative border rounded shadow-sm" 
                    style={{ 
                        border: '2px solid #dee2e6', 
                        borderRadius: '8px', 
                        overflow: 'hidden', 
                        backgroundColor: '#f8f9fa',
                        minHeight: '300px',
                        maxHeight: '400px'
                    }}
                >
                    <img 
                        src={`/template-${hoveredTemplate || formData.template_style}-preview.png`}
                        alt={`${hoveredTemplate || formData.template_style} template preview`}
                        className="img-fluid w-100"
                        style={{ 
                            display: 'block',
                            height: 'auto',
                            objectFit: 'contain'
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            const placeholder = e.target.nextElementSibling;
                            if (placeholder) placeholder.style.display = 'flex';
                        }}
                    />
                    <div 
                        className="text-center p-4 text-muted d-none align-items-center justify-content-center" 
                        style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            bottom: 0,
                            minHeight: '300px',
                            flexDirection: 'column'
                        }}
                    >
                        <i className="bi bi-image fs-1 d-block mb-2"></i>
                        <small>Template preview will appear here</small>
                    </div>
                </div>
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
        </div>
    );
};

export default Step2TemplateSelection;
