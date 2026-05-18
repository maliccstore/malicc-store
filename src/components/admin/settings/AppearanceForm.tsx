'use client';

import { useState, useEffect } from 'react';
import { Box, Button, TextField, Grid, Text, Flex, Slider, Select } from '@radix-ui/themes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateAppearance, fetchAppearance } from '@/store/admin/settings/appearanceThunks';
import toast from 'react-hot-toast';
import LogoUploader from './LogoUploader';
import AdaptiveLogo from '@/components/ui/AdaptiveLogo';

export default function AppearanceForm() {
  const dispatch = useAppDispatch();
  const { settings, loading } = useAppSelector((state) => state.adminAppearance);
  
  const [storeName, setStoreName] = useState('');
  const [tagline, setTagline] = useState('');
  const [logoWidth, setLogoWidth] = useState<number>(40);
  const [logoPosition, setLogoPosition] = useState<'left' | 'center' | 'right'>('left');

  useEffect(() => {
    dispatch(fetchAppearance());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setStoreName(settings.store_name || '');
      setTagline(settings.tagline || '');
      setLogoWidth(settings.logo_width || 40);
      setLogoPosition(settings.logo_position || 'left');
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await dispatch(
        updateAppearance({
          store_name: storeName,
          tagline: tagline,
          logo_width: logoWidth,
          logo_position: logoPosition,
        })
      ).unwrap();
      toast.success('Appearance settings saved successfully');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to save appearance settings');
    }
  };

  return (
    <Box style={{ maxWidth: '32rem' }} className="space-y-6">
      {/* Live Preview */}
      <Box mb="6" p="4" style={{ border: '1px dashed var(--gray-5)', borderRadius: 'var(--radius-3)' }}>
        <Text size="2" color="gray" mb="3" as="p">Live Logo Preview:</Text>
        <Flex 
          align="center" 
          gap="3"
          direction={
            logoPosition === 'right' ? 'row-reverse' : 
            logoPosition === 'center' ? 'column' : 
            'row'
          }
          style={{ textAlign: logoPosition === 'center' ? 'center' : 'left' }}
        >
          <AdaptiveLogo previewWidth={logoWidth} />
          <Box>
            {storeName && <Text weight="bold" size="3" as="div">{storeName}</Text>}
            {tagline && <Text color="gray" size="1" as="div">{tagline}</Text>}
          </Box>
        </Flex>
      </Box>

      {/* Logo Uploader */}
      <Box mb="6">
        <Text as="label" size="2" weight="medium" mb="2" className="block">
          Store Logo
        </Text>
        <LogoUploader />
      </Box>

      <Grid columns="1" gap="4">
        <Box>
          <Text as="label" size="2" weight="medium" mb="1" className="block">
            Store Name
          </Text>
          <TextField.Root
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="e.g. Malicc Store"
          />
        </Box>

        <Box>
          <Text as="label" size="2" weight="medium" mb="1" className="block">
            Tagline
          </Text>
          <TextField.Root
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. The best store in the world"
          />
        </Box>

        <Box>
          <Text as="label" size="2" weight="medium" mb="1" className="block">
            Logo Width ({logoWidth}px)
          </Text>
          <Slider
            value={[logoWidth]}
            onValueChange={(val) => setLogoWidth(val[0])}
            min={20}
            max={200}
            step={1}
          />
        </Box>

        <Box>
          <Text as="label" size="2" weight="medium" mb="1" className="block">
            Logo Position
          </Text>
          <Select.Root value={logoPosition} onValueChange={(val: 'left' | 'center' | 'right') => setLogoPosition(val)}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="left">Left</Select.Item>
              <Select.Item value="center">Center</Select.Item>
              <Select.Item value="right">Right</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>
      </Grid>

      <Flex justify="end" mt="4">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Appearance'}
        </Button>
      </Flex>
    </Box>
  );
}
