import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Button, Paper, Fade, Avatar, Stack } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RestaurantIcon from '@mui/icons-material/Restaurant';

// Branding Palette from "Foody" Reference
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

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: BRAND.bg, 
            display: 'flex',
            alignItems: 'center',
            backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(240, 147, 43, 0.05) 0%, rgba(235, 77, 75, 0.02) 80%)',
            py: 6
        }}>
            <Container maxWidth="sm">
                <Fade in={true} timeout={800}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: { xs: 4, md: 6 }, 
                            textAlign: 'center',
                            borderRadius: 8,
                            backgroundColor: BRAND.surface,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                            border: '1px solid rgba(0,0,0,0.03)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Decorative Top Accent */}
                        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, bgcolor: BRAND.primary }} />

                        <Stack alignItems="center" spacing={3}>
                            
                            <Avatar 
                                sx={{ 
                                    bgcolor: BRAND.successBg, 
                                    color: BRAND.success,
                                    width: 90, 
                                    height: 90, 
                                    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.2)' 
                                }}
                            >
                                <CheckCircleOutlineIcon sx={{ fontSize: 50 }} />
                            </Avatar>

                            <Box>
                                <Typography 
                                    variant="h4" 
                                    component="h1" 
                                    sx={{ fontWeight: 900, color: BRAND.text, mb: 1, letterSpacing: '-0.5px' }}
                                >
                                    Order <span style={{ color: BRAND.primary }}>Confirmed!</span>
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Your delicious food is being prepared.
                                </Typography>
                            </Box>

                            {orderId && (
                                <Box 
                                    sx={{ 
                                        bgcolor: '#fff9ef', 
                                        border: `2px dashed ${BRAND.secondary}`, 
                                        borderRadius: 4, 
                                        px: 4, 
                                        py: 2,
                                        width: '100%'
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        ORDER ID
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: BRAND.secondary, letterSpacing: 1 }}>
                                        #{orderId}
                                    </Typography>
                                </Box>
                            )}

                            <Typography variant="body2" sx={{ color: 'text.secondary', my: 2, px: { xs: 0, md: 3 }, lineHeight: 1.6 }}>
                                Thank you for choosing us! We'll make sure your meal is fresh, hot, and prepared with love.
                            </Typography>

                            <Button 
                                onClick={() => navigate('/menu')} 
                                variant="contained"
                                fullWidth
                                startIcon={<RestaurantIcon />}
                                sx={{ 
                                    bgcolor: BRAND.primary,
                                    borderRadius: '30px',
                                    py: 1.8,
                                    fontWeight: 800,
                                    fontSize: '1.05rem',
                                    textTransform: 'none',
                                    boxShadow: '0 10px 20px rgba(235, 77, 75, 0.3)',
                                    '&:hover': { 
                                        bgcolor: '#d44646', 
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 25px rgba(235, 77, 75, 0.4)' 
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                Back to Menu
                            </Button>
                        </Stack>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default OrderConfirmationPage;