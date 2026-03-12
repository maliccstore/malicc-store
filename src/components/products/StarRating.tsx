'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Flex, Box, Text } from '@radix-ui/themes';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: number;
  className?: string;
  fillColor?: string;
  emptyColor?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  interactive = false,
  onRatingChange,
  size = 20,
  className,
  fillColor = 'text-yellow-400',
  emptyColor = 'text-gray-300',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <Flex
      align="center"
      gap="1"
      className={className}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxRating)].map((_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= displayRating;
        const isHalf = !isFilled && starIndex - 0.5 <= displayRating;

        return (
          <Box
            key={i}
            className={`relative transition-all duration-200 ease-out ${
              interactive
                ? 'cursor-pointer transform hover:scale-110 active:scale-95'
                : ''
            }`}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onClick={() => handleClick(starIndex)}
          >
            <Star
              size={size}
              className={`transition-colors duration-200 ${
                isFilled ? fillColor : emptyColor
              } ${isFilled ? 'fill-current' : ''}`}
            />
            {isHalf && (
              <Box className="absolute top-0 left-0 overflow-hidden w-1/2">
                <Star size={size} className={`${fillColor} fill-current`} />
              </Box>
            )}
          </Box>
        );
      })}
      {interactive && hoverRating !== null && (
        <Text
          size="2"
          weight="medium"
          color="gray"
          className="ml-2 animate-in fade-in slide-in-from-left-1 duration-200"
        >
          {hoverRating} / {maxRating}
        </Text>
      )}
    </Flex>
  );
};

export default StarRating;
