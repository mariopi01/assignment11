

import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import apiClient from '@/api'; 
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentUser, logOut } from '@/store/slices/authSlice'; 
import { selectFilters, setSearchTerm } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils'; 

// Impor Ikon Lucide
import { X } from 'lucide-react';

// Impor aset gambar
import logoBooky from '@/assets/logo_booky.png';
import searchIcon from '@/assets/search_icon.png';
import cartIcon from '@/assets/cart_icon.png';
import userAvatar from '@/assets/user_avatar.png';
import chevronDown from '@/assets/chevron-down.png';
import searchIconBlack from '@/assets/search_icon_black.png';
import burgerIcon from '@/assets/burger_icon.png';

// Konstanta Styling
const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; 

// Tipe Data Minimal untuk Cart Response
interface CartItem {
  qty: number;
}
interface CartResponse {
  items: CartItem[];
}

export const Header = () => {
  const { isLoggedIn } = useAuth();
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { searchTerm } = useAppSelector(selectFilters);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); 

  // === FETCH DATA CART (Untuk Badge) ===
  const { data: cartData } = useQuery<CartResponse>({
    queryKey: ['my-cart'], 
    queryFn: async () => {
      const res = await apiClient.get('/cart');
      return res.data.data;
    },
    enabled: isLoggedIn, 
  });

  const cartCount = cartData?.items?.reduce((acc, item) => acc + item.qty, 0) || 0;

  // --- HANDLERS ---
  const handleSearchFocus = () => {
    navigate('/category'); 
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate('/category'); 
    }
  };

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
    setIsDropdownOpen(false);
  };

  const handleDropdownNavigation = (path: string) => {
    setIsDropdownOpen(false);
    navigate(path);
  };
  
  return (
    <nav className="bg-white sticky top-0 z-10 h-20">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        
        {/* === KIRI: Logo & Nama === */}

        <Link to="/" className="flex items-center gap-2 shrink-0  ">
          <img src={logoBooky} alt="Booky Logo" className="w-[42px] h-[42px]" />
          <span className="hidden md:block text-4xl font-bold text-neutral-900">
            Booky
          </span>
        </Link>

        {/* === TENGAH: Search Box (Desktop Only) === */}
        <div className="hidden md:flex items-center gap-2 w-[500px] h-11 px-4 py-2 rounded-full border bg-white border-neutral-300">
          <img src={searchIcon} alt="Search" className="w-5 h-5" />
          <input
            type="text"
            placeholder="Search book"
            className="bg-transparent border-none outline-none w-full text-sm font-medium text-neutral-900 placeholder:text-neutral-500"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            onFocus={handleSearchFocus} 
          />
        </div>

        {/* === KANAN: Icons & User/Login === */}
        <div className="flex items-center gap-3 relative justify-end">
          
          {/* --- MOBILE SEARCH VIEW (Aktif saat search icon diklik) --- */}
          {isMobileSearchOpen ? (
             <div className="flex items-center gap-2 md:hidden animate-in fade-in slide-in-from-right-5 duration-200">
                {/* Search Box Mobile */}
                <div 
                    className="flex items-center w-auto bg-white border border-gray-300"
                    style={{
                         // Lebar tetap sesuai request
                        height: '40px',
                        gap: '6px',
                        borderRadius: '9999px', 
                        padding: '8px 12px',
                        borderWidth: '1px'
                    }}
                >
                    <img src={searchIcon} alt="Search" className="w-4 h-4 opacity-50" />
                    <input
                        type="text"
                        placeholder="Search book"
                        className="bg-transparent border-none outline-none w-full text-sm text-neutral-900 placeholder:text-neutral-500"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchSubmit}
                        onFocus={handleSearchFocus}
                        autoFocus 
                    />
                </div>

                {/* Tombol X untuk tutup */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="text-neutral-500 hover:bg-transparent shrink-0"
                >
                    <X className="w-6 h-6" />
                </Button>
             </div>
          ) : (
             // --- DEFAULT VIEW (Search Icon, Cart, User/Burger) ---
             <>
                {/* Ikon Pencarian (Mobile Trigger) */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden"
                    onClick={() => setIsMobileSearchOpen(true)}
                >
                    <img
                    src={searchIconBlack}
                    alt="Search"
                    className="w-6 h-6"
                    />
                </Button>

                {isLoggedIn ? (
                    // === TAMPILAN JIKA SUDAH LOGIN ===
                    <>
                    <Link to="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <img
                                src={cartIcon}
                                alt="Cart"
                                className="w-6 h-[25px]"
                            />
                            
                            {/* CART BADGE */}
                            {cartCount > 0 && (
                                <div 
                                    className="absolute flex items-center justify-center text-white font-bold text-[10px]"
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#EE1D52',
                                        borderRadius: '833.33px', 
                                        padding: '6.67px', 
                                        gap: '6.67px',
                                        top: '-5px', 
                                        right: '-5px',
                                        boxSizing: 'border-box' 
                                    }}
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </div>
                            )}
                        </Button>
                    </Link>

                    {/* Dropdown Toggle Area (Desktop) */}
                    <div className="hidden md:flex items-center gap-2 relative">
                        <Link to="/profile">
                            <img
                                src={userAvatar}
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full cursor-pointer"
                            />
                        </Link>

                        <div
                            className="flex items-center gap-2 cursor-pointer select-none"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                        >
                            {user && (
                            <span className="text-lg font-semibold text-neutral-900">
                                {user.name}
                            </span>
                            )}
                            <img
                            src={chevronDown}
                            alt=""
                            className={`w-6 h-6 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div 
                        className="absolute top-full right-0 mt-4 bg-white border rounded-xl shadow-lg z-20 flex flex-col p-4 gap-2"
                        style={{ width: '184px', ...SHADOW_STYLE }}
                        >
                            <Button
                                variant="ghost"
                                className={cn("w-full justify-start font-semibold rounded-lg h-10 p-2")}
                                onClick={() => handleDropdownNavigation('/profile')}
                            >
                                Profile
                            </Button>
                            
                            <Button
                                variant="ghost"
                                className={cn("w-full justify-start font-semibold rounded-lg h-10 p-2")}
                                onClick={() => handleDropdownNavigation('/my-loans')}
                            >
                                Borrowed List
                            </Button>

                            <Button
                                variant="ghost"
                                className={cn("w-full justify-start font-semibold rounded-lg h-10 p-2")}
                                onClick={() => handleDropdownNavigation('/my-reviews')}
                            >
                                Reviews
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-full justify-start p-2 text-red-600 font-semibold hover:text-red-700 rounded-lg h-10"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    )}

                    {/* Avatar Mobile */}
                    <Link to="/profile" className="md:hidden">
                        <img
                        src={userAvatar}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                        />
                    </Link>
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
                        onClick={() => navigate('/register')}
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
             </>
          )}
        </div>
      </div>
    </nav>
  );
};