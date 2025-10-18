import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from '../../layouts/PageLayout';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const requestData = {
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
                new_password_confirmation: passwordData.confirm_password
            };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/change-password`, requestData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage('Password updated successfully!');
            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
            setShowPasswordForm(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating password');
        }
        setLoading(false);
    };

    return (
        <PageLayout title="My Profile">
            <div className="space-y-4">
                {/* User Info Card */}
                <div className="card shadow-sm">
                    <div className="card-header bg-white">
                        <h5 className="mb-0">Profile Information</h5>
                    </div>
                    <div className="card-body">
                        {user ? (
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Name</label>
                                        <p className="fw-medium">{user.name}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Email</label>
                                        <p className="fw-medium">{user.email}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Balance</label>
                                        <p className="fw-medium text-success">₱{parseFloat(user.balance || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Member Since</label>
                                        <p className="fw-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Password Change Card */}
                <div className="card shadow-sm">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Security</h5>
                        {!showPasswordForm && (
                            <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setShowPasswordForm(true)}
                            >
                                Change Password
                            </button>
                        )}
                    </div>
                    <div className="card-body">
                        {showPasswordForm ? (
                            <form onSubmit={handlePasswordChange}>
                                <div className="mb-3">
                                    <label className="form-label">Current Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordData.confirm_password}
                                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                                        required
                                    />
                                </div>
                                {message && (
                                    <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                                        {message}
                                    </div>
                                )}
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                                            setMessage('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className="text-muted mb-0">Keep your account secure by using a strong password.</p>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}