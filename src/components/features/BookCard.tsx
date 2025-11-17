// import { Link } from 'react-router-dom';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Book } from '@/types';

// interface BookCardProps {
//   book: Book;
// }

// export const BookCard = ({ book }: BookCardProps) => {
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
//           <p className="text-sm text-muted-foreground">{book.author}</p>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Badge variant="outline">{book.category}</Badge>
//           <Badge variant={book.stock > 0 ? 'default' : 'destructive'}>
//             Stok: {book.stock}
//           </Badge>
//         </CardFooter>
//       </Card>
//     </Link>
//   );
// };


import { Link } from 'react-router-dom';
// Error 1: Dipersiapkan oleh 'npx shadcn-ui@latest add card'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// Error 2: Dipersiapkan oleh 'npx shadcn-ui@latest add badge'
import { Badge } from '@/components/ui/badge';
// Error 3: Tambahkan 'type' untuk import tipe
import type { Book } from '@/types';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
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
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Badge variant="outline">{book.category}</Badge>
          <Badge variant={book.stock > 0 ? 'default' : 'destructive'}>
            Stok: {book.stock}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};