
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/api';
import { cn } from '@/lib/utils';
import type { Book, Review } from '@/types'; // FIX: Menambahkan import 'Book'
import dayjs from 'dayjs'; 

// Komponen & UI
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert, Loader2, Star, Share2, FileText, Users, BookOpen } from 'lucide-react'; 
import { BookCard } from '@/components/features/BookCard'; 

// --- TIPE DATA KHUSUS BOOK DETAIL ---
interface BookDetailApi {
    id: string; 
    title: string;
    description: string;
    coverImageUrl: string | null;
    category: string | null; 
    author: string;
    stock: number; // Mapped from availableCopies
    rating: number; 
    ratingCount: number; // Dari reviewCount API
    reviewCount: number; // Dari reviews.length atau reviewCount API
    pageCount: number; 
    reviews: Review[]; 
}

// Tipe Data untuk API Ulasan
interface ReviewItem {
    id: number;
    star: number;
    comment: string;
    createdAt: string;
    user: {
        id: number;
        name: string;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface ReviewResponse {
    bookId: number;
    reviews: ReviewItem[];
    pagination: Pagination;
}

// Tipe Data untuk API Buku Terkait
interface RelatedBooksResponse {
    books: Book[];
    categories: string[];
}

// --- PLACEHOLDERS ---
const LoadingSpinner = () => <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;
const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
);

// Tipe untuk error API
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Komponen Pembantu: Single Star Rating
const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center space-x-1">
        <Star className={cn("w-5 h-5", rating > 0 ? "fill-yellow-500 text-yellow-500" : "text-gray-300")} fill={rating > 0 ? "currentColor" : "none"} />
        <span className="font-semibold text-lg text-foreground">
            {rating !== null ? rating.toFixed(1) : 'N/A'}/5
        </span>
    </div>
);

// Komponen Pembantu: 5 Star Rating untuk Review Card
const FiveStarRating = ({ stars }: { stars: number }) => (
    <div className="flex space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("w-4 h-4", i < stars ? "fill-yellow-500 text-yellow-500" : "text-gray-300")} fill={i < stars ? "currentColor" : "none"} />
        ))}
    </div>
);

// Komponen Pembantu: Review Card
const ReviewCard = ({ review }: { review: ReviewItem }) => {
    const BUTTON_OUTLINE = '#D5D7DA';
    
    // Styling review card: width: 590; height: 204; border-radius: 16px; padding: 16px;
    return (
        <Card className="flex flex-col h-full text-start p-4 space-y-4 shadow-sm" 
              style={{ width: '590px', borderRadius: '16px' }}>
            
            {/* Reviewer Info: image + name + date */}
            <CardHeader className="p-0 flex flex-row items-center justify-between border-b pb-3" style={{borderColor: BUTTON_OUTLINE}}>
                <div className="flex items-center space-x-3">
                    {/* Reviewer Image Placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm">
                        {review.user.name[0]?.toUpperCase() || 'U'}
                    </div>
                    {/* Reviewer Name */}
                    <span className="font-bold text-base">{review.user.name}</span>
                </div>
                {/* Date */}
                <span className="text-sm text-muted-foreground">
                    {dayjs(review.createdAt).format('DD MMM YYYY')}
                </span>
            </CardHeader>

            {/* 5 Star Rating */}
            <FiveStarRating stars={review.star} />

            {/* Review Comment */}
            <CardContent className="p-0 overflow-y-auto">
                <p className="text-gray-700 leading-relaxed text-sm">
                    {review.comment}
                </p>
            </CardContent>
        </Card>
    );
};

// Komponen Utama
export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = id!;
  const queryClient = useQueryClient();
  
  // State untuk akumulasi review
  const [allReviews, setAllReviews] = useState<ReviewItem[]>([]);
  // State untuk pagination review
  const [reviewPage, setReviewPage] = useState(1);
  const REVIEW_LIMIT = 6; 

  // === FETCHING DATA BUKU DETAIL ===
  const { data: bookDetail, isPending: isDetailPending, isError: isDetailError, error: detailError } = useQuery<BookDetailApi, Error>({
    queryKey: ['book-detail', bookId], 
    queryFn: async () => {
      const res = await apiClient.get(`/books/${bookId}`);
      const apiData = res.data.data;

      // Mapping Data Bersarang dan Fallback
      const mappedData: BookDetailApi = {
          id: apiData.id.toString(), 
          title: apiData.title,
          description: apiData.description,
          coverImageUrl: apiData.coverImage || null,
          category: apiData.category?.name || null,
          author: apiData.author?.name || 'Unknown Author',
          stock: apiData.availableCopies || 0, 
          rating: apiData.rating || 0,
          ratingCount: apiData.reviewCount || 0,
          reviewCount: apiData.reviews?.length || apiData.reviewCount || 0, 
          pageCount: apiData.pageCount || 350,
          reviews: apiData.reviews || [],
      };
      
      return mappedData;
    },
    enabled: !!bookId, 
  });
  
  // Mengakses kategori dengan aman untuk query buku terkait
  const safeCategory = bookDetail?.category || 'Unknown Category';
  
  // === FETCHING RELATED BOOKS ===
  const { data: relatedData, isPending: isRelatedPending, isError: isRelatedError } = useQuery<RelatedBooksResponse, Error>({
    queryKey: ['related-books', safeCategory],
    queryFn: async () => {
        // Jangan fetch jika kategori belum dimuat atau null
        if (!safeCategory || safeCategory === 'Unknown Category') return { books: [], categories: [] };

        const res = await apiClient.get('/books', { 
            params: { 
                category: safeCategory,
                limit: 10 // Fetch enough to display the grid (5 columns * 2 rows max)
            } 
        });
        return res.data;
    },
    // Hanya jalankan jika detail buku dimuat dan kategori aman
    enabled: !!bookDetail && !!safeCategory && safeCategory !== 'Unknown Category',
  });
  
  // FIX: Menambahkan optional chaining (?. ) setelah relatedData?.books
  const relatedBooks = relatedData?.books?.filter(b => b.id !== bookId) || [];

  // === FETCHING DATA REVIEWS DENGAN PAGINATION ===
  const { data: reviewsResponse, isFetching: isReviewsFetching, isFetched: isReviewsFetched } = useQuery<ReviewResponse, Error>({
    queryKey: ['book-reviews', bookId, reviewPage],
    queryFn: async () => {
        const res = await apiClient.get(`/reviews/book/${bookId}?page=${reviewPage}&limit=${REVIEW_LIMIT}`);
        return res.data.data;
    },
    enabled: !!bookId,
  });
  
  // Manual accumulation logic
  useEffect(() => {
    if (reviewsResponse) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAllReviews(prevReviews => {
            const newReviews = reviewsResponse.reviews;
            
            // Check against the page number in the response data itself
            if (reviewsResponse.pagination.page === 1) {
                // If page is 1, replace with the new list
                return newReviews;
            }
            
            // For subsequent pages, append new reviews
            // FIX: Ensure new reviews don't duplicate existing ones implicitly
            const existingReviewIds = new Set(prevReviews.map(r => r.id));
            const uniqueNewReviews = newReviews.filter(r => !existingReviewIds.has(r.id));

            return [...prevReviews, ...uniqueNewReviews];
        });
    }
  }, [reviewsResponse]); 
  
  // Access pagination info
  const pagination = reviewsResponse?.pagination;
  const totalReviews = pagination?.total || 0;
  const reviewsShown = allReviews.length; 
  const hasMoreReviews = reviewsShown < totalReviews;
  
  const handleLoadMore = () => {
      setReviewPage(prev => prev + 1);
  };
  
  const averageRating = bookDetail?.rating || 0;
  const totalReviewCount = totalReviews;


  // === MUTASI PINJAM (Borrow Book Logic) ===
  const { mutate: borrowBook, isPending: isBorrowing } = useMutation({
    mutationFn: () => apiClient.post(`/books/${bookId}/borrow`),
    
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['book-detail', bookId] });
      const previousBook = queryClient.getQueryData<BookDetailApi>(['book-detail', bookId]);

      if (previousBook && previousBook.stock > 0) {
        queryClient.setQueryData<BookDetailApi>(['book-detail', bookId], {
          ...previousBook,
          stock: previousBook.stock - 1, 
        });
      }
      toast.info('Memproses Pinjaman...', { description: 'Stok diperbarui.' });
      return { previousBook };
    },

    onError: (err: ApiError, _variables, context) => {
        if (context?.previousBook) {
          queryClient.setQueryData(['book-detail', bookId], context.previousBook);
        }
        toast.error('Pinjam Gagal', { 
            description: err.response?.data?.message || 'Stok mungkin habis atau Anda sudah meminjamkannya.' 
        });
    },

    onSettled: () => {
       queryClient.invalidateQueries({ queryKey: ['book-detail', bookId] });
       queryClient.invalidateQueries({ queryKey: ['my-loans'] }); 
    },
    
    onSuccess: () => {
       toast.success('Pinjam Berhasil!', { description: 'Buku telah ditambahkan ke "My Loans".' });
    }
  });

  // === RENDER LOGIC ===
  if (isDetailPending) return <LoadingSpinner />;
  if (isDetailError) return <ErrorDisplay message={detailError?.message || 'Gagal memuat detail buku.'} />;
  if (!bookDetail) return <p className="text-center">Buku tidak ditemukan.</p>;

  // --- STYLING CONSTANTS & SAFE ACCESS ---
  const TITLE_STYLE = { fontSize: '3.75rem', lineHeight: '1', letterSpacing: '-0.02em' }; 
  const CATEGORY_STYLE = { fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '-0.02em' }; 
  const AUTHOR_STYLE = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 
  const BUTTON_COLOR = '#1C65DA';
  const BUTTON_OUTLINE = '#D5D7DA';
  const MAX_WIDTH_CONTAINER = 1200;
  
  const categoryLink = `/books?category=${encodeURIComponent(safeCategory)}`; 

  return (
    <div className="space-y-10">
        
      {/* Breadcrumbs */}
      <nav className="text-sm text-start text-muted-foreground">
        <Link to="/books" className="hover:underline">Home</Link>
        <span className="mx-2"> &gt; </span>
        <Link to={categoryLink} className="hover:underline">{safeCategory}</Link>
        <span className="mx-2"> &gt; </span>
        <span className="text-foreground font-medium">{bookDetail.title}</span>
      </nav>

      {/* Main Detail Container */}
      <div 
        className="flex flex-col lg:flex-row gap-9 justify-center mx-auto" 
        style={{ maxWidth: `${MAX_WIDTH_CONTAINER}px`, minHeight: '498px' }} 
      >
        {/* Kolom Kiri: Book Cover */}
        <div 
            className="shrink-0 p-2 flex items-center justify-center rounded-xl mx-auto lg:mx-0"
            style={{ width: '337px', height: '498px', background: '#E9EAEB' }} 
        >
            {/* Menggunakan kondisional rendering untuk placeholder lokal */}
            {bookDetail.coverImageUrl ? (
                <img 
                    src={bookDetail.coverImageUrl}
                    alt={`Cover ${bookDetail.title}`}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    style={{ width: '321px', height: '482px' }} 
                />
            ) : (
                 <div 
                    className="flex items-center justify-center bg-gray-300 rounded-lg"
                    style={{ width: '321px', height: '482px' }} 
                >
                    <BookOpen className="w-24 h-24 text-gray-500" />
                </div>
            )}
        </div>

        {/* Kolom Kanan: Details - Ditambahkan text-left untuk memastikan rapat kiri */}
        <div className="grow max-w-full lg:max-w-[760px] space-y-4 text-left">
            
            {/* a. Book Category Name */}
            <p className="font-bold text-[#0A0D12]" style={CATEGORY_STYLE}>
                {safeCategory.toUpperCase()}
            </p>
            
            {/* b. Book Title */}
            <h1 className="font-bold text-[#0A0D12]" style={TITLE_STYLE}>
                {bookDetail.title}
            </h1>

            {/* c. Book Author */}
            <p className="font-semibold text-gray-700" style={AUTHOR_STYLE}>
                Oleh {bookDetail.author}
            </p>

            {/* d. Single Star icon + Book rating */}
            <StarRating rating={bookDetail.rating} />

            {/* e. Number of page | Rating count | reviewCount */}
            <div className="flex space-x-6 text-muted-foreground text-sm font-medium pt-2">
                <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{bookDetail.pageCount} Halaman</span>
                </div>
                <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{bookDetail.ratingCount} Pengguna</span>
                </div>
                <div className="flex items-center space-x-1">
                    <TriangleAlert className="w-4 h-4" />
                    <span>{bookDetail.reviewCount} Review</span>
                </div>
            </div>

            <hr className="my-4 border-gray-200" />
            
            {/* f. text "coverImage" (Diinterpretasikan sebagai sub-judul deskripsi) */}
            <p className="font-bold text-lg">Deskripsi Buku</p>
            
            {/* g. Book Description */}
            <p className="text-base leading-relaxed text-gray-700">
                {bookDetail.description}
            </p>

            {/* h. Action Buttons */}
            <div className="flex items-center space-x-4 pt-6">
                
                {/* Borrow Book Button (Primary: #1C65DA) */}
                <Button 
                    onClick={() => borrowBook()}
                    disabled={isBorrowing || bookDetail.stock <= 0}
                    className="h-12 rounded-full font-semibold"
                    style={{ width: '200px', background: BUTTON_COLOR, padding: '8px' }}
                >
                    {isBorrowing ? 'Memproses...' : (bookDetail.stock > 0 ? 'Borrow Book' : 'Stok Habis')}
                </Button>
                
                {/* Add to Cart Button (Outline: #D5D7DA) */}
                <Button 
                    variant="outline"
                    className="h-12 rounded-full font-semibold"
                    style={{ width: '200px', borderColor: BUTTON_OUTLINE, padding: '8px' }}
                    disabled={bookDetail.stock <= 0}
                >
                    Add to Cart
                </Button>
                
                {/* Share Icon Button */}
                <Button 
                    variant="outline"
                    className="rounded-full flex items-center justify-center p-0"
                    style={{ width: '44px', height: '44px', borderColor: BUTTON_OUTLINE, padding: '12px 16px' }} 
                >
                    <Share2 className="w-5 h-5" />
                </Button>
                
                
            </div>
        </div>
      </div>
      
      {/* Review Section */}
      <div className="space-y-6 pt-10">
        
        {/* 1. Garis pembatas horizontal */}
        <hr className="border border-gray-300" style={{ borderColor: BUTTON_OUTLINE }} />
        
        {/* a. Text: Review + b. Single star + rating + (jumlah review) */}
        <div className="flex text-start items-center h-full gap-4">
            <h2 className="text-3xl font-bold">Review</h2>
            <StarRating rating={averageRating} />
            <span className="text-xl text-muted-foreground">
                ({totalReviewCount} Reviews)
            </span>
        </div>
        
        {/* c. Review Grid (2 kolom, 3 baris) */}
        <div className="grid grid-cols-1 gap-6 h-full md:grid-cols-2">
            {isReviewsFetching && reviewPage === 1 && !isReviewsFetched ? (
                // Skeleton loading untuk halaman pertama
                Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse p-4 rounded-xl bg-gray-100" style={{ height: '204px' }} />
                ))
            ) : totalReviewCount === 0 && !isReviewsFetching && isReviewsFetched ? (
                <p className="text-muted-foreground md:col-span-2">Belum ada ulasan untuk buku ini.</p>
            ) : (
                // Menampilkan Review Card
                allReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))
            )}
            
            {/* Tampilkan Loading lebih banyak review di grid */}
            {isReviewsFetching && reviewPage > 1 && (
                <div className="md:col-span-2 text-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </div>
            )}
        </div>
        
        {/* d. Button "Load More" */}
        {hasMoreReviews && (
            <div className="text-center pt-4">
                <Button 
                    onClick={handleLoadMore} 
                    disabled={isReviewsFetching}
                    variant="outline"
                    className="h-12 rounded-full font-semibold"
                    style={{ width: '200px', borderColor: BUTTON_OUTLINE, padding: '8px' }}
                >
                    {isReviewsFetching ? 'Loading...' : 'Load More'}
                </Button>
            </div>
        )}
      </div>

      {/* Related Books Section */}
      <div className="space-y-6 pt-10">
        
        {/* 1. Text: "Related Books" (Font size/display-lg ; bold) */}
        <h2 className="font-bold text-[#0A0D12] text-left" 
            style={{ fontSize: '2rem', lineHeight: '1.2' }}>
            Related Books
        </h2>

        {isRelatedPending && (
            <div className="text-center p-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                <p>Memuat buku terkait...</p>
            </div>
        )}

        {isRelatedError && (
            <ErrorDisplay message={`Gagal memuat buku terkait.`} />
        )}

        {/* 2. Grid berisi Book card */}
        {(!isRelatedPending && relatedBooks.length > 0) && (
            <div className={cn(
                "grid gap-6",
                // Desktop: 5 columns, Mobile: 2 columns
                "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" 
            )}>
                {relatedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        )}

        {(!isRelatedPending && relatedBooks.length === 0) && (
            <p className="text-muted-foreground">Tidak ada buku terkait dalam kategori ini.</p>
        )}
      </div>

    </div>
  );
}