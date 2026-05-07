import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { registerUser, selectIsAuthenticated, selectAuthLoading } from '../store/authSlice';
import { 
    Box, Button, TextField, Typography, Container, CircularProgress, 
    Alert, Paper, Fade, Stack, Avatar, InputAdornment, IconButton 
} from '@mui/material';
import Header from '../components/Layout/Header';
import OtpDialog from '../components/Auth/OtpDialog';
import api from '../store/api';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Branding Palette from "Foody" Reference
const BRAND = {
    primary: '#eb4d4b',    // Coral Red
    secondary: '#f0932b',  // Golden Orange
    bg: '#fffaf0',         // Soft Cream
    surface: '#ffffff',
    text: '#2d3436'
};

const RegistrationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // Redirect if already logged in
        }
    }, [isAuthenticated, navigate]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setValidationError("Passwords do not match.");
            return;
        }
        if (!fullName || !email || !password) {
            setValidationError("All fields are required.");
            return;
        }
        if (password.length < 8 || password.length > 16) {
            setValidationError("Password must be between 8 and 16 characters long.");
            return;
        }
        setValidationError('');
        setOtpLoading(true);
        try {
            await api.post('/auth/otp/send', { email });
            setShowOtpDialog(true);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || "Failed to send OTP.";
            setValidationError(typeof msg === 'string' ? msg : "An error occurred while sending OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleRegistration = () => {
        setShowOtpDialog(false);
        dispatch(registerUser({ fullName, email, password }));
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
                                Yummy-Tummy<span style={{ color: BRAND.primary }}></span>
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
                                    <PersonAddAlt1Icon sx={{ color: BRAND.secondary }} />
                                    <Typography component="h1" variant="h5" sx={{ fontWeight: 800, color: BRAND.text }}>
                                        Create Account
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                    Start your journey with delicious food
                                </Typography>
                            </Box>
                            
                            {validationError && (
                                <Alert 
                                    severity="warning" 
                                    variant="filled" 
                                    sx={{ mb: 3, borderRadius: 4, backgroundColor: BRAND.secondary, color: '#fff', '& .MuiAlert-icon': { color: '#fff' } }}
                                >
                                    {validationError}
                                </Alert>
                            )}

                            <Box component="form" onSubmit={handleSendOtp} noValidate>
                                <Stack spacing={2.5}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="fullName"
                                        label="Full Name"
                                        name="fullName"
                                        autoComplete="name"
                                        autoFocus
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        variant="filled"
                                        InputProps={{
                                            disableUnderline: true,
                                            sx: { borderRadius: 4, backgroundColor: '#f8f9fa' }
                                        }}
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
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
                                        autoComplete="new-password"
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
                                    <TextField
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    disabled={isLoading || otpLoading}
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
                                    {isLoading || otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                                </Button>

                                <Box textAlign="center">
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        Already have an account? 
                                        <RouterLink 
                                            to="/login" 
                                            style={{ 
                                                textDecoration: 'none', 
                                                color: BRAND.secondary, 
                                                fontWeight: 800,
                                                marginLeft: '6px'
                                            }}
                                        >
                                            Sign In
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
                onSuccess={handleRegistration} 
                onClose={() => setShowOtpDialog(false)} 
            />
        </Box>
    );
};

export default RegistrationPage;
