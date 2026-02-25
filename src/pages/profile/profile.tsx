import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { updateUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: user.user?.name || '',
    email: user.user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.user?.name || '',
      email: user?.user?.email || ''
    }));
  }, [user.user?.name, user.user?.email]);

  const isFormChanged =
    formValue.name !== user?.user?.name ||
    formValue.email !== user?.user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password
      })
    );
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.user?.name || '',
      email: user.user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
