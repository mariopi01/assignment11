// // // // // // // // import { useQuery } from '@tanstack/react-query';
// // // // // // // // import apiClient from '@/api';
// // // // // // // // import { useAppSelector } from '@/store/hooks';
// // // // // // // // import { selectCurrentUser } from '@/store/slices/authSlice';
// // // // // // // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // // // // // // import { Loader2, TriangleAlert } from 'lucide-react';

// // // // // // // // // Tipe untuk statistik
// // // // // // // // interface UserStats {
// // // // // // // //   totalLoans: number;
// // // // // // // //   activeLoans: number;
// // // // // // // //   reviewsWritten: number;
// // // // // // // // }

// // // // // // // // export default function MyProfilePage() {
// // // // // // // //   // Ambil data user yang sedang login dari Redux
// // // // // // // //   const user = useAppSelector(selectCurrentUser);

// // // // // // // //   // Ambil data statistik dari API
// // // // // // // //   const { data: stats, isPending, isError } = useQuery<UserStats>({
// // // // // // // //     queryKey: ['my-stats'],
// // // // // // // //     queryFn: async () => {
// // // // // // // //       const res = await apiClient.get('/users/me/stats');
// // // // // // // //       return res.data;
// // // // // // // //     },
// // // // // // // //   });

// // // // // // // //   if (!user) {
// // // // // // // //     return <p>Silakan login untuk melihat profil.</p>;
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <div className="space-y-6">
// // // // // // // //       <h1 className="text-3xl font-bold">Profil Saya</h1>
      
// // // // // // // //       <Card>
// // // // // // // //         <CardHeader>
// // // // // // // //           <CardTitle>Informasi Akun</CardTitle>
// // // // // // // //         </CardHeader>
// // // // // // // //         <CardContent className="space-y-4">
// // // // // // // //           <div>
// // // // // // // //             <p className="text-sm font-medium text-muted-foreground">Nama</p>
// // // // // // // //             <p className="text-lg">{user.name}</p>
// // // // // // // //           </div>
// // // // // // // //           <div>
// // // // // // // //             <p className="text-sm font-medium text-muted-foreground">Email</p>
// // // // // // // //             <p className="text-lg">{user.email}</p>
// // // // // // // //           </div>
// // // // // // // //         </CardContent>
// // // // // // // //       </Card>
      
// // // // // // // //       <Card>
// // // // // // // //         <CardHeader>
// // // // // // // //           <CardTitle>Statistik Pinjaman</CardTitle>
// // // // // // // //         </CardHeader>
// // // // // // // //         <CardContent>
// // // // // // // //           {isPending && <Loader2 className="animate-spin" />}
// // // // // // // //           {isError && <p className="text-red-500">Gagal memuat statistik.</p>}
// // // // // // // //           {stats && (
// // // // // // // //             <div className="grid grid-cols-3 gap-4">
// // // // // // // //               <div className="text-center p-4 bg-gray-100 rounded-lg">
// // // // // // // //                 <p className="text-3xl font-bold">{stats.totalLoans}</p>
// // // // // // // //                 <p className="text-muted-foreground">Total Pinjaman</p>
// // // // // // // //               </div>
// // // // // // // //               <div className="text-center p-4 bg-gray-100 rounded-lg">
// // // // // // // //                 <p className="text-3xl font-bold">{stats.activeLoans}</p>
// // // // // // // //                 <p className="text-muted-foreground">Sedang Dipinjam</p>
// // // // // // // //               </div>
// // // // // // // //               <div className="text-center p-4 bg-gray-100 rounded-lg">
// // // // // // // //                 <p className="text-3xl font-bold">{stats.reviewsWritten}</p>
// // // // // // // //                 <p className="text-muted-foreground">Ulasan Ditulis</p>
// // // // // // // //               </div>
// // // // // // // //             </div>
// // // // // // // //           )}
// // // // // // // //         </CardContent>
// // // // // // // //       </Card>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // src/pages/MyProfilePage.tsx

// // // // // // // import { useQuery } from '@tanstack/react-query';
// // // // // // // import apiClient from '@/api';
// // // // // // // import { useAppSelector } from '@/store/hooks';
// // // // // // // import { selectCurrentUser } from '@/store/slices/authSlice';
// // // // // // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // // // // // import { Loader2, TriangleAlert } from 'lucide-react'; // Sekarang TriangleAlert akan terpakai

// // // // // // // // 1. TAMBAHKAN IMPORT ALERT (Asumsi Anda sudah 'npx shadcn-ui@latest add alert')
// // // // // // // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// // // // // // // // Tipe untuk statistik
// // // // // // // interface UserStats {
// // // // // // //   totalLoans: number;
// // // // // // //   activeLoans: number;
// // // // // // //   reviewsWritten: number;
// // // // // // // }

// // // // // // // // 2. BUAT KOMPONEN ERROR DISPLAY AGAR KONSISTEN
// // // // // // // const ErrorDisplay = ({ message }: { message: string }) => (
// // // // // // //   <Alert variant="destructive">
// // // // // // //     <TriangleAlert className="h-4 w-4" />
// // // // // // //     <AlertTitle>Error</AlertTitle>
// // // // // // //     <AlertDescription>{message}</AlertDescription>
// // // // // // //   </Alert>
// // // // // // // );

// // // // // // // export default function MyProfilePage() {
// // // // // // //   // Ambil data user yang sedang login dari Redux
// // // // // // //   const user = useAppSelector(selectCurrentUser);

// // // // // // //   // Ambil data statistik dari API
// // // // // // //   const { data: stats, isPending, isError, error } = useQuery<UserStats, Error>({
// // // // // // //     queryKey: ['my-stats'],
// // // // // // //     queryFn: async () => {
// // // // // // //       const res = await apiClient.get('/users/me/stats');
// // // // // // //       return res.data;
// // // // // // //     },
// // // // // // //   });

// // // // // // //   if (!user) {
// // // // // // //     return <p>Silakan login untuk melihat profil.</p>;
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <div className="space-y-6">
// // // // // // //       <h1 className="text-3xl font-bold">Profil Saya</h1>
      
// // // // // // //       <Card>
// // // // // // //         <CardHeader>
// // // // // // //           <CardTitle>Informasi Akun</CardTitle>
// // // // // // //         </CardHeader>
// // // // // // //         <CardContent className="space-y-4">
// // // // // // //           <div>
// // // // // // //             <p className="text-sm font-medium text-muted-foreground">Nama</p>
// // // // // // //             <p className="text-lg">{user.name}</p>
// // // // // // //           </div>
// // // // // // //           <div>
// // // // // // //             <p className="text-sm font-medium text-muted-foreground">Email</p>
// // // // // // //             <p className="text-lg">{user.email}</p>
// // // // // // //           </div>
// // // // // // //         </CardContent>
// // // // // // //       </Card>
      
// // // // // // //       <Card>
// // // // // // //         <CardHeader>
// // // // // // //           <CardTitle>Statistik Pinjaman</CardTitle>
// // // // // // //         </CardHeader>
// // // // // // //         <CardContent>
// // // // // // //           {isPending && <Loader2 className="animate-spin" />}

// // // // // // //           {/* 3. GANTI <p> DENGAN KOMPONEN ERROR YANG BARU */}
// // // // // // //           {isError && <ErrorDisplay message={error?.message || 'Gagal memuat statistik.'} />}
          
// // // // // // //           {/* Tampilkan statistik hanya jika tidak loading DAN tidak error */}
// // // // // // //           {stats && !isPending && !isError && (
// // // // // // //             <div className="grid grid-cols-3 gap-4">
// // // // // // //               <div className="text-center p-4 bg-gray-100 rounded-lg">
// // // // // // //                 <p className="text-3xl font-bold">{stats.totalLoans}</p>
// // // // // // //                 <p className="text-muted-foreground">Total Pinjaman</p>
// // // // // // //               </div>
// // // // // // //               <div className="text-center p-4 bg-gray-100 rounded-lg">
// // // // // // //                 <p className="text-3xl font-bold">{stats.activeLoans}</p>
// // // // // // //                 <p className="text-muted-foreground">Sedang Dipinjam</p>
// // // // // // //               </div>
// // // // // // //               <div className="text-center p-4 bg-gray-100 rounded-lg">
// // // // // // //                 <p className="text-3xl font-bold">{stats.reviewsWritten}</p>
// // // // // // //                 <p className="text-muted-foreground">Ulasan Ditulis</p>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //         </CardContent>
// // // // // // //       </Card>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }


// // // // // // // src/pages/MyProfilePage.tsx

// // // // // // import { useQuery } from '@tanstack/react-query';
// // // // // // import { useNavigate, useLocation, Link } from 'react-router-dom';
// // // // // // import apiClient from '@/api';
// // // // // // import { useAppSelector } from '@/store/hooks';
// // // // // // import { selectCurrentUser } from '@/store/slices/authSlice';
// // // // // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // // // // // import { Button } from '@/components/ui/button';
// // // // // // import { Loader2, TriangleAlert } from 'lucide-react';
// // // // // // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // // // // // import { cn } from '@/lib/utils';
// // // // // // import userAvatar from '@/assets/user_avatar.png'; // Import avatar asset

// // // // // // // Tipe untuk statistik (dibiarkan untuk konsistensi API)
// // // // // // interface UserStats {
// // // // // //   totalLoans: number;
// // // // // //   activeLoans: number;
// // // // // //   reviewsWritten: number;
// // // // // // }

// // // // // // // Komponen Pembantu
// // // // // // const ErrorDisplay = ({ message }: { message: string }) => (
// // // // // //   <Alert variant="destructive">
// // // // // //     <TriangleAlert className="h-4 w-4" />
// // // // // //     <AlertTitle>Error</AlertTitle>
// // // // // //     <AlertDescription>{message}</AlertDescription>
// // // // // //   </Alert>
// // // // // // );

// // // // // // // Konstanta Styling
// // // // // // const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; // #CBCACA40
// // // // // // // display-sm: 3rem / 1.2, letter-spacing: -3%
// // // // // // const TITLE_STYLE = { fontSize: '3rem', lineHeight: '1.2', letterSpacing: '-0.03em' }; 
// // // // // // // text-md bold, letter-spacing: -2%
// // // // // // const TEXT_MD_BOLD = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 

// // // // // // const TABS = [
// // // // // //   { name: 'Profile', path: '/profile' },
// // // // // //   { name: 'Borrowed List', path: '/my-loans' },
// // // // // //   { name: 'Review', path: '/profile?tab=reviews' }, // Dummy/Future route
// // // // // // ];

// // // // // // // Komponen Navigation Box
// // // // // // const NavigationBox = () => {
// // // // // //     const location = useLocation();
    
// // // // // //     // Logic untuk menentukan rute aktif
// // // // // //     const isActive = (path: string) => {
// // // // // //         // Cek path penuh (termasuk query params untuk tab Review)
// // // // // //         return location.pathname + location.search === path;
// // // // // //     };
    
// // // // // //     return (
// // // // // //         <div 
// // // // // //             className="flex gap-2 p-2 rounded-xl shrink-0" 
// // // // // //             style={{ width: '557px', height: '56px', background: '#F5F5F5' }}
// // // // // //         >
// // // // // //             {TABS.map((tab) => {
// // // // // //                 const active = isActive(tab.path);
                
// // // // // //                 // Gunakan Link untuk navigasi
// // // // // //                 return (
// // // // // //                     <Link
// // // // // //                         key={tab.name}
// // // // // //                         to={tab.path}
// // // // // //                         className="flex-1"
// // // // // //                     >
// // // // // //                         <Button
// // // // // //                             asChild // Pastikan Button menjadi wrapper untuk Link
// // // // // //                             variant={active ? 'default' : 'ghost'}
// // // // // //                             className={cn(
// // // // // //                                 "w-full h-full rounded-xl text-base font-bold text-[#0A0D12]",
// // // // // //                                 "hover:bg-white hover:text-[#0A0D12]", // Hover style
// // // // // //                                 active && "bg-white text-[#0A0D12] hover:bg-white", // Active style
// // // // // //                                 // Terapkan shadow hanya pada elemen aktif
// // // // // //                             )}
// // // // // //                             style={active ? SHADOW_STYLE : {}}
// // // // // //                         >
// // // // // //                              <span>{tab.name}</span>
// // // // // //                         </Button>
// // // // // //                     </Link>
// // // // // //                 );
// // // // // //             })}
// // // // // //         </div>
// // // // // //     );
// // // // // // };


// // // // // // export default function MyProfilePage() {
// // // // // //   const user = useAppSelector(selectCurrentUser);
  
// // // // // //   // Fetch stats (dibiarkan untuk konsistensi, tapi data tidak ditampilkan di kartu utama)
// // // // // //   const { isPending: isStatsPending, isError: isStatsError } = useQuery<UserStats, Error>({
// // // // // //     queryKey: ['my-stats'],
// // // // // //     queryFn: async () => {
// // // // // //       // API call untuk data statistik
// // // // // //       const res = await apiClient.get('/users/me/stats');
// // // // // //       return res.data.data;
// // // // // //     },
// // // // // //     enabled: !!user,
// // // // // //   });

// // // // // //   if (!user) {
// // // // // //     return <p>Loading user data...</p>;
// // // // // //   }
  
// // // // // //   // Tentukan konten yang akan ditampilkan (saat ini hanya Profile)
// // // // // //   const renderProfileContent = () => (
// // // // // //     // Container Utama Profile: width: 557px
// // // // // //     <Card 
// // // // // //         className="flex flex-col items-center justify-start p-5 gap-0" // Hapus gap default Card, atur jarak secara manual
// // // // // //         style={{ width: '557px', height: '298px', borderRadius: '16px', ...SHADOW_STYLE }}
// // // // // //     >
// // // // // //         {/* User Avatar */}
// // // // // //         <img
// // // // // //             src={userAvatar}
// // // // // //             alt="User Avatar"
// // // // // //             className="w-16 h-16 rounded-full shrink-0"
// // // // // //         />

// // // // // //         {/* Name: text-md bold, letter-spacing -2% */}
// // // // // //         <h2 className="font-bold text-lg text-[#0A0D12] pt-4" style={TEXT_MD_BOLD}>
// // // // // //             {user.name}
// // // // // //         </h2>
        
// // // // // //         {/* Email: text-md bold, letter-spacing -2% */}
// // // // // //         <p className="font-bold text-lg text-muted-foreground pt-0" style={TEXT_MD_BOLD}>
// // // // // //             {user.email}
// // // // // //         </p>

// // // // // //         <div className="flex-grow pt-8"></div> 
        
// // // // // //         {/* Button "Update Profile" */}
// // // // // //         <Button 
// // // // // //             className="h-11 rounded-full text-white font-bold"
// // // // // //             style={{ width: '517px', background: '#1C65DA', padding: '8px' }}
// // // // // //         >
// // // // // //             Update Profile
// // // // // //         </Button>
// // // // // //     </Card>
// // // // // //   );


// // // // // //   return (
// // // // // //     <div className="flex flex-col items-center space-y-8 min-h-screen">
      
// // // // // //       {/* 1. Page Title "Profile" */}
// // // // // //       <h1 className="font-extrabold text-[#0A0D12] text-center" 
// // // // // //           style={TITLE_STYLE}>
// // // // // //           Profile
// // // // // //       </h1>
      
// // // // // //       {/* 2. Navigation Box (w: 557) */}
// // // // // //       <NavigationBox />

// // // // // //       {/* 3. Main Content Container (Profile Details) */}
// // // // // //       {renderProfileContent()}
      
// // // // // //       {/* Tampilkan error/loading untuk stats di luar kartu utama jika perlu */}
// // // // // //        {isStatsPending && <Loader2 className="animate-spin" />}
// // // // // //        {isStatsError && <ErrorDisplay message="Gagal memuat statistik pengguna." />}

// // // // // //     </div>
// // // // // //   );
// // // // // // }



// // // // // // src/pages/MyProfilePage.tsx

// // // // // import { useQuery } from '@tanstack/react-query';
// // // // // import { useLocation, Link } from 'react-router-dom';
// // // // // import apiClient from '@/api';
// // // // // import { useAppSelector } from '@/store/hooks';
// // // // // import { selectCurrentUser } from '@/store/slices/authSlice';
// // // // // import { Card } from '@/components/ui/card';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import { Loader2, TriangleAlert } from 'lucide-react';
// // // // // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // // // // import { cn } from '@/lib/utils';
// // // // // import userAvatar from '@/assets/user_avatar.png'; // User Avatar Asset

// // // // // // Tipe untuk statistik dari API /api/me
// // // // // interface UserStats {
// // // // //   borrowed: number;
// // // // //   late: number;
// // // // //   returned: number;
// // // // //   total: number;
// // // // // }

// // // // // // Komponen Pembantu untuk Menampilkan Error
// // // // // const ErrorDisplay = ({ message }: { message: string }) => (
// // // // //   <Alert variant="destructive">
// // // // //     <TriangleAlert className="h-4 w-4" />
// // // // //     <AlertTitle>Error</AlertTitle>
// // // // //     <AlertDescription>{message}</AlertDescription>
// // // // //   </Alert>
// // // // // );

// // // // // // Konstanta Styling
// // // // // const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; // #CBCACA40
// // // // // // display-sm: 3rem / 1.2, letter-spacing: -3%
// // // // // const TITLE_STYLE = { fontSize: '3rem', lineHeight: '1.2', letterSpacing: '-0.03em' }; 
// // // // // // text-md bold, letter-spacing: -2%
// // // // // const TEXT_MD_BOLD = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 

// // // // // const TABS = [
// // // // //   { name: 'Profile', path: '/profile' },
// // // // //   { name: 'Borrowed List', path: '/my-loans' },
// // // // //   { name: 'Review', path: '/profile?tab=reviews' }, // Tab Review (untuk masa depan)
// // // // // ];

// // // // // // 1. Komponen Navigation Box
// // // // // const NavigationBox = () => {
// // // // //     const location = useLocation();
    
// // // // //     // Logic untuk menentukan rute aktif
// // // // //     const isActive = (path: string) => {
// // // // //         // Bandingkan pathname dan search (untuk tab review)
// // // // //         return location.pathname + location.search === path;
// // // // //     };
    
// // // // //     return (
// // // // //         <div 
// // // // //             className="flex gap-2 p-2 rounded-xl shrink-0" 
// // // // //             style={{ width: '557px', height: '56px', background: '#F5F5F5' }}
// // // // //         >
// // // // //             {TABS.map((tab) => {
// // // // //                 const active = isActive(tab.path);
                
// // // // //                 return (
// // // // //                     <Link
// // // // //                         key={tab.name}
// // // // //                         to={tab.path}
// // // // //                         className="flex-1"
// // // // //                     >
// // // // //                         <Button
// // // // //                             asChild
// // // // //                             variant={active ? 'default' : 'ghost'}
// // // // //                             className={cn(
// // // // //                                 "w-full h-full rounded-xl text-base font-bold text-[#0A0D12]",
// // // // //                                 "hover:bg-white hover:text-[#0A0D12]",
// // // // //                                 active && "bg-white text-[#0A0D12] hover:bg-white",
// // // // //                             )}
// // // // //                             style={active ? SHADOW_STYLE : {}}
// // // // //                         >
// // // // //                              <span>{tab.name}</span>
// // // // //                         </Button>
// // // // //                     </Link>
// // // // //                 );
// // // // //             })}
// // // // //         </div>
// // // // //     );
// // // // // };


// // // // // export default function MyProfilePage() {
// // // // //   // Ambil data user dari Redux (data ini diisi saat login)
// // // // //   const user = useAppSelector(selectCurrentUser);
  
// // // // //   // Menggunakan useQuery untuk mengambil data profil lengkap dan statistik (endpoint /me)
// // // // //   // Ini adalah cara yang lebih tepat daripada hanya mengambil loanStats
// // // // //   const { isPending: isProfileLoading, isError: isProfileError } = useQuery<{ loanStats: UserStats, reviewsCount: number }, Error>({
// // // // //     queryKey: ['my-full-profile'],
// // // // //     queryFn: async () => {
// // // // //       const res = await apiClient.get('/me');
// // // // //       // Response API yang Anda berikan memiliki struktur { data: { profile: {...}, loanStats: {...}, reviewsCount: 0 } }
// // // // //       // Kita hanya mengambil bagian loanStats dan reviewsCount di sini karena profile sudah ada di Redux
// // // // //       return res.data.data; 
// // // // //     },
// // // // //     enabled: !!user,
// // // // //   });

// // // // //   if (!user) {
// // // // //     return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
// // // // //   }
  
// // // // //   // 3. Konten Container Utama Profile
// // // // //   const renderProfileContent = () => (
// // // // //     <Card 
// // // // //         // Styling Card: width: 557; height: 298; border-radius: 16px; padding: 20px;
// // // // //         className="flex flex-col items-center justify-start p-5 gap-0"
// // // // //         style={{ 
// // // // //             width: '557px', 
// // // // //             height: '298px', 
// // // // //             borderRadius: '16px', 
// // // // //             background: '#FFFFFF', 
// // // // //             ...SHADOW_STYLE 
// // // // //         }}
// // // // //     >
// // // // //         {/* User Avatar (64x64) */}
// // // // //         <img
// // // // //             src={userAvatar}
// // // // //             alt="User Avatar"
// // // // //             className="w-16 h-16 rounded-full shrink-0"
// // // // //         />

// // // // //         {/* Name */}
// // // // //         <h2 className="font-bold text-lg text-[#0A0D12] pt-4" style={TEXT_MD_BOLD}>
// // // // //             {user.name}
// // // // //         </h2>
        
// // // // //         {/* Email */}
// // // // //         <p className="font-bold text-lg text-muted-foreground pt-0" style={TEXT_MD_BOLD}>
// // // // //             {user.email}
// // // // //         </p>

// // // // //         {/* Spacer untuk mendorong tombol ke bawah */}
// // // // //         <div className="grow pt-8"></div> 
        
// // // // //         {/* Button "Update Profile" (w: 517; h: 44; rounded-full) */}
// // // // //         <Button 
// // // // //             className="h-11 rounded-full text-white font-bold"
// // // // //             style={{ width: '517px', background: '#1C65DA', padding: '8px' }}
// // // // //         >
// // // // //             Update Profile
// // // // //         </Button>
// // // // //     </Card>
// // // // //   );


// // // // //   return (
// // // // //     <div className="flex flex-col items-center space-y-8 min-h-screen">
      
// // // // //       {/* 2. Page Title "Profile" */}
// // // // //       <h1 className="font-extrabold text-[#0A0D12] text-center" 
// // // // //           style={TITLE_STYLE}>
// // // // //           Profile
// // // // //       </h1>
      
// // // // //       {/* 1. Navigation Box */}
// // // // //       <NavigationBox />

// // // // //       {/* Tampilkan loading/error untuk data tambahan, jika ada */}
// // // // //       {isProfileLoading ? (
// // // // //         <Loader2 className="animate-spin w-8 h-8 text-primary" />
// // // // //       ) : isProfileError ? (
// // // // //         <ErrorDisplay message="Gagal memuat detail dan statistik profil." />
// // // // //       ) : (
// // // // //         /* 3. Main Content Container (Profile Details) */
// // // // //         renderProfileContent()
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }


// // // // import { useQuery } from '@tanstack/react-query';
// // // // import { useLocation, Link } from 'react-router-dom';
// // // // import apiClient from '@/api';
// // // // import { useAppSelector } from '@/store/hooks';
// // // // import { selectCurrentUser } from '@/store/slices/authSlice';
// // // // import { Card } from '@/components/ui/card';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Loader2, TriangleAlert } from 'lucide-react';
// // // // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // // // import { cn } from '@/lib/utils';
// // // // import userAvatar from '@/assets/user_avatar.png'; // User Avatar Asset

// // // // // Tipe untuk statistik dari API /api/me
// // // // interface UserStats {
// // // //   borrowed: number;
// // // //   late: number;
// // // //   returned: number;
// // // //   total: number;
// // // // }

// // // // // Komponen Pembantu untuk Menampilkan Error
// // // // const ErrorDisplay = ({ message }: { message: string }) => (
// // // //   <Alert variant="destructive">
// // // //     <TriangleAlert className="h-4 w-4" />
// // // //     <AlertTitle>Error</AlertTitle>
// // // //     <AlertDescription>{message}</AlertDescription>
// // // //   </Alert>
// // // // );

// // // // // Konstanta Styling
// // // // const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; // #CBCACA40
// // // // // display-sm: 3rem / 1.2, letter-spacing: -3%
// // // // const TITLE_STYLE = { fontSize: '3rem', lineHeight: '1.2', letterSpacing: '-0.03em' }; 
// // // // // text-md bold, letter-spacing: -2%
// // // // const TEXT_MD_BOLD = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 

// // // // const TABS = [
// // // //   { name: 'Profile', path: '/profile' },
// // // //   { name: 'Borrowed List', path: '/my-loans' },
// // // //   { name: 'Review', path: '/profile?tab=reviews' }, // Tab Review (untuk masa depan)
// // // // ];

// // // // // 1. Komponen Navigation Box
// // // // const NavigationBox = () => {
// // // //     const location = useLocation();
    
// // // //     // Logic untuk menentukan rute aktif
// // // //     const isActive = (path: string) => {
// // // //         // Bandingkan pathname dan search (untuk tab review)
// // // //         return location.pathname + location.search === path;
// // // //     };
    
// // // //     return (
// // // //         <div 
// // // //             className="flex gap-2 p-2 rounded-xl shrink-0" 
// // // //             style={{ width: '557px', height: '56px', background: '#F5F5F5' }}
// // // //         >
// // // //             {TABS.map((tab) => {
// // // //                 const active = isActive(tab.path);
                
// // // //                 return (
// // // //                     <Link
// // // //                         key={tab.name}
// // // //                         to={tab.path}
// // // //                         className="flex-1"
// // // //                     >
// // // //                         <Button
// // // //                             asChild
// // // //                             variant={active ? 'default' : 'ghost'}
// // // //                             className={cn(
// // // //                                 "w-full h-full rounded-xl text-base font-bold text-[#0A0D12]",
// // // //                                 "hover:bg-white hover:text-[#0A0D12]",
// // // //                                 active && "bg-white text-[#0A0D12] hover:bg-white",
// // // //                             )}
// // // //                             style={active ? SHADOW_STYLE : {}}
// // // //                         >
// // // //                              <span>{tab.name}</span>
// // // //                         </Button>
// // // //                     </Link>
// // // //                 );
// // // //             })}
// // // //         </div>
// // // //     );
// // // // };


// // // // export default function MyProfilePage() {
// // // //   // Ambil data user dari Redux (data ini diisi saat login)
// // // //   const user = useAppSelector(selectCurrentUser);
  
// // // //   // FIX: Menggunakan useQuery untuk mengambil data profil lengkap dan statistik (endpoint /me)
// // // //   const { 
// // // //       data: profileData, // <-- Variabel baru untuk menampung data yang berhasil di-fetch
// // // //       isPending: isProfileLoading, 
// // // //       isError: isProfileError 
// // // //   } = useQuery<{ loanStats: UserStats, reviewsCount: number }, Error>({
// // // //     queryKey: ['my-full-profile'],
// // // //     queryFn: async () => {
// // // //       const res = await apiClient.get('/me');
// // // //       // Mengambil data yang sebenarnya dari res.data.data sesuai struktur API
// // // //       return res.data.data; 
// // // //     },
// // // //     enabled: !!user,
// // // //   });

// // // //   if (!user) {
// // // //     return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
// // // //   }
  
// // // //   // 3. Konten Container Utama Profile
// // // //   const renderProfileContent = () => (
// // // //     <Card 
// // // //         // Styling Card: width: 557; height: 298; border-radius: 16px; padding: 20px;
// // // //         className="flex flex-col items-center justify-start p-5 gap-0"
// // // //         style={{ 
// // // //             width: '557px', 
// // // //             height: '298px', 
// // // //             borderRadius: '16px', 
// // // //             background: '#FFFFFF', 
// // // //             ...SHADOW_STYLE 
// // // //         }}
// // // //     >
// // // //         {/* User Avatar (64x64) */}
// // // //         <img
// // // //             src={userAvatar}
// // // //             alt="User Avatar"
// // // //             className="w-16 h-16 rounded-full shrink-0"
// // // //         />

// // // //         {/* Name */}
// // // //         <h2 className="font-bold text-lg text-[#0A0D12] pt-4" style={TEXT_MD_BOLD}>
// // // //             {user.name}
// // // //         </h2>
        
// // // //         {/* Email */}
// // // //         <p className="font-bold text-lg text-muted-foreground pt-0" style={TEXT_MD_BOLD}>
// // // //             {user.email}
// // // //         </p>

// // // //         {/* Spacer untuk mendorong tombol ke bawah */}
// // // //         <div className="grow pt-8"></div> 
        
// // // //         {/* Button "Update Profile" (w: 517; h: 44; rounded-full) */}
// // // //         <Button 
// // // //             className="h-11 rounded-full text-white font-bold"
// // // //             style={{ width: '517px', background: '#1C65DA', padding: '8px' }}
// // // //         >
// // // //             Update Profile
// // // //         </Button>
// // // //     </Card>
// // // //   );


// // // //   return (
// // // //     <div className="flex flex-col items-center space-y-8 min-h-screen">
      
// // // //       {/* 2. Page Title "Profile" */}
// // // //       <h1 className="font-extrabold text-[#0A0D12] text-center" 
// // // //           style={TITLE_STYLE}>
// // // //           Profile
// // // //       </h1>
      
// // // //       {/* 1. Navigation Box */}
// // // //       <NavigationBox />

// // // //       {/* Tampilkan loading/error untuk data tambahan, jika ada */}
// // // //       {isProfileLoading ? (
// // // //         <Loader2 className="animate-spin w-8 h-8 text-primary" />
// // // //       ) : isProfileError ? (
// // // //         <ErrorDisplay message="Gagal memuat detail dan statistik profil." />
// // // //       ) : (
// // // //         // Wrapper untuk konten utama dan statistik
// // // //         <div className="flex flex-col items-center space-y-6">
            
// // // //             {/* 3. Main Content Container (Profile Details) */}
// // // //             {renderProfileContent()}
            
// // // //             {/* BAGIAN BARU: Tampilkan Statistik Pinjaman */}
// // // //             {profileData && (
// // // //                 <Card 
// // // //                   className="p-5 flex flex-col justify-start gap-4" 
// // // //                   style={{ width: '557px', borderRadius: '16px', ...SHADOW_STYLE }}
// // // //                 >
// // // //                     <h3 className="font-bold text-xl text-[#0A0D12]">Statistics</h3>
// // // //                     <div className="grid grid-cols-3 gap-4 text-center">
// // // //                         <div className="p-3 bg-gray-100 rounded-lg">
// // // //                             <p className="text-2xl font-bold">{profileData.loanStats.borrowed}</p>
// // // //                             <p className="text-sm text-muted-foreground">Borrowed</p>
// // // //                         </div>
// // // //                         <div className="p-3 bg-gray-100 rounded-lg">
// // // //                             <p className="text-2xl font-bold">{profileData.loanStats.returned}</p>
// // // //                             <p className="text-sm text-muted-foreground">Returned</p>
// // // //                         </div>
// // // //                         <div className="p-3 bg-gray-100 rounded-lg">
// // // //                             <p className="text-2xl font-bold">{profileData.reviewsCount}</p>
// // // //                             <p className="text-sm text-muted-foreground">Reviews</p>
// // // //                         </div>
// // // //                     </div>
// // // //                 </Card>
// // // //             )}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }


// // // import { useQuery } from '@tanstack/react-query';
// // // import { useLocation, Link } from 'react-router-dom';
// // // import apiClient from '@/api';
// // // import { useAppSelector } from '@/store/hooks';
// // // import { selectCurrentUser } from '@/store/slices/authSlice';
// // // import { Card } from '@/components/ui/card';
// // // import { Button } from '@/components/ui/button';
// // // import { Loader2, TriangleAlert } from 'lucide-react';
// // // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // // import { cn } from '@/lib/utils';
// // // import userAvatar from '@/assets/user_avatar.png'; // User Avatar Asset

// // // // Tipe untuk statistik dari API /api/me
// // // interface UserStats {
// // //   borrowed: number;
// // //   late: number;
// // //   returned: number;
// // //   total: number;
// // // }

// // // // Komponen Pembantu untuk Menampilkan Error
// // // const ErrorDisplay = ({ message }: { message: string }) => (
// // //   <Alert variant="destructive">
// // //     <TriangleAlert className="h-4 w-4" />
// // //     <AlertTitle>Error</AlertTitle>
// // //     <AlertDescription>{message}</AlertDescription>
// // //   </Alert>
// // // );

// // // // Konstanta Styling
// // // const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; // #CBCACA40
// // // // display-sm: 3rem / 1.2, letter-spacing: -3%
// // // const TITLE_STYLE = { fontSize: '3rem', lineHeight: '1.2', letterSpacing: '-0.03em' }; 
// // // // text-md bold, letter-spacing: -2%
// // // const TEXT_MD_BOLD = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 

// // // const TABS = [
// // //   { name: 'Profile', path: '/profile' },
// // //   { name: 'Borrowed List', path: '/my-loans' },
// // //   { name: 'Review', path: '/profile?tab=reviews' }, // Tab Review (untuk masa depan)
// // // ];

// // // // 1. Komponen Navigation Box
// // // const NavigationBox = () => {
// // //     const location = useLocation();
    
// // //     // Logic untuk menentukan rute aktif
// // //     const isActive = (path: string) => {
// // //         // Bandingkan pathname dan search (untuk tab review)
// // //         return location.pathname + location.search === path;
// // //     };
    
// // //     return (
// // //         <div 
// // //             className="flex gap-2 p-2 rounded-xl shrink-0" 
// // //             style={{ width: '557px', height: '56px', background: '#F5F5F5' }}
// // //         >
// // //             {TABS.map((tab) => {
// // //                 const active = isActive(tab.path);
                
// // //                 return (
// // //                     <Link
// // //                         key={tab.name}
// // //                         to={tab.path}
// // //                         className="flex-1"
// // //                     >
// // //                         <Button
// // //                             asChild
// // //                             variant={active ? 'default' : 'ghost'}
// // //                             className={cn(
// // //                                 "w-full h-full rounded-xl text-base font-bold text-[#0A0D12]",
// // //                                 "hover:bg-white hover:text-[#0A0D12]",
// // //                                 active && "bg-white text-[#0A0D12] hover:bg-white",
// // //                             )}
// // //                             style={active ? SHADOW_STYLE : {}}
// // //                         >
// // //                              <span>{tab.name}</span>
// // //                         </Button>
// // //                     </Link>
// // //                 );
// // //             })}
// // //         </div>
// // //     );
// // // };


// // // export default function MyProfilePage() {
// // //   // Ambil data user dari Redux (data ini diisi saat login)
// // //   const user = useAppSelector(selectCurrentUser);
  
// // //   // FIX: Mengambil data dan error object, dan menerapkan timeout
// // //   const { 
// // //       data: profileData,
// // //       isPending: isProfileLoading, 
// // //       isError: isProfileError,
// // //       error // Ambil objek error untuk pesan yang lebih spesifik
// // //   } = useQuery<{ loanStats: UserStats, reviewsCount: number }, Error>({
// // //     queryKey: ['my-full-profile'],
// // //     queryFn: async () => {
// // //       // FIX UTAMA: Tambahkan timeout 8 detik pada permintaan Axios
// // //       // Jika request menggantung, ini akan memaksa query untuk gagal (isError=true)
// // //       const res = await apiClient.get('/me', { timeout: 8000 }); 
// // //       return res.data.data; 
// // //     },
// // //     enabled: !!user,
// // //   });

// // //   if (!user) {
// // //     return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
// // //   }
  
// // //   // 3. Konten Container Utama Profile
// // //   const renderProfileContent = () => (
// // //     <Card 
// // //         // Styling Card: width: 557; height: 298; border-radius: 16px; padding: 20px;
// // //         className="flex flex-col items-center justify-start p-5 gap-0"
// // //         style={{ 
// // //             width: '557px', 
// // //             height: '298px', 
// // //             borderRadius: '16px', 
// // //             background: '#FFFFFF', 
// // //             ...SHADOW_STYLE 
// // //         }}
// // //     >
// // //         {/* User Avatar (64x64) */}
// // //         <img
// // //             src={userAvatar}
// // //             alt="User Avatar"
// // //             className="w-16 h-16 rounded-full shrink-0"
// // //         />

// // //         {/* Name */}
// // //         <h2 className="font-bold text-lg text-[#0A0D12] pt-4" style={TEXT_MD_BOLD}>
// // //             {user.name}
// // //         </h2>
        
// // //         {/* Email */}
// // //         <p className="font-bold text-lg text-muted-foreground pt-0" style={TEXT_MD_BOLD}>
// // //             {user.email}
// // //         </p>

// // //         {/* Spacer untuk mendorong tombol ke bawah */}
// // //         <div className="grow pt-8"></div> 
        
// // //         {/* Button "Update Profile" (w: 517; h: 44; rounded-full) */}
// // //         <Button 
// // //             className="h-11 rounded-full text-white font-bold"
// // //             style={{ width: '517px', background: '#1C65DA', padding: '8px' }}
// // //         >
// // //             Update Profile
// // //         </Button>
// // //     </Card>
// // //   );


// // //   return (
// // //     <div className="flex flex-col items-center space-y-8 min-h-screen">
      
// // //       {/* 2. Page Title "Profile" */}
// // //       <h1 className="font-extrabold text-[#0A0D12] text-center" 
// // //           style={TITLE_STYLE}>
// // //           Profile
// // //       </h1>
      
// // //       {/* 1. Navigation Box */}
// // //       <NavigationBox />

// // //       {/* Tampilkan loading/error untuk data tambahan, jika ada */}
// // //       {isProfileLoading ? (
// // //         <Loader2 className="animate-spin w-8 h-8 text-primary" />
// // //       ) : isProfileError ? (
// // //         // Perbaikan: Menampilkan pesan error yang lebih spesifik jika request gagal
// // //         <ErrorDisplay message={error?.message || "Gagal memuat detail dan statistik profil. Cek koneksi Anda."} />
// // //       ) : (
// // //         // Wrapper untuk konten utama dan statistik
// // //         <div className="flex flex-col items-center space-y-6">
            
// // //             {/* 3. Main Content Container (Profile Details) */}
// // //             {renderProfileContent()}
            
// // //             {/* BAGIAN STATISTIK */}
// // //             {profileData && (
// // //                 <Card 
// // //                   className="p-5 flex flex-col justify-start gap-4" 
// // //                   style={{ width: '557px', borderRadius: '16px', ...SHADOW_STYLE }}
// // //                 >
// // //                     <h3 className="font-bold text-xl text-[#0A0D12]">Statistics</h3>
// // //                     <div className="grid grid-cols-3 gap-4 text-center">
// // //                         <div className="p-3 bg-gray-100 rounded-lg">
// // //                             <p className="text-2xl font-bold">{profileData.loanStats.borrowed}</p>
// // //                             <p className="text-sm text-muted-foreground">Borrowed</p>
// // //                         </div>
// // //                         <div className="p-3 bg-gray-100 rounded-lg">
// // //                             <p className="text-2xl font-bold">{profileData.loanStats.returned}</p>
// // //                             <p className="text-sm text-muted-foreground">Returned</p>
// // //                         </div>
// // //                         <div className="p-3 bg-gray-100 rounded-lg">
// // //                             <p className="text-2xl font-bold">{profileData.reviewsCount}</p>
// // //                             <p className="text-sm text-muted-foreground">Reviews</p>
// // //                         </div>
// // //                     </div>
// // //                 </Card>
// // //             )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // import { useQuery } from '@tanstack/react-query';
// // import { useLocation, Link } from 'react-router-dom';
// // import apiClient from '@/api';
// // import { useAppSelector } from '@/store/hooks';
// // import { selectCurrentUser } from '@/store/slices/authSlice';
// // import { Card } from '@/components/ui/card';
// // import { Button } from '@/components/ui/button';
// // import { Loader2, TriangleAlert } from 'lucide-react';
// // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // import { cn } from '@/lib/utils';
// // import userAvatar from '@/assets/user_avatar.png'; // User Avatar Asset

// // // Tipe untuk statistik dari API /api/me
// // interface UserStats {
// //   borrowed: number;
// //   late: number;
// //   returned: number;
// //   total: number;
// // }

// // // Komponen Pembantu untuk Menampilkan Error
// // const ErrorDisplay = ({ message }: { message: string }) => (
// //   <Alert variant="destructive">
// //     <TriangleAlert className="h-4 w-4" />
// //     <AlertTitle>Error</AlertTitle>
// //     <AlertDescription>{message}</AlertDescription>
// //   </Alert>
// // );

// // // Konstanta Styling
// // const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; // #CBCACA40
// // // display-sm: 3rem / 1.2, letter-spacing: -3%
// // const TITLE_STYLE = { fontSize: '3rem', lineHeight: '1.2', letterSpacing: '-0.03em' }; 
// // // text-md bold, letter-spacing: -2%
// // const TEXT_MD_BOLD = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 

// // const TABS = [
// //   { name: 'Profile', path: '/profile' },
// //   { name: 'Borrowed List', path: '/my-loans' },
// //   { name: 'Review', path: '/profile?tab=reviews' }, // Tab Review (untuk masa depan)
// // ];

// // // 1. Komponen Navigation Box
// // const NavigationBox = () => {
// //     const location = useLocation();
    
// //     // Logic untuk menentukan rute aktif
// //     const isActive = (path: string) => {
// //         // Bandingkan pathname dan search (untuk tab review)
// //         return location.pathname + location.search === path;
// //     };
    
// //     return (
// //         <div 
// //             className="flex gap-2 p-2 rounded-xl shrink-0" 
// //             style={{ width: '557px', height: '56px', background: '#F5F5F5' }}
// //         >
// //             {TABS.map((tab) => {
// //                 const active = isActive(tab.path);
                
// //                 return (
// //                     <Link
// //                         key={tab.name}
// //                         to={tab.path}
// //                         className="flex-1"
// //                     >
// //                         <Button
// //                             asChild
// //                             variant={active ? 'default' : 'ghost'}
// //                             className={cn(
// //                                 "w-full h-full rounded-xl text-base font-bold text-[#0A0D12]",
// //                                 "hover:bg-white hover:text-[#0A0D12]",
// //                                 active && "bg-white text-[#0A0D12] hover:bg-white",
// //                             )}
// //                             style={active ? SHADOW_STYLE : {}}
// //                         >
// //                              <span>{tab.name}</span>
// //                         </Button>
// //                     </Link>
// //                 );
// //             })}
// //         </div>
// //     );
// // };


// // export default function MyProfilePage() {
// //   // Ambil data user dari Redux (data ini diisi saat login)
// //   const user = useAppSelector(selectCurrentUser);
  
// //   // FIX: Mengambil data dan error object
// //   const { 
// //       data: profileData,
// //       isPending: isProfileLoading, 
// //       isError: isProfileError,
// //       error // Ambil objek error untuk pesan yang lebih spesifik
// //   } = useQuery<{ loanStats: UserStats, reviewsCount: number }, Error>({
// //     queryKey: ['my-full-profile'],
// //     queryFn: async () => {
// //       // Tidak perlu lagi timeout lokal karena sudah ada di apiClient
// //       const res = await apiClient.get('/me'); 
// //       return res.data.data; 
// //     },
// //     enabled: !!user,
// //   });

// //   if (!user) {
// //     return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
// //   }
  
// //   // 3. Konten Container Utama Profile
// //   const renderProfileContent = () => (
// //     <Card 
// //         // Styling Card: width: 557; height: 298; border-radius: 16px; padding: 20px;
// //         className="flex flex-col items-center justify-start p-5 gap-0"
// //         style={{ 
// //             width: '557px', 
// //             height: '298px', 
// //             borderRadius: '16px', 
// //             background: '#FFFFFF', 
// //             ...SHADOW_STYLE 
// //         }}
// //     >
// //         {/* User Avatar (64x64) */}
// //         <img
// //             src={userAvatar}
// //             alt="User Avatar"
// //             className="w-16 h-16 rounded-full shrink-0"
// //         />

// //         {/* Name */}
// //         <h2 className="font-bold text-lg text-[#0A0D12] pt-4" style={TEXT_MD_BOLD}>
// //             {user.name}
// //         </h2>
        
// //         {/* Email */}
// //         <p className="font-bold text-lg text-muted-foreground pt-0" style={TEXT_MD_BOLD}>
// //             {user.email}
// //         </p>

// //         {/* Spacer untuk mendorong tombol ke bawah */}
// //         <div className="grow pt-8"></div> 
        
// //         {/* Button "Update Profile" (w: 517; h: 44; rounded-full) */}
// //         <Button 
// //             className="h-11 rounded-full text-white font-bold"
// //             style={{ width: '517px', background: '#1C65DA', padding: '8px' }}
// //         >
// //             Update Profile
// //         </Button>
// //     </Card>
// //   );


// //   return (
// //     <div className="flex flex-col items-center space-y-8 min-h-screen">
      
// //       {/* 2. Page Title "Profile" */}
// //       <h1 className="font-extrabold text-[#0A0D12] text-center" 
// //           style={TITLE_STYLE}>
// //           Profile
// //       </h1>
      
// //       {/* 1. Navigation Box */}
// //       <NavigationBox />

// //       {/* Tampilkan loading/error untuk data tambahan, jika ada */}
// //       {isProfileLoading ? (
// //         <Loader2 className="animate-spin w-8 h-8 text-primary" />
// //       ) : isProfileError ? (
// //         // Menampilkan pesan error yang lebih spesifik jika request gagal/timeout
// //         <ErrorDisplay message={error?.message || "Gagal memuat detail dan statistik profil. Cek koneksi API Anda."} />
// //       ) : (
// //         // Wrapper untuk konten utama dan statistik
// //         <div className="flex flex-col items-center space-y-6">
            
// //             {/* 3. Main Content Container (Profile Details) */}
// //             {renderProfileContent()}
            
// //             {/* BAGIAN STATISTIK */}
// //             {profileData && (
// //                 <Card 
// //                   className="p-5 flex flex-col justify-start gap-4" 
// //                   style={{ width: '557px', borderRadius: '16px', ...SHADOW_STYLE }}
// //                 >
// //                     <h3 className="font-bold text-xl text-[#0A0D12]">Statistics</h3>
// //                     <div className="grid grid-cols-3 gap-4 text-center">
// //                         <div className="p-3 bg-gray-100 rounded-lg">
// //                             <p className="text-2xl font-bold">{profileData.loanStats.borrowed}</p>
// //                             <p className="text-sm text-muted-foreground">Borrowed</p>
// //                         </div>
// //                         <div className="p-3 bg-gray-100 rounded-lg">
// //                             <p className="text-2xl font-bold">{profileData.loanStats.returned}</p>
// //                             <p className="text-sm text-muted-foreground">Returned</p>
// //                         </div>
// //                         <div className="p-3 bg-gray-100 rounded-lg">
// //                             <p className="text-2xl font-bold">{profileData.reviewsCount}</p>
// //                             <p className="text-sm text-muted-foreground">Reviews</p>
// //                         </div>
// //                     </div>
// //                 </Card>
// //             )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// import { useQuery } from '@tanstack/react-query';
// import { useLocation, Link } from 'react-router-dom';
// import apiClient from '@/api';
// import { useAppSelector } from '@/store/hooks';
// import { selectCurrentUser } from '@/store/slices/authSlice';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Loader2, TriangleAlert } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { cn } from '@/lib/utils';
// import userAvatar from '@/assets/user_avatar.png'; // User Avatar Asset

// // Tipe untuk statistik dari API /api/me (COMPLIANT DENGAN RESPONSE BODY)
// interface UserStats {
//   borrowed: number;
//   late: number;
//   returned: number;
//   total: number;
// }

// // Komponen Pembantu untuk Menampilkan Error
// const ErrorDisplay = ({ message }: { message: string }) => (
//   <Alert variant="destructive">
//     <TriangleAlert className="h-4 w-4" />
//     <AlertTitle>Error</AlertTitle>
//     <AlertDescription>{message}</AlertDescription>
//   </Alert>
// );

// // Konstanta Styling
// const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; // #CBCACA40
// // display-sm: 3rem / 1.2, letter-spacing: -3%
// const TITLE_STYLE = { fontSize: '3rem', lineHeight: '1.2', letterSpacing: '-0.03em' }; 
// // text-md bold, letter-spacing: -2%
// const TEXT_MD_BOLD = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 

// const TABS = [
//   { name: 'Profile', path: '/profile' },
//   { name: 'Borrowed List', path: '/my-loans' },
//   { name: 'Review', path: '/profile?tab=reviews' }, // Tab Review (untuk masa depan)
// ];

// // 1. Komponen Navigation Box
// const NavigationBox = () => {
//     const location = useLocation();
    
//     // Logic untuk menentukan rute aktif
//     const isActive = (path: string) => {
//         // Bandingkan pathname dan search (untuk tab review)
//         return location.pathname + location.search === path;
//     };
    
//     return (
//         <div 
//             className="flex gap-2 p-2 rounded-xl shrink-0" 
//             style={{ width: '557px', height: '56px', background: '#F5F5F5' }}
//         >
//             {TABS.map((tab) => {
//                 const active = isActive(tab.path);
                
//                 return (
//                     <Link
//                         key={tab.name}
//                         to={tab.path}
//                         className="flex-1"
//                     >
//                         <Button
//                             asChild
//                             variant={active ? 'default' : 'ghost'}
//                             className={cn(
//                                 "w-full h-full rounded-xl text-base font-bold text-[#0A0D12]",
//                                 "hover:bg-white hover:text-[#0A0D12]",
//                                 active && "bg-white text-[#0A0D12] hover:bg-white",
//                             )}
//                             style={active ? SHADOW_STYLE : {}}
//                         >
//                              <span>{tab.name}</span>
//                         </Button>
//                     </Link>
//                 );
//             })}
//         </div>
//     );
// };


// export default function MyProfilePage() {
//   // Ambil data user dari Redux (data ini diisi saat login)
//   const user = useAppSelector(selectCurrentUser);
  
//   // FIX: Mengambil data dan error object
//   const { 
//       data: profileData, // <-- DATA DIEKSTRAK DI SINI (profileData.loanStats dan profileData.reviewsCount)
//       isPending: isProfileLoading, 
//       isError: isProfileError,
//       error // Ambil objek error untuk pesan yang lebih spesifik
//   } = useQuery<{ loanStats: UserStats, reviewsCount: number }, Error>({
//     queryKey: ['my-full-profile'],
//     queryFn: async () => {
//       // API call ke /me (menggunakan timeout global dari apiClient)
//       const res = await apiClient.get('/me'); 
//       // Mengambil objek yang berisi loanStats dan reviewsCount (compliant)
//       return res.data.data; 
//     },
//     enabled: !!user,
//   });

//   if (!user) {
//     return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
//   }
  
//   // 3. Konten Container Utama Profile
//   const renderProfileContent = () => (
//     <Card 
//         className="flex flex-col items-center justify-start p-5 gap-0"
//         style={{ 
//             width: '557px', 
//             height: '298px', 
//             borderRadius: '16px', 
//             background: '#FFFFFF', 
//             ...SHADOW_STYLE 
//         }}
//     >
//         {/* User Avatar (64x64) */}
//         <img
//             src={userAvatar}
//             alt="User Avatar"
//             className="w-16 h-16 rounded-full shrink-0"
//         />

//         {/* Name */}
//         <h2 className="font-bold text-lg text-[#0A0D12] pt-4" style={TEXT_MD_BOLD}>
//             {user.name}
//         </h2>
        
//         {/* Email */}
//         <p className="font-bold text-lg text-muted-foreground pt-0" style={TEXT_MD_BOLD}>
//             {user.email}
//         </p>

//         {/* Spacer untuk mendorong tombol ke bawah */}
//         <div className="grow pt-8"></div> 
        
//         {/* Button "Update Profile" (w: 517; h: 44; rounded-full) */}
//         <Button 
//             className="h-11 rounded-full text-white font-bold"
//             style={{ width: '517px', background: '#1C65DA', padding: '8px' }}
//         >
//             Update Profile
//         </Button>
//     </Card>
//   );


//   return (
//     <div className="flex flex-col items-center space-y-8 min-h-screen">
      
//       {/* 2. Page Title "Profile" */}
//       <h1 className="font-extrabold text-[#0A0D12] text-center" 
//           style={TITLE_STYLE}>
//           Profile
//       </h1>
      
//       {/* 1. Navigation Box */}
//       <NavigationBox />

//       {/* Tampilkan loading/error untuk data tambahan, jika ada */}
//       {isProfileLoading ? (
//         <Loader2 className="animate-spin w-8 h-8 text-primary" />
//       ) : isProfileError ? (
//         // Menampilkan pesan error yang lebih spesifik jika request gagal/timeout
//         <ErrorDisplay message={error?.message || "Gagal memuat detail dan statistik profil. Cek koneksi API Anda."} />
//       ) : (
//         // Wrapper untuk konten utama dan statistik
//         <div className="flex flex-col items-center space-y-6">
            
//             {/* 3. Main Content Container (Profile Details) */}
//             {renderProfileContent()}
            
//             {/* BAGIAN STATISTIK (Hanya ditampilkan jika data tersedia) */}
//             {profileData && (
//                 <Card 
//                   className="p-5 flex flex-col justify-start gap-4" 
//                   style={{ width: '557px', borderRadius: '16px', ...SHADOW_STYLE }}
//                 >
//                     <h3 className="font-bold text-xl text-[#0A0D12]">Statistics</h3>
//                     <div className="grid grid-cols-3 gap-4 text-center">
//                         {/* COMPLIANT: Mengakses profileData.loanStats */}
//                         <div className="p-3 bg-gray-100 rounded-lg">
//                             <p className="text-2xl font-bold">{profileData.loanStats.borrowed}</p>
//                             <p className="text-sm text-muted-foreground">Borrowed</p>
//                         </div>
//                         <div className="p-3 bg-gray-100 rounded-lg">
//                             <p className="text-2xl font-bold">{profileData.loanStats.returned}</p>
//                             <p className="text-sm text-muted-foreground">Returned</p>
//                         </div>
//                         {/* COMPLIANT: Mengakses profileData.reviewsCount */}
//                         <div className="p-3 bg-gray-100 rounded-lg">
//                             <p className="text-2xl font-bold">{profileData.reviewsCount}</p>
//                             <p className="text-sm text-muted-foreground">Reviews</p>
//                         </div>
//                     </div>
//                 </Card>
//             )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useLocation, Link } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'; // Hanya Loader2 yang dibutuhkan
import { cn } from '@/lib/utils';
import userAvatar from '@/assets/user_avatar.png'; // User Avatar Asset

// Konstanta Styling (Sesuai Spesifikasi Desain)
// box-shadow: 0px 0px 20px 0px #CBCACA40
const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; 

// 2. Text "Profile" (display-sm: 3rem / 1.2, letter-spacing: -3%)
const TITLE_STYLE = { fontSize: '3rem', lineHeight: '1.2', letterSpacing: '-0.03em' }; 

// text-md bold, letter-spacing: -2%
const TEXT_MD_BOLD = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 

// Definisi Navigasi Tabs
const TABS = [
  { name: 'Profile', path: '/profile' },
  { name: 'Borrowed List', path: '/my-loans' },
  { name: 'Review', path: '/profile?tab=reviews' },
];

// 1. Komponen Navigation Box
const NavigationBox = () => {
    const location = useLocation();
    
    // Logic untuk menentukan rute aktif
    const isActive = (path: string) => {
        return location.pathname + location.search === path;
    };
    
    return (
        <div 
            className="flex gap-2 p-2 rounded-xl shrink-0" 
            // width: 557; height: 56; gap: 8px; padding: 8px; background: #F5F5F5;
            style={{ width: '557px', height: '56px', background: '#F5F5F5', gap: '8px' }}
        >
            {TABS.map((tab) => {
                const active = isActive(tab.path);
                
                return (
                    <Link
                        key={tab.name}
                        to={tab.path}
                        className="flex-1"
                    >
                        <Button
                            asChild
                            variant={active ? 'default' : 'ghost'}
                            className={cn(
                                "w-full h-full rounded-xl text-base font-bold text-[#0A0D12]",
                                "hover:bg-white hover:text-[#0A0D12]",
                                // Button aktif: background: #FFFFFF; box-shadow: #CBCACA40;
                                active && "bg-white text-[#0A0D12] hover:bg-white",
                            )}
                            style={active ? SHADOW_STYLE : {}}
                        >
                             <span>{tab.name}</span>
                        </Button>
                    </Link>
                );
            })}
        </div>
    );
};


export default function MyProfilePage() {
  // Ambil data user dari Redux (TANPA API)
  const user = useAppSelector(selectCurrentUser); 
  
  // Tampilkan loading screen jika data user Redux belum ada (walaupun harusnya terproteksi)
  if (!user) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }
  
  // 3. Konten Container Utama Profile
  const renderProfileContent = () => (
    <Card 
        // width: 557; height: 298; padding: 20px; background: #FFFFFF; box-shadow: #CBCACA40;
        className="flex flex-col items-center justify-start p-5 gap-0"
        style={{ 
            width: '557px', 
            height: '298px', 
            borderRadius: '16px', 
            background: '#FFFFFF', 
            padding: '20px',
            ...SHADOW_STYLE 
        }}
    >
        {/* User Avatar (width: 64; height: 64;) */}
        <img
            src={userAvatar}
            alt="User Avatar"
            className="w-16 h-16 rounded-full shrink-0"
        />

        {/* Name (text-md bold, letter-spacing -2%) */}
        <h2 className="font-bold text-lg text-[#0A0D12] pt-4" style={TEXT_MD_BOLD}>
            {user.name}
        </h2>
        
        {/* Email (text-md bold, letter-spacing -2%) */}
        <p className="font-bold text-lg text-muted-foreground pt-0" style={TEXT_MD_BOLD}>
            {user.email}
        </p>

        {/* Spacer untuk mendorong tombol ke bawah */}
        <div className="grow pt-8"></div> 
        
        {/* Button "Update Profile" (width: 517; height: 44; background: #1C65DA) */}
        <Button 
            className="h-11 rounded-full text-white font-bold"
            style={{ width: '517px', background: '#1C65DA', padding: '8px' }}
        >
            Update Profile
        </Button>
    </Card>
  );


  return (
    <div className="flex flex-col items-center space-y-8 min-h-screen">
      
      {/* 2. Text " Profile" */}
      <h1 className="font-extrabold text-[#0A0D12] text-center" 
          style={TITLE_STYLE}>
          Profile
      </h1>
      
      {/* 1. Navigation Box */}
      <NavigationBox />

      {/* 3. Main Content Container (Profile Details) */}
      {renderProfileContent()}
      
    </div>
  );
}