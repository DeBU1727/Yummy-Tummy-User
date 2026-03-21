import React from 'react';
import { Box, Container, Typography, Paper, Divider } from '@mui/material';
import Header from '../components/Layout/Header';

const StaticInfoPage = ({ title, children }) => {
  return (
    <Box>
      <Header />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: 'primary.main' }}>
            {title}
          </Typography>
          <Divider sx={{ mb: 4, width: 60, height: 4, bgcolor: 'secondary.main', borderRadius: 2 }} />
          <Box sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            {children}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default StaticInfoPage;
