
import { Card, CardContent } from '@/components/ui/card';

// Data placeholder
const authors = [
  { id: 1, name: 'Andrea Hirata' },
  { id: 2, name: 'Yuval Noah Harari' },
  { id: 3, name: 'Tere Liye' },
  { id: 4, name: 'J.K. Rowling' },
];

export const PopularAuthors = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Penulis Populer</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {authors.map((author) => (
          <Card key={author.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <span className="font-semibold">{author.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};