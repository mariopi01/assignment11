import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';

// Interface untuk props komponen
interface GiveReviewProps {
  bookId: number;
  isOpen: boolean;
  onClose: () => void;
}

// Interface untuk response API error
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const GiveReview = ({ bookId, isOpen, onClose }: GiveReviewProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  // --- STYLING CONSTANTS ---
  const CONTAINER_STYLE = {
    width: '439px',
    height: '518px', // Fixed height sesuai request
    borderRadius: '16px',
    padding: '24px',
    gap: '24px',
    position: 'fixed' as const,
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    transform: 'translate(-50%, -50%)', // Adjust centering
    zIndex: 50,
    backgroundColor: 'white',
  };

  const TITLE_STYLE = {
    
    fontWeight: 700,
    fontSize: '1.25rem', // display-xs (~20px)
    lineHeight: '1.75rem',
    color: '#0A0D12',
  };

  const SUBTITLE_STYLE = {
    
    fontWeight: 700,
    fontSize: '1rem', // text-md
    lineHeight: '1.5rem',
    textAlign: 'center' as const,
    color: '#0A0D12',
  };

  // === MUTASI REVIEW ===
  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: async () => {
      if (rating < 1) throw new Error("Please give a rating.");
      
      const payload = {
        bookId: bookId,
        star: rating,
        comment: comment
      };
      
      const res = await apiClient.post('/reviews', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Review Saved', { description: 'Thank you for your feedback!' });
      // Invalidate queries terkait agar data terupdate
      queryClient.invalidateQueries({ queryKey: ['book-reviews', bookId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['book-detail', bookId.toString()] });
      
      // Reset form & Close
      setRating(0);
      setComment('');
      onClose();
    },
    onError: (error: ApiError) => {
      toast.error('Failed to Submit', { 
        description: error.response?.data?.message || 'Something went wrong.' 
      });
    }
  });

  // Jika modal tidak terbuka, jangan render apa-apa
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose} // Klik luar untuk tutup
      />

      {/* Main Container */}
      <Card className="flex flex-col h-full shadow-2xl border-none animate-in fade-in zoom-in duration-200" style={CONTAINER_STYLE}>
        
        {/* 1. Header (Title + Close Icon) */}
        <div className="flex justify-between items-center w-full">
            <h2 style={TITLE_STYLE}>Give Review</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* 2. Give Rating Text */}
        <div className="w-full pt-2">
            <p style={SUBTITLE_STYLE}>Give Rating</p>
        </div>

        {/* 3. Star Rating (Interactive) */}
        <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                >
                    <Star 
                        className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                </button>
            ))}
        </div>

        {/* 4. Comment Box */}
        <div className="w-full grow">
            <Textarea
                placeholder="Please share your thoughts about this book"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full resize-none bg-white placeholder:text-[#717680] text-[#0A0D12]"
                style={{
                    height: '235px',
                    borderRadius: '12px',
                    border: '1px solid #D5D7DA',
                    padding: '12px',
                    
                    fontWeight: 500,
                    fontSize: '1rem',
                    lineHeight: '1.5rem',
                    letterSpacing: '-0.02em'
                }}
            />
        </div>

        {/* 5. Send Button */}
        <div className="w-full pt-2">
            <Button
                onClick={() => submitReview()}
                disabled={isPending || rating === 0}
                className="w-full text-white font-semibold shadow-md hover:opacity-90 transition-all"
                style={{
                    height: '40px',
                    borderRadius: '200px', // Sesuai request 200px (pill shape)
                    background: '#1C65DA',
                    padding: '8px',
                    gap: '8px'
                }}
            >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
            </Button>
        </div>

      </Card>
    </>
  );
};