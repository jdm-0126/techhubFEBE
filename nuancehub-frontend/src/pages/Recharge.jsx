import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PageLayout from '../layouts/PageLayout';

export default function Recharge() {
    const [amount, setAmount] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('rtpay');
    const [loading, setLoading] = useState(false);
    const [rechargeHistory, setRechargeHistory] = useState([]);
    const [balance, setBalance] = useState(0);

    const getQuickAmounts = () => {
        if (!selectedMethod) return [100, 500, 1000, 2000, 5000];
        
        const method = paymentMethods.find(m => m.id === selectedMethod);
        if (!method) return [100, 500, 1000, 2000, 5000];
        
        const amounts = [];
        const min = method.min_amount;
        const max = method.max_amount;
        
        // Generate appropriate quick amounts based on limits
        if (min <= 100 && max >= 100) amounts.push(100);
        if (min <= 500 && max >= 500) amounts.push(500);
        if (min <= 1000 && max >= 1000) amounts.push(1000);
        if (min <= 2000 && max >= 2000) amounts.push(2000);
        if (min <= 5000 && max >= 5000) amounts.push(5000);
        
        // If no standard amounts fit, create custom ones
        if (amounts.length === 0) {
            amounts.push(min);
            if (max >= min * 2) amounts.push(Math.floor(min * 2));
            if (max >= min * 5) amounts.push(Math.floor(min * 5));
            if (max >= min * 10) amounts.push(Math.floor(min * 10));
        }
        
        return amounts;
    };
    const paymentMethods = [
        { id: 'rtpay', name: 'RTPay', icon: 'bi-credit-card', min_amount: 50, max_amount: 50000 },
        { id: 'credit_card', name: 'Credit Card', icon: 'bi-credit-card-2-front', min_amount: 10, max_amount: 10000 },
        { id: 'paypal', name: 'PayPal', icon: 'bi-paypal', min_amount: 1, max_amount: 5000 },
        { id: 'stripe', name: 'Stripe', icon: 'bi-stripe', min_amount: 1, max_amount: 10000 }
    ];

    useEffect(() => {
        fetchRechargeHistory();
    }, []);

    const fetchRechargeHistory = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/recharge`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRechargeHistory(response.data.history || []);
            setBalance(response.data.balance || 0);
        } catch (error) {
            console.error('Failed to fetch recharge history:', error);
        }
    };

    const handleRecharge = async (e) => {
        e.preventDefault();
        
        const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);
        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }
        
        if (!amount || amount < selectedPaymentMethod.min_amount) {
            alert(`Minimum amount for ${selectedPaymentMethod.name} is ₱${selectedPaymentMethod.min_amount}`);
            return;
        }
        
        if (amount > selectedPaymentMethod.max_amount) {
            alert(`Maximum amount for ${selectedPaymentMethod.name} is ₱${selectedPaymentMethod.max_amount}`);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            console.log('Sending recharge request:', {
                amount: parseFloat(amount),
                payment_method: selectedMethod
            });
            
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/recharge/process`, {
                amount: parseFloat(amount),
                payment_method: selectedMethod
            }, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('Recharge response:', response.data);
            
            if (response.data.success) {
                alert('Recharge successful!');
                setAmount('');
                setSelectedMethod('');
                fetchRechargeHistory();
            } else if (response.data.payment_url) {
                window.location.href = response.data.payment_url;
            } else {
                alert('Recharge completed successfully!');
                setAmount('');
                setSelectedMethod('');
                fetchRechargeHistory();
            }
        } catch (error) {
            console.error('Recharge failed:', error);
            console.error('Error response:', error.response?.data);
            
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                'Recharge failed. Please try again.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout title="Recharge Wallet">
                {/* Current Balance Card */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body text-center py-4">
                        <h6 className="text-muted mb-2">Current Balance</h6>
                        <h2 className="text-success mb-0 fw-bold">₱{parseFloat(balance).toFixed(2)}</h2>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Recharge Form */}
                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white">
                                <h5 className="mb-0">Add Money to Wallet</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleRecharge}>
                                    {/* Amount Input - Top Priority */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold fs-5">Recharge Amount</label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text fs-4">₱</span>
                                            <input
                                                type="number"
                                                className="form-control fs-4 text-center"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0"
                                                min={selectedMethod ? paymentMethods.find(m => m.id === selectedMethod)?.min_amount || 1 : 1}
                                                max={selectedMethod ? paymentMethods.find(m => m.id === selectedMethod)?.max_amount || 50000 : 50000}
                                                required
                                                style={{fontWeight: 'bold'}}
                                            />
                                        </div>
                                        {selectedMethod && (
                                            <small className="text-muted">
                                                {(() => {
                                                    const method = paymentMethods.find(m => m.id === selectedMethod);
                                                    return `Limit: ₱${method?.min_amount} - ₱${method?.max_amount?.toLocaleString()}`;
                                                })()}
                                            </small>
                                        )}
                                    </div>

                                    {/* Quick Amount Buttons */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Quick Select</label>
                                        <div className="d-flex flex-wrap gap-1">
                                            {getQuickAmounts().map(quickAmount => (
                                                <button
                                                    key={quickAmount}
                                                    type="button"
                                                    className={`btn btn-outline-primary btn-sm ${
                                                        amount == quickAmount ? 'active' : ''
                                                    }`}
                                                    onClick={() => setAmount(quickAmount.toString())}
                                                >
                                                    ₱{quickAmount.toLocaleString()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Payment Method</label>
                                        <select 
                                            className="form-select form-select-lg"
                                            value={selectedMethod}
                                            onChange={(e) => setSelectedMethod(e.target.value)}
                                            required
                                        >
                                            <option value="">Select payment method</option>
                                            {paymentMethods.map(method => (
                                                <option key={method.id} value={method.id}>
                                                    {method.name} (₱{method.min_amount} - ₱{method.max_amount.toLocaleString()})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg w-100"
                                        disabled={loading || !amount}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            `Recharge ₱${amount || '0'}`
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Wealth Management */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white">
                                <h6 className="mb-0">Wealth Management</h6>
                            </div>
                            <div className="card-body">
                                {/* Stats Cards */}
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <div className="card bg-primary text-white">
                                            <div className="card-body p-2 text-center">
                                                <div className="fs-6 fw-bold">{rechargeHistory.length}</div>
                                                <small>Payments</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="card bg-success text-white">
                                            <div className="card-body p-2 text-center">
                                                <div className="fs-6 fw-bold">₱{rechargeHistory.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0).toLocaleString()}</div>
                                                <small>Amount</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="card bg-danger text-white">
                                            <div className="card-body p-2 text-center">
                                                <div className="fs-6 fw-bold">{rechargeHistory.filter(r => r.status === 'failed').length}</div>
                                                <small>Failed</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="card bg-info text-white">
                                            <div className="card-body p-2 text-center">
                                                <div className="fs-6 fw-bold">{rechargeHistory.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length}</div>
                                                <small>Today</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Transaction History */}
                                <h6 className="mb-2">Recent Transactions</h6>
                                {rechargeHistory.length > 0 ? (
                                    <div className="list-group list-group-flush">
                                        {rechargeHistory.slice(0, 5).map((recharge, index) => (
                                            <div key={index} className="list-group-item px-0 py-2 border-0">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div className="fw-semibold">₱{recharge.amount}</div>
                                                        <small className="text-muted">{new Date(recharge.created_at).toLocaleDateString()}</small>
                                                    </div>
                                                    <span className={`badge ${
                                                        recharge.status === 'completed' ? 'bg-success' :
                                                        recharge.status === 'pending' ? 'bg-warning text-dark' :
                                                        'bg-danger'
                                                    }`}>
                                                        {recharge.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-3">
                                        <i className="bi-wallet text-muted" style={{fontSize: '1.5rem'}}></i>
                                        <p className="text-muted mt-2 mb-0 small">No transactions yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
        </PageLayout>
    );
}