// import { useQuery } from '@tanstack/react-query';
// import apiClient from '@/api';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { selectFilters, setFilterCategory, setSearchTerm } from '@/store/slices/uiSlice';
// import type { Book } from '@/types';

// // Komponen & UI
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { BookCard } from '@/components/features/BookCard';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { TriangleAlert } from 'lucide-react';

// // Dummies, Anda bisa ganti dengan komponen loading/error yang lebih baik
// const LoadingSpinner = () => <div className="text-center">Loading books...</div>;
// const ErrorDisplay = ({ message }: { message: string }) => (
//   <Alert variant="destructive">
//     <TriangleAlert className="h-4 w-4" />
//     <AlertTitle>Error</AlertTitle>
//     <AlertDescription>{message}</AlertDescription>
//   </Alert>
// );

// // Asumsi API mengembalikan { books: Book[], categories: string[] }
// interface BooksResponse {
//   books: Book[];
//   categories: string[];
// }

// export default function BookListPage() {
//   const dispatch = useAppDispatch();
//   const { filterCategory, searchTerm } = useAppSelector(selectFilters);

//   // === DATA FETCHING (TanStack Query) ===
//   const { data, isPending, isError, error } = useQuery<BooksResponse, Error>({
//     // Kunci query ini akan otomatis memperbarui data ketika filter/search berubah
//     queryKey: ['books', filterCategory, searchTerm],
//     queryFn: async () => {
//       const params: any = {};
//       if (filterCategory !== 'all') {
//         params.category = filterCategory;
//       }
//       if (searchTerm) {
//         params.search = searchTerm;
//       }
//       const res = await apiClient.get('/books', { params });
//       return res.data;
//     },
//     // Menjaga data sebelumnya terlihat saat data baru di-fetch
//     placeholderData: (previousData) => previousData, 
//   });

//   // Handler untuk UI
//   const handleCategoryChange = (value: string) => {
//     dispatch(setFilterCategory(value));
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     dispatch(setSearchTerm(e.target.value));
//   };

//   // === RENDER LOGIC ===
//   const renderContent = () => {
//     if (isPending) {
//       return <LoadingSpinner />;
//     }
//     if (isError) {
//       return <ErrorDisplay message={error.message || 'Gagal memuat buku.'} />;
//     }
//     if (data && data.books.length > 0) {
//       return (
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {data.books.map((book) => (
//             <BookCard key={book.id} book={book} />
//           ))}
//         </div>
//       );
//     }
//     return <p className="text-center text-muted-foreground">Tidak ada buku yang ditemukan.</p>;
//   };

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col md:flex-row gap-4">
//         <Input
//           placeholder="Cari berdasarkan judul atau penulis..."
//           className="flex-grow"
//           value={searchTerm}
//           onChange={handleSearchChange}
//         />
//         <Select value={filterCategory} onValueChange={handleCategoryChange}>
//           <SelectTrigger className="w-full md:w-[180px]">
//             <SelectValue placeholder="Semua Kategori" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">Semua Kategori</SelectItem>
//             {/* Tampilkan kategori dari data API */}
//             {data?.categories?.map((category) => (
//               <SelectItem key={category} value={category}>
//                 {category}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {renderContent()}
//     </div>
//   );
// }

// src/pages/BookListPage.tsx

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectFilters, setFilterCategory, setSearchTerm } from '@/store/slices/uiSlice';
import type { Book } from '@/types';

// Komponen & UI
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookCard } from '@/components/features/BookCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';

// Dummies, Anda bisa ganti dengan komponen loading/error yang lebih baik
const LoadingSpinner = () => <div className="text-center">Loading books...</div>;
const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <TriangleAlert className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

// Asumsi API mengembalikan { books: Book[], categories: string[] }
interface BooksResponse {
  books: Book[];
  categories: string[];
}

export default function BookListPage() {
  const dispatch = useAppDispatch();
  const { filterCategory, searchTerm } = useAppSelector(selectFilters);

  // === DATA FETCHING (TanStack Query) ===
  const { data, isPending, isError, error } = useQuery<BooksResponse, Error>({
    queryKey: ['books', filterCategory, searchTerm],
    queryFn: async () => {
      // PERBAIKAN 1: Ganti 'any' dengan 'Record<string, string>'
      const params: Record<string, string> = {}; 
      if (filterCategory !== 'all') {
        params.category = filterCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const res = await apiClient.get('/books', { params });
      return res.data;
    },
    placeholderData: (previousData) => previousData, 
  });

  // Handler untuk UI
  const handleCategoryChange = (value: string) => {
    dispatch(setFilterCategory(value));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // === RENDER LOGIC ===
  const renderContent = () => {
    if (isPending) {
      return <LoadingSpinner />;
    }
    if (isError) {
      return <ErrorDisplay message={error.message || 'Gagal memuat buku.'} />;
    }
    if (data && data.books.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      );
    }
    return <p className="text-center text-muted-foreground">Tidak ada buku yang ditemukan.</p>;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Cari berdasarkan judul atau penulis..."
          // PERBAIKAN 2: Ganti 'flex-grow' dengan 'grow'
          className="grow" 
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Select value={filterCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {data?.categories?.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {renderContent()}
    </div>
  );
}