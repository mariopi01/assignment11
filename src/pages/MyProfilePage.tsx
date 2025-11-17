import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TriangleAlert } from 'lucide-react';

// Tipe untuk statistik
interface UserStats {
  totalLoans: number;
  activeLoans: number;
  reviewsWritten: number;
}

export default function MyProfilePage() {
  // Ambil data user yang sedang login dari Redux
  const user = useAppSelector(selectCurrentUser);

  // Ambil data statistik dari API
  const { data: stats, isPending, isError } = useQuery<UserStats>({
    queryKey: ['my-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/users/me/stats');
      return res.data;
    },
  });

  if (!user) {
    return <p>Silakan login untuk melihat profil.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profil Saya</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nama</p>
            <p className="text-lg">{user.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Statistik Pinjaman</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending && <Loader2 className="animate-spin" />}
          {isError && <p className="text-red-500">Gagal memuat statistik.</p>}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-3xl font-bold">{stats.totalLoans}</p>
                <p className="text-muted-foreground">Total Pinjaman</p>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-3xl font-bold">{stats.activeLoans}</p>
                <p className="text-muted-foreground">Sedang Dipinjam</p>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-3xl font-bold">{stats.reviewsWritten}</p>
                <p className="text-muted-foreground">Ulasan Ditulis</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}