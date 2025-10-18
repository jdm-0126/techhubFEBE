import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AppLayout from '../layouts/AppLayout';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({});


    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            
            // Fetch user data
            const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, { headers });
            setUser(userResponse.data);
            
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`, { headers });
            setStats(response.data.stats || {});

        } catch (error) {
            console.log('Dashboard data not available:', error.message);
        }
    };

    const getDashboardCards = () => {
        const baseCards = [
            { name: 'Profile', icon: 'bi-person-circle', route: '/profile', color: 'bg-green-500' },
            { name: 'Tasks', icon: 'bi-list-check', route: '/tasks', color: 'bg-indigo-500' },
            { name: 'Recharge', icon: 'bi-plus-circle', route: '/recharge', color: 'bg-emerald-500' },
            { name: 'Withdrawal', icon: 'bi-arrow-down-circle', route: '/withdrawal', color: 'bg-red-500' },
            { name: 'Invite Friends', icon: 'bi-people', route: '/invite-friends', color: 'bg-yellow-500' },
            { name: 'Spin Wheel', icon: 'bi-arrow-clockwise', route: '/spin-wheel', color: 'bg-pink-500' },
            { name: 'Video Tutorial', icon: 'bi-play-circle', route: '/commercials', color: 'bg-orange-500' },
            { name: 'Wealth Management', icon: 'bi-graph-up', route: '/dashboard', color: 'bg-teal-500' }
        ];
        
        // Add Admin card for superadmin users
        if (user?.is_admin) {
            baseCards.push({ name: 'Admin Panel', icon: 'bi-gear-fill', route: '/admin', color: 'bg-gray-600' });
        }
        
        return baseCards;
    };





    return (
        <AppLayout>
            <div className="p-3 p-md-4">
                {/* Dashboard Icons - 3x3 Grid */}
                <div className="row g-3 mb-4">
                    {getDashboardCards().map((item, index) => {
                        const colorMap = {
                            'bg-green-500': 'success',
                            'bg-indigo-500': 'primary', 
                            'bg-emerald-500': 'success',
                            'bg-red-500': 'danger',
                            'bg-yellow-500': 'warning',
                            'bg-pink-500': 'danger',
                            'bg-orange-500': 'warning',
                            'bg-teal-500': 'info',
                            'bg-gray-600': 'secondary'
                        };
                        const bootstrapColor = colorMap[item.color] || 'primary';
                        
                        return (
                            <div key={index} className="col-4">
                                <Link to={item.route} className="text-decoration-none">
                                    <div className="text-center p-3">
                                        <div className={`bg-${bootstrapColor} rounded-circle d-flex align-items-center justify-content-center mb-2 mx-auto`} 
                                             style={{width: '60px', height: '60px'}}>
                                            <i className={`${item.icon} text-white fs-3`}></i>
                                        </div>
                                        <small className="text-dark fw-medium d-block">{item.name}</small>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>


            </div>
        </AppLayout>
    );
}