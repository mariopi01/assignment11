// import axios from 'axios';
// import { store } from '../store/store'; // Impor store Redux

// // Ganti dengan URL API Anda yang sebenarnya
// const API_BASE_URL = 'https://api.yourlibrary.com/v1';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
// });

// // Interceptor: Dijalankan sebelum SETIAP request dikirim
// apiClient.interceptors.request.use(
//   (config) => {
//     // Ambil token dari Redux state
//     const token = store.getState().auth.token;
    
//     // Jika token ada, tambahkan ke header Authorization
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default apiClient;


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