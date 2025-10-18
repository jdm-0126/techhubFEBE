import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Grid,
    Chip,
    Avatar,
    IconButton,
    CircularProgress,
    Alert,
    Container,
    Paper,
    Fade,
    Grow,
    AppBar,
    Toolbar
} from '@mui/material';
import {
    PlayArrow,
    CheckCircle,
    Assignment,
    VideoLibrary,
    Smartphone,
    Download,
    Visibility,
    TrendingUp,
    EmojiEvents,
    ArrowBack
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StatsCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
    },
}));

const VideoCard = styled(Card)(({ theme }) => ({
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: theme.shadows[8],
    },
}));

const AppCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[6],
    },
}));

export default function Tasks() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [commercials, setCommercials] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [completingTask, setCompletingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTasks(response.data.tasks || []);
            setCommercials(response.data.commercials || []);
            setStats({
                totalTasks: response.data.totalAvailableTasks || 0,
                completedTasks: response.data.completedTasksCount || 0,
                totalRewards: response.data.totalEarned || 0
            });
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const completeTask = async (taskId) => {
        setCompletingTask(taskId);
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/complete`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            alert('Task completed! Reward added to your wallet.');
            // Refresh data to get updated stats
            fetchTasks();
        } catch (error) {
            console.error('Failed to complete task:', error);
            alert('Failed to complete task. Please try again.');
        } finally {
            setCompletingTask(null);
        }
    };

    const getTaskIcon = (type) => {
        switch (type) {
            case 'daily_login': return 'bi-calendar-check';
            case 'watch_video': return 'bi-play-circle';
            case 'invite_friend': return 'bi-people';
            case 'complete_profile': return 'bi-person-check';
            case 'first_recharge': return 'bi-plus-circle';
            default: return 'bi-check-circle';
        }
    };

    const getTaskColor = (type) => {
        switch (type) {
            case 'daily_login': return 'primary';
            case 'watch_video': return 'warning';
            case 'invite_friend': return 'success';
            case 'complete_profile': return 'info';
            case 'first_recharge': return 'danger';
            default: return 'secondary';
        }
    };

    if (loading) {
        return (
            <Box>
                <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary' }}>
                    <Toolbar>
                        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" fontWeight="bold">
                            Tasks & Rewards
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <Box textAlign="center">
                        <CircularProgress size={60} />
                        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                            Loading tasks...
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }

    const completedTasks = tasks.filter(task => task.is_completed);
    const pendingTasks = tasks.filter(task => !task.is_completed);

    const statsData = [
        { title: 'Total Tasks', value: stats.totalTasks || 0, icon: Assignment, color: '#1976d2' },
        { title: 'Completed', value: stats.completedTasks || 0, icon: CheckCircle, color: '#2e7d32' },
        { title: 'Total Rewards', value: `₱${(stats.totalRewards || 0).toFixed(2)}`, icon: EmojiEvents, color: '#ed6c02' }
    ];

    return (
        <Box>
            <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary' }}>
                <Toolbar>
                    <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" fontWeight="bold">
                        Tasks & Rewards
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 2 }}>
            {/* Stats Cards - Mobile Optimized */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {statsData.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <Grid item xs={4} key={index}>
                            <Paper 
                                elevation={2}
                                sx={{
                                    p: 1.5,
                                    textAlign: 'center',
                                    background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                                    border: `1px solid ${stat.color}30`,
                                    borderRadius: 2
                                }}
                            >
                                <IconComponent sx={{ color: stat.color, fontSize: 24, mb: 0.5 }} />
                                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem', mb: 0.5 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    {stat.title}
                                </Typography>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Videos Section - Mobile Optimized */}
            <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: '8px 8px 0 0' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <VideoLibrary fontSize="small" />
                        <Typography variant="h6" fontWeight="bold">
                            Videos
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ p: 2 }}>
                    {commercials.length > 0 ? (
                        <Grid container spacing={2} justifyContent="center">
                            {commercials.map((commercial, index) => (
                                <Grid item xs={6} sm={4} md={3} key={commercial.id}>
                                    <VideoCard sx={{ height: '100%' }}>
                                        <Box position="relative">
                                            <CardMedia
                                                component="img"
                                                height="120"
                                                image={`https://img.youtube.com/vi/${commercial.youtube_id}/hqdefault.jpg`}
                                                alt={commercial.title}
                                            />
                                            <Box
                                                position="absolute"
                                                top="50%"
                                                left="50%"
                                                sx={{ transform: 'translate(-50%, -50%)' }}
                                            >
                                                <IconButton
                                                    component="a"
                                                    href={`/commercials/${commercial.id}`}
                                                    sx={{
                                                        bgcolor: 'rgba(0,0,0,0.7)',
                                                        color: 'white',
                                                        width: 40,
                                                        height: 40
                                                    }}
                                                >
                                                    <PlayArrow />
                                                </IconButton>
                                            </Box>
                                            <Box position="absolute" top={4} right={4}>
                                                <Chip
                                                    label={`₱${commercial.reward_amount}`}
                                                    color="success"
                                                    size="small"
                                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                                />
                                            </Box>
                                            {commercial.has_viewed && (
                                                <Box position="absolute" top={4} left={4}>
                                                    <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                                                </Box>
                                            )}
                                        </Box>
                                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                            <Typography variant="body2" fontWeight="bold" noWrap sx={{ mb: 0.5 }}>
                                                {commercial.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                                {commercial.brand_name}
                                            </Typography>
                                        </CardContent>
                                    </VideoCard>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box textAlign="center" py={4}>
                            <VideoLibrary sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body1" gutterBottom>
                                No Videos Available
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Check back later!
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Social Media Apps - Mobile Optimized */}
            <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white', borderRadius: '8px 8px 0 0' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Smartphone fontSize="small" />
                        <Typography variant="h6" fontWeight="bold">
                            Social Apps
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ p: 2 }}>
                    <Grid container spacing={1.5}>
                        {[
                            { name: 'TikTok', reward: 25, color: '#ff0050', url: 'https://www.tiktok.com/download' },
                            { name: 'Instagram', reward: 20, color: '#E4405F', url: 'https://www.instagram.com/download' },
                            { name: 'Facebook', reward: 15, color: '#1877F2', url: 'https://www.facebook.com/mobile' },
                            { name: 'Twitter/X', reward: 18, color: '#1DA1F2', url: 'https://twitter.com/download' },
                            { name: 'YouTube', reward: 22, color: '#FF0000', url: 'https://www.youtube.com/premium' },
                            { name: 'Telegram', reward: 12, color: '#0088cc', url: 'https://telegram.org/apps' }
                        ].map((app, index) => (
                            <Grid item xs={6} key={index}>
                                <AppCard sx={{ height: '100%' }}>
                                    <CardContent sx={{ p: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: app.color,
                                                width: 40,
                                                height: 40,
                                                mx: 'auto',
                                                mb: 1,
                                                fontSize: '1rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {app.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                                            {app.name}
                                        </Typography>
                                        <Chip
                                            label={`₱${app.reward}`}
                                            color="success"
                                            size="small"
                                            sx={{ mb: 1.5, fontSize: '0.7rem', height: 20 }}
                                        />
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Download fontSize="small" />}
                                            fullWidth
                                            href={app.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ fontSize: '0.75rem', py: 0.5 }}
                                        >
                                            Download
                                        </Button>
                                    </CardContent>
                                </AppCard>
                            </Grid>
                        ))}
                    </Grid>
                    <Alert severity="info" sx={{ mt: 2, fontSize: '0.8rem' }}>
                        <Typography variant="body2" fontSize="inherit">
                            <strong>How it works:</strong> Download, create account, use for 5 minutes to earn!
                        </Typography>
                    </Alert>
                </Box>
            </Paper>
            </Box>
        </Box>
    );
}