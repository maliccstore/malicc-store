'use client';

import { useEffect, useState } from 'react';
import {
    Button,
    Heading,
    Flex,
} from '@radix-ui/themes';
import Link from 'next/link';
import { PlusIcon } from '@radix-ui/react-icons';
import { adminCategoryAPI } from '@/services/admin/category.admin';
import { AdminCategory } from '@/features/admin/categories/category.types';
import { CategoryTable } from '@/components/admin/categories/CategoryTable';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch categories list
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await adminCategoryAPI.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle delete
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await adminCategoryAPI.delete(id);
            // Refresh list
            fetchCategories();
        } catch (error) {
            alert('Failed to delete category');
            console.error(error);
        }
    };

    return (
        <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
                <Heading size="6">Categories</Heading>
                <Link href="/admin/catalog/categories/new">
                    <Button>
                        <PlusIcon /> New Category
                    </Button>
                </Link>
            </Flex>

            {/* Category Table component */}
            <CategoryTable
                categories={categories}
                loading={loading}
                onDelete={handleDelete}
            />
        </Flex>
    );
}
