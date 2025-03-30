import ProductCard from '@/components/products/ProductCard';
import products from '@/data/products';
import { Box, Container, Flex } from '@radix-ui/themes';
export default function ProductPage() {
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
