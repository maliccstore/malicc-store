'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  Separator,
  IconButton,
} from '@radix-ui/themes';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import toast from 'react-hot-toast';
import { homepageAdminAPI } from '@/services/admin/homepage.admin';
import { adminProductAPI } from '@/services/admin/product.admin';
import { HomepageConfig } from '@/types/homepage';
import { AdminProduct } from '@/features/admin/products/product.types';
import HomepageSectionToggle from './HomepageSectionToggle';

// Subcomponents split by concern
import HeroBannerManager from './banner/HeroBannerManager';
import FeaturedProductsManager from './featured/FeaturedProductsManager';
import TopSellingCustomizer from './TopSellingCustomizer';
import PromotionalBannersCustomizer from './PromotionalBannersCustomizer';
import NewArrivalsCustomizer from './NewArrivalsCustomizer';

export default function HomepageCustomizer() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [configData, productsData] = await Promise.all([
          homepageAdminAPI.getHomepageConfig(),
          adminProductAPI.getAll(),
        ]);
        setConfig(configData);
        setProducts(productsData.data || []);
      } catch (err: unknown) {
        console.error('Failed to fetch homepage customization data:', err);
        const error = err as Error;
        toast.error(error.message || 'Failed to load customization settings');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading || !config) {
    return (
      <Flex direction="column" gap="4" className="w-full max-w-4xl mx-auto py-10">
        <Card size="3" className="animate-pulse">
          <Flex direction="column" gap="3">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-96 bg-gray-200 rounded"></div>
            <Separator size="4" className="my-2" />
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </Flex>
        </Card>
      </Flex>
    );
  }

  // Helper to determine if section is enabled
  const isSectionEnabled = (sectionId: string): boolean => {
    switch (sectionId) {
      case 'hero':
        return config.sectionOrder.includes('hero');
      case 'featured':
        return config.featuredProducts.enabled;
      case 'topSelling':
        return config.topSelling.enabled;
      case 'promotional':
        return config.sectionOrder.includes('promotional');
      case 'newArrivals':
        return config.newArrivals.enabled;
      default:
        return false;
    }
  };

  // Helper to toggle section enabled
  const toggleSection = (sectionId: string) => {
    const updated = { ...config };
    if (sectionId === 'hero') {
      if (updated.sectionOrder.includes('hero')) {
        updated.sectionOrder = updated.sectionOrder.filter((s) => s !== 'hero');
      } else {
        updated.sectionOrder = ['hero', ...updated.sectionOrder];
      }
    } else if (sectionId === 'promotional') {
      if (updated.sectionOrder.includes('promotional')) {
        updated.sectionOrder = updated.sectionOrder.filter((s) => s !== 'promotional');
      } else {
        updated.sectionOrder = [...updated.sectionOrder, 'promotional'];
      }
    } else if (sectionId === 'featured') {
      updated.featuredProducts.enabled = !updated.featuredProducts.enabled;
    } else if (sectionId === 'topSelling') {
      updated.topSelling.enabled = !updated.topSelling.enabled;
    } else if (sectionId === 'newArrivals') {
      updated.newArrivals.enabled = !updated.newArrivals.enabled;
    }
    setConfig(updated);
  };

  // Move section in order
  const moveSection = (index: number, direction: 'UP' | 'DOWN') => {
    const sectionIds = [...config.sectionOrder];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionIds.length) return;

    const temp = sectionIds[index];
    sectionIds[index] = sectionIds[targetIndex];
    sectionIds[targetIndex] = temp;

    setConfig({ ...config, sectionOrder: sectionIds });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saved = await homepageAdminAPI.updateHomepageConfig(config);
      setConfig(saved);
      toast.success('Homepage configuration saved successfully!');
    } catch (err: unknown) {
      console.error('Failed to save config:', err);
      const error = err as Error;
      toast.error(error.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  // Section names mapping
  const sectionNames: Record<string, string> = {
    hero: 'Hero Banner',
    featured: 'Featured Products',
    topSelling: 'Top Selling',
    promotional: 'Promotional Banner',
    newArrivals: 'New Arrivals',
  };

  // Static list of all possible sections
  const ALL_SECTION_KEYS = ['hero', 'featured', 'topSelling', 'promotional', 'newArrivals'];

  // Order sections: enabled sections first (in their custom order), then disabled ones
  const orderedSectionKeys = [
    ...config.sectionOrder,
    ...ALL_SECTION_KEYS.filter((k) => !config.sectionOrder.includes(k)),
  ];

  return (
    <Box className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <Flex justify="between" align="center" mb="6">
        <Box>
          <Heading size="6" className="font-bold mb-1">Homepage Customization</Heading>
          <Text size="2" color="gray">
            Configure section visibility, ordering, banner media, and product widgets.
          </Text>
        </Box>
        <Flex className="mr-3">
          <Button
            variant="solid"
            color="indigo"
            size="2"
            onClick={handleSave}
            disabled={isSaving}
            className="cursor-pointer font-medium"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Flex>
      </Flex>

      {/* Main List */}
      <Flex direction="column" gap="4">
        {orderedSectionKeys.map((sectionId) => {
          const enabled = isSectionEnabled(sectionId);
          const isEditing = activeSection === sectionId;
          const label = sectionNames[sectionId] || sectionId;
          const orderIndex = config.sectionOrder.indexOf(sectionId);

          return (
            <Card key={sectionId} size="2" className={`transition-all duration-200 ${enabled ? 'border-indigo-100 shadow-sm' : 'opacity-70 bg-gray-50'}`}>
              <Flex direction="column" gap="3">
                {/* Header Row */}
                <Flex align="center" justify="between">
                  <Flex align="center" gap="3">
                    {/* Reordering Controls */}
                    {orderIndex !== -1 && (
                      <Flex direction="column" gap="1">
                        <IconButton
                          size="1"
                          variant="ghost"
                          color="gray"
                          onClick={() => moveSection(orderIndex, 'UP')}
                          disabled={orderIndex === 0}
                          className="cursor-pointer"
                        >
                          <ArrowUpIcon width="14" height="14" />
                        </IconButton>
                        <IconButton
                          size="1"
                          variant="ghost"
                          color="gray"
                          onClick={() => moveSection(orderIndex, 'DOWN')}
                          disabled={orderIndex === config.sectionOrder.length - 1}
                          className="cursor-pointer"
                        >
                          <ArrowDownIcon width="14" height="14" />
                        </IconButton>
                      </Flex>
                    )}
                    <Box>
                      <Heading size="4" className="font-semibold">{label}</Heading>
                      {orderIndex !== -1 && (
                        <Text size="1" color="indigo" weight="medium">
                          Position #{orderIndex + 1}
                        </Text>
                      )}
                    </Box>
                  </Flex>

                  <Flex align="center" gap="4">
                    <HomepageSectionToggle
                      label={enabled ? 'Active' : 'Disabled'}
                      checked={enabled}
                      onChange={() => toggleSection(sectionId)}
                    />
                    <Button
                      size="2"
                      variant="soft"
                      color="gray"
                      className="cursor-pointer"
                      onClick={() => setActiveSection(isEditing ? null : sectionId)}
                    >
                      {isEditing ? 'Collapse' : 'Edit'}
                      {isEditing ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </Button>
                  </Flex>
                </Flex>

                {/* Expanded editing area */}
                {isEditing && (
                  <Box className="mt-2 pt-4 border-t border-gray-100">
                    {sectionId === 'hero' && (
                      <HeroBannerManager config={config} onChange={setConfig} />
                    )}

                    {sectionId === 'featured' && (
                      <FeaturedProductsManager config={config} onChange={setConfig} products={products} />
                    )}

                    {sectionId === 'topSelling' && (
                      <TopSellingCustomizer config={config} onChange={setConfig} products={products} />
                    )}

                    {sectionId === 'promotional' && (
                      <PromotionalBannersCustomizer config={config} onChange={setConfig} />
                    )}

                    {sectionId === 'newArrivals' && (
                      <NewArrivalsCustomizer config={config} onChange={setConfig} />
                    )}
                  </Box>
                )}
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </Box>
  );
}
