import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BoldPreview = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get colors from URL parameters, fallback to defaults
    const primaryColor = searchParams.get('primary') || '#dc3545';
    const secondaryColor = searchParams.get('secondary') || '#000000';

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
                        color: #333;
                        transform: scale(1.05);
                    }
                    .text-secondary-bold {
                        color: var(--secondary);
                    }
                    .bg-secondary-bold {
                        background-color: var(--secondary);
                        color: #333;
                    }
                    .hero-bold {
                        background: var(--primary);
                        color: white;
                        padding: 140px 0 100px;
                        position: relative;
                        overflow: hidden;
                        border-bottom: 6px solid var(--secondary);
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
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary-bold py-4" style={{ borderBottom: '6px solid var(--secondary)' }}>
                <div className="container">
                    <a className="navbar-brand fw-black text-uppercase" href="#about" style={{ fontSize: '24px', letterSpacing: '2px' }}>
                        {previewData.position_running_for ? previewData.position_running_for.toUpperCase() : `${previewData.last_name} FOR OFFICE`}
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
                                <a className="nav-link text-white text-uppercase fw-bold" href="#about" style={{ letterSpacing: '1px' }}>About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white text-uppercase fw-bold" href="#platform" style={{ letterSpacing: '1px' }}>Platform</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white text-uppercase fw-bold" href="#contact" style={{ letterSpacing: '1px' }}>Contact</a>
                            </li>
                            <li className="nav-item ms-2">
                                <a href="#" className="btn px-4 fw-bold" style={{ backgroundColor: 'var(--secondary)', color: '#333', border: '3px solid var(--secondary)' }}>DONATE</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header id="about" className="hero-bold text-white position-relative" style={{ background: 'var(--primary)', borderBottom: '8px solid var(--secondary)' }}>
                <div className="container position-relative">
                    <div className="row align-items-center">
                        <div className="col-lg-7 mb-5 mb-lg-0">
                            <h5 className="text-uppercase mb-4 fw-bold" style={{ letterSpacing: '4px', fontSize: '16px', color: 'var(--secondary)' }}>
                                {previewData.tag_line ? previewData.tag_line.toUpperCase() : 'VOTE FOR LEADERSHIP'}
                            </h5>
                            <h1 className="display-1 fw-black mb-4" style={{ fontWeight: 900, lineHeight: 1.1 }}>
                                {previewData.first_name}<br />{previewData.last_name}
                            </h1>
                            {(previewData.riding_zone_name || previewData.election_date) && (
                                <div className="mb-3">
                                    {previewData.riding_zone_name && (
                                        <p className="mb-1 fw-bold" style={{ fontSize: '1.1rem' }}>
                                            RIDING: {previewData.riding_zone_name.toUpperCase()}
                                        </p>
                                    )}
                                    {previewData.election_date && (
                                        <p className="mb-0 fw-bold" style={{ fontSize: '1.1rem' }}>
                                            ELECTION DATE: {new Date(previewData.election_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className="mb-4" style={{ width: '120px', height: '10px', background: 'var(--secondary)', border: '2px solid white' }}></div>
                            <p className="lead mb-5 fw-bold" style={{ lineHeight: 1.8, fontSize: '20px' }}>
                                {previewData.bio_text}
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <a href="#" className="btn btn-light btn-lg px-5 fw-bold" style={{ border: '4px solid var(--secondary)' }}>
                                    DONATE NOW
                                </a>
                                <button className="btn btn-lg px-4 fw-bold" style={{ border: '4px solid var(--secondary)', backgroundColor: 'var(--secondary)', color: '#333' }}>
                                    GET INVOLVED
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-5 text-center">
                            <div 
                                className="p-4"
                                style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '6px solid var(--secondary)',
                                    boxShadow: '15px 15px 0 rgba(0, 0, 0, 0.4)',
                                    background: 'transparent'
                                }}
                            >
                                <div className="text-primary-bold">
                                    <i className="bi bi-person-circle" style={{ fontSize: '140px', color: 'white' }}></i>
                                    <p className="mt-3 mb-0 fw-bold">HEADSHOT PLACEHOLDER</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Pillars Section */}
            <section id="platform" className="py-5 bg-primary-bold text-white" style={{ borderTop: '8px solid var(--secondary)', borderBottom: '8px solid var(--secondary)' }}>
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="display-3 fw-black mb-3 text-uppercase text-white" style={{ letterSpacing: '2px' }}>
                            My Top Issues & Concerns
                        </h2>
                        <div style={{ height: '10px', width: '200px', margin: '20px auto', background: 'var(--secondary)', border: '2px solid white' }}></div>
                    </div>

                    <div className="row g-0">
                        {[
                            { title: previewData.pillar_1, desc: previewData.pillar_1_desc },
                            { title: previewData.pillar_2, desc: previewData.pillar_2_desc },
                            { title: previewData.pillar_3, desc: previewData.pillar_3_desc },
                        ].map((pillar, idx) => {
                            const isEven = idx % 2 === 1;
                            return (
                                <div key={idx} className="col-12 mb-5">
                                    <div className="row align-items-center g-0" style={{ backgroundColor: 'var(--primary)' }}>
                                        {!isEven ? (
                                            <>
                                                <div className="col-md-5 p-0">
                                                    <div 
                                                        className="text-center d-flex align-items-center justify-content-center"
                                                        style={{ minHeight: '300px', padding: '20px', background: 'transparent', border: '4px solid white' }}
                                                    >
                                                        <div>
                                                            <i className="bi bi-image" style={{ fontSize: '80px', opacity: 0.7, color: 'white' }}></i>
                                                            <p className="mt-3 mb-0 fw-bold text-uppercase" style={{ letterSpacing: '1px', color: 'white' }}>Image</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-7 p-5 text-white">
                                                    <h3 className="fw-black mb-4 text-uppercase text-white" style={{ letterSpacing: '1px', fontSize: '2rem', borderBottom: '4px solid var(--secondary)', paddingBottom: '15px' }}>{pillar.title}</h3>
                                                    <p className="mb-4 lead" style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>{pillar.desc}</p>
                                                    <button className="btn btn-lg fw-bold" style={{ backgroundColor: 'var(--secondary)', color: '#333', border: '3px solid white' }}>READ MORE</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="col-md-7 p-5 text-white">
                                                    <h3 className="fw-black mb-4 text-uppercase text-white" style={{ letterSpacing: '1px', fontSize: '2rem', borderBottom: '4px solid var(--secondary)', paddingBottom: '15px' }}>{pillar.title}</h3>
                                                    <p className="mb-4 lead" style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>{pillar.desc}</p>
                                                    <button className="btn btn-lg fw-bold" style={{ backgroundColor: 'var(--secondary)', color: '#333', border: '3px solid white' }}>READ MORE</button>
                                                </div>
                                                <div className="col-md-5 p-0">
                                                    <div 
                                                        className="text-center d-flex align-items-center justify-content-center"
                                                        style={{ minHeight: '300px', padding: '20px', background: 'transparent', border: '4px solid white' }}
                                                    >
                                                        <div>
                                                            <i className="bi bi-image" style={{ fontSize: '80px', opacity: 0.7, color: 'white' }}></i>
                                                            <p className="mt-3 mb-0 fw-bold text-uppercase" style={{ letterSpacing: '1px', color: 'white' }}>Image</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-5 bg-secondary-bold" style={{ borderTop: `8px solid var(--primary)`, color: '#333' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card card-bold p-5 bg-white text-dark" style={{ border: '6px solid var(--primary)', boxShadow: '15px 15px 0 rgba(0,0,0,0.3)' }}>
                                <h2 className="text-center fw-black mb-4 text-uppercase" style={{ letterSpacing: '2px', color: 'var(--primary)' }}>
                                    Get in Touch
                                </h2>
                                <div style={{ height: '8px', width: '150px', margin: '20px auto', background: 'var(--primary)' }}></div>
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
            <footer className="bg-primary-bold py-5 text-white" style={{ borderTop: `8px solid var(--secondary)` }}>
                <div className="container text-center">
                    <h4 className="mb-3 fw-black text-uppercase text-white" style={{ letterSpacing: '2px' }}>
                        {previewData.first_name} {previewData.last_name}
                    </h4>
                    <div style={{ height: '4px', width: '100px', margin: '15px auto', background: 'var(--secondary)' }}></div>
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

