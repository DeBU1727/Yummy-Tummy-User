import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginUser, selectIsAuthenticated, selectAuthLoading, selectAuthError } from '../store/authSlice';
import { 
    Box, Button, TextField, Typography, Container, CircularProgress, 
    Alert, Paper, Fade, Stack, Avatar, InputAdornment, IconButton 
} from '@mui/material';
import Header from '../components/Layout/Header';
import OtpDialog from '../components/Auth/OtpDialog';
import api from '../store/api';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Branding Palette from Reference
const BRAND = {
    primary: '#eb4d4b',    // Coral Red
    secondary: '#f0932b',  // Golden Orange
    bg: '#fffaf0',         // Soft Cream
    surface: '#ffffff',
    text: '#2d3436'
};

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);
    const authError = useSelector(selectAuthError);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            setFailedAttempts(0); // Reset on success
            navigate('/'); // Redirect if already logged in
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // First attempt login
            const response = await api.post('/auth/login', { email, password });
            
            // Handle success responses
            if (response.status === 200) {
                dispatch({ type: 'auth/loginSuccess', payload: response.data.token });
                navigate('/');
            } else if (response.status === 202) {
                // OTP REQUIRED
                setShowOtpDialog(true);
            }
        } catch (err) {
            // Axios still throws for 4xx/5xx
            if (err.response?.status === 202) {
                // Some configs might still throw on 202, handle just in case
                setShowOtpDialog(true);
            } else {
                const msg = err.response?.data?.message || err.response?.data || "Invalid email or password";
                setError(typeof msg === 'string' ? msg : "An error occurred during login");
                setFailedAttempts(prev => prev + 1);
            }
        }
    };

    const handleOtpSuccess = () => {
        setShowOtpDialog(false);
        // Retry login now that OTP is verified
        dispatch(loginUser({ email, password }));
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: BRAND.bg }}>
            <Header />
            
            <Container maxWidth="xs" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                <Fade in={true} timeout={1000}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        
                        {/* Branding Header */}
                        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: BRAND.primary, width: 50, height: 50, boxShadow: '0 4px 15px rgba(235, 77, 75, 0.3)' }}>
                                <RestaurantIcon fontSize="medium" />
                            </Avatar>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: BRAND.text, letterSpacing: '-1px' }}>
                                Yummy-Tummy <span style={{ color: BRAND.primary }}></span>
                            </Typography>
                        </Box>

                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: { xs: 4, sm: 5 }, 
                                width: '100%', 
                                borderRadius: 8, 
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                                backgroundColor: BRAND.surface,
                                border: '1px solid rgba(0,0,0,0.02)'
                            }}
                        >
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                    <LockOutlinedIcon sx={{ color: BRAND.secondary }} />
                                    <Typography component="h1" variant="h5" sx={{ fontWeight: 800, color: BRAND.text }}>
                                        Welcome Back
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                    Sign in to continue your delicious journey
                                </Typography>
                            </Box>

                            {(error || authError) && (
                                <Alert 
                                    severity="error" 
                                    variant="filled"
                                    sx={{ mb: 3, borderRadius: 4, bgcolor: BRAND.primary, '& .MuiAlert-icon': { color: '#fff' } }}
                                >
                                    {error || authError}
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <Stack spacing={2.5}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        variant="filled"
                                        InputProps={{
                                            disableUnderline: true,
                                            sx: { borderRadius: 4, backgroundColor: '#f8f9fa' }
                                        }}
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        variant="filled"
                                        InputProps={{
                                            disableUnderline: true,
                                            sx: { borderRadius: 4, backgroundColor: '#f8f9fa' },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                        sx={{ color: 'text.secondary' }}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Stack>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={isLoading}
                                    sx={{ 
                                        mt: 4, 
                                        mb: 3, 
                                        py: 1.8, 
                                        fontWeight: 800, 
                                        borderRadius: 5,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        backgroundColor: BRAND.primary,
                                        boxShadow: '0 10px 20px rgba(235, 77, 75, 0.3)',
                                        '&:hover': {
                                            backgroundColor: '#d44646',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 25px rgba(235, 77, 75, 0.4)'
                                        },
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                                </Button>

                                <Box textAlign="center">
                                    {failedAttempts >= 3 && (
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            <RouterLink 
                                                to="/forgot-password" 
                                                style={{ color: BRAND.primary, fontWeight: 700, textDecoration: 'none' }}
                                            >
                                                Forgot Password?
                                            </RouterLink>
                                        </Typography>
                                    )}
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Don't have an account? 
                                        <RouterLink 
                                            to="/register" 
                                            style={{ 
                                                textDecoration: 'none', 
                                                color: BRAND.secondary, 
                                                fontWeight: 800,
                                                marginLeft: '6px'
                                            }}
                                        >
                                            Sign Up
                                        </RouterLink>
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Fade>
            </Container>

            <OtpDialog 
                open={showOtpDialog} 
                email={email} 
                onSuccess={handleOtpSuccess} 
                onClose={() => setShowOtpDialog(false)} 
            />
        </Box>
    );
};

export default LoginPage;