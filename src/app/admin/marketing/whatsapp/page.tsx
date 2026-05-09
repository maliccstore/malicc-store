"use client";

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchWhatsAppCampaigns } from '@/store/admin/marketing/marketingThunks';
import WhatsAppCampaignForm from '@/components/admin/marketing/WhatsAppCampaignForm';
import WhatsAppCampaignTable from '@/components/admin/marketing/WhatsAppCampaignTable';
import { resetSendStatus } from '@/store/admin/marketing/marketingSlice';
import { toast, Toaster } from 'react-hot-toast';
import { Box, Flex, Heading, Text, Button, Spinner, Container } from '@radix-ui/themes';
import { PlusIcon, ListBulletIcon } from '@radix-ui/react-icons';

export default function WhatsAppCampaignsPage() {
  const dispatch = useAppDispatch();
  const { campaigns, loading, sendStatus, error } = useAppSelector((state) => state.adminMarketing);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchWhatsAppCampaigns());
  }, [dispatch]);

  useEffect(() => {
    if (sendStatus === 'success') {
      toast.success('Campaign launched successfully!');
      setShowForm(false);
      dispatch(resetSendStatus());
    } else if (sendStatus === 'error') {
      toast.error(error || 'Failed to launch campaign');
      dispatch(resetSendStatus());
    }
  }, [sendStatus, error, dispatch]);

  return (
    <Container size="4" p="4">
      <Toaster position="top-right" />
      
      <Flex direction={{ initial: 'column', sm: 'row' }} justify="between" align={{ initial: 'start', sm: 'center' }} mb="6" gap="4">
        <Box>
          <Heading size="6">WhatsApp Campaigns</Heading>
          <Text color="gray" size="2">
            Manage your marketing messages and product announcements.
          </Text>
        </Box>

        <Button
          onClick={() => setShowForm(!showForm)}
          variant="solid"
          color="gray"
          highContrast
        >
          {showForm ? <ListBulletIcon /> : <PlusIcon />}
          {showForm ? 'View Campaigns' : 'New Campaign'}
        </Button>
      </Flex>

      {showForm ? (
        <WhatsAppCampaignForm />
      ) : (
        <Box mt="6">
          {loading ? (
            <Flex justify="center" align="center" py="9">
              <Spinner size="3" />
            </Flex>
          ) : (
            <WhatsAppCampaignTable campaigns={campaigns} />
          )}
        </Box>
      )}
    </Container>
  );
}
