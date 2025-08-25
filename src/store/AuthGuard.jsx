import React, { useEffect } from 'react';
import { useAuth } from 'store/auth';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth/signin');
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? children : null;
};

export default AuthGuard;
