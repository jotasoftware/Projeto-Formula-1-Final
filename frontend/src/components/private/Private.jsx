import { useContext } from 'react';
import { LoginContext } from '../../context/LoginContext';
import { Navigate } from 'react-router-dom';

const Private = ({ children }) => {
  const { isLoggedIn } = useContext(LoginContext);

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default Private;
