import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Box, Container, Typography, Grid, Stack, Button, Fade } from '@mui/material';
import Header from '../components/Layout/Header';
import Menu from '../components/Menu/Menu';
import OfferCarousel from '../components/Menu/OfferCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/authSlice';
import { fetchCartItems } from '../store/cartSlice';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

// Branding Palette from Reference
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  text: '#2d3436'
};

const Home = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartItems());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh', overflowX: 'hidden' }}>
      <Header />
      
      {/* Hero Content Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 8 }, pb: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000}>
              <Box>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 900, 
                    color: BRAND.text, 
                    lineHeight: 1.2,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '4.5rem' },
                    fontFamily: "'Poppins', sans-serif"
                  }}
                >
                  Healthy <span style={{ color: BRAND.primary }}>Eating</span> is <br />
                  an Important <span style={{ color: BRAND.text }}>Part</span> <br />
                  of Lifestyle
                </Typography>
                
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 450, fontSize: '1.1rem', lineHeight: 1.6 }}>
                  We prepare delicious food for you. We are always here to provide 
                  the best service with healthy and organic ingredients.
                </Typography>

                <Stack direction="row" spacing={3} alignItems="center">
                  <Button 
                    onClick={() => navigate('/menu')}
                    variant="contained" 
                    sx={{ 
                      bgcolor: BRAND.primary, 
                      borderRadius: '30px', 
                      px: 4, 
                      py: 1.5,
                      fontWeight: 800,
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: '0 8px 20px rgba(235, 77, 75, 0.4)',
                      '&:hover': { bgcolor: '#d44646', transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(235, 77, 75, 0.5)' },
                      transition: 'all 0.3s'
                    }}
                  >
                    Explore New
                  </Button>
                  
                </Stack>
              </Box>
            </Fade>
          </Grid>
          
          {/* Hero Image Section placeholder */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
            {/* The actual food bowl graphic would be positioned here within the Header or Hero component */}
          </Grid>
        </Grid>
      </Container>

      {/* Featured Offers / Carousel */}
      <Box sx={{ mb: 8 }}>
        <OfferCarousel />
      </Box>

      {/* Main Food Menu Section - UI ADJUSTED FOR FIXED WIDTH ONLY */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          pb: 10,
          // CSS Overrides to lock card width and handle overflow dynamically
          '& .MuiCard-root': {
            width: '320px !important', // Strictly enforces width
            maxWidth: '100%',          // Ensures it shrinks gracefully on small mobile screens
            margin: '0 auto',          // Centers the card horizontally
            // No height styles added, allowing natural vertical flow
          },
          // Restrict image width to fit the card without changing its inherent height
          '& .MuiCardMedia-root, & img': {
            width: '100% !important',  
            objectFit: 'cover',
          },
          // Single-line text truncation (for titles)
          '& .MuiTypography-h6, & .MuiTypography-h5, & .MuiTypography-subtitle1': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          // Multi-line word wrapping (for descriptions) so it doesn't push the card width outwards
          '& .MuiTypography-body1, & .MuiTypography-body2': {
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            hyphens: 'auto'
          }
        }}
      >
        <Menu />
      </Container>

    </Box>
  );
};

export default Home;