// import React, { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { useNavigate, Link } from 'react-router-dom';
// import apiClient from '../api';

// // Impor komponen UI
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';

// // Impor logo
// import logoBooky from '@/assets/logo_booky.png';

// // Tipe data
// interface ApiError {
//   response: { data: { message: string; }; };
// }

// export default function RegisterPage() {
//   const navigate = useNavigate();

//   // State untuk register
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // === MUTASI REGISTER ===
//   const { mutate: register, isPending: isRegistering } = useMutation<
//     unknown,
//     ApiError,
//     void
//   >({
//     mutationFn: () => {
//       return apiClient
//         .post('/auth/register', { name, email, password })
//         .then((res) => res.data);
//     },
//     onSuccess: () => {
//       toast.success('Registrasi Berhasil!', { 
//         description: 'Akun Anda telah dibuat. Silakan login.' 
//       });
//       navigate('/login'); // Arahkan ke halaman login
//     },
//     onError: (error) => {
//       toast.error('Registrasi Gagal', { 
//         description: error.response?.data?.message || 'Email mungkin sudah terdaftar.' 
//       });
//     },
//   });

//   // Handler untuk submit form register
//   const handleRegisterSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     register();
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Card className="w-[400px] bg-white shadow-lg">
        
//         <CardHeader className="items-center text-center space-y-4">
//           {/* Logo + Booky */}
//           <div className="flex items-center gap-2">
//             <img src={logoBooky} alt="Booky Logo" className="w-[42px] h-[42px]" />
//             <span className="text-3xl font-bold text-neutral-900">Booky</span>
//           </div>
          
//           <CardTitle className="text-3xl font-bold text-[#0A0D12]">
//             Register
//           </CardTitle>
//           <CardDescription className="text-md font-semibold text-[#414651]">
//             Create an account to get started.
//           </CardDescription>
//         </CardHeader>
        
//         <form onSubmit={handleRegisterSubmit}>
//           <CardContent className="space-y-5">
//             {/* Name */}
//             <div className="space-y-2">
//               <Label htmlFor="name-register" className="text-sm font-bold text-[#0A0D12]">
//                 Name
//               </Label>
//               <Input
//                 id="name-register"
//                 placeholder="Nama Lengkap Anda"
//                 value={name}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
//                 required
//                 className="h-12 rounded-xl border-neutral-300"
//               />
//             </div>

//             {/* Email */}
//             <div className="space-y-2">
//               <Label htmlFor="email-register" className="text-sm font-bold text-[#0A0D12]">
//                 Email
//               </Label>
//               <Input
//                 id="email-register"
//                 type="email"
//                 placeholder="nama@email.com"
//                 value={email}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//                 required
//                 className="h-12 rounded-xl border-neutral-300"
//               />
//             </div>
            
//             {/* Password */}
//             <div className="space-y-2">
//               <Label htmlFor="password-register" className="text-sm font-bold text-[#0A0D12]">
//                 Password
//               </Label>
//               <Input
//                 id="password-register"
//                 type="password"
//                 value={password}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//                 required
//                 className="h-12 rounded-xl border-neutral-300"
//               />
//             </div>
//           </CardContent>
          
//           <CardFooter className="flex flex-col gap-4">
//             {/* Register Button */}
//             <Button 
//               type="submit" 
//               className="w-full h-12 rounded-full bg-[#1C65DA] text-md font-bold text-[#FDFDFD] hover:bg-[#1C65DA]/90" 
//               disabled={isRegistering}
//             >
//               {isRegistering ? 'Loading...' : 'Register'}
//             </Button>
            
//             {/* Login Link */}
//             <p className="text-md font-semibold text-[#0A0D12]">
//               Already have an account?{" "}
//               <Link to="/login" className="font-semibold text-[#1C65DA] hover:underline">
//                 Login
//               </Link>
//             </p>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   );
// }

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

// --- 1. Impor Ikon ---
import { Eye, EyeOff } from 'lucide-react';

// Impor logo
import logoBooky from '@/assets/logo_booky.png';

// Tipe data
interface ApiError {
  response: { data: { message: string; }; };
}

export default function RegisterPage() {
  const navigate = useNavigate();

  // --- 2. State untuk form (termasuk field baru) ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // State baru untuk No. HP
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State baru untuk Konfirmasi

  // State untuk UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // === MUTASI REGISTER ===
  const { mutate: register, isPending: isRegistering } = useMutation<
    unknown,
    ApiError,
    void
  >({
    mutationFn: () => {
      // PENTING: API hanya menerima name, email, password.
      // 'phone' dan 'confirmPassword' hanya untuk validasi sisi client.
      return apiClient
        .post('/auth/register', { name, email, password })
        .then((res) => res.data);
    },
    onSuccess: () => {
      toast.success('Registrasi Berhasil!', { 
        description: 'Akun Anda telah dibuat. Silakan login.' 
      });
      navigate('/login');
    },
    onError: (error) => {
      toast.error('Registrasi Gagal', { 
        description: error.response?.data?.message || 'Email mungkin sudah terdaftar.' 
      });
    },
  });

  // --- 3. Fungsi Validasi Diperbarui ---
  const validateForm = () => {
    const newErrors = { name: '', email: '', phone: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!name) {
      newErrors.name = 'Nama tidak boleh kosong.';
      isValid = false;
    }
    
    if (!email) {
      newErrors.email = 'Email tidak boleh kosong.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid.';
      isValid = false;
    }

    if (!phone) {
      newErrors.phone = 'Nomor handphone tidak boleh kosong.';
      isValid = false;
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phone = 'Nomor handphone harus berupa angka.';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password tidak boleh kosong.';
      isValid = false;
    } else if (password.length < 6) { // Asumsi minimal 6 karakter
      newErrors.password = 'Password minimal 6 karakter.';
      isValid = false;
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak boleh kosong.';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password dan konfirmasi tidak cocok.';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handler untuk submit form register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    if (validateForm()) {
      register();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12">
      {/* Container: w-[400px], gap-20px (diterapkan via space-y-5) */}
      <Card className="w-[400px] bg-white shadow-lg">
        
        {/* --- 4. Header: items-start dan text-left --- */}
        <CardHeader className="items-start text-left space-y-4">
          {/* Logo + Booky */}
          <div className="flex items-center gap-2">
            <img src={logoBooky} alt="Booky Logo" className="w-[42px] h-[42px]" />
            <span className="text-3xl font-bold text-neutral-900">Booky</span>
          </div>
          
          <CardTitle className="text-3xl font-bold text-[#0A0D12]">
            Register
          </CardTitle>
          <CardDescription className="text-md font-semibold text-[#414651]">
            Create your account to start borrowing books.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleRegisterSubmit}>
          {/* gap-20px (diterapkan via space-y-5) */}
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
                onChange={(e) => {
                  setName(e.target.value);
                  if (isSubmitted) validateForm();
                }}
                className={`h-12 rounded-xl border-neutral-300 ${isSubmitted && errors.name ? 'border-[#EE1D52]' : ''}`}
              />
              {isSubmitted && errors.name && (
                <p className="font-medium text-sm tracking-tighter text-[#EE1D52]">
                  {errors.name}
                </p>
              )}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (isSubmitted) validateForm();
                }}
                className={`h-12 rounded-xl border-neutral-300 ${isSubmitted && errors.email ? 'border-[#EE1D52]' : ''}`}
              />
              {isSubmitted && errors.email && (
                <p className="font-medium text-sm tracking-tighter text-[#EE1D52]">
                  {errors.email}
                </p>
              )}
            </div>
            
            {/* --- 5. Field Baru: Nomor Handphone --- */}
            <div className="space-y-2">
              <Label htmlFor="phone-register" className="text-sm font-bold text-[#0A0D12]">
                Nomor Handphone
              </Label>
              <Input
                id="phone-register"
                type="tel" // Tipe 'tel' untuk input telepon
                placeholder="08123456789"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (isSubmitted) validateForm();
                }}
                className={`h-12 rounded-xl border-neutral-300 ${isSubmitted && errors.phone ? 'border-[#EE1D52]' : ''}`}
              />
              {isSubmitted && errors.phone && (
                <p className="font-medium text-sm tracking-tighter text-[#EE1D52]">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password-register" className="text-sm font-bold text-[#0A0D12]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password-register"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (isSubmitted) validateForm();
                  }}
                  className={`h-12 rounded-xl border-neutral-300 pr-10 ${isSubmitted && errors.password ? 'border-[#EE1D52]' : ''}`}
                />
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
              {isSubmitted && errors.password && (
                <p className="font-medium text-sm tracking-tighter text-[#EE1D52]">
                  {errors.password}
                </p>
              )}
            </div>

            {/* --- 6. Field Baru: Confirm Password --- */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password-register" className="text-sm font-bold text-[#0A0D12]">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password-register"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (isSubmitted) validateForm();
                  }}
                  className={`h-12 rounded-xl border-neutral-300 pr-10 ${isSubmitted && errors.confirmPassword ? 'border-[#EE1D52]' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0 h-12 w-10 text-neutral-500 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              {isSubmitted && errors.confirmPassword && (
                <p className="font-medium text-sm tracking-tighter text-[#EE1D52]">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col mt-4 gap-4">
            {/* Submit Button */}
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