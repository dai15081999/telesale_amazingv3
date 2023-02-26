import { Navigate, Outlet } from 'react-router-dom';
// context
import { useAuth } from '../context/AuthContext';

export function AdminLayout() {
  const { user } = useAuth();
  if (user && Object.values(user)[9] !== 'admin')
    return <Navigate to={`${Object.values(user)[9]}`} />;

  if (user === null) return <Navigate to='/login' />;
    
  return (
    <>
      <Outlet />
    </>
  );
}
