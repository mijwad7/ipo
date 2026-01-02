import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MirrorPage = () => {
    const { slug, template } = useParams();
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
            // Build URL with template parameter if provided
            let url = template 
                ? `/api/mirror/${slug}/${template}/`
                : `/api/mirror/${slug}/`;
            
            if (storedPwd) {
                url += `?password=${encodeURIComponent(storedPwd)}`;
            }
            
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
    }, [slug, template]);

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
                    <h1 className="display-5 mb-4" style={{ fontWeight: 600 }}>Password Protected</h1>
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
                <h1 className="display-4 mb-3" style={{ fontWeight: 600 }}>Campaign Not Found</h1>
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

    // Determine template style - use URL parameter if provided, otherwise use data's template_style
    const templateStyle = template || data.template_style || 'modern';

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
                            font-family: 'Open Sans', sans-serif;
                            color: #333;
                            overflow-x: hidden;
                        }
                        .bg-primary-modern {
                            background-color: var(--primary);
                            color: white;
                        }
                        .navbar-brand.text-white {
                            color: white !important;
                        }
                        .hero-modern {
                            color: white !important;
                        }
                        .hero-modern h1,
                        .hero-modern h5,
                        .hero-modern p {
                            color: white !important;
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
                    `}
                </style>

                <nav className="navbar navbar-expand-lg navbar-dark bg-primary-modern py-3 fixed-top shadow-sm" style={{ borderBottom: '4px solid var(--secondary)' }}>
                    <div className="container">
                        <a className="navbar-brand text-white" href="#about" style={{ fontWeight: 600, color: 'white !important' }}>
                            {data.position_running_for || `${data.last_name} for Office`}
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
                                    <a href={data.donation_url || "#"} className="btn rounded-pill px-4" style={{ backgroundColor: 'var(--secondary)', color: '#333', fontWeight: '600' }}>DONATE</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <header id="about" className="hero-modern text-white position-relative" style={{
                    backgroundImage: data.background_picture ? `url(${data.background_picture})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    color: 'white'
                }}>
                    {/* Primary color overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: data.background_picture ? 'var(--primary)' : 'var(--primary)',
                        opacity: data.background_picture ? 0.85 : 1,
                        zIndex: 0
                    }}></div>
                    <div className="container position-relative" style={{ zIndex: 1, color: 'white' }}>
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-5 mb-lg-0" style={{ color: 'white' }}>
                                <h5 className="text-uppercase mb-3" style={{ letterSpacing: '2px', fontSize: '14px', color: 'white', opacity: 0.9 }}>
                                    {data.tag_line || 'Vote for Leadership'}
                                </h5>
                                <h1 className="display-2 mb-4" style={{ fontWeight: 600, color: 'white' }}>
                                    {data.first_name}<br />{data.last_name}
                                </h1>
                                {(data.riding_zone_name || data.election_date) && (
                                    <div className="mb-3" style={{ color: 'white' }}>
                                        {data.riding_zone_name && (
                                            <p className="mb-1" style={{ fontSize: '1.1rem', color: 'white', opacity: 0.95 }}>
                                                <strong style={{ color: 'white' }}>Riding:</strong> {data.riding_zone_name}
                                            </p>
                                        )}
                                        {data.election_date && (
                                            <p className="mb-0" style={{ fontSize: '1.1rem', color: 'white', opacity: 0.95 }}>
                                                <strong style={{ color: 'white' }}>Election Date:</strong> {new Date(data.election_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        )}
                                    </div>
                                )}
                                <div className="mb-4" style={{ width: '80px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--secondary)' }}></div>
                                <p className="lead mb-5" style={{ lineHeight: 1.8, color: 'white', opacity: 0.95 }}>
                                    {data.bio_text}
                                </p>
                                <div className="d-flex gap-3 flex-wrap">
                                    {data.donation_url && (
                                        <a href={data.donation_url} className="btn btn-lg px-5 fw-bold rounded-pill shadow" style={{ backgroundColor: 'var(--secondary)', color: '#333' }}>
                                            DONATE NOW
                                        </a>
                                    )}
                                    <button className="btn btn-secondary-modern btn-lg px-4 rounded-pill" onClick={() => document.getElementById('contact').scrollIntoView()}>
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
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <section id="platform" className="py-5" style={{ backgroundColor: 'var(--secondary)' }}>
                    <div className="container py-5">
                        <div className="text-center mb-5">
                            <h2 className="display-5 mb-3" style={{ color: '#333', fontWeight: 600 }}>My Top Issues & Concerns</h2>
                            <div className="mx-auto mb-2" style={{ width: '80px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--primary)' }}></div>
                        </div>
                        <div className="row g-4">
                            {[
                                { title: data.pillar_1, desc: data.pillar_1_desc, img: data.action_shot_1 },
                                { title: data.pillar_2, desc: data.pillar_2_desc, img: data.action_shot_2 },
                                { title: data.pillar_3, desc: data.pillar_3_desc, img: data.action_shot_3 },
                            ].filter(p => p.title).map((pillar, idx) => (
                                <div key={idx} className="col-md-4">
                                    <div className="card card-modern h-100" style={{ border: '2px solid var(--secondary)' }}>
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
                                            <h4 className="mb-3" style={{ fontWeight: 600 }}>{pillar.title}</h4>
                                            <p className="text-muted mb-3">{pillar.desc || "We are committed to addressing this critical issue."}</p>
                                            <button className="btn btn-primary-modern w-100">Learn More</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="py-5 bg-white" style={{ borderTop: '4px solid var(--secondary)' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="card card-modern border-0 p-5" style={{ border: '3px solid var(--secondary)' }}>
                                    <h2 className="text-center mb-4" style={{ color: 'var(--primary)', fontWeight: 600 }}>Get in Touch</h2>
                                    <div className="mx-auto mb-3" style={{ width: '100px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--secondary)' }}></div>
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

                <footer className="bg-primary-modern text-white py-5" style={{ borderTop: `4px solid var(--secondary)` }}>
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
                            font-family: 'Open Sans', sans-serif;
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
                        .traditional-divider {
                            border-top: 2px solid var(--primary);
                            border-bottom: 1px solid var(--secondary);
                            width: 100px;
                            margin: 20px auto;
                            height: 3px;
                        }
                    `}
                </style>

                <nav className="navbar navbar-expand-lg navbar-dark bg-primary-traditional py-3 fixed-top shadow-sm" style={{ borderBottom: '3px solid var(--secondary)' }}>
                    <div className="container">
                        <a className="navbar-brand" href="#about" style={{ fontWeight: 600 }}>
                            {data.position_running_for || `${data.last_name} for Office`}
                        </a>
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#navbarNavTraditional"
                            aria-controls="navbarNavTraditional" 
                            aria-expanded="false" 
                            aria-label="Toggle navigation"
                            style={{ borderColor: 'rgba(255,255,255,0.5)' }}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavTraditional">
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
                                    <a href={data.donation_url || "#"} className="btn rounded-0 px-4" style={{ backgroundColor: 'var(--secondary)', color: '#333', fontWeight: '500' }}>DONATE</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <header id="about" className="hero-traditional">
                    <div className="container">
                        <div className="row align-items-start">
                            <div className="col-lg-5 mb-5 mb-lg-0">
                                <div className="text-center mb-4">
                                    {data.headshot && (
                                        <div className="bg-white p-4 shadow-sm mx-auto" style={{ border: '3px solid var(--primary)', maxWidth: '300px' }}>
                                            <img
                                                src={data.headshot}
                                                alt={data.first_name}
                                                className="img-fluid"
                                            />
                                        </div>
                                    )}
                                </div>
                                <h1 className="display-4 mb-3 text-center" style={{ color: '#212529', fontWeight: 600 }}>
                                    {data.first_name} {data.last_name}
                                </h1>
                                <div className="text-center mb-2">
                                <p className="mb-1" style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 600 }}>
                                    {data.tag_line || 'Vote for Leadership'}
                                </p>
                                </div>
                                {(data.riding_zone_name || data.election_date) && (
                                    <div className="text-center mb-3">
                                        {data.riding_zone_name && (
                                            <p className="mb-1 small" style={{ color: '#495057' }}>
                                                <strong>Riding:</strong> {data.riding_zone_name}
                                            </p>
                                        )}
                                        {data.election_date && (
                                            <p className="mb-0 small" style={{ color: '#495057' }}>
                                                <strong>Election Date:</strong> {new Date(data.election_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        )}
                                    </div>
                                )}
                                <div className="traditional-divider" style={{ margin: '20px auto' }}></div>
                                <p className="lead mb-4 text-center" style={{ lineHeight: 1.8, color: '#495057' }}>
                                    {data.bio_text}
                                </p>
                                <div className="d-flex gap-3 flex-wrap justify-content-center">
                                    {data.donation_url && (
                                        <a href={data.donation_url} className="btn btn-primary-traditional btn-lg px-4 rounded-0">
                                            DONATE NOW
                                        </a>
                                    )}
                                    <button className="btn btn-secondary-traditional btn-lg px-4 rounded-0">
                                        Get Involved
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-7" id="contact">
                                <div className="card card-traditional p-4" style={{ border: '3px solid var(--primary)', backgroundColor: 'white' }}>
                                    <h3 className="mb-3 text-center" style={{ color: 'var(--primary)', fontWeight: 600 }}>Get in Touch</h3>
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
                                                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <input 
                                                    type="text" 
                                                    className="form-control form-control-lg rounded-0" 
                                                    placeholder="Last Name" 
                                                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <input 
                                                type="email" 
                                                className="form-control form-control-lg rounded-0" 
                                                placeholder="Email Address" 
                                                style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <textarea 
                                                className="form-control form-control-lg rounded-0" 
                                                rows="4" 
                                                placeholder="Your Message" 
                                                style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
                                            ></textarea>
                                        </div>
                                        <div className="d-grid">
                                            <button type="button" className="btn btn-primary-traditional btn-lg rounded-0">
                                                SEND MESSAGE
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section id="platform" className="py-5 bg-white">
                    <div className="container py-5">
                        <div className="text-center mb-5">
                            <h2 className="display-5 fw-bold mb-3" style={{ color: '#212529' }}>My Top Issues & Concerns</h2>
                            <div style={{ width: '100px', height: '3px', margin: '20px auto', backgroundColor: 'var(--primary)' }}></div>
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
                                                <h4 className="mb-3" style={{ color: '#212529', fontWeight: 600 }}>{pillar.title}</h4>
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

                <footer className="bg-primary-traditional text-white py-5 position-relative" style={{ 
                    borderTop: `4px solid var(--secondary)`,
                    backgroundImage: data.background_picture ? `url(${data.background_picture})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    {/* Primary color overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: data.background_picture ? 'var(--primary)' : 'transparent',
                        opacity: data.background_picture ? 0.8 : 1,
                        zIndex: 0
                    }}></div>
                    <div className="container text-center position-relative" style={{ zIndex: 1 }}>
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
                            font-family: 'Open Sans', sans-serif;
                            color: #000;
                            overflow-x: hidden;
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
                            font-weight: 600;
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
                            font-weight: 600;
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
                        .bold-accent {
                            background: linear-gradient(to right, var(--primary), var(--secondary));
                            height: 8px;
                            width: 150px;
                            margin: 20px auto;
                        }
                    `}
                </style>

                <nav className="navbar navbar-expand-lg navbar-dark bg-primary-bold py-4 fixed-top" style={{ borderBottom: '6px solid var(--secondary)' }}>
                    <div className="container">
                        <a className="navbar-brand text-uppercase" href="#about" style={{ fontSize: '24px', letterSpacing: '2px', fontWeight: 700 }}>
                            {data.position_running_for ? data.position_running_for.toUpperCase() : `${data.last_name} FOR OFFICE`}
                        </a>
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#navbarNavBold"
                            aria-controls="navbarNavBold" 
                            aria-expanded="false" 
                            aria-label="Toggle navigation"
                            style={{ borderColor: 'rgba(255,255,255,0.5)' }}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavBold">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <a className="nav-link text-white text-uppercase" href="#about" style={{ letterSpacing: '1px', fontWeight: 600 }}>About</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white text-uppercase" href="#platform" style={{ letterSpacing: '1px', fontWeight: 600 }}>Platform</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white text-uppercase" href="#contact" style={{ letterSpacing: '1px', fontWeight: 600 }}>Contact</a>
                                </li>
                                <li className="nav-item ms-2">
                                    <a href={data.donation_url || "#"} className="btn px-4" style={{ backgroundColor: 'var(--secondary)', color: '#333', border: '3px solid var(--secondary)', fontWeight: 600 }}>DONATE</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <header id="about" className="hero-bold text-white position-relative" style={{ background: 'var(--primary)', borderBottom: '8px solid var(--secondary)' }}>
                    <div className="container position-relative">
                        <div className="row align-items-center">
                            <div className="col-lg-7 mb-5 mb-lg-0">
                                <h5 className="text-uppercase mb-4" style={{ letterSpacing: '4px', fontSize: '16px', color: 'var(--secondary)', fontWeight: 600 }}>
                                    {data.tag_line ? data.tag_line.toUpperCase() : 'VOTE FOR LEADERSHIP'}
                                </h5>
                                <h1 className="display-1 mb-4" style={{ fontWeight: 700, lineHeight: 1.1 }}>
                                    {data.first_name}<br />{data.last_name}
                                </h1>
                                {(data.riding_zone_name || data.election_date) && (
                                    <div className="mb-3">
                                        {data.riding_zone_name && (
                                            <p className="mb-1" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                                RIDING: {data.riding_zone_name.toUpperCase()}
                                            </p>
                                        )}
                                        {data.election_date && (
                                            <p className="mb-0" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                                ELECTION DATE: {new Date(data.election_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                                            </p>
                                        )}
                                    </div>
                                )}
                                <div className="mb-4" style={{ width: '120px', height: '10px', background: 'var(--secondary)', border: '2px solid white' }}></div>
                                <p className="lead mb-5" style={{ lineHeight: 1.8, fontSize: '20px', fontWeight: 400 }}>
                                    {data.bio_text}
                                </p>
                                <div className="d-flex gap-3 flex-wrap">
                                    {data.donation_url && (
                                        <a href={data.donation_url} className="btn btn-light btn-lg px-5" style={{ border: '4px solid var(--secondary)', fontWeight: 600 }}>
                                            DONATE NOW
                                        </a>
                                    )}
                                    <button className="btn btn-lg px-4" style={{ border: '4px solid var(--secondary)', backgroundColor: 'var(--secondary)', color: '#333', fontWeight: 600 }}>
                                        GET INVOLVED
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-5 text-center">
                                {data.headshot && (
                                    <div className="p-4" style={{ border: '6px solid var(--secondary)', boxShadow: '15px 15px 0 rgba(0, 0, 0, 0.4)', background: 'transparent' }}>
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

                <section id="platform" className="py-5 bg-primary-bold text-white position-relative" style={{ 
                    borderTop: '8px solid var(--secondary)', 
                    borderBottom: '8px solid var(--secondary)',
                    backgroundImage: data.background_picture ? `url(${data.background_picture})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    {/* Primary color overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: data.background_picture ? 'var(--primary)' : 'transparent',
                        opacity: data.background_picture ? 0.8 : 1,
                        zIndex: 0
                    }}></div>
                    <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
                        <div className="text-center mb-5">
                            <h2 className="display-3 mb-3 text-uppercase text-white" style={{ letterSpacing: '2px', fontWeight: 700 }}>
                                My Top Issues & Concerns
                            </h2>
                            <div style={{ height: '10px', width: '200px', margin: '20px auto', background: 'var(--secondary)', border: '2px solid white' }}></div>
                        </div>
                        <div className="row g-0">
                            {[
                                { title: data.pillar_1, desc: data.pillar_1_desc, img: data.action_shot_1 },
                                { title: data.pillar_2, desc: data.pillar_2_desc, img: data.action_shot_2 },
                                { title: data.pillar_3, desc: data.pillar_3_desc, img: data.action_shot_3 },
                            ].filter(p => p.title).map((pillar, idx) => {
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
                                                            {pillar.img ? (
                                                                <img src={pillar.img} alt={pillar.title} className="img-fluid" style={{ maxHeight: '300px', objectFit: 'contain', width: '100%' }} />
                                                            ) : (
                                                                <div>
                                                                    <i className="bi bi-image" style={{ fontSize: '80px', opacity: 0.7, color: 'white' }}></i>
                                                                    <p className="mt-3 mb-0 fw-bold text-uppercase" style={{ letterSpacing: '1px', color: 'white' }}>Image</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-7 p-5 text-white">
                                                        <h3 className="mb-4 text-uppercase text-white" style={{ letterSpacing: '1px', fontSize: '2rem', borderBottom: '4px solid var(--secondary)', paddingBottom: '15px', fontWeight: 700 }}>{pillar.title}</h3>
                                                        <p className="mb-4 lead" style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>{pillar.desc || "We are committed to addressing this critical issue."}</p>
                                                        <button className="btn btn-lg" style={{ backgroundColor: 'var(--secondary)', color: '#333', border: '3px solid white', fontWeight: 600 }}>READ MORE</button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="col-md-7 p-5 text-white">
                                                        <h3 className="mb-4 text-uppercase text-white" style={{ letterSpacing: '1px', fontSize: '2rem', borderBottom: '4px solid var(--secondary)', paddingBottom: '15px', fontWeight: 700 }}>{pillar.title}</h3>
                                                        <p className="mb-4 lead" style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>{pillar.desc || "We are committed to addressing this critical issue."}</p>
                                                        <button className="btn btn-lg" style={{ backgroundColor: 'var(--secondary)', color: '#333', border: '3px solid white', fontWeight: 600 }}>READ MORE</button>
                                                    </div>
                                                    <div className="col-md-5 p-0">
                                                        <div 
                                                            className="text-center d-flex align-items-center justify-content-center"
                                                            style={{ minHeight: '300px', padding: '20px', background: 'transparent', border: '4px solid white' }}
                                                        >
                                                            {pillar.img ? (
                                                                <img src={pillar.img} alt={pillar.title} className="img-fluid" style={{ maxHeight: '300px', objectFit: 'contain', width: '100%' }} />
                                                            ) : (
                                                                <div>
                                                                    <i className="bi bi-image" style={{ fontSize: '80px', opacity: 0.7, color: 'white' }}></i>
                                                                    <p className="mt-3 mb-0 fw-bold text-uppercase" style={{ letterSpacing: '1px', color: 'white' }}>Image</p>
                                                                </div>
                                                            )}
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

                <section id="contact" className="py-5 bg-secondary-bold" style={{ borderTop: `8px solid var(--primary)`, color: '#333' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="card card-bold p-5 bg-white text-dark" style={{ border: '6px solid var(--primary)', boxShadow: '15px 15px 0 rgba(0,0,0,0.3)' }}>
                                    <h2 className="text-center mb-4 text-uppercase" style={{ letterSpacing: '2px', color: 'var(--primary)', fontWeight: 700 }}>
                                        Get in Touch
                                    </h2>
                                    <div style={{ height: '8px', width: '150px', margin: '20px auto', background: 'var(--primary)' }}></div>
                                    <p className="text-center mb-4" style={{ fontWeight: 400 }}>
                                        Have a question? Want to volunteer? Send us a message.
                                    </p>
                                    <form>
                                        <div className="row mb-3">
                                            <div className="col-md-6 mb-3">
                                                <input type="text" className="form-control form-control-lg border-3 border-dark rounded-0" placeholder="FIRST NAME" style={{ fontWeight: 400 }} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <input type="text" className="form-control form-control-lg border-3 border-dark rounded-0" placeholder="LAST NAME" style={{ fontWeight: 400 }} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <input type="email" className="form-control form-control-lg border-3 border-dark rounded-0" placeholder="EMAIL ADDRESS" style={{ fontWeight: 400 }} />
                                        </div>
                                        <div className="mb-4">
                                            <textarea className="form-control form-control-lg border-3 border-dark rounded-0" rows="4" placeholder="YOUR MESSAGE" style={{ fontWeight: 400 }}></textarea>
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

                <footer className="bg-primary-bold text-white py-5" style={{ borderTop: `6px solid var(--primary)` }}>
                    <div className="container text-center">
                        <h4 className="mb-3 text-uppercase" style={{ letterSpacing: '2px', fontWeight: 700 }}>
                            {data.first_name} {data.last_name}
                        </h4>
                        <p className="text-white-50 mb-4" style={{ fontWeight: 400 }}>
                            Paid for by the Committee to Elect {data.first_name} {data.last_name}
                        </p>
                        <div className="d-flex justify-content-center gap-3 mb-4">
                            <a href="#" className="text-white"><i className="bi bi-facebook fs-4"></i></a>
                            <a href="#" className="text-white"><i className="bi bi-twitter fs-4"></i></a>
                            <a href="#" className="text-white"><i className="bi bi-instagram fs-4"></i></a>
                        </div>
                        <p className="small text-white-50 mb-0" style={{ fontWeight: 400 }}>&copy; 2025 All Rights Reserved.</p>
                    </div>
                </footer>
            </div>
        );
    };

    // Organization-specific template rendering functions
    const renderOrganizationModernTemplate = () => {
        const styles = {
            '--primary': data.primary_color || '#0d6efd',
            '--secondary': data.secondary_color || '#6c757d',
        };

        return (
            <div style={styles} className="modern-template-wrapper">
                <style>
                    {`
                        .modern-template-wrapper {
                            font-family: 'Open Sans', sans-serif;
                            color: #333;
                            overflow-x: hidden;
                        }
                        .bg-primary-modern {
                            background-color: var(--primary);
                            color: white;
                        }
                        .navbar-brand.text-white {
                            color: white !important;
                        }
                        .hero-modern {
                            color: white !important;
                        }
                        .hero-modern h1,
                        .hero-modern h5,
                        .hero-modern p {
                            color: white !important;
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
                    `}
                </style>

                <nav className="navbar navbar-expand-lg navbar-dark bg-primary-modern py-3 fixed-top shadow-sm" style={{ borderBottom: '4px solid var(--secondary)' }}>
                    <div className="container">
                        <a className="navbar-brand text-white" href="#about" style={{ fontWeight: 600, color: 'white !important' }}>
                            {data.organization_name || `${data.first_name} ${data.last_name}`}
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
                                    <a className="nav-link text-white" href="#services">Services</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white" href="#contact">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <header id="about" className="hero-modern text-white position-relative" style={{
                    backgroundImage: data.background_picture ? `url(${data.background_picture})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    color: 'white'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: data.background_picture ? 'var(--primary)' : 'var(--primary)',
                        opacity: data.background_picture ? 0.85 : 1,
                        zIndex: 0
                    }}></div>
                    <div className="container position-relative" style={{ zIndex: 1, color: 'white' }}>
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-5 mb-lg-0" style={{ color: 'white' }}>
                                {data.logo && (
                                    <div className="mb-4">
                                        <img src={data.logo} alt={data.organization_name} className="img-fluid" style={{ maxHeight: '100px', filter: 'brightness(0) invert(1)' }} />
                                    </div>
                                )}
                                <h5 className="text-uppercase mb-3" style={{ letterSpacing: '2px', fontSize: '14px', color: 'white', opacity: 0.9 }}>
                                    {data.tag_line || 'Serving Our Community'}
                                </h5>
                                <h1 className="display-2 mb-4" style={{ fontWeight: 600, color: 'white' }}>
                                    {data.organization_name || `${data.first_name} ${data.last_name}`}
                                </h1>
                                <div className="mb-4" style={{ width: '80px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--secondary)' }}></div>
                                <p className="lead mb-5" style={{ lineHeight: 1.8, color: 'white', opacity: 0.95 }}>
                                    {data.bio_text}
                                </p>
                                <div className="d-flex gap-3 flex-wrap">
                                    <button className="btn btn-lg px-5 fw-bold rounded-pill shadow" style={{ backgroundColor: 'var(--secondary)', color: '#333' }}>
                                        Get Involved
                                    </button>
                                    <button className="btn btn-secondary-modern btn-lg px-4 rounded-pill" onClick={() => document.getElementById('contact').scrollIntoView()}>
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-5 offset-lg-1 text-center">
                                {data.owner_photo && (
                                    <img
                                        src={data.owner_photo}
                                        alt={data.first_name}
                                        className="img-fluid rounded-4 shadow-lg"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <section id="services" className="py-5" style={{ backgroundColor: 'var(--secondary)' }}>
                    <div className="container py-5">
                        <div className="text-center mb-5">
                            <h2 className="display-5 mb-3" style={{ color: '#333', fontWeight: 600 }}>Our Services & Programs</h2>
                            <div className="mx-auto mb-2" style={{ width: '80px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--primary)' }}></div>
                        </div>
                        <div className="row g-4">
                            {[
                                { title: data.service_1, desc: data.service_1_desc, img: data.service_image_1 },
                                { title: data.service_2, desc: data.service_2_desc, img: data.service_image_2 },
                                { title: data.service_3, desc: data.service_3_desc, img: data.service_image_3 },
                            ].filter(s => s.title).map((service, idx) => (
                                <div key={idx} className="col-md-4">
                                    <div className="card card-modern h-100" style={{ border: '2px solid var(--secondary)' }}>
                                        <div 
                                            className="bg-primary-modern text-white p-4 text-center"
                                            style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            {service.img ? (
                                                <img src={service.img} alt={service.title} className="img-fluid" style={{ maxHeight: '200px', objectFit: 'contain', width: '100%' }} />
                                            ) : (
                                                <i className="bi bi-heart" style={{ fontSize: '60px', opacity: 0.5 }}></i>
                                            )}
                                        </div>
                                        <div className="card-body p-4">
                                            <h4 className="mb-3" style={{ fontWeight: 600 }}>{service.title}</h4>
                                            <p className="text-muted mb-3">{service.desc || "We are committed to providing this valuable service to our community."}</p>
                                            <button className="btn btn-primary-modern w-100">Learn More</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="py-5 bg-white" style={{ borderTop: '4px solid var(--secondary)' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="card card-modern border-0 p-5" style={{ border: '3px solid var(--secondary)' }}>
                                    <h2 className="text-center mb-4" style={{ color: 'var(--primary)', fontWeight: 600 }}>Get in Touch</h2>
                                    <div className="mx-auto mb-3" style={{ width: '100px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--secondary)' }}></div>
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

                <footer className="bg-primary-modern text-white py-5" style={{ borderTop: `4px solid var(--secondary)` }}>
                    <div className="container text-center">
                        <h5 className="mb-3">{data.organization_name || `${data.first_name} ${data.last_name}`}</h5>
                        <p className="text-white-50 mb-4">
                            {data.bio_text ? data.bio_text.substring(0, 100) + '...' : 'Serving our community with dedication and care.'}
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

    // Organization Traditional Template
    const renderOrganizationTraditionalTemplate = () => {
        const styles = {
            '--primary': data.primary_color || '#6c757d',
            '--secondary': data.secondary_color || '#495057',
        };

        return (
            <div style={styles} className="traditional-template-wrapper">
                <style>
                    {`
                        .traditional-template-wrapper {
                            font-family: 'Open Sans', sans-serif;
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
                        .service-section-traditional {
                            border-left: 4px solid var(--primary);
                            border-bottom: 2px solid var(--secondary);
                            padding-left: 20px;
                            padding-bottom: 10px;
                            margin-bottom: 30px;
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

                <nav className="navbar navbar-expand-lg navbar-dark bg-primary-traditional py-3 fixed-top shadow-sm" style={{ borderBottom: '3px solid var(--secondary)' }}>
                    <div className="container">
                        <a className="navbar-brand" href="#about" style={{ fontWeight: 600 }}>
                            {data.organization_name || `${data.first_name} ${data.last_name}`}
                        </a>
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#navbarNavOrgTraditional"
                            aria-controls="navbarNavOrgTraditional" 
                            aria-expanded="false" 
                            aria-label="Toggle navigation"
                            style={{ borderColor: 'rgba(255,255,255,0.5)' }}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavOrgTraditional">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <a className="nav-link text-white" href="#about">About</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white" href="#services">Services</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white" href="#contact">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <header id="about" className="hero-traditional">
                    <div className="container">
                        <div className="row align-items-start">
                            <div className="col-lg-5 mb-5 mb-lg-0">
                                <div className="text-center mb-4">
                                    {data.logo && (
                                        <div className="bg-white p-4 shadow-sm mx-auto mb-4" style={{ border: '3px solid var(--primary)', maxWidth: '300px' }}>
                                            <img src={data.logo} alt={data.organization_name} className="img-fluid" style={{ maxHeight: '150px', objectFit: 'contain' }} />
                                        </div>
                                    )}
                                    {data.owner_photo && (
                                        <div className="bg-white p-4 shadow-sm mx-auto" style={{ border: '3px solid var(--primary)', maxWidth: '300px' }}>
                                            <img src={data.owner_photo} alt="Leader" className="img-fluid" />
                                        </div>
                                    )}
                                </div>
                                <h1 className="display-4 mb-3 text-center" style={{ color: '#212529', fontWeight: 600 }}>
                                    {data.organization_name || `${data.first_name} ${data.last_name}`}
                                </h1>
                                <div className="text-center mb-2">
                                    <p className="mb-1" style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 600 }}>
                                        {data.tag_line || 'Serving Our Community'}
                                    </p>
                                </div>
                                <div className="traditional-divider" style={{ margin: '20px auto' }}></div>
                                <p className="lead mb-4 text-center" style={{ lineHeight: 1.8, color: '#495057' }}>
                                    {data.bio_text}
                                </p>
                                <div className="d-flex gap-3 flex-wrap justify-content-center">
                                    <button className="btn btn-primary-traditional btn-lg px-4 rounded-0">
                                        Get Involved
                                    </button>
                                    <button className="btn btn-secondary-traditional btn-lg px-4 rounded-0" onClick={() => document.getElementById('contact').scrollIntoView()}>
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-7" id="contact">
                                <div className="card card-traditional p-4" style={{ border: '3px solid var(--primary)', backgroundColor: 'white' }}>
                                    <h3 className="mb-3 text-center" style={{ color: 'var(--primary)', fontWeight: 600 }}>Get in Touch</h3>
                                    <div style={{ width: '100px', height: '3px', margin: '15px auto', backgroundColor: 'var(--primary)' }}></div>
                                    <p className="text-center text-muted mb-4 small">
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
                                            <button type="button" className="btn btn-primary-traditional btn-lg rounded-0">
                                                SEND MESSAGE
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section id="services" className="py-5 bg-white">
                    <div className="container py-5">
                        <div className="text-center mb-5">
                            <h2 className="display-5 fw-bold mb-3" style={{ color: '#212529' }}>Our Services & Programs</h2>
                            <div style={{ width: '100px', height: '3px', margin: '20px auto', backgroundColor: 'var(--primary)' }}></div>
                        </div>
                        <div className="row">
                            {[
                                { title: data.service_1, desc: data.service_1_desc, img: data.service_image_1 },
                                { title: data.service_2, desc: data.service_2_desc, img: data.service_image_2 },
                                { title: data.service_3, desc: data.service_3_desc, img: data.service_image_3 },
                            ].filter(s => s.title).map((service, idx) => (
                                <div key={idx} className="col-md-4 mb-4">
                                    <div className="card card-traditional h-100">
                                        <div 
                                            className="bg-light p-4 text-center border-bottom"
                                            style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            {service.img ? (
                                                <img src={service.img} alt={service.title} className="img-fluid" style={{ maxHeight: '180px', objectFit: 'contain', width: '100%' }} />
                                            ) : (
                                                <i className="bi bi-heart text-muted" style={{ fontSize: '50px' }}></i>
                                            )}
                                        </div>
                                        <div className="card-body p-4">
                                            <div className="service-section-traditional">
                                                <h4 className="mb-3" style={{ color: '#212529', fontWeight: 600 }}>{service.title}</h4>
                                                <p className="text-muted mb-3" style={{ lineHeight: 1.7 }}>{service.desc || "We are committed to providing this valuable service to our community."}</p>
                                            </div>
                                            <button className="btn btn-primary-traditional w-100 rounded-0">Learn More</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer className="bg-primary-traditional text-white py-5 position-relative" style={{ 
                    borderTop: `4px solid var(--secondary)`,
                    backgroundImage: data.background_picture ? `url(${data.background_picture})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: data.background_picture ? 'var(--primary)' : 'transparent',
                        opacity: data.background_picture ? 0.8 : 1,
                        zIndex: 0
                    }}></div>
                    <div className="container text-center position-relative" style={{ zIndex: 1 }}>
                        <h5 className="mb-3">{data.organization_name || `${data.first_name} ${data.last_name}`}</h5>
                        <p className="text-white-50 mb-4">
                            {data.bio_text ? data.bio_text.substring(0, 100) + '...' : 'Serving our community with dedication and care.'}
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

    // Organization Bold Template
    const renderOrganizationBoldTemplate = () => {
        const styles = {
            '--primary': data.primary_color || '#dc3545',
            '--secondary': data.secondary_color || '#000000',
        };

        return (
            <div style={styles} className="bold-template-wrapper">
                <style>
                    {`
                        .bold-template-wrapper {
                            font-family: 'Open Sans', sans-serif;
                            color: #000;
                            overflow-x: hidden;
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
                            font-weight: 600;
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
                            font-weight: 600;
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
                        .service-card-bold {
                            border: 4px solid var(--primary);
                            border-top: 6px solid var(--secondary);
                            background: white;
                            transition: transform 0.3s;
                        }
                        .service-card-bold:hover {
                            transform: translateY(-8px);
                            box-shadow: 12px 12px 0 rgba(220, 53, 69, 0.3);
                            border-color: var(--primary);
                            border-top-color: var(--secondary);
                        }
                        .bold-accent {
                            background: linear-gradient(to right, var(--primary), var(--secondary));
                            height: 8px;
                            width: 150px;
                            margin: 20px auto;
                        }
                    `}
                </style>

                <nav className="navbar navbar-expand-lg navbar-dark bg-primary-bold py-4 fixed-top" style={{ borderBottom: '6px solid var(--secondary)' }}>
                    <div className="container">
                        <a className="navbar-brand text-uppercase" href="#about" style={{ fontSize: '24px', letterSpacing: '2px', fontWeight: 700 }}>
                            {(data.organization_name || `${data.first_name} ${data.last_name}`).toUpperCase()}
                        </a>
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#navbarNavOrgBold"
                            aria-controls="navbarNavOrgBold" 
                            aria-expanded="false" 
                            aria-label="Toggle navigation"
                            style={{ borderColor: 'rgba(255,255,255,0.5)' }}
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavOrgBold">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <a className="nav-link text-white text-uppercase" href="#about" style={{ letterSpacing: '1px', fontWeight: 600 }}>About</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white text-uppercase" href="#services" style={{ letterSpacing: '1px', fontWeight: 600 }}>Services</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white text-uppercase" href="#contact" style={{ letterSpacing: '1px', fontWeight: 600 }}>Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <header id="about" className="hero-bold text-white position-relative" style={{ background: 'var(--primary)', borderBottom: '8px solid var(--secondary)' }}>
                    <div className="container position-relative">
                        <div className="row align-items-center">
                            <div className="col-lg-7 mb-5 mb-lg-0">
                                {data.logo && (
                                    <div className="mb-4">
                                        <img src={data.logo} alt={data.organization_name} className="img-fluid" style={{ maxHeight: '120px', filter: 'brightness(0) invert(1)' }} />
                                    </div>
                                )}
                                <h5 className="text-uppercase mb-4" style={{ letterSpacing: '4px', fontSize: '16px', color: 'var(--secondary)', fontWeight: 600 }}>
                                    {data.tag_line ? data.tag_line.toUpperCase() : 'SERVING OUR COMMUNITY'}
                                </h5>
                                <h1 className="display-1 mb-4" style={{ fontWeight: 700, lineHeight: 1.1 }}>
                                    {(data.organization_name || `${data.first_name} ${data.last_name}`).toUpperCase()}
                                </h1>
                                <div className="mb-4" style={{ width: '120px', height: '10px', background: 'var(--secondary)', border: '2px solid white' }}></div>
                                <p className="lead mb-5" style={{ lineHeight: 1.8, fontSize: '20px', fontWeight: 400 }}>
                                    {data.bio_text}
                                </p>
                                <div className="d-flex gap-3 flex-wrap">
                                    <button className="btn btn-light btn-lg px-5" style={{ border: '4px solid var(--secondary)', fontWeight: 600 }}>
                                        GET INVOLVED
                                    </button>
                                    <button className="btn btn-lg px-4" style={{ border: '4px solid var(--secondary)', backgroundColor: 'var(--secondary)', color: '#333', fontWeight: 600 }} onClick={() => document.getElementById('contact').scrollIntoView()}>
                                        CONTACT US
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-5 text-center">
                                {data.owner_photo && (
                                    <div className="p-4" style={{ border: '6px solid var(--secondary)', boxShadow: '15px 15px 0 rgba(0, 0, 0, 0.4)', background: 'transparent' }}>
                                        <img src={data.owner_photo} alt="Leader" className="img-fluid" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <section id="services" className="py-5 bg-primary-bold text-white position-relative" style={{ 
                    borderTop: '8px solid var(--secondary)', 
                    borderBottom: '8px solid var(--secondary)',
                    backgroundImage: data.background_picture ? `url(${data.background_picture})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: data.background_picture ? 'var(--primary)' : 'transparent',
                        opacity: data.background_picture ? 0.8 : 1,
                        zIndex: 0
                    }}></div>
                    <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
                        <div className="text-center mb-5">
                            <h2 className="display-3 mb-3 text-uppercase text-white" style={{ letterSpacing: '2px', fontWeight: 700 }}>
                                Our Services & Programs
                            </h2>
                            <div style={{ height: '10px', width: '200px', margin: '20px auto', background: 'var(--secondary)', border: '2px solid white' }}></div>
                        </div>
                        <div className="row g-0">
                            {[
                                { title: data.service_1, desc: data.service_1_desc, img: data.service_image_1 },
                                { title: data.service_2, desc: data.service_2_desc, img: data.service_image_2 },
                                { title: data.service_3, desc: data.service_3_desc, img: data.service_image_3 },
                            ].filter(s => s.title).map((service, idx) => {
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
                                                            {service.img ? (
                                                                <img src={service.img} alt={service.title} className="img-fluid" style={{ maxHeight: '300px', objectFit: 'contain', width: '100%' }} />
                                                            ) : (
                                                                <div>
                                                                    <i className="bi bi-heart" style={{ fontSize: '80px', opacity: 0.7, color: 'white' }}></i>
                                                                    <p className="mt-3 mb-0 fw-bold text-uppercase" style={{ letterSpacing: '1px', color: 'white' }}>Service</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-7 p-5 text-white">
                                                        <h3 className="mb-4 text-uppercase text-white" style={{ letterSpacing: '1px', fontSize: '2rem', borderBottom: '4px solid var(--secondary)', paddingBottom: '15px', fontWeight: 700 }}>{service.title}</h3>
                                                        <p className="mb-4 lead" style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>{service.desc || "We are committed to providing this valuable service to our community."}</p>
                                                        <button className="btn btn-lg" style={{ backgroundColor: 'var(--secondary)', color: '#333', border: '3px solid white', fontWeight: 600 }}>READ MORE</button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="col-md-7 p-5 text-white">
                                                        <h3 className="mb-4 text-uppercase text-white" style={{ letterSpacing: '1px', fontSize: '2rem', borderBottom: '4px solid var(--secondary)', paddingBottom: '15px', fontWeight: 700 }}>{service.title}</h3>
                                                        <p className="mb-4 lead" style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>{service.desc || "We are committed to providing this valuable service to our community."}</p>
                                                        <button className="btn btn-lg" style={{ backgroundColor: 'var(--secondary)', color: '#333', border: '3px solid white', fontWeight: 600 }}>READ MORE</button>
                                                    </div>
                                                    <div className="col-md-5 p-0">
                                                        <div 
                                                            className="text-center d-flex align-items-center justify-content-center"
                                                            style={{ minHeight: '300px', padding: '20px', background: 'transparent', border: '4px solid white' }}
                                                        >
                                                            {service.img ? (
                                                                <img src={service.img} alt={service.title} className="img-fluid" style={{ maxHeight: '300px', objectFit: 'contain', width: '100%' }} />
                                                            ) : (
                                                                <div>
                                                                    <i className="bi bi-heart" style={{ fontSize: '80px', opacity: 0.7, color: 'white' }}></i>
                                                                    <p className="mt-3 mb-0 fw-bold text-uppercase" style={{ letterSpacing: '1px', color: 'white' }}>Service</p>
                                                                </div>
                                                            )}
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

                <section id="contact" className="py-5 bg-secondary-bold" style={{ borderTop: `8px solid var(--primary)`, color: '#333' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="card card-bold p-5 bg-white text-dark" style={{ border: '6px solid var(--primary)', boxShadow: '15px 15px 0 rgba(0,0,0,0.3)' }}>
                                    <h2 className="text-center mb-4 text-uppercase" style={{ letterSpacing: '2px', color: 'var(--primary)', fontWeight: 700 }}>
                                        Get in Touch
                                    </h2>
                                    <div style={{ height: '8px', width: '150px', margin: '20px auto', background: 'var(--primary)' }}></div>
                                    <p className="text-center mb-4" style={{ fontWeight: 400 }}>
                                        Have a question? Want to volunteer? Send us a message.
                                    </p>
                                    <form>
                                        <div className="row mb-3">
                                            <div className="col-md-6 mb-3">
                                                <input type="text" className="form-control form-control-lg border-3 border-dark rounded-0" placeholder="FIRST NAME" style={{ fontWeight: 400 }} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <input type="text" className="form-control form-control-lg border-3 border-dark rounded-0" placeholder="LAST NAME" style={{ fontWeight: 400 }} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <input type="email" className="form-control form-control-lg border-3 border-dark rounded-0" placeholder="EMAIL ADDRESS" style={{ fontWeight: 400 }} />
                                        </div>
                                        <div className="mb-4">
                                            <textarea className="form-control form-control-lg border-3 border-dark rounded-0" rows="4" placeholder="YOUR MESSAGE" style={{ fontWeight: 400 }}></textarea>
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

                <footer className="bg-primary-bold text-white py-5" style={{ borderTop: `6px solid var(--primary)` }}>
                    <div className="container text-center">
                        <h4 className="mb-3 text-uppercase" style={{ letterSpacing: '2px', fontWeight: 700 }}>
                            {data.organization_name || `${data.first_name} ${data.last_name}`}
                        </h4>
                        <p className="text-white-50 mb-4" style={{ fontWeight: 400 }}>
                            {data.bio_text ? data.bio_text.substring(0, 100) + '...' : 'Serving our community with dedication and care.'}
                        </p>
                        <div className="d-flex justify-content-center gap-3 mb-4">
                            <a href="#" className="text-white"><i className="bi bi-facebook fs-4"></i></a>
                            <a href="#" className="text-white"><i className="bi bi-twitter fs-4"></i></a>
                            <a href="#" className="text-white"><i className="bi bi-instagram fs-4"></i></a>
                        </div>
                        <p className="small text-white-50 mb-0" style={{ fontWeight: 400 }}>&copy; 2025 All Rights Reserved.</p>
                    </div>
                </footer>
            </div>
        );
    };

    // Render template based on template_style and submission_type
    const isOrganization = data.submission_type === 'organization';
    
    if (isOrganization) {
        switch (templateStyle) {
            case 'traditional':
                return renderOrganizationTraditionalTemplate();
            case 'bold':
                return renderOrganizationBoldTemplate();
            case 'modern':
            default:
                return renderOrganizationModernTemplate();
        }
    } else {
        switch (templateStyle) {
            case 'traditional':
                return renderTraditionalTemplate();
            case 'bold':
                return renderBoldTemplate();
            case 'modern':
            default:
                return renderModernTemplate();
        }
    }
};

export default MirrorPage;
