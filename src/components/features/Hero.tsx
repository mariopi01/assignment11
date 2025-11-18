
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <div className="text-center bg-gray-50 p-8 rounded-lg">
      <h1 className="text-4xl font-bold mb-4">Selamat Datang di Booky</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Temukan dan pinjam buku favorit Anda di sini.
      </p>
      <Button asChild size="lg">
        <Link to="/books">Lihat Semua Buku</Link>
      </Button>
    </div>
  );
};