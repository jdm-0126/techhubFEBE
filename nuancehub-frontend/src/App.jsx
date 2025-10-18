import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SpinWheel from './pages/SpinWheel';
import Recharge from './pages/Recharge';
import Withdrawal from './pages/Withdrawal';
import Tasks from './pages/Tasks';
import InviteFriends from './pages/InviteFriends';
import Commercials from './pages/commercials/Index';
import WatchCommercial from './pages/commercials/Watch';
import Profile from './pages/profile/Edit';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCommercials from './pages/admin/Commercials';
import AdminSpinWheel from './pages/admin/SpinWheel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/spin-wheel" element={<SpinWheel />} />
        <Route path="/recharge" element={<Recharge />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/invite-friends" element={<InviteFriends />} />
        <Route path="/commercials" element={<Commercials />} />
        <Route path="/commercials/:id" element={<WatchCommercial />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/commercials" element={<AdminCommercials />} />
        <Route path="/admin/spin-wheel" element={<AdminSpinWheel />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;