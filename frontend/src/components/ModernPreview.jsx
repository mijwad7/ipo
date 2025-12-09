import React from 'react';
import { useNavigate } from 'react-router-dom';

const ModernPreview = () => {
    const navigate = useNavigate();

    // Placeholder data for preview
    const previewData = {
        first_name: 'John',
        last_name: 'Smith',
        bio_text: 'A dedicated public servant committed to bringing positive change to our community. With years of experience and a vision for the future, I am ready to lead.',
        pillar_1: 'Economic Growth',
        pillar_1_desc: 'Creating opportunities for businesses and families to thrive through smart economic policies and community investment.',
        pillar_2: 'Education Excellence',
        pillar_2_desc: 'Ensuring every child has access to quality education and the resources they need to succeed.',
        pillar_3: 'Community Safety',
        pillar_3_desc: 'Working with law enforcement and community leaders to create safer neighborhoods for everyone.',
    };

    const styles = {
        '--primary': '#0d6efd',
        '--secondary': '#6c757d',
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
                    .hero-modern {
                        background: linear-gradient(135deg, var(--primary) 0%, #0b5ed7 100%);
                        padding: 120px 0 80px;
                        clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
                    }
                    .card-modern {
                        border-radius: 16px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        transition: transform 0.3s, box-shadow 0.3s;
                    }
                    .card-modern:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                    }
                    .pillar-card {
                        border: none;
                        border-radius: 12px;
                        overflow: hidden;
                        background: white;
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
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary-modern py-3">
                <div className="container">
                    <a className="navbar-brand fw-bold" href="#">
                        {previewData.last_name} <span className="fw-light">for Office</span>
                    </a>
                    <div className="ms-auto">
                        <a href="#" className="btn btn-light rounded-pill px-4">DONATE</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-modern text-white">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h5 className="text-uppercase mb-3 opacity-75" style={{ letterSpacing: '2px', fontSize: '14px' }}>
                                Vote for Leadership
                            </h5>
                            <h1 className="display-2 fw-bold mb-4">
                                {previewData.first_name}<br />{previewData.last_name}
                            </h1>
                            <div className="bg-white mb-4" style={{ width: '80px', height: '4px', borderRadius: '2px' }}></div>
                            <p className="lead mb-5" style={{ lineHeight: 1.8, opacity: 0.95 }}>
                                {previewData.bio_text}
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <a href="#" className="btn btn-light btn-lg px-5 fw-bold rounded-pill shadow">
                                    DONATE NOW
                                </a>
                                <button className="btn btn-outline-light btn-lg px-4 rounded-pill">
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
                                    justifyContent: 'center',
                                    border: '8px solid rgba(255,255,255,0.2)'
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
            <section className="py-5 bg-light">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3">My Top Issues & Concerns</h2>
                        <div className="mx-auto bg-primary-modern" style={{ width: '80px', height: '4px', borderRadius: '2px' }}></div>
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
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card card-modern border-0 p-5">
                                <h2 className="text-center fw-bold mb-4">Get in Touch</h2>
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
                                            className="form-control form-control-lg" 
                                            placeholder="Email Address" 
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <textarea 
                                            className="form-control form-control-lg" 
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
            <footer className="bg-dark text-white py-5">
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

