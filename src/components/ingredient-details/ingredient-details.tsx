import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredients,
  selectIngredients
} from '../../services/slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

// Контейнерный компонент для отображения деталей ингредиента
export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();

  // Получаем массив ингредиентов из Redux
  const ingredients = useSelector(selectIngredients);

  //Типизация для useParams
  const params = useParams<Record<string, string>>();
  const id = params.id; // id может быть undefined, поэтому проверка ниже

  // Загружаем ингредиенты, если их ещё нет
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(getIngredients());
    }
  }, [dispatch, ingredients.length]);

  // Находим ингредиент по id, если id есть
  const ingredientData: TIngredient | undefined = id
    ? ingredients.find((item) => item._id === id)
    : undefined;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
