import { QueryClient } from '@tanstack/react-query';

// Buat instance query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Opsi default, misalnya: retry 1 kali
      retry: 1,
    },
  },
});