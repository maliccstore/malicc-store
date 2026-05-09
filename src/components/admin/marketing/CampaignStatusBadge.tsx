import React from 'react';
import { Badge } from '@radix-ui/themes';

interface Props {
  status: string;
}

export default function CampaignStatusBadge({ status }: Props) {
  const label = status;
  let color: 'gray' | 'blue' | 'green' | 'red' = 'gray';

  switch (status.toUpperCase()) {
    case 'DRAFT':
      color = 'gray';
      break;
    case 'SENDING':
      color = 'blue';
      break;
    case 'COMPLETED':
      color = 'green';
      break;
    case 'FAILED':
      color = 'red';
      break;
    default:
      color = 'gray';
      break;
  }

  return (
    <Badge color={color} variant="soft" radius="full">
      {label}
    </Badge>
  );
}
