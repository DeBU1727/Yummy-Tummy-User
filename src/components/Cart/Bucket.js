import React, { useEffect } from 'react';
import {
  Drawer, Box, Typography, List, IconButton, Divider, 
  Button, Stack, Avatar
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../../store/authSlice';
import { showNotification } from '../../store/notificationSlice';
import {
  selectCartItems,
  selectCartTotalPrice,
  selectIsCartOpen,
  setCartOpen,
  addCartItem,
  removeCartItem,
  fetchCartItems
} from '../../store/cartSlice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';

// Branding Palette from "Foody" Reference
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  surface: '#ffffff',
  text: '#2d3436'
};

const Bucket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const isOpen = useSelector(selectIsCartOpen);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Fetch cart items when bucket opens, if not already loaded
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isOpen]);

  const handleClose = () => {
    dispatch(setCartOpen(false));
  };

  const handleCheckout = () => {
    handleClose(); // Close the drawer
    if (!isAuthenticated) {
      dispatch(showNotification({ 
        message: 'Please login to proceed with your order.', 
        severity: 'info' 
      }));
      navigate('/login');
    } else {
      navigate('/checkout'); // Navigate to checkout page
    }
  };

  const handleAddItem = (item) => {
    dispatch(addCartItem({ 
      menuItemId: item.menuItemId, 
      quantity: 1,
      name: item.name,
      price: item.price,
      image: item.image
    }));
  };

  const handleRemoveItem = (item) => {
    // Decrement quantity if more than 1, otherwise remove the item
    if (item.quantity > 1) {
        dispatch(addCartItem({ 
          menuItemId: item.menuItemId, 
          quantity: -1,
          name: item.name,
          price: item.price,
          image: item.image
        })); // Decrement quantity
    } else {
        dispatch(removeCartItem(item.menuItemId)); // Remove item if quantity is 1
    }
  };

  return (
    <Drawer 
      anchor="right" 
      open={isOpen} 
      onClose={handleClose}
      PaperProps={{
        sx: { 
          width: { xs: '100%', sm: 400 }, // Full screen on mobile, 400px on desktop
          bgcolor: BRAND.surface,
          borderLeft: '1px solid rgba(0,0,0,0.05)'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation">
        
        {/* Drawer Header */}
        <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: 'rgba(235, 77, 75, 0.1)', color: BRAND.primary, width: 40, height: 40 }}>
              <ShoppingBasketOutlinedIcon />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 900, color: BRAND.text }}>
              Your <span style={{ color: BRAND.primary }}>Bucket</span>
            </Typography>
          </Stack>
          <IconButton 
            onClick={handleClose} 
            sx={{ bgcolor: 'rgba(0,0,0,0.03)', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }}
          >
            <CloseIcon sx={{ color: BRAND.text }} />
          </IconButton>
        </Box>
        
        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* Scrollable Cart Items Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
          {items.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.7 }}>
              <ShoppingBasketOutlinedIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>Your bucket is empty</Typography>
              <Typography variant="body2" sx={{ color: 'text.disabled', mt: 1 }}>Add some delicious items to get started!</Typography>
              <Button 
                variant="outlined" 
                onClick={handleClose}
                sx={{ mt: 3, borderRadius: '30px', fontWeight: 700, color: BRAND.text, borderColor: '#ddd' }}
              >
                Browse Menu
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {items.map((item) => (
                <Box 
                  key={item.id} 
                  sx={{ 
                    mb: 3, p: 2, 
                    borderRadius: 4, 
                    bgcolor: BRAND.bg, 
                    border: '1px solid rgba(0,0,0,0.03)',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.04)', transform: 'translateY(-2px)' }
                  }}
                >
                  <Box sx={{ pr: 2 }}>
                    <Typography sx={{ fontWeight: 800, color: BRAND.text, lineHeight: 1.2, mb: 0.5 }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ fontWeight: 900, color: BRAND.primary }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>

                  {/* Modern Pill-Shaped Quantity Controls */}
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    sx={{ 
                      bgcolor: BRAND.surface, 
                      borderRadius: '30px', 
                      border: '1px solid #ebebeb',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                  >
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveItem(item)} 
                      sx={{ color: item.quantity === 1 ? 'error.main' : BRAND.text, p: 1 }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    
                    <Typography sx={{ px: 1, fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    
                    <IconButton 
                      size="small" 
                      onClick={() => handleAddItem(item)} 
                      sx={{ color: BRAND.primary, p: 1 }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              ))}
            </List>
          )}
        </Box>

        {/* Sticky Footer for Total & Checkout */}
        <Box sx={{ p: 3, pt: 2, bgcolor: BRAND.surface, boxShadow: '0 -10px 20px rgba(0,0,0,0.03)', zIndex: 10 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>
              Grand Total
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: BRAND.primary }}>
              ₹{totalPrice.toFixed(2)}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            fullWidth 
            disabled={items.length === 0}
            onClick={handleCheckout}
            sx={{ 
              py: 1.8, 
              borderRadius: '30px', 
              fontWeight: 800, 
              fontSize: '1.05rem',
              textTransform: 'none',
              bgcolor: BRAND.primary,
              boxShadow: '0 10px 20px rgba(235, 77, 75, 0.3)',
              '&:hover': { bgcolor: '#d44646', transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(235, 77, 75, 0.4)' },
              '&:disabled': { bgcolor: '#f0f0f0', color: '#aaa' },
              transition: 'all 0.3s'
            }}
          >
            {items.length === 0 ? 'Bucket is Empty' : 'Proceed to Checkout'}
          </Button>
        </Box>

      </Box>
    </Drawer>
  );
};

export default Bucket;