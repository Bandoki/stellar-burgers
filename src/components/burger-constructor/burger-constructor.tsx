import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';

import {
  clearConstructor,
  selectConstructorItems
} from '../../services/slices/constructorSlice';
import {
  clearOrder,
  createOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/orderSlice';
import { selectUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Конструктор бургера
  const constructorItems = useSelector(selectConstructorItems);

  // Данные заказа
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  // Пользователь
  const user = useSelector(selectUser);

  // Клик на кнопку "Заказать"
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // Если пользователь не авторизован — редирект на login
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // Формируем массив _id ингредиентов для заказа
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  // Закрытие модального окна заказа
  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  // Вычисление итоговой цены
  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
