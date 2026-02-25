import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  fetchProfileOrders,
  selectProfileOrdersLoading,
  selectProfileOrders,
  selectProfileOrdersError
} from '../../services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (error) {
    return <div>Ошибка загрузки заказов: {error}</div>;
  }

  if (isLoading) {
    return <Preloader />;
  }

  // Пустой список
  if (!orders.length) {
    return <div>У вас пока нет заказов</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
