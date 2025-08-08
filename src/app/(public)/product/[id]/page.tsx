'use client'; // Essential for client-side hooks and Redux

import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Product } from '@/types/product';
import { Box, Container } from '@radix-ui/themes';

const ProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // Type assertion if needed

  // Get product from Redux store
  const product = useSelector((state: RootState) =>
    state.products.products.find((p: Product) => p.id === id)
  );

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Container className="product-page p-4">
      <Box>
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-h-96 object-contain"
        />
      </Box>
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-lg my-4">${product.price}</p>
        <p className="text-gray-700">{product.description}</p>
      </div>
      <div className="sticky bottom-12 flex justify-center">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors max-w-md w-full">
          Add to Cart
        </button>
      </div>
    </Container>
  );
};

export default ProductPage;
