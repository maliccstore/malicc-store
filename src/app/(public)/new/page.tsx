'use client';
import ProductCard from '@/components/products/ProductCard';
import ProductCardSkeleton from '@/components/products/ProductCardSkeleton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productSlice';
// import products from '@/data/products';
import { Box, Container, Flex, Text, Heading, Button } from '@radix-ui/themes';
import { Frown } from 'lucide-react';
import { useEffect } from 'react';
export default function NewPage() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <Flex gap={'2'} align={'center'} direction={{ initial: 'column' }}>
        <h1>Product Page</h1>
        <Container size={'2'}>
          <Box className="mb-16  w-fit  ">
            <Flex
              gap={'2'}
              direction={{ initial: 'column', sm: 'row' }}
              wrap="wrap"
              align="stretch"
              justify={'center'}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </Flex>
          </Box>
        </Container>
      </Flex>
    );
  }

  if (error) {
    return (
      <Container size="4" p="4">
        <Flex
          direction="column"
          align="center"
          justify="center"
          py="9"
          gap="4"
          className="bg-red-50 rounded-lg border border-dashed border-red-300"
        >
          <Frown size={48} className="text-red-400" />
          <Heading size="4" color="red">
            Failed to load products
          </Heading>
          <Text color="red" align="center">
            {error}
          </Text>
          <Button onClick={() => dispatch(fetchProducts())} variant="soft" color="red">
            Try Again
          </Button>
        </Flex>
      </Container>
    );
  }
  return (
    <Flex gap={'2'} align={'center'} direction={{ initial: 'column' }}>
      <h1>Product Page</h1>
      <Container size={'2'}>
        <Box className="mb-16  w-fit  ">
          <Flex
            gap={'2'}
            direction={{ initial: 'column', sm: 'row' }}
            wrap="wrap" // Allows wrapping if needed
            align="stretch"
            justify={'center'}
          >
            {products.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </Flex>
        </Box>
      </Container>
    </Flex>
  );
}
