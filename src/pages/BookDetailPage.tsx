
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/api';
import { cn } from '@/lib/utils';
import type { Review } from '@/types'; 

// Komponen & UI
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert, Loader2, Star, Share2, FileText, Users, BookOpen } from 'lucide-react'; 

// --- TIPE DATA KHUSUS BOOK DETAIL (Diperbaiki untuk memproses data bersarang) ---
// Note: Kita menggunakan tipe flat di sini karena JSX di bawah mengharapkan string.
interface BookDetailApi {
    id: string; 
    title: string;
    description: string;
    coverImageUrl: string | null;
    
    // Fields yang sudah di-flatten
    category: string | null; 
    author: string;
    stock: number; // Mapped from availableCopies
    
    // Fields yang diambil langsung atau dimapping
    rating: number; 
    ratingCount: number; // Dari reviewCount API
    reviewCount: number; // Dari reviews.length atau reviewCount API
    pageCount: number; // Fallback
    reviews: Review[]; 
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

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // === FETCHING DATA BUKU ===
  const { data: book, isPending, isError, error } = useQuery<BookDetailApi, Error>({
    queryKey: ['book', id], 
    queryFn: async () => {
      const res = await apiClient.get(`/books/${id}`);
      const apiData = res.data.data;

      // === PERBAIKAN UTAMA: MAPPING DATA BERSARANG DAN KETERSEDIAAN STOK ===
      const mappedData: BookDetailApi = {
          id: apiData.id.toString(), // Pastikan ID adalah string jika digunakan di useParams/Link
          title: apiData.title,
          description: apiData.description,
          coverImageUrl: apiData.coverImage || null,
          
          // Mapping Data Bersarang
          category: apiData.category?.name || null,
          author: apiData.author?.name || 'Unknown Author',
          
          // Mapping Stok
          stock: apiData.availableCopies || 0, 
          
          // Data Langsung/Fallback
          rating: apiData.rating || 0,
          ratingCount: apiData.reviewCount || 0,
          reviewCount: apiData.reviews?.length || apiData.reviewCount || 0, 
          pageCount: apiData.pageCount || 350, // Anggap pageCount ada di API atau fallback
          reviews: apiData.reviews || [],
      };
      
      return mappedData;
    },
    enabled: !!id, 
  });

  // === MUTASI PINJAM (Borrow Book Logic) ===
  const { mutate: borrowBook, isPending: isBorrowing } = useMutation({
    mutationFn: () => apiClient.post(`/books/${id}/borrow`),
    
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['book', id] });
      const previousBook = queryClient.getQueryData<BookDetailApi>(['book', id]);

      if (previousBook && previousBook.stock > 0) {
        queryClient.setQueryData<BookDetailApi>(['book', id], {
          ...previousBook,
          stock: previousBook.stock - 1, 
        });
      }
      toast.info('Memproses Pinjaman...', { description: 'Stok diperbarui.' });
      return { previousBook };
    },

    onError: (err: ApiError, _variables, context) => {
        if (context?.previousBook) {
          queryClient.setQueryData(['book', id], context.previousBook);
        }
        toast.error('Pinjam Gagal', { 
            description: err.response?.data?.message || 'Stok mungkin habis atau Anda sudah meminjamnya.' 
        });
    },

    onSettled: () => {
       queryClient.invalidateQueries({ queryKey: ['book', id] });
       queryClient.invalidateQueries({ queryKey: ['my-loans'] }); 
    },
    
    onSuccess: () => {
       toast.success('Pinjam Berhasil!', { description: 'Buku telah ditambahkan ke "My Loans".' });
    }
  });

  // === RENDER LOGIC ===
  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorDisplay message={error.message || 'Gagal memuat detail buku.'} />;
  if (!book) return <p className="text-center">Buku tidak ditemukan.</p>;

  // --- STYLING CONSTANTS & SAFE ACCESS ---
  const TITLE_STYLE = { fontSize: '3.75rem', lineHeight: '1', letterSpacing: '-0.02em' }; 
  const CATEGORY_STYLE = { fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '-0.02em' }; 
  const AUTHOR_STYLE = { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em' }; 
  const BUTTON_COLOR = '#1C65DA';
  const BUTTON_OUTLINE = '#D5D7DA';
  const MAX_WIDTH_CONTAINER = 1200;
  
  // Safe access for category (FIXES: Cannot read properties of undefined)
  const safeCategory = book.category || 'Unknown Category';
  const categoryLink = `/books?category=${encodeURIComponent(safeCategory)}`; 

  return (
    <div className="space-y-10">
        
      {/* 1. Navigasi / Breadcrumbs */}
      <nav className="text-sm text-start text-muted-foreground">
        <Link to="/books" className="hover:underline">Home</Link>
        <span className="mx-2"> &gt; </span>
        <Link to={categoryLink} className="hover:underline">{safeCategory}</Link>
        <span className="mx-2"> &gt; </span>
        <span className="text-foreground font-medium">{book.title}</span>
      </nav>

      {/* 2. Main Container (width: 1200; height: 498; gap: 36px;) */}
      <div 
        className="flex flex-col md:flex-row gap-9 justify-center mx-auto" 
        style={{ maxWidth: `${MAX_WIDTH_CONTAINER}px`, minHeight: '498px' }} 
      >
        {/* Kolom Kiri: Book Cover */}
        <div 
            className="shrink-0 p-2 flex items-center justify-center rounded-xl mx-auto md:mx-0"
            style={{ width: '337px', height: '498px', background: '#E9EAEB' }} 
        >
            {/* Menggunakan kondisional rendering untuk placeholder lokal */}
            {book.coverImageUrl ? (
                <img 
                    src={book.coverImageUrl}
                    alt={`Cover ${book.title}`}
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

        {/* Kolom Kanan: Details */}
        <div className="grow max-w-full text-left md:max-w-[760px]  space-y-4">
            
            {/* a. Book Category Name */}
            <p className="font-bold  text-[#0A0D12]" style={CATEGORY_STYLE}>
                {safeCategory.toUpperCase()}
            </p>
            
            {/* b. Book Title */}
            <h1 className="font-bold text-[#0A0D12]" style={TITLE_STYLE}>
                {book.title}
            </h1>

            {/* c. Book Author */}
            <p className="font-semibold text-gray-700" style={AUTHOR_STYLE}>
                Oleh {book.author}
            </p>

            {/* d. Single Star icon + Book rating */}
            <StarRating rating={book.rating} />

            {/* e. Number of page | Rating count | reviewCount */}
            <div className="flex space-x-6 text-muted-foreground text-sm font-medium pt-2">
                <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{book.pageCount} Page </span>
                </div>
                <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{book.ratingCount} Pengguna</span>
                </div>
                <div className="flex items-center space-x-1">
                    <TriangleAlert className="w-4 h-4" />
                    <span>{book.reviewCount} Review</span>
                </div>
            </div>

            <hr className="my-4 border-gray-200" />
            
            {/* f. text "coverImage" (Diinterpretasikan sebagai sub-judul deskripsi) */}
            <p className="font-bold text-lg">Description</p>
            
            {/* g. Book Description */}
            <p className="text-base leading-relaxed text-gray-700">
                {book.description}
            </p>

            {/* h. Action Buttons */}
            <div className="flex items-center space-x-4 pt-6">
                
                {/* Add to Cart Button (Outline: #D5D7DA) */}
                <Button 
                    variant="outline"
                    className="h-12 rounded-full font-semibold"
                    style={{ width: '200px', borderColor: BUTTON_OUTLINE, padding: '8px' }}
                    disabled={book.stock <= 0}
                >
                    Add to Cart
                </Button>



                {/* Borrow Book Button (Primary: #1C65DA) */}
                <Button 
                    onClick={() => borrowBook()}
                    disabled={isBorrowing || book.stock <= 0}
                    className="h-12 rounded-full font-semibold"
                    style={{ width: '200px', background: BUTTON_COLOR, padding: '8px' }}
                >
                    {isBorrowing ? 'Memproses...' : (book.stock > 0 ? 'Borrow Book' : 'Stok Habis')}
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
      
      <div className="mt-10 pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold">Ulasan Pembaca</h2>
        <p className="text-muted-foreground pt-4">Tinjauan dan formulir ulasan akan ditampilkan di sini.</p>
      </div>

    </div>
  );
}