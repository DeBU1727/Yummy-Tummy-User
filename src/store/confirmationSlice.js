import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  title: '',
  message: '',
  onConfirm: null, // We'll handle this by passing a callback or using a pattern
};

const confirmationSlice = createSlice({
  name: 'confirmation',
  initialState,
  reducers: {
    showConfirmation: (state, action) => {
      state.open = true;
      state.title = action.payload.title || 'Are you sure?';
      state.message = action.payload.message || 'Do you want to proceed with this action?';
    },
    hideConfirmation: (state) => {
      state.open = false;
      state.title = '';
      state.message = '';
    },
  },
});

export const { showConfirmation, hideConfirmation } = confirmationSlice.actions;
export const selectConfirmation = (state) => state.confirmation;
export default confirmationSlice.reducer;
