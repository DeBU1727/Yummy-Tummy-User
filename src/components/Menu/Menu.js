import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Fade,
  Avatar
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem } from '../../store/cartSlice'; 
import { selectIsAuthenticated } from '../../store/authSlice';
import { showNotification } from '../../store/notificationSlice';
import { API_BASE_URL } from '../../config';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

// Branding Palette from Reference
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  surface: '#ffffff',
  text: '#2d3436'
};

const Menu = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/menu`)
      .then((res) => res.json())
      .then((data) => {
        setMenu(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch menu:", err);
        setLoading(false);
      });
  }, []);

  const handleAddItem = (item) => {
    dispatch(addCartItem({ 
      menuItemId: item.id, 
      quantity: 1,
      name: item.name,
      price: item.price,
      image: item.image
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 10 }}>
        <CircularProgress sx={{ color: BRAND.primary, mb: 2 }} />
        <Typography sx={{ fontWeight: 800, color: BRAND.text }}>Loading the kitchen...</Typography>
      </Box>
    );
  }

  if (!menu) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Avatar sx={{ bgcolor: 'rgba(0,0,0,0.05)', color: 'text.disabled', width: 80, height: 80, mx: 'auto', mb: 2 }}>
          <RestaurantMenuIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
          The menu is currently unavailable.
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ py: { xs: 4, md: 6 } }}>
      {Object.entries(menu).map(([category, items]) => (
        <Box key={category} sx={{ mb: { xs: 8, md: 10 } }}>
          
          {/* Category Header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}> {/* Increased bottom margin for breathing room */}
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 900, 
                color: BRAND.text,
                display: 'inline-block',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: 4,
                  bgcolor: BRAND.primary,
                  borderRadius: 2
                }
              }}
            >
              {category}
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 4, md: 6 }}>
            {items.map((item, index) => {
              const imageSrc = item.image?.startsWith('/uploads') ? `${API_BASE_URL}${item.image}` : item.image;
              
              return (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <Fade in={true} timeout={600 + (index * 150)}>
                    {/* FIXED CLIPPING ISSUE:
                      Wrapped the Card in a Box with pt: 6 and pb: 4. 
                      This ensures the floating top avatar and the bottom drop shadows
                      have plenty of physical space inside the Grid item to render without being truncated.
                    */}
                    <Box sx={{ pt: 6, pb: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Card 
                        elevation={0}
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          borderRadius: 6,
                          boxShadow: '0 15px 35px rgba(0,0,0,0.06)', // Deepened shadow
                          border: '1px solid rgba(0,0,0,0.02)',
                          bgcolor: BRAND.surface,
                          overflow: 'visible', // CRITICAL for floating elements
                          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          '&:hover': {
                            transform: 'translateY(-10px)',
                            boxShadow: '0 25px 50px rgba(235, 77, 75, 0.15)',
                            '& .food-img': {
                              transform: 'translateY(-5px) scale(1.05) rotate(2deg)',
                            }
                          }
                        }}
                      >
                        {/* Floating Food Image */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: -7, mb: 1 }}>
                          <Box 
                            className="food-img"
                            sx={{
                              width: 140,
                              height: 140,
                              borderRadius: '50%',
                              bgcolor: BRAND.bg,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                              transition: 'all 0.4s ease',
                              p: 0.5,
                              zIndex: 1
                            }}
                          >
                            <Avatar 
                              src={imageSrc} 
                              alt={item.name}
                              sx={{ width: '100%', height: '100%', bgcolor: 'transparent' }}
                              imgProps={{ sx: { objectFit: 'contain' } }}
                            >
                               {!imageSrc && <RestaurantMenuIcon sx={{ color: '#ccc', fontSize: 50 }} />}
                            </Avatar>
                          </Box>
                        </Box>

                        <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 2, pb: 1 }}>
                          <Typography 
                            gutterBottom 
                            variant="h6" 
                            component="div" 
                            sx={{ fontWeight: 900, color: BRAND.text, lineHeight: 1.2, mb: 1 }}
                          >
                            {item.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2, 
                              height: 40, 
                              overflow: 'hidden', 
                              display: '-webkit-box', 
                              WebkitLineClamp: 2, 
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.4
                            }}
                          >
                            {item.description || 'Delicious & freshly prepared with the finest ingredients.'}
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 900, color: BRAND.primary }}>
                            ₹{item.price.toFixed(2)}
                          </Typography>
                        </CardContent>

                        <CardActions sx={{ justifyContent: 'center', pb: 3, pt: 0 }}>
                          <Button 
                            variant="contained"
                            startIcon={<AddShoppingCartIcon />}
                            onClick={() => handleAddItem(item)}
                            sx={{ 
                              bgcolor: BRAND.secondary,
                              color: '#fff',
                              borderRadius: '30px',
                              fontWeight: 800,
                              px: 3,
                              py: 1,
                              textTransform: 'none',
                              boxShadow: '0 8px 20px rgba(240, 147, 43, 0.3)',
                              '&:hover': { bgcolor: '#e67e22', transform: 'scale(1.05)' },
                              transition: 'all 0.2s'
                            }}
                          >
                            Add
                          </Button>
                        </CardActions>
                      </Card>
                    </Box>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Container>
  );
};

export default Menu;