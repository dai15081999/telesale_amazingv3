// modules
import { Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
// context
import { useAuth } from '../context/AuthContext';
// components
import { LeftStaff } from '../pages/Staff/LeffStaff';
import { Header } from './Header';
import { Footer } from './Footer';

export function RootLayout() {
  const [hide, setHide] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const { user, brand } = useAuth();

  if (!brand) return <Navigate to={`/brand`} />;
  if (user && Object.values(user)[9] !== 'staff')
    return <Navigate to={`${Object.values(user)[9]}`} />;
  if (user === null) return <Navigate to='/login' />;

  return (
    <>
      <LeftStaff hide={hide} />
      <section id='content'>
        <Header
          setShowToggle={setShowToggle}
          showToggle={showToggle}
          hide={hide}
          setHide={setHide}
        />
        <main>
          <Outlet />
        </main>
        <Footer />
      </section>
    </>
  );
}
