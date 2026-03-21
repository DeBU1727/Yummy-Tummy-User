import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import AdminOffers from './pages/AdminOffers';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import HelpCenter from './pages/HelpCenter';
import StaticInfoPage from './pages/StaticInfoPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Notification from './components/Layout/Notification';
import ConfirmationDialog from './components/Layout/ConfirmationDialog';
import Bucket from './components/Cart/Bucket';
import Footer from './components/Layout/Footer';

const AppContent = () => {
  const location = useLocation();
  const noFooterPaths = ['/forgot-password', '/reset-password'];
  const showFooter = !noFooterPaths.includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Notification />
      <ConfirmationDialog />
      <Bucket />
      
      <Box sx={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/help-center" element={<HelpCenter />} />
          
          <Route path="/about" element={<StaticInfoPage title="About Us">
            <p>Welcome to Foody! We are passionate about bringing the best local flavors directly to your table. Founded in 2026, our mission has always been to provide high-quality, delicious meals with the convenience of modern technology.</p>
            <p>Our chefs use only the freshest ingredients to ensure every bite is a memorable one. Whether you're dining in or ordering delivery, we guarantee a premium experience.</p>
          </StaticInfoPage>} />
          
          <Route path="/team" element={<StaticInfoPage title="Our Team">
            <p>Behind every great meal is a dedicated team. Our staff consists of world-class chefs, efficient delivery partners, and friendly support staff who work around the clock to serve you better.</p>
          </StaticInfoPage>} />
          
          <Route path="/careers" element={<StaticInfoPage title="Careers">
            <p>Want to join the Foody family? We're always looking for talented individuals who share our love for food and service. Send your resume to careers@foody.com and let's grow together!</p>
          </StaticInfoPage>} />
          
          <Route path="/contact" element={<StaticInfoPage title="Contact">
            <p>You can reach us at our main office:</p>
            <p><strong>Address:</strong> 123 Foodie Street, Gourmet City, NY 10001</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Email:</strong> info@foody.com</p>
          </StaticInfoPage>} />
          
          <Route path="/terms" element={<StaticInfoPage title="Terms of Service">
            <p>By using our services, you agree to comply with our standard terms. We prioritize fair use, security, and respect for our community of food lovers.</p>
          </StaticInfoPage>} />
          
          <Route path="/privacy" element={<StaticInfoPage title="Privacy Policy">
            <p>Your privacy is important to us. We collect only the necessary data to process your orders and improve your experience. We never sell your personal information to third parties.</p>
          </StaticInfoPage>} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/admin/offers" element={<AdminOffers />} />
          </Route>
        </Routes>
      </Box>

      {showFooter && <Footer />}
    </Box>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
