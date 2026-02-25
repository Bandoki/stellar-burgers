import styles from './app.module.css';
import { FC } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useMatch,
  Location
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRouter } from '../protected-route/protected-route';

export const AppRouter: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Обработчик закрытия модального окна
  const handleModalClose = () => navigate(-1);

  // Сохраняем фоновую локацию для модальных окон
  const locationState = location.state as { background?: Location };
  const background = locationState?.background;

  // Получаем номер заказа из маршрутов (если открыто модальное окно)
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;

  return (
    <>
      {/* Основные маршруты */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Страница ингредиента */}
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.detailPageWrap}>
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
                Детали ингредиента
              </p>
              <IngredientDetails />
            </div>
          }
        />

        {/* Страница заказа из feed */}
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <p
                className={`text text_type_digits-default ${styles.detailHeader}`}
              >
                #{orderNumber?.padStart(6, '0')}
              </p>
              <OrderInfo />
            </div>
          }
        />

        {/* Страница заказа из профиля */}
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRouter>
              <div className={styles.detailPageWrap}>
                <p
                  className={`text text_type_digits-default ${styles.detailHeader}`}
                >
                  #{orderNumber?.padStart(6, '0')}
                </p>
                <OrderInfo />
              </div>
            </ProtectedRouter>
          }
        />

        {/* Аутентификация */}
        <Route
          path='/login'
          element={
            <ProtectedRouter onlyUnAuth>
              <Login />
            </ProtectedRouter>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRouter onlyUnAuth>
              <Register />
            </ProtectedRouter>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRouter onlyUnAuth>
              <ForgotPassword />
            </ProtectedRouter>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRouter onlyUnAuth>
              <ResetPassword />
            </ProtectedRouter>
          }
        />

        {/* Профиль */}
        <Route
          path='/profile'
          element={
            <ProtectedRouter>
              <Profile />
            </ProtectedRouter>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRouter>
              <ProfileOrders />
            </ProtectedRouter>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={
                  orderNumber
                    ? `#${orderNumber.padStart(6, '0')}`
                    : 'Детали заказа'
                }
                onClose={handleModalClose}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRouter>
                <Modal
                  title={
                    orderNumber
                      ? `#${orderNumber.padStart(6, '0')}`
                      : 'Детали заказа'
                  }
                  onClose={handleModalClose}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRouter>
            }
          />
        </Routes>
      )}
    </>
  );
};
