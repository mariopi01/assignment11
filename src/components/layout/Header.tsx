
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

  // State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Untuk User Menu (Desktop & Mobile)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Untuk Menu Burger (Login/Register)

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

  const handleMobileMenuNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };
  
  return (
    // <nav> DIBERI Z-INDEX TINGGI
    <nav className="bg-white sticky top-0 z-60 h-20 border-b border-gray-100">
      {/* INDUK DENGAN RELATIVE & PADDING */}
      <div className="container mx-auto px-4 h-full flex justify-between items-center relative">
        
        {/* === KIRI: Logo & Nama (DIBERI Z-INDEX TERTINGGI agar tidak tertutup mobile search) === */}
        <Link to="/" className="flex items-center gap-2 shrink-0 z-70">
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

        {/* === KANAN: ICONS & USER/LOGIN ATAU MOBILE SEARCH BOX === */}
        {isMobileSearchOpen ? (
            // === KONDISI 1: MOBILE SEARCH BOX (Sejajar dengan Logo) ===
            <div 
                className="flex items-center gap-2 grow shrink-0 min-w-0 md:hidden ml-4"
                style={{
                    height: '40px',
                    gap: '6px',
                    borderRadius: '9999px', 
                    padding: '8px 12px',
                    border: '1px solid #d1d5db', 
                }}
            >
                <img src={searchIcon} alt="Search" className="w-4 h-4 opacity-50 shrink-0" />
                <input
                    type="text"
                    placeholder="Search book"
                    className="bg-transparent border-none outline-none w-full text-sm text-neutral-900 placeholder:text-neutral-500 min-w-0"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchSubmit}
                    onFocus={handleSearchFocus}
                    autoFocus 
                />
                
                {/* Tombol X untuk tutup Search */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="text-neutral-500 hover:bg-transparent shrink-0 w-8 h-8 p-1"
                >
                    <X className="w-6 h-6" />
                </Button>
            </div>
        ) : (
            // === KONDISI 2: DEFAULT ICONS (Ikon Cart, User, Login, Register) ===
            <div className="flex items-center gap-3 relative justify-end">
                
                {/* Ikon Pencarian (Mobile Trigger) */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden"
                    onClick={() => setIsMobileSearchOpen(true)}
                >
                    <img src={searchIconBlack} alt="Search" className="w-6 h-6" />
                </Button>

                {isLoggedIn ? (
                    // === LOGGED IN VIEW ===
                    <>
                    <Link to="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <img src={cartIcon} alt="Cart" className="w-6 h-[25px]" />
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
                                    }}
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </div>
                            )}
                        </Button>
                    </Link>

                    {/* Desktop: Name & Chevron */}
                    <div className="hidden md:flex items-center gap-2 relative">
                        <Link to="/profile">
                            <img src={userAvatar} alt="User Avatar" className="w-12 h-12 rounded-full cursor-pointer" />
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

                    {/* Mobile: Avatar Clickable */}
                    <div 
                        className="md:hidden cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
                    </div>

                    {/* === DROPDOWN MENU (Shared Desktop & Mobile) === */}
                    {isDropdownOpen && (
                        <div 
                        className="absolute top-full right-0 mt-4 bg-white border rounded-xl shadow-lg z-50 flex flex-col p-4 gap-2"
                        style={{ width: '200px', ...SHADOW_STYLE }}
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
                    </>
                ) : (
                    // === NOT LOGGED IN VIEW ===
                    <>
                    {/* Desktop Buttons */}
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

                    {/* Mobile Burger / X Trigger */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                               <X className="w-6 h-6 text-neutral-900" />
                        ) : (
                               <img src={burgerIcon} alt="Menu" className="w-6 h-6" />
                        )}
                    </Button>

                    {/* Mobile Menu (Login/Register Dropdown) */}
                    {isMobileMenuOpen && (
                        <div 
                            className="absolute top-full right-0 mt-2 bg-white border rounded-xl p-4 flex flex-col gap-3 w-[200px] z-50 md:hidden"
                            style={SHADOW_STYLE}
                        >
                            <Button
                                variant="outline"
                                className="w-full h-10 rounded-full border-neutral-300"
                                onClick={() => handleMobileMenuNavigation('/login')}
                            >
                                Login
                            </Button>
                            <Button 
                                className="w-full h-10 rounded-full bg-[#1C65DA] hover:bg-[#1C65DA]/90"
                                onClick={() => handleMobileMenuNavigation('/register')}
                            >
                                Register
                            </Button>
                        </div>
                    )}
                    </>
                )}
            </div>
        )}
      </div>
    </nav>
  );
};