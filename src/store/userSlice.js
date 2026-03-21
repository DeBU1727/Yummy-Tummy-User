import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';
import { showNotification } from './notificationSlice';

// Async Thunks
export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/user/profile');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.toString());
    }
});

export const updateUserProfile = createAsyncThunk('user/updateProfile', async (userData, { dispatch, rejectWithValue }) => {
    try {
        const response = await api.put('/user/profile', userData);
        dispatch(showNotification({ message: 'Profile updated successfully!', severity: 'success' }));
        return response.data;
    } catch (error) {
        dispatch(showNotification({ message: 'Failed to update profile.', severity: 'error' }));
        return rejectWithValue(error.toString());
    }
});

const initialState = {
    profile: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfile } = userSlice.actions;

export const selectUserProfile = (state) => state.user.profile;

export default userSlice.reducer;
