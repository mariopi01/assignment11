
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router-dom';
import apiClient from '@/api';
import dayjs from 'dayjs';
import { Loader2, Search, BookOpen, Star, TriangleAlert } from 'lucide-react';

// Komponen UI
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// --- TIPE DATA ---

// Tipe Data untuk Buku di dalam list Review (Minimal data)
interface ReviewBook {
  id: number;
  title: string;
  coverImage: string | null;
}

// Tipe Data Item Review
interface ReviewItem {
  id: number;
  star: number;
  comment: string;
  userId: number;
  bookId: number;
  createdAt: string;
  Book: ReviewBook;
}

// Response dari API Review List
interface ReviewsResponse {
  reviews: ReviewItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// --- TIPE DATA BARU UNTUK DETAIL BUKU (Author & Category) ---
interface BookDetailResponse {
  id: number;
  title: string;
  coverImage: string | null;
  Author: {
    id: number;
    name: string;
    bio: string;
  };
  Category: {
    id: number;
    name: string;
  };
}

// --- STYLING CONSTANTS ---
const TITLE_STYLE = { 
   
  fontWeight: 700, 
  fontSize: '1.875rem', // display-sm (~30px)
  lineHeight: '2.375rem', 
  letterSpacing: '-0.03em', 
  color: '#0A0D12' 
};

const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; 

// --- HELPER COMPONENTS ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <TriangleAlert className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

// Definisi Navigasi Tabs
const TABS = [
  { name: 'Profile', path: '/profile' },
  { name: 'Borrowed List', path: '/my-loans' },
  { name: 'Review', path: '/my-reviews' },
];

const NavigationBox = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    
    return (
      <div 
          
          className="flex items-center gap-1 md:gap-2 p-1 md:p-2 rounded-xl shrink-0 w-full max-w-[557px] mx-auto md:mx-0 overflow-hidden" 
          
                  style={{ height: '56px', background: '#F5F5F5' }}
      >
          {TABS.map((tab) => {
              const active = isActive(tab.path);
              return (
                  
                  <Link key={tab.name} to={tab.path} className="flex-1 min-w-0 h-full">
                      <Button
                          asChild
                          variant={active ? 'default' : 'ghost'}
                          className={cn(
                              "w-full h-full rounded-lg md:rounded-xl font-bold text-[#0A0D12]",
                              
                              // PERUBAHAN 4: Responsive Font Size
                              // text-xs (mobile) -> text-sm (tablet) -> text-base (desktop)
                              "text-xs sm:text-sm md:text-base",
                              
                              // Padding tombol responsif
                              "px-1 md:px-4",
                              
                              "hover:bg-white hover:text-[#0A0D12]",
                              active && "bg-white text-[#0A0D12] hover:bg-white",
                          )}
                          style={active ? SHADOW_STYLE : {}}
                      >
                          
                          <span className="truncate w-full text-center">
                              {tab.name}
                          </span>
                      </Button>
                  </Link>
              );
          })}
      </div>


    );
};

// Helper component for 5 star display
const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star 
                key={i} 
                className={cn("w-5 h-5", i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} 
                fill={i < rating ? "currentColor" : "none"} 
            />
        ))}
    </div>
);

export default function MyReviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // === 1. FETCH REVIEWS ===
  const { data, isPending, isError, error } = useQuery<ReviewsResponse, Error>({
    queryKey: ['my-reviews', page, debouncedSearch],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page,
        limit: LIMIT,
      };
      
      if (debouncedSearch) {
        params.search = debouncedSearch; 
      }

      const res = await apiClient.get('/me/reviews', { params });
      return res.data.data;
    },
  });

  const reviews = data?.reviews || [];

  // Filter Logic Client-side (Backup)
  const filteredReviews = reviews.filter(review => {
      return review.Book.title.toLowerCase().includes(debouncedSearch.toLowerCase());
  });

  // === 2. FETCH BOOK DETAILS (Author & Category) PARALEL ===
  // Ambil semua unique bookId dari list review
  const bookIds = useMemo(() => {
    return Array.from(new Set(filteredReviews.map((r) => r.bookId)));
  }, [filteredReviews]);

  // Fetch detail untuk setiap buku secara paralel menggunakan useQueries
  const bookDetailQueries = useQueries({
    queries: bookIds.map((id) => ({
      queryKey: ['book-detail', id],
      queryFn: async () => {
        const res = await apiClient.get(`/books/${id}`);
        return res.data.data as BookDetailResponse;
      },
      staleTime: 1000 * 60 * 10, // Cache data buku selama 10 menit agar tidak request berulang
      enabled: bookIds.length > 0,
    })),
  });

  // Buat Map untuk akses cepat data buku berdasarkan ID
  const bookDetailsMap = useMemo(() => {
    const map = new Map<number, BookDetailResponse>();
    bookDetailQueries.forEach((result) => {
      if (result.data) {
        map.set(result.data.id, result.data);
      }
    });
    return map;
  }, [bookDetailQueries]);


  return (
    <div className="flex flex-col justify-center space-y-8 min-h-screen pb-12">
      
      <NavigationBox />
      
      {/* 1. Text "Reviews" */}
      <h1 className="font-extrabold text-[#0A0D12] text-start" style={TITLE_STYLE}>
          Reviews
      </h1>
      
      {/* 3. Search Box */}
      <div className="relative" style={{ width: '544px', maxWidth: '100%' }}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input 
              type="text"
              placeholder="Search Reviews"
              className="pl-12 pr-4 h-12 rounded-full border-[#D5D7DA] bg-[#535862] bg-opacity-5 focus-visible:ring-blue-500 placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: '#FFFFFF' }} 
          />
      </div>

      {/* Content State */}
      {isPending ? (
          <LoadingSpinner />
      ) : isError ? (
          <ErrorDisplay message={error.message || "Gagal memuat ulasan."} />
      ) : filteredReviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Belum ada ulasan yang ditemukan.</p>
      ) : (
          /* 4. Review Cards List */
          <div className="flex flex-col gap-6 w-full ">
              {filteredReviews.map((review) => {
                  // Ambil detail buku dari Map
                  const detail = bookDetailsMap.get(review.bookId);
                  const categoryName = detail?.Category?.name || 'General';
                  const authorName = detail?.Author?.name || 'Unknown Author';
                  // Gunakan cover dari detail jika ada, fallback ke review list cover, lalu ke placeholder
                  const coverImage = detail?.coverImage || review.Book.coverImage;

                  return (
                    <Card 
                        key={review.id} 
                        className="flex flex-col p-5 gap-5 rounded-2xl border border-[#D5D7DA] bg-white shadow-sm"
                        style={{ borderRadius: '16px', padding: '20px', gap: '20px' }}
                    >
                        {/* Header: Date */}
                        <div className="text-sm text-[#535862] text-start font-medium">
                            {dayjs(review.createdAt).format('D MMMM YYYY, HH:mm')}
                        </div>

                        {/* Divider Line */}
                        <hr className="border-t border-[#D5D7DA]" />

                        {/* Book Info Section */}
                        <div className="flex flex-row gap-6">
                            {/* Column 1: Cover Image */}
                            <div className="shrink-0 w-[92px] h-[138px] bg-gray-200 rounded-md overflow-hidden shadow-sm flex items-center justify-center">
                                {coverImage ? (
                                    <img 
                                        src={coverImage} 
                                        alt={review.Book.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <BookOpen className="w-8 h-8 text-gray-400" />
                                )}
                            </div>

                            {/* Column 2: Book Details */}
                            <div className="flex flex-col justify-center gap-1 text-left">
                                {/* Category Name */}
                                <p className="text-sm font-bold text-[#0A0D12] uppercase tracking-wide">
                                    {categoryName}
                                </p>
                                
                                {/* Book Title */}
                                <h3 className="text-xl font-bold text-[#0A0D12] leading-tight">
                                    {review.Book.title}
                                </h3>
                                
                                {/* Author Name */}
                                <p className="text-base font-medium text-[#414651]">
                                    {authorName}
                                </p>
                            </div>
                        </div>

                        {/* Divider Line */}
                        <hr className="border-t border-[#D5D7DA]" />

                        {/* Rating & Comment */}
                        <div className="flex flex-col gap-3 text-left">
                            <StarRating rating={review.star} />
                            <p className="text-base font-semibold text-[#0A0D12] leading-relaxed">
                                {review.comment}
                            </p>
                        </div>

                    </Card>
                  );
              })}
          </div>
      )}
    </div>
  );
}