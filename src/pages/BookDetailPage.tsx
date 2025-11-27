
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/api';
import { cn } from '@/lib/utils';
import type { Book } from '@/types'; 
import dayjs from 'dayjs'; 
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

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
    coverImage: string | null;
    category: string | null; 
    categoryId: number; // TAMBAHAN: Menyimpan ID Kategori untuk Related Books
    Author: string; 
    stock: number; 
    rating: number; 
    ratingCount: number; 
    reviewCount: number; 
    pageCount: number; 
    reviews: ReviewItem[]; 
}

// Tipe Data untuk API Ulasan
interface ReviewItem {
    id: number;
    star: number;
    comment: string;
    createdAt: string;
    User: { 
        id: number;
        name: string;
    };
}

// Tipe untuk error API
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

// --- PLACEHOLDERS ---
const LoadingSpinner = () => <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;
const ErrorDisplay = ({ message }: { message: string }) => (
    <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
);

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
    
    return (
        <Card className="flex flex-col h-full text-start p-4 space-y-4 shadow-sm" 
              style={{ width: '590px', borderRadius: '16px' }}>
            
            <CardHeader className="p-0 flex flex-row items-center justify-between border-b pb-3" style={{borderColor: BUTTON_OUTLINE}}>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm">
                        {review.User.name[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="font-bold text-base">{review.User.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                    {dayjs(review.createdAt).format('DD MMM YYYY')}
                </span>
            </CardHeader>

            <FiveStarRating stars={review.star} />

            <CardContent className="p-0 overflow-y-auto">
                <p className="text-gray-700 leading-relaxed text-sm">
                    {review.comment}
                </p>
            </CardContent>
        </Card>
    );
};

// ------------------------------------------
// KOMPONEN UTAMA
// ------------------------------------------

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); 
  
  const bookId = Number(id); 
  const queryClient = useQueryClient();
  
  const REVIEW_LIMIT = 6; 

  // === FETCHING DATA BUKU DETAIL ===
  const { data: bookDetail, isPending: isDetailPending, isError: isDetailError, error: detailError } = useQuery<BookDetailApi, Error>({
    queryKey: ['book-detail', id], 
    queryFn: async () => {
      const res = await apiClient.get(`/books/${id}`);
      const apiData = res.data.data;

      const mappedData: BookDetailApi = {
          id: apiData.id.toString(), 
          title: apiData.title,
          description: apiData.description,
          coverImage: apiData.coverImage || null,
          category: apiData.Category?.name || null, 
          categoryId: apiData.categoryId || 0, // Simpan Category ID
          Author: apiData.Author?.name || 'Unknown Author', 
          stock: apiData.availableCopies || 0, 
          rating: apiData.rating || 0,
          ratingCount: apiData.reviewCount || 0,
          reviewCount: apiData.Review?.length || apiData.reviewCount || 0, 
          pageCount: apiData.pageCount || 350,
          reviews: apiData.Review || [], 
      };
      
      return mappedData;
    },
    enabled: !!id, 
  });
  
  // Ambil categoryId dari detail buku
  const categoryId = bookDetail?.categoryId;
  const categoryName = bookDetail?.category || 'Unknown Category';
  
  // === FETCHING RELATED BOOKS (BY CATEGORY ID) ===
  const { data: relatedBooksData, isPending: isRelatedPending, isError: isRelatedError } = useQuery<Book[], Error>({
    queryKey: ['related-books', categoryId],
    queryFn: async () => {
        // Jangan fetch jika categoryId tidak valid
        if (!categoryId) return [];

        const res = await apiClient.get('/books', { 
            params: { 
                categoryId: categoryId, // Filter by Category ID
                limit: 10 
            } 
        });
        
        const apiBooks = res.data.data.books;

        // Mapping data API (Author, Category Capital) ke format UI (author, category lowercase)
        // agar kompatibel dengan komponen BookCard
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedRelatedBooks: Book[] = apiBooks.map((b: any) => ({
            id: b.id.toString(),
            title: b.title,
            author: b.Author,    // API return Author object
            category: b.Category,// API return Category object
            coverImage: b.coverImage,
            stock: b.stock,
            availableCopies: b.availableCopies,
            rating: b.rating
        }));

        return mappedRelatedBooks;
    },
    // Hanya jalankan jika detail buku sudah dimuat dan punya categoryId
    enabled: !!bookDetail && !!categoryId,
  });
  
  // Filter buku yang sedang ditampilkan agar tidak muncul di Related Books
  const relatedBooks = relatedBooksData?.filter(b => b.id !== id) || [];

  const reviewsToDisplay = bookDetail?.reviews || [];
  const reviewsLength = reviewsToDisplay.length;
  const averageRating = bookDetail?.rating || 0;
  const totalReviewCount = bookDetail?.reviewCount || 0; 
  
  // === HANDLER TOMBOL BORROW ===
  const handleBorrowNow = () => {
    if (!bookDetail) return;

    const checkoutItem = {
        id: 0, 
        bookId: bookId,
        qty: 1,
        book: {
            id: bookId,
            title: bookDetail.title,
            coverImage: bookDetail.coverImage,
            author: { name: bookDetail.Author },
            category: { name: bookDetail.category || 'Uncategorized' }
        }
    };

    navigate('/checkout', { state: { checkoutItems: [checkoutItem] } });
  };

  // === MUTASI ADD TO CART ===
  const { mutate: addToCart, isPending: isAddingToCart } = useMutation({
      mutationFn: () => apiClient.post(`/cart/items`, { 
          bookId: bookId, 
          qty: 1, 
      }),
      
      onMutate: () => {
          toast.info('Menambahkan ke keranjang...', { description: 'Memproses permintaan.' });
      },

      onError: (err: ApiError) => {
          toast.error('Gagal Menambah ke Keranjang', { 
              description: err.response?.data?.message || 'Terjadi kesalahan saat menambahkan buku ke keranjang.' 
          });
      },

      onSuccess: () => {
          toast.success('Add to cart successful', { description: 'Buku berhasil ditambahkan ke keranjang.' });
          queryClient.invalidateQueries({ queryKey: ['my-cart'] });
      },
  });


  // === RENDER LOGIC ===
  if (isDetailPending) return <LoadingSpinner />;
  if (isDetailError) return <ErrorDisplay message={detailError?.message || 'Gagal memuat detail buku.'} />;
  if (!bookDetail) return <p className="text-center">Buku tidak ditemukan.</p>;

  const TITLE_STYLE = { fontSize: '3.75rem', lineHeight: '1', letterSpacing: '-0.02em' }; 
  const CATEGORY_STYLE = { fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '-0.02em' }; 
  const AUTHOR_STYLE = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 
  const BUTTON_COLOR = '#1C65DA';
  const BUTTON_OUTLINE = '#D5D7DA';
  const MAX_WIDTH_CONTAINER = 1200;
  
  const categoryLink = `/books?categoryId=${bookDetail.categoryId}`; // Update link menggunakan ID

  return (
    <div className="space-y-10">
        
      {/* Breadcrumbs */}
      <nav className="text-sm text-start text-muted-foreground">
        <Link to="/books" className="hover:underline">Home</Link>
        <span className="mx-2"> &gt; </span>
        <Link to={categoryLink} className="hover:underline">{categoryName}</Link>
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
            {bookDetail.coverImage ? (
                <img 
                    src={bookDetail.coverImage}
                    alt={`Cover ${bookDetail.title}`}
                    className="w-full h-full object-cover rounded-lg"
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

        {/* Kolom Kanan: Details */}
        <div className="grow max-w-full lg:max-w-[760px] space-y-4 text-left">
            
            <p className="font-bold text-[#0A0D12]" style={CATEGORY_STYLE}>
                {categoryName.toUpperCase()}
            </p>
            
            <h1 className="font-bold text-[#0A0D12]" style={TITLE_STYLE}>
                {bookDetail.title}
            </h1>

            <p className="font-semibold text-gray-700" style={AUTHOR_STYLE}>
                Oleh {bookDetail.Author}
            </p>

            <StarRating rating={bookDetail.rating} />

            <div className="flex space-x-6 text-muted-foreground text-sm font-medium pt-2">
                <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{bookDetail.pageCount} Page</span>
                </div>
                <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{bookDetail.ratingCount} User</span>
                </div>
                <div className="flex items-center space-x-1">
                    <TriangleAlert className="w-4 h-4" />
                    <span>{bookDetail.reviewCount} Review</span>
                </div>
            </div>

            <hr className="my-4 border-gray-200" />
            
            <p className="font-bold text-lg">Description</p>
            
            <p className="text-base leading-relaxed text-gray-700">
                {bookDetail.description}
            </p>

            <div className="flex items-center space-x-4 pt-6">
                
                <Button 
                    onClick={handleBorrowNow} 
                    disabled={isAddingToCart || bookDetail.stock <= 0}
                    className="h-12 rounded-full font-semibold"
                    style={{ width: '200px', background: BUTTON_COLOR, padding: '8px' }}
                >
                    {bookDetail.stock > 0 ? 'Borrow Book' : 'Out of Stock'}
                </Button>
                
                <Button 
                    onClick={() => addToCart()} 
                    variant="outline"
                    className="h-12 rounded-full font-semibold"
                    style={{ width: '200px', borderColor: BUTTON_OUTLINE, padding: '8px' }}
                    disabled={isAddingToCart || bookDetail.stock <= 0} 
                >
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'} 
                </Button>
                
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
        <hr className="border border-gray-300" style={{ borderColor: BUTTON_OUTLINE }} />
        <div className="flex text-start items-center h-full gap-4">
            <h2 className="text-3xl font-bold">Review</h2>
            <StarRating rating={averageRating} />
            <span className="text-xl text-muted-foreground">
                ({totalReviewCount} Reviews)
            </span>
        </div>
        
        <div className="grid grid-cols-1 gap-6 h-full md:grid-cols-2">
            {reviewsLength === 0 ? (
                <p className="text-muted-foreground md:col-span-2">Belum ada ulasan untuk buku ini.</p>
            ) : (
                reviewsToDisplay.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))
            )}
            {reviewsLength > REVIEW_LIMIT && (
                <div className="md:col-span-2 text-center pt-4">
                    <p className="text-muted-foreground">Hanya menampilkan ulasan awal dari detail buku.</p>
                </div>
            )}
        </div>
      </div>

      {/* Related Books Section */}
      <div className="space-y-6 pt-10">
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

        {(!isRelatedPending && relatedBooks.length > 0) && (
            <div className={cn(
                "grid gap-6",
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