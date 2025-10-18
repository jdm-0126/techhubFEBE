import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    Alert,
    Avatar,
    CircularProgress,
    Fade,
    Slide
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

export default function Login() {
    const [data, setData] = useState({ email: '', password: '', remember: false });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            localStorage.setItem('auth_token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error.response?.data);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrors({ email: [error.response.data.message] });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}
        >
            <Container maxWidth="sm">
                <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={800}>
                    <Paper
                        elevation={24}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                            <Avatar
                                sx={{
                                    m: 1,
                                    bgcolor: 'primary.main',
                                    width: 56,
                                    height: 56,
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)'
                                }}
                            >
                                <LockOutlined sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Typography component="h1" variant="h4" fontWeight="bold" color="primary">
                                Welcome Back
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                Sign in to your NuanceTechHub account
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
                            {Object.keys(errors).length > 0 && (
                                <Fade in={true}>
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {Object.values(errors).flat().join(', ')}
                                    </Alert>
                                </Fade>
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={data.email}
                                onChange={(e) => setData({...data, email: e.target.value})}
                                error={!!errors.email}
                                helperText={errors.email?.[0]}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData({...data, password: e.target.value})}
                                error={!!errors.password}
                                helperText={errors.password?.[0]}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                        checked={data.remember}
                                        onChange={(e) => setData({...data, remember: e.target.checked})}
                                    />
                                }
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={processing}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {processing ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                            <Box textAlign="center">
                                <Typography variant="body2">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        style={{
                                            color: '#667eea',
                                            textDecoration: 'none',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Sign up here
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Slide>
            </Container>
        </Box>
    );
}