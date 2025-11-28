

// src/pages/CheckoutPage.tsx

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '@/api';
import dayjs from 'dayjs';
import { toast } from 'sonner';

// UI Components
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, BookOpen, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

// IMPORT KOMPONEN SUKSES
import { BorrowSuccessful } from '@/components/features/BorrowSuccessful'; 

// --- TIPE DATA ---

// Tipe Data Buku di Cart
interface CartItem {
  id: number;
  bookId: number;
  qty: number;
  book: {
    id: number;
    title: string;
    coverImage: string | null;
    author?: { id?: number; name: string }; 
    category?: { id?: number; name: string };
  };
}

// Tipe Data User dari API /me
interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserResponse {
  profile: UserProfile;
  loanStats: {
    borrowed: number;
    late: number;
    returned: number;
    total: number;
  };
  reviewsCount: number;
}

interface LocationState {
  checkoutItems?: CartItem[];
}

interface ApiError {
  response?: { data?: { message?: string; }; };
}

// --- STYLING CONSTANTS ---
const CONTAINER_STYLE = {
  maxWidth: '1002px',
  width: '100%',
  marginTop: '48px',
  marginLeft: 'auto',
  marginRight: 'auto',
  gap: '32px',
};
const DISPLAY_SM_BOLD = {  fontWeight: 700, fontSize: '1.875rem', lineHeight: '2.375rem', letterSpacing: '-0.02em', color: '#0A0D12' };
const TEXT_SM_BOLD = { fontWeight: 700, fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '-0.02em', color: '#0A0D12' };
const TEXT_MD_SEMIBOLD = { fontWeight: 600, fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em', color: '#0A0D12' };
const TEXT_MD_BOLD = { fontWeight: 700, fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '-0.02em', color: '#0A0D12' };

const DURATION_OPTIONS = [3, 5, 10];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // State Data
  const stateItems = (location.state as LocationState)?.checkoutItems;
  const [duration, setDuration] = useState<number | null>(null);
  const [agreedReturn, setAgreedReturn] = useState(false);
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  
  // State Pop-up Sukses
  const [isSuccess, setIsSuccess] = useState(false); 

  const today = dayjs();
  const returnDate = duration ? today.add(duration, 'day') : null;

  // === 1. FETCH USER DATA (/me) ===
  const { data: userData, isPending: isUserPending, isError: isUserError } = useQuery<UserResponse, Error>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await apiClient.get('/me');
      return res.data.data;
    },
  });

  // === 2. FETCH CART DATA (Fallback) ===
  const { data: cartData, isPending: isCartPending, isError: isCartError } = useQuery<{ items: CartItem[] }, Error>({
    queryKey: ['checkout-cart'],
    queryFn: async () => {
      const res = await apiClient.get('/cart');
      return res.data.data;
    },
    enabled: !stateItems, 
  });

  const itemsToCheckout = stateItems || cartData?.items || [];
  
  // Gabungkan status loading
  const isLoading = isUserPending || (!stateItems && isCartPending);

  // === 3. MUTASI BORROW ===
  const { mutate: processCheckout, isPending: isProcessing } = useMutation({
    mutationFn: async () => {
      if (itemsToCheckout.length === 0) throw new Error("Tidak ada item untuk diproses.");
      if (!duration) throw new Error("Pilih durasi peminjaman.");

      const promises = itemsToCheckout.map((item) => 
        apiClient.post('/loans', {
          bookId: item.bookId,
          days: duration
        })
      );

      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-cart'] });
      queryClient.invalidateQueries({ queryKey: ['my-loans'] });
      setIsSuccess(true);
    },
    onError: (error: ApiError) => {
      toast.error('Gagal Meminjam', { 
        description: error.response?.data?.message || 'Terjadi kesalahan saat memproses peminjaman.' 
      });
    }
  });

  const handleConfirm = () => {
    if (!duration || !agreedReturn || !agreedPolicy) return;
    processCheckout();
  };

  useEffect(() => {
    if (!isLoading && itemsToCheckout.length === 0 && !isCartError && !isSuccess) {
       // Opsional: Redirect jika cart kosong
    }
  }, [isLoading, itemsToCheckout, isCartError, navigate, isSuccess]);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  
  return (
    <>
      {isSuccess && (
        <BorrowSuccessful returnDate={returnDate ? returnDate.format('DD MMM YYYY') : '-'} />
      )}

      <div className="flex flex-col px-4 pb-12 min-h-screen" style={CONTAINER_STYLE}>
        
        <h1 className="text-left font-bold text-4xl text-[#0A0D12]">Checkout</h1>

        {(isCartError && !stateItems) || isUserError ? (
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Gagal memuat data yang diperlukan.</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* KOLOM KIRI */}
          <div className="flex-1 flex flex-col gap-8">
            {/* 1. User Info (Dari API) */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#0A0D12] text-left">User Information</h2>
              <div className=" space-y-4">
                  <div className=" gap-4">
                      <div className="flex justify-between items-center w-full mb-2 ">
                          <p className="text-sm text-muted-foreground ">Name</p>
                          <p className="font-medium text-[#0A0D12] ">
                            {userData?.profile.name || '-'}
                          </p>
                      </div>
                      <div className="flex justify-between items-center w-full mb-2">
                          <p className="text-sm text-muted-foreground  ">Email</p>
                          <p className="font-medium text-[#0A0D12] ">
                            {userData?.profile.email || '-'}
                          </p>
                      </div>
                      <div className="flex justify-between items-center w-full ">
                          <p className="text-sm text-muted-foreground text-left">Nomor Handphone</p>
                          <p className="font-medium text-[#0A0D12] text-right">-</p>
                      </div>
                  </div>
              </div>
            </div>

            {/* 2. Book List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#0A0D12] text-left">Book List</h2>
              <div className="space-y-4">
                  {itemsToCheckout.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 ">
                          <div className="shrink-0 w-20 h-[110px] bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                              {item.book.coverImage ? (
                                  <img src={item.book.coverImage} alt={item.book.title} className="w-full h-full object-cover" />
                              ) : (
                                  <BookOpen className="w-8 h-8 text-gray-400" />
                              )}
                          </div>
                          <div className="flex flex-col justify-center space-y-1 text-left">
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                  {item.book.category?.name || 'General'}
                              </p>
                              <h3 className="text-lg font-bold text-[#0A0D12] line-clamp-2">
                                  {item.book.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                  {item.book.author?.name || 'Unknown Author'}
                              </p>
                          </div>
                      </div>
                  ))}
                  {itemsToCheckout.length === 0 && (
                      <p className="text-muted-foreground italic">Tidak ada buku yang dipilih.</p>
                  )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (Form Peminjaman) */}
          <div className="shrink-0">
              <Card 
                  className="flex flex-col bg-white border border-gray-200 shadow-sm sticky top-24"
                  style={{ width: '478px', minHeight: '640px', borderRadius: '20px', padding: '20px', gap: '24px' }}
              >
                  <h2 style={DISPLAY_SM_BOLD}>Complete Your Borrow Request</h2>

                  {/* Borrow Date */}
                  <div className="space-y-1 text-left">
                      <p style={TEXT_SM_BOLD}>Borrow Date</p>
                      <div className="flex items-center  gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          
                          <span style={TEXT_MD_SEMIBOLD}>{today.format('DD MMM YYYY')}</span>
                          <Calendar className="w-5 h-5 text-gray-500 " />
                      </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-3 text-left">
                      <p style={TEXT_MD_BOLD}>Borrow Duration</p>
                      <div className="flex flex-col gap-3">
                          {DURATION_OPTIONS.map((days) => (
                              <label key={days} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${duration === days ? 'border-[#1C65DA] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                  <input 
                                      type="radio" name="duration" value={days} 
                                      checked={duration === days} onChange={() => setDuration(days)}
                                      className="w-5 h-5 text-[#1C65DA] border-gray-300 focus:ring-[#1C65DA]"
                                  />
                                  <span className="ml-3 font-medium text-gray-700">{days} days</span>
                              </label>
                          ))}
                      </div>
                  </div>

                  {/* Return Date */}
                  <div className="space-y-1 text-left">
                      
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                          <p style={TEXT_SM_BOLD}>Return Date</p>
                          <p className="text-sm">
                              Please return the book no later than <span className=" font-semibold text-[#EE1D52]">{returnDate ? returnDate.format('DD MMM YYYY') : '-'}</span>
                          </p>
                      </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3 pt-2">
                      <div className="flex items-start space-x-3">
                          <input 
                              type="checkbox" id="agree-return"
                              checked={agreedReturn} onChange={(e) => setAgreedReturn(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1C65DA] focus:ring-[#1C65DA]"
                          />
                          <Label htmlFor="agree-return" className="text-sm leading-tight font-normal text-gray-600 cursor-pointer">
                              I agree to return the book(s) before the due date.
                          </Label>
                      </div>
                      <div className="flex items-start space-x-3">
                          <input 
                              type="checkbox" id="agree-policy"
                              checked={agreedPolicy} onChange={(e) => setAgreedPolicy(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1C65DA] focus:ring-[#1C65DA]"
                          />
                          <Label htmlFor="agree-policy" className="text-sm leading-tight font-normal text-gray-600 cursor-pointer">
                              I accept the library borrowing policy.
                          </Label>
                      </div>
                  </div>

                  {/* Confirm Button */}
                  <div className="pt-4 mt-auto">
                      <Button 
                          onClick={handleConfirm}
                          disabled={isProcessing || !duration || !agreedReturn || !agreedPolicy}
                          className="w-full text-white font-semibold shadow-md hover:opacity-90 transition-all"
                          style={{ height: '48px', borderRadius: '100px', padding: '8px', background: '#1C65DA', opacity: (!duration || !agreedReturn || !agreedPolicy) ? 0.6 : 1 }}
                      >
                          {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : 'Confirm & Borrow'}
                      </Button>
                  </div>
              </Card>
          </div>
        </div>
      </div>
    </>
  );
}