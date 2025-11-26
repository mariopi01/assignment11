
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Loader2, BookOpen, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookCard } from '@/components/features/BookCard';

import authorImage from '@/assets/author1.png'; 

// --- TIPE DATA DARI API RESPONSE BODY ---
interface Author { id: number; name: string; bio: string; }
interface Category { id: number; name: string; }

// FIX 1: Merevisi RawBookItem agar sesuai dengan API (hanya memiliki authorId)
interface RawBookItem {
    id: number; 
    title: string; 
    coverImage: string | null; 
    rating: number; 
    availableCopies: number; 
    authorId: number; // API hanya mengirimkan ID
    categoryId: number; // API hanya mengirimkan ID
}

interface AuthorBooksResponse {
    author: Author; // Objek penulis lengkap ada di sini
    books: RawBookItem[]; 
}

// --- TIPE DATA UNTUK BOOK CARD (TARGET) ---
// Tipe ini harus sesuai dengan apa yang diharapkan oleh BookCard.tsx
interface BookDataForCard {
    id: string; 
    title: string; 
    author: Author | null | undefined; // Harus berupa objek Author
    category: Category;   
    coverImage: string | null;
    stock: number; 
    rating?: number; 
}

// --- PLACEHOLDERS ---
const LoadingSpinner = () => <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;
const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
);

export default function BookByAuthorPage() {
    const { id: authorId } = useParams<{ id: string }>(); 

    const { data, isPending, isError, error } = useQuery<AuthorBooksResponse, Error>({
        queryKey: ['author-books', authorId],
        queryFn: async () => {
            const res = await apiClient.get(`/authors/${authorId}/books`);
            return res.data.data;
        },
        enabled: !!authorId,
    });

    // --- MAPPING DATA UNTUK BOOK CARD ---
    const fullAuthor = data?.author;
    
    const mappedBooks: BookDataForCard[] = (data?.books || []).map((book) => ({
        id: book.id.toString(), 
        title: book.title,
        
        // FIX 2: Menginjeksi objek penulis lengkap dari data teratas
        author: fullAuthor, 
        
        // Category dibuat placeholder karena nama kategori tidak ada di API response
        category: { id: book.categoryId, name: `Category ${book.categoryId}` }, 
        
        coverImage: book.coverImage,
        stock: book.availableCopies, 
        rating: book.rating,
    }));
    // ------------------------------------


    // --- RENDER LOGIC ---
    if (isPending) return <LoadingSpinner />;
    if (isError) return <ErrorDisplay message={error.message || 'Gagal memuat detail penulis dan bukunya.'} />;
    if (!data) return <p className="text-center">Penulis tidak ditemukan.</p>;

    const { author } = data;
    const bookCount = mappedBooks.length;
    
    // Styling constants
    const customShadow = '0px 0px 20px 0px rgba(203, 202, 202, 0.25)'; // #CBCACA40
    const TITLE_STYLE = { fontSize: '3rem', lineHeight: '1.2', letterSpacing: '-0.02em' }; 
    const AUTHOR_HEADER_HEIGHT = '113px';
    const MAX_WIDTH_CONTAINER = '1200px';

    return (
        <div className="space-y-10">
            {/* 1. Author Container (width: 1200; height: 113; padding: 16px; shadow) */}
            <Card 
                className="flex items-center p-4 gap-4 bg-white"
                style={{ 
                    maxWidth: MAX_WIDTH_CONTAINER, 
                    width: '100%',
                    height: AUTHOR_HEADER_HEIGHT, 
                    borderRadius: '16px', 
                    padding: '16px', 
                    boxShadow: customShadow 
                }}
            >
                {/* a. Flex 2 Kolom (Image | Info) */}
                <div className="flex w-full gap-4 items-center">
                    {/* Kolom Kiri: Author Image (81x81) */}
                    <div className="shrink-0 size-[81px] rounded-full overflow-hidden">
                        <img 
                            src={authorImage} 
                            alt={`Avatar ${author.name}`}
                            className="w-full h-full object-cover" 
                        />
                    </div>

                    {/* Kolom Kanan: Nama & Jumlah Buku */}
                    <div className="flex flex-col justify-center space-y-1 text-left">
                        {/* Author Name */}
                        <h1 className="font-bold text-2xl text-foreground">
                            {author.name}
                        </h1>
                        
                        {/* Number of Books Written */}
                        <div className="flex items-center text-muted-foreground text-base space-x-1">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <span>{bookCount} Books </span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 2. Text "Book List" (display-lg -2%) */}
            <h2 className="font-extrabold text-[#0A0D12] text-left" 
                style={TITLE_STYLE}>
                Book List
            </h2>

            {/* 3. Book Grid (5 kolom desktop / 2 kolom mobile) */}
            {mappedBooks.length > 0 ? (
                <div className={cn(
                    "grid gap-6",
                    "grid-cols-2 md:grid-cols-5" 
                )}>
                    {mappedBooks.map((book) => (
                        // Meneruskan mappedBooks yang sudah disiapkan
                        <BookCard key={book.id} book={book as BookDataForCard} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">Penulis ini belum memiliki buku yang terdaftar.</p>
            )}
        </div>
    );
}