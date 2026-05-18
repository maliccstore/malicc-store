'use client';

import { useState } from 'react';
import { Box, Button, Text, Flex } from '@radix-ui/themes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { uploadLogo, deleteLogo } from '@/store/admin/settings/appearanceThunks';
import toast from 'react-hot-toast';

export default function LogoUploader() {
  const dispatch = useAppDispatch();
  const { settings, loading } = useAppSelector((state) => state.adminAppearance);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    // Validate type
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      toast.error('Only PNG, JPG, and SVG are allowed');
      return;
    }

    try {
      setIsUploading(true);
      await dispatch(uploadLogo(file)).unwrap();
      toast.success('Logo uploaded successfully');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload logo');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  const handleRemove = async () => {
    try {
      setIsUploading(true);
      await dispatch(deleteLogo()).unwrap();
      toast.success('Logo removed successfully');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove logo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Flex gap="3" align="center">
        <Button asChild disabled={isUploading || loading} variant="soft">
          <label style={{ cursor: 'pointer' }}>
            {isUploading ? 'Uploading...' : 'Upload Logo'}
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={isUploading || loading}
            />
          </label>
        </Button>
        {settings?.logo_url && (
          <Button
            color="red"
            variant="soft"
            onClick={handleRemove}
            disabled={isUploading || loading}
          >
            Remove Logo
          </Button>
        )}
      </Flex>
      <Text color="gray" size="2" mt="2" as="p">
        Recommended: SVG, PNG or JPG with transparent background. Max size: 2MB.
      </Text>
    </Box>
  );
}
