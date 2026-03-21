import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrderType, setDeliveryDetails } from '../store/orderSlice';
import DeliveryAddressForm from '../components/Checkout/DeliveryAddressForm';
import { Container, Typography, Box, Paper, Fade, Avatar, Stack } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Branding Palette from "Foody" Reference
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  surface: '#ffffff',
  text: '#2d3436'
};

const CheckoutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const orderType = useSelector(selectOrderType);

    useEffect(() => {
        if (orderType === 'DINE_IN') {
            // For Dine-In, skip address and go straight to payment
            // Use replace: true so that the 'Back' button goes to Menu, not here
            navigate('/payment', { replace: true });
        }
    }, [orderType, navigate]);

    const handleAddressSubmit = (details) => {
        dispatch(setDeliveryDetails(details));
        navigate('/payment');
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: BRAND.bg, 
            py: { xs: 6, md: 10 },
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(240, 147, 43, 0.05) 0%, rgba(235, 77, 75, 0.02) 80%)'
        }}>
            <Container maxWidth="sm">
                <Fade in={true} timeout={800}>
                    <Box>
                        {/* Page Header */}
                        <Stack alignItems="center" textAlign="center" sx={{ mb: 5 }}>
                            <Avatar 
                                sx={{ 
                                    bgcolor: BRAND.primary, 
                                    width: 60, 
                                    height: 60, 
                                    mb: 2, 
                                    boxShadow: '0 8px 20px rgba(235, 77, 75, 0.3)' 
                                }}
                            >
                                <LocalShippingIcon sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Typography 
                                variant="h3" 
                                component="h1" 
                                sx={{ fontWeight: 900, color: BRAND.text, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}
                            >
                                Delivery <span style={{ color: BRAND.primary }}>Details</span>
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Where should we deliver your delicious food?
                            </Typography>
                        </Stack>

                        {/* Checkout Form Container */}
                        {orderType === 'DELIVERY' && (
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: { xs: 3, md: 5 }, 
                                    borderRadius: 8, 
                                    backgroundColor: BRAND.surface,
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid rgba(0,0,0,0.03)'
                                }}
                            >
                                <DeliveryAddressForm onSubmit={handleAddressSubmit} />
                            </Paper>
                        )}
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default CheckoutPage;