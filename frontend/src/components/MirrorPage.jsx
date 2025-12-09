import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MirrorPage = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get(`/api/mirror/${slug}/`)
            .then(res => setData(res.data))
            .catch(() => setError(true));
    }, [slug]);

    if (error) return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-dark text-white">
            <div className="text-center">
                <h1 className="display-4 fw-bold mb-3">Campaign Not Found</h1>
                <p className="lead text-white-50">The campaign you are looking for does not exist or has expired.</p>
            </div>
        </div>
    );

    if (!data) return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-white">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    // Dynamic styles based on user preferences
    const styles = {
        '--primary': data.primary_color || '#781C3F',
        '--secondary': data.secondary_color || '#212529',
        '--text-on-primary': '#ffffff', // Assuming dark primary for now
    };

    return (
        <div style={styles} className="mirror-page-wrapper font-sans-serif">
            <style>
                {`
                    .mirror-page-wrapper {
                        font-family: 'Inter', sans-serif;
                        color: #333;
                        overflow-x: hidden;
                    }
                    .bg-primary-custom {
                        background-color: var(--primary);
                        color: var(--text-on-primary);
                    }
                    .text-primary-custom {
                        color: var(--primary);
                    }
                    .btn-primary-custom {
                        background-color: var(--primary);
                        border-color: var(--primary);
                        color: white;
                        padding: 12px 30px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        transition: all 0.3s;
                    }
                    .btn-primary-custom:hover {
                        background-color: #5a1530; /* Darker shade approximation */
                        border-color: #5a1530;
                        transform: translateY(-2px);
                    }
                    .hero-section {
                        position: relative;
                        padding-top: 80px;
                        padding-bottom: 100px;
                        background: radial-gradient(circle at 70% 30%, #a12b55 0%, var(--primary) 70%);
                        clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
                    }
                    .hero-img {
                        box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                        transition: transform 0.3s ease;
                    }
                    .section-title {
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: -1px;
                        margin-bottom: 3rem;
                    }
                    .pillar-row {
                        padding: 80px 0;
                    }
                    .pillar-row:nth-child(even) {
                        background-color: #f8f9fa;
                    }
                    .pillar-row:nth-child(odd) {
                        background-color: #212529; /* Dark background for alternate */
                        color: white !important;
                    }
                    .pillar-row:nth-child(odd) .text-muted {
                        color: #adb5bd !important;
                    }
                    .pillar-img-container {
                        position: relative;
                        overflow: hidden;
                        border-radius: 8px;
                        box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                    }
                    .pillar-img {
                        width: 100%;
                        height: 400px;
                        object-fit: contain;
                        transition: transform 0.5s ease;
                    }
                    .pillar-row:hover .pillar-img {
                        transform: scale(1.05);
                    }
                    .form-control-lg {
                        border-radius: 0;
                        border: 1px solid #ced4da;
                        padding: 15px;
                    }
                    .glass-footer {
                         background: #1a1a1a;
                         padding: 40px 0;
                         border-top: 5px solid var(--primary);
                    }
                `}
            </style>

            {/* Navbar Placeholder */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary-custom py-3 fixed-top shadow-sm">
                <div className="container">
                    <a className="navbar-brand fw-bold text-uppercase fs-4" href="#">
                        {data.last_name} <span className="fw-light">for Office</span>
                    </a>
                    <div className="ms-auto d-none d-md-block">
                        <a href={data.donation_url || "#"} className="btn btn-light fw-bold rounded-pill px-4">DONATE</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section text-white">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h5 className="text-uppercase letter-spacing-2 mb-3 opacity-75">Vote for Leadership</h5>
                            <h1 className="display-2 fw-black mb-4" style={{ fontWeight: 800 }}>
                                {data.first_name}<br />{data.last_name}
                            </h1>
                            <div className="h-1 bg-white mb-4" style={{ width: '100px', height: '4px' }}></div>
                            <p className="lead mb-5 opacity-90" style={{ lineHeight: 1.8 }}>{data.bio_text}</p>
                            <div className="d-flex gap-3">
                                {data.donation_url && (
                                    <a href={data.donation_url} className="btn btn-light btn-lg px-5 fw-bold rounded-1 text-primary-custom shadow">
                                        DONATE NOW
                                    </a>
                                )}
                                <button className="btn btn-outline-light btn-lg px-4 rounded-1" onClick={() => document.getElementById('contact').scrollIntoView()}>
                                    Get Involved
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-5 offset-lg-1">
                            {data.headshot && (
                                <img
                                    src={data.headshot}
                                    alt={data.first_name}
                                    className="img-fluid rounded-3 hero-img"
                                    style={{ border: '10px solid rgba(255,255,255,0.1)' }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Pillars Section - "My Top Issues" */}
            <div className="bg-white">
                <div className="container py-5 text-center">
                    <h2 className="display-5 fw-bold text-uppercase text-dark mb-2">My Top Issues & Concerns</h2>
                    <div className="mx-auto bg-primary-custom mb-5" style={{ width: '80px', height: '4px' }}></div>
                </div>

                {/* Pillar 1 */}
                {(data.pillar_1 || data.action_shot_1) && (
                    <section className="pillar-row">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6 order-2 order-lg-1">
                                    {data.action_shot_1 ? (
                                        <div className="pillar-img-container">
                                            <img src={data.action_shot_1} alt={data.pillar_1} className="pillar-img" />
                                        </div>
                                    ) : (
                                        <div className="pillar-img-container bg-secondary d-flex align-items-center justify-content-center text-white" style={{ height: '400px' }}>
                                            <span>Image Placeholder</span>
                                        </div>
                                    )}
                                </div>
                                <div className="col-lg-6 order-1 order-lg-2 mb-4 mb-lg-0 ps-lg-5">
                                    <h3 className="display-6 fw-bold mb-3">{data.pillar_1}</h3>
                                    <p className="lead text-muted mb-4">
                                        {data.pillar_1_desc || "We are committed to addressing this critical issue with practical, effective solutions that benefit our community."}
                                    </p>
                                    <button className="btn btn-primary-custom rounded-0 shadow-sm">Read More</button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Pillar 2 */}
                {(data.pillar_2 || data.action_shot_2) && (
                    <section className="pillar-row">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6 mb-4 mb-lg-0 pe-lg-5">
                                    <h3 className="display-6 fw-bold mb-3">{data.pillar_2}</h3>
                                    <p className="lead opacity-75 mb-4">
                                        {data.pillar_2_desc || "Our approach focuses on sustainable growth and ensuring that every voice is heard in the decision-making process."}
                                    </p>
                                    <button className="btn btn-outline-light rounded-0 px-4 py-2">More Info</button>
                                </div>
                                <div className="col-lg-6">
                                    {data.action_shot_2 ? (
                                        <div className="pillar-img-container">
                                            <img src={data.action_shot_2} alt={data.pillar_2} className="pillar-img" />
                                        </div>
                                    ) : (
                                        <div className="pillar-img-container bg-dark d-flex align-items-center justify-content-center text-white border" style={{ height: '400px' }}>
                                            <span>Image Placeholder</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Pillar 3 */}
                {(data.pillar_3 || data.action_shot_3) && (
                    <section className="pillar-row">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-6 order-2 order-lg-1">
                                    {data.action_shot_3 ? (
                                        <div className="pillar-img-container">
                                            <img src={data.action_shot_3} alt={data.pillar_3} className="pillar-img" />
                                        </div>
                                    ) : (
                                        <div className="pillar-img-container bg-secondary d-flex align-items-center justify-content-center text-white" style={{ height: '400px' }}>
                                            <span>Image Placeholder</span>
                                        </div>
                                    )}
                                </div>
                                <div className="col-lg-6 order-1 order-lg-2 mb-4 mb-lg-0 ps-lg-5">
                                    <h3 className="display-6 fw-bold mb-3">{data.pillar_3}</h3>
                                    <p className="lead text-muted mb-4">
                                        {data.pillar_3_desc || "Preserving our values while looking forward to a brighter future for all citizens."}
                                    </p>
                                    <button className="btn btn-primary-custom rounded-0 shadow-sm">Read More</button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Platform / Brochure Section */}
            <section className="py-5 bg-light">
                <div className="container py-4 text-center">
                    <h2 className="fw-bold mb-4">Official Platform & Resources</h2>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card border-0 shadow-lg p-5 text-center bg-white rounded-3">
                                <i className="bi bi-file-earmark-pdf display-1 text-danger mb-3"></i>
                                <h4>Download Campaign Brochure</h4>
                                <p className="text-muted mb-4">Get the full details on our plan for the future.</p>
                                <button className="btn btn-outline-dark btn-lg border-2 fw-bold">Download PDF</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-5 text-white" style={{ backgroundColor: '#2c0b17' }}> {/* Dark deep bg */}
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center bg-white p-5 rounded-3 shadow-lg text-dark">
                            <h2 className="fw-bold mb-2">Communicate with {data.first_name}</h2>
                            <p className="text-muted mb-5">Have a question? Want to volunteer? Send us a message.</p>

                            <form>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="First Name" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <input type="text" className="form-control form-control-lg bg-light border-0" placeholder="Last Name" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <input type="email" className="form-control form-control-lg bg-light border-0" placeholder="Email Address" />
                                </div>
                                <div className="mb-4">
                                    <textarea className="form-control form-control-lg bg-light border-0" rows="4" placeholder="How can we help?"></textarea>
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary-custom btn-lg py-3 rounded-1">SEND MESSAGE</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="glass-footer text-center text-white-50">
                <div className="container">
                    <h4 className="text-white mb-3 text-uppercase letter-spacing-2">{data.first_name} {data.last_name}</h4>
                    <p className="mb-4">Paid for by the Committee to Elect {data.first_name} {data.last_name}</p>
                    <div className="d-flex justify-content-center gap-3 mb-4">
                        <a href="#" className="text-white"><i className="bi bi-facebook fs-4"></i></a>
                        <a href="#" className="text-white"><i className="bi bi-twitter fs-4"></i></a>
                        <a href="#" className="text-white"><i className="bi bi-instagram fs-4"></i></a>
                    </div>
                    <p className="small mb-0">&copy; 2025 All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default MirrorPage;
