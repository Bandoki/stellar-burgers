import { rootReducer } from './rootReducer';

import constructorReducer from './slices/constructorSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import feedsReducer from './slices/feedsSlice';
import profileOrdersReducer from './slices/profileOrdersSlice';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние при @@INIT', () => {
    const initAction = { type: '@@INIT' };

    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      user: userReducer(undefined, initAction),
      order: orderReducer(undefined, initAction),
      feeds: feedsReducer(undefined, initAction),
      profileOrders: profileOrdersReducer(undefined, initAction),
      burgerConstructor: constructorReducer(undefined, initAction),
    });
  });

  it('должен возвращать то же состояние при неизвестном экшене', () => {
    const initAction = { type: '@@INIT' };

    const prevState = rootReducer(undefined, initAction);
    const nextState = rootReducer(prevState, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что возвращается тот же объект
    expect(nextState).toBe(prevState);
  });
});
