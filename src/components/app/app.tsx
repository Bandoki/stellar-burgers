import '../../index.css';
import { FC, useEffect } from 'react';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { useDispatch } from '../../services/store';
import { getCookie } from '../../utils/cookie';
import { checkUserAuth } from '../../services/slices/userSlice';
import { AppRouter } from './appRouter';

const App: FC = () => {
  const dispatch = useDispatch();

  // Загрузка ингредиентов и проверка авторизации при старте приложения
  useEffect(() => {
    dispatch(getIngredients());
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      dispatch(checkUserAuth());
    }
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppRouter />
    </div>
  );
};

export default App;
