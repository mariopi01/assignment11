import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import apiClient from '@/api';
import { cn } from '@/lib/utils';
import type { Book } from '@/types'; 
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert, Loader2, Star } from 'lucide-react'; 
import { BookCard } from '@/components/features/BookCard';
import { Button } from '@/components/ui/button';
// Import Redux hooks dan selector
import { useAppSelector } from '@/store/hooks';
import { selectFilters } from '@/store/slices/uiSlice';

// --- TIPE DATA API ---
interface BookItem extends Omit<Book, 'author' | 'category'> {
    author: { id: number; name: string; };
    category: { id: number; name: string; };
    availableCopies: number;
}

interface BooksResponse {
    books: BookItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface Category {
    id: number;
    name: string;
}

interface CategoriesResponseWrapper {
    categories: Category[]; 
}

// --- PLACEHOLDERS ---
const LoadingSpinner = () => <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;
const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
);

// Filter options data
const RATING_OPTIONS = [5, 4, 3, 2, 1];

export default function CategoryPage() {
    const [searchParams] = useSearchParams();
    
    // BACA searchTerm dari Redux
    const { searchTerm } = useAppSelector(selectFilters); 

    // Get initial categoryId from URL, convert to number
    const initialCategoryId = searchParams.get('categoryId');

    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        initialCategoryId ? parseInt(initialCategoryId) : null
    );
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [allBooks, setAllBooks] = useState<BookItem[]>([]); // State to accumulate books
    const [page, setPage] = useState(1);
    const LIMIT = 8; // 4 columns * 2 rows

    // 1. Fetch Categories (untuk Filter UI)
    const { data: categoriesData, isPending: isCategoriesPending } = useQuery<CategoriesResponseWrapper, Error>({
        queryKey: ['booklist-categories'],
        queryFn: async () => {
            const res = await apiClient.get('/categories');
            return res.data.data;
        },
    });

    // 2. Fetch Books (UPDATE queryKey dengan searchTerm)
    const { data: booksResponse, isPending: isBooksPending, isError: isBooksError, error: booksError, isFetching } = useQuery<BooksResponse, Error>({
        // Tambahkan searchTerm ke queryKey agar refetch saat input berubah
        queryKey: ['booklist-books', selectedCategory, selectedRating, page, searchTerm],
        queryFn: async () => {
            const params: Record<string, string | number> = {
                page: page,
                limit: LIMIT
            };
            if (selectedCategory !== null) {
                params.categoryId = selectedCategory;
            }
            if (selectedRating !== null) {
                params.rating = selectedRating; 
            }
            // TAMBAHKAN PARAMETER SEARCH 'q'
            if (searchTerm) {
                params.q = searchTerm; 
            }

            const res = await apiClient.get('/books', { params });
            return res.data.data;
        },
    });
    
    // FIX: Data Accumulation Logic (Menghilangkan cascading renders)
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    useEffect(() => {
        if (booksResponse?.books) {
            setAllBooks(prevBooks => { // FIX: Menggunakan prevBooks
                const newBooks = booksResponse.books;
                const currentPage = booksResponse.pagination.page;

                // Jika halaman 1 (filter atau search baru), ganti seluruh list
                if (currentPage === 1) {
                    return newBooks;
                } 
                
                // Jika halaman > 1 (Load More), tambahkan buku baru
                const existingIds = new Set(prevBooks.map(b => b.id));
                const uniqueNewBooks = newBooks.filter(b => !existingIds.has(b.id));

                return [...prevBooks, ...uniqueNewBooks];
            });
        }
    }, [booksResponse]); 
    
    // EFFECT BARU: Reset page ke 1 saat searchTerm berubah (Hanya jika page > 1)
    useEffect(() => {
        if (page !== 1) {
            setPage(1);
        }
        // Dependency array hanya bergantung pada searchTerm
    }, [page, searchTerm]);


    // --- HANDLERS (Logika reset page) ---
    const handleCategoryChange = (id: number | null) => {
        if (selectedCategory !== id) {
            setPage(1); 
            setSelectedCategory(id); 
        }
    };

    const handleRatingChange = (rating: number | null) => {
        if (selectedRating !== rating) {
            setPage(1); 
            setSelectedRating(rating); 
        }
    };

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    // --- RENDER LOGIC ---
    
    const books = allBooks;
    const pagination = booksResponse?.pagination;
    const hasMore = pagination ? pagination.page < pagination.totalPages : false;

    // Title Styling
    const TITLE_STYLE = { fontSize: '3rem', lineHeight: '1.2' }; // display-lg

    const renderBookGrid = () => {
        const isInitialLoad = isBooksPending && page === 1;

        if (isInitialLoad) {
            return <LoadingSpinner />;
        }
        if (isBooksError) {
            return <ErrorDisplay message={booksError?.message || 'Gagal memuat daftar buku.'} />;
        }
        
        if (books.length === 0) {
            return <p className="text-center text-muted-foreground p-8">Tidak ada buku ditemukan dengan filter ini.</p>;
        }

        return (
            <div className="space-y-6">
                
                {/* Book Card Grid: 4 columns desktop, 2 columns mobile */}
                <div className={cn(
                    "grid gap-6 w-full",
                    "grid-cols-2 lg:grid-cols-4"
                )}>
                    {books.map((book: BookItem) => ( 
                        <BookCard key={book.id} book={book as unknown as Book} /> 
                    ))}
                </div>
                
                {/* Pagination/Load More Logic */}
                <div className="flex justify-center pt-8">
                    {hasMore && (
                        <Button 
                            onClick={handleLoadMore}
                            disabled={isFetching}
                        >
                            {isFetching ? 'Loading...' : 'Load More'}
                        </Button>
                    )}
                </div>
            </div>
        );
    }
    
    // Left Sidebar Filter
    const renderFilters = () => (
        <div className="w-full md:w-64 space-y-8 p-4 md:border-r border-gray-200 shrink-0">
            {/* Filter by Category */}
            <div className="space-y-3">
                <h3 className="font-bold text-lg text-foreground">Filter by Category</h3>
                <div className="space-y-2">
                    <Button
                        variant={selectedCategory === null ? 'default' : 'ghost'}
                        onClick={() => handleCategoryChange(null)}
                        className="w-full justify-start"
                    >
                        All Categories
                    </Button>
                    {isCategoriesPending ? (
                        <p className="text-sm text-muted-foreground">Loading categories...</p>
                    ) : (
                        categoriesData?.categories?.map(cat => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.id ? 'default' : 'ghost'}
                                onClick={() => handleCategoryChange(cat.id)}
                                className="w-full justify-start"
                            >
                                {cat.name}
                            </Button>
                        ))
                    )}
                </div>
            </div>

            {/* Filter by Rating */}
            <div className="space-y-3">
                <h3 className="font-bold text-lg text-foreground">Filter by Rating</h3>
                <div className="space-y-2">
                     <Button
                        variant={selectedRating === null ? 'default' : 'ghost'}
                        onClick={() => handleRatingChange(null)}
                        className="w-full justify-start"
                    >
                        Any Rating
                    </Button>
                    {RATING_OPTIONS.map(rating => (
                        <Button
                            key={rating}
                            variant={selectedRating === rating ? 'default' : 'ghost'}
                            onClick={() => handleRatingChange(rating)}
                            className="w-full justify-start gap-2"
                        >
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            {rating} Stars & Up
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );


    return (
        <div className="space-y-8">
            {/* 1. Title: "Book List" */}
            <h1 className="font-extrabold text-[#0A0D12] text-left" 
                style={TITLE_STYLE}>
                Book List
            </h1>

            {/* 2. Main Flex Layout: Kiri (Filter) | Kanan (Content) */}
            <div className="flex flex-col md:flex-row">
                {/* 2. Flex Kiri: Filters */}
                {renderFilters()}

                {/* 3. Flex Kanan: Book Cards */}
                <div className="flex-1 p-4">
                    {renderBookGrid()}
                </div>
            </div>
        </div>
    );
}