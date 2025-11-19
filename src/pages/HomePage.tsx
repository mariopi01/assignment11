import { Hero } from '@/components/features/Hero';
import { Recommendation } from '@/components/features/Recommendation';
import { PopularAuthors } from '@/components/features/PopularAuthors';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <hr />
      <Recommendation />
      <hr />
      <PopularAuthors />
    </div>
  );
}