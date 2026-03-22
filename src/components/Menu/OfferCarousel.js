import React, { useState, useEffect } from 'react';
import { 
  Box, IconButton, Typography, Paper, Button, Avatar, Stack 
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import api from '../../store/api';
import { API_BASE_URL } from '../../config';

// Vibrant card colors matching the reference image
const CARD_COLORS = ['#ff6b81', '#ffa502', '#2ed573', '#5352ed'];

const OfferCarousel = () => {
  const [offers, setOffers] = useState([]);
  
  // We use an unbounded index to allow infinite scrolling.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await api.get('/offers');
        setOffers(response.data);
        
        // Start the index at a high multiple of the array length
        // so we have a massive "runway" to scroll backwards infinitely.
        if (response.data.length > 0) {
            setCurrentIndex(response.data.length * 50); 
            setIsLoaded(true);
        }
      } catch (err) {
        console.error('Failed to fetch offers:', err);
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    if (isLoaded && offers.length > 0) {
      const timer = setInterval(() => {
        handleNext();
      }, 5000); // Auto-slide every 5 seconds
      return () => clearInterval(timer);
    }
  }, [isLoaded, offers]);

  // Simply increment or decrement the raw index.
  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  if (offers.length === 0) return null;

  // Safely calculate the actual active item (0 to offers.length - 1) for the dots
  const activeDotIndex = ((currentIndex % offers.length) + offers.length) % offers.length;

  return (
    <Box sx={{ position: 'relative', width: '100%', mb: { xs: 8, md: 12 }, px: { xs: 2, md: 4 } }}>
      
      {/* Outer White Pill Container */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#ffffff',
          borderRadius: { xs: '30px', md: '50px' },
          p: { xs: 2, md: 4 },
          // Reduced top padding slightly since we are adding padding directly to the cards inside
          pt: { xs: 4, md: 6 }, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
          position: 'relative'
        }}
      >
        {/* Navigation Buttons */}
        <IconButton
          onClick={handlePrev}
          sx={{ 
            position: 'absolute', left: { xs: -10, md: -25 }, top: '50%', transform: 'translateY(-50%)', 
            bgcolor: '#ffffff', color: '#2d3436', boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            width: { xs: 40, md: 55 }, height: { xs: 40, md: 55 }, zIndex: 5,
            '&:hover': { bgcolor: '#f8f9fa', transform: 'translateY(-50%) scale(1.05)' }, transition: 'all 0.2s'
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: { xs: 16, md: 22 } }} />
        </IconButton>
        
        <IconButton
          onClick={handleNext}
          sx={{ 
            position: 'absolute', right: { xs: -10, md: -25 }, top: '50%', transform: 'translateY(-50%)', 
            bgcolor: '#ffffff', color: '#2d3436', boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            width: { xs: 40, md: 55 }, height: { xs: 40, md: 55 }, zIndex: 5,
            '&:hover': { bgcolor: '#f8f9fa', transform: 'translateY(-50%) scale(1.05)' }, transition: 'all 0.2s'
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: { xs: 16, md: 22 } }} />
        </IconButton>

        {/* Sliding Track Viewport */}
        <Box sx={{ overflow: 'hidden', width: '100%', borderRadius: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
              transform: {
                xs: `translateX(calc(-${currentIndex} * 100%))`,
                sm: `translateX(calc(-${currentIndex} * 50%))`,
                md: `translateX(calc(-${currentIndex} * 33.333%))`,
                lg: `translateX(calc(-${currentIndex} * 25%))`
              }
            }}
          >
            {/* Render 100 copies of the offers array to create the infinite runway */}
            {Array.isArray(offers) && [...Array(100)].map((_, setIndex) => (
              offers.map((offer, index) => {
                const imageUrl = offer.imageUrl?.startsWith('http') 
                  ? offer.imageUrl 
                  : (offer.imageUrl?.startsWith('/uploads') ? `${API_BASE_URL}${offer.imageUrl}` : offer.imageUrl);
                
                const cardColor = CARD_COLORS[index % CARD_COLORS.length];
                const uniqueKey = `copy-${setIndex}-offer-${offer.id}`;

                return (
                  // FIXED CLIPPING ISSUE: Added pt: 8 and pb: 6 to create a "safe zone" inside the hidden overflow
                  <Box 
                    key={uniqueKey} 
                    sx={{ 
                        width: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' }, 
                        flexShrink: 0, 
                        px: 2,
                        pt: 8, // Safe zone for the floating avatar (top: -50px)
                        pb: 6, // Safe zone for the bottom drop-shadow and full card height
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: cardColor,
                        color: '#ffffff',
                        borderRadius: '24px',
                        p: 3,
                        pt: 5,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        flexGrow: 1, // Ensures all cards match heights safely
                        boxShadow: `0 15px 30px ${cardColor}60` // Enhanced shadow for better depth
                      }}
                    >
                      {/* Floating Circular Image */}
                      <Box 
                        sx={{
                          position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)',
                          width: 90, height: 90, borderRadius: '50%',
                          border: '4px solid #ffffff', bgcolor: '#ffffff',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                          display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}
                      >
                        <Avatar 
                          src={imageUrl} 
                          alt={offer.title}
                          sx={{ width: '100%', height: '100%' }}
                          imgProps={{ sx: { objectFit: 'cover' } }}
                        >
                          {!imageUrl && <LocalOfferIcon sx={{ color: '#ccc', fontSize: 35 }} />}
                        </Avatar>
                      </Box>

                      {/* Card Content */}
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, mt: 1, lineHeight: 1.2 }}>
                        {offer.title}
                      </Typography>
                      
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.9 }}>
                          {offer.discountPercentage}% OFF
                        </Typography>
                        <FavoriteBorderIcon sx={{ fontSize: 16, opacity: 0.8 }} />
                      </Stack>

                      {/* Promo Button */}
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.25)',
                          color: '#ffffff',
                          borderRadius: '30px',
                          textTransform: 'none',
                          fontWeight: 700,
                          px: 3,
                          py: 0.8,
                          mt: 'auto', // Pushes button reliably to bottom
                          backdropFilter: 'blur(5px)',
                          boxShadow: 'none',
                          '&:hover': { bgcolor: '#ffffff', color: cardColor, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }
                        }}
                      >
                        {offer.offerCode ? `Code: ${offer.offerCode}` : 'Claim Offer'}
                      </Button>
                    </Paper>
                  </Box>
                );
              })
            ))}
          </Box>
        </Box>

        {/* Dots Indicator */}
        <Box sx={{ position: 'absolute', bottom: -25, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
          {Array.isArray(offers) && offers.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: index === activeDotIndex ? 20 : 8,
                height: 8,
                borderRadius: '10px',
                bgcolor: index === activeDotIndex ? '#eb4d4b' : '#dcdde1',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default OfferCarousel;