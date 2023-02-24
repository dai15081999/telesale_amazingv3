import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LeftStaff } from "../pages/Staff/LeffStaff";
import { Header } from "./Header";
import { useState } from "react";

export function RootLayout() {
  const [hide, setHide] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const { user } = useAuth();
  if (user === null) return <Navigate to="/login" />;
  return (
    <>
      <LeftStaff hide={hide} />
      <section id="content">
        <Header
          setShowToggle={setShowToggle}
          showToggle={showToggle}
          hide={hide}
          setHide={setHide}
        />
        <main>
          <Outlet />
        </main>
      </section>
    </>
  );
}
