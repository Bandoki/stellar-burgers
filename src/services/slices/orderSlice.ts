import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { orderBurgerApi } from '../../utils/burger-api';
import { RootState } from '../store';

type TOrderState = {
  isLoading: boolean;
  error: string | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrderState = {
  isLoading: true,
  error: null,
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientIds);
      return data.order;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.error = action.error.message ?? 'Error';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;

// Селекторы
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectIsLoading = (state: { order: TOrderState }) =>
  state.order.isLoading;
export const selectOrderRequest = (state: { order: TOrderState }) =>
  state.order.orderRequest;
export const selectOrderError = (state: { order: TOrderState }) =>
  state.order.error;
