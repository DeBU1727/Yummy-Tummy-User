import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, IconButton, Badge, ToggleButtonGroup, 
  ToggleButton, Box, Menu, MenuItem, Button, Container, Stack, Avatar,
  Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, useMediaQuery, useTheme
} from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuIcon from '@mui/icons-material/Menu';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectCartTotalItems, toggleCart } from '../../store/cartSlice';
import { setOrderType, selectOrderType } from '../../store/orderSlice';
import { selectIsAuthenticated, selectIsAdmin, logoutUser } from '../../store/authSlice';
import { confirmAction } from './ConfirmationDialog';
import { BRAND } from '../../theme';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
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
    handleClose(); 
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

  const isMenuPage = location.pathname === '/menu';
  const isHomePage = location.pathname === '/';

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: BRAND.primary, width: 35, height: 35 }}>
          <FastfoodIcon sx={{ fontSize: 20 }} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 900, color: BRAND.text }}>
          Yummy-Tummy
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1 }}>
        <ListItem button onClick={() => handleNavigate('/menu')} sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon><RestaurantMenuIcon sx={{ color: BRAND.primary }} /></ListItemIcon>
          <ListItemText primary="Our Menu" primaryTypographyProps={{ fontWeight: 700 }} />
        </ListItem>
        
        {(isMenuPage || isHomePage) && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="caption" sx={{ mb: 1, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                Order Type
              </Typography>
              <ToggleButtonGroup
                value={orderType}
                exclusive
                onChange={handleOrderTypeChange}
                fullWidth
                sx={{ 
                  bgcolor: 'rgba(0,0,0,0.03)',
                  borderRadius: '12px',
                  p: 0.5,
                  '& .MuiToggleButtonGroup-grouped': {
                    border: 0,
                    borderRadius: '10px !important',
                  }
                }}
              >
                <ToggleButton value="DINE_IN" sx={{ py: 1, fontWeight: 700, textTransform: 'none', '&.Mui-selected': { bgcolor: BRAND.primary, color: 'white' } }}>
                  Dine-In
                </ToggleButton>
                <ToggleButton value="DELIVERY" sx={{ py: 1, fontWeight: 700, textTransform: 'none', '&.Mui-selected': { bgcolor: BRAND.primary, color: 'white' } }}>
                  Delivery
                </ToggleButton>
              </ToggleButtonGroup>
            </ListItem>
          </>
        )}
      </List>
      <Divider sx={{ mt: 'auto' }} />
      <List sx={{ px: 1 }}>
        <ListItem button onClick={() => handleNavigate('/help-center')} sx={{ borderRadius: 2 }}>
          <ListItemText primary="Help Center" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'rgba(255, 250, 240, 0.85)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.03)',
        color: BRAND.text,
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          
          {/* Left: Mobile Menu Toggle & Logo */}
          <Stack direction="row" alignItems="center" spacing={isMobile ? 0.5 : 1.5}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1.5} 
              sx={{ cursor: 'pointer' }} 
              onClick={() => navigate('/')}
            >
              <Avatar sx={{ bgcolor: BRAND.primary, width: isExtraSmall ? 32 : 40, height: isExtraSmall ? 32 : 40, boxShadow: '0 4px 10px rgba(235, 77, 75, 0.3)' }}>
                <FastfoodIcon sx={{ fontSize: isExtraSmall ? 18 : 22 }} />
              </Avatar>
              {!isExtraSmall && (
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 900, letterSpacing: '-0.5px', color: BRAND.text }}>
                  Yummy-Tummy
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Center: Desktop Navigation */}
          {!isMobile && (
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
          )}

          {/* Right: Actions */}
          <Stack direction="row" alignItems="center" spacing={isMobile ? 0.5 : 1}>
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
