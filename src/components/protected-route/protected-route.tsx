import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUser,
  selectUserLoading
} from '../../services/slices/userSlice';

interface WithAuthProps {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
}

export const ProtectedRouter = ({ onlyUnAuth, children }: WithAuthProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isLoading = useSelector(selectUserLoading);
  const user = useSelector(selectUser);

  const location = useLocation();

  if (!isAuthChecked && isLoading) {
    return <Preloader />;
  }
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  return children;
};
