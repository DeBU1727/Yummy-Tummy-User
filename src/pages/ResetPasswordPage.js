import React, { useState, useEffect } from 'react';
import { 
    Box, Button, TextField, Typography, Container, Paper, 
    Alert, CircularProgress, Fade, Stack, InputAdornment, IconButton 
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate, useLocation } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const BRAND = {
    primary: '#eb4d4b',
    secondary: '#f0932b',
    bg: '#fffaf0',
    surface: '#ffffff',
    text: '#2d3436'
};

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const isValidLength = password.length >= 8 && password.length <= 16;
    const isMatch = password === confirmPassword && password !== '' && isValidLength;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isMatch) return;

        setLoading(true);
        setError('');

        try {
            await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { email, password });
            setSuccess('Password changed successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError('Failed to update password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: BRAND.bg }}>
            <Container maxWidth="xs" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                <Fade in={true} timeout={800}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Paper elevation={0} sx={{ p: 5, width: '100%', borderRadius: 8, bgcolor: BRAND.surface }}>
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <LockResetIcon sx={{ fontSize: 50, color: BRAND.primary, mb: 1 }} />
                                <Typography variant="h5" sx={{ fontWeight: 900 }}>Set New Password</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Create a secure password for <b>{email}</b>
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 4 }}>{error}</Alert>}
                            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 4 }}>{success}</Alert>}

                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={2.5}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="New Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        variant="filled"
                                        error={password !== '' && !isValidLength}
                                        helperText={password !== '' && !isValidLength ? "Password must be 8-16 characters long" : ""}
                                        InputProps={{ 
                                            disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f8f9fa' },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <TextField
                                        required
                                        fullWidth
                                        label="Confirm New Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        variant="filled"
                                        error={confirmPassword !== '' && password !== confirmPassword}
                                        helperText={confirmPassword !== '' && password !== confirmPassword ? "Passwords do not match" : ""}
                                        InputProps={{ 
                                            disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f8f9fa' },
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Stack>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading || !isMatch}
                                    sx={{ 
                                        mt: 4, py: 1.8, borderRadius: 5, fontWeight: 800, textTransform: 'none',
                                        bgcolor: BRAND.primary, '&:hover': { bgcolor: '#d44646' },
                                        '&:disabled': { bgcolor: '#ccc' }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default ResetPasswordPage;