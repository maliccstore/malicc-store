'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Product } from '@/types/product';
import { Heading, Text, Card } from '@radix-ui/themes';

interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${product.id}`);
  };
  return (
    <Card
      onClick={handleClick}
      className="m-2 w-full max-w-xs overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <Heading as="h3" size="4" className="font-bold line-clamp-1">
            {product.name}
          </Heading>
          <Text as="p" size="2" className="text-gray-600 line-clamp-2">
            {product.description}
          </Text>
        </div>
        <div className="flex items-center justify-between">
          <Text as="span" size="4" className="font-bold text-gray-900">
            ${product.price}
          </Text>
          <Button
            onClick={() => console.log(product)}
            className="hover:bg-gray-900 hover:text-white transition-colors"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
