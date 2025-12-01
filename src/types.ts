
// Tipe untuk data User (dari authSlice)
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Tipe untuk Author dan Category (yang dikirim API)
export interface Author {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

// Tipe untuk Buku (daftar)
export interface Book {
  id: string;
  title: string;
  author: Author; 
  category: Category; 
  coverImage: string | null;
  stock: number;
  // Menambahkan properti lain dari API untuk kelengkapan
  availableCopies: number; 
  rating: number;
}

// Tipe untuk Review
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO string date
}

// Tipe untuk Detail Buku (termasuk review)
export interface BookDetail extends Book {
  description: string;
  Reviews: Review[];
  // API Detail Buku mengirim author/category lengkap
  Author: Author & { bio: string };
  Category: Category;
}

// Tipe untuk Pinjaman
export interface Loan {
  id: string;
  bookTitle: string;
  status: 'BORROWED' | 'RETURNED';
  borrowedAt: string; // ISO string date
  dueDate: string; // ISO string date
  returnedAt?: string; // ISO string date
}