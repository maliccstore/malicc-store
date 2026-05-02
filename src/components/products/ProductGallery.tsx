"use client";

import Image from "next/image";
import { Box } from "@radix-ui/themes";
import { Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isUnavailable?: boolean;
}

export default function ProductGallery({
  images,
  productName,
  isUnavailable = false,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // If no images are available at all
  if (!images || images.length === 0) {
    return (
      <Box className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border-2 mb-6">
        <ImageIcon className="text-gray-300" size={96} />
      </Box>
    );
  }

  const selectedImage = images[selectedIndex];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <Box className="w-full flex flex-col gap-6 mb-6">
      {/* Main Image with Navigation Arrows */}
      <Box className="relative w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border-2 group">
        <Image
          src={selectedImage}
          alt={productName}
          width={400}
          height={300}
          className={`w-full h-full object-contain transition-transform duration-300 hover:scale-105 ${
            isUnavailable ? 'opacity-50 grayscale' : ''
          }`}
        />

        {/* Unavailable overlay badge */}
        {isUnavailable && (
          <div className="absolute inset-0 flex items-end justify-start p-3 pointer-events-none">
            <span className="text-sm font-semibold tracking-wide uppercase bg-gray-700 text-white px-3 py-1 rounded shadow-lg">
              Unavailable
            </span>
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-9)]"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-9)]"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </Box>

      {/* Thumbnails Gallery */}
      {images.length > 1 && (
        <Box className="w-full overflow-x-auto hide-scrollbar">
          <Box className="flex flex-row gap-3 min-w-max pb-2 snap-x snap-mandatory scroll-smooth p-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 snap-center focus:outline-none focus:ring-2 focus:ring-[var(--accent-9)] ${
                  selectedIndex === idx
                    ? "border-[var(--accent-9)] ring-2 ring-[var(--accent-9)]/20 scale-100"
                    : "border-transparent opacity-70 hover:opacity-100 scale-95"
                }`}
                aria-label={`Select image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  width={80}
                  height={80}
                  className={`w-full h-full object-cover ${
                    isUnavailable ? 'opacity-50 grayscale' : ''
                  }`}
                />
              </button>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
