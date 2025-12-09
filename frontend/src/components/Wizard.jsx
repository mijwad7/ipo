import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const Wizard = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        otp_code: '',
        otp_verified: false,

        pillar_1: '',
        pillar_1_desc: '',
        pillar_2: '',
        pillar_2_desc: '',
        pillar_3: '',
        pillar_3_desc: '',

        action_shot_1: null,
        action_shot_2: null,
        action_shot_3: null,

        template_style: 'modern',
        primary_color: '#0d6efd',
        secondary_color: '#6c757d',

        headshot: null,

        bio_text: '',
        donation_url: '',
        event_date: '',
    });

    const [otpSent, setOtpSent] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 800,
                useWebWorker: true,
            };
            try {
                const compressedFile = await imageCompression(file, options);
                // Create a new file object with the compressed blob to ensure it works with FormData
                // straightforward assignment often works, but explicit file creation is safer if metadata is lost
                const finalFile = new File([compressedFile], file.name, { type: file.type });
                setFormData(prev => ({ ...prev, [fieldName]: finalFile }));
            } catch (error) {
                console.log(error);
                alert('Image compression failed');
            }
        }
    };

    const sendOtp = async () => {
        try {
            await axios.post('/api/otp/send/', { phone: formData.phone });
            setOtpSent(true);
            alert('OTP Sent (Check Console for Stub)');
        } catch (error) {
            alert('Failed to send OTP');
        }
    };

    const verifyOtp = async () => {
        try {
            const res = await axios.post('/api/otp/verify/', { code: formData.otp_code });
            if (res.data.verified) {
                setFormData({ ...formData, otp_verified: true });
                setStep(2);
            }
        } catch (error) {
            alert('Invalid Code');
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (['headshot', 'action_shot_1', 'action_shot_2', 'action_shot_3'].includes(key)) {
                if (formData[key]) {
                    data.append(key, formData[key], formData[key].name);
                }
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            const res = await axios.post('/api/submissions/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLoading(false);
            navigate('/success', { state: { submission: res.data } });
        } catch (error) {
            setLoading(false);
            alert('Submission Failed: ' + JSON.stringify(error.response?.data || error.message));
        }
    };

    const PILLAR_OPTIONS = [
        "Lower Taxes", "Safer Streets", "Better Schools", "Community Safety",
        "Economic Growth", "Healthcare Access", "Support Seniors", "Youth Programs",
        "Infrastructure", "Environmental Protection", "Custom"
    ];

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4">Build Your Campaign HQ</h2>
            <div className="progress mb-4">
                <div className="progress-bar" role="progressbar" style={{ width: `${(step / 5) * 100}%` }}></div>
            </div>

            {loading && <div className="text-center"><h3>Building your HQ...</h3></div>}

            {!loading && (
                <>
                    {step === 1 && (
                        <div className="card p-4">
                            <h4>Step 1: Identity</h4>
                            <input name="first_name" className="form-control mb-2" placeholder="First Name" onChange={handleChange} />
                            <input name="last_name" className="form-control mb-2" placeholder="Last Name" onChange={handleChange} />
                            <input name="email" className="form-control mb-2" placeholder="Email" type="email" onChange={handleChange} />
                            <div className="d-flex gap-2">
                                <input name="phone" className="form-control mb-2" placeholder="Mobile Phone" onChange={handleChange} />
                                <button className="btn btn-secondary mb-2" onClick={sendOtp}>Send OTP</button>
                            </div>
                            {otpSent && (
                                <>
                                    <input name="otp_code" className="form-control mb-2" placeholder="Enter 4-digit Code" onChange={handleChange} />
                                    <button className="btn btn-primary" onClick={verifyOtp}>Verify</button>
                                </>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="card p-4">
                            <h4>Step 2: Pillars</h4>
                            <p>Select your top 3 priorities</p>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="mb-4 border p-3 rounded">
                                    <h5 className="mb-3">Pillar {i}</h5>

                                    <label className="form-label">Topic</label>
                                    <select className="form-control mb-2" name={`pillar_${i}`} onChange={handleChange} value={formData[`pillar_${i}`]}>
                                        <option value="">Select...</option>
                                        {PILLAR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                    {formData[`pillar_${i}`] === 'Custom' && (
                                        <input className="form-control mb-2" placeholder="Type custom pillar title" name={`pillar_${i}`} onChange={handleChange} />
                                    )}

                                    <label className="form-label">Description (Optional)</label>
                                    <textarea
                                        className="form-control mb-2"
                                        name={`pillar_${i}_desc`}
                                        placeholder={`Explain your stance on ${formData[`pillar_${i}`] || 'this topic'}...`}
                                        rows="3"
                                        onChange={handleChange}
                                        value={formData[`pillar_${i}_desc`]}
                                    ></textarea>

                                    <label className="form-label">Action Shot (Optional)</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, `action_shot_${i}`)}
                                    />
                                    {formData[`action_shot_${i}`] && <div className="text-success small mt-1">Image selected</div>}
                                </div>
                            ))}
                            <button className="btn btn-primary" onClick={() => setStep(3)}>Next</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="card p-4">
                            <h4>Step 3: Visuals</h4>
                            <label>Template Style</label>
                            <select className="form-control mb-3" name="template_style" onChange={handleChange}>
                                <option value="modern">Modern</option>
                                <option value="traditional">Traditional</option>
                                <option value="bold">Bold</option>
                            </select>

                            <label>Primary Color</label>
                            <input type="color" className="form-control form-control-color mb-3" name="primary_color" value={formData.primary_color} onChange={handleChange} />

                            <label>Secondary Color</label>
                            <input type="color" className="form-control form-control-color mb-3" name="secondary_color" value={formData.secondary_color} onChange={handleChange} />

                            <label>Headshot (Required)</label>
                            <input type="file" className="form-control mb-3" accept="image/*" onChange={(e) => handleImageUpload(e, 'headshot')} />

                            <button className="btn btn-primary" onClick={() => setStep(4)}>Next</button>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="card p-4">
                            <h4>Step 4: Campaign Details</h4>
                            <textarea name="bio_text" className="form-control mb-3" placeholder="Short Bio" onChange={handleChange}></textarea>
                            <input name="donation_url" className="form-control mb-3" placeholder="Donation URL (Optional)" onChange={handleChange} />
                            <input name="event_date" className="form-control mb-3" placeholder="Next Event Details (e.g. Rally on Dec 15)" onChange={handleChange} />
                            <button className="btn btn-success" onClick={() => setStep(5)}>Review & Launch</button>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="card p-4 text-center">
                            <h4>Ready to Launch?</h4>
                            <p>Creates instant temporary site.</p>
                            <button className="btn btn-lg btn-primary" onClick={handleSubmit}>Launch My HQ</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Wizard;
