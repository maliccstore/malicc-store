"use client";

import React from "react";
import { Box, Grid, Container } from "@radix-ui/themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Banner } from "@/types/homepage";

interface PromotionalBannerProps {
  blocks: Banner[];
}

export default function PromotionalBanner({
  blocks = [],
}: PromotionalBannerProps) {
  const router = useRouter();

  const activeBlocks = blocks.filter((b) => b.active);

  if (activeBlocks.length === 0) {
    return null;
  }

  const handleRedirect = (url?: string) => {
    if (!url) return;
    router.push(url);
  };

  return (
    <Container size="4" className="py-5 px-4">
      <Grid columns="1" gap="4">
        {activeBlocks.map((banner) => (
          <Box
            key={banner.id}
            onClick={() => handleRedirect(banner.redirectUrl)}
            className={`relative w-full h-[180px] overflow-hidden rounded-xl bg-gray-900 group active:scale-[0.98] transition-transform ${
              banner.redirectUrl ? "cursor-pointer" : ""
            }`}
            role={banner.redirectUrl ? "button" : "img"}
            aria-label={banner.title || "Promotional Banner"}
            tabIndex={banner.redirectUrl ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleRedirect(banner.redirectUrl);
              }
            }}
          >
            <Image
              src={banner.image}
              alt={banner.title || "Promotional Banner"}
              fill
              priority={false}
              className="object-cover transition-transform duration-300 group-active:scale-105"
              sizes="100vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/45" />

            {/* Content */}
            {(banner.title || banner.subtitle || banner.ctaText) && (
              <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-4 max-w-[85%] text-white">
                {banner.title && (
                  <h3 className="text-lg font-bold leading-tight">
                    {banner.title}
                  </h3>
                )}

                {banner.subtitle && (
                  <p className="mt-1 text-sm text-gray-200 line-clamp-2">
                    {banner.subtitle}
                  </p>
                )}

                {banner.ctaText && banner.redirectUrl && (
                  <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wide text-indigo-300">
                    {banner.ctaText} →
                  </span>
                )}
              </div>
            )}
          </Box>
        ))}
      </Grid>
    </Container>
  );
}
