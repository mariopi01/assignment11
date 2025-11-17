// // import { useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// // import './App.css'

// // function App() {
// //   const [count, setCount] = useState(0)

// //   return (
// //     <>
// //       <div>
// //         <a href="https://vite.dev" target="_blank">
// //           <img src={viteLogo} className="logo" alt="Vite logo" />
// //         </a>
// //         <a href="https://react.dev" target="_blank">
// //           <img src={reactLogo} className="logo react" alt="React logo" />
// //         </a>
// //       </div>
// //       <h1>Vite + React</h1>
// //       <div className="card">
// //         <button onClick={() => setCount((count) => count + 1)}>
// //           count is {count}
// //         </button>
// //         <p>
// //           Edit <code>src/App.tsx</code> and save to test HMR
// //         </p>
// //       </div>
// //       <p className="read-the-docs">
// //         Click on the Vite and React logos to learn more
// //       </p>
// //     </>
// //   )
// // }

// // export default App


// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
// } from 'react-router-dom';
// import AuthPage from './pages/AuthPage';
// import ProtectedRoute from './routes/ProtectedRoute';

// // Halaman dummy untuk placeholder
// const BookListPage = () => (
//   <div>
//     <h1>Halaman Daftar Buku (Protected)</h1>
//   </div>
// );
// const MyProfilePage = () => (
//   <div>
//     <h1>Halaman Profil Saya (Protected)</h1>
//   </div>
// );

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Rute Publik: bisa diakses siapa saja */}
//         <Route path="/login" element={<AuthPage />} />

//         {/* Rute Terproteksi: hanya bisa diakses setelah login */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/books" element={<BookListPage />} />
//           <Route path="/profile" element={<MyProfilePage />} />
          
//           {/* Default rute setelah login */}
//           <Route path="/" element={<Navigate to="/books" replace />} />
//         </Route>
        
//         {/* Jika akses rute lain, redirect ke halaman utama */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


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
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import MyLoansPage from './pages/MyLoansPage';
import MyProfilePage from './pages/MyProfilePage';
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
        {/* Rute Publik (Hanya Tamu) */}
        <Route path="/login" element={<GuestRoute />} />

        {/* Rute Terproteksi (Hanya User Login) */}
        {/* Semua rute di dalam sini akan menggunakan MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/books" element={<BookListPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/my-loans" element={<MyLoansPage />} />
            <Route path="/profile" element={<MyProfilePage />} />
          </Route>
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;