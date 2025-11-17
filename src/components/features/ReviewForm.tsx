// import { useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import apiClient from '@/api';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/components/ui/use-toast';

// interface ReviewFormProps {
//   bookId: string;
// }

// export const ReviewForm = ({ bookId }: ReviewFormProps) => {
//   const [comment, setComment] = useState('');
//   const [rating, setRating] = useState(5); // Asumsi rating 1-5
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const { mutate: addReview, isPending } = useMutation({
//     mutationFn: () => {
//       return apiClient.post(`/books/${bookId}/reviews`, { rating, comment });
//     },
//     onSuccess: () => {
//       toast({ title: 'Sukses', description: 'Ulasan Anda telah ditambahkan.' });
//       // Invalidate query buku detail untuk memuat ulang daftar ulasan
//       queryClient.invalidateQueries({ queryKey: ['book', bookId] });
//       setComment('');
//       setRating(5);
//     },
//     onError: (error: any) => {
//       toast({
//         title: 'Gagal',
//         description: error.response?.data?.message || 'Gagal menambah ulasan.',
//         variant: 'destructive',
//       });
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (comment.trim()) {
//       addReview();
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <h3 className="text-lg font-semibold">Tulis Ulasan Anda</h3>
//       {/* Di sini Anda bisa menambahkan komponen Rating (bintang) */}
//       <Textarea
//         placeholder="Bagaimana pendapat Anda tentang buku ini?"
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//         required
//       />
//       <Button type="submit" disabled={isPending}>
//         {isPending ? 'Mengirim...' : 'Kirim Ulasan'}
//       </Button>
//     </form>
//   );
// };

import React, { useState } from 'react'; // <--- 1. IMPORT REACT
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // Akan ada setelah npx add
import { toast } from 'sonner';// Akan ada setelah npx add

interface ReviewFormProps {
  bookId: string;
}

// 2. Tentukan tipe untuk error API
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const ReviewForm = ({ bookId }: ReviewFormProps) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  
  const queryClient = useQueryClient();

  const { mutate: addReview, isPending } = useMutation({
    mutationFn: () => {
      return apiClient.post(`/books/${bookId}/reviews`, { rating, comment });
    },
    onSuccess: () => {
      toast.success('Sukses', { description: 'Ulasan Anda telah ditambahkan.' });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
      setComment('');
      setRating(5);
    },
    // 3. Gunakan tipe ApiError di sini
    onError: (error: ApiError) => {
      toast.error('Gagal', { 
        description: error.response?.data?.message || 'Gagal menambah ulasan.' 
      });
    },
  });

  // 4. Beri tipe 'e' sebagai React.FormEvent
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      addReview();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Tulis Ulasan Anda</h3>
      {/* Di sini Anda bisa menambahkan komponen Rating (bintang) */}
      <Textarea
        placeholder="Bagaimana pendapat Anda tentang buku ini?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Mengirim...' : 'Kirim Ulasan'}
      </Button>
    </form>
  );
};