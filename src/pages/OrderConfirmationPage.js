import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, Paper, Fade, Avatar, Stack, Divider, useTheme, useMediaQuery } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Header from '../components/Layout/Header';

// Branding Palette
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  surface: '#ffffff',
  text: '#2d3436',
  success: '#22c55e',    // Mint Green
  successBg: '#ebfbee'   // Light Mint
};

const OrderConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const orderId = location.state?.orderId;

    React.useEffect(() => {
        // Prevent going back using browser's back button
        window.history.pushState(null, document.title, window.location.href);
        const handlePopState = (event) => {
            window.history.pushState(null, document.title, window.location.href);
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // Step Visual Component
    const OrderStep = ({ icon, label, active }) => (
        <Stack alignItems="center" spacing={1} sx={{ opacity: active ? 1 : 0.4 }}>
            <Avatar 
                sx={{ 
                    bgcolor: active ? BRAND.successBg : 'rgba(0,0,0,0.05)', 
                    color: active ? BRAND.success : 'text.disabled',
                    width: 45, 
                    height: 45,
                    border: active ? `2px solid ${BRAND.success}` : '2px solid transparent'
                }}
            >
                {icon}
            </Avatar>
            <Typography variant="caption" sx={{ fontWeight: 800, color: active ? BRAND.text : 'text.disabled' }}>
                {label}
            </Typography>
        </Stack>
    );

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: BRAND.bg, 
            display: 'flex',
            flexDirection: 'column', // Fixed the layout bug (was default row)
            backgroundImage: `
                radial-gradient(circle at 10% 20%, rgba(240, 147, 43, 0.04) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(235, 77, 75, 0.04) 0%, transparent 40%)
            `,
            pb: 8
        }}>
            <Header />
            
            <Container maxWidth="sm" sx={{ mt: { xs: 4, md: 8 }, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Fade in={true} timeout={1000}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: { xs: 3, md: 6 }, 
                            textAlign: 'center',
                            borderRadius: { xs: 6, md: 8 },
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.12)',
                            border: '1px solid rgba(255,255,255,0.8)',
                            position: 'relative',
                            overflow: 'hidden',
                            width: '100%'
                        }}
                    >
                        {/* Decorative background circle */}
                        <Box sx={{ 
                            position: 'absolute', 
                            top: -50, 
                            right: -50, 
                            width: 150, 
                            height: 150, 
                            borderRadius: '50%', 
                            bgcolor: 'rgba(235, 77, 75, 0.03)' 
                        }} />

                        <Stack alignItems="center" spacing={4}>
                            
                            <Box sx={{ position: 'relative' }}>
                                <Avatar 
                                    sx={{ 
                                        bgcolor: BRAND.successBg, 
                                        color: BRAND.success,
                                        width: 100, 
                                        height: 100, 
                                        boxShadow: '0 15px 35px rgba(34, 197, 94, 0.25)',
                                        animation: 'pulse 2s infinite'
                                    }}
                                >
                                    <CheckCircleOutlineIcon sx={{ fontSize: 60 }} />
                                </Avatar>
                                <style>{`
                                    @keyframes pulse {
                                        0% { transform: scale(1); box-shadow: 0 15px 35px rgba(34, 197, 94, 0.25); }
                                        50% { transform: scale(1.05); box-shadow: 0 20px 45px rgba(34, 197, 94, 0.35); }
                                        100% { transform: scale(1); box-shadow: 0 15px 35px rgba(34, 197, 94, 0.25); }
                                    }
                                `}</style>
                            </Box>

                            <Box>
                                <Typography 
                                    variant={isMobile ? "h4" : "h3"} 
                                    sx={{ fontWeight: 900, color: BRAND.text, mb: 1, letterSpacing: '-1px' }}
                                >
                                    Order <span style={{ color: BRAND.primary }}>Confirmed!</span>
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    Sit back and relax, your food is on its way.
                                </Typography>
                            </Box>

                            {orderId ? (
                                <Box 
                                    sx={{ 
                                        bgcolor: '#ffffff', 
                                        border: `2px dashed ${BRAND.secondary}40`, 
                                        borderRadius: 4, 
                                        px: 4, 
                                        py: 3,
                                        width: '100%',
                                        position: 'relative',
                                        '&::before, &::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: '50%',
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            bgcolor: BRAND.bg,
                                            transform: 'translateY(-50%)',
                                        },
                                        '&::before': { left: -10 },
                                        '&::after': { right: -10 },
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
                                        Receipt ID
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: BRAND.secondary, letterSpacing: 1, mt: 0.5 }}>
                                        #{orderId}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ py: 2 }}>
                                    <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                                        Order reference missing. Please check your profile for order history.
                                    </Typography>
                                </Box>
                            )}

                            {/* Order Journey Visual */}
                            <Box sx={{ width: '100%', py: 1 }}>
                                <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', px: 2 }}>
                                    <Box sx={{ 
                                        position: 'absolute', 
                                        top: 22, 
                                        left: 40, 
                                        right: 40, 
                                        height: 2, 
                                        bgcolor: 'rgba(0,0,0,0.05)',
                                        zIndex: 0
                                    }} />
                                    <OrderStep icon={<DoneAllIcon sx={{ fontSize: 20 }} />} label="Placed" active />
                                    <OrderStep icon={<RestaurantIcon sx={{ fontSize: 20 }} />} label="Preparing" active />
                                    <OrderStep icon={<LocalShippingIcon sx={{ fontSize: 20 }} />} label="Delivery" active={false} />
                                </Stack>
                            </Box>

                            <Divider sx={{ width: '100%', borderStyle: 'dashed' }} />

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                                <Button 
                                    onClick={() => navigate('/menu')} 
                                    variant="outlined"
                                    fullWidth
                                    sx={{ 
                                        borderRadius: '16px',
                                        py: 1.8,
                                        fontWeight: 800,
                                        color: BRAND.text,
                                        borderColor: 'rgba(0,0,0,0.1)',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)', borderColor: BRAND.text },
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    Continue Shopping
                                </Button>
                                {orderId && (
                                    <Button 
                                        onClick={() => navigate(`/orders/${orderId}`)} 
                                        variant="contained"
                                        fullWidth
                                        startIcon={<ReceiptLongIcon />}
                                        sx={{ 
                                            bgcolor: BRAND.primary,
                                            borderRadius: '16px',
                                            py: 1.8,
                                            fontWeight: 800,
                                            '&:hover': { 
                                                bgcolor: '#d44646', 
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 12px 25px rgba(235, 77, 75, 0.4)' 
                                            },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        View Details
                                    </Button>
                                )}
                            </Stack>

                            <Typography variant="caption" sx={{ color: 'text.secondary', maxWidth: '80%', fontStyle: 'italic' }}>
                                A confirmation email with receipt has been sent to your registered address.
                            </Typography>
                        </Stack>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default OrderConfirmationPage;