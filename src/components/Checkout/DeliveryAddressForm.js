import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Stack, InputAdornment } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Branding Palette from "Foody" Reference
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  surface: '#ffffff',
  text: '#2d3436'
};

const DeliveryAddressForm = ({ onSubmit }) => {
    const [address, setAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!address || !contactNumber) {
            setError('All fields are required.');
            return;
        }
        setError('');
        onSubmit({ address, contactNumber });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <LocationOnOutlinedIcon sx={{ color: BRAND.secondary }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: BRAND.text }}>
                    Shipping Information
                </Typography>
            </Stack>

            {error && (
                <Alert 
                    severity="error" 
                    variant="filled" 
                    sx={{ mb: 3, borderRadius: 4, backgroundColor: BRAND.primary, '& .MuiAlert-icon': { color: '#fff' } }}
                >
                    {error}
                </Alert>
            )}

            <Stack spacing={3}>
                <TextField
                    label="Complete Delivery Address"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    multiline
                    rows={3}
                    variant="filled"
                    placeholder="e.g., 123 Foody Street, Apt 4B..."
                    InputProps={{
                        disableUnderline: true,
                        sx: { borderRadius: 4, backgroundColor: '#f8f9fa' }
                    }}
                />
                
                <TextField
                    label="Contact Number"
                    fullWidth
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    variant="filled"
                    placeholder="Enter your phone number"
                    InputProps={{
                        disableUnderline: true,
                        sx: { borderRadius: 4, backgroundColor: '#f8f9fa' },
                        startAdornment: (
                            <InputAdornment position="start">
                                <PhoneOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                            </InputAdornment>
                        )
                    }}
                />
            </Stack>

            <Button 
                type="submit" 
                variant="contained" 
                endIcon={<ArrowForwardIcon />}
                fullWidth
                sx={{ 
                    mt: 4, 
                    py: 1.8, 
                    borderRadius: '30px', 
                    fontWeight: 800, 
                    fontSize: '1.05rem',
                    textTransform: 'none',
                    bgcolor: BRAND.primary,
                    boxShadow: '0 10px 20px rgba(235, 77, 75, 0.3)',
                    '&:hover': { 
                        bgcolor: '#d44646', 
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 25px rgba(235, 77, 75, 0.4)' 
                    },
                    transition: 'all 0.3s'
                }}
            >
                Proceed to Payment
            </Button>
        </Box>
    );
};

export default DeliveryAddressForm;