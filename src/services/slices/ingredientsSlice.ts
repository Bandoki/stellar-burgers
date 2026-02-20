import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';
import { RootState } from '../store';

interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

interface UnknownError {
  message: string;
}

export const getIngredients = createAsyncThunk<
  TIngredient[],
  void,
  {
    rejectValue: string;
  }
>('ingredients/getIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (e: unknown) {
    if (e instanceof Error) {
      return rejectWithValue(e.message);
    }

    const error = e as UnknownError;
    return rejectWithValue(error.message || 'Неизвестная ошибка');
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка при загрузке ингредиентов';
      });
  }
});

export default ingredientsSlice.reducer;

// Селекторы
export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
