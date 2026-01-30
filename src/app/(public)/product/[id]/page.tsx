'use client'; // Essential for client-side hooks and Redux

import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { Product } from '@/types/product';
import { Box, Container } from '@radix-ui/themes';
import ProductDetailsSkeleton from '@/components/products/ProductDetailsSkeleton';
import Image from 'next/image';
import { addToCart } from '@/store/slices/cartSlice';
import { Image as ImageIcon } from 'lucide-react';

import { useEffect } from 'react';
import { fetchProducts } from '@/store/slices/productSlice';
import { AppDispatch } from '@/store';

const ProductPage = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const id = params.id;
  const productId = Array.isArray(id) ? id[0] : id;

  const { products, loading } = useSelector((state: RootState) => state.products);

  // Get product from Redux store - Use loose comparison or string conversion to be safe
  const product = products.find((p: Product) => String(p.id) === String(productId));

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleAddToCart = () => {
    if (product) {
      console.log(product);
      dispatch(addToCart(product));
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <Container className="product-page p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <p className="text-gray-600 mt-2">The product you are looking for does not exist.</p>
      </Container>
    );
  }

  return (
    <Container className="product-page p-4">
      <Box className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden mb-6">
        {product.image ? (
          <Image
            width={400}
            height={300}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <ImageIcon className="text-gray-300" size={96} />
        )}
      </Box>
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-lg my-4">${product.price}</p>
        <p className="text-gray-700">{product.description}</p>
      </div>
      <div className="sticky bottom-12 flex justify-center">
        <button
          onClick={handleAddToCart}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors max-w-md w-full"
        >
          Add to Cart
        </button>
      </div>
    </Container>
  );
};

export default ProductPage;
