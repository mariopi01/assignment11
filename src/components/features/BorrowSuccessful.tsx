// // src/components/features/BorrowSuccessful.tsx

// import { useNavigate } from 'react-router-dom';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Header } from '@/components/layout/Header';
// import borrowSuccessfulImg from '@/assets/borrow_successful.png'; 

// interface BorrowSuccessfulProps {
//   returnDate: string; // Format tanggal pengembalian (misal: "03 Sep 2024")
// }

// export const BorrowSuccessful = ({ returnDate }: BorrowSuccessfulProps) => {
//   const navigate = useNavigate();

//   // --- STYLING CONSTANTS SESUAI SPESIFIKASI ---
  
//   // Container: width 638px, height ~332px, gap 32px
//  const CONTAINER_STYLE = {
//     width: '100%',        // Ubah ke 100%
//     height: '100%',       // Ubah ke 100%
//     gap: '32px',
//     borderRadius: '0px',  // Hilangkan radius untuk full screen
//     background: '#FFFFFF',
//     border: 'none',       // Hapus border
//     boxShadow: 'none',    // Hapus shadow agar flat dengan background
//   };

//   // Font: Display SM, Bold
//   const TITLE_STYLE = {
//     fontFamily: 'Inter, sans-serif', // Menggunakan font default proyek
//     fontWeight: 700,
//     fontStyle: 'normal',
//     fontSize: '1.5rem', // display-sm (~30px)
//     lineHeight: '2.375rem',
//     letterSpacing: '-0.02em',
//     color: '#0A0D12',
//     textAlign: 'center' as const,
//   };

//   // Font: Text LG, SemiBold
//   const BODY_STYLE = {
//     fontFamily: 'Inter, sans-serif',
//     fontWeight: 600,
//     fontStyle: 'normal',
//     fontSize: '0.8rem', // text-lg (~18px)
//     lineHeight: '1.75rem',
//     letterSpacing: '-0.02em',
//     color: '#0A0D12',
//     textAlign: 'center' as const,
//   };

//   // Button: width 286px
//   const BUTTON_STYLE = {
//     width: '286px',
//     height: '48px',
//     borderRadius: '100px',
//     padding: '8px',
//     background: '#1C65DA',
//     gap: '8px'
//   };

//   return (
//     // Overlay Hitam Transparan (Fixed Position)
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      
      
//       {/* Container Utama */}
//       <Card 
//         className="flex flex-col items-center justify-center p-8 shadow-2xl border-none animate-in fade-in zoom-in duration-300"
//         style={CONTAINER_STYLE}
//       >
//         {/* 1. Image */}
//         <div className="shrink-0">
//             <img 
//                 src={borrowSuccessfulImg} 
//                 alt="Success" 
//                 className="w-auto h-24 object-contain" // Sesuaikan ukuran visual icon jika perlu
//             />
//         </div>

//         {/* Text Wrapper */}
//         <div className="flex flex-col gap-2 items-center w-full">
//             {/* 2. Title Text */}
//             <h2 style={TITLE_STYLE}>
//                 Borrowing Successful!
//             </h2>

//             {/* 3. Body Text */}
//             <p style={BODY_STYLE} className="max-w-[90%]">
//                 Your book has been successfully borrowed. Please return it by {returnDate}
//             </p>
//         </div>

//         {/* 4. Button "See Borrowed List" */}
//         <Button
//             onClick={() => navigate('/my-loans')}
//             className="text-white font-semibold hover:bg-[#1C65DA]/90 transition-all shadow-md"
//             style={BUTTON_STYLE}
//         >
//             See Borrowed List
//         </Button>
//       </Card>
//     </div>
//   );
// };


// src/components/features/BorrowSuccessful.tsx

import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header'; // 1. Import Header
// Pastikan file ini ada di folder assets Anda
import borrowSuccessfulImg from '@/assets/borrow_successful.png'; 

interface BorrowSuccessfulProps {
  returnDate: string; // Format tanggal pengembalian (misal: "03 Sep 2024")
}

export const BorrowSuccessful = ({ returnDate }: BorrowSuccessfulProps) => {
  const navigate = useNavigate();

  // --- STYLING CONSTANTS SESUAI SPESIFIKASI ---
  
  // Container: Diubah menjadi full width & height, tanpa border
  const CONTAINER_STYLE = {
    width: '100%',        // Ubah ke 100%
    height: '100%',       // Ubah ke 100%
    gap: '32px',
    borderRadius: '0px',  // Hilangkan radius untuk full screen
    background: '#FFFFFF',
    border: 'none',       // Hapus border
    boxShadow: 'none',    // Hapus shadow agar flat dengan background
  };

  // Font: Display SM, Bold
  const TITLE_STYLE = {
    
    fontWeight: 700,
    fontStyle: 'normal',
    fontSize: '1.5rem', // display-sm (~30px)
    lineHeight: '2.375rem',
    letterSpacing: '-0.02em',
    color: '#0A0D12',
    textAlign: 'center' as const,
  };

  // Font: Text LG, SemiBold
  const BODY_STYLE = {
    
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: '0.8rem', // text-lg (~18px)
    lineHeight: '1.75rem',
    letterSpacing: '-0.02em',
    color: '#0A0D12',
    textAlign: 'center' as const,
  };

  // Button: width 286px
  const BUTTON_STYLE = {
    width: '286px',
    height: '48px',
    borderRadius: '100px',
    padding: '8px',
    background: '#1C65DA',
    gap: '8px'
  };

  return (
    // Wrapper Full Screen (Putih) dengan Flex Column
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      
      {/* 1. Tambahkan Header di bagian atas */}
      <Header />

      {/* Container Konten (Mengisi sisa ruang) */}
      <div className="grow w-full overflow-hidden">
          <Card 
            className="flex flex-col items-center justify-center p-8 border-none animate-in fade-in zoom-in duration-300"
            style={CONTAINER_STYLE}
          >
            {/* Image */}
            <div className="shrink-0">
                <img 
                    src={borrowSuccessfulImg} 
                    alt="Success" 
                    className="w-auto h-24 object-contain" 
                />
            </div>

            {/* Text Wrapper */}
            <div className="flex flex-col gap-2 items-center w-full">
                {/* Title Text */}
                <h2 style={TITLE_STYLE}>
                    Borrowing Successful!
                </h2>

                {/* Body Text */}
                <p style={BODY_STYLE} className="max-w-[90%]">
                    Your book has been successfully borrowed. Please return it by {returnDate}
                </p>
            </div>

            {/* Button "See Borrowed List" */}
            <Button
                onClick={() => navigate('/my-loans')}
                className="text-white font-semibold hover:bg-[#1C65DA]/90 transition-all shadow-md"
                style={BUTTON_STYLE}
            >
                See Borrowed List
            </Button>
          </Card>
      </div>
    </div>
  );
};