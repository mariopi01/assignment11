
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import apiClient from '../api';

// Impor komponen UI
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// --- 1. Impor Ikon ---
import { Eye, EyeOff } from 'lucide-react';

// Impor logo
import logoBooky from '@/assets/logo_booky.png';

// Tipe data 
interface AuthResponse {
  token: string;
  user: { id: number; name: string; email: string; role: string; };
}
interface ApiError {
  response: { data: { message: string; }; };
}

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // State untuk form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- 2. State untuk validasi dan password toggle ---
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isSubmitted, setIsSubmitted] = useState(false); // Untuk memicu error

  // === MUTASI LOGIN ===
  const { mutate: login, isPending: isLoggingIn } = useMutation<
    AuthResponse,
    ApiError,
    void
  >({
    mutationFn: () => {
      return apiClient
        .post('/auth/login', { email, password })
        .then((res) => res.data.data);
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      navigate('/');
      toast.success('Login Berhasil!', { description: 'Welcome back' });
    },
    onError: (error) => {
     toast.error('Login Gagal', { 
        description: error.response?.data?.message || ' Email or password is not valid' 
      });
    },
  });

  // --- 3. Fungsi Validasi ---
  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email cannot be empty.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'e-mail Format not valid.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password cannot be empty.';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // --- 4. Modifikasi Handler Submit ---
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true); // Tandai bahwa form telah disubmit
    
    if (validateForm()) {
      login(); // Hanya panggil login jika valid
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-[400px] border-0 ">
        
        <CardHeader className="items-start text-left space-y-4">
          <div className="flex items-center gap-2">
            <img src={logoBooky} alt="Booky Logo" className="w-[42px] h-[42px]" />
            <span className="text-3xl font-bold text-neutral-900">Booky</span>
          </div>
          <CardTitle className="text-3xl font-bold text-[#0A0D12]">
            Login
          </CardTitle>
          <CardDescription className="text-md font-semibold text-[#414651]">
            Sign in to manage your library account.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLoginSubmit}>
          <CardContent className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email-login" className="text-sm font-bold text-[#0A0D12]">
                Email
              </Label>
              <Input
                id="email-login"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  if (isSubmitted) validateForm(); // Validasi ulang saat mengetik
                }}
                className={`h-12 rounded-xl border-neutral-300 ${isSubmitted && errors.email ? 'border-red-500' : ''}`}
              />
              {/* --- 5. Tampilkan Error Email --- */}
              {isSubmitted && errors.email && (
                <p className="font-medium text-sm tracking-tighter text-[#EE1D52]">
                  {errors.email}
                </p>
              )}
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password-login" className="text-sm font-bold text-[#0A0D12]">
                Password
              </Label>
              {/* --- 6. Bungkus Input dengan 'relative' --- */}
              <div className="relative">
                <Input
                  id="password-login"
                  // --- 7. Tipe dinamis ---
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    if (isSubmitted) validateForm(); // Validasi ulang saat mengetik
                  }}
                  // --- 8. Tambahkan padding kanan (pr-10) ---
                  className={`h-12 rounded-xl border-neutral-300 pr-10 ${isSubmitted && errors.password ? 'border-red-500' : ''}`}
                />
                {/* --- 9. Tombol Ikon Mata --- */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-12 w-10 text-neutral-500 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              {/* --- 10. Tampilkan Error Password --- */}
              {isSubmitted && errors.password && (
                <p className="font-medium text-sm tracking-tighter text-[#EE1D52]">
                  {errors.password}
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col mt-4 gap-4">
            <Button 
              type="submit" 
              className="w-full h-12 rounded-full bg-[#1C65DA] text-md font-bold text-[#FDFDFD] hover:bg-[#1C65DA]/90" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Loading...' : 'Login'}
            </Button>
            
            <p className="text-md font-semibold text-[#0A0D12]">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-[#1C65DA] hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}