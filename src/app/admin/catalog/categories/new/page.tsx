'use client';

import { Flex, Heading, Text, IconButton, Box } from '@radix-ui/themes';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { adminCategoryAPI } from '@/services/admin/category.admin';
import { CategoryFormValues } from '@/features/admin/categories/category.types';
import CategoryForm from '@/components/admin/categories/CategoryForm';

export default function NewCategoryPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: CategoryFormValues) => {
        try {
            setIsSubmitting(true);
            await adminCategoryAPI.create(data);
            router.push('/admin/catalog/categories');
        } catch (error) {
            console.error('Failed to create category:', error);
            alert('Failed to create category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Flex direction="column" gap="4" style={{ maxWidth: 800 }}>
            <Flex align="center" gap="3" mb="2">
                <Link href="/admin/catalog/categories">
                    <IconButton variant="ghost" color="gray">
                        <ArrowLeftIcon width="20" height="20" />
                    </IconButton>
                </Link>
                <Box>
                    <Heading size="6">Create New Category</Heading>
                    <Text size="2" color="gray">
                        Add a new product category to your catalog
                    </Text>
                </Box>
            </Flex>

            <CategoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </Flex>
    );
}
