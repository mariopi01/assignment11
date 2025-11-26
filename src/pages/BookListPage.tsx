import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api';
import { useAppSelector } from '@/store/hooks';
import { selectFilters } from '@/store/slices/uiSlice';
import type { Book } from '@/types';

// Komponen & UI
import { Hero } from '@/components/features/Hero'; 
import { Recommendation } from '@/components/features/Recommendation'; 
import { PopularAuthors } from '@/components/features/PopularAuthors'; 

// Dummies, Anda bisa ganti dengan komponen loading/error yang lebih baik

// Asumsi API mengembalikan { books: Book[], categories: string[] }
interface BooksResponse {
  books: Book[];
  categories: string[];
}

export default function BookListPage() {
  const { filterCategory, searchTerm } = useAppSelector(selectFilters);

  // === DATA FETCHING (TanStack Query) ===
  useQuery<BooksResponse, Error>({
    queryKey: ['books', filterCategory, searchTerm],
    queryFn: async () => {
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


  // === RENDER LOGIC ===

  return (
    <div className="space-y-8  pb-8 ">
      {/* Hero section */}
      <Hero />
      
      {/* Recommendation section */}
      <Recommendation />
      
      {/* Popular Authors section */}
      <PopularAuthors /> {/* <--- KOMPONEN BARU DITAMBAHKAN */}
      
      
      
    </div>
  );
}