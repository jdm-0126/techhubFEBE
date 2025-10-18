import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from '../../layouts/PageLayout';

export default function Commercials() {
    const [commercials, setCommercials] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [watchingVideo, setWatchingVideo] = useState(null);
    const [viewingVideo, setViewingVideo] = useState(null);
    const [resetting, setResetting] = useState(false);

    useEffect(() => {
        fetchUser();
        fetchCommercials();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    const fetchCommercials = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/commercials`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCommercials(response.data.commercials || []);
        } catch (error) {
            console.error('Failed to fetch commercials:', error);
        } finally {
            setLoading(false);
        }
    };

    const watchCommercial = async (commercialId) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/commercials/${commercialId}/watch`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setViewingVideo(response.data.commercial);
        } catch (error) {
            console.error('Failed to load commercial:', error);
            alert('Failed to load video. Please try again.');
        }
    };

    const markAsViewed = async (commercialId) => {
        setWatchingVideo(commercialId);
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/commercials/${commercialId}/viewed`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Update commercial status locally
            setCommercials(commercials.map(commercial => 
                commercial.id === commercialId 
                    ? { ...commercial, has_viewed: true }
                    : commercial
            ));
            
            setViewingVideo(null);
            alert('Video completed! Reward added to your wallet.');
        } catch (error) {
            console.error('Failed to mark as viewed:', error);
            alert('Failed to complete video. Please try again.');
        } finally {
            setWatchingVideo(null);
        }
    };

    const resetMyViews = async () => {
        if (!user?.is_admin) return;
        
        setResetting(true);
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/commercials/reset-user-views`, {
                user_id: user.id
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            alert('Your video views have been reset!');
            fetchCommercials();
        } catch (error) {
            console.error('Failed to reset views:', error);
            alert('Failed to reset views. Please try again.');
        } finally {
            setResetting(false);
        }
    };

    if (loading) {
        return (
            <PageLayout title="Video Tutorials">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-3">Loading videos...</p>
                </div>
            </PageLayout>
        );
    }

    const availableVideos = commercials.filter(c => c.is_active && !c.has_viewed);
    const watchedVideos = commercials.filter(c => c.has_viewed);
    const totalEarned = watchedVideos.reduce((sum, c) => sum + parseFloat(c.reward_amount || 0), 0);

    return (
        <PageLayout title="Video Tutorials">

                {/* Admin Reset Button */}
                {user?.is_admin && (
                    <div className="mb-3">
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={resetMyViews}
                            disabled={resetting}
                        >
                            {resetting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Resetting...
                                </>
                            ) : (
                                <>
                                    <i className="bi-arrow-clockwise me-1"></i>
                                    Reset My Views
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card bg-primary text-white">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="card-subtitle mb-2 text-white-50">Available Videos</h6>
                                        <h3 className="card-title mb-0">{availableVideos.length}</h3>
                                    </div>
                                    <i className="bi-play-circle fs-1 opacity-50"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-success text-white">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="card-subtitle mb-2 text-white-50">Watched</h6>
                                        <h3 className="card-title mb-0">{watchedVideos.length}</h3>
                                    </div>
                                    <i className="bi-check-circle fs-1 opacity-50"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-warning text-dark">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="card-subtitle mb-2">Total Earned</h6>
                                        <h3 className="card-title mb-0">₱{totalEarned.toFixed(2)}</h3>
                                    </div>
                                    <i className="bi-currency-dollar fs-1 opacity-50"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Videos */}
                {availableVideos.length > 0 && (
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Watch & Earn</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="row g-0">
                                {availableVideos.map(commercial => (
                                    <div key={commercial.id} className="col-md-6 col-lg-4">
                                        <div className="card border-0 h-100">
                                            <div className="position-relative">
                                                <img
                                                    src={commercial.thumbnail_url || `https://img.youtube.com/vi/${commercial.youtube_id}/hqdefault.jpg`}
                                                    className="card-img-top"
                                                    alt={commercial.title}
                                                    style={{height: '200px', objectFit: 'cover'}}
                                                />
                                                <div className="position-absolute top-50 start-50 translate-middle">
                                                    <button
                                                        className="btn btn-primary btn-lg rounded-circle"
                                                        onClick={() => watchCommercial(commercial.id)}
                                                        style={{width: '60px', height: '60px'}}
                                                    >
                                                        <i className="bi-play-fill fs-4"></i>
                                                    </button>
                                                </div>
                                                <div className="position-absolute top-0 end-0 m-2">
                                                    <span className="badge bg-success">₱{commercial.reward_amount}</span>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <h6 className="card-title">{commercial.title}</h6>
                                                <p className="card-text text-muted small">{commercial.description}</p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small className="text-muted">{commercial.brand_name}</small>
                                                    <small className="text-muted">
                                                        <i className="bi-eye me-1"></i>
                                                        {commercial.total_views} views
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Watched Videos */}
                {watchedVideos.length > 0 && (
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Completed Videos</h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="list-group list-group-flush">
                                {watchedVideos.map(commercial => (
                                    <div key={commercial.id} className="list-group-item px-4 py-3 bg-light">
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={commercial.thumbnail_url || `https://img.youtube.com/vi/${commercial.youtube_id}/hqdefault.jpg`}
                                                alt={commercial.title}
                                                className="rounded me-3"
                                                style={{width: '80px', height: '60px', objectFit: 'cover'}}
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1 text-muted">{commercial.title}</h6>
                                                <small className="text-muted">{commercial.brand_name}</small>
                                            </div>
                                            <div className="text-end">
                                                <span className="badge bg-success mb-1">₱{commercial.reward_amount}</span>
                                                <br />
                                                <i className="bi-check-circle text-success me-1"></i>
                                                <small className="text-muted">Completed</small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* No Videos */}
                {commercials.length === 0 && (
                    <div className="card shadow-sm">
                        <div className="card-body text-center py-5">
                            <i className="bi-play-circle text-muted" style={{fontSize: '3rem'}}></i>
                            <h5 className="mt-3 mb-2">No Videos Available</h5>
                            <p className="text-muted">Check back later for new video tutorials and rewards!</p>
                        </div>
                    </div>
                )}

                {/* Video Modal */}
                {viewingVideo && (
                    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{viewingVideo.title}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setViewingVideo(null)}
                                    ></button>
                                </div>
                                <div className="modal-body p-0">
                                    <div className="ratio ratio-16x9">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${viewingVideo.youtube_id}?autoplay=1`}
                                            title={viewingVideo.title}
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <div className="me-auto">
                                        <span className="badge bg-success fs-6">₱{viewingVideo.reward_amount} Reward</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setViewingVideo(null)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => markAsViewed(viewingVideo.id)}
                                        disabled={watchingVideo === viewingVideo.id}
                                    >
                                        {watchingVideo === viewingVideo.id ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Completing...
                                            </>
                                        ) : (
                                            'Mark as Watched'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </PageLayout>
    );
}