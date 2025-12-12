import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ModernPreview = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get colors from URL parameters, fallback to defaults
    const primaryColor = searchParams.get('primary') || '#1D3557';
    const secondaryColor = searchParams.get('secondary') || '#F1FAEE';

    // Placeholder data for preview
    const previewData = {
        first_name: 'John',
        last_name: 'Smith',
        position_running_for: 'John for Mayor',
        tag_line: 'Family Faith Freedom',
        riding_zone_name: 'District 5',
        election_date: '2025-10-15',
        bio_text: 'A dedicated public servant committed to bringing positive change to our community. With years of experience and a vision for the future, I am ready to lead.',
        pillar_1: 'Economic Growth',
        pillar_1_desc: 'Creating opportunities for businesses and families to thrive through smart economic policies and community investment.',
        pillar_2: 'Education Excellence',
        pillar_2_desc: 'Ensuring every child has access to quality education and the resources they need to succeed.',
        pillar_3: 'Community Safety',
        pillar_3_desc: 'Working with law enforcement and community leaders to create safer neighborhoods for everyone.',
    };

    const styles = {
        '--primary': primaryColor,
        '--secondary': secondaryColor,
    };

    return (
        <div style={styles} className="modern-preview-wrapper">
            <style>
                {`
                    .modern-preview-wrapper {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        color: #333;
                        overflow-x: hidden;
                    }
                    .bg-primary-modern {
                        background-color: var(--primary);
                        color: white;
                    }
                    .text-primary-modern {
                        color: var(--primary);
                    }
                    .btn-primary-modern {
                        background-color: var(--primary);
                        border-color: var(--primary);
                        color: white;
                        padding: 12px 30px;
                        font-weight: 600;
                        border-radius: 8px;
                        transition: all 0.3s;
                    }
                    .btn-primary-modern:hover {
                        background-color: #0b5ed7;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
                    }
                    .btn-secondary-modern {
                        border-color: var(--secondary);
                        color: var(--secondary);
                        background: transparent;
                        padding: 12px 30px;
                        font-weight: 600;
                        border-radius: 8px;
                        border-width: 2px;
                        transition: all 0.3s;
                    }
                    .btn-secondary-modern:hover {
                        background-color: var(--secondary);
                        color: #333;
                        transform: translateY(-2px);
                    }
                    .text-secondary-modern {
                        color: var(--secondary);
                    }
                    .bg-secondary-modern {
                        background-color: var(--secondary);
                        color: #333;
                    }
                    .hero-modern {
                        background: linear-gradient(135deg, var(--primary) 0%, var(--primary) 100%);
                        padding: 120px 0 80px;
                    }
                    .card-modern {
                        border-radius: 16px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        border: 2px solid transparent;
                        transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
                    }
                    .card-modern:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                        border-color: var(--secondary);
                    }
                    .pillar-card {
                        border: 2px solid var(--secondary);
                        border-radius: 12px;
                        overflow: hidden;
                        background: white;
                    }
                    .form-control-modern:focus {
                        border-color: var(--secondary);
                        box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
                    }
                    .preview-header {
                        background: white;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        padding: 20px 0;
                        margin-bottom: 0;
                    }
                `}
            </style>

            {/* Preview Header */}
            <div className="preview-header sticky-top">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0 text-primary-modern fw-bold">Modern Template Preview</h4>
                        <button 
                            className="btn btn-outline-primary"
                            onClick={() => navigate(-1)}
                        >
                            ← Back to Wizard
                        </button>
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary-modern py-3" style={{ borderBottom: '4px solid var(--secondary)' }}>
                <div className="container">
                    <a className="navbar-brand fw-bold" href="#about">
                        {previewData.position_running_for || `${previewData.last_name} for Office`}
                    </a>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                        style={{ borderColor: 'rgba(255,255,255,0.5)' }}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#about">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#platform">Platform</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="#contact">Contact</a>
                            </li>
                            <li className="nav-item ms-2">
                                <a href="#" className="btn rounded-pill px-4" style={{ backgroundColor: 'var(--secondary)', color: '#333', fontWeight: '600' }}>DONATE</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header id="about" className="hero-modern text-white position-relative" style={{
                backgroundImage: 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
                {/* Primary color overlay - would show if background_picture exists */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'var(--primary)',
                    opacity: 1,
                    zIndex: 0
                }}></div>
                <div className="container position-relative" style={{ zIndex: 1 }}>
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h5 className="text-uppercase mb-3 opacity-75" style={{ letterSpacing: '2px', fontSize: '14px' }}>
                                {previewData.tag_line || 'Vote for Leadership'}
                            </h5>
                            <h1 className="display-2 fw-bold mb-4">
                                {previewData.first_name}<br />{previewData.last_name}
                            </h1>
                            {(previewData.riding_zone_name || previewData.election_date) && (
                                <div className="mb-3">
                                    {previewData.riding_zone_name && (
                                        <p className="mb-1 opacity-90" style={{ fontSize: '1.1rem' }}>
                                            <strong>Riding:</strong> {previewData.riding_zone_name}
                                        </p>
                                    )}
                                    {previewData.election_date && (
                                        <p className="mb-0 opacity-90" style={{ fontSize: '1.1rem' }}>
                                            <strong>Election Date:</strong> {new Date(previewData.election_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className="mb-4" style={{ width: '80px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--secondary)' }}></div>
                            <p className="lead mb-5" style={{ lineHeight: 1.8, opacity: 0.95 }}>
                                {previewData.bio_text}
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <a href="#" className="btn btn-lg px-5 fw-bold rounded-pill shadow" style={{ backgroundColor: 'var(--secondary)', color: '#333' }}>
                                    DONATE NOW
                                </a>
                                <button className="btn btn-secondary-modern btn-lg px-4 rounded-pill">
                                    Get Involved
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-5 offset-lg-1 text-center">
                            <div 
                                className="bg-white rounded-4 p-5 shadow-lg"
                                style={{ 
                                    aspectRatio: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <div className="text-primary-modern">
                                    <i className="bi bi-person-circle" style={{ fontSize: '120px' }}></i>
                                    <p className="mt-3 mb-0">Headshot Placeholder</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Pillars Section */}
            <section id="platform" className="py-5" style={{ backgroundColor: 'var(--secondary)' }}>
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3" style={{ color: '#333' }}>My Top Issues & Concerns</h2>
                        <div className="mx-auto mb-2" style={{ width: '80px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--primary)' }}></div>
                    </div>

                    <div className="row g-4">
                        {[
                            { title: previewData.pillar_1, desc: previewData.pillar_1_desc },
                            { title: previewData.pillar_2, desc: previewData.pillar_2_desc },
                            { title: previewData.pillar_3, desc: previewData.pillar_3_desc },
                        ].map((pillar, idx) => (
                            <div key={idx} className="col-md-4">
                                <div className="card card-modern pillar-card h-100">
                                    <div 
                                        className="bg-primary-modern text-white p-4 text-center"
                                        style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <i className="bi bi-image" style={{ fontSize: '60px', opacity: 0.5 }}></i>
                                    </div>
                                    <div className="card-body p-4">
                                        <h4 className="fw-bold mb-3">{pillar.title}</h4>
                                        <p className="text-muted mb-3">{pillar.desc}</p>
                                        <button className="btn btn-primary-modern w-100">Learn More</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-5 bg-white" style={{ borderTop: '4px solid var(--secondary)' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card card-modern border-0 p-5" style={{ border: '3px solid var(--secondary)' }}>
                                <h2 className="text-center fw-bold mb-4" style={{ color: 'var(--primary)' }}>Get in Touch</h2>
                                <div className="mx-auto mb-3" style={{ width: '100px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--secondary)' }}></div>
                                <p className="text-center text-muted mb-4">
                                    Have a question? Want to volunteer? Send us a message.
                                </p>
                                <form>
                                    <div className="row mb-3">
                                        <div className="col-md-6 mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg" 
                                                placeholder="First Name" 
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg" 
                                                placeholder="Last Name" 
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <input 
                                            type="email" 
                                            className="form-control form-control-lg form-control-modern" 
                                            placeholder="Email Address" 
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <textarea 
                                            className="form-control form-control-lg form-control-modern" 
                                            rows="4" 
                                            placeholder="Your Message" 
                                            disabled
                                        ></textarea>
                                    </div>
                                    <div className="d-grid">
                                        <button type="button" className="btn btn-primary-modern btn-lg" disabled>
                                            SEND MESSAGE
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-primary-modern text-white py-5" style={{ borderTop: `4px solid var(--secondary)` }}>
                <div className="container text-center">
                    <h5 className="mb-3">{previewData.first_name} {previewData.last_name}</h5>
                    <p className="text-white-50 mb-4">
                        Paid for by the Committee to Elect {previewData.first_name} {previewData.last_name}
                    </p>
                    <div className="d-flex justify-content-center gap-3 mb-4">
                        <a href="#" className="text-white"><i className="bi bi-facebook fs-4"></i></a>
                        <a href="#" className="text-white"><i className="bi bi-twitter fs-4"></i></a>
                        <a href="#" className="text-white"><i className="bi bi-instagram fs-4"></i></a>
                    </div>
                    <p className="small text-white-50 mb-0">&copy; 2025 All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ModernPreview;

