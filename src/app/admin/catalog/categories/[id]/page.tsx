'use client';

import { Flex, Heading, Text, IconButton, Box } from '@radix-ui/themes';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use, useCallback } from 'react';
import { adminCategoryAPI } from '@/services/admin/category.admin';
import { CategoryFormValues } from '@/features/admin/categories/category.types';
import CategoryForm from '@/components/admin/categories/CategoryForm';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<CategoryFormValues | undefined>(undefined);

    // Fetch category details
    const fetchCategory = useCallback(async () => {
        try {
            const { data } = await adminCategoryAPI.getById(resolvedParams.id);
            setInitialValues({
                name: data.name,
                slug: data.slug,
                description: data.description || '',
                isActive: data.isActive,
                parentId: data.parentId,
            });
        } catch (error) {
            console.error('Failed to load category:', error);
            alert('Category not found');
            router.push('/admin/catalog/categories');
        } finally {
            setLoading(false);
        }
    }, [resolvedParams.id, router]);

    useEffect(() => {
        if (resolvedParams.id) {
            fetchCategory();
        }
    }, [resolvedParams.id, fetchCategory]);

    // Handle form submission
    const handleSubmit = async (data: CategoryFormValues) => {
        try {
            setIsSubmitting(true);
            await adminCategoryAPI.update(resolvedParams.id, data);
            router.push('/admin/catalog/categories');
        } catch (error) {
            console.error('Failed to update category:', error);
            alert('Failed to update category');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (loading) {
        return <Text>Loading category...</Text>;
    }

    return (
        <Flex direction="column" gap="4" style={{ maxWidth: 800 }}>
            <Flex align="center" gap="3" mb="2">
                <Link href="/admin/catalog/categories">
                    <IconButton variant="ghost" color="gray">
                        <ArrowLeftIcon width="20" height="20" />
                    </IconButton>
                </Link>
                <Box>
                    <Heading size="6">Edit Category</Heading>
                    <Text size="2" color="gray">
                        Update category details
                    </Text>
                </Box>
            </Flex>

            {/* Render category form */}
            {initialValues && (
                <CategoryForm
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    isEditMode={true}
                />
            )}
        </Flex>
    );
}
