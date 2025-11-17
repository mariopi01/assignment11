import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    // Jika belum login, redirect ke halaman /login
    // `replace` mengganti history agar tidak bisa kembali
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan halaman yang diminta (child route)
  return <Outlet />;
};

export default ProtectedRoute;