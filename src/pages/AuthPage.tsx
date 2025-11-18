// // import React, { useState } from 'react';
// // import { useMutation } from '@tanstack/react-query';
// // import { useNavigate } from 'react-router-dom';
// // import { useAppDispatch } from '../store/hooks';
// // import { setCredentials } from '../store/slices/authSlice';
// // import apiClient from '../api';

// // // Impor komponen shadcn/ui
// // import { Button } from '@/components/ui/button';
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from '@/components/ui/card';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import { useToast } from '@/components/ui/use-toast';

// // // Tipe data yang diharapkan dari API setelah sukses
// // interface AuthResponse {
// //   token: string;
// //   user: {
// //     id: string;
// //     name: string;
// //     email: string;
// //   };
// // }

// // // Tipe data untuk error
// // interface ApiError {
// //   response: {
// //     data: {
// //       message: string;
// //     };
// //   };
// // }

// // export default function AuthPage() {
// //   const dispatch = useAppDispatch();
// //   const navigate = useNavigate();
// //   const { toast } = useToast();

// //   // State lokal untuk form
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [name, setName] = useState(''); // Hanya untuk register

// //   // === MUTASI LOGIN ===
// //   const { mutate: login, isPending: isLoggingIn } = useMutation<
// //     AuthResponse,
// //     ApiError,
// //     void
// //   >({
// //     mutationFn: () => {
// //       // Kirim data ke API
// //       return apiClient
// //         .post('/auth/login', { email, password })
// //         .then((res) => res.data);
// //     },
// //     onSuccess: (data) => {
// //       // 1. Simpan token dan user ke Redux
// //       dispatch(setCredentials(data));
// //       // 2. Redirect ke halaman utama
// //       navigate('/');
// //       toast({ title: 'Login Berhasil!', description: 'Selamat datang kembali.' });
// //     },
// //     onError: (error) => {
// //       // Tampilkan notifikasi error
// //       toast({
// //         title: 'Login Gagal',
// //         description:
// //           error.response?.data?.message || 'Terjadi kesalahan.',
// //         variant: 'destructive',
// //       });
// //     },
// //   });

// //   // === MUTASI REGISTER ===
// //   const { mutate: register, isPending: isRegistering } = useMutation<
// //     AuthResponse,
// //     ApiError,
// //     void
// //   >({
// //     mutationFn: () => {
// //       return apiClient
// //         .post('/auth/register', { name, email, password })
// //         .then((res) => res.data);
// //     },
// //     onSuccess: (data) => {
// //       dispatch(setCredentials(data));
// //       navigate('/');
// //       toast({ title: 'Registrasi Berhasil!', description: 'Selamat datang.' });
// //     },
// //     onError: (error) => {
// //       toast({
// //         title: 'Registrasi Gagal',
// //         description:
// //           error.response?.data?.message || 'Terjadi kesalahan.',
// //         variant: 'destructive',
// //       });
// //     },
// //   });

// //   // Handler untuk submit form
// //   const handleLoginSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     login();
// //   };

// //   const handleRegisterSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     register();
// //   };

// //   const isPending = isLoggingIn || isRegistering;

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <Tabs defaultValue="login" className="w-[400px]">
// //         <TabsList className="grid w-full grid-cols-2">
// //           <TabsTrigger value="login">Login</TabsTrigger>
// //           <TabsTrigger value="register">Register</TabsTrigger>
// //         </TabsList>
        
// //         {/* === TAB LOGIN === */}
// //         <TabsContent value="login">
// //           <Card>
// //             <form onSubmit={handleLoginSubmit}>
// //               <CardHeader>
// //                 <CardTitle>Login</CardTitle>
// //                 <CardDescription>
// //                   Masuk ke akun Anda untuk melanjutkan.
// //                 </CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="email-login">Email</Label>
// //                   <Input
// //                     id="email-login"
// //                     type="email"
// //                     placeholder="nama@email.com"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                     required
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="password-login">Password</Label>
// //                   <Input
// //                     id="password-login"
// //                     type="password"
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     required
// //                   />
// //                 </div>
// //               </CardContent>
// //               <CardFooter>
// //                 <Button type="submit" className="w-full" disabled={isPending}>
// //                   {isLoggingIn ? 'Loading...' : 'Login'}
// //                 </Button>
// //               </CardFooter>
// //             </form>
// //           </Card>
// //         </TabsContent>
        
// //         {/* === TAB REGISTER === */}
// //         <TabsContent value="register">
// //           <Card>
// //             <form onSubmit={handleRegisterSubmit}>
// //               <CardHeader>
// //                 <CardTitle>Register</CardTitle>
// //                 <CardDescription>
// //                   Buat akun baru untuk mulai meminjam buku.
// //                 </CardDescription>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="name-register">Nama</Label>
// //                   <Input
// //                     id="name-register"
// //                     placeholder="Nama Lengkap Anda"
// //                     value={name}
// //                     onChange={(e) => setName(e.target.value)}
// //                     required
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="email-register">Email</Label>
// //                   <Input
// //                     id="email-register"
// //                     type="email"
// //                     placeholder="nama@email.com"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                     required
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="password-register">Password</Label>
// //                   <Input
// //                     id="password-register"
// //                     type="password"
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     required
// //                   />
// //                 </div>
// //               </CardContent>
// //               <CardFooter>
// //                 <Button type="submit" className="w-full" disabled={isPending}>
// //                   {isRegistering ? 'Loading...' : 'Register'}
// //                 </Button>
// //               </CardFooter>
// //             </form>
// //           </Card>
// //         </TabsContent>
// //       </Tabs>
// //     </div>
// //   );
// // }

// import React, { useState } from 'react'; // <-- PASTIKAN REACT DI-IMPORT
// import { useMutation } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { useAppDispatch } from '../store/hooks';
// import { setCredentials } from '../store/slices/authSlice'; // Error ini akan hilang setelah authSlice.ts disimpan
// import apiClient from '../api';

// // Impor komponen shadcn/ui (Error ini akan hilang setelah npx add)
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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { toast } from 'sonner';

// // ... (Interface AuthResponse dan ApiError tetap sama)
// interface AuthResponse {
//   token: string;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//   };
// }
// interface ApiError {
//   response: {
//     data: {
//       message: string;
//     };
//   };
// }

// export default function AuthPage() {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
 

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState(''); 

//   // === MUTASI LOGIN ===
//   const { mutate: login, isPending: isLoggingIn } = useMutation<
//     AuthResponse,
//     ApiError,
//     void
//   >({
//     mutationFn: () => {
//       return apiClient
//         .post('/auth/login', { email, password })
//         .then((res) => res.data);
//     },
//     onSuccess: (data) => {
//       dispatch(setCredentials(data));
//       navigate('/');
//       toast.success('Login Berhasil!', { description: 'Selamat datang kembali.' });
//     },
//     onError: (error) => {
//      toast.error('Login Gagal', { 
//         description: error.response?.data?.message || 'Terjadi kesalahan.' 
//       });
//     },
//   });

//   // === MUTASI REGISTER ===
//   const { mutate: register, isPending: isRegistering } = useMutation<
//     AuthResponse,
//     ApiError,
//     void
//   >({
//     mutationFn: () => {
//       return apiClient
//         .post('/auth/register', { name, email, password })
//         .then((res) => res.data);
//     },
//     onSuccess: (data) => {
//       dispatch(setCredentials(data));
//       navigate('/');
//       toast.success('Registrasi Berhasil!', { description: 'Selamat datang.' });
//     },
//     onError: (error) => {
//       toast.error('Registrasi Gagal', { 
//         description: error.response?.data?.message || 'Terjadi kesalahan.' 
//       });
//     },
//   });

//   // Handler untuk submit form
//   // TIPE DIPERBAIKI: React.FormEvent
//   const handleLoginSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     login();
//   };

//   // TIPE DIPERBAIKI: React.FormEvent
//   const handleRegisterSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     register();
//   };

//   const isPending = isLoggingIn || isRegistering;

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Tabs defaultValue="login" className="w-[400px]">
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="login">Login</TabsTrigger>
//           <TabsTrigger value="register">Register</TabsTrigger>
//         </TabsList>
        
//         {/* === TAB LOGIN === */}
//         <TabsContent value="login">
//           <Card>
//             <form onSubmit={handleLoginSubmit}>
//               <CardHeader>
//                 <CardTitle>Login</CardTitle>
//                 <CardDescription>
//                   Masuk ke akun Anda untuk melanjutkan.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email-login">Email</Label>
//                   <Input
//                     id="email-login"
//                     type="email"
//                     placeholder="nama@email.com"
//                     value={email}
//                     // TIPE DIPERBAIKI: React.ChangeEvent<HTMLInputElement>
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="password-login">Password</Label>
//                   <Input
//                     id="password-login"
//                     type="password"
//                     value={password}
//                     // TIPE DIPERBAIKI: React.ChangeEvent<HTMLInputElement>
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button type="submit" className="w-full" disabled={isPending}>
//                   {isLoggingIn ? 'Loading...' : 'Login'}
//                 </Button>
//               </CardFooter>
//             </form>
//           </Card>
//         </TabsContent>
        
//         {/* === TAB REGISTER === */}
//         <TabsContent value="register">
//           <Card>
//             <form onSubmit={handleRegisterSubmit}>
//               <CardHeader>
//                 <CardTitle>Register</CardTitle>
//                 <CardDescription>
//                   Buat akun baru untuk mulai meminjam buku.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name-register">Nama</Label>
//                   <Input
//                     id="name-register"
//                     placeholder="Nama Lengkap Anda"
//                     value={name}
//                     // TIPE DIPERBAIKI: React.ChangeEvent<HTMLInputElement>
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email-register">Email</Label>
//                   <Input
//                     id="email-register"
//                     type="email"
//                     placeholder="nama@email.com"
//                     value={email}
//                     // TIPE DIPERBAIKI: React.ChangeEvent<HTMLInputElement>
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="password-register">Password</Label>
//                   <Input
//                     id="password-register"
//                     type="password"
//                     value={password}
//                     // TIPE DIPERBAIKI: React.ChangeEvent<HTMLInputElement>
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button type="submit" className="w-full" disabled={isPending}>
//                   {isRegistering ? 'Loading...' : 'Register'}
//                 </Button>
//               </CardFooter>
//             </form>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';
import apiClient from '../api';

// Impor komponen shadcn/ui
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Tipe data yang diharapkan dari API LOGIN
interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// Tipe data untuk error
interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
}

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // State untuk form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // State untuk mengontrol Tab
  const [activeTab, setActiveTab] = useState('login');

  // === MUTASI LOGIN ===
  const { mutate: login, isPending: isLoggingIn } = useMutation<
    AuthResponse,
    ApiError,
    void
  >({
    mutationFn: () => {
      // Kirim data ke API
      return apiClient
        .post('/auth/login', { email, password })
        .then((res) => res.data.data); // <- DIUBAH: ambil data dari 'res.data.data'
    },
    onSuccess: (data) => {
      // Data sekarang adalah { token: "...", user: {...} }
      dispatch(setCredentials(data));
      navigate('/');
      toast.success('Login Berhasil!', { description: 'Selamat datang kembali.' });
    },
    onError: (error) => {
     toast.error('Login Gagal', { 
        description: error.response?.data?.message || 'Email atau password salah.' 
      });
    },
  });

  // === MUTASI REGISTER ===
  const { mutate: register, isPending: isRegistering } = useMutation<
    unknown, // Kita tidak perlu data balikan untuk auth
    ApiError,
    void
  >({
    mutationFn: () => {
      return apiClient
        .post('/auth/register', { name, email, password })
        .then((res) => res.data); // <- Cukup ambil respons
    },
    onSuccess: () => {
      // DIUBAH: Jangan login otomatis. Suruh user login.
      toast.success('Registrasi Berhasil!', { 
        description: 'Akun Anda telah dibuat. Silakan login.' 
      });
      setActiveTab('login'); // Pindahkan ke tab login
      // Bersihkan form (opsional)
      setName('');
      setEmail('');
      setPassword('');
    },
    onError: (error) => {
      toast.error('Registrasi Gagal', { 
        description: error.response?.data?.message || 'Email mungkin sudah terdaftar.' 
      });
    },
  });

  // Handler untuk submit form
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register();
  };

  const isPending = isLoggingIn || isRegistering;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-[400px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        {/* === TAB LOGIN === */}
        <TabsContent value="login">
          <Card>
            <form onSubmit={handleLoginSubmit}>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Masuk ke akun Anda untuk melanjutkan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <Input
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isLoggingIn ? 'Loading...' : 'Login'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {/* === TAB REGISTER === */}
        <TabsContent value="register">
          <Card>
            <form onSubmit={handleRegisterSubmit}>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                  Buat akun baru untuk mulai meminjam buku.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-register">Nama</Label>
                  <Input
                    id="name-register"
                    placeholder="Nama Lengkap Anda"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Password</Label>
                  <Input
                    id="password-register"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isRegistering ? 'Loading...' : 'Register'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}