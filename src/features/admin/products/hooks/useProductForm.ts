'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AppDispatch } from '@/store';
import { createAdminProduct, updateAdminProduct, deleteAdminProduct } from '@/store/admin/product/productThunks';
import { AdminProduct, ProductFormValues } from '@/features/admin/products/product.types';
import { AdminCategory } from '@/features/admin/categories/category.types';
import { adminCategoryAPI } from '@/services/admin/category.admin';

export function useProductForm(product?: AdminProduct) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const isEdit = !!product;
    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoadingCategories(true);
                const response = await adminCategoryAPI.getAll({ isActive: true });
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                toast.error('Failed to load categories');
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormValues>({
        values: {
            title: product?.name || '',
            description: product?.description || '',
            imageUrl: product?.images?.[0] || '',
            status: product?.status || 'INACTIVE',
            price: product?.price || 0,
            sku: product?.sku || '',
            categoryId: typeof product?.category === 'object' ? product.category.id : product?.category || '',
            inventoryQuantity: product?.inventory?.quantity || 0,
            inventoryAvailable: product?.inventory?.availableQuantity || 0,
        },
    });

    // image url watcher
    const imageUrl = watch('imageUrl');

    // submit product
    const onSubmit = async (data: ProductFormValues) => {
        const payload: Partial<AdminProduct> = {
            name: data.title,
            description: data.description,
            price: Number(data.price),
            status: data.status,
            // Pass categoryId as 'category' because the service expects it
            category: data.categoryId,
            sku: data.sku,
            inventory: {
                quantity: Number(data.inventoryQuantity),
                availableQuantity: Number(data.inventoryAvailable),
            },
            images: data.imageUrl ? [data.imageUrl] : [],
        };

        try {
            if (isEdit && product) {
                await dispatch(updateAdminProduct({ id: product.id, data: payload })).unwrap();
                toast.success('Product updated successfully');
            } else {
                await dispatch(createAdminProduct(payload)).unwrap();
                toast.success('Product created successfully');
            }
            router.push('/admin/catalog/products');
            router.refresh();
        } catch (error) {
            console.error('Failed to save product:', error);
            toast.error('Failed to save product. Please try again.');
        }
    };

    // delete product
    const handleDelete = async () => {
        if (!product || !confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        try {
            await dispatch(deleteAdminProduct(product.id)).unwrap();
            toast.success('Product deleted successfully');
            router.push('/admin/catalog/products');
            router.refresh();
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('Failed to delete product');
        }
    };

    return {
        control,
        handleSubmit,
        errors,
        isSubmitting,
        watch,
        imageUrl,
        categories,
        isLoadingCategories,
        onSubmit,
        handleDelete,
        isEdit,
        router,
    };
}
