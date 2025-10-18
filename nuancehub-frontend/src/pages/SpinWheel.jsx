import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from '../layouts/PageLayout';

export default function SpinWheel() {
    const [gameData, setGameData] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [rotation, setRotation] = useState(0);

    const prizes = [
        { name: '₱5', color: '#ff6b6b', value: 5 },
        { name: '₱10', color: '#4ecdc4', value: 10 },
        { name: '₱25', color: '#e74c3c', value: 25 },
        { name: '₱50', color: '#96ceb4', value: 50 },
        { name: '₱100', color: '#feca57', value: 100 },
        { name: 'Try Again', color: '#ff9ff3', value: 0 }
    ];

    useEffect(() => {
        fetchGameData();
    }, []);

    const fetchGameData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/spin-wheel`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            });
            setGameData(response.data);
        } catch (error) {
            console.error('Failed to fetch game data:', error);
        }
    };

    const handleSpin = async () => {
        setError(null);
        setResult(null);
        setSpinning(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/spin-wheel/spin`, {}, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            });
            
            // Animate wheel spin
            const spins = 5 + Math.random() * 5; // 5-10 full rotations
            const finalRotation = rotation + (spins * 360) + (Math.random() * 360);
            setRotation(finalRotation);
            
            setTimeout(() => {
                setResult(response.data.prize);
                setSpinning(false);
                fetchGameData(); // Refresh balance and profit
            }, 3000);
            
        } catch (e) {
            setError(e.response?.data?.error || 'Spin failed');
            setSpinning(false);
        }
    };

    const canSpin = gameData && gameData.balance >= (gameData.spinCost || 5);

    return (
        <PageLayout title="Spin the Wheel">
            <div className="p-3">
                {/* Stats Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-4">
                        <div className="card text-center">
                            <div className="card-body p-3">
                                <h6 className="text-success mb-1">₱{gameData?.balance || '0.00'}</h6>
                                <small className="text-muted">Balance</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="card text-center">
                            <div className="card-body p-3">
                                <h6 className="text-primary mb-1">₱{gameData?.spinProfit || '0.00'}</h6>
                                <small className="text-muted">Profit</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="card text-center">
                            <div className="card-body p-3">
                                <h6 className="text-warning mb-1">₱{gameData?.spinCost || '5'}</h6>
                                <small className="text-muted">Cost</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spin Wheel */}
                <div className="card shadow-sm">
                    <div className="card-body text-center p-4">
                        {error && (
                            <div className="alert alert-danger mb-4">{error}</div>
                        )}
                        
                        {result && (
                            <div className="alert alert-success mb-4">
                                <h5 className="mb-1">🎉 You Won!</h5>
                                <p className="mb-0">{result.name} - ₱{result.value}</p>
                            </div>
                        )}

                        {/* Wheel Container */}
                        <div className="position-relative d-inline-block mb-4">
                            {/* Pointer - Aligned with red segment */}
                            <div className="position-absolute" style={{
                                top: '-5px',
                                left: '65%',
                                transform: 'translateX(-50%)',
                                zIndex: 10
                            }}>
                                <div style={{
                                    width: 0,
                                    height: 0,
                                    borderLeft: '12px solid transparent',
                                    borderRight: '12px solid transparent',
                                    borderTop: '25px solid #dc3545',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                }}></div>
                            </div>
                            
                            {/* Wheel */}
                            <div 
                                className="rounded-circle border border-3 border-dark"
                                style={{
                                    width: '280px',
                                    height: '280px',
                                    transform: `rotate(${rotation}deg)`,
                                    transition: spinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
                                    background: `conic-gradient(
                                        ${prizes.map((prize, i) => 
                                            `${prize.color} ${i * 60}deg ${(i + 1) * 60}deg`
                                        ).join(', ')}
                                    )`,
                                    position: 'relative',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                                }}
                            >
                                {/* Prize Labels - Properly aligned */}
                                {prizes.map((prize, i) => {
                                    const segmentAngle = 60; // Each segment is 60 degrees
                                    const startAngle = i * segmentAngle;
                                    const centerAngle = startAngle + (segmentAngle / 2); // Center of segment
                                    const radian = (centerAngle * Math.PI) / 180;
                                    const radius = 100; // Distance from center
                                    const x = 140 + Math.cos(radian) * radius;
                                    const y = 140 + Math.sin(radian) * radius;
                                    
                                    return (
                                        <div
                                            key={i}
                                            className="position-absolute fw-bold text-white d-flex align-items-center justify-content-center"
                                            style={{
                                                left: `${x}px`,
                                                top: `${y}px`,
                                                transform: `translate(-50%, -50%) rotate(${centerAngle}deg)`,
                                                fontSize: '13px',
                                                textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                                                width: '50px',
                                                height: '25px',
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {prize.name}
                                        </div>
                                    );
                                })}
                                
                                {/* Center circle */}
                                <div className="position-absolute top-50 start-50 translate-middle rounded-circle bg-dark border border-3 border-white" style={{
                                    width: '40px',
                                    height: '40px',
                                    zIndex: 5
                                }}></div>
                            </div>
                        </div>

                        <button
                            onClick={handleSpin}
                            disabled={spinning || !canSpin}
                            className="btn btn-warning btn-lg px-5"
                        >
                            {spinning ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Spinning...
                                </>
                            ) : !canSpin ? (
                                'Insufficient Balance'
                            ) : (
                                `SPIN - ₱${gameData?.spinCost || '5'}`
                            )}
                        </button>
                        
                        {!canSpin && gameData && (
                            <p className="text-muted mt-2 mb-0">
                                Need ₱{gameData.spinCost || 5} to spin. <a href="/recharge">Recharge now</a>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}