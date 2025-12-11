import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TraditionalPreview = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get colors from URL parameters, fallback to defaults
    const primaryColor = searchParams.get('primary') || '#6c757d';
    const secondaryColor = searchParams.get('secondary') || '#495057';

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
        <div style={styles} className="traditional-preview-wrapper">
            <style>
                {`
                    .traditional-preview-wrapper {
                        font-family: 'Georgia', 'Times New Roman', serif;
                        color: #333;
                        overflow-x: hidden;
                    }
                    .bg-primary-traditional {
                        background-color: var(--primary);
                        color: white;
                    }
                    .text-primary-traditional {
                        color: var(--primary);
                    }
                    .btn-primary-traditional {
                        background-color: var(--primary);
                        border-color: var(--primary);
                        color: white;
                        padding: 10px 25px;
                        font-weight: 500;
                        border-radius: 4px;
                        transition: all 0.3s;
                    }
                    .btn-primary-traditional:hover {
                        background-color: #5a6268;
                        color: white;
                    }
                    .btn-secondary-traditional {
                        border-color: var(--secondary);
                        color: var(--secondary);
                        background: transparent;
                        padding: 10px 25px;
                        font-weight: 500;
                        border-radius: 4px;
                        border-width: 2px;
                    }
                    .btn-secondary-traditional:hover {
                        background-color: var(--secondary);
                        color: #333;
                    }
                    .text-secondary-traditional {
                        color: var(--secondary);
                    }
                    .bg-secondary-traditional {
                        background-color: var(--secondary);
                        color: #333;
                    }
                    .hero-traditional {
                        background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
                        padding: 100px 0 60px;
                        border-bottom: 4px solid var(--primary);
                    }
                    .card-traditional {
                        border: 2px solid var(--secondary);
                        border-radius: 4px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    .pillar-section-traditional {
                        border-left: 4px solid var(--primary);
                        border-bottom: 2px solid var(--secondary);
                        padding-left: 20px;
                        padding-bottom: 10px;
                        margin-bottom: 30px;
                    }
                    .preview-header {
                        background: white;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        padding: 20px 0;
                        margin-bottom: 0;
                        border-bottom: 2px solid var(--secondary);
                    }
                    .traditional-divider {
                        border-top: 2px solid var(--primary);
                        border-bottom: 1px solid var(--secondary);
                        width: 100px;
                        margin: 20px auto;
                        height: 3px;
                    }
                `}
            </style>

            {/* Preview Header */}
            <div className="preview-header sticky-top">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0 text-primary-traditional fw-bold">Traditional Template Preview</h4>
                        <button 
                            className="btn btn-outline-secondary"
                            onClick={() => navigate(-1)}
                        >
                            ← Back to Wizard
                        </button>
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary-traditional py-3" style={{ borderBottom: '3px solid var(--secondary)' }}>
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
                                <a href="#" className="btn rounded-0 px-4" style={{ backgroundColor: 'var(--secondary)', color: '#333', fontWeight: '500' }}>DONATE</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header id="about" className="hero-traditional">
                <div className="container">
                    <div className="row align-items-start">
                        <div className="col-lg-5 mb-5 mb-lg-0">
                            <div className="text-center mb-4">
                                <div 
                                    className="bg-white p-4 shadow-sm border mx-auto"
                                    style={{ 
                                        aspectRatio: '1',
                                        maxWidth: '300px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '3px solid var(--primary) !important'
                                    }}
                                >
                                    <div className="text-primary-traditional">
                                        <i className="bi bi-person-circle" style={{ fontSize: '100px' }}></i>
                                        <p className="mt-2 mb-0 small">Headshot Placeholder</p>
                                    </div>
                                </div>
                            </div>
                            <h1 className="display-4 fw-bold mb-3 text-center" style={{ color: '#212529' }}>
                                {previewData.first_name} {previewData.last_name}
                            </h1>
                            <div className="text-center mb-2">
                                <p className="mb-1 fw-bold" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
                                    {previewData.tag_line || 'Vote for Leadership'}
                                </p>
                            </div>
                            {(previewData.riding_zone_name || previewData.election_date) && (
                                <div className="text-center mb-3">
                                    {previewData.riding_zone_name && (
                                        <p className="mb-1 small" style={{ color: '#495057' }}>
                                            <strong>Riding:</strong> {previewData.riding_zone_name}
                                        </p>
                                    )}
                                    {previewData.election_date && (
                                        <p className="mb-0 small" style={{ color: '#495057' }}>
                                            <strong>Election Date:</strong> {new Date(previewData.election_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className="traditional-divider" style={{ margin: '20px auto' }}></div>
                            <p className="lead mb-4 text-center" style={{ lineHeight: 1.8, color: '#495057' }}>
                                {previewData.bio_text}
                            </p>
                            <div className="d-flex gap-3 flex-wrap justify-content-center">
                                <a href="#" className="btn btn-primary-traditional btn-lg px-4 rounded-0">
                                    DONATE NOW
                                </a>
                                <button className="btn btn-secondary-traditional btn-lg px-4 rounded-0">
                                    Get Involved
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-7" id="contact">
                            <div className="card card-traditional p-4" style={{ border: '3px solid var(--primary)', backgroundColor: 'white' }}>
                                <h3 className="fw-bold mb-3 text-center" style={{ color: 'var(--primary)' }}>Get in Touch</h3>
                                <div style={{ width: '100px', height: '3px', margin: '15px auto', backgroundColor: 'var(--primary)' }}></div>
                                <p className="text-center text-muted mb-4 small">
                                    Have a question? Want to volunteer? Send us a message.
                                </p>
                                <form>
                                    <div className="row mb-3">
                                        <div className="col-md-6 mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg rounded-0" 
                                                placeholder="First Name" 
                                                style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg rounded-0" 
                                                placeholder="Last Name" 
                                                style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <input 
                                            type="email" 
                                            className="form-control form-control-lg rounded-0" 
                                            placeholder="Email Address" 
                                            style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <textarea 
                                            className="form-control form-control-lg rounded-0" 
                                            rows="4" 
                                            placeholder="Your Message" 
                                            style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
                                            disabled
                                        ></textarea>
                                    </div>
                                    <div className="d-grid">
                                        <button type="button" className="btn btn-primary-traditional btn-lg rounded-0" disabled>
                                            SEND MESSAGE
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Pillars Section */}
            <section id="platform" className="py-5 bg-white">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3" style={{ color: '#212529' }}>My Top Issues & Concerns</h2>
                        <div style={{ width: '100px', height: '3px', margin: '20px auto', backgroundColor: 'var(--primary)' }}></div>
                    </div>

                    <div className="row">
                        {[
                            { title: previewData.pillar_1, desc: previewData.pillar_1_desc },
                            { title: previewData.pillar_2, desc: previewData.pillar_2_desc },
                            { title: previewData.pillar_3, desc: previewData.pillar_3_desc },
                        ].map((pillar, idx) => (
                            <div key={idx} className="col-md-4 mb-4">
                                <div className="card card-traditional h-100">
                                    <div 
                                        className="bg-light p-4 text-center border-bottom"
                                        style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <i className="bi bi-image text-muted" style={{ fontSize: '50px' }}></i>
                                    </div>
                                    <div className="card-body p-4">
                                        <div className="pillar-section-traditional">
                                            <h4 className="fw-bold mb-3" style={{ color: '#212529' }}>{pillar.title}</h4>
                                            <p className="text-muted mb-3" style={{ lineHeight: 1.7 }}>{pillar.desc}</p>
                                        </div>
                                        <button className="btn btn-primary-traditional w-100 rounded-0">Learn More</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-primary-traditional text-white py-5" style={{ borderTop: `4px solid var(--primary)` }}>
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

export default TraditionalPreview;

