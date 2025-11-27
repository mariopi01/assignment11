

// src/App.tsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Layout & Rute
import { MainLayout } from './components/layout/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Halaman
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import MyLoansPage from './pages/MyLoansPage';
import MyProfilePage from './pages/MyProfilePage';
import CategoryPage from '@/pages/Category';
import BookByAuthorPage from './pages/BookByAuthor'; 
import MyReviewPage from './pages/MyReview';
import CheckoutPage from './pages/CheckoutPage';
import MyCartPage from './pages/MyCart';
import { useAuth } from './hooks/useAuth';

// Komponen 'GuestRoute' untuk redirect jika sudah login
const GuestRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" replace /> : <AuthPage />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik (Hanya untuk Tamu /belum login ) */}
        
        <Route path="/login" element={<GuestRoute />} />
        <Route path="/register" element={<RegisterPage />} />


        {/* Rute Terproteksi (Hanya User yang sudah Login) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/books" element={<BookListPage />} />
            <Route path="/category" element={<CategoryPage />} /> 
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/authors/:id" element={<BookByAuthorPage />} />
            <Route path="/cart" element={<MyCartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/my-loans" element={<MyLoansPage />} />
            <Route path="/my-reviews" element={<MyReviewPage />} />
            <Route path="/profile" element={<MyProfilePage />} />
          </Route>
        </Route>
        
      
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;