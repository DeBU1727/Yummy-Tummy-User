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
import { useDispatch } from 'react-redux';
import { addCartItem } from '../../store/cartSlice'; 
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

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/menu`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we haven't got JSON!");
        }
        return res.json();
      })
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
              const imageSrc = item.image?.startsWith('http') 
                ? item.image 
                : (item.image?.startsWith('/uploads') ? `${API_BASE_URL}${item.image}` : item.image);
              
              return (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <Fade in={true} timeout={600 + (index * 150)}>
                    {/* FIXED CLIPPING ISSUE:
                      Wrapped the Card in a Box with pt: 6 and pb: 4. 
                      This ensures the floating top avatar and the bottom drop shadows
                      have plenty of physical space inside the Grid item to render without being truncated.
                    */}
                    <Box sx={{ 
                      pt: 8, 
                      pb: 4, 
                      display: 'flex', 
                      justifyContent: 'center',
                      width: '100%'
                    }}>
                      <Card 
                        elevation={0}
                        sx={{ 
                          // STRICT WIDTH LOCK
                          width: 280,
                          minWidth: 280,
                          maxWidth: 280,
                          
                          // STRICT HEIGHT LOCK
                          height: 500,
                          minHeight: 500,
                          maxHeight: 500,

                          display: 'flex', 
                          flexDirection: 'column',
                          borderRadius: '60px', // Matches the highly rounded "capsule" look in screenshot
                          boxShadow: '0 20px 40px rgba(0,0,0,0.05)', 
                          border: '1px solid rgba(0,0,0,0.02)',
                          bgcolor: BRAND.surface,
                          overflow: 'visible', 
                          position: 'relative',
                          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          '&:hover': {
                            transform: 'translateY(-12px)',
                            boxShadow: '0 30px 60px rgba(235, 77, 75, 0.12)',
                            '& .food-img': {
                              transform: 'translateY(-8px) scale(1.08) rotate(3deg)',
                            }
                          }
                        }}
                      >
                        {/* Floating Food Image - FIXED SIZE */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: -7, mb: 1, height: 140 }}>
                          <Box 
                            className="food-img"
                            sx={{
                              width: 140,
                              height: 140,
                              borderRadius: '50%',
                              bgcolor: '#fff',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              boxShadow: '0 12px 25px rgba(0,0,0,0.12)',
                              transition: 'all 0.4s ease',
                              p: 0.5,
                              zIndex: 2,
                              border: '4px solid #fff'
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
 
                        <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3, pb: 1, display: 'flex', flexDirection: 'column', px: 4 }}>
                          {/* FIXED HEIGHT TITLE */}
                          <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                              fontWeight: 900, 
                              color: BRAND.text, 
                              lineHeight: 1.2, 
                              mb: 1.5,
                              height: 52, 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: '1.25rem'
                            }}
                          >
                            {item.name}
                          </Typography>
                          
                          {/* FIXED HEIGHT DESCRIPTION */}
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              mb: 2, 
                              height: 64, 
                              overflow: 'hidden', 
                              display: '-webkit-box', 
                              WebkitLineClamp: 3, 
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.5,
                              textOverflow: 'ellipsis',
                              opacity: 0.7,
                              fontWeight: 500
                            }}
                          >
                            {item.description || 'Delicious & freshly prepared with the finest ingredients and authentic spices.'}
                          </Typography>
                          
                          {/* FIXED HEIGHT PRICE SECTION */}
                          <Box sx={{ mt: 'auto', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: BRAND.primary, letterSpacing: '-0.5px' }}>
                              ₹{item.price.toFixed(2)}
                            </Typography>
                          </Box>
                        </CardContent>
 
                        <CardActions sx={{ justifyContent: 'center', pb: 5, pt: 0, height: 90 }}>
                          <Button 
                            variant="contained"
                            startIcon={<AddShoppingCartIcon />}
                            onClick={() => handleAddItem(item)}
                            sx={{ 
                              bgcolor: BRAND.secondary,
                              color: '#fff',
                              borderRadius: '30px',
                              fontWeight: 900,
                              px: 4,
                              py: 1.5,
                              textTransform: 'none',
                              fontSize: '1rem',
                              boxShadow: '0 10px 25px rgba(240, 147, 43, 0.4)',
                              '&:hover': { bgcolor: '#e67e22', transform: 'scale(1.05)', boxShadow: '0 15px 30px rgba(240, 147, 43, 0.5)' },
                              transition: 'all 0.3s'
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