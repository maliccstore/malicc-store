'use client';

import { Address } from '@/types/address';
import { Card, Text, Badge, RadioGroup, Flex, Box, Grid } from '@radix-ui/themes';
import { Button } from '@/components/ui/Button';
import { MapPin, Plus } from 'lucide-react';
import Link from 'next/link';

interface AddressSelectionProps {
    addresses: Address[];
    selectedAddressId: string | null;
    onSelect: (id: string) => void;
    onConfirm: () => void;
}

export function AddressSelection({
    addresses,
    selectedAddressId,
    onSelect,
    onConfirm,
}: AddressSelectionProps) {
    return (
        <Flex direction="column" gap="6">
            <Flex justify="between" align="center" mb="4">
                <Flex align="center" gap="2">
                    <MapPin className="text-blue-600" size={20} />
                    <Text size="4" weight="bold">Select Delivery Address</Text>
                </Flex>
                <Link href="/address?redirect=checkout">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Plus size={16} />
                        Add New Address
                    </Button>
                </Link>
            </Flex>

            <RadioGroup.Root
                value={selectedAddressId || ''}
                onValueChange={onSelect}
            >
                <Grid columns="1" gap="4">
                    {addresses.map((address) => (
                        <Card
                            key={address.id}
                            className={`p-4 cursor-pointer transition-all border-2 ${selectedAddressId === address.id
                                ? 'border-blue-500 bg-blue-50/30'
                                : 'border-transparent hover:border-gray-200'
                                }`}
                            onClick={() => onSelect(address.id)}
                        >
                            <Flex gap="3" align="start">
                                <RadioGroup.Item value={address.id} />
                                <Flex direction="column" gap="1" flexGrow="1">
                                    <Flex align="center" gap="2" justify="between">
                                        <Text weight="bold" size="3">{address.fullName}</Text>
                                        {address.isDefault && <Badge color="green">Default</Badge>}
                                    </Flex>
                                    <Text as="p" size="2" color="gray">
                                        {address.addressLine1}
                                        {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                                    </Text>
                                    <Text as="p" size="2" color="gray">
                                        {address.city}, {address.state} - {address.postalCode}
                                    </Text>
                                    <Box mt="2">
                                        <Text as="p" size="2" color="gray">
                                            Phone: {address.phoneNumber}
                                        </Text>
                                    </Box>
                                </Flex>
                            </Flex>
                        </Card>
                    ))}
                </Grid>
            </RadioGroup.Root>

            <Button
                disabled={!selectedAddressId}
                onClick={onConfirm}
            >
                Deliver Here
            </Button>
        </Flex>
    );
}
