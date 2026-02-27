import orderReducer, {
  createOrder,
  clearOrder
} from './orderSlice';
import { TOrder } from '../../utils/types';

describe('orderSlice', () => {
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
    const state = orderReducer(undefined, { type: '' });

    expect(state.isLoading).toBe(true);
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });

  // pending

  test('pending: включает загрузку и request, очищает ошибку', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(undefined, action);

    expect(state.isLoading).toBe(true);
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  // fulfilled

  test('fulfilled: сохраняет заказ и выключает загрузку', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };

    const state = orderReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  // rejected

  test('rejected: сохраняет ошибку и выключает request', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Ошибка заказа' }
    };

    const state = orderReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка заказа');
  });

  // clear order

  test('clearOrder: очищает orderModalData', () => {
    const stateWithOrder = {
      isLoading: false,
      error: null,
      orderRequest: false,
      orderModalData: mockOrder
    };

    const state = orderReducer(stateWithOrder, clearOrder());

    expect(state.orderModalData).toBeNull();
  });
});
