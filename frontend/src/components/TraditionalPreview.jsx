import React from 'react';
import { useNavigate } from 'react-router-dom';

const TraditionalPreview = () => {
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
        '--primary': '#6c757d',
        '--secondary': '#495057',
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
                    .hero-traditional {
                        background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
                        padding: 100px 0 60px;
                        border-bottom: 4px solid var(--primary);
                    }
                    .card-traditional {
                        border: 1px solid #dee2e6;
                        border-radius: 4px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    .pillar-section-traditional {
                        border-left: 4px solid var(--primary);
                        padding-left: 20px;
                        margin-bottom: 30px;
                    }
                    .preview-header {
                        background: white;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        padding: 20px 0;
                        margin-bottom: 0;
                    }
                    .traditional-divider {
                        border-top: 2px solid var(--primary);
                        width: 100px;
                        margin: 20px auto;
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
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary-traditional py-3">
                <div className="container">
                    <a className="navbar-brand fw-bold" href="#">
                        {previewData.last_name} <span className="fw-normal">for Office</span>
                    </a>
                    <div className="ms-auto">
                        <a href="#" className="btn btn-light rounded-0 px-4">DONATE</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-traditional">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5 text-center mb-5 mb-lg-0">
                            <div 
                                className="bg-white p-4 shadow-sm border"
                                style={{ 
                                    aspectRatio: '1',
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
                        <div className="col-lg-7">
                            <h1 className="display-4 fw-bold mb-3" style={{ color: '#212529' }}>
                                {previewData.first_name} {previewData.last_name}
                            </h1>
                            <div className="traditional-divider"></div>
                            <p className="lead mb-4" style={{ lineHeight: 1.8, color: '#495057' }}>
                                {previewData.bio_text}
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <a href="#" className="btn btn-primary-traditional btn-lg px-4 rounded-0">
                                    DONATE NOW
                                </a>
                                <button className="btn btn-outline-secondary btn-lg px-4 rounded-0">
                                    Get Involved
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Pillars Section */}
            <section className="py-5 bg-white">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3" style={{ color: '#212529' }}>My Top Issues & Concerns</h2>
                        <div className="traditional-divider"></div>
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

            {/* Contact Section */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card card-traditional border-0 p-5">
                                <h2 className="text-center fw-bold mb-4" style={{ color: '#212529' }}>Get in Touch</h2>
                                <div className="traditional-divider"></div>
                                <p className="text-center text-muted mb-4">
                                    Have a question? Want to volunteer? Send us a message.
                                </p>
                                <form>
                                    <div className="row mb-3">
                                        <div className="col-md-6 mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg rounded-0" 
                                                placeholder="First Name" 
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg rounded-0" 
                                                placeholder="Last Name" 
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <input 
                                            type="email" 
                                            className="form-control form-control-lg rounded-0" 
                                            placeholder="Email Address" 
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <textarea 
                                            className="form-control form-control-lg rounded-0" 
                                            rows="4" 
                                            placeholder="Your Message" 
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

export default TraditionalPreview;

