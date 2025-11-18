import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GuestRoute = () => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    // Jika sudah login, redirect ke halaman utama
    return <Navigate to="/" replace />;
  }

  // Jika belum login, tampilkan halaman (Login/Register)
  return <Outlet />;
};

export default GuestRoute;