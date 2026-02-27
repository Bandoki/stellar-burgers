import feedsReducer, {
  loadFeedOrders,
  loadOrderById
} from './feedsSlice';
import { TOrder } from '../../utils/types';

describe('feedsSlice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Бургер',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['1', '2']
  };

  const mockOrdersResponse = {
    orders: [mockOrder],
    total: 100,
    totalToday: 10
  };

  // initial state

  test('должен вернуть initial state', () => {
    const state = feedsReducer(undefined, { type: '' });

    expect(state.ordersData).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
  });

  // loadFeedOrders

  test('pending loadFeedOrders', () => {
    const action = { type: loadFeedOrders.pending.type };
    const state = feedsReducer(undefined, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fulfilled loadFeedOrders', () => {
    const action = {
      type: loadFeedOrders.fulfilled.type,
      payload: mockOrdersResponse
    };

    const state = feedsReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.ordersData).toEqual(mockOrdersResponse.orders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
  });

  test('rejected loadFeedOrders', () => {
    const action = {
      type: loadFeedOrders.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };

    const state = feedsReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  // loadOrderById

  test('pending loadOrderById', () => {
    const action = { type: loadOrderById.pending.type };
    const state = feedsReducer(undefined, action);

    expect(state.isSelectedOrderLoading).toBe(true);
    expect(state.selectedOrderError).toBeNull();
  });

  test('fulfilled loadOrderById', () => {
    const action = {
      type: loadOrderById.fulfilled.type,
      payload: mockOrder
    };

    const state = feedsReducer(undefined, action);

    expect(state.isSelectedOrderLoading).toBe(false);
    expect(state.selectedOrder).toEqual(mockOrder);
  });

  test('rejected loadOrderById', () => {
    const action = {
      type: loadOrderById.rejected.type,
      error: { message: 'Ошибка заказа' }
    };

    const state = feedsReducer(undefined, action);

    expect(state.isSelectedOrderLoading).toBe(false);
    expect(state.selectedOrderError).toBe('Ошибка заказа');
  });
});
