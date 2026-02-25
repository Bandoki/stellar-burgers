import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getOrdersApi } from '../../utils/burger-api';
import { RootState } from '../store';

interface ProfileOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

// Безопасное извлечение текста ошибки

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as { message?: string }).message ?? 'Ошибка загрузки заказов';
  }

  return 'Ошибка загрузки заказов';
};

// Получение заказов пользователя

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('profileOrders/fetch', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    // Очистка заказов

    clearProfileOrders(state) {
      state.orders = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfileOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(fetchProfileOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });

    builder.addCase(fetchProfileOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.payload ?? action.error.message ?? 'Не удалось загрузить заказы';
    });
  }
});

export const { clearProfileOrders } = profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;

// Базовый селектор состояния profileOrders

const selectProfileOrdersState = (state: RootState) => state.profileOrders;

// Селекторы

export const selectProfileOrders = (state: RootState) =>
  selectProfileOrdersState(state).orders;

export const selectProfileOrdersLoading = (state: RootState) =>
  selectProfileOrdersState(state).isLoading;

export const selectProfileOrdersError = (state: RootState) =>
  selectProfileOrdersState(state).error;
