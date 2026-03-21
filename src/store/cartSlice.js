import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api'; // Centralized API service
import { showNotification } from './notificationSlice';

// Helper to load guest cart from local storage
const loadGuestCart = () => {
  try {
    const serializedCart = localStorage.getItem('guestCart');
    if (serializedCart === null) return [];
    return JSON.parse(serializedCart);
  } catch (err) {
    return [];
  }
};

// Helper to save guest cart to local storage
const saveGuestCart = (items) => {
  try {
    const serializedCart = JSON.stringify(items);
    localStorage.setItem('guestCart', serializedCart);
  } catch (err) {
    // Ignore write errors
  }
};

const initialState = {
  items: localStorage.getItem('token') ? [] : loadGuestCart(), // Load guest cart if not logged in
  isCartOpen: false,
  loading: false,
  error: null,
};

// Async Thunks for Cart Operations
export const fetchCartItems = createAsyncThunk('cart/fetchItems', async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    return loadGuestCart();
  }
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const addCartItem = createAsyncThunk('cart/addItem', async (itemData, { getState, dispatch, rejectWithValue }) => {
  const { menuItemId, quantity, name, price, image } = itemData;
  const { auth } = getState();

  if (!auth.isAuthenticated) {
    // Handle Guest Cart
    const currentItems = loadGuestCart();
    const existingItemIndex = currentItems.findIndex(item => item.menuItemId === menuItemId);
    let updatedItems = [...currentItems];

    if (existingItemIndex !== -1) {
      updatedItems[existingItemIndex].quantity += (quantity || 1);
    } else {
      updatedItems.push({
        id: Date.now(), // Temporary ID for guest items
        menuItemId,
        name,
        price,
        image,
        quantity: quantity || 1
      });
    }
    saveGuestCart(updatedItems);
    const message = (quantity || 1) > 0 ? 'Item added to cart!' : 'Item quantity updated.';
    dispatch(showNotification({ message, severity: 'success' }));
    return updatedItems;
  }

  // Handle Authenticated Cart
  try {
    const response = await api.post('/cart/add', { menuItemId, quantity: quantity || 1 });
    const message = (quantity || 1) > 0 ? 'Item added to cart!' : 'Item quantity updated.';
    dispatch(showNotification({ message, severity: 'success' }));
    return response.data;
  } catch (error) {
    dispatch(showNotification({ message: 'Failed to update cart.', severity: 'error' }));
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const removeCartItem = createAsyncThunk('cart/removeItem', async (menuItemId, { getState, dispatch, rejectWithValue }) => {
  const { auth } = getState();

  if (!auth.isAuthenticated) {
    const currentItems = loadGuestCart();
    const updatedItems = currentItems.filter(item => item.menuItemId !== menuItemId);
    saveGuestCart(updatedItems);
    dispatch(showNotification({ message: 'Item removed from cart.', severity: 'info' }));
    return { menuItemId, isGuest: true, items: updatedItems };
  }

  try {
    await api.delete(`/cart/remove/${menuItemId}`);
    dispatch(showNotification({ message: 'Item removed from cart.', severity: 'info' }));
    return { menuItemId, isGuest: false };
  } catch (error) {
    dispatch(showNotification({ message: 'Failed to remove item.', severity: 'error' }));
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const clearUserCart = createAsyncThunk('cart/clearCart', async (_, { getState, dispatch, rejectWithValue }) => {
  const { auth } = getState();

  if (!auth.isAuthenticated) {
    localStorage.removeItem('guestCart');
    return { isGuest: true };
  }

  try {
    await api.delete('/cart/clear');
    return { isGuest: false };
  } catch (error) {
    dispatch(showNotification({ message: 'Failed to clear cart.', severity: 'error' }));
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk to merge guest cart to user cart after login
export const mergeGuestCart = createAsyncThunk('cart/mergeGuest', async (_, { dispatch }) => {
  const guestItems = loadGuestCart();
  if (guestItems.length === 0) return;

  for (const item of guestItems) {
    try {
      await api.post('/cart/add', { menuItemId: item.menuItemId, quantity: item.quantity });
    } catch (err) {
      console.error("Failed to merge item:", item.name);
    }
  }
  localStorage.removeItem('guestCart');
  dispatch(fetchCartItems());
});


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    removeItemFromState: (state, action) => {
      state.items = state.items.filter(item => item.menuItemId !== action.payload);
    },
    clearCartState: (state) => {
      state.items = [];
      state.isCartOpen = false;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
           state.items = action.payload.map(item => ({
              id: item.id,
              menuItemId: item.menuItemId,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity
          }));
        }
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        // If it's guest cart, action.payload is the full updated array
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else {
          // Authenticated cart logic (single item returned from API)
          const addedItem = action.payload;
          if (!addedItem) return;
          
          const existingItemIndex = state.items.findIndex(item => item.menuItemId === addedItem.menuItemId);
          if (existingItemIndex !== -1) {
            state.items[existingItemIndex].quantity = addedItem.quantity;
          } else {
            state.items.push({
              id: addedItem.id,
              menuItemId: addedItem.menuItemId,
              name: addedItem.name,
              price: addedItem.price,
              image: addedItem.image,
              quantity: addedItem.quantity
            });
          }
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (action.payload.isGuest) {
          state.items = action.payload.items;
        } else {
          state.items = state.items.filter(item => item.menuItemId !== action.payload.menuItemId);
        }
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { setCartItems, updateItemQuantity, removeItemFromState, clearCartState, toggleCart, setCartOpen } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;
export const selectCartTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotalPrice = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
