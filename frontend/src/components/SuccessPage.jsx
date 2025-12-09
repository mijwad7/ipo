import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const SuccessPage = () => {
    const location = useLocation();
    const submission = location.state?.submission;

    if (!submission) return <div className="container mt-5">No submission data found.</div>;

    const tempUrl = `/temp/${submission.slug}`;

    return (
        <div className="container text-center mt-5">
            <div className="card p-5 shadow">
                <h1 className="text-success mb-4">Your Campaign is Live!</h1>
                <p className="lead">Your instant headquarters has been generated.</p>

                <div className="my-4">
                    <Link to={tempUrl} className="btn btn-primary btn-lg px-5">
                        View My Site
                    </Link>
                </div>

                <p className="text-muted small">
                    Share this link: <br />
                    <code>{window.location.origin}{tempUrl}</code>
                </p>

                <div className="alert alert-info mt-4">
                    Check your SMS for login credentials to your permanent dashboard (arriving in ~5 mins).
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
