"use client";

import React from "react";
import ProductCard from "@/components/products/ProductCard";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton";
import { Box, Heading, Flex, Container } from "@radix-ui/themes";
import { Product } from "@/types/product";

interface HomeProductListProps {
  title: string;
  products: Product[];
  loading?: boolean;
}

const HomeProductList: React.FC<HomeProductListProps> = ({
  title,
  products,
  loading = false,
}) => {
  if (loading) {
    return (
      <Container size="4" className="py-6 px-4">
        <Heading
          size="6"
          className="font-semibold tracking-tight mb-5 text-gray-900"
        >
          {title}
        </Heading>

        <Box className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <Flex gap="4" className="w-max">
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} className="w-[240px] sm:w-[280px] flex-shrink-0">
                <ProductCardSkeleton />
              </Box>
            ))}
          </Flex>
        </Box>
      </Container>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Container size="4" className="py-6 px-4">
      <Heading
        size="6"
        className="font-semibold tracking-tight mb-5 text-gray-900"
      >
        {title}
      </Heading>

      <Box
        className="w-full overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <Flex gap="4" className="w-max">
          {products.map((product) => (
            <Box
              key={product.id}
              className="w-[240px] sm:w-[280px] flex-shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard product={product} />
            </Box>
          ))}
        </Flex>
      </Box>
    </Container>
  );
};

export default React.memo(HomeProductList);
