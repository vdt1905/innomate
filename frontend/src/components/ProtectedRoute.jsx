import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../Store/authStore';

const ProtectedRoute = ({ children }) => {
  const { user, fetchUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      await fetchUser();
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user]);

  return user ? children : null;
};

export default ProtectedRoute;
