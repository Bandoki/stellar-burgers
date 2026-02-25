import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  // Если ошибка — показываем сообщение
  if (error) {
    return (
      <p className='text text_type_main-large text_color_error'>
        Ошибка загрузки ингредиентов: {error}
      </p>
    );
  }

  // Если идет загрузка И ингредиентов еще нет — показываем прелоадер
  if (isIngredientsLoading) {
    return <Preloader />;
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
