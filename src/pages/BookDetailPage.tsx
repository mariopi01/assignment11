// // import { useParams } from 'react-router-dom';
// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// // import apiClient from '@/api';
// // import { BookDetail } from '@/types';
// // import dayjs from 'dayjs'; // Import dayjs

// // // Komponen
// // import { Button } from '@/components/ui/button';
// // import { Badge } from '@/components/ui/badge';
// // import { useToast } from '@/components/ui/use-toast';
// // import { ReviewForm } from '@/components/features/ReviewForm';
// // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // import { TriangleAlert, Loader2 } from 'lucide-react';

// // // Placeholders
// // const LoadingSpinner = () => <div className="text-center"><Loader2 className="animate-spin" /></div>;
// // const ErrorDisplay = ({ message }: { message: string }) => (
// //   <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
// // );

// // export default function BookDetailPage() {
// //   const { id } = useParams<{ id: string }>(); // Ambil ID dari URL
// //   const { toast } = useToast();
// //   const queryClient = useQueryClient();

// //   // === FETCHING DATA BUKU ===
// //   const { data: book, isPending, isError, error } = useQuery<BookDetail, Error>({
// //     queryKey: ['book', id], // Kunci unik untuk buku ini
// //     queryFn: async () => {
// //       const res = await apiClient.get(`/books/${id}`);
// //       return res.data;
// //     },
// //   });

// //   // === MUTASI PINJAM (DENGAN OPTIMISTIC UI) ===
// //   const { mutate: borrowBook, isPending: isBorrowing } = useMutation({
// //     mutationFn: () => apiClient.post(`/books/${id}/borrow`),
    
// //     // --- Langkah Optimistic Update ---
// //     onMutate: async () => {
// //       // 1. Batalkan query yang sedang berjalan untuk data ini
// //       await queryClient.cancelQueries({ queryKey: ['book', id] });

// //       // 2. Ambil snapshot data saat ini
// //       const previousBook = queryClient.getQueryData<BookDetail>(['book', id]);

// //       // 3. Update data di cache secara optimis (langsung)
// //       if (previousBook) {
// //         queryClient.setQueryData<BookDetail>(['book', id], {
// //           ...previousBook,
// //           stock: previousBook.stock - 1, // Langsung kurangi stok di UI
// //         });
// //       }

// //       toast({ title: 'Memproses Pinjaman...', description: 'Stok diperbarui.' });

// //       // 4. Kembalikan data snapshot
// //       return { previousBook };
// //     },
    
// //     // Jika Gagal (onError)
// //     onError: (err: any, _variables, context) => {
// //       // Kembalikan data ke snapshot sebelumnya
// //       if (context?.previousBook) {
// //         queryClient.setQueryData(['book', id], context.previousBook);
// //       }
// //       toast({
// //         title: 'Pinjam Gagal',
// //         description: err.response?.data?.message || 'Stok mungkin habis.',
// //         variant: 'destructive',
// //       });
// //     },
    
// //     // Setelah selesai (sukses atau gagal)
// //     onSettled: () => {
// //       // 1. Refresh data dari server untuk memastikan konsistensi
// //       queryClient.invalidateQueries({ queryKey: ['book', id] });
// //       // 2. Refresh data pinjaman (karena ada pinjaman baru)
// //       queryClient.invalidateQueries({ queryKey: ['my-loans'] }); 
// //     },

// //     // Jika Sukses (onSuccess)
// //     onSuccess: () => {
// //        toast({
// //         title: 'Pinjam Berhasil!',
// //         description: 'Buku telah ditambahkan ke "My Loans".',
// //       });
// //     }
// //   });

// //   // === RENDER LOGIC ===
// //   if (isPending) return <LoadingSpinner />;
// //   if (isError) return <ErrorDisplay message={error.message || 'Gagal memuat detail buku.'} />;
// //   if (!book) return <p>Buku tidak ditemukan.</p>;

// //   return (
// //     <div className="space-y-8">
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //         {/* Kolom Kiri: Gambar & Tombol */}
// //         <div className="md:col-span-1 space-y-4">
// //           <img
// //             src={book.coverImageUrl || 'https://via.placeholder.com/300'}
// //             alt={book.title}
// //             className="rounded-lg shadow-md w-full"
// //           />
// //           <Button
// //             size="lg"
// //             className="w-full"
// //             disabled={book.stock === 0 || isBorrowing}
// //             onClick={() => borrowBook()}
// //           >
// //             {isBorrowing ? 'Memproses...' : (book.stock > 0 ? `Pinjam (Stok: ${book.stock})` : 'Stok Habis')}
// //           </Button>
// //         </div>

// //         {/* Kolom Kanan: Info & Ulasan */}
// //         <div className="md:col-span-2 space-y-6">
// //           <h1 className="text-4xl font-bold">{book.title}</h1>
// //           <div className="flex items-center gap-4">
// //             <p className="text-xl text-muted-foreground">{book.author}</p>
// //             <Badge variant="secondary">{book.category}</Badge>
// //           </div>
// //           <p className="text-base leading-relaxed">{book.description}</p>
          
// //           <hr />

// //           {/* Bagian Ulasan */}
// //           <div className="space-y-6">
// //             <h2 className="text-2xl font-semibold">Ulasan</h2>
// //             <ReviewForm bookId={book.id} />
// //             <div className="space-y-4">
// //               {book.reviews.length > 0 ? (
// //                 book.reviews.map((review) => (
// //                   <Card key={review.id}>
// //                     <CardHeader>
// //                       <div className="flex justify-between items-center">
// //                         <span className="font-semibold">{review.userName}</span>
// //                         <span className="text-sm text-muted-foreground">
// //                           {dayjs(review.createdAt).format('DD MMM YYYY')}
// //                         </span>
// //                       </div>
// //                       <p className="text-sm">Rating: {review.rating}/5</p>
// //                     </CardHeader>
// //                     <CardContent>
// //                       <p>{review.comment}</p>
// //                     </CardContent>
// //                   </Card>
// //                 ))
// //               ) : (
// //                 <p className="text-muted-foreground">Belum ada ulasan.</p>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useParams } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import apiClient from '@/api';
// import type { BookDetail } from '@/types'; // <--- 1. PERBAIKAN: Menggunakan 'import type'
// import dayjs from 'dayjs';

// // Komponen
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { toast } from 'sonner';// <--- 2. PERBAIKAN: Import (setelah npx add toast)
// import { ReviewForm } from '@/components/features/ReviewForm';
// // 2. PERBAIKAN: Import Alert (setelah npx add alert)
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // 2. PERBAIKAN: Import Card (setelah npx add card)
// import { Card, CardHeader, CardContent } from '@/components/ui/card'; 
// import { TriangleAlert, Loader2 } from 'lucide-react';

// // Placeholders
// const LoadingSpinner = () => <div className="text-center"><Loader2 className="animate-spin" /></div>;
// const ErrorDisplay = ({ message }: { message: string }) => (
//   <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
// );

// // 3. PERBAIKAN: Definisikan tipe error
// interface ApiError {
//   response?: {
//     data?: {
//       message?: string;
//     };
//   };
// }

// export default function BookDetailPage() {
//   const { id } = useParams<{ id: string }>();
  
//   const queryClient = useQueryClient();

//   const { data: book, isPending, isError, error } = useQuery<BookDetail, Error>({
//     queryKey: ['book', id],
//     queryFn: async () => {
//       const res = await apiClient.get(`/books/${id}`);
//       return res.data;
//     },
//   });

//   const { mutate: borrowBook, isPending: isBorrowing } = useMutation({
//     mutationFn: () => apiClient.post(`/books/${id}/borrow`),
    
//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey: ['book', id] });
//       const previousBook = queryClient.getQueryData<BookDetail>(['book', id]);

//       if (previousBook) {
//         queryClient.setQueryData<BookDetail>(['book', id], {
//           ...previousBook,
//           stock: previousBook.stock - 1,
//         });
//       }
//       toast.info('Memproses Pinjaman...', { description: 'Stok diperbarui.' });
//       return { previousBook };
//     },
    
//     // 4. PERBAIKAN: Gunakan tipe ApiError, bukan 'any'
//     onError: (err: ApiError, _variables, context) => {
//       if (context?.previousBook) {
//         queryClient.setQueryData(['book', id], context.previousBook);
//       }
//       toast.error('Pinjam Gagal', { 
//         description: err.response?.data?.message || 'Stok mungkin habis.' 
//       });
//     },
    
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['book', id] });
//       queryClient.invalidateQueries({ queryKey: ['my-loans'] }); 
//     },

//     onSuccess: () => {
//        toast.success('Pinjam Berhasil!', { 
//          description: 'Buku telah ditambahkan ke "My Loans".' 
//        });
//     }
//   });

//   if (isPending) return <LoadingSpinner />;
//   if (isError) return <ErrorDisplay message={error.message || 'Gagal memuat detail buku.'} />;
//   if (!book) return <p>Buku tidak ditemukan.</p>;

//   return (
//     <div className="space-y-8">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* Kolom Kiri: Gambar & Tombol */}
//         <div className="md:col-span-1 space-y-4">
//           <img
//             src={book.coverImageUrl || 'https://via.placeholder.com/300'}
//             alt={book.title}
//             className="rounded-lg shadow-md w-full"
//           />
//           <Button
//             size="lg"
//             className="w-full"
//             disabled={book.stock === 0 || isBorrowing}
//             onClick={() => borrowBook()}
//           >
//             {isBorrowing ? 'Memproses...' : (book.stock > 0 ? `Pinjam (Stok: ${book.stock})` : 'Stok Habis')}
//           </Button>
//         </div>

//         {/* Kolom Kanan: Info & Ulasan */}
//         <div className="md:col-span-2 space-y-6">
//           <h1 className="text-4xl font-bold">{book.title}</h1>
//           <div className="flex items-center gap-4">
//             <p className="text-xl text-muted-foreground">{book.author}</p>
//             <Badge variant="secondary">{book.category}</Badge>
//           </div>
//           <p className="text-base leading-relaxed">{book.description}</p>
          
//           <hr />

//           {/* Bagian Ulasan */}
//           <div className="space-y-6">
//             <h2 className="text-2xl font-semibold">Ulasan</h2>
//             <ReviewForm bookId={book.id} />
//             <div className="space-y-4">
//               {book.reviews.length > 0 ? (
//                 book.reviews.map((review) => (
//                   // Error 'Card' dll. sekarang sudah teratasi dengan import di atas
//                   <Card key={review.id}> 
//                     <CardHeader>
//                       <div className="flex justify-between items-center">
//                         <span className="font-semibold">{review.userName}</span>
//                         <span className="text-sm text-muted-foreground">
//                           {dayjs(review.createdAt).format('DD MMM YYYY')}
//                         </span>
//                       </div>
//                       <p className="text-sm">Rating: {review.rating}/5</p>
//                     </CardHeader>
//                     <CardContent>
//                       <p>{review.comment}</p>
//                     </CardContent>
//                   </Card>
//                 ))
//               ) : (
//                 <p className="text-muted-foreground">Belum ada ulasan.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/pages/BookDetailPage.tsx

import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api';
import type { BookDetail } from '@/types'; 
import dayjs from 'dayjs';

// Komponen
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardContent } from '@/components/ui/card'; 
import { TriangleAlert, Loader2 } from 'lucide-react';
import { ReviewForm } from '@/components/features/ReviewForm'; // Pastikan ini diimpor

// Placeholders
const LoadingSpinner = () => <div className="text-center"><Loader2 className="animate-spin" /></div>;
const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
);

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Tipe data untuk /api/books/{id}
interface BookDetailResponse {
  book: BookDetail;
}

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const queryClient = useQueryClient();

  // PERBAIKAN: Update queryFn dan type
  const { data, isPending, isError, error } = useQuery<BookDetailResponse, Error>({
    queryKey: ['book', id],
    queryFn: async () => {
      const res = await apiClient.get(`/books/${id}`);
      return res.data.data; // API mengembalikan { data: { book: ... } }
    },
  });

  // Ambil 'book' dari 'data'
  const book = data?.book;

  const { mutate: borrowBook, isPending: isBorrowing } = useMutation({
    mutationFn: () => apiClient.post(`/books/${id}/borrow`),
    
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['book', id] });
      // Snapshot data lama
      const previousData = queryClient.getQueryData<BookDetailResponse>(['book', id]);

      if (previousData && previousData.book) {
        // Update cache secara optimis
        queryClient.setQueryData<BookDetailResponse>(['book', id], {
          ...previousData,
          book: {
            ...previousData.book,
            availableCopies: previousData.book.availableCopies - 1, // Gunakan availableCopies
          }
        });
      }
      toast.info('Memproses Pinjaman...', { description: 'Stok diperbarui.' });
      return { previousData };
    },
    
    onError: (err: ApiError, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['book', id], context.previousData);
      }
      toast.error('Pinjam Gagal', { 
        description: err.response?.data?.message || 'Stok mungkin habis.' 
      });
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['book', id] });
      queryClient.invalidateQueries({ queryKey: ['my-loans'] }); 
    },

    onSuccess: () => {
       toast.success('Pinjam Berhasil!', { 
         description: 'Buku telah ditambahkan ke "My Loans".' 
       });
    }
  });

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorDisplay message={error.message || 'Gagal memuat detail buku.'} />;
  
  // Perlu cek 'book' sekarang, bukan 'data'
  if (!book) return <p>Buku tidak ditemukan.</p>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Gambar & Tombol */}
        <div className="md:col-span-1 space-y-4">
          <img
            src={book.coverImageUrl || 'https://via.placeholder.com/300'}
            alt={book.title}
            className="rounded-lg shadow-md w-full"
          />
          <Button
            size="lg"
            className="w-full"
            // PERBAIKAN: Cek availableCopies
            disabled={book.availableCopies === 0 || isBorrowing}
            onClick={() => borrowBook()}
          >
            {isBorrowing ? 'Memproses...' : (book.availableCopies > 0 ? `Pinjam (Stok: ${book.availableCopies})` : 'Stok Habis')}
          </Button>
        </div>

        {/* Kolom Kanan: Info & Ulasan */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold">{book.title}</h1>
          <div className="flex items-center gap-4">
            {/* PERBAIKAN: Render book.author.name */}
            <p className="text-xl text-muted-foreground">{book.author.name}</p>
            {/* PERBAIKAN: Render book.category.name */}
            <Badge variant="secondary">{book.category.name}</Badge>
          </div>
          <p className="text-base leading-relaxed">{book.description}</p>
          
          <hr />

          {/* Bagian Ulasan */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Ulasan</h2>
            <ReviewForm bookId={book.id} />
            <div className="space-y-4">
              {book.reviews.length > 0 ? (
                book.reviews.map((review) => (
                  <Card key={review.id}> 
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{review.userName}</span>
                        <span className="text-sm text-muted-foreground">
                          {dayjs(review.createdAt).format('DD MMM YYYY')}
                        </span>
                      </div>
                      <p className="text-sm">Rating: {review.rating}/5</p>
                    </CardHeader>
                    <CardContent>
                      <p>{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">Belum ada ulasan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}