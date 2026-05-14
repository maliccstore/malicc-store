import React from 'react';
import { WhatsAppCampaign } from '@/features/admin/marketing/marketing.types';
import CampaignStatusBadge from './CampaignStatusBadge';
import { Table, Text, Box } from '@radix-ui/themes';

interface Props {
  campaigns: WhatsAppCampaign[];
}

export default function WhatsAppCampaignTable({ campaigns }: Props) {
  if (campaigns.length === 0) {
    return (
      <Box className="py-4 text-center">
        <Text color="gray">No campaigns found.</Text>
      </Box>
    );
  }

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Campaign Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Coupon</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Recipients</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Success</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Failed</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {campaigns.map((campaign) => (
          <Table.Row key={campaign.id}>
            <Table.RowHeaderCell>
              <Text weight="medium">{campaign.title}</Text>
            </Table.RowHeaderCell>
            <Table.Cell>
              <Text color="gray">{campaign.messageType}</Text>
            </Table.Cell>
            <Table.Cell>
              <Text weight="bold" color="blue">
                {campaign.couponCode || "--"}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text color="gray">{campaign.totalRecipients}</Text>
            </Table.Cell>
            <Table.Cell>
              <Text color="green" weight="bold">
                {campaign.successfulCount}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text color="red" weight="bold">
                {campaign.failedCount}
              </Text>
            </Table.Cell>
            <Table.Cell>
              <CampaignStatusBadge status={campaign.status} />
            </Table.Cell>
            <Table.Cell>
              <Text color="gray">
                {new Date(parseInt(campaign.createdAt) || campaign.createdAt).toLocaleString()}
              </Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
