import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { logOut } from '@/store/slices/authSlice';
import { useAuth } from '@/hooks/useAuth';

export const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Library MVP
          </Link>
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <Link to="/books">
                <Button variant="ghost">Books</Button>
              </Link>
              <Link to="/my-loans">
                <Button variant="ghost">My Loans</Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Halaman akan di-render di sini */}
        <Outlet /> 
      </main>

      <footer className="bg-gray-100 border-t text-center p-4">
        © 2025 Library Web MVP
      </footer>
    </div>
  );
};