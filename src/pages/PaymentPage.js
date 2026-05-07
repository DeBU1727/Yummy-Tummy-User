import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Box, Button, Typography, Container, RadioGroup, FormControlLabel, 
    Radio, CircularProgress, Paper, Divider, Grid, TextField, 
    Stack, Avatar, Fade, Alert, InputAdornment 
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { selectCartItems, selectCartTotalPrice, clearUserCart } from '../store/cartSlice';
import { selectOrderType, selectDeliveryDetails, clearOrder } from '../store/orderSlice';
import { showNotification } from '../store/notificationSlice';
import { confirmAction } from '../components/Layout/ConfirmationDialog';
import api from '../store/api';

// Branding Palette from "Foody" Reference
const BRAND = {
    primary: '#eb4d4b',    // Coral Red
    secondary: '#f0932b',  // Golden Orange
    bg: '#fffaf0',         // Soft Cream
    surface: '#ffffff',
    text: '#2d3436'
};

const PaymentPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const orderType = useSelector(selectOrderType);
    const deliveryDetails = useSelector(selectDeliveryDetails);
    const cartItems = useSelector(selectCartItems);
    const subtotal = useSelector(selectCartTotalPrice);

    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountPercentage }
    const [loading, setLoading] = useState(false);
    const [couponLoading, setCouponLoading] = useState(false);
    const [error, setError] = useState('');
    const [isNavigatingToConfirmation, setIsNavigatingToConfirmation] = useState(false);

    // Prevent access if cart is empty
    React.useEffect(() => {
        if (!loading && cartItems.length === 0 && !error && !isNavigatingToConfirmation && location.pathname !== '/order-confirmation') {
            navigate('/');
        }
    }, [cartItems, navigate, loading, error, isNavigatingToConfirmation, location.pathname]);

    const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercentage) / 100 : 0;
    const amountAfterDiscount = subtotal - discountAmount;
    const gstAmount = amountAfterDiscount * 0.18;
    const finalTotal = amountAfterDiscount + gstAmount;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        
        setCouponLoading(true);
        setError('');
        try {
            const response = await api.get(`/offers/validate/${couponCode.trim()}`);
            const discountPercentage = response.data;
            setAppliedCoupon({ code: couponCode.trim(), discountPercentage });
            dispatch(showNotification({ message: `Coupon applied! You got ${discountPercentage}% off.`, severity: 'success' }));
        } catch (err) {
            setAppliedCoupon(null);
            const msg = err.response?.data || 'Invalid coupon code.';
            dispatch(showNotification({ message: msg, severity: 'error' }));
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = async () => {
        const confirmed = await confirmAction(dispatch, 'Remove Coupon', 'Are you sure you want to remove this discount?');
        if (confirmed) {
            setAppliedCoupon(null);
            setCouponCode('');
            dispatch(showNotification({ message: 'Coupon removed.', severity: 'info' }));
        }
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            setError('Your cart is empty.');
            return;
        }

        setLoading(true);
        setError('');
        setIsNavigatingToConfirmation(true); // Set the flag before navigation

        const orderData = {
            orderType,
            deliveryAddress: deliveryDetails ? deliveryDetails.address : null,
            contactNumber: deliveryDetails ? deliveryDetails.contactNumber : null,
            paymentMethod,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            items: cartItems.map(item => ({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
            })),
        };

        try {
            const response = await api.post('/orders/place', orderData);
            const newOrder = response.data;
            setTimeout(() => {
                navigate('/order-confirmation', { state: { orderId: newOrder.id }, replace: true });
            }, 0);
            setTimeout(() => {
                dispatch(clearUserCart());
                dispatch(clearOrder());
                dispatch(showNotification({ message: 'Congratulations! Your order has been placed successfully.', severity: 'success' }));
            }, 0);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: BRAND.bg, 
            py: { xs: 4, md: 8 },
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(240, 147, 43, 0.05) 0%, rgba(235, 77, 75, 0.02) 90%)'
        }}>
            <Container maxWidth="lg">
                <Fade in={true} timeout={800}>
                    <Box>
                        {/* Page Header */}
                        <Stack alignItems="center" textAlign="center" sx={{ mb: 6 }}>
                            <Avatar 
                                sx={{ 
                                    bgcolor: BRAND.primary, 
                                    width: 60, 
                                    height: 60, 
                                    mb: 2, 
                                    boxShadow: '0 8px 20px rgba(235, 77, 75, 0.3)' 
                                }}
                            >
                                <PaymentIcon sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Typography 
                                variant="h3" 
                                component="h1" 
                                sx={{ fontWeight: 900, color: BRAND.text, mb: 1, letterSpacing: '-0.5px', fontSize: { xs: '2rem', md: '2.5rem' } }}
                            >
                                Checkout & <span style={{ color: BRAND.primary }}>Payment</span>
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Review your delicious items and complete your order.
                            </Typography>
                        </Stack>

                        {error && (
                            <Alert 
                                severity="error" 
                                variant="filled" 
                                sx={{ mb: 4, borderRadius: 4, bgcolor: BRAND.primary, '& .MuiAlert-icon': { color: '#fff' } }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Grid container spacing={4}>
                            {/* Order Summary (Left Column) */}
                            <Grid item xs={12} md={7}>
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: { xs: 3, md: 4 }, 
                                        borderRadius: 8, 
                                        backgroundColor: BRAND.surface,
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.06)',
                                        border: '1px solid rgba(0,0,0,0.03)'
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                                        <ReceiptLongIcon sx={{ color: BRAND.secondary }} />
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: BRAND.text }}>
                                            Order Summary
                                        </Typography>
                                    </Stack>
                                    <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
                                    
                                    <Box sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1, mb: 3 }}>
                                        {cartItems.map((item) => (
                                            <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: BRAND.text }}>{item.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                        <span style={{ color: BRAND.secondary }}>{item.quantity}x</span> @ ₹{item.price.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: BRAND.primary }}>
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                    
                                    <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
                                    
                                    {/* Coupon Section */}
                                    <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
                                        <TextField
                                            label="Promo / Coupon Code"
                                            variant="filled"
                                            fullWidth
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            disabled={!!appliedCoupon}
                                            InputProps={{
                                                disableUnderline: true,
                                                sx: { borderRadius: 4, backgroundColor: '#f8f9fa', fontWeight: 700, letterSpacing: 1 },
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocalOfferIcon sx={{ color: BRAND.secondary, fontSize: 20 }} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        {appliedCoupon ? (
                                            <Button 
                                                variant="outlined" 
                                                color="error" 
                                                onClick={handleRemoveCoupon}
                                                sx={{ borderRadius: 4, px: 3, fontWeight: 800 }}
                                            >
                                                Remove
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="contained" 
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponCode.trim()}
                                                sx={{ 
                                                    borderRadius: 4, 
                                                    px: 4, 
                                                    fontWeight: 800, 
                                                    bgcolor: BRAND.secondary,
                                                    boxShadow: '0 4px 15px rgba(240, 147, 43, 0.3)',
                                                    '&:hover': { bgcolor: '#e67e22' }
                                                }}
                                            >
                                                {couponLoading ? <CircularProgress size={24} color="inherit" /> : 'Apply'}
                                            </Button>
                                        )}
                                    </Box>

                                    {/* Subtotals */}
                                    <Box sx={{ p: 3, bgcolor: '#fff9ef', borderRadius: 5, border: `2px dashed ${BRAND.secondary}40` }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Items Subtotal</Typography>
                                            <Typography sx={{ fontWeight: 700 }}>₹{subtotal.toFixed(2)}</Typography>
                                        </Box>
                                        
                                        {appliedCoupon && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, color: '#15803d' }}>
                                                <Typography sx={{ fontWeight: 600 }}>Discount ({appliedCoupon.discountPercentage}%)</Typography>
                                                <Typography sx={{ fontWeight: 800 }}>- ₹{discountAmount.toFixed(2)}</Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>GST (18%)</Typography>
                                            <Typography sx={{ fontWeight: 700 }}>₹{gstAmount.toFixed(2)}</Typography>
                                        </Box>
                                        
                                        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 900 }}>Total Payable</Typography>
                                            <Typography variant="h4" color="primary" sx={{ fontWeight: 900 }}>
                                                ₹{finalTotal.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Payment Options (Right Column) */}
                            <Grid item xs={12} md={5}>
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: { xs: 3, md: 4 }, 
                                        borderRadius: 8, 
                                        backgroundColor: BRAND.surface,
                                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.06)',
                                        border: '1px solid rgba(0,0,0,0.03)',
                                        mb: 3
                                    }}
                                >
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: BRAND.text, mb: 3 }}>
                                        Payment Method
                                    </Typography>
                                    
                                    <RadioGroup
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        sx={{ mb: 4 }}
                                    >
                                        {['CASH', 'CARD', 'ONLINE_PAYMENT'].map((method) => (
                                            <Paper 
                                                key={method}
                                                elevation={0} 
                                                sx={{ 
                                                    mb: 1.5, 
                                                    border: `2px solid ${paymentMethod === method ? BRAND.primary : '#f0f0f0'}`,
                                                    borderRadius: 3,
                                                    transition: 'all 0.2s',
                                                    bgcolor: paymentMethod === method ? 'rgba(235, 77, 75, 0.03)' : 'transparent'
                                                }}
                                            >
                                                <FormControlLabel 
                                                    value={method} 
                                                    control={<Radio sx={{ color: BRAND.primary, '&.Mui-checked': { color: BRAND.primary } }} />} 
                                                    label={
                                                        <Typography sx={{ fontWeight: paymentMethod === method ? 800 : 600 }}>
                                                            {method === 'CASH' ? 'Cash on Delivery' : method === 'CARD' ? 'Credit/Debit Card' : 'Online Payment'}
                                                        </Typography>
                                                    }
                                                    sx={{ width: '100%', m: 0, p: 1.5 }}
                                                />
                                            </Paper>
                                        ))}
                                    </RadioGroup>

                                    {orderType === 'DELIVERY' && deliveryDetails && (
                                        <Box sx={{ mb: 4, p: 2.5, bgcolor: '#f8f9fa', borderRadius: 4 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: BRAND.secondary, mb: 1, letterSpacing: 1 }}>
                                                DELIVERING TO:
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>{deliveryDetails.address}</Typography>
                                            <Typography variant="body2" color="text.secondary">Phone: {deliveryDetails.contactNumber}</Typography>
                                        </Box>
                                    )}

                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        sx={{ 
                                            py: 2, 
                                            fontWeight: 900, 
                                            mb: 2,
                                            borderRadius: '30px',
                                            fontSize: '1.1rem',
                                            textTransform: 'none',
                                            bgcolor: BRAND.primary,
                                            boxShadow: '0 10px 20px rgba(235, 77, 75, 0.3)',
                                            '&:hover': { bgcolor: '#d44646', transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(235, 77, 75, 0.4)' },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${finalTotal.toFixed(2)}`}
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => navigate('/')}
                                        disabled={loading}
                                        sx={{ 
                                            py: 1.5, 
                                            fontWeight: 800, 
                                            borderRadius: '30px',
                                            textTransform: 'none',
                                            color: 'text.secondary',
                                            borderColor: '#ddd',
                                            '&:hover': { borderColor: BRAND.text, color: BRAND.text, bgcolor: 'transparent' }
                                        }}
                                    >
                                        Back to Menu
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default PaymentPage;