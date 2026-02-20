import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';

// Расширяем ингредиент для конструктора
export type TConstructorIngredient = TIngredient & {
  id: string; // уникальный идентификатор для reorder/remove
};

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: crypto.randomUUID() // уникальный id для конструктора
        }
      })
    },

    // Удаление ингредиента по id
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    // Перемещение ингредиента (универсальный метод)
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      if (
        from >= 0 &&
        to >= 0 &&
        from < state.ingredients.length &&
        to < state.ingredients.length
      ) {
        const item = state.ingredients.splice(from, 1)[0];
        state.ingredients.splice(to, 0, item);
      }
    },

    // Очистка конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

// Селектор конструктора
export const selectConstructorItems = (state: {
  burgerConstructor: ConstructorState;
}) => state.burgerConstructor;

export default constructorSlice.reducer;
