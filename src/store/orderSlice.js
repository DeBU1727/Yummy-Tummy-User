import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';
import { showNotification } from './notificationSlice';

export const fetchUserOrders = createAsyncThunk('order/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const cancelUserOrder = createAsyncThunk('order/cancelOrder', async (orderId, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.put(`/orders/${orderId}/cancel`);
    dispatch(showNotification({ message: 'Order cancelled successfully.', severity: 'success' }));
    return response.data;
  } catch (error) {
    dispatch(showNotification({ message: 'Failed to cancel order.', severity: 'error' }));
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteUserOrder = createAsyncThunk('order/deleteOrder', async (orderId, { dispatch, rejectWithValue }) => {
  try {
    await api.delete(`/orders/${orderId}`);
    dispatch(showNotification({ message: 'Order removed from history.', severity: 'info' }));
    return orderId;
  } catch (error) {
    dispatch(showNotification({ message: 'Failed to delete order.', severity: 'error' }));
    return rejectWithValue(error.response?.data || error.message);
  }
});

const initialState = {
  orderType: 'DELIVERY', // Default to Delivery
  deliveryDetails: null, // { address, contactNumber }
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    setDeliveryDetails: (state, action) => {
      state.deliveryDetails = action.payload;
    },
    clearOrder: (state) => {
      state.deliveryDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelUserOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(deleteUserOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(o => o.id !== action.payload);
      });
  },
});

export const { setOrderType, setDeliveryDetails, clearOrder } = orderSlice.actions;

export const selectOrderType = (state) => state.order.orderType;
export const selectDeliveryDetails = (state) => state.order.deliveryDetails;
export const selectUserOrders = (state) => state.order.orders;
export const selectOrderLoading = (state) => state.order.loading;

export default orderSlice.reducer;
