



// // src/pages/Category.tsx

// import { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { useSearchParams } from 'react-router-dom';
// import apiClient from '@/api';
// import { cn } from '@/lib/utils';
// import type { Book } from '@/types'; 
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { TriangleAlert, Loader2, Star } from 'lucide-react'; 
// import { BookCard } from '@/components/features/BookCard';
// import { Button } from '@/components/ui/button';
// import { useAppSelector } from '@/store/hooks';
// import { selectFilters } from '@/store/slices/uiSlice';

// // --- TIPE DATA ---
// interface RawBookItem {
//     id: number;
//     title: string;
//     description: string;
//     isbn: string;
//     publishedYear: number;
//     coverImage: string | null;
//     price: number;
//     stock: number;
//     isActive: boolean;
//     rating: number;
//     reviewCount: number;
//     availableCopies: number;
//     totalCopies: number;
//     Author: {
//         id: number;
//         name: string;
//         bio?: string;
//     };
//     Category: {
//         id: number;
//         name: string;
//     };
// }

// interface BookItem extends Omit<Book, 'id'> {
//     id: string; 
// }

// interface BooksResponse {
//     books: BookItem[];
//     pagination: {
//         page: number;
//         limit: number;
//         total: number;
//         totalPages: number;
//     };
// }

// interface Category {
//     id: number;
//     name: string;
// }

// interface CategoriesResponseWrapper {
//     categories: Category[]; 
// }

// // --- COMPONENTS ---
// const LoadingSpinner = () => <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;
// const ErrorDisplay = ({ message }: { message: string }) => (
//   <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
// );

// const RATING_OPTIONS = [5, 4, 3, 2, 1];

// export default function CategoryPage() {
//     const [searchParams] = useSearchParams();
//     const { searchTerm } = useAppSelector(selectFilters); 

//     const initialCategoryId = searchParams.get('categoryId');

//     const [selectedCategory, setSelectedCategory] = useState<number | null>(
//         initialCategoryId ? parseInt(initialCategoryId) : null
//     );
//     const [selectedRating, setSelectedRating] = useState<number | null>(null);
//     const [allBooks, setAllBooks] = useState<BookItem[]>([]); 
//     const [page, setPage] = useState(1);
//     const LIMIT = 8; 

//     // 1. Fetch Categories
//     const { data: categoriesData, isPending: isCategoriesPending } = useQuery<CategoriesResponseWrapper, Error>({
//         queryKey: ['booklist-categories'],
//         queryFn: async () => {
//             const res = await apiClient.get('/categories');
//             return res.data.data;
//         },
//     });

//     // 2. Fetch Books
//     const { data: booksResponse, isPending: isBooksPending, isError: isBooksError, error: booksError, isFetching } = useQuery<BooksResponse, Error>({
//         queryKey: ['booklist-books', selectedCategory, selectedRating, page, searchTerm],
//         queryFn: async () => {
//             const params: Record<string, string | number> = {
//                 page: page,
//                 limit: LIMIT
//             };
            
//             if (selectedCategory !== null) {
//                 params.categoryId = selectedCategory;
//             }
            
//             if (searchTerm) {
//                 params.title = searchTerm; 
//             }

//             const res = await apiClient.get('/books', { params });
//             const apiData = res.data.data;

//             // Mapping Data
//             let mappedBooks: BookItem[] = apiData.books.map((b: RawBookItem) => ({
//                 id: b.id.toString(),
//                 title: b.title,
//                 author: b.Author,
//                 category: b.Category,
//                 coverImage: b.coverImage,
//                 stock: b.stock,
//                 availableCopies: b.availableCopies,
//                 rating: b.rating,
//             }));

//             // === CLIENT-SIDE FILTERING UNTUK RATING (RANGE LOGIC) ===
//             if (selectedRating !== null) {
//                 mappedBooks = mappedBooks.filter(book => {
//                     if (selectedRating === 5) {
//                         return book.rating === 5;
//                     }
//                     return book.rating >= selectedRating && book.rating < (selectedRating + 1);
//                 });
//             }

//             return {
//                 books: mappedBooks,
//                 pagination: apiData.pagination
//             };
//         },
//     });
    
//     // Accumulation Logic
//     useEffect(() => {
//         if (booksResponse?.books) {
//             setAllBooks(prevBooks => { 
//                 const newBooks = booksResponse.books;
//                 const currentPage = booksResponse.pagination.page;

//                 if (currentPage === 1) {
//                     return newBooks;
//                 } 
                
//                 const existingIds = new Set(prevBooks.map(b => b.id));
//                 const uniqueNewBooks = newBooks.filter(b => !existingIds.has(b.id));

//                 return [...prevBooks, ...uniqueNewBooks];
//             });
//         }
//     }, [booksResponse]); 
    
//     // Reset page on filter change
//     useEffect(() => {
//         if (page !== 1) {
//             setPage(1);
//         }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [searchTerm, selectedCategory, selectedRating]);


//     // Handlers
//     const handleCategoryChange = (id: number | null) => {
//         if (selectedCategory !== id) {
//             setPage(1); 
//             setSelectedCategory(id); 
//         }
//     };

//     const handleRatingChange = (rating: number | null) => {
//         if (selectedRating === rating) {
//             setSelectedRating(null);
//         } else {
//             setPage(1); 
//             setSelectedRating(rating); 
//         }
//     };

//     const handleLoadMore = () => {
//         setPage(prev => prev + 1);
//     };

//     // Render Logic
//     const books = allBooks;
//     const pagination = booksResponse?.pagination;
//     const hasMore = pagination ? pagination.page < pagination.totalPages : false;
//     const TITLE_STYLE = { fontSize: '3rem', lineHeight: '1.2' }; 

//     const renderBookGrid = () => {
//         const isInitialLoad = isBooksPending && page === 1;

//         if (isInitialLoad) return <LoadingSpinner />;
//         if (isBooksError) return <ErrorDisplay message={booksError?.message || 'Gagal memuat daftar buku.'} />;
        
//         if (books.length === 0) {
//             return (
//                 <div className="flex flex-col items-center justify-center py-12 text-center">
//                     <p className="text-muted-foreground text-lg">Tidak ada buku ditemukan dengan filter ini.</p>
//                     {(selectedCategory !== null || selectedRating !== null) && (
//                         <Button 
//                             variant="link" 
//                             onClick={() => { setSelectedCategory(null); setSelectedRating(null); }}
//                             className="mt-2 text-primary"
//                         >
//                             Reset Filter
//                         </Button>
//                     )}
//                 </div>
//             );
//         }

//         return (
//             <div className="space-y-6">
//                 <div className={cn("grid gap-6 w-full", "grid-cols-2 lg:grid-cols-4")}>
//                     {books.map((book: BookItem) => ( 
//                         <BookCard key={book.id} book={book as unknown as Book} /> 
//                     ))}
//                 </div>
                
//                 <div className="flex justify-center pt-8">
//                     {hasMore && (
//                         <Button onClick={handleLoadMore} disabled={isFetching}>
//                             {isFetching ? 'Loading...' : 'Load More'}
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         );
//     }
    
//     // --- SIDEBAR FILTER ---
//     const renderFilters = () => (
//         <div className="w-full md:w-64 space-y-8 p-4 md:border-r border-gray-200 shrink-0">
            
//             {/* Filter by Category */}
//             <div className="space-y-3">
//                 <h2 className="font-bold text-lg text-left"> FILTER </h2>
//                 <h3 className="font-bold text-lg text-left"> Category</h3>
//                 <div className="space-y-2">
//                     {/* All Categories Option */}
//                     <Button
//                         variant="ghost"
//                         onClick={() => handleCategoryChange(null)}
//                         className="w-full justify-start gap-3 px-2 hover:bg-transparent group"
//                     >
//                         <div className={cn(
//                             "w-5 h-5 border rounded flex items-center justify-center shrink-0 transition-colors",
//                             selectedCategory === null 
//                                 ? "bg-[#1C65DA] border-[#1C65DA]" 
//                                 : "border-gray-300 bg-white"
//                         )}>
//                             {selectedCategory === null && (
//                                 <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                                 </svg>
//                             )}
//                         </div>
//                         <span className={cn("text-sm", selectedCategory === null ? "font-medium text-foreground" : "text-muted-foreground")}>
//                             All Categories
//                         </span>
//                     </Button>

//                     {isCategoriesPending ? (
//                         <p className="text-sm text-muted-foreground pl-8">Loading categories...</p>
//                     ) : (
//                         categoriesData?.categories?.map(cat => (
//                             <Button
//                                 key={cat.id}
//                                 variant="ghost"
//                                 onClick={() => handleCategoryChange(cat.id)}
//                                 className="w-full justify-start gap-3 px-2 hover:bg-transparent group"
//                             >
//                                 <div className={cn(
//                                     "w-5 h-5 border rounded flex items-center justify-center shrink-0 transition-colors",
//                                     selectedCategory === cat.id 
//                                         ? "bg-[#1C65DA] border-[#1C65DA]" 
//                                         : "border-gray-300 bg-white"
//                                 )}>
//                                     {selectedCategory === cat.id && (
//                                         <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                             <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                                         </svg>
//                                     )}
//                                 </div>
//                                 <span className={cn("text-sm truncate", selectedCategory === cat.id ? "font-medium text-foreground" : "text-muted-foreground")}>
//                                     {cat.name}
//                                 </span>
//                             </Button>
//                         ))
//                     )}
//                 </div>
//             </div>

//             {/* Filter by Rating */}
//             <div className="space-y-3">
//                 <h3 className="font-bold text-lg text-left">Rating</h3>
//                 <div className="space-y-2">
//                      {/* Any Rating Option */}
//                      <Button
//                         variant="ghost"
//                         onClick={() => handleRatingChange(null)}
//                         className="w-full justify-start gap-3 px-2 hover:bg-transparent group"
//                     >
//                         <div className={cn(
//                             "w-5 h-5 border rounded flex items-center justify-center shrink-0 transition-colors",
//                             selectedRating === null 
//                                 ? "bg-[#1C65DA] border-[#1C65DA]" 
//                                 : "border-gray-300 bg-white"
//                         )}>
//                             {selectedRating === null && (
//                                 <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                                 </svg>
//                             )}
//                         </div>
//                         <span className={cn("text-sm", selectedRating === null ? "font-medium text-foreground" : "text-muted-foreground")}>
//                             Any Rating
//                         </span>
//                     </Button>

//                     {RATING_OPTIONS.map(rating => (
//                         <Button
//                             key={rating}
//                             variant="ghost"
//                             onClick={() => handleRatingChange(rating)}
//                             className="w-full justify-start gap-3 px-2 hover:bg-transparent group"
//                         >
//                             <div className={cn(
//                                 "w-5 h-5 border rounded flex items-center justify-center shrink-0 transition-colors",
//                                 selectedRating === rating 
//                                     ? "bg-[#1C65DA] border-[#1C65DA]" 
//                                     : "border-gray-300 bg-white"
//                             )}>
//                                 {selectedRating === rating && (
//                                     <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                         <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                                     </svg>
//                                 )}
//                             </div>
                            
//                             {/* REVISI TAMPILAN BINTANG: Single Yellow Star + Angka Rating */}
//                             <div className="flex items-center gap-2">
//                                 <Star 
//                                     className="w-4 h-4 fill-yellow-500 text-yellow-500" 
//                                     fill="currentColor"
//                                 />
//                                 <span className={cn("text-sm", selectedRating === rating ? "font-medium text-foreground" : "text-muted-foreground")}>
//                                     {rating}
//                                 </span>
//                             </div>
//                         </Button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <div className="space-y-8">
//             <h1 className="font-extrabold text-[#0A0D12] text-left" style={TITLE_STYLE}>
//                 Book List
//             </h1>
//             <div className="flex flex-col md:flex-row">
//                 {renderFilters()}
//                 <div className="flex-1 p-4">
//                     {renderBookGrid()}
//                 </div>
//             </div>
//         </div>
//     );
// }


// src/pages/Category.tsx

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
import { useAppSelector } from '@/store/hooks';
import { selectFilters } from '@/store/slices/uiSlice';

// --- TIPE DATA ---
interface RawBookItem {
    id: number;
    title: string;
    description: string;
    isbn: string;
    publishedYear: number;
    coverImage: string | null;
    price: number;
    stock: number;
    isActive: boolean;
    rating: number;
    reviewCount: number;
    availableCopies: number;
    totalCopies: number;
    Author: {
        id: number;
        name: string;
        bio?: string;
    };
    Category: {
        id: number;
        name: string;
    };
}

interface BookItem extends Omit<Book, 'id'> {
    id: string; 
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

// --- COMPONENTS ---
const LoadingSpinner = () => <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;
const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
);

const RATING_OPTIONS = [5, 4, 3, 2, 1];

export default function CategoryPage() {
    const [searchParams] = useSearchParams();
    const { searchTerm } = useAppSelector(selectFilters); 
    
    // State untuk Debounce Search Term
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    const initialCategoryId = searchParams.get('categoryId');

    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        initialCategoryId ? parseInt(initialCategoryId) : null
    );
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [allBooks, setAllBooks] = useState<BookItem[]>([]); 
    const [page, setPage] = useState(1);
    const LIMIT = 8; 

    // EFFECT: Debounce Search Term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // Tunggu 500ms setelah user berhenti mengetik

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // 1. Fetch Categories
    const { data: categoriesData, isPending: isCategoriesPending } = useQuery<CategoriesResponseWrapper, Error>({
        queryKey: ['booklist-categories'],
        queryFn: async () => {
            const res = await apiClient.get('/categories');
            return res.data.data;
        },
    });

    // 2. Fetch Books
    const { data: booksResponse, isPending: isBooksPending, isError: isBooksError, error: booksError, isFetching } = useQuery<BooksResponse, Error>({
        // Gunakan debouncedSearchTerm di sini, bukan searchTerm langsung
        queryKey: ['booklist-books', selectedCategory, selectedRating, page, debouncedSearchTerm],
        queryFn: async () => {
            const params: Record<string, string | number> = {
                page: page,
                limit: LIMIT
            };
            
            if (selectedCategory !== null) {
                params.categoryId = selectedCategory;
            }
            
            // PERBAIKAN: Gunakan 'q' sesuai spesifikasi API, bukan 'title'
            if (debouncedSearchTerm) {
                params.q = debouncedSearchTerm; 
            }

            const res = await apiClient.get('/books', { params });
            const apiData = res.data.data;

            // Mapping Data
            let mappedBooks: BookItem[] = apiData.books.map((b: RawBookItem) => ({
                id: b.id.toString(),
                title: b.title,
                author: b.Author,
                category: b.Category,
                coverImage: b.coverImage,
                stock: b.stock,
                availableCopies: b.availableCopies,
                rating: b.rating,
            }));

            // === CLIENT-SIDE FILTERING UNTUK RATING (RANGE LOGIC) ===
            if (selectedRating !== null) {
                mappedBooks = mappedBooks.filter(book => {
                    if (selectedRating === 5) {
                        return book.rating === 5;
                    }
                    return book.rating >= selectedRating && book.rating < (selectedRating + 1);
                });
            }

            return {
                books: mappedBooks,
                pagination: apiData.pagination
            };
        },
    });
    
    // Accumulation Logic
    useEffect(() => {
        if (booksResponse?.books) {
            setAllBooks(prevBooks => { 
                const newBooks = booksResponse.books;
                const currentPage = booksResponse.pagination.page;

                if (currentPage === 1) {
                    return newBooks;
                } 
                
                const existingIds = new Set(prevBooks.map(b => b.id));
                const uniqueNewBooks = newBooks.filter(b => !existingIds.has(b.id));

                return [...prevBooks, ...uniqueNewBooks];
            });
        }
    }, [booksResponse]); 
    
    // Reset page on filter change
    useEffect(() => {
        if (page !== 1) {
            setPage(1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, selectedCategory, selectedRating]); // Gunakan debouncedSearchTerm


    // Handlers
    const handleCategoryChange = (id: number | null) => {
        if (selectedCategory !== id) {
            setPage(1); 
            setSelectedCategory(id); 
        }
    };

    const handleRatingChange = (rating: number | null) => {
        if (selectedRating === rating) {
            setSelectedRating(null);
        } else {
            setPage(1); 
            setSelectedRating(rating); 
        }
    };

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    // Render Logic
    const books = allBooks;
    const pagination = booksResponse?.pagination;
    const hasMore = pagination ? pagination.page < pagination.totalPages : false;
    const TITLE_STYLE = { fontSize: '2.5rem', lineHeight: '1.2' }; 

    const renderBookGrid = () => {
        const isInitialLoad = isBooksPending && page === 1;

        if (isInitialLoad) return <LoadingSpinner />;
        if (isBooksError) return <ErrorDisplay message={booksError?.message || 'Gagal memuat daftar buku.'} />;
        
        if (books.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground text-lg">Tidak ada buku ditemukan dengan filter ini.</p>
                    {(selectedCategory !== null || selectedRating !== null || searchTerm) && (
                        <Button 
                            variant="link" 
                            onClick={() => { setSelectedCategory(null); setSelectedRating(null); }}
                            className="mt-2 text-primary"
                        >
                            Reset Filter
                        </Button>
                    )}
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className={cn("grid gap-6 w-full", "grid-cols-2 lg:grid-cols-4")}>
                    {books.map((book: BookItem) => ( 
                        <BookCard key={book.id} book={book as unknown as Book} /> 
                    ))}
                </div>
                
                <div className="flex justify-center pt-8">
                    {hasMore && (
                        <Button onClick={handleLoadMore} disabled={isFetching}>
                            {isFetching ? 'Loading...' : 'Load More'}
                        </Button>
                    )}
                </div>
            </div>
        );
    }
    
    // --- SIDEBAR FILTER ---
    const renderFilters = () => (
        <div className="w-full md:w-64 space-y-8 p-4 md:border rounded-xl md:h-full border-gray-200  shrink-0">
            <h2 className="font-bold text-lg text-foreground text-left">FILTER </h2>

            {/* Filter by Category */}
            <div className="space-y-3 border-b pb-4">
                <h3 className="font-bold text-lg text-foreground text-left ">Category</h3>
                <div className="space-y-2">
                    {/* All Categories Option */}
                    <Button
                        variant="ghost"
                        onClick={() => handleCategoryChange(null)}
                        className="w-full justify-start gap-3 px-2 hover:bg-transparent group"
                    >
                        <div className={cn(
                            "w-5 h-5 border rounded flex items-center justify-center shrink-0 transition-colors",
                            selectedCategory === null 
                                ? "bg-[#1C65DA] border-[#1C65DA]" 
                                : "border-gray-300 bg-white"
                        )}>
                            {selectedCategory === null && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </div>
                        <span className={cn("text-sm", selectedCategory === null ? "font-medium text-foreground" : "text-muted-foreground")}>
                            All Categories
                        </span>
                    </Button>

                    {isCategoriesPending ? (
                        <p className="text-sm text-muted-foreground pl-8">Loading categories...</p>
                    ) : (
                        categoriesData?.categories?.map(cat => (
                            <Button
                                key={cat.id}
                                variant="ghost"
                                onClick={() => handleCategoryChange(cat.id)}
                                className="w-full justify-start gap-3 px-2 hover:bg-transparent group"
                            >
                                <div className={cn(
                                    "w-5 h-5 border rounded flex items-center justify-center shrink-0 transition-colors",
                                    selectedCategory === cat.id 
                                        ? "bg-[#1C65DA] border-[#1C65DA]" 
                                        : "border-gray-300 bg-white"
                                )}>
                                    {selectedCategory === cat.id && (
                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </div>
                                <span className={cn("text-sm truncate", selectedCategory === cat.id ? "font-medium text-foreground" : "text-muted-foreground")}>
                                    {cat.name}
                                </span>
                            </Button>
                        ))
                    )}
                </div>
            </div>

            {/* Filter by Rating */}
            <div className="space-y-3">
                <h3 className="font-bold text-lg text-foreground text-left">Rating</h3>
                <div className="space-y-2">
                     {/* Any Rating Option */}
                     <Button
                        variant="ghost"
                        onClick={() => handleRatingChange(null)}
                        className="w-full justify-start gap-3 px-2 hover:bg-transparent group"
                    >
                        <div className={cn(
                            "w-5 h-5 border rounded flex items-center justify-center shrink-0 transition-colors",
                            selectedRating === null 
                                ? "bg-[#1C65DA] border-[#1C65DA]" 
                                : "border-gray-300 bg-white"
                        )}>
                            {selectedRating === null && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </div>
                        <span className={cn("text-sm", selectedRating === null ? "font-medium text-foreground" : "text-muted-foreground")}>
                            Any Rating
                        </span>
                    </Button>

                    {RATING_OPTIONS.map(rating => (
                        <Button
                            key={rating}
                            variant="ghost"
                            onClick={() => handleRatingChange(rating)}
                            className="w-full justify-start gap-3 px-2 hover:bg-transparent group"
                        >
                            <div className={cn(
                                "w-5 h-5 border rounded flex items-center justify-center shrink-0 transition-colors",
                                selectedRating === rating 
                                    ? "bg-[#1C65DA] border-[#1C65DA]" 
                                    : "border-gray-300 bg-white"
                            )}>
                                {selectedRating === rating && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                     {/* REVISI: Single Yellow Star untuk setiap opsi */}
                                     <Star 
                                        className="w-4 h-4 fill-yellow-500 text-yellow-500" 
                                        fill="currentColor"
                                    />
                                </div>
                                <span className={cn("text-sm", selectedRating === rating ? "font-medium text-foreground" : "text-muted-foreground")}>
                                    {rating}
                                </span>
                            </div>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h1 className="font-bold text-[#0A0D12] text-left" style={TITLE_STYLE}>
                Book List
            </h1>
            <div className="flex flex-col md:flex-row">
                {renderFilters()}
                <div className="flex-1 p-4">
                    {renderBookGrid()}
                </div>
            </div>
        </div>
    );
}