import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from '../../layouts/PageLayout';

export default function AdminSpinWheel() {
    const [settings, setSettings] = useState({
        spin_duration: 24,
        spin_cost: 5,
        prizes: []
    });
    const [loading, setLoading] = useState(true);
    const [newPrize, setNewPrize] = useState({ name: '', probability: '', reward_type: 'coins', reward_value: '' });

    useEffect(() => {
        fetchSpinWheelSettings();
    }, []);

    const fetchSpinWheelSettings = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/spin-wheel`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSettings(response.data.settings || { spin_duration: 24, spin_cost: 5, prizes: [] });
        } catch (error) {
            console.error('Failed to fetch spin wheel settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/spin-wheel/settings`, {
                duration: settings.spin_duration,
                cost: settings.spin_cost
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Failed to update settings:', error);
            alert('Failed to update settings.');
        }
    };

    const addPrize = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/spin-wheel/prizes`, newPrize, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNewPrize({ name: '', probability: '', reward_type: 'coins', reward_value: '' });
            fetchSpinWheelSettings();
            alert('Prize added successfully!');
        } catch (error) {
            console.error('Failed to add prize:', error);
            alert('Failed to add prize.');
        }
    };

    const deletePrize = async (prizeId) => {
        if (!confirm('Are you sure you want to delete this prize?')) return;
        
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/spin-wheel/prizes/${prizeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchSpinWheelSettings();
            alert('Prize deleted successfully!');
        } catch (error) {
            console.error('Failed to delete prize:', error);
            alert('Failed to delete prize.');
        }
    };

    const resetAllSpins = async () => {
        if (!confirm('Are you sure you want to reset all user spins? This will allow all users to spin again.')) return;
        
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/spin-wheel/reset`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('All user spins have been reset!');
        } catch (error) {
            console.error('Failed to reset spins:', error);
            alert('Failed to reset spins.');
        }
    };

    if (loading) {
        return (
            <PageLayout title="Spin Wheel Settings">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Spin Wheel Settings">
            <div className="row g-4">
                {/* Duration Settings */}
                <div className="col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Spin Wheel Settings</h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Spin Cooldown (Hours)</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={settings.spin_duration}
                                        onChange={(e) => setSettings({...settings, spin_duration: parseInt(e.target.value)})}
                                        min="1"
                                        max="168"
                                    />
                                    <span className="input-group-text">hours</span>
                                </div>
                                <small className="text-muted">How long users must wait between spins (1-168 hours)</small>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Spin Cost (₱)</label>
                                <div className="input-group">
                                    <span className="input-group-text">₱</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={settings.spin_cost}
                                        onChange={(e) => setSettings({...settings, spin_cost: parseFloat(e.target.value)})}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <small className="text-muted">Cost per spin for users</small>
                            </div>
                            <button 
                                className="btn btn-primary me-2"
                                onClick={updateSettings}
                            >
                                Update Settings
                            </button>
                            <button 
                                className="btn btn-warning"
                                onClick={resetAllSpins}
                            >
                                Reset All Spins
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add Prize */}
                <div className="col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Add New Prize</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={addPrize}>
                                <div className="mb-3">
                                    <label className="form-label">Prize Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newPrize.name}
                                        onChange={(e) => setNewPrize({...newPrize, name: e.target.value})}
                                        placeholder="e.g., 100 Coins, Free Spin, etc."
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Probability (%)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newPrize.probability}
                                        onChange={(e) => setNewPrize({...newPrize, probability: e.target.value})}
                                        min="0.1"
                                        max="100"
                                        step="0.1"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Reward Type</label>
                                    <select
                                        className="form-select"
                                        value={newPrize.reward_type}
                                        onChange={(e) => setNewPrize({...newPrize, reward_type: e.target.value})}
                                    >
                                        <option value="coins">Coins</option>
                                        <option value="cash">Cash</option>
                                        <option value="free_spin">Free Spin</option>
                                        <option value="bonus">Bonus</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Reward Value</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newPrize.reward_value}
                                        onChange={(e) => setNewPrize({...newPrize, reward_value: e.target.value})}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-success w-100">
                                    <i className="bi-plus me-1"></i>Add Prize
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Prizes */}
            <div className="card shadow-sm mt-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Current Prizes</h5>
                </div>
                <div className="card-body p-0">
                    {settings.prizes && settings.prizes.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Prize Name</th>
                                        <th>Probability</th>
                                        <th>Reward Type</th>
                                        <th>Reward Value</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {settings.prizes.map(prize => (
                                        <tr key={prize.id}>
                                            <td className="fw-semibold">{prize.name}</td>
                                            <td>{prize.probability}%</td>
                                            <td>
                                                <span className={`badge ${
                                                    prize.reward_type === 'cash' ? 'bg-success' :
                                                    prize.reward_type === 'coins' ? 'bg-warning text-dark' :
                                                    prize.reward_type === 'free_spin' ? 'bg-primary' :
                                                    'bg-info'
                                                }`}>
                                                    {prize.reward_type.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td>{prize.reward_value}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deletePrize(prize.id)}
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
                            <i className="bi-gift text-muted" style={{fontSize: '3rem'}}></i>
                            <h5 className="mt-3 mb-2">No Prizes</h5>
                            <p className="text-muted">Add prizes to make the spin wheel more exciting!</p>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}