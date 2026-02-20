import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '../../utils/types';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { RootState } from '../store';

interface FeedsState {
  ordersData: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  selectedOrder: TOrder | null;
  isSelectedOrderLoading: boolean;
  selectedOrderError: string | null;
}

const initialState: FeedsState = {
  ordersData: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null,
  selectedOrder: null,
  isSelectedOrderLoading: false,
  selectedOrderError: null
};

// Thunk для загрузки всех заказов
export const loadFeedOrders = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feeds/loadFeedOrders', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (e: unknown) {
    return rejectWithValue(
      (e as Error)?.message ?? 'Не удалось загрузить ленту заказов'
    );
  }
});

// Thunk для загрузки заказа по ID
export const loadOrderById = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('feeds/loadOrderById', async (id, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(id);
    return response.orders[0];
  } catch (e: unknown) {
    return rejectWithValue(
      (e as Error)?.message ?? 'Не удалось загрузить заказ'
    );
  }
});

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Все заказы
      .addCase(loadFeedOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFeedOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersData = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(loadFeedOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? 'Неизвестная ошибка';
      })

      // Отдельный заказ
      .addCase(loadOrderById.pending, (state) => {
        state.isSelectedOrderLoading = true;
        state.selectedOrderError = null;
      })
      .addCase(loadOrderById.fulfilled, (state, action) => {
        state.isSelectedOrderLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(loadOrderById.rejected, (state, action) => {
        state.isSelectedOrderLoading = false;
        state.selectedOrderError =
          action.payload ?? action.error.message ?? 'Неизвестная ошибка';
      });
  }
});

export default feedsSlice.reducer;

// Селекторы (мемоизация через RootState)
export const selectFeeds = (state: RootState) => state.feeds.ordersData;
export const selectTotalOrders = (state: RootState) => state.feeds.total;
export const selectTotalToday = (state: RootState) => state.feeds.totalToday;
export const selectFeedsLoading = (state: RootState) => state.feeds.isLoading;
export const selectFeedsError = (state: RootState) => state.feeds.error;

// Отдельный заказ
export const selectSelectedOrder = (state: RootState) =>
  state.feeds.selectedOrder;
export const selectSelectedOrderLoading = (state: RootState) =>
  state.feeds.isSelectedOrderLoading;
export const selectSelectedOrderError = (state: RootState) =>
  state.feeds.selectedOrderError;
