import React, { useState } from 'react';
import { Flex, Heading, Text, Button, Box, Card, TextField, Checkbox, Grid } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import toast from 'react-hot-toast';
import { HomepageConfig, Banner } from '@/types/homepage';
import { homepageAdminAPI } from '@/services/admin/homepage.admin';
import PromotionalBannerUploader from './PromotionalBannerUploader';
import PromotionalBannerCard from './PromotionalBannerCard';

interface PromotionalBannerManagerProps {
  config: HomepageConfig;
  onChange: (config: HomepageConfig) => void;
}

export default function PromotionalBannerManager({ config, onChange }: PromotionalBannerManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Form states
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [active, setActive] = useState(true);

  const startEdit = (banner?: Banner) => {
    setSelectedBanner(banner);
    setImage(banner ? banner.image : '');
    setTitle(banner ? banner.title || '' : '');
    setSubtitle(banner ? banner.subtitle || '' : '');
    setCtaText(banner ? banner.ctaText || '' : '');
    setRedirectUrl(banner ? banner.redirectUrl || '' : '');
    setActive(banner ? banner.active : true);
    setIsEditing(true);
  };

  const handleCreateOrUpdate = async () => {
    if (!image) {
      toast.error('Please upload a banner image');
      return;
    }

    setLoading(true);
    try {
      const bannerData = { image, title, subtitle, ctaText, redirectUrl, active };
      let updatedConfig: HomepageConfig;
      if (selectedBanner) {
        updatedConfig = await homepageAdminAPI.updateHomepageBanner('PROMOTIONAL', selectedBanner.id, {
          ...bannerData,
          order: selectedBanner.order,
        });
        toast.success('Promotional banner updated successfully!');
      } else {
        updatedConfig = await homepageAdminAPI.addHomepageBanner('PROMOTIONAL', bannerData);
        toast.success('Promotional banner created successfully!');
      }
      onChange(updatedConfig);
      setIsEditing(false);
      setSelectedBanner(undefined);
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to save promotional banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotional banner?')) return;
    setLoading(true);
    try {
      const updatedConfig = await homepageAdminAPI.deleteHomepageBanner('PROMOTIONAL', id);
      onChange(updatedConfig);
      toast.success('Promotional banner deleted successfully!');
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to delete banner');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setLoading(true);
    try {
      const banner = config.promotionalBanners.find((b) => b.id === id);
      if (!banner) return;

      const updatedConfig = await homepageAdminAPI.updateHomepageBanner('PROMOTIONAL', id, {
        image: banner.image,
        title: banner.title,
        subtitle: banner.subtitle,
        ctaText: banner.ctaText,
        redirectUrl: banner.redirectUrl,
        active: !currentActive,
        order: banner.order,
      });
      onChange(updatedConfig);
      toast.success(!currentActive ? 'Banner activated' : 'Banner deactivated');
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to toggle active state');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (index: number, direction: 'UP' | 'DOWN') => {
    const list = [...config.promotionalBanners];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    setLoading(true);
    try {
      const orderedIds = list.map((b) => b.id);
      const updatedConfig = await homepageAdminAPI.reorderHomepageBanners('PROMOTIONAL', orderedIds);
      onChange(updatedConfig);
      toast.success('Promotional banners order updated!');
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to reorder banners');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <Flex direction="column" gap="4">
        <Box>
          <Heading size="3" className="font-medium">
            {selectedBanner ? 'Edit Promotional Banner' : 'Create Promotional Banner'}
          </Heading>
          <Text size="1" color="gray">
            Configure promotional layouts, action buttons, links, and background graphics.
          </Text>
        </Box>

        <Grid gap="4">
          {/* Form Side */}
          <Flex direction="column" gap="3">
            <PromotionalBannerUploader value={image} onChange={setImage} />

            <Box>
              <Text as="label" size="2" weight="bold" mb="1" className="block">Banner Title </Text>
              <TextField.Root
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Clearance Sale"
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold" mb="1" className="block">Banner Subtitle (Optional)</Text>
              <TextField.Root
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Up to 70% Off on select items"
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold" mb="1" className="block">CTA Button Text </Text>
              <TextField.Root
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Shop Now"
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="bold" mb="1" className="block">Redirect URL</Text>
              <TextField.Root
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="e.g. /explore?sale=clearance"
              />
            </Box>

            <Flex align="center" gap="2" mt="2">
              <Checkbox
                checked={active}
                onCheckedChange={(val) => setActive(!!val)}
                id="banner-active"
              />
              <Text as="label" htmlFor="banner-active" size="2" className="cursor-pointer">
                Active & Visible on storefront
              </Text>
            </Flex>

            <Flex gap="3" mt="3">
              <Button
                type="button"
                variant="solid"
                color="indigo"
                onClick={handleCreateOrUpdate}
                disabled={loading}
                className="cursor-pointer font-medium"
              >
                {loading ? 'Saving...' : 'Save Banner'}
              </Button>
              <Button
                type="button"
                variant="soft"
                color="gray"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedBanner(undefined);
                }}
                disabled={loading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </Flex>
          </Flex>

          {/* Real-time Display Preview Side */}
          <Flex gap="2" direction={'column'}>
            <Heading size="2" className="text-gray-500 font-semibold uppercase tracking-wider">
              Live Mockup Preview
            </Heading>
            <Card
              size="1"
              className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center text-center p-6 border"
            >
              {image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <Flex direction="column" align="center" gap="2" className="relative z-10 text-white max-w-sm">
                    {title && <Heading size="6" className="font-extrabold tracking-tight drop-shadow-md">{title}</Heading>}
                    {subtitle && <Text size="2" className="drop-shadow-sm font-medium">{subtitle}</Text>}
                    {ctaText && (
                      <Button size="1" variant="solid" color="indigo" className="mt-2 font-semibold">
                        {ctaText}
                      </Button>
                    )}
                  </Flex>
                </>
              ) : (
                <Text size="2" color="gray" className="italic text-center">
                  Upload an image to see the responsive layout preview
                </Text>
              )}
            </Card>
          </Flex>
        </Grid>
      </Flex>
    );
  }

  const banners = config.promotionalBanners || [];

  return (
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center">
        <Box>
          <Heading size="3" className="font-medium">Promotional Banners</Heading>
          <Text size="1" color="gray">
            Configure full-width banner highlights situated between homepage sections.
          </Text>
        </Box>
        <Button
          type="button"
          onClick={() => startEdit(undefined)}
          color="indigo"
          variant="solid"
          className="cursor-pointer font-medium"
        >
          <PlusIcon /> Add Banner
        </Button>
      </Flex>

      <Flex direction="column" gap="3">
        {banners.length === 0 ? (
          <Text size="2" color="gray" className="italic text-center py-6 bg-gray-50 rounded-lg">
            No promotional banners created yet. Click &quot;Add Banner&quot; to get started.
          </Text>
        ) : (
          banners.map((banner, index) => (
            <PromotionalBannerCard
              key={banner.id}
              banner={banner}
              index={index}
              total={banners.length}
              onMoveUp={() => handleMove(index, 'UP')}
              onMoveDown={() => handleMove(index, 'DOWN')}
              onEdit={() => startEdit(banner)}
              onDelete={() => handleDelete(banner.id)}
              onToggleActive={() => handleToggleActive(banner.id, banner.active)}
              isSaving={loading}
            />
          ))
        )}
      </Flex>
    </Flex>
  );
}
