import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { RootState } from '../store';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';

interface UserState {
  user: TUser | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  error: string | undefined;
}

export const initialState: UserState = {
  user: null,
  isLoading: false,
  isAuthChecked: false,
  isAuthenticated: false,
  error: undefined
};

interface AuthResponse {
  user: TUser;
  accessToken: string;
  refreshToken: string;
}

export const checkUserAuth = createAsyncThunk<
  TUser,
  void,
  {
    rejectValue: string;
  }
>('user/checkUserAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserApi();
    return response.user;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Ошибка получения данных пользователя';
    return rejectWithValue(errorMessage);
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  { name?: string; email?: string; password?: string },
  { rejectValue: string }
>('user/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    return response.user;
  } catch (error) {
    return rejectWithValue('Ошибка обновления пользователя');
  }
});

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
};

export const login = createAsyncThunk<
  TUser,
  TLoginData,
  {
    rejectValue: string;
  }
>('user/login', async (data: TLoginData, { rejectWithValue }) => {
  try {
    const res: AuthResponse = await loginUserApi(data);

    saveTokens(res.accessToken, res.refreshToken);

    return res.user;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка входа по логину';
    return rejectWithValue(errorMessage);
  }
});

export const register = createAsyncThunk<
  TUser,
  TRegisterData,
  {
    rejectValue: string;
  }
>('user/register', async (data: TRegisterData, { rejectWithValue }) => {
  try {
    const res: AuthResponse = await registerUserApi(data);

    saveTokens(res.accessToken, res.refreshToken);

    return res.user;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Ошибка при регистрации';
    return rejectWithValue(errorMessage);
  }
});

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Вход
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isAuthChecked = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = undefined;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = false;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = 'Ошибка входа по логину';
        }
      })
      // Проверка авторизации
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = undefined;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = false;
        state.user = null;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = 'Ошибка получения данных пользователя';
        }
      })
      // Обновление данных
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = undefined;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? 'Ошибка обновления пользователя';
      })
      // Регистрация
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = undefined;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = false;
        state.error = (action.payload as string) ?? 'Ошибка при регистрации';
      })
      // Выход
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = false;
        state.error = undefined;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? 'Ошибка при выходе';
      });
  }
});

export default userSlice.reducer;

// Селкторы
export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;
