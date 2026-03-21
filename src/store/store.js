import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';
import notificationReducer from './notificationSlice';
import confirmationReducer from './confirmationSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer,
    auth: authReducer,
    user: userReducer,
    notification: notificationReducer,
    confirmation: confirmationReducer,
  },
});
