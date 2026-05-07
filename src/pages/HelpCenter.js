import React, { useState } from 'react';
import { 
  Box, Container, Typography, TextField, Button, Grid, 
  Paper, Alert, Stack, Fade, Avatar 
} from '@mui/material';
import Header from '../components/Layout/Header';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import api from '../store/api';

// Branding Palette matching the "Foody" Reference
const BRAND = {
  primary: '#eb4d4b',    // Coral Red
  secondary: '#f0932b',  // Golden Orange
  bg: '#fffaf0',         // Soft Cream
  surface: '#ffffff',
  text: '#2d3436'
};

const HelpCenter = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      await api.post('/support/message', formData);
      setStatus({ type: 'success', msg: 'Thank you! Your message has been sent. Our team will contact you soon.' });
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to send message. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh', pb: 10 }}>
      <Header />
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 8 } }}>
        <Fade in={true} timeout={800}>
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
            
            {/* Left Info Section */}
            <Grid item xs={12} md={5}>
              <Stack spacing={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: BRAND.primary, 
                      width: 60, 
                      height: 60, 
                      boxShadow: '0 8px 20px rgba(235, 77, 75, 0.3)' 
                    }}
                  >
                    <SupportAgentIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: BRAND.text, letterSpacing: '-0.5px' }}>
                    Help <span style={{ color: BRAND.primary }}>Center</span>
                  </Typography>
                </Box>
                
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.1rem', fontWeight: 500 }}>
                  Have questions about your order, our menu, or anything else? We're here to help! Fill out the form, and our support team will get back to you within 24 hours.
                </Typography>
                
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(240, 147, 43, 0.1)', color: BRAND.secondary, width: 45, height: 45 }}>
                      <AccessTimeOutlinedIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: BRAND.text }}>Working Hours</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Monday - Sunday: 10:00 AM - 11:00 PM</Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(240, 147, 43, 0.1)', color: BRAND.secondary, width: 45, height: 45 }}>
                      <PhoneOutlinedIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: BRAND.text }}>Phone Support</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>+91 7319001727</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(240, 147, 43, 0.1)', color: BRAND.secondary, width: 45, height: 45 }}>
                      <EmailOutlinedIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: BRAND.text }}>Email Support</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>gdebanshu1727@gmail.com</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            {/* Right Form Section */}
            <Grid item xs={12} md={7}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 3, sm: 5 }, 
                  borderRadius: 6, 
                  border: '1px solid rgba(0,0,0,0.02)', 
                  boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
                  bgcolor: BRAND.surface
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, color: BRAND.text }}>
                  Send us a Message
                </Typography>
                
                {status.msg && (
                  <Alert 
                    severity={status.type} 
                    variant="filled"
                    sx={{ 
                      mb: 4, 
                      borderRadius: 4, 
                      bgcolor: status.type === 'error' ? BRAND.primary : '#22c55e',
                      '& .MuiAlert-icon': { color: '#fff' }
                    }}
                  >
                    {status.msg}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="filled"
                      InputProps={{ disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f8f9fa' } }}
                    />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          variant="filled"
                          InputProps={{ disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f8f9fa' } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          variant="filled"
                          InputProps={{ disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f8f9fa' } }}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={4}
                      variant="filled"
                      InputProps={{ disableUnderline: true, sx: { borderRadius: 4, bgcolor: '#f8f9fa' } }}
                    />
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large" 
                      disabled={loading}
                      sx={{ 
                        py: 1.8, 
                        fontWeight: 800, 
                        borderRadius: '30px',
                        fontSize: '1.05rem',
                        textTransform: 'none',
                        bgcolor: BRAND.primary,
                        boxShadow: '0 8px 20px rgba(235, 77, 75, 0.3)',
                        '&:hover': { bgcolor: '#d44646', transform: 'translateY(-2px)', boxShadow: '0 12px 25px rgba(235, 77, 75, 0.4)' },
                        transition: 'all 0.3s',
                        mt: 2
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default HelpCenter;