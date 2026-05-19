import React, { useState } from 'react';
import { Box, Flex, Text, Button, Spinner } from '@radix-ui/themes';
import { UploadIcon } from '@radix-ui/react-icons';
import toast from 'react-hot-toast';
import { homepageAdminAPI } from '@/services/admin/homepage.admin';
import axios from 'axios';

interface PromotionalBannerUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function PromotionalBannerUploader({ value, onChange }: PromotionalBannerUploaderProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are supported');
      return;
    }

    setLoading(true);
    try {
      const url = await homepageAdminAPI.uploadHomepageBanner(file);
      onChange(url);
      toast.success('Image uploaded successfully!');
    } catch (err: unknown) {
      console.error(err);
      let message = 'Failed to upload image';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="w-full">
      <Text as="label" size="2" weight="bold" mb="1" className="block">Banner Image</Text>
      <Flex direction="column" gap="2">
        {value && (
          <Box className="w-full h-36 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </Box>
        )}
        <Flex align="center" gap="3">
          <input
            type="file"
            id="promotional-banner-file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            disabled={loading}
          />
          <Button
            type="button"
            variant="soft"
            color="indigo"
            onClick={() => document.getElementById('promotional-banner-file-upload')?.click()}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? <Spinner size="1" /> : <UploadIcon />}
            {value ? 'Change Image' : 'Upload Image'}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              color="red"
              onClick={() => onChange('')}
              className="cursor-pointer"
            >
              Remove
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
