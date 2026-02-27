import ingredientsReducer, { getIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 50,
      image: '',
      image_mobile: '',
      image_large: ''
    },
    {
      _id: '2',
      name: 'Котлета',
      type: 'main',
      proteins: 20,
      fat: 20,
      carbohydrates: 20,
      calories: 200,
      price: 100,
      image: '',
      image_mobile: '',
      image_large: ''
    }
  ];

  // initial state

  test('должен вернуть initial state', () => {
    const state = ingredientsReducer(undefined, { type: '' });

    expect(state.ingredients).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  // pending

  test('pending: включает загрузку и очищает ошибку', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  // fulfilled

  test('fulfilled: сохраняет ингредиенты и выключает загрузку', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };

    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  // rejected (через payload)

  test('rejected: сохраняет ошибку из payload', () => {
    const action = {
      type: getIngredients.rejected.type,
      payload: 'Ошибка сервера'
    };

    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сервера');
  });

  // rejected (без payload)

  test('rejected: ставит дефолтную ошибку если payload нет', () => {
    const action = {
      type: getIngredients.rejected.type
    };

    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при загрузке ингредиентов');
  });
});
