
// import React from 'react'; // <-- 1. Impor React untuk event handler
// import { Link, Outlet, useNavigate } from 'react-router-dom'; // <-- 2. Impor useNavigate
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/hooks/useAuth';
// import { useAppDispatch, useAppSelector } from '@/store/hooks'; // <-- 3. Impor hooks Redux
// import { selectCurrentUser } from '@/store/slices/authSlice';
// import { selectFilters, setSearchTerm } from '@/store/slices/uiSlice'; // <-- 4. Impor state search

// // Impor aset gambar
// import logoBooky from '@/assets/logo_booky.png';
// import searchIcon from '@/assets/search_icon.png';
// import cartIcon from '@/assets/cart_icon.png';
// import userAvatar from '@/assets/user_avatar.png';
// import chevronDown from '@/assets/chevron-down.png';
// import searchIconBlack from '@/assets/search_icon_black.png';
// import burgerIcon from '@/assets/burger_icon.png';

// export const MainLayout = () => {
//   const { isLoggedIn } = useAuth();
//   const user = useAppSelector(selectCurrentUser);

//   // --- 5. Logika untuk Search Box ---
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { searchTerm } = useAppSelector(selectFilters);

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     dispatch(setSearchTerm(e.target.value));
//   };

//   const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     // Jika menekan Enter, pindah ke halaman /books untuk melihat hasil
//     if (e.key === 'Enter') {
//       navigate('/books');
//     }
//   };
//   // ---------------------------------

//   return (
//     <div className="min-h-screen flex flex-col">
//       <nav className="bg-white shadow-[0_0_20px_rgba(203,202,202,0.25)] sticky top-0 z-10 h-20">
//         <div className="container mx-auto px-4 h-full flex justify-between items-center">
          
//           {/* Kiri: Logo & Nama */}
//           <Link to="/" className="flex items-center gap-2">
//             <img src={logoBooky} alt="Booky Logo" className="w-[42px] h-[42px]" />
//             <span className="hidden md:block text-xl font-bold text-neutral-900">
//               Booky
//             </span>
//           </Link>

//           {/* Tengah: Search Box (Desktop) - MODIFIED */}
//           <div className="hidden md:flex items-center gap-2 w-[500px] h-11 px-4 py-2 rounded-full border bg-white border-neutral-300">
//             <img src={searchIcon} alt="Search" className="w-5 h-5" />
            
//             {/* 6. GANTI <SPAN> DENGAN <INPUT> */}
//             <input
//               type="text"
//               placeholder="Search book"
//               className="bg-transparent border-none outline-none w-full text-sm font-medium text-neutral-900 placeholder:text-neutral-500"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               onKeyDown={handleSearchSubmit}
//             />
//           </div>

//           {/* Kanan: Ikon & User/Login */}
//           <div className="flex items-center gap-3">
//             {/* Ikon Pencarian (Mobile) */}
//             <Button variant="ghost" size="icon" className="md:hidden">
//               <img
//                 src={searchIconBlack}
//                 alt="Search"
//                 className="w-6 h-6"
//               />
//             </Button>

//             {isLoggedIn ? (
//               // === TAMPILAN JIKA SUDAH LOGIN ===
//               <>
//                 <Button variant="ghost" size="icon">
//                   <img
//                     src={cartIcon}
//                     alt="Cart"
//                     className="w-6 h-[25px]"
//                   />
//                 </Button>
//                 <div className="hidden md:flex items-center gap-2 cursor-pointer">
//                   <img
//                     src={userAvatar}
//                     alt="User Avatar"
//                     className="w-12 h-12 rounded-full"
//                   />
//                   {user && (
//                     <span className="text-lg font-semibold text-neutral-900">
//                       {user.name}
//                     </span>
//                   )}
//                   <img
//                     src={chevronDown}
//                     alt=""
//                     className="w-6 h-6"
//                   />
//                 </div>
//                 <div className="md:hidden">
//                   <img
//                     src={userAvatar}
//                     alt="User Avatar"
//                     className="w-10 h-10 rounded-full"
//                   />
//                 </div>
//               </>
//             ) : (
//               // === TAMPILAN JIKA BELUM LOGIN ===
//               <>
//                 <div className="hidden md:flex items-center gap-2">
//                   <Button
//                     variant="outline"
//                     className="w-[163px] h-12 rounded-full border-neutral-300"
//                     onClick={() => navigate('/login')} // Arahkan ke login
//                   >
//                     Login
//                   </Button>
//                   <Button 
//                     className="w-[163px] h-12 rounded-full bg-[#1C65DA] hover:bg-[#1C65DA]/90"
//                     onClick={() => navigate('/login')} // Arahkan ke login (register ada di tab)
//                   >
//                     Register
//                   </Button>
//                 </div>
//                 <Button variant="ghost" size="icon" className="md:hidden">
//                   <img
//                     src={burgerIcon}
//                     alt="Menu"
//                     className="w-6 h-6"
//                   />
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Konten Halaman */}
//       <main className="grow container mx-auto px-4 py-8">
//         <Outlet />
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-100 border-t text-center p-4">
//         © 2025 Library Web MVP
//       </footer>
//     </div>
//   );
// };

import { Outlet } from 'react-router-dom';
import { Header } from './Header'; // <-- Impor Header baru
import { Footer } from './Footer'; // <-- Impor Footer baru

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="grow container mx-auto px-4 py-8">
        {/* Konten Halaman (seperti BookListPage) akan dirender di sini */}
        <Outlet /> 
      </main>

      <Footer />
    </div>
  );
};