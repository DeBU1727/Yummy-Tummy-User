import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { 
    Box, Typography, Container, Button, TextField, CircularProgress, 
    Alert, Avatar, Paper, Stack, Fade, Link, InputAdornment, IconButton 
} from '@mui/material';
import { fetchUserProfile, selectUserProfile, updateUserProfile } from '../store/userSlice';
import api from '../store/api';
import { API_BASE_URL } from '../config';
import Header from '../components/Layout/Header';
import OtpDialog from '../components/Auth/OtpDialog';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import BadgeIcon from '@mui/icons-material/Badge';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const BRAND = {
    primary: '#eb4d4b',
    secondary: '#f0932b',
    bg: '#fffaf0',
    surface: '#ffffff',
    text: '#2d3436'
};

const ProfilePage = () => {
    const dispatch = useDispatch();
    const profile = useSelector(selectUserProfile);
    const { loading, error } = useSelector((state) => state.user);

    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setName(profile.fullName);
        }
    }, [profile]);

    const handleNameUpdate = (e) => {
        e.preventDefault();
        dispatch(updateUserProfile({ fullName: name }));
    };

    const handlePasswordUpdate = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        if (!currentPassword || !newPassword) {
            setPasswordError('Both password fields are required.');
            return;
        }
        
        if (newPassword.length < 8 || newPassword.length > 16) {
            setPasswordError('New password must be between 8 and 16 characters long.');
            return;
        }

        try {
            const response = await api.put('/user/password', { currentPassword, newPassword });
            if (response.status === 202) {
                setShowOtpDialog(true);
            } else {
                setPasswordSuccess('Password updated successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setFailedAttempts(0);
            }
        } catch (err) {
            if (err.response?.status === 202) {
                setShowOtpDialog(true);
            } else {
                if (err.response?.status === 400 && err.response?.data?.message === 'Incorrect current password.') {
                    setPasswordError('Incorrect current password.');
                } else {
                    const errorMsg = err.response?.data?.message || err.response?.data || 'Failed to update password.';
                    setPasswordError(typeof errorMsg === 'string' ? errorMsg : 'An error occurred');
                }
                setFailedAttempts(prev => prev + 1);
            }
        }
    };

    const handleOtpSuccess = () => {
        setShowOtpDialog(false);
        handlePasswordUpdate({ preventDefault: () => {} });
    };
    
    const handleFileSelect = (event) => {
        setUploadError('');
        const file = event.target.files[0];
        
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setUploadError('Only JPEG, JPG, and PNG files are allowed.');
                setSelectedFile(null);
                event.target.value = '';
                return;
            }
            setSelectedFile(file);
        }
    };

    const handlePictureUpload = async () => {
        if (!selectedFile) return;
        setUploadError('');
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
             await api.post('/user/profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch(fetchUserProfile());
            setSelectedFile(null);
        } catch (err) {
            console.error("Failed to upload file", err);
            setUploadError('Failed to upload profile picture. Please try again.');
        }
    };

    if (loading && !profile) {
        return (
            <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh' }}>
                <Header />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 15 }}>
                    <CircularProgress sx={{ color: BRAND.primary }} />
                    <Typography sx={{ mt: 2, fontWeight: 700, color: BRAND.primary }}>Loading Profile...</Typography>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh' }}>
                <Header />
                <Container maxWidth="md" sx={{ mt: 8 }}>
                    <Alert severity="error" sx={{ borderRadius: 4 }}>{error}</Alert>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: BRAND.bg, minHeight: '100vh', pb: 10 }}>
            <Header />
            <Container maxWidth="md" sx={{ mt: { xs: 4, md: 6 } }}>
                <Fade in={true} timeout={800}>
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                            <Avatar sx={{ bgcolor: BRAND.primary, width: 50, height: 50, boxShadow: '0 4px 12px rgba(235, 77, 75, 0.3)' }}>
                                <ManageAccountsIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" component="h1" sx={{ fontWeight: 900, color: BRAND.text }}>
                                    User <span style={{ color: BRAND.primary }}>Profile</span>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage your account settings and preferences.
                                </Typography>
                            </Box>
                        </Stack>

                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 4, mb: 4, 
                                borderRadius: 6, 
                                backgroundColor: BRAND.surface,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                                border: '1px solid rgba(0,0,0,0.02)'
                            }}
                        >
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
                                <Avatar
                                    src={profile?.profilePicturePath ? (profile.profilePicturePath.startsWith('http') ? profile.profilePicturePath : `${API_BASE_URL}${profile.profilePicturePath}`) : ''}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                        border: `4px solid ${BRAND.bg}`
                                    }}
                                />                                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Profile Picture</Typography>
                                    <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', sm: 'flex-start' }} alignItems="center" flexWrap="wrap" useFlexGap sx={{ gap: 2 }}>
                                        <input
                                            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                            style={{ display: 'none' }}
                                            id="raised-button-file"
                                            type="file"
                                            onChange={handleFileSelect}
                                        />
                                        <label htmlFor="raised-button-file">
                                            <Button 
                                                variant="outlined" 
                                                component="span"
                                                startIcon={<CloudUploadIcon />}
                                                sx={{ 
                                                    borderRadius: '30px', 
                                                    textTransform: 'none', 
                                                    fontWeight: 700,
                                                    color: BRAND.secondary,
                                                    borderColor: BRAND.secondary,
                                                    '&:hover': { borderColor: BRAND.primary, color: BRAND.primary }
                                                }}
                                            >
                                                {selectedFile ? 'Change File' : 'Choose Picture'}
                                            </Button>
                                        </label>
                                        
                                        {selectedFile && (
                                            <Button 
                                                onClick={handlePictureUpload} 
                                                variant="contained" 
                                                sx={{ 
                                                    borderRadius: '30px', 
                                                    bgcolor: BRAND.primary, 
                                                    fontWeight: 800,
                                                    boxShadow: '0 6px 15px rgba(235, 77, 75, 0.3)',
                                                    '&:hover': { bgcolor: '#d44646' }
                                                }}
                                            >
                                                Upload New
                                            </Button>
                                        )}
                                    </Stack>
                                    {selectedFile && (
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                            Selected: {selectedFile.name}
                                        </Typography>
                                    )}
                                    {uploadError && (
                                        <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }}>
                                            {uploadError}
                                        </Alert>
                                    )}
                                </Box>
                            </Stack>
                        </Paper>

                        <Paper 
                            component="form" 
                            onSubmit={handleNameUpdate} 
                            elevation={0} 
                            sx={{ 
                                p: { xs: 3, md: 5 }, 
                                mb: 4, 
                                borderRadius: 6, 
                                backgroundColor: BRAND.surface,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                                border: '1px solid rgba(0,0,0,0.02)'
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <BadgeIcon sx={{ color: BRAND.secondary }} />
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>Personal Details</Typography>
                            </Stack>
                            
                            <TextField
                                label="Full Name"
                                fullWidth
                                variant="filled"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                InputProps={{
                                    disableUnderline: true,
                                    sx: { borderRadius: 4, bgcolor: '#f8f9fa' }
                                }}
                                sx={{ mb: 3 }}
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                sx={{ 
                                    borderRadius: '30px', 
                                    px: 4, py: 1.5, 
                                    fontWeight: 800,
                                    bgcolor: BRAND.primary,
                                    boxShadow: '0 8px 20px rgba(235, 77, 75, 0.3)',
                                    '&:hover': { bgcolor: '#d44646' }
                                }}
                            >
                                Save Changes
                            </Button>
                        </Paper>

                        <Paper 
                            component="form" 
                            onSubmit={handlePasswordUpdate} 
                            elevation={0} 
                            sx={{ 
                                p: { xs: 3, md: 5 }, 
                                borderRadius: 6, 
                                backgroundColor: BRAND.surface,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
                                border: '1px solid rgba(0,0,0,0.02)'
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <VpnKeyIcon sx={{ color: BRAND.secondary }} />
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>Security Settings</Typography>
                            </Stack>

                            {passwordError && <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 4, bgcolor: BRAND.primary, '& .MuiAlert-icon': { color: '#fff' } }}>{passwordError}</Alert>}
                            {passwordSuccess && <Alert severity="success" variant="filled" sx={{ mb: 3, borderRadius: 4, bgcolor: '#22c55e', '& .MuiAlert-icon': { color: '#fff' } }}>{passwordSuccess}</Alert>}
                            
                            <Stack spacing={3} sx={{ mb: 3 }}>
                                <TextField
                                    label="Current Password"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    fullWidth
                                    variant="filled"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: { borderRadius: 4, bgcolor: '#f8f9fa' },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle current password visibility"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    edge="end"
                                                >
                                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    label="New Password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    fullWidth
                                    variant="filled"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: { borderRadius: 4, bgcolor: '#f8f9fa' },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle new password visibility"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    edge="end"
                                                >
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    sx={{ 
                                        borderRadius: '30px', 
                                        px: 4, py: 1.5, 
                                        fontWeight: 800,
                                        bgcolor: BRAND.secondary,
                                        boxShadow: '0 8px 20px rgba(240, 147, 43, 0.3)',
                                        '&:hover': { bgcolor: '#e67e22' }
                                    }}
                                >
                                    Update Password
                                </Button>
                                {failedAttempts >= 3 && (
                                    <Link 
                                        component={RouterLink} 
                                        to="/forgot-password" 
                                        sx={{ 
                                            color: BRAND.primary, 
                                            fontWeight: 700, 
                                            textDecoration: 'none',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </Stack>
                        </Paper>

                    </Box>
                </Fade>
            </Container>

            <OtpDialog 
                open={showOtpDialog} 
                email={profile?.email} 
                onSuccess={handleOtpSuccess} 
                onClose={() => setShowOtpDialog(false)} 
            />
        </Box>
    );
};

export default ProfilePage;