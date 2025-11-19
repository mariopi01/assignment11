
// // import { Button } from '@/components/ui/button';
// // import { Link } from 'react-router-dom';

// // export const Hero = () => {
// //   return (
// //     <div className="text-center bg-gray-50 p-8 rounded-lg">
// //       <h1 className="text-4xl font-bold mb-4">Selamat Datang di Booky</h1>
// //       <p className="text-lg text-muted-foreground mb-6">
// //         Temukan dan pinjam buku favorit Anda di sini.
// //       </p>
// //       <Button asChild size="lg">
// //         <Link to="/books">Lihat Semua Buku</Link>
// //       </Button>
// //     </div>
// //   );
// // };

// import React, { useState } from 'react';
// import { cn } from '@/lib/utils';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// // --- PLACEHOLDER IMPORTS UNTUK IMAGE (Pastikan Anda menambahkan file ini di src/assets/) ---
// // Catatan: Asumsi file-file ini tersedia di folder src/assets/.
// import heroImage1 from '@/assets/hero_image1.png';
// import heroImage2 from '@/assets/hero_image2.png';
// import heroImage3 from '@/assets/hero_image3.png';

// import iconCategory1 from '@/assets/Icon_Category1.png';
// import iconCategory2 from '@/assets/Icon_Category2.png';
// import iconCategory3 from '@/assets/Icon_Category3.png';
// import iconCategory4 from '@/assets/Icon_Category4.png';
// import iconCategory5 from '@/assets/Icon_Category5.png';
// import iconCategory6 from '@/assets/Icon_Category6.png';
// // ---------------------------------------------------------------------------------------


// const HERO_IMAGES = [heroImage1, heroImage2, heroImage3];

// const CATEGORIES = [
//   { name: 'Fiction', icon: iconCategory1 },
//   { name: 'Non-Fiction', icon: iconCategory2 },
//   { name: 'Self-Improvement', icon: iconCategory3 },
//   { name: 'Finance', icon: iconCategory4 },
//   { name: 'Science', icon: iconCategory5 },
//   { name: 'Education', icon: iconCategory6 },
// ];

// // Komponen untuk setiap kartu kategori
// const CategoryCard = ({ name, icon }: typeof CATEGORIES[0]) => {
//   return (
//     // Outer container: width: ~187px; height: ~130px; border-radius: 16px; padding: 12px; shadow: #CBCACA40; background: #FFFFFF;
//     <Card 
//       className={cn(
//         // Flex vertikal dengan gap 12px
//         "flex flex-col justify-start p-3 rounded-xl bg-white", 
//         // Menggunakan md:w-[187px] md:h-[130px] untuk meniru dimensi tetap yang diminta pada desktop
//         "w-full h-32 md:w-[187px] md:h-[130px]"
//       )}
//       // Shadow dan gap 12px menggunakan inline style untuk mendekati spesifikasi
//       style={{ boxShadow: '0px 0px 20px 0px rgba(203, 202, 202, 0.25)', gap: '12px' }}
//     >
//       {/* Inner container (Container 2): background: #E0ECFF; border-radius: 12px; padding: 6.4px; */}
//       <div 
//         className="flex items-center justify-center p-[6.4px] rounded-lg" // p-[6.4px] untuk meniru padding 6.4px
//         style={{ background: '#E0ECFF' }}
//       >
//         {/* Placeholder for the icon */}
//         <img 
//             src={icon} 
//             alt={`Icon ${name}`} 
//             className="size-10" // Approximate size for icon
//         />
//       </div>
      
//       {/* Text category: font-weight: 600; font-size: text-md; #0A0D12 */}
//       <p className="font-semibold text-base text-[#0A0D12]">
//         {name}
//       </p>
//     </Card>
//   );
// };


// export const Hero = () => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   const goToSlide = (index: number) => {
//     setActiveIndex(index);
//   };

//   return (
//     <div className="space-y-8">
//       {/* 1. Carousel Image Hero & 2. Selector Dots */}
//       <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
//         {/* Carousel track - menggunakan flex dan translateX untuk efek geser */}
//         <div 
//           className="flex transition-transform duration-500 ease-in-out"
//           style={{ transform: `translateX(-${activeIndex * 100}%)` }}
//         >
//           {HERO_IMAGES.map((img, index) => (
//             <div key={index} className="w-full flex-shrink-0">
//               {/* Menggunakan aspect-video agar ukuran terdefinisi dengan baik */}
//               <img 
//                 src={img} 
//                 alt={`Hero Image ${index + 1}`} 
//                 className="w-full h-full object-cover rounded-xl aspect-video" 
//               />
//             </div>
//           ))}
//         </div>

//         {/* Selector Dots */}
//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//           {HERO_IMAGES.map((_, index) => (
//             <Button
//               key={index}
//               // Menggunakan size-icon-sm dan padding 0 untuk dot kecil
//               variant="default" 
//               size="icon-sm"
//               className={cn(
//                 "size-2 p-0 rounded-full transition-opacity duration-300",
//                 activeIndex === index ? 'bg-primary opacity-100' : 'bg-gray-400 opacity-60 hover:opacity-80'
//               )}
//               onClick={() => goToSlide(index)}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* 3. Category Grid */}
//       <div className="space-y-4">
//         <h2 className="text-2xl font-bold text-left">Pilih Kategori Favoritmu</h2>
//         {/* grid-cols-2 (mobile), sm:grid-cols-3 (tablet/mobile landscape), lg:grid-cols-6 (desktop) */}
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
//           {CATEGORIES.map((category) => (
//             <CategoryCard 
//               key={category.name} 
//               name={category.name} 
//               icon={category.icon} 
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// NOTE: Asumsi file-file gambar berikut sudah tersedia di folder src/assets/
import heroImage1 from '@/assets/hero_image1.png';
import heroImage2 from '@/assets/hero_image2.png';
import heroImage3 from '@/assets/hero_image3.png';

import iconCategory1 from '@/assets/Icon_Category1.png';
import iconCategory2 from '@/assets/Icon_Category2.png';
import iconCategory3 from '@/assets/Icon_Category3.png';
import iconCategory4 from '@/assets/Icon_Category4.png';
import iconCategory5 from '@/assets/Icon_Category5.png';
import iconCategory6 from '@/assets/Icon_Category6.png';

const HERO_IMAGES = [heroImage1, heroImage2, heroImage3];

const CATEGORIES = [
  { name: 'Fiction', icon: iconCategory1 },
  { name: 'Non-Fiction', icon: iconCategory2 },
  { name: 'Self-Improvement', icon: iconCategory3 },
  { name: 'Finance', icon: iconCategory4 },
  { name: 'Science', icon: iconCategory5 },
  { name: 'Education', icon: iconCategory6 },
];

// Komponen untuk setiap kartu kategori
const CategoryCard = ({ name, icon }: typeof CATEGORIES[0]) => {
  // Shadow #CBCACA40 diimplementasikan dengan inline style untuk presisi
  const customShadow = '0px 0px 20px 0px rgba(203, 202, 202, 0.25)'; // #CBCACA40

  return (
    // Outer container: width: ~187px; height: ~130px; border-radius: 16px; padding: 12px;
    <Card 
      className={cn(
        // flex-col dengan gap 12px (atau custom style di bawah)
        "flex flex-col justify-start p-3 rounded-xl bg-white transition-shadow hover:shadow-lg", 
        // Memastikan ukuran mendekati spesifikasi desktop. W-full untuk mobile.
        "w-full h-32 md:w-full md:h-full" 
      )}
      style={{ boxShadow: customShadow, gap: '12px' }}
    >
      {/* Inner container (Container 2): background: #E0ECFF; border-radius: 12px; padding: 6.4px; */}
      <div 
        className="flex items-center justify-center p-1.5 rounded-lg h-16 w-full" 
        style={{ background: '#E0ECFF' }}
      >
        <img 
            src={icon} 
            alt={`Icon ${name}`} 
            className="size-10"
        />
      </div>
      
      {/* Text category: font-weight: 600; font-size: text-base; #0A0D12 */}
      <p className="font-semibold text-base text-[#0A0D12]">
        {name}
      </p>
    </Card>
  );
};


export const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* 1. Carousel Image Hero */}
      <div className="relative w-full overflow-hidden rounded-3xl shadow-lg">
        {/* Carousel track - menggunakan flex dan translateX untuk efek geser */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {HERO_IMAGES.map((img, index) => (
            <div key={index} className="w-full shrink-0">
              {/* Responsive Image size: 
                Mobile: h-[133px] (approximate 132.67px)
                Desktop: lg:h-[441px] 
              */}
              <img 
                src={img} 
                alt={`Hero Image ${index + 1}`} 
                className="w-full object-cover rounded-3xl h-[133px] lg:h-[441px]" 
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Selector Dots (outside and below the image) */}
      <div className="flex justify-center space-x-2 pt-2">
        {HERO_IMAGES.map((_, index) => (
          <Button
            key={index}
            variant="default" 
            size="icon-sm"
            className={cn(
              "size-2 p-0 rounded-full transition-opacity duration-300",
              activeIndex === index ? 'bg-primary opacity-100' : 'bg-gray-400 opacity-60 hover:opacity-80'
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>


      {/* 3. Category Grid */}
      <div className="space-y-4 pt-4">
        
        {/* grid-cols-3 (mobile) lg:grid-cols-6 (desktop) */}
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-6 lg:gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard 
              key={category.name} 
              name={category.name} 
              icon={category.icon} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};