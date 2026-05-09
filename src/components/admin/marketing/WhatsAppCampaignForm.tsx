"use client";

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminUsers } from '@/store/admin/users/userThunks';
import { fetchAdminProducts } from '@/store/admin/product/productThunks';
import { sendPromotionalWhatsApp, sendProductAnnouncement } from '@/store/admin/marketing/marketingThunks';
import { Box, Flex, Grid, Text, Heading, Button, TextField, Select, Checkbox, TextArea, Card, ScrollArea } from '@radix-ui/themes';

export default function WhatsAppCampaignForm() {
  const dispatch = useAppDispatch();
  const { list: users } = useAppSelector((state) => state.adminUsers);
  const { list: products } = useAppSelector((state) => state.adminProducts);
  const { sendStatus } = useAppSelector((state) => state.adminMarketing);

  const [campaignType, setCampaignType] = useState('PROMOTIONAL');
  const [title, setTitle] = useState('');
  const [templateName, setTemplateName] = useState('hello_world');
  const [targetAll, setTargetAll] = useState<boolean | 'indeterminate'>(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Promotional Fields
  const [headline, setHeadline] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  // Product Fields
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (campaignType === 'PROMOTIONAL') {
      dispatch(sendPromotionalWhatsApp({
        title,
        templateName,
        targetAll: targetAll === true,
        customerIds: targetAll === true ? undefined : selectedUsers,
      }));
    } else {
      if (!selectedProduct) return alert('Please select a product');
      dispatch(sendProductAnnouncement({
        title,
        templateName,
        productId: selectedProduct,
        headline,
        targetAll: targetAll === true,
        customerIds: targetAll === true ? undefined : selectedUsers,
      }));
    }
  };

  return (
    <Card size="4" className="bg-white">
      <form onSubmit={handleSubmit}>
        <Box mb="6">
          <Heading size="5">Create WhatsApp Campaign</Heading>
          <Text color="gray" size="2">Configure your bulk message targeting and content.</Text>
        </Box>

        <Grid columns={{ initial: '1', sm: '2' }} gap="4">
          <Box className="sm:col-span-2">
            <Text as="label" size="2" weight="bold" mb="1" className="block">Campaign Type</Text>
            <Select.Root value={campaignType} onValueChange={setCampaignType}>
              <Select.Trigger className="w-full" />
              <Select.Content>
                <Select.Item value="PROMOTIONAL">Promotional Offer</Select.Item>
                <Select.Item value="NEW_PRODUCT">New Product Announcement</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>

          <Box>
            <Text as="label" size="2" weight="bold" mb="1" className="block">Campaign Title</Text>
            <TextField.Root
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Sale"
            />
          </Box>

          <Box>
            <Text as="label" size="2" weight="bold" mb="1" className="block">Meta Template Name</Text>
            <TextField.Root
              required
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. hello_world"
            />
          </Box>

          {/* Dynamic Fields */}
          {campaignType === 'PROMOTIONAL' ? (
            <>
              <Box className="sm:col-span-2">
                <Text as="label" size="2" weight="bold" mb="1" className="block">Headline</Text>
                <TextField.Root
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Catchy headline here"
                />
              </Box>
              <Box className="sm:col-span-2">
                <Text as="label" size="2" weight="bold" mb="1" className="block">Offer Message</Text>
                <TextArea
                  rows={3}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="Details of your promotion"
                />
              </Box>
            </>
          ) : (
            <>
              <Box>
                <Text as="label" size="2" weight="bold" mb="1" className="block">Select Product</Text>
                <Select.Root value={selectedProduct || undefined} onValueChange={setSelectedProduct}>
                  <Select.Trigger className="w-full" placeholder="-- Choose Product --" />
                  <Select.Content>
                    {products.map((p) => (
                      <Select.Item key={p.id} value={p.id}>{p.name}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
              <Box>
                <Text as="label" size="2" weight="bold" mb="1" className="block">Headline</Text>
                <TextField.Root
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Introducing our new product"
                />
              </Box>
            </>
          )}

          <Box className="sm:col-span-2" mt="4" pt="4" style={{ borderTop: '1px solid var(--gray-5)' }}>
            <Text as="label" size="2" weight="bold" mb="2" className="block">Target Audience</Text>
            <Flex align="center" gap="2" mb="4">
              <Checkbox
                checked={targetAll}
                onCheckedChange={setTargetAll}
              />
              <Text size="2">Send to ALL customers</Text>
            </Flex>

            {targetAll !== true && (
              <Box mt="4">
                <Text as="label" size="2" weight="bold" mb="2" className="block">Select Specific Customers</Text>
                <Card variant="surface" className="p-2">
                  <ScrollArea type="always" scrollbars="vertical" style={{ height: 180 }}>
                    <Flex direction="column" gap="1">
                      {users.map((u) => {
                        const userId = Number(u.id);
                        const isChecked = selectedUsers.includes(userId);
                        return (
                          <Flex key={u.id} align="center" gap="2" p="1" className="hover:bg-gray-50 rounded">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUsers([...selectedUsers, userId]);
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== userId));
                                }
                              }}
                            />
                            <Text size="2" style={{ cursor: 'pointer', flex: 1 }}>
                              {u.username || 'Unknown User'} <Text color="gray" size="1" ml="1">({u.phoneNumber})</Text>
                            </Text>
                          </Flex>
                        );
                      })}
                      {users.length === 0 && (
                        <Text size="2" color="gray" align="center" className="p-2">No customers found.</Text>
                      )}
                    </Flex>
                  </ScrollArea>
                </Card>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Campaign Preview Box */}
        <Box mt="6">
          <Text as="div" size="2" weight="bold" mb="2">Campaign Preview</Text>
          <Card variant="surface" className="bg-white">
            <Box p="3">
              <Text size="2" style={{ whiteSpace: 'pre-wrap', fontFamily: 'sans-serif' }}>
                {campaignType === 'PROMOTIONAL' ? (
                  <>
                    <strong>{headline || '[Headline]'}</strong><br /><br />
                    {offerMessage || '[Your offer message will appear here.]'}<br /><br />
                    <em style={{ color: 'var(--gray-9)', fontSize: '0.75rem' }}>To unsubscribe, reply STOP</em>
                  </>
                ) : (
                  <>
                    <strong>{headline || '[New Product Headline]'}</strong><br /><br />
                    Check out our new product: <strong>{products.find(p => p.id === selectedProduct)?.name || '[Product Name]'}</strong>!<br /><br />
                    <em style={{ color: 'var(--gray-9)', fontSize: '0.75rem' }}>To unsubscribe, reply STOP</em>
                  </>
                )}
              </Text>
            </Box>
          </Card>
        </Box>

        <Flex justify="end" mt="5">
          <Button
            type="submit"
            disabled={sendStatus === 'loading'}
            variant="solid"
            color="gray"
            highContrast
          >
            {sendStatus === 'loading' ? 'Sending...' : 'Send Campaign'}
          </Button>
        </Flex>
      </form>
    </Card>
  );
}
