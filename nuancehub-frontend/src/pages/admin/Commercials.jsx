import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from '../../layouts/PageLayout';

export default function AdminCommercials() {
    const [commercials, setCommercials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCommercial, setEditingCommercial] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        youtube_url: '',
        brand_name: '',
        description: '',
        reward_amount: '',
        is_active: true
    });

    useEffect(() => {
        fetchCommercials();
    }, []);

    const fetchCommercials = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/commercials`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCommercials(response.data.commercials || []);
        } catch (error) {
            console.error('Failed to fetch commercials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            if (editingCommercial) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/commercials/${editingCommercial.id}`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/commercials`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            
            setShowModal(false);
            setEditingCommercial(null);
            setFormData({ title: '', youtube_url: '', brand_name: '', description: '', reward_amount: '', is_active: true });
            fetchCommercials();
            alert('Commercial saved successfully!');
        } catch (error) {
            console.error('Failed to save commercial:', error);
            alert('Failed to save commercial. Please try again.');
        }
    };

    const handleEdit = (commercial) => {
        setEditingCommercial(commercial);
        setFormData({
            title: commercial.title,
            youtube_url: commercial.youtube_url,
            brand_name: commercial.brand_name,
            description: commercial.description,
            reward_amount: commercial.reward_amount,
            is_active: commercial.is_active
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this commercial?')) return;
        
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/commercials/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchCommercials();
            alert('Commercial deleted successfully!');
        } catch (error) {
            console.error('Failed to delete commercial:', error);
            alert('Failed to delete commercial.');
        }
    };

    const resetViews = async () => {
        if (!confirm('Are you sure you want to reset all commercial views?')) return;
        
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/commercials/reset-views`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('All commercial views have been reset!');
        } catch (error) {
            console.error('Failed to reset views:', error);
            alert('Failed to reset views.');
        }
    };

    if (loading) {
        return (
            <PageLayout title="Manage Commercials">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Manage Commercials">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <button 
                        className="btn btn-primary me-2"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi-plus me-1"></i>Add Commercial
                    </button>
                    <button 
                        className="btn btn-warning"
                        onClick={resetViews}
                    >
                        <i className="bi-arrow-clockwise me-1"></i>Reset All Views
                    </button>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body p-0">
                    {commercials.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Title</th>
                                        <th>Brand</th>
                                        <th>Reward</th>
                                        <th>Views</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commercials.map(commercial => (
                                        <tr key={commercial.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img 
                                                        src={commercial.thumbnail_url || `https://img.youtube.com/vi/${commercial.youtube_id}/hqdefault.jpg`}
                                                        alt={commercial.title}
                                                        className="rounded me-3"
                                                        style={{width: '60px', height: '45px', objectFit: 'cover'}}
                                                    />
                                                    <div>
                                                        <div className="fw-semibold">{commercial.title}</div>
                                                        <small className="text-muted">{commercial.description}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{commercial.brand_name}</td>
                                            <td>₱{commercial.reward_amount}</td>
                                            <td>{commercial.total_views}</td>
                                            <td>
                                                <span className={`badge ${commercial.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                    {commercial.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-1"
                                                    onClick={() => handleEdit(commercial)}
                                                >
                                                    <i className="bi-pencil"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(commercial.id)}
                                                >
                                                    <i className="bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="bi-play-circle text-muted" style={{fontSize: '3rem'}}></i>
                            <h5 className="mt-3 mb-2">No Commercials</h5>
                            <p className="text-muted">Add your first commercial to get started.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingCommercial ? 'Edit Commercial' : 'Add Commercial'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingCommercial(null);
                                        setFormData({ title: '', youtube_url: '', brand_name: '', description: '', reward_amount: '', is_active: true });
                                    }}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">YouTube URL</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            value={formData.youtube_url}
                                            onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Brand Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.brand_name}
                                            onChange={(e) => setFormData({...formData, brand_name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Reward Amount (₱)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={formData.reward_amount}
                                            onChange={(e) => setFormData({...formData, reward_amount: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                            />
                                            <label className="form-check-label">
                                                Active
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingCommercial(null);
                                            setFormData({ title: '', youtube_url: '', brand_name: '', description: '', reward_amount: '', is_active: true });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingCommercial ? 'Update' : 'Add'} Commercial
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}