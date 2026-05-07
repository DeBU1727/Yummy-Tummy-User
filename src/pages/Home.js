import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Box, Container, Typography, Grid, Stack, Button, Fade } from '@mui/material';
import Header from '../components/Layout/Header';
import Menu from '../components/Menu/Menu';
import OfferCarousel from '../components/Menu/OfferCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/authSlice';
import { fetchCartItems } from '../store/cartSlice';

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
      {/* Hero Content Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 12 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid item xs={12} md={7}>
            <Fade in={true} timeout={1000}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 900, 
                    color: BRAND.text, 
                    lineHeight: { xs: 1.1, md: 1.2 },
                    mb: 3,
                    fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: '-1px'
                  }}
                >
                  Healthy <span style={{ color: BRAND.primary }}>Eating</span> <br />
                  is an Important <br />
                  Part of <span style={{ color: BRAND.primary }}>Lifestyle</span>
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 5, 
                    maxWidth: { xs: '100%', md: 500 }, 
                    fontSize: { xs: '1rem', md: '1.2rem' }, 
                    lineHeight: 1.8,
                    mx: { xs: 'auto', md: 0 }
                  }}
                >
                  We prepare delicious food for you. We are always here to provide 
                  the best service with healthy and organic ingredients delivered straight to your door.
                </Typography>

                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  alignItems="center" 
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                >
                  <Button 
                    onClick={() => navigate('/menu')}
                    variant="contained" 
                    size="large"
                    sx={{ 
                      bgcolor: BRAND.primary, 
                      borderRadius: '30px', 
                      px: { xs: 6, md: 5 }, 
                      py: 2,
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      boxShadow: '0 10px 25px rgba(235, 77, 75, 0.4)',
                      '&:hover': { bgcolor: '#d44646', transform: 'translateY(-3px)', boxShadow: '0 15px 30px rgba(235, 77, 75, 0.5)' },
                      transition: 'all 0.3s',
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Explore Our Menu
                  </Button>
                </Stack>
              </Box>
            </Fade>
          </Grid>
          
          {/* Hero Image Section placeholder */}
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
             {/* Visual element or image would go here */}
          </Grid>
        </Grid>
      </Container>

      {/* Featured Offers / Carousel */}
      <Box sx={{ mb: { xs: 6, md: 10 } }}>
        <OfferCarousel />
      </Box>

      {/* Main Food Menu Section */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          pb: 12,
          // Dynamic styles for the menu container
          '& .MuiCard-root': {
            height: '100%',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)'
            }
          }
        }}
      >
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: BRAND.text }}>
            Popular <span style={{ color: BRAND.primary }}>Dishes</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Choose from our most loved items
          </Typography>
        </Box>
        <Menu />
      </Container>


    </Box>
  );
};

export default Home;