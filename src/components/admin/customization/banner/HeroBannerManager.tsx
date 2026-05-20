import React, { useState } from 'react';
import { Flex, Heading, Text, Button, Box } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import toast from 'react-hot-toast';
import { HomepageConfig, Banner } from '@/types/homepage';
import { homepageAdminAPI } from '@/services/admin/homepage.admin';
import BannerForm from './BannerForm';
import BannerReorderList from './BannerReorderList';

interface HeroBannerManagerProps {
  config: HomepageConfig;
  onChange: (config: HomepageConfig) => void;
}

export default function HeroBannerManager({ config, onChange }: HeroBannerManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleCreateOrUpdate = async (bannerData: Omit<Banner, 'id' | 'order'>) => {
    setLoading(true);
    try {
      let updatedConfig: HomepageConfig;
      if (selectedBanner) {
        // Update existing banner
        updatedConfig = await homepageAdminAPI.updateHomepageBanner('HERO', selectedBanner.id, bannerData);
        toast.success('Hero banner updated successfully!');
      } else {
        // Add new banner
        updatedConfig = await homepageAdminAPI.addHomepageBanner('HERO', bannerData);
        toast.success('Hero banner created successfully!');
      }
      onChange(updatedConfig);
      setIsEditing(false);
      setSelectedBanner(undefined);
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero banner?')) return;
    setLoading(true);
    try {
      const updatedConfig = await homepageAdminAPI.deleteHomepageBanner('HERO', id);
      onChange(updatedConfig);
      toast.success('Hero banner deleted successfully!');
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to delete banner');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    setLoading(true);
    try {
      const banner = config.heroBanners.find((b) => b.id === id);
      if (!banner) return;

      const updatedConfig = await homepageAdminAPI.updateHomepageBanner('HERO', id, {
        image: banner.image,
        title: banner.title,
        subtitle: banner.subtitle,
        ctaText: banner.ctaText,
        redirectUrl: banner.redirectUrl,
        active,
      });
      onChange(updatedConfig);
      toast.success(active ? 'Banner activated' : 'Banner deactivated');
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to toggle active state');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderedIds: string[]) => {
    setLoading(true);
    try {
      const updatedConfig = await homepageAdminAPI.reorderHomepageBanners('HERO', orderedIds);
      onChange(updatedConfig);
      toast.success('Hero banners order updated!');
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to reorder banners');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <BannerForm
        banner={selectedBanner}
        onSave={handleCreateOrUpdate}
        onCancel={() => {
          setIsEditing(false);
          setSelectedBanner(undefined);
        }}
        isSaving={loading}
      />
    );
  }

  return (
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center">
        <Box>
          <Heading size="3" className="font-medium">Hero Banners</Heading>
          <Text size="1" color="gray">
            Manage banner slides displaying on storefront hero carousel.
          </Text>
        </Box>
        <Button
          type="button"
          onClick={() => {
            setSelectedBanner(undefined);
            setIsEditing(true);
          }}
          color="indigo"
          variant="solid"
          className="cursor-pointer font-medium"
        >
          <PlusIcon /> Add Banner
        </Button>
      </Flex>

      <BannerReorderList
        banners={config.heroBanners}
        onReorder={handleReorder}
        onEdit={(banner) => {
          setSelectedBanner(banner);
          setIsEditing(true);
        }}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        isSaving={loading}
      />
    </Flex>
  );
}
