import React, { useState } from 'react';
import { 
    Box, Button, TextField, Typography, Container, Paper, 
    Alert, CircularProgress, Fade, Avatar 
} from '@mui/material';
import api from '../store/api';
import { useNavigate } from 'react-router-dom';
import OtpDialog from '../components/Auth/OtpDialog';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const BRAND = {
    primary: '#eb4d4b',
    secondary: '#f0932b',
    bg: '#fffaf0',
    surface: '#ffffff',
    text: '#2d3436'
};

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/verify-email', { email });
            // If email is valid, send OTP
            await api.post('/auth/otp/send', { email });
            setShowOtpDialog(true);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || 'Email not found or error occurred';
            setError(typeof msg === 'string' ? msg : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSuccess = () => {
        setShowOtpDialog(false);
        navigate('/reset-password', { state: { email } });
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: BRAND.bg }}>
            <Container maxWidth="xs" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                <Fade in={true} timeout={800}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: BRAND.primary, width: 50, height: 50 }}>
                                <RestaurantIcon />
                            </Avatar>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: BRAND.text }}>
                                Forgot <span style={{ color: BRAND.primary }}>Password</span>
                            </Typography>
                        </Box>

                        <Paper elevation={0} sx={{ p: 5, width: '100%', borderRadius: 8, bgcolor: BRAND.surface }}>
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <EmailOutlinedIcon sx={{ fontSize: 40, color: BRAND.secondary, mb: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>Reset your password</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Enter your registered email address to proceed.
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 4 }}>{error}</Alert>}

                            <Box component="form" onSubmit={handleSubmit}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="filled"
                                    InputProps={{ disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f8f9fa' } }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{ 
                                        mt: 4, py: 1.8, borderRadius: 5, fontWeight: 800, textTransform: 'none',
                                        bgcolor: BRAND.primary, '&:hover': { bgcolor: '#d44646' }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Email'}
                                </Button>
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

export default ForgotPasswordPage;
