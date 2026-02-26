import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from './constructorSlice';
import { TIngredient } from '../../utils/types';

describe('constructorSlice', () => {
  const mockBun: TIngredient = {
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
  };

  const mockMain: TIngredient = {
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
  };

  const mockSauce: TIngredient = {
    _id: '3',
    name: 'Соус',
    type: 'sauce',
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 50,
    price: 20,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  // initial state

  test('должен вернуть initialState', () => {
    expect(
      burgerConstructorReducer(undefined, { type: '' })
    ).toEqual(initialState);
  });

  // add ingredient

  test('должен добавить булку', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredient(mockBun)
    );

    expect(state.bun).not.toBeNull();
    expect(state.bun?._id).toBe(mockBun._id);
    expect(state.ingredients).toHaveLength(0);
  });

  test('должен добавить начинку', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredient(mockMain)
    );

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(mockMain._id);

    // проверяем, что id для конструктора создан
    expect(state.ingredients[0].id).toBeDefined();
  });

  // remove ingredient

  test('должен удалить начинку по id', () => {
    let state = burgerConstructorReducer(
      initialState,
      addIngredient(mockMain)
    );

    const ingredientId = state.ingredients[0].id;

    state = burgerConstructorReducer(
      state,
      removeIngredient(ingredientId)
    );

    expect(state.ingredients).toHaveLength(0);
  });

  // move ingredient

  test('должен менять порядок ингредиентов', () => {
    let state = burgerConstructorReducer(
      initialState,
      addIngredient(mockMain)
    );

    state = burgerConstructorReducer(
      state,
      addIngredient(mockSauce)
    );

    // порядок изначально: main, sauce
    expect(state.ingredients[0]._id).toBe(mockMain._id);
    expect(state.ingredients[1]._id).toBe(mockSauce._id);

    // двигаем sauce вверх
    state = burgerConstructorReducer(
      state,
      moveIngredient({ from: 1, to: 0 })
    );

    expect(state.ingredients[0]._id).toBe(mockSauce._id);
    expect(state.ingredients[1]._id).toBe(mockMain._id);

    // возвращаем обратно
    state = burgerConstructorReducer(
      state,
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients[0]._id).toBe(mockMain._id);
    expect(state.ingredients[1]._id).toBe(mockSauce._id);
  });

  // очищаем конструктор

  test('должен очищать конструктор', () => {
    let state = burgerConstructorReducer(
      initialState,
      addIngredient(mockBun)
    );

    state = burgerConstructorReducer(
      state,
      addIngredient(mockMain)
    );

    state = burgerConstructorReducer(state, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
