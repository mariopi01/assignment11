// // import { StrictMode } from 'react'
// // import { createRoot } from 'react-dom/client'
// // import './index.css'
// // import App from './App.tsx'

// // createRoot(document.getElementById('root')!).render(
// //   <StrictMode>
// //     <App />
// //   </StrictMode>,
// // )


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
// import './styles/global.css'; // Pastikan Tailwind CSS diimpor

// import { store } from './store/store.ts';
// import { Provider } from 'react-redux';
// import { QueryClientProvider } from '@tanstack/react-query';
// import { queryClient } from './lib/queryClient.ts';
// import { Toaster } from './components/ui/toaster.tsx';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     {/* Sediakan Redux store ke seluruh aplikasi */}
//     <Provider store={store}>
//       {/* Sediakan TanStack Query client */}
//       <QueryClientProvider client={queryClient}>
//         <App />
//         <Toaster /> {/* Komponen untuk menampilkan notifikasi toast */}
//       </QueryClientProvider>
//     </Provider>
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/global.css';

import { store } from './store/store.ts';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.ts';

// HAPUS import Toaster lama
// import { Toaster } from './components/ui/toaster.tsx'; 

// TAMBAHKAN import Toaster baru dari sonner
import { Toaster } from '@/components/ui/sonner'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        {/* GANTI Toaster lama dengan yang baru */}
        <Toaster richColors /> 
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);