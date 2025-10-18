import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Avatar,
    useTheme,
    createTheme,
    ThemeProvider
} from '@mui/material';
import {
    Home,
    People,
    Assignment,
    TrendingUp,
    Person,
    Logout
} from '@mui/icons-material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    components: {
        MuiBottomNavigation: {
            styleOverrides: {
                root: {
                    height: 70,
                },
            },
        },
    },
});

export default function AppLayout({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                navigate('/login');
                return;
            }
            
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            localStorage.removeItem('auth_token');
            navigate('/login');
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            navigate('/login');
        }
    };



    const location = useLocation();
    const [bottomNavValue, setBottomNavValue] = useState(0);

    const navigationItems = [
        { label: 'Home', icon: Home, path: '/dashboard' },
        { label: 'Join', icon: People, path: '/invite-friends' },
        { label: 'Tasks', icon: Assignment, path: '/tasks' },
        { label: 'Profit', icon: TrendingUp, path: '/recharge' },
        { label: 'My', icon: Person, path: '/profile' }
    ];

    useEffect(() => {
        const currentIndex = navigationItems.findIndex(item => item.path === location.pathname);
        if (currentIndex !== -1) {
            setBottomNavValue(currentIndex);
        }
    }, [location.pathname]);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ 
                minHeight: '100vh',
                bgcolor: '#f5f5f5',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e0e0' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                pb: 9 // Bottom navigation height
            }}>
                {/* Top App Bar */}
                <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
                    <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}>
                        <Typography 
                            variant="h6" 
                            component={Link} 
                            to="/dashboard"
                            sx={{ 
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                color: 'primary.main',
                                fontSize: '1.25rem'
                            }}
                        >
                            NuanceTechHub
                        </Typography>
                        
                        <Box display="flex" alignItems="center" gap={1}>
                            {user && (
                                <>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        Hi, {user.name?.split(' ')[0]}
                                    </Typography>
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                                        {user.name?.charAt(0)}
                                    </Avatar>
                                </>
                            )}
                            <IconButton 
                                onClick={logout}
                                size="small"
                                sx={{ color: 'error.main' }}
                            >
                                <Logout fontSize="small" />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Main Content */}
                <Box sx={{ minHeight: 'calc(100vh - 64px - 70px)' }}>
                    {children}
                </Box>

                {/* Bottom Navigation */}
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={8}>
                    <BottomNavigation
                        value={bottomNavValue}
                        onChange={(event, newValue) => {
                            setBottomNavValue(newValue);
                            navigate(navigationItems[newValue].path);
                        }}
                        showLabels
                    >
                        {navigationItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <BottomNavigationAction
                                    key={index}
                                    label={item.label}
                                    icon={<IconComponent />}
                                    sx={{
                                        minWidth: 'auto',
                                        '&.Mui-selected': {
                                            color: 'primary.main',
                                        }
                                    }}
                                />
                            );
                        })}
                    </BottomNavigation>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}