
// import { useState } from 'react';
// import { cn } from '@/lib/utils';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// //  file-file gambar folder src/assets/
// import heroImage1 from '@/assets/hero_image1.png';
// import heroImage2 from '@/assets/hero_image2.png';
// import heroImage3 from '@/assets/hero_image3.png';

// import iconCategory1 from '@/assets/Icon_Category1.png';
// import iconCategory2 from '@/assets/Icon_Category2.png';
// import iconCategory3 from '@/assets/Icon_Category3.png';
// import iconCategory4 from '@/assets/Icon_Category4.png';
// import iconCategory5 from '@/assets/Icon_Category5.png';
// import iconCategory6 from '@/assets/Icon_Category6.png';

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
//   // Shadow #CBCACA40 diimplementasikan dengan inline style untuk presisi
//   const customShadow = '0px 0px 20px 0px rgba(203, 202, 202, 0.25)'; // #CBCACA40

//   return (
//     // Outer container: width: ~187px; height: ~130px; border-radius: 16px; padding: 12px;
//     <Card 
//       className={cn(
//         // flex-col dengan gap 12px (atau custom style di bawah)
//         "flex flex-col justify-start p-3 rounded-xl bg-white transition-shadow hover:shadow-lg", 
//         // Memastikan ukuran mendekati spesifikasi desktop. W-full untuk mobile.
//         "w-full h-32 md:w-full md:h-full" 
//       )}
//       style={{ boxShadow: customShadow, gap: '12px' }}
//     >
//       {/* Inner container (Container 2): background: #E0ECFF; border-radius: 12px; padding: 6.4px; */}
//       <div 
//         className="flex items-center justify-center p-1.5 rounded-lg h-16 w-full" 
//         style={{ background: '#E0ECFF' }}
//       >
//         <img 
//             src={icon} 
//             alt={`Icon ${name}`} 
//             className="size-10"
//         />
//       </div>
      
//       {/* Text category: font-weight: 600; font-size: text-base; #0A0D12 */}
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
//     <div className="space-y-4">
//       {/* 1. Carousel Image Hero */}
//       <div className="relative w-full overflow-hidden rounded-3xl shadow-lg">
//         {/* Carousel track - menggunakan flex dan translateX untuk efek geser */}
//         <div 
//           className="flex transition-transform duration-500 ease-in-out"
//           style={{ transform: `translateX(-${activeIndex * 100}%)` }}
//         >
//           {HERO_IMAGES.map((img, index) => (
//             <div key={index} className="w-full shrink-0">
             
//               <img 
//                 src={img} 
//                 alt={`Hero Image ${index + 1}`} 
//                 className="w-full object-cover rounded-3xl h-[133px] lg:h-[441px]" 
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 2. Selector Dots (outside and below the image) */}
//       <div className="flex justify-center space-x-2 pt-2">
//         {HERO_IMAGES.map((_, index) => (
//           <Button
//             key={index}
//             variant="default" 
//             size="icon-sm"
//             className={cn(
//               "size-2 p-0 rounded-full transition-opacity duration-300",
//               activeIndex === index ? 'bg-primary opacity-100' : 'bg-gray-400 opacity-60 hover:opacity-80'
//             )}
//             onClick={() => goToSlide(index)}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>


//       {/* 3. Category Grid */}
//       <div className="space-y-4 pt-4">
        
//         {/* grid-cols-3 (mobile) lg:grid-cols-6 (desktop) */}
//         <div className="grid grid-cols-3 gap-4 lg:grid-cols-6 lg:gap-6">
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


import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


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

  // Auto-rotate carousel every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length);
    }, 2000); // 2000ms = 2 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

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