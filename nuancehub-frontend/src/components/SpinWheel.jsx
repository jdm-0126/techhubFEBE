import React, { useState } from 'react';
import axios from 'axios';

export default function SpinWheel({ prizes, hasSpun }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSpin = async () => {
    if (hasSpun) {
      setError('You have already used your spin.');
      return;
    }
    setError(null);
    setSpinning(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/spin-wheel/spin`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = res.data;
      setResult(data);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.error || 'Spin failed');
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      {result ? (
        <div className="text-green-600">Congrats! You {result.status}! Prize: {result.prize}</div>
      ) : (
        <div>
          <div id="wheel-container">
            <p>Wheel will appear here with prizes:</p>
            <ul>
              {prizes?.map((p, i) => (
                <li key={i}>{p.name}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {spinning ? 'Spinning...' : 'Spin'}
          </button>
        </div>
      )}
    </div>
  );
}