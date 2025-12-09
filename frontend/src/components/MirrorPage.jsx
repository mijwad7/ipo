import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MirrorPage = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [requiresPassword, setRequiresPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(true);

    // Get stored password from localStorage
    const getStoredPassword = () => {
        return localStorage.getItem(`campaign_password_${slug}`) || '';
    };

    // Store password in localStorage
    const storePassword = (pwd) => {
        localStorage.setItem(`campaign_password_${slug}`, pwd);
    };

    // Load campaign data
    const loadCampaign = useCallback(async (pwd = null) => {
        setLoading(true);
        setPasswordError('');
        
        try {
            const storedPwd = pwd || getStoredPassword();
            const url = storedPwd 
                ? `/api/mirror/${slug}/?password=${encodeURIComponent(storedPwd)}`
                : `/api/mirror/${slug}/`;
            
            const res = await axios.get(url);
            setData(res.data);
            setRequiresPassword(false);
            if (storedPwd) {
                storePassword(storedPwd);
            }
            setError(false);
        } catch (err) {
            if (err.response?.status === 401) {
                // Password required or incorrect
                setRequiresPassword(true);
                setError(false);
                // Clear stored password if it was incorrect
                if (err.response.data.error === 'Incorrect password') {
                    localStorage.removeItem(`campaign_password_${slug}`);
                    setPasswordError('Incorrect password. Please try again.');
                } else {
                    setPasswordError('');
                }
            } else if (err.response?.status === 404) {
                setError(true);
                setRequiresPassword(false);
            } else {
                setError(true);
                setRequiresPassword(false);
            }
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        // Try to load with stored password first
        loadCampaign();
    }, [slug, loadCampaign]);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) {
            setPasswordError('Please enter a password');
            return;
        }
        await loadCampaign(password);
    };

    // Password form
    if (requiresPassword) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-dark text-white">
                <div className="text-center" style={{ maxWidth: '400px' }}>
                    <h1 className="display-5 fw-bold mb-4">Password Protected</h1>
                    <p className="lead text-white-50 mb-4">
                        This campaign page is password protected. Please enter the password to continue.
                    </p>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError('');
                                }}
                                autoFocus
                            />
                            {passwordError && (
                                <div className="text-danger mt-2 small">{passwordError}</div>
                            )}
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100">
                            Access Campaign
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (error) return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-dark text-white">
            <div className="text-center">
                <h1 className="display-4 fw-bold mb-3">Campaign Not Found</h1>
                <p className="lead text-white-50">The campaign you are looking for does not exist or has expired.</p>
            </div>
        </div>
    );

    if (loading || !data) return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-white">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    // Determine template style (default to modern if not specified)
    const templateStyle = data.template_style || 'modern';

    // Render Modern Template
    const renderModernTemplate = () => {
        const styles = {
            '--primary': data.primary_color || '#0d6efd',
            '--secondary': data.secondary_color || '#6c757d',
        };

        return (
            <div style={styles} className="modern-template-wrapper">
                <style>
                    {`
                        .modern-template-wrapper {
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
                            opacity: 0.9;
                            transform: translateY(-2px);
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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
                    `}
                </style>

                <nav className="navbar navbar-expand-lg navbar-dark bg-primary-modern py-3 fixed-top shadow-sm">
                    <div className="container">
                        <a className="navbar-brand fw-bold" href="#">
                            {data.last_name} <span className="fw-light">for Office</span>
                        </a>
                        <div className="ms-auto d-none d-md-block">
                            <a href={data.donation_url || "#"} className="btn btn-light rounded-pill px-4">DONATE</a>
                        </div>
                    </div>
                </nav>

                <header className="hero-modern text-white">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-5 mb-lg-0">
                                <h5 className="text-uppercase mb-3 opacity-75" style={{ letterSpacing: '2px', fontSize: '14px' }}>
                                    Vote for Leadership
                                </h5>
                                <h1 className="display-2 fw-bold mb-4">
                                    {data.first_name}<br />{data.last_name}
                                </h1>
                                <div className="bg-white mb-4" style={{ width: '80px', height: '4px', borderRadius: '2px' }}></div>
                                <p className="lead mb-5" style={{ lineHeight: 1.8, opacity: 0.95 }}>
                                    {data.bio_text}
                                </p>
                                <div className="d-flex gap-3 flex-wrap">
                                    {data.donation_url && (
                                        <a href={data.donation_url} className="btn btn-light btn-lg px-5 fw-bold rounded-pill shadow">
                                            DONATE NOW
                                        </a>
                                    )}
                                    <button className="btn btn-outline-light btn-lg px-4 rounded-pill" onClick={() => document.getElementById('contact').scrollIntoView()}>
                                        Get Involved
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-5 offset-lg-1 text-center">
                                {data.headshot && (
                                    <img
                                        src={data.headshot}
                                        alt={data.first_name}
                                        className="img-fluid rounded-4 shadow-lg"
                                        style={{ border: '8px solid rgba(255,255,255,0.2)' }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <section className="py-5 bg-light">
                    <div className="container py-5">
                        <div className="text-center mb-5">
                            <h2 className="display-5 fw-bold mb-3">My Top Issues & Concerns</h2>
                            <div className="mx-auto bg-primary-modern" style={{ width: '80px', height: '4px', borderRadius: '2px' }}></div>
                        </div>
                        <div className="row g-4">
                            {[
                                { title: data.pillar_1, desc: data.pillar_1_desc, img: data.action_shot_1 },
                                { title: data.pillar_2, desc: data.pillar_2_desc, img: data.action_shot_2 },
                                { title: data.pillar_3, desc: data.pillar_3_desc, img: data.action_shot_3 },
                            ].filter(p => p.title).map((pillar, idx) => (
                                <div key={idx} className="col-md-4">
                                    <div className="card card-modern h-100 border-0">
                                        <div 
                                            className="bg-primary-modern text-white p-4 text-center"
                                            style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            {pillar.img ? (
                                                <img src={pillar.img} alt={pillar.title} className="img-fluid" style={{ maxHeight: '200px', objectFit: 'contain', width: '100%' }} />
                                            ) : (
                                                <i className="bi bi-image" style={{ fontSize: '60px', opacity: 0.5 }}></i>
                                            )}
                                        </div>
                                        <div className="card-body p-4">
                                            <h4 className="fw-bold mb-3">{pillar.title}</h4>
                                            <p className="text-muted mb-3">{pillar.desc || "We are committed to addressing this critical issue."}</p>
                                            <button className="btn btn-primary-modern w-100">Learn More</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="py-5 bg-white">
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
                                                <input type="text" className="form-control form-control-lg" placeholder="First Name" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <input type="text" className="form-control form-control-lg" placeholder="Last Name" />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <input type="email" className="form-control form-control-lg" placeholder="Email Address" />
                                        </div>
                                        <div className="mb-4">
                                            <textarea className="form-control form-control-lg" rows="4" placeholder="Your Message"></textarea>
                                        </div>
                                        <div className="d-grid">
                                            <button type="button" className="btn btn-primary-modern btn-lg">SEND MESSAGE</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="bg-dark text-white py-5">
                    <div className="container text-center">
                        <h5 className="mb-3">{data.first_name} {data.last_name}</h5>
                        <p className="text-white-50 mb-4">
                            Paid for by the Committee to Elect {data.first_name} {data.last_name}
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

    // Render Traditional Template
    const renderTraditionalTemplate = () => {
        const styles = {
            '--primary': data.primary_color || '#6c757d',
            '--secondary': data.secondary_color || '#495057',
        };

        return (
            <div style={styles} className="traditional-template-wrapper">
                <style>
                    {`
                        .traditional-template-wrapper {
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
                        .traditional-divider {
                            border-top: 2px solid var(--primary);
                            width: 100px;
                            margin: 20px auto;
                        }
                    `}
                </style>

                <nav className="navbar navbar-expand-lg navbar-dark bg-primary-traditional py-3 fixed-top shadow-sm">
                    <div className="container">
                        <a className="navbar-brand fw-bold" href="#">
                            {data.last_name} <span className="fw-normal">for Office</span>
                        </a>
                        <div className="ms-auto d-none d-md-block">
                            <a href={data.donation_url || "#"} className="btn btn-light rounded-0 px-4">DONATE</a>
                        </div>
                    </div>
                </nav>

                <header className="hero-traditional">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-5 text-center mb-5 mb-lg-0">
                                {data.headshot && (
                                    <div className="bg-white p-4 shadow-sm" style={{ border: '3px solid var(--primary)' }}>
                                        <img
                                            src={data.headshot}
                                            alt={data.first_name}
                                            className="img-fluid"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="col-lg-7">
                                <h1 className="display-4 fw-bold mb-3" style={{ color: '#212529' }}>
                                    {data.first_name} {data.last_name}
                                </h1>
                                <div className="traditional-divider"></div>
                                <p className="lead mb-4" style={{ lineHeight: 1.8, color: '#495057' }}>
                                    {data.bio_text}
                                </p>
                                <div className="d-flex gap-3 flex-wrap">
                                    {data.donation_url && (
                                        <a href={data.donation_url} className="btn btn-primary-traditional btn-lg px-4 rounded-0">
                                            DONATE NOW
                                        </a>
                                    )}
                                    <button className="btn btn-outline-secondary btn-lg px-4 rounded-0" onClick={() => document.getElementById('contact').scrollIntoView()}>
                                        Get Involved
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="py-5 bg-white">
                    <div className="container py-5">
                        <div className="text-center mb-5">
                            <h2 className="display-5 fw-bold mb-3" style={{ color: '#212529' }}>My Top Issues & Concerns</h2>
                            <div className="traditional-divider"></div>
                        </div>
                        <div className="row">
                            {[
                                { title: data.pillar_1, desc: data.pillar_1_desc, img: data.action_shot_1 },
                                { title: data.pillar_2, desc: data.pillar_2_desc, img: data.action_shot_2 },
                                { title: data.pillar_3, desc: data.pillar_3_desc, img: data.action_shot_3 },
                            ].filter(p => p.title).map((pillar, idx) => (
                                <div key={idx} className="col-md-4 mb-4">
                                    <div className="card card-traditional h-100">
                                        <div 
                                            className="bg-light p-4 text-center border-bottom"
                                            style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            {pillar.img ? (
                                                <img src={pillar.img} alt={pillar.title} className="img-fluid" style={{ maxHeight: '180px', objectFit: 'contain', width: '100%' }} />
                                            ) : (
                                                <i className="bi bi-image text-muted" style={{ fontSize: '50px' }}></i>
                                            )}
                                        </div>
                                        <div className="card-body p-4">
                                            <div className="pillar-section-traditional">
                                                <h4 className="fw-bold mb-3" style={{ color: '#212529' }}>{pillar.title}</h4>
                                                <p className="text-muted mb-3" style={{ lineHeight: 1.7 }}>{pillar.desc || "We are committed to addressing this critical issue."}</p>
                                            </div>
                                            <button className="btn btn-primary-traditional w-100 rounded-0">Learn More</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="py-5 bg-light">
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
                                                <input type="text" className="form-control form-control-lg rounded-0" placeholder="First Name" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <input type="text" className="form-control form-control-lg rounded-0" placeholder="Last Name" />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <input type="email" className="form-control form-control-lg rounded-0" placeholder="Email Address" />
                                        </div>
                                        <div className="mb-4">
                                            <textarea className="form-control form-control-lg rounded-0" rows="4" placeholder="Your Message"></textarea>
                                        </div>
                                        <div className="d-grid">
                                            <button type="button" className="btn btn-primary-traditional btn-lg rounded-0">SEND MESSAGE</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="bg-dark text-white py-5">
                    <div className="container text-center">
                        <h5 className="mb-3">{data.first_name} {data.last_name}</h5>
                        <p className="text-white-50 mb-4">
                            Paid for by the Committee to Elect {data.first_name} {data.last_name}
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

    // Render Bold Template
    const renderBoldTemplate = () => {
        const styles = {
            '--primary': data.primary_color || '#dc3545',
            '--secondary': data.secondary_color || '#000000',
        };

        return (
            <div style={styles} className="bold-template-wrapper">
                <style>
                    {`
                        .bold-template-wrapper {
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
                        .hero-bold {
                            background: #000;
                            color: white;
                            padding: 140px 0 100px;
                            position: relative;
                            overflow: hidden;
                        }
                        .hero-bold::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: linear-gradient(45deg, var(--primary) 0%, transparent 50%);
                            opacity: 0.3;
                        }
                        .card-bold {
                            border: 4px solid #000;
                            border-radius: 0;
                            background: white;
                            box-shadow: 8px 8px 0 rgba(0,0,0,0.2);
                        }
                        .pillar-card-bold {
                            border: 4px solid var(--primary);
                            background: white;
                            transition: transform 0.3s;
                        }
                        .pillar-card-bold:hover {
                            transform: translateY(-8px);
                            box-shadow: 12px 12px 0 rgba(220, 53, 69, 0.3);
                        }
                        .bold-accent {
                            background: var(--primary);
                            height: 8px;
                            width: 150px;
                            margin: 20px auto;
                        }
                    `}
                </style>

                <nav className="navbar navbar-expand-lg navbar-dark bg-black py-4 fixed-top">
                    <div className="container">
                        <a className="navbar-brand fw-black text-uppercase" href="#" style={{ fontSize: '24px', letterSpacing: '2px' }}>
                            {data.last_name} <span className="fw-normal">FOR OFFICE</span>
                        </a>
                        <div className="ms-auto d-none d-md-block">
                            <a href={data.donation_url || "#"} className="btn btn-primary-bold px-4">DONATE</a>
                        </div>
                    </div>
                </nav>

                <header className="hero-bold text-white position-relative">
                    <div className="container position-relative">
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-5 mb-lg-0">
                                <h5 className="text-uppercase mb-4 fw-bold" style={{ letterSpacing: '4px', fontSize: '16px' }}>
                                    VOTE FOR LEADERSHIP
                                </h5>
                                <h1 className="display-1 fw-black mb-4" style={{ fontWeight: 900, lineHeight: 1.1 }}>
                                    {data.first_name}<br />{data.last_name}
                                </h1>
                                <div className="bg-primary-bold mb-4" style={{ width: '120px', height: '8px' }}></div>
                                <p className="lead mb-5 fw-bold" style={{ lineHeight: 1.8, fontSize: '20px' }}>
                                    {data.bio_text}
                                </p>
                                <div className="d-flex gap-3 flex-wrap">
                                    {data.donation_url && (
                                        <a href={data.donation_url} className="btn btn-primary-bold btn-lg px-5">
                                            DONATE NOW
                                        </a>
                                    )}
                                    <button className="btn btn-outline-light btn-lg px-4 fw-bold" style={{ borderWidth: '3px' }} onClick={() => document.getElementById('contact').scrollIntoView()}>
                                        GET INVOLVED
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-5 offset-lg-1 text-center">
                                {data.headshot && (
                                    <div className="bg-white p-4 border border-4 border-primary-bold" style={{ boxShadow: '12px 12px 0 rgba(220, 53, 69, 0.3)' }}>
                                        <img
                                            src={data.headshot}
                                            alt={data.first_name}
                                            className="img-fluid"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

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
                                { title: data.pillar_1, desc: data.pillar_1_desc, img: data.action_shot_1 },
                                { title: data.pillar_2, desc: data.pillar_2_desc, img: data.action_shot_2 },
                                { title: data.pillar_3, desc: data.pillar_3_desc, img: data.action_shot_3 },
                            ].filter(p => p.title).map((pillar, idx) => (
                                <div key={idx} className="col-md-4">
                                    <div className="card card-bold pillar-card-bold h-100">
                                        <div 
                                            className="bg-black text-white p-5 text-center"
                                            style={{ minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            {pillar.img ? (
                                                <img src={pillar.img} alt={pillar.title} className="img-fluid" style={{ maxHeight: '250px', objectFit: 'contain', width: '100%' }} />
                                            ) : (
                                                <div>
                                                    <i className="bi bi-image" style={{ fontSize: '80px', opacity: 0.7 }}></i>
                                                    <p className="mt-3 mb-0 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Image</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-body p-4">
                                            <h3 className="fw-black mb-3 text-uppercase" style={{ letterSpacing: '1px' }}>{pillar.title}</h3>
                                            <p className="mb-4" style={{ lineHeight: 1.7, fontWeight: 500 }}>{pillar.desc || "We are committed to addressing this critical issue."}</p>
                                            <button className="btn btn-primary-bold w-100">LEARN MORE</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="py-5 bg-black text-white">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="card card-bold border-primary-bold p-5 bg-white text-dark">
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
                                                <input type="text" className="form-control form-control-lg border-3 border-dark rounded-0 fw-bold" placeholder="FIRST NAME" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <input type="text" className="form-control form-control-lg border-3 border-dark rounded-0 fw-bold" placeholder="LAST NAME" />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <input type="email" className="form-control form-control-lg border-3 border-dark rounded-0 fw-bold" placeholder="EMAIL ADDRESS" />
                                        </div>
                                        <div className="mb-4">
                                            <textarea className="form-control form-control-lg border-3 border-dark rounded-0 fw-bold" rows="4" placeholder="YOUR MESSAGE"></textarea>
                                        </div>
                                        <div className="d-grid">
                                            <button type="button" className="btn btn-primary-bold btn-lg">SEND MESSAGE</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="bg-black text-white py-5 border-top border-4 border-primary-bold">
                    <div className="container text-center">
                        <h4 className="mb-3 fw-black text-uppercase" style={{ letterSpacing: '2px' }}>
                            {data.first_name} {data.last_name}
                        </h4>
                        <p className="text-white-50 mb-4 fw-bold">
                            Paid for by the Committee to Elect {data.first_name} {data.last_name}
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

    // Render template based on template_style
    switch (templateStyle) {
        case 'traditional':
            return renderTraditionalTemplate();
        case 'bold':
            return renderBoldTemplate();
        case 'modern':
        default:
            return renderModernTemplate();
    }
};

export default MirrorPage;
