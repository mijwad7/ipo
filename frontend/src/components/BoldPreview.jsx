import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoldPreview = () => {
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
        '--primary': '#dc3545',
        '--secondary': '#000000',
    };

    return (
        <div style={styles} className="bold-preview-wrapper">
            <style>
                {`
                    .bold-preview-wrapper {
                        font-family: 'Arial Black', 'Arial', sans-serif;
                        color: #000;
                        overflow-x: hidden;
                        font-weight: 700;
                    }
                    .bg-primary-bold {
                        background-color: var(--primary);
                        color: white;
                    }
                    .text-primary-bold {
                        color: var(--primary);
                    }
                    .btn-primary-bold {
                        background-color: var(--primary);
                        border-color: var(--primary);
                        color: white;
                        padding: 15px 40px;
                        font-weight: 900;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        border-radius: 0;
                        border-width: 3px;
                        transition: all 0.3s;
                    }
                    .btn-primary-bold:hover {
                        background-color: #c82333;
                        border-color: #c82333;
                        transform: scale(1.05);
                    }
                    .btn-secondary-bold {
                        border-color: var(--secondary);
                        color: var(--secondary);
                        background: transparent;
                        padding: 15px 40px;
                        font-weight: 900;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        border-radius: 0;
                        border-width: 3px;
                        transition: all 0.3s;
                    }
                    .btn-secondary-bold:hover {
                        background-color: var(--secondary);
                        color: white;
                        transform: scale(1.05);
                    }
                    .text-secondary-bold {
                        color: var(--secondary);
                    }
                    .bg-secondary-bold {
                        background-color: var(--secondary);
                        color: white;
                    }
                    .hero-bold {
                        background: #000;
                        color: white;
                        padding: 140px 0 100px;
                        position: relative;
                        overflow: hidden;
                        border-bottom: 6px solid var(--secondary);
                    }
                    .hero-bold::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(45deg, var(--primary) 0%, var(--secondary) 50%, transparent 100%);
                        opacity: 0.3;
                    }
                    .card-bold {
                        border: 4px solid var(--secondary);
                        border-radius: 0;
                        background: white;
                        box-shadow: 8px 8px 0 rgba(0,0,0,0.2);
                    }
                    .pillar-card-bold {
                        border: 4px solid var(--primary);
                        border-top: 6px solid var(--secondary);
                        background: white;
                        transition: transform 0.3s;
                    }
                    .pillar-card-bold:hover {
                        transform: translateY(-8px);
                        box-shadow: 12px 12px 0 rgba(220, 53, 69, 0.3);
                        border-color: var(--primary);
                        border-top-color: var(--secondary);
                    }
                    .preview-header {
                        background: white;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        padding: 20px 0;
                        margin-bottom: 0;
                        border-bottom: 4px solid var(--primary);
                        border-top: 3px solid var(--secondary);
                    }
                    .bold-accent {
                        background: linear-gradient(to right, var(--primary), var(--secondary));
                        height: 8px;
                        width: 150px;
                        margin: 20px auto;
                    }
                `}
            </style>

            {/* Preview Header */}
            <div className="preview-header sticky-top">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0 text-primary-bold fw-bold">Bold Template Preview</h4>
                        <button 
                            className="btn btn-outline-danger fw-bold"
                            onClick={() => navigate(-1)}
                        >
                            ← Back to Wizard
                        </button>
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-black py-4">
                <div className="container">
                    <a className="navbar-brand fw-black text-uppercase" href="#" style={{ fontSize: '24px', letterSpacing: '2px' }}>
                        {previewData.last_name} <span className="fw-normal">FOR OFFICE</span>
                    </a>
                    <div className="ms-auto">
                        <a href="#" className="btn btn-primary-bold px-4">DONATE</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-bold text-white position-relative">
                <div className="container position-relative">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h5 className="text-uppercase mb-4 fw-bold" style={{ letterSpacing: '4px', fontSize: '16px' }}>
                                VOTE FOR LEADERSHIP
                            </h5>
                            <h1 className="display-1 fw-black mb-4" style={{ fontWeight: 900, lineHeight: 1.1 }}>
                                {previewData.first_name}<br />{previewData.last_name}
                            </h1>
                            <div className="bg-primary-bold mb-4" style={{ width: '120px', height: '8px' }}></div>
                            <p className="lead mb-5 fw-bold" style={{ lineHeight: 1.8, fontSize: '20px' }}>
                                {previewData.bio_text}
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <a href="#" className="btn btn-primary-bold btn-lg px-5">
                                    DONATE NOW
                                </a>
                                <button className="btn btn-secondary-bold btn-lg px-4">
                                    GET INVOLVED
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-5 offset-lg-1 text-center">
                            <div 
                                className="bg-white p-4 border border-4 border-primary-bold"
                                style={{ 
                                    aspectRatio: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '12px 12px 0 rgba(220, 53, 69, 0.3)'
                                }}
                            >
                                <div className="text-primary-bold">
                                    <i className="bi bi-person-circle" style={{ fontSize: '140px' }}></i>
                                    <p className="mt-3 mb-0 fw-bold">HEADSHOT PLACEHOLDER</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Pillars Section */}
            <section className="py-5 bg-white">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-3 fw-black mb-3 text-uppercase" style={{ letterSpacing: '2px' }}>
                            My Top Issues & Concerns
                        </h2>
                        <div className="bold-accent"></div>
                    </div>

                    <div className="row g-4">
                        {[
                            { title: previewData.pillar_1, desc: previewData.pillar_1_desc },
                            { title: previewData.pillar_2, desc: previewData.pillar_2_desc },
                            { title: previewData.pillar_3, desc: previewData.pillar_3_desc },
                        ].map((pillar, idx) => (
                            <div key={idx} className="col-md-4">
                                <div className="card card-bold pillar-card-bold h-100">
                                    <div 
                                        className="bg-black text-white p-5 text-center"
                                        style={{ minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <div>
                                            <i className="bi bi-image" style={{ fontSize: '80px', opacity: 0.7 }}></i>
                                            <p className="mt-3 mb-0 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Image</p>
                                        </div>
                                    </div>
                                    <div className="card-body p-4">
                                        <h3 className="fw-black mb-3 text-uppercase" style={{ letterSpacing: '1px' }}>{pillar.title}</h3>
                                        <p className="mb-4" style={{ lineHeight: 1.7, fontWeight: 500 }}>{pillar.desc}</p>
                                        <button className="btn btn-primary-bold w-100">LEARN MORE</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-5 bg-black text-white" style={{ borderTop: `6px solid var(--secondary)` }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card card-bold p-5 bg-white text-dark" style={{ borderColor: 'var(--secondary)' }}>
                                <h2 className="text-center fw-black mb-4 text-uppercase" style={{ letterSpacing: '2px' }}>
                                    Get in Touch
                                </h2>
                                <div className="bold-accent"></div>
                                <p className="text-center mb-4 fw-bold">
                                    Have a question? Want to volunteer? Send us a message.
                                </p>
                                <form>
                                    <div className="row mb-3">
                                        <div className="col-md-6 mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg border-3 border-dark rounded-0 fw-bold" 
                                                placeholder="FIRST NAME" 
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-lg border-3 border-dark rounded-0 fw-bold" 
                                                placeholder="LAST NAME" 
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <input 
                                            type="email" 
                                            className="form-control form-control-lg border-3 border-dark rounded-0 fw-bold" 
                                            placeholder="EMAIL ADDRESS" 
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <textarea 
                                            className="form-control form-control-lg border-3 border-dark rounded-0 fw-bold" 
                                            rows="4" 
                                            placeholder="YOUR MESSAGE" 
                                            disabled
                                        ></textarea>
                                    </div>
                                    <div className="d-grid">
                                        <button type="button" className="btn btn-primary-bold btn-lg" disabled>
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
            <footer className="bg-secondary-bold text-white py-5" style={{ borderTop: `6px solid var(--primary)` }}>
                <div className="container text-center">
                    <h4 className="mb-3 fw-black text-uppercase" style={{ letterSpacing: '2px' }}>
                        {previewData.first_name} {previewData.last_name}
                    </h4>
                    <p className="text-white-50 mb-4 fw-bold">
                        Paid for by the Committee to Elect {previewData.first_name} {previewData.last_name}
                    </p>
                    <div className="d-flex justify-content-center gap-3 mb-4">
                        <a href="#" className="text-white"><i className="bi bi-facebook fs-4"></i></a>
                        <a href="#" className="text-white"><i className="bi bi-twitter fs-4"></i></a>
                        <a href="#" className="text-white"><i className="bi bi-instagram fs-4"></i></a>
                    </div>
                    <p className="small text-white-50 mb-0 fw-bold">&copy; 2025 All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default BoldPreview;

