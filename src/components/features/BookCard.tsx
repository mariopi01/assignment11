// // // // // import { Link } from 'react-router-dom';
// // // // // import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// // // // // import { Badge } from '@/components/ui/badge';
// // // // // import { Book } from '@/types';

// // // // // interface BookCardProps {
// // // // //   book: Book;
// // // // // }

// // // // // export const BookCard = ({ book }: BookCardProps) => {
// // // // //   return (
// // // // //     <Link to={`/books/${book.id}`}>
// // // // //       <Card className="hover:shadow-lg transition-shadow">
// // // // //         <CardHeader>
// // // // //           {/* Gambar sampul */}
// // // // //           <img
// // // // //             src={book.coverImageUrl || 'https://via.placeholder.com/150'}
// // // // //             alt={book.title}
// // // // //             className="rounded-md h-48 w-full object-cover"
// // // // //           />
// // // // //           <CardTitle className="mt-4 truncate">{book.title}</CardTitle>
// // // // //         </CardHeader>
// // // // //         <CardContent>
// // // // //           <p className="text-sm text-muted-foreground">{book.author}</p>
// // // // //         </CardContent>
// // // // //         <CardFooter className="flex justify-between">
// // // // //           <Badge variant="outline">{book.category}</Badge>
// // // // //           <Badge variant={book.stock > 0 ? 'default' : 'destructive'}>
// // // // //             Stok: {book.stock}
// // // // //           </Badge>
// // // // //         </CardFooter>
// // // // //       </Card>
// // // // //     </Link>
// // // // //   );
// // // // // };


// // // // import { Link } from 'react-router-dom';
// // // // // Error 1: Dipersiapkan oleh 'npx shadcn-ui@latest add card'
// // // // import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// // // // // Error 2: Dipersiapkan oleh 'npx shadcn-ui@latest add badge'
// // // // import { Badge } from '@/components/ui/badge';
// // // // // Error 3: Tambahkan 'type' untuk import tipe
// // // // import type { Book } from '@/types';

// // // // interface BookCardProps {
// // // //   book: Book;
// // // // }

// // // // export const BookCard = ({ book }: BookCardProps) => {
// // // //   return (
// // // //     <Link to={`/books/${book.id}`}>
// // // //       <Card className="hover:shadow-lg transition-shadow">
// // // //         <CardHeader>
// // // //           {/* Gambar sampul */}
// // // //           <img
// // // //             src={book.coverImageUrl || 'https://via.placeholder.com/150'}
// // // //             alt={book.title}
// // // //             className="rounded-md h-48 w-full object-cover"
// // // //           />
// // // //           <CardTitle className="mt-4 truncate">{book.title}</CardTitle>
// // // //         </CardHeader>
// // // //         <CardContent>
// // // //           <p className="text-sm text-muted-foreground">{book.author}</p>
// // // //         </CardContent>
// // // //         <CardFooter className="flex justify-between">
// // // //           <Badge variant="outline">{book.category}</Badge>
// // // //           <Badge variant={book.stock > 0 ? 'default' : 'destructive'}>
// // // //             Stok: {book.stock}
// // // //           </Badge>
// // // //         </CardFooter>
// // // //       </Card>
// // // //     </Link>
// // // //   );
// // // // };

// // // // src/components/features/BookCard.tsx

// // // import { Link } from 'react-router-dom';
// // // import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// // // import { Badge } from '@/components/ui/badge';
// // // import type { Book } from '@/types';

// // // interface BookCardProps {
// // //   book: Book;
// // // }

// // // export const BookCard = ({ book }: BookCardProps) => {
// // //   return (
// // //     <Link to={`/books/${book.id}`}>
// // //       <Card className="hover:shadow-lg transition-shadow">
// // //         <CardHeader>
// // //           {/* Gambar sampul */}
// // //           <img
// // //             src={book.coverImageUrl || 'https://via.placeholder.com/150'}
// // //             alt={book.title}
// // //             className="rounded-md h-48 w-full object-cover"
// // //           />
// // //           <CardTitle className="mt-4 truncate">{book.title}</CardTitle>
// // //         </CardHeader>
// // //         <CardContent>
// // //           {/* PERBAIKAN: Render book.author.name, bukan book.author */}
// // //           <p className="text-sm text-muted-foreground">{book.author.name}</p>
// // //         </CardContent>
// // //         <CardFooter className="flex justify-between">
// // //           {/* PERBAIKAN: Render book.category.name, bukan book.category */}
// // //           <Badge variant="outline">{book.category.name}</Badge>
          
// // //           {/* PERBAIKAN: Gunakan availableCopies dari API */}
// // //           <Badge variant={book.availableCopies > 0 ? 'default' : 'destructive'}>
// // //             Stok: {book.availableCopies}
// // //           </Badge>
// // //         </CardFooter>
// // //       </Card>
// // //     </Link>
// // //   );
// // // };

// // import { Link } from 'react-router-dom';
// // import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Star } from 'lucide-react'; 
// // import { cn } from '@/lib/utils';
// // // import type { Book } from '@/types'; // Dihapus karena kita mendefinisikan struktur data yang diterima secara spesifik di bawah

// // // FIX: Definisikan struktur data yang sebenarnya diterima (dengan author sebagai objek)
// // interface BookData {
// //   id: string; 
// //   title: string; 
// //   author: { id: number; name: string; }; // Menerima objek Author dari API
// //   category: string; 
// //   coverImageUrl: string; 
// //   stock: number;
// //   rating?: number; 
// // }

// // interface BookCardProps {
// //   book: BookData; 
// // }

// // // Helper component for star display
// // const SingleStarRating = ({ rating }: { rating: number | undefined }) => {
// //     const safeRating = rating ?? 0;
    
// //     return (
// //         <div className="flex items-center text-sm space-x-1">
// //             <Star 
// //                 className={cn("w-4 h-4", safeRating > 0 ? "fill-yellow-500 text-yellow-500" : "text-gray-300")} 
// //                 fill={safeRating > 0 ? "currentColor" : "none"}
// //             />
// //             <span className="font-semibold text-foreground">
// //                 {safeRating.toFixed(1)}
// //             </span>
// //         </div>
// //     );
// // };


// // export const BookCard = ({ book }: BookCardProps) => {
// //   // Getting rating safely
// //   const bookRating = book.rating ?? 0;

// //   return (
// //     <Link to={`/books/${book.id}`}>
// //       <Card className="hover:shadow-lg transition-shadow">
// //         <CardHeader>
// //           {/* Gambar sampul */}
// //           <img
// //             src={book.coverImageUrl || 'https://via.placeholder.com/150'}
// //             alt={book.title}
// //             className="rounded-md h-48 w-full object-cover"
// //           />
// //           <CardTitle className="mt-4 truncate">{book.title}</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           {/* FIX: Akses author.name untuk menampilkan string */}
// //           <p className="text-sm text-muted-foreground">{book.author.name}</p> 
// //         </CardContent>
// //         {/* REVISED CardFooter: Replace Category/Stock Badges with Rating */}
// //         <CardFooter className="flex justify-start"> 
// //           <SingleStarRating rating={bookRating} />
// //         </CardFooter>
// //       </Card>
// //     </Link>
// //   );
// // };


// import { Link } from 'react-router-dom';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Star } from 'lucide-react'; 
// import { cn } from '@/lib/utils';
// // import type { Book } from '@/types'; // Dihapus karena kita mendefinisikan tipe lokal

// // FIX: Definisikan struktur data yang sebenarnya diterima dari API (nested objects)
// interface AuthorData { id: number; name: string; }
// interface CategoryData { id: number; name: string; }

// interface BookData {
//   id: string; 
//   title: string; 
//   author: AuthorData;       // FIX: Diharapkan berupa objek AuthorData
//   category: CategoryData;   // FIX: Diharapkan berupa objek CategoryData
//   coverImageUrl: string; 
//   stock: number;
//   rating?: number; 
// }

// interface BookCardProps {
//   // Menggunakan tipe data yang sesuai dengan data API
//   book: BookData; 
// }

// // Helper component for star display
// const SingleStarRating = ({ rating }: { rating: number | undefined }) => {
//     const safeRating = rating ?? 0;
    
//     return (
//         <div className="flex items-center text-sm space-x-1">
//             <Star 
//                 className={cn("w-4 h-4", safeRating > 0 ? "fill-yellow-500 text-yellow-500" : "text-gray-300")} 
//                 fill={safeRating > 0 ? "currentColor" : "none"}
//             />
//             <span className="font-semibold text-foreground">
//                 {safeRating.toFixed(1)}
//             </span>
//         </div>
//     );
// };


// export const BookCard = ({ book }: BookCardProps) => {
//   const bookRating = book.rating ?? 0;

//   return (
//     <Link to={`/books/${book.id}`}>
//       <Card className="hover:shadow-lg transition-shadow">
//         <CardHeader>
//           {/* Gambar sampul */}
//           <img
//             src={book.coverImageUrl || 'https://via.placeholder.com/150'}
//             alt={book.title}
//             className="rounded-md h-48 w-full object-cover"
//           />
//           <CardTitle className="mt-4 truncate">{book.title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {/* FIX: Akses book.author.name */}
//           <p className="text-sm text-muted-foreground">{book.author.name}</p> 
//         </CardContent>
//         {/* REVISED CardFooter: Replace Category/Stock Badges with Rating */}
//         <CardFooter className="flex justify-start"> 
//           <SingleStarRating rating={bookRating} />
//         </CardFooter>
//       </Card>
//     </Link>
//   );
// };


import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react'; 
import { cn } from '@/lib/utils';

// FIX: Definisikan struktur data yang sebenarnya diterima dari API (nested objects)
interface AuthorData { id: number; name: string; }
interface CategoryData { id: number; name: string; }

interface BookData {
  id: string; 
  title: string; 
  author: AuthorData;       // FIX: Diharapkan berupa objek AuthorData
  category: CategoryData;   // FIX: Diharapkan berupa objek CategoryData
  coverImageUrl: string; 
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
    <Link to={`/books/${book.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          {/* Gambar sampul */}
          <img
            src={book.coverImageUrl || 'https://via.placeholder.com/150'}
            alt={book.title}
            className="rounded-md h-48 w-full object-cover"
          />
          <CardTitle className="mt-4 truncate">{book.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* FIX: Akses book.author.name */}
          <p className="text-sm text-muted-foreground">{book.author.name}</p> 
        </CardContent>
        {/* REVISED CardFooter: Menampilkan Rating */}
        <CardFooter className="flex justify-start"> 
          <SingleStarRating rating={bookRating} />
        </CardFooter>
      </Card>
    </Link>
  );
};