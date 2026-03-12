'use client';

import React from 'react';
import { Flex, Heading, Text, Box, Card, Progress } from '@radix-ui/themes';
import StarRating from './StarRating';
import { ProductRatingSummary } from '@/types/review';

interface RatingSummaryProps {
  summary: ProductRatingSummary;
  className?: string;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  summary,
  className,
}) => {
  const { averageRating = 0, totalReviews = 0 } = summary;

  return (
    <Card size="3" className={className}>
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center" wrap="wrap" gap="4">
          <Flex direction="column" gap="1">
            <Flex align="baseline" gap="2">
              <Heading size="8" weight="bold">
                {averageRating.toFixed(1)}
              </Heading>
              <Text size="5" color="gray" weight="medium">
                / 5.0
              </Text>
            </Flex>
            <Flex align="center" gap="3">
              <StarRating rating={averageRating} size={24} />
              <Text size="3" color="gray">
                Based on {totalReviews.toLocaleString()}{' '}
                {totalReviews === 1 ? 'review' : 'reviews'}
              </Text>
            </Flex>
          </Flex>

          <Flex direction="column" gap="2" className="min-w-[200px] flex-1 max-w-sm">
            <Progress 
                value={(averageRating / 5) * 100} 
                color="yellow" 
                variant="classic" 
                duration="1000ms"
            />
            <Flex justify="between">
              <Text size="1" color="gray" weight="bold">
                POOR
              </Text>
              <Text size="1" color="gray" weight="bold">
                EXCELLENT
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default RatingSummary;
