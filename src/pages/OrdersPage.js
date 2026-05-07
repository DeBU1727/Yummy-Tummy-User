import React, { useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress, 
  Alert, Button, IconButton, Fade, Stack, Avatar 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders, selectUserOrders, selectOrderLoading, cancelUserOrder, deleteUserOrder } from '../store/orderSlice';
import Header from '../components/Layout/Header';
import { confirmAction } from '../components/Layout/ConfirmationDialog';

// Branding Palette from "Foody" Reference
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  surface: '#ffffff',
  text: '#2d3436'
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector((state) => state.order.error);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleCancel = async (orderId) => {
    const confirmed = await confirmAction(dispatch, 'Cancel Order', 'Are you sure you want to cancel this order? This action cannot be undone.');
    if (confirmed) {
      dispatch(cancelUserOrder(orderId));
    }
  };

  const handleDelete = async (orderId) => {
    const confirmed = await confirmAction(dispatch, 'Delete History', 'Are you sure you want to remove this order from your history permanently?');
    if (confirmed) {
      dispatch(deleteUserOrder(orderId));
    }
  };

  // Upgraded to return custom premium style objects instead of basic MUI color strings
  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return { bg: '#fff7ed', text: '#ea580c', border: '#ffedd5' };
      case 'ACCEPTED':
      case 'PREPARING': return { bg: '#eff6ff', text: '#0369a1', border: '#e0f2fe' };
      case 'READY':
      case 'SERVED':
      case 'DELIVERED': return { bg: '#ecfdf5', text: '#15803d', border: '#d1fae5' };
      case 'OUT_FOR_DELIVERY': return { bg: '#f5f3ff', text: '#7e22ce', border: '#ede9fe' };
      case 'REJECTED':
      case 'CANCELLED': return { bg: '#fef2f2', text: '#b91c1c', border: '#fee2e2' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh', pb: 10 }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 } }}>
        <Fade in={true} timeout={800}>
          <Box>
            {/* Page Header */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Avatar sx={{ bgcolor: BRAND.primary, width: 50, height: 50, boxShadow: '0 4px 12px rgba(235, 77, 75, 0.3)' }}>
                <ReceiptLongIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: BRAND.text }}>
                  My <span style={{ color: BRAND.primary }}>Orders</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track, view, and manage your delicious history.
                </Typography>
              </Box>
            </Stack>

            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
                <CircularProgress sx={{ color: BRAND.primary }} />
                <Typography sx={{ mt: 2, fontWeight: 700, color: BRAND.primary }}>Fetching your orders...</Typography>
              </Box>
            ) : error ? (
              <Alert 
                severity="error" 
                variant="filled"
                sx={{ borderRadius: 4, bgcolor: BRAND.primary, '& .MuiAlert-icon': { color: '#fff' } }}
              >
                {error}
              </Alert>
            ) : orders.length === 0 ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 6, textAlign: 'center', borderRadius: 6, bgcolor: BRAND.surface, 
                  border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' 
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: BRAND.text, mb: 1 }}>No orders yet!</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>Looks like you haven't made your first order.</Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/')}
                  sx={{ 
                    bgcolor: BRAND.primary, borderRadius: '30px', px: 4, py: 1.5, fontWeight: 800,
                    boxShadow: '0 8px 20px rgba(235, 77, 75, 0.3)', '&:hover': { bgcolor: '#d44646' } 
                  }}
                >
                  Explore Menu
                </Button>
              </Paper>
            ) : (
              <TableContainer 
                component={Paper} 
                sx={{ 
                  borderRadius: 6, 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.02)',
                  bgcolor: BRAND.surface,
                  overflow: 'hidden'
                }}
              >
                <Table>
                  <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>ORDER ID</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>DATE & TIME</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>TYPE</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>STATUS</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary' }}>TOTAL</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 800, color: 'text.secondary' }}>ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => {
                      const statusStyle = getStatusStyle(order.orderStatus);
                      
                      return (
                        <TableRow key={order.id} hover sx={{ transition: 'all 0.2s', '&:hover': { bgcolor: '#fffbf2' } }}>
                          <TableCell sx={{ fontWeight: 900, color: BRAND.text }}>#{order.id}</TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={order.orderType} 
                              size="small" 
                              sx={{ 
                                fontWeight: 800, 
                                letterSpacing: 0.5,
                                bgcolor: order.orderType === 'DELIVERY' ? 'rgba(235, 77, 75, 0.1)' : 'rgba(240, 147, 43, 0.1)',
                                color: order.orderType === 'DELIVERY' ? BRAND.primary : BRAND.secondary,
                                border: `1px solid ${order.orderType === 'DELIVERY' ? 'rgba(235, 77, 75, 0.3)' : 'rgba(240, 147, 43, 0.3)'}`
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={formatStatus(order.orderStatus)} 
                              size="small" 
                              sx={{ 
                                fontWeight: 800,
                                bgcolor: statusStyle.bg,
                                color: statusStyle.text,
                                border: `1px solid ${statusStyle.border}`
                              }} 
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 900, color: BRAND.primary }}>
                            ₹{order.totalPrice.toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                              <IconButton 
                                onClick={() => navigate(`/orders/${order.id}`)}
                                sx={{ color: BRAND.secondary, bgcolor: 'rgba(240, 147, 43, 0.1)', '&:hover': { bgcolor: 'rgba(240, 147, 43, 0.2)' } }}
                                title="View Details"
                                size="small"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              
                              {order.orderStatus === 'PENDING' && (
                                <Button 
                                  size="small" 
                                  variant="outlined"
                                  onClick={() => handleCancel(order.id)}
                                  sx={{ 
                                    borderRadius: '20px', textTransform: 'none', fontWeight: 700,
                                    borderColor: 'error.main', color: 'error.main',
                                    '&:hover': { bgcolor: 'error.50', borderColor: 'error.dark' }
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                              
                              {(order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED' || order.orderStatus === 'SERVED' || order.orderStatus === 'REJECTED') && (
                                <Button 
                                  size="small" 
                                  variant="contained"
                                  onClick={() => handleDelete(order.id)}
                                  sx={{ 
                                    borderRadius: '20px', textTransform: 'none', fontWeight: 700,
                                    bgcolor: '#f1f2f6', color: 'text.secondary', boxShadow: 'none',
                                    '&:hover': { bgcolor: 'error.main', color: '#fff', boxShadow: '0 4px 10px rgba(220, 53, 69, 0.3)' }
                                  }}
                                >
                                  Delete
                                </Button>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default OrdersPage;