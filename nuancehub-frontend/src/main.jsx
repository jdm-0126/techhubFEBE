import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import RTPayCheckout from './components/RTPayCheckout.jsx';
import SpinWheel from './components/SpinWheel.jsx';
import './index.css';

// Main app
const appRoot = document.getElementById('root');
if (appRoot) {
  ReactDOM.createRoot(appRoot).render(<App />);
}

// RTPay Checkout standalone
const checkoutRoot = document.getElementById('rtpay-checkout');
if (checkoutRoot) {
  ReactDOM.createRoot(checkoutRoot).render(<RTPayCheckout />);
}

// Spin Wheel standalone
const spinWheelRoot = document.getElementById('spin-wheel-root');
if (spinWheelRoot) {
  const prizes = JSON.parse(spinWheelRoot.dataset.prizes || '[]');
  const hasSpun = JSON.parse(spinWheelRoot.dataset.hasSpun || 'false');
  ReactDOM.createRoot(spinWheelRoot).render(<SpinWheel prizes={prizes} hasSpun={hasSpun} />);
}