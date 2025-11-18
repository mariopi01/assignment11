// // Tipe untuk data User (dari authSlice)
// export interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// // Tipe untuk Buku (daftar)
// export interface Book {
//   id: string;
//   title: string;
//   author: string;
//   category: string;
//   coverImageUrl: string;
//   stock: number;
// }

// // Tipe untuk Review
// export interface Review {
//   id: string;
//   userId: string;
//   userName: string;
//   rating: number;
//   comment: string;
//   createdAt: string; // ISO string date
// }

// // Tipe untuk Detail Buku (termasuk review)
// export interface BookDetail extends Book {
//   description: string;
//   reviews: Review[];
// }

// // Tipe untuk Pinjaman
// export interface Loan {
//   id: string;
//   bookTitle: string;
//   status: 'BORROWED' | 'RETURNED';
//   borrowedAt: string; // ISO string date
//   dueDate: string; // ISO string date
//   returnedAt?: string; // ISO string date
// }



// Tipe untuk data User (dari authSlice)
export interface User {
  id: number; // <- Diubah dari string
  name: string;
  email: string;
  role: string; // <- Ditambahkan
}

// Tipe untuk Buku (daftar)
export interface Book {
// ... (sisa tipe data)
  id: string;
  title: string;
  author: string;
  category: string;
  coverImageUrl: string;
  stock: number;
}

// Tipe untuk Review
export interface Review {
// ... (sisa tipe data)
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO string date
}

// Tipe untuk Detail Buku (termasuk review)
export interface BookDetail extends Book {
// ... (sisa tipe data)
  description: string;
  reviews: Review[];
}

// Tipe untuk Pinjaman
export interface Loan {
// ... (sisa tipe data)
  id: string;
  bookTitle: string;
  status: 'BORROWED' | 'RETURNED';
  borrowedAt: string; // ISO string date
  dueDate: string; // ISO string date
  returnedAt?: string; // ISO string date
}