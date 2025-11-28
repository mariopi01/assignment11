
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert, Loader2, Star, BookOpen } from 'lucide-react';
import type { Book } from '@/types';
import {Link} from 'react-router-dom'

// --- TIPE DATA API (didasarkan pada respons Anda) ---
interface Author { id: number; name: string; }
interface RecommendedBook extends Omit<Book, 'author' | 'category' | 'id' | 'coverImage'> {
    id: number;
    title: string;
    coverImage: string | null;
    rating: number;
    Author: Author;
    Category: {
      id: number;
      name: string;
    };
    description: string;
    isbn: string;
    publishedYear: number;
    reviewCount: number;
    totalCopies: number;
    availableCopies: number;
    borrowCount: number;
}
interface RecommendedBooksResponse {
    mode: string;
    books: RecommendedBook[];
}
// ----------------------------------------------------

// Komponen Pembantu: Star Icon (Tetap sama, tapi hanya akan dipanggil sekali)
const StarIcon = ({ filled }: { filled: boolean }) => (
    <Star 
        className={cn("w-4 h-4", filled ? "fill-yellow-500 text-yellow-500" : "text-gray-300")} 
        fill={filled ? "currentColor" : "none"}
    />
);

// Komponen Pembantu: Card Rekomendasi Khusus
const RecommendationCard = ({ book }: { book: RecommendedBook }) => {
    const coverAspectRatio = '2/3'; 

    return (
      <Link to={`/books/${book.id}`}>
        <Card className="p-0 border overflow-hidden transition-shadow hover:shadow-lg w-full h-full rounded-xl">
            
            <div className={`relative w-full aspect-[${coverAspectRatio}] flex items-center justify-center bg-gray-200`}>
                {book.coverImage ? (
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-56 h-[336px] object-fill"
                        style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
                    />
                ) : (
                    <BookOpen className="w-16 h-16 text-gray-500" />
                )}
            </div>
            
            <div className="p-4 flex flex-col space-y-1">
                <h3 className="font-bold text-lg leading-normal truncate text-foreground text-left" 
                    style={{ letterSpacing: '-0.03em' }}>
                    {book.title}
                </h3>
                
                <p className="font-medium text-base text-muted-foreground truncate text-left"
                   style={{ letterSpacing: '-0.03em' }}>
                    {book.Author?.name}
                </p>

                {/* PERUBAHAN DI SINI: Hanya menampilkan satu bintang dan nilai rating */}
                <div className="flex items-center space-x-1 pt-2">
                    {/* Tampilkan StarIcon yang 'terisi' jika rating > 0, jika tidak, kosong */}
                    <StarIcon filled={book.rating > 0} /> 
                    <span className="text-sm font-semibold text-foreground ml-1">
                        {book.rating}/5 {/* Menampilkan nilai rating dan maksimumnya */}
                    </span>
                </div>
            </div>
        </Card>
      </Link>
    );
};


export const Recommendation = () => {
    const INITIAL_LIMIT = 10;
    const LIMIT_INCREMENT = 10;

    const [limit, setLimit] = useState(INITIAL_LIMIT);
    
    const { data, isPending, isError, error, isFetching } = useQuery<RecommendedBooksResponse, Error>({
        queryKey: ['recommended-books', limit],
        queryFn: async () => {
            const res = await apiClient.get('/books/recommend', {
                params: {
                    by: 'rating',
                    limit: limit,
                }
            });
            return res.data.data;
        },
    });

    const handleLoadMore = () => {
        setLimit(prevLimit => prevLimit + LIMIT_INCREMENT);
    };

    const books = data?.books || [];
    
    const hasMore = books.length === limit; 
    
    const isLoadingInitial = isPending && !isFetching;

    return (
        <div className="space-y-6">
            <h2 className="font-extrabold text-[#0A0D12] text-left" 
                style={{ fontSize: '1.5rem', lineHeight: '1.2' }}>
                Recommendation
            </h2>
            
            {isLoadingInitial && (
                <div className="text-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p>Loading recommendations...</p>
                </div>
            )}
            
            {isError && (
                <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error?.message || 'Gagal memuat rekomendasi buku.'}</AlertDescription>
                </Alert>
            )}

            {(!isLoadingInitial && books.length > 0) && (
                 <div className={cn(
                    "grid gap-6",
                    "lg:grid-cols-5",
                    "grid-cols-2 sm:grid-cols-3" 
                )}>
                    {books.map((book) => (
                        <RecommendationCard key={book.id} book={book} />
                    ))}
                    
                    {isFetching && (
                         Array.from({ length: LIMIT_INCREMENT }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="animate-pulse bg-gray-200 rounded-xl"
                                style={{ width: '224px', height: '468px' }}>
                                <div className="bg-gray-300 w-full" style={{ height: '336px' }}></div>
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/3 pt-2"></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {hasMore && !isLoadingInitial && !isError && !isFetching && (
                <div className="text-center pt-4">
                    <Button 
                        onClick={handleLoadMore} 
                        disabled={isFetching}
                        variant="outline"
                        className={cn(
                            "w-[200px] h-12 rounded-full text-base", 
                            "border border-[#D5D7DA] bg-white hover:bg-gray-50 transition-colors"
                        )}
                    >
                        {isFetching ? 'Loading...' : 'Load More'}
                    </Button>
                </div>
            )}

            {books.length === 0 && !isPending && !isError && (
                <p className="text-center text-muted-foreground p-4">Tidak ada rekomendasi buku saat ini.</p>
            )}
        </div>
    );
};