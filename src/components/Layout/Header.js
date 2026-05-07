import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, IconButton, Badge, ToggleButtonGroup, 
  ToggleButton, Box, Menu, MenuItem, Button, Container, Stack, Avatar,
  Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider
} from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    handleClose(); // CLOSE MENU IMMEDIATELY to prevent it from blocking interaction
    setMobileOpen(false);
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

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: BRAND.bg, color: BRAND.text }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={1.5} onClick={() => handleNavigate('/')}>
          <Avatar sx={{ bgcolor: BRAND.primary, width: 32, height: 32 }}>
            <FastfoodIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>Yummy-Tummy</Typography>
        </Stack>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ px: 2, pt: 2 }}>
        {!isMenuPage && (
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              onClick={() => handleNavigate('/menu')}
              sx={{ borderRadius: 2, bgcolor: 'rgba(0,0,0,0.03)' }}
            >
              <ListItemIcon><RestaurantMenuIcon sx={{ color: BRAND.primary }} /></ListItemIcon>
              <ListItemText primary="View Menu" primaryTypographyProps={{ fontWeight: 800 }} />
            </ListItemButton>
          </ListItem>
        )}

        {(isMenuPage || isHomePage) && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', ml: 1, mb: 1, display: 'block', textTransform: 'uppercase' }}>
              Order Method
            </Typography>
            <Stack spacing={1}>
              <Button 
                fullWidth
                variant={orderType === 'DINE_IN' ? 'contained' : 'outlined'}
                onClick={() => { dispatch(setOrderType('DINE_IN')); }}
                startIcon={<LocalDiningIcon />}
                sx={{ 
                  borderRadius: 3, textTransform: 'none', fontWeight: 700, justifyContent: 'flex-start', px: 2,
                  bgcolor: orderType === 'DINE_IN' ? BRAND.primary : 'transparent',
                  color: orderType === 'DINE_IN' ? 'white' : BRAND.text,
                  borderColor: orderType === 'DINE_IN' ? BRAND.primary : 'rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: orderType === 'DINE_IN' ? '#d44646' : 'rgba(0,0,0,0.05)' }
                }}
              >
                Dine-In
              </Button>
              <Button 
                fullWidth
                variant={orderType === 'DELIVERY' ? 'contained' : 'outlined'}
                onClick={() => { dispatch(setOrderType('DELIVERY')); }}
                startIcon={<DeliveryDiningIcon />}
                sx={{ 
                  borderRadius: 3, textTransform: 'none', fontWeight: 700, justifyContent: 'flex-start', px: 2,
                  bgcolor: orderType === 'DELIVERY' ? BRAND.primary : 'transparent',
                  color: orderType === 'DELIVERY' ? 'white' : BRAND.text,
                  borderColor: orderType === 'DELIVERY' ? BRAND.primary : 'rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: orderType === 'DELIVERY' ? '#d44646' : 'rgba(0,0,0,0.05)' }
                }}
              >
                Delivery
              </Button>
            </Stack>
          </Box>
        )}
      </List>
    </Box>
  );

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
          
          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { md: 'none' }, bgcolor: 'rgba(0,0,0,0.03)' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo Section */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1.5} 
            sx={{ cursor: 'pointer', flexGrow: { xs: 1, md: 0 } }} 
            onClick={() => navigate('/')}
          >
            <Avatar sx={{ bgcolor: BRAND.primary, width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 }, boxShadow: '0 4px 10px rgba(235, 77, 75, 0.3)' }}>
              <FastfoodIcon sx={{ fontSize: { xs: 18, md: 22 } }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.5px', color: BRAND.text, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
              Yummy-Tummy
            </Typography>
          </Stack>

          {/* Center Navigation / Toggles - Hidden on Mobile */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
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
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, md: 1 }}>
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
                <ShoppingCartOutlinedIcon fontSize={window.innerWidth < 600 ? "small" : "medium"} />
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
                <PersonOutlineIcon fontSize={window.innerWidth < 600 ? "small" : "medium"} />
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

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderRadius: '0 20px 20px 0' },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
