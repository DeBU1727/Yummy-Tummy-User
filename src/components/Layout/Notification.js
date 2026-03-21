import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotification, selectNotification } from '../../store/notificationSlice';

// Branding Palette matching the "Foody" theme
const BRAND = {
  primary: '#eb4d4b',    // Coral Red (Errors)
  secondary: '#f0932b',  // Golden Orange (Warnings)
  success: '#22c55e',    // Mint Green (Success)
  info: '#3b82f6',       // Bright Blue (Info)
  text: '#ffffff'
};

// Smooth slide-up animation for the snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const Notification = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(selectNotification);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideNotification());
  };

  // Map MUI severities to our custom vibrant brand colors
  const getAlertColor = (sev) => {
    switch (sev) {
      case 'success': return BRAND.success;
      case 'error': return BRAND.primary;
      case 'warning': return BRAND.secondary;
      case 'info': return BRAND.info;
      default: return '#333333';
    }
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={4000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
      sx={{ 
        mb: { xs: 2, md: 4 }, 
        mr: { xs: 0, md: 2 },
        zIndex: (theme) => theme.zIndex.modal + 9999 // Ensure it floats above everything
      }}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        variant="filled"
        sx={{ 
          width: '100%', 
          bgcolor: getAlertColor(severity),
          color: BRAND.text,
          borderRadius: '16px', // Premium rounded corners
          fontWeight: 700,
          fontSize: '0.95rem',
          boxShadow: `0 12px 30px ${getAlertColor(severity)}60`, // Dynamic glowing shadow based on severity
          alignItems: 'center',
          '& .MuiAlert-icon': {
            color: BRAND.text,
            opacity: 0.9,
            fontSize: '1.5rem'
          },
          '& .MuiAlert-action': {
            pt: 0,
            pb: 0,
            alignItems: 'center',
            '& svg': { color: BRAND.text }
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;