// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';

// export const store = configureStore({
//   reducer: {
//     // 'auth' adalah nama state yang akan kita akses
//     auth: authReducer,
//   },
// });

// // Mengekspor tipe ini untuk digunakan di seluruh aplikasi
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice'; // <--- 1. IMPORT

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer, // <--- 2. TAMBAHKAN
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;