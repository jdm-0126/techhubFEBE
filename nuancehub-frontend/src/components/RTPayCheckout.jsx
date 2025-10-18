import React, { useState } from 'react';
import axios from 'axios';

export default function RTPayCheckout() {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    setStatus('');

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/rtpay/initiate`, {
        amount,
        currency: 'PHP',
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = res.data;

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        setStatus('Payment initiated: ' + JSON.stringify(data));
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md w-96 mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">RTPay Checkout</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="border border-gray-300 rounded p-2 w-full mb-3"
      />
      <button
        disabled={loading}
        onClick={handlePay}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>

      {status && (
        <p className="text-sm text-gray-700 mt-4 text-center break-all">{status}</p>
      )}
    </div>
  );
}