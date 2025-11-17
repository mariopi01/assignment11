// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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


import axios from 'axios';
import { store } from '../store/store'; // Impor store Redux
import type { RootState } from '../store/store'; // <--- 1. TAMBAHKAN IMPORT TIPE INI


// Ganti dengan URL API Anda yang sebenarnya
const API_BASE_URL = 'https://api.yourlibrary.com/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor: Dijalankan sebelum SETIAP request dikirim
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari Redux state
    const state = store.getState() as RootState; // <--- 2. CASTING STATE KE ROOTSTATE
    const token = state.auth.token; // <--- 3. SEKARANG 'state' DIKENALI

    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
export const { setCredentials, logOut } = authSlice.actions;