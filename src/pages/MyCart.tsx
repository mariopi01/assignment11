
// // src/pages/MyCart.tsx

// import { useState, useMemo } from 'react';
// import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
// import apiClient from '@/api';

// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Loader2, TriangleAlert, BookOpen } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { toast } from 'sonner';

// // --- TIPE DATA API CART ---
// interface CartItem {
//   id: number;
//   bookId: number;
//   qty: number;
//   book: {
//     id: number;
//     title: string;
//     coverImage: string | null;
//   };
// }

// interface CartResponse {
//   cartId: number;
//   items: CartItem[];
//   grandTotal: number;
// }

// // --- TIPE DATA API BOOK DETAIL ---
// interface BookDetailResponse {
//   id: number;
//   title: string;
//   coverImage: string | null;
//   Author: {
//     id: number;
//     name: string;
//   };
//   Category: {
//     id: number;
//     name: string;
//   };
// }

// // --- STYLING CONSTANTS ---
// const TITLE_STYLE = { 
//   fontFamily: 'Inter, sans-serif',
//   fontWeight: 700, 
//   fontSize: '3rem', 
//   lineHeight: '1.2', 
//   color: '#0A0D12' 
// };

// const CONTAINER_STYLE = {
//   maxWidth: '1000px',
//   width: '100%',
//   marginTop: '48px',
//   marginLeft: 'auto',
//   marginRight: 'auto',
//   gap: '32px',
// };

// // --- COMPONENTS ---
// const LoadingSpinner = () => (
//   <div className="flex h-[50vh] items-center justify-center">
//     <Loader2 className="h-8 w-8 animate-spin text-primary" />
//   </div>
// );

// const ErrorDisplay = ({ message }: { message: string }) => (
//   <Alert variant="destructive">
//     <TriangleAlert className="h-4 w-4" />
//     <AlertTitle>Error</AlertTitle>
//     <AlertDescription>{message}</AlertDescription>
//   </Alert>
// );

// export default function MyCartPage() {
//   const queryClient = useQueryClient();
//   const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

//   // === 1. FETCH DATA CART ===
//   const { data: cartData, isPending: isCartPending, isError: isCartError, error: cartError } = useQuery<CartResponse, Error>({
//     queryKey: ['my-cart'],
//     queryFn: async () => {
//       const res = await apiClient.get('/cart');
//       return res.data.data;
//     },
//   });

//   const cartItems = cartData?.items || [];

//   // === 2. FETCH BOOK DETAILS (Author & Category) PARALEL ===
//   // Mengambil ID unik dari item di keranjang
//   const bookIds = useMemo(() => cartItems.map((item) => item.bookId), [cartItems]);

//   // Menggunakan useQueries untuk fetch detail setiap buku
//   const bookDetailQueries = useQueries({
//     queries: bookIds.map((id) => ({
//       queryKey: ['book-detail', id],
//       queryFn: async () => {
//         const res = await apiClient.get(`/books/${id}`);
//         return res.data.data as BookDetailResponse;
//       },
//       staleTime: 1000 * 60 * 5, // Cache 5 menit
//     })),
//   });

//   // Membuat Map untuk akses cepat data buku berdasarkan ID
//   const bookDetailsMap = useMemo(() => {
//     const map = new Map<number, BookDetailResponse>();
//     bookDetailQueries.forEach((result) => {
//       if (result.data) {
//         map.set(result.data.id, result.data);
//       }
//     });
//     return map;
//   }, [bookDetailQueries]);

//   // === 3. LOGIKA SELEKSI ===
//   const handleSelectAll = () => {
//     if (selectedItems.size === cartItems.length && cartItems.length > 0) {
//       setSelectedItems(new Set());
//     } else {
//       const allIds = new Set(cartItems.map(item => item.id));
//       setSelectedItems(allIds);
//     }
//   };

//   const handleSelectItem = (id: number) => {
//     const newSelected = new Set(selectedItems);
//     if (newSelected.has(id)) newSelected.delete(id);
//     else newSelected.add(id);
//     setSelectedItems(newSelected);
//   };

//   const isAllSelected = cartItems.length > 0 && selectedItems.size === cartItems.length;

//   // === 4. SUMMARY & MUTASI ===
//   const totalSelectedBooks = cartItems
//     .filter(item => selectedItems.has(item.id))
//     .reduce((acc, item) => acc + item.qty, 0);

//   const { mutate: borrowBooks, isPending: isBorrowing } = useMutation({
//     mutationFn: async () => {
//       if (selectedItems.size === 0) return;
//       const promises = Array.from(selectedItems).map(async (itemId) => {
//          const item = cartItems.find(i => i.id === itemId);
//          if (item) return apiClient.post(`/books/${item.bookId}/borrow`);
//       });
//       await Promise.all(promises);
//     },
//     onSuccess: () => {
//       toast.success('Peminjaman Berhasil!', { description: 'Buku terpilih telah dipinjam.' });
//       setSelectedItems(new Set());
//       queryClient.invalidateQueries({ queryKey: ['my-cart'] });
//       queryClient.invalidateQueries({ queryKey: ['my-loans'] });
//     },
//     onError: () => {
//       toast.error('Gagal Meminjam', { description: 'Stok buku mungkin habis.' });
//     }
//   });

//   // === RENDER ===
//   if (isCartPending) return <LoadingSpinner />;
//   if (isCartError) return <ErrorDisplay message={cartError?.message || 'Gagal memuat keranjang.'} />;

//   return (
//     <div className="flex flex-col px-4 pb-12 min-h-screen" style={CONTAINER_STYLE}>
      
//       <h1 style={TITLE_STYLE} className="text-left">My Cart</h1>

//       <div className="flex flex-col lg:flex-row gap-8">
        
//         {/* Kolom Kiri: List Item */}
//         <div className="flex-1 flex flex-col gap-4">
          
//           {/* Header Checkbox */}
//           <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
//              <input 
//                 type="checkbox" 
//                 id="select-all"
//                 className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                 checked={isAllSelected}
//                 onChange={handleSelectAll}
//              />
//              <label htmlFor="select-all" className="text-base font-medium cursor-pointer select-none text-[#0A0D12]">
//                 Select All ({cartItems.length} Items)
//              </label>
//           </div>

//           {/* Items */}
//           {cartItems.length === 0 ? (
//              <div className="text-center py-10 text-muted-foreground bg-gray-50 rounded-xl border border-dashed">
//                 Keranjang kosong.
//              </div>
//           ) : (
//              cartItems.map((item) => {
//                // Ambil detail buku dari hasil fetch paralel
//                const detail = bookDetailsMap.get(item.bookId);
//                const authorName = detail?.Author?.name || 'Unknown Author';
//                const categoryName = detail?.Category?.name || 'General';
//                // Gunakan cover dari API detail jika ada, fallback ke data cart
//                const coverImage = detail?.coverImage || item.book.coverImage;

//                return (
//                  <div key={item.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    
//                     <div className="pt-8"> 
//                       <input 
//                           type="checkbox" 
//                           className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                           checked={selectedItems.has(item.id)}
//                           onChange={() => handleSelectItem(item.id)}
//                       />
//                     </div>

//                     <div className="flex gap-4 grow">
//                         {/* Cover Image */}
//                         <div className="shrink-0 w-[100px] h-[140px] bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
//                             {coverImage ? (
//                                 <img src={coverImage} alt={item.book.title} className="w-full h-full object-cover" />
//                             ) : (
//                                 <BookOpen className="w-8 h-8 text-gray-400" />
//                             )}
//                         </div>

//                         {/* Details */}
//                         <div className="flex flex-col justify-center space-y-1 text-left">
//                             {/* Category Name (Fetched from API) */}
//                             <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
//                                 {categoryName}
//                             </p>
                            
//                             {/* Title */}
//                             <h3 className="text-xl font-bold text-[#0A0D12] line-clamp-2">
//                                 {item.book.title}
//                             </h3>
                            
//                             {/* Author Name (Fetched from API) */}
//                             <p className="text-base text-gray-600">
//                                 {authorName}
//                             </p>
//                         </div>
//                     </div>
//                  </div>
//                );
//              })
//           )}
//         </div>

//         {/* Kolom Kanan: Summary */}
//         <div className="shrink-0">
//             <Card 
//                 className="flex flex-col bg-white border border-gray-200 shadow-sm"
//                 style={{ 
//                     width: '318px', 
//                     height: '200px', 
//                     borderRadius: '16px', 
//                     padding: '20px', 
//                     gap: '24px' 
//                 }}
//             >
//                 <h2 className="font-bold text-xl text-[#0A0D12]">Loan Summary</h2>

//                 <div className="flex justify-between items-center">
//                     <span className="text-base font-medium text-gray-600">Total Book</span>
//                     <span className="text-xl font-bold text-[#0A0D12]">{totalSelectedBooks}</span>
//                 </div>

//                 <Button 
//                     onClick={() => borrowBooks()}
//                     disabled={isBorrowing || totalSelectedBooks === 0}
//                     className="w-full text-white font-semibold shadow-none hover:opacity-90 transition-opacity"
//                     style={{ 
//                         width: '278px', 
//                         height: '48px', 
//                         borderRadius: '100px', 
//                         padding: '8px',
//                         background: '#1C65DA',
//                     }}
//                 >
//                     {isBorrowing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Borrow Book'}
//                 </Button>
//             </Card>
//         </div>

//       </div>
//     </div>
//   );
// }

// src/pages/MyCart.tsx

import { useState, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import apiClient from '@/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, TriangleAlert, BookOpen } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

// --- TIPE DATA API CART ---
interface CartItem {
  id: number;
  bookId: number;
  qty: number;
  book: {
    id: number;
    title: string;
    coverImage: string | null;
  };
}

interface CartResponse {
  cartId: number;
  items: CartItem[];
  grandTotal: number;
}

// --- TIPE DATA API BOOK DETAIL ---
interface BookDetailResponse {
  id: number;
  title: string;
  coverImage: string | null;
  Author: {
    id: number;
    name: string;
  };
  Category: {
    id: number;
    name: string;
  };
}

// --- STYLING CONSTANTS ---
const TITLE_STYLE = { 
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700, 
  fontSize: '3rem', 
  lineHeight: '1.2', 
  color: '#0A0D12' 
};

const CONTAINER_STYLE = {
  maxWidth: '1000px',
  width: '100%',
  marginTop: '48px',
  marginLeft: 'auto',
  marginRight: 'auto',
  gap: '32px',
};

// --- COMPONENTS ---
const LoadingSpinner = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <TriangleAlert className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

export default function MyCartPage() {
  const navigate = useNavigate(); // 2. Inisialisasi navigate
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // === 1. FETCH DATA CART ===
  const { data: cartData, isPending: isCartPending, isError: isCartError, error: cartError } = useQuery<CartResponse, Error>({
    queryKey: ['my-cart'],
    queryFn: async () => {
      const res = await apiClient.get('/cart');
      return res.data.data;
    },
  });

  const cartItems = cartData?.items || [];

  // === 2. FETCH BOOK DETAILS (Author & Category) PARALEL ===
  const bookIds = useMemo(() => cartItems.map((item) => item.bookId), [cartItems]);

  const bookDetailQueries = useQueries({
    queries: bookIds.map((id) => ({
      queryKey: ['book-detail', id],
      queryFn: async () => {
        const res = await apiClient.get(`/books/${id}`);
        return res.data.data as BookDetailResponse;
      },
      staleTime: 1000 * 60 * 5, 
    })),
  });

  const bookDetailsMap = useMemo(() => {
    const map = new Map<number, BookDetailResponse>();
    bookDetailQueries.forEach((result) => {
      if (result.data) {
        map.set(result.data.id, result.data);
      }
    });
    return map;
  }, [bookDetailQueries]);

  // === 3. LOGIKA SELEKSI ===
  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length && cartItems.length > 0) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(cartItems.map(item => item.id));
      setSelectedItems(allIds);
    }
  };

  const handleSelectItem = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedItems(newSelected);
  };

  const isAllSelected = cartItems.length > 0 && selectedItems.size === cartItems.length;

  // === 4. SUMMARY & NAVIGASI ===
  const totalSelectedBooks = cartItems
    .filter(item => selectedItems.has(item.id))
    .reduce((acc, item) => acc + item.qty, 0);

  // Handler untuk tombol "Borrow Book"
  const handleBorrowClick = () => {
    if (totalSelectedBooks === 0) {
      toast.error("Pilih minimal satu buku untuk dipinjam.");
      return;
    }
    // Arahkan ke halaman checkout
    navigate('/checkout');
  };

  // === RENDER ===
  if (isCartPending) return <LoadingSpinner />;
  if (isCartError) return <ErrorDisplay message={cartError?.message || 'Gagal memuat keranjang.'} />;

  return (
    <div className="flex flex-col px-4 pb-12 min-h-screen" style={CONTAINER_STYLE}>
      
      <h1 style={TITLE_STYLE} className="text-left">My Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Kolom Kiri: List Item */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Header Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
             <input 
                type="checkbox" 
                id="select-all"
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={isAllSelected}
                onChange={handleSelectAll}
             />
             <label htmlFor="select-all" className="text-base font-medium cursor-pointer select-none text-[#0A0D12]">
                Select All ({cartItems.length} Items)
             </label>
          </div>

          {/* Items */}
          {cartItems.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground bg-gray-50 rounded-xl border border-dashed">
                Keranjang kosong.
             </div>
          ) : (
             cartItems.map((item) => {
               // Ambil detail buku dari hasil fetch paralel
               const detail = bookDetailsMap.get(item.bookId);
               const authorName = detail?.Author?.name || 'Unknown Author';
               const categoryName = detail?.Category?.name || 'General';
               const coverImage = detail?.coverImage || item.book.coverImage;

               return (
                 <div key={item.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    
                    <div className="pt-8"> 
                      <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                      />
                    </div>

                    <div className="flex gap-4 grow">
                        {/* Cover Image */}
                        <div className="shrink-0 w-[100px] h-[140px] bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                            {coverImage ? (
                                <img src={coverImage} alt={item.book.title} className="w-full h-full object-cover" />
                            ) : (
                                <BookOpen className="w-8 h-8 text-gray-400" />
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-col justify-center space-y-1 text-left">
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                                {categoryName}
                            </p>
                            
                            <h3 className="text-xl font-bold text-[#0A0D12] line-clamp-2">
                                {item.book.title}
                            </h3>
                            
                            <p className="text-base text-gray-600">
                                {authorName}
                            </p>
                        </div>
                    </div>
                 </div>
               );
             })
          )}
        </div>

        {/* Kolom Kanan: Summary */}
        <div className="shrink-0">
            <Card 
                className="flex flex-col bg-white border border-gray-200 shadow-sm"
                style={{ 
                    width: '318px', 
                    height: '200px', 
                    borderRadius: '16px', 
                    padding: '20px', 
                    gap: '24px' 
                }}
            >
                <h2 className="font-bold text-xl text-[#0A0D12]">Loan Summary</h2>

                <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-600">Total Book</span>
                    <span className="text-xl font-bold text-[#0A0D12]">{totalSelectedBooks}</span>
                </div>

                <Button 
                    onClick={handleBorrowClick} // Menggunakan handler navigasi baru
                    disabled={totalSelectedBooks === 0}
                    className="w-full text-white font-semibold shadow-none hover:opacity-90 transition-opacity"
                    style={{ 
                        width: '278px', 
                        height: '48px', 
                        borderRadius: '100px', 
                        padding: '8px',
                        background: '#1C65DA',
                    }}
                >
                    Borrow Book
                </Button>
            </Card>
        </div>

      </div>
    </div>
  );
}