// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/hooks/useAuth';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { selectCurrentUser } from '@/store/slices/authSlice';
// import { selectFilters, setSearchTerm } from '@/store/slices/uiSlice';

// // Impor aset gambar
// import logoBooky from '@/assets/logo_booky.png';
// import searchIcon from '@/assets/search_icon.png';
// import cartIcon from '@/assets/cart_icon.png';
// import userAvatar from '@/assets/user_avatar.png';
// import chevronDown from '@/assets/chevron-down.png';
// import searchIconBlack from '@/assets/search_icon_black.png';
// import burgerIcon from '@/assets/burger_icon.png';

// export const Header = () => {
//   const { isLoggedIn } = useAuth();
//   const user = useAppSelector(selectCurrentUser);
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { searchTerm } = useAppSelector(selectFilters);

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     dispatch(setSearchTerm(e.target.value));
//   };

//   const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       navigate('/books');
//     }
//   };

//   return (
//     <nav className="bg-white shadow-[0_0_20px_rgba(203,202,202,0.25)] sticky top-0 z-10 h-20">
//       <div className=" px-4 w-full h-full flex justify-between items-center">
        
//         {/* Kiri: Logo & Nama */}
//         <Link to="/" className="flex items-center gap-2">
//           <img src={logoBooky} alt="Booky Logo" className="w-[42px] h-[42px]" />
//           <span className="hidden md:block text-xl font-bold text-neutral-900">
//             Booky
//           </span>
//         </Link>

//         {/* Tengah: Search Box (Desktop) */}
//         <div className="hidden md:flex items-center gap-2 w-[500px] h-11 px-4 py-2 rounded-full border bg-white border-neutral-300">
//           <img src={searchIcon} alt="Search" className="w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search book"
//             className="bg-transparent border-none outline-none w-full text-sm font-medium text-neutral-900 placeholder:text-neutral-500"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             onKeyDown={handleSearchSubmit}
//           />
//         </div>

//         {/* Kanan: Ikon & User/Login */}
//         <div className="flex items-center gap-3">
//           {/* Ikon Pencarian (Mobile) */}
//           <Button variant="ghost" size="icon" className="md:hidden">
//             <img
//               src={searchIconBlack}
//               alt="Search"
//               className="w-6 h-6"
//             />
//           </Button>

//           {isLoggedIn ? (
//             // === TAMPILAN JIKA SUDAH LOGIN ===
//             <>
//               <Button variant="ghost" size="icon">
//                 <img
//                   src={cartIcon}
//                   alt="Cart"
//                   className="w-6 h-[25px]"
//                 />
//               </Button>
//               <div className="hidden md:flex items-center gap-2 cursor-pointer">
//                 <img
//                   src={userAvatar}
//                   alt="User Avatar"
//                   className="w-12 h-12 rounded-full"
//                 />
//                 {user && (
//                   <span className="text-lg font-semibold text-neutral-900">
//                     {user.name}
//                   </span>
//                 )}
//                 <img
//                   src={chevronDown}
//                   alt=""
//                   className="w-6 h-6"
//                 />
//               </div>
//               <div className="md:hidden">
//                 <img
//                   src={userAvatar}
//                   alt="User Avatar"
//                   className="w-10 h-10 rounded-full"
//                 />
//               </div>
//             </>
//           ) : (
//             // === TAMPILAN JIKA BELUM LOGIN ===
//             <>
//               <div className="hidden md:flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   className="w-[163px] h-12 rounded-full border-neutral-300"
//                   onClick={() => navigate('/login')}
//                 >
//                   Login
//                 </Button>
//                 <Button 
//                   className="w-[163px] h-12 rounded-full bg-[#1C65DA] hover:bg-[#1C65DA]/90"
//                   onClick={() => navigate('/login')}
//                 >
//                   Register
//                 </Button>
//               </div>
//               <Button variant="ghost" size="icon" className="md:hidden">
//                 <img
//                   src={burgerIcon}
//                   alt="Menu"
//                   className="w-6 h-6"
//                 />
//               </Button>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };


import React, { useState } from 'react'; // <-- 1. Impor useState
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentUser, logOut } from '@/store/slices/authSlice'; // <-- 2. Impor logOut
import { selectFilters, setSearchTerm } from '@/store/slices/uiSlice';

// Impor aset gambar
import logoBooky from '@/assets/logo_booky.png';
import searchIcon from '@/assets/search_icon.png';
import cartIcon from '@/assets/cart_icon.png';
import userAvatar from '@/assets/user_avatar.png';
import chevronDown from '@/assets/chevron-down.png';
import searchIconBlack from '@/assets/search_icon_black.png';
import burgerIcon from '@/assets/burger_icon.png';

export const Header = () => {
  const { isLoggedIn } = useAuth();
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { searchTerm } = useAppSelector(selectFilters);

  // --- 3. Tambahkan state untuk dropdown ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate('/books');
    }
  };

  // --- 4. Buat fungsi handleLogout ---
  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
    setIsDropdownOpen(false); // Tutup dropdown setelah logout
  };

  return (
    <nav className="bg-white shadow-[0_0_20px_rgba(203,202,202,0.25)] sticky top-0 z-10 h-20">
      {/* Catatan: Saya menggunakan 'container mx-auto px-4' untuk layout yang lebih baik 
        daripada 'px-4 w-full'
      */}
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        
        {/* Kiri: Logo & Nama */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoBooky} alt="Booky Logo" className="w-[42px] h-[42px]" />
          <span className="hidden md:block text-xl font-bold text-neutral-900">
            Booky
          </span>
        </Link>

        {/* Tengah: Search Box (Desktop) */}
        <div className="hidden md:flex items-center gap-2 w-[500px] h-11 px-4 py-2 rounded-full border bg-white border-neutral-300">
          <img src={searchIcon} alt="Search" className="w-5 h-5" />
          <input
            type="text"
            placeholder="Search book"
            className="bg-transparent border-none outline-none w-full text-sm font-medium text-neutral-900 placeholder:text-neutral-500"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
          />
        </div>

        {/* Kanan: Ikon & User/Login */}
        {/* --- 5. Tambahkan 'relative' di sini --- */}
        <div className="flex items-center gap-3 relative">
          {/* Ikon Pencarian (Mobile) */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <img
              src={searchIconBlack}
              alt="Search"
              className="w-6 h-6"
            />
          </Button>

          {isLoggedIn ? (
            // === TAMPILAN JIKA SUDAH LOGIN ===
            <>
              <Button variant="ghost" size="icon">
                <img
                  src={cartIcon}
                  alt="Cart"
                  className="w-6 h-[25px]"
                />
              </Button>

              {/* --- 6. Buat area ini bisa di-klik --- */}
              <div 
                className="hidden md:flex items-center gap-2 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
              >
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full"
                />
                {user && (
                  <span className="text-lg font-semibold text-neutral-900">
                    {user.name}
                  </span>
                )}
                <img
                  src={chevronDown}
                  alt=""
                  // --- 7. Animasi putar untuk chevron ---
                  className={`w-6 h-6 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {/* --- 8. Tampilkan Dropdown Logout --- */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-2 text-red-600 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}

              {/* Avatar Mobile (tanpa dropdown untuk kesederhanaan) */}
              <div className="md:hidden">
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </div>
            </>
          ) : (
            // === TAMPILAN JIKA BELUM LOGIN ===
            <>
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  className="w-[163px] h-12 rounded-full border-neutral-300"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  className="w-[163px] h-12 rounded-full bg-[#1C65DA] hover:bg-[#1C65DA]/90"
                  onClick={() => navigate('/login')}
                >
                  Register
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="md:hidden">
                <img
                  src={burgerIcon}
                  alt="Menu"
                  className="w-6 h-6"
                />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};