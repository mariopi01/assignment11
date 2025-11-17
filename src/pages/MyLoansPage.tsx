import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api';
import type { Loan } from '@/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Komponen
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert, Loader2 } from 'lucide-react';

dayjs.extend(relativeTime);

// Placeholders
const LoadingSpinner = () => <div className="text-center"><Loader2 className="animate-spin" /></div>;
const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
);

export default function MyLoansPage() {
  const { data: loans, isPending, isError, error } = useQuery<Loan[], Error>({
    queryKey: ['my-loans'], // Kunci ini di-invalidate saat meminjam buku
    queryFn: async () => {
      const res = await apiClient.get('/loans/me');
      return res.data;
    },
  });

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorDisplay message={error.message || 'Gagal memuat data pinjaman.'} />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pinjaman Saya</h1>
      
      {loans && loans.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Buku</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tgl Pinjam</TableHead>
              <TableHead>Batas Waktu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">{loan.bookTitle}</TableCell>
                <TableCell>
                  <Badge variant={loan.status === 'BORROWED' ? 'default' : 'outline'}>
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {dayjs(loan.borrowedAt).format('DD MMM YYYY')}
                </TableCell>
                <TableCell>
                  {loan.status === 'BORROWED' 
                    ? `Dalam ${dayjs(loan.dueDate).toNow(true)}` 
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground">Anda belum memiliki riwayat pinjaman.</p>
      )}
    </div>
  );
}