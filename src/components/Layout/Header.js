import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, IconButton, Badge, ToggleButtonGroup, 
  ToggleButton, Box, Menu, MenuItem, Button, Container, Stack, Avatar 
} from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectCartTotalItems, toggleCart } from '../../store/cartSlice';
import { setOrderType, selectOrderType } from '../../store/orderSlice';
import { selectIsAuthenticated, selectIsAdmin, logoutUser } from '../../store/authSlice';
import { confirmAction } from './ConfirmationDialog';

// Branding Palette from "Foody" Reference
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  surface: '#ffffff',
  text: '#2d3436'
};

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useSelector(selectCartTotalItems);
  const orderType = useSelector(selectOrderType);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = async () => {
    handleClose(); // CLOSE MENU IMMEDIATELY to prevent it from blocking interaction
    const confirmed = await confirmAction(dispatch, 'Logout', 'Are you sure you want to log out?');
    if (confirmed) {
      dispatch(logoutUser()).then(() => {
        navigate('/');
      });
    }
  };

  const handleOrderTypeChange = (event, newOrderType) => {
    if (newOrderType !== null) {
      dispatch(setOrderType(newOrderType));
    }
  };

  // Visibility logic
  const isMenuPage = location.pathname === '/menu';
  const isHomePage = location.pathname === '/';

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'rgba(255, 250, 240, 0.85)', // Cream background with transparency
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.03)',
        color: BRAND.text,
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          
          {/* Logo Section */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1.5} 
            sx={{ cursor: 'pointer' }} 
            onClick={() => navigate('/')}
          >
            <Avatar sx={{ bgcolor: BRAND.primary, width: 40, height: 40, boxShadow: '0 4px 10px rgba(235, 77, 75, 0.3)' }}>
              <FastfoodIcon sx={{ fontSize: 22 }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.5px', color: BRAND.text }}>
              Yummy-Tummy
            </Typography>
          </Stack>

          {/* Center Navigation / Toggles */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMenuPage && (
              <Button 
                onClick={() => navigate('/menu')} 
                sx={{ 
                  color: BRAND.text, 
                  fontWeight: 800, 
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderRadius: 3,
                  px: 3,
                  mr: 2,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
              >
                Menu
              </Button>
            )}

            {(isMenuPage || isHomePage) && (
              <ToggleButtonGroup
                value={orderType}
                exclusive
                onChange={handleOrderTypeChange}
                aria-label="order type"
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  bgcolor: '#ffffff',
                  borderRadius: '30px',
                  p: 0.5,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                  '& .MuiToggleButtonGroup-grouped': {
                    border: 0,
                    '&:not(:first-of-type)': { borderRadius: '30px' },
                    '&:first-of-type': { borderRadius: '30px' }
                  }
                }}
              >
                <ToggleButton 
                  value="DINE_IN" 
                  aria-label="dine-in" 
                  sx={{ 
                    px: 3, py: 0.8, fontWeight: 700, textTransform: 'none', color: 'text.secondary',
                    '&.Mui-selected': { bgcolor: BRAND.primary, color: 'white', '&:hover': { bgcolor: '#d44646' } }
                  }}
                >
                  Dine-In
                </ToggleButton>
                <ToggleButton 
                  value="DELIVERY" 
                  aria-label="delivery" 
                  sx={{ 
                    px: 3, py: 0.8, fontWeight: 700, textTransform: 'none', color: 'text.secondary',
                    '&.Mui-selected': { bgcolor: BRAND.primary, color: 'white', '&:hover': { bgcolor: '#d44646' } }
                  }}
                >
                  Delivery
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>

          {/* Right Action Icons */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton 
              onClick={() => dispatch(toggleCart())}
              sx={{ color: BRAND.text, bgcolor: 'rgba(0,0,0,0.03)', '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' } }}
            >
              <Badge 
                badgeContent={totalItems} 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    bgcolor: BRAND.secondary, 
                    color: 'white', 
                    fontWeight: 800,
                    boxShadow: '0 2px 5px rgba(240, 147, 43, 0.4)'
                  } 
                }}
              >
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>

            <Box>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ 
                  color: isAuthenticated ? 'white' : BRAND.text, 
                  bgcolor: isAuthenticated ? BRAND.primary : 'rgba(0,0,0,0.03)', 
                  boxShadow: isAuthenticated ? '0 4px 10px rgba(235, 77, 75, 0.3)' : 'none',
                  '&:hover': { bgcolor: isAuthenticated ? '#d44646' : 'rgba(0,0,0,0.06)' } 
                }}
              >
                <PersonOutlineIcon />
              </IconButton>
              
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    minWidth: 180,
                    '& .MuiMenuItem-root': {
                      py: 1.5,
                      fontWeight: 600,
                      color: BRAND.text,
                      borderRadius: 2,
                      mx: 1,
                      mb: 0.5,
                      '&:hover': { bgcolor: 'rgba(235, 77, 75, 0.08)', color: BRAND.primary }
                    }
                  }
                }}
              >
                {isAuthenticated ? (
                  <Box>
                    {isAdmin && <MenuItem onClick={() => handleNavigate('/admin/offers')}>Manage Offers</MenuItem>}
                    <MenuItem onClick={() => handleNavigate('/profile')}>Profile</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/orders')}>Orders</MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main !important' }}>Logout</MenuItem>
                  </Box>
                ) : (
                  <Box>
                    <MenuItem onClick={() => handleNavigate('/login')}>Sign In</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/register')}>Create Account</MenuItem>
                  </Box>
                )}
              </Menu>
            </Box>
          </Stack>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
