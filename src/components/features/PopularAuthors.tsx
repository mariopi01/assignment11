
import { useQuery, useQueries } from '@tanstack/react-query';
import apiClient from '@/api';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Loader2, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// 1. IMPORT AUTHOR IMAGE
import authorImage from '@/assets/author1.png'; 
import bookIcon from '@/assets/Book_icon.png';
import { Link } from 'react-router-dom';

// --- TIPE DATA API ---
interface Author {
  id: number;
  name: string;
  bio: string;
}

interface AuthorListResponse {
  authors: Author[];
}

interface AuthorBooksResponse {
  books: unknown[]; 
}

interface ExtendedAuthor extends Author {
    bookCount: number;
}
// ----------------------

// Komponen Pembantu: Author Card
const AuthorCard = ({ author }: { author: ExtendedAuthor }) => {
    const customShadow = '0px 0px 20px 0px rgba(203, 202, 202, 0.25)'; // #CBCACA40
    
    return (

        <Link 
            to={`/authors/${author.id}`} // Mengarahkan ke rute BookByAuthor
            className="block" // Memastikan Link berperilaku sebagai blok untuk membungkus Card
        >
        <Card 
            // Container utama: flex, p-4 (padding), gap-4 (spasi antar item).
            // items-center: Mencentang item secara vertikal, ini yang membuat image tidak rapat ke atas.
            // Jika ingin image rapat ke atas, ganti menjadi items-start.
            className="p-4 gap-4 grid grid-cols-2 hover:shadow-lg transition-shadow"
            style={{ 
                width: '285px', 
                height: '113px', 
                borderRadius: '12px', 
                boxShadow: customShadow 
            }}
        >
            {/* 1. Left: Author Image (posisi rapat kiri karena ini adalah item pertama dalam flex container) */}
            <div className="shrink-0 size-[81px] rounded-full overflow-visible">
                <img 
                    src={authorImage} 
                    alt={`Avatar ${author.name}`}
                    className="w-full  h-full object-cover" 
                />
            </div>

            {/* Right: Info container. */}
            {/* h-full: Memastikan container ini mengambil tinggi penuh dari Card (96px, setelah dikurangi p-4) */}
            {/* justify-between: Memastikan Nama Author (atas) dan Jumlah Buku (bawah) terpisah vertikal. */}
            {/* grow min-w-0: Penting! Memastikan container mengambil sisa lebar dan mengizinkan konten teks untuk diperkecil/truncate. */}
            <div className="flex flex-col justify-between h-full grow min-w-0 text-left"> 
                
                {/* 2. Right Top: Author Name. truncate memastikan teks yang terlalu panjang dipotong. */}
                <h3 className="font-semibold text-sm text-foreground truncate">
                    {author.name}
                </h3>
                
                {/* 3. Right Bottom: Book Count */}
                <div className="flex items-center text-muted-foreground text-sm space-x-1">
                    <img 
                        src={bookIcon}
                        alt="Book Icon"
                        // Menggunakan lebar 16px dan tinggi 20px sesuai spesifikasi
                        className="shrink-0"
                        style={{ width: '16px', height: '20px' }} 
                    />
                    <span className="truncate">{author.bookCount} Books</span>
                </div>
            </div>
        </Card>
        </Link>
    );
};


// Komponen Utama: Popular Authors
export const PopularAuthors = () => {
    const { data: authorsData, isPending: isAuthorsPending, isError: isAuthorsError, error: authorsError } = useQuery<AuthorListResponse, Error>({
        queryKey: ['authors'],
        queryFn: async () => {
            const res = await apiClient.get('/authors');
            return res.data.data;
        },
    });

    const authors = authorsData?.authors || [];
    const topAuthors = authors.slice(0, 4); 

    const bookCountQueries = useQueries({
        queries: topAuthors.map(author => ({
            queryKey: ['author-books', author.id],
            queryFn: async () => {
                const res = await apiClient.get(`/authors/${author.id}/books`);
                return (res.data.data as AuthorBooksResponse).books.length;
            },
            staleTime: Infinity, 
            enabled: !isAuthorsPending && topAuthors.length > 0,
        })),
    });

    const isBookCountsPending = bookCountQueries.some(q => q.isPending);
    const isBookCountsError = bookCountQueries.some(q => q.isError);

    const isLoading = isAuthorsPending || isBookCountsPending;
    const isError = isAuthorsError || isBookCountsError;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h2 className="font-extrabold text-[#0A0D12] text-left" 
                    style={{ fontSize: '3rem', lineHeight: '1.2' }}>
                    Popular Authors
                </h2>
                <div className="text-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-muted-foreground">Memuat daftar penulis...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6">
                <h2 className="font-extrabold text-[#0A0D12] text-left" 
                    style={{ fontSize: '3rem', lineHeight: '1.2' }}>
                    Popular Authors
                </h2>
                <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{authorsError?.message || 'Gagal memuat daftar penulis populer.'}</AlertDescription>
                </Alert>
            </div>
        );
    }

    const extendedAuthors: ExtendedAuthor[] = topAuthors.map((author, index) => {
        const bookCount = bookCountQueries[index].data ?? 0;
        return {
            ...author,
            bookCount: bookCount,
        };
    });

    return (
        <div className="space-y-6">
            <h2 className="font-extrabold text-[#0A0D12] text-left" 
                style={{ fontSize: '3rem', lineHeight: '1.2' }}>
                Popular Authors
            </h2>
            
            {extendedAuthors.length > 0 ? (
                <div className={cn(
                    "grid gap-6 lg:grid-cols-4",
                    "grid-cols-1 md:grid-cols-2" 
                )}>
                    {extendedAuthors.map((author) => (
                        <AuthorCard key={author.id} author={author} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">Tidak ada data penulis populer.</p>
            )}
        </div>
    );
};