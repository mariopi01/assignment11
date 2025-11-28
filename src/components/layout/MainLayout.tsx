

import { Outlet } from 'react-router-dom';
import { Header } from './Header'; 
import { Footer } from './Footer'; 

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="grow container mx-auto md-1 md:px-4 py-8">
        {/* Konten Halaman (seperti BookListPage) akan dirender di sini */}
        <Outlet /> 
      </main>

      <Footer />
    </div>
  );
};