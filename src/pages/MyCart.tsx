
// // src/pages/MyCart.tsx

// import { useState, useMemo } from 'react';
// import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import apiClient from '@/api';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Loader2, TriangleAlert, BookOpen, Trash2 } from 'lucide-react';
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
//     author?: { name: string }; 
//     category?: { name: string };
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

// // Tambahkan Interface untuk Error API
// interface ApiError {
//   response?: {
//     data?: {
//       message?: string;
//     };
//   };
// }

// // --- STYLING CONSTANTS ---
// const TITLE_STYLE = { 
//   fontWeight: 700, 
//   fontSize: '2rem', 
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
//   const navigate = useNavigate();
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

//   // FIX: Memoize cartItems untuk menstabilkan referensi dependensi
//   const cartItems = useMemo(() => cartData?.items || [], [cartData]);

//   // === 2. FETCH BOOK DETAILS (Author & Category) PARALEL ===
//   const bookIds = useMemo(() => cartItems.map((item) => item.bookId), [cartItems]);

//   const bookDetailQueries = useQueries({
//     queries: bookIds.map((id) => ({
//       queryKey: ['book-detail', id],
//       queryFn: async () => {
//         const res = await apiClient.get(`/books/${id}`);
//         return res.data.data as BookDetailResponse;
//       },
//       staleTime: 1000 * 60 * 5, 
//     })),
//   });

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

//   // === 4. SUMMARY & NAVIGASI ===
//   const totalSelectedBooks = cartItems
//     .filter(item => selectedItems.has(item.id))
//     .reduce((acc, item) => acc + item.qty, 0);

//   const handleBorrowClick = () => {
//     if (totalSelectedBooks === 0) {
//       toast.error("Pilih minimal satu buku untuk dipinjam.");
//       return;
//     }

//     const checkoutItems = cartItems
//       .filter(item => selectedItems.has(item.id))
//       .map(item => {
//         const detail = bookDetailsMap.get(item.bookId);
//         return {
//           ...item,
//           book: {
//             ...item.book,
//             author: detail?.Author || { name: 'Unknown Author' },
//             category: detail?.Category || { name: 'General' },
//             coverImage: detail?.coverImage || item.book.coverImage
//           }
//         };
//       });

//     navigate('/checkout', { state: { checkoutItems } });
//   };

//   // === 5. EMPTY CART MUTATION ===
//   const { mutate: emptyCart, isPending: isEmptying } = useMutation({
//     mutationFn: async () => {
//       const res = await apiClient.delete('/cart');
//       return res.data;
//     },
//     onSuccess: () => {
//       toast.success('Cart Emptied', { description: 'Semua item di keranjang telah dihapus.' });
//       setSelectedItems(new Set()); 
//       queryClient.invalidateQueries({ queryKey: ['my-cart'] }); 
//     },
//     // FIX: Menggunakan tipe ApiError alih-alih any
//     onError: (error: ApiError) => {
//       toast.error('Gagal Mengosongkan Keranjang', { 
//         description: error.response?.data?.message || 'Terjadi kesalahan saat menghapus keranjang.'
//       });
//     }
//   });

//   const handleEmptyCart = () => {
//     if (confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
//       emptyCart();
//     }
//   };

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
//           <div className="flex items-center gap-3 p-4 bg-white rounded-xl ">
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

//           {/* Items List */}
//           {cartItems.length === 0 ? (
//              <div className="text-center py-10 text-muted-foreground bg-gray-50 rounded-xl border border-dashed">
//                 Keranjang kosong.
//              </div>
//           ) : (
//              cartItems.map((item) => {
//                const detail = bookDetailsMap.get(item.bookId);
//                const authorName = detail?.Author?.name || 'Unknown Author';
//                const categoryName = detail?.Category?.name || 'General';
//                const coverImage = detail?.coverImage || item.book.coverImage;

//                return (
//                  <div key={item.id} className="flex items-start gap-4 p-4 bg-white border-b-2 transition-all hover:shadow-md">
//                     <div className="pt-8"> 
//                       <input 
//                           type="checkbox" 
//                           className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                           checked={selectedItems.has(item.id)}
//                           onChange={() => handleSelectItem(item.id)}
//                       />
//                     </div>

//                     <div className="flex gap-4 grow">
//                         <div className="shrink-0 w-[100px] h-[140px] bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
//                             {coverImage ? (
//                                 <img src={coverImage} alt={item.book.title} className="w-full h-full object-cover" />
//                             ) : (
//                                 <BookOpen className="w-8 h-8 text-gray-400" />
//                             )}
//                         </div>

//                         <div className="flex flex-col justify-center space-y-1 text-left">
//                             <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
//                                 {categoryName}
//                             </p>
//                             <h3 className="text-xl font-bold text-[#0A0D12] line-clamp-2">
//                                 {item.book.title}
//                             </h3>
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
//                     minHeight: '200px', 
//                     borderRadius: '16px', 
//                     padding: '20px', 
//                     gap: '24px' 
//                 }}
//             >
//                 <h2 className="font-bold text-xl text-left text-[#0A0D12]">Loan Summary</h2>

//                 <div className="flex justify-between items-center">
//                     <span className="text-base font-medium text-gray-600">Total Book</span>
//                     <span className="text-xl font-bold text-[#0A0D12]">{totalSelectedBooks} Items</span>
//                 </div>

//                 <div className="flex flex-col gap-3 w-full">
//                     {/* Button Borrow Book */}
//                     <Button 
//                         onClick={handleBorrowClick}
//                         disabled={totalSelectedBooks === 0}
//                         className="w-full text-white font-semibold shadow-none hover:opacity-90 transition-opacity"
//                         style={{ 
//                             width: '100%', 
//                             height: '48px', 
//                             borderRadius: '100px', 
//                             padding: '8px',
//                             background: '#1C65DA',
//                         }}
//                     >
//                         Borrow Book
//                     </Button>

//                     {/* Button Empty My Cart */}
//                     <Button 
//                         onClick={handleEmptyCart}
//                         disabled={isEmptying || cartItems.length === 0}
//                         variant="outline"
//                         className="w-full font-semibold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
//                         style={{ 
//                             width: '100%', 
//                             height: '48px', 
//                             borderRadius: '100px', 
//                             padding: '8px',
//                         }}
//                     >
//                         {isEmptying ? (
//                             <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                         ) : (
//                             <Trash2 className="w-4 h-4 mr-2" />
//                         )}
//                         Empty My Cart
//                     </Button>
//                 </div>
//             </Card>
//         </div>

//       </div>
//     </div>
//   );
// }


// src/pages/MyCart.tsx

import { useState, useMemo } from 'react';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api';
import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card'; // Card tidak digunakan secara langsung untuk fleksibilitas styling responsif
import { Loader2, TriangleAlert, BookOpen, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { cn } from '@/lib/utils'; // Pastikan cn diimport

// --- TIPE DATA API CART ---
interface CartItem {
  id: number;
  bookId: number;
  qty: number;
  book: {
    id: number;
    title: string;
    coverImage: string | null;
    author?: { name: string }; 
    category?: { name: string };
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

// Tambahkan Interface untuk Error API
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// --- STYLING CONSTANTS ---
const TITLE_STYLE = { 
  fontWeight: 700, 
  fontSize: '2rem', 
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
  const navigate = useNavigate();
  const queryClient = useQueryClient(); 
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // === 1. FETCH DATA CART ===
  const { data: cartData, isPending: isCartPending, isError: isCartError, error: cartError } = useQuery<CartResponse, Error>({
    queryKey: ['my-cart'],
    queryFn: async () => {
      const res = await apiClient.get('/cart');
      return res.data.data;
    },
  });

  // FIX: Memoize cartItems untuk menstabilkan referensi dependensi
  const cartItems = useMemo(() => cartData?.items || [], [cartData]);

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

  const handleBorrowClick = () => {
    if (totalSelectedBooks === 0) {
      toast.error("Pilih minimal satu buku untuk dipinjam.");
      return;
    }

    const checkoutItems = cartItems
      .filter(item => selectedItems.has(item.id))
      .map(item => {
        const detail = bookDetailsMap.get(item.bookId);
        return {
          ...item,
          book: {
            ...item.book,
            author: detail?.Author || { name: 'Unknown Author' },
            category: detail?.Category || { name: 'General' },
            coverImage: detail?.coverImage || item.book.coverImage
          }
        };
      });

    navigate('/checkout', { state: { checkoutItems } });
  };

  // === 5. EMPTY CART MUTATION ===
  const { mutate: emptyCart, isPending: isEmptying } = useMutation({
    mutationFn: async () => {
      const res = await apiClient.delete('/cart');
      return res.data;
    },
    onSuccess: () => {
      toast.success('Cart Emptied', { description: 'Semua item di keranjang telah dihapus.' });
      setSelectedItems(new Set()); 
      queryClient.invalidateQueries({ queryKey: ['my-cart'] }); 
    },
    // FIX: Menggunakan tipe ApiError alih-alih any
    onError: (error: ApiError) => {
      toast.error('Gagal Mengosongkan Keranjang', { 
        description: error.response?.data?.message || 'Terjadi kesalahan saat menghapus keranjang.'
      });
    }
  });

  const handleEmptyCart = () => {
    if (confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
      emptyCart();
    }
  };

  // === RENDER ===
  if (isCartPending) return <LoadingSpinner />;
  if (isCartError) return <ErrorDisplay message={cartError?.message || 'Gagal memuat keranjang.'} />;

  return (
    // Tambahkan pb-24 agar konten tidak tertutup fixed bottom bar di mobile
    <div className="flex flex-col px-4 pb-24 lg:pb-12 min-h-screen" style={CONTAINER_STYLE}>
      
      <h1 style={TITLE_STYLE} className="text-left">My Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Kolom Kiri: List Item */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Header Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl ">
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

          {/* Items List */}
          {cartItems.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground  rounded-xl ">
                Keranjang kosong.
             </div>
          ) : (
             cartItems.map((item) => {
               const detail = bookDetailsMap.get(item.bookId);
               const authorName = detail?.Author?.name || 'Unknown Author';
               const categoryName = detail?.Category?.name || 'General';
               const coverImage = detail?.coverImage || item.book.coverImage;

               return (
                 <div key={item.id} className="flex items-start gap-4 p-4 bg-white rounded-xl  transition-all hover:shadow-md">
                    <div className="pt-8"> 
                      <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                      />
                    </div>

                    <div className="flex gap-4 grow">
                        <div className="shrink-0 w-[100px] h-[140px] bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                            {coverImage ? (
                                <img src={coverImage} alt={item.book.title} className="w-full h-full object-cover" />
                            ) : (
                                <BookOpen className="w-8 h-8 text-gray-400" />
                            )}
                        </div>

                        <div className="flex flex-col justify-center space-y-1 text-left">
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide border w-fit rounded-md mx-0.5 p-1">
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

        {/* LOAN SUMMARY SECTION 
            - Mobile: Fixed Bottom, 2 Columns, No Border, White BG.
            - Desktop: Static Card, Sidebar style.
        */}
        <div 
            className={cn(
                // Mobile Styles
                "fixed bottom-0 left-0 right-0 bg-white p-4 z-50 flex flex-row justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]",
                // Desktop Styles overrides (mengembalikan ke bentuk Card)
                "lg:static lg:flex-col lg:items-stretch lg:w-[318px] lg:min-h-[200px] lg:rounded-2xl lg:border lg:border-gray-200 lg:shadow-sm lg:p-5 lg:gap-6"
            )}
        >
            {/* Title hanya di Desktop */}
            <h2 className="hidden lg:block font-bold text-xl text-[#0A0D12] text-left">Loan Summary</h2>

            {/* Col 1: Text Total Book */}
            <div className="flex flex-col items-start lg:flex-row lg:justify-between lg:items-center">
                <span className="text-sm font-medium text-gray-600 lg:text-base">Total Book</span>
                <span className="text-xl font-bold text-[#0A0D12]">{totalSelectedBooks} Items</span>
            </div>

            {/* Col 2: Action Buttons */}
            <div className="flex flex-col gap-3 lg:w-full">
                {/* Button Borrow Book */}
                <Button 
                    onClick={handleBorrowClick}
                    disabled={totalSelectedBooks === 0}
                    className={cn(
                        "font-semibold text-white shadow-none hover:opacity-90 transition-opacity",
                        // Mobile Size
                        "w-[150px] h-10 rounded-[100px] text-sm",
                        // Desktop Size override
                        "lg:w-full lg:h-12 lg:text-base"
                    )}
                    style={{ 
                        padding: '8px',
                        background: '#1C65DA',
                        gap: '8px'
                    }}
                >
                    Borrow Book
                </Button>

                {/* Button Empty Cart (Hanya tampil di Desktop untuk menghemat ruang di mobile bar 2 kolom) */}
                <Button 
                    onClick={handleEmptyCart}
                    disabled={isEmptying || cartItems.length === 0}
                    variant="outline"
                    className="hidden lg:flex w-full font-semibold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    style={{ 
                        width: '100%', 
                        height: '48px', 
                        borderRadius: '100px', 
                        padding: '8px',
                    }}
                >
                    {isEmptying ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Empty My Cart
                </Button>
            </div>
        </div>

      </div>
    </div>
  );
}