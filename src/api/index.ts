
// // import axios from 'axios';
// // import { store } from '../store/store'; // Impor store Redux
// // import type { RootState } from '../store/store'; // <--- 1. TAMBAHKAN IMPORT TIPE INI

// // // Ganti dengan URL API Anda yang sebenarnya
// // const API_BASE_URL = 'https://be-library-api-xh3x6c5iiq-et.a.run.app/api';

// // const apiClient = axios.create({
// //   baseURL: API_BASE_URL,
// // });

// // // Interceptor: Dijalankan sebelum SETIAP request dikirim
// // apiClient.interceptors.request.use(
// //   (config) => {
// //     // Ambil token dari Redux state
// //     const state = store.getState() as RootState; // <--- 2. CASTING STATE KE ROOTSTATE
// //     const token = state.auth.token; // <--- 3. SEKARANG 'state' DIKENALI

// //     // Jika token ada, tambahkan ke header Authorization
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// // export default apiClient;


// import axios from 'axios';
// import { store } from '../store/store'; // Impor store Redux
// import type { RootState } from '../store/store'; // <--- 1. TAMBAHKAN IMPORT TIPE INI

// // Ganti dengan URL API Anda yang sebenarnya
// const API_BASE_URL = 'https://be-library-api-xh3x6c5iiq-et.a.run.app/api';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
// });

// // Interceptor: Dijalankan sebelum SETIAP request dikirim
// apiClient.interceptors.request.use(
//   (config) => {
//     // Ambil token dari Redux state
//     const state = store.getState() as RootState; // <--- 2. CASTING STATE KE ROOTSTATE
//     const token = state.auth.token; // <--- 3. SEKARANG 'state' DIKENALI

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
import { store } from '@/store/store'; 
import type { RootState } from '@/store/store'; 

// Ganti dengan URL API Anda yang sebenarnya
const API_BASE_URL = 'https://be-library-api-xh3x6c5iiq-et.a.run.app/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // FIX: Menambahkan timeout global 8 detik untuk mencegah request menggantung
  timeout: 8000,
});

// Interceptor: Dijalankan sebelum SETIAP request dikirim
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari Redux state
    const state = store.getState() as RootState;
    const token = state.auth.token;

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