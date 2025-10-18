import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageLayout from '../../layouts/PageLayout';

export default function WatchCommercial() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [commercial, setCommercial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);

    useEffect(() => {
        fetchCommercial();
    }, [id]);

    const fetchCommercial = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/commercials/${id}/watch`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCommercial(response.data);
        } catch (error) {
            console.error('Failed to fetch commercial:', error);
            navigate('/tasks');
        } finally {
            setLoading(false);
        }
    };

    const markAsViewed = async () => {
        setMarking(true);
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/commercials/${id}/viewed`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(`Congratulations! You earned ₱${commercial.reward_amount}`);
            navigate('/tasks');
        } catch (error) {
            console.error('Failed to mark as viewed:', error);
            alert('Failed to mark video as watched. Please try again.');
        } finally {
            setMarking(false);
        }
    };

    if (loading) {
        return (
            <PageLayout title="Loading Video...">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (!commercial) {
        return (
            <PageLayout title="Video Not Found">
                <div className="text-center py-5">
                    <h5>Video not found</h5>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/tasks')}>
                        Back to Tasks
                    </button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={commercial.title}>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="ratio ratio-16x9 mb-3">
                                <iframe
                                    src={`https://www.youtube.com/embed/${commercial.youtube_id}?autoplay=1`}
                                    title={commercial.title}
                                    allowFullScreen
                                    allow="autoplay"
                                ></iframe>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <h4 className="mb-3">{commercial.title}</h4>
                            <p className="text-muted mb-3">{commercial.description}</p>
                            
                            <div className="mb-3">
                                <small className="text-muted">Brand:</small>
                                <p className="fw-medium">{commercial.brand_name}</p>
                            </div>
                            
                            <div className="mb-3">
                                <small className="text-muted">Reward:</small>
                                <p className="fw-medium text-success">₱{commercial.reward_amount}</p>
                            </div>
                            
                            <div className="mb-4">
                                <small className="text-muted">Total Views:</small>
                                <p className="fw-medium">{commercial.total_views}</p>
                            </div>
                            
                            {!commercial.has_viewed && (
                                <button 
                                    className="btn btn-success w-100 mb-3"
                                    onClick={markAsViewed}
                                    disabled={marking}
                                >
                                    {marking ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi-check-circle me-2"></i>
                                            Mark as Watched & Earn ₱{commercial.reward_amount}
                                        </>
                                    )}
                                </button>
                            )}
                            
                            {commercial.has_viewed && (
                                <div className="alert alert-success">
                                    <i className="bi-check-circle me-2"></i>
                                    Already watched and rewarded!
                                </div>
                            )}
                            
                            <button 
                                className="btn btn-outline-primary w-100"
                                onClick={() => navigate('/tasks')}
                            >
                                <i className="bi-arrow-left me-2"></i>
                                Back to Tasks
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}