// // src/store/slices/authSlice.ts

// import { createSlice, type PayloadAction } from '@reduxjs/toolkit'; // <--- Perbaikan 'type' sudah di sini
// import type { RootState } from '../store';

// // Definisikan tipe untuk data user Anda
// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// // Definisikan tipe untuk state auth
// interface AuthState {
//   user: User | null;
//   token: string | null;
// }

// // Ambil token dari localStorage jika ada, untuk persistensi login
// const initialState: AuthState = {
//   user: null,
//   token: localStorage.getItem('token') || null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     // Action untuk menyimpan kredensial (token & user) setelah login
//     setCredentials(
//       state,
//       action: PayloadAction<{ user: User; token: string }>
//     ) {
//       const { user, token } = action.payload;
//       state.user = user;
//       state.token = token;
//       // Simpan token ke localStorage untuk persistensi
//       localStorage.setItem('token', token);
//     },
//     // Action untuk logout
//     logOut(state) {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem('token');
//     },
//   },
// });

// export const { setCredentials, logOut } = authSlice.actions;

// export default authSlice.reducer;

// // Selector untuk mengambil data dari state dengan mudah
// export const selectCurrentUser = (state: RootState) => state.auth.user;
// export const selectCurrentToken = (state: RootState) => state.auth.token;


import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Definisikan tipe untuk data user Anda
interface User {
  id: number; // <- Diubah dari string
  name: string;
  email: string;
  role: string; // <- Ditambahkan
}

// Definisikan tipe untuk state auth
interface AuthState {
  user: User | null;
  token: string | null;
}

// Ambil token dari localStorage jika ada, untuk persistensi login
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action untuk menyimpan kredensial (token & user) setelah login
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      // Simpan token ke localStorage untuk persistensi
      localStorage.setItem('token', token);
    },
    // Action untuk logout
    logOut(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

// Selector untuk mengambil data dari state dengan mudah
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;