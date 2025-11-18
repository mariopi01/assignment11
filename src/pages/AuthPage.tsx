// // // // import React, { useState } from 'react';
// // // // import { useMutation } from '@tanstack/react-query';
// // // // import { useNavigate } from 'react-router-dom';
// // // // import { useAppDispatch } from '../store/hooks';
// // // // import { setCredentials } from '../store/slices/authSlice';
// // // // import apiClient from '../api';

// // // // // Impor komponen shadcn/ui
// // // // import { Button } from '@/components/ui/button';
// // // // import {
// // // //   Card,
// // // //   CardContent,
// // // //   CardDescription,
// // // //   CardFooter,
// // // //   CardHeader,
// // // //   CardTitle,
// // // // } from '@/components/ui/card';
// // // // import { Input } from '@/components/ui/input';
// // // // import { Label } from '@/components/ui/label';
// // // // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // // // import { useToast } from '@/components/ui/use-toast';

// // // // // Tipe data yang diharapkan dari API setelah sukses
// // // // interface AuthResponse {
// // // //   token: string;
// // // //   user: {
// // // //     id: string;
// // // //     name: string;
// // // //     email: string;
// // // //   };
// // // // }

// // // // // Tipe data untuk error
// // // // interface ApiError {
// // // //   response: {
// // // //     data: {
// // // //       message: string;
// // // //     };
// // // //   };
// // // // }

// // // // export default function AuthPage() {
// // // //   const dispatch = useAppDispatch();
// // // //   const navigate = useNavigate();
// // // //   const { toast } = useToast();

// // // //   // State lokal untuk form
// // // //   const [email, setEmail] = useState('');
// // // //   const [password, setPassword] = useState('');
// // // //   const [name, setName] = useState(''); // Hanya untuk register

// // // //   // === MUTASI LOGIN ===
// // // //   const { mutate: login, isPending: isLoggingIn } = useMutation<
// // // //     AuthResponse,
// // // //     ApiError,
// // // //     void
// // // //   >({
// // // //     mutationFn: () => {
// // // //       // Kirim data ke API
// // // //       return apiClient
// // // //         .post('/auth/login', { email, password })
// // // //         .then((res) => res.data);
// // // //     },
// // // //     onSuccess: (data) => {
// // // //       // 1. Simpan token dan user ke Redux
// // // //       dispatch(setCredentials(data));
// // // //       // 2. Redirect ke halaman utama
// // // //       navigate('/');
// // // //       toast({ title: 'Login Berhasil!', description: 'Selamat datang kembali.' });
// // // //     },
// // // //     onError: (error) => {
// // // //       // Tampilkan notifikasi error
// // // //       toast({
// // // //         title: 'Login Gagal',
// // // //         description:
// // // //           error.response?.data?.message || 'Terjadi kesalahan.',
// // // //         variant: 'destructive',
// // // //       });
// // // //     },
// // // //   });

// // // //   // === MUTASI REGISTER ===
// // // //   const { mutate: register, isPending: isRegistering } = useMutation<
// // // //     AuthResponse,
// // // //     ApiError,
// // // //     void
// // // //   >({
// // // //     mutationFn: () => {
// // // //       return apiClient
// // // //         .post('/auth/register', { name, email, password })
// // // //         .then((res) => res.data);
// // // //     },
// // // //     onSuccess: (data) => {
// // // //       dispatch(setCredentials(data));
// // // //       navigate('/');
// // // //       toast({ title: 'Registrasi Berhasil!', description: 'Selamat datang.' });
// // // //     },
// // // //     onError: (error) => {
// // // //       toast({
// // // //         title: 'Registrasi Gagal',
// // // //         description:
// // // //           error.response?.data?.message || 'Terjadi kesalahan.',
// // // //         variant: 'destructive',
// // // //       });
// // // //     },
// // // //   });

// // // //   // Handler untuk submit form
// // // //   const handleLoginSubmit = (e: React.FormEvent) => {
// // // //     e.preventDefault();
// // // //     login();
// // // //   };

// // // //   const handleRegisterSubmit = (e: React.FormEvent) => {
// // // //     e.preventDefault();
// // // //     register();
// // // //   };

// // // //   const isPending = isLoggingIn || isRegistering;

// // // //   return (
// // // //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// // // //       <Tabs defaultValue="login" className="w-[400px]">
// // // //         <TabsList className="grid w-full grid-cols-2">
// // // //           <TabsTrigger value="login">Login</TabsTrigger>
// // // //           <TabsTrigger value="register">Register</TabsTrigger>
// // // //         </TabsList>
        
// // // //         {/* === TAB LOGIN === */}
// // // //         <TabsContent value="login">
// // // //           <Card>
// // // //             <form onSubmit={handleLoginSubmit}>
// // // //               <CardHeader>
// // // //                 <CardTitle>Login</CardTitle>
// // // //                 <CardDescription>
// // // //                   Masuk ke akun Anda untuk melanjutkan.
// // // //                 </CardDescription>
// // // //               </CardHeader>
// // // //               <CardContent className="space-y-4">
// // // //                 <div className="space-y-2">
// // // //                   <Label htmlFor="email-login">Email</Label>
// // // //                   <Input
// // // //                     id="email-login"
// // // //                     type="email"
// // // //                     placeholder="nama@email.com"
// // // //                     value={email}
// // // //                     onChange={(e) => setEmail(e.target.value)}
// // // //                     required
// // // //                   />
// // // //                 </div>
// // // //                 <div className="space-y-2">
// // // //                   <Label htmlFor="password-login">Password</Label>
// // // //                   <Input
// // // //                     id="password-login"
// // // //                     type="password"
// // // //                     value={password}
// // // //                     onChange={(e) => setPassword(e.target.value)}
// // // //                     required
// // // //                   />
// // // //                 </div>
// // // //               </CardContent>
// // // //               <CardFooter>
// // // //                 <Button type="submit" className="w-full" disabled={isPending}>
// // // //                   {isLoggingIn ? 'Loading...' : 'Login'}
// // // //                 </Button>
// // // //               </CardFooter>
// // // //             </form>
// // // //           </Card>
// // // //         </TabsContent>
        
// // // //         {/* === TAB REGISTER === */}
// // // //         <TabsContent value="register">
// // // //           <Card>
// // // //             <form onSubmit={handleRegisterSubmit}>
// // // //               <CardHeader>
// // // //                 <CardTitle>Register</CardTitle>
// // // //                 <CardDescription>
// // // //                   Buat akun baru untuk mulai meminjam buku.
// // // //                 </CardDescription>
// // // //               </CardHeader>
// // // //               <CardContent className="space-y-4">
// // // //                 <div className="space-y-2">
// // // //                   <Label htmlFor="name-register">Nama</Label>
// // // //                   <Input
// // // //                     id="name-register"
// // // //                     placeholder="Nama Lengkap Anda"
// // // //                     value={name}
// // // //                     onChange={(e) => setName(e.target.value)}
// // // //                     required
// // // //                   />
// // // //                 </div>
// // // //                 <div className="space-y-2">
// // // //                   <Label htmlFor="email-register">Email</Label>
// // // //                   <Input
// // // //                     id="email-register"
// // // //                     type="email"
// // // //                     placeholder="nama@email.com"
// // // //                     value={email}
// // // //                     onChange={(e) => setEmail(e.target.value)}
// // // //                     required
// // // //                   />
// // // //                 </div>
// // // //                 <div className="space-y-2">
// // // //                   <Label htmlFor="password-register">Password</Label>
// // // //                   <Input
// // // //                     id="password-register"
// // // //                     type="password"
// // // //                     value={password}
// // // //                     onChange={(e) => setPassword(e.target.value)}
// // // //                     required
// // // //                   />
// // // //                 </div>
// // // //               </CardContent>
// // // //               <CardFooter>
// // // //                 <Button type="submit" className="w-full" disabled={isPending}>
// // // //                   {isRegistering ? 'Loading...' : 'Register'}
// // // //                 </Button>
// // // //               </CardFooter>
// // // //             </form>
// // // //           </Card>
// // // //         </TabsContent>
// // // //       </Tabs>
// // // //     </div>
// // // //   );
// // // // }

// // // import React, { useState } from 'react'; // <-- PASTIKAN REACT DI-IMPORT
// // // import { useMutation } from '@tanstack/react-query';
// // // import { useNavigate } from 'react-router-dom';
// // // import { useAppDispatch } from '../store/hooks';
// // // import { setCredentials } from '../store/slices/authSlice'; // Error ini akan hilang setelah authSlice.ts disimpan
// // // import apiClient from '../api';

// // // // Impor komponen shadcn/ui (Error ini akan hilang setelah npx add)
// // // import { Button } from '@/components/ui/button';
// // // import {
// // //   Card,
// // //   CardContent,
// // //   CardDescription,
// // //   CardFooter,
// // //   CardHeader,
// // //   CardTitle,
// // // } from '@/components/ui/card';
// // // import { Input } from '@/components/ui/input';
// // // import { Label } from '@/components/ui/label';
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // // import { toast } from 'sonner';

// // // // ... (Interface AuthResponse dan ApiError tetap sama)
// // // interface AuthResponse {
// // //   token: string;
// // //   user: {
// // //     id: string;
// // //     name: string;
// // //     email: string;
// // //   };
// // // }
// // // interface ApiError {
// // //   response: {
// // //     data: {
// // //       message: string;
// // //     };
// // //   };
// // // }

// // // export default function AuthPage() {
// // //   const dispatch = useAppDispatch();
// // //   const navigate = useNavigate();
 

// // //   const [email, setEmail] = useState('');
// // //   const [password, setPassword] = useState('');
// // //   const [name, setName] = useState(''); 

// // //   // === MUTASI LOGIN ===
// // //   const { mutate: login, isPending: isLoggingIn } = useMutation<
// // //     AuthResponse,
// // //     ApiError,
// // //     void
// // //   >({
// // //     mutationFn: () => {
// // //       return apiClient
// // //         .post('/auth/login', { email, password })
// // //         .then((res) => res.data);
// // //     },
// // //     onSuccess: (data) => {
// // //       dispatch(setCredentials(data));
// // //       navigate('/');
// // //       toast.success('Login Berhasil!', { description: 'Selamat datang kembali.' });
// // //     },
// // //     onError: (error) => {
// // //      toast.error('Login Gagal', { 
// // //         description: error.response?.data?.message || 'Terjadi kesalahan.' 
// // //       });
// // //     },
// // //   });

// // //   // === MUTASI REGISTER ===
// // //   const { mutate: register, isPending: isRegistering } = useMutation<
// // //     AuthResponse,
// // //     ApiError,
// // //     void
// // //   >({
// // //     mutationFn: () => {
// // //       return apiClient
// // //         .post('/auth/register', { name, email, password })
// // //         .then((res) => res.data);
// // //     },
// // //     onSuccess: (data) => {
// // //       dispatch(setCredentials(data));
// // //       navigate('/');
// // //       toast.success('Registrasi Berhasil!', { description: 'Selamat datang.' });
// // //     },
// // //     onError: (error) => {
// // //       toast.error('Registrasi Gagal', { 
// // //         description: error.response?.data?.message || 'Terjadi kesalahan.' 
// // //       });
// // //     },
// // //   });

// // //   // Handler untuk submit form
// // //   // TIPE DIPERBAIKI: React.FormEvent
// // //   const handleLoginSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     login();
// // //   };

// // //   // TIPE DIPERBAIKI: React.FormEvent
// // //   const handleRegisterSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     register();
// // //   };

// // //   const isPending = isLoggingIn || isRegistering;

// // //   return (
// // //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// // //       <Tabs defaultValue="login" className="w-[400px]">
// // //         <TabsList className="grid w-full grid-cols-2">
// // //           <TabsTrigger value="login">Login</TabsTrigger>
// // //           <TabsTrigger value="register">Register</TabsTrigger>
// // //         </TabsList>
        
// // //         {/* === TAB LOGIN === */}
// // //         <TabsContent value="login">
// // //           <Card>
// // //             <form onSubmit={handleLoginSubmit}>
// // //               <CardHeader>
// // //                 <CardTitle>Login</CardTitle>
// // //                 <CardDescription>
// // //                   Masuk ke akun Anda untuk melanjutkan.
// // //                 </CardDescription>
// // //               </CardHeader>
// // //               <CardContent className="space-y-4">
// // //                 <div className="space-y-2">
// // //                   <Label htmlFor="email-login">Email</Label>
// // //                   <Input
// // //                     id="email-login"
// // //                     type="email"
// // //                     placeholder="nama@email.com"
// // //                     value={email}
// // //                     // TIPE DIPERBAIKI: React.ChangeEvent<HTMLInputElement>
// // //                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
// // //                     required
// // //                   />
// // //                 </div>
// // //                 <div className="space-y-2">
// // //                   <Label htmlFor="password-login">Password</Label>
// // //                   <Input
// // //                     id="password-login"
// // //                     type="password"
// // //                     value={password}
// // //                     // TIPE DIPERBAIKI: React.ChangeEvent<HTMLInputElement>
// // //                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
// // //                     required
// // //                   />
// // //                 </div>
// // //               </CardContent>
// // //               <CardFooter>
// // //                 <Button type="submit" className="w-full" disabled={isPending}>
// // //                   {isLoggingIn ? 'Loading...' : 'Login'}
// // //                 </Button>
// // //               </CardFooter>
// // //             </form>
// // //           </Card>
// // //         </TabsContent>
        
// // //         {/* === TAB REGISTER === */}
// // //         <TabsContent value="register">
// // //           <Card>
// // //             <form onSubmit={handleRegisterSubmit}>
// // //               <CardHeader>
// // //                 <CardTitle>Register</CardTitle>
// // //                 <CardDescription>
// // //                   Buat akun baru untuk mulai meminjam buku.
// // //                 </CardDescription>
// // //               </CardHeader>
// // //               <CardContent className="space-y-4">
// // //                 <div className="space-y-2">
// // //                   <Label htmlFor="name-register">Nama</Label>
// // //                   <Input
// // //                     id="name-register"
// // //                     placeholder="Nama Lengkap Anda"
// // //                     value={name}
// // //                     // TIPE DIPERBAIKI: React.ChangeEvent<HTMLInputElement>
// // //                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
// // //                     required
// // //                   />
// // //                 </div>
// // //                 <div className="space-y-2">
// // //                   <Label htmlFor="email-register">Email</Label>
// // //                   <Input
// // //                     id="email-register"
// // //                     type="email"
// // //                     placeholder="nama@email.com"
// // //                     value={email}
// // //                     // TIPE DIPERBAIKI: React.ChangeEvent<HTMLInputElement>
// // //                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
// // //                     required
// // //                   />
// // //                 </div>
// // //                 <div className="space-y-2">
// // //                   <Label htmlFor="password-register">Password</Label>
// // //                   <Input
// // //                     id="password-register"
// // //                     type="password"
// // //                     value={password}
// // //                     // TIPE DIPERBAIKI: React.ChangeEvent<HTMLInputElement>
// // //                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
// // //                     required
// // //                   />
// // //                 </div>
// // //               </CardContent>
// // //               <CardFooter>
// // //                 <Button type="submit" className="w-full" disabled={isPending}>
// // //                   {isRegistering ? 'Loading...' : 'Register'}
// // //                 </Button>
// // //               </CardFooter>
// // //             </form>
// // //           </Card>
// // //         </TabsContent>
// // //       </Tabs>
// // //     </div>
// // //   );
// // // }

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
// // import { toast } from 'sonner';

// // // Tipe data yang diharapkan dari API LOGIN
// // interface AuthResponse {
// //   token: string;
// //   user: {
// //     id: number;
// //     name: string;
// //     email: string;
// //     role: string;
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

// //   // State untuk form
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [name, setName] = useState('');
  
// //   // State untuk mengontrol Tab
// //   const [activeTab, setActiveTab] = useState('login');

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
// //         .then((res) => res.data.data); // <- DIUBAH: ambil data dari 'res.data.data'
// //     },
// //     onSuccess: (data) => {
// //       // Data sekarang adalah { token: "...", user: {...} }
// //       dispatch(setCredentials(data));
// //       navigate('/');
// //       toast.success('Login Berhasil!', { description: 'Selamat datang kembali.' });
// //     },
// //     onError: (error) => {
// //      toast.error('Login Gagal', { 
// //         description: error.response?.data?.message || 'Email atau password salah.' 
// //       });
// //     },
// //   });

// //   // === MUTASI REGISTER ===
// //   const { mutate: register, isPending: isRegistering } = useMutation<
// //     unknown, // Kita tidak perlu data balikan untuk auth
// //     ApiError,
// //     void
// //   >({
// //     mutationFn: () => {
// //       return apiClient
// //         .post('/auth/register', { name, email, password })
// //         .then((res) => res.data); // <- Cukup ambil respons
// //     },
// //     onSuccess: () => {
// //       // DIUBAH: Jangan login otomatis. Suruh user login.
// //       toast.success('Registrasi Berhasil!', { 
// //         description: 'Akun Anda telah dibuat. Silakan login.' 
// //       });
// //       setActiveTab('login'); // Pindahkan ke tab login
// //       // Bersihkan form (opsional)
// //       setName('');
// //       setEmail('');
// //       setPassword('');
// //     },
// //     onError: (error) => {
// //       toast.error('Registrasi Gagal', { 
// //         description: error.response?.data?.message || 'Email mungkin sudah terdaftar.' 
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
// //       <Tabs 
// //         value={activeTab} 
// //         onValueChange={setActiveTab} 
// //         className="w-[400px]"
// //       >
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
// //                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
// //                     required
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="password-login">Password</Label>
// //                   <Input
// //                     id="password-login"
// //                     type="password"
// //                     value={password}
// //                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
// //                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
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
// //                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
// //                     required
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label htmlFor="password-register">Password</Label>
// //                   <Input
// //                     id="password-register"
// //                     type="password"
// //                     value={password}
// //                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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

// import React, { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { useNavigate, Link } from 'react-router-dom'; // <-- Impor Link
// import { useAppDispatch } from '../store/hooks';
// import { setCredentials } from '../store/slices/authSlice';
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

// // Tipe data (tetap sama)
// interface AuthResponse {
//   token: string;
//   user: { id: number; name: string; email: string; role: string; };
// }
// interface ApiError {
//   response: { data: { message: string; }; };
// }

// export default function AuthPage() {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   // State hanya untuk login
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   // === MUTASI LOGIN ===
//   const { mutate: login, isPending: isLoggingIn } = useMutation<
//     AuthResponse,
//     ApiError,
//     void
//   >({
//     mutationFn: () => {
//       return apiClient
//         .post('/auth/login', { email, password })
//         .then((res) => res.data.data);
//     },
//     onSuccess: (data) => {
//       dispatch(setCredentials(data));
//       navigate('/');
//       toast.success('Login Berhasil!', { description: 'Selamat datang kembali.' });
//     },
//     onError: (error) => {
//      toast.error('Login Gagal', { 
//         description: error.response?.data?.message || 'Email atau password salah.' 
//       });
//     },
//   });

//   // Handler untuk submit form login
//   const handleLoginSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     login();
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       {/* Container Utama: w-[400px], bg-white */}
//       <Card className="w-[400px] bg-white shadow-lg">
        
//         <CardHeader className="items-center text-center space-y-4">
//           {/* Logo + Booky */}
//           <div className="flex items-center gap-2">
//             <img src={logoBooky} alt="Booky Logo" className="w-[42px] h-[42px]" />
//             <span className="text-3xl font-bold text-neutral-900">Booky</span>
//           </div>
          
//           {/* Text: Login */}
//           <CardTitle className="text-3xl font-bold text-[#0A0D12]">
//             Login
//           </CardTitle>

//           {/* Text: Sign in... */}
//           <CardDescription className="text-md font-semibold text-[#414651]">
//             Sign in to manage your library account.
//           </CardDescription>
//         </CardHeader>
        
//         <form onSubmit={handleLoginSubmit}>
//           {/* Form Fields: Diberi jarak 20px (gap-5 -> space-y-5) */}
//           <CardContent className="space-y-5">
//             {/* Email */}
//             <div className="space-y-2">
//               <Label htmlFor="email-login" className="text-sm font-bold text-[#0A0D12]">
//                 Email
//               </Label>
//               <Input
//                 id="email-login"
//                 type="email"
//                 placeholder="nama@email.com"
//                 value={email}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//                 required
//                 // Styling: h-12 (48px), rounded-xl, border-neutral-300
//                 className="h-12 rounded-xl border-neutral-300"
//               />
//             </div>
            
//             {/* Password */}
//             <div className="space-y-2">
//               <Label htmlFor="password-login" className="text-sm font-bold text-[#0A0D12]">
//                 Password
//               </Label>
//               <Input
//                 id="password-login"
//                 type="password"
//                 value={password}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//                 required
//                 // Styling: h-12 (48px), rounded-xl, border-neutral-300
//                 className="h-12 rounded-xl border-neutral-300"
//               />
//             </div>
//           </CardContent>
          
//           <CardFooter className="flex flex-col gap-4">
//             {/* Login Button */}
//             <Button 
//               type="submit" 
//               className="w-full h-12 rounded-full bg-[#1C65DA] text-md font-bold text-[#FDFDFD] hover:bg-[#1C65DA]/90" 
//               disabled={isLoggingIn}
//             >
//               {isLoggingIn ? 'Loading...' : 'Login'}
//             </Button>
            
//             {/* Register Link */}
//             <p className="text-md font-semibold text-[#0A0D12]">
//               Don't have an account?{" "}
//               <Link to="/register" className="font-semibold text-[#1C65DA] hover:underline">
//                 Register
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

// Tipe data (tetap sama)
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
      toast.success('Login Berhasil!', { description: 'Selamat datang kembali.' });
    },
    onError: (error) => {
     toast.error('Login Gagal', { 
        description: error.response?.data?.message || 'Email atau password salah.' 
      });
    },
  });

  // --- 3. Fungsi Validasi ---
  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email tidak boleh kosong.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password tidak boleh kosong.';
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px] bg-white shadow-lg">
        
        <CardHeader className="items-center text-center space-y-4">
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