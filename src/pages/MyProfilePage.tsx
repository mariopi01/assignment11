// // src/pages/MyProfilePage.tsx

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
// import userAvatar from '@/assets/user_avatar.png'; 

// // --- TIPE DATA API ---
// interface UserStats {
//   borrowed: number;
//   late: number;
//   returned: number;
//   total: number;
// }

// interface MyProfileResponse {
//   profile: {
//     id: number;
//     name: string;
//     email: string;
//     role: string;
//     createdAt: string;
//   };
//   loanStats: UserStats;
//   reviewsCount: number;
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
// const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; 
// const TITLE_STYLE = { 
//   fontFamily: 'Inter, sans-serif', 
//   fontWeight: 700, 
//   fontSize: '1.875rem', // display-sm (~30px)
//   lineHeight: '2.375rem', 
//   letterSpacing: '-0.03em', 
//   color: '#0A0D12' 
// };
// const TEXT_MD_BOLD = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 

// // Definisi Navigasi Tabs
// const TABS = [
//   { name: 'Profile', path: '/profile' },
//   { name: 'Borrowed List', path: '/my-loans' },
//   { name: 'Review', path: '/my-reviews' },
// ];

// // 1. Komponen Navigation Box
// const NavigationBox = () => {
//     const location = useLocation();
    
//     const isActive = (path: string) => {
//         return location.pathname + location.search === path;
//     };
    
//     return (
//         <div 
//             className="flex gap-2 p-2 rounded-xl shrink-0 w-full md:w-[557px]" 
//             style={{ height: '56px', background: '#F5F5F5' }}
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
//   // User dari Redux digunakan hanya untuk pengecekan login / enabled query
//   const user = useAppSelector(selectCurrentUser); 

//   // === FETCHING PROFILE & STATS DARI API ===
//   const { 
//     data: profileData, 
//     isPending: isProfileLoading, 
//     isError: isProfileError,
//     error 
//   } = useQuery<MyProfileResponse, Error>({
//     queryKey: ['my-full-profile'],
//     queryFn: async () => {
//       const res = await apiClient.get('/me'); 
//       return res.data.data; 
//     },
//     enabled: !!user, 
//   });

//   // 3. Konten Container Utama Profile
//   const renderProfileContent = () => (
//     <Card 
//         className="flex flex-col items-center justify-start p-5 gap-0 w-full md:w-[557px]"
//         style={{ 
//             height: '298px', 
//             borderRadius: '16px', 
//             background: '#FFFFFF', 
//             padding: '20px',
//             ...SHADOW_STYLE 
//         }}
//     >
//         {/* User Avatar */}
//         <img
//             src={userAvatar}
//             alt="User Avatar"
//             className="w-16 h-16 rounded-full shrink-0"
//         />

//         {/* Name (Dari API) */}
//         <h2 className="font-bold text-lg text-[#0A0D12] pt-4" style={TEXT_MD_BOLD}>
//             {profileData?.profile.name || user?.name}
//         </h2>
        
//         {/* Email (Dari API) */}
//         <p className="font-bold text-lg text-muted-foreground pt-0" style={TEXT_MD_BOLD}>
//             {profileData?.profile.email || user?.email}
//         </p>

//         {/* Spacer untuk mendorong tombol ke bawah */}
//         <div className="grow pt-8"></div> 
        
//         {/* Button "Update Profile" */}
//         <Button 
//             className="h-11 rounded-full text-white font-bold w-full"
//             style={{ background: '#1C65DA', padding: '8px' }}
//         >
//             Update Profile
//         </Button>
//     </Card>
//   );

//   // Jika user belum login/state belum siap
//   if (!user) {
//       return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
//   }

//   return (
    
//     <div className="flex flex-col items-start space-y-8 min-h-screen w-full px-4">
      
//       {/* 1. Navigation Box */}
//       <NavigationBox />

//       {/* 2. Text "Profile" */}
//       {/* REVISI: text-center -> text-left */}
//       <h1 className=" text-[#0A0D12] text-left" 
//           style={TITLE_STYLE}>
//           Profile
//       </h1>

      

//       {isProfileLoading ? (
//         // Tampilkan Loader saat sedang memuat data API
//         <Loader2 className="animate-spin w-8 h-8 text-primary" />
//       ) : isProfileError ? (
//         // Tampilkan Error jika loading gagal
//         <ErrorDisplay message={error?.message || "Gagal memuat detail dan statistik profil."} />
//       ) : (
//         // Tampilkan konten jika loading selesai dan tidak ada error
//         // REVISI: items-center -> items-start (Agar card di dalam rata kiri)
//         <div className="flex flex-col items-start space-y-6 w-full">
            
//             {/* 3. Main Content Container (Profile Details) */}
//             {renderProfileContent()}
            
//             {/* BAGIAN STATISTIK */}
//             {profileData && (
//                 <Card 
//                   className="p-5 flex flex-col justify-start gap-4 w-full md:w-[557px]" 
//                   style={{ borderRadius: '16px', ...SHADOW_STYLE }}
//                 >
//                     <h3 className="font-bold text-xl text-[#0A0D12]">User Statistics</h3>
//                     <div className="grid grid-cols-3 gap-4 text-center">
//                         <div className="p-3 bg-gray-100 rounded-lg">
//                             <p className="text-2xl font-bold">{profileData.loanStats.borrowed}</p>
//                             <p className="text-sm text-muted-foreground">Borrowed</p>
//                         </div>
//                         <div className="p-3 bg-gray-100 rounded-lg">
//                             <p className="text-2xl font-bold">{profileData.loanStats.returned}</p>
//                             <p className="text-sm text-muted-foreground">Returned</p>
//                         </div>
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


// src/pages/MyProfilePage.tsx

import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router-dom';
import apiClient from '@/api';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TriangleAlert } from 'lucide-react'; 
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import userAvatar from '@/assets/user_avatar.png'; 

// --- TIPE DATA API ---
interface UserStats {
  borrowed: number;
  late: number;
  returned: number;
  total: number;
}

interface MyProfileResponse {
  profile: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  loanStats: UserStats;
  reviewsCount: number;
}

// Komponen Pembantu untuk Menampilkan Error
const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <TriangleAlert className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

// Konstanta Styling
const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; 
const TITLE_STYLE = { 
  fontFamily: 'Inter, sans-serif', 
  fontWeight: 700, 
  fontSize: '1.875rem', // display-sm (~30px)
  lineHeight: '2.375rem', 
  letterSpacing: '-0.03em', 
  color: '#0A0D12' 
};
const TEXT_MD_BOLD = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 

// Definisi Navigasi Tabs
const TABS = [
  { name: 'Profile', path: '/profile' },
  { name: 'Borrowed List', path: '/my-loans' },
  { name: 'Review', path: '/my-reviews' },
];

// 1. Komponen Navigation Box
const NavigationBox = () => {
    const location = useLocation();
    
    const isActive = (path: string) => {
        return location.pathname + location.search === path;
    };
    
    return (
        <div 
            className="flex gap-2 p-2 rounded-xl shrink-0 w-full md:w-[557px]" 
            style={{ height: '56px', background: '#F5F5F5' }}
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
  // User dari Redux digunakan hanya untuk pengecekan login / enabled query
  const user = useAppSelector(selectCurrentUser); 

  // === FETCHING PROFILE & STATS DARI API ===
  const { 
    data: profileData, 
    isPending: isProfileLoading, 
    isError: isProfileError,
    error 
  } = useQuery<MyProfileResponse, Error>({
    queryKey: ['my-full-profile'],
    queryFn: async () => {
      const res = await apiClient.get('/me'); 
      return res.data.data; 
    },
    enabled: !!user, 
  });

  // 3. Konten Container Utama Profile
  const renderProfileContent = () => (
    <Card 
        className="flex flex-col items-center justify-start p-5 gap-0 w-full md:w-[557px]"
        style={{ 
            height: '298px', 
            borderRadius: '16px', 
            background: '#FFFFFF', 
            padding: '20px',
            ...SHADOW_STYLE 
        }}
    >
        {/* User Avatar */}
        <img
            src={userAvatar}
            alt="User Avatar"
            className="w-16 h-16 rounded-full shrink-0"
        />

        {/* Name (Dari API dengan Fallback ke Redux) */}
        <h2 className="font-bold text-lg text-[#0A0D12] pt-4" style={TEXT_MD_BOLD}>
            {profileData?.profile?.name || user?.name || 'No Name'}
        </h2>
        
        {/* Email (Dari API dengan Fallback ke Redux) */}
        <p className="font-bold text-lg text-muted-foreground pt-0" style={TEXT_MD_BOLD}>
            {profileData?.profile?.email || user?.email || 'No Email'}
        </p>

        {/* Spacer untuk mendorong tombol ke bawah */}
        <div className="grow pt-8"></div> 
        
        {/* Button "Update Profile" */}
        <Button 
            className="h-11 rounded-full text-white font-bold w-full"
            style={{ background: '#1C65DA', padding: '8px' }}
        >
            Update Profile
        </Button>
    </Card>
  );

  // Jika user belum login/state belum siap
  if (!user) {
      return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  return (
    <div className="flex flex-col items-start space-y-8 min-h-screen w-full px-4">
      
      {/* 1. Navigation Box */}
      <NavigationBox />

      {/* 2. Text "Profile" */}
      <h1 className="text-[#0A0D12] text-left" 
          style={TITLE_STYLE}>
          Profile
      </h1>

      {isProfileLoading ? (
        // Tampilkan Loader saat sedang memuat data API
        <div className="w-full flex justify-center py-10">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      ) : isProfileError ? (
        // Tampilkan Error jika loading gagal
        <ErrorDisplay message={error?.message || "Gagal memuat detail dan statistik profil."} />
      ) : (
        // Tampilkan konten jika loading selesai dan tidak ada error
        <div className="flex flex-col items-start space-y-6 w-full">
            
            {/* 3. Main Content Container (Profile Details) */}
            {renderProfileContent()}
            
            {/* BAGIAN STATISTIK */}
            {profileData && (
                <Card 
                  className="p-5 flex flex-col justify-start gap-4 w-full md:w-[557px]" 
                  style={{ borderRadius: '16px', ...SHADOW_STYLE }}
                >
                    <h3 className="font-bold text-xl text-[#0A0D12]">User Statistics</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <p className="text-2xl font-bold">{profileData.loanStats?.borrowed || 0}</p>
                            <p className="text-sm text-muted-foreground">Borrowed</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <p className="text-2xl font-bold">{profileData.loanStats?.returned || 0}</p>
                            <p className="text-sm text-muted-foreground">Returned</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <p className="text-2xl font-bold">{profileData.reviewsCount || 0}</p>
                            <p className="text-sm text-muted-foreground">Reviews</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
      )}
    </div>
  );
}