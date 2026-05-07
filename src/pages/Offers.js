import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, 
  Button, Box, CircularProgress, Alert, Fade, Stack, Chip 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import api from '../store/api';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Branding Palette from Reference
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  surface: '#ffffff',
  text: '#2d3436'
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await api.get('/offers');
        setOffers(response.data);
      } catch (err) {
        setError('Failed to load offers. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh', pb: 10 }}>
      <Header />
      
      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 } }}>
        <Fade in={true} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h6" 
              sx={{ color: BRAND.primary, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', mb: 1 }}
            >
              Special Deals
            </Typography>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ fontWeight: 900, color: BRAND.text, mb: 2 }}
            >
              Exclusive <span style={{ color: BRAND.primary }}>Offers</span>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
              Grab the best deals before they're gone! Treat yourself to delicious meals at unbeatable prices.
            </Typography>
          </Box>
        </Fade>

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
            <CircularProgress sx={{ color: BRAND.primary }} />
            <Typography sx={{ mt: 2, fontWeight: 700, color: BRAND.primary }}>Finding the best deals...</Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            variant="filled" 
            sx={{ mt: 2, borderRadius: 4, bgcolor: BRAND.primary, '& .MuiAlert-icon': { color: '#fff' } }}
          >
            {error}
          </Alert>
        ) : offers.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8, p: 4, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 8 }}>
            <LocalOfferIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
              No offers available at the moment. Check back soon!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {offers.map((offer, index) => (
              <Grid item key={offer.id} xs={12} sm={6} md={4}>
                <Fade in={true} timeout={800 + (index * 200)}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 6,
                      boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.02)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      position: 'relative',
                      overflow: 'visible', // Allows badge to float slightly outside
                      '&:hover': { 
                        transform: 'translateY(-10px)', 
                        boxShadow: '0 25px 50px rgba(235, 77, 75, 0.15)' 
                      } 
                    }}
                  >
                    {/* Floating Discount Badge (Matches image hero section) */}
                    {offer.discountPercentage > 0 && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: -15, 
                          right: -15, 
                          bgcolor: BRAND.secondary, 
                          color: '#fff',
                          width: 75, 
                          height: 75, 
                          borderRadius: '50%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: '0 8px 20px rgba(240, 147, 43, 0.4)',
                          zIndex: 2,
                          transform: 'rotate(10deg)'
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>{offer.discountPercentage}%</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.7rem' }}>OFF</Typography>
                      </Box>
                    )}

                    <Box sx={{ overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
                      {offer.imageUrl ? (
                        <CardMedia
                          component="img"
                          height="220"
                          image={offer.imageUrl}
                          alt={offer.title}
                          sx={{ transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.1)' } }}
                        />
                      ) : (
                        <Box sx={{ height: 220, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <LocalOfferIcon sx={{ fontSize: 60, color: '#ddd' }} />
                        </Box>
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3, pt: 3 }}>
                      <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 900, color: BRAND.text }}>
                        {offer.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {offer.description}
                      </Typography>
                      
                      {offer.offerCode && (
                        <Box 
                          sx={{ 
                            mt: 2, p: 1.5, 
                            border: `2px dashed ${BRAND.secondary}`, 
                            bgcolor: '#fff9ef', 
                            color: BRAND.text, 
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            Use Code: <span style={{ color: BRAND.primary, fontSize: '1.1rem', letterSpacing: 1 }}>{offer.offerCode}</span>
                          </Typography>
                          <ContentCopyIcon sx={{ color: BRAND.secondary, fontSize: 18 }} />
                        </Box>
                      )}
                    </CardContent>

                    <Box sx={{ p: 3, pt: 0 }}>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        onClick={() => navigate('/menu')}
                        sx={{ 
                          bgcolor: BRAND.primary,
                          borderRadius: '30px',
                          py: 1.5,
                          fontWeight: 800,
                          fontSize: '1rem',
                          textTransform: 'none',
                          boxShadow: '0 8px 20px rgba(235, 77, 75, 0.3)',
                          '&:hover': { bgcolor: '#d44646' }
                        }}
                      >
                        Order Now
                      </Button>
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Offers;