import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Stack, Divider, Link } from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link as RouterLink } from 'react-router-dom';
import { BRAND } from '../../theme';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: BRAND.bg, 
        borderTop: '1px solid rgba(0,0,0,0.05)',
        pt: { xs: 6, md: 10 },
        pb: 4,
        mt: 'auto' 
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mb: { xs: 4, md: 8 } }}>
          
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }} textAlign={{ xs: 'center', md: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ bgcolor: BRAND.primary, p: 1, borderRadius: 2, display: 'flex' }}>
                  <FastfoodIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: BRAND.text, letterSpacing: '-0.5px' }}>
                  Yummy-Tummy
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, maxWidth: 300, fontWeight: 500 }}>
                Delivering deliciousness to your doorstep since 2026. Your favorite local food, prepared with love and served with a smile.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton 
                  component="a"
                  href="https://github.com/DeBU1727"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: BRAND.text, 
                    bgcolor: 'rgba(0,0,0,0.04)',
                    '&:hover': { bgcolor: BRAND.primary, color: '#fff', transform: 'translateY(-2px)' },
                    transition: 'all 0.2s',
                    width: 40, height: 40
                  }}
                >
                  <GitHubIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  component="a"
                  href="https://www.linkedin.com/in/debanshu-g"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: BRAND.text, 
                    bgcolor: 'rgba(0,0,0,0.04)',
                    '&:hover': { bgcolor: BRAND.primary, color: '#fff', transform: 'translateY(-2px)' },
                    transition: 'all 0.2s',
                    width: 40, height: 40
                  }}
                >
                  <LinkedInIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>
 
          {/* Quick Links / Company */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3, textTransform: 'uppercase', color: BRAND.text, textAlign: { xs: 'center', md: 'left' } }}>
              Company
            </Typography>
            <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }}>
              <Link component={RouterLink} to="/about" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, transition: 'color 0.2s', '&:hover': { color: BRAND.primary } }}>About Us</Link>
              <Link component={RouterLink} to="/team" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, transition: 'color 0.2s', '&:hover': { color: BRAND.primary } }}>Our Team</Link>
              <Link component={RouterLink} to="/careers" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, transition: 'color 0.2s', '&:hover': { color: BRAND.primary } }}>Careers</Link>
              <Link component={RouterLink} to="/contact" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, transition: 'color 0.2s', '&:hover': { color: BRAND.primary } }}>Contact</Link>
            </Stack>
          </Grid>
 
          {/* Support */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3, textTransform: 'uppercase', color: BRAND.text, textAlign: { xs: 'center', md: 'left' } }}>
              Support
            </Typography>
            <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }}>
              <Link component={RouterLink} to="/help-center" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, transition: 'color 0.2s', '&:hover': { color: BRAND.primary } }}>Help Center</Link>
              <Link component={RouterLink} to="/terms" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, transition: 'color 0.2s', '&:hover': { color: BRAND.primary } }}>Terms of Service</Link>
              <Link component={RouterLink} to="/privacy" underline="none" sx={{ color: 'text.secondary', fontWeight: 600, transition: 'color 0.2s', '&:hover': { color: BRAND.primary } }}>Privacy Policy</Link>
            </Stack>
          </Grid>
 
          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3, textTransform: 'uppercase', color: BRAND.text, textAlign: { xs: 'center', md: 'left' } }}>
              Contact Us
            </Typography>
            <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }} textAlign={{ xs: 'center', md: 'left' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <strong style={{ color: BRAND.text }}>Address:</strong> 123 Foodie Street, Kolkata, Kolkata-700091
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <strong style={{ color: BRAND.text }}>Phone:</strong> +91 7319001727
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <strong style={{ color: BRAND.text }}>Email:</strong> gdebanshu1727@gmail.com
              </Typography>
            </Stack>
          </Grid>
        </Grid>
 
        <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />
 
        {/* Copyright Bottom Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            © 2026 Foody Inc. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Made with ❤️ for food lovers.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;