import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';
import { fetchCartItems, clearCartState, mergeGuestCart } from './cartSlice';
import { showNotification } from './notificationSlice';

// Helper to decode roles from JWT
const getRolesFromToken = (token) => {
    if (!token) return [];
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload).roles || [];
    } catch (e) {
        return [];
    }
};

// Async Thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { dispatch, rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        const token = response.data.token;
        localStorage.setItem('token', token);
        dispatch(mergeGuestCart());
        dispatch(showNotification({ message: 'Welcome back! Logged in successfully.', severity: 'success' }));
        return token;
    } catch (error) {
        const errorMsg = error.response?.data || error.message;
        dispatch(showNotification({ message: `Login failed: ${errorMsg}`, severity: 'error' }));
        return rejectWithValue(errorMsg);
    }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { dispatch, rejectWithValue }) => {
    try {
        const response = await api.post('/auth/register', userData);
        const token = response.data.token;
        localStorage.setItem('token', token);
        dispatch(mergeGuestCart());
        dispatch(showNotification({ message: 'Registration successful! Welcome to Yummy-Tummy.', severity: 'success' }));
        return token;
    } catch (error) {
        const errorMsg = error.response?.data || error.message;
        dispatch(showNotification({ message: `Registration failed: ${errorMsg}`, severity: 'error' }));
        return rejectWithValue(errorMsg);
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    localStorage.removeItem('token');
    dispatch(clearCartState());
    dispatch(showNotification({ message: 'Logged out successfully.', severity: 'info' }));
});

const token = localStorage.getItem('token');
const initialState = {
    token: token || null,
    isAuthenticated: !!token,
    isAdmin: getRolesFromToken(token).includes('ROLE_ADMIN'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload;
                state.isAdmin = getRolesFromToken(action.payload).includes('ROLE_ADMIN');
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.token = null;
                state.isAdmin = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload;
                state.isAdmin = getRolesFromToken(action.payload).includes('ROLE_ADMIN');
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = null;
                state.isAuthenticated = false;
                state.isAdmin = false;
                state.error = null;
            });
    },
});

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.isAdmin;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
