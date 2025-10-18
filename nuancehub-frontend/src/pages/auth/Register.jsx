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
    Alert,
    Avatar,
    CircularProgress,
    Fade,
    Slide,
    Grid
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';

const Register = () => {
    const [data, setData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, data);
            localStorage.setItem('auth_token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
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
                                    bgcolor: 'secondary.main',
                                    width: 56,
                                    height: 56,
                                    background: 'linear-gradient(45deg, #764ba2, #667eea)'
                                }}
                            >
                                <PersonAdd sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Typography component="h1" variant="h4" fontWeight="bold" color="primary">
                                Join NuanceTechHub
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                Create your account and start earning
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
                                id="name"
                                label="Full Name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                value={data.name}
                                onChange={(e) => setData({...data, name: e.target.value})}
                                error={!!errors.name}
                                helperText={errors.name?.[0]}
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
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
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
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
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
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password_confirmation"
                                        label="Confirm Password"
                                        type="password"
                                        id="password_confirmation"
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData({...data, password_confirmation: e.target.value})}
                                        error={!!errors.password_confirmation}
                                        helperText={errors.password_confirmation?.[0]}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
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
                                    background: 'linear-gradient(45deg, #764ba2, #667eea)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #6a4190, #5a6fd8)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(118, 75, 162, 0.4)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {processing ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                            <Box textAlign="center">
                                <Typography variant="body2">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        style={{
                                            color: '#764ba2',
                                            textDecoration: 'none',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Sign in here
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
export default Register;