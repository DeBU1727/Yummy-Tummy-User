import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Box, Container, Typography, Grid, Stack, Button, Fade, useTheme, useMediaQuery } from '@mui/material';
import Header from '../components/Layout/Header';
import Menu from '../components/Menu/Menu';
import OfferCarousel from '../components/Menu/OfferCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/authSlice';
import { fetchCartItems } from '../store/cartSlice';
import { BRAND } from '../theme';

const Home = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
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
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 10 } }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={7} lg={6}>
            <Fade in={true} timeout={1000}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 900, 
                    color: BRAND.text, 
                    lineHeight: 1.1,
                    mb: 3,
                    fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.5rem' },
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: '-1px'
                  }}
                >
                  Healthy <span style={{ color: BRAND.primary }}>Eating</span> is <br />
                  an Important <span style={{ color: BRAND.text }}>Part</span> <br />
                  of Lifestyle
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 5, 
                    maxWidth: { xs: '100%', md: 480 }, 
                    fontSize: { xs: '1.05rem', md: '1.2rem' }, 
                    lineHeight: 1.7,
                    mx: { xs: 'auto', md: 0 }
                  }}
                >
                  We prepare delicious food for you. We are always here to provide 
                  the best service with healthy and organic ingredients.
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
                      px: 5, 
                      py: 2,
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      boxShadow: '0 8px 25px rgba(235, 77, 75, 0.4)',
                      '&:hover': { bgcolor: '#d44646', transform: 'translateY(-3px)', boxShadow: '0 12px 30px rgba(235, 77, 75, 0.5)' },
                      transition: 'all 0.3s',
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Explore Menu
                  </Button>
                </Stack>
              </Box>
            </Fade>
          </Grid>
          
          {/* Hero Image Section - Simplified for better flow */}
          <Grid item xs={12} md={5} lg={6} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Box 
              sx={{ 
                width: '100%', 
                maxWidth: 500, 
                height: 500, 
                bgcolor: 'rgba(235, 77, 75, 0.05)', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {/* This would be the main hero image */}
              <Box sx={{ width: '85%', height: '85%', borderRadius: '50%', bgcolor: 'rgba(240, 147, 43, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Typography variant="h1" sx={{ fontSize: '10rem', opacity: 0.1 }}>🥗</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Offers / Carousel */}
      <Box sx={{ mb: { xs: 8, md: 12 } }}>
        <OfferCarousel />
      </Box>

      {/* Main Food Menu Section - RESPONSIVE GRID */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          pb: 10
        }}
      >
        <Menu />
      </Container>
    </Box>
  );
};

export default Home;