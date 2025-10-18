import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PageLayout from '../../layouts/PageLayout';

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const fetchAdminStats = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStats(response.data.stats || {});
        } catch (error) {
            console.error('Failed to fetch admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const adminCards = [
        { name: 'Manage Commercials', icon: 'bi-play-circle', route: '/admin/commercials', color: 'warning', description: 'Add, edit, and manage video commercials' },
        { name: 'Spin Wheel Settings', icon: 'bi-arrow-clockwise', route: '/admin/spin-wheel', color: 'primary', description: 'Configure spin wheel prizes and duration' },
        { name: 'User Management', icon: 'bi-people', route: '/admin/users', color: 'success', description: 'Manage user accounts and permissions' },
        { name: 'System Settings', icon: 'bi-gear', route: '/admin/settings', color: 'secondary', description: 'Configure system-wide settings' },
        { name: 'Reports', icon: 'bi-graph-up', route: '/admin/reports', color: 'info', description: 'View analytics and reports' },
        { name: 'Tasks Management', icon: 'bi-list-check', route: '/admin/tasks', color: 'danger', description: 'Create and manage user tasks' }
    ];

    if (loading) {
        return (
            <PageLayout title="Admin Dashboard">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-3">Loading admin dashboard...</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Admin Dashboard">
            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-subtitle mb-2 text-white-50">Total Users</h6>
                                    <h3 className="card-title mb-0">{stats.total_users || 0}</h3>
                                </div>
                                <i className="bi-people fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-subtitle mb-2 text-white-50">Active Commercials</h6>
                                    <h3 className="card-title mb-0">{stats.active_commercials || 0}</h3>
                                </div>
                                <i className="bi-play-circle fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-dark">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-subtitle mb-2">Total Tasks</h6>
                                    <h3 className="card-title mb-0">{stats.total_tasks || 0}</h3>
                                </div>
                                <i className="bi-list-check fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-info text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-subtitle mb-2 text-white-50">System Status</h6>
                                    <h3 className="card-title mb-0">Online</h3>
                                </div>
                                <i className="bi-check-circle fs-1 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Management Cards */}
            <div className="row g-4">
                {adminCards.map((card, index) => (
                    <div key={index} className="col-md-6 col-lg-4">
                        <Link to={card.route} className="text-decoration-none">
                            <div className="card h-100 shadow-sm border-0" 
                                 style={{transition: 'all 0.3s ease'}}>
                                <div className="card-body text-center p-4">
                                    <div className={`bg-${card.color} rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} 
                                         style={{width: '60px', height: '60px'}}>
                                        <i className={`${card.icon} text-white fs-3`}></i>
                                    </div>
                                    <h5 className="card-title text-dark mb-2">{card.name}</h5>
                                    <p className="card-text text-muted small">{card.description}</p>
                                </div>
                                <div className="card-footer bg-transparent border-0 text-center">
                                    <small className="text-muted">
                                        <i className="bi-arrow-right me-1"></i>
                                        Manage
                                    </small>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </PageLayout>
    );
}