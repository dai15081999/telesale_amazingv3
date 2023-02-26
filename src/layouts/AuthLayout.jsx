import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthLayout() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={`/${Object.values(user)[9]}`} />;
  }
  return <Outlet />;
}
