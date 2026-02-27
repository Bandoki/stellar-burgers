import profileOrdersReducer, {
  fetchProfileOrders,
  clearProfileOrders
} from './profileOrdersSlice';
import { TOrder } from '../../utils/types';

describe('profileOrdersSlice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Бургер',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['1', '2']
  };
  // initial state

  test('должен вернуть initial state', () => {
    const state = profileOrdersReducer(undefined, { type: '' });

    expect(state.orders).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  // pending

  test('pending: включает загрузку и очищает ошибку', () => {
    const action = { type: fetchProfileOrders.pending.type };
    const state = profileOrdersReducer(undefined, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  // fulfilled

  test('fulfilled: сохраняет заказы и выключает загрузку', () => {
    const action = {
      type: fetchProfileOrders.fulfilled.type,
      payload: [mockOrder]
    };

    const state = profileOrdersReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual([mockOrder]);
    expect(state.error).toBeNull();
  });

  // rejected (через payload)

  test('rejected: сохраняет ошибку из payload', () => {
    const action = {
      type: fetchProfileOrders.rejected.type,
      payload: 'Ошибка загрузки заказов'
    };

    const state = profileOrdersReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказов');
  });

  // rejected (без payload)

  test('rejected: использует fallback сообщение', () => {
    const action = {
      type: fetchProfileOrders.rejected.type,
      error: { message: 'Server error' }
    };

    const state = profileOrdersReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Server error');
  });

  // clearProfileOrders

  test('clearProfileOrders: очищает список и ошибку', () => {
    const stateWithOrders = {
      orders: [mockOrder],
      isLoading: false,
      error: 'Ошибка'
    };

    const state = profileOrdersReducer(
      stateWithOrders,
      clearProfileOrders()
    );

    expect(state.orders).toEqual([]);
    expect(state.error).toBeNull();
  });
});
