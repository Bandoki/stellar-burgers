import userReducer, {
  initialState,
  checkUserAuth,
  login,
  logout,
  register,
  updateUser
} from './userSlice';

describe('userSlice', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockError = 'Ошибка';

  test('должен возвращать initialState по умолчанию', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  // checkUserAuth

  test('checkUserAuth.pending', () => {
    const action = { type: checkUserAuth.pending.type };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.isAuthChecked).toBe(false);
  });

  test('checkUserAuth.fulfilled', () => {
    const action = {
      type: checkUserAuth.fulfilled.type,
      payload: mockUser
    };

    const state = userReducer(initialState, action);

    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('checkUserAuth.rejected', () => {
    const action = {
      type: checkUserAuth.rejected.type,
      payload: mockError
    };

    const state = userReducer(initialState, action);

    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(false);
    expect(state.error).toBe(mockError);
  });

  // register

  test('register.pending', () => {
    const action = { type: register.pending.type };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(true);
  });

  test('register.fulfilled', () => {
    const action = {
      type: register.fulfilled.type,
      payload: mockUser
    };

    const state = userReducer(initialState, action);

    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeUndefined();
  });

  test('register.rejected', () => {
    const action = {
      type: register.rejected.type,
      payload: mockError
    };

    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(false);
    expect(state.error).toBe(mockError);
  });

  // login

  test('login.pending', () => {
    const action = { type: login.pending.type };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.isAuthChecked).toBe(false);
  });

  test('login.fulfilled', () => {
    const action = {
      type: login.fulfilled.type,
      payload: mockUser
    };

    const state = userReducer(initialState, action);

    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  test('login.rejected', () => {
    const action = {
      type: login.rejected.type,
      payload: mockError
    };

    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(false);
    expect(state.error).toBe(mockError);
  });

  // updateUser

  test('updateUser.pending', () => {
    const action = { type: updateUser.pending.type };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(true);
  });

  test('updateUser.fulfilled', () => {
    const action = {
      type: updateUser.fulfilled.type,
      payload: mockUser
    };

    const state = userReducer(initialState, action);

    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeUndefined();
  });

  test('updateUser.rejected', () => {
    const action = {
      type: updateUser.rejected.type,
      payload: mockError
    };

    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(mockError);
  });

  // logout

  test('logout.pending', () => {
    const action = { type: logout.pending.type };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(true);
  });

  test('logout.fulfilled', () => {
    const loggedInState = {
      ...initialState,
      user: mockUser,
      isAuthChecked: true
    };

    const action = { type: logout.fulfilled.type };
    const state = userReducer(loggedInState, action);

    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(false);
    expect(state.error).toBeUndefined();
  });
});
