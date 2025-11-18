
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api';
import type { Book } from '@/types';
import { BookCard } from './BookCard';
import { Loader2, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Tipe data dari API /api/books/recommend
interface RecommendResponse {
  mode: string;
  books: Book[];
}

// Tipe data lengkap dari API
interface ApiResponse {
  success: boolean;
  message: string;
  data: RecommendResponse;
}

const LoadingSpinner = () => (
  <div className="text-center py-8">
    <Loader2 className="h-8 w-8 animate-spin inline-block" />
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <TriangleAlert className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

export const Recommendation = () => {
  // Fetch 4 buku rekomendasi berdasarkan rating
  const { data, isPending, isError, error } = useQuery<ApiResponse, Error>({
    queryKey: ['recommendations', 'rating'],
    queryFn: async () => {
      const res = await apiClient.get('/books/recommend', {
        params: {
          by: 'rating',
          limit: 4,
        },
      });
      return res.data; // Mengembalikan seluruh respons API
    },
  });

  const renderContent = () => {
    if (isPending) return <LoadingSpinner />;
    if (isError) return <ErrorDisplay message={error.message || 'Gagal memuat rekomendasi.'} />;

    // Mengakses data buku dari dalam 'data.data.books'
    const books = data?.data?.books;

    if (books && books.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      );
    }
    return <p className="text-center text-muted-foreground">Tidak ada buku rekomendasi.</p>;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Rekomendasi Teratas</h2>
      {renderContent()}
    </div>
  );
};