import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
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

// Impor logo
import logoBooky from '@/assets/logo_booky.png';

// Tipe data
interface ApiError {
  response: { data: { message: string; }; };
}

export default function RegisterPage() {
  const navigate = useNavigate();

  // State untuk register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // === MUTASI REGISTER ===
  const { mutate: register, isPending: isRegistering } = useMutation<
    unknown,
    ApiError,
    void
  >({
    mutationFn: () => {
      return apiClient
        .post('/auth/register', { name, email, password })
        .then((res) => res.data);
    },
    onSuccess: () => {
      toast.success('Registrasi Berhasil!', { 
        description: 'Akun Anda telah dibuat. Silakan login.' 
      });
      navigate('/login'); // Arahkan ke halaman login
    },
    onError: (error) => {
      toast.error('Registrasi Gagal', { 
        description: error.response?.data?.message || 'Email mungkin sudah terdaftar.' 
      });
    },
  });

  // Handler untuk submit form register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px] bg-white shadow-lg">
        
        <CardHeader className="items-center text-center space-y-4">
          {/* Logo + Booky */}
          <div className="flex items-center gap-2">
            <img src={logoBooky} alt="Booky Logo" className="w-[42px] h-[42px]" />
            <span className="text-3xl font-bold text-neutral-900">Booky</span>
          </div>
          
          <CardTitle className="text-3xl font-bold text-[#0A0D12]">
            Register
          </CardTitle>
          <CardDescription className="text-md font-semibold text-[#414651]">
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleRegisterSubmit}>
          <CardContent className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name-register" className="text-sm font-bold text-[#0A0D12]">
                Name
              </Label>
              <Input
                id="name-register"
                placeholder="Nama Lengkap Anda"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
                className="h-12 rounded-xl border-neutral-300"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email-register" className="text-sm font-bold text-[#0A0D12]">
                Email
              </Label>
              <Input
                id="email-register"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-neutral-300"
              />
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password-register" className="text-sm font-bold text-[#0A0D12]">
                Password
              </Label>
              <Input
                id="password-register"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-neutral-300"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            {/* Register Button */}
            <Button 
              type="submit" 
              className="w-full h-12 rounded-full bg-[#1C65DA] text-md font-bold text-[#FDFDFD] hover:bg-[#1C65DA]/90" 
              disabled={isRegistering}
            >
              {isRegistering ? 'Loading...' : 'Register'}
            </Button>
            
            {/* Login Link */}
            <p className="text-md font-semibold text-[#0A0D12]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#1C65DA] hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}