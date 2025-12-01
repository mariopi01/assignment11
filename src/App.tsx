
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
        {/* --- 1. Rute Auth (Login/Register) --- */}
        {/* Tidak menggunakan MainLayout (tanpa Header/Footer) */}
        <Route path="/login" element={<GuestRoute />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- 2. Rute Utama dengan Layout (Header & Footer) --- */}
        <Route element={<MainLayout />}>
          
          {/* A. Rute Publik (Bisa diakses TANPA login) */}
          {/* Default Route: Redirect root '/' ke '/books' */}
          <Route path="/" element={<Navigate to="/books" replace />} />
          
          <Route path="/books" element={<BookListPage />} />
          <Route path="/category" element={<CategoryPage />} /> 
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/authors/:id" element={<BookByAuthorPage />} />

          {/* B. Rute Terproteksi (WAJIB Login) */}
          {/* Halaman user spesifik dilindungi di sini */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<MyCartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/my-loans" element={<MyLoansPage />} />
            <Route path="/my-reviews" element={<MyReviewPage />} />
            <Route path="/profile" element={<MyProfilePage />} />
          </Route>

        </Route>
      
        {/* Fallback untuk rute tidak dikenal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;