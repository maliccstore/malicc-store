'use client';

import ProductForm from '@/components/admin/products/ProductForm';
import { useProductForm } from '@/features/admin/products/hooks/useProductForm';

export default function NewProductPage() {
    const productFormProps = useProductForm();

    return (
        <ProductForm
            {...productFormProps}
            onDiscard={() => productFormProps.router.back()}
        />
    );
}
