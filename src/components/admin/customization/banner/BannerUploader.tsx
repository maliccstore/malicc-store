import React, { useState } from 'react';
import { Flex, Box, Button, Text } from '@radix-ui/themes';
import { UploadIcon } from '@radix-ui/react-icons';
import toast from 'react-hot-toast';
import { homepageAdminAPI } from '@/services/admin/homepage.admin';
import axios from 'axios';

interface BannerUploaderProps {
  imageUrl: string;
  onUpload: (url: string) => void;
}

export default function BannerUploader({ imageUrl, onUpload }: BannerUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const url = await homepageAdminAPI.uploadHomepageBanner(file);
      onUpload(url);
      toast.success('Image uploaded successfully!');
    } catch (err: unknown) {
      console.error(err);
      let message = 'Failed to upload image';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Text as="label" size="2" weight="bold" mb="1" className="block">Banner Image</Text>
      <Flex align="center" gap="3">
        <input
          type="file"
          id="banner-file-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('banner-file-upload')?.click()}
          disabled={uploading}
          className="cursor-pointer"
        >
          <UploadIcon />
          {uploading ? 'Uploading...' : 'Choose Image'}
        </Button>
        {imageUrl && (
          <Text size="1" color="green" truncate className="max-w-[200px]">
            Uploaded: {imageUrl}
          </Text>
        )}
      </Flex>
    </Box>
  );
}
