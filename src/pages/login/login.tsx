import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  login,
  selectIsAuthenticated,
  selectUserError
} from '../../services/slices/userSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector(selectUserError);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  // Редирект только если пользователь авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
