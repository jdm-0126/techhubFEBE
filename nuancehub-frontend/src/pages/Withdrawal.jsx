import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from '../layouts/PageLayout';

export default function Withdrawal() {
    const [amount, setAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [withdrawalMethods, setWithdrawalMethods] = useState([]);
    const [withdrawalHistory, setWithdrawalHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddMethod, setShowAddMethod] = useState(false);
    const [newMethod, setNewMethod] = useState({ type: 'bank', details: '' });
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        fetchWithdrawalData();
    }, []);

    const fetchWithdrawalData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/withdrawal`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setWithdrawalMethods(response.data.methods || []);
            setWithdrawalHistory(response.data.history || []);
            setBalance(response.data.balance || 0);
        } catch (error) {
            console.error('Failed to fetch withdrawal data:', error);
        }
    };

    const handleWithdrawal = async (e) => {
        e.preventDefault();
        if (!amount || amount < 100) {
            alert('Minimum withdrawal amount is ₱100');
            return;
        }
        if (amount > balance) {
            alert('Insufficient balance');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/withdrawal/request`, {
                amount: parseFloat(amount),
                method_id: selectedMethod
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            alert('Withdrawal request submitted successfully!');
            setAmount('');
            setSelectedMethod('');
            fetchWithdrawalData();
        } catch (error) {
            console.error('Withdrawal failed:', error);
            alert('Withdrawal failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMethod = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/withdrawal/add-method`, newMethod, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setShowAddMethod(false);
            setNewMethod({ type: 'bank', details: '' });
            fetchWithdrawalData();
        } catch (error) {
            console.error('Failed to add method:', error);
            alert('Failed to add withdrawal method');
        }
    };

    return (
        <PageLayout title="Withdraw Funds">

                {/* Balance Card */}
                <div className="card bg-primary text-white mb-4">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="card-subtitle mb-2 text-white-50">Available Balance</h6>
                                <h3 className="card-title mb-0">₱{balance.toLocaleString()}</h3>
                            </div>
                            <i className="bi-wallet2 fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Withdrawal Form */}
                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white">
                                <h5 className="mb-0">Request Withdrawal</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleWithdrawal}>
                                    {/* Amount Input */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Withdrawal Amount</label>
                                        <div className="input-group">
                                            <span className="input-group-text">₱</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="Enter amount"
                                                min="100"
                                                max={balance}
                                                required
                                            />
                                        </div>
                                        <small className="text-muted">Minimum: ₱100 | Available: ₱{balance.toLocaleString()}</small>
                                    </div>

                                    {/* Withdrawal Methods */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <label className="form-label fw-semibold mb-0">Withdrawal Method</label>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => setShowAddMethod(true)}
                                            >
                                                <i className="bi-plus me-1"></i>Add Method
                                            </button>
                                        </div>
                                        
                                        {withdrawalMethods.length > 0 ? (
                                            <div className="row g-3">
                                                {withdrawalMethods.map(method => (
                                                    <div key={method.id} className="col-md-6">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="withdrawalMethod"
                                                                id={`method-${method.id}`}
                                                                value={method.id}
                                                                checked={selectedMethod == method.id}
                                                                onChange={(e) => setSelectedMethod(e.target.value)}
                                                            />
                                                            <label className="form-check-label w-100" htmlFor={`method-${method.id}`}>
                                                                <div className="card border">
                                                                    <div className="card-body p-3">
                                                                        <div className="d-flex align-items-center">
                                                                            <i className={`bi-${method.type === 'bank' ? 'bank' : 'phone'} fs-4 text-primary me-3`}></i>
                                                                            <div>
                                                                                <div className="fw-semibold">{method.type.toUpperCase()}</div>
                                                                                <small className="text-muted">{method.details}</small>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 border rounded">
                                                <i className="bi-credit-card text-muted fs-1 mb-3"></i>
                                                <p className="text-muted mb-3">No withdrawal methods added</p>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => setShowAddMethod(true)}
                                                >
                                                    Add Withdrawal Method
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-danger btn-lg w-100"
                                        disabled={loading || !amount || !selectedMethod}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            `Withdraw ₱${amount || '0'}`
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Withdrawal History */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white">
                                <h6 className="mb-0">Recent Withdrawals</h6>
                            </div>
                            <div className="card-body p-0">
                                {withdrawalHistory.length > 0 ? (
                                    <div className="list-group list-group-flush">
                                        {withdrawalHistory.slice(0, 5).map((withdrawal, index) => (
                                            <div key={index} className="list-group-item px-3 py-3">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div className="fw-semibold">₱{withdrawal.amount}</div>
                                                        <small className="text-muted">{new Date(withdrawal.created_at).toLocaleDateString()}</small>
                                                    </div>
                                                    <span className={`badge ${
                                                        withdrawal.status === 'completed' ? 'bg-success' :
                                                        withdrawal.status === 'pending' ? 'bg-warning text-dark' :
                                                        'bg-danger'
                                                    }`}>
                                                        {withdrawal.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <i className="bi-arrow-down-circle text-muted" style={{fontSize: '2rem'}}></i>
                                        <p className="text-muted mt-2 mb-0">No withdrawal history</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Method Modal */}
                {showAddMethod && (
                    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Withdrawal Method</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowAddMethod(false)}
                                    ></button>
                                </div>
                                <form onSubmit={handleAddMethod}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Method Type</label>
                                            <select
                                                className="form-select"
                                                value={newMethod.type}
                                                onChange={(e) => setNewMethod({...newMethod, type: e.target.value})}
                                            >
                                                <option value="bank">Bank Account</option>
                                                <option value="gcash">GCash</option>
                                                <option value="paymaya">PayMaya</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Account Details</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newMethod.details}
                                                onChange={(e) => setNewMethod({...newMethod, details: e.target.value})}
                                                placeholder="Enter account number or details"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowAddMethod(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Add Method
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