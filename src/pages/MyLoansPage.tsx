// // // // import { useQuery } from '@tanstack/react-query';
// // // // import apiClient from '@/api';
// // // // import type { Loan } from '@/types';
// // // // import dayjs from 'dayjs';
// // // // import relativeTime from 'dayjs/plugin/relativeTime';

// // // // // Komponen
// // // // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// // // // import { Badge } from '@/components/ui/badge';
// // // // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // // // import { TriangleAlert, Loader2 } from 'lucide-react';

// // // // dayjs.extend(relativeTime);

// // // // // Placeholders
// // // // const LoadingSpinner = () => <div className="text-center"><Loader2 className="animate-spin" /></div>;
// // // // const ErrorDisplay = ({ message }: { message: string }) => (
// // // //   <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>
// // // // );

// // // // export default function MyLoansPage() {
// // // //   const { data: loans, isPending, isError, error } = useQuery<Loan[], Error>({
// // // //     queryKey: ['my-loans'], // Kunci ini di-invalidate saat meminjam buku
// // // //     queryFn: async () => {
// // // //       const res = await apiClient.get('/loans/me');
// // // //       return res.data;
// // // //     },
// // // //   });

// // // //   if (isPending) return <LoadingSpinner />;
// // // //   if (isError) return <ErrorDisplay message={error.message || 'Gagal memuat data pinjaman.'} />;

// // // //   return (
// // // //     <div className="space-y-6">
// // // //       <h1 className="text-3xl font-bold">Pinjaman Saya</h1>
      
// // // //       {loans && loans.length > 0 ? (
// // // //         <Table>
// // // //           <TableHeader>
// // // //             <TableRow>
// // // //               <TableHead>Buku</TableHead>
// // // //               <TableHead>Status</TableHead>
// // // //               <TableHead>Tgl Pinjam</TableHead>
// // // //               <TableHead>Batas Waktu</TableHead>
// // // //             </TableRow>
// // // //           </TableHeader>
// // // //           <TableBody>
// // // //             {loans.map((loan) => (
// // // //               <TableRow key={loan.id}>
// // // //                 <TableCell className="font-medium">{loan.bookTitle}</TableCell>
// // // //                 <TableCell>
// // // //                   <Badge variant={loan.status === 'BORROWED' ? 'default' : 'outline'}>
// // // //                     {loan.status}
// // // //                   </Badge>
// // // //                 </TableCell>
// // // //                 <TableCell>
// // // //                   {dayjs(loan.borrowedAt).format('DD MMM YYYY')}
// // // //                 </TableCell>
// // // //                 <TableCell>
// // // //                   {loan.status === 'BORROWED' 
// // // //                     ? `Dalam ${dayjs(loan.dueDate).toNow(true)}` 
// // // //                     : '-'}
// // // //                 </TableCell>
// // // //               </TableRow>
// // // //             ))}
// // // //           </TableBody>
// // // //         </Table>
// // // //       ) : (
// // // //         <p className="text-muted-foreground">Anda belum memiliki riwayat pinjaman.</p>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }



// // // import { useState, useEffect } from 'react';
// // // import { useQuery } from '@tanstack/react-query';
// // // import apiClient from '@/api';
// // // import dayjs from 'dayjs';
// // // import relativeTime from 'dayjs/plugin/relativeTime';
// // // import { Loader2, Search, BookOpen, TriangleAlert } from 'lucide-react';

// // // // Komponen UI
// // // import { Button } from '@/components/ui/button';
// // // import { Card } from '@/components/ui/card';
// // // import { Input } from '@/components/ui/input';
// // // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // // import { Badge } from '@/components/ui/badge';

// // // dayjs.extend(relativeTime);

// // // // --- TIPE DATA ---
// // // interface LoanBook {
// // //   id: number;
// // //   title: string;
// // //   coverImage: string | null;
// // //   // Asumsi API mungkin mengirim detail tambahan, jika tidak kita pakai fallback
// // //   category?: { name: string }; 
// // //   author?: { name: string };
// // // }

// // // interface LoanItem {
// // //   id: number;
// // //   userId: number;
// // //   bookId: number;
// // //   status: 'BORROWED' | 'RETURNED' | 'OVERDUE'; // Sesuaikan dengan kemungkinan status API
// // //   borrowedAt: string;
// // //   dueAt: string;
// // //   returnedAt: string | null;
// // //   Book: LoanBook;
// // // }

// // // interface LoansResponse {
// // //   loans: LoanItem[];
// // //   pagination: {
// // //     page: number;
// // //     limit: number;
// // //     total: number;
// // //     totalPages: number;
// // //   };
// // // }

// // // // --- STYLING CONSTANTS ---
// // // const TITLE_STYLE = { 
// // //   fontFamily: 'Inter, sans-serif', 
// // //   fontWeight: 700, 
// // //   fontSize: '1.875rem', // display-sm (~30px)
// // //   lineHeight: '2.375rem', 
// // //   letterSpacing: '-0.03em', 
// // //   color: '#0A0D12' 
// // // };

// // // const CARD_BORDER_COLOR = '#D5D7DA';

// // // // --- HELPER COMPONENTS ---
// // // const LoadingSpinner = () => (
// // //   <div className="flex justify-center items-center py-20">
// // //     <Loader2 className="h-8 w-8 animate-spin text-primary" />
// // //   </div>
// // // );

// // // const ErrorDisplay = ({ message }: { message: string }) => (
// // //   <Alert variant="destructive">
// // //     <TriangleAlert className="h-4 w-4" />
// // //     <AlertTitle>Error</AlertTitle>
// // //     <AlertDescription>{message}</AlertDescription>
// // //   </Alert>
// // // );

// // // // Fungsi untuk menghitung durasi pinjam dalam hari
// // // const calculateDuration = (start: string, end: string) => {
// // //   const startDate = dayjs(start);
// // //   const endDate = dayjs(end);
// // //   return endDate.diff(startDate, 'day');
// // // };

// // // // Mapping status API ke Label UI
// // // const getStatusLabel = (status: string, dueAt: string) => {
// // //   // Logika sederhana: Jika status BORROWED tapi sudah lewat dueAt -> OVERDUE (Frontend logic)
// // //   // Atau gunakan status langsung dari API jika API sudah handle overdue.
// // //   const isOverdue = dayjs().isAfter(dayjs(dueAt)) && status === 'BORROWED';
  
// // //   if (status === 'RETURNED') return { label: 'Returned', color: 'bg-gray-100 text-gray-600 border-gray-200' };
// // //   if (isOverdue) return { label: 'Overdue', color: 'bg-red-50 text-red-600 border-red-200' };
// // //   return { label: 'Active', color: 'bg-green-50 text-green-600 border-green-200' };
// // // };

// // // export default function MyLoansPage() {
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [debouncedSearch, setDebouncedSearch] = useState('');
// // //   const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Returned', 'Overdue'
// // //   const [page, setPage] = useState(1);
// // //   const LIMIT = 20;

// // //   // Debounce search input
// // //   useEffect(() => {
// // //     const handler = setTimeout(() => {
// // //       setDebouncedSearch(searchQuery);
// // //       setPage(1); // Reset page on search
// // //     }, 500);
// // //     return () => clearTimeout(handler);
// // //   }, [searchQuery]);

// // //   // === FETCH DATA ===
// // //   const { data, isPending, isError, error } = useQuery<LoansResponse, Error>({
// // //     queryKey: ['my-loans', page, statusFilter, debouncedSearch],
// // //     queryFn: async () => {
// // //       const params: Record<string, any> = {
// // //         page,
// // //         limit: LIMIT,
// // //       };
      
// // //       // Mapping filter UI ke parameter API (jika API mendukung filter status/search)
// // //       // Catatan: Berdasarkan spesifikasi curl, API mendukung pagination. 
// // //       // Asumsi filter dilakukan di client-side jika API tidak mendukung parameter filter langsung,
// // //       // TAPI idealnya API mendukung `status` dan `search`.
// // //       // Di sini saya kirim parameter, jika API mengabaikan, filtering client-side bisa diterapkan pada `filteredLoans`
      
// // //       if (statusFilter !== 'All') {
// // //          // Mapping UI Status ke API Status value
// // //          if (statusFilter === 'Active') params.status = 'BORROWED';
// // //          if (statusFilter === 'Returned') params.status = 'RETURNED';
// // //          // Overdue biasanya BORROWED tapi lewat tanggal, logic server mungkin beda
// // //       }
      
// // //       if (debouncedSearch) {
// // //         params.search = debouncedSearch; // Asumsi API punya param search buku
// // //       }

// // //       const res = await apiClient.get('/me/loans', { params });
// // //       return res.data.data;
// // //     },
// // //   });

// // //   // Filter Logic (Client-side fallback jika API belum support filter kompleks)
// // //   const loans = data?.loans || [];
  
// // //   const filteredLoans = loans.filter(loan => {
// // //       // 1. Filter by Search (Client-side if needed)
// // //       const matchSearch = loan.Book.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      
// // //       // 2. Filter by Status Logic
// // //       const isOverdue = dayjs().isAfter(dayjs(loan.dueAt)) && loan.status === 'BORROWED';
      
// // //       if (statusFilter === 'Active') return loan.status === 'BORROWED' && !isOverdue;
// // //       if (statusFilter === 'Returned') return loan.status === 'RETURNED';
// // //       if (statusFilter === 'Overdue') return isOverdue;
      
// // //       return true; // 'All'
// // //   }).filter(loan => matchSearch); // Gabungkan filter pencarian


// // //   return (
// // //     <div className="space-y-8 min-h-screen pb-12">
      
// // //       {/* 1. Header & Title */}
// // //       <h1 style={TITLE_STYLE} className="text-left">Borrowed List</h1>

// // //       {/* 2. Search & Filter Bar */}
// // //       <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
// // //           {/* Search Box */}
// // //           <div className="relative" style={{ width: '544px', maxWidth: '100%' }}>
// // //               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
// // //                   <Search className="h-5 w-5 text-gray-400" />
// // //               </div>
// // //               <Input 
// // //                   type="text"
// // //                   placeholder="Search Book"
// // //                   className="pl-12 pr-4 h-[44px] rounded-full border-[#D5D7DA] bg-white focus-visible:ring-blue-500"
// // //                   value={searchQuery}
// // //                   onChange={(e) => setSearchQuery(e.target.value)}
// // //               />
// // //           </div>

// // //           {/* Status Filter Tabs */}
// // //           <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
// // //               {['All', 'Active', 'Returned', 'Overdue'].map((status) => (
// // //                   <Button
// // //                       key={status}
// // //                       variant={statusFilter === status ? 'default' : 'outline'}
// // //                       onClick={() => setStatusFilter(status)}
// // //                       className={`rounded-full h-9 px-4 font-medium transition-all ${
// // //                           statusFilter === status 
// // //                           ? 'bg-[#1C65DA] hover:bg-[#1C65DA]/90 text-white border-transparent' 
// // //                           : 'bg-white text-[#414651] border-[#D5D7DA] hover:bg-gray-50'
// // //                       }`}
// // //                   >
// // //                       {status}
// // //                   </Button>
// // //               ))}
// // //           </div>
// // //       </div>

// // //       {/* Content State */}
// // //       {isPending ? (
// // //           <LoadingSpinner />
// // //       ) : isError ? (
// // //           <ErrorDisplay message={error.message || "Gagal memuat daftar pinjaman."} />
// // //       ) : filteredLoans.length === 0 ? (
// // //           <p className="text-center text-muted-foreground py-12">Tidak ada buku yang ditemukan untuk filter ini.</p>
// // //       ) : (
// // //           /* 4. Loans Grid / List */
// // //           <div className="flex flex-col gap-6">
// // //               {filteredLoans.map((loan) => {
// // //                   const statusInfo = getStatusLabel(loan.status, loan.dueAt);
// // //                   const durationDays = calculateDuration(loan.borrowedAt, loan.dueAt);
                  
// // //                   return (
// // //                       <Card key={loan.id} className="p-0 overflow-hidden border border-[#D5D7DA] rounded-xl shadow-sm bg-white">
// // //                           {/* Header Status Bar */}
// // //                           <div className="px-6 py-4 flex justify-between items-center bg-gray-50/50 border-b border-[#D5D7DA]">
// // //                               <div className="flex items-center gap-3">
// // //                                   <Badge className={`rounded-full px-3 py-1 text-xs font-bold shadow-none ${statusInfo.color}`}>
// // //                                       {statusInfo.label.toUpperCase()}
// // //                                   </Badge>
// // //                                   <span className="text-sm text-[#414651] font-medium">
// // //                                       Due {dayjs(loan.dueAt).format('DD MMM YYYY')}
// // //                                   </span>
// // //                               </div>
// // //                               {/* Optional: Add Loan ID or extra info here */}
// // //                           </div>

// // //                           {/* Body Content */}
// // //                           <div className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                              
// // //                               {/* Book Cover */}
// // //                               <div className="shrink-0 w-[92px] h-[138px] bg-gray-200 rounded-md overflow-hidden shadow-sm flex items-center justify-center">
// // //                                   {loan.Book.coverImage ? (
// // //                                       <img 
// // //                                           src={loan.Book.coverImage} 
// // //                                           alt={loan.Book.title} 
// // //                                           className="w-full h-full object-cover" 
// // //                                       />
// // //                                   ) : (
// // //                                       <BookOpen className="w-8 h-8 text-gray-400" />
// // //                                   )}
// // //                               </div>

// // //                               {/* Details Column */}
// // //                               <div className="flex-1 flex flex-col gap-1 w-full text-center md:text-left">
// // //                                   {/* Category */}
// // //                                   <p className="text-sm font-bold text-[#0A0D12] uppercase tracking-wide">
// // //                                       {loan.Book.category?.name || 'GENERAL'}
// // //                                   </p>
                                  
// // //                                   {/* Title */}
// // //                                   <h3 className="text-xl font-bold text-[#0A0D12] leading-tight mb-1">
// // //                                       {loan.Book.title}
// // //                                   </h3>
                                  
// // //                                   {/* Author */}
// // //                                   <p className="text-base font-medium text-[#414651]">
// // //                                       {loan.Book.author?.name || 'Unknown Author'}
// // //                                   </p>

// // //                                   {/* Duration Info */}
// // //                                   <div className="mt-3 pt-3 border-t border-dashed border-gray-200 inline-flex items-center gap-2 text-[#0A0D12] font-bold text-base">
// // //                                        <span>{dayjs(loan.borrowedAt).format('DD MMM YYYY')}</span>
// // //                                        <span className="w-1 h-1 bg-gray-400 rounded-full mx-1"></span>
// // //                                        <span>Duration {durationDays} Days</span>
// // //                                   </div>
// // //                               </div>

// // //                               {/* Action Column (Right) */}
// // //                               <div className="shrink-0 flex flex-col justify-center h-full pt-2 md:pt-0">
// // //                                   <Button 
// // //                                       className="rounded-full font-semibold text-white shadow-none hover:opacity-90"
// // //                                       style={{ 
// // //                                           width: '182px', 
// // //                                           height: '40px', 
// // //                                           background: '#1C65DA' 
// // //                                       }}
// // //                                       onClick={() => {
// // //                                           // Navigasi ke halaman detail buku untuk review atau buka modal review
// // //                                           // navigate(`/books/${loan.bookId}#review`);
// // //                                           alert(`Give review for ${loan.Book.title}`);
// // //                                       }}
// // //                                   >
// // //                                       Give Review
// // //                                   </Button>
// // //                               </div>

// // //                           </div>
// // //                       </Card>
// // //                   );
// // //               })}
// // //           </div>
// // //       )}
      
// // //       {/* Pagination Controls bisa ditambahkan di sini jika diperlukan berdasarkan data.pagination */}
// // //     </div>
// // //   );
// // // }


// // import { useState, useEffect } from 'react';
// // import { useQuery } from '@tanstack/react-query';
// // import apiClient from '@/api';
// // import dayjs from 'dayjs';
// // import relativeTime from 'dayjs/plugin/relativeTime';
// // import { Loader2, Search, BookOpen, TriangleAlert } from 'lucide-react';

// // // Komponen UI
// // import { Button } from '@/components/ui/button';
// // import { Card } from '@/components/ui/card';
// // import { Input } from '@/components/ui/input';
// // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // import { Badge } from '@/components/ui/badge';

// // dayjs.extend(relativeTime);

// // // --- TIPE DATA ---
// // interface LoanBook {
// //   id: number;
// //   title: string;
// //   coverImage: string | null;
// //   Category?: { name: string }; 
// //   Author?: { name: string };
// // }

// // interface LoanItem {
// //   id: number;
// //   userId: number;
// //   bookId: number;
// //   status: 'BORROWED' | 'RETURNED' | 'OVERDUE'; 
// //   borrowedAt: string;
// //   dueAt: string;
// //   returnedAt: string | null;
// //   Book: LoanBook;
// // }

// // interface LoansResponse {
// //   loans: LoanItem[];
// //   pagination: {
// //     page: number;
// //     limit: number;
// //     total: number;
// //     totalPages: number;
// //   };
// // }

// // // --- STYLING CONSTANTS ---
// // const TITLE_STYLE = { 
// //   fontFamily: 'Inter, sans-serif', 
// //   fontWeight: 700, 
// //   fontSize: '1.875rem', // display-sm (~30px)
// //   lineHeight: '2.375rem', 
// //   letterSpacing: '-0.03em', 
// //   color: '#0A0D12' 
// // };

// // // --- HELPER COMPONENTS ---
// // const LoadingSpinner = () => (
// //   <div className="flex justify-center items-center py-20">
// //     <Loader2 className="h-8 w-8 animate-spin text-primary" />
// //   </div>
// // );

// // const ErrorDisplay = ({ message }: { message: string }) => (
// //   <Alert variant="destructive">
// //     <TriangleAlert className="h-4 w-4" />
// //     <AlertTitle>Error</AlertTitle>
// //     <AlertDescription>{message}</AlertDescription>
// //   </Alert>
// // );

// // // Fungsi untuk menghitung durasi pinjam dalam hari
// // const calculateDuration = (start: string, end: string) => {
// //   const startDate = dayjs(start);
// //   const endDate = dayjs(end);
// //   return endDate.diff(startDate, 'day');
// // };

// // // Mapping status API ke Label UI
// // const getStatusLabel = (status: string, dueAt: string) => {
// //   const isOverdue = dayjs().isAfter(dayjs(dueAt)) && status === 'BORROWED';
  
// //   if (status === 'RETURNED') return { label: 'Returned', color: 'bg-gray-100 text-gray-600 border-gray-200' };
// //   if (isOverdue) return { label: 'Overdue', color: 'bg-red-50 text-red-600 border-red-200' };
// //   return { label: 'Active', color: 'bg-green-50 text-green-600 border-green-200' };
// // };

// // export default function MyLoansPage() {
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [debouncedSearch, setDebouncedSearch] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Returned', 'Overdue'
// //   const [page, setPage] = useState(1);
// //   const LIMIT = 20;

// //   // Debounce search input
// //   useEffect(() => {
// //     const handler = setTimeout(() => {
// //       setDebouncedSearch(searchQuery);
// //       setPage(1); // Reset page on search
// //     }, 500);
// //     return () => clearTimeout(handler);
// //   }, [searchQuery]);

// //   // === FETCH DATA ===
// //   const { data, isPending, isError, error } = useQuery<LoansResponse, Error>({
// //     queryKey: ['my-loans', page, statusFilter, debouncedSearch],
// //     queryFn: async () => {
// //       // Menggunakan Record<string, string | number> untuk tipe params yang lebih aman
// //       const params: Record<string, string | number> = {
// //         page,
// //         limit: LIMIT,
// //       };
      
// //       if (statusFilter !== 'All') {
// //          if (statusFilter === 'Active') params.status = 'BORROWED';
// //          if (statusFilter === 'Returned') params.status = 'RETURNED';
// //       }
      
// //       if (debouncedSearch) {
// //         params.search = debouncedSearch;
// //       }

// //       const res = await apiClient.get('/me/loans', { params });
// //       return res.data.data;
// //     },
// //   });

// //   // Filter Logic Client-side
// //   const loans = data?.loans || [];
  
// //   const filteredLoans = loans.filter(loan => {
// //       // 1. Filter by Search
// //       const matchSearch = loan.Book.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      
// //       // 2. Filter by Status Logic
// //       const isOverdue = dayjs().isAfter(dayjs(loan.dueAt)) && loan.status === 'BORROWED';
      
// //       let matchStatus = true;
// //       if (statusFilter === 'Active') matchStatus = loan.status === 'BORROWED' && !isOverdue;
// //       else if (statusFilter === 'Returned') matchStatus = loan.status === 'RETURNED';
// //       else if (statusFilter === 'Overdue') matchStatus = isOverdue;
      
// //       return matchStatus && matchSearch;
// //   });


// //   return (
// //     <div className="space-y-8 min-h-screen pb-12">
      
// //       {/* 1. Header & Title */}
// //       <h1 style={TITLE_STYLE} className="text-left">Borrowed List</h1>

// //       {/* 2. Search & Filter Bar */}
// //       <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
// //           {/* Search Box */}
// //           <div className="relative" style={{ width: '544px', maxWidth: '100%' }}>
// //               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
// //                   <Search className="h-5 w-5 text-gray-400" />
// //               </div>
// //               <Input 
// //                   type="text"
// //                   placeholder="Search Book"
// //                   className="pl-12 pr-4 h-11 rounded-full border-[#D5D7DA] bg-white focus-visible:ring-blue-500" // Changed h-[44px] to h-11
// //                   value={searchQuery}
// //                   onChange={(e) => setSearchQuery(e.target.value)}
// //               />
// //           </div>

// //           {/* Status Filter Tabs */}
// //           <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
// //               {['All', 'Active', 'Returned', 'Overdue'].map((status) => (
// //                   <Button
// //                       key={status}
// //                       variant={statusFilter === status ? 'default' : 'outline'}
// //                       onClick={() => setStatusFilter(status)}
// //                       className={`rounded-full h-9 px-4 font-medium transition-all ${
// //                           statusFilter === status 
// //                           ? 'bg-[#1C65DA] hover:bg-[#1C65DA]/90 text-white border-transparent' 
// //                           : 'bg-white text-[#414651] border-[#D5D7DA] hover:bg-gray-50'
// //                       }`}
// //                   >
// //                       {status}
// //                   </Button>
// //               ))}
// //           </div>
// //       </div>

// //       {/* Content State */}
// //       {isPending ? (
// //           <LoadingSpinner />
// //       ) : isError ? (
// //           <ErrorDisplay message={error.message || "Gagal memuat daftar pinjaman."} />
// //       ) : filteredLoans.length === 0 ? (
// //           <p className="text-center text-muted-foreground py-12">Tidak ada buku yang ditemukan untuk filter ini.</p>
// //       ) : (
// //           /* 4. Loans Grid / List */
// //           <div className="flex flex-col gap-6">
// //               {filteredLoans.map((loan) => {
// //                   const statusInfo = getStatusLabel(loan.status, loan.dueAt);
// //                   const durationDays = calculateDuration(loan.borrowedAt, loan.dueAt);
                  
// //                   return (
// //                       <Card key={loan.id} className="p-0 overflow-hidden border border-[#D5D7DA] rounded-xl shadow-sm bg-white">
// //                           {/* Header Status Bar */}
// //                           <div className="px-6 py-4 flex justify-between items-center bg-gray-50/50 border-b border-[#D5D7DA]">
// //                               <div className="flex items-center gap-3">
// //                                   <Badge className={`rounded-full px-3 py-1 text-xs font-bold shadow-none ${statusInfo.color}`}>
// //                                       {statusInfo.label.toUpperCase()}
// //                                   </Badge>
// //                                   <span className="text-sm text-[#414651] font-medium">
// //                                       Due {dayjs(loan.dueAt).format('DD MMM YYYY')}
// //                                   </span>
// //                               </div>
// //                           </div>

// //                           {/* Body Content */}
// //                           <div className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                              
// //                               {/* Book Cover */}
// //                               <div className="shrink-0 w-[92px] h-[138px] bg-gray-200 rounded-md overflow-hidden shadow-sm flex items-center justify-center">
// //                                   {loan.Book.coverImage ? (
// //                                       <img 
// //                                           src={loan.Book.coverImage} 
// //                                           alt={loan.Book.title} 
// //                                           className="w-full h-full object-cover" 
// //                                       />
// //                                   ) : (
// //                                       <BookOpen className="w-8 h-8 text-gray-400" />
// //                                   )}
// //                               </div>

// //                               {/* Details Column */}
// //                               <div className="flex-1 flex flex-col gap-1 w-full text-center md:text-left">
// //                                   {/* Category */}
// //                                   <p className="text-sm font-bold text-[#0A0D12] uppercase tracking-wide">
// //                                       {loan.Book.Category?.name || 'GENERAL'}
// //                                   </p>
                                  
// //                                   {/* Title */}
// //                                   <h3 className="text-xl font-bold text-[#0A0D12] leading-tight mb-1">
// //                                       {loan.Book.title}
// //                                   </h3>
                                  
// //                                   {/* Author */}
// //                                   <p className="text-base font-medium text-[#414651]">
// //                                       {loan.Book.Author?.name || 'Unknown Author'}
// //                                   </p>

// //                                   {/* Duration Info */}
// //                                   <div className="mt-3 pt-3 border-t border-dashed border-gray-200 inline-flex items-center gap-2 text-[#0A0D12] font-bold text-base">
// //                                        <span>{dayjs(loan.borrowedAt).format('DD MMM YYYY')}</span>
// //                                        <span className="w-1 h-1 bg-gray-400 rounded-full mx-1"></span>
// //                                        <span>Duration {durationDays} Days</span>
// //                                   </div>
// //                               </div>

// //                               {/* Action Column (Right) */}
// //                               <div className="shrink-0 flex flex-col justify-center h-full pt-2 md:pt-0">
// //                                   <Button 
// //                                       className="rounded-full font-semibold text-white shadow-none hover:opacity-90"
// //                                       style={{ 
// //                                           width: '182px', 
// //                                           height: '40px', 
// //                                           background: '#1C65DA' 
// //                                       }}
// //                                       onClick={() => {
// //                                           alert(`Give review for ${loan.Book.title}`);
// //                                       }}
// //                                   >
// //                                       Give Review
// //                                   </Button>
// //                               </div>

// //                           </div>
// //                       </Card>
// //                   );
// //               })}
// //           </div>
// //       )}
// //     </div>
// //   );
// // }



// import { useState, useEffect, useMemo } from 'react';
// import { useQuery, useQueries } from '@tanstack/react-query';
// import apiClient from '@/api';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import { Loader2, Search, BookOpen, TriangleAlert } from 'lucide-react';

// // Komponen UI
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Badge } from '@/components/ui/badge';

// dayjs.extend(relativeTime);

// // --- TIPE DATA ---
// interface LoanBook {
//   id: number;
//   title: string;
//   coverImage: string | null;
//   // Category & Author might be missing in loan list, so we fetch details
// }

// interface LoanItem {
//   id: number;
//   userId: number;
//   bookId: number;
//   status: 'BORROWED' | 'RETURNED' | 'OVERDUE'; 
//   borrowedAt: string;
//   dueAt: string;
//   returnedAt: string | null;
//   Book: LoanBook;
// }

// interface LoansResponse {
//   loans: LoanItem[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// // Tipe data untuk detail buku dari API /books/:id
// interface BookDetailResponse {
//   id: number;
//   title: string;
//   Author: {
//     id: number;
//     name: string;
//   };
//   Category: {
//     id: number;
//     name: string;
//   };
// }

// // --- STYLING CONSTANTS ---
// const TITLE_STYLE = { 
//   fontFamily: 'Inter, sans-serif', 
//   fontWeight: 700, 
//   fontSize: '1.875rem', // display-sm (~30px)
//   lineHeight: '2.375rem', 
//   letterSpacing: '-0.03em', 
//   color: '#0A0D12' 
// };

// // --- HELPER COMPONENTS ---
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center py-20">
//     <Loader2 className="h-8 w-8 animate-spin text-primary" />
//   </div>
// );

// const ErrorDisplay = ({ message }: { message: string }) => (
//   <Alert variant="destructive">
//     <TriangleAlert className="h-4 w-4" />
//     <AlertTitle>Error</AlertTitle>
//     <AlertDescription>{message}</AlertDescription>
//   </Alert>
// );

// // Fungsi untuk menghitung durasi pinjam dalam hari
// const calculateDuration = (start: string, end: string) => {
//   const startDate = dayjs(start);
//   const endDate = dayjs(end);
//   return endDate.diff(startDate, 'day');
// };

// // Mapping status API ke Label UI
// const getStatusLabel = (status: string, dueAt: string) => {
//   const isOverdue = dayjs().isAfter(dayjs(dueAt)) && status === 'BORROWED';
  
//   if (status === 'RETURNED') return { label: 'Returned', color: 'bg-gray-100 text-gray-600 border-gray-200' };
//   if (isOverdue) return { label: 'Overdue', color: 'bg-red-50 text-red-600 border-red-200' };
//   return { label: 'Active', color: 'bg-green-50 text-green-600 border-green-200' };
// };

// export default function MyLoansPage() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Returned', 'Overdue'
//   const [page, setPage] = useState(1);
//   const LIMIT = 20;

//   // Debounce search input
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//       setPage(1); // Reset page on search
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [searchQuery]);

//   // === 1. FETCH LOANS DATA ===
//   const { data, isPending, isError, error } = useQuery<LoansResponse, Error>({
//     queryKey: ['my-loans', page, statusFilter, debouncedSearch],
//     queryFn: async () => {
//       const params: Record<string, string | number> = {
//         page,
//         limit: LIMIT,
//       };
      
//       if (statusFilter !== 'All') {
//          if (statusFilter === 'Active') params.status = 'BORROWED';
//          if (statusFilter === 'Returned') params.status = 'RETURNED';
//       }
      
//       if (debouncedSearch) {
//         params.search = debouncedSearch;
//       }

//       const res = await apiClient.get('/me/loans', { params });
//       return res.data.data;
//     },
//   });

//   const loans = data?.loans || [];

//   // === 2. FETCH BOOK DETAILS (Author & Category) PARALLEL ===
//   // Get unique book IDs from the loans list
//   const bookIds = useMemo(() => {
//     return Array.from(new Set(loans.map((loan) => loan.bookId)));
//   }, [loans]);

//   // Use useQueries to fetch details for each book
//   const bookDetailQueries = useQueries({
//     queries: bookIds.map((id) => ({
//       queryKey: ['book-detail', id],
//       queryFn: async () => {
//         const res = await apiClient.get(`/books/${id}`);
//         return res.data.data as BookDetailResponse;
//       },
//       staleTime: 1000 * 60 * 5, // Cache for 5 minutes
//       enabled: bookIds.length > 0,
//     })),
//   });

//   // Create a Map for quick access to book details by ID
//   const bookDetailsMap = useMemo(() => {
//     const map = new Map<number, BookDetailResponse>();
//     bookDetailQueries.forEach((result) => {
//       if (result.data) {
//         map.set(result.data.id, result.data);
//       }
//     });
//     return map;
//   }, [bookDetailQueries]);


//   // Filter Logic Client-side (Additional filtering if API params aren't fully sufficient)
//   const filteredLoans = loans.filter(loan => {
//       // 1. Filter by Search
//       const matchSearch = loan.Book.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      
//       // 2. Filter by Status Logic
//       const isOverdue = dayjs().isAfter(dayjs(loan.dueAt)) && loan.status === 'BORROWED';
      
//       let matchStatus = true;
//       if (statusFilter === 'Active') matchStatus = loan.status === 'BORROWED' && !isOverdue;
//       else if (statusFilter === 'Returned') matchStatus = loan.status === 'RETURNED';
//       else if (statusFilter === 'Overdue') matchStatus = isOverdue;
      
//       return matchStatus && matchSearch;
//   });


//   return (
//     <div className="space-y-8 min-h-screen pb-12">
      
//       {/* 1. Header & Title */}
//       <h1 style={TITLE_STYLE} className="text-left">Borrowed List</h1>

//       {/* 2. Search & Filter Bar */}
//       <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
//           {/* Search Box */}
//           <div className="relative" style={{ width: '544px', maxWidth: '100%' }}>
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <Input 
//                   type="text"
//                   placeholder="Search Book"
//                   className="pl-12 pr-4 h-11 rounded-full border-[#D5D7DA] bg-white focus-visible:ring-blue-500"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//               />
//           </div>

//           {/* Status Filter Tabs */}
//           <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
//               {['All', 'Active', 'Returned', 'Overdue'].map((status) => (
//                   <Button
//                       key={status}
//                       variant={statusFilter === status ? 'default' : 'outline'}
//                       onClick={() => setStatusFilter(status)}
//                       className={`rounded-full h-9 px-4 font-medium transition-all ${
//                           statusFilter === status 
//                           ? 'bg-[#1C65DA] hover:bg-[#1C65DA]/90 text-white border-transparent' 
//                           : 'bg-white text-[#414651] border-[#D5D7DA] hover:bg-gray-50'
//                       }`}
//                   >
//                       {status}
//                   </Button>
//               ))}
//           </div>
//       </div>

//       {/* Content State */}
//       {isPending ? (
//           <LoadingSpinner />
//       ) : isError ? (
//           <ErrorDisplay message={error.message || "Gagal memuat daftar pinjaman."} />
//       ) : filteredLoans.length === 0 ? (
//           <p className="text-center text-muted-foreground py-12">Tidak ada buku yang ditemukan untuk filter ini.</p>
//       ) : (
//           /* 4. Loans Grid / List */
//           <div className="flex flex-col gap-6">
//               {filteredLoans.map((loan) => {
//                   const statusInfo = getStatusLabel(loan.status, loan.dueAt);
//                   const durationDays = calculateDuration(loan.borrowedAt, loan.dueAt);
                  
//                   // Get detailed book info (Author & Category) from the map
//                   const bookDetail = bookDetailsMap.get(loan.bookId);
//                   const authorName = bookDetail?.Author?.name || 'Unknown Author';
//                   const categoryName = bookDetail?.Category?.name || 'GENERAL';

//                   return (
//                       <Card key={loan.id} className="p-0 overflow-hidden border border-[#D5D7DA] rounded-xl shadow-sm bg-white">
//                           {/* Header Status Bar */}
//                           <div className="px-6 py-4 flex justify-between items-center bg-gray-50/50 border-b border-[#D5D7DA]">
//                               <div className="flex items-center gap-3 font-bold"> Status
//                                   <Badge className={`rounded-full px-3 py-1 text-xs font-bold shadow-none ${statusInfo.color}`}>
//                                       {statusInfo.label.toUpperCase()}
//                                   </Badge>
//                                   <div className=" text-sm text-[#414651] font-medium ">
//                                       Due Date {dayjs(loan.dueAt).format('DD MMM YYYY')}
//                                   </div>
//                               </div>
//                           </div>

//                           {/* Body Content */}
//                           <div className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                              
//                               {/* Book Cover */}
//                               <div className="shrink-0 w-[92px] h-[138px] bg-gray-200 rounded-md overflow-hidden shadow-sm flex items-center justify-center">
//                                   {loan.Book.coverImage ? (
//                                       <img 
//                                           src={loan.Book.coverImage} 
//                                           alt={loan.Book.title} 
//                                           className="w-full h-full object-cover" 
//                                       />
//                                   ) : (
//                                       <BookOpen className="w-8 h-8 text-gray-400" />
//                                   )}
//                               </div>

//                               {/* Details Column */}
//                               <div className="flex-1 flex flex-col gap-1 w-full text-center md:text-left">
//                                   {/* Category from fetched detail */}
//                                   <p className="text-sm font-bold text-[#0A0D12] uppercase tracking-wide">
//                                       {categoryName}
//                                   </p>
                                  
//                                   {/* Title */}
//                                   <h3 className="text-xl font-bold text-[#0A0D12] leading-tight mb-1">
//                                       {loan.Book.title}
//                                   </h3>
                                  
//                                   {/* Author from fetched detail */}
//                                   <p className="text-base font-medium text-[#414651]">
//                                       {authorName}
//                                   </p>

//                                   {/* Duration Info */}
//                                   <div className="mt-3 pt-3 border-t border-dashed border-gray-200 inline-flex items-center gap-2 text-[#0A0D12] font-bold text-base">
//                                        <span>{dayjs(loan.borrowedAt).format('DD MMM YYYY')}</span>
//                                        <span className="w-1 h-1 bg-gray-400 rounded-full mx-1"></span>
//                                        <span>Duration {durationDays} Days</span>
//                                   </div>
//                               </div>

//                               {/* Action Column (Right) */}
//                               <div className="shrink-0 flex flex-col justify-center h-full pt-2 md:pt-0">
//                                   <Button 
//                                       className="rounded-full font-semibold text-white shadow-none hover:opacity-90"
//                                       style={{ 
//                                           width: '182px', 
//                                           height: '40px', 
//                                           background: '#1C65DA' 
//                                       }}
//                                       onClick={() => {
//                                           alert(`Give review for ${loan.Book.title}`);
//                                       }}
//                                   >
//                                       Give Review
//                                   </Button>
//                               </div>

//                           </div>
//                       </Card>
//                   );
//               })}
//           </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router-dom';
import apiClient from '@/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Loader2, Search, BookOpen, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

// Komponen UI
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

dayjs.extend(relativeTime);

// --- TIPE DATA ---
interface LoanBook {
  id: number;
  title: string;
  coverImage: string | null;
  // Category & Author might be missing in loan list, so we fetch details
}

interface LoanItem {
  id: number;
  userId: number;
  bookId: number;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE'; 
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  Book: LoanBook;
}

interface LoansResponse {
  loans: LoanItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipe data untuk detail buku dari API /books/:id
interface BookDetailResponse {
  id: number;
  title: string;
  Author: {
    id: number;
    name: string;
  };
  Category: {
    id: number;
    name: string;
  };
}

// --- STYLING CONSTANTS ---
const TITLE_STYLE = { 
  fontFamily: 'Inter, sans-serif', 
  fontWeight: 700, 
  fontSize: '1.875rem', // display-sm (~30px)
  lineHeight: '2.375rem', 
  letterSpacing: '-0.03em', 
  color: '#0A0D12' 
};


const SHADOW_STYLE = { boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)' }; 


// --- HELPER COMPONENTS ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <TriangleAlert className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

// Fungsi untuk menghitung durasi pinjam dalam hari
const calculateDuration = (start: string, end: string) => {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  return endDate.diff(startDate, 'day');
};

// Mapping status API ke Label UI
const getStatusLabel = (status: string, dueAt: string) => {
  const isOverdue = dayjs().isAfter(dayjs(dueAt)) && status === 'BORROWED';
  
  if (status === 'RETURNED') return { label: 'Returned', color: 'bg-gray-100 text-gray-600 border-gray-200' };
  if (isOverdue) return { label: 'Overdue', color: 'bg-red-50 text-red-600 border-red-200' };
  return { label: 'Active', color: 'bg-green-50 text-green-600 border-green-200' };
};

export default function MyLoansPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Returned', 'Overdue'
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // === 1. FETCH LOANS DATA ===
  const { data, isPending, isError, error } = useQuery<LoansResponse, Error>({
    queryKey: ['my-loans', page, statusFilter, debouncedSearch],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page,
        limit: LIMIT,
      };
      
      if (statusFilter !== 'All') {
         if (statusFilter === 'Active') params.status = 'BORROWED';
         if (statusFilter === 'Returned') params.status = 'RETURNED';
      }
      
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const res = await apiClient.get('/me/loans', { params });
      return res.data.data;
    },
  });

  const loans = data?.loans || [];

  // === 2. FETCH BOOK DETAILS (Author & Category) PARALLEL ===
  // Get unique book IDs from the loans list
  const bookIds = useMemo(() => {
    return Array.from(new Set(loans.map((loan) => loan.bookId)));
  }, [loans]);

  // Use useQueries to fetch details for each book
  const bookDetailQueries = useQueries({
    queries: bookIds.map((id) => ({
      queryKey: ['book-detail', id],
      queryFn: async () => {
        const res = await apiClient.get(`/books/${id}`);
        return res.data.data as BookDetailResponse;
      },
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      enabled: bookIds.length > 0,
    })),
  });

  // Create a Map for quick access to book details by ID
  const bookDetailsMap = useMemo(() => {
    const map = new Map<number, BookDetailResponse>();
    bookDetailQueries.forEach((result) => {
      if (result.data) {
        map.set(result.data.id, result.data);
      }
    });
    return map;
  }, [bookDetailQueries]);


  // Filter Logic Client-side (Additional filtering if API params aren't fully sufficient)
  const filteredLoans = loans.filter(loan => {
      // 1. Filter by Search
      const matchSearch = loan.Book.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      // 2. Filter by Status Logic
      const isOverdue = dayjs().isAfter(dayjs(loan.dueAt)) && loan.status === 'BORROWED';
      
      let matchStatus = true;
      if (statusFilter === 'Active') matchStatus = loan.status === 'BORROWED' && !isOverdue;
      else if (statusFilter === 'Returned') matchStatus = loan.status === 'RETURNED';
      else if (statusFilter === 'Overdue') matchStatus = isOverdue;
      
      return matchStatus && matchSearch;
  });


const TABS = [
  { name: 'Profile', path: '/profile' },
  { name: 'Borrowed List', path: '/my-loans' },
  { name: 'Review', path: '/profile?tab=reviews' },
];

// 1. Komponen Navigation Box
const NavigationBox = () => {
    const location = useLocation();
    
    const isActive = (path: string) => {
        return location.pathname + location.search === path;
    };
    
    return (
        <div 
            className="flex gap-2 p-2 rounded-xl shrink-0" 
            style={{ width: '557px', height: '56px', background: '#F5F5F5', gap: '8px' }}
        >
            {TABS.map((tab) => {
                const active = isActive(tab.path);
                
                return (
                    <Link
                        key={tab.name}
                        to={tab.path}
                        className="flex-1"
                    >
                        <Button
                            asChild
                            variant={active ? 'default' : 'ghost'}
                            className={cn(
                                "w-full h-full rounded-xl text-base font-bold text-[#0A0D12]",
                                "hover:bg-white hover:text-[#0A0D12]",
                                active && "bg-white text-[#0A0D12] hover:bg-white",
                            )}
                            style={active ? SHADOW_STYLE : {}}
                        >
                             <span>{tab.name}</span>
                        </Button>
                    </Link>
                );
            })}
        </div>
    );
};





  
  return (
    <div className="space-y-8 min-h-screen pb-12">

       {/* 1. Navigation Box */}
      <NavigationBox />
      
      {/* 1. Header & Title */}
      <h1 style={TITLE_STYLE} className="text-left">Borrowed List</h1>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
          {/* Search Box */}
          <div className="relative" style={{ width: '544px', maxWidth: '100%' }}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                  type="text"
                  placeholder="Search Book"
                  className="pl-12 pr-4 h-11 rounded-full border-[#D5D7DA] bg-white focus-visible:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {['All', 'Active', 'Returned', 'Overdue'].map((status) => (
                  <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-full h-9 px-4 font-medium transition-all ${
                          statusFilter === status 
                          ? 'bg-[#1C65DA] hover:bg-[#1C65DA]/90 text-white border-transparent' 
                          : 'bg-white text-[#414651] border-[#D5D7DA] hover:bg-gray-50'
                      }`}
                  >
                      {status}
                  </Button>
              ))}
          </div>
      </div>

      {/* Content State */}
      {isPending ? (
          <LoadingSpinner />
      ) : isError ? (
          <ErrorDisplay message={error.message || "Gagal memuat daftar pinjaman."} />
      ) : filteredLoans.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Tidak ada buku yang ditemukan untuk filter ini.</p>
      ) : (
          /* 4. Loans Grid / List */
          <div className="flex flex-col gap-6">
              {filteredLoans.map((loan) => {
                  const statusInfo = getStatusLabel(loan.status, loan.dueAt);
                  const durationDays = calculateDuration(loan.borrowedAt, loan.dueAt);
                  
                  // Get detailed book info (Author & Category) from the map
                  const bookDetail = bookDetailsMap.get(loan.bookId);
                  const authorName = bookDetail?.Author?.name || 'Unknown Author';
                  const categoryName = bookDetail?.Category?.name || 'GENERAL';

                  return (
                      <Card key={loan.id} className="p-0 overflow-hidden border border-[#D5D7DA] rounded-xl shadow-sm bg-white">
                          {/* Header Status Bar */}
                          <div className="px-6 py-4 flex justify-between items-center bg-gray-50/50 border-b border-[#D5D7DA]">
                              <div className="flex items-center gap-3 font-bold w-full"> 
                                  Status
                                  <Badge className={`rounded-full px-3 py-1 text-xs font-bold shadow-none ${statusInfo.color}`}>
                                      {statusInfo.label.toUpperCase()}
                                  </Badge>
                                  {/* ml-auto pushes the Due Date to the right */}
                                  <div className="ml-auto text-sm text-[#414651] font-medium">
                                      Due Date {dayjs(loan.dueAt).format('DD MMM YYYY')}
                                  </div>
                              </div>
                          </div>

                          {/* Body Content */}
                          <div className="p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                              
                              {/* Book Cover */}
                              <div className="shrink-0 w-[92px] h-[138px] bg-gray-200 rounded-md overflow-hidden shadow-sm flex items-center justify-center">
                                  {loan.Book.coverImage ? (
                                      <img 
                                          src={loan.Book.coverImage} 
                                          alt={loan.Book.title} 
                                          className="w-full h-full object-cover" 
                                      />
                                  ) : (
                                      <BookOpen className="w-8 h-8 text-gray-400" />
                                  )}
                              </div>

                              {/* Details Column */}
                              <div className="flex-1 flex flex-col gap-1 w-full text-center md:text-left">
                                  {/* Category from fetched detail */}
                                  <p className="text-sm font-bold text-[#0A0D12] uppercase tracking-wide">
                                      {categoryName}
                                  </p>
                                  
                                  {/* Title */}
                                  <h3 className="text-xl font-bold text-[#0A0D12] leading-tight mb-1">
                                      {loan.Book.title}
                                  </h3>
                                  
                                  {/* Author from fetched detail */}
                                  <p className="text-base font-medium text-[#414651]">
                                      {authorName}
                                  </p>

                                  {/* Duration Info */}
                                  <div className="mt-3 pt-3 border-t border-dashed border-gray-200 inline-flex items-center gap-2 text-[#0A0D12] font-bold text-base">
                                       <span>{dayjs(loan.borrowedAt).format('DD MMM YYYY')}</span>
                                       <span className="w-1 h-1 bg-gray-400 rounded-full mx-1"></span>
                                       <span>Duration {durationDays} Days</span>
                                  </div>
                              </div>

                              {/* Action Column (Right) */}
                              <div className="shrink-0 flex flex-col justify-center h-full pt-2 md:pt-0">
                                  <Button 
                                      className="rounded-full font-semibold text-white shadow-none hover:opacity-90"
                                      style={{ 
                                          width: '182px', 
                                          height: '40px', 
                                          background: '#1C65DA' 
                                      }}
                                      onClick={() => {
                                          alert(`Give review for ${loan.Book.title}`);
                                      }}
                                  >
                                      Give Review
                                  </Button>
                              </div>

                          </div>
                      </Card>
                  );
              })}
          </div>
      )}
    </div>
  );
}