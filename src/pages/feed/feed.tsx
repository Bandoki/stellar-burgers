import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  loadFeedOrders,
  selectFeeds,
  selectFeedsError,
  selectFeedsLoading
} from '../../services/slices/feedsSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectFeeds);
  const isLoading = useSelector(selectFeedsLoading);
  const error = useSelector(selectFeedsError);

  useEffect(() => {
    dispatch(loadFeedOrders());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(loadFeedOrders());
  };

  if (error) {
    return <div>Ошибка получения списка заказов: {error}</div>;
  }

  if (isLoading) {
    return <Preloader />;
  }

  if (!orders.length) {
    return <div>Список заказов пуст</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
