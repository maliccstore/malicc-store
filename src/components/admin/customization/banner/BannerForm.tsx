import React, { useState } from 'react';
import { Flex, Heading, Text, Grid, Box, TextField, Button, Checkbox, Separator } from '@radix-ui/themes';
import { Banner } from '@/types/homepage';
import BannerUploader from './BannerUploader';
import BannerPreview from './BannerPreview';

interface BannerFormProps {
  banner?: Partial<Banner>; // If present, edit mode. Else, add mode.
  onSave: (bannerData: Omit<Banner, 'id' | 'order'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function BannerForm({ banner, onSave, onCancel, isSaving }: BannerFormProps) {
  const [formData, setFormData] = useState<Omit<Banner, 'id' | 'order'>>({
    image: banner?.image || '',
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    ctaText: banner?.ctaText || '',
    redirectUrl: banner?.redirectUrl || '',
    active: banner?.active !== undefined ? banner.active : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <Heading size="4" className="mb-4">
        {banner ? 'Edit Banner Settings' : 'Create New Hero Banner'}
      </Heading>

      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="4">
          <BannerUploader
            imageUrl={formData.image}
            onUpload={(url) => setFormData((prev) => ({ ...prev, image: url }))}
          />

          <Grid columns={{ initial: '1', sm: '2' }} gap="3">
            <Box>
              <Text as="label" size="2" weight="bold" mb="1" className="block">Title</Text>
              <TextField.Root
                placeholder="e.g. Special Offer"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold" mb="1" className="block">Subtitle</Text>
              <TextField.Root
                placeholder="e.g. Get up to 40% discount"
                value={formData.subtitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
              />
            </Box>
          </Grid>

          <Grid columns={{ initial: '1', sm: '2' }} gap="3">
            <Box>
              <Text as="label" size="2" weight="bold" mb="1" className="block">CTA Text</Text>
              <TextField.Root
                placeholder="e.g. Shop Now"
                value={formData.ctaText}
                onChange={(e) => setFormData((prev) => ({ ...prev, ctaText: e.target.value }))}
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold" mb="1" className="block">Redirect URL</Text>
              <TextField.Root
                placeholder="e.g. /catalog/shoes"
                value={formData.redirectUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, redirectUrl: e.target.value }))}
              />
            </Box>
          </Grid>

          <Flex align="center" gap="2">
            <Checkbox
              id="active-toggle"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: !!checked }))}
            />
            <Text as="label" htmlFor="active-toggle" size="2" className="cursor-pointer">
              Set banner as Active/Visible on storefront
            </Text>
          </Flex>

          <Separator size="4" className="my-2" />

          {/* Live Preview */}
          <Box>
            <Text size="2" weight="bold" color="gray" className="block mb-2">Live Storefront Preview</Text>
            <BannerPreview banner={formData} />
          </Box>

          <Flex gap="3" justify="end" className="mt-2">
            <Button
              type="button"
              variant="soft"
              color="gray"
              onClick={onCancel}
              disabled={isSaving}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="solid"
              color="indigo"
              disabled={!formData.image || isSaving}
              className="cursor-pointer font-medium"
            >
              {isSaving ? 'Saving...' : banner ? 'Save Changes' : 'Create Banner'}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Box>
  );
}
