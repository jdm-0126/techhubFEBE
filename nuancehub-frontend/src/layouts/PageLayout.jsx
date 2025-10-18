import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from './AppLayout';

export default function PageLayout({ children, title, showBackButton = true }) {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <AppLayout>
            <div className="p-3 p-md-4">
                {showBackButton && (
                    <div className="d-flex align-items-center mb-4">
                        <button 
                            className="btn btn-outline-secondary btn-sm me-3"
                            onClick={handleBack}
                        >
                            <i className="bi-arrow-left me-1"></i>
                            Back
                        </button>
                        {title && <h2 className="mb-0 fw-bold">{title}</h2>}
                    </div>
                )}
                {children}
            </div>
        </AppLayout>
    );
}