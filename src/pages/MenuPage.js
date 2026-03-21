import React, { useEffect } from 'react';
import { Box, Typography, Fade, Container } from '@mui/material';
import Header from '../components/Layout/Header';
import Menu from '../components/Menu/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/authSlice';
import { fetchCartItems } from '../store/cartSlice';

// Branding Palette from "Foody" Reference
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  text: '#2d3436'
};

const MenuPage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh', pb: 10 }}>
      <Header />
      
      <Container maxWidth="lg">
        <Fade in={true} timeout={800}>
          <Box sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 2, md: 4 }, textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: BRAND.primary, 
                fontWeight: 800, 
                letterSpacing: 1.5, 
                textTransform: 'uppercase', 
                mb: 1 
              }}
            >
              Fresh & Tasty
            </Typography>
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ fontWeight: 900, color: BRAND.text, letterSpacing: '-0.5px' }}
            >
              Discover Our <span style={{ color: BRAND.primary }}>Menu</span>
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mt: 2, maxWidth: 500, mx: 'auto', fontWeight: 500 }}
            >
              Explore our wide variety of delicious meals, prepared with the finest ingredients just for you.
            </Typography>
          </Box>
        </Fade>
      </Container>

      {/* UI ADJUSTMENT: STRICT WIDTH LOCK ONLY */}
      <Box 
        sx={{
          // Target the inner Material-UI Cards to enforce a strict width
          '& .MuiCard-root': {
            width: '320px !important', // Locks the width
            maxWidth: '100%',          // Ensures it fits on mobile screens
            margin: '0 auto',          // Centers the card in its grid slot
            // Notice: No height restrictions here, allowing it to behave naturally
          },

          // Ensure images conform to the new fixed width without changing their set height
          '& .MuiCardMedia-root, & img': {
            width: '100% !important',  
            objectFit: 'cover',        // Prevents image squishing horizontally
          },

          // Prevent long titles from stretching the card width
          '& .MuiTypography-h6, & .MuiTypography-h5, & .MuiTypography-subtitle1': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },

          // Force multiline body text to wrap properly instead of pushing the width out
          '& .MuiTypography-body1, & .MuiTypography-body2': {
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            hyphens: 'auto'
          }
        }}
      >
        <Menu />
      </Box>
    </Box>
  );
};

export default MenuPage;