
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, BookOpen } from 'lucide-react'; 
import { cn } from '@/lib/utils';

// Definisikan struktur data yang sebenarnya diterima dari API (nested objects)
interface AuthorData { id: number; name: string; }
interface CategoryData { id: number; name: string; }

interface BookData {
  id: string; 
  title: string; 
  // FIX: Mengizinkan author menjadi null atau undefined untuk robustness
  author: AuthorData | null | undefined;       
  category: CategoryData;   
  coverImage: string | null;
  stock: number;
  rating?: number; 
}

interface BookCardProps {
  book: BookData; 
}

// Helper component for star display
const SingleStarRating = ({ rating }: { rating: number | undefined }) => {
    const safeRating = rating ?? 0;
    
    return (
        <div className="flex items-center text-sm space-x-1">
            <Star 
                className={cn("w-4 h-4", safeRating > 0 ? "fill-yellow-500 text-yellow-500" : "text-gray-300")} 
                fill={safeRating > 0 ? "currentColor" : "none"}
            />
            <span className="font-semibold text-foreground">
                {safeRating.toFixed(1)}
            </span>
        </div>
    );
};


export const BookCard = ({ book }: BookCardProps) => {
  const bookRating = book.rating ?? 0;

  return (
    <Link to={`/books/${book.id}`} className="block h-full">
      {/* Tambahkan p-0 dan overflow-hidden pada Card */}
      <Card className="hover:shadow-lg transition-shadow h-full flex flex-col p-0 overflow-hidden gap-0">
        
        {/* Gambar dipindahkan ke sini (di luar CardHeader) agar full width/height tanpa padding */}
        <div className="w-full aspect-2/3 flex items-center justify-center bg-gray-200 overflow-hidden relative">
             {book.coverImage ? ( 
                <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                />
            ) : (
                // Placeholder internal
                <BookOpen className="w-12 h-12 text-gray-400" />
            )}
        </div>

        {/* Wrapper untuk konten teks agar memiliki padding yang konsisten */}
        <div className="flex flex-col grow p-4 gap-2">
            <CardHeader className="p-0">
              <CardTitle className="truncate text-lg text-left font-bold">{book.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="p-0 grow">
              {/* FIX: Akses book.author.name secara aman menggunakan optional chaining */}
              <p className="text-sm text-muted-foreground text-left text-[#414651] ">{book.author?.name || 'Unknown Author'}</p> 
            </CardContent>
            
            {/* REVISED CardFooter: Menampilkan Rating */}
            <CardFooter className="p-0 flex justify-start pt-2"> 
              <SingleStarRating rating={bookRating} />
            </CardFooter>
        </div>
        
      </Card>
    </Link>
  );
};