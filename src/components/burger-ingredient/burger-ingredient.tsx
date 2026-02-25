import { FC, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    //const navigate = useNavigate();
    const dispatch = useDispatch();

    // Добавление ингредиента в конструктор
    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    /** Клик по ингредиенту — открытие модалки с подробностями
    const handleClick = () => {
      navigate(`/ingredients/${ingredient._id}`, {
        state: { background: location }
      });
    }; */

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
