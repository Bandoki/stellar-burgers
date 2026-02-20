import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';
import {
  loadOrderById,
  selectFeeds,
  selectSelectedOrder
} from '../../services/slices/feedsSlice';
import { selectProfileOrders } from '../../services/slices/profileOrdersSlice';

export const OrderInfo: FC = () => {
  const orderSelected = useSelector(selectSelectedOrder);
  const userOrders = useSelector(selectProfileOrders);
  const feedsData = useSelector(selectFeeds);
  const ingredients = useSelector(selectIngredients);

  // Получаем номер заказа из URL
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  // Начальное значение для выбранного заказа
  let orderData: TOrder | null = orderSelected;
  let orderNumber = number ? Number(number) : undefined;

  // Загружаем заказ по ID, если он не найден в сторе
  useEffect(() => {
    if (!orderData && orderNumber !== undefined) {
      dispatch(loadOrderById(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  // Если заказа нет, ищем его в фидах или в профиле пользователя
  if (!orderData && orderNumber !== undefined) {
    orderData =
      feedsData?.find((order) => order.number === orderNumber) || null;

    if (!orderData) {
      orderData =
        userOrders.find((order) => order.number === orderNumber) || null;
    }
  }

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<
      string,
      TIngredient & { count: number }
    >;

    const ingredientsInfo: TIngredientsWithCount = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
