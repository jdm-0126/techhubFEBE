import React from 'react';
import ReactDOM from 'react-dom/client';
import SpinWheel from './components/SpinWheel.jsx';
import './index.css';

const root = document.getElementById('spin-wheel-root');
const prizes = JSON.parse(root.dataset.prizes || '[]');
const hasSpun = JSON.parse(root.dataset.hasSpun || 'false');

ReactDOM.createRoot(root).render(<SpinWheel prizes={prizes} hasSpun={hasSpun} />);