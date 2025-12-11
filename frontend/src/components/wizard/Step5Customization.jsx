import React from 'react';
import { Link } from 'react-router-dom';

const Step5Customization = ({ 
    formData, 
    handleChange, 
    customSlugError, 
    hoveredTemplate, 
    setHoveredTemplate, 
    setFormData, 
    setStep, 
    onSubmit,
    alert,
    setAlert
}) => {
    const inputStyle = {
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        padding: '0.75rem 1rem',
        fontSize: '1rem'
    };

    const TemplateCard = ({ style, name, description, isSelected }) => (
        <div 
            className="card mb-3 border-0"
            style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '12px',
                border: isSelected ? '3px solid #667eea' : '2px solid #e2e8f0',
                background: isSelected ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' : '#ffffff',
                boxShadow: isSelected ? '0 4px 12px rgba(102, 126, 234, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                transform: hoveredTemplate === style ? 'translateY(-2px)' : 'translateY(0)'
            }}
            onMouseEnter={() => setHoveredTemplate(style)}
            onMouseLeave={() => setHoveredTemplate(null)}
            onClick={() => setFormData(prev => ({ ...prev, template_style: style }))}
        >
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="card-title mb-1" style={{ color: '#2d3748', fontWeight: '600' }}>{name}</h5>
                        <p className="card-text small mb-0" style={{ color: '#718096' }}>{description}</p>
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
                Step 5: Customization
            </h4>
            
            {/* Disclosure Notice */}
            <div className="alert d-flex align-items-center mb-4" role="alert" style={{
                borderLeft: '4px solid #f59e0b',
                backgroundColor: '#fffbeb',
                borderColor: '#f59e0b',
                borderRadius: '12px',
                border: '2px solid #fde68a'
            }}>
                <i className="bi bi-exclamation-triangle-fill me-2" style={{ fontSize: '1.2rem', color: '#f59e0b' }}></i>
                <div>
                    <strong className="d-block mb-1" style={{ color: '#92400e' }}>Important Notice:</strong>
                    <span style={{ color: '#78350f' }}>This is temporary Customization only. Hundreds of templates and full customization available after account creation</span>
                </div>
            </div>
            
            {/* Two-Column Layout: Left = Selection, Right = Preview */}
            <div className="row g-4">
                {/* Left Column: Template Selection */}
                <div className="col-lg-5 col-md-12 order-lg-1 order-1">
                    <label className="form-label mb-3">Template Style</label>
                    
                    <div className="mb-4">
                        <TemplateCard 
                            style="modern" 
                            name="Modern" 
                            description="Clean, contemporary design"
                            isSelected={formData.template_style === 'modern'}
                        />
                        <TemplateCard 
                            style="traditional" 
                            name="Traditional" 
                            description="Classic, professional layout"
                            isSelected={formData.template_style === 'traditional'}
                        />
                        <TemplateCard 
                            style="bold" 
                            name="Bold" 
                            description="Striking, high-impact design"
                            isSelected={formData.template_style === 'bold'}
                        />
                    </div>
                    
                    <small className="text-muted d-block mb-3">
                        <i className="bi bi-info-circle me-1"></i>
                        Hover over a template to preview, click to select.
                    </small>
                    
                    {/* Color Customization - Desktop */}
                    <div className="mb-3 d-lg-block d-md-none d-none">
                        <label className="form-label mb-2">Color Customization</label>
                        <div className="row g-3">
                            <div className="col-6">
                                <label className="form-label small">Primary Color</label>
                                <input 
                                    type="color" 
                                    className="form-control form-control-color mb-2" 
                                    name="primary_color" 
                                    value={formData.primary_color} 
                                    onChange={handleChange} 
                                    style={{ width: '100%', height: '50px', cursor: 'pointer' }}
                                />
                                <small className="text-muted small">Headers & buttons</small>
                            </div>
                            <div className="col-6">
                                <label className="form-label small">Secondary Color</label>
                                <input 
                                    type="color" 
                                    className="form-control form-control-color mb-2" 
                                    name="secondary_color" 
                                    value={formData.secondary_color} 
                                    onChange={handleChange} 
                                    style={{ width: '100%', height: '50px', cursor: 'pointer' }}
                                />
                                <small className="text-muted small">Borders & accents</small>
                            </div>
                        </div>
                    </div>
                    
                    {/* Full Preview Link - Desktop */}
                    <div className="mt-3 d-lg-block d-md-none d-none">
                        <Link 
                            to={`/preview/${formData.template_style}?primary=${encodeURIComponent(formData.primary_color)}&secondary=${encodeURIComponent(formData.secondary_color)}`}
                            target="_blank"
                            className="btn btn-outline-primary w-100"
                        >
                            <i className="bi bi-box-arrow-up-right me-2"></i>
                            View Full Preview
                        </Link>
                    </div>
                </div>
                
                {/* Right Column: Template Preview Thumbnail */}
                <div className="col-lg-7 col-md-12 order-lg-2 order-2">
                    <label className="form-label mb-2">Live Preview</label>
                    <div 
                        className="position-relative border rounded shadow-sm" 
                        style={{ 
                            border: '2px solid #dee2e6', 
                            borderRadius: '8px', 
                            overflow: 'hidden', 
                            backgroundColor: '#f8f9fa',
                            minHeight: '400px',
                            maxHeight: '600px'
                        }}
                    >
                        <img 
                            src={`/static/template-${hoveredTemplate || formData.template_style}-preview.png`}
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
                                minHeight: '400px',
                                flexDirection: 'column'
                            }}
                        >
                            <i className="bi bi-image fs-1 d-block mb-2"></i>
                            <small>Template preview screenshot will appear here</small>
                            <br />
                            <small className="text-danger">
                                Please add template-{hoveredTemplate || formData.template_style}-preview.png to the public folder
                            </small>
                        </div>
                    </div>
                </div>
                
                {/* Color Customization - Mobile */}
                <div className="col-12 order-3 d-lg-none d-md-block d-block">
                    <div className="mb-3 mt-4">
                        <label className="form-label mb-2">Color Customization</label>
                        <div className="row g-3">
                            <div className="col-6">
                                <label className="form-label small">Primary Color</label>
                                <input 
                                    type="color" 
                                    className="form-control form-control-color mb-2" 
                                    name="primary_color" 
                                    value={formData.primary_color} 
                                    onChange={handleChange} 
                                    style={{ width: '100%', height: '50px', cursor: 'pointer' }}
                                />
                                <small className="text-muted small">Headers & buttons</small>
                            </div>
                            <div className="col-6">
                                <label className="form-label small">Secondary Color</label>
                                <input 
                                    type="color" 
                                    className="form-control form-control-color mb-2" 
                                    name="secondary_color" 
                                    value={formData.secondary_color} 
                                    onChange={handleChange} 
                                    style={{ width: '100%', height: '50px', cursor: 'pointer' }}
                                />
                                <small className="text-muted small">Borders & accents</small>
                            </div>
                        </div>
                    </div>
                    
                    {/* Full Preview Link - Mobile */}
                    <div className="mt-3">
                        <Link 
                            to={`/preview/${formData.template_style}?primary=${encodeURIComponent(formData.primary_color)}&secondary=${encodeURIComponent(formData.secondary_color)}`}
                            target="_blank"
                            className="btn btn-outline-primary w-100"
                        >
                            <i className="bi bi-box-arrow-up-right me-2"></i>
                            View Full Preview
                        </Link>
                    </div>
                </div>
            </div>

            <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Customizable temporary website address</label>
            <input 
                type="text" 
                className={`form-control mb-2 ${customSlugError ? 'is-invalid' : ''}`}
                name="custom_slug" 
                placeholder="e.g., jeffformayor, jeffwill, firstlast, johndoe" 
                value={formData.custom_slug}
                onChange={handleChange}
                style={inputStyle}
            />
            {customSlugError && (
                <div className="text-danger small mb-2">{customSlugError}</div>
            )}
            <small className="text-muted mb-3 d-block">
                Your site will be at: {window.location.origin}/temp/{formData.custom_slug || 'yourname'}
            </small>

            <div className="mb-3">
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        name="is_password_protected" 
                        id="passwordProtection"
                        checked={formData.is_password_protected}
                        onChange={handleChange}
                        style={{ cursor: 'pointer' }}
                    />
                    <label className="form-check-label" htmlFor="passwordProtection" style={{ cursor: 'pointer', color: '#4a5568' }}>
                        Password protected
                    </label>
                </div>
                <small className="text-muted d-block mt-1">
                    Some people don't want temp websites public, so password protection helps with that.
                </small>
            </div>

            {formData.is_password_protected && (
                <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#4a5568' }}>Password</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="run"
                        style={inputStyle}
                    />
                </div>
            )}

            {alert.show && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show shadow-sm mt-3 mb-3`} role="alert" style={{ borderRadius: '12px', border: 'none' }}>
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

            <div className="d-flex gap-2 mt-4">
                <button 
                    className="btn" 
                    onClick={() => setStep(4)}
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
                <button 
                    className="btn btn-lg" 
                    onClick={onSubmit}
                    style={{
                        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                        border: 'none',
                        color: '#ffffff',
                        fontWeight: '700',
                        borderRadius: '10px',
                        padding: '0.75rem 2rem',
                        flex: 2,
                        fontSize: '1.1rem',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    <i className="bi bi-rocket-takeoff me-2"></i>
                    Launch My HQ
                </button>
            </div>
        </div>
    );
};

export default Step5Customization;

