import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, TextField, Button, Paper, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, 
  Alert, Stack, Avatar, Chip, Fade, Tooltip 
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Header from '../components/Layout/Header';
import api from '../store/api';
import { useDispatch } from 'react-redux';
import { showNotification } from '../store/notificationSlice';

// Branding Palette from Reference
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  surface: '#ffffff',
  text: '#2d3436'
};

const AdminOffers = () => {
  const dispatch = useDispatch();
  const [offers, setOffers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', discountPercentage: '', offerCode: '', imageUrl: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await api.get('/offers');
      setOffers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({ ...offer });
    } else {
      setEditingOffer(null);
      setFormData({ title: '', description: '', discountPercentage: '', offerCode: '', imageUrl: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await api.put(`/offers/${editingOffer.id}`, formData);
        dispatch(showNotification({ message: 'Offer updated successfully!', severity: 'success' }));
      } else {
        await api.post('/offers', formData);
        dispatch(showNotification({ message: 'Offer added successfully!', severity: 'success' }));
      }
      fetchOffers();
      handleClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to save offer.';
      setError(errorMsg);
      dispatch(showNotification({ message: errorMsg, severity: 'error' }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this promotional offer?')) {
      try {
        await api.delete(`/offers/${id}`);
        dispatch(showNotification({ message: 'Offer deleted.', severity: 'info' }));
        fetchOffers();
      } catch (err) {
        dispatch(showNotification({ message: 'Failed to delete offer.', severity: 'error' }));
        console.error(err);
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh', pb: 10 }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 } }}>
        
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: BRAND.primary, width: 50, height: 50, boxShadow: '0 4px 12px rgba(235, 77, 75, 0.3)' }}>
              <LocalOfferIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: BRAND.text }}>
                Manage <span style={{ color: BRAND.primary }}>Offers</span>
              </Typography>
              <Typography variant="body2" color="text.secondary">Oversee all restaurant discount campaigns.</Typography>
            </Box>
          </Stack>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpen()}
            sx={{ 
              bgcolor: BRAND.primary, 
              borderRadius: 4, 
              px: 4, 
              py: 1.5,
              fontWeight: 800,
              textTransform: 'none',
              boxShadow: '0 8px 16px rgba(235, 77, 75, 0.3)',
              '&:hover': { bgcolor: '#d44646' }
            }}
          >
            Add New Offer
          </Button>
        </Box>

        {/* Offers Table */}
        <Fade in timeout={800}>
          <TableContainer component={Paper} sx={{ 
            borderRadius: 8, 
            boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.02)',
            overflow: 'hidden'
          }}>
            <Table>
              <TableHead sx={{ bgcolor: BRAND.surface }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>CAMPAIGN TITLE</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>COUPON CODE</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>DISCOUNT</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary', pr: 4 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ bgcolor: BRAND.surface }}>
                {offers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary', fontStyle: 'italic' }}>
                      No active offers found. Create one to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  offers.map((offer) => (
                    <TableRow key={offer.id} hover sx={{ transition: 'all 0.2s', '&:hover': { bgcolor: '#fffbf2' } }}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          {offer.imageUrl && (
                            <Avatar 
                              src={offer.imageUrl} 
                              variant="rounded" 
                              sx={{ width: 50, height: 50, borderRadius: 2, boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }} 
                            />
                          )}
                          <Typography sx={{ fontWeight: 800, color: BRAND.text }}>{offer.title}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={offer.offerCode || 'NO CODE'} 
                          size="small"
                          sx={{ 
                            fontWeight: 900, 
                            letterSpacing: 1,
                            bgcolor: 'rgba(240, 147, 43, 0.1)', 
                            color: BRAND.secondary,
                            border: `1px dashed ${BRAND.secondary}`
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 900, color: BRAND.primary }}>
                          {offer.discountPercentage}% OFF
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Tooltip title="Edit Campaign">
                          <IconButton 
                            onClick={() => handleOpen(offer)} 
                            sx={{ color: BRAND.secondary, '&:hover': { bgcolor: 'rgba(240, 147, 43, 0.1)' } }}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            onClick={() => handleDelete(offer.id)} 
                            sx={{ color: BRAND.primary, '&:hover': { bgcolor: 'rgba(235, 77, 75, 0.1)' } }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>

        {/* Add/Edit Modal */}
        <Dialog 
          open={open} 
          onClose={handleClose} 
          fullWidth 
          maxWidth="sm"
          PaperProps={{ sx: { borderRadius: 8, p: 2 } }}
        >
          <DialogTitle sx={{ fontWeight: 900, color: BRAND.text, fontSize: '1.5rem' }}>
            {editingOffer ? 'Update Promotional Offer' : 'Create New Offer'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              {error && (
                <Alert 
                  severity="error" 
                  variant="filled" 
                  sx={{ mb: 3, borderRadius: 4, bgcolor: BRAND.primary, '& .MuiAlert-icon': { color: '#fff' } }}
                >
                  {error}
                </Alert>
              )}
              <Stack spacing={3} sx={{ mt: 1 }}>
                <TextField 
                  name="title" label="Campaign Title" fullWidth variant="filled"
                  value={formData.title} onChange={handleChange} required 
                  InputProps={{ disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f5f5f5' } }}
                />
                <TextField 
                  name="description" label="Marketing Description" fullWidth variant="filled" multiline rows={3}
                  value={formData.description} onChange={handleChange} required 
                  InputProps={{ disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f5f5f5' } }}
                />
                <Stack direction="row" spacing={2}>
                  <TextField 
                    name="discountPercentage" label="Discount %" type="number" fullWidth variant="filled"
                    value={formData.discountPercentage} onChange={handleChange} 
                    InputProps={{ disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f5f5f5' } }}
                  />
                  <TextField 
                    name="offerCode" label="Coupon Code" fullWidth variant="filled"
                    value={formData.offerCode} onChange={handleChange} 
                    InputProps={{ disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f5f5f5' }, style: { textTransform: 'uppercase' } }}
                  />
                </Stack>
                <TextField 
                  name="imageUrl" label="Image Banner URL (Optional)" fullWidth variant="filled"
                  value={formData.imageUrl} onChange={handleChange} 
                  InputProps={{ disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f5f5f5' } }}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 4, justifyContent: 'space-between' }}>
              <Button onClick={handleClose} sx={{ fontWeight: 800, color: 'text.secondary' }}>Discard</Button>
              <Button 
                type="submit" 
                variant="contained" 
                sx={{ 
                  bgcolor: BRAND.primary, 
                  borderRadius: 4, 
                  px: 5, 
                  py: 1.5, 
                  fontWeight: 800,
                  '&:hover': { bgcolor: '#d44646' }
                }}
              >
                Save Campaign
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminOffers;